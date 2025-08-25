"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  CreditCard,
  Bus,
  Utensils,
  Phone,
} from "lucide-react";

export default function FAQPage() {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const faqData = [
    {
      id: "general",
      title: "Informacje ogólne",
      icon: <HelpCircle className="h-5 w-5" />,
      questions: [
        {
          question: "Czym jest Wtyczka 2025?",
          answer:
            "Wtyczka 2025 to coroczne wydarzenie integracyjno-szkoleniowe organizowane przez studentów wydziału EEIA Politechniki Łódzkiej. W tym roku odbywa się w klimacie Western i będzie pełne atrakcji, warsztatów oraz integracji.",
        },
        {
          question: "Kto może uczestniczyć w wydarzeniu?",
          answer:
            "W wydarzeniu mogą uczestniczyć przede wszystkim studenci wydziału EEIA, ale zapraszamy również studentów z innych wydziałów i uczelni. Każdy uczestnik musi być pełnoletni.",
        },
        {
          question: "Kiedy i gdzie odbywa się Wtyczka 2025?",
          answer:
            "Wydarzenie odbędzie się w maju 2025 roku. Szczegółowe informacje o lokalizacji i dokładnych datach będą przekazane uczestnikom po zakwalifikowaniu.",
        },
        {
          question: "Czy wydarzenie jest obowiązkowe?",
          answer:
            "Nie, Wtyczka 2025 jest wydarzeniem całkowicie dobrowolnym. To świetna okazja na integrację, naukę i zabawę w gronie innych studentów.",
        },
      ],
    },
    {
      id: "payments",
      title: "Płatności i faktury",
      icon: <CreditCard className="h-5 w-5" />,
      questions: [
        {
          question: "Ile kosztuje udział w wydarzeniu?",
          answer:
            "Koszt udziału wynosi 350 PLN dla studentów Politechniki Łódzkiej i 450 PLN dla pozostałych uczestników. Cena obejmuje zakwaterowanie, wyżywienie, materiały szkoleniowe oraz wszystkie aktywności.",
        },
        {
          question: "Jak dokonać płatności?",
          answer:
            "Płatność należy dokonać przelewem bankowym na konto podane w formularzu płatności. Po dokonaniu przelewu należy potwierdzić wpłatę w systemie.",
        },
        {
          question: "Czy mogę otrzymać fakturę?",
          answer:
            "Tak, istnieje możliwość wystawienia faktury. Odpowiednią opcję należy zaznaczyć w formularzu rejestracji. Faktura będzie wystawiona na dane podane w formularzu.",
        },
        {
          question: "Czy wpłata zostanie zwrócona w przypadku rezygnacji?",
          answer:
            "Wpłata może zostać zwrócona tylko w przypadku rezygnacji na więcej niż 10 dni przed wydarzeniem. Rezygnacja w późniejszym terminie nie uprawnia do zwrotu wpłaty.",
        },
        {
          question: "Do kiedy należy dokonać wpłaty?",
          answer:
            "Wpłaty należy dokonać w ciągu 7 dni od otrzymania informacji o zakwalifikowaniu. Brak wpłaty w terminie może skutkować utratą miejsca.",
        },
      ],
    },
    {
      id: "transport",
      title: "Transport",
      icon: <Bus className="h-5 w-5" />,
      questions: [
        {
          question: "Czy transport jest zapewniony?",
          answer:
            "Tak, organizujemy wspólny transport autokarem z Łodzi na miejsce wydarzenia. Transport jest wliczony w cenę udziału.",
        },
        {
          question: "Skąd odjeżdża autokar?",
          answer:
            "Autokar odjeżdża sprzed głównego budynku Politechniki Łódzkiej przy ul. Żeromskiego. Szczegółowe informacje o miejscu i godzinie odjazdu otrzymają uczestnicy przed wydarzeniem.",
        },
        {
          question: "Czy mogę dojechać własnym samochodem?",
          answer:
            "Tak, istnieje możliwość dojazdu własnym transportem. Należy zaznaczyć tę opcję w formularzu i skontaktować się z organizatorami w celu otrzymania szczegółów dotyczących dojazdu i parkowania.",
        },
        {
          question: "Co zrobić jeśli spóźnię się na odjazd autokaru?",
          answer:
            "W przypadku spóźnienia prosimy o natychmiastowy kontakt z organizatorami. Autokar może poczekać tylko kilka minut, dlatego bardzo prosimy o punktualność.",
        },
      ],
    },
    {
      id: "accommodation",
      title: "Zakwaterowanie i wyżywienie",
      icon: <Utensils className="h-5 w-5" />,
      questions: [
        {
          question: "Gdzie będziemy nocować?",
          answer:
            "Uczestnicy będą zakwaterowani w komfortowych pokojach 2-3 osobowych w ośrodku wypoczynkowym. Wszystkie pokoje posiadają łazienki i podstawowe udogodnienia.",
        },
        {
          question: "Co z wyżywieniem?",
          answer:
            "Zapewniamy pełne wyżywienie - śniadania, obiady, kolacje oraz przekąski podczas przerw. Uwzględniamy diety specjalne zgłoszone w formularzu rejestracji.",
        },
        {
          question: "Czy są uwzględniane diety specjalne?",
          answer:
            "Tak, uwzględniamy diety wegetariańskie, wegańskie, bezglutenowe oraz inne ograniczenia żywieniowe. Bardzo ważne jest zgłoszenie tego w formularzu rejestracji.",
        },
        {
          question: "Co zabrać ze sobą?",
          answer:
            'Szczegółową listę rzeczy do zabrania znajdziesz w sekcji "Niezbędnik uczestnika". Podstawowe rzeczy to odzież, przybory higieniczne, wygodne buty i strój na imprezę tematyczną.',
        },
      ],
    },
    {
      id: "contact",
      title: "Kontakt i pomoc",
      icon: <Phone className="h-5 w-5" />,
      questions: [
        {
          question: "Jak skontaktować się z organizatorami?",
          answer:
            'Dane kontaktowe organizatorów znajdziesz w sekcji "Kontakty" (dostępnej po zalogowaniu i zakwalifikowaniu). Możesz również napisać na adres email podany na stronie.',
        },
        {
          question: "Co zrobić w przypadku problemów technicznych ze stroną?",
          answer:
            "W przypadku problemów ze stroną internetową prosimy o kontakt mailowy z opisem problemu. Postaramy się rozwiązać go jak najszybciej.",
        },
        {
          question: "Czy będzie możliwość kontaktu podczas wydarzenia?",
          answer:
            "Tak, organizatorzy będą dostępni przez całe wydarzenie. Otrzymasz również numery kontaktowe kadry na wypadek nagłych sytuacji.",
        },
        {
          question: "Co w przypadku nagłej choroby lub kontuzji?",
          answer:
            "Na miejscu będzie podstawowa opieka medyczna. W razie potrzeby zapewnimy transport do najbliższego szpitala. Dlatego ważne jest podanie danych osoby kontaktowej w nagłych przypadkach.",
        },
      ],
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
