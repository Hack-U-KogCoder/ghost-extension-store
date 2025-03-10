import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {

    /*
    const result = await db
            .select({
                // Adjust user table here to tweak returned data
                id: table.extension.id, title: table.extension.title, description: table.extension.description,
                 createdAt: table.extension.created_at, updatedAt: table.extension.updated_at,
                userId: table.user.id, username: table.user.username, githubAvatarUrl: table.user.githubAvatarUrl,
            })
            .from(table.extension)
            .innerJoin(table.user, eq(table.extension.userId, table.user.id));

    return {
        extensions: result
    };
    */
    const dbRes = await db
            .select({
                id: table.extension.id, title: table.extension.title, description: table.extension.description,
                icon_url: table.extension.icon_url, category_id: table.category.id, category_name: table.category.name,
                version: table.extension.version,
                userId: table.user.id, username: table.user.username, githubAvatarUrl: table.user.githubAvatarUrl,
                createdAt: table.extension.created_at, updatedAt: table.extension.updated_at,
            })
            .from(table.extension)
        .innerJoin(sql`
        (SELECT ext_id FROM (
            SELECT
            extension.id as ext_id,
            category.id as cat_id,
            row_number() OVER (PARTITION BY category.id order by extension.id asc) as rank
            FROM extension
            INNER JOIN CATEGORY
            ON extension.category_id = category.id
        )
        WHERE
        rank <= 5)`, eq(table.extension.id, sql`ext_id`))
        .innerJoin(table.user, eq(table.extension.userId, table.user.id))
        .innerJoin(table.category, eq(table.extension.categoryId, table.category.id))
    const categoryKeys: {[key: number]: number} = {}
    interface ExtensionsByCategory {
        [key: string]: string|number|{[key: string]: string|number|Date|null}[],
        extensions: {
                id: number, title: string, description: string,
                icon_url: string, category_id: number, category_name: string,
                version: string,
                userId: number, username: string, githubAvatarUrl: string|null,
                createdAt: Date, updatedAt: Date,
            }[],
    };
    const extensionsByCategory: ExtensionsByCategory[] = []
    dbRes.forEach((e) => {
        if (e.category_id in categoryKeys) {
            extensionsByCategory[categoryKeys[e.category_id]].extensions.push(e)
        } else {
            categoryKeys[e.category_id] = extensionsByCategory.length
            extensionsByCategory.push({id: e.category_id, name: e.category_name, extensions: [e]})
        }
    })
    return {
        extesionsByCategory: extensionsByCategory
    }
};