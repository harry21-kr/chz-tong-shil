"use client";

import { ChatEvent } from "@/types/session/event";
import { SystemEvent } from "@/types/session/system";
import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";

interface SocketClientProps {
  sessionURL: string;
  accessToken: string;
}

const socketOption = {
  reconnection: false,
  "force new connection": true,
  "connect timeout": 3000,
  transports: ["websocket"],
};

export default function SocketClient({
  sessionURL,
  accessToken,
}: SocketClientProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const [status, setStatus] = useState("connecting");

  const [sessionKey, setSessionKey] = useState("");

  const [messages, setMessages] = useState<ChatEvent[]>([]);

  const onConnected = (socket: SocketIOClient.Socket) => {
    setStatus("connected");

    socket.on("SYSTEM", (data: string) => {
      const parsedData: SystemEvent = JSON.parse(data);
      console.log("Received SYSTEM event:", parsedData);
      switch (parsedData.type) {
        case "connected":
          setSessionKey(parsedData.data.sessionKey);
          break;
      }
    });

    socket.on("CHAT", (data: string) => {
      const parsedData: ChatEvent = JSON.parse(data);
      console.log("Received CHAT event:", parsedData);
      setMessages((prev) => [...prev, parsedData]);
    });
  };

  const subscribeToChat = useCallback(async () => {
    if (!sessionKey) return;
    const res = await fetch(`${baseUrl}/api/chzzk/session/subscribe/chat`, {
      method: "POST",
      headers: {
        "Session-Key": sessionKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Subscribe to chat response:", res);
    return await res.json();
  }, [accessToken, baseUrl, sessionKey]);

  useEffect(() => {
    const socket = io(sessionURL, socketOption);

    socket.on("connect", () => {
      onConnected(socket);
    });

    socket.on("connect_error", () => {
      setStatus("connect_error");
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionURL]);

  useEffect(() => {
    subscribeToChat();
  }, [subscribeToChat]);

  return (
    <div>
      <p>Session URL: {sessionURL}</p>
      <p>Socket status: {status}</p>
      <p>채팅창</p>
      {messages.map((message, index) => (
        <div key={index}>
          <p>{message.content}</p>
          <p>{message.profile.nickname}</p>
        </div>
      ))}
    </div>
  );
}
