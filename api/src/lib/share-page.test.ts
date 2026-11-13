import path from "node:path";
import { describe, expect, it } from "vitest";
import { type Profile, type Project, profile, projects } from "./portfolio.js";
import {
  homeSharePage,
  jpegSize,
  projectSharePage,
  readShareImage,
  withShareTags,
} from "./share-page.js";

const shell = `<html><head>
<title>Štěpán Omelka · Full Stack Developer</title>
<meta name="description" content="Full stack developer portfolio.">
</head><body><app-root></app-root></body></html>`;

const owner = { name: "Jana Nováková", role: "Developer", intro: "I build web apps." } as Profile;

const project = {
  slug: "tapwave",
  title: "Tapwave",
  summary: "A rhythm game.",
  status: "live",
} as Project;

describe("homeSharePage", () => {
  it("describes the home page with the profile", () => {
    expect(homeSharePage(owner)).toEqual({
      siteName: "Jana Nováková",
      title: "Jana Nováková · Developer",
      description: "I build web apps.",
      path: "/",
      image: "/og/home.jpg",
      imageAlt: "Jana Nováková · Developer",
    });
  });
});

describe("projectSharePage", () => {
  it("describes a project with its own image", () => {
    expect(projectSharePage(project, owner)).toEqual({
      siteName: "Jana Nováková",
      title: "Tapwave · Jana Nováková",
      description: "A rhythm game.",
      path: "/projects/tapwave",
      image: "/og/tapwave.jpg",
      imageAlt: "Tapwave",
    });
  });

  it("falls back to the home image for a placeholder", () => {
    expect(projectSharePage({ ...project, status: "placeholder" }, owner).image).toBe(
      "/og/home.jpg",
    );
  });
});

const image = {
  url: "https://stepan-omelka-portfolio.vercel.app/og/tapwave.jpg?v=0123456789",
  width: 1200,
  height: 630,
};

describe("withShareTags", () => {
  const html = withShareTags(shell, projectSharePage(project, owner), image);

  it("replaces the title and the description", () => {
    expect(html).toContain("<title>Tapwave · Jana Nováková</title>");
    expect(html).toContain('<meta name="description" content="A rhythm game.">');
    expect(html).not.toContain("Full stack developer portfolio.");
  });

  it("adds the preview tags with absolute URLs to the head", () => {
    expect(html).toContain(
      '<meta property="og:url" content="https://stepan-omelka-portfolio.vercel.app/projects/tapwave">\n',
    );
    expect(html).toContain(
      '<meta property="og:image" content="https://stepan-omelka-portfolio.vercel.app/og/tapwave.jpg?v=0123456789">\n',
    );
    expect(html).toContain('<meta property="og:image:width" content="1200">\n');
    expect(html).toContain('<meta property="og:image:height" content="630">\n');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">\n</head>');
  });

  it("escapes text that would break the markup", () => {
    const tricky = withShareTags(
      shell,
      { ...projectSharePage(project, owner), title: 'Tom & "Jerry" <3' },
      image,
    );

    expect(tricky).toContain("<title>Tom &amp; &quot;Jerry&quot; &lt;3</title>");
    expect(tricky).toContain('content="Tom &amp; &quot;Jerry&quot; &lt;3"');
  });
});

describe("share images", () => {
  const webPublic = path.join(import.meta.dirname, "../../../web/public");

  it.each(projects.filter(({ status }) => status !== "placeholder"))(
    "has a share image of at least 1200×630 for $slug in web/public/og",
    (realProject) => {
      const { width, height } = readShareImage(webPublic, projectSharePage(realProject, profile).image);

      expect(width).toBeGreaterThanOrEqual(1200);
      expect(height).toBeGreaterThanOrEqual(630);
    },
  );

  it("has a 2400×1260 share image for the home page, sharp on high-density screens", () => {
    expect(readShareImage(webPublic, homeSharePage(profile).image)).toMatchObject({
      width: 2400,
      height: 1260,
    });
  });

  it("versions the image URL with a hash of the file", () => {
    expect(readShareImage(webPublic, "/og/home.jpg").url).toMatch(
      /^https:\/\/stepan-omelka-portfolio\.vercel\.app\/og\/home\.jpg\?v=[0-9a-f]{10}$/,
    );
  });
});

describe("jpegSize", () => {
  it("rejects a file that isn't a JPEG", () => {
    expect(() => jpegSize(Buffer.from("not an image"))).toThrow();
  });
});
