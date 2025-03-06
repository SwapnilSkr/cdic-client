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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    tags: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      description: "",
      tags: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Topic name is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.tags.trim()) {
      newErrors.tags = "At least one tag is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    const newTopic: Omit<Topic, "_id" | "createdAt"> = {
      name: formData.name,
      description: formData.description,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      active: true,
      alertThreshold: 75,
      sentiment: {
        positive: 0,
        neutral: 0,
        negative: 0,
      },
      sentimentHistory: [],
    };

    try {
      // Create topic
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTopic),
      });

      if (!response.ok) throw new Error("Failed to create topic");

      const createdTopic = await response.json();
      onAddTopic(createdTopic);
      
      // Show success message
      setShowSuccess(true);
      
      // Trigger post upload in background
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdTopic),
      });

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowSuccess(false);
    setFormData({ name: "", description: "", tags: "" });
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
          {showSuccess ? (
            <div className="space-y-4 p-4">
              <h3 className="text-lg font-semibold text-green-600">Topic Created Successfully!</h3>
              <p className="text-sm text-gray-600">
                Your topic has been created and data collection has started in the background.
                You can close this window and continue using the application.
              </p>
              <Button onClick={handleClose}>Close</Button>
            </div>
          ) : (
            <>
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
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
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
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
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
                    className={errors.tags ? "border-red-500" : ""}
                  />
                  {errors.tags && <p className="text-sm text-red-500 mt-1">{errors.tags}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Topic"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
