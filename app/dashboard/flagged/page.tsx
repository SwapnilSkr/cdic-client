"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FlaggedItemsList } from "@/components/dashboard/flagged/FlaggedItemsList";
import { FilterSortPanel } from "@/components/dashboard/flagged/FilterSortPanel";
import { ReviewDetailPanel } from "@/components/dashboard/flagged/ReviewDetailPanel";
import { DateRange } from "react-day-picker";

type filtersType = {
  dateRange: DateRange | undefined;
  flagType: string | null;
  status: string | null;
};

export default function FlaggedContentPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filters, setFilters] = useState<filtersType>({
    dateRange: undefined,
    flagType: null,
    status: null,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Flagged Content Review</h1>
      <FilterSortPanel filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FlaggedItemsList filters={filters} onSelectItem={setSelectedItem} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <ReviewDetailPanel selectedItem={selectedItem} />
        </div>
      </div>
    </motion.div>
  );
}
