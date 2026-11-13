# 🧪 Testing strategy

## 📘 Principles

- **Test coverage over code coverage.** A percentage says how much code ran, not how much
  behaviour is pinned down. Ask which scenario is untested, not which line is unvisited.
- **Black-box over white-box.** Test through a module's public interface - a function's
  arguments and result, an endpoint's request and response, a component's rendered DOM - so that a
  refactor which keeps the contract keeps the tests green.
- **A test reads as documentation.** The name states the expected behaviour; the body shows how
  the unit is meant to be used, with meaningful values.
- **DAMP over DRY.** Repetition inside a test is cheaper than indirection the reader has to
  unpack. No conditions or loops in a test - `it.each` is fine.
- **Flaky means failing.** A test that passes intermittently carries no signal; fix it or delete
  it.
- **Mock only what you don't own**, and only for determinism or to avoid side effects - external
  packages and the network, never this repo's own modules.
- **DOM tests query by role, label or text and assert what the user sees** - a message, a focused
  field - never internal state.

## ▲ Test layers

|             | API unit tests                                                        | Angular tests                                                            |
| :---------- | :-------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **Project** | [`api`](../api/README.md)                                             | [`web`](../web/README.md)                                                |
| **Files**   | `src/**/*.test.ts`, next to the code                                  | `src/**/*.spec.ts`, next to the code                                     |
| **Runner**  | Vitest, in Node                                                       | Vitest through `ng test`, in jsdom                                       |
| **Scope**   | `lib/` functions, and endpoints through HTTP requests to the Nest app | components rendered with `TestBed`, HTTP through `HttpTestingController` |
| **Run**     | `npm --prefix api test`                                               | `npm --prefix web test -- --watch=false`                                 |

`npm test` at the root runs both. There are no end-to-end tests; check a flow end to end by hand
with `npm run dev`, or `npm run build && npm start` for the production setup.

## 📧 The contact form

A test must never reach Resend. The API tests mock the `resend` package, and the Angular tests
answer `POST /api/contact` through `HttpTestingController`. Don't test the form by sending a real
message - on the live site or a preview it emails Štěpán.

## ➕ What a change needs

- New content in `portfolio.ts` - no test; the build and a look at the page are enough.
- A new rule in `lib/` (validation, formatting) - unit tests for the expected cases first, then
  the edge cases.
- A new or changed endpoint - a test for each status code it can return.
- A new component or a change in behaviour - an Angular test that renders it and checks what the
  user sees and can do, including keyboard focus where it matters.
