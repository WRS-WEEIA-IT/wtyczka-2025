type DateParts = {
  year: number
  month: number
  day: number
}

function parseDateOnly(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    year < 1 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return { year, month, day }
}

function getBirthDateFromPesel(pesel: string): string | null {
  const yearPart = Number(pesel.slice(0, 2))
  const encodedMonth = Number(pesel.slice(2, 4))
  let yearOffset = 1900
  let month = encodedMonth

  if (encodedMonth >= 21 && encodedMonth <= 32) {
    yearOffset = 2000
    month -= 20
  } else if (encodedMonth >= 41 && encodedMonth <= 52) {
    yearOffset = 2100
    month -= 40
  } else if (encodedMonth >= 61 && encodedMonth <= 72) {
    yearOffset = 2200
    month -= 60
  } else if (encodedMonth >= 81 && encodedMonth <= 92) {
    yearOffset = 1800
    month -= 80
  } else if (encodedMonth < 1 || encodedMonth > 12) {
    return null
  }

  const year = yearOffset + yearPart
  const day = Number(pesel.slice(4, 6))
  const birthDate = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return parseDateOnly(birthDate) ? birthDate : null
}

export function validatePeselAgainstBirthDate(
  pesel: string,
  birthDate: string,
): string | null {
  if (!/^\d{11}$/.test(pesel)) {
    return 'PESEL musi składać się z dokładnie 11 cyfr.'
  }

  if (!parseDateOnly(birthDate)) {
    return 'Podaj prawidłową datę urodzenia.'
  }

  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]
  const weightedSum = weights.reduce(
    (sum, weight, index) => sum + Number(pesel[index]) * weight,
    0,
  )
  const checksum = (10 - (weightedSum % 10)) % 10

  if (checksum !== Number(pesel[10])) {
    return 'Numer PESEL jest nieprawidłowy.'
  }

  if (getBirthDateFromPesel(pesel) !== birthDate) {
    return 'Numer PESEL nie zgadza się z datą urodzenia.'
  }

  return null
}

export function isAtLeast18OnDate(
  birthDate: string,
  comparisonDate: string,
): boolean {
  const birth = parseDateOnly(birthDate)
  const comparison = parseDateOnly(comparisonDate.slice(0, 10))
  if (!birth || !comparison) return false

  const age =
    comparison.year -
    birth.year -
    (comparison.month < birth.month ||
    (comparison.month === birth.month && comparison.day < birth.day)
      ? 1
      : 0)

  return age >= 18
}