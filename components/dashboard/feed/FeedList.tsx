"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  Share2,
  MessageSquare,
  Flag,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockFeedItems, type FeedItem } from "@/utils/mockFeedItems";

const ITEMS_PER_PAGE = 5;

const platformIcons = {
  Facebook,
  Instagram,
  YouTube: Youtube,
  Reddit: MessageCircle,
};

interface Filters {
  platforms: string[];
  sentiment?: string;
  flagStatus?: "flagged" | "unflagged";
}

export default function FeedList({ filters }: { filters: Filters }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<FeedItem[]>(mockFeedItems);

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

    if (start > 1) {
      buttons.push(
        <Button
          key="first"
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
        >
          1
        </Button>
      );
      if (start > 2) {
        buttons.push(<span key="ellipsis1">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        buttons.push(<span key="ellipsis2">...</span>);
      }
      buttons.push(
        <Button
          key="last"
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {paginatedItems.map((item) => {
          const PlatformIcon = platformIcons[item.platform];
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-card text-card-foreground p-4 rounded-lg shadow-md mb-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <PlatformIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {item.platform}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.timestamp}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src={item.author.image} alt={item.author.name} />
                  <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{item.author.name}</span>
              </div>
              <p className="mb-2">{item.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <ThumbsUp className="mr-1 h-4 w-4" />{" "}
                    {item.engagement.likes}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Share2 className="mr-1 h-4 w-4" /> {item.engagement.shares}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <MessageSquare className="mr-1 h-4 w-4" />{" "}
                    {item.engagement.comments}
                  </span>
                </div>
                <Button
                  variant={item.flagged ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => toggleFlag(item.id)}
                >
                  <Flag className="mr-1 h-4 w-4" />
                  {item.flagged ? "Flagged" : "Flag"}
                </Button>
              </div>
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
