"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { Calendar, Users, Award, Facebook } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-amber-900 to-orange-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 via-amber-800 to-orange-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0">
          <div className="text-[200px] opacity-10 font-bold absolute -top-10 -left-10 transform rotate-12">
            🤠
          </div>
          <div className="text-[150px] opacity-10 font-bold absolute top-32 right-20 transform -rotate-12">
            🌵
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
            {t.home.title}
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-amber-100">
            {t.home.subtitle}
          </p>
          <p className="text-lg md:text-xl mb-8 text-orange-200">
            {t.home.theme}
          </p>

          {/* Countdown */}
          <div className="bg-black bg-opacity-30 rounded-lg p-6 inline-block backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-6 w-6" />
              <span className="text-lg font-semibold">{t.home.countdown}</span>
            </div>
            <div className="text-4xl md:text-6xl font-bold text-amber-300">
              {daysUntilEvent}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-lg text-amber-100 max-w-3xl mx-auto">
              {t.home.welcomeMessage}
            </p>
            <p className="text-xl text-orange-200 max-w-3xl mx-auto mt-4">
              {t.home.eventDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
              {t.home.latestNews}
            </h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {mockNews.map((news) => (
              <div
                key={news.id}
                className="bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-amber-600"
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
              className="inline-flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span>{t.home.viewAllNews}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-orange-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Gotowy na przygodę w stylu Western? 🏜️
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Dołącz do nas i przeżyj niezapomniane chwile pełne nauki, zabawy i
            integracji!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/registration"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md font-semibold transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>Zapisz się już dziś!</span>
            </a>
            <a
              href="/essentials"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-amber-800 text-white px-8 py-3 rounded-md font-semibold transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Award className="h-5 w-5" />
              <span>Dowiedz się więcej</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
