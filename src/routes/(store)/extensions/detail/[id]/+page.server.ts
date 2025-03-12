import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const id = parseInt(params.id);

  if (!id) {
    return error(404, {"message": "Page Not Found"});
  }

  const [result] = await db
    .select({
      id: table.extension.id, name: table.extension.name, description: table.extension.description,
      icon_url: table.extension.icon_url, category_id: table.category.id, category_name: table.category.name,
      version: table.extension.version,
      userId: table.user.id, username: table.user.username, githubAvatarUrl: table.user.githubAvatarUrl,
      createdAt: table.extension.created_at, updatedAt: table.extension.updated_at,
    })
    .from(table.extension)
    .innerJoin(table.user, eq(table.extension.userId, table.user.id))
    .innerJoin(table.category, eq(table.extension.categoryId, table.category.id))
    .where(eq(table.extension.id, id));
    
  if (!result) {
    return error(404, {"message": "Page Not Found"});
  }

  return {
    extension: result
  };
};