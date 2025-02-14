"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Instagram,
  Youtube,
  Twitter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface PlatformData {
  name: string;
  icon: any; // Using 'any' for brevity, you might want to type this properly
}

interface ApiData {
  platforms: PlatformData[];
  languages: { value: string; label: string }[];
  // Add other API data structures as needed
}

interface Filters {
  platforms: string[];
  dateRange: { start: Date | null; end: Date | null };
  language: string;
  sentiment: string;
  flagStatus: string;
  sortBy: string;
}

interface FilterPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  apiData: ApiData;
}

export default function FilterPanel({ filters, setFilters, apiData }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const handleDateRangeSet = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      setFilters({
        ...filters,
        dateRange: {
          start: tempDateRange.from,
          end: tempDateRange.to
        }
      });
    }
  };

  const clearDateRange = () => {
    setTempDateRange(undefined);
    setFilters({
      ...filters,
      dateRange: { start: null, end: null }
    });
  };

  return (
    <motion.div
      className="bg-card text-card-foreground p-4 rounded-lg shadow-md mb-6"
      initial={{ height: "auto" }}
      animate={{ height: isExpanded ? "auto" : "80px" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters & Sorting</h2>
        <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isExpanded ? "Collapse" : "Expand"} filters
          </span>
        </Button>
      </div>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="platforms">
              <AccordionTrigger>Platforms</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {apiData.platforms.map((platform) => (
                    <Button
                      key={platform.name}
                      variant={
                        filters.platforms.includes(platform.name)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        const newPlatforms = filters.platforms.includes(
                          platform.name
                        )
                          ? filters.platforms.filter((p) => p !== platform.name)
                          : [...filters.platforms, platform.name];
                        setFilters({ ...filters, platforms: newPlatforms });
                      }}
                    >
                      <platform.icon className="mr-1 h-4 w-4" />
                      {platform.name}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="dateRange">
              <AccordionTrigger>Date Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <DatePickerWithRange 
                    date={tempDateRange}
                    setDate={setTempDateRange}
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleDateRangeSet}
                      disabled={!tempDateRange?.from || !tempDateRange?.to}
                    >
                      Set Date Range
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={clearDateRange}
                    >
                      Clear
                    </Button>
                  </div>
                  {filters.dateRange.start && filters.dateRange.end && (
                    <p className="text-sm text-muted-foreground">
                      Active Range: {filters.dateRange.start.toLocaleDateString()} - {filters.dateRange.end.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="language">
              <AccordionTrigger>Language</AccordionTrigger>
              <AccordionContent>
                <Select
                  onValueChange={(value) =>
                    setFilters({ ...filters, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiData.languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sentiment">
              <AccordionTrigger>Sentiment</AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  onValueChange={(value) =>
                    setFilters({ ...filters, sentiment: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="positive" id="positive" />
                    <Label htmlFor="positive">Positive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="neutral" />
                    <Label htmlFor="neutral">Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="negative" id="negative" />
                    <Label htmlFor="negative">Negative</Label>
                  </div>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="flagStatus">
              <AccordionTrigger>Flag Status</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flagged"
                    checked={filters.flagStatus === "flagged"}
                    onCheckedChange={(checked) =>
                      setFilters({
                        ...filters,
                        flagStatus: checked ? "flagged" : "",
                      })
                    }
                  />
                  <Label htmlFor="flagged">Show only flagged content</Label>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sortBy">
              <AccordionTrigger>Sort By</AccordionTrigger>
              <AccordionContent>
                <Select
                  onValueChange={(value) =>
                    setFilters({ ...filters, sortBy: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sorting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="engagement">
                      Highest Engagement
                    </SelectItem>
                    <SelectItem value="impact">Highest Impact</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      )}
    </motion.div>
  );
}
