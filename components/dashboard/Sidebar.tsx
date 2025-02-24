"use client";

import Link from "next/link";
import {
  Home,
  Rss,
  Hash,
  Flag,
  BarChart2,
  Users,
  MessageSquare,  
  AtSign,
  LogOut,
  Eye,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Media Feed", icon: Rss, href: "/dashboard/feed" },
  { name: "Topics", icon: Hash, href: "/dashboard/topics" },
  { name: "Flagged Content", icon: Flag, href: "/dashboard/flagged" },
  { name: "Reporting", icon: BarChart2, href: "/dashboard/reporting" },
  // { name: "Ask AI", icon: MessageSquare, href: "/dashboard/ai-chat" },
  { name: "Watchlist", icon: Eye, href: "/dashboard/watchlist" },
  { name: "User Management", icon: Users, href: "/dashboard/user" },
];

export default function Sidebar() {
  return (
    <aside className="bg-background border-r w-64 min-h-screen p-4 flex flex-col">
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-md"
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t pt-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
