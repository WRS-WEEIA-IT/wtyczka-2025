"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, Suspense } from "react";
import {
  Calendar,
  Users,
  Award,
  Facebook,
  MapPin,
  UserRound,
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
              src="/logo_czarne_tło.jpg"
              alt="Logo wtyczka"
              width={320}
              height={110}
              className="m-0 p-0 leading-none drop-shadow-2xl rounded-lg bg-[#18181b] shadow-lg"
              style={{ display: "block", marginBottom: "-10px" }}
            />
            <p
              className="text-2xl md:text-3xl m-0 p-0 text-[#E7A801] font-extrabold tracking-widest uppercase drop-shadow-lg western-title"
              style={{ marginTop: "-2px" }}
            >
              {t.home.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row mt-10 gap-3 w-full justify-center items-center mb-2 overflow-x-auto">
            <Link
              href="/registration"
              className="bg-[#E7A801] hover:bg-amber-700 min-w-[160px] max-w-xs w-full rounded-lg p-3 flex items-center justify-center font-extrabold text-base uppercase tracking-widest text-black shadow-md transition-colors western-btn"
              style={{ boxShadow: '0 4px 12px rgba(231, 168, 1, 0.4)' }}
            >
              Zapisz się
            </Link>

            <Link
              href="/faq"
              className="bg-[#232323]/90 hover:bg-[#3a2c13] min-w-[160px] max-w-xs w-full rounded-lg p-3 flex items-center justify-center font-extrabold text-base uppercase tracking-widest text-[#E7A801] shadow-md transition-colors western-btn"
              style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)' }}
            >
              Dowiedz się więcej
            </Link>
          </div>

          <div className="w-full flex justify-center mt-5 mb-2">
            <a
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wtyczka+2025+-+Wyjazd+Integracyjny&dates=20251023T120000Z/20251023T130000Z&details=Wyjazd+Integracyjny+Wydziału+EEIA+PŁ"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#232323]/80 w-full max-w-xs rounded-lg py-3 px-4 flex flex-row items-center justify-center gap-3 shadow-lg cursor-pointer hover:bg-[#232323] transition"
              title="Dodaj wydarzenie do kalendarza Google"
              style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}
            >
              <Calendar className="h-7 w-7 text-[#E7A801]" />
              <span className="text-lg font-extrabold tracking-widest uppercase text-[#E7A801]">Pozostało {daysUntilEvent} dni</span>
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
