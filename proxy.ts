import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const code = nextUrl.searchParams.get("code");
  const state = nextUrl.searchParams.get("state");

  const accessTokenCookie = req.cookies.get("chzzk_access_token")?.value;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const clientId = process.env.CHZZK_CLIENT_ID || "";

  const getAccessToken = async () => {
    const res = await fetch("https://openapi.chzzk.naver.com/auth/v1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grantType: "authorization_code",
        clientId: process.env.CHZZK_CLIENT_ID,
        clientSecret: process.env.CHZZK_CLIENT_SECRET,
        code,
        state,
      }),
    });

    const data = await res.json();

    return data;
  };

  const hasAuthParams = Boolean(code && state);

  if (accessTokenCookie) {
    return NextResponse.next();
  }

  if (hasAuthParams) {
    const tokenData = await getAccessToken();
    const accessToken =
      tokenData?.content?.accessToken ?? tokenData?.accessToken;

    if (accessToken) {
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.set("chzzk_access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: tokenData?.content?.expiresIn ?? 60 * 60 * 24,
      });
      return response;
    }
  }

  const authUrl = new URL(
    `https://chzzk.naver.com/account-interlock?clientId=${clientId}&redirectUri=${baseUrl}&state=init`,
  );

  return NextResponse.redirect(authUrl);
}

export const config = {
  matcher: ["/"],
};
