import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  type?: AlertType;
};

export enum AlertType {
  ALERT,
  INFO,
}

// listnun status tints (LISTNUN_UI_SPEC 1.1): critical for alerts, neutral for info.
const critical = "border-ln-bad-strong bg-ln-bad-tint text-ln-bad font-semibold";
const neutral = "border-ln-rule bg-ln-neutral-tint text-ln-ink-2";

export function Alert({ children, type = AlertType.ALERT }: Props) {
  return (
    <div
      role={type === AlertType.ALERT ? "alert" : "status"}
      className={clsx("flex scroll-px-40 flex-row items-center justify-center rounded-md border py-2.5 pr-3", {
        [critical]: type === AlertType.ALERT,
        [neutral]: type === AlertType.INFO,
      })}
    >
      {type === AlertType.ALERT && <ExclamationTriangleIcon className="mr-2 ml-2 h-5 w-5 flex-shrink-0" />}
      {type === AlertType.INFO && <InformationCircleIcon className="mr-2 ml-2 h-5 w-5 flex-shrink-0" />}
      <span className="w-full text-[14px]">{children}</span>
    </div>
  );
}
