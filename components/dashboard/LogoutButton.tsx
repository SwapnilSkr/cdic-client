"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useUserStore } from "@/state/user.store";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function LogoutButton() {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const {token} = useUserStore()

  const handleLogout = async () => {
    try {
      // Create audit log before logging out
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "User Logout",
          actionType: "profile"
        }),
      });

      logout();
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2 text-muted-foreground hover:text-primary"
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  );
} 