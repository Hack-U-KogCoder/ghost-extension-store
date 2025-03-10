import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {

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
};