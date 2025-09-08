"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Phone, Mail, MessageCircle, Clock, MapPin, Users } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LoopCarousel } from "@/components/LoopCarousel";

type Contact = {
  name: string;
  role: string;
  email: string;
  phone: string;
  availability: string;
  responsibilities: string[];
};

export default function ContactsPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤠</div>
          <div className="text-xl text-amber-400">Ładowanie...</div>
        </div>
      </div>
    );
  }

  const coordinators: Contact[] = [
    {
      name: "Anna Kowalska",
      role: "Główny Koordynator",
      email: "anna.kowalska@example.com",
      phone: "+48 123 456 789",
      availability: "Pon-Pt 9:00-17:00",
      responsibilities: [
        "Ogólne pytania",
        "Problemy z rejestracją",
        "Informacje o wydarzeniu",
      ],
    },
    {
      name: "Michał Nowak",
      role: "Koordynator Logistyki",
      email: "michal.nowak@example.com",
      phone: "+48 234 567 890",
      availability: "Pon-Pt 10:00-18:00",
      responsibilities: ["Transport", "Zakwaterowanie", "Wyżywienie"],
    },
    {
      name: "Katarzyna Wiśniewska",
      role: "Koordynator Programu",
      email: "katarzyna.wisniewska@example.com",
      phone: "+48 345 678 901",
      availability: "Pon-Śr, Pt 8:00-16:00",
      responsibilities: ["Program wydarzenia", "Warsztaty", "Aktywności"],
    },
    {
      name: "Tomasz Zieliński",
      role: "Koordynator Finansowy",
      email: "tomasz.zielinski@example.com",
      phone: "+48 456 789 012",
      availability: "Wt-Czw 12:00-20:00",
      responsibilities: ["Płatności", "Faktury", "Zwroty kosztów"],
    },
  ];

  const emergencyContacts = [
    {
      title: "Dyżur organizatorów podczas wydarzenia",
      phone: "+48 500 600 700",
      availability: "24/7 podczas Wtyczki 2025",
      description: "Numer dostępny tylko w czasie trwania wydarzenia",
    },
    {
      title: "Nagłe przypadki medyczne",
      phone: "112",
      availability: "24/7",
      description: "Numer alarmowy - służby ratunkowe",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-[#262626] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
            Kontakty do organizatorów
          </h1>
          <p className="text-xl text-gray-200">
            Lista kontaktów do organizatorów wydarzenia Wtyczka 2025
          </p>
          <p className="text-sm text-amber-300 mt-2">
            Dostępne dla zakwalifikowanych uczestników
          </p>
        </div>
      </section>

      {/* General Contact Info */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#232323] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageCircle className="h-6 w-6 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-300">
                Ogólne informacje kontaktowe
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-200">
                  <strong>Email główny:</strong>
                  <br />
                  <a
                    href="mailto:wtyczka2025@example.com"
                    className="text-amber-400 hover:underline"
                  >
                    wtyczka2025@example.com
                  </a>
                </p>
              </div>
              <div>
                <p className="text-gray-200">
                  <strong>Telefon biura:</strong>
                  <br />
                  <a
                    href="tel:+48123000000"
                    className="text-amber-400 hover:underline"
                  >
                    +48 123 000 000
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coordinators */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-amber-400 text-center mb-8">
            Koordynatorzy wydarzenia
          </h2>
          <LoopCarousel
            items={coordinators}
            renderItem={(coordinator) => (
              <div className="bg-[#232323] rounded-xl shadow-lg p-6 border border-[#262626] w-full max-w-xl mx-auto flex flex-col items-center">
                {/* Miejsce na zdjęcie */}
                <div className="w-24 h-24 rounded-full bg-[#18181b] flex items-center justify-center mb-4 overflow-hidden">
                  {/* Możesz podmienić na <Image src={coordinator.avatarUrl} ... /> jeśli dodasz url */}
                  <Users className="h-12 w-12 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-amber-300 text-center mb-2">
                  {coordinator.name}
                </h3>
                <div className="space-y-3 w-full">
                  <div className="flex items-center space-x-2 justify-center">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${coordinator.email}`}
                      className="text-amber-400 hover:underline text-sm"
                    >
                      {coordinator.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 justify-center">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${coordinator.phone}`}
                      className="text-amber-400 hover:underline text-sm"
                    >
                      {coordinator.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </section>
    </div>
  );
}
