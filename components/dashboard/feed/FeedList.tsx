/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  Eye,
  MessageSquare,
  Flag,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type FeedItem } from "@/utils/mockFeedItems";

const ITEMS_PER_PAGE = 5;

// Update the platformIcons definition to use proper type safety
type PlatformIconType = {
  [key: string]: React.ComponentType<any>;
};

const platformIcons: PlatformIconType = {
  Facebook: Facebook,
  Instagram: Instagram,
  Youtube: Youtube,
  Twitter: Twitter,
  Reddit: MessageCircle,
};

// Add this helper function near the top of the file, after the platformIcons definition
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function FeedList({ filters }: { filters: any }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setItems(data.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleFlag = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, flagged: !item.flagged } : item
      )
    );
  };

  // Apply filters (this is a simplified example)
  const filteredItems = items.filter(
    (item) =>
      (!filters.platforms.length ||
        filters.platforms.includes(item.platform)) &&
      (!filters.sentiment || item.sentiment === filters.sentiment) &&
      (!filters.flagStatus ||
        (filters.flagStatus === "flagged") === item.flagged)
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 10;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    // First page button
    if (start > 1) {
      buttons.push(
        <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)}>
          1
        </Button>
      );
      if (start > 2) {
        buttons.push(<span>...</span>);
      }
    }

    // Numbered buttons
    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    // Last page button
    if (end < totalPages) {
      if (end < totalPages - 1) {
        buttons.push(<span>...</span>);
      }
      buttons.push(
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2">
        {buttons.map((button, index) => (
          <div key={`page-${index}`}>{button}</div>
        ))}
      </div>
    );
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "text":
        return <MessageSquare className="h-4 w-4" />;
      case "image":
        return <Eye className="h-4 w-4" />;
      case "video":
        return <Youtube className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Show loading state
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Show error state
  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <AnimatePresence>
        {paginatedItems.map((item) => {
          const PlatformIcon = platformIcons[item.platform] || MessageCircle;
          const engagement = item.engagement || {
            likes: 0,
            views: 0,
            comments: 0,
          };

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-4">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center">
                    <PlatformIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                    {getContentTypeIcon(item.platform)}
                    <span className="text-sm text-muted-foreground">
                      {item.platform}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(item.timestamp)}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarImage
                        src={item.author?.image || ""}
                        alt={item.author?.name || "Anonymous"}
                      />
                      <AvatarFallback>
                        {item.author?.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">
                      {item.author?.name || "Anonymous"}
                    </span>
                  </div>
                  <p className="mb-2">{item.content}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <span className="flex items-center text-sm text-muted-foreground">
                        <ThumbsUp className="mr-1 h-4 w-4" /> {engagement.likes}
                      </span>
                      <span className="flex items-center text-sm text-muted-foreground">
                        <Eye className="mr-1 h-4 w-4" /> {engagement.views}
                      </span>
                      <span className="flex items-center text-sm text-muted-foreground">
                        <MessageSquare className="mr-1 h-4 w-4" />{" "}
                        {engagement.comments}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedItem(item)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Post Details</DialogTitle>
                          </DialogHeader>
                          {selectedItem && (
                            <div className="mt-4">
                              <div className="flex items-center mb-4">
                                <Avatar className="h-12 w-12 mr-4">
                                  <AvatarImage
                                    src={selectedItem.author?.image || ""}
                                    alt={
                                      selectedItem.author?.name || "Anonymous"
                                    }
                                  />
                                  <AvatarFallback>
                                    {selectedItem.author?.name?.charAt(0) ||
                                      "A"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">
                                    {selectedItem.author?.name || "Anonymous"}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedItem.platform}
                                  </p>
                                </div>
                              </div>
                              <p className="mb-4">{selectedItem.content}</p>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-semibold">Engagement</p>
                                  <ul className="list-disc list-inside">
                                    <li>
                                      Likes:{" "}
                                      {selectedItem.engagement?.likes || 0}
                                    </li>
                                    <li>
                                      Views:{" "}
                                      {selectedItem.engagement?.views || 0}
                                    </li>
                                    <li>
                                      Comments:{" "}
                                      {selectedItem.engagement?.comments || 0}
                                    </li>
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-semibold">Metadata</p>
                                  <ul className="list-disc list-inside">
                                    <li>
                                      Sentiment:{" "}
                                      {selectedItem.sentiment || "Unknown"}
                                    </li>
                                    <li>
                                      Flagged:{" "}
                                      {selectedItem.flagged ? "Yes" : "No"}
                                    </li>
                                    <li>
                                      Posted:{" "}
                                      {formatDate(selectedItem.timestamp) ||
                                        "Unknown"}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant={item.flagged ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleFlag(item.id)}
                      >
                        <Flag className="mr-1 h-4 w-4" />
                        {item.flagged ? "Flagged" : "Flag"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div className="flex justify-center items-center space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {renderPaginationButtons()}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
