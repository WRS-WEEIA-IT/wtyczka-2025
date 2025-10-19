'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Menu, X, DoorOpen } from 'lucide-react'
import AuthModal from './AuthModal'
import Link from 'next/link'
import './western-navbar.css'

export default function Navbar() {
  const { user, authLogout } = useAuth()
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Import necessary modules only on the client side
  useEffect(() => {
    // Create audio context for sound effects (to ensure they can play)
    const initializeAudio = () => {
      type AudioContextType = typeof window.AudioContext
      const AudioContext: AudioContextType =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: AudioContextType })
          .webkitAudioContext
      if (AudioContext) {
        const audioCtx = new AudioContext()
        audioCtx.resume().catch(console.error)
      }
    }

    document.addEventListener('click', initializeAudio, { once: true })

    // Preload sound and images
    const preloadResources = () => {
      // Preload gunshot sound
      const audio = new Audio()
      audio.src = '/western/gunshot.mp3'

      // Preload images
      const imageUrls = [
        '/western/wooden-sign.svg',
        '/western/bullet-hole.png',
        '/western/wooden-background.jpg',
      ]
      imageUrls.forEach((url) => {
        const img = new Image()
        img.src = url
      })
    }

    // Call preloadResources
    preloadResources()

    // Handle responsive menu based on screen size
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768
      setIsMobile(isMobileView)
      if (!isMobileView && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    // Initial check
    handleResize()

    // Add event listener for window resize
    window.addEventListener('resize', handleResize)

    preloadResources()

    return () => {
      document.removeEventListener('click', initializeAudio)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMenuOpen])

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    // Prevent default navigation
    e.preventDefault()
    // Get click coordinates
    const x = e.clientX
    const y = e.clientY
    // Play gunshot sound
    const audio = new Audio('/western/gunshot.mp3')
    audio.currentTime = 0
    audio.volume = 0.15
    audio.play().catch(() => {})
    // Create bullet icon
    const bulletIcon = document.createElement('img')
    bulletIcon.src = '/western/bullet.svg'
    bulletIcon.alt = 'bullet'
    bulletIcon.className = 'navbar-bullet'
    bulletIcon.style.position = 'absolute'
    bulletIcon.style.left = `${x - 12}px`
    bulletIcon.style.top = `${y - 12}px`
    bulletIcon.style.width = '24px'
    bulletIcon.style.height = '24px'
    bulletIcon.style.pointerEvents = 'none'
    bulletIcon.style.zIndex = '9999'
    bulletIcon.style.transition =
      'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s'
    document.body.appendChild(bulletIcon)
    // Animacja: powiększenie, zostaje i znika
    setTimeout(() => {
      bulletIcon.style.transform = 'scale(1.5)'
    }, 30)
    setTimeout(() => {
      bulletIcon.style.opacity = '0'
    }, 600)
    setTimeout(() => {
      bulletIcon.remove()
    }, 1100)
    // Navigate after a delay (0.75s)
    setTimeout(() => {
      window.location.href = href
    }, 750)
  }

  const handleLogout = async () => {
    try {
      await authLogout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Toggle dla opcji uczestnika
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false)
  // Usuwam isParticipantHovered, dodaję funkcję sprawdzającą widoczność hover menu
  const isHoverMenuVisible = () => {
    const hoverMenu = document.querySelector(
      '.western-dropdown.group-hover\\:opacity-100',
    )
    if (!hoverMenu) return false
    const style = window.getComputedStyle(hoverMenu)
    return style.visibility === 'visible' && style.opacity === '1'
  }

  return (
    <>
      <nav className="western-navbar sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <div className="flex w-full items-center justify-center">
            {/* Mobile menu button - only show in mobile view */}
            {isMobile && (
              <div>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="western-icon-button"
                  style={{
                    backgroundImage: 'url(/western/wooden-sign.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    width: '160px',
                    height: '80px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08)'
                    e.currentTarget.style.cursor = 'pointer'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            )}

            {/* Desktop Navigation */}
            {!isMobile && (
              <div
                className="western-nav-container mx-auto hidden flex-wrap items-center justify-center gap-3 py-2 md:flex"
                style={{
                  margin: '0 auto',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <Link
                  href="/"
                  className="western-button western-button--sign186 western-button--first"
                  style={{
                    backgroundImage: 'url(/western/wooden-sign.png)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                  }}
                  onClick={(e) => handleNavigation(e, '/')}
                >
                  {t.nav.home}
                </Link>

                <Link
                  href="/news"
                  className="western-button western-button--sign186"
                  style={{
                    backgroundImage: 'url(/western/wooden-sign.png)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                  }}
                  onClick={(e) => handleNavigation(e, '/news')}
                >
                  {t.nav.news}
                </Link>

                <Link
                  href="/partners"
                  className="western-button western-button--sign186"
                  style={{
                    backgroundImage: 'url(/western/wooden-sign.png)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                  }}
                  onClick={(e) => handleNavigation(e, '/partners')}
                >
                  {t.nav.partners}
                </Link>

                <div
                  className="group relative"
                  style={{ position: 'relative', zIndex: 20 }}
                >
                  <button
                    className="western-button"
                    style={{
                      backgroundImage: 'url(/western/wooden-sign.png)',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      position: 'relative',
                    }}
                    onClick={() => {
                      if (!isHoverMenuVisible()) {
                        setShowParticipantDropdown((prev) => !prev)
                      }
                    }}
                  >
                    {t.nav.participantInfo}
                  </button>
                  {/* Przeniesiony div western-parent-chain za przycisk */}
                  <div className="western-parent-chain invisible opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                    <div className="western-parent-chain-link"></div>
                    <div className="western-parent-chain-link"></div>
                  </div>
                  {/* Dropdown na hover (oryginalny) */}
                  <div
                    className="western-dropdown invisible top-full left-0 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100"
                    style={{
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0',
                    }}
                  >
                    <a
                      href={process.env.NEXT_PUBLIC_REGULATIONS_LINK!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="western-button western-button--sign186 western-dropdown-animated"
                      style={{
                        backgroundImage: 'url(/western/sign186.svg)',
                        backgroundSize: '145% 135%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'rgba(0,0,0,0)',
                        boxShadow: 'none',
                        border: 'none',
                        minHeight: '96px',
                        transitionDelay: '0ms',
                      }}
                    >
                      <div style={{ marginTop: '8px' }}>
                        {t.nav.regulations}
                      </div>
                    </a>
                    <a
                      href="https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/dokumenty/oswiadczenie.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="western-button western-button--sign186 western-dropdown-animated"
                      style={{
                        backgroundImage: 'url(/western/sign186.svg)',
                        backgroundSize: '145% 135%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'rgba(0,0,0,0)',
                        boxShadow: 'none',
                        border: 'none',
                        minHeight: '96px',
                        transitionDelay: '0ms',
                      }}
                    >
                      <div style={{ marginTop: '8px' }}>
                        Obozowe oświadczenie
                      </div>
                    </a>
                    <div
                      className="chain-container western-dropdown-animated"
                      style={{ transitionDelay: '80ms' }}
                    >
                      <div className="chain-link"></div>
                      <div className="chain-link"></div>
                    </div>
                    <Link
                      href="/essentials"
                      className="western-button western-button--sign186 western-dropdown-animated"
                      style={{
                        backgroundImage: 'url(/western/sign186.svg)',
                        backgroundSize: '145% 135%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'rgba(0,0,0,0)',
                        boxShadow: 'none',
                        border: 'none',
                        minHeight: '96px',
                        transitionDelay: '160ms',
                      }}
                      onClick={(e) => handleNavigation(e, '/essentials')}
                    >
                      <div style={{ marginTop: '8px' }}>{t.nav.essentials}</div>
                    </Link>
                    <div
                      className="chain-container western-dropdown-animated"
                      style={{ transitionDelay: '240ms' }}
                    >
                      <div className="chain-link"></div>
                      <div className="chain-link"></div>
                    </div>
                    <Link
                      href="/faq"
                      className="western-button western-button--sign186 western-dropdown-animated"
                      style={{
                        backgroundImage: 'url(/western/sign186.svg)',
                        backgroundSize: '145% 135%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'rgba(0,0,0,0)',
                        boxShadow: 'none',
                        border: 'none',
                        minHeight: '96px',
                        transitionDelay: '320ms',
                      }}
                      onClick={(e) => handleNavigation(e, '/faq')}
                    >
                      <div style={{ marginTop: '8px' }}>{t.nav.faq}</div>
                    </Link>
                    <div
                      className="chain-container western-dropdown-animated"
                      style={{ transitionDelay: '400ms' }}
                    >
                      <div className="chain-link"></div>
                      <div className="chain-link"></div>
                    </div>
                    <Link
                      href="/contacts"
                      className="western-button western-button--sign186 western-dropdown-animated"
                      style={{
                        backgroundImage: 'url(/western/sign186.svg)',
                        backgroundSize: '145% 135%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'rgba(0,0,0,0)',
                        boxShadow: 'none',
                        border: 'none',
                        minHeight: '96px',
                        transitionDelay: '480ms',
                      }}
                      onClick={(e) => handleNavigation(e, '/contacts')}
                    >
                      <div style={{ marginTop: '8px' }}>{t.nav.contacts}</div>
                    </Link>
                  </div>
                  {/* Dropdown na kliknięcie z łańcuchami */}
                  {showParticipantDropdown && !isHoverMenuVisible() && (
                    <div
                      className="western-dropdown visible top-full left-0 opacity-100 transition-all duration-300"
                      style={{
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0',
                        position: 'absolute',
                        zIndex: 100,
                      }}
                    >
                      {/* Łańcuchy za tabliczkami regulamin i info */}
                      <div
                        className="chain-container western-dropdown-animated"
                        style={{ transitionDelay: '80ms', marginTop: '-15px' }}
                      >
                        <div className="western-parent-chain-link"></div>
                        <div className="western-parent-chain-link"></div>
                      </div>
                      {/* Przycisk regulamin */}
                      <a
                        href={process.env.NEXT_PUBLIC_REGULATIONS_LINK!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="western-button western-button--sign186 western-dropdown-animated"
                        style={{
                          backgroundImage: 'url(/western/sign186.svg)',
                          backgroundSize: '145% 135%',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundColor: 'rgba(0,0,0,0)',
                          boxShadow: 'none',
                          border: 'none',
                          minHeight: '96px',
                          transitionDelay: '0ms',
                          position: 'relative',
                          zIndex: 102,
                        }}
                      >
                        <div style={{ marginTop: '8px' }}>
                          {t.nav.regulations}
                        </div>
                      </a>
                      {/* Pozostałe przyciski */}
                      <div
                        className="chain-container western-dropdown-animated"
                        style={{ transitionDelay: '80ms' }}
                      >
                        <div className="chain-link"></div>
                        <div className="chain-link"></div>
                      </div>
                      <Link
                        href="/essentials"
                        className="western-button western-button--sign186 western-dropdown-animated"
                        style={{
                          backgroundImage: 'url(/western/sign186.svg)',
                          backgroundSize: '145% 135%',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundColor: 'rgba(0,0,0,0)',
                          boxShadow: 'none',
                          border: 'none',
                          minHeight: '96px',
                          transitionDelay: '160ms',
                        }}
                        onClick={(e) => handleNavigation(e, '/essentials')}
                      >
                        <div style={{ marginTop: '8px' }}>
                          {t.nav.essentials}
                        </div>
                      </Link>
                      <div
                        className="chain-container western-dropdown-animated"
                        style={{ transitionDelay: '240ms' }}
                      >
                        <div className="chain-link"></div>
                        <div className="chain-link"></div>
                      </div>
                      <Link
                        href="/faq"
                        className="western-button western-button--sign186 western-dropdown-animated"
                        style={{
                          backgroundImage: 'url(/western/sign186.svg)',
                          backgroundSize: '145% 135%',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundColor: 'rgba(0,0,0,0)',
                          boxShadow: 'none',
                          border: 'none',
                          minHeight: '96px',
                          transitionDelay: '320ms',
                        }}
                        onClick={(e) => handleNavigation(e, '/faq')}
                      >
                        <div style={{ marginTop: '8px' }}>{t.nav.faq}</div>
                      </Link>
                      <div
                        className="chain-container western-dropdown-animated"
                        style={{ transitionDelay: '400ms' }}
                      >
                        <div className="chain-link"></div>
                        <div className="chain-link"></div>
                      </div>
                      <Link
                        href="/contacts"
                        className="western-button western-button--sign186 western-dropdown-animated"
                        style={{
                          backgroundImage: 'url(/western/sign186.svg)',
                          backgroundSize: '145% 135%',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundColor: 'rgba(0,0,0,0)',
                          boxShadow: 'none',
                          border: 'none',
                          minHeight: '96px',
                          transitionDelay: '480ms',
                        }}
                        onClick={(e) => handleNavigation(e, '/contacts')}
                      >
                        <div style={{ marginTop: '8px' }}>{t.nav.contacts}</div>
                      </Link>
                    </div>
                  )}
                </div>

                {user && (
                  <>
                    <Link
                      href="/status"
                      className="western-button western-button--sign186"
                      style={{
                        backgroundImage: 'url(/western/sign420.png)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                      }}
                      onClick={(e) => handleNavigation(e, '/status')}
                    >
                      Status
                    </Link>
                  </>
                )}

                {user ? (
                  <div className="flex items-center">
                    <button
                      onClick={handleLogout}
                      className="western-button"
                      style={{
                        backgroundImage: 'url(/western/wooden-sign.png)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <DoorOpen
                        size={28}
                        style={{
                          marginRight: '8px',
                          background: 'transparent',
                          color: '#ffe066',
                        }}
                      />
                      {t.nav.logout}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="western-button"
                    style={{
                      backgroundImage: 'url(/western/wooden-sign.png)',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                    }}
                  >
                    {t.nav.login} / {t.nav.register}
                  </button>
                )}
              </div>
            )}

            {/* Empty div for layout balance on mobile */}
            <div className="md:hidden">
              {/* Placeholder for layout balance */}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && isMobile && (
            <div className="western-mobile-menu w-full py-2 md:hidden">
              <div
                className="flex max-h-screen flex-col overflow-x-hidden overflow-y-auto px-2 pb-2"
                style={{ rowGap: '3px' }}
              >
                <Link
                  href="/"
                  className="western-button text-center"
                  style={{
                    backgroundImage: 'url(/western/wooden-sign.png)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      'scaleX(1.08) scaleY(0.95)'
                    e.currentTarget.style.cursor = 'pointer'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'
                  }}
                  onClick={(e) => handleNavigation(e, '/')}
                >
                  {t.nav.home}
                </Link>

                <Link
                  href="/news"
                  className="western-button text-center"
                  style={{
                    backgroundImage: 'url(/western/wooden-sign.png)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      'scaleX(1.08) scaleY(0.95)'
                    e.currentTarget.style.cursor = 'pointer'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'
                  }}
                  onClick={(e) => handleNavigation(e, '/news')}
                >
                  {t.nav.news}
                </Link>

                <Link
                  href="/partners"
                  className="western-button text-center"
                  style={{
                    backgroundImage: 'url(/western/wooden-sign.png)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      'scaleX(1.08) scaleY(0.95)'
                    e.currentTarget.style.cursor = 'pointer'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'
                  }}
                  onClick={(e) => handleNavigation(e, '/partners')}
                >
                  {t.nav.partners}
                </Link>

                <div className="space-y-3">
                  <a
                    href={process.env.NEXT_PUBLIC_REGULATIONS_LINK!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="western-dropdown-item mobile-dropdown-item"
                    style={{
                      backgroundImage: 'url(/western/wooden-sign.png)',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      transition:
                        'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'scaleX(1.08) scaleY(0.95)'
                      e.currentTarget.style.cursor = 'pointer'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'
                    }}
                  >
                    {t.nav.regulations}
                  </a>
                  <a
                    href="https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/dokumenty/oswiadczenie.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="western-dropdown-item mobile-dropdown-item"
                    style={{
                      backgroundImage: 'url(/western/wooden-sign.png)',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      transition:
                        'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'scaleX(1.08) scaleY(0.95)'
                      e.currentTarget.style.cursor = 'pointer'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'
                    }}
                  >
                    Obozowe oświadczenie
                  </a>
                  <Link
                    href="/essentials"
                    className="western-dropdown-item mobile-dropdown-item"
                    style={{
                      backgroundImage: 'url(/western/wooden-sign.png)',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      transition:
                        'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'scaleX(1.08) scaleY(0.95)'
                      e.currentTarget.style.cursor = 'pointer'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'
                    }}
                    onClick={(e) => handleNavigation(e, '/essentials')}
                  >
                    {t.nav.essentials}
                  </Link>
                  <Link
                    href="/faq"
                    className="western-dropdown-item mobile-dropdown-item"
                    style={{
                      backgroundImage: 'url(/western/wooden-sign.png)',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      transition:
                        'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'scaleX(1.08) scaleY(0.95)'
                      e.currentTarget.style.cursor = 'pointer'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'
                    }}
                    onClick={(e) => handleNavigation(e, '/faq')}
                  >
                    {t.nav.faq}
                  </Link>
                  <Link
                    href="/contacts"
                    className="western-dropdown-item mobile-dropdown-item"
                    style={{
                      backgroundImage: 'url(/western/wooden-sign.png)',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      transition:
                        'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'scaleX(1.08) scaleY(0.95)'
                      e.currentTarget.style.cursor = 'pointer'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'
                    }}
                    onClick={(e) => handleNavigation(e, '/contacts')}
                  >
                    {t.nav.contacts}
                  </Link>
                </div>

                {user && (
                  <>
                    <Link
                      href="/status"
                      className="western-button text-center"
                      style={{
                        backgroundImage: 'url(/western/sign420.png)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                      }}
                      onClick={(e) => handleNavigation(e, '/status')}
                    >
                      Status
                    </Link>
                  </>
                )}

                {user ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleLogout}
                      className="western-button mx-auto block"
                      style={{
                        backgroundImage: 'url(/western/wooden-sign.png)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition:
                          'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          'scaleX(1.08) scaleY(0.95)'
                        e.currentTarget.style.cursor = 'pointer'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'
                      }}
                    >
                      <DoorOpen
                        size={28}
                        style={{
                          marginRight: '8px',
                          background: 'transparent',
                          color: '#ffe066',
                        }}
                      />
                      {t.nav.logout}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="western-button mx-auto block"
                    style={{
                      backgroundImage: 'url(/western/wooden-sign.png)',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      transition:
                        'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'scaleX(1.08) scaleY(0.95)'
                      e.currentTarget.style.cursor = 'pointer'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'
                    }}
                  >
                    {t.nav.login} / {t.nav.register}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}
