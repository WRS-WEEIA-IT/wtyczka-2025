"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, ExternalLink } from "lucide-react";

export default function NewsPage() {
  const { t } = useLanguage();

  // Mock news data - w prawdziwej aplikacji te dane byłyby pobierane z Firebase
  const allNews = [
    {
      id: 1,
      title: "Rozpoczęcie rejestracji na Wtyczkę 2025",
      content:
        "Zapraszamy wszystkich studentów EEIA do zapisów na niezapomniany wyjazd w klimacie Dzikiego Zachodu! Rejestracja rozpoczęła się 15 stycznia i potrwa do 28 lutego 2025.",
      excerpt:
        "Zapraszamy wszystkich studentów EEIA do zapisów na niezapomniany wyjazd w klimacie Dzikiego Zachodu!",
      date: "2025-01-15",
      author: "Organizatorzy Wtyczki",
      facebookUrl: "https://facebook.com/example",
    },
    {
      id: 2,
      title: "Program wydarzenia już dostępny",
      content:
        "Sprawdź bogaty program szkoleń, warsztatów i integracji przygotowany specjalnie dla uczestników Wtyczki 2025. W programie znajdziecie m.in. warsztaty z programowania, sesje networkingowe i wiele innych atrakcji.",
      excerpt:
        "Sprawdź bogaty program szkoleń, warsztatów i integracji przygotowany specjalnie dla uczestników.",
      date: "2025-01-20",
      author: "Zespół Programowy",
      facebookUrl: "https://facebook.com/example",
    },
    {
      id: 3,
      title: "Sponsorzy wydarzenia",
      content:
        "Poznaj naszych partnerów, którzy wspierają organizację Wtyczki 2025. Dzięki nim możemy zapewnić uczestnikom najwyższą jakość wydarzenia i niezapomniane doświadczenia.",
      excerpt:
        "Poznaj naszych partnerów, którzy wspierają organizację Wtyczki 2025.",
      date: "2025-01-25",
      author: "Dział Sponsoringu",
      facebookUrl: "https://facebook.com/example",
    },
    {
      id: 4,
      title: "Informacje o transporcie",
      content:
        "Szczegóły dotyczące transportu na wydarzenie. Będziemy organizować wspólny wyjazd autokarem z Łodzi. Więcej informacji wkrótce!",
      excerpt:
        "Szczegóły dotyczące transportu na wydarzenie w klimacie Western.",
      date: "2025-02-01",
      author: "Koordynatorzy",
      facebookUrl: "https://facebook.com/example",
    },
    {
      id: 5,
      title: "Lista rzeczy do zabrania",
      content:
        "Przygotowaliśmy dla Was kompletną listę rzeczy, które warto zabrać na Wtyczkę 2025. Sprawdź niezbędnik uczestnika!",
      excerpt: "Kompletna lista rzeczy do zabrania na wydarzenie.",
      date: "2025-02-05",
      author: "Organizatorzy",
      facebookUrl: "https://facebook.com/example",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-800 to-orange-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.home.latestNews}
          </h1>
          <p className="text-xl text-amber-100">
            Śledź najnowsze informacje o wydarzeniu Wtyczka 2025
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="https://facebook.com/wtyczka2025"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              <span>Obserwuj nas na Facebooku</span>
            </a>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {allNews.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-8">
                  <div className="flex items-center text-amber-600 text-sm mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{news.date}</span>
                    <span className="mx-2">•</span>
                    <span>{news.author}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-amber-900 mb-4">
                    {news.title}
                  </h2>

                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {news.content}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">Udostępnij:</span>
                      <a
                        href={news.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Facebook
                      </a>
                    </div>
                    <div className="text-sm text-gray-500">Post #{news.id}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md font-semibold transition-colors">
              Załaduj więcej postów
            </button>
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Nie przegap żadnych aktualności!
          </h2>
          <p className="text-gray-600 mb-8">
            Obserwuj naszą stronę na Facebooku, aby być na bieżąco z wszystkimi
            informacjami dotyczącymi Wtyczki 2025.
          </p>
          <a
            href="https://facebook.com/wtyczka2025"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            <span>Odwiedź naszego Facebooka</span>
          </a>
        </div>
      </section>
    </div>
  );
}
