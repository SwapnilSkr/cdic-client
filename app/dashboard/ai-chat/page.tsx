"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, MessageSquare } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, []); // Updated useEffect dependency

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = { role: "user", content: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages.concat(userMessage).map(msg => ({
              role: msg.role === 'ai' ? 'assistant' : msg.role,
              content: msg.content
            }))
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        const aiMessage: Message = {
          role: "ai",
          content: data.message.content,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage: Message = {
          role: "ai",
          content: "Sorry, I encountered an error. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const styles = `
  .messages-container {
    max-height: calc(600px - 4rem - 4rem); /* Subtracting header and input area heights */
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  }
  .messages-container::-webkit-scrollbar {
    width: 6px;
  }
  .messages-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .messages-container::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: transparent;
  }
`;

  return (
    <>
      <style jsx>{styles}</style>
      <div className="container mx-auto px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col bg-background rounded-lg shadow-lg overflow-hidden h-[600px] md:h-[490px] lg:h-[540px]"
        >
          <div className="bg-primary p-4">
            <h1 className="text-2xl font-bold text-primary-foreground">
              AI Assistant
            </h1>
          </div>
          <div className="flex-grow overflow-y-auto p-4 messages-container">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center text-center px-4"
                >
                  <div className="bg-primary/10 rounded-full p-6 mb-4">
                    <MessageSquare className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome to Media Monitor AI Chat
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Get instant insights and assistance for your media
                    monitoring tasks.
                  </p>
                </motion.div>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                  >
                    <div
                      className={`flex items-start max-w-[70%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.role === "user" ? "U" : "AI"}
                        </AvatarFallback>
                        <AvatarImage
                          src={
                            message.role === "user"
                              ? "/user-avatar.png"
                              : "/ai-avatar.png"
                          }
                        />
                      </Avatar>
                      <div
                        className={`mx-2 p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-muted">
            <div className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-grow"
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
