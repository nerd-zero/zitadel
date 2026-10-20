import { APPEARANCE_STYLES, getComponentRoundness, getThemeConfig } from "@/lib/theme";
import { ThemeableProps } from "@/lib/themeUtils";
import { clsx } from "clsx";
import { ButtonHTMLAttributes, Children, DetailedHTMLProps, ReactNode, forwardRef, isValidElement } from "react";
import { Spinner } from "./spinner";

export enum ButtonSizes {
  Small = "Small",
  Large = "Large",
}

export enum ButtonVariants {
  Primary = "Primary",
  Secondary = "Secondary",
  Destructive = "Destructive",
}

export enum ButtonColors {
  Neutral = "Neutral",
  Primary = "Primary",
  Warn = "Warn",
}

export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  size?: ButtonSizes;
  variant?: ButtonVariants;
  color?: ButtonColors;
} & ThemeableProps;

// listnun buttons (LISTNUN_UI_SPEC 2): ink fill or ink outline, 44px, 6px
// radius. Colour and opacity ease between states (enabled, disabled, loading)
// and the button gives a little on press; reduced motion keeps only colour.
export const getButtonClasses = (
  size: ButtonSizes,
  variant: ButtonVariants,
  color: ButtonColors,
  roundnessClasses: string = "rounded-md", // Default fallback
  appearance: string = "", // Theme appearance (shadows, borders, etc.)
) =>
  clsx(
    {
      "box-border inline-flex items-center justify-center gap-2 text-[15px] font-semibold leading-none cursor-pointer select-none": true,
      "transition-[background-color,color,border-color,opacity,transform] duration-200 ease-out motion-safe:active:scale-[0.98] motion-reduce:transition-colors": true,
      "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ln-ink": true,
      "disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100": true,
      "border border-ln-ink bg-ln-ink text-ln-paper hover:bg-ln-ink-2 hover:border-ln-ink-2 disabled:hover:bg-ln-ink disabled:hover:border-ln-ink":
        variant === ButtonVariants.Primary && color !== ButtonColors.Warn,
      "border border-ln-bad-strong bg-ln-bad-strong text-ln-paper hover:opacity-90":
        variant === ButtonVariants.Primary && color === ButtonColors.Warn,
      "border border-ln-ink bg-transparent text-ln-ink hover:bg-ln-inset disabled:hover:bg-transparent":
        variant === ButtonVariants.Secondary && color !== ButtonColors.Warn,
      "border border-ln-bad-strong bg-transparent text-ln-bad hover:bg-ln-bad-tint":
        color === ButtonColors.Warn && variant !== ButtonVariants.Primary,
      "h-11 px-6": size === ButtonSizes.Large,
      "h-11 px-4": size === ButtonSizes.Small,
    },
    roundnessClasses, // Apply the full roundness classes directly
    appearance, // Apply appearance-specific styling (shadows, borders, etc.)
  );

// Helper function to get default button roundness from theme
function getDefaultButtonRoundness(): string {
  return getComponentRoundness("button");
}

// Helper function to get default button appearance from centralized theme system
function getDefaultButtonAppearance(): string {
  const themeConfig = getThemeConfig();
  const appearance = APPEARANCE_STYLES[themeConfig.appearance];
  return appearance?.button ?? "";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = ButtonVariants.Primary,
      size = ButtonSizes.Small,
      color = ButtonColors.Primary,
      roundness, // Will use theme default if not provided
      ...props
    },
    ref,
  ) => {
    // Use theme-based values if not explicitly provided
    const actualRoundness = roundness || getDefaultButtonRoundness();
    const actualAppearance = getDefaultButtonAppearance();

    return (
      <button
        type="button"
        ref={ref}
        aria-busy={props.disabled && hasSpinner(children) ? true : undefined}
        className={`${getButtonClasses(size, variant, color, actualRoundness, actualAppearance)} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

// Forms show <Spinner /> inside the button while they wait on the server;
// expose that to assistive tech as a busy button.
function hasSpinner(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => isValidElement(child) && child.type === Spinner);
}
