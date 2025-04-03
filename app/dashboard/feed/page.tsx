/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import FilterPanel from "@/components/dashboard/feed/FilterPanel";
import FeedList from "@/components/dashboard/feed/FeedList";
import SummaryWidget from "@/components/dashboard/feed/SummaryWidget";
import { Twitter, Instagram, Youtube } from "lucide-react";
import { type FeedItem } from "@/utils/mockFeedItems";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserStore } from "@/state/user.store";
import { FaGoogle, FaReddit } from "react-icons/fa";

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
  flagStatus: string;
  sortBy: string;
  keyword?: string;
}

// Add these interfaces for API data
interface PlatformData {
  name: string;
  icon: any;
  enabled?: boolean; // Make enabled optional
}

interface ApiData {
  platforms: PlatformData[];
  languages: { value: string; label: string }[];
  feedItems: FeedItem[];
}

// Separate the main content into a new component
function MediaFeedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user } = useUserStore();
  
  // Initialize with URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  const [filters, setFilters] = useState<Filters>({
    platforms: searchParams.get('platforms')?.split(',') || [],
    dateRange: {
      start: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null,
      end: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null,
    },
    language: searchParams.get('language') || "",
    flagStatus: searchParams.get('flagStatus') || "",
    sortBy: searchParams.get('sortBy') || "recent",
    keyword: searchParams.get('keyword') || "",
  });

  const [apiData, setApiData] = useState<ApiData>({
    platforms: [
      { name: "Twitter", icon: Twitter },
      { name: "Instagram", icon: Instagram },
      { name: "Youtube", icon: Youtube },
      { name: "News", icon: FaGoogle },
      { name: "Reddit", icon: FaReddit },
    ],
    languages: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
    ],
    feedItems: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page') || '1'),
    totalPages: 1,
    totalPosts: 0,
    limit: 30,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [summaryStats, setSummaryStats] = useState({
    totalPosts: 0,
    totalFlagged: 0,
    filteredTotal: 0,
    filteredFlagged: 0,
  });

  // Add a separate effect to handle search parameter changes
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    
    if (urlKeyword !== filters.keyword) {
      handleFilterChange({
        ...filters,
        keyword: urlKeyword
      });
    }
  }, [searchParams.get('keyword')]); // Only depend on the keyword parameter

  // Keep the original effect for pagination
  useEffect(() => {
    const urlPage = searchParams.get('page') || '1';
    if (parseInt(urlPage) === currentPage) {
      fetchPosts(currentPage);
    }
  }, [currentPage, filters, token]); // Keep original dependencies

  // Update URL separately
  const updateUrlWithFilters = (newFilters: Filters, page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update filter params
    if (newFilters.platforms.length > 0) {
      params.set('platforms', newFilters.platforms.join(','));
    } else {
      params.delete('platforms');
    }
    
    // Add keyword to URL params
    if (newFilters.keyword) {
      params.set('keyword', newFilters.keyword);
    } else {
      params.delete('keyword');
    }
    
    if (newFilters.dateRange.start && newFilters.dateRange.end) {
      params.set('startDate', newFilters.dateRange.start.toISOString());
      params.set('endDate', newFilters.dateRange.end.toISOString());
    } else {
      params.delete('startDate');
      params.delete('endDate');
    }
    
    if (newFilters.flagStatus) {
      params.set('flagStatus', newFilters.flagStatus);
    } else {
      params.delete('flagStatus');
    }
    
    if (newFilters.sortBy) {
      params.set('sortBy', newFilters.sortBy);
    } else {
      params.delete('sortBy');
    }
    
    params.set('page', page.toString());
    
    // Use replace instead of push to avoid adding to history
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlWithFilters(filters, newPage);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    updateUrlWithFilters(newFilters, 1); // Reset to page 1 when filters change
  };

  const fetchPosts = async (page: number, currentFilters = filters) => {
    if (!token) return;
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      // Add filter parameters
      if (currentFilters.platforms.length > 0) {
        queryParams.set('platforms', currentFilters.platforms.join(','));
      }

      // Add keyword if it exists
      if (currentFilters.keyword) {
        queryParams.set('keyword', currentFilters.keyword);
      }

      // Only add date range if both dates are set
      if (currentFilters.dateRange.start && currentFilters.dateRange.end) {
        // Format dates as ISO strings
        const dateRange = {
          start: currentFilters.dateRange.start.toISOString(),
          end: currentFilters.dateRange.end.toISOString()
        };
        queryParams.set('dateRange', JSON.stringify(dateRange));
      }

      if (currentFilters.flagStatus) {
        queryParams.set('flagStatus', currentFilters.flagStatus);
      }
      if (currentFilters.sortBy) {
        queryParams.set('sortBy', currentFilters.sortBy);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/all?${queryParams}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch posts");
      
      const { data, pagination: paginationData } = await response.json();
      
      setApiData(prev => ({
        ...prev,
        feedItems: data
      }));
      setPagination(paginationData);
      
      // Update summary stats
      setSummaryStats({
        totalPosts: paginationData.totalPosts,
        totalFlagged: paginationData.totalFlaggedPosts,
        filteredTotal: paginationData.filteredTotal,
        filteredFlagged: paginationData.filteredFlagged,
      });

      // Update URL with current filters and page
      updateUrlWithFilters(currentFilters, page);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = async (id: string) => {
    try {
      // Update the UI state without refetching
      setApiData(prev => ({
        ...prev,
        feedItems: prev.feedItems.map((item) =>
          item.id.toString() === id 
            ? { 
                ...item, 
                flagged: !item.flagged,
                flaggedBy: !item.flagged 
                  ? [...(item.flaggedBy || []), user?._id || ""]
                  : (item.flaggedBy || []).filter(id => id !== user?._id)
              } 
            : item
        )
      }));

      // Update summary stats without refetching
      setSummaryStats(prev => ({
        ...prev,
        totalFlagged: prev.totalFlagged + (apiData.feedItems.find(item => item.id.toString() === id)?.flagged ? -1 : 1),
        filteredFlagged: prev.filteredFlagged + (apiData.feedItems.find(item => item.id.toString() === id)?.flagged ? -1 : 1)
      }));
    } catch (error) {
      console.error('Error updating flag state:', error);
    }
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="w-full md:w-3/4" variants={itemVariants}>
        <FilterPanel 
          filters={filters} 
          setFilters={setFilters} 
          apiData={{
            ...apiData,
            platforms: apiData.platforms.map(platform => ({
              ...platform,
              enabled: platform.enabled ?? false
            }))
          }}
        />
        <FeedList 
          filters={filters} 
          items={apiData.feedItems}
          loading={loading}
          error={error}
          toggleFlag={toggleFlag}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </motion.div>
      <motion.div className="w-full md:w-1/4" variants={itemVariants}>
        <SummaryWidget 
          filters={filters}
          totalPosts={summaryStats.totalPosts}
          flaggedPosts={summaryStats.totalFlagged}
          filteredTotal={summaryStats.filteredTotal}
          filteredFlagged={summaryStats.filteredFlagged}
        />
      </motion.div>
    </motion.div>
  );
}

// Main page component with Suspense wrapper
export default function MediaFeedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MediaFeedContent />
    </Suspense>
  );
}
