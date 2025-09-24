'use client'

import { useState, useEffect } from 'react'
// Nieużywane importy usunięte
import { TeamMember } from '@/usecases/team-members'
import TeamMemberCard from '@/components/TeamMemberCard'
// All styles are now consolidated in app/css

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export default function ContactsPage() {
  // Start with content hidden until access is confirmed
  const [isContactVisible, setIsContactVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false)

  // Stan do karuzeli
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [api, setApi] = useState<CarouselApi | undefined>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // Function to check access with cache busting to avoid caching problems
  const checkContactAccess = () => {
    setIsLoading(true) // Show loading state
    console.log('Checking contacts access...')

    // Add timestamp parameter to avoid browser caching
    const timestamp = new Date().getTime()

    // Sprawdzenie dostępu wyłącznie przez API - serwer decyduje o dostępie
    fetch(`/api/check-access/contacts?t=${timestamp}`)
      .then((res) => res.json())
      .then((data) => {
        setIsContactVisible(data.access === true)

        // Only fetch team members if access is granted
        if (data.access === true) {
          // Get team members through API
          return fetch(`/api/team-members?t=${timestamp}`)
            .then((res) => {
              if (!res.ok) throw new Error('Failed to fetch team members')
              return res.json()
            })
            .then((data) => {
              setTeamMembers(data.teamMembers || [])
              setIsLoading(false)
            })
            .catch((error) => {
              console.error('Error fetching team members:', error)
              setIsLoading(false)
            })
        } else {
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error('Error checking contacts access:', error)
        // W przypadku błędu API, blokujemy dostęp
        setIsContactVisible(false)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setIsMounted(true)
    // Call the function when component mounts
    checkContactAccess()
  }, [])

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.scrollTo(0)
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
    // Autoplay
    const autoplayInterval = setInterval(() => {
      api.scrollNext()
    }, 5000)
    const handleUserInteraction = () => clearInterval(autoplayInterval)
    window.addEventListener('mousemove', handleUserInteraction)
    window.addEventListener('touchstart', handleUserInteraction)
    return () => {
      clearInterval(autoplayInterval)
      window.removeEventListener('mousemove', handleUserInteraction)
      window.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [api])

  if (!isMounted) return null

  // Show loading state
  if (isLoading) {
    return (
      <div className="contactsContainer">
        <div className="pageOverlay"></div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            background: 'rgba(24,24,27,0.95)',
            borderRadius: '2rem',
            padding: '3rem',
            margin: '2rem auto',
            maxWidth: 600,
            boxShadow: '0 0 32px #0008',
          }}
        >
          <div style={{ fontSize: '24px', color: '#f0f0f0' }}>Ładowanie...</div>
        </div>
      </div>
    )
  }

  // Show access denied message
  if (!isContactVisible) {
    return (
      <div className="contactsContainer">
        <div className="pageOverlay"></div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'center',
            minHeight: '60vh',
            background: 'rgba(24,24,27,0.95)',
            borderRadius: '2rem',
            padding: '3rem',
            margin: '2rem auto',
            maxWidth: 600,
            boxShadow: '0 0 32px #0008',
          }}
        >
          <h1
            className="mb-10 text-4xl font-bold text-amber-400"
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            Kadra zostanie ujawniona wkrótce
          </h1>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
            }}
          >
            <p
              className="text-lg text-gray-300"
              style={{
                textAlign: 'center',
                lineHeight: 2.1,
                margin: 0,
                width: '100%',
                letterSpacing: '0.01em',
              }}
            >
              Chciałbyś wiedzieć, kto jest w kadrze wyjazdu?
              <br />
              Nazwiska i sylwetki kadrowiczów zostaną opublikowane już niedługo!
            </p>
          </div>
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <span className="text-base text-gray-400">
              Śledź nasze{' '}
              <a
                href="/news"
                className="text-amber-400 underline hover:text-amber-300"
              >
                aktualności
              </a>{' '}
              oraz social media,<br></br>aby być na bieżąco.
            </span>
          </div>

          <button
            onClick={checkContactAccess}
            className="mt-6 rounded-lg bg-amber-600 px-6 py-3 text-white shadow transition-colors hover:bg-amber-700"
          >
            Sprawdź dostępność
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="contactsContainer">
      <div className="pageOverlay"></div>
      <h1 className="pageTitle fadeIn">Kadra Wyjazdu</h1>
      <p className="pageDescription fadeIn" style={{ animationDelay: '0.2s' }}>
        Poznaj osoby organizujące obóz adaptacyjny Wtyczka 2025. W razie pytań
        możesz się z nami skontaktować bezpośrednio poprzez email lub Facebook.
      </p>

      <div className="carouselContainer">
        {/* Carousel for all devices showing 3 cards at once on desktop */}
        <Carousel
          className="mx-auto w-full"
          opts={{
            align: 'start',
            loop: true,
            dragFree: true,
            containScroll: 'trimSnaps',
            skipSnaps: false,
          }}
          setApi={setApi}
        >
          <CarouselContent className="-ml-4">
            {teamMembers.map((member: TeamMember) => (
              <CarouselItem
                key={member.id}
                className="xs:basis-full basis-full pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/3"
              >
                <div className="h-full">
                  <TeamMemberCard member={member} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Wskaźnik pozycji (kropki) */}
          <div className="carouselDots mb-4">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`carouselDot ${
                  current === index ? 'carouselDotActive' : ''
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Przejdź do slajdu ${index + 1} z ${count}`}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-24">
            <CarouselPrevious className="carouselArrow" />
            <CarouselNext className="carouselArrow" />
          </div>
        </Carousel>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={checkContactAccess}
          className="rounded-lg bg-amber-600 px-6 py-3 text-white shadow transition-colors hover:bg-amber-700"
        >
          Odśwież dane
        </button>
      </div>
    </div>
  )
}
