"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Rss, Hash, Flag, BarChart2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Media Feed", icon: Rss, href: "/dashboard/feed" },
  { name: "Topics", icon: Hash, href: "/dashboard/topics" },
  { name: "Flagged Content", icon: Flag, href: "/dashboard/flagged" },
  { name: "Reporting", icon: BarChart2, href: "/dashboard/reporting" },
  { name: "User Management", icon: Users, href: "/dashboard/user" },
];

interface MobileSidebarProps {
  onClose: () => void;
}

export function MobileSidebar({ onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Menu</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={onClose}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
