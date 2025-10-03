'use client'

import { Card } from '@/components/ui/card'
import { FacebookCard } from '@/components/ui/FacebookCard'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  FacebookPost,
  getFacebookPostsInQuantity,
} from '@/usecases/facebookPosts'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

export default function NewsPage() {
  const { t } = useLanguage()

  // Hydration fix
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [noMorePosts, setNoMorePosts] = useState<boolean>(false)
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([])
  const [loading, setLoading] = useState(false)
  const postsPerPage = 5
  const [page, setPage] = useState(0)

  const loadPosts = useCallback(
    async (isInitial: boolean = false) => {
      setLoading(true)
      try {
        const posts = await getFacebookPostsInQuantity(postsPerPage, page)
        setPage((prevPage) => prevPage + 1)
        if (isInitial) {
          setFacebookPosts(posts)
        } else {
          setFacebookPosts((prevPosts) => [...prevPosts, ...posts])
        }

        if (posts.length != postsPerPage) {
          setNoMorePosts(true)
        }
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setLoading(false)
      }
    },
    [page],
  )

  useEffect(() => {
    loadPosts(true)
  }, [loadPosts])

  const handleShowMore = () => {
    loadPosts()
  }

  if (!isMounted) return null
  return (
    <div className="min-h-screen">
      <section className="border-b border-[#262626] py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-amber-400 md:text-5xl">
            {t.home.latestNews}
          </h1>
          <p className="text-xl text-gray-200">
            Śledź najnowsze informacje o wydarzeniu Wtyczka 2025
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="https://facebook.com/wtyczka.eeia"
              target="_blank"
              rel="noopener noreferrer"
              className="western-btn inline-flex items-center space-x-2 rounded-xl border-2 border-[#145db2] bg-[#1877F2] px-7 py-3 font-bold tracking-wider text-white uppercase shadow-lg transition-all hover:bg-[#145db2] focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 focus:outline-none"
              style={{
                fontFamily: 'var(--font-rye), fantasy, serif',
                boxShadow: '0 4px 16px rgba(24, 119, 242, 0.25)',
              }}
            >
              <ExternalLink className="h-5 w-5" />
              <span>Obserwuj nas na Facebooku</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="site-container mt-12 flex flex-col">
          <div className="readable-width flex flex-col gap-8">
            {facebookPosts.map((post, index) => (
              <FacebookCard key={index} {...post} />
            ))}
            {!noMorePosts && (
              <Card className="card-hover mb-12 inline-flex items-center justify-center border-none shadow-none">
                <div
                  className={`card-blur-btn w-full cursor-pointer rounded-xl p-6 text-center font-bold tracking-wider uppercase shadow-md transition-all duration-200 ${
                    loading ? 'opacity-70' : ''
                  }`}
                  style={{
                    fontFamily: 'Roboto Slab, Times New Roman, serif',
                    color: '#fff',
                    background: 'rgba(30, 30, 30, 0.55)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '2px solid #fff',
                    boxShadow: '0 4px 12px rgba(255,255,255,0.12)',
                  }}
                  onClick={handleShowMore}
                >
                  {loading ? 'Ładuję...' : 'Pokaż więcej'}
                </div>
              </Card>
            )}
            {noMorePosts && facebookPosts.length > 0 && (
              <Card className="mb-12 inline-flex items-center justify-center shadow-xl">
                <div className="text-muted-foreground p-6">
                  To już wszystkie aktualności!
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-[#262626] bg-[#18181b] py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-amber-400">
            Nie przegap żadnych aktualności!
          </h2>
          <p className="mb-8 text-gray-200">
            Obserwuj naszą stronę na Facebooku, aby być na bieżąco z wszystkimi
            informacjami dotyczącymi Wtyczki 2025.
          </p>
          <Link
            href="https://www.facebook.com/wtyczka.eeia"
            target="_blank"
            rel="noopener noreferrer"
            className="western-btn inline-flex items-center space-x-2 rounded-xl border-2 border-[#145db2] bg-[#1877F2] px-8 py-3 font-bold tracking-wider text-white uppercase shadow-lg transition-all hover:bg-[#145db2] focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 focus:outline-none"
            style={{
              fontFamily: 'var(--font-rye), fantasy, serif',
              boxShadow: '0 4px 16px rgba(24, 119, 242, 0.25)',
            }}
          >
            <ExternalLink className="h-5 w-5" />
            <span>Odwiedź naszego Facebooka</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
