"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, MessageSquare, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/state/user.store";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";

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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { token } = useUserStore();

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
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
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to load chat history");

        const data = await response.json();
        setMessages(
          data.messages.map((msg: any) => ({
            role: msg.role === "assistant" ? "ai" : "user",
            content: msg.content,
          }))
        );
      } catch (error) {
        console.error("Error loading chat history:", error);
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              messages: messages.concat(userMessage).map((msg) => ({
                role: msg.role === "ai" ? "assistant" : msg.role,
                content: msg.content,
              })),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to get AI response");
        }

        const data = await response.json();
        const aiMessage: Message = {
          role: "ai",
          content: data.message.content,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error:", error);
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

  const AiMessageContent = ({ content }: { content: string }) => {
    const formatContentForDisplay = (content: string) => {
      if (
        content.includes("Platform:") ||
        content.includes("Engagement:") ||
        content.includes("followers") ||
        content.includes("incident")
      ) {
        return <FormattedAiResponse content={content} />;
      }
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline inline-flex items-center"
              >
                {props.children}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            ),
            p: ({ node, ...props }) => <p {...props} className="mb-3 last:mb-0" />,
            ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-3" />,
            ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-3" />,
            li: ({ node, ...props }) => <li {...props} className="mb-1" />,
            h3: ({ node, ...props }) => (
              <h3 {...props} className="text-base font-semibold mb-2 mt-4" />
            ),
            h4: ({ node, ...props }) => (
              <h4 {...props} className="text-sm font-semibold mb-1 mt-3" />
            ),
            code: ({ node, ...props }) => {
              const isInline =
                props.className &&
                typeof props.className === "string" &&
                props.className.includes("inline");
              return isInline ? (
                <code {...props} className="bg-muted px-1 py-0.5 rounded text-xs" />
              ) : (
                <code
                  {...props}
                  className="block bg-muted p-2 rounded-md text-xs my-2 overflow-x-auto"
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      );
    };
    return formatContentForDisplay(content);
  };

  const FormattedAiResponse = ({ content }: { content: string }) => {
    const parseStructuredContent = () => {
      const hasPosts =
        content.includes("Sample Posts:") ||
        content.includes("Platform:") ||
        content.includes("Content:");
      const hasAuthors =
        content.includes("Creator Information:") || content.includes("followers");
      const hasStats =
        content.includes("Statistics:") || content.includes("Distribution:");

      let introText = "";
      const postsData = [];
      const authorsData = [];
      let statsData = "";

      const introMatch = content.match(
        /^(.*?)(?:Sample Posts:|Creator Information:|Statistics:)/s
      );
      if (introMatch) {
        introText = introMatch[1].trim();
      } else {
        introText = content;
      }

      if (hasPosts) {
        const postsSection = content.match(
          /Sample Posts:(.*?)(?:Creator Information:|Statistics:|$)/s
        );
        if (postsSection) {
          const postsText = postsSection[1];
          const postMatches = Array.from(
            postsText.match(/(\d+)\.(.*?)(?=\d+\.|$)/gs) || []
          )
            .map((match) => {
              const regex = /(\d+)\.(.*?)(?=\d+\.|$)/;
              return regex.exec(match);
            })
            .filter(Boolean);

          for (const match of postMatches) {
            if (!match) continue;
            const postText = match[2].trim();
            const platformMatch = postText.match(/Platform: (.*?)(?:,|$)/);
            const dateMatch = postText.match(/from (.*?)$/m);
            const contentMatch = postText.match(/Content: "(.*?)"/);
            const engagementMatch = postText.match(/Engagement: (.*?) interactions/);

            postsData.push({
              platform: platformMatch ? platformMatch[1].trim() : "Unknown",
              date: dateMatch ? dateMatch[1].trim() : "Unknown date",
              content: contentMatch ? contentMatch[1].trim() : "No content",
              engagement: engagementMatch ? engagementMatch[1].trim() : "0",
            });
          }
        }
      }

      if (hasAuthors) {
        const authorsSection = content.match(
          /Creator Information:(.*?)(?:Sample Posts:|Statistics:|$)/s
        );
        if (authorsSection) {
          const authorsText = authorsSection[1];
          const authorMatches = authorsText.matchAll(/(\d+)\.(.*?)(?=\d+\.|$)/gs);
          for (const match of authorMatches) {
            const authorText = match[2].trim();
            const usernameMatch = authorText.match(/(.*?)\s*\(/);
            const platformMatch = authorText.match(/\((.*?)\)/);
            const followersMatch = authorText.match(/Followers: (.*?)$/m);
            const recentPostMatch = authorText.match(/Recent post: "(.*?)"/);

            authorsData.push({
              username: usernameMatch ? usernameMatch[1].trim() : "Unknown user",
              platform: platformMatch ? platformMatch[1].trim() : "Unknown platform",
              followers: followersMatch ? followersMatch[1].trim() : "Unknown",
              recentPost: recentPostMatch ? recentPostMatch[1].trim() : null,
            });
          }
        }
      }

      if (hasStats) {
        const statsSection = content.match(
          /Statistics:(.*?)(?:Sample Posts:|Creator Information:|$)/s
        );
        if (statsSection) {
          statsData = statsSection[1].trim();
        }
      }

      return { introText, postsData, authorsData, statsData };
    };

    const { introText, postsData, authorsData, statsData } = parseStructuredContent();

    return (
      <div className="space-y-3 w-full h-[400px]">
        {introText && (
          <div className="text-sm">
            <ReactMarkdown>{introText}</ReactMarkdown>
          </div>
        )}
        {postsData.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Related Posts
            </h4>
            {postsData.map((post, index) => (
              <div key={index} className="bg-background rounded-lg p-3 border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="capitalize">
                    {post.platform}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <p className="text-sm mb-2">{post.content}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Engagement: {post.engagement}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {authorsData.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Content Creators
            </h4>
            {authorsData.map((author, index) => (
              <div key={index} className="bg-background rounded-lg p-3 border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {author.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{author.username}</span>
                  </div>
                  <Badge variant="outline">{author.platform}</Badge>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-muted-foreground">Followers: {author.followers}</span>
                </div>
                {author.recentPost && (
                  <div className="mt-2 text-sm border-t pt-2">
                    <span className="block text-xs text-muted-foreground mb-1">
                      Recent post:
                    </span>
                    <p className="text-xs">{author.recentPost}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {statsData && (
          <div className="bg-background rounded-lg p-3 border shadow-sm">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Statistics
            </h4>
            <div className="text-sm">
              <ReactMarkdown>{statsData}</ReactMarkdown>
            </div>
          </div>
        )}
        {!introText && postsData.length === 0 && authorsData.length === 0 && !statsData && (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
    );
  };

  if (isInitialLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="h-16 border-b p-3 bg-primary flex-shrink-0">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex-grow p-4 overflow-hidden">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-16 w-[70%] rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
        <div className="h-20 p-3 bg-muted border-t flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 flex-grow" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="h-16 border-b p-3 bg-primary flex-shrink-0">
        <CardTitle className="text-xl font-bold text-primary-foreground">
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto p-4 messages-container min-h-0"
        >
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
                <h2 className="text-xl font-bold mb-2">Welcome to Verideck AI Chat</h2>
                <p className="text-sm text-muted-foreground">
                  Get instant insights and assistance for your media monitoring tasks.
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
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`flex items-start ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    } ${message.role === "user" ? "max-w-[75%]" : "max-w-[85%]"}`}
                  >
                    <Avatar
                      className={`w-8 h-8 mt-1 ${
                        message.role === "user" ? "ml-2" : "mr-2"
                      }`}
                    >
                      <AvatarFallback
                        className={
                          message.role === "ai" ? "bg-primary text-primary-foreground" : ""
                        }
                      >
                        {message.role === "user" ? "U" : "AI"}
                      </AvatarFallback>
                      <AvatarImage
                        src={message.role === "user" ? "/user-avatar.png" : "/ai-avatar.png"}
                      />
                    </Avatar>
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border shadow-sm"
                      } ${message.role === "ai" ? "w-full" : ""}`}
                    >
                      {message.role === "user" ? (
                        message.content
                      ) : (
                        <AiMessageContent content={message.content} />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="h-20 p-3 bg-muted border-t flex-shrink-0">
          <div className="flex items-center space-x-2 h-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-grow text-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              size="sm"
              className="px-3"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <style jsx global>{`
        .messages-container {
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
      `}</style>
    </Card>
  );
}