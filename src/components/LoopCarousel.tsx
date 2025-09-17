import React from "react";

type CarouselProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
};

export const LoopCarousel = <T,>({ items, renderItem }: CarouselProps<T>) => {
  const [current, setCurrent] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!items || items.length === 0) return null;

  // ile kontaktów pokazać naraz
  const visibleCount = isMobile ? 1 : 2;

  // wylicz indeksy kontaktów do pokazania
  const visibleItems = Array.from({ length: visibleCount }, (_, i) => {
    return items[(current + i) % items.length];
  });

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  // Swipe obsługa na mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const delta = touchStartX.current - touchEndX.current;
      if (Math.abs(delta) > 50) {
        if (delta > 0) {
          handleNext(); // swipe left
        } else {
          handlePrev(); // swipe right
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Desktop: strzałki przy kartach, Mobile: strzałki przy kropkach */}
      {!isMobile ? (
        <div className="w-full flex justify-center items-center gap-4">
          <button
            aria-label="Poprzedni"
            onClick={handlePrev}
            className="p-2 rounded-full bg-gray-700 hover:bg-amber-400 text-white hover:text-black transition"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className={`flex justify-center gap-6 flex-row`}>
            {visibleItems.map((item, idx) => (
              <div
                key={idx}
                className="w-[90vw] max-w-[340px] min-w-[220px] mx-auto"
                style={{ flex: "0 0 auto" }}
              >
                {renderItem(item, (current + idx) % items.length)}
              </div>
            ))}
          </div>
          <button
            aria-label="Następny"
            onClick={handleNext}
            className="p-2 rounded-full bg-gray-700 hover:bg-amber-400 text-white hover:text-black transition"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div
            className="flex justify-center items-center gap-6 flex-col w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {visibleItems.map((item, idx) => (
              <div
                key={idx}
                className="w-[90vw] max-w-[340px] min-w-[220px] mx-auto"
                style={{ flex: "0 0 auto" }}
              >
                {renderItem(item, (current + idx) % items.length)}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2 justify-center w-full">
              <button
                aria-label="Poprzedni"
                onClick={handlePrev}
                className="p-2 rounded-full bg-gray-700 hover:bg-amber-400 text-white hover:text-black transition"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {items.map((_item: T, idx: number) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === current ? "bg-amber-400" : "bg-gray-400"}`}
                />
              ))}
              <button
                aria-label="Następny"
                onClick={handleNext}
                className="p-2 rounded-full bg-gray-700 hover:bg-amber-400 text-white hover:text-black transition"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {!isMobile && (
        <div className="flex items-center gap-2 mt-4">
          {items.map((_item: T, idx: number) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${idx === current ? "bg-amber-400" : "bg-gray-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
