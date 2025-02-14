"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Topic } from "@/utils/types";

interface TopicActionPanelProps {
  onAddTopic: (topic: Omit<Topic, "id" | "createdAt">) => void;
}

export function TopicActionPanel({ onAddTopic }: TopicActionPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
    active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTopic: Omit<Topic, "id" | "createdAt"> = {
      name: formData.name,
      description: formData.description,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      active: formData.active,
      alertThreshold: 75,
      sentiment: {
        positive: 0,
        neutral: 0,
        negative: 0,
      },
      sentimentHistory: [],
    };
    onAddTopic(newTopic);
    setFormData({ name: "", description: "", tags: "", active: true });
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Topic
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="topicName">Topic Name</Label>
              <Input
                id="topicName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter topic name"
              />
            </div>
            <div>
              <Label htmlFor="topicDescription">Description</Label>
              <Textarea
                id="topicDescription"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter topic description"
              />
            </div>
            <div>
              <Label htmlFor="topicTags">Tags (comma-separated)</Label>
              <Input
                id="topicTags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="Enter tags"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="topicActive">Active</Label>
              <input
                type="checkbox"
                id="topicActive"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="h-4 w-4"
              />
            </div>
            <Button type="submit">Create Topic</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
