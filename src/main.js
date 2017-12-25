// Prelim Settings
'use strict'
require('dotenv').config()
// External Imports
const moment = require('moment')
// Local Imports
const Twitter = require('./twitter')
const Twilio = require('./twilio')

// Current Trend to Track
const searchPhrase = 'Coin of the day'
const mcaffee = 'officialmcafee'

// Timeframes
const oneHourAgo = moment().unix() - 3600
const twoHoursAgo = moment().unix() - 7200
const threeHoursAgo = moment().unix() - (7200 + 3600)

// Target Phone Numbers -> Should be Moved to DB, hence object creation.
const numOne = process.env.NUM_ONE
const numTwo = process.env.NUM_TWO

const destinationList = [ { phone: numOne } ]

// -----------------------------------
// In Memory Tracking -> Move to DB
// -----------------------------------
let sentMessageText = []

// -----------------------------------
// Filter & Review Support Functions
// -----------------------------------
function filterCoinOfTheDay (tweetArr) {
  return tweetArr.filter(tweet => {
    return tweet.text.includes(searchPhrase) ||
      tweet.text.toLowerCase().includes(searchPhrase.toLowerCase())
  })
}

function isRecentTweet (tweet) {
  const formattedDate = new Date(tweet.created_at)
  return moment(formattedDate).unix() >= threeHoursAgo
}

function isNotReply (tweet) {
  return tweet.in_reply_to_status_id == null
}

function notPreviouslySent (tweet) {
  return !sentMessageText.includes(tweet.text)
}

// Removes: Replies & Old Posts. Must mention coin of the day.
function filterDown (tweetArr) {
  const coinOfTheDayTweets = filterCoinOfTheDay(tweetArr)

  return coinOfTheDayTweets.filter(tweet =>
    isRecentTweet(tweet) && isNotReply(tweet) && notPreviouslySent(tweet)
  )
}

function extractSymbol (coinOfTheDayText) {
  const regex = /\b[A-Z]{3}\b/

  return regex.exec(coinOfTheDayText)[0]
}

function formatTweetForTwilio (tweetDetails) {
  // Add to Tracking Array:
  sentMessageText.push(tweetDetails.text)
  // Get likely symbol being mentioned via Regex -> Can be refined
  const likelySymbol = extractSymbol(tweetDetails.text)
  // Basic Terminal Feedback
  console.log(`Sending Message Re: ${likelySymbol} | Tweet: `, tweetDetails)
  // Format Msg
  return `Likely Symbol: ${likelySymbol} | Truncated Tweet: ${tweetDetails.text}`
}

// -----------------------------------
// Core Functionality
// -----------------------------------
// NOTE: Handling tweets could be made to loop through and handle one hit the
// same way as many. However, we may want diff logic to account for 1 hit vs many,
// so they are explicity separated for now.
function checkCoinOfTheDay () {
  return Twitter.getUserTweets(mcaffee, 10)
  .then(filterDown)
  .then(tweetDetails => {
    if (tweetDetails.length === 1) {
      const formattedMsg = formatTweetForTwilio(tweetDetails[0])
      return Twilio.sendToContactList(destinationList, formattedMsg)
    }
    else if (tweetDetails.length > 1) {
      tweetDetails.map(tweet => {
        const formattedMsg = formatTweetForTwilio(tweet)
        return Twilio.sendToContactList(destinationList, formattedMsg)
      })
    }
    else {
      return console.log('No Tweets to report back about.')
    }

  })
  .catch(err => console.log('Error during main process! ', err))
}


// -----------------------------------
// Loop It
// -----------------------------------
setInterval(() => checkCoinOfTheDay(), 2000)
