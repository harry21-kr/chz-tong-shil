import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code, state } = await req.json();

  if (!code || !state) {
    return NextResponse.json(
      { error: "code and state are required" },
      { status: 400 },
    );
  }

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

  if (!res.ok) {
    return NextResponse.json(
      { error: "token exchange failed", detail: data },
      { status: res.status },
    );
  }

  return NextResponse.json(data);
}
