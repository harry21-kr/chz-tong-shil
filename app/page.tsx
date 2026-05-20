import { cookies } from "next/headers";
import SocketClient from "./SocketClient";

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("chzzk_access_token")?.value;

  const createClientSession = async () => {
    const res = await fetch(`${baseUrl}/api/chzzk/session/client`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

  const clientSession = await createClientSession();
  const clientSessionList = await getUserSessionList();

  return (
    <main>
      <h1>Socket.IO 연결</h1>
      <SocketClient
        accessToken={accessToken ?? ""}
        sessionURL={clientSession.content.url}
        clientSessionList={clientSessionList.content.data}
      />
    </main>
  );
}
