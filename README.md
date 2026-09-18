# Wtyczka - Oficjalna strona wydarzenia

Kompleksowy serwis internetowy wydarzenia integracyjno-szkoleniowego Wtyczka dla studentów Wydziału Elektrotechniki, Elektroniki, Informatyki i Automatyki Politechniki Łódzkiej.

## 🤠 Funkcjonalności

### Dla wszystkich użytkowników:

- **Strona główna** z informacjami o wydarzeniu
- **Licznik dni** pobierany z bazy danych
- **Sekcja aktualności** z najnowszymi informacjami
- **Sekcja sponsorów** wydarzenia
- **Dwujęzyczna obsługa** (polski/angielski)
- **Rejestracja/logowanie** przez email lub Google
- **Regulamin** z interaktywną akceptacją sekcji
- **FAQ** z rozwijanymi sekcjami pomocy

### Dla zalogowanych użytkowników:

- **Formularz rejestracji** z trzema sekcjami i pełną walidacją
- **Śledzenie statusu** aplikacji w czasie rzeczywistym
- **Niezbędnik uczestnika** z listami pakowania
- **Kontakty organizatorów** (tylko dla zakwalifikowanych)

### Dla zakwalifikowanych uczestników:

- **Formularz płatności** (zabezpieczony hasłem administratora)
- **Szczegóły przelewu** z automatycznie generowanymi danymi
- **Śledzenie statusu płatności**

## 🚀 Technologie

### Frontend:

- **Next.js 16** z App Router i TypeScript
- **Tailwind CSS** - responsywne stylowanie
- **React Hook Form + Zod** - zaawansowana obsługa formularzy
- **Lucide React** - biblioteka ikon
- **React Hot Toast** - powiadomienia użytkownika

### Backend:

- **Supabase** - autoryzacja, baza danych i storage
- **Next.js Route Handlers** - endpointy serwerowe aplikacji
- **Vercel lub inny hosting Node.js** - hosting aplikacji
- **Environment Variables** - konfiguracja dynamiczna aplikacji

### Narzędzia deweloperskie:

- **ESLint Airbnb** - standardy jakości kodu
- **TypeScript Strict** - pełne typowanie
- **Turbopack** - szybki bundler Next.js

## 📁 Architektura

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Strona główna z countdown
│   ├── news/              # Aktualności i ogłoszenia
│   ├── registration/      # 3-sekcyjny formularz rejestracji
│   ├── status/           # Dashboard statusu aplikacji
│   ├── payment/          # Formularz płatności (zabezpieczony)
│   ├── contacts/         # Kontakty (tylko zakwalifikowani)
│   ├── essentials/       # Niezbędnik uczestnika
│   ├── faq/              # Często zadawane pytania
│   ├── oauth/google/      # Widok OAuth dla webview
│   └── api/               # Route Handlers aplikacji
├── components/           # Komponenty React
│   ├── Navbar.tsx       # Responsywna nawigacja
│   └── AuthModal.tsx    # Modal autoryzacji
├── contexts/            # React Contexts
│   ├── AuthContext.tsx  # Zarządzanie autoryzacją Supabase
│   └── LanguageContext.tsx # System wielojęzyczny
├── lib/                 # Biblioteki i utilities
│   ├── supabase.ts        # Konfiguracja i operacje Supabase
│   └── translations.ts    # Tłumaczenia PL/EN
└── types/              # Definicje typów TypeScript
    └── translations.ts  # Typy dla międzynarodowości
```

## Supabase Setup

Utwórz projekt Supabase, skonfiguruj tabele używane przez aplikację (`dates`, `data`,
`registrations`, `payments`) oraz włącz logowanie Google. Zmienne środowiskowe
ustaw w `.env.local` lokalnie i w ustawieniach projektu hostingowego:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_REGULATIONS_LINK=https://your-project.supabase.co/storage/v1/object/public/dokumenty/regulamin.pdf
NEXT_PUBLIC_ENABLE_ANALYTICS=true
PAYMENT_FORM_PASSWORD=use-a-long-random-secret
```

## ⚙️ Instalacja i uruchomienie

### Wymagania

- Node.js 20.9+
- npm lub yarn
- Konto Supabase

### Kroki instalacji

```bash
# 1. Sklonuj repozytorium
git clone <repository-url>
cd wtyczka-2025-test

# 2. Zainstaluj zależności
npm install

# 3. Skonfiguruj Supabase (patrz sekcja powyżej)

# 4. Uruchom środowisko deweloperskie
npm run dev

# 5. Otwórz http://localhost:3000
```

Plik `.env` jest lokalny i znajduje się w `.gitignore`. W produkcji ustaw te same
zmienne w panelu hostingu. Daty wydarzenia i dostępu są pobierane z tabeli
`dates` w Supabase. Nie commituj prawdziwego pliku `.env`; `PAYMENT_FORM_PASSWORD`
musi pozostać sekretem.

## 📊 Struktura bazy danych

### Tabela `registrations`

```typescript
{
  userId: string; // UID użytkownika z Supabase Auth
  email: string; // Email uczestnika
  firstName: string; // Imię
  lastName: string; // Nazwisko
  faculty: string; // Wydział
  studentNumber: string; // Numer indeksu
  status: "pending" | "qualified" | "not-qualified" | "withdrawn";
  createdAt: Date; // Data rejestracji
  // ... więcej pól
}
```

### Tabela `payments`

