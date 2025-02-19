"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MessageSquare, ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockFlaggedItems, type FlaggedItem } from "@/utils/mockFlaggedItems";
import { DateRange } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";

interface FlaggedItemsListProps {
  items: FlaggedItem[];
  loading: boolean;
  error: string | null;
  onSelectItem: (itemId: string) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
}

export function FlaggedItemsList({
  items,
  loading,
  error,
  onSelectItem,
  pagination,
  onPageChange
}: FlaggedItemsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      buttons.push(
        <Button
          key={i}
          variant={pagination.currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
        >
          {i}
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 space-y-3">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-8 space-y-4">
        <p className="text-muted-foreground text-lg">No flagged items found</p>
        <p className="text-sm text-muted-foreground">Items that are flagged will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {items.map((item) => (
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

      {items.length > 0 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            {renderPaginationButtons()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
