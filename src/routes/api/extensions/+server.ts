import { json, text, type RequestHandler } from "@sveltejs/kit";
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';


export const POST: RequestHandler = async ({ request, locals }) => {
    const data = await request.json()

    if (locals.session === null) {
        return text("unauthorized", {status: 401});
    }
    const userId = data.userId?.toString()
    const title = data.title?.toString() ?? ""
    const description = data.description?.toString() ?? ""


    if (!locals.user || userId !== locals.user.id) {
        return text("forbidden", {status: 403});
    }

    const extension = {
            userId: userId,
            title: title,
            description: description
        };
    const [result] = await db.insert(table.extension).values(extension).returning();
    return json(result, {status: 201})
}

export const fallback: RequestHandler = async ( { request }) => {
    return text("method not allowed", {status: 405})
}