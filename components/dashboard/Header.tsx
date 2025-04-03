"use client";

import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import type React from "react";
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
    <header className="bg-background border-b px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Section - Search */}
        <div className="w-full md:w-1/3">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search media..."
                className="pl-10 pr-4 py-2 rounded-md w-full"
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

        {/* Center Section - Logo */}
        <div className="flex-shrink-0 w-[200px] h-[100px] order-first md:order-none">
          <Image
            src={Logo}
            alt="Verideck Logo"
            width={0}
            height={0}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        {/* Right Section - Icons */}
        <div className="flex items-center justify-end space-x-4 w-full md:w-1/3">
          <button className="text-foreground hover:text-primary">
            <Bell size={20} />
          </button>
          <button className="text-foreground hover:text-primary">
            <User size={20} />
          </button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
