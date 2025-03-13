import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
export async function run_seed() {
  const categories = [
    {id: 1, name: "efficiency", nameJP: "仕事効率化"},
    {id: 2, name: "communication", nameJP: "コミュニケーション"},
    {id: 3, name: "developper", nameJP: "デベロッパーツール"},
    {id: 4, name: "lifestyle", nameJP: "ライフスタイル"},
    {id: 5, name: "social", nameJP: "ソーシャル"},
    {id: 6, name: "infomatic", nameJP: "情報"},
    {id: 7, name: "hobby", nameJP: "趣味"},
    {id: 99, name: "other", nameJP: "その他"},
  ];
  const users = [
    {id: 1, githubId: 1, username: "kaori"},
    {id: 2, githubId: 2, username: "hazuki"},
    {id: 3, githubId: 3, username: "keisuke"},
    {id: 4, githubId: 4, username: "hamada"},
  ];

  const extensions = [
    {
      id: 1, githubId: 1, userId: 1, name: "aa", description: "bb", categoryId: 1, version: "1.0", icon_url: ""
    },
    {
      id: 2, githubId: 2, userId: 1, name: "ab", description: "bb", categoryId: 1, version: "1.0", icon_url: ""
    },
    {
      id: 3, githubId: 3, userId: 2, name: "afv", description: "bb", categoryId: 1, version: "1.0", icon_url: ""
    },
    {
      id: 4, githubId: 4, userId: 2, name: "aaarg", description: "bb", categoryId: 2, version: "1.0", icon_url: ""
    },
    {
      id: 5, githubId: 5, userId: 2, name: "aaga", description: "bb", categoryId: 3, version: "1.0", icon_url: ""
    },
    {
      id: 6, githubId: 6, userId: 3, name: "4gaa", description: "bb", categoryId: 3, version: "1.0", icon_url: ""
    },
    {
      id: 7, githubId: 7, userId: 3, name: "afwa", description: "bb", categoryId: 5, version: "1.0", icon_url: ""
    },
    {
      id: 8, githubId: 8, userId: 4, name: "afffffa", description: "bb", categoryId: 5, version: "1.0", icon_url: ""
    },
    {
      id: 9, githubId: 9, userId: 4, name: "3faa", description: "bb", categoryId: 7, version: "1.0", icon_url: ""
    },
    {
      id: 10, githubId: 10, userId: 4, name: "33f3faa", description: "bb", categoryId: 99, version: "1.0", icon_url: ""
    },
  ];
  const [dbRes] = await db
    .select({id: table.category.id})
    .from(table.category)
    .where(eq(table.category.id, 1));
  if (dbRes) {
    return 1;
  }
  await db.insert(table.category).values(categories);
  await db.insert(table.user).values(users);
  await db.insert(table.extension).values(extensions);
  return 0;
}