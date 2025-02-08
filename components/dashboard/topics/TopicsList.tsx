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
import { mockTopics, type Topic } from "@/utils/mockTopics";

const ITEMS_PER_PAGE = 5;

interface TopicsListProps {
  searchTerm: string;
  filter: string | null;
  onSelectTopic: (topicId: string) => void;
}

export function TopicsList({
  searchTerm,
  filter,
  onSelectTopic,
}: TopicsListProps) {
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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
    setCurrentPage(1);
  }, [topics, searchTerm, filter]);

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
  };

  const handleDelete = (topicId: string) => {
    setTopics(topics.filter((topic) => topic.id !== topicId));
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTopic) {
      setTopics(
        topics.map((topic) =>
          topic.id === editingTopic.id ? editingTopic : topic
        )
      );
      setEditingTopic(null);
    }
  };

  const totalPages = Math.ceil(filteredTopics.length / ITEMS_PER_PAGE);
  const paginatedTopics = filteredTopics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
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
    <div className="space-y-4">
      <AnimatePresence>
        {paginatedTopics.map((topic) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectTopic(topic.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {topic.name}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(topic);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(topic.id);
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

      <Dialog open={!!editingTopic} onOpenChange={() => setEditingTopic(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
          </DialogHeader>
          {editingTopic && (
            <form onSubmit={handleSubmitEdit} className="space-y-4">
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
              <Button type="submit">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
