import { readFileSync } from "node:fs";
import path from "node:path";
import type { Profile, Project } from "./portfolio";

/** Link previews need absolute URLs, and previews of preview deployments should show production. */
export const SITE_URL = "https://stepan-omelka-portfolio.vercel.app";

const SHARE_IMAGE_WIDTH = 1200;
const SHARE_IMAGE_HEIGHT = 630;
const HOME_SHARE_IMAGE = "/og/home.jpg";

/** What a link preview (LinkedIn, Messenger, WhatsApp…) shows for one page. */
export interface SharePage {
  siteName: string;
  title: string;
  description: string;
  path: string;
  /** Path of a 1200×630 image in `web/public/`. */
  image: string;
  imageAlt: string;
}

export function homeSharePage(profile: Profile): SharePage {
  return {
    siteName: profile.name,
    title: `${profile.name} · ${profile.role}`,
    description: profile.intro,
    path: "/",
    image: HOME_SHARE_IMAGE,
    imageAlt: `${profile.name} · ${profile.role}`,
  };
}

export function projectSharePage(project: Project, profile: Profile): SharePage {
  return {
    siteName: profile.name,
    title: `${project.title} · ${profile.name}`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.status === "placeholder" ? HOME_SHARE_IMAGE : `/og/${project.slug}.jpg`,
    imageAlt: project.title,
  };
}

/**
 * Link-preview crawlers don't run JavaScript, so they only see the Angular app's `index.html`.
 * This fills that page's title and description in and adds the Open Graph and Twitter card tags.
 */
export function withShareTags(shell: string, page: SharePage): string {
  const url = `${SITE_URL}${page.path}`;
  const image = `${SITE_URL}${page.image}`;
  const tags = [
    ["property", "og:type", "website"],
    ["property", "og:site_name", page.siteName],
    ["property", "og:title", page.title],
    ["property", "og:description", page.description],
    ["property", "og:url", url],
    ["property", "og:image", image],
    ["property", "og:image:width", String(SHARE_IMAGE_WIDTH)],
    ["property", "og:image:height", String(SHARE_IMAGE_HEIGHT)],
    ["property", "og:image:alt", page.imageAlt],
    ["name", "twitter:card", "summary_large_image"],
  ].map(([key, name, content]) => `<meta ${key}="${name}" content="${escapeHtml(content)}">`);

  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${escapeHtml(page.description)}">`,
    )
    .replace("</head>", `${tags.join("\n")}\n</head>`);
}

/** The Angular build's `index.html`, which `npm run build:site` copies into `public/`. */
function readSiteShell(): string {
  return readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8");
}

export function sharePageResponse(page: SharePage): Response {
  return new Response(withShareTags(readSiteShell(), page), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
