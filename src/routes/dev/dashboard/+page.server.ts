import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { GITHUB_APP_NAME } from "$env/static/private";

export const load: PageServerLoad = async (event) => {
  if (event.locals.session === null) {
    return fail(401);
  }

  const resExts = await db
    .select({
      // Adjust user table here to tweak returned data
      id: table.extension.id, githubId: table.extension.githubId,
      name: table.extension.name, description: table.extension.description,
      createdAt: table.extension.created_at, updatedAt: table.extension.updated_at,
      userId: table.user.id, username: table.user.username, githubAvatarUrl: table.user.githubAvatarUrl,
    })
    .from(table.extension)
    .innerJoin(table.user, eq(table.extension.userId, table.user.id))
    .where(eq(table.extension.userId, event.locals.user?.id ?? 0));

  if (!event.locals.session || !event.locals.user || !event.locals.user.githubToken) {
    return fail(401);
  }


  type RepoDetail = {
    id: number;
    full_name: string;

  };
  const suggestions: RepoDetail[] = [];

  const pageData = {
    user: event.locals.user,
    extensions: resExts,
    suggestions: suggestions
  };
  const response = await fetch(encodeURI(`https://api.github.com/search/repositories?q=user:${event.locals.user.username} topic:booost-ghost is:public`), {
    headers: {
      "User-Agent": GITHUB_APP_NAME,
      Authorization: `Bearer ${event.locals.user.githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  if (response.ok) {
    const res_data = await response.json();
    const extensionGids = resExts.map(e => e.githubId);
    await res_data.items.forEach((repo: RepoDetail) => {
      if (!extensionGids.includes(repo.id)) {
        suggestions.push({id: repo.id, full_name: repo.full_name, });
      }
    });
    pageData.suggestions = suggestions;
          
  }
  return pageData;
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
        "User-Agent": GITHUB_APP_NAME,
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
        "User-Agent": GITHUB_APP_NAME,
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
        "User-Agent": GITHUB_APP_NAME,
        Authorization: `Bearer ${event.locals.user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    if (!repoRes.ok) {
      return {
        status: {phase: 0, message: "manifest.jsonの読み込みに失敗しました", formRepoName: formRepoName}};
    }
    const manifestData = await manifestRes.json();

    const utf8Array = Uint8Array.from(
      Array.from(atob(manifestData.content)).map((s) => s.charCodeAt(0)),
    );
    const githubManifestContent = new TextDecoder().decode(utf8Array);
    const manifestJS = JSON.parse(githubManifestContent);

    const [dbCategory] = await db.select({id: table.category.id, name: table.category.name})
      .from(table.category)
      .where(eq(table.category.name, manifestJS.category));

    if (!dbCategory) {
      return {
        status: {phase: 1, message: "categoryの値が不正です", formRepoName: formRepoName},
        maniefst: manifestJS};
    }

    const iconPath = manifestJS.icon;
    const iconRes = await fetch(`https://api.github.com/repos/${repoName}/contents/src/${iconPath}?ref=${tagname}`, {
      headers: {
        "User-Agent": GITHUB_APP_NAME,
        Authorization: `Bearer ${event.locals.user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    if (!iconRes.ok) {
      return {
        status: {phase: 1, message: "iconファイルが見つかりませんでした", formRepoName: formRepoName},
        maniefst: manifestJS};
    }
    const iconData = await iconRes.json();
    const iconUrl = iconData.download_url;

    const extension = {
      githubId: repoId,
      userId: event.locals.user.id,
      name: manifestJS.name,
      description: manifestJS.description,
      icon_url: iconUrl,
      categoryId: dbCategory.id,
      categoryName: dbCategory.name,
      version: manifestJS.version
    };

    try {
      // await db.insert(table.extension).values(extension).returning();
    } catch(e) {
      console.log(e);
      return {
        status: {phase: 1, message: "登録に失敗しました。拡張機能の形式が不正です", formRepoName: formRepoName},
        repository: {name: repoName}, release: releaseData, manifest: manifestJS};
    }


    return {
      status: {phase: 1, message: null, formRepoName: formRepoName},
      repository: {name: repoName}, release: releaseData, manifest: manifestJS, extension: extension};
  },
  register_submit: async (event) => {
    if (!event.locals.user) {
      return fail(403);
    }
        
    const data = await event.request.formData();
    const repoName = data.get("repository-name")?.toString() ?? "";
   
    const repoRes = await fetch(`https://api.github.com/repos/${repoName}`, {
      headers: {
        "User-Agent": GITHUB_APP_NAME,
        Authorization: `Bearer ${event.locals.user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    if (!repoRes.ok) {
      return {status: {phase: 2, message: "登録に失敗しました", formRepoName: repoName},
        repository: {name: repoName}};
    }
    const repoData = await repoRes.json();
    const repoId = repoData.id;
    if (repoData.owner.type != "User") {
      return {status: {phase: 2, message: "登録に失敗しました", formRepoName: repoName},
        repository: {name: repoName}};
    }
    if (repoData.private) {
      return {status: {phase: 2, message: "登録に失敗しました", formRepoName: repoName},
        repository: {name: repoName}};
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
    /*
    if (dbRes) {
      return {
        status: {phase: 0, message: "このリポジトリはすでに登録されています", formRepoName: formRepoName}};
    }
    */
    if (repoData.owner.id != event.locals.user.githubId) {
      return {status: {phase: 2, message: "登録に失敗しました", formRepoName: repoName},
        repository: {name: repoName}};
    }


    const releaseRes = await fetch(`https://api.github.com/repos/${repoName}/releases/latest`, {
      headers: {
        "User-Agent": GITHUB_APP_NAME,
        Authorization: `Bearer ${event.locals.user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    if (!repoRes.ok) {
      return {status: {phase: 2, message: "登録に失敗しました", formRepoName: repoName},
        repository: {name: repoName}};
    }
    const releaseData = await releaseRes.json();
    const tagname = releaseData.tag_name;

    const manifestRes = await fetch(`https://api.github.com/repos/${repoName}/contents/src/manifest.json?ref=${tagname}`, {
      headers: {
        "User-Agent": GITHUB_APP_NAME,
        Authorization: `Bearer ${event.locals.user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    if (!repoRes.ok) {
      return {status: {phase: 2, message: "登録に失敗しました", formRepoName: repoName},
        repository: {name: repoName}};
    }
    const manifestData = await manifestRes.json();

    const utf8Array = Uint8Array.from(
      Array.from(atob(manifestData.content)).map((s) => s.charCodeAt(0)),
    );
    const githubManifestContent = new TextDecoder().decode(utf8Array);
    const manifestJS = JSON.parse(githubManifestContent);

    const [dbCategory] = await db.select({id: table.category.id, name: table.category.name})
      .from(table.category)
      .where(eq(table.category.name, manifestJS.category));

    if (!dbCategory) {
      return {status: {phase: 2, message: "登録に失敗しました", formRepoName: repoName},
        repository: {name: repoName}};
    }

    const iconPath = manifestJS.icon;
    const iconRes = await fetch(`https://api.github.com/repos/${repoName}/contents/src/${iconPath}?ref=${tagname}`, {
      headers: {
        "User-Agent": GITHUB_APP_NAME,
        Authorization: `Bearer ${event.locals.user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });
    if (!iconRes.ok) {
      return {status: {phase: 2, message: "登録に失敗しました", formRepoName: repoName},
        repository: {name: repoName}};
    }
    const iconData = await iconRes.json();
    const iconUrl = iconData.download_url;

    const extension = {
      githubId: repoId,
      userId: event.locals.user.id,
      name: manifestJS.name,
      description: manifestJS.description,
      icon_url: iconUrl,
      categoryId: dbCategory.id,
      categoryName: dbCategory.name,
      version: manifestJS.version,
      updated_at: new Date(repoData.updated_at)
    };

    try {
      const [dbExtension] = await db.insert(table.extension).values(extension).returning();
      if (!dbExtension) {
        return {
          status: {phase: 2, message: "登録に失敗しました。予期せぬエラーです", formRepoName: repoName}};
      }
      return {
        status: {phase: 2, message: null},
        extension: extension, created: true};
    } catch(e) {
      console.log(e);
      return {
        status: {phase: 2, message: "登録に失敗しました。拡張機能のマニフェストに不備があります", formRepoName: repoName}};
    }
  },
};