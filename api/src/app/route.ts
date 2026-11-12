import { profile } from "@/lib/portfolio";
import { homeSharePage, sharePageResponse } from "@/lib/share-page";

export function GET() {
  return sharePageResponse(homeSharePage(profile));
}
