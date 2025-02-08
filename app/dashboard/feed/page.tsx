"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FilterPanel from "@/components/dashboard/feed/FilterPanel";
import FeedList from "@/components/dashboard/feed/FeedList";
import SummaryWidget from "@/components/dashboard/feed/SummaryWidget";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

interface Filters {
  platforms: string[];
  dateRange: { start: Date | null; end: Date | null };
  language: string;
  sentiment: string;
  flagStatus: string;
  sortBy: string;
}

export default function MediaFeedPage() {
  const [filters, setFilters] = useState<Filters>({
    platforms: [],
    dateRange: { start: null, end: null },
    language: "",
    sentiment: "",
    flagStatus: "",
    sortBy: "recent",
  });

  return (
    <motion.div
      className="flex flex-col md:flex-row gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="w-full md:w-3/4" variants={itemVariants}>
        <FilterPanel filters={filters} setFilters={setFilters} />
        <FeedList filters={filters} />
      </motion.div>
      <motion.div className="w-full md:w-1/4" variants={itemVariants}>
        <SummaryWidget filters={filters} />
      </motion.div>
    </motion.div>
  );
}
