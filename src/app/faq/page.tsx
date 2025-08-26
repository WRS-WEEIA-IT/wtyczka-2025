"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  CreditCard,
  Bus,
  Utensils,
  Phone,
} from "lucide-react";

import { getFAQByCategory, QuestionRecord } from "@/usecases/faq";

export default function FAQPage() {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const [faqGeneral, setFaqGeneral] = useState<QuestionRecord[]>([]);
  const [faqPayments, setFaqPayments] = useState<QuestionRecord[]>([]);
  const [faqTransport, setFaqTransport] = useState<QuestionRecord[]>([]);
  const [faqAccommodation, setFaqAccommodation] = useState<QuestionRecord[]>(
    []
  );
  const [faqContact, setFaqContact] = useState<QuestionRecord[]>([]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [general, payments, transport, accommodation, contact] =
          await Promise.all([
            getFAQByCategory("general"),
            getFAQByCategory("payments"),
            getFAQByCategory("transport"),
            getFAQByCategory("accommodation"),
            getFAQByCategory("contact"),
          ]);

        setFaqGeneral(general);
        setFaqPayments(payments);
        setFaqTransport(transport);
        setFaqAccommodation(accommodation);
        setFaqContact(contact);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      }
    };

    fetchData();
  }, []);

  const faqData = [
    {
      id: "general",
      title: "Informacje ogólne",
      icon: <HelpCircle className="h-5 w-5" />,
      questions: faqGeneral,
    },
    {
      id: "payments",
      title: "Płatności i faktury",
      icon: <CreditCard className="h-5 w-5" />,
      questions: faqPayments,
    },
    {
      id: "transport",
      title: "Transport",
      icon: <Bus className="h-5 w-5" />,
      questions: faqTransport,
    },
    {
      id: "accommodation",
      title: "Zakwaterowanie i wyżywienie",
      icon: <Utensils className="h-5 w-5" />,
      questions: faqAccommodation,
    },
    {
      id: "contact",
      title: "Kontakt i pomoc",
      icon: <Phone className="h-5 w-5" />,
      questions: faqContact,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-800 to-orange-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Najczęściej zadawane pytania
          </h1>
          <p className="text-xl text-amber-100">
            Znajdź odpowiedzi na pytania dotyczące Wtyczki 2025
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {faqData.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 bg-amber-100 hover:bg-amber-200 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-amber-600">{section.icon}</div>
                    <h2 className="text-xl font-bold text-amber-900">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-amber-600">
                    {openSections.includes(section.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {openSections.includes(section.id) && (
                  <div className="px-6 py-4 space-y-6">
                    {section.questions.map((qa, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {qa.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {qa.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-12 bg-gradient-to-r from-amber-800 to-orange-800 text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Nie znalazłeś odpowiedzi na swoje pytanie?
            </h3>
            <p className="text-amber-100 mb-6">
              Skontaktuj się z nami - chętnie pomożemy!
            </p>
            <div className="space-y-2">
              <p className="text-amber-200">
                📧 Email:{" "}
                <a
                  href="mailto:wtyczka2025@example.com"
                  className="underline hover:text-white"
                >
                  wtyczka2025@example.com
                </a>
              </p>
              <p className="text-amber-200">
                📱 Telefon:{" "}
                <a
                  href="tel:+48123456789"
                  className="underline hover:text-white"
                >
                  +48 123 456 789
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
