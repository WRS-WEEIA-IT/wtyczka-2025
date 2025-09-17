````markdown
# Wtyczka 2025 - Oficjalna strona wydarzenia

Kompleksowy serwis internetowy dla wydarzenia integracyjno-szkoleniowego **Wtyczka 2025** w klimacie Western, skierowanego do studentów wydziału EEIA Politechniki Łódzkiej.

## 🤠 Funkcjonalności

### Dla wszystkich użytkowników:

- **Strona główna** z informacjami o wydarzeniu w klimacie Western
- **Licznik dni** do wydarzenia (15-17 marca 2025)
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

- **Next.js 15** z App Router i TypeScript
- **Tailwind CSS** - responsywne stylowanie
- **React Hook Form + Zod** - zaawansowana obsługa formularzy
- **Lucide React** - biblioteka ikon
- **React Hot Toast** - powiadomienia użytkownika

### Backend:

- **Firebase Authentication** - autoryzacja Google i email
- **Firebase Firestore** - baza danych NoSQL z regułami bezpieczeństwa
- **Firebase Hosting** - hosting aplikacji
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
│   └── regulations/      # Interaktywny regulamin
├── components/           # Komponenty React
│   ├── Navbar.tsx       # Responsywna nawigacja
│   └── AuthModal.tsx    # Modal autoryzacji
├── contexts/            # React Contexts
│   ├── AuthContext.tsx  # Zarządzanie autoryzacją Firebase
│   └── LanguageContext.tsx # System wielojęzyczny
├── lib/                 # Biblioteki i utilities
│   ├── firebase.ts      # Konfiguracja Firebase
│   ├── firestore.ts     # Operacje bazodanowe
│   └── translations.ts  # Tłumaczenia PL/EN
└── types/              # Definicje typów TypeScript
    └── translations.ts  # Typy dla międzynarodowości
```

## 🔥 Firebase Setup

### 1. Utwórz projekt Firebase

```bash
# Utwórz projekt w Firebase Console
# Włącz Authentication (Email/Password + Google)
# Utwórz bazę Firestore
```

### 2. Konfiguracja zmiennych środowiskowych

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Hasło do formularza płatności
NEXT_PUBLIC_PAYMENT_FORM_PASSWORD=secure_admin_password
```

### 3. Firestore Security Rules

```javascript
// Skopiuj zawartość firestore.rules do Firebase Console -> Firestore -> Rules
```

## ⚙️ Instalacja i uruchomienie

### Wymagania

- Node.js 18+
- npm lub yarn
- Konto Firebase

### Kroki instalacji

```bash
# 1. Sklonuj repozytorium
git clone <repository-url>
cd wtyczka-2025-test

# 2. Zainstaluj zależności
npm install

# 3. Skonfiguruj Firebase (patrz sekcja powyżej)

# 4. Uruchom środowisko deweloperskie
npm run dev

# 5. Otwórz http://localhost:3000
```

## 🔧 Konfiguracja

### Zmienne środowiskowe

Aplikacja używa pliku `.env` do konfiguracji. Stwórz plik `.env` w głównym katalogu projektu z następującymi zmiennymi:

```
# Daty dostępu
PAYMENT_OPEN_DATE=2025-01-01       # Data otwarcia formularza płatności (YYYY-MM-DD)
CONTACT_OPEN_DATE=2025-01-15       # Data otwarcia sekcji kontaktowej (YYYY-MM-DD)

# Hasła dostępowe
PAYMENT_FORM_PASSWORD=tajne_haslo  # Hasło do formularza płatności
```

### Aktualizacja dat dostępu

Dla szybkiej aktualizacji dat i haseł, możesz użyć dostarczonych skryptów PowerShell:

```powershell
# Aktualizacja daty otwarcia formularza płatności
.\update-payment-date.ps1 -paymentDate "2025-02-15"

# Aktualizacja haseł i dat dostępu
.\update-security.ps1 -contactDate "2025-02-01" -paymentDate "2025-02-15" -adminPassword "nowe_haslo"
```

