import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Flag, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@/state/user.store";
import { Skeleton } from "@/components/ui/skeleton";

interface Statistics {
  totalPosts: number;
  flaggedPosts: number;
  factCheckedPosts: number;
}

export default function OverviewCards() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useUserStore();

  useEffect(() => {
    if (!token) return;
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/statistics`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const {data} = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [token]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-4 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Posts",
      icon: Newspaper,
      value: statistics?.totalPosts || 0,
      description: "Total posts monitored"
    },
    {
      title: "Flagged Posts",
      icon: Flag,
      value: statistics?.flaggedPosts || 0,
      description: "Posts flagged for review"
    },
    {
      title: "Fact-Checked",
      icon: FileCheck,
      value: statistics?.factCheckedPosts || 0,
      description: "Posts fact-checked"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
