'use client'

import { useEffect, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  CreditCard,
  Bus,
  Utensils,
  Phone,
  Mountain,
} from 'lucide-react'

import { getFAQ, QuestionRecord } from '@/usecases/faq'

export default function FAQPage() {
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const [openSections, setOpenSections] = useState<string[]>([])

  const [faqGeneral, setFaqGeneral] = useState<QuestionRecord[]>([])
  const [faqPayments, setFaqPayments] = useState<QuestionRecord[]>([])
  const [faqTransport, setFaqTransport] = useState<QuestionRecord[]>([])
  const [faqAccommodation, setFaqAccommodation] = useState<QuestionRecord[]>([])
  const [faqEntertainment, setFaqEntertainment] = useState<QuestionRecord[]>([])
  const [faqContact, setFaqContact] = useState<QuestionRecord[]>([])

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFAQ()

        setFaqGeneral(data.filter((item) => item.category === 'general'))
        setFaqPayments(data.filter((item) => item.category === 'cost'))
        setFaqTransport(data.filter((item) => item.category === 'transport'))
        setFaqAccommodation(
          data.filter((item) => item.category === 'accommodation'),
        )
        setFaqEntertainment(
          data.filter((item) => item.category === 'entertainment'),
        )
        setFaqContact(data.filter((item) => item.category === 'contact'))
      } catch (error) {
        console.error('Error fetching FAQ data:', error)
      }
    }

    fetchData()
  }, [])

  const faqData = [
    {
      id: 'general',
      title: 'Informacje ogólne',
      icon: <HelpCircle className="h-5 w-5" />,
      questions: faqGeneral,
    },
    {
      id: 'payments',
      title: 'Płatności i faktury',
      icon: <CreditCard className="h-5 w-5" />,
      questions: faqPayments,
    },
    {
      id: 'transport',
      title: 'Transport',
      icon: <Bus className="h-5 w-5" />,
      questions: faqTransport,
    },
    {
      id: 'accommodation',
      title: 'Zakwaterowanie i wyżywienie',
      icon: <Utensils className="h-5 w-5" />,
      questions: faqAccommodation,
    },
    {
      id: 'entertainment',
      title: 'Rozrywka',
      icon: <Mountain className="h-5 w-5" />,
      questions: faqEntertainment,
    },
    {
      id: 'contact',
      title: 'Kontakt i pomoc',
      icon: <Phone className="h-5 w-5" />,
      questions: faqContact,
    },
  ]

  if (!isMounted) return null
  return (
    <div className="min-h-screen">
      {/* FAQ Content */}
      <section className="py-8">
        <div className="mb-8 border-b border-[#262626] py-10 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-bold text-amber-400 md:text-5xl">
              Najczęściej zadawane pytania
            </h1>
            <p className="text-xl text-gray-200">
              Odpowiedzi na najważniejsze pytania dotyczące Wtyczki 2025
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg border border-[#262626] bg-[#1a1a1a]/70 p-6 shadow-lg">
            <div className="space-y-6">
              {faqData.map((section) => (
                <div
                  key={section.id}
                  className="mb-6 overflow-hidden last:mb-0"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between rounded-lg bg-[#232323] px-6 py-4 text-left transition-colors hover:bg-[#2a2a2a]"
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
                    <div className="mt-3 space-y-6 px-4 py-4">
                      {section.questions.map((qa, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-[#3a3a3a] p-4 last:mb-0"
                        >
                          <h3 className="mb-2 text-lg font-semibold text-amber-300">
                            {qa.question}
                          </h3>
                          <p className="leading-relaxed text-gray-200">
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
          <div className="mt-12 rounded-lg border border-[#262626] bg-[#1a1a1a]/70 p-8 text-center text-white">
            <h3 className="mb-4 text-2xl font-bold text-amber-400">
              Nie znalazłeś odpowiedzi na swoje pytanie?
            </h3>
            <p className="mb-6 text-amber-200">
              Skontaktuj się z nami - chętnie pomożemy!
            </p>
            <div className="space-y-2">
              <p className="text-amber-300">
                📧 Email:{' '}
                <a
                  href="mailto:wtyczka@samorzad.p.lodz.pl"
                  className="underline hover:text-white"
                >
                  wtyczka@samorzad.p.lodz.pl
                </a>
              </p>
              <p className="text-amber-300">
                📱 Telefon:{' '}
                <a href="tel:690150650" className="underline hover:text-white">
                  690 150 650
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
