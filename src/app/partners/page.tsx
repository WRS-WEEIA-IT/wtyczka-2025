
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from './partners.module.css';
import './treasure-effects.css'; // Import our new treasure effects

// Sample partner data - replace with actual partners later
const partners = [
  { 
    id: 1, 
    name: "Partner 1", 
  logo: "/logo.svg",
    url: "https://example.com/partner1",
    description: "Nasz wieloletni partner, który wspiera Wtyczkę od samego początku. Specjalizuje się w technologiach webowych i aplikacjach mobilnych."
  },
  { 
    id: 2, 
    name: "Partner 2", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner2",
    description: "Firma zajmująca się rozwiązaniami z zakresu sztucznej inteligencji i uczenia maszynowego."
  },
  { 
    id: 3, 
    name: "Partner 3", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner3",
    description: "Specjaliści od cyberbezpieczeństwa i ochrony danych, wspierający Wtyczkę od 2022 roku."
  },
  { 
    id: 4, 
    name: "Partner 4", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner4",
    description: "Producent innowacyjnego sprzętu elektronicznego i rozwiązań IoT."
  },
  { 
    id: 5, 
    name: "Partner 5", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner5",
    description: "Dostawca usług chmurowych i rozwiązań serwerowych dla biznesu."
  },
  { 
    id: 6, 
    name: "Partner 6", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner6",
    description: "Firma consultingowa specjalizująca się w transformacji cyfrowej przedsiębiorstw."
  },
  { 
    id: 7, 
    name: "Partner 7", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner7",
    description: "Agencja marketingowa wspierająca Wtyczkę w działaniach promocyjnych i strategii marki."
  },
  { 
    id: 8, 
    name: "Partner 8", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner8",
    description: "Dostawca usług telekomunikacyjnych i rozwiązań sieciowych."
  },
  { 
    id: 9, 
    name: "Partner 9", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner9",
    description: "Producent oprogramowania i systemów zarządzania dla firm."
  },
  { 
    id: 10, 
    name: "Partner 10", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner10",
    description: "Firma specjalizująca się w rozwiązaniach VR/AR dla przemysłu i edukacji."
  },
  { 
    id: 11, 
    name: "Partner 11", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner11",
    description: "Dostawca usług z zakresu Big Data i analityki biznesowej."
  },
  { 
    id: 12, 
    name: "Partner 12", 
    logo: "/logo_czarne_tło.jpg",
    url: "https://example.com/partner12",
    description: "Innowacyjny startup rozwijający technologie blockchain i fintech."
  },
];

