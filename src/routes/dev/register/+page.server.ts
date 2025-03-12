import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";

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
    .where(eq(table.extension.userId, event.locals.user?.id ?? 0));
    
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
    return {};
  }
  const res_data = await response.json();
        type RepoDetail = {
          id: number;
          full_name: string;

        };
        const repos = await res_data.items.map((repo: RepoDetail) => {
          return {id: repo.id, full_name: repo.full_name, };
        });

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
      return fail(403);
    }
        
    const data = await event.request.formData();
    const formRepoName = data.get("repository-name")?.toString() ?? "";
    let repoName: string = "";
    if (new RegExp("^[^/]+/[^/]+$").test(formRepoName)) {
      repoName = formRepoName;
    } else if (new RegExp("^https://github.com/[^/]+/[^/]+$").test(formRepoName)) {
      repoName = formRepoName.split("/").slice(-2).join("/");
    } else {
      return {status: {phase: 0, message: "入力形式が不正です", formRepoName: formRepoName},
      };
    }

    const repoRes = await fetch(`https://api.github.com/repos/${repoName}`, {
      headers: {
        Authorization: `Bearer ${event.locals.user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    if (!repoRes.ok) {
      return {status: {phase: 0, message: "リポジトリが見つかりません", formRepoName: formRepoName},
        repository: {name: repoName}};
    }
    const repoData = await repoRes.json();
    const repoId = repoData.id;
    if (repoData.owner.type != "User") {
      return {
        status: {phase: 0, message: "Organization等のリポジトリには現在未対応です", formRepoName: formRepoName}};
    }
    if (repoData.private) {
      return {
        status: {phase: 0, message: "プライベートリポジトリは登録できません", formRepoName: formRepoName}};
    }

    const [dbRes] = await db
      .select({
        // Adjust user table here to tweak returned data
        githubid: table.extension.githubId, githubUserId: table.user.githubId
      })
      .from(table.extension)
      .innerJoin(table.user, eq(table.extension.userId, table.user.id))
      .where(eq(table.extension.githubId, repoId));
    console.log(dbRes);
    if (dbRes) {
      return {
        status: {phase: 0, message: "このリポジトリはすでに登録されています", formRepoName: formRepoName}};
    }
    if (repoData.owner.id != event.locals.user.githubId) {
      return {
        status: {phase: 0, message: "リポジトリのオーナーのみ登録できます", formRepoName: formRepoName}};
    }


    const releaseRes = await fetch(`https://api.github.com/repos/${repoName}/releases/latest`, {
      headers: {
        Authorization: `Bearer ${event.locals.user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    if (!repoRes.ok) {
      return {
        status: {phase: 0, message: "このリポジトリのリリースが見つかりません", formRepoName: formRepoName}};
    }
    const releaseData = await releaseRes.json();
    const tagname = releaseData.tag_name;

    const manifestRes = await fetch(`https://api.github.com/repos/${repoName}/contents/src/manifest.json?ref=${tagname}`, {
      headers: {
        Authorization: `Bearer ${event.locals.user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    if (!repoRes.ok) {
      return {success: false};
    }
    const manifestData = await manifestRes.json();

    const utf8Array = Uint8Array.from(
      Array.from(atob(manifestData.content)).map((s) => s.charCodeAt(0)),
    );
    const githubManifestContent = new TextDecoder().decode(utf8Array);
    const manifestJS = JSON.parse(githubManifestContent);
    return {
      status: {phase: 1, message: null},
      repository: {name: repoName}, release: releaseData, manifest: manifestJS};
  },
};