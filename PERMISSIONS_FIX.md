# Rozwiązanie problemu "Missing or insufficient permissions"

## Problem

Błąd "Missing or insufficient permissions" w formularzu płatności wynika z restrykcyjnych reguł bezpieczeństwa Firestore.

## Przyczyna

Reguły Firestore wymagają, aby użytkownik miał status `'qualified'` w rejestracji, aby móc utworzyć płatność.

## Rozwiązanie dla testowania

### 1. Zaktualizuj reguły Firestore w Firebase Console

1. Przejdź do Firebase Console: https://console.firebase.google.com/
2. Wybierz projekt: `wtyczka-2025-test`
3. Przejdź do Firestore Database → Rules
4. Zastąp istniejące reguły zawartością z pliku `firestore.rules`
5. Kliknij "Publish"

### 2. Alternatywnie - ustaw status użytkownika na 'qualified'

Jeśli chcesz zachować oryginalne reguły bezpieczeństwa:

1. Przejdź do Firestore Database → Data
2. Znajdź collection `registrations`
3. Znajdź dokument dla swojego użytkownika (UID)
4. Zmień pole `status` na `'qualified'`

### 3. Sprawdź status rejestracji

Otwórz narzędzia deweloperskie w przeglądarce (F12) i sprawdź console - powinny pojawić się logi:

- "User registration: [object]"
- "Registration status: [status]"

### 4. Aktualne zmiany w kodzie

W pliku payment/page.tsx zostały dodane:

- Tymczasowe logowanie statusu użytkownika
- Wyłączenie sprawdzania statusu 'qualified' (dla testowania)

W pliku firestore.rules zostały:

- Tymczasowo usunięte wymaganie `userIsQualified()` dla tworzenia płatności

## Powrót do normalnego działania

Po zakończeniu testów:

1. Przywróć oryginalne reguły Firestore (usuń komentarz z `&& userIsQualified();`)
2. Usuń tymczasowe logowanie z payment/page.tsx
3. Przywróć sprawdzanie statusu qualified w komponencie

## Bezpieczeństwo

Te zmiany są tymczasowe i zostały wprowadzone tylko do testowania. W produkcji należy:

- Zachować restrykcyjne reguły bezpieczeństwa
- Upewnić się, że użytkownicy mają odpowiedni status przed dostępem do płatności
- Usunąć wszelkie tymczasowe obejścia
