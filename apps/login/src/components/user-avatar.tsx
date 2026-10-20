import { Translated } from "@/components/translated";
import Link from "next/link";

type Props = {
  loginName?: string;
  displayName?: string;
  showDropdown: boolean;
  searchParams?: Record<string | number | symbol, string | undefined>;
};

export function UserAvatar({ loginName, displayName, showDropdown, searchParams }: Props) {
  const params = new URLSearchParams({});

  if (searchParams?.sessionId) {
    params.set("sessionId", searchParams.sessionId);
  }

  if (searchParams?.organization) {
    params.set("organization", searchParams.organization);
  }

  if (searchParams?.requestId) {
    params.set("requestId", searchParams.requestId);
  }

  if (searchParams?.loginName) {
    params.set("loginName", searchParams.loginName);
  }

  // listnun account chip (LISTNUN_UI_SPEC AuthPassword/AuthMfa): name over
  // login name, "Change" to pick another account. It sits above the title.
  return (
    <div className="bg-ln-paper border-ln-rule order-first flex min-h-12 flex-row items-center justify-between gap-3 rounded-md border px-3 py-2">
      <span className="flex min-w-0 flex-col">
        {displayName && displayName !== loginName && <span className="truncate font-semibold">{displayName}</span>}
        <span
          className={
            displayName && displayName !== loginName ? "text-ln-ink-3 truncate text-[13px]" : "truncate font-semibold"
          }
        >
          {loginName}
        </span>
      </span>
      {showDropdown && (
        <Link
          href={"/accounts?" + params}
          className="text-ln-ink hover:text-ln-ink-2 shrink-0 text-[13px] font-semibold underline underline-offset-[3px] transition-colors"
        >
          <Translated i18nKey="change" namespace="common" />
        </Link>
      )}
    </div>
  );
}
