'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { FacebookPost } from '@/usecases/facebookPosts'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  formatDistanceToNow,
  format,
  isToday,
  isYesterday,
  differenceInDays,
} from 'date-fns'
import { pl } from 'date-fns/locale'
import { useState } from 'react'

export function formatPolishDate(date: Date) {
  const now = new Date()
  const diffInDays = differenceInDays(now, date)

  if (isToday(date)) {
    return formatDistanceToNow(date, { locale: pl, addSuffix: true })
  } else if (isYesterday(date)) {
    return 'wczoraj'
  } else if (diffInDays < 7) {
    return formatDistanceToNow(date, { locale: pl, addSuffix: true })
  } else {
    return format(date, 'd MMMM yyyy', { locale: pl })
  }
}

export function FacebookCard({
  imageUrl,
  link,
  timeCreated,
  text,
  className,
}: FacebookPost & { className?: string }) {
  const [showImage, setShowImage] = useState(true)
  const date = new Date(timeCreated)

  const handleImageError = () => {
    setShowImage(false)
  }

  const isBottomImage = className?.includes('facebook-card-bottom-image')
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full cursor-pointer rounded-lg border shadow-xl ${className ?? ''} ${isBottomImage ? 'flex h-full flex-col' : ''}`}
    >
      <div className="flex flex-grow flex-col items-start p-4">
        <div className="flex w-full">
          <Avatar className="mr-3 h-10 w-10 rounded-full">
            <AvatarImage src="/wtyczka_avatar.jpg" alt="Wtyczka" />
            <AvatarFallback>Wtyczka</AvatarFallback>
          </Avatar>
          <div className="flex w-full justify-between">
            <div>
              <h3 className="text-sm font-semibold">
                Wtyczka - Wyjazd Integracyjny Wydziału EEIA PŁ
              </h3>
              <p className="text-muted-foreground text-xs">
                <time dateTime={`${date}`}>{formatPolishDate(date)}</time>
              </p>
            </div>
            <span className="rounded-full bg-transparent p-2">
              <ExternalLink />
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col">
          {text.split('\n').map((line: string, index: number) => (
            <p
              key={index}
              className="overflow-wrap-anywhere mt-2 text-sm break-words whitespace-pre-wrap"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
      {imageUrl && showImage ? (
        <div className="w-full">
          <Image
            src={imageUrl}
            alt="Post image"
            width={800}
            height={450}
            className="h-full w-full rounded-b-lg object-cover"
            style={
              isBottomImage
                ? { objectFit: 'cover', marginTop: 'auto' }
                : { objectFit: 'cover' }
            }
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="w-full">
          <Image
            src="/wtyczka_avatar.jpg"
            alt="Brak obrazu"
            width={800}
            height={450}
            className="h-full w-full rounded-b-lg object-cover opacity-60"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
    </Link>
  )
}
export function FacebookCardSkeleton() {
  return (
    <div className="w-full rounded-lg border shadow-sm">
      <div className="flex flex-col items-start p-4">
        <div className="flex w-full">
          <Avatar className="mr-3 h-10 w-10 animate-pulse">
            <AvatarFallback className="animate-pulse" />
          </Avatar>
          <div className="flex w-full justify-between">
            <div>
              <h3 className="text-sm font-semibold">
                <div className="mb-1 h-4 w-20 animate-pulse rounded-sm bg-gray-300" />
              </h3>
              <p className="text-muted-foreground text-xs">
                <div className="h-3 w-10 animate-pulse rounded-sm bg-gray-300" />
              </p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ExternalLink />
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="mt-2 h-3 w-40 animate-pulse rounded-sm bg-gray-300" />
          <div className="mt-2 h-3 w-60 animate-pulse rounded-sm bg-gray-300" />
          <div className="mt-2 h-3 w-50 animate-pulse rounded-sm bg-gray-300" />
          <div className="mt-2 h-3 w-70 animate-pulse rounded-sm bg-gray-300" />
        </div>
      </div>
      <div className="h-48 w-full animate-pulse rounded-b-lg bg-gray-300" />
    </div>
  )
}
