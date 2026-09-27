import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createPortfolioNavigationHandoff } from "./PortfolioNavigationHandoff";

let frames: Map<number, FrameRequestCallback>;
let frameID: number;
const markup =
  '<main id="main-content" tabindex="-1"><a href="/about">Earlier</a><section id="contact" tabindex="-1"><a id="email" href="mailto:test@example.test">Email</a></section></main>';
const contact = { href: "/#contact", focusId: "contact" };
function arrive(url = "/#contact") {
  history.replaceState(null, "", url);
  document.body.innerHTML = markup;
  return document.getElementById("main-content")!;
}
function flush() {
  const work = [...frames.values()];
  frames.clear();
  work.forEach((f) => f(0));
}
beforeEach(() => {
  frames = new Map();
  frameID = 0;
  arrive("/privacy");
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((f) => {
    frames.set(++frameID, f);
    return frameID;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    frames.delete(id);
  });
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(
    function (this: HTMLElement) {
      return Object.assign(this.hidden ? [] : [new DOMRect(0, 0, 100, 100)], {
        item: () => null,
      });
    },
  );
  HTMLElement.prototype.scrollIntoView = vi.fn();
  const query = document.querySelector.bind(document);
  vi.spyOn(document, "querySelector").mockImplementation((selector) =>
    query(selector === "dialog:modal" ? "dialog[open]" : selector),
  );
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

it.each(["release-first", "arrival-first"])(
  "waits for both readiness signals: %s",
  (order) => {
    const h = createPortfolioNavigationHandoff();
    const ticket = h.begin(contact);
    if (order === "release-first") h.released(ticket.id);
    const main = arrive();
    h.arrived(main);
    if (order === "arrival-first") {
      flush();
      expect(document.activeElement).toBe(document.body);
      h.released(ticket.id);
    }
    flush();
    expect(document.activeElement?.id).toBe("contact");
    expect(HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();
  },
);
it.each(["dismissed", "redirected"])(
  "preserves actual fragment focus after %s",
  (action) => {
    const h = createPortfolioNavigationHandoff();
    const t = h.begin(
      action === "redirected"
        ? { href: "/about", focusId: "main-content" }
        : contact,
    );
    if (action === "dismissed") h.cancelPreferred(t.id);
    h.released(t.id);
    h.arrived(arrive());
    const node = document.getElementById("contact")!;
    node.focus();
    const focus = vi.spyOn(node, "focus");
    flush();
    expect(document.activeElement).toBe(node);
    expect(focus).not.toHaveBeenCalled();
  },
);
it("uses incoming main on redirect without a fragment, never the cancelled ID", () => {
  const h = createPortfolioNavigationHandoff();
  const t = h.begin(contact);
  h.cancelPreferred();
  h.released(t.id);
  const main = arrive("/about");
  h.arrived(main);
  flush();
  expect(document.activeElement).toBe(main);
});
it("performs explicit repeated-hash reveal and focus before a frame", () => {
  arrive("/#contact");
  const h = createPortfolioNavigationHandoff();
  for (let i = 0; i < 2; i++) {
    document.getElementById("main-content")!.focus();
    const t = h.begin(contact);
    expect(t.kind).toBe("same-document");
    h.released(t.id);
    expect(document.activeElement?.id).toBe("contact");
    flush();
  }
  expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
});
it("rejects an old release/cancel, cancels destination input and never crosses a new modal", () => {
  const h = createPortfolioNavigationHandoff();
  const old = h.begin(contact);
  const t = h.begin(contact);
  h.released(old.id);
  h.cancel(old.id);
  h.arrived(arrive());
  flush();
  expect(document.activeElement).toBe(document.body);
  h.released(t.id);
  const stale = [...frames.values()][0];
  const stop = h.observeDeparture(vi.fn());
  document.getElementById("email")!.focus();
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
  stale(0);
  expect(document.activeElement?.id).toBe("email");
  stop();
  arrive("/privacy");
  const newer = h.begin(contact);
  h.released(newer.id);
  h.arrived(arrive());
  const modal = document.createElement("dialog");
  modal.open = true;
  document.body.append(modal);
  flush();
  expect(document.activeElement).toBe(document.body);
});
it("downgrades source input, discards history work, and balances ten subscriptions", () => {
  const h = createPortfolioNavigationHandoff();
  const add = vi.spyOn(window, "addEventListener");
  const remove = vi.spyOn(window, "removeEventListener");
  for (let i = 0; i < 10; i++) {
    const notify = vi.fn();
    const stop = h.observeDeparture(notify);
    const t = h.begin(contact);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    h.released(t.id);
    h.arrived(arrive());
    window.dispatchEvent(new PopStateEvent("popstate"));
    flush();
    expect(document.activeElement).toBe(document.body);
    expect(notify).toHaveBeenCalledWith("history");
    stop();
    arrive("/privacy");
  }
  expect(add).toHaveBeenCalledTimes(40);
  expect(remove).toHaveBeenCalledTimes(40);
});
it("consumes missing targets without polling and supports reusable root cleanup", () => {
  const h = createPortfolioNavigationHandoff();
  const t = h.begin(contact);
  h.released(t.id);
  const main = arrive("/#missing");
  h.arrived(main);
  flush();
  expect(document.activeElement).toBe(main);
  expect(frames.size).toBe(0);
  h.cancel();
  arrive("/privacy");
  const next = h.begin(contact);
  h.released(next.id);
  h.arrived(arrive());
  flush();
  expect(document.activeElement?.id).toBe("contact");
});

it("leaves the first changed-hash scroll to Next so history can capture departure", () => {
  arrive("/#start");
  const h = createPortfolioNavigationHandoff();
  const t = h.begin(contact);
  h.released(t.id);
  expect(HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();
  expect(document.activeElement?.id).toBe("contact");
  flush();
});

it.each([
  ["/?utm_source=review", "/#contact", "contact"],
  ["/about?ref=review", "/about", "main-content"],
  ["/privacy?ref=review", "/privacy", "main-content"],
  ["/impressum?ref=review", "/impressum", "main-content"],
])(
  "hands off query removal without waiting for a new owner: %s",
  (source, href, focusId) => {
    const main = arrive(source);
    const h = createPortfolioNavigationHandoff();
    const ticket = h.begin({ href, focusId });
    expect(ticket.kind).toBe("same-document");
    h.released(ticket.id);
    expect(document.activeElement?.id).toBe(focusId);
    expect(HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();
    // The actual Next query commit changes the URL, not this page's main owner.
    history.replaceState(null, "", href);
    flush();
    expect(document.getElementById("main-content")).toBe(main);
    expect(document.activeElement?.id).toBe(focusId);
    expect(HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();
  },
);
