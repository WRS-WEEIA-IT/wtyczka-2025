'use client'

import { Card } from '@/components/ui/card'
import { FacebookCard } from '@/components/ui/FacebookCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { useYear } from '@/contexts/YearContext'
import {
  FacebookPost,
  getFacebookPostsInQuantity,
} from '@/usecases/facebookPosts'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NewsPage() {
  const { t } = useLanguage()
  const { year } = useYear()

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

  const loadPosts = async (isInitial: boolean = false) => {
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
  }

  useEffect(() => {
    loadPosts(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          <p className="mx-auto max-w-2xl text-xl text-gray-200">
            {`Śledź najnowsze informacje o wydarzeniu Wtyczka ${year}`}
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="https://facebook.com/wtyczka.eeia"
              target="_blank"
              rel="noopener noreferrer"
              className="cosmos-primary-btn inline-flex items-center space-x-2 rounded-xl px-7 py-3 font-bold tracking-wider uppercase shadow-lg transition-all focus:ring-2 focus:ring-[#96C1FF] focus:ring-offset-2 focus:outline-none"
              style={{
                boxShadow: '0 4px 16px rgba(150, 193, 255, 0.25)',
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
              <div className="text-muted-foreground mb-12 text-center">
                To już wszystkie aktualności!
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
