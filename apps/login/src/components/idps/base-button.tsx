"use client";

import { APPEARANCE_STYLES, getComponentRoundness, getThemeConfig } from "@/lib/theme";
import { clsx } from "clsx";
import { Loader2Icon } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";
import { useFormStatus } from "react-dom";

export type SignInWithIdentityProviderProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  name?: string;
  e2e?: string;
};

// Helper function to get default IDP button appearance from centralized theme system
function getDefaultIdpButtonAppearance(): string {
  const themeConfig = getThemeConfig();
  const appearance = APPEARANCE_STYLES[themeConfig.appearance];
  return appearance?.["idp-button"] ?? "";
}

export const BaseButton = forwardRef<HTMLButtonElement, SignInWithIdentityProviderProps>(function BaseButton(props, ref) {
  const formStatus = useFormStatus();
  const buttonRoundness = getComponentRoundness("button");
  const idpButtonAppearance = getDefaultIdpButtonAppearance();

  return (
    <button
      {...props}
      type="submit"
      ref={ref}
      disabled={formStatus.pending}
      className={clsx(
        // Spec: text-only outline buttons ("Continue with Google"), so the
        // provider icons the children carry are hidden.
        `border-ln-ink text-ln-ink hover:bg-ln-inset focus-visible:outline-ln-ink flex h-11 w-full flex-1 cursor-pointer flex-row items-center border bg-transparent px-4 text-[15px] font-semibold transition-[background-color,opacity,transform] duration-200 ease-out outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60 motion-safe:active:scale-[0.98]`,
        buttonRoundness,
        idpButtonAppearance,
        props.className,
      )}
    >
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex flex-1 flex-row items-center justify-center [&>div:has(>svg,>img)]:hidden [&>span]:ml-0">
          {props.children}
        </div>
        {formStatus.pending && <Loader2Icon className="h-4 w-4 animate-spin" />}
      </div>
    </button>
  );
});
