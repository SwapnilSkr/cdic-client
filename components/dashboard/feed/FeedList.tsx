/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
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
  Loader2,
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useUserStore } from "@/state/user.store";
import Image from "next/image";

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

interface FeedListProps {
  filters: any;
  items: FeedItem[];
  loading: boolean;
  error: string | null;
  toggleFlag: (id: string) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
}

export default function FeedList({ 
  filters, 
  items, 
  loading, 
  error, 
  toggleFlag,
  pagination,
  onPageChange 
}: FeedListProps) {
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [imagePreviewItem, setImagePreviewItem] = useState<FeedItem | null>(null);
  const {token, user} = useUserStore();
  const [localItems, setLocalItems] = useState<FeedItem[]>(items);
  const [flagLoadingStates, setFlagLoadingStates] = useState<{ [key: number]: boolean }>({});
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Update local items when items prop changes
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // Scroll to top when page changes
  useEffect(() => {
    if (pagination.currentPage) {
      // Use setTimeout to ensure this happens after re-render
      setTimeout(() => {
        // Try to scroll the container if it exists
        if (feedContainerRef.current) {
          feedContainerRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
        
        // Also scroll the window as a fallback
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [pagination.currentPage]);

  // Apply filters only (no pagination)
  const filteredItems = localItems.filter(
    (item) =>
      (!filters.platforms.length ||
        filters.platforms.includes(item.platform)) &&
      (!filters.sentiment || item.sentiment === filters.sentiment) &&
      (!filters.flagStatus ||
        (filters.flagStatus === "flagged") === item.flagged)
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let start = Math.max(1, pagination.currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(pagination.totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    // First page button
    if (start > 1) {
      buttons.push(
        <Button 
          key="1" 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      );
      if (start > 2) buttons.push(<span key="start-dots">...</span>);
    }

    // Numbered buttons
    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === pagination.currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Last page button
    if (end < pagination.totalPages) {
      if (end < pagination.totalPages - 1) {
        buttons.push(<span key="end-dots">...</span>);
      }
      buttons.push(
        <Button
          key={pagination.totalPages}
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.totalPages)}
        >
          {pagination.totalPages}
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
        return <Eye className="h-4 w-4" />;
      case "video":
        return <Youtube className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const togglePostFlag = async (id: number) => {
    try {
      // Set loading state for this specific button
      setFlagLoadingStates(prev => ({ ...prev, [id]: true }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/toggle-flag/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    
      if (!response.ok) {
        throw new Error('Failed to toggle flag');
      }

      const data = await response.json();
      
      // Update local state only after successful API response
      setLocalItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, flagged: data.flagged, flaggedBy: data.flaggedBy } 
            : item
        )
      );

      // Show success toast
      toast({
        title: "Success",
        description: data.flagged ? "Post flagged successfully" : "Post unflagged successfully",
        variant: "default",
      });

      // Call the parent's toggleFlag function to update the parent state
      toggleFlag(id.toString());

    } catch (error) {
      console.error('Error toggling flag:', error);
      toast({
        title: "Error",
        description: "Failed to toggle flag. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clear loading state for this specific button
      setFlagLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const dismissPost = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/dismiss/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    
      // Remove the post from local state immediately
      setLocalItems(prevItems => prevItems.filter(item => item.id !== id));
      
      toast({
        title: "Success",
        description: "Post dismissed successfully.",
        variant: "default",
      });

    } catch (error) {
      console.error('Error updating post dismiss status:', error);
      toast({
        title: "Error",
        description: "Failed to update dismiss status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 space-y-3 border rounded-lg">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-2" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            {/* Image skeleton */}
            <Skeleton className="h-64 md:h-80 w-full rounded-md" />
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-[50px]" />
                <Skeleton className="h-4 w-[50px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-8 w-[80px]" />
                <Skeleton className="h-8 w-[80px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div ref={feedContainerRef}>
      <AnimatePresence>
        {filteredItems.map((item) => {
          const PlatformIcon = platformIcons[item.platform] || MessageCircle;
          const engagement = item.engagement || {
            likes: 0,
            views: 0,
            comments: 0,
          };
          const postUrl = item.post_url;

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-4 overflow-hidden">
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
                  
                  {/* Display image in feed list if available */}
                  {(item.image_url || (item.platform === "Instagram" && item.post_url)) && (
                    <div 
                      className="mb-4 overflow-hidden rounded-md cursor-pointer" 
                      onClick={() => setImagePreviewItem(item)}
                    >
                      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-100">
                        {item.platform === "Instagram" && item.post_url ? (
                          <Image 
                            src={`${item.post_url}media/?size=m`}
                            alt="Instagram post"
                            fill
                            style={{ objectFit: "cover" }}
                            className="hover:scale-105 transition-transform duration-300"
                          />
                        ) : item.platform !== "Instagram" && item.image_url ? (
                          <Image 
                            src={item.image_url}
                            alt="Post content" 
                            fill
                            style={{ objectFit: "cover" }}
                            className="hover:scale-105 transition-transform duration-300"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center">
                          <Eye className="text-white opacity-0 hover:opacity-100 h-10 w-10 transition-opacity duration-300" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex space-x-4">
                      {item.platform !== "News" && (
                        <>
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
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                              
                              {/* Add image display */}
                              {(selectedItem.image_url || (selectedItem.platform === "Instagram" && selectedItem.post_url)) && (
                                <div className="mb-4 overflow-hidden rounded-md">
                                  {selectedItem.platform === "Instagram" && selectedItem.post_url ? (
                                    <div className="relative w-full h-72 bg-gray-100">
                                      <Image 
                                        src={`${selectedItem.post_url}media/?size=m`}
                                        alt="Instagram post"
                                        fill
                                        style={{ objectFit: "contain" }}
                                        className="w-full rounded-md"
                                      />
                                    </div>
                                  ) : selectedItem.platform !== "Instagram" && selectedItem.image_url ? (
                                    <div className="relative w-full h-72 bg-gray-100">
                                      <Image 
                                        src={selectedItem.image_url}
                                        alt="Post content" 
                                        fill
                                        style={{ objectFit: "contain" }}
                                        className="w-full rounded-md"
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              )}
                              
                              {/* Add post URL link */}
                              {postUrl && (
                                <div className="mb-4">
                                  <a 
                                    href={postUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    View Original Post
                                  </a>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-2 gap-4">
                                {selectedItem.platform !== "News" && (
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
                                )}
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
                        variant={item.flagged && item.flaggedBy?.includes(user?._id || "") ? "destructive" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          togglePostFlag(item.id);
                        }}
                        disabled={flagLoadingStates[item.id]}
                      >
                        {flagLoadingStates[item.id] ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Flag className="mr-1 h-4 w-4" />
                        )}
                        {item.flagged && item.flaggedBy?.includes(user?._id || "") ? "Flagged" : "Flag"}
                      </Button>
                      <Button
                        variant={item.dismissed ? "secondary" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click event
                          dismissPost(item.id);
                        }}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
        >
          Previous
        </Button>
        
        <div className="flex flex-wrap items-center gap-2 justify-center">
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

      {/* Image Modal */}
      {imagePreviewItem && (
        <Dialog open={!!imagePreviewItem} onOpenChange={(open) => !open && setImagePreviewItem(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {(imagePreviewItem.image_url || (imagePreviewItem.platform === "Instagram" && imagePreviewItem.post_url)) && (
                <div className="overflow-hidden rounded-md">
                  {imagePreviewItem.platform === "Instagram" && imagePreviewItem.post_url ? (
                    <div className="relative w-full h-80 md:h-96 lg:h-[500px] bg-gray-100">
                      <Image 
                        src={`${imagePreviewItem.post_url}media/?size=m`}
                        alt="Instagram post"
                        fill
                        style={{ objectFit: "contain" }}
                        className="w-full rounded-md"
                      />
                    </div>
                  ) : imagePreviewItem.platform !== "Instagram" && imagePreviewItem.image_url ? (
                    <div className="relative w-full h-80 md:h-96 lg:h-[500px] bg-gray-100">
                      <Image 
                        src={imagePreviewItem.image_url}
                        alt="Post content" 
                        fill
                        style={{ objectFit: "contain" }}
                        className="w-full rounded-md"
                      />
                    </div>
                  ) : null}
                </div>
              )}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{imagePreviewItem.content}</p>
                {imagePreviewItem.post_url && (
                  <div className="mt-2">
                    <a 
                      href={imagePreviewItem.post_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Original Post
                    </a>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
