
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
  const chestRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const chestPositionRef = useRef({x: 0, y: 0});
  const [dustParticles, setDustParticles] = useState<Array<{id: number, left: string, size: string, duration: string}>>([]);

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
      
      // Show gold bars immediately when chest starts opening
      setTimeout(() => {
        // Show bars in grid layout from the start - no transitioning between layouts
        setBarsInGrid(true);
        setGoldenBarsVisible(true);
        createDustParticles(15);
        
        // Scroll down to see the gold bars
        setTimeout(() => {
          if (gridRef.current) {
            gridRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start'
            });
          }
        }, 400);
      }, 300);
    }
  };
  
  // Handle partner card click - redirect to partner website
  const handlePartnerClick = (partner: { id: number, url: string }) => {
    if (partner.url) {
      window.open(partner.url, "_blank", "noopener,noreferrer");
    }
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
          Nasi Partnerzy
        </h1>
        <p className="text-xl text-amber-100 max-w-2xl mx-auto mt-4">
          Kliknij w skrzynię, aby odkryć prawdziwe skarby Wtyczki!
        </p>
      </div>

      {/* Desert background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute bottom-0 w-full h-1/4 bg-amber-800" /> {/* Desert */}
        <div 
          className="absolute bottom-1/4 w-full h-1/6"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(146, 64, 14, 0.8) 100%)"
          }}
        /> {/* Desert fade */}
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
              {/* Chest base - more realistic treasure chest */}
              <div className="relative w-full h-full">
                {/* Enhanced chest shadow with better depth perception */}
                <motion.div 
                  className="absolute bottom-[-8%] left-1/2 w-[85%] h-[15%] bg-black rounded-[50%] blur-lg opacity-40"
                  style={{ transform: "translateX(-50%)" }}
                  animate={{ 
                    width: isChestOpen ? "95%" : "85%",
                    opacity: isChestOpen ? 0.5 : 0.4,
                    filter: isChestOpen ? "blur(16px)" : "blur(12px)"
                  }}
                  transition={{ duration: 0.8 }}
                />
              
                {/* Chest body - enhanced with more realistic wood texture and metal details */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] h-[65%]">
                  {/* Main chest body with enhanced wood texture */}
                  <div className="relative w-full h-full bg-gradient-to-b from-[#704214] via-[#8B572A] to-[#5D370F] rounded-xl border-4 border-[#3A2311] overflow-hidden shadow-2xl" 
                       style={{ boxShadow: "inset 0 5px 15px rgba(255,248,220,0.1), inset 0 -5px 15px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.4)" }}>
                    {/* Rich wood grain texture */}
                    <div 
                      className="absolute inset-0 mix-blend-overlay" 
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath fill='%23603813' fill-opacity='0.35' d='M0 0c20 8 40 12 60 13 20 0 40-3 60-9s40-14 60-18c4-1 8-2 12-2 2 0 4 0 6 1v215H0V0z'/%3E%3C/svg%3E\"), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23A67C52' fill-opacity='0.2' d='M0 0h100v10H0zm0 20h100v10H0zm0 20h100v10H0zm0 20h100v10H0zm0 20h100v10H0z'/%3E%3C/svg%3E\")",
                        backgroundSize: "cover, 100px 100px",
                        opacity: 0.9
                      }}
                    />
                    
                    {/* Realistic wooden planks with grain and nails */}
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col">
                      <div className="h-1/3 border-b-2 border-[#3A2311] relative">
                        {/* Nail details */}
                        <div className="absolute bottom-1 left-[10%] w-2 h-2 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 shadow-sm"></div>
                        <div className="absolute bottom-1 right-[10%] w-2 h-2 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 shadow-sm"></div>
                      </div>
                      <div className="h-1/3 border-b-2 border-[#3A2311] relative">
                        {/* Nail details */}
                        <div className="absolute bottom-1 left-[20%] w-2 h-2 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 shadow-sm"></div>
                        <div className="absolute bottom-1 right-[20%] w-2 h-2 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 shadow-sm"></div>
                      </div>
                      <div className="h-1/3 relative">
                        {/* Nail details */}
                        <div className="absolute bottom-3 left-[15%] w-2 h-2 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 shadow-sm"></div>
                        <div className="absolute bottom-3 right-[15%] w-2 h-2 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 shadow-sm"></div>
                      </div>
                    </div>
                    
                    {/* Metal corner reinforcements - more realistic */}
                    <div className="absolute top-0 left-0 w-[15%] h-[15%] border-r-2 border-b-2 border-[#3A2311] bg-gradient-to-br from-[#B8860B] to-[#8B6914] rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-[15%] h-[15%] border-l-2 border-b-2 border-[#3A2311] bg-gradient-to-bl from-[#B8860B] to-[#8B6914] rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-[15%] h-[15%] border-r-2 border-t-2 border-[#3A2311] bg-gradient-to-tr from-[#B8860B] to-[#8B6914] rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-[15%] h-[15%] border-l-2 border-t-2 border-[#3A2311] bg-gradient-to-tl from-[#B8860B] to-[#8B6914] rounded-br-lg"></div>
                    
                    {/* Metal band reinforcements with rivets */}
                    <div className="absolute top-[20%] left-0 w-full h-[5%] bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] opacity-80">
                      {/* Rivets */}
                      <div className="absolute top-1/2 left-[10%] w-3 h-3 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] border border-[#3A2311] transform -translate-y-1/2"></div>
                      <div className="absolute top-1/2 right-[10%] w-3 h-3 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] border border-[#3A2311] transform -translate-y-1/2"></div>
                    </div>
                    
                    <div className="absolute bottom-[20%] left-0 w-full h-[5%] bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] opacity-80">
                      {/* Rivets */}
                      <div className="absolute top-1/2 left-[10%] w-3 h-3 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] border border-[#3A2311] transform -translate-y-1/2"></div>
                      <div className="absolute top-1/2 right-[10%] w-3 h-3 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] border border-[#3A2311] transform -translate-y-1/2"></div>
                    </div>
                    
                    {/* Front lock with ornate key hole - more detailed and realistic */}
                    <motion.div 
                      className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-[#DAA520] to-[#8B6914] rounded-md border-2 border-[#3A2311] shadow-lg overflow-hidden"
                      style={{ boxShadow: "inset 0 2px 4px rgba(255,223,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)" }}
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
                      {/* Ornate border around keyhole */}
                      <div className="absolute inset-2 border-2 border-[#B8860B] rounded-sm"></div>
                      
                      {/* Key hole with more realistic details */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-b from-gray-900 to-gray-700 rounded-full shadow-inner" 
                           style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8), 0 1px 2px rgba(255,215,0,0.2)" }}>
                        {/* Key slot detail */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[40%] h-[70%] bg-black rounded-b-sm"
                             style={{ boxShadow: "inset 0 -2px 2px rgba(255,255,255,0.1)" }}></div>
                      </div>
                      
                      {/* Decorative rivets on lock */}
                      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] border border-[#3A2311]"></div>
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] border border-[#3A2311]"></div>
                      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] border border-[#3A2311]"></div>
                      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] border border-[#3A2311]"></div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Chest lid - enhanced with more realistic details */}
                <motion.div 
                  className="absolute top-[10%] left-1/2 transform -translate-x-1/2 w-[95%] h-[35%] origin-bottom"
                  animate={{ 
                    rotateX: isChestOpen ? -105 : 0,
                    y: isChestOpen ? -15 : 0
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
                  {/* Lid top - enhanced with curved top for more realistic treasure chest look */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#8B572A] via-[#704214] to-[#5D370F] rounded-t-xl border-4 border-[#3A2311] shadow-xl"
                       style={{ boxShadow: "inset 0 5px 15px rgba(255,248,220,0.1), 0 5px 15px rgba(0,0,0,0.3)" }}>
                    {/* Curved top effect with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-20 rounded-t-xl"></div>
                    
                    {/* Rich wood grain texture */}
                    <div 
                      className="absolute inset-0 mix-blend-overlay rounded-t-xl" 
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath fill='%23603813' fill-opacity='0.35' d='M0 0c20 8 40 12 60 13 20 0 40-3 60-9s40-14 60-18c4-1 8-2 12-2 2 0 4 0 6 1v215H0V0z'/%3E%3C/svg%3E\")",
                        backgroundSize: "cover",
                        opacity: 0.9
                      }}
                    />
                    
                    {/* Ornate metal reinforcement on lid top - more decorative */}
                    <div className="absolute top-[20%] left-0 w-full h-[10%]">
                      <div className="w-full h-full bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] opacity-80">
                        {/* Decorative pattern */}
                        <div className="absolute inset-0 flex justify-around items-center">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-6 h-2 bg-gradient-to-b from-[#FFD700] to-[#DAA520] rounded-full border border-[#3A2311] opacity-90"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Ornate metal centerpiece on lid - more detailed and realistic */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-gradient-to-b from-[#DAA520] to-[#B8860B] rounded-lg border-2 border-[#3A2311] overflow-hidden shadow-lg"
                         style={{ boxShadow: "inset 0 2px 4px rgba(255,223,0,0.4), 0 2px 4px rgba(0,0,0,0.3)" }}>
                      
                      {/* Ornate border */}
                      <div className="absolute inset-1 border border-[#B8860B] rounded"></div>
                      
                      {/* Gold inlay pattern - more intricate design */}
                      <div className="w-full h-full grid grid-cols-3 gap-[1px]">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="bg-gradient-to-br from-[#FFD700] to-[#DAA520] flex items-center justify-center">
                            <div className="w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] border-[0.5px] border-[#3A2311]"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Corner reinforcements */}
                    <div className="absolute top-0 left-0 w-[15%] h-[20%] bg-gradient-to-br from-[#B8860B] to-[#8B6914] rounded-tr-lg border-r border-b border-[#3A2311]"></div>
                    <div className="absolute top-0 right-0 w-[15%] h-[20%] bg-gradient-to-bl from-[#B8860B] to-[#8B6914] rounded-tl-lg border-l border-b border-[#3A2311]"></div>
                  </div>
                  
                  {/* Lid interior - enhanced with more detail */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#5D370F] to-[#3A2311] rounded-t-xl border-4 border-[#3A2311]"
                    style={{
                      transform: "rotateX(180deg) translateZ(-4px)",
                      backfaceVisibility: "hidden",
                      boxShadow: "inset 0 -2px 8px rgba(0,0,0,0.5)"
                    }}
                  >
                    {/* Interior wood grain - more refined texture */}
                    <div 
                      className="absolute inset-0 opacity-40" 
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath fill='%23805500' fill-opacity='0.3' d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/svg%3E\")",
                        backgroundSize: "30px 30px"
                      }}
                    />
                    
                    {/* Interior staining and aging effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20"></div>
                    <div className="absolute top-1/3 left-1/4 w-1/2 h-1/3 bg-black opacity-10 blur-md rounded-full"></div>
                  </div>
                </motion.div>
                
                {/* Enhanced chest shine and light effects */}
                <motion.div 
                  className="absolute top-1/3 left-1/4 w-1/2 h-1/6 bg-white opacity-0 rounded-full blur-lg"
                  animate={{ 
                    opacity: isChestOpen ? [0, 0.4, 0] : [0, 0.2, 0],
                    scale: isChestOpen ? [0.8, 1.3, 0.8] : [0.9, 1.1, 0.9],
                    width: isChestOpen ? ["50%", "60%", "50%"] : ["50%", "55%", "50%"]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Additional ambient light effects */}
                {isChestOpen && (
                  <>
                    <motion.div 
                      className="absolute top-0 left-1/3 w-1/3 h-1/4 bg-[#FFD700] opacity-0 rounded-full blur-xl"
                      animate={{ 
                        opacity: [0, 0.15, 0],
                        scale: [1, 1.2, 1] 
                      }}
                      transition={{ 
                        duration: 2.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5
                      }}
                    />
                    <motion.div 
                      className="absolute top-1/4 right-1/4 w-1/5 h-1/5 bg-[#FFD700] opacity-0 rounded-full blur-lg"
                      animate={{ 
                        opacity: [0, 0.2, 0],
                        scale: [1, 1.1, 1] 
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1
                      }}
                    />
                  </>
                )}
                
                {/* Enhanced click indicator if chest is not open */}
                {!isChestOpen && (
                  <motion.div
                    className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 text-amber-200 text-xl font-bold"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: [0.5, 1, 0.5], y: [-5, 0, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
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
                className={`${styles.gridContainer} w-full h-full mt-16`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {partners.map((partner, idx) => {
                  // Animation sequence delay - purely sequential
                  const sequentialDelay = 0.15 * idx + 0.2;
                  return (
                    <motion.div
                      key={partner.id}
                      className={`${styles.gridItem}`}
                      initial={{
                        y: -200,
                        x: -100 + (idx % 3) * 50,
                        opacity: 0,
                        rotateX: 60,
                        rotateY: 30,
                        rotateZ: 180 - (idx * 30) % 360,
                        scale: 0.1
                      }}
                      animate={{
                        y: 0,
                        x: 0,
                        opacity: 1,
                        rotateX: 0,
                        rotateY: 0,
                        rotateZ: 0,
                        scale: 1,
                        zIndex: 0
                      }}
                      transition={{
                        type: "spring", 
                        stiffness: 120,
                        damping: 18,
                        mass: 0.7,
                        delay: sequentialDelay,
                        duration: 0.5
                      }}
                      whileHover={{ 
                        scale: 1.08,
                        y: -5,
                        zIndex: 10,
                        rotateY: 5,
                        rotateX: -5,
                        boxShadow: "0 15px 30px rgba(255, 215, 0, 0.4), 0 5px 15px rgba(0,0,0,0.5)",
                        transition: { duration: 0.15 }
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
                        <div className={`w-full h-full ${styles.goldBar} flex flex-col relative`}>
                          {/* Gold bar beveled edges */}
                          <div className="absolute inset-0">
                            {/* Top beveled edge - brighter */}
                            <div className="absolute top-0 left-0 right-0 h-[8%] bg-gradient-to-b from-yellow-100 to-transparent opacity-90 rounded-t"></div>
                            
                            {/* Bottom beveled edge - darker */}
                            <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-gradient-to-t from-amber-900 to-transparent opacity-70 rounded-b"></div>
                            
                            {/* Side bevels for more 3D look */}
                            <div className="absolute top-[10%] bottom-[10%] left-0 w-[4%] bg-gradient-to-r from-amber-900 to-transparent opacity-50"></div>
                            <div className="absolute top-[10%] bottom-[10%] right-0 w-[4%] bg-gradient-to-l from-amber-900 to-transparent opacity-50"></div>
                          </div>
                          
                          {/* Gold bar texture - more realistic gold ingot texture */}
                          <div 
                            className="absolute inset-0 opacity-40" 
                            style={{
                              backgroundImage: "linear-gradient(135deg, transparent 75%, rgba(255, 223, 0, 0.8) 75%, transparent 76%, transparent 83%, rgba(255, 223, 0, 0.8) 83%, transparent 84%), linear-gradient(45deg, transparent 75%, rgba(255, 223, 0, 0.8) 75%, transparent 76%, transparent 83%, rgba(255, 223, 0, 0.8) 83%, transparent 84%)",
                              backgroundSize: "30px 30px",
                              backgroundPosition: "0 0, 15px 15px"
                            }}
                          />
                          
                          {/* Partner logo and info */}
                          <div className="relative flex flex-col h-full z-10">
                            {/* Gold bar hallmark/stamp look */}
                            <div className="absolute top-2 left-2 text-xs font-bold text-amber-900 opacity-80" style={{textShadow: "0px 1px 1px rgba(255, 215, 0, 0.5)"}}>999.9</div>
                            <div className="absolute top-2 right-2 text-xs font-bold text-amber-900 opacity-80" style={{textShadow: "0px 1px 1px rgba(255, 215, 0, 0.5)"}}>24K</div>
                            <div className="absolute bottom-[35px] right-2 text-xs font-bold text-amber-900 opacity-80" style={{textShadow: "0px 1px 1px rgba(255, 215, 0, 0.5)"}}>WTYCZKA</div>
                            
                            {/* Partner logo area with embossed effect */}
                            <div className="flex-grow flex items-center justify-center p-3">
                              <div className="w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-md overflow-hidden flex items-center justify-center border-2 border-amber-700" style={{boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 3px rgba(255,215,0,0.3)"}}>
                                <img
                                  src={partner.logo}
                                  alt={partner.name}
                                  className="w-[80%] h-[80%] object-contain"
                                />
                              </div>
                            </div>
                            
                            {/* Partner name with metallic effect */}
                            <div className="text-center p-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-yellow-100 font-bold rounded-b" style={{textShadow: "0px 1px 2px rgba(0,0,0,0.5)"}}>
                              {partner.name}
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
        <div className="inline-block px-8 py-3 border-t-2 border-b-2 border-amber-500">
          <p className="text-amber-200 text-3xl font-bold" style={{ fontFamily: "fantasy, 'Copperplate Gothic', serif", textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}>
            Razem tworzymy prawdziwą kopalnię możliwości!
          </p>
        </div>
        {isChestOpen && (
          <motion.p 
            className="mt-5 text-amber-300 text-2xl italic font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
          >
            Każdy partner jest na wagę złota!
          </motion.p>
        )}
      </div>
    </div>
  );
}
