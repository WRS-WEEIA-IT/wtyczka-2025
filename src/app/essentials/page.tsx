"use client";

import { useState, useEffect } from "react";
import {
  Backpack,
  FileText,
  Shirt,
  Bath,
  Laptop,
  Bus,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { EssentialItem, getEssentials } from "@/usecases/essentials";

export default function EssentialsPage() {
  const [essentials, setEssentials] = useState<EssentialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  // Lokalny stan checkboxów: { [id]: boolean }
  const [checked, setChecked] = useState<{ [id: number]: boolean }>({});
  
  // Define category icons
  const categoryIcons = {
    documents: <FileText className="h-5 w-5" />,
    clothing: <Shirt className="h-5 w-5" />,
    hygiene: <Bath className="h-5 w-5" />,
    electronics: <Laptop className="h-5 w-5" />,
    bus: <Bus className="h-5 w-5" />,
    optional: <Star className="h-5 w-5" />,
  };
  
  // Define category translations
  const categoryTranslations: { [key: string]: string } = {
    documents: "Dokumenty",
    clothing: "Ubrania",
    hygiene: "Higiena",
    electronics: "Elektronika",
    bus: "W autokarze",
    optional: "Opcjonalne"
  };

  useEffect(() => {
    const loadEssentials = async () => {
      try {
        setLoading(true);
        const items = await getEssentials();
        const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
        setEssentials(items);
        setCategories(uniqueCategories);
        // Ustaw domyślnie wszystko na nieodhaczone
        const initialChecked: { [id: number]: boolean } = {};
        items.forEach(item => {
          initialChecked[item.id] = false;
        });
        setChecked(initialChecked);
      } catch (error) {
        console.error("Error loading essentials:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEssentials();
  }, []);





  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-[#262626] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
            Niezbędnik uczestnika
          </h1>
          <p className="text-xl text-gray-200">
            Lista rzeczy, które warto zabrać na Wtyczkę 2025
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/registration"
              className="bg-[#E7A801] hover:bg-amber-700 min-w-[180px] border-[#262626] border rounded-xl px-6 py-3 font-semibold transition-colors backdrop-blur-sm text-black western-btn"
              style={{ boxShadow: '0 4px 12px rgba(231, 168, 1, 0.4)' }}
            >
              Zapisz się
            </Link>
            <Link
              href="/news"
              className="bg-[#232323]/90 hover:bg-[#3a2c13] min-w-[180px] border-[#262626] border rounded-xl px-6 py-3 font-semibold transition-colors backdrop-blur-sm text-white western-btn"
              style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)' }}
            >
              Aktualności
            </Link>
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a1a1a]/70 border border-[#262626] p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-6 w-6 text-[#E7A801]" />
              <h3 className="text-lg font-bold text-[#E7A801]">
                Ważne informacje
              </h3>
            </div>
            <ul className="text-amber-200 space-y-1 text-sm">
              <li>• Pamiętaj o udziale w odprawie przed wyjazdem!</li>
              <li>
                • Zabierz tylko to, co naprawdę potrzebne - miejsce w autokarze jest ograniczone
              </li>
              <li>• Oznacz swoje bagaże (imię, nazwisko, telefon)</li>
              <li>• Wszystkie leki trzymaj w bagażu podręcznym</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Packing List - styl FAQ, zawsze rozwinięty */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a1a1a]/70 border border-[#262626] rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold text-amber-400 text-center mb-8">
              Lista rzeczy do zabrania
            </h2>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
                <span className="ml-3 text-amber-400">Ładowanie listy...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category} className="overflow-hidden mb-6 last:mb-0">
                    <div className="w-full px-6 py-4 bg-[#232323] flex items-center text-left rounded-lg">
                      <div className="text-amber-400 mr-3">
                        {categoryIcons[category as keyof typeof categoryIcons] || <Backpack className="h-5 w-5" />}
                      </div>
                      <h2 className="text-xl font-bold text-amber-400">
                        {categoryTranslations[category] || category}
                      </h2>
                    </div>
                    <div className="px-4 py-4 space-y-2 mt-3">
                      {essentials.filter(item => item.category === category).map(item => (
                        <label
                          key={item.id}
                          className="flex items-center border border-[#3a3a3a] rounded-lg p-4 bg-[#18181b] cursor-pointer transition-colors hover:border-amber-400"
                        >
                          <input
                            type="checkbox"
                            checked={checked[item.id] || false}
                            onChange={() => setChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className="form-checkbox h-5 w-5 text-amber-500 rounded focus:ring-amber-400 border-amber-400 mr-4 transition-all duration-150"
                          />
                          <span className={`text-white text-base ${checked[item.id] ? 'line-through text-amber-300' : ''}`}>
                            {item.item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Contact for Questions */}
      <section className="py-16 bg-[#1a1a1a]/70 text-white border-t border-[#262626]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-amber-400">
            Masz pytania dotyczące pakowania?
          </h3>
          <p className="text-amber-200 mb-6">
            Skontaktuj się z organizatorami - chętnie pomożemy!
          </p>
          <div className="space-y-2">
            <p className="text-amber-300">
              📧 Email: {" "}
              <a
                href="mailto:wtyczka2025@example.com"
                className="underline hover:text-white"
              >
                wtyczka2025@example.com
              </a>
            </p>
            <p className="text-amber-300">
              📱 Telefon: {" "}
              <a href="tel:+48123456789" className="underline hover:text-white">
                +48 123 456 789
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

