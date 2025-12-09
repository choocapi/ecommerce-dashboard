"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useState } from "react";

interface NumberInputProps {
  value?: number | string;
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
  suffix?: string;
  thousandSeparator?: boolean;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      placeholder,
      suffix,
      thousandSeparator = true,
      min,
      max,
      step,
      disabled,
      className,
      id,
      name,
      ...props
    },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = useState("");

    // Format number with thousand separator
    const formatNumber = (num: number | string): string => {
      if (num === "" || num === undefined || num === null) return "";

      const numericValue = typeof num === "string" ? parseFloat(num) : num;
      if (isNaN(numericValue)) return "";

      if (thousandSeparator) {
        return numericValue.toLocaleString("vi-VN");
      }

      return numericValue.toString();
    };

    // Parse display value back to number
    const parseNumber = (str: string): number | undefined => {
      // Remove thousand separators and parse
      const cleaned = str.replace(/[,.]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? undefined : parsed;
    };

    // Update display value when prop value changes
    useEffect(() => {
      if (value === undefined || value === null) {
        setDisplayValue("");
      } else {
        setDisplayValue(formatNumber(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Allow empty string, digits, and thousand separator characters
      if (inputValue === "" || /^[0-9,.]*$/.test(inputValue)) {
        setDisplayValue(inputValue);

        // Parse and call onChange
        const numericValue = parseNumber(inputValue);
        onChange?.(numericValue);
      }
    };

    const handleBlur = () => {
      // Format the value when losing focus
      const numericValue = parseNumber(displayValue);
      if (numericValue !== undefined) {
        setDisplayValue(formatNumber(numericValue));
      } else {
        setDisplayValue("");
      }
    };

    const handleFocus = () => {
      // Remove formatting when focusing to allow editing
      if (displayValue && thousandSeparator) {
        const numericValue = parseNumber(displayValue);
        if (numericValue !== undefined) {
          setDisplayValue(numericValue.toString());
        }
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            suffix && "pr-12", // Add padding for suffix
            className,
          )}
          id={id}
          name={name}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-sm text-gray-500">{suffix}</span>
          </div>
        )}
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
