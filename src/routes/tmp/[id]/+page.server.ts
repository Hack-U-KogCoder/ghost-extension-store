import { fail, error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const id = parseInt(params.id);

  if (!id) {
    return error(404, {"message": "Page Not Found"});
  }

  const [result] = await db
    .select({
      // Adjust user table here to tweak returned data
      id: table.extension.id, title: table.extension.title, description: table.extension.description,
      createdAt: table.extension.created_at, updatedAt: table.extension.updated_at,
      userId: table.user.id, username: table.user.username, githubAvatarUrl: table.user.githubAvatarUrl,
    })
    .from(table.extension)
    .innerJoin(table.user, eq(table.extension.userId, table.user.id))
    .where(eq(table.extension.id, id));
    
  if (!result) {
    return error(404, {"message": "Page Not Found"});
  }

  return {
    extension: result
  };
};


export const actions: Actions = {
  update: async (event) => {
    if (event.locals.session === null) {
      return fail(401);
    }

    const id = parseInt(event.params.id);

    const data = await event.request.formData();
    const title = data.get("title")?.toString() ?? "";
    const description = data.get("description")?.toString() ?? "";

    const [result0] = await db
      .select({id: table.extension.id, userId: table.extension.userId})
      .from(table.extension)
      .innerJoin(table.user, eq(table.extension.userId, table.user.id))
      .where(eq(table.extension.id, id));

    if (!result0) {
      return fail(404);
    }
    if (!event.locals.user || result0.userId !== event.locals.user.id) {
      return fail(401);
    }

    const extension = {
      title: title,
      description: description
    };
    const [result] = await db
      .update(table.extension)
      .set(extension)
      .where(eq(table.extension.id, id))
      .returning();
    console.log(result);
    return {success: true};
  },
  delete: async (event) => {
    if (event.locals.session === null) {
      return {success: false, message: "unauthorized"};
    }
    console.log("actioned");

    const id = parseInt(event.params.id);
    const [result0] = await db
      .select({id: table.extension.id, userId: table.extension.userId})
      .from(table.extension)
      .innerJoin(table.user, eq(table.extension.userId, table.user.id))
      .where(eq(table.extension.id, id));

    if (!result0) {
      return {success: false, message: "not found"};
    }
    if (!event.locals.user || result0.userId !== event.locals.user.id) {
      return {success: false, message: "forbidden"};
    }

    const [result] = await db
      .delete(table.extension)
      .where(eq(table.extension.id, id))
      .returning({id: table.extension.id});
    if (!result) {
      return {success: false, message: "fail delete"};
    }
  }
};