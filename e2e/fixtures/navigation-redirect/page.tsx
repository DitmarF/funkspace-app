import { redirect } from "next/navigation";
/** Server-only fixture copied over /about in an isolated test build. */
export default function RedirectFixture() {
  redirect("/#contact");
}
