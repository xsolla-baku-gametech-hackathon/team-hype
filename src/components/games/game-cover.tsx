"use client";

import { useState } from "react";
import Image from "next/image";
import { Gamepad2 } from "lucide-react";

import { getSteamHeaderImageUrl } from "@/lib/steam/media";
import { cn } from "@/lib/utils/cn";

interface GameCoverProps {
  appId: number;
  name: string;
  className?: string;
}

/**
 * Steam's CDN is generally reliable, but a hackathon demo can't depend
 * on it — if the header image fails to load (offline venue Wi-Fi, CDN
 * hiccup, etc.), this quietly falls back to a styled placeholder instead
 * of a broken-image icon.
 */
export function GameCover({ appId, name, className }: GameCoverProps) {
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <div
      role="img"
      aria-label={`${name} cover art`}
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden bg-surface-hover",
        className,
      )}
    >
      {hasFailed ? (
        <div className="flex size-full items-center justify-center">
          <Gamepad2 className="size-8 text-muted-foreground/50" aria-hidden="true" />
        </div>
      ) : (
        <Image
          src={getSteamHeaderImageUrl(appId)}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover"
          onError={() => setHasFailed(true)}
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent"
      />
    </div>
  );
}
