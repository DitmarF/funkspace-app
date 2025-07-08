Great — I’ll write a beginner-friendly `CONTRIBUTING.md` styled like the feature dev guide, with links to the README and Playbook rather than full command dumps. It will include trunk-based Git flow, branch naming, Codex usage, and how to trigger CI/deployments. I’ll get started and let you know when it’s ready for review.

# Contributing to FunkSpace

_Guide for new contributors (junior developers)_

## 0. Prerequisites & Setup

Before you start, make sure you have the following tools installed:

| Tool                            | Minimum Version | Description                           |
| ------------------------------- | --------------- | ------------------------------------- |
| **Git**                         | 2.40+           | Version control                       |
| **Node.js**                     | 22.13.1+        | JavaScript runtime                    |
| **pnpm**                        | 10+             | Package manager (instead of npm/Yarn) |
| **GitHub CLI** (`gh`, optional) | 2.5+            | For creating PRs from terminal        |

> **Setup:** If you’re an external contributor, first **fork** this repository (if internal, accept the invite to the repo). Clone your fork to your machine (ensure your SSH key is added to GitHub for easy access). Then, in the project directory, run `pnpm install -r` to install all dependencies in this monorepo (the `-r` flag installs every workspace). See the [README.md](README.md) for more details on setting up the project and using `pnpm`. After installing, you can run `pnpm dev` to start the development server locally.

## 1. Branching Strategy (Trunk-Based Git Flow)

We use a **trunk-based development** workflow: the `main` branch is the stable trunk where all changes get merged. **Never commit directly to** `main`. Instead, always create a _feature branch_ for your work and use Pull Requests to merge into `main`. This keeps `main` history linear and clean.

1. **Update main:** Before starting work, always synchronize your local `main` with the remote. For example:

   ```bash
   git switch main
   git pull --ff-only
   ```

   This fetches the latest changes. We require fast-forward pulls on `main` (no merge commits), so if your local main has diverged, Git will warn you. (If you see “not possible to fast-forward” errors, you may need to rebase or reset – see the DevOps Playbook for guidance on fixing divergent branches.)

2. **Create a feature branch:** Branch off `main` for your work. Use a descriptive branch name following our conventions:

   ```bash
   git switch -c feature/<short-descriptive-name>
   ```

   Our branch naming rules:

   | **Prefix** | **Use for...**          | **Example**                 |
   | ---------- | ----------------------- | --------------------------- |
   | `feature/` | new feature development | `feature/landing-animation` |
   | `bugfix/`  | bug fixes               | `bugfix/login-redirect`     |
   | `docs/`    | documentation updates   | `docs/readme-typo`          |

   Choose a short slug that summarizes the work (e.g. `feature/user-auth` for adding authentication).

