import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/server/auth";
import { github, createGitHubUser, getUserFromGitHubId, setGitHubToken } from "$lib/server/auth";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("github_oauth_state") ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	// eslint-disable-next-line
	} catch (e) {
		return new Response(null, {
			status: 400
		});
	}
	const githubToken = tokens.accessToken()

	const githubUserResponse = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${githubToken}`
		}
	});
	const githubUser = await githubUserResponse.json();
	const githubUserId = githubUser.id;
	const githubUsername = githubUser.login;
	const githubAvatarUrl = githubUser.avatar_url;

	// TODO: Replace this with your own DB query.
	const existingUser = await getUserFromGitHubId(githubUserId);

	if (existingUser?.githubId) {
		setGitHubToken(existingUser.githubId, githubToken)
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/dev/dashboard"
			}
		});
	}

	// TODO: Replace this with your own DB query.
	const user = await createGitHubUser(githubUserId, githubUsername, githubAvatarUrl, githubToken);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/dev/dashboard"
		}
	});
}