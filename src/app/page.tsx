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

export default function HomePage() {
  const { t } = useLanguage()
  const [daysUntilEvent, setDaysUntilEvent] = useState(0)
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([])

  useEffect(() => {
    // Przykładowa data wydarzenia - można zmienić
    const eventDate = new Date('2025-10-23')

    const calculateDaysUntilEvent = () => {
      const today = new Date()
      const timeDiff = eventDate.getTime() - today.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      setDaysUntilEvent(daysDiff > 0 ? daysDiff : 0)
    }

    const fetchFacebookPosts = async () => {
      try {
        const posts = await getFacebookPostsInQuantity(2, 0)
        setFacebookPosts(posts)
      } catch (error) {
        console.error('Error fetching Facebook posts:', error)
      }
    }

    calculateDaysUntilEvent()
    fetchFacebookPosts()
    const interval = setInterval(calculateDaysUntilEvent, 86400000) // Update daily

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden p-4 text-white">
        <div className="home-hero-section relative mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-10 text-center">
          <div className="flex flex-col items-center">
            <Image
              src="/logo2.svg"
              alt="Logo wtyczka"
              width={1200}
              height={440}
              className="m-0 p-0 leading-none drop-shadow-2xl"
              style={{
                display: 'block',
                marginTop: '26px',
                marginBottom: '-8px',
              }}
            />
            <p
              className="western-title m-0 p-0 text-2xl font-extrabold tracking-widest text-[#E7A801] uppercase drop-shadow-lg md:text-3xl"
              style={{ marginTop: '-2px' }}
            >
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
                className="homepage-btn zapisz-btn western-btn-roboto relative flex w-full max-w-xs min-w-[180px] flex-1 items-center justify-center overflow-hidden rounded-full border-none bg-[#E7A801] px-8 py-4 text-lg font-bold text-white shadow-none transition-all duration-200 hover:bg-yellow-400"
                style={{ fontFamily: 'Roboto Slab, Times New Roman, serif' }}
              >
                ZAPISZ SIĘ
              </Link>
            </span>

            <Link
              href="/faq"
              className="homepage-btn western-btn-roboto relative mb-0 flex w-full max-w-xs min-w-[180px] flex-1 items-center justify-center overflow-hidden rounded-full border-none bg-[#232323] px-8 py-4 text-lg font-bold text-[#E7A801] shadow-none transition-all duration-200 hover:bg-[#18181b]"
              style={{ fontFamily: 'Roboto Slab, Times New Roman, serif' }}
            >
              DOWIEDZ SIĘ WIĘCEJ
            </Link>
          </div>

          <p
            className="text-md western-title m-0 p-0 font-extrabold tracking-widest text-[#E7A801] uppercase drop-shadow-lg md:text-lg"
            style={{ marginBottom: '-15px' }}
          >
            Dodaj wydarzenie do kalendarza Google
          </p>

          <div className="mt-5 mb-2 flex w-full justify-center">
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wtyczka+2025+-+Wyjazd+Integracyjny&dates=20251023T120000Z/20251023T130000Z&details=Wyjazd+Integracyjny+Wydziału+EEIA+PŁ"
              target="_blank"
              rel="noopener noreferrer"
              className="homepage-btn western-btn-roboto relative flex w-full max-w-xs min-w-[180px] flex-row items-center justify-center gap-3 overflow-hidden rounded-full border-none bg-[#232323] px-8 py-4 text-lg font-bold text-[#E7A801] shadow-none transition-all duration-200 hover:bg-[#18181b]"
              style={{ fontFamily: 'Roboto Slab, Times New Roman, serif' }}
              title="Dodaj wydarzenie do kalendarza Google"
            >
              <Calendar className="h-7 w-7 text-[#E7A801]" />
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
            <span className="text-3xl text-[#E7A801] select-none">★ ★ ★</span>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="flex-1 px-4 py-8">
        <div className="home-content-container mx-auto flex h-full w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-10 flex w-full flex-col items-center justify-center pt-8 text-center">
            <h2 className="latest-news-title xs:text-xl western-title w-full text-center text-base font-extrabold tracking-widest break-words text-[#E7A801] uppercase drop-shadow-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
              {t.home.latestNews}
            </h2>
            <div className="star-divider flex w-full items-center justify-center text-center">
              <span className="text-2xl text-[#E7A801] select-none">★ ★</span>
            </div>
            <div className="flex w-full justify-center text-center">
              <span className="inline-block border-b-2 border-dotted border-[#E7A801] px-4 pb-1 text-center text-lg tracking-widest text-gray-300 uppercase">
                Wiadomości z saloonu
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
              className="western-btn inline-flex items-center space-x-2 rounded-xl bg-[#E7A801] px-6 py-3 text-base font-bold tracking-widest text-black uppercase shadow-md transition-colors hover:bg-amber-700"
              style={{ boxShadow: '0 4px 12px rgba(231, 168, 1, 0.4)' }}
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
