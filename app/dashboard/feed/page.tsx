/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import FilterPanel from "@/components/dashboard/feed/FilterPanel";
import FeedList from "@/components/dashboard/feed/FeedList";
import SummaryWidget from "@/components/dashboard/feed/SummaryWidget";
import { Twitter, Instagram, Youtube, Plus } from "lucide-react";
import { type FeedItem } from "@/utils/mockFeedItems";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserStore } from "@/state/user.store";
import { FaGoogle, FaReddit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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

interface Topic {
  _id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

// Separate the main content into a new component
function MediaFeedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user } = useUserStore();
  const { toast } = useToast();
  
  // Initialize with URL params
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  // Fetch topics when modal opens
  useEffect(() => {
    if (showAddModal && token) {
      fetchTopics();
    }
  }, [showAddModal, token]);

  // Fetch topics function
  const fetchTopics = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/topics?limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch topics");
      
      const data = await response.json();
      setTopics(data.topics);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load topics. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const handleSubmitPost = async () => {
    if (!postUrl || !selectedPlatform || !selectedTopic) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/fetch-by-url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            url: postUrl,
            platform: selectedPlatform,
            topicId: selectedTopic
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add post");
      }
      
      const result = await response.json();
      
      // Add the new post to state if applicable
      if (result.data) {
        // Refresh current page to show the new post
        fetchPosts(pagination.currentPage);
      }
      
      toast({
        title: "Success",
        description: "Post added successfully",
      });
      
      // Reset form and close modal
      setPostUrl("");
      setSelectedPlatform("");
      setSelectedTopic("");
      setShowAddModal(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="flex justify-between items-center mb-4">
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
          <Button
            onClick={() => setShowAddModal(true)}
            className="ml-2"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Post
          </Button>
        </div>
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

      {/* Add Post Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Post by URL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="post-url">Post URL</Label>
              <Input
                id="post-url"
                placeholder="https://..."
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Youtube">Youtube</SelectItem>
                  <SelectItem value="Reddit">Reddit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger id="topic">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic._id} value={topic._id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPost}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
