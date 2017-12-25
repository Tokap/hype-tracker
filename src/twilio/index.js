'use strict'

require('dotenv').config()

const moment = require('moment')
const twilio = require('twilio')

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH

const twilioClient = new twilio(accountSid, authToken)

const BASE_NUMBER = process.env.TWILIO_BASE_NUM
const DATE_FORMAT = 'dddd, MMMM Do YYYY, h:mm:ss a'

function sendMessage(destination, body) {
  return twilioClient.messages.create({
      body: body,
      to: `+1${destination}`,  // Text this number
      from: BASE_NUMBER // From a valid Twilio number
  })
  .then(message => {
    const now = moment().format(DATE_FORMAT)
    console.log(`Message Sent: ${now} \nId: ${message.sid}`)
    return true
  })
}

// Revision of Above
function sendToContactList(contact_list, msg) {
  return contact_list.map(contact => sendMessage(contact.phone, msg))
}

module.exports = {
  sendToContactList,
  sendMessage
}
