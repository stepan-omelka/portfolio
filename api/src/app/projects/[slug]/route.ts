import { findProject, profile, projects } from "@/lib/portfolio";
import { homeSharePage, projectSharePage, sharePageResponse } from "@/lib/share-page";

export async function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, ctx: RouteContext<"/projects/[slug]">) {
  const { slug } = await ctx.params;
  const project = findProject(slug);

  return sharePageResponse(project ? projectSharePage(project, profile) : homeSharePage(profile));
}
