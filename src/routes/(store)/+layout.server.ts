import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {


  const dbRes = await db
    .select({
      id: table.category.id, name: table.category.name,
      name_JP: table.category.nameJP
    })
    .from(table.category);
    
  if (!dbRes) {
    return error(404, {"message": "Page Not Found"});
  }

  return {
    categories: dbRes,
    user: event.locals.user
  };
};