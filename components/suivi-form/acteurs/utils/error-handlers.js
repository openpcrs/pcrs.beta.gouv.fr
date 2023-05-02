export const onPhoneCheck = phone => {
  if (/^(?:\+33|0)[1-9](?:\d{8}|\d{9})$/.test(phone) || !phone) {
    return true
  }

  return false
}

export const onEmailCheck = mail => {
  const emailChecker = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
  if (emailChecker.test(mail) || !mail) {
    return true
  }

  return false
}

export const onSirenCheck = siren => {
  const sirenChecker = /^\d{9}$/
  if (sirenChecker.test(siren) || !siren) {
    return true
  }

  return false
}
