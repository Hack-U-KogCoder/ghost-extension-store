import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import clipGhost from "$lib/assets/clipBoard.png";
import searchGhost from "$lib/assets/search.png";
import paintGhost from "$lib/assets/paint.png";
import shortCutGhost from "$lib/assets/shortCut.png";
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
      id: 1, 
      githubId: 1, 
      userId: 1, 
      name: "クリップボード", 
      description: "コピー&ペーストを行えます。クリップボードの履歴をさかのぼることもできます。", 
      categoryId: 1, 
      version: "0.0", 
      icon_url: clipGhost
    },
    {
      id: 2,
      githubId: 2,
      userId: 1,
      name: "検索", 
      description: "わざわざ検索エンジンを起動させなくても調べ物をすることができます。", 
      categoryId: 1, 
      version: "0.0", 
      icon_url: searchGhost
    },
    {
      id: 3, 
      githubId: 3,
      userId: 3, 
      name: "絵描き(仮)", 
      description: "絵をかきます。筆を充電コードって呼ばないでください。", 
      categoryId: 7, 
      version: "0.0", 
      icon_url: paintGhost
    },
    {
      id: 4, 
      githubId: 4, 
      userId: 4, 
      name: "ツール使用", 
      description: "他のユーティリティツールを使いたくなった時、このゴーストに触れれば、それらの機能を使用することができます。", 
      categoryId: 1, 
      version: "0.0", 
      icon_url: shortCutGhost
    },
    {
      id: 5, 
      githubId: 5, 
      userId: 1, 
      name: "ファイルオープン", 
      description: "あらかじめ設定しておいたファイルをゴーストから開くことができます。", 
      categoryId: 1, 
      version: "0.0", 
      icon_url: ""
    },
    {
      id: 6, 
      githubId: 6, 
      userId: 1, 
      name: "音量調節", 
      description: "ゴーストから音量を調節できます。", 
      categoryId: 1, 
      version: "0.0", 
      icon_url: ""
    },
    {
      id: 7, 
      githubId: 7, 
      userId: 1, 
      name: "明るさ調節", 
      description: "ゴーストから画面の明るさを調節できます。", 
      categoryId: 1, 
      version: "0.0", 
      icon_url: ""
    },
    {
      id: 8, 
      githubId: 8, 
      userId: 1, 
      name: "拡大鏡", 
      description: "ゴーストをクリックすると発動し、カーソルを翳している部分が拡大して表示されます。", 
      categoryId: 1, 
      version: "0.0", 
      icon_url: ""
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