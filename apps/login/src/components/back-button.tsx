"use client";

import { useRouter } from "next/navigation";
import { Translated } from "./translated";

// A quiet text link under the full-width primary action (LISTNUN_UI_SPEC
// sign-in screens have no second button).
export function BackButton(props: { "data-testid"?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      type="button"
      data-testid={props["data-testid"]}
      className="text-ln-ink-2 hover:text-ln-ink focus-visible:outline-ln-ink inline-flex h-10 items-center justify-center rounded-md text-[14px] font-semibold underline underline-offset-[3px] transition-colors focus:outline-none focus-visible:outline-2"
    >
      <Translated i18nKey="back" namespace="common" />
    </button>
  );
}
