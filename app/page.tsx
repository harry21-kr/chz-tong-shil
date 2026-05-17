import { redirect } from "next/navigation";
import SocketClient from "./SocketClient";

type AuthTokenResponse = {
  code: number;
  message: string;
  content: AuthTokenContent;
};

type AuthTokenContent = {
  refreshToken: string;
  accessToken: string;
  expiresIn: number;
  scope: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: { code?: string; state?: string };
}) {
  const clientId = process.env.CHZZK_CLIENT_ID || "";

  const { code, state } = await searchParams;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!code || !state) {
    redirect(
      `https://chzzk.naver.com/account-interlock?clientId=${clientId}&redirectUri=${baseUrl}&state=init`,
    );
  }

  const createUserSession = async () => {
    const res = await fetch(`${baseUrl}/api/chzzk/session/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  };

  const getAccessTokenRes = async () => {
    const res = await fetch(`${baseUrl}/api/chzzk/token`, {
      method: "POST",
      body: JSON.stringify({ code, state }),
    });

    return await res.json();
  };

  const getUserSessionList = async () => {
    const res = await fetch(`${baseUrl}/api/chzzk/session/client`, {
      method: "GET",
    });
    const data = await res.json();
    return data;
  };

  const clientSession = await createUserSession();
  const clientSessionList = await getUserSessionList();
  const accessToken = await getAccessTokenRes();

  console.log(accessToken);

  return (
    <main>
      <h1>Socket.IO 연결</h1>
      <SocketClient
        accessToken={accessToken.content.accessToken}
        sessionURL={clientSession.content.url}
        clientSessionList={clientSessionList.content.data}
      />
    </main>
  );
}
