"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, DoorOpen, Users } from "lucide-react";
import AuthModal from "./AuthModal";
import Link from "next/link";
import "./western-navbar.css";

export default function Navbar() {
  // Stan do obsługi dropdowna 'Informacje dla uczestnika' na desktopie
  const [isParticipantDropdownOpen, setIsParticipantDropdownOpen] = useState(false);
  const { user, authLogout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Import necessary modules only on the client side
  useEffect(() => {
    // Create audio context for sound effects (to ensure they can play)
    const initializeAudio = () => {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        audioCtx.resume().catch(console.error);
      }
    };
    
    document.addEventListener('click', initializeAudio, { once: true });
    
    // Preload sound and images
    const preloadResources = () => {
      // Preload gunshot sound
      const audio = new Audio();
      audio.src = '/western/gunshot.mp3';
      
      // Preload images
  const imageUrls = ['/western/wooden-sign.svg', '/western/bullet-hole.png', '/western/wooden-background.jpg'];
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };
    
    // Handle responsive menu based on screen size
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      if (!isMobileView && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    preloadResources();
    
    return () => {
      document.removeEventListener('click', initializeAudio);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    // Prevent default navigation
    e.preventDefault();
    // Get click coordinates
    const x = e.clientX;
    const y = e.clientY;
    // Play gunshot sound
    const audio = new Audio('/western/gunshot.mp3');
    audio.currentTime = 0;
    audio.play().catch(() => {});
    // Create bullet icon
    const bulletIcon = document.createElement('img');
    bulletIcon.src = '/western/bullet.svg';
    bulletIcon.alt = 'bullet';
    bulletIcon.className = 'navbar-bullet';
    bulletIcon.style.position = 'absolute';
    bulletIcon.style.left = `${x - 12}px`;
    bulletIcon.style.top = `${y - 12}px`;
    bulletIcon.style.width = '24px';
    bulletIcon.style.height = '24px';
    bulletIcon.style.pointerEvents = 'none';
    bulletIcon.style.zIndex = '9999';
    bulletIcon.style.transition = 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s';
    document.body.appendChild(bulletIcon);
    // Animacja: powiększenie, zostaje i znika
    setTimeout(() => {
      bulletIcon.style.transform = 'scale(1.5)';
    }, 30);
    setTimeout(() => {
      bulletIcon.style.opacity = '0';
    }, 600);
    setTimeout(() => { bulletIcon.remove(); }, 1100);
    // Navigate after a delay (0.75s)
    setTimeout(() => {
      window.location.href = href;
    }, 750);
  };

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Usunięto funkcję przełączania języków

  return (
    <>
      <nav className="western-navbar sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-center items-center w-full">
            {/* Mobile menu button - only show in mobile view */}
            {isMobile && (
              <div>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="western-icon-button"
                  style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', width: '160px', height: '80px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.cursor = 'pointer'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            )}
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="hidden md:flex flex-wrap justify-center items-center gap-3 py-2 western-nav-container mx-auto" style={{ margin: "0 auto", width: "100%", justifyContent: "center" }}>


              <a 
        href="/" 
        className="western-button western-button--sign186 western-button--first"
      style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
                onClick={(e) => handleNavigation(e, "/")}
              >
                {t.nav.home}
              </a>

              <a
        href="/news"
        className="western-button western-button--sign186"
      style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
                onClick={(e) => handleNavigation(e, "/news")}
              >
                {t.nav.news}
              </a>

               <a
       href="/partners"
       className="western-button western-button--sign186"
     style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
                 onClick={(e) => handleNavigation(e, "/partners")}
               >
                 {t.nav.partners}
               </a>

              <div className="relative group">
                <button
                  className="western-button"
                  style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
                  onClick={() => setIsParticipantDropdownOpen((open) => !open)}
                  onMouseEnter={() => setIsParticipantDropdownOpen(true)}
                  onMouseLeave={() => setIsParticipantDropdownOpen(false)}
                >
                  {t.nav.participantInfo}
                </button>
                {/* Łańcuchy pomiędzy tabliczką a regulaminem pojawiają się tylko gdy dropdown jest otwarty */}
                {isParticipantDropdownOpen && (
                  <div className="western-parent-chain western-dropdown-animated" style={{transitionDelay: '40ms'}}>
                    <div className="western-parent-chain-link"></div>
                    <div className="western-parent-chain-link"></div>
                  </div>
                )}
                <div
                  className="western-dropdown top-full left-0"
                  style={{
                    opacity: isParticipantDropdownOpen ? 1 : 0,
                    visibility: isParticipantDropdownOpen ? 'visible' : 'hidden',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={() => setIsParticipantDropdownOpen(true)}
                  onMouseLeave={() => setIsParticipantDropdownOpen(false)}
                >
                  <a
                    href={process.env.NEXT_PUBLIC_REGULATIONS_LINK!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="western-button western-button--sign186 western-dropdown-animated"
                    style={{ backgroundImage: 'url(/western/sign186.svg)', backgroundSize: '160% 160%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'rgba(0,0,0,0)', boxShadow: 'none', border: 'none', minHeight: '96px', transitionDelay: '200ms' }}
                    onClick={() => setIsParticipantDropdownOpen(false)}
                  >
                    {t.nav.regulations}
                  </a>
                  {isParticipantDropdownOpen && (
                    <div className="chain-container western-dropdown-animated" style={{transitionDelay: '200ms'}}>
                      <div className="chain-link" style={{transitionDelay: '200ms'}}></div>
                      <div className="chain-link" style={{transitionDelay: '200ms'}}></div>
                    </div>
                  )}
                  <a
                    href="/essentials"
                    className="western-button western-button--sign186 western-dropdown-animated"
                    style={{ backgroundImage: 'url(/western/sign186.svg)', backgroundSize: '160% 160%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'rgba(0,0,0,0)', boxShadow: 'none', border: 'none', minHeight: '96px', transitionDelay: '400ms' }}
                    onClick={(e) => { handleNavigation(e, "/essentials"); setIsParticipantDropdownOpen(false); }}
                  >
                    {t.nav.essentials}
                  </a>
                  {isParticipantDropdownOpen && (
                    <div className="chain-container western-dropdown-animated" style={{transitionDelay: '400ms'}}>
                      <div className="chain-link" style={{transitionDelay: '400ms'}}></div>
                      <div className="chain-link" style={{transitionDelay: '400ms'}}></div>
                    </div>
                  )}
                  <a
                    href="/faq"
                    className="western-button western-button--sign186 western-dropdown-animated"
                    style={{ backgroundImage: 'url(/western/sign186.svg)', backgroundSize: '160% 160%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'rgba(0,0,0,0)', boxShadow: 'none', border: 'none', minHeight: '96px', transitionDelay: '600ms' }}
                    onClick={(e) => { handleNavigation(e, "/faq"); setIsParticipantDropdownOpen(false); }}
                  >
                    {t.nav.faq}
                  </a>
                  {isParticipantDropdownOpen && (
                    <div className="chain-container western-dropdown-animated" style={{transitionDelay: '600ms'}}>
                      <div className="chain-link" style={{transitionDelay: '600ms'}}></div>
                      <div className="chain-link" style={{transitionDelay: '600ms'}}></div>
                    </div>
                  )}
                  <a
                    href="/contacts"
                    className="western-button western-button--sign186 western-dropdown-animated"
                    style={{ backgroundImage: 'url(/western/sign186.svg)', backgroundSize: '160% 160%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'rgba(0,0,0,0)', boxShadow: 'none', border: 'none', minHeight: '96px', transitionDelay: '800ms' }}
                    onClick={(e) => { handleNavigation(e, "/contacts"); setIsParticipantDropdownOpen(false); }}
                  >
                    {t.nav.contacts}
                  </a>
                </div>
              </div>

              {user && (
                <>
                  <a
                    href="/status"
                    className="western-button western-button--sign186"
                    style={{ backgroundImage: 'url(/western/sign420.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
                    onClick={(e) => handleNavigation(e, "/status")}
                  >
                    Status
                  </a>
                </>
              )}

              {user ? (
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="western-button"
                    style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <DoorOpen size={28} style={{marginRight: '8px', background: 'transparent', color: '#ffe066'}} />
                    {t.nav.logout}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="western-button"
                  style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
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
            <div className="md:hidden py-2 border-t border-[#8B4513] western-mobile-menu w-full">
              <div className="flex flex-col px-2 pb-2 overflow-y-auto overflow-x-hidden max-h-screen" style={{rowGap: '3px'}}>
                <a
                  href="/"
                  className="western-button text-center"
                  style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scaleX(1.08) scaleY(0.95)'; e.currentTarget.style.cursor = 'pointer'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'; }}
                  onClick={(e) => handleNavigation(e, "/")}
                >
                  {t.nav.home}
                </a>

                <a
                  href="/news"
                  className="western-button text-center"
                  style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scaleX(1.08) scaleY(0.95)'; e.currentTarget.style.cursor = 'pointer'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'; }}
                  onClick={(e) => handleNavigation(e, "/news")}
                >
                  {t.nav.news}
                </a>

                <a
                  href="/partners"
                  className="western-button text-center"
                  style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scaleX(1.08) scaleY(0.95)'; e.currentTarget.style.cursor = 'pointer'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'; }}
                  onClick={(e) => handleNavigation(e, "/partners")}
                >
                  {t.nav.partners}
                </a>

                <div className="space-y-3">
                  <a
                    href={process.env.NEXT_PUBLIC_REGULATIONS_LINK!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="western-dropdown-item mobile-dropdown-item"
                    style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scaleX(1.08) scaleY(0.95)'; e.currentTarget.style.cursor = 'pointer'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'; }}
                  >
                    {t.nav.regulations}
                  </a>
                  <a
                    href="/essentials"
                    className="western-dropdown-item mobile-dropdown-item"
                    style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scaleX(1.08) scaleY(0.95)'; e.currentTarget.style.cursor = 'pointer'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'; }}
                    onClick={(e) => handleNavigation(e, "/essentials")}
                  >
                    {t.nav.essentials}
                  </a>
                  <a
                    href="/faq" 
                    className="western-dropdown-item mobile-dropdown-item"
                    style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scaleX(1.08) scaleY(0.95)'; e.currentTarget.style.cursor = 'pointer'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'; }}
                    onClick={(e) => handleNavigation(e, "/faq")}
                  >
                    {t.nav.faq}
                  </a>
                  <a
                    href="/contacts"
                    className="western-dropdown-item mobile-dropdown-item"
                    style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scaleX(1.08) scaleY(0.95)'; e.currentTarget.style.cursor = 'pointer'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'; }}
                    onClick={(e) => handleNavigation(e, "/contacts")}
                  >
                    {t.nav.contacts}
                  </a>
                </div>

                {user && (
                  <>
                    <a
                      href="/status"
                      className="western-button text-center"
                      style={{ backgroundImage: 'url(/western/sign420.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
                      onClick={(e) => handleNavigation(e, "/status")}
                    >
                      Status
                    </a>
                  </>
                )}

                {user ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleLogout}
                      className="western-button mx-auto block"
                      style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scaleX(1.08) scaleY(0.95)'; e.currentTarget.style.cursor = 'pointer'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'; }}
                    >
                      <DoorOpen size={28} style={{marginRight: '8px', background: 'transparent', color: '#ffe066'}} />
                      {t.nav.logout}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="western-button mx-auto block"
                    style={{ backgroundImage: 'url(/western/wooden-sign.png)', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: 'transparent', boxShadow: 'none', border: 'none', transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scaleX(1.08) scaleY(0.95)'; e.currentTarget.style.cursor = 'pointer'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scaleX(1) scaleY(1)'; }}
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
  );
}
