"use client";

import { motion } from "framer-motion";
import MediaFeed from "@/components/dashboard/MediaFeed";
import VerificationPanel from "@/components/dashboard/VerificationPanel";
import AiChatPage from "@/components/dashboard/AiChatPage";
import OverviewCards from "@/components/dashboard/OverviewCards";

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
    <motion.div
      className="flex flex-col lg:flex-row gap-6 max-h-[calc(100vh-80px)] overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Column - Overview Cards and AI Chat */}
      <motion.div 
        variants={itemVariants}
        className="w-full lg:w-1/2 flex flex-col gap-6 overflow-hidden"
      >
        <motion.div variants={itemVariants} className="flex-shrink-0">
          <OverviewCards />
        </motion.div>
        <motion.div variants={itemVariants} className="flex-grow overflow-hidden">
          <AiChatPage />
        </motion.div>
      </motion.div>

      {/* Right Column - Media Feed and Verification Panel */}
      <motion.div 
        className="w-full lg:w-1/2 flex flex-col gap-6 overflow-hidden"
      >
        <motion.div variants={itemVariants} className="flex-grow">
          <MediaFeed />
        </motion.div>
        <motion.div variants={itemVariants} className="flex-shrink-0">
          <VerificationPanel />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
