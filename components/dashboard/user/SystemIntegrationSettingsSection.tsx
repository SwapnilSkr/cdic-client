"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import type React from "react"; // Added import for React

interface Integration {
  name: string;
  icon: React.ReactNode;
  status: boolean;
  apiKey: string;
}

export function SystemIntegrationSettingsSection() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      status: true,
      apiKey: "fb_api_key_123",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      status: false,
      apiKey: "",
    },
    {
      name: "YouTube",
      icon: <Youtube className="h-5 w-5" />,
      status: true,
      apiKey: "yt_api_key_456",
    },
    {
      name: "Reddit",
      icon: <MessageCircle className="h-5 w-5" />,
      status: false,
      apiKey: "",
    },
  ]);

  const [alertThresholds, setAlertThresholds] = useState({
    sentiment: 50,
    engagement: 70,
    flaggedContent: 30,
  });

  const handleIntegrationToggle = (index: number) => {
    const newIntegrations = [...integrations];
    newIntegrations[index].status = !newIntegrations[index].status;
    setIntegrations(newIntegrations);
  };

  const handleApiKeyChange = (index: number, value: string) => {
    const newIntegrations = [...integrations];
    newIntegrations[index].apiKey = value;
    setIntegrations(newIntegrations);
  };

  const handleThresholdChange = (
    key: keyof typeof alertThresholds,
    value: number[]
  ) => {
    setAlertThresholds({ ...alertThresholds, [key]: value[0] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API & Integration Configuration</CardTitle>
          <CardDescription>
            Manage your integrations and API keys here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {integrations.map((integration, index) => (
            <div
              key={integration.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {integration.icon}
                <Label htmlFor={`integration-${index}`}>
                  {integration.name}
                </Label>
              </div>
              <div className="flex items-center space-x-4">
                <Switch
                  id={`integration-${index}`}
                  checked={integration.status}
                  onCheckedChange={() => handleIntegrationToggle(index)}
                />
                <Input
                  placeholder="API Key"
                  value={integration.apiKey}
                  onChange={(e) => handleApiKeyChange(index, e.target.value)}
                  disabled={!integration.status}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Threshold Settings</CardTitle>
          <CardDescription>
            Configure thresholds for various alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sentiment-threshold">
              Sentiment Alert Threshold
            </Label>
            <Slider
              id="sentiment-threshold"
              min={0}
              max={100}
              step={1}
              value={[alertThresholds.sentiment]}
              onValueChange={(value) =>
                handleThresholdChange("sentiment", value)
              }
            />
            <p className="text-sm text-muted-foreground">
              Current: {alertThresholds.sentiment}%
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="engagement-threshold">
              Engagement Alert Threshold
            </Label>
            <Slider
              id="engagement-threshold"
              min={0}
              max={100}
              step={1}
              value={[alertThresholds.engagement]}
              onValueChange={(value) =>
                handleThresholdChange("engagement", value)
              }
            />
            <p className="text-sm text-muted-foreground">
              Current: {alertThresholds.engagement}%
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="flagged-content-threshold">
              Flagged Content Alert Threshold
            </Label>
            <Slider
              id="flagged-content-threshold"
              min={0}
              max={100}
              step={1}
              value={[alertThresholds.flaggedContent]}
              onValueChange={(value) =>
                handleThresholdChange("flaggedContent", value)
              }
            />
            <p className="text-sm text-muted-foreground">
              Current: {alertThresholds.flaggedContent}%
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Configure AI sensitivity and processing parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="ai-sensitivity">AI Sensitivity</Label>
            <Slider
              id="ai-sensitivity"
              min={0}
              max={100}
              step={1}
              defaultValue={[75]}
            />
            <p className="text-sm text-muted-foreground">
              Adjust the sensitivity of AI analysis
            </p>
          </div>
          {/* Add more advanced settings as needed */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
