"use client";
import Image from "next/image";
import { useState } from "react";
import { Box } from "@mui/material";
import { TextField } from "@mui/material";

type message = {
  id: number;
  text: string;
};

type ChatBoxProps = {
  messageSent: message[];
};

export function ChatBox(props: ChatBoxProps) {
  // expects type message[]
  const message = props.messageSent;
  return (
    <div className="w-full h-96 overflow-y-auto p-4 mb-8 border border-pink-300 rounded-lg shadow-2xl bg-rose-200">
      {/* chat messages goes here */}
      {message.map((message) => (
        <div key={message.id} className="mb-2">
          <div className="flex items-center">
            <span className="font-bold text-gray-800">{`User ${message.id}`}</span>
          </div>
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "8px",
              boxShadow: 1,
            }}
          >
            {message.text}
          </Box>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const placeholder: message = { id: 1, text: "Hello, how are you?" };
  const [messages, setMessages] = useState<message[]>([placeholder]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ChatBox messageSent={messages} />
      <div className="flex flex-row items-center justify-between w-full p-4 border-pink-300 rounded-lg shadow-2xl bg-rose-200">
        <TextField
          id="outlined-basic"
          label="Type your message here"
          variant="outlined"
          className="w-full mt-4"
        />
      </div>
    </div>
  );
}
