"use client"

import { TableHeader } from "@/components/ui/table"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Search, Flag } from "lucide-react"

const ITEMS_PER_PAGE = 10

// Helper function to format large numbers
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}
export default function HandlesPage() {
  const [authors, setAuthors] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalAuthors, setTotalAuthors] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState<string | null>(null)
  //const [frequencyFilter, setFrequencyFilter] = useState<string | null>(null)
  const [platformStatistics, setPlatformStatistics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [flaggedFilter, setFlaggedFilter] = useState<string>("all")

  const fetchAuthors = async (page: number, searchTerm: string, platformFilter: string | null, flaggedFilter: string) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      })

      if (searchTerm) {
        queryParams.append('search', searchTerm)
      }
      
      if (platformFilter) {
        queryParams.append('platform', platformFilter)
      }

      if (flaggedFilter && flaggedFilter !== 'all') {
        queryParams.append('flagged', flaggedFilter)
      }

      // Update URL with query params without page reload
      window.history.pushState(
        {},
        '',
        `${window.location.pathname}?${queryParams.toString()}`
      )

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/authors?${queryParams.toString()}`
      )
      const data = await response.json()
      setAuthors(data.authors)
      setTotalAuthors(data.totalAuthors)
    } catch (error) {
      console.error("Error fetching authors:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pageParam = parseInt(params.get('page') || '1')
    const searchParam = params.get('search') || ''
    const platformParam = params.get('platform') || null
    const flaggedParam = params.get('flagged') || 'all'

    setCurrentPage(pageParam)
    setSearchTerm(searchParam)
    setSearchQuery(searchParam)
    setPlatformFilter(platformParam)
    setFlaggedFilter(flaggedParam)

    fetchAuthors(pageParam, searchParam, platformParam, flaggedParam)
  }, []) // Initial load

  // Add this new effect to handle URL updates and state preservation
  useEffect(() => {
    // Update URL whenever filters change
    const queryParams = new URLSearchParams()
    
    if (currentPage > 1) {
      queryParams.set('page', currentPage.toString())
    }
    
    if (searchQuery) {
      queryParams.set('search', searchQuery)
    }
    
    if (platformFilter) {
      queryParams.set('platform', platformFilter)
    }
    
    if (flaggedFilter && flaggedFilter !== 'all') {
      queryParams.set('flagged', flaggedFilter)
    }

    const queryString = queryParams.toString()
    const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`
    window.history.replaceState({}, '', newUrl)
    
  }, [currentPage, searchQuery, platformFilter, flaggedFilter])

  // Add a new useEffect to handle pagination and filter changes
  useEffect(() => {
    fetchAuthors(currentPage, searchTerm, platformFilter, flaggedFilter)
  }, [currentPage]) // Trigger fetch when page changes

  const totalPages = Math.ceil(totalAuthors / ITEMS_PER_PAGE)

  const fetchPlatformStatistics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/platform-statistics`)
      const data = await response.json()
      setPlatformStatistics(data.data)
    } catch (error) {
      console.error("Error fetching platform statistics:", error)
    }
  }

  useEffect(() => {
    fetchPlatformStatistics()
  }, [])

  // Prepare chart data from platformStatistics
  const chartData = useMemo(() => {
    return platformStatistics.map(stat => ({
      platform: stat._id, // Platform name    
      followers: stat.totalFollowers, // Number of followers
      views: stat.totalViews, // Number of views
    }))
  }, [platformStatistics])


  const handleSearch = () => {
    setCurrentPage(1)
    setSearchQuery(searchTerm)
    fetchAuthors(1, searchTerm, platformFilter, flaggedFilter)
  }

  // Update handlePageChange to include all filters
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchAuthors(page, searchTerm, platformFilter, flaggedFilter)
  }

  // Update handlePlatformChange to immediately trigger search and update URL
  const handlePlatformChange = (value: string) => {
    const newPlatformFilter = value === "all" ? null : value
    setPlatformFilter(newPlatformFilter)
    setCurrentPage(1)
    fetchAuthors(1, searchQuery, newPlatformFilter, flaggedFilter) // Use searchQuery instead of searchTerm
  }

  // Update handleFlaggedChange to immediately trigger search
  const handleFlaggedChange = (value: string) => {
    setFlaggedFilter(value)
    setCurrentPage(1)
    fetchAuthors(1, searchQuery, platformFilter, value)
  }

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5; // Define the maximum number of pagination buttons
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    // First page button
    if (start > 1) {
      buttons.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (start > 2) buttons.push(<span key="start-dots">...</span>);
    }

    // Numbered buttons
    for (let i = start; i <= end; i++) {
      buttons.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page button
    if (end < totalPages) {
      if (end < totalPages - 1) {
        buttons.push(<span key="end-dots">...</span>);
      }
      buttons.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return buttons;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Watchlist</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex w-full md:w-auto space-x-2">
          <Input
            placeholder="Search watchlist..."
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
          <Select onValueChange={handlePlatformChange} value={platformFilter || "all"}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Youtube">YouTube</SelectItem>
              <SelectItem value="Google News">Google News</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleFlaggedChange} value={flaggedFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Flag Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              <SelectItem value="true">
                <div className="flex items-center">
                  <Flag className="h-4 w-4 mr-2 text-destructive" />
                  Flagged
                </div>
              </SelectItem>
              <SelectItem value="false">Not Flagged</SelectItem>
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
              <YAxis tickFormatter={formatNumber} className="text-[13px]" />
              <Tooltip
                formatter={(value: number, name: string) => [formatNumber(value), name]}
                labelFormatter={(label) => `Platform: ${label}`}
              />
              <Legend />
              <Bar dataKey="followers" name="Followers" fill="#8884d8" />
              <Bar dataKey="views" name="Engagements" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {loading ? (
        <p>Loading authors...</p>
      ) : (
        <div className="bg-background rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead aria-label="Flag Status"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.map((handle) => (
                <TableRow key={handle.author_id}>
                  <TableCell onClick={() => window.open(handle.profile_link, '_blank')}>{handle.username}</TableCell>
                  <TableCell>{handle.platform}</TableCell>
                  <TableCell>{handle.followers_count?.toLocaleString() ?? "N/A"}</TableCell>
                  <TableCell>{handle.posts_count?.toLocaleString() ?? "N/A"}</TableCell>
                  <TableCell>
                    {handle.flagged && (
                      <Flag 
                        className="h-4 w-4 text-destructive cursor-help" 
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {currentPage > 1 ? (
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
              ) : (
                <span className="disabled">Previous</span>
              )}
            </PaginationItem>
            {renderPaginationButtons()}
            <PaginationItem>
              {currentPage < totalPages ? (
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
              ) : (
                <span className="disabled">Next</span>
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </motion.div>
  )
}

