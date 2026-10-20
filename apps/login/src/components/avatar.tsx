"use client";

import { ColorShade, getColorHash } from "@/helpers/colors";
import { getComponentRoundness } from "@/lib/theme";
import { useTheme } from "next-themes";

interface AvatarProps {
  name: string | null | undefined;
  loginName: string;
  imageUrl?: string;
  size?: "small" | "base" | "large";
  shadow?: boolean;
}

export function getInitials(name: string, loginName: string) {
  if (name) {
    const split = name.split(" ");
    return split[0].charAt(0) + (split[1] ? split[1].charAt(0) : "");
  }

  const username = loginName.split("@")[0];
  let separator = "_";
  if (username.includes("-")) {
    separator = "-";
  }
  if (username.includes(".")) {
    separator = ".";
  }
  const split = username.split(separator);
  return split[0].charAt(0) + (split[1] ? split[1].charAt(0) : "");
}

// Helper function to get avatar roundness from theme
function getAvatarRoundness(): string {
  return getComponentRoundness("avatar");
}

export function Avatar({ size = "base", name, loginName, imageUrl, shadow }: AvatarProps) {
  const { resolvedTheme } = useTheme();
  const credentials = getInitials(name ?? loginName, loginName);
  const avatarRoundness = getAvatarRoundness();

  const color: ColorShade = getColorHash(loginName);

  const avatarStyleDark = {
    backgroundColor: color[900],
    color: color[200],
  };

  const avatarStyleLight = {
    backgroundColor: color[200],
    color: color[900],
  };

  return (
    <div
      className={`bg-ln-ink text-ln-paper group-focus:ring-ln-ink/30 pointer-events-none flex h-full w-full flex-shrink-0 cursor-default items-center justify-center transition-colors duration-200 group-focus:ring-2 group-focus:outline-none ${avatarRoundness} ${
        shadow ? "shadow" : ""
      } ${
        size === "large"
          ? "h-20 w-20 font-normal"
          : size === "base"
            ? "h-[38px] w-[38px] font-bold"
            : size === "small"
              ? "!h-[32px] !w-[32px] text-[13px] font-bold"
              : "h-12 w-12"
      }`}
      style={resolvedTheme === "light" ? avatarStyleLight : avatarStyleDark}
    >
      {imageUrl ? (
        <img
          height={48}
          width={48}
          alt="avatar"
          className={`border-ln-rule h-full w-full border ${avatarRoundness}`}
          src={imageUrl}
        />
      ) : (
        <span className={`uppercase ${size === "large" ? "text-xl" : "text-13px"}`}>{credentials}</span>
      )}
    </div>
  );
}
