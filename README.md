# 👨‍💻 Štěpán Omelka · Portfolio

**Live:** <https://stepan-omelka-portfolio.vercel.app>

Štěpán Omelka's personal portfolio — a minimal black-and-white site with a dark mode. It presents
him as a full stack developer (Angular on the frontend, Spring Boot or Node.js on the backend),
shows his projects and lets visitors send him a message.

| Project                  | What                                                                               |
| :----------------------- | :--------------------------------------------------------------------------------- |
| [`web`](./web/README.md) | Angular 22 single-page app — everything the visitor sees                           |
| [`api`](./api/README.md) | NestJS 12 app — the content and contact form API; its build also produces the site |

## 🏛️ Architecture

See [_Architecture_](./ARCHITECTURE.md) for how the two projects fit together, in development and
in production.

## 🤝 Contributing

See [_Contributing_](./CONTRIBUTING.md) for setup, commands and Git conventions, and the
`README.md` of each project for what is specific to it.

| Doc                                                            | Covers                                                     |
| :------------------------------------------------------------- | :--------------------------------------------------------- |
| [Coding standards](./docs/coding-standards.md)                 | how code is written here — Angular, NestJS and TypeScript  |
| [Testing strategy](./docs/testing-strategy.md)                 | the test layers and how to write a test                    |
| [Comments and docs policy](./docs/comments-and-docs-policy.md) | when a comment or a doc earns its place, and where it goes |
| [Hosting and operations](./docs/operations.md)                 | the accounts and dashboard settings the site runs on       |
| [`AGENTS.md`](./AGENTS.md)                                     | gotchas for AI agents (and anyone new)                     |

## ✏️ Editing the content

The profile and every project live in one file,
[`api/src/lib/portfolio.ts`](./api/src/lib/portfolio.ts) — see [_Content_](./api/README.md#-content).
