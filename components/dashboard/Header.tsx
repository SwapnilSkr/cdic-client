"use client";

import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import type React from "react"; // Added import for React
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Logo from "@/public/productLogo.png";
import Image from "next/image";

export default function Header({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/dashboard/feed?keyword=${encodeURIComponent(searchQuery.trim())}&sortBy=recent&page=1`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-background border-b py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        {children}
        <div className="h-[80px] w-auto mr-6">
          <Image
            src={Logo}
            alt="Media Monitor Logo"
            className="h-full w-auto"
            priority
          />
        </div>
        <div className="relative hidden sm:flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search media..."
              className="pl-10 pr-4 py-2 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-foreground hover:text-primary">
          <Bell size={20} />
        </button>
        <button className="text-foreground hover:text-primary">
          <User size={20} />
        </button>
        <ModeToggle />
      </div>
    </header>
  );
}
