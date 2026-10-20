"use client";

import { handleServerActionResponse } from "@/lib/client-utils";
import { sendLoginname } from "@/lib/server/loginname";
import { clearSession, continueWithSession, ContinueWithSessionCommand } from "@/lib/server/session";
import { XCircleIcon } from "@heroicons/react/24/outline";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Timestamp, timestampDate } from "@zitadel/client";
import { Session } from "@zitadel/proto/zitadel/session/v2/session_pb";
import moment from "moment";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Alert } from "./alert";
import { AutoSubmitForm } from "./auto-submit-form";
import { Translated } from "./translated";

export function isSessionPrimaryFactorAndLifetimeValid(session: Partial<Session>): {
  valid: boolean;
  verifiedAt?: Timestamp;
} {
  const validPassword = session?.factors?.password?.verifiedAt;
  const validPasskey = session?.factors?.webAuthN?.verifiedAt;
  const validIDP = session?.factors?.intent?.verifiedAt;

  const stillValid = session.expirationDate ? timestampDate(session.expirationDate) > new Date() : true;

  const verifiedAt = validPassword || validPasskey || validIDP;
  const valid = !!((validPassword || validPasskey || validIDP) && stillValid);

  return { valid, verifiedAt };
}

export function SessionItem({ session, reload, requestId }: { session: Session; reload: () => void; requestId?: string }) {
  const currentLocale = useLocale();
  moment.locale(currentLocale === "zh" ? "zh-cn" : currentLocale);
  const t = useTranslations("error");

  const [_loading, setLoading] = useState<boolean>(false);

  /**
   * Returns true when the session was removed (server-side and from the cookie).
   * On failure the error is shown and the card must stay in the list.
   */
  async function clearSessionId(id: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const response = await clearSession({ sessionId: id });
      if (response && "error" in response && response.error) {
        setError(response.error);
        return false;
      }
      return true;
    } catch {
      setError(t("couldNotClearSession"));
      return false;
    } finally {
      setLoading(false);
    }
  }

  const { valid } = isSessionPrimaryFactorAndLifetimeValid(session);
  const [samlData, setSamlData] = useState<{ url: string; fields: Record<string, string> } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  return (
    <>
      <Tooltip.Root delayDuration={300}>
        {samlData && <AutoSubmitForm url={samlData.url} fields={samlData.fields} />}
        <Tooltip.Trigger asChild>
          <button
            onClick={async () => {
              if (valid && session?.factors?.user) {
                const sessionPayload: ContinueWithSessionCommand = session;
                if (requestId) {
                  sessionPayload.requestId = requestId;
                }

                const callbackResponse = await continueWithSession(sessionPayload);

                handleServerActionResponse(callbackResponse, router, setSamlData, (e) => setError(e));
              } else if (session.factors?.user) {
                setLoading(true);
                try {
                  const res = await sendLoginname({
                    loginName: session.factors?.user?.loginName,
                    organization: session.factors.user.organizationId,
                    requestId: requestId,
                  });

                  handleServerActionResponse(res, router, setSamlData, (e) => setError(e));
                } catch {
                  setError("An internal error occurred");
                } finally {
                  setLoading(false);
                }
              }
            }}
            className="group border-ln-rule bg-ln-paper hover:border-ln-ink focus-visible:outline-ln-ink flex min-h-[60px] flex-row items-center gap-3 rounded-md border px-3.5 py-2.5 text-left transition-[border-color,transform] duration-200 focus:outline-none focus-visible:outline-2 motion-safe:active:scale-[0.99]"
          >
            <div className="flex flex-col items-start overflow-hidden">
              <span className="truncate font-semibold">{session.factors?.user?.displayName}</span>
              <span className="text-ln-ink-3 truncate text-[13px]">{session.factors?.user?.loginName}</span>
            </div>

            <span className="flex-grow"></span>
            {/* Spec: "Signed in" in the good colour, "Signed out" in ink-3. */}
            <span className={valid ? "text-ln-good text-[13px] font-semibold" : "text-ln-ink-3 text-[13px]"}>
              <Translated i18nKey={valid ? "signedIn" : "signedOut"} namespace="accounts" />
            </span>
            <div className="relative flex flex-row items-center">
              <XCircleIcon
                className="text-ln-ink-3 hover:text-ln-ink h-5 w-5 transition-colors"
                onClick={async (event: React.MouseEvent) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (await clearSessionId(session.id)) {
                    reload();
                  }
                }}
              />
            </div>
          </button>
        </Tooltip.Trigger>
        {valid && session.expirationDate && (
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-ln-surface border-ln-rule text-ln-ink z-50 rounded-md border px-3 py-2 text-[13px] shadow-sm select-none"
              sideOffset={5}
            >
              Expires {moment(timestampDate(session.expirationDate)).fromNow()}
              <Tooltip.Arrow className="fill-ln-rule" />
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
      {error && <Alert>{error}</Alert>}
    </>
  );
}
