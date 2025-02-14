import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Filters {
  platforms: string[];
  sentiment?: string;
  flagStatus?: string;
  sortBy?: string;
}

interface SummaryWidgetProps {
  filters: Filters;
  totalPosts: number;
  flaggedPosts: number;
  filteredTotal: number;
  filteredFlagged: number;
}

export default function SummaryWidget({ 
  filters, 
  totalPosts, 
  flaggedPosts,
  filteredTotal,
  filteredFlagged 
}: SummaryWidgetProps) {
  // This is a simplified example. In a real application, you'd calculate these based on actual data.
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
                {Object.entries(filters).some(([_, value]) => 
                  Array.isArray(value) ? value.length > 0 : Boolean(value)
                ) && (
                  <>
                    <li>Total Posts: {filteredTotal}</li>
                    <li>Flagged Posts: {filteredFlagged}</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
