import {deburr} from 'lodash-es'
import randomNumber from 'random-number-csprng'
import createError from 'http-errors'
import mongo, {ObjectId} from '../mongo.js'

import {sendMail} from '../sendmail.js'
import {formatMail} from './pin-code-template.js'

export function normalize(string) {
  return deburr(string).toLowerCase()
}

export function validateEmail(email) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}

export async function generatePinCode() {
  const number = await randomNumber(0, 999_999)
  return number.toString().padStart(6, '0')
}

export async function sendPinCodeMail(email) {
  if (validateEmail(normalize(email))) {
    const pinCode = await generatePinCode()
    const emailContent = formatMail({pinCode, userEmail: email})
    const now = new Date()
    const expirationDate = new Date(now.getTime() + (10 * 60 * 1000))
    const _id = new ObjectId()

    await mongo.db.collection('projetAdmin').insertOne({
      _id,
      creator: email,
      pinCode,
      createdAt: now,
      expiresAt: expirationDate,
      status: 'pending',
      token: null,
      codeEdition: null
    })

    await sendMail(emailContent, email)
  } else {
    throw createError(404, 'Cette adresse courriel est invalide')
  }
}

