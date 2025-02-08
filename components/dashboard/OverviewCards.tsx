import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const overviewData = [
  { title: "Total Posts Monitored", value: "152,847", color: "text-primary" },
  { title: "Flagged Content", value: "1,234", color: "text-destructive" },
  { title: "Fact-Checks Performed", value: "789", color: "text-secondary" },
  { title: "Active Alerts", value: "23", color: "text-warning" },
];

export default function OverviewCards() {
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
