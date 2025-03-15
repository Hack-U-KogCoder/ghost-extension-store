import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * 画像ファイルを読み込んで返す
 * @returns png形式の画像データ
 */
export const GET: RequestHandler = async () => {
  const image = await fetch("https://raw.githubusercontent.com/Hack-U-KogCoder/ghost-extension-store/refs/heads/develop/src/lib/assets/favicon.ico", {
    method: "GET",
    headers: {
    }
  }).then(async (response) => {
    if (!response.ok) {
      throw error(500, "Internal Server Error");
    }
    return await response.blob();
  });

  const response = new Response(image);
  response.headers.set("Content-Type", "image/png");
  return response;
};