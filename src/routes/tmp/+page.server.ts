import type { PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

export const load: PageServerLoad = async (event) => {
  if (event.locals.session === null) {
    return fail(401);
  }

  const resExts = await db
    .select({
      // Adjust user table here to tweak returned data
      id: table.extension.id, name: table.extension.name, description: table.extension.description,
      createdAt: table.extension.created_at, updatedAt: table.extension.updated_at,
      userId: table.user.id, username: table.user.username, githubAvatarUrl: table.user.githubAvatarUrl,
    })
    .from(table.extension)
    .innerJoin(table.user, eq(table.extension.userId, table.user.id))
    .where(eq(table.extension.userId, event.locals.user?.id ?? 0));

  if (!event.locals.session || !event.locals.user || !event.locals.user.githubToken) {
    return fail(401);
  }

  return {
    user: event.locals.user,
    extensions: resExts,
  };
  
};