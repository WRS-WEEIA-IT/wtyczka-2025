"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FacebookPost } from "@/usecases/facebookPosts";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  formatDistanceToNow,
  format,
  isToday,
  isYesterday,
  differenceInDays,
} from "date-fns";
import { pl } from "date-fns/locale";
import { useState } from "react";

export function formatPolishDate(date: Date) {
  const now = new Date();
  const diffInDays = differenceInDays(now, date);

  if (isToday(date)) {
    return formatDistanceToNow(date, { locale: pl, addSuffix: true });
  } else if (isYesterday(date)) {
    return "wczoraj";
  } else if (diffInDays < 7) {
    return formatDistanceToNow(date, { locale: pl, addSuffix: true });
  } else {
    return format(date, "d MMMM yyyy", { locale: pl });
  }
}

export function FacebookCard({
  imageUrl,
  link,
  timeCreated,
  text,
  className,
}: FacebookPost & { className?: string }) {
  const [showImage, setShowImage] = useState(true);
  const date = new Date(timeCreated);

  const handleImageError = () => {
    setShowImage(false);
  };

  return (
    <div className={`rounded-lg border shadow-xl w-full ${className ?? ""}`}>
      <div className="flex flex-col items-start p-4">
        <div className="flex w-full">
          <Avatar className="w-10 h-10 rounded-full mr-3">
            <AvatarImage src="/wtyczka_avatar.jpg" alt="Wtyczka" />
            <AvatarFallback>Wtyczka</AvatarFallback>
          </Avatar>
          <div className="flex justify-between w-full">
            <div>
              <h3 className="font-semibold text-sm">
                Wtyczka - Wyjazd Integracyjny Wydziału EEIA PŁ
              </h3>
              <p className="text-xs text-muted-foreground">
                <time dateTime={`${date}`}>{formatPolishDate(date)}</time>
              </p>
            </div>
            <Link href={link} target="_blank" passHref>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ExternalLink />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col w-full">
          {text.split("\n").map((line: string, index: number) => (
            <p
              key={index}
              className="text-sm mt-2 break-words whitespace-pre-wrap overflow-wrap-anywhere"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
      {imageUrl && showImage && (
        <div className="w-full">
          <Image
            src={imageUrl}
            alt="Post image"
            width={800}
            height={450}
            className="object-cover w-full h-full rounded-b-lg"
            style={{ objectFit: "cover" }}
            onError={handleImageError}
          />
        </div>
      )}
    </div>
  );
}
export function FacebookCardSkeleton() {
  return (
    <div className="rounded-lg border shadow-sm w-full">
      <div className="flex flex-col items-start p-4">
        <div className="flex w-full">
          <Avatar className="w-10 h-10 animate-pulse mr-3">
            <AvatarFallback className="animate-pulse" />
          </Avatar>
          <div className="flex justify-between w-full">
            <div>
              <h3 className="font-semibold text-sm">
                <div className="w-20 h-4 bg-gray-300 animate-pulse mb-1 rounded-sm" />
              </h3>
              <p className="text-xs text-muted-foreground">
                <div className="w-10 h-3 bg-gray-300 animate-pulse rounded-sm" />
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ExternalLink />
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="w-40 h-3 bg-gray-300 animate-pulse mt-2 rounded-sm" />
          <div className="w-60 h-3 bg-gray-300 animate-pulse mt-2 rounded-sm" />
          <div className="w-50 h-3 bg-gray-300 animate-pulse mt-2 rounded-sm" />
          <div className="w-70 h-3 bg-gray-300 animate-pulse mt-2 rounded-sm" />
        </div>
      </div>
      <div className="w-full h-48 bg-gray-300 animate-pulse rounded-b-lg" />
    </div>
  );
}
