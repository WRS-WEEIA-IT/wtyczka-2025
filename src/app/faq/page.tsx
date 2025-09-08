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
  Mountain,
} from "lucide-react";

import { getFAQ, QuestionRecord } from "@/usecases/faq";

import Image from "next/image";

export default function FAQPage() {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const [faqGeneral, setFaqGeneral] = useState<QuestionRecord[]>([]);
  const [faqPayments, setFaqPayments] = useState<QuestionRecord[]>([]);
  const [faqTransport, setFaqTransport] = useState<QuestionRecord[]>([]);
  const [faqAccommodation, setFaqAccommodation] = useState<QuestionRecord[]>(
    []
  );
  const [faqEntertainment, setFaqEntertainment] = useState<QuestionRecord[]>(
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
        const data = await getFAQ();

        setFaqGeneral(data.filter((item) => item.category === "general"));
        setFaqPayments(data.filter((item) => item.category === "cost"));
        setFaqTransport(data.filter((item) => item.category === "transport"));
        setFaqAccommodation(
          data.filter((item) => item.category === "accommodation")
        );
        setFaqEntertainment(
          data.filter((item) => item.category === "entertainment")
        );
        setFaqContact(data.filter((item) => item.category === "contact"));
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
      id: "entertainment",
      title: "Rozrywka",
      icon: <Mountain className="h-5 w-5" />,
      questions: faqEntertainment,
    },
    {
      id: "contact",
      title: "Kontakt i pomoc",
      icon: <Phone className="h-5 w-5" />,
      questions: faqContact,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* FAQ Content */}
      <section className="py-8">
        <div className="border-b border-[#262626] text-white py-10 mb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
              Najczęściej zadawane pytania
            </h1>
            <p className="text-xl text-gray-200">
              Odpowiedzi na najważniejsze pytania dotyczące Wtyczki 2025
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a1a1a]/70 border border-[#262626] rounded-lg shadow-lg overflow-hidden p-6">
            <div className="space-y-6">
              {faqData.map((section) => (
                <div
                  key={section.id}
                  className="overflow-hidden mb-6 last:mb-0"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-4 bg-[#232323] hover:bg-[#2a2a2a] transition-colors flex items-center justify-between text-left rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-amber-400">{section.icon}</div>
                      <h2 className="text-xl font-bold text-amber-400">
                        {section.title}
                      </h2>
                    </div>
                    <div className="text-amber-400">
                      {openSections.includes(section.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </button>

                  {openSections.includes(section.id) && (
                    <div className="px-4 py-4 space-y-6 mt-3">
                      {section.questions.map((qa, index) => (
                        <div
                          key={index}
                          className="border border-[#3a3a3a] rounded-lg p-4 last:mb-0"
                        >
                          <h3 className="text-lg font-semibold text-amber-300 mb-2">
                            {qa.question}
                          </h3>
                          <p className="text-gray-200 leading-relaxed">
                            {qa.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 bg-[#1a1a1a]/70 border border-[#262626] text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-amber-400">
              Nie znalazłeś odpowiedzi na swoje pytanie?
            </h3>
            <p className="text-amber-200 mb-6">
              Skontaktuj się z nami - chętnie pomożemy!
            </p>
            <div className="space-y-2">
              <p className="text-amber-300">
                📧 Email:{" "}
                <a
                  href="mailto:wtyczka2025@example.com"
                  className="underline hover:text-white"
                >
                  wtyczka2025@example.com
                </a>
              </p>
              <p className="text-amber-300">
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
