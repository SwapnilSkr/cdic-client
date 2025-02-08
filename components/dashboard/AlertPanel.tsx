import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const alerts = [
  {
    id: 1,
    content: "Potential disinformation campaign detected",
    severity: "high",
  },
  {
    id: 2,
    content: "Unusual spike in negative sentiment towards [Brand X]",
    severity: "medium",
  },
  {
    id: 3,
    content: "New trending hashtag related to sensitive political topic",
    severity: "low",
  },
];

export default function AlertPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li key={alert.id} className="flex items-center space-x-2">
              <AlertTriangle
                className={`${alert.severity === "high" ? "text-destructive" : alert.severity === "medium" ? "text-warning" : "text-info"}`}
              />
              <span>{alert.content}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
