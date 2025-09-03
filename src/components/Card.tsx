import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Uniwersalna karta z nowoczesnym wyglądem (shadow, zaokrąglenia, border, blur, padding).
 * Kolory i układ można nadpisywać przez className.
 */
export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-[#0F0F0F] bg-opacity-30 border border-[#262626] rounded-xl shadow-md hover:shadow-lg transition-shadow backdrop-blur-sm p-8 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
