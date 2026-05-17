import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sessionKey = req.headers.get("Session-Key");
  const authorization = req.headers.get("Authorization");

  if (!sessionKey || !authorization) {
    return NextResponse.json(
      { error: "Missing Session-Key or Authorization header" },
      { status: 400 },
    );
  }

  const res = await fetch(
    `https://openapi.chzzk.naver.com/open/v1/sessions/events/subscribe/chat?sessionKey=${sessionKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: "Get user session failed", detail: data },
      { status: res.status },
    );
  }

  return NextResponse.json(data);
}
