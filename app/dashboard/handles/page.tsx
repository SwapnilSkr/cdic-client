"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockHandles } from "@/utils/mockHandles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Search } from "lucide-react";

const ITEMS_PER_PAGE = 10;

// Helper function to format large numbers
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export default function HandlesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [frequencyFilter, setFrequencyFilter] = useState<string | null>(null);

  const filteredHandles = useMemo(() => {
    return mockHandles.filter((handle) => {
      const matchesSearch = handle.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPlatform =
        !platformFilter || handle.platform === platformFilter;
      const matchesFrequency =
        !frequencyFilter || handle.frequency === frequencyFilter;
      return matchesSearch && matchesPlatform && matchesFrequency;
    });
  }, [searchQuery, platformFilter, frequencyFilter]);

  const paginatedHandles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHandles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredHandles, currentPage]);

  const totalPages = Math.ceil(filteredHandles.length / ITEMS_PER_PAGE);

  const chartData = useMemo(() => {
    const data: {
      [key: string]: { followers: number; posts: number; engagement: number };
    } = {};
    filteredHandles.forEach((handle) => {
      if (!data[handle.platform]) {
        data[handle.platform] = { followers: 0, posts: 0, engagement: 0 };
      }
      data[handle.platform].followers += handle.followers;
      data[handle.platform].posts += handle.posts;
      data[handle.platform].engagement += handle.engagement;
    });
    return Object.entries(data).map(([platform, stats]) => ({
      platform,
      ...stats,
    }));
  }, [filteredHandles]);

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Handles</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex w-full md:w-auto space-x-2">
          <Input
            placeholder="Search handles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <Select
            onValueChange={(value) =>
              setPlatformFilter(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              setFrequencyFilter(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frequencies</SelectItem>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatNumber(value),
                  name,
                ]}
                labelFormatter={(label) => `Platform: ${label}`}
              />
              <Legend />
              <Bar dataKey="followers" name="Followers" fill="#8884d8" />
              <Bar dataKey="posts" name="Posts" fill="#82ca9d" />
              <Bar dataKey="engagement" name="Engagement" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="bg-background rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Frequency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedHandles.map((handle) => (
              <TableRow key={handle.id}>
                <TableCell>{handle.name}</TableCell>
                <TableCell>{handle.platform}</TableCell>
                <TableCell>{handle.followers.toLocaleString()}</TableCell>
                <TableCell>{handle.posts.toLocaleString()}</TableCell>
                <TableCell>{handle.engagement.toLocaleString()}</TableCell>
                <TableCell>{handle.frequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                isActive={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                isActive={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </motion.div>
  );
}
