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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const data = [
  { name: "Jan", engagement: 4000, reach: 2400, interactions: 2400 },
  { name: "Feb", engagement: 3000, reach: 1398, interactions: 2210 },
  { name: "Mar", engagement: 2000, reach: 9800, interactions: 2290 },
  { name: "Apr", engagement: 2780, reach: 3908, interactions: 2000 },
  { name: "May", engagement: 1890, reach: 4800, interactions: 2181 },
  { name: "Jun", engagement: 2390, reach: 3800, interactions: 2500 },
];

const pieData = [
  { name: "Positive", value: 400 },
  { name: "Neutral", value: 300 },
  { name: "Negative", value: 300 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export function GraphicalAnalytics() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Engagement Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="engagement" stroke="#8884d8" />
              <Line type="monotone" dataKey="reach" stroke="#82ca9d" />
              <Line type="monotone" dataKey="interactions" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Engagement Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="engagement" fill="#8884d8" />
              <Bar dataKey="reach" fill="#82ca9d" />
              <Bar dataKey="interactions" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
