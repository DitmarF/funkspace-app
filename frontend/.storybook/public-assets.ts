import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

type PublicWatcher = {
  add(path: string): unknown;
  on(event: "all", listener: (event: string, path: string) => void): unknown;
  off(event: "all", listener: (event: string, path: string) => void): unknown;
};

/** Keep addon-generated files out of Next's public assets, including in dev. */
export function prepareStorybookPublic(sourceDirectory: string) {
  const sourcePublic = resolve(sourceDirectory);
  const temporaryPublic = mkdtempSync(
    join(tmpdir(), "funkspace-storybook-public-"),
  );
  const generatedName = "design-tokens.source.json";
  const copyPublic = () =>
    cpSync(sourcePublic, temporaryPublic, {
      recursive: true,
      filter: (source) => source !== join(sourcePublic, generatedName),
    });
  let detachWatcher = () => {};
  const cleanup = () => {
    detachWatcher();
    rmSync(temporaryPublic, { recursive: true, force: true });
    process.off("exit", cleanup);
  };
  process.once("exit", cleanup);
  try {
    copyPublic();
  } catch (error) {
    cleanup();
    throw error;
  }

  return {
    publicDir: temporaryPublic,
    plugin: {
      name: "isolate-storybook-public",
      configureServer(server: {
        watcher: PublicWatcher;
        config: { logger: { warn(message: string): void } };
      }) {
        const sync = (event: string, changedPath: string) => {
          const source = resolve(changedPath);
          const local = relative(sourcePublic, source);
          if (
            !local ||
            local === ".." ||
            local.startsWith(".." + sep) ||
            isAbsolute(local) ||
            local === generatedName
          )
            return;
          const destination = join(temporaryPublic, local);
          try {
            // Never write through a copied directory symlink. It could still
            // point at an old target when the source link is being retargeted.
            let ancestor = temporaryPublic;
            for (const part of local.split(sep).slice(0, -1)) {
              ancestor = join(ancestor, part);
              try {
                if (lstatSync(ancestor).isSymbolicLink()) {
                  // Re-copy the link (or replacement directory) itself. Do
                  // not write the changed child through the stale target.
                  const sourceAncestor = join(
                    sourcePublic,
                    relative(temporaryPublic, ancestor),
                  );
                  try {
                    lstatSync(sourceAncestor);
                  } catch (error) {
                    if ((error as NodeJS.ErrnoException).code !== "ENOENT")
                      throw error;
                    rmSync(ancestor, { force: true });
                    return;
                  }
                  rmSync(ancestor, { force: true });
                  cpSync(sourceAncestor, ancestor, {
                    recursive: true,
                    force: true,
                  });
                  return;
                }
              } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== "ENOENT")
                  throw error;
                break;
              }
            }
            if (event === "unlink" || event === "unlinkDir") {
              rmSync(destination, { recursive: true, force: true });
            } else if (event === "addDir") {
              try {
                if (lstatSync(destination).isSymbolicLink()) return;
              } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== "ENOENT")
                  throw error;
              }
              mkdirSync(destination, { recursive: true });
            } else if (event === "add" || event === "change") {
              mkdirSync(dirname(destination), { recursive: true });
              try {
                if (lstatSync(destination).isSymbolicLink())
                  rmSync(destination, { force: true });
              } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== "ENOENT")
                  throw error;
              }
              cpSync(source, destination, { force: true });
            }
          } catch (error) {
            server.config.logger.warn(
              `Unable to sync Storybook public asset ${local}: ${String(error)}`,
            );
          }
        };
        server.watcher.on("all", sync);
        detachWatcher = () => server.watcher.off("all", sync);
        server.watcher.add(sourcePublic);
        // Reconcile changes made between the initial copy and watcher setup.
        // The addon owns its generated JSON, so preserve that temporary file.
        const generated = join(temporaryPublic, generatedName);
        const data = existsSync(generated)
          ? readFileSync(generated)
          : undefined;
        rmSync(temporaryPublic, { recursive: true, force: true });
        mkdirSync(temporaryPublic, { recursive: true });
        copyPublic();
        if (data !== undefined) writeFileSync(generated, data);
      },
      closeBundle: cleanup,
    },
  };
}
