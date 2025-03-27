import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useUserStore } from "@/state/user.store";
import { FileX, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface FeedItem {
  _id: string;
  content: string;
  platform: string;
  topic: string;
  timestamp: string;
  post_url: string;
  engagement: {
    likes: number;
    comments: number;
  };
}

export default function MediaFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useUserStore();

  useEffect(() => {
    if (!token) return;
    const fetchFeed = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/today-discussed`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        setFeedItems(data.items);
      } catch (error) {
        console.error("Error fetching today's feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [token]);

  const handlePostClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <Skeleton className="h-8 w-[300px]" />
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <li key={index} className="border-b pb-2">
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  if (!feedItems || feedItems.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Today&apos;s Most Discussed Topics</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileX className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Discussions Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              There haven&apos;t been any posts or discussions today. Check back later for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b flex-shrink-0">
        <CardTitle>Today&apos;s Most Discussed Topics</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <ul className="divide-y">
            {feedItems.map((item) => (
              <li 
                key={item._id} 
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => handlePostClick(item.post_url)}
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm mb-2">{item.content}</p>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground flex-shrink-0" />
                </div>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex justify-between items-center">
                    <span>{item.platform} • {item.topic}</span>
                    {item.engagement && item.platform !== "News" && <span>
                      {item.engagement.likes} likes • {item.engagement.comments} comments
                    </span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
