import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
    if (event.locals.session === null) {
                return fail(401);
            }

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
    
    if (!event.locals.user?.githubToken) {
        return {
            user: event.locals.user,
            extensions: result
        };
    }
        if (!event.locals.session || !event.locals.user) {
            return fail(401);
        }
        const response = await fetch(encodeURI(`https://api.github.com/search/repositories?q=user:${event.locals.user.username} topic:ghost-cursor is:public`), {
		headers: {
			Authorization: `Bearer ${event.locals.user.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
		}
        });
        if (response.status != 200) {
            return {}
        }
        const res_data = await response.json()
        type RepoDetail = {
            id: number;
            full_name: string;

        }
        const repos = await res_data.items.map((repo: RepoDetail) => {
            return {id: repo.id, full_name: repo.full_name, }
        })

     return {
            user: event.locals.user,
            extensions: result,
            suggestions: repos
            // githubContent: await githubContent.text(),
        };
    /*
    const githubResponse0 = await fetch("https://api.github.com/repos/KTR200/gh-sample-extension/releases/latest", {
		headers: {
			Authorization: `Bearer ${event.locals.user.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
		}
	});
    const githubRelease0 = await githubResponse0.json();
    const tagname = githubRelease0.tag_name

    const githubResponse = await fetch(`https://api.github.com/repos/KTR200/gh-sample-extension/contents/src/manifest.json?ref=${tagname}`, {
		headers: {
			Authorization: `Bearer ${event.locals.user.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
		}
	});

	const githubManifest = await githubResponse.json();
    const utf8Array = Uint8Array.from(
        Array.from(atob(githubManifest.content)).map((s) => s.charCodeAt(0)),
    );
  const githubManifestContent = new TextDecoder().decode(utf8Array);
    const manifestJS = JSON.parse(githubManifestContent)
    
        return {
            user: event.locals.user,
            extensions: result,
            manifest: manifestJS,
            // githubContent: await githubContent.text(),
        };
    */
    // https://api.github.com/search/repositories?q=user:KTR200%20topic:ghost-cursor%20is:public%20sample%20in:name
};


export const actions: Actions = {
    verify_repo: async (event) => {
        if (!event.locals.user) {
            return fail(403)
        }
        const data = await event.request.formData()
        const repoName0 = data.get("repository-name")?.toString() ?? ""
        let repoName: string = "";
        if (new RegExp("^[^/]+/[^/]+$").test(repoName0)) {
            repoName = repoName0
        } else if (new RegExp("^https://github.com/[^/]+/[^/]+$").test(repoName0)) {
            repoName = repoName0.split("/").slice(-2).join("/")
        }
        console.log(repoName)

        const githubResponse0 = await fetch(`https://api.github.com/repos/${repoName}/releases/latest`, {
		headers: {
			Authorization: `Bearer ${event.locals.user.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
		}
	});
    const githubRelease = await githubResponse0.json();
    const tagname = githubRelease.tag_name

    const githubResponse = await fetch(`https://api.github.com/repos/${repoName}/contents/src/manifest.json?ref=${tagname}`, {
		headers: {
			Authorization: `Bearer ${event.locals.user.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
		}
	});

	const githubManifest = await githubResponse.json();
    const utf8Array = Uint8Array.from(
        Array.from(atob(githubManifest.content)).map((s) => s.charCodeAt(0)),
    );
    const githubManifestContent = new TextDecoder().decode(utf8Array);
    const manifestJS = JSON.parse(githubManifestContent)
    return {repository: {name: repoName}, release: githubRelease, manifest: manifestJS}
},
};