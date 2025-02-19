"use client";

import { motion } from "framer-motion";
import MediaFeed from "@/components/dashboard/MediaFeed";
import VerificationPanel from "@/components/dashboard/VerificationPanel";
import AiChatPage from "@/components/dashboard/AiChatPage";

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
      className="flex flex-col lg:flex-row gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Column - AI Chat */}
      <motion.div 
        variants={itemVariants}
        className="w-full lg:w-1/2"
      >
        <AiChatPage />
      </motion.div>

      {/* Right Column - Verification Panel and Media Feed */}
      <motion.div 
        className="w-full lg:w-1/2 flex flex-col gap-6"
      >
        <motion.div variants={itemVariants}>
          <VerificationPanel />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MediaFeed />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
