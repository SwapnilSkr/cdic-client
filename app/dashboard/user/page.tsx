"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/state/user.store";
import { UserProfileSection } from "@/components/dashboard/user/UserProfileSection";
import { NotificationSettingsSection } from "@/components/dashboard/user/NotificationSettingsSection";
import { RoleAccessManagementSection } from "@/components/dashboard/user/RoleAccessManagementSection";
import { SystemIntegrationSettingsSection } from "@/components/dashboard/user/SystemIntegrationSettingsSection";
import { AuditLogSection } from "@/components/dashboard/user/AuditLogSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagementPage() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Settings</h1>
        {isAdmin && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            Admin Access
          </span>
        )}
      </div>

      <Tabs defaultValue="profile" className="w-full space-y-12 lg:space-y-6">
        <div className="sticky top-0 z-10 pb-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="profile" className="h-10">Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="h-10">Notifications</TabsTrigger>
            {isAdmin && <TabsTrigger value="roles" className="h-10">Roles & Access</TabsTrigger>}
            <TabsTrigger value="integrations" className="h-10">Integrations</TabsTrigger>
            {isAdmin && <TabsTrigger value="audit" className="h-10">Audit Log</TabsTrigger>}
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="profile" className="mt-0">
            <UserProfileSection 
              user={user!}
              isAdmin={isAdmin} 
            />
          </TabsContent>
          <TabsContent value="notifications" className="mt-0">
            <NotificationSettingsSection 
              // userId={user!._id}
            />
          </TabsContent>
          {isAdmin && (
            <TabsContent value="roles" className="mt-0">
              <RoleAccessManagementSection />
            </TabsContent>
          )}
          <TabsContent value="integrations" className="mt-0">
            <SystemIntegrationSettingsSection 
              // userId={user!._id}
              // isAdmin={isAdmin}
            />
          </TabsContent>
          {isAdmin && (
            <TabsContent value="audit" className="mt-0">
              <AuditLogSection />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </motion.div>
  );
}
