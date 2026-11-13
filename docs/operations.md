# ☁️ Hosting and operations

The services the site runs on, which account holds each one, and the settings that live in their
dashboards rather than in this repo. Read it before changing anything outside the code — and
change nothing here without Štěpán's go-ahead.

## 🗺️ Services

| Service                                                        | Account                                                                                        | Used for                                     |
| :------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- | :------------------------------------------- |
| [Vercel](https://vercel.com/stepan-omelkas-projects/portfolio) | project `portfolio` in the Hobby team `stepan-omelkas-projects` (login `stepomelka@gmail.com`) | hosting, production and preview deployments  |
| [Resend](https://resend.com)                                   | Štěpán's personal account `stepomelka@gmail.com`, Free plan                                    | sending contact form emails                  |
| [GitHub](https://github.com/stepan-omelka/portfolio)           | public repository `stepan-omelka/portfolio`                                                    | code; Vercel's GitHub app deploys every push |

Personal projects use only Štěpán's personal accounts, never his employer's.

Both Vercel and Resend run on free plans with **no payment method on file**, so nothing can be
billed: when a Hobby limit is exceeded, Vercel pauses the feature instead
([Hobby plan](https://vercel.com/docs/plans/hobby)). The Hobby plan is for personal,
non-commercial use, which this site is.

## 🔐 Configuration

| Setting           | Set in                                                                                        | Notes                                                                                                                                                  |
| :---------------- | :-------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`  | Vercel → Settings → Environment Variables (Production, _Sensitive_); locally `api/.env.local` | A key with _Sending access_. **In Resend it is named `pocmarano-contact-form`** — despite the name it is this site's key; deleting it breaks the form. |
| Root Directory    | Vercel → Settings → Build and Deployment: `api`                                               | install and build commands are in [`api/vercel.json`](../api/vercel.json)                                                                              |
| Framework Preset  | `framework` in [`api/vercel.json`](../api/vercel.json): `null`, which is _Other_              | overrides the preset in the Vercel project settings, so the one the dashboard shows does not apply                                                     |
| Node.js version   | `engines.node` in [`api/package.json`](../api/package.json): `24.x`                           | overrides the Node version in the Vercel project settings                                                                                              |
| Production branch | Vercel → Settings → Git: `main`                                                               | every other branch deploys a preview                                                                                                                   |
| Domain            | Vercel → Settings → Domains: `stepan-omelka-portfolio.vercel.app`                             | the project's original `portfolio-teal-six-22.vercel.app` redirects to it                                                                              |
| GitHub access     | GitHub → Settings → Applications → Vercel: _Only select repositories_                         | a new repository must be added there before Vercel can deploy it                                                                                       |

## 🧰 Runbooks

### Roll back a bad deploy

Vercel → project → **Instant Rollback** on the production deployment. The Hobby plan can only go
back to the **immediately previous** production deployment. After a rollback, pushes to `main` stop
going live until you promote a deployment again.

### Redeploy without a commit

Environment variable changes only reach new deployments. Vercel → **Deployments** → the latest
production deployment → ⋯ → **Redeploy**.

### Rotate the Resend key

1. In Resend (`stepomelka@gmail.com`), create a key with _Sending access_.
2. Replace `RESEND_API_KEY` in Vercel (Production), then [redeploy](#redeploy-without-a-commit).
3. Ask Štěpán to send himself one message through the live form, and check it in Resend → Emails.
4. Delete the old key in Resend.

### Refresh a link preview on LinkedIn

LinkedIn reads a link's title and picture once and keeps them, even on the profile's Projects and
Featured sections — a new image or text never reaches it on its own. After the deploy, open
[Post Inspector](https://www.linkedin.com/post-inspector/) logged in to LinkedIn, enter the page's
URL and press **Inspect**. LinkedIn reads the page again, and the profile shows the new preview.
Messenger and WhatsApp cache previews too, for a few days.
