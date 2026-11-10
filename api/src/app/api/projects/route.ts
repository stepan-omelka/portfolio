import { projects } from "@/lib/portfolio";

export async function GET() {
  return Response.json(projects);
}
