"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { TextField } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

type message = {
  id: number;
  text: string;
};

type ChatBoxProps = {
  messageSent: message[];
};

export function ChatBox(props: ChatBoxProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const message = props.messageSent;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="w-full h-96 overflow-y-auto p-4 mb-8 border border-zinc-700 rounded-lg shadow-2xl bg-stone-50">
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
      <div ref={bottomRef} />
    </div>
  );
}

export default function Home() {
  const placeholder: message = { id: 1, text: "Hello, how are you?" };
  const [messages, setMessages] = useState<message[]>([placeholder]);
  const [inputValue, setInputValue] = useState<string>("");

  function handleSendMessage() {
    const newMessage: message = {
      id: messages.length + 1,
      text: inputValue,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue("");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ChatBox messageSent={messages} />
      <div className="flex flex-row items-center justify-between w-full p-4 border border-zinc-700 rounded-lg shadow-2xl bg-white">
        <TextField
          id="outlined-basic-textarea"
          label="Type your message here"
          variant="outlined"
          className="w-full mt-4"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <div
          className="flex border border-zinc-700 rounded-lg ml-2 w-8 h-8 items-center justify-center"
          onClick={handleSendMessage}
        >
          <SendRoundedIcon />
        </div>
      </div>
    </div>
  );
}
