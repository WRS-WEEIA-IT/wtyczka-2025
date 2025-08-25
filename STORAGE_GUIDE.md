# System Przechowywania Plików - Instrukcja

## Przełączanie między Firebase Storage a lokalnym przechowywaniem

Aplikacja teraz obsługuje dwa systemy przechowywania plików:

1. **Firebase Storage** (domyślny) - pliki przechowywane w chmurze
2. **Local Storage** (awaryjny) - pliki przechowywane lokalnie na serwerze

### Konfiguracja w .env.local

Dodaj lub zmodyfikuj zmienną środowiskową w pliku `.env.local`:

```bash
# Opcje: "firebase" lub "local"
NEXT_PUBLIC_STORAGE_TYPE=firebase
```

### Przełączanie systemów

#### Użyj Firebase Storage (domyślne):

```bash
NEXT_PUBLIC_STORAGE_TYPE=firebase
```

#### Użyj lokalnego przechowywania (awaryjne):

```bash
NEXT_PUBLIC_STORAGE_TYPE=local
```

### Jak to działa

1. **Firebase Storage:**

   - Pliki przechowywane w Google Cloud Storage
   - Automatyczne URL do pobierania
   - Skalowalność i niezawodność chmury
   - Wymagane połączenie internetowe

2. **Local Storage:**
   - Pliki przechowywane w folderze `uploads/payment-confirmations/`
   - Serwowane przez API endpoint `/api/files/[userId]/[fileName]`
   - Nie wymaga połączenia z Firebase Storage
   - Pliki dostępne tylko lokalnie

### Struktura plików lokalnych

```
uploads/
└── payment-confirmations/
    └── [userId]/
        └── [timestamp]-[random]-[filename].[ext]
```

### API Endpoints

- **Upload lokalny:** `POST /api/upload-local`
- **Pobieranie pliku:** `GET /api/files/[userId]/[fileName]`
- **Usuwanie pliku:** `DELETE /api/upload-local?userId=[userId]&fileName=[fileName]`

### Uwagi

- Po zmianie `NEXT_PUBLIC_STORAGE_TYPE` należy zrestartować serwer dev
- Folder `uploads/` jest dodany do `.gitignore` - pliki nie będą commitowane
- Oba systemy używają tej samej walidacji (PDF, PNG, JPG, max 5MB)
- Przełączanie odbywa się automatycznie - nie trzeba zmieniać kodu aplikacji

### Testowanie

1. Zmień wartość `NEXT_PUBLIC_STORAGE_TYPE` w `.env.local`
2. Zrestartuj serwer: `npm run dev`
3. Przejdź do `/payment` i przetestuj upload pliku
4. Sprawdź czy plik pojawia się w odpowiednim miejscu:
   - Firebase: w konsoli Firebase Storage
   - Local: w folderze `uploads/payment-confirmations/[userId]/`
