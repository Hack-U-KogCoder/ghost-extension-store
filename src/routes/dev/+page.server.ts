import type { LayoutServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

export const load: LayoutServerLoad = async (event) => {


  const result = await db
    .select({
      // Adjust user table here to tweak returned data
      id: table.extension.id, name: table.extension.name, description: table.extension.description,
      createdAt: table.extension.created_at, updatedAt: table.extension.updated_at,
      userId: table.user.id, username: table.user.username, githubAvatarUrl: table.user.githubAvatarUrl,
    })
    .from(table.extension)
    .innerJoin(table.user, eq(table.extension.userId, table.user.id))
    .where(eq(table.extension.userId, event.locals.user?.id ?? 0));
    
  return {
    user: event.locals.user,
    extensions: result
  };
};
