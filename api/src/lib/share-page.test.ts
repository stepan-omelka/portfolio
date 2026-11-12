import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { type Profile, type Project, profile, projects } from "./portfolio";
import { homeSharePage, projectSharePage, withShareTags } from "./share-page";

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

describe("withShareTags", () => {
  const html = withShareTags(shell, projectSharePage(project, owner));

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
      '<meta property="og:image" content="https://stepan-omelka-portfolio.vercel.app/og/tapwave.jpg">\n',
    );
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">\n</head>');
  });

  it("escapes text that would break the markup", () => {
    const tricky = withShareTags(shell, {
      ...projectSharePage(project, owner),
      title: 'Tom & "Jerry" <3',
    });

    expect(tricky).toContain("<title>Tom &amp; &quot;Jerry&quot; &lt;3</title>");
    expect(tricky).toContain('content="Tom &amp; &quot;Jerry&quot; &lt;3"');
  });
});

describe("share images", () => {
  const webPublic = path.join(import.meta.dirname, "../../../web/public");

  it.each(projects.filter(({ status }) => status !== "placeholder"))(
    "has a share image for $slug in web/public/og",
    (realProject) => {
      const { image } = projectSharePage(realProject, profile);

      expect(existsSync(path.join(webPublic, image))).toBe(true);
    },
  );

  it("has a share image for the home page in web/public/og", () => {
    expect(existsSync(path.join(webPublic, homeSharePage(profile).image))).toBe(true);
  });
});
