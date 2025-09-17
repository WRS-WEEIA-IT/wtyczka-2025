"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, Suspense } from "react";
import {
  Calendar,
  Facebook,
} from "lucide-react";
import Image from "next/image";
import {
  FacebookPost,
  getFacebookPostsInQuantity,
} from "@/usecases/facebookPosts";
import {
  FacebookCard,
  FacebookCardSkeleton,
} from "@/components/ui/FacebookCard";
import Link from "next/link";

export default function HomePage() {
  const { t } = useLanguage();
  const [daysUntilEvent, setDaysUntilEvent] = useState(0);
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([]);

  useEffect(() => {
    // Przykładowa data wydarzenia - można zmienić
    const eventDate = new Date("2025-10-23");

    const calculateDaysUntilEvent = () => {
      const today = new Date();
      const timeDiff = eventDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysUntilEvent(daysDiff > 0 ? daysDiff : 0);
    };

    const fetchFacebookPosts = async () => {
      try {
        const posts = await getFacebookPostsInQuantity(2);
        setFacebookPosts(posts);
      } catch (error) {
        console.error("Error fetching Facebook posts:", error);
      }
    };

    calculateDaysUntilEvent();
    fetchFacebookPosts();
    const interval = setInterval(calculateDaysUntilEvent, 86400000); // Update daily

    return () => clearInterval(interval);
  }, []);

  return (
  <div className="min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden p-4">
        <div className="relative max-w-4xl mx-auto px-4 py-10 text-center flex flex-col justify-center items-center home-hero-section">
          <div className="flex flex-col items-center">
            <Image
              src="/logo2.svg"
              alt="Logo wtyczka"
              width={1200}
              height={440}
              className="m-0 p-0 leading-none drop-shadow-2xl"
              style={{ display: "block", marginTop: "26px", marginBottom: "-8px" }}
            />
            <p
              className="text-2xl md:text-3xl m-0 p-0 text-[#E7A801] font-extrabold tracking-widest uppercase drop-shadow-lg western-title"
              style={{ marginTop: "-2px" }}
            >
              {t.home.subtitle}
            </p>
          </div>


          <div className="flex flex-col sm:flex-row mt-10 gap-6 sm:gap-3 w-full justify-center items-center mb-2" style={{overflowX: 'visible'}}>
            <span className="relative group flex-1 min-w-[180px] max-w-xs w-full">
              <span className="zapisz-glow" aria-hidden="true"></span>
              <Link
                href="/registration"
                className="homepage-btn zapisz-btn western-btn-roboto flex-1 min-w-[180px] max-w-xs w-full rounded-full py-4 px-8 flex items-center justify-center text-lg font-bold text-white bg-[#E7A801] hover:bg-yellow-400 transition-all duration-200 border-none shadow-none relative overflow-hidden"
                style={{ fontFamily: 'Roboto Slab, Times New Roman, serif' }}
              >
                ZAPISZ SIĘ
              </Link>
            </span>

            <Link
              href="/faq"
              className="homepage-btn western-btn-roboto flex-1 min-w-[180px] max-w-xs w-full rounded-full py-4 px-8 flex items-center justify-center text-lg font-bold text-[#E7A801] bg-[#232323] hover:bg-[#18181b] transition-all duration-200 border-none shadow-none relative overflow-hidden mb-0"
              style={{ fontFamily: 'Roboto Slab, Times New Roman, serif' }}
            >
              DOWIEDZ SIĘ WIĘCEJ
            </Link>
          </div>

          <div className="w-full flex justify-center mt-5 mb-2">
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wtyczka+2025+-+Wyjazd+Integracyjny&dates=20251023T120000Z/20251023T130000Z&details=Wyjazd+Integracyjny+Wydziału+EEIA+PŁ"
              target="_blank"
              rel="noopener noreferrer"
              className="homepage-btn western-btn-roboto min-w-[180px] max-w-xs w-full rounded-full py-4 px-8 flex flex-row items-center justify-center gap-3 text-lg font-bold text-[#E7A801] bg-[#232323] hover:bg-[#18181b] transition-all duration-200 border-none shadow-none relative overflow-hidden"
              style={{ fontFamily: 'Roboto Slab, Times New Roman, serif' }}
              title="Dodaj wydarzenie do kalendarza Google"
            >
              <Calendar className="h-7 w-7 text-[#E7A801]" />
              <span className="uppercase tracking-wide" style={{ fontFamily: 'inherit' }}>
                POZOSTAŁO <span style={{ fontFamily: 'monospace' }}>{daysUntilEvent}</span> DNI
              </span>
            </a>
          </div>

          <div className="star-divider mt-8 mb-2">
            <span className="text-[#E7A801] text-3xl select-none">★ ★ ★</span>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-8 px-4 flex-1">
        <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex flex-col flex-1 home-content-container max-w-6xl mx-auto">
          <div className="text-center mb-10 pt-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#E7A801] uppercase tracking-widest drop-shadow-lg western-title">
              {t.home.latestNews}
            </h2>
            <div className="star-divider">
              <span className="text-[#E7A801] text-2xl select-none">★ ★</span>
            </div>
            <div className="flex justify-center">
              <span className="inline-block text-lg text-gray-300 tracking-widest uppercase border-b-2 border-dotted border-[#E7A801] px-4 pb-1">Wiadomości z saloonu</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6 w-full justify-center max-w-7xl mx-auto">
            <Suspense fallback={<FacebookCardSkeleton />}>
              {facebookPosts.map((post) => (
                <FacebookCard {...post} className="w-full max-w-2xl cursor-pointer justify-self-center shadow-xl hover:shadow-2xl transition-shadow" key={post.id} />
              ))}
            </Suspense>
          </div>

          <div className="text-center mt-10 pb-10">
            <Link
              href="/news"
              className="inline-flex items-center space-x-2 bg-[#E7A801] text-black px-6 py-3 rounded-xl font-bold text-base uppercase tracking-widest hover:bg-amber-700 transition-colors shadow-md western-btn"
              style={{ boxShadow: '0 4px 12px rgba(231, 168, 1, 0.4)' }}
            >
              <Facebook className="h-5 w-5" />
              <span>{t.home.viewAllNews}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
