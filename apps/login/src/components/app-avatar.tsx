import { ColorShade, getColorHash } from "@/helpers/colors";
import { useTheme } from "next-themes";
import { getInitials } from "./avatar";

interface AvatarProps {
  appName: string;
  imageUrl?: string;
  shadow?: boolean;
}

export function AppAvatar({ appName, imageUrl, shadow }: AvatarProps) {
  const { resolvedTheme } = useTheme();
  const credentials = getInitials(appName, appName);

  const color: ColorShade = getColorHash(appName);

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
      className={`bg-ln-ink text-ln-paper group-focus:ring-ln-ink/30 pointer-events-none flex h-[100px] w-[100px] cursor-default items-center justify-center rounded-full transition-colors duration-200 group-focus:ring-2 group-focus:outline-none ${
        shadow ? "shadow" : ""
      }`}
      style={resolvedTheme === "light" ? avatarStyleLight : avatarStyleDark}
    >
      {imageUrl ? (
        <img
          height={48}
          width={48}
          alt="avatar"
          className="border-divider-light dark:border-divider-dark h-full w-full rounded-full border"
          src={imageUrl}
        />
      ) : (
        <span className={`text-3xl uppercase`}>{credentials}</span>
      )}
    </div>
  );
}
