import { redirect } from "@sveltejs/kit";

import { generateState } from "arctic";
import { github } from "$lib/server/auth";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  return {
    user: event.locals.user
  };
};

export const actions: Actions = {
  login_github: async ({cookies}) => {
    const state = generateState();
    const url = github.createAuthorizationURL(state, []);

    cookies.set("github_oauth_state", state, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax"
    });
    return redirect(302, url.toString());
  }
};