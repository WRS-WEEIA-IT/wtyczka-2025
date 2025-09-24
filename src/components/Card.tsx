import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

/**
 * Uniwersalna karta z nowoczesnym wyglądem (shadow, zaokrąglenia, border, blur, padding).
 * Kolory i układ można nadpisywać przez className.
 */
export default function Card({
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-opacity-30 cursor-pointer rounded-xl border border-[#262626] bg-[#0F0F0F] p-8 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
