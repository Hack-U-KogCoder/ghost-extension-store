import type { PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

export const load: PageServerLoad = async (event) => {


  const result = await db
    .select({
      // Adjust user table here to tweak returned data
      id: table.extension.id, title: table.extension.title, description: table.extension.description,
      createdAt: table.extension.created_at, updatedAt: table.extension.updated_at,
      userId: table.user.id, username: table.user.username, githubAvatarUrl: table.user.githubAvatarUrl,
    })
    .from(table.extension)
    .innerJoin(table.user, eq(table.extension.userId, table.user.id))
    .where(eq(table.extension.userId, event.locals.user?.id ?? ""));
    
  return {
    user: event.locals.user,
    extensions: result
  };

  return {
  };
};
