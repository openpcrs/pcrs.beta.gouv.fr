/* eslint-disable import/first */

import * as dotenv from 'dotenv'

dotenv.config()

import {template} from 'lodash-es'

const bodyTemplate = template(`
  <!DOCTYPE html>
  <html lang="fr">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande de code d’identification</title>
    <style>
      body {
        background-color: #F5F6F7;
        color: #234361;
        font-family: "SF UI Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        margin: auto;
        padding: 25px;
      }

      h1 {
        text-align: center;
      }

      img {
        max-height: 45px;
        background-color: #F5F6F7;
      }

      .container {
        background-color: #ebeff3;
        padding: 25px;
      }

      .code {
        font-size: 32px;
      }

      .title {
        align-items: center;
        border-bottom: 1px solid #E4E7EB;
        justify-content: center;
        margin-top: 35px;
        min-height: 8em;
        padding: 10px;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <h1>pcrs.beta.gouv.fr</h1>
    <div class="title">
      <h3 style="margin:0; mso-line-height-rule:exactly;">Demande de jeton d’authentification pour l’adresse courriel : <br/> <%= userEmail %></h3>
    </div>

    <div class="container">
      <h3>Voici votre jeton d’authentification :</h5>
      <div class="code"><%= token %></div>
      <p>Rendez vous sur le site <i>pcrs.beta.gouv.fr/gestion-suivi</i> et entrez le jeton pour accéder à l’espace d’administration</p>
    </div>

    <br />

    <p>Pourquoi ce courriel vous est envoyé ?</p>
    <p>
      Un administrateur du site PCRS vous a ajouté en tant qu’administrateur.
      Si vous n'êtes pas à l'origine de cette demande, merci d'ignorer ce courriel.
    </p>

    <p><i>L’équipe pcrs.data.gouv.fr</i></p>
  </body>

  </html>
`)

export function formatEmail(data) {
  const {token, userEmail} = data

  return {
    subject: 'Envoi de votre jeton d’authentification',
    html: bodyTemplate({token, userEmail})
  }
}

