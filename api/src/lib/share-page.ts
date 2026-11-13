import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Profile, Project } from "./portfolio.js";

/** Link previews need absolute URLs, and previews of preview deployments should show production. */
export const SITE_URL = "https://stepan-omelka-portfolio.vercel.app";

const HOME_SHARE_IMAGE = "/og/home.jpg";

/** What a link preview (LinkedIn, Messenger, WhatsApp…) shows for one page. */
export interface SharePage {
  siteName: string;
  title: string;
  description: string;
  path: string;
  /** Path of an image in `web/public/`, at least 1200×630. */
  image: string;
  imageAlt: string;
}

/** A share image as the preview tags describe it. */
export interface ShareImage {
  url: string;
  width: number;
  height: number;
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
export function withShareTags(shell: string, page: SharePage, image: ShareImage): string {
  const tags = [
    ["property", "og:type", "website"],
    ["property", "og:site_name", page.siteName],
    ["property", "og:title", page.title],
    ["property", "og:description", page.description],
    ["property", "og:url", `${SITE_URL}${page.path}`],
    ["property", "og:image", image.url],
    ["property", "og:image:width", String(image.width)],
    ["property", "og:image:height", String(image.height)],
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

/**
 * LinkedIn keeps the first copy it makes of an image URL for good, even after a re-scrape, so the
 * URL carries a hash of the file: a changed image gets a new URL and LinkedIn copies it again.
 */
export function readShareImage(publicDir: string, imagePath: string): ShareImage {
  const bytes = readFileSync(path.join(publicDir, imagePath));
  const version = createHash("sha256").update(bytes).digest("hex").slice(0, 10);
  return { url: `${SITE_URL}${imagePath}?v=${version}`, ...jpegSize(bytes) };
}

/** Width and height from the JPEG's start-of-frame segment. */
export function jpegSize(bytes: Buffer): { width: number; height: number } {
  let offset = 2;
  while (offset + 9 <= bytes.length) {
    const marker = bytes[offset + 1];
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isStartOfFrame) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
    }
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  throw new Error("Not a JPEG with a start-of-frame segment");
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