3. **Local development:** Ensure you have a running dev environment on your feature branch. For the first run, copy the sample env file:

   ```bash
   cp .env.example .env.local   # create local env config (if applicable)
   pnpm dev                     # start Next.js dev server (with hot-reload)
   pnpm test                    # run unit tests (Vitest)
   pnpm lint                    # run linter and format check (ESLint + Prettier)
   ```

   Keep the `pnpm dev` server running as you work (open [http://localhost:3000](http://localhost:3000) to see the app). Make sure `pnpm test` and `pnpm lint` pass to catch issues early. This project uses **Vitest** for unit tests and **Playwright** for end-to-end tests, and all code must meet our linting rules (ESLint/Prettier). See the DevOps Playbook for more about our testing and lint setup.

   > **AI Assistant:** Feel free to leverage our AI tooling during development. We recommend using the **OpenAI Codex CLI** (an AI coding assistant) to help generate boilerplate code or even suggest commit message text. It’s a helpful way to speed up development and ensure consistent style – just remember to review and polish any AI-generated code or messages before committing.

## 2. Making Commits (Conventional Commits & Sign-off)

Commit your work **early and often**. Small, frequent commits make it easier to review changes and find issues. Please follow the **Conventional Commits** style for your commit messages, as it helps with readability and automating release notes. For example:

- **Features:** Use `feat: ...` prefix (e.g. `feat: add particle sandbox component`)
- **Bug Fixes:** Use `fix: ...` prefix (e.g. `fix: null check in animation loop`)
- **Documentation:** Use `docs: ...` for docs-only changes (e.g. `docs: update README installation section`)

Other prefixes like `refactor:`, `chore:`, `test:` etc. can be used when appropriate. The scope part (in parentheses) is optional. Aim for a concise message in the imperative mood (what the commit _does_).

When committing, **sign off** your commits. We require signed commits in this repo (for DCO and security reasons). You can sign off by adding the `-s` flag to your commit command, which will add a "Signed-off-by" line. For example:

```bash
git add -p              # interactively stage changes
git commit -s -m "feat: implement new animation engine"
```

The `-s` flag will sign off the commit under your name. _(Make sure you’ve configured GPG or SSH key signing in Git so that your commits show as “Verified” on GitHub. If you haven’t, see the DevOps Playbook or GitHub docs for how to set up commit signing.)_ Each commit should ideally pass the tests and linter—if a commit breaks the build or style checks, consider fixing it in that commit or squashing fixes before merging.

## 3. Keep Your Branch Updated (Rebase on `main`)

While working on your feature branch, regularly pull in the latest changes from `main` to avoid drift. We recommend **rebasing** your feature branch onto the up-to-date `main`:

```bash
git fetch origin
git rebase origin/main
```

This reapplies your commits on top of current `main` (trunk) history. This keeps the history linear and makes merging easier. If conflicts occur during rebase, Git will pause and let you fix them. Resolve any conflicts in your files, `git add` those files, then run `git rebase --continue` to finish rebasing. (If you’re unsure how to resolve a merge conflict or encounter a complex rebase, don’t hesitate to ask for help or consult the Playbook’s section on rebasing.)

After rebasing or making significant changes, rerun `pnpm test` and `pnpm lint` to ensure everything still passes.

## 4. Push Your Branch & Open a Pull Request

When your commits are ready to review, push your feature branch to the remote repository on GitHub:

```bash
git push -u origin feature/<your-branch-name>
```

The first push with `-u` sets the upstream tracking. If you’ve rebased or rewritten history, you may need to force push updates. **Use the safer force push:** `git push --force-with-lease` (this ensures you don’t overwrite others’ work on the remote).

Now [open a Pull Request](https://docs.github.com/pull-requests) (PR) from your branch into the `main` branch. You can do this via the GitHub website or using the GitHub CLI (`gh pr create ...`). In the PR:

- **Title:** Use a concise title that follows Conventional Commit style (e.g. start with `feat:`, `fix:` as appropriate). This will become the commit message when we squash-merge.

- **Description:** Provide context about **Why** you made the change and **What** you did. Include any relevant details or screenshots. If possible, follow a structure like:
  - **Why** – the problem or motivation for the change
  - **What** – a summary of the solution
  - **How** – key technical details or how to test the changes

- **Link issues:** If your change fixes an open issue, link it by number (e.g., _“Closes #123”_ will automatically close issue #123 when merged).

- **Labels and reviewers:** Add any relevant labels (e.g. `feature`, `bugfix`, `docs`) to the PR. Also, assign at least one reviewer (for example, a senior dev or maintainer) to start the code review process.

## 5. Collaborate: CI Checks & Code Review

Once you open a PR, **Continuous Integration (CI)** checks will run automatically via GitHub Actions. Our CI pipeline will lint the code, run the test suite (Vitest unit tests and Playwright E2E tests), and build the project. Wait for all checks to turn 🟢 **green** before merging. If a check fails (🔴 red), click “Details” to see what went wrong (often a failing test or a linter error) and push a fix commit to your branch to re-run the checks.

Meanwhile, reviewers will provide feedback or request changes. GitHub will notify you of review comments. Respond to each comment — you can discuss the suggestion and then make code changes as needed. Push new commits addressing the feedback. It’s fine to have multiple commits; you can always squash them later if needed. If you push new changes, consider **re-requesting** review from the reviewers (GitHub might do this automatically when you address comments).

Throughout the review process, keep your branch up-to-date with `main` (rebasing if other PRs have merged) so your PR is easy to merge and doesn’t fall behind. Continuous communication with your reviewers is key; don’t hesitate to ask questions or clarifications on feedback.

## 6. Merge Guidelines (Squash or Rebase, No Merge Commits)

After you’ve received approval from reviewers and all CI checks are passing, it’s time to merge your work into `main`. We enforce a linear history on `main`, so **do not use** the default “merge commit” option. Instead, choose **“Squash & Merge”** or **“Rebase & Merge”** for the Pull Request:

- **Squash & Merge** – This is the default for feature branches with multiple WIP commits. It will combine all your commits into one neat commit on `main` (using the PR title and description for the commit message). This keeps the history clean.
- **Rebase & Merge** – If your commits are already well-structured and you want to preserve them individually, you can rebase-merge (this fast-forwards `main` to include each of your commits without a merge commit). Ensure your branch was rebased on the latest `main` before doing this.

> **Note:** The repository’s branch protection settings require all merges to be fast-forward (no merge commits), so only squash or rebase merges are allowed. Direct pushes to `main` are disabled.

When merging the PR in GitHub, also check the option to **“Delete branch after merge”** (GitHub usually does this by default for you). This helps keep the repository tidy by removing the feature branch from the remote once it’s merged.

After merging, sync your local environment to include the new `main` changes and clean up your branch locally:

```bash
git switch main
git pull --ff-only        # get latest main without creating a merge commit
git branch -d feature/<your-branch-name>   # delete your local feature branch
```

Your contribution is now part of the `main` branch! 🎉

## 7. Deployment (Vercel Platform)

All changes merged into `main` are automatically deployed. The FunkSpace project is configured to **auto-deploy** via Vercel. That means once your PR is merged, Vercel will build the project and publish the updated site (the live site is at **funkspace.de**). Typically within minutes, your changes will be live in production.

For each open PR, Vercel also provides **Preview Deployments**. When you push your branch, Vercel might post a comment in the PR with a preview URL where you can view your feature running in a live environment. This is super helpful for testing UI changes or sharing with others before merging.

You generally don’t need to do anything special for deployment – it’s all automated. Just be aware that if your change affects environment variables or configuration, those need to be set in Vercel’s settings. (For more details on how our deployment is set up or how to handle environment config in Vercel, see the DevOps Playbook.)

## 8. Further Resources

- **Project README:** Be sure to read the [README.md](README.md) for instructions on setting up the project, running the app, and other useful scripts (`pnpm` commands, etc.). It contains additional context about the project structure and tools.
- **DevOps Playbook:** Our team maintains a **DevOps Playbook** document that goes into deep technical detail about the project’s infrastructure and workflows. It covers things like ESLint/Prettier configuration, testing practices with Vitest and Playwright, the CI/CD setup with GitHub Actions, and the Vercel deployment process. If you’re interested or run into a tricky issue (like fixing a failing CI build or resolving a merge conflict), the Playbook is a great resource. (Ask a maintainer if you need access or look for `FunkSpace_DevOps_Playbook.md` in the repository.)
- **Conventional Commits:** For more on the Conventional Commits format we use for messages, see the [Conventional Commits 1.0.0 specification](https://www.conventionalcommits.org/en/v1.0.0/).
- **Codex CLI:** Learn more about the OpenAI Codex CLI (our AI coding assistant) on its [GitHub page](https://github.com/openai/codex) if you’re curious how it works. It’s an optional tool, but we’ve found it helpful in accelerating development.

**Thank you for contributing to FunkSpace!** 🎷 _By following these guidelines, you help us maintain a clean codebase and ship improvements faster. We’re excited to see your contributions. If you have any questions, don’t hesitate to reach out to the maintainers or open a discussion._