export default function PartnersPage() {
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [goldenBarsVisible, setGoldenBarsVisible] = useState(false);
  const [chestVisible, setChestVisible] = useState(true);
  const [barsInGrid, setBarsInGrid] = useState(false);
  const chestRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const chestPositionRef = useRef({x: 0, y: 0});
  const [dustParticles, setDustParticles] = useState<Array<{id: number, left: string, size: string, duration: string}>>([]);

  // Automatyczne przewijanie na górę strony przy ładowaniu/odświeżaniu
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  // Calculate and store chest position for better animation reference
  useEffect(() => {
    if (chestRef.current) {
      const rect = chestRef.current.getBoundingClientRect();
      chestPositionRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
  }, [isChestOpen]);

  // Get chest position for animations
  useEffect(() => {
    if (chestRef.current) {
      const rect = chestRef.current.getBoundingClientRect();
      chestPositionRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
  }, [isChestOpen]);

  // Play sound when chest opens
  const playChestOpenSound = () => {
    // Create audio element
    const audioElement = new Audio('/western/chest-opening.mp3');
    audioElement.volume = 0.2; // Lower volume
    // Play the sound
    audioElement.play().catch(e => console.log('Audio playback error:', e));
  };
  
  // Handle chest click animation with improved sequence
  const handleChestClick = () => {
    if (!isChestOpen) {
      // Play sound when chest opens
      playChestOpenSound();
      
      // Open the chest
      setIsChestOpen(true);
      
      // Show gold bars with a slight delay after chest starts opening - wypadające ze skrzyni
      setTimeout(() => {
        // Update chest position for better animation reference
        if (chestRef.current) {
          const rect = chestRef.current.getBoundingClientRect();
          chestPositionRef.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        }
        
        // Show bars in grid layout
        setBarsInGrid(true);
        setGoldenBarsVisible(true);
        
        // Scroll down to see the gold bars
        setTimeout(() => {
          if (gridRef.current) {
            gridRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start'
            });
          }
        }, 800); // Dłuższy czas aby dać sztabkom czas na "wylądowanie"
      }, 400);
    }
  };
  
  // Handle partner card click - redirect to partner website
  const handlePartnerClick = (partner: { id: number, url: string }) => {
    if (partner.url) {
      window.open(partner.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div ref={containerRef} className={`min-h-screen flex flex-col items-center justify-start py-10 px-4 overflow-x-hidden`}>
      {/* Add subtle black overlay */}
      <div className={styles.pageOverlay}></div>
      
      {/* Western-themed header */}
      <div className="w-full max-w-5xl text-center mb-8">
        <h1 className={`text-5xl md:text-6xl font-bold text-yellow-300 mb-3 ${styles.goldRushTitle}`}>
          Nasi Partnerzy
        </h1>
        <p className="text-xl text-amber-100 max-w-2xl mx-auto mt-4">
          Kliknij w skrzynię, aby odkryć prawdziwe skarby Wtyczki!
        </p>
      </div>

      {/* Background - using the same background as other pages */}

      {/* Main treasure chest container */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mt-8">
        <AnimatePresence>
          {chestVisible && (
            <motion.div 
              ref={chestRef}
              className={`w-full aspect-square max-w-xl mx-auto cursor-pointer ${styles.treasureChest}`}
              onClick={handleChestClick}
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ 
                scale: isChestOpen ? [1, 1.05, 0.95, 1] : 1, 
                rotate: isChestOpen ? [0, -3, 3, -2, 2, 0] : 0,
                y: isChestOpen ? [0, -8, 5, -3, 0] : 0,
                opacity: 1
              }}
              exit={{ 
                opacity: 0,
                y: 50,
                scale: 0.8,
                transition: { duration: 1.5 }
              }}
              transition={{ 
                scale: { duration: 0.8, ease: "easeOut" },
                rotate: { duration: 0.5, ease: "easeInOut", repeat: isChestOpen ? 1 : 0 },
                y: { duration: 0.4, ease: "easeInOut", repeat: isChestOpen ? 1 : 0 }
              }}
              whileHover={{ 
                scale: isChestOpen ? 1 : 1.02,
                transition: { duration: 0.3 }
              }}
            >
              {/* Using SVG images for chest */}
              <div className="relative w-full h-full">
                {/* Enhanced chest shadow with better depth perception - podsunięty bliżej skrzyni */}
                <motion.div 
                  className="absolute bottom-[10%] left-1/2 w-[80%] h-[10%] bg-black rounded-[50%] blur-lg opacity-40"
                  style={{ transform: "translateX(-50%)" }}
                  animate={{ 
                    width: isChestOpen ? "90%" : "80%",
                    opacity: isChestOpen ? 0.5 : 0.4,
                    filter: isChestOpen ? "blur(16px)" : "blur(12px)"
                  }}
                  transition={{ duration: 0.8 }}
                />
              
                {/* SVG Chest - using the SVG files from western folder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Closed chest SVG - visible when chest is closed */}
                    <motion.img 
                      src="/western/chest-closed.svg"
                      alt="Closed Treasure Chest"
                      className="w-full h-full object-contain"
                      style={{ 
                        position: 'absolute',
                        zIndex: isChestOpen ? 0 : 2
                      }}
                      animate={{
                        opacity: isChestOpen ? 0 : 1,
                        scale: isChestOpen ? [1, 1.05, 0] : 1
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Open chest SVG - visible when chest is open */}
                    <motion.img 
                      src="/western/chest-open.svg"
                      alt="Open Treasure Chest"
                      className="w-full h-full object-contain"
                      style={{ 
                        position: 'absolute',
                        zIndex: isChestOpen ? 2 : 0,
                        opacity: 0 // Początkowy stan - niewidoczny
                      }}
                      animate={{
                        opacity: isChestOpen ? 1 : 0,
                        scale: isChestOpen ? [0, 1.15, 1] : 0,
                        y: isChestOpen ? [20, -10, 0] : 0
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeInOut"
                      }}
                    />
                  
                  {/* Light flash effect when chest opens */}
                  {isChestOpen && (
                    <motion.div
                      className="absolute inset-0 bg-yellow-100 rounded-full z-1"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 0.9, 0], 
                        scale: [0, 1.5, 2] 
                      }}
                      transition={{ 
                        duration: 0.8, 
                        ease: "easeOut",
                        times: [0, 0.3, 1]
                      }}
                      style={{ 
                        filter: "blur(30px)",
                        zIndex: 1
                      }}
                    />
                  )}
                </div>
                
                {/* Enhanced chest shine and light effects */}
                {/* Usunięto poświatę wychodzącą ze skrzyni */}
                
                {/* Additional ambient light effects */}
                {/* Usunięto dodatkowe efekty świetlne wokół skrzyni */}
                
                {/* Enhanced click indicator if chest is not open */}
                {/* Usunięto latający napis 'kliknij aby otworzyć' */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gold bars with partner logos that spill out */}
        <div className={`relative w-full min-h-[500px] mt-8 ${styles.goldBarContainer}`}>
          {/* Gold pile base - visible once chest is open */}
          {isChestOpen && (
            <motion.div
              className="absolute left-1/2 top-40 transform -translate-x-1/2 w-[80%] h-40 bg-gradient-to-b from-amber-700 to-transparent rounded-[50%] opacity-20 blur-md"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ delay: 1, duration: 1 }}
            />
          )}
          
          <AnimatePresence>
            {goldenBarsVisible && (
              <motion.div 
                ref={gridRef}
                className={`${styles.gridContainer} w-full h-full mt-16`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {partners.map((partner, idx) => {
                  // Obliczamy pozycję początkową sztabki - wewnątrz skrzyni
                  const chestCenterX = chestRef.current ? chestRef.current.getBoundingClientRect().width / 2 : 0;
                  const chestY = chestRef.current ? chestRef.current.getBoundingClientRect().top : 100;
                  
                  // Animation sequence delay - sztabki wypadają jedna po drugiej
                  const sequentialDelay = 0.1 * idx + 0.2;
                  
                  // Losowe przesunięcie od środka skrzyni
                  const randomOffsetX = (Math.random() * 60 - 30); // -30px to +30px
                  const randomOffsetY = (Math.random() * 20); // 0 to +20px (aby były nieco ponad sobą)
                  const randomRotation = Math.random() * 180 - 90; // -90deg to +90deg
                  
                  return (
                    <motion.div
                      key={partner.id}
                      className={`${styles.gridItem}`}
                      initial={{
                        y: -200, // Start from chest position
                        x: randomOffsetX,
                        opacity: 1,
                        rotateX: Math.random() * 90 - 45, 
                        rotateY: Math.random() * 90 - 45,
                        rotateZ: randomRotation,
                        scale: 0.4,
                        filter: "brightness(1.5)"
                      }}
                      animate={{
                        y: 0,
                        x: 0,
                        opacity: 1,
                        rotateX: 0,
                        rotateY: 0,
                        rotateZ: 0,
                        scale: 1,
                        zIndex: 0,
                        filter: "brightness(1)"
                      }}
                      transition={{
                        type: "spring", 
                        stiffness: 60,
                        damping: 15,
                        mass: 1.2,
                        delay: sequentialDelay,
                        duration: 1.0
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {/* Use an anchor tag that covers the entire gold bar to ensure full clickability */}
                      <a 
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                        title={`Przejdź do strony partnera: ${partner.name}`}
                        aria-label={`Przejdź do strony partnera: ${partner.name}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={`w-full h-full flex flex-col relative`}>
                          {/* Using the SVG gold ingot as background */}
                          <div className="absolute inset-0 w-full h-full">
                            <img 
                              src="/western/ingot.svg" 
                              alt="Gold Ingot" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          
                          {/* Partner logo - uproszczona wersja */}
                          <div className="relative flex flex-col h-full z-10">
                            {/* Partner logo area positioned over the ingot */}
                            <div className="flex-grow flex items-center justify-center p-3 mt-2">
                              <div className="w-[90%] h-[90%] bg-gradient-to-br from-white to-gray-100 rounded-md overflow-hidden flex items-center justify-center border-2 border-amber-700" style={{boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 3px rgba(255,215,0,0.3)"}}>
                                <img
                                  src={partner.logo}
                                  alt={partner.name}
                                  className="w-[80%] h-[80%] object-contain"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Western-themed footer */}
      <div className="mt-24 mb-8 w-full text-center">
        <div className="inline-block px-8 py-3 border-b border-amber-400">
          <p className="text-amber-200 text-3xl font-bold tracking-wide" style={{ fontFamily: "var(--font-rye), fantasy, 'Copperplate Gothic', serif", textShadow: "0 1px 3px #00000055" }}>
            Każdy partner jest na wagę złota!
          </p>
        </div>
      </div>
    </div>
  );
}
