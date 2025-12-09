"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATISTICS_RANGE_OPTIONS, type StatisticsRange } from "@/types/statistics";

interface RangeSelectorProps {
  value?: StatisticsRange;
  onValueChange: (value: StatisticsRange) => void;
  className?: string;
}

export function RangeSelector({ value, onValueChange, className }: RangeSelectorProps) {
  return (
    <Select value={value} onValueChange={(val) => onValueChange(val as StatisticsRange)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Chọn khoảng thời gian" />
      </SelectTrigger>
      <SelectContent>
        {STATISTICS_RANGE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
