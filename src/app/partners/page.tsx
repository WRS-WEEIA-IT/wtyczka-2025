
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from './partners.module.css';
import './treasure-effects.css'; // Import our new treasure effects
import { 
  getPartnersByCategories, 
  Partner as PartnerType,
  PARTNER_CATEGORIES, 
  PartnerCategory, 
  CATEGORY_DISPLAY_NAMES 
} from '../../usecases/partners';

// Different styling for different categories
const CATEGORY_STYLES = {
  partner: {
    barFilter: "brightness(1) saturate(1)",
    logoBackground: "from-white to-gray-100",
    borderColor: "border-amber-700",
    headingColor: "text-amber-300"
  },
  patronat: {
    barFilter: "brightness(1.1) saturate(1.1) hue-rotate(10deg)",
    logoBackground: "from-amber-50 to-amber-100",
    borderColor: "border-amber-800",
    headingColor: "text-amber-200"
  },
  kolo: {
    barFilter: "brightness(1) saturate(1)", // Taki sam filtr jak dla partnerów
    logoBackground: "from-white to-gray-100", // Taki sam background jak dla partnerów
    borderColor: "border-amber-700", 
    headingColor: "text-amber-300"
  }
};

export default function PartnersPage() {
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [goldenBarsVisible, setGoldenBarsVisible] = useState(false);
  const [chestVisible, setChestVisible] = useState(true);
  const [barsInGrid, setBarsInGrid] = useState(false);
  const [partnersByCategory, setPartnersByCategory] = useState<Record<PartnerCategory, PartnerType[]>>({
    partner: [],
    patronat: [],
    kolo: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    
    // Auto-open chest after 0.65 seconds
    const timer = setTimeout(() => {
      if (!isChestOpen && !loading) {
        handleChestClick();
      }
    }, 650);
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Add window resize event handler to trigger re-render for responsive grid
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fetch partners from the database
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        console.log('Fetching partners data by categories from client side...');
        
        const categorizedPartnersData = await getPartnersByCategories();
        
        console.log('Partners data by category received in client:', categorizedPartnersData);
        
        // Check if we have any partners in any category
        const totalPartnersCount = PARTNER_CATEGORIES.reduce(
          (count, category) => count + (categorizedPartnersData[category]?.length || 0), 
          0
        );
        
        if (totalPartnersCount > 0) {
          setPartnersByCategory(categorizedPartnersData);
          setError(null);
        } else {
          // If no partners were found, set an appropriate message
          console.warn('No partners data received from API');
          setError('Nie znaleziono partnerów w bazie danych');
        }
      } catch (err: any) {
        console.error('Error fetching partners:', err);
        // Show more detailed error to help with debugging
        setError(`Nie udało się pobrać danych partnerów: ${err.message || 'Nieznany błąd'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPartners();
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
  const handlePartnerClick = (partner: PartnerType) => {
    if (partner.website) {
      window.open(partner.website, "_blank", "noopener,noreferrer");
    }
  };
  
  // Get total count of all partners
  const getTotalPartnersCount = (): number => {
    return PARTNER_CATEGORIES.reduce(
      (count, category) => count + (partnersByCategory[category]?.length || 0),
      0
    );
  };

  // Find any categories with partners
  const categoriesWithPartners = PARTNER_CATEGORIES.filter(
    category => partnersByCategory[category] && partnersByCategory[category].length > 0
  );

  // Determine if we have any partners to display
  const hasAnyPartners = categoriesWithPartners.length > 0;

  return (
    <div ref={containerRef} className={`min-h-screen flex flex-col items-center justify-start py-10 px-4 overflow-x-hidden relative`}>
      {/* Add blurred background overlay similar to navbar */}
      <div className={styles.pageOverlay}></div>
      
      {/* Western-themed header */}
      <div className="w-full max-w-5xl text-center mb-8">
        <h1 className={`text-5xl md:text-6xl font-bold text-yellow-300 mb-3 ${styles.goldRushTitle}`}>
          Nasi Partnerzy
        </h1>
        
        {/* Loading and error states */}
        {loading && (
          <p className="text-amber-200 mt-4">
            Ładowanie partnerów...
          </p>
        )}
        
        {error && (
          <p className="text-red-400 mt-4">
            {error}
          </p>
        )}
        
        {!loading && Object.values(partnersByCategory).every(arr => arr.length === 0) && !error && (
          <p className="text-amber-200 mt-4">
            Nie znaleziono żadnych partnerów.
          </p>
        )}
      </div>

      {/* Main treasure chest container */}
      <div className="relative z-1 w-full max-w-md mx-auto mt-8">
        <AnimatePresence>
          {chestVisible && Object.values(partnersByCategory).some(arr => arr.length > 0) && !loading && (
            <motion.div 
              ref={chestRef}
              className={`w-full aspect-square max-w-md mx-auto ${styles.treasureChest}`}
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
                <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
                    {/* Closed chest SVG - visible when chest is closed */}
                    <motion.img 
                      src="/western/chest-closed.svg"
                      alt="Closed Treasure Chest"
                      className="w-full h-full object-contain"
                      style={{ 
                        position: 'absolute',
                        zIndex: isChestOpen ? 0 : 1
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
                        zIndex: isChestOpen ? 1 : 0,
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
                      className="absolute inset-0 bg-yellow-100 rounded-full"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gold bars with partner logos that spill out */}
        <div className={`relative w-full min-h-[500px] mt-8 ${styles.goldBarContainer}`} style={{ zIndex: 10 }}>
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
            {goldenBarsVisible && hasAnyPartners && (
              <motion.div
                ref={gridRef} 
                className="w-full mt-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {/* Display each category with its partners */}
                {PARTNER_CATEGORIES.map((category) => {
                  const partners = partnersByCategory[category] || [];
                  
                  // Skip empty categories
                  if (partners.length === 0) return null;
                  
                  // Get the styling for this category
                  const categoryStyle = CATEGORY_STYLES[category];
                  
                  return (
                    <motion.div 
                      key={category} 
                      className="mb-12 flex flex-col items-center" /* Zmniejszony margines między kategoriami i wycentrowanie zawartości */
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {/* Category Header */}
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 text-center" /* Zmniejszony margines pod nagłówkiem */
                      >
                        <h2 className={`text-4xl font-bold ${categoryStyle.headingColor} mb-3`}>
                          {CATEGORY_DISPLAY_NAMES[category]}
                        </h2>
                        <div className="h-1 w-48 bg-amber-600 mx-auto rounded-full"></div>
                      </motion.div>
                      
                      {/* Partners Grid for this category */}
                      <div className="w-full flex justify-center">
                        <motion.div 
                          className={`h-full mt-4 ${styles.gridItemsContainer}`}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${Math.min(partners.length, 3)}, minmax(220px, 280px))`,
                            gap: '30px',
                            width: '100%',
                            maxWidth: partners.length === 1 ? '320px' : partners.length === 2 ? '640px' : '960px',
                            margin: '0 auto',
                            padding: '20px',
                            position: 'relative',
                            minHeight: '400px',
                            justifyContent: 'center'
                          }}
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
                              key={partner.id || `${category}-${idx}`}
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
                                href={partner.website || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full h-full"
                                title={`Przejdź do strony ${category === 'partner' ? 'partnera' : category === 'patronat' ? 'patrona' : 'koła naukowego'}: ${partner.name}`}
                                aria-label={`Przejdź do strony ${category === 'partner' ? 'partnera' : category === 'patronat' ? 'patrona' : 'koła naukowego'}: ${partner.name}`}
                                style={{ cursor: partner.website ? 'pointer' : 'default' }}
                              >
                                <div className={`w-full h-full flex flex-col relative`}>
                                  {/* Using the SVG gold ingot as background */}
                                  <div className="absolute inset-0 w-full h-full">
                                    <img 
                                      src="/western/ingot.svg" 
                                      alt="Gold Ingot" 
                                      className="w-full h-full object-contain"
                                      style={{ filter: categoryStyle.barFilter }}
                                    />
                                  </div>
                                  
                                  {/* Partner logo - uproszczona wersja */}
                                  <div className="relative flex flex-col h-full z-10">
                                    {/* Partner logo area positioned over the ingot */}
                                    <div className="flex-grow flex items-center justify-center p-3 mt-2">
                                      <div className={`w-[90%] h-[90%] bg-gradient-to-br ${categoryStyle.logoBackground} rounded-md overflow-hidden flex items-center justify-center border-2 ${categoryStyle.borderColor}`} style={{boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 3px rgba(255,215,0,0.3)"}}>
                                        {partner.logo ? (
                                          <img
                                            src={partner.logo}
                                            alt={partner.name}
                                            className="max-w-[85%] max-h-[85%] w-auto h-auto object-contain"
                                          />
                                        ) : (
                                          <div className="text-gray-700 text-center text-sm p-2 font-medium">
                                            {partner.name}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {/* No partners message - only shown if all categories are empty */}
                {!hasAnyPartners && (
                  <div className="text-center text-amber-200 py-4">
                    <p>Niestety, nie mamy jeszcze żadnych partnerów.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
     {/* Western-themed footer */}
      {goldenBarsVisible && (
        <div className="mt-16 mb-8 w-full text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-block px-8 py-3 border-b border-amber-400"
          >
            <p className="text-amber-200 text-3xl font-bold tracking-wide" style={{ fontFamily: "var(--font-rye), fantasy, 'Copperplate Gothic', serif", textShadow: "0 1px 3px #00000055" }}>
              {hasAnyPartners 
                ? 'Nasi partnerzy są na wagę złota - dziękujemy za wsparcie!'
                : 'Odkryj naszych wspaniałych partnerów!'}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
