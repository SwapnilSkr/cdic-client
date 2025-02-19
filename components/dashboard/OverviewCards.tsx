import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/state/user.store";

interface PostStats {
  totalPosts: number;
  flaggedPosts: number;
}

export default function OverviewCards() {
  const [stats, setStats] = useState<PostStats>({
    totalPosts: 0,
    flaggedPosts: 0,
  });
  const { token } = useUserStore();

  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/statistics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setStats(data.data);
      } catch (error) {
        console.error("Error fetching post statistics:", error);
      }
    };

    fetchStats();
  }, [token]);

  console.log(stats);

  const overviewData = [
    { 
      title: "Total Posts Monitored", 
      value: stats?.totalPosts?.toLocaleString() || "0", 
      color: "text-primary" 
    },
    { 
      title: "Flagged Content", 
      value: stats?.flaggedPosts?.toLocaleString() || "0", 
      color: "text-destructive" 
    },
    { 
      title: "Fact-Checks Performed", 
      value: "789", 
      color: "text-secondary" 
    },
    { 
      title: "Active Alerts", 
      value: "23", 
      color: "text-warning" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {overviewData.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
