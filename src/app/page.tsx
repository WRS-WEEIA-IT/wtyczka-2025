'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect, Suspense } from 'react'
import { Calendar, Facebook } from 'lucide-react'
import Image from 'next/image'
import {
  FacebookPost,
  getFacebookPostsInQuantity,
} from '@/usecases/facebookPosts'
import {
  FacebookCard,
  FacebookCardSkeleton,
} from '@/components/ui/FacebookCard'
import Link from 'next/link'
import { getDateFromDatabase } from '@/lib/supabase'

export default function HomePage() {
  const { t } = useLanguage()
  const [daysUntilEvent, setDaysUntilEvent] = useState(0)
  const [eventDate, setEventDate] = useState<Date | null>(null)
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([])

  useEffect(() => {
    getDateFromDatabase('TRIP_DATE')
      .then((date) => {
        if (date) setEventDate(new Date(`${date}T12:00:00`))
      })
      .catch((error) => console.error('Error fetching trip date:', error))
  }, [])

  useEffect(() => {
    if (!eventDate) return

    const calculateDaysUntilEvent = () => {
      const today = new Date()
      const timeDiff = eventDate.getTime() - today.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      setDaysUntilEvent(daysDiff > 0 ? daysDiff : 0)
    }

    calculateDaysUntilEvent()
    const interval = setInterval(calculateDaysUntilEvent, 86400000) // Update daily

    return () => clearInterval(interval)
  }, [eventDate])

  useEffect(() => {
    const fetchFacebookPosts = async () => {
      try {
        const posts = await getFacebookPostsInQuantity(2, 0)
        setFacebookPosts(posts)
      } catch (error) {
        console.error('Error fetching Facebook posts:', error)
      }
    }

    fetchFacebookPosts()
  }, [])

  const calendarDate = eventDate
    ? eventDate.toISOString().slice(0, 10).replace(/-/g, '')
    : ''
  const calendarYear = eventDate?.getFullYear() ?? ''
  const calendarUrl = eventDate
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Wtyczka ${calendarYear} - Wyjazd Integracyjny`)}&dates=${calendarDate}T120000Z/${calendarDate}T130000Z&details=${encodeURIComponent('Wyjazd Integracyjny Wydziału EEIA PŁ')}`
    : undefined

  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Hero Section */}
      <section className="cosmos-hero relative overflow-hidden px-4 text-white">
        <div className="relative mx-auto flex min-h-[600px] max-w-4xl flex-col items-center justify-center px-4 py-12 text-center md:min-h-[660px]">
          <div className="flex flex-col items-center">
            <Image
              src="/cosmos/logo.svg"
              alt="Logo wtyczka"
              width={430}
              height={348}
              className="cosmos-logo m-0 p-0 leading-none"
              style={{
                display: 'block',
                marginTop: '8px',
                marginBottom: '18px',
              }}
            />
            <p className="cosmos-kicker m-0 p-0 text-xl font-semibold tracking-[0.12em] uppercase md:text-2xl">
              {t.home.subtitle}
            </p>
          </div>

          <div
            className="mt-10 mb-2 flex w-full flex-col items-center justify-center gap-6 sm:flex-row sm:gap-3"
            style={{ overflowX: 'visible' }}
          >
            <span className="group relative w-full max-w-xs min-w-[180px] flex-1">
              <span className="zapisz-glow" aria-hidden="true"></span>
              <Link
                href="/registration"
                className="cosmos-primary-btn homepage-btn relative flex w-full max-w-xs min-w-[180px] flex-1 items-center justify-center overflow-hidden rounded-full border-none px-8 py-4 text-lg font-bold shadow-none transition-all duration-200"
              >
                ZAPISZ SIĘ
              </Link>
            </span>

            <Link
              href="/faq"
              className="cosmos-secondary-btn homepage-btn relative mb-0 flex w-full max-w-xs min-w-[180px] flex-1 items-center justify-center overflow-hidden rounded-full border px-8 py-4 text-lg font-bold shadow-none transition-all duration-200"
            >
              DOWIEDZ SIĘ WIĘCEJ
            </Link>
          </div>

          <p
            className="cosmos-label text-md m-0 p-0 font-semibold tracking-widest uppercase md:text-lg"
            style={{ marginBottom: '-15px' }}
          >
            Dodaj wydarzenie do kalendarza Google
          </p>

          <div className="mt-5 mb-2 flex w-full justify-center">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cosmos-secondary-btn homepage-btn relative flex w-full max-w-xs min-w-[180px] flex-row items-center justify-center gap-3 overflow-hidden rounded-full border px-8 py-4 text-lg font-bold shadow-none transition-all duration-200"
              title="Dodaj wydarzenie do kalendarza Google"
            >
              <Calendar className="h-7 w-7 text-[#ffe000]" />
              <span
                className="tracking-wide uppercase"
                style={{ fontFamily: 'inherit' }}
              >
                POZOSTAŁO{' '}
                <span style={{ fontFamily: 'monospace' }}>
                  {daysUntilEvent}
                </span>{' '}
                DNI
              </span>
            </a>
          </div>

          <div className="star-divider mt-8 mb-2">
            <span className="cosmos-stars text-3xl select-none">✦</span>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="cosmos-news flex-1 px-4 py-10 md:py-16">
        <div className="home-content-container mx-auto flex h-full w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-10 flex w-full flex-col items-center justify-center pt-8 text-center">
            <h2 className="latest-news-title cosmos-heading xs:text-xl w-full text-center text-base font-semibold tracking-widest break-words uppercase sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
              {t.home.latestNews}
            </h2>
            <div className="star-divider flex w-full items-center justify-center text-center">
              <span className="cosmos-stars text-2xl select-none">✦</span>
            </div>
            <div className="flex w-full justify-center text-center">
              <span className="cosmos-subheading inline-block border-b px-4 pb-2 text-center text-lg tracking-widest uppercase">
                Wiadomości z kosmosu
              </span>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 justify-center gap-x-6 gap-y-8 md:grid-cols-2">
            <Suspense fallback={<FacebookCardSkeleton />}>
              {facebookPosts.map((post) => (
                <FacebookCard
                  {...post}
                  className="facebook-card-bottom-image w-full max-w-2xl cursor-pointer justify-self-center shadow-xl transition-shadow hover:shadow-2xl"
                  key={post.id}
                />
              ))}
            </Suspense>
          </div>

          <div className="mt-10 pb-10 text-center">
            <Link
              href="/news"
              className="cosmos-primary-btn inline-flex items-center space-x-2 rounded-xl px-6 py-3 text-base font-bold tracking-wider uppercase shadow-md transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span>{t.home.viewAllNews}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
