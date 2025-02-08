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

export function TopicActionPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
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
              <Input id="topicName" placeholder="Enter topic name" />
            </div>
            <div>
              <Label htmlFor="topicDescription">Description</Label>
              <Textarea
                id="topicDescription"
                placeholder="Enter topic description"
              />
            </div>
            <div>
              <Label htmlFor="topicTags">Tags (comma-separated)</Label>
              <Input id="topicTags" placeholder="Enter tags" />
            </div>
            <Button type="submit">Create Topic</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
