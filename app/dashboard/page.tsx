"use client";

import { motion } from "framer-motion";
import OverviewCards from "@/components/dashboard/OverviewCards";
import MediaFeed from "@/components/dashboard/MediaFeed";
import AlertPanel from "@/components/dashboard/AlertPanel";
import SentimentAnalysis from "@/components/dashboard/SentimentAnalysis";

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

export default function Dashboard() {
  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <OverviewCards />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MediaFeed />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AlertPanel />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SentimentAnalysis />
        </motion.div>
      </motion.div>
    </>
  );
}
