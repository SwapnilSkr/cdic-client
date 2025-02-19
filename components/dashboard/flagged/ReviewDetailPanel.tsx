/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, FileText } from "lucide-react";
import { useUserStore } from "@/state/user.store";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ReviewDetailPanelProps {
  selectedItem: string | null;
  onStatusUpdate: (itemId: string, newStatus: string) => Promise<void>;
}

interface PostDetail {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  flaggedBy: {
    id: string;
    name: string;
    email: string;
  }[];
  status: string;
  timestamp: string;
  platform: string;
}

export function ReviewDetailPanel({ selectedItem, onStatusUpdate }: ReviewDetailPanelProps) {
  const [loading, setLoading] = useState(false);
  const [itemDetails, setItemDetails] = useState<PostDetail | null>(null);
  const { token, user } = useUserStore();

  useEffect(() => {
    if (selectedItem) {
      fetchItemDetails();
    } else {
      setItemDetails(null);
    }
  }, [selectedItem]);

  const fetchItemDetails = async () => {
    if (!selectedItem) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${selectedItem}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }

      const data = await response.json();
      setItemDetails(data);
    } catch (error) {
      console.error('Error fetching item details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch item details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFlagAuthor = async () => {
    if (!itemDetails?.author.id) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/authors/${itemDetails.author.id}/flag`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to flag author');
      }

      toast({
        title: "Success",
        description: "Author has been flagged",
      });
    } catch (error) {
      console.error('Error flagging author:', error);
      toast({
        title: "Error",
        description: "Failed to flag author",
        variant: "destructive",
      });
    }
  };

  if (!selectedItem) {
    return (
      <div className="flex flex-col justify-center items-center p-8 space-y-4">
        <p className="text-muted-foreground text-lg">No item selected</p>
        <p className="text-sm text-muted-foreground">Select an item to view details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Review Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {itemDetails && (
            <>
              <div>
                <h3 className="font-medium">Content</h3>
                <p className="text-sm text-muted-foreground">{itemDetails.content}</p>
              </div>

              <div>
                <h3 className="font-medium">Author</h3>
                <p className="text-sm text-muted-foreground">{itemDetails.author.username}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {user?.role === "admin" && <>
                    <Button
                      variant="outline"
                      onClick={() => onStatusUpdate(selectedItem, 'reviewed')}
                    >
                      Mark as Reviewed
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onStatusUpdate(selectedItem, 'escalated')}
                    >
                      Escalate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleFlagAuthor}
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Flag Author
                    </Button>
                  </>
                  }
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Flagged By
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Users who flagged this content</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        {itemDetails.flaggedBy.map((user) => (
                          <div key={user.id} className="text-sm">
                            <span className="font-semibold">{user.name}</span>
                            <br />
                            <span className="text-muted-foreground">{user.email}</span>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
