/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { DateRange } from "react-day-picker";

interface ReportFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function ReportFilters({ onFilterChange }: ReportFiltersProps) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [topic, setTopic] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState<string[]>([]);

  const handleFilterChange = () => {
    onFilterChange({
      dateRange: date,
      topics: topic.length > 0 ? topic : undefined,
      platforms: platform.length > 0 ? platform : undefined,
      sentiments: sentiment.length > 0 ? sentiment : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select
          onValueChange={(value) => setTopic(value === "all" ? [] : [value])}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            <SelectItem value="Climate Change">Climate Change</SelectItem>
            <SelectItem value="Artificial Intelligence">
              Artificial Intelligence
            </SelectItem>
            <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
            <SelectItem value="Space Exploration">Space Exploration</SelectItem>
            <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setPlatform(value === "all" ? [] : [value])}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="Twitter">Twitter</SelectItem>
            <SelectItem value="Facebook">Facebook</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="Reddit">Reddit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sentiment</Label>
        <div className="flex space-x-4">
          {["Positive", "Neutral", "Negative"].map((s) => (
            <div key={s} className="flex items-center space-x-2">
              <Checkbox
                id={s}
                checked={sentiment.includes(s.toLowerCase())}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSentiment([...sentiment, s.toLowerCase()]);
                  } else {
                    setSentiment(
                      sentiment.filter((item) => item !== s.toLowerCase())
                    );
                  }
                }}
              />
              <Label htmlFor={s}>{s}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleFilterChange}>Apply Filters</Button>
    </div>
  );
}
