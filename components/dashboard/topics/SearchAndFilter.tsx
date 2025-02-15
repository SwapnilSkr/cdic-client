"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchAndFilterProps {
  setSearchTerm: (term: string) => void;
  filter: string | null;
  setFilter: (filter: string | null) => void;
}

export function SearchAndFilter({
  setSearchTerm,
  filter,
  setFilter,
}: SearchAndFilterProps) {
  const [tempSearchTerm, setTempSearchTerm] = useState<string>("");

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div className="flex space-x-2 w-full sm:2/3">
        <Input
          placeholder="Search topics..."
          value={tempSearchTerm}
          onChange={(e) => setTempSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
