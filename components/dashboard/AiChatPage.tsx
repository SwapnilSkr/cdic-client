"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const prevMessagesLength = useRef(messages.length);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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

  useEffect(() => {
    // Scroll to bottom on any message change
    scrollToBottom();
    prevMessagesLength.current = messages.length;
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

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

      if (!response.ok) throw new Error("Failed to get AI response");

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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
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
            p: ({ node, ...props }) => (
              <p {...props} className="mb-2 last:mb-0" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc pl-5 mb-2" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal pl-5 mb-2" />
            ),
            li: ({ node, ...props }) => <li {...props} className="mb-1" />,
            h3: ({ node, ...props }) => (
              <h3 {...props} className="text-lg font-semibold mb-2 mt-3" />
            ),
            h4: ({ node, ...props }) => (
              <h4 {...props} className="text-base font-semibold mb-1 mt-2" />
            ),
            code: ({
              node,
              inline,
              ...props
            }: {
              node?: any;
              inline?: boolean;
            } & React.HTMLAttributes<HTMLElement>) => (
              <code
                {...props}
                className={
                  inline
                    ? "bg-muted px-1 py-0.5 rounded text-xs"
                    : "block bg-muted p-2 rounded-md text-xs my-2 overflow-x-auto"
                }
              />
            ),
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
      const hasPosts = content.includes("Sample Posts:");
      const hasAuthors = content.includes("Creator Information:");
      const hasStats = content.includes("Platform Statistics Overview:");

      let introText = "";
      const postsData: any[] = [];
      const authorsData: any[] = [];
      let statsData = "";

      const introMatch = content.match(
        /^(.*?)(?:Sample Posts:|Creator Information:|Platform Statistics Overview:|$)/s
      );
      if (introMatch) introText = introMatch[1].trim();

      if (hasPosts) {
        const postsSection = content.match(
          /Sample Posts:(.*?)(?:Creator Information:|Platform Statistics Overview:|$)/s
        );
        if (postsSection) {
          const postsText = postsSection[1];
          const postMatches = postsText.matchAll(
            /(\d+)\.\s*(.*?)(?=\d+\.|$)/gs
          );
          for (const match of postMatches) {
            const postText = match[2].trim();
            const platformMatch = postText.match(/^(.*?)\s+post\s+from/);
            const dateMatch = postText.match(/from\s+(.+)$/m);
            const contentMatch = postText.match(/Content:\s+"(.*?)"/);
            const engagementMatch = postText.match(
              /Engagement:\s+(\d+)\s+interactions/
            );

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
          /Creator Information:(.*?)(?:Sample Posts:|Platform Statistics Overview:|$)/s
        );
        if (authorsSection) {
          const authorsText = authorsSection[1];
          const authorMatches = authorsText.matchAll(
            /(\d+)\.\s*(.*?)(?=\d+\.|$)/gs
          );
          for (const match of authorMatches) {
            const authorText = match[2].trim();
            const usernameMatch = authorText.match(/(.*?)\s*\(/);
            const platformMatch = authorText.match(/\((.*?)\)/);
            const followersMatch = authorText.match(/Followers:\s+(.*?)$/m);
            const postsMatch = authorText.match(/Total Posts:\s+(\d+)/);
            const avgEngagementMatch = authorText.match(
              /Avg Engagement:\s+([\d.]+)/
            );

            authorsData.push({
              username: usernameMatch ? usernameMatch[1].trim() : "Unknown",
              platform: platformMatch ? platformMatch[1].trim() : "Unknown",
              followers: followersMatch ? followersMatch[1].trim() : "Unknown",
              totalPosts: postsMatch ? postsMatch[1] : "0",
              avgEngagement: avgEngagementMatch ? avgEngagementMatch[1] : "N/A",
            });
          }
        }
      }

      if (hasStats) {
        const statsSection = content.match(
          /Platform Statistics Overview:(.*)$/s
        );
        if (statsSection) statsData = statsSection[1].trim();
      }

      return { introText, postsData, authorsData, statsData };
    };

    const { introText, postsData, authorsData, statsData } =
      parseStructuredContent();

    return (
      <div className="space-y-4">
        {introText && <ReactMarkdown>{introText}</ReactMarkdown>}
        {postsData.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Related Posts
            </h4>
            {postsData.map((post, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-3 border shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="capitalize">
                    {post.platform}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.date}
                  </span>
                </div>
                <p className="text-sm mb-2 line-clamp-2">{post.content}</p>
                <div className="text-xs text-muted-foreground">
                  Engagement: {post.engagement}
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
              <div
                key={index}
                className="bg-card rounded-lg p-3 border shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {author.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">
                      {author.username}
                    </span>
                  </div>
                  <Badge variant="outline">{author.platform}</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Followers: {author.followers}</p>
                  <p>Total Posts: {author.totalPosts}</p>
                  <p>Avg Engagement: {author.avgEngagement}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {statsData && (
          <div className="bg-card rounded-lg p-3 border shadow-sm">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Statistics
            </h4>
            <ReactMarkdown>{statsData}</ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

  if (isInitialLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b p-3 bg-primary flex-shrink-0">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex-grow p-4 overflow-hidden">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-20 w-3/4 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
        <div className="p-3 bg-muted border-t flex-shrink-0">
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b p-3 bg-primary flex-shrink-0">
        <CardTitle className="text-lg font-bold text-primary-foreground">
          AI Fact-Check Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto p-4 space-y-4 messages-container"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center px-4"
              >
                <div className="bg-primary/10 rounded-full p-3 mb-3 inline-block">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-lg font-semibold mb-2">
                  Welcome to Verideck AI Fact Checking Assistant
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Get instant insights and assistance for your media monitoring
                  tasks.
                </p>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    } max-w-[80%]`}
                  >
                    <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
                      <AvatarFallback
                        className={
                          message.role === "ai"
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                      >
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
                      className={`p-3 rounded-lg text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border shadow-sm"
                      }`}
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
        <div className="p-3 bg-muted border-t flex-shrink-0 mt-auto">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-grow text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
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
          width: 8px;
        }
        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .messages-container::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.5);
          border-radius: 4px;
        }
      `}</style>
    </Card>
  );
}
