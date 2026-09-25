import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Regulamin już wkrótce | Wtyczka',
  description: 'Regulamin wydarzenia Wtyczka zostanie opublikowany wkrótce.',
}

export default function RegulationsPage() {
  return (
    <section className="flex min-h-[65vh] items-center justify-center px-6 py-20 text-center">
      <div className="max-w-xl">
        <FileText
          aria-hidden="true"
          className="mx-auto mb-6 h-10 w-10 text-amber-400"
          strokeWidth={1.5}
        />
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
          Informacja
        </p>
        <h1 className="text-3xl font-bold text-amber-400 sm:text-4xl">
          Regulamin już wkrótce
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-200 sm:text-lg">
          Pracujemy nad jego przygotowaniem. Gdy będzie gotowy, opublikujemy go
          tutaj.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md border border-amber-400/60 px-5 py-2.5 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-400/10"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </section>
  )
}
