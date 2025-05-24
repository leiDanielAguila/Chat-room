"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { TextField } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { v4 as uuidv4 } from "uuid";
import { UUID } from "crypto";

type message = {
  id: string;
  timeSent: string;
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
          <div className="flex flex-row items-center">
            <time className="pl-2 ml-2 font-bold text-gray-800">{`${message.timeSent} sent.`}</time>
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
  const placeholder: message = {
    id: uuidv4(),
    timeSent: "12:24 PM",
    text: "Hello, how are you?",
  };
  
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<message[]>([placeholder]);

  function handleSendMessage() { 
    if (newMessage.trim() === "") {
      return;
    }

    const messageModel: message = {
      id: uuidv4(),
      timeSent: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: newMessage,
    };

    try {            
      setMessages((prevMessages) => [...prevMessages, messageModel]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
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
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
