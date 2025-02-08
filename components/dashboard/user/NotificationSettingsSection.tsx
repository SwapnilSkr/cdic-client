"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NotificationSettingsSection() {
  const [notificationPreferences, setNotificationPreferences] = useState({
    inApp: true,
    email: false,
    sms: false,
  });

  const handleToggle = (key: keyof typeof notificationPreferences) => {
    setNotificationPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Configure how you receive alerts and updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5" />
              <Label htmlFor="in-app">In-App Notifications</Label>
            </div>
            <Switch
              id="in-app"
              checked={notificationPreferences.inApp}
              onCheckedChange={() => handleToggle("inApp")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5" />
              <Label htmlFor="email">Email Notifications</Label>
            </div>
            <Switch
              id="email"
              checked={notificationPreferences.email}
              onCheckedChange={() => handleToggle("email")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-5 w-5" />
              <Label htmlFor="sms">SMS Notifications</Label>
            </div>
            <Switch
              id="sms"
              checked={notificationPreferences.sms}
              onCheckedChange={() => handleToggle("sms")}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
