/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FlaggedItemsList } from "@/components/dashboard/flagged/FlaggedItemsList";
import { FilterSortPanel } from "@/components/dashboard/flagged/FilterSortPanel";
import { ReviewDetailPanel } from "@/components/dashboard/flagged/ReviewDetailPanel";
import { DateRange } from "react-day-picker";
import { useUserStore } from "@/state/user.store";
import { toast } from "@/hooks/use-toast";

type filtersType = {
  dateRange: DateRange | undefined;
  status: string | null;
};

export default function FlaggedContentPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUserStore();
  
  const [filters, setFilters] = useState<filtersType>({
    dateRange: undefined,
    status: null,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    if (!token) {
     setLoading(false);
    } else {
      fetchFlaggedItems();
    }
  }, [filters, token]);

  const fetchFlaggedItems = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (filters.dateRange?.from && filters.dateRange?.to) {
        queryParams.set('dateRange', JSON.stringify({
          from: filters.dateRange.from,
          to: filters.dateRange.to
        }));
      }
      
      if (filters.status) {
        queryParams.set('status', filters.status);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/flagged?${queryParams}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch flagged items');
      }

      const data = await response.json();
      setItems(data.items || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching flagged items:', error);
      setError('Failed to fetch flagged items');
      toast({
        title: "Error",
        description: "Failed to fetch flagged items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (itemId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${itemId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refetch items to update the list
      await fetchFlaggedItems();
      
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchFlaggedItems(newPage);
  };

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
          <FlaggedItemsList 
            items={items}
            loading={loading}
            error={error}
            onSelectItem={setSelectedItem}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <ReviewDetailPanel 
            selectedItem={selectedItem} 
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </motion.div>
  );
}