```typescript
{
  userId: string; // UID użytkownika
  registrationId: string; // ID rejestracji
  amount: number; // Kwota do zapłaty
  studentStatus: string; // Status studenta
  paymentStatus: "pending" | "confirmed" | "failed";
  createdAt: Date; // Data utworzenia
  // ... więcej pól
}
```

### Tabela `users`

```typescript
{
  userId: string; // UID z Supabase Auth
  email: string; // Email
  isAdmin: boolean; // Czy administrator
  hasRegistration: boolean; // Czy ma rejestrację
  hasPayment: boolean; // Czy ma płatność
  applicationStatus: string; // Status ogólny
  // ... więcej pól
}
```

## 🛡️ Bezpieczeństwo

### Supabase Row Level Security

- **Izolacja danych** - użytkownicy widzą tylko swoje dane
- **Kontrola administratorów** - specjalne uprawnienia
- **Walidacja statusu** - płatności tylko dla zakwalifikowanych
- **Audit trail** - śledzenie zmian
- **Brak usuwania** - dane są zachowywane

### Ochrona formularzy

- **Hasło administratora** - dostęp do formularza płatności
- **Walidacja Zod** - sprawdzanie danych po stronie klienta
- **TypeScript** - bezpieczeństwo typów

## 🎨 Design System

### Motyw wydarzenia

- **Kolor akcentu**: `#96C1FF`
- **Alerty**: czerwone akcenty dla ostrzeżeń i błędów
- **Tła**: istniejące grafiki kosmosu i gór pozostają bez zmian
- **Typografia**: Helvetica Now Display z lokalnymi fontami dekoracyjnymi

### Responsywność

- **Mobile-first** - projektowanie od urządzeń mobilnych
- **Breakpoints Tailwind** - sm, md, lg, xl
- **Flexbox/Grid** - nowoczesne layouty

## 📝 Stan rozwoju

### ✅ Ukończone funkcjonalności:

- ✅ Kompletna architektura Next.js 16 + TypeScript
- ✅ System autoryzacji Supabase (Google + email)
- ✅ Dwujęzyczna obsługa (PL/EN) z kontekstem
- ✅ Responsywna nawigacja z dropdown menu
- ✅ Strona główna z countdown i sekcjami
- ✅ Formularz rejestracji z 3 sekcjami i walidacją Zod
- ✅ System śledzenia statusu aplikacji
- ✅ Formularz płatności z zabezpieczeniem hasłem
- ✅ Strony informacyjne: FAQ, Niezbędnik, Kontakty, Regulamin
- ✅ Integracja z bazą Supabase
- ✅ Reguły Row Level Security (RLS)
- ✅ ESLint compliance (Airbnb config)
- ✅ Build produkcyjny, lint i type-check

### 🚧 W planach (przyszłe iteracje):

- 🔄 Panel administratora do zarządzania aplikacjami
- 🔄 System powiadomień email
- 🔄 Generowanie certyfikatów uczestnictwa
- 🔄 Integracja z systemami płatności online
- 🔄 Analytics i metryki użytkowania
- 🔄 PWA (Progressive Web App)

## 🏗️ Skrypty deweloperskie

```bash
npm run dev          # Środowisko deweloperskie z Turbopack
npm run build        # Budowanie produkcyjne
npm run start        # Uruchomienie build produkcyjny
npm run lint         # Sprawdzanie kodu ESLint Airbnb
npm run type-check   # Sprawdzanie typów TypeScript
```

## � Deployment

### Vercel

```bash
# 1. Połącz repozytorium z Vercel
# 2. Ustaw zmienne środowiskowe z sekcji Supabase Setup
# 3. Vercel wykryje Next.js i użyje: npm run build
# 4. Lokalnie sprawdź build produkcyjny:
npm run build
npm run start
```

## 👥 Zarządzanie użytkownikami

### Tworzenie administratora

1. Użytkownik loguje się przez stronę
2. W panelu Supabase nadaj administratorowi odpowiednią rolę w bazie danych
3. Ustaw odpowiednie pole administratora w tabeli użytkowników

### Zarządzanie aplikacjami

Administratorzy mogą:

- Przeglądać wszystkie rejestracje
- Zmieniać statusy (pending → qualified/not-qualified)
- Zarządzać płatnościami
- Generować statystyki

## 🐛 Debugowanie

### Częste problemy

1. **Supabase config** - sprawdź zmienne w `.env.local` lub ustawieniach hostingu
2. **RLS policies** - upewnij się, że polityki tabel są wdrożone
3. **Admin password** - sprawdź `PAYMENT_FORM_PASSWORD`
4. **Build errors** - uruchom `npm run lint` i `npm run type-check`

### Logi

```bash
# Logi Supabase w przeglądarce
# Network tab -> requests do Supabase
# Console tab -> JavaScript errors
```

## 📚 Dokumentacja techniczna

### API References

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

### Learning Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📞 Wsparcie

### Zgłaszanie problemów

1. **GitHub Issues** - szczegółowy opis z krokami reprodukcji
2. **Environment info** - przeglądarka, system, Node.js version
3. **Screenshots** - dla problemów UI/UX

### Kontakt deweloperski

- **Email**: [dev-contact]
- **GitHub**: [github-profile]
- **Documentation**: Ten README.md

---

**Wtyczka** - Oficjalna strona wydarzenia studenckiego
_Dokumentacja aktualizowana: Wrzesień 2026_
