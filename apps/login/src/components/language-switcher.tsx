"use client";

import { setLanguageCookie } from "@/lib/cookies";
import { Lang } from "@/lib/i18n";
import { APPEARANCE_STYLES, getComponentRoundness, getThemeConfig } from "@/lib/theme";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Helper function to get language switcher roundness from theme
function getLanguageSwitcherRoundness(): string {
  return getComponentRoundness("button");
}

// Helper function to get card appearance styles for the language switcher
function getLanguageSwitcherCardAppearance(): string {
  const themeConfig = getThemeConfig();
  const appearance = APPEARANCE_STYLES[themeConfig.appearance];
  return appearance?.card || "bg-black/5 dark:bg-white/5"; // Fallback to current styling
}

export function LanguageSwitcher({ languages }: { languages: Lang[] }) {
  const currentLocale = useLocale();
  const switcherRoundness = getLanguageSwitcherRoundness();
  const cardAppearance = getLanguageSwitcherCardAppearance();

  const [selected, setSelected] = useState(languages.find((l) => l.code === currentLocale) || languages[0]);

  const router = useRouter();

  const handleChange = async (language: Lang) => {
    setSelected(language);
    const newLocale = language.code;

    await setLanguageCookie(newLocale);

    router.refresh();
  };

  return (
    <div className="w-32">
      <Listbox value={selected} onChange={handleChange}>
        <ListboxButton
          className={clsx(
            `text-ln-ink-2 relative block w-full py-1.5 pr-8 pl-3 text-left text-[13px]/6 ${switcherRoundness}`,
            cardAppearance,
            "data-[focus]:outline-ln-ink focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2",
          )}
        >
          {selected.name}
          <ChevronDownIcon className="group pointer-events-none absolute top-2.5 right-2.5 size-4" aria-hidden="true" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            `bg-ln-surface border-ln-rule w-[var(--button-width)] rounded-md border p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none dark:border-white/5`,
            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
          )}
        >
          {languages.map((lang) => (
            <ListboxOption
              key={lang.code}
              value={lang}
              className={`group data-[focus]:bg-ln-inset flex cursor-default items-center gap-2 px-3 py-1.5 select-none ${switcherRoundness}`}
            >
              <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
              <div className="text-ln-ink text-sm/6">{lang.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
