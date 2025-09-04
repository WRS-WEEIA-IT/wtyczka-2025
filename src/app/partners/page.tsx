
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from './partners.module.css';

// Sample partner data - replace with actual partners later
const partners = [
  { 
    id: 1, 
    name: "Partner 1", 
    logo: "/logo_czarne_tło.jpg",
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
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const chestRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [dustParticles, setDustParticles] = useState<Array<{id: number, left: string, size: string, duration: string}>>([]);

  // Create dust particles effect
  useEffect(() => {
    // Create initial dust particles
    createDustParticles();
    
    // Add more dust particles periodically
    const intervalId = setInterval(() => {
      createDustParticles(2); // Add 2 particles every interval
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to create random dust particles
  const createDustParticles = (count = 5) => {
    const newParticles = [...Array(count)].map((_, i) => {
      return {
        id: Date.now() + i,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 4 + 2}px`,
        duration: `${Math.random() * 5 + 3}s`
      };
    });
    
    setDustParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation completes
    setTimeout(() => {
      setDustParticles(prev => 
        prev.filter(p => !newParticles.some(np => np.id === p.id))
      );
    }, 8000);
  };

  // Handle chest click animation
  const handleChestClick = () => {
    if (!isChestOpen) {
      setIsChestOpen(true);
      
      // Create extra dust for chest opening
      createDustParticles(10);
      
      // After chest opens, start the gold bar animation with a delay
      setTimeout(() => {
        setGoldenBarsVisible(true);
        createDustParticles(15);
        
        // Fade out the chest after gold bars are displayed
        setTimeout(() => {
          setChestVisible(false);
          
          // After chest disappears, organize bars into grid
          setTimeout(() => {
            setBarsInGrid(true);
          }, 1000);
        }, 3000);
      }, 1000);
    }
  };
  
  // Handle partner card click
  const handlePartnerClick = (partnerId: number) => {
    setSelectedPartner(partnerId === selectedPartner ? null : partnerId);
  };

  return (
    <div ref={containerRef} className={`min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-amber-900 to-amber-700 py-10 px-4 overflow-x-hidden ${styles.westernBackground}`}>
      {/* Dust particles */}
      {dustParticles.map(particle => (
        <div
          key={particle.id}
          className={styles.dustParticle}
          style={{
            left: particle.left,
            bottom: '10%',
            width: particle.size,
            height: particle.size,
            animation: `${styles.floatUp} ${particle.duration} ease-out forwards`
          }}
        />
      ))}
      
      {/* Western-themed header */}
      <div className="w-full max-w-5xl text-center mb-8">
        <h1 className={`text-5xl md:text-6xl font-bold text-yellow-300 mb-3 ${styles.goldRushTitle}`}>
          GORĄCZKA ZŁOTA
        </h1>
        <h2 className={`text-3xl md:text-4xl text-amber-200 mb-4 ${styles.goldRushTitle}`} style={{textShadow: "2px 2px 4px rgba(0,0,0,0.5)"}}>
          Nasi Partnerzy
        </h2>
        <p className="text-xl text-amber-100 max-w-2xl mx-auto mt-4">
          Kliknij w skrzynię, aby odkryć prawdziwe skarby Wtyczki!
        </p>
      </div>

      {/* Desert and mountains background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute bottom-0 w-full h-1/4 bg-amber-800" /> {/* Desert */}
        <div 
          className="absolute bottom-1/4 w-full h-1/6"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(146, 64, 14, 0.8) 100%)"
          }}
        /> {/* Desert fade */}
        <div 
          className="absolute bottom-1/3 left-1/4 w-1/5 h-1/5"
          style={{
            background: "linear-gradient(135deg, #8B5A2B 0%, #634323 100%)",
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            transform: "skewX(15deg)"
          }}
        /> {/* Left mountain */}
        <div 
          className="absolute bottom-1/3 right-1/4 w-1/5 h-1/4"
          style={{
            background: "linear-gradient(135deg, #8B5A2B 0%, #634323 100%)",
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            transform: "skewX(-15deg)"
          }}
        /> {/* Right mountain */}
      </div>

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
                scale: 1, 
                rotate: isChestOpen ? [0, -2, 2, 0] : 0,
                y: isChestOpen ? [0, -5, 5, 0] : 0,
                opacity: 1
              }}
              exit={{ 
                opacity: 0,
                y: 50,
                scale: 0.8,
                transition: { duration: 1.5 }
              }}
              transition={{ 
                scale: { duration: 0.5, ease: "easeOut" },
                rotate: { duration: 0.3, ease: "easeInOut", repeat: isChestOpen ? 2 : 0 },
                y: { duration: 0.2, ease: "easeInOut", repeat: isChestOpen ? 3 : 0 }
              }}
              whileHover={{ 
                scale: isChestOpen ? 1 : 1.02,
                transition: { duration: 0.3 }
              }}
            >
              {/* Chest base */}
              <div className="relative w-full h-full">
                {/* Chest shadow */}
                <motion.div 
                  className="absolute bottom-[-5%] left-1/2 w-[80%] h-[10%] bg-black rounded-full blur-md opacity-50"
                  style={{ transform: "translateX(-50%)" }}
                  animate={{ 
                    width: isChestOpen ? "90%" : "80%",
                    opacity: isChestOpen ? 0.6 : 0.5
                  }}
                />
              
                {/* Chest body */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] h-[60%]">
                  <div className="relative w-full h-full bg-gradient-to-b from-amber-800 to-amber-950 rounded-xl border-4 border-yellow-950 overflow-hidden shadow-xl">
                    {/* Wood texture */}
                    <div 
                      className="absolute inset-0" 
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23B85C00' fill-opacity='0.2' d='M0 0h100v10H0zm0 20h100v10H0zm0 20h100v10H0zm0 20h100v10H0zm0 20h100v10H0z'/%3E%3C/svg%3E\")",
                        opacity: 0.6
                      }}
                    />
                    
                    {/* Chest details - wooden planks */}
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col">
                      <div className="h-1/3 border-b-2 border-yellow-950"></div>
                      <div className="h-1/3 border-b-2 border-yellow-950"></div>
                      <div className="h-1/3"></div>
                    </div>
                    
                    {/* Metal decorations - with gold accents */}
                    <div className="absolute top-1/4 left-4 w-4 h-16 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-full border border-yellow-950 shadow-inner"></div>
                    <div className="absolute top-1/4 right-4 w-4 h-16 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-full border border-yellow-950 shadow-inner"></div>
                    
                    {/* Front lock with key hole */}
                    <motion.div 
                      className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-amber-500 to-amber-700 rounded-md border-2 border-yellow-950 shadow-lg"
                      animate={{ 
                        rotateY: isChestOpen ? [0, 45, 0, -45, 0] : 0,
                        scale: isChestOpen ? [1, 1.1, 0.9, 1] : 1
                      }}
                      transition={{
                        duration: 0.8,
                        times: [0, 0.2, 0.5, 0.8, 1],
                        ease: "easeInOut"
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full shadow-inner">
                        {/* Key hole detail */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[40%] h-[70%] bg-black rounded-b-sm"></div>
                      </div>
                    </motion.div>

                    {/* Gold coins peeking from bottom when chest is open */}
                    <AnimatePresence>
                      {isChestOpen && (
                        <motion.div
                          className="absolute bottom-0 left-0 w-full"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <div className="flex justify-center">
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full border border-amber-600 shadow-md mx-[-5px]"
                                initial={{ y: 20 }}
                                animate={{ y: i % 2 === 0 ? -2 : -5 }}
                                transition={{
                                  delay: 0.6 + (i * 0.05),
                                  duration: 0.3,
                                  ease: "easeOut"
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Chest lid - animated */}
                <motion.div 
                  className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-[95%] h-[30%] origin-bottom"
                  animate={{ 
                    rotateX: isChestOpen ? -100 : 0,
                    y: isChestOpen ? -10 : 0
                  }}
                  transition={{ 
                    duration: 1.2, 
                    ease: isChestOpen ? [0.33, 1, 0.68, 1] : [0.33, 1, 0.68, 1]  
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    zIndex: isChestOpen ? 0 : 1
                  }}
                >
                  {/* Lid top */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-xl border-4 border-yellow-950 shadow-xl">
                    {/* Wood texture */}
                    <div 
                      className="absolute inset-0" 
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23B85C00' fill-opacity='0.2' d='M0 0h100v20H0z'/%3E%3C/svg%3E\")",
                        opacity: 0.6
                      }}
                    />
                    
                    {/* Lid details */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      <div className="h-1/2 border-b-2 border-yellow-950"></div>
                    </div>
                    
                    {/* Decorative metal band */}
                    <div className="absolute top-1/2 left-0 w-full h-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 shadow-sm"></div>
                    
                    {/* Metal decorations on lid with gold inlays */}
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-b from-amber-600 to-amber-800 rounded-md border-2 border-yellow-950 overflow-hidden shadow-md">
                      {/* Gold inlay pattern */}
                      <div className="w-full h-full grid grid-cols-3 gap-px">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-80" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Lid interior (showing when opened) */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-950 rounded-t-xl border-4 border-yellow-950"
                    style={{
                      transform: "rotateX(180deg) translateZ(-4px)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Interior wood grain */}
                    <div 
                      className="absolute inset-0 opacity-30" 
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath fill='%23805500' fill-opacity='0.3' d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/svg%3E\")"
                      }}
                    />
                  </div>
                </motion.div>
                
                {/* Chest shine effects */}
                <motion.div 
                  className="absolute top-1/4 left-1/4 w-1/2 h-1/6 bg-white opacity-0 rounded-full blur-md"
                  animate={{ 
                    opacity: isChestOpen ? [0, 0.3, 0] : [0, 0.15, 0],
                    scale: isChestOpen ? [0.8, 1.2, 0.8] : [0.9, 1.1, 0.9]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Click indicator if chest is not open */}
                {!isChestOpen && (
                  <motion.div
                    className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 text-amber-200 text-xl"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: [0.5, 1, 0.5], y: [-5, 0, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ↓ Kliknij aby otworzyć ↓
                  </motion.div>
                )}
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
                className={`${barsInGrid ? styles.gridContainer : 'relative'} w-full h-full mt-16`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {partners.map((partner, idx) => {
                  // Grid layout position calculation
                  const gridRow = Math.floor(idx / 3);
                  const gridCol = idx % 3;
                  
                  // Random variations for non-grid layout
                  const row = Math.floor(idx / 4); 
                  const col = idx % 4;
                  const isEvenRow = row % 2 === 0;
                  const xOffset = isEvenRow ? 0 : 40;
                  const colPosition = isEvenRow ? col : (3 - col);
                  
                  // Random variations
                  const randomRotateZ = Math.random() * 40 - 20;
                  const randomScale = 0.9 + (Math.random() * 0.2);
                  const randomDelay = Math.random() * 0.3;
                  
                  const isSelected = selectedPartner === partner.id;
                  
                  return (
                    <motion.div
                      key={partner.id}
                      className={`${barsInGrid ? styles.gridItem : 'absolute left-1/2'}`}
                      initial={{ 
                        y: -150, 
                        x: 0,
                        opacity: 0,
                        rotateX: 60,
                        rotateY: 30,
                        rotateZ: randomRotateZ * 3,
                        scale: 0
                      }}
                      animate={barsInGrid ? {
                        opacity: 1,
                        rotateX: 0,
                        rotateY: 0,
                        rotateZ: 0,
                        scale: isSelected ? 1.05 : 1,
                        zIndex: isSelected ? 10 : 0
                      } : { 
                        y: 20 + (row * 60) + (Math.random() * 20),
                        x: ((colPosition - 1.5) * 130) + xOffset + (Math.random() * 20 - 10),
                        opacity: 1,
                        rotateX: Math.random() * 10 - 5,
                        rotateY: Math.random() * 10 - 5,
                        rotateZ: randomRotateZ,
                        scale: randomScale,
                        zIndex: 0
                      }}
                      transition={ barsInGrid ? { 
                        type: "spring",
                        damping: 15,
                        stiffness: 100,
                        duration: 0.8
                      } : { 
                        type: "spring",
                        stiffness: 70,
                        damping: 15,
                        mass: 2,
                        delay: (0.15 * idx) + 1 + randomDelay
                      }}
                      onClick={() => handlePartnerClick(partner.id)}
                      whileHover={{ 
                        scale: 1.05,
                        zIndex: 10, 
                        transition: { duration: 0.3 }
                      }}
                    >
                      <motion.div 
                        className="w-full h-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-lg border-2 border-yellow-600 shadow-lg flex flex-col relative"
                        style={{ 
                          boxShadow: isSelected ? 
                            "0 0 30px rgba(255, 215, 0, 0.8), inset 0 2px 6px rgba(255,255,255,0.8)" :
                            "0 4px 12px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,0.6)" 
                        }}
                      >
                        {/* Gold bar texture */}
                        <div 
                          className="absolute inset-0 opacity-30" 
                          style={{
                            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
                          }}
                        />
                        
                        {/* Gold bar shine effect */}
                        <motion.div 
                          className={styles.goldBarShine}
                          initial={{ left: "-100%" }}
                          animate={{ left: "200%" }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 3,
                            delay: idx * 0.2
                          }}
                        />
                        
                        {/* Partner logo and info */}
                        <div className="flex flex-col h-full">
                          {/* Partner logo area */}
                          <div className="flex-grow flex items-center justify-center p-3">
                            <div className="w-full h-full bg-white rounded-md overflow-hidden flex items-center justify-center shadow-inner">
                              <img
                                src={partner.logo}
                                alt={partner.name}
                                className="w-[80%] h-[80%] object-contain"
                              />
                            </div>
                          </div>
                          
                          {/* Partner name */}
                          <div className="text-center p-2 bg-amber-600 text-white font-bold rounded-b-md">
                            {partner.name}
                          </div>
                        </div>
                        
                        {/* Partner details - shows when selected */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div 
                              className="absolute inset-0 bg-amber-800 bg-opacity-95 rounded-lg p-4 flex flex-col"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <h3 className="text-lg font-bold text-amber-100 mb-2">{partner.name}</h3>
                              <p className="text-amber-100 text-sm mb-3">{partner.description}</p>
                              <a 
                                href={partner.url} 
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="mt-auto bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-500 text-center"
                              >
                                Odwiedź stronę
                              </a>
                              <button 
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPartner(null);
                                }}
                              >
                                ✕
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
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
        <div className="inline-block px-8 py-2 border-t-2 border-b-2 border-amber-500">
          <p className="text-amber-200 text-xl font-bold" style={{ fontFamily: "fantasy, 'Copperplate Gothic', serif" }}>
            Razem tworzymy prawdziwą kopalnię możliwości!
          </p>
        </div>
        {isChestOpen && (
          <motion.p 
            className="mt-4 text-amber-300 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            Każdy partner jest na wagę złota!
          </motion.p>
        )}
      </div>
    </div>
  );
}
