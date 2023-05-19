import {readFile} from 'node:fs/promises'
import {deburr} from 'lodash-es'
import randomNumber from 'random-number-csprng'
import Papa from 'papaparse'
import {nanoid} from 'nanoid'
import createError from 'http-errors'
import mongo, {ObjectId} from '../mongo.js'

import {sendMail} from '../sendmail.js'
import {formatMail} from './pin-code-template.js'

const csvMailList = await readFile('./data/PCRS_mailing.csv', {encoding: 'utf8'})
const parsedCsvFile = Papa.parse(csvMailList).data.flat()

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

export async function isAuthorizedMail(mail) {
  return parsedCsvFile.find(row => row === mail)
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

export async function checkPinCodeValidity({email, pinCode}) {
  const foundEmail = await mongo.db.collection('projetAdmin').findOne({creator: email, pinCode})
  const now = new Date()

  if (!foundEmail) {
    throw createError(404, 'L’adresse mail est inconnue ou le code est erroné')
  }

  if (foundEmail.status !== 'pending') {
    throw createError(401, 'Ce code a déjà été utilisé')
  }

  if (foundEmail.expiresAt.getTime() <= now.getTime()) {
    await mongo.db.collection('projetAdmin').updateOne(
      {_id: foundEmail._id},
      {$set: {
        status: 'expired'
      }}
    )

    throw createError(401, 'Le code est expiré')
  }

  const token = nanoid()

  await mongo.db.collection('projetAdmin').updateOne(
    {_id: foundEmail._id},
    {$set: {
      status: 'validated',
      token
    }}
  )

  return token
}
