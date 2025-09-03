
"use client";
import React from "react";

const partners = [
  { name: "Partner 1", logo: "/logo_czarne_tło.jpg" },
  { name: "Partner 2", logo: "/logo_czarne_tło.jpg" },
  { name: "Partner 3", logo: "/logo_czarne_tło.jpg" },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2d1a06] py-10 px-2">
      <h1 className="text-4xl font-western text-amber-400 mb-2 drop-shadow-lg">Nasi Partnerzy</h1>
      <p className="text-lg text-amber-200 mb-8 text-center max-w-xl">
        Każdy z naszych partnerów to prawdziwa sztabka złota w skrzyni Wtyczki!
      </p>
      <div className="relative w-full max-w-3xl flex flex-col items-center">
        {/* Skrzynia - SVG background */}
        <div className="w-full flex justify-center">
          <svg viewBox="0 0 600 250" className="w-full max-w-2xl h-auto" style={{ zIndex: 1 }}>
            {/* Skrzynia */}
            <rect x="50" y="100" width="500" height="100" rx="20" fill="#6b3f13" stroke="#a97c50" strokeWidth="8" />
            {/* Pokrywa */}
            <rect x="30" y="80" width="540" height="40" rx="15" fill="#8d5524" stroke="#a97c50" strokeWidth="6" />
            {/* Cień pod skrzynią */}
            <ellipse cx="300" cy="210" rx="180" ry="18" fill="#000" opacity="0.2" />
          </svg>
          {/* Sztabki złota */}
          <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[80%] flex flex-row justify-center gap-6 z-10">
            {partners.map((partner, idx) => (
              <div
                key={partner.name}
                className="flex flex-col items-center"
                style={{ transform: `rotate(${(idx - 1) * 7}deg)` }}
              >
                <div className="w-28 h-12 bg-gradient-to-br from-yellow-300 to-amber-500 border-4 border-yellow-700 rounded-lg shadow-lg flex items-center justify-center relative group transition-transform hover:scale-105 hover:brightness-110 cursor-pointer">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-10 h-10 object-contain rounded"
                  />
                  <span className="absolute bottom-0 right-0 text-xs text-yellow-900 font-bold bg-amber-200 bg-opacity-80 px-2 py-0.5 rounded-tl opacity-0 group-hover:opacity-100 transition-opacity">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
