import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Flag, Newspaper, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@/state/user.store";
import { Skeleton } from "@/components/ui/skeleton";

interface Statistics {
  totalPosts: number;
  flaggedPosts: number;
  factCheckedPosts: number;
  flaggedAuthors: number;
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
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 h-full">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="w-full h-full">
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
    },
    {
      title: "Flagged Authors",
      icon: UserX,
      value: statistics?.flaggedAuthors || 0,
      description: "Authors flagged for review"
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 h-full">
      {cards.map((card, i) => (
        <Card key={i} className="w-full h-full">
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
