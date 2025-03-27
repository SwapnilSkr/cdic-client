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
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-80px)] p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Column - Overview Cards and AI Chat */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-6 h-full"
      >
        <motion.div
          variants={itemVariants}
          className="h-[25%]"
        >
          <OverviewCards />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="h-[75%]"
        >
          <AiChatPage />
        </motion.div>
      </motion.div>

      {/* Right Column - Media Feed and Verification Panel */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-6 h-full"
      >
        <motion.div
          variants={itemVariants}
          className="h-[66%]"
        >
          <MediaFeed />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="h-[34%]"
        >
          <VerificationPanel />
        </motion.div>
      </motion.div>

      <style jsx global>{`
        html, body {
          height: 100vh;
          overflow: hidden;
        }
        
        /* Remove fixed heights from component cards */
        .card {
          height: 100% !important;
          display: flex;
          flex-direction: column;
        }
        
        /* Ensure content areas use remaining height */
        .card-content {
          flex: 1;
          overflow: auto;
        }
      `}</style>
    </motion.div>
  );
}