"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ReportFilters } from "@/components/dashboard/reporting/ReportFilters";
import { GraphicalAnalytics } from "@/components/dashboard/reporting/GraphicalAnalytics";
import { DetailedReports } from "@/components/dashboard/reporting/DetailedReports";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import OverviewCards from "@/components/dashboard/OverviewCards";

export default function ReportingPage() {
  const [filters, setFilters] = useState({
    dateRange: undefined,
    topics: undefined,
    platforms: undefined,
    sentiments: undefined,
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Reporting</h1>

      <ReportFilters onFilterChange={handleFilterChange} />

      {/* Overview Cards */}
      <div className="mb-8">
        <OverviewCards />
      </div>

      <GraphicalAnalytics />

      <DetailedReports filters={filters} />

      <div className="flex flex-wrap gap-4">
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export as CSV
        </Button>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export as PDF
        </Button>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export as Excel
        </Button>
        <Button>
          <Mail className="mr-2 h-4 w-4" /> Email Report
        </Button>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Key Insights</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Engagement has increased by 25% over the last month.</li>
          <li>Twitter remains the platform with the highest reach.</li>
          <li>
            The topic &quot;Artificial Intelligence&quot; has the most positive
            sentiment.
          </li>
          <li>
            There&apos;s a correlation between higher engagement and positive
            sentiment.
          </li>
        </ul>
      </div>
    </motion.div>
  );
}