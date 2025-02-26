"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/state/user.store";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token } = useUserStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!token) return;
    const loadChatHistory = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ai/history`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to load chat history');
        
        const data = await response.json();
        setMessages(data.messages.map((msg: any) => ({
          role: msg.role === 'assistant' ? 'ai' : 'user',
          content: msg.content
        })));
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadChatHistory();
  }, [token]);

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
            'Authorization': `Bearer ${token}`
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

  const renderMessageContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const styles = `
  .messages-container {
    max-height: calc(600px - 4rem - 4rem);
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

  if (isInitialLoading) {
    return (
      <Card className="h-[400px]">
        <CardHeader className="border-b p-3 bg-primary">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[calc(670px-3.75rem)]">
          <div className="flex-grow p-4">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-16 w-[70%] rounded-lg" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 bg-muted mt-auto border-t">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 flex-grow" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px]">
      <CardHeader className="border-b p-3 bg-primary">
        <CardTitle className="text-xl font-bold text-primary-foreground">
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[calc(100%-3.75rem)]">
        <div className="flex-grow overflow-y-auto p-4 messages-container">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center px-4"
              >
                <div className="bg-primary/10 rounded-full p-4 mb-3">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  Welcome to Verideck AI Chat
                </h2>
                <p className="text-sm text-muted-foreground">
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
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-3`}
                >
                  <div
                    className={`flex items-start max-w-[70%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar className="w-6 h-6">
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
                      className={`mx-2 p-2 rounded-lg text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 bg-muted mt-auto border-t">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-grow text-sm"
            />
            <Button onClick={handleSendMessage} disabled={isLoading} size="sm">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 