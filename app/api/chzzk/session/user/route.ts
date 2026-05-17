import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.CHZZK_CLIENT_ID;
  const clientSecret = process.env.CHZZK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Missing CHZZK_CLIENT_ID or CHZZK_CLIENT_SECRET" },
      { status: 500 },
    );
  }

  const res = await fetch(
    "https://openapi.chzzk.naver.com/open/v1/sessions/auth/client",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Client-Secret": clientSecret,
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
