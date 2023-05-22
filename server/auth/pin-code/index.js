import {readFile} from 'node:fs/promises'
import randomNumber from 'random-number-csprng'
import Papa from 'papaparse'
import {nanoid} from 'nanoid'
import createError from 'http-errors'

import mongo from '../../util/mongo.js'
import {sendMail} from '../../util/sendmail.js'

import {formatEmail} from './email-template.js'

async function readAuthorizedEmails() {
  const csvContent = await readFile('./authorized-emails.csv', {encoding: 'utf8'})
  return new Set(
    Papa.parse(csvContent).data.flat()
      .map(email => normalizeEmail(email))
  )
}

const authorizedEmails = await readAuthorizedEmails()

export function validateEmail(email) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-z\-\d]+\.)+[a-z]{2,}))$/i.test(email)
}

export async function generatePinCode() {
  const number = await randomNumber(0, 999_999)
  return number.toString().padStart(6, '0')
}

function normalizeEmail(email) {
  return email.toLowerCase()
}

export async function isAuthorizedEmail(email) {
  return authorizedEmails.has(normalizeEmail(email))
}

export async function sendPinCodeEmail(email) {
  if (!validateEmail(email)) {
    throw createError(400, 'Cette adresse courriel est invalide')
  }

  const pinCode = await generatePinCode()
  const emailContent = formatEmail({pinCode, userEmail: email})

  const now = new Date()
  const expirationDate = new Date(now.getTime() + (10 * 60 * 1000))

  await mongo.db.collection('creators').insertOne({
    creator: normalizeEmail(email),
    pinCode,
    createdAt: now,
    expiresAt: expirationDate,
    status: 'pending',
    token: null
  })

  await sendMail(emailContent, email)
}

export async function checkPinCodeValidity({email, pinCode}) {
  const foundEmail = await mongo.db.collection('creators').findOne({
    creator: normalizeEmail(email),
    status: 'pending',
    pinCode,
    expiresAt: {$gt: new Date()}
  })

  if (!foundEmail) {
    throw createError(403, 'L’adresse est inconnue ou le code est erroné ou a expiré')
  }

  const token = nanoid()

  await mongo.db.collection('creators').updateOne(
    {_id: foundEmail._id},
    {
      $set: {
        status: 'validated',
        token,
        validatedAt: new Date()
      },
      $unset: {
        expiresAt: 1
      }
    }
  )

  return token
}

export async function getCreatorByToken(token) {
  return mongo.db.collection('creators').findOne({
    token,
    status: 'validated'
  })
}
