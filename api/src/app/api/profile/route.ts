import { profile } from "@/lib/portfolio";

export async function GET() {
  return Response.json(profile);
}
