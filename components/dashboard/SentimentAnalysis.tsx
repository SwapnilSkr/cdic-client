"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", positive: 4000, negative: 2400, neutral: 2400 },
  { name: "Tue", positive: 3000, negative: 1398, neutral: 2210 },
  { name: "Wed", positive: 2000, negative: 9800, neutral: 2290 },
  { name: "Thu", positive: 2780, negative: 3908, neutral: 2000 },
  { name: "Fri", positive: 1890, negative: 4800, neutral: 2181 },
  { name: "Sat", positive: 2390, negative: 3800, neutral: 2500 },
  { name: "Sun", positive: 3490, negative: 4300, neutral: 2100 },
];

export default function SentimentAnalysis() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="positive"
              stroke="hsl(var(--primary))"
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke="hsl(var(--destructive))"
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="hsl(var(--secondary))"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
