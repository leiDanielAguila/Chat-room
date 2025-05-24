"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { TextField } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { v4 as uuidv4 } from "uuid";
import { UUID } from "crypto";

export function ChatBox({ messageSent }: { messageSent: string[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const message = messageSent;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="w-full h-96 overflow-y-auto p-4 mb-8 border border-zinc-700 rounded-lg shadow-2xl bg-stone-50">
      {/* chat messages goes here */}
      {message.map((message, index) => (
        <div key={index} className="mb-2">
          <div className="flex flex-row items-center">
            {/* <time className="pl-2 ml-2 font-bold text-gray-800">{`${message.timeSent} sent.`}</time> */}
          </div>
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: 1,
            }}
          >
            {message}
          </Box>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default function Home() {
  const placeholder = "Hello, How are you?";

  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([placeholder]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("connected");
    };

    ws.onclose = () => {
      setConnectionStatus("disconnected");
    };

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(`{"event":"ping"}`);
      }
    }, 29000);

    return () => {
      clearInterval(pingInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      return;
    }

    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(newMessage);
      }
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ChatBox messageSent={messages} />
      <div className="flex flex-row items-center justify-between w-full p-4 border border-zinc-700 rounded-lg shadow-2xl bg-white">
        <form onSubmit={handleSendMessage} className="flex flex-row w-full">
          <TextField
            id="outlined-basic-textarea"
            label="Type your message here"
            variant="outlined"
            className="w-full mt-4"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage;
              }
            }}
          />
          <button
            className="flex rounded-lg ml-2 w-8 h-8 items-center justify-center"
            type="submit"
          >
            <SendRoundedIcon />
          </button>
        </form>
      </div>
    </div>
  );
}
