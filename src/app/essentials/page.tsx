"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Shirt,
  Bath,
  Laptop,
  Bus,
  Star,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { EssentialItem, getEssentials } from "@/usecases/essentials";

export default function EssentialsPage() {
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [essentials, setEssentials] = useState<EssentialItem[]>([]);
  const [essentialsDocuments, setEssentialsDocuments] = useState<
    EssentialItem[]
  >([]);
  const [essentialsClothing, setEssentialsClothing] = useState<EssentialItem[]>(
    []
  );
  const [essentialsHygiene, setEssentialsHygiene] = useState<EssentialItem[]>(
    []
  );
  const [essentialsElectronics, setEssentialsElectronics] = useState<
    EssentialItem[]
  >([]);
  const [essentialsBus, setEssentialsBus] = useState<EssentialItem[]>([]);
  const [essentialsOptional, setEssentialsOptional] = useState<EssentialItem[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<{ [id: number]: boolean }>({});
  const [checkedSection, setCheckedSection] = useState<{
    [id: string]: boolean;
  }>({});

  const [currentChangedCategory, setCurrentChangedCategory] =
    useState<string>("");

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  useEffect(() => {
    const loadEssentials = async () => {
      try {
        setLoading(true);

        const essentialsDb = await getEssentials();
        setEssentials(essentialsDb);

        setEssentialsDocuments(
          essentialsDb.filter((item) => item.category === "documents")
        );
        setEssentialsClothing(
          essentialsDb.filter((item) => item.category === "clothing")
        );
        setEssentialsHygiene(
          essentialsDb.filter((item) => item.category === "hygiene")
        );
        setEssentialsElectronics(
          essentialsDb.filter((item) => item.category === "electronics")
        );
        setEssentialsBus(
          essentialsDb.filter((item) => item.category === "bus")
        );
        setEssentialsOptional(
          essentialsDb.filter((item) => item.category === "optional")
        );

        const initialChecked: { [id: number]: boolean } = {};
        essentialsDb.forEach((item) => {
          initialChecked[item.id] = false;
        });

        const initialCheckedSection: { [id: string]: boolean } = {};
        [
          "documents",
          "clothing",
          "hygiene",
          "electronics",
          "bus",
          "optional",
        ].forEach((category) => {
          initialCheckedSection[category] = false;
        });

        setChecked(initialChecked);
        setCheckedSection(initialCheckedSection);
      } catch (error) {
        console.error("Error loading essentials:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEssentials();
  }, []);

  const essentialsData = [
    {
      id: "documents",
      title: "Dokumenty",
      icon: <FileText className="h-5 w-5" />,
      items: essentialsDocuments,
    },
    {
      id: "clothing",
      title: "Ubrania",
      icon: <Shirt className="h-5 w-5" />,
      items: essentialsClothing,
    },
    {
      id: "hygiene",
      title: "Higiena",
      icon: <Bath className="h-5 w-5" />,
      items: essentialsHygiene,
    },
    {
      id: "electronics",
      title: "Elektronika",
      icon: <Laptop className="h-5 w-5" />,
      items: essentialsElectronics,
    },
    {
      id: "bus",
      title: "W autokarze",
      icon: <Bus className="h-5 w-5" />,
      items: essentialsBus,
    },
    {
      id: "optional",
      title: "Opcjonalne",
      icon: <Star className="h-5 w-5" />,
      items: essentialsOptional,
    },
  ];

  useEffect(() => {
    const categoryItems = essentials.filter(
      (item) => item.category === currentChangedCategory
    );

    const allChecked = categoryItems.every(
      (catItem) => checked[catItem.id] == true
    );
    setCheckedSection((prev) => ({
      ...prev,
      [currentChangedCategory]: allChecked,
    }));
    if (allChecked) toggleSection(currentChangedCategory);
  }, [checked, currentChangedCategory]);

  if (!isMounted) return null;
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
              style={{ boxShadow: "0 4px 12px rgba(231, 168, 1, 0.4)" }}
            >
              Zapisz się
            </Link>
            <Link
              href="/news"
              className="bg-[#232323]/90 hover:bg-[#3a2c13] min-w-[180px] border-[#262626] border rounded-xl px-6 py-3 font-semibold transition-colors backdrop-blur-sm text-white western-btn"
              style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)" }}
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
                • Zabierz tylko to, co naprawdę potrzebne - miejsce w autokarze
                jest ograniczone
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
                {essentialsData.map((section) => (
                  <div
                    key={section.id}
                    className="overflow-hidden mb-6 last:mb-0"
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full px-6 py-4 bg-[#232323] hover:bg-[#2a2a2a] transition-colors flex items-center justify-between text-left rounded-lg ${
                        checkedSection[section.id]
                          ? "text-amber-300 line-through"
                          : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-amber-400 mr-3">
                          {section.icon}
                        </div>
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
                      <div className="px-4 py-4 space-y-2 mt-3">
                        {section.items.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center border border-[#3a3a3a] rounded-lg p-4 bg-[#18181b] cursor-pointer transition-colors hover:border-amber-400"
                          >
                            <input
                              type="checkbox"
                              checked={checked[item.id]}
                              onChange={() => {
                                setChecked((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id],
                                }));
                                setCurrentChangedCategory(item.category);
                              }}
                              className="form-checkbox h-5 w-5 text-amber-500 rounded focus:ring-amber-400 border-amber-400 mr-4 transition-all duration-150"
                            />
                            <span
                              className={`text-base ${
                                checked[item.id]
                                  ? "line-through text-amber-300"
                                  : "text-white"
                              }`}
                            >
                              {item.item}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
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
              📧 Email:{" "}
              <a
                href="mailto:wtyczka@samorzad.p.lodz.pl"
                className="underline hover:text-white"
              >
                wtyczka@samorzad.p.lodz.pl
              </a>
            </p>
            <p className="text-amber-300">
              📱 Telefon:{" "}
              <a href="tel:690150650" className="underline hover:text-white">
                690 150 650
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
