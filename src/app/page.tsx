"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Award,
  Facebook,
  MapPin,
  UserRound,
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const { t } = useLanguage();
  const [daysUntilEvent, setDaysUntilEvent] = useState(0);

  useEffect(() => {
    // Przykładowa data wydarzenia - można zmienić
    const eventDate = new Date("2025-10-23");

    const calculateDaysUntilEvent = () => {
      const today = new Date();
      const timeDiff = eventDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysUntilEvent(daysDiff > 0 ? daysDiff : 0);
    };

    calculateDaysUntilEvent();
    const interval = setInterval(calculateDaysUntilEvent, 86400000); // Update daily

    return () => clearInterval(interval);
  }, []);

  const mockNews = [
    {
      id: 1,
      title: "Rozpoczęcie rejestracji na Wtyczkę 2025",
      excerpt:
        "Zapraszamy wszystkich studentów EEIA do zapisów na niezapomniany wyjazd w klimacie Dzikiego Zachodu!",
      date: "2025-01-15",
      image: "/api/placeholder/300/200",
    },
    {
      id: 2,
      title: "Program wydarzenia już dostępny",
      excerpt:
        "Sprawdź bogaty program szkoleń, warsztatów i integracji przygotowany specjalnie dla uczestników.",
      date: "2025-01-20",
      image: "/api/placeholder/300/200",
    },
    {
      id: 3,
      title: "Sponsorzy wydarzenia",
      excerpt:
        "Poznaj naszych partnerów, którzy wspierają organizację Wtyczki 2025.",
      date: "2025-01-25",
      image: "/api/placeholder/300/200",
    },
  ];

  const sponsors = [
    { name: "Sponsor 1", logo: "/api/placeholder/150/80" },
    { name: "Sponsor 2", logo: "/api/placeholder/150/80" },
    { name: "Sponsor 3", logo: "/api/placeholder/150/80" },
    { name: "Sponsor 4", logo: "/api/placeholder/150/80" },
    { name: "Sponsor 5", logo: "/api/placeholder/150/80" },
    { name: "Sponsor 6", logo: "/api/placeholder/150/80" },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto sm:px-4 lg:px-6 text-center flex flex-col justify-center items-center">
          <div className="flex flex-col items-center">
            <Image
              src="/logo_czarne_tło.jpg"
              alt="Logo wtyczka"
              width={400}
              height={150}
              className="m-0 p-0 leading-none"
              style={{ display: "block", marginBottom: "-15px" }}
            />
            <p
              className="text-xl md:text-2xl m-0 p-0 text-white leading-none"
              style={{ marginTop: "-4px" }}
            >
              {t.home.subtitle}
            </p>
          </div>

          <div className="flex flex-row gap-3 w-full justify-center items-stretch mt-4 mb-2 overflow-x-auto">
            <div className="bg-[#0F0F0F] min-w-[110px] border-[#262626] border bg-opacity-30 rounded-xl p-2 flex items-center justify-center backdrop-blur-sm">
              <Calendar className="h-5 w-5 mr-1" />
              <span className="text-base">{daysUntilEvent} dni</span>
            </div>
            <div className="bg-[#0F0F0F] min-w-[110px] border-[#262626] border bg-opacity-30 rounded-xl p-2 flex items-center justify-center backdrop-blur-sm">
              <MapPin className="h-5 w-5 mr-1" />
              <span className="text-base">Murzasichle</span>
            </div>
            <div className="bg-[#0F0F0F] min-w-[110px] border-[#262626] border bg-opacity-30 rounded-xl p-2 pt-3 pb-3 flex items-center justify-center backdrop-blur-sm">
              <UserRound className="h-5 w-5 mr-1" />
              <span className="text-base">Studenci</span>
            </div>
          </div>

          <div className="flex flex-row gap-3 w-full justify-center items-stretch mb-2 mt-2 overflow-x-auto">
            <a
              href="/registration"
              className="bg-[#E7A801] hover:bg-amber-700 min-w-[180px] border-[#262626] border rounded-2xl p-2 pt-3 pb-3 flex items-center justify-center font-semibold transition-colors backdrop-blur-sm"
            >
              <span className="text-base text-black">Zapisz się</span>
            </a>
            <a
              href="/essentials"
              className="bg-[#0F0F0F] min-w-[180px] border-[#262626] border bg-opacity-30 rounded-2xl p-2 pt-3 pb-3 flex items-center justify-center backdrop-blur-sm"
            >
              <span className="text-base">Dowiedz się więcej</span>
            </a>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.home.latestNews}
            </h2>
            <div className="w-24 h-1 bg-[#E7A801] mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {mockNews.map((news) => (
              <div
                key={news.id}
                className="bg-[#0F0F0F] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-[#262626]"
              >
                <div className="h-48 bg-amber-800 flex items-center justify-center">
                  <span className="text-amber-400 text-6xl">📰</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-amber-400 mb-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{news.excerpt}</p>
                  <div className="text-sm text-amber-500 font-medium">
                    {news.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="/news"
              className="inline-flex items-center space-x-2 bg-[#E7A801] text-black px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span>{t.home.viewAllNews}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
