import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const feedItems = [
  {
    id: 1,
    content: "Viral post about climate change gaining traction",
    platform: "Twitter",
    time: "2 minutes ago",
  },
  {
    id: 2,
    content: "New conspiracy theory spreading on social media",
    platform: "Facebook",
    time: "15 minutes ago",
  },
  {
    id: 3,
    content: "Breaking news: Major political announcement",
    platform: "News Outlet",
    time: "1 hour ago",
  },
];

export default function MediaFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Media Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {feedItems.map((item) => (
            <li key={item.id} className="border-b pb-2">
              <p>{item.content}</p>
              <span className="text-sm text-muted-foreground">
                {item.platform} • {item.time}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
