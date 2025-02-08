"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MessageSquare, ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockFlaggedItems, type FlaggedItem } from "@/utils/mockFlaggedItems";
import { DateRange } from "react-day-picker";

interface FlaggedItemsListProps {
  filters: {
    dateRange: DateRange | undefined;
    flagType: string | null;
    status: string | null;
  };
  onSelectItem: (itemId: string) => void;
}

const ITEMS_PER_PAGE = 5;

export function FlaggedItemsList({
  filters,
  onSelectItem,
}: FlaggedItemsListProps) {
  const [items, setItems] = useState<FlaggedItem[]>(mockFlaggedItems);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const filteredItems = mockFlaggedItems.filter((item) => {
      if (filters.dateRange?.from && filters.dateRange?.to) {
        const itemDate = new Date(item.timestamp);
        if (
          itemDate < filters.dateRange.from ||
          itemDate > filters.dateRange.to
        ) {
          return false;
        }
      }
      if (filters.flagType && item.flagReason !== filters.flagType) {
        return false;
      }
      if (filters.status && item.status !== filters.status) {
        return false;
      }
      return true;
    });
    setItems(filteredItems);
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice(
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

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "text":
        return <MessageSquare className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {paginatedItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectItem(item.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                  {item.flagReason}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getContentTypeIcon(item.contentType)}
                  <span className="text-xs text-muted-foreground">
                    {item.contentType}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{item.content}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>By: {item.author}</span>
                  <span>Flagged by: {item.flaggedBy}</span>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div className="mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : item.status === "escalated"
                          ? "bg-red-200 text-red-800"
                          : "bg-green-200 text-green-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
