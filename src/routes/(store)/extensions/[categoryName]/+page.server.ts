import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const categoryName = params.categoryName.toString();

  if (!categoryName) {
    return error(404, {"message": "Page Not Found"});
  }

  const dbRes = await db
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
    .where(eq(table.category.name, categoryName));
  
  const [dbResCat] = await db
    .select({
      id: table.category.id, name: table.category.name,
      name_JP: table.category.nameJP
    })
    .from(table.category)
    .where(eq(table.category.name, categoryName));
    
  if (!dbRes || !dbResCat) {
    return error(404, {"message": "Page Not Found"});
  }

  return {
    extensions: dbRes,
    category: dbResCat
  };
};