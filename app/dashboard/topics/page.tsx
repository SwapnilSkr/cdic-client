"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TopicsList } from "@/components/dashboard/topics/TopicsList";
import { SearchAndFilter } from "@/components/dashboard/topics/SearchAndFilter";
import { TopicActionPanel } from "@/components/dashboard/topics/TopicActionPanel";
import { TopicDetailPanel } from "@/components/dashboard/topics/TopicDetailPanel";
import { Topic } from "@/utils/types";

export default function TopicsPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);

  const handleAddTopic = (newTopic: Omit<Topic, "id" | "createdAt">) => {
    const topic: Topic = {
      ...newTopic,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTopics((prev) => [...prev, topic]);
  };

  const handleUpdateTopic = (updatedTopic: Topic) => {
    setTopics((prev) =>
      prev.map((topic) => (topic.id === updatedTopic.id ? updatedTopic : topic))
    );
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== topicId));
    if (selectedTopic === topicId) {
      setSelectedTopic(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Topic Management</h1>
      <SearchAndFilter
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TopicActionPanel onAddTopic={handleAddTopic} />
          <TopicsList
            topics={topics}
            searchTerm={searchTerm}
            filter={filter}
            onSelectTopic={setSelectedTopic}
            onUpdateTopic={handleUpdateTopic}
            onDeleteTopic={handleDeleteTopic}
          />
        </div>
        <div className="lg:col-span-1">
          <TopicDetailPanel 
            selectedTopic={selectedTopic} 
            topics={topics}
            onUpdateTopic={handleUpdateTopic}
          />
        </div>
      </div>
    </motion.div>
  );
}
