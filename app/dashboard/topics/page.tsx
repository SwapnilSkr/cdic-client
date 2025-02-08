"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TopicsList } from "@/components/dashboard/topics/TopicsList";
import { SearchAndFilter } from "@/components/dashboard/topics/SearchAndFilter";
import { TopicActionPanel } from "@/components/dashboard/topics/TopicActionPanel";
import { TopicDetailPanel } from "@/components/dashboard/topics/TopicDetailPanel";

export default function TopicsPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

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
          <TopicActionPanel />
          <TopicsList
            searchTerm={searchTerm}
            filter={filter}
            onSelectTopic={setSelectedTopic}
          />
        </div>
        <div className="lg:col-span-1">
          <TopicDetailPanel selectedTopic={selectedTopic} />
        </div>
      </div>
    </motion.div>
  );
}
