"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, LogOut, Users } from "lucide-react";
import AuthModal from "./AuthModal";
import Link from "next/link";
import "./western-navbar.css";

export default function Navbar() {
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
      const isMobileView = window.innerWidth < 768;
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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6" style={{ width: "100%" }}>
          <div className="flex justify-center items-center w-full">
            {/* Mobile menu button - only show in mobile view */}
            {isMobile && (
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="western-icon-button"
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
                onClick={(e) => handleNavigation(e, "/")}
              >
                {t.nav.home}
              </a>

              <a
                href="/news"
                className="western-button western-button--sign186"
                onClick={(e) => handleNavigation(e, "/news")}
              >
                {t.nav.news}
              </a>

               <a
                 href="/partners"
                 className="western-button western-button--sign186"
                 onClick={(e) => handleNavigation(e, "/partners")}
               >
                 {t.nav.partners}
               </a>

              {user && (
                <>
                  <div className="relative group">
                    <button className="western-button">
                      {t.nav.participantInfo}
                    </button>
                    <div className="western-parent-chain group-hover:opacity-100 group-hover:visible opacity-0 invisible transition-all duration-300">
                      <div className="western-parent-chain-link"></div>
                      <div className="western-parent-chain-link"></div>
                    </div>
                    <div className="western-dropdown top-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <a
                        href={process.env.NEXT_PUBLIC_REGULATIONS_LINK!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="western-dropdown-item"
                      >
                        {t.nav.regulations}
                      </a>
                      <div className="chain-container">
                        <div className="chain-link"></div>
                        <div className="chain-link"></div>
                      </div>
                      <a
                        href="/essentials"
                        className="western-dropdown-item"
                        onClick={(e) => handleNavigation(e, "/essentials")}
                      >
                        {t.nav.essentials}
                      </a>
                      <div className="chain-container">
                        <div className="chain-link"></div>
                        <div className="chain-link"></div>
                      </div>
                      <a
                        href="/faq"
                        className="western-dropdown-item"
                        onClick={(e) => handleNavigation(e, "/faq")}
                      >
                        {t.nav.faq}
                      </a>
                      <div className="chain-container">
                        <div className="chain-link"></div>
                        <div className="chain-link"></div>
                      </div>
                      <a
                        href="/contacts"
                        className="western-dropdown-item"
                        onClick={(e) => handleNavigation(e, "/contacts")}
                      >
                        {t.nav.contacts}
                      </a>
                    </div>
                  </div>

                  <a
                    href="/status"
                    className="western-button"
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
                  >
                    {t.nav.logout}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="western-login-button"
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
              <div className="flex flex-col space-y-2 px-2 pb-2 overflow-y-auto overflow-x-hidden max-h-screen">
                <a
                  href="/"
                  className="western-button text-center"
                  onClick={(e) => handleNavigation(e, "/")}
                >
                  {t.nav.home}
                </a>

                <a
                  href="/news"
                  className="western-button text-center"
                  onClick={(e) => handleNavigation(e, "/news")}
                >
                  {t.nav.news}
                </a>

                <a
                  href="/partners"
                  className="western-button text-center"
                  onClick={(e) => handleNavigation(e, "/partners")}
                >
                  {t.nav.partners}
                </a>

                {user && (
                  <>
                    <div className="space-y-3">
                      <a
                        href={process.env.NEXT_PUBLIC_REGULATIONS_LINK!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="western-dropdown-item mobile-dropdown-item"
                      >
                        {t.nav.regulations}
                      </a>
                      <a
                        href="/essentials"
                        className="western-dropdown-item mobile-dropdown-item"
                        onClick={(e) => handleNavigation(e, "/essentials")}
                      >
                        {t.nav.essentials}
                      </a>
                      <a
                        href="/faq" 
                        className="western-dropdown-item mobile-dropdown-item"
                        onClick={(e) => handleNavigation(e, "/faq")}
                      >
                        {t.nav.faq}
                      </a>
                      <a
                        href="/contacts"
                        className="western-dropdown-item mobile-dropdown-item"
                        onClick={(e) => handleNavigation(e, "/contacts")}
                      >
                        {t.nav.contacts}
                      </a>
                    </div>

                    <a
                      href="/status"
                      className="western-button text-center"
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
                    >
                      {t.nav.logout}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="western-login-button mx-auto block"
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
