"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Topic } from "@/utils/types";

interface TopicsListProps {
  topics: Topic[];
  searchTerm: string;
  filter: string | null;
  onSelectTopic: (topicId: string) => void;
  onUpdateTopic: (updatedTopic: Topic) => void;
  onDeleteTopic: (topicId: string) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTopics: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
}

export function TopicsList({
  topics,
  searchTerm,
  filter,
  onSelectTopic,
  onUpdateTopic,
  onDeleteTopic,
  pagination,
  onPageChange,
}: TopicsListProps) {
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const filtered = topics.filter((topic) => {
      const matchesSearch =
        topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesFilter =
        !filter || filter === "all" || topic.tags.includes(filter);
      return matchesSearch && matchesFilter;
    });
    setFilteredTopics(filtered);
  }, [topics, searchTerm, filter]);

  const handleEdit = async () => {
    if (editingTopic) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/topics/${editingTopic._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingTopic),
      });

      if (response.ok) {
        const updatedTopic = await response.json();
        onUpdateTopic(updatedTopic);
        setEditingTopic(null); // Close the edit form
      }
    }
  };

  const handleDelete = async (topicId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/topics/${topicId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      onDeleteTopic(topicId);
    }
  };

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

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {filteredTopics.map((topic) => (
          <motion.div
            key={topic._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                onSelectTopic(topic._id);
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">
                    {topic.name}
                  </CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    topic.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {topic.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTopic(topic);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(topic._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {topic.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {topic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Created: {new Date(topic.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span>Positive: {topic.sentiment.positive}%</span>
                  <span>Neutral: {topic.sentiment.neutral}%</span>
                  <span>Negative: {topic.sentiment.negative}%</span>
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

      <Dialog open={!!editingTopic} onOpenChange={() => setEditingTopic(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
          </DialogHeader>
          {editingTopic && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label htmlFor="editTopicName">Topic Name</Label>
                <Input
                  id="editTopicName"
                  value={editingTopic.name}
                  onChange={(e) =>
                    setEditingTopic({ ...editingTopic, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editTopicDescription">Description</Label>
                <Textarea
                  id="editTopicDescription"
                  value={editingTopic.description}
                  onChange={(e) =>
                    setEditingTopic({
                      ...editingTopic,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editTopicTags">Tags (comma-separated)</Label>
                <Input
                  id="editTopicTags"
                  value={editingTopic.tags.join(", ")}
                  onChange={(e) =>
                    setEditingTopic({
                      ...editingTopic,
                      tags: e.target.value.split(", "),
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="editTopicActive">Active</Label>
                <input
                  type="checkbox"
                  id="editTopicActive"
                  checked={editingTopic.active}
                  onChange={(e) =>
                    setEditingTopic({ ...editingTopic, active: e.target.checked })
                  }
                  className="h-4 w-4"
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
