'use strict'

require('dotenv').config()

const twitter = require('twitter')

const SEARCH_API = 'search/tweets'
const TIMELINE_API = 'statuses/user_timeline'
const LIMIT_API = 'application/rate_limit_status'
const USERS_API = 'users/lookup'

function makeClient() {
  return new twitter({
    consumer_key        : process.env.TWITTER_CONSUMER_API_KEY
  , consumer_secret     : process.env.TWITTER_CONSUMER_API_SECRET
  , access_token_key    : process.env.TWITTER_ACCESS_TOKEN
  , access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET
  })
}

// Returns { limit: number, remaining: number, reset: UnixTimestamp }
function checkRateLimit() {
  const twitterClient = makeClient()
  return twitterClient.get(LIMIT_API, {})
  .then(res => res.resources.statuses[`/${TIMELINE_API}`])
}

// Get recent tweets for a user up to X posts
function getUserTweets(username, post_limit) {
  const twitterClient = makeClient()
  const params = { screen_name: username, count: post_limit }

  return twitterClient.get(TIMELINE_API, params)
}

// Get recent tweets for a user up to X posts
function getSinceTweetId(params) {
  const twitterClient = makeClient()

  return twitterClient.get(TIMELINE_API, params)
}

// Get recent tweets for a user up to X posts
function getUserDetails(username) {
  const twitterClient = makeClient()

  return twitterClient.get(USERS_API, { screen_name: username })
  .then(users => {
    if (users == null || users.length === 0) return null

    const user = users[0]

    return {
      network_id: user.id,
      controller: user.name,
      username: user.screen_name,
      profile_image_url: user.profile_image_url,
    }
  })
}


module.exports = {
  checkRateLimit,
  getSinceTweetId,
  getUserTweets,
  getUserDetails,
  makeClient
}
