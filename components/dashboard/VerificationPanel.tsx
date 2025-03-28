import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@/state/user.store";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewedPost {
  id: string;
  content: string;
  timestamp: string;
  post_url: string;
}

export default function VerificationPanel() {
  const [posts, setPosts] = useState<ReviewedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useUserStore();

  useEffect(() => {
    const fetchReviewedPosts = async () => {
      if (!token) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/reviewed`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        setPosts(data.items);
      } catch (error) {
        console.error("Error fetching reviewed posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewedPosts();
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
            {[...Array(3)].map((_, index) => (
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

  if (!posts || posts.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Reviewed Posts</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reviewed Posts</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              There are no reviewed posts at the moment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Reviewed Posts</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <ul className="space-y-4">
            {posts.map((post) => (
              <li 
                key={post.id}
                className="flex flex-col space-y-2 hover:bg-muted/50 p-2 rounded-md transition-colors cursor-pointer group"
                onClick={() => handlePostClick(post.post_url)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm">{post.content}</span>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground flex-shrink-0" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(post.timestamp), "MMM d, yyyy 'at' h:mm a")}</span>
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
