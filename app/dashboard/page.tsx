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
      className="container mx-auto p-4 lg:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Overview Cards */}
          <motion.section 
            variants={itemVariants}
            className="h-[400px] md:h-[200px]"
          >
            <OverviewCards />
          </motion.section>
          
          {/* AI Chat */}
          <motion.section 
            variants={itemVariants}
            className="h-[400px]"
          >
            <AiChatPage />
          </motion.section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Media Feed */}
          <motion.section 
            variants={itemVariants}
            className="h-[400px] md:h-[300px]"
          >
            <MediaFeed />
          </motion.section>
          
          {/* Verification Panel */}
          <motion.section 
            variants={itemVariants}
            className="h-[400px] md:h-[300px]"
          >
            <VerificationPanel />
          </motion.section>
        </div>
      </div>

      <style jsx global>{`
        html, body {
          height: 100%;
          overflow-x: hidden;
        }
        
        /* Apply better responsive behavior for smaller screens */
        @media (max-width: 640px) {
          .container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
        
        /* Custom scrollbar styles for main container */
        .container::-webkit-scrollbar {
          width: 6px;
        }
        
        .container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .container::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </motion.div>
  );
}