"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
}

const mockAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    user: "John Doe",
    action: "Logged in",
    timestamp: new Date("2023-06-01T10:30:00"),
  },
  {
    id: "2",
    user: "Jane Smith",
    action: "Updated user profile",
    timestamp: new Date("2023-06-02T14:45:00"),
  },
  {
    id: "3",
    user: "Admin User",
    action: "Changed system settings",
    timestamp: new Date("2023-06-03T09:15:00"),
  },
  // Add more mock entries as needed
];

export function AuditLogSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Audit Log</h2>
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
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAuditLog.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.user}</TableCell>
              <TableCell>{entry.action}</TableCell>
              <TableCell>{format(entry.timestamp, "PPP p")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