## 📊 Struktura bazy danych

### Kolekcja `registrations`

```typescript
{
  userId: string; // UID użytkownika z Firebase Auth
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

### Kolekcja `payments`

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

### Kolekcja `users`

```typescript
{
  userId: string; // UID z Firebase Auth
  email: string; // Email
  isAdmin: boolean; // Czy administrator
  hasRegistration: boolean; // Czy ma rejestrację
  hasPayment: boolean; // Czy ma płatność
  applicationStatus: string; // Status ogólny
  // ... więcej pól
}
```

## 🛡️ Bezpieczeństwo

### Firestore Security Rules

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

### Motyw Western

- **Kolory**: Odcienie brązu, pomarańczy, złota
- **Ikony**: 🤠 🌵 🏜️ 📄 💰
- **Gradienty**: Zachody słońca na prerii
- **Typografia**: Czytelne fonty z akcentami

### Responsywność

- **Mobile-first** - projektowanie od urządzeń mobilnych
- **Breakpoints Tailwind** - sm, md, lg, xl
- **Flexbox/Grid** - nowoczesne layouty

## 📝 Stan rozwoju

### ✅ Ukończone funkcjonalności:

- ✅ Kompletna architektura Next.js 15 + TypeScript
- ✅ System autoryzacji Firebase (Google + email)
- ✅ Dwujęzyczna obsługa (PL/EN) z kontekstem
- ✅ Responsywna nawigacja z dropdown menu
- ✅ Strona główna z countdown i sekcjami
- ✅ Formularz rejestracji z 3 sekcjami i walidacją Zod
- ✅ System śledzenia statusu aplikacji
- ✅ Formularz płatności z zabezpieczeniem hasłem
- ✅ Strony informacyjne: FAQ, Niezbędnik, Kontakty, Regulamin
- ✅ Integracja z Firebase Firestore
- ✅ Firestore Security Rules
- ✅ ESLint compliance (Airbnb config)
- ✅ Pełna dokumentacja projektu

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

### Firebase Hosting

```bash
# 1. Zainstaluj Firebase CLI
npm install -g firebase-tools

# 2. Zaloguj się
firebase login

# 3. Zainicjalizuj hosting
firebase init hosting

# 4. Zbuduj i wdróż
npm run build
firebase deploy
```

### Vercel (alternatywa)

```bash
# 1. Połącz z GitHub
# 2. Import projektu do Vercel
# 3. Skonfiguruj zmienne środowiskowe
# 4. Automatyczny deployment z każdym push
```

## 👥 Zarządzanie użytkownikami

### Tworzenie administratora

1. Użytkownik loguje się przez stronę
2. W Firebase Console -> Firestore -> users
3. Znajdź dokument użytkownika
4. Ustaw `isAdmin: true`

### Zarządzanie aplikacjami

Administratorzy mogą:

- Przeglądać wszystkie rejestracje
- Zmieniać statusy (pending → qualified/not-qualified)
- Zarządzać płatnościami
- Generować statystyki

## 🐛 Debugowanie

### Częste problemy

1. **Firebase config** - sprawdź zmienne w .env.local
2. **Firestore rules** - upewnij się, że są wdrożone
3. **Admin password** - sprawdź NEXT_PUBLIC_PAYMENT_FORM_PASSWORD
4. **Build errors** - uruchom `npm run lint` i `npm run type-check`

### Logi

```bash
# Logi Firebase w przeglądarce
# Network tab -> Firestore requests
# Console tab -> JavaScript errors
```

## 📚 Dokumentacja techniczna

### API References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Firebase v9 Documentation](https://firebase.google.com/docs/web/setup)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

### Learning Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
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

**Wtyczka 2025** - Wydarzenie studenckiej integracji w klimacie Dzikiego Zachodu
_Dokumentacja aktualizowana: Sierpień 2025 | Wersja: 1.0.0_
````
