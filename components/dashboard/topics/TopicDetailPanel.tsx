"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Topic } from "@/utils/types";

interface TopicDetailPanelProps {
  selectedTopic: string | null;
  topics: Topic[];
  onUpdateTopic: (topic: Topic) => void;
}

function generateRandomSentimentHistory(days: number) {
  const history = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const positive = Math.floor(Math.random() * 100);
    const negative = Math.floor(Math.random() * (100 - positive));
    const neutral = 100 - positive - negative;
    
    history.push({
      date: date.toISOString().split('T')[0],
      positive,
      neutral,
      negative,
    });
  }
  return history;
}

export function TopicDetailPanel({ selectedTopic, topics, onUpdateTopic }: TopicDetailPanelProps) {
  const [topicDetails, setTopicDetails] = useState<Topic | null>(null);

  useEffect(() => {
    if (selectedTopic) {
      const topic = topics.find((t) => t.id === selectedTopic);
      if (topic && topic.sentimentHistory.length === 0) {
        topic.sentimentHistory = generateRandomSentimentHistory(30);
      }
      setTopicDetails(topic || null);
    }
  }, [selectedTopic, topics]);

  if (!selectedTopic || !topicDetails) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Select a topic to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{topicDetails.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              {topicDetails.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {topicDetails.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Alert Threshold</h3>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={topicDetails.alertThreshold}
                onChange={(e) =>
                  setTopicDetails({
                    ...topicDetails,
                    alertThreshold: Number.parseInt(e.target.value),
                  })
                }
                className="w-20"
              />
              <Label>%</Label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Sentiment Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={topicDetails.sentimentHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="positive" stroke="#10b981" />
                <Line type="monotone" dataKey="neutral" stroke="#6b7280" />
                <Line type="monotone" dataKey="negative" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <Button className="w-full">Save Changes</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
