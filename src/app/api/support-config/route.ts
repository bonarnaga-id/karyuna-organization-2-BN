import { appConfig } from "@/lib/config";
import { jsonResponse } from "@/lib/security";

export async function GET() {
  return jsonResponse({ support: appConfig.support });
}
