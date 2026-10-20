import "@/styles/globals.scss";

import { BackgroundWrapper } from "@/components/background-wrapper";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Skeleton } from "@/components/skeleton";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeSwitch from "@/components/theme-switch";
import { LANGS, getLanguage } from "@/lib/i18n";
import { getServiceConfig } from "@/lib/service-url";
import { getAllowedLanguages, getLegalAndSupportSettings } from "@/lib/zitadel";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Hanken_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import React, { Suspense } from "react";

// LISTNUN_UI_SPEC 1.2: one family everywhere.
const hanken = Hanken_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  fallback: ["Arial", "sans-serif"],
});

function Wordmark() {
  return <div className="text-ln-ink text-[30px] leading-none font-semibold tracking-[-0.01em]">listnun</div>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common");
  return { title: t("title") };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const _headers = await headers();
  const { serviceConfig } = getServiceConfig(_headers);

  let languages = LANGS;
  try {
    const settings = await getAllowedLanguages({ serviceConfig });
    if (settings.allowedLanguages?.length) {
      languages = settings.allowedLanguages
        .filter((code) => LANGS.find((l) => l.code === code))
        .map((code) => getLanguage(code));
    }
  } catch (e) {
    console.error("Failed to load supported languages", e);
  }

  // Footer links come from the instance's legal and support settings, so they
  // stay editable in Zitadel rather than baked into the build.
  let legal: Awaited<ReturnType<typeof getLegalAndSupportSettings>>;
  try {
    legal = await getLegalAndSupportSettings({ serviceConfig });
  } catch (e) {
    console.error("Failed to load legal and support settings", e);
  }
  const footerLinks = [
    { label: "Privacy", href: legal?.privacyPolicyLink },
    { label: "Terms", href: legal?.tosLink },
    { label: "Help", href: legal?.helpLink },
  ].filter((link): link is { label: string; href: string } => !!link.href);

  return (
    <html className={`${hanken.className}`} suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider>
          <Tooltip.Provider>
            <Suspense
              fallback={
                <BackgroundWrapper
                  className={`bg-ln-paper text-ln-ink relative flex min-h-screen flex-col items-center gap-7 pt-14 pb-10`}
                >
                  <Wordmark />
                  <div className="relative mx-auto w-full max-w-[452px] px-4">
                    <Skeleton>
                      <div className="h-40"></div>
                    </Skeleton>
                    <div className="flex flex-row items-center justify-end space-x-4 py-4">
                      <ThemeSwitch />
                    </div>
                  </div>
                </BackgroundWrapper>
              }
            >
              <LanguageProvider>
                <BackgroundWrapper
                  className={`bg-ln-paper text-ln-ink relative flex min-h-screen flex-col items-center gap-7 pt-14 pb-10`}
                >
                  <Wordmark />
                  <main className="relative w-full max-w-[1100px]">{children}</main>
                  <footer className="text-ln-ink-3 mt-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 text-[13px]">
                    {footerLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ln-ink-3 hover:text-ln-ink underline"
                      >
                        {link.label}
                      </a>
                    ))}
                    <LanguageSwitcher languages={languages} />
                    <ThemeSwitch />
                  </footer>
                </BackgroundWrapper>
              </LanguageProvider>
            </Suspense>
          </Tooltip.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
