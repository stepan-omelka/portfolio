import { findProject, projects } from "@/lib/portfolio";

export async function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, ctx: RouteContext<"/api/projects/[slug]">) {
  const { slug } = await ctx.params;
  const project = findProject(slug);

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  return Response.json(project);
}
