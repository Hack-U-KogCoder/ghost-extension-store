import { text } from "@sveltejs/kit";
import { run_seed } from "$lib/server/db/seed";
export async function GET() {
  if (await run_seed()) {
    return text("not found", {status: 404});
  }
  return text("ok");
}