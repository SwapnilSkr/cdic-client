import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Filters {
  platforms: string[];
  sentiment?: string;
  flagStatus?: string;
  sortBy?: string;
}

export default function SummaryWidget({ filters }: { filters: Filters }) {
  // This is a simplified example. In a real application, you'd calculate these based on actual data.
  const totalPosts = 1234;
  const flaggedPosts = 56;
  const averageSentiment = "Positive";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Feed Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Active Filters
              </h3>
              <ul className="mt-2 text-sm">
                {filters.platforms.length > 0 && (
                  <li>Platforms: {filters.platforms.join(", ")}</li>
                )}
                {filters.sentiment && <li>Sentiment: {filters.sentiment}</li>}
                {filters.flagStatus && (
                  <li>Flag Status: {filters.flagStatus}</li>
                )}
                {filters.sortBy && <li>Sorted by: {filters.sortBy}</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Key Metrics
              </h3>
              <ul className="mt-2 text-sm">
                <li>Total Posts: {totalPosts}</li>
                <li>Flagged Posts: {flaggedPosts}</li>
                <li>Average Sentiment: {averageSentiment}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
