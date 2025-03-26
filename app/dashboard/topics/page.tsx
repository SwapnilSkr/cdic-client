"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopicsList } from "@/components/dashboard/topics/TopicsList";
import { SearchAndFilter } from "@/components/dashboard/topics/SearchAndFilter";
import { TopicActionPanel } from "@/components/dashboard/topics/TopicActionPanel";
import { TopicDetailPanel } from "@/components/dashboard/topics/TopicDetailPanel";
import { Topic } from "@/utils/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/state/user.store";
import { Card } from "@/components/ui/card";

function TopicsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryPage = searchParams.get("page"); // Get page from query params
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [totalTopics, setTotalTopics] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(queryPage as string) || 1
  );
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;
  const { token } = useUserStore();

  const fetchTopics = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/topics?page=${page}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch topics");
      }
      const data = await response.json();
      setTopics(data.topics);
      setTotalTopics(data.total);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    if (token) {
      fetchTopics(currentPage);
    }
  }, [currentPage, token]);

  useEffect(() => {
    // Update the URL query parameter when the current page changes
    router.push(
      `${pathname}?${new URLSearchParams({
        ...Object.fromEntries(searchParams),
        page: currentPage.toString(),
      })}`
    );
  }, [currentPage, pathname, searchParams, router]);

  const handleAddTopic = async (newTopic: Omit<Topic, "id" | "createdAt">) => {
    const topic: Topic = {
      ...newTopic,
      _id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTopics((prev) => [...prev, topic]);

    // Re-fetch topics to ensure the list is updated
    await fetchTopics(currentPage);
  };

  const handleUpdateTopic = (updatedTopic: Topic) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic._id === updatedTopic._id ? updatedTopic : topic
      )
    );
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics((prev) => prev.filter((topic) => topic._id !== topicId));
    if (selectedTopic === topicId) {
      setSelectedTopic(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Topic Management</h1>
      <SearchAndFilter
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TopicActionPanel onAddTopic={handleAddTopic} />
          {isLoading ? (
            <Card className="p-6">
              <div className="space-y-3">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                  </div>
                ))}
              </div>
            </Card>
          ) : topics.length === 0 ? (
            <Card className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No topics found</h3>
              <p className="text-muted-foreground">You haven&apos;t created any topics yet. Use the panel above to create your first topic.</p>
            </Card>
          ) : (
            <TopicsList
              topics={topics}
              searchTerm={searchTerm}
              filter={filter}
              onSelectTopic={setSelectedTopic}
              onUpdateTopic={handleUpdateTopic}
              onDeleteTopic={handleDeleteTopic}
              pagination={{
                currentPage: currentPage,
                totalPages: Math.ceil(totalTopics / ITEMS_PER_PAGE),
                totalTopics: totalTopics,
                limit: ITEMS_PER_PAGE,
                hasNextPage:
                  currentPage < Math.ceil(totalTopics / ITEMS_PER_PAGE),
                hasPrevPage: currentPage > 1,
              }}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        <div className="lg:col-span-1">
          <TopicDetailPanel
            selectedTopic={selectedTopic}
            topics={topics}
            onUpdateTopic={handleUpdateTopic}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function TopicsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopicsPage />
    </Suspense>
  );
}
