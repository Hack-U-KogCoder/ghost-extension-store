import { fail, redirect } from "@sveltejs/kit";
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        return redirect(302, "/login");
    }

    return {
        user: event.locals.user
    };
};

export const actions: Actions = {
    default: async (event) => {
        if (event.locals.session === null) {
            return fail(401);
        }
        console.log("actioned")

        const data = await event.request.formData()
        const userId = data.get("userId")?.toString()
        const title = data.get("title")?.toString() ?? ""
        const description = data.get("description")?.toString() ?? ""


        if (!event.locals.user || userId !== event.locals.user.id) {
            return fail(401);
        }

        const extension = {
                userId: userId,
                title: title,
                description: description
            };
        const [result] = await db.insert(table.extension).values(extension).returning();
        console.log(result)
        return {registered: true, extension: result}
}
};