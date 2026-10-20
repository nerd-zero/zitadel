"use client";

import { getComponentRoundness } from "@/lib/theme";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { ChangeEvent, DetailedHTMLProps, forwardRef, InputHTMLAttributes, ReactNode } from "react";

export type TextInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string;
  suffix?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string | ReactNode;
  success?: string | ReactNode;
  disabled?: boolean;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (value: ChangeEvent<HTMLInputElement>) => void;
  roundness?: string; // Allow override via props
};

// listnun fields (LISTNUN_UI_SPEC 2): 44px, field background, 6px radius;
// errors get a 2px critical border.
const styles = (error: boolean, disabled: boolean, roundnessClasses: string = "rounded-md") =>
  clsx(
    {
      "min-h-11 px-3 bg-ln-field text-ln-ink text-[15px] font-normal grow transition-[border-color,box-shadow] duration-200": true,
      "border border-ln-field-border focus:border-ln-ink focus:outline-none focus:ring-2 focus:ring-ln-ink/20 placeholder:text-ln-ink-3":
        !error,
      "border-2 border-ln-bad-strong focus:border-ln-bad-strong focus:outline-none focus:ring-2 focus:ring-ln-bad-strong/20":
        error,
      "pointer-events-none opacity-60 cursor-default": disabled,
    },
    roundnessClasses, // Apply the full roundness classes directly
  );

// Helper function to get default input roundness from theme
function getDefaultInputRoundness(): string {
  return getComponentRoundness("input");
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      placeholder,
      defaultValue,
      suffix,
      required = false,
      error,
      disabled,
      success,
      onChange,
      onBlur,
      roundness,
      ...props
    },
    ref,
  ) => {
    // Use theme-based roundness if not explicitly provided
    const actualRoundness = roundness || getDefaultInputRoundness();

    return (
      <label className="text-ln-ink relative flex flex-col gap-1.5 text-[15px] font-semibold">
        <span>
          {label} {required && <span aria-hidden="true">*</span>}
        </span>
        <input
          suppressHydrationWarning
          ref={ref}
          className={styles(!!error, !!disabled, actualRoundness)}
          defaultValue={defaultValue}
          required={required}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={props.autoComplete ?? "off"}
          onChange={(e) => onChange && onChange(e)}
          onBlur={(e) => onBlur && onBlur(e)}
          {...props}
        />

        {suffix && (
          <span
            className={clsx(
              "bg-ln-inset text-ln-ink-2 absolute right-[3px] bottom-[40px] z-30 translate-y-1/2 transform p-2 text-[15px] font-normal",
              // Extract just the roundness part for the suffix (no padding)
              actualRoundness.split(" ")[0], // Take only the first part (rounded-full, rounded-md, etc.)
            )}
          >
            @{suffix}
          </span>
        )}

        <div className="text-ln-bad flex min-h-[18px] flex-row items-center text-[13px] leading-[18px] font-semibold">
          <span>{error ? error : " "}</span>
        </div>

        {success && (
          <div className="text-ln-good mt-1 flex flex-row items-center text-[13px] font-semibold">
            <CheckCircleIcon className="h-4 w-4" />
            <span className="ml-1">{success}</span>
          </div>
        )}
      </label>
    );
  },
);
