"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, Flag, FileText } from "lucide-react";
import { mockFlaggedItems, type FlaggedItem } from "@/utils/mockFlaggedItems";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

interface ReviewDetailPanelProps {
  selectedItem: string | null;
}

export function ReviewDetailPanel({ selectedItem }: ReviewDetailPanelProps) {
  const [itemDetails, setItemDetails] = useState<FlaggedItem | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    if (selectedItem) {
      const details = mockFlaggedItems.find((item) => item.id === selectedItem);
      setItemDetails(details || null);
      // In a real application, you would fetch the audit log from an API
      setAuditLog([
        {
          id: "1",
          action: "Content flagged",
          timestamp: "2023-06-01T10:30:00Z",
          user: "User123",
        },
        {
          id: "2",
          action: "Escalated for review",
          timestamp: "2023-06-01T11:45:00Z",
          user: "Moderator1",
        },
        {
          id: "3",
          action: "Added moderator note",
          timestamp: "2023-06-01T14:20:00Z",
          user: "Moderator2",
        },
        {
          id: "4",
          action: "Marked as reviewed",
          timestamp: "2023-06-02T09:15:00Z",
          user: "SeniorModerator",
        },
      ]);
    } else {
      setItemDetails(null);
      setAuditLog([]);
    }
  }, [selectedItem]);

  if (!itemDetails) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Select an item to review
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Review Flagged Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Content</h3>
            {itemDetails.contentType === "text" ? (
              <p className="text-sm">{itemDetails.content}</p>
            ) : (
              <div className="bg-muted h-40 flex items-center justify-center">
                [Placeholder for {itemDetails.contentType} content]
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Flag Details</h3>
            <p className="text-sm">
              <strong>Reason:</strong> {itemDetails.flagReason}
            </p>
            <p className="text-sm">
              <strong>Flagged by:</strong> {itemDetails.flaggedBy}
            </p>
            <p className="text-sm">
              <strong>Timestamp:</strong>{" "}
              {new Date(itemDetails.timestamp).toLocaleString()}
            </p>
            <p className="text-sm">
              <strong>Author:</strong> {itemDetails.author}
            </p>
            <p className="text-sm">
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  itemDetails.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : itemDetails.status === "escalated"
                      ? "bg-red-200 text-red-800"
                      : "bg-green-200 text-green-800"
                }`}
              >
                {itemDetails.status}
              </span>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
            <p className="text-sm">
              <strong>Sentiment Score:</strong>{" "}
              {itemDetails.aiAnalysis.sentimentScore}
            </p>
            <p className="text-sm">
              <strong>Language:</strong> {itemDetails.aiAnalysis.language}
            </p>
            <p className="text-sm">
              <strong>Content Category:</strong>{" "}
              {itemDetails.aiAnalysis.contentCategory}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Moderator Notes</h3>
            <Textarea
              value={itemDetails.moderatorNotes}
              onChange={(e) =>
                setItemDetails({
                  ...itemDetails,
                  moderatorNotes: e.target.value,
                })
              }
              placeholder="Add your notes here..."
              className="h-24"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => console.log("Marked as reviewed")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Reviewed
            </Button>
            <Button variant="outline" onClick={() => console.log("Escalated")}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Escalate
            </Button>
            <Button
              variant="outline"
              onClick={() => console.log("Flagged author")}
            >
              <Flag className="mr-2 h-4 w-4" />
              Flag Author
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Audit Log
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Audit Log</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {auditLog.map((entry) => (
                    <div key={entry.id} className="text-sm">
                      <span className="font-semibold">{entry.action}</span>
                      <br />
                      <span className="text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleString()} by{" "}
                        {entry.user}
                      </span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
