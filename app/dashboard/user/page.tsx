"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserProfileSection } from "@/components/dashboard/user/UserProfileSection";
import { NotificationSettingsSection } from "@/components/dashboard/user/NotificationSettingsSection";
import { RoleAccessManagementSection } from "@/components/dashboard/user/RoleAccessManagementSection";
import { SystemIntegrationSettingsSection } from "@/components/dashboard/user/SystemIntegrationSettingsSection";
import { AuditLogSection } from "@/components/dashboard/user/AuditLogSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserManagementPage() {
  const [isAdmin] = useState(true); // This would normally be determined by user role

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <h1 className="text-3xl font-bold">User Management & Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isAdmin && <TabsTrigger value="roles">Roles & Access</TabsTrigger>}
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <UserProfileSection />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettingsSection />
        </TabsContent>
        {isAdmin && (
          <TabsContent value="roles">
            <RoleAccessManagementSection />
          </TabsContent>
        )}
        <TabsContent value="integrations">
          <SystemIntegrationSettingsSection />
        </TabsContent>
        <TabsContent value="audit">
          <AuditLogSection />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
