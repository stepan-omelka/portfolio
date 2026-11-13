# 📝 Comments and docs policy

When a code comment or a doc earns its place, and where it goes. _Docs_ are the Markdown files
contributors read - READMEs, `AGENTS.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md` and everything
under `docs/`. Applies to human and AI contributions alike. Everything up to
[Comments](#-comments) applies to comments and docs alike.

## The default

Code should be declarative and self-explanatory - expressed through naming, types and structure.
A comment or a doc carries only what the code _cannot_ express.

## The test

Before adding a comment or a doc section, and when deciding whether an existing one stays, ask
what happens without it: **would a competent reader make a wrong change?** If not, leave it out.
If so, prefer a test that catches the wrong change; otherwise put it where that reader will meet
it (below).

- **A reader who would look it up anyway does not need it**; one who would not think to look does.
- **When borderline, leave it out.**

## Where it goes

| What                                                           | Where it goes                                                        |
| :------------------------------------------------------------- | :------------------------------------------------------------------- |
| a constraint on one piece of code                              | a comment at that code - see [Comments](#-comments)                  |
| what every change to a project needs                           | that project's `README.md` - see [Project READMEs](#project-readmes) |
| what every change in the repo needs                            | [`CONTRIBUTING.md`](../CONTRIBUTING.md) or `docs/`                   |
| a gotcha only visible across several files or outside the repo | [`AGENTS.md`](../AGENTS.md)                                          |
| a setting that lives in a dashboard, not in the repo           | [`docs/operations.md`](./operations.md)                              |
| behaviour a test can check                                     | the test                                                             |
| anything with a home of its own - a file, a tool's docs        | that home - link it                                                  |
| what the code does, or a narration of its steps                | nowhere - the code says it                                           |
| history ("ported from …", "was X, now Y")                      | the commit message                                                   |
| status ("in place", "not yet", "upcoming")                     | nowhere in the repo - a GitHub issue, if anywhere                    |

## 💬 Comments

| A comment for…                         | must include…                               |
| :------------------------------------- | :------------------------------------------ |
| a workaround for an external bug       | a link to the upstream issue                |
| version- or platform-specific behavior | the version/platform it depends on          |
| a non-obvious failure mode             | what triggers it                            |
| an invisible constraint                | the source the value must stay in sync with |
| code that looks wrong but is right     | what breaks if it is "fixed"                |

A comment - JSDoc included - is at most **two lines** of 100 columns; a workaround may take a
third for its upstream link. State the constraint, not the story. Comments describe the code as it
stands - **the git history is the record**.

## 📚 Docs

Docs are onboarding guideposts: architecture, conventions, footguns, runbooks. Prefer a table or a
diagram to prose, and don't copy a value or a list that lives in a file - point at the file.

- The root `README.md` is a short entry point and an index of the other docs.
- `ARCHITECTURE.md` explains how the projects fit together and links each project's README.
- `AGENTS.md` holds only gotchas and hard-to-explore findings. It links other docs instead of
  restating them.
- **`CLAUDE.md` stays the bare `@AGENTS.md` include** - instructions go in the `AGENTS.md` next to
  it, so all agents share them.

### Project READMEs

A project's `README.md` (`web/`, `api/`) is read before every change to the project, so it holds
only what every such change needs: what the project is, how it is wired, and the rules and
footguns every contributor must know.

- **No section for a single component or feature** - it matters only to whoever changes it, so
  its constraints go in comments and its behaviour in tests.
- It **ends with `💻 Development` and `🧪 Testing`**, in that order. They hold only what is
  specific to the project and link [`CONTRIBUTING.md`](../CONTRIBUTING.md) and the
  [testing strategy](./testing-strategy.md) rather than repeat them.
- A reference to the other project is a **relative link to its `README.md`**.
- Its `AGENTS.md` is a **thin pointer** - a few bullets linking that `README.md` and whatever
  shared docs the project needs. Rules live in the `README.md`, never in both.
