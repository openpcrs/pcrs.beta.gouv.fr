export const checkIsPhoneValid = phone => {
  const nationalPattern = /^0[1-9]\d{8}$/
  const internationalPattern = /^\+?33[1-9]\d{8}$/

  return nationalPattern.test(phone) || internationalPattern.test(phone)
}

export const checkIsEmailValid = mail => {
  const emailChecker = /^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
  if (emailChecker.test(mail)) {
    return true
  }

  return false
}

export const isInRange = (value, min, max) => {
  if (min !== undefined && value < min) {
    return false
  }

  if (max !== undefined && value > max) {
    return false
  }

  return true
}

export const handleRangeError = (value, min, max) => {
  const numericValue = Number(value)

  if (numericValue !== 0 && Number.isNaN(numericValue)) {
    return 'Veuillez entrer uniquement des nombres'
  }

  if (min !== undefined && max === undefined && numericValue < min) {
    return `La valeur est inférieure à ${min}`
  }

  if (min === undefined && max !== undefined && numericValue > max) {
    return `La valeur est supérieure à ${max}`
  }

  if (min !== undefined && max !== undefined && (numericValue < min || numericValue > max)) {
    return `La valeur doit être comprise entre ${min} et ${max}`
  }

  return null
}

export const checkIsSirenValid = siren => {
  const sirenChecker = /^\d{9}$/
  return sirenChecker.test(siren)
}

export function handlePhoneError(input) {
  if (!checkIsPhoneValid(input)) {
    return 'Le numéro de téléphone doit être composé de 10 chiffres ou de 9 chiffres précédés du préfixe +33'
  }
}

export function handleMailError(input) {
  if (!checkIsEmailValid(input)) {
    return 'L’adresse mail entrée est invalide. Exemple : dupont@domaine.fr'
  }
}

export function handleSirenError(input, checkIsSirenAlreadyUsed) {
  if (!checkIsSirenValid(input)) {
    return 'Le SIREN doit être composé de 9 chiffres'
  }

  if (checkIsSirenAlreadyUsed && checkIsSirenAlreadyUsed(input)) {
    return 'Cet acteur est déjà présent.'
  }
}
