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

export const checkIsSirenValid = siren => {
  const sirenChecker = /^$|^\d{9}$/
  if (sirenChecker.test(siren)) {
    return true
  }

  return false
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
