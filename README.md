# hype-tracker
Crypto is heavily driven by hype. Let us follow the madness.

# Quick Summary
This project is meant to be as minimal as possible with a small number of dependencies.
The Twitter package is used to facilitate interactions with their API and the
Twilio package is used to transmit realtime information to the user regarding
the Twitter account they are tracking. There are methods of approach that are
better suited for DB storage, but are currently done in memory to keep things
simple. These points are noted for personal revisions.

The application is extremely 'single purpose' and targets the `Coin of the Day`
Tweets that briefly drive the market for the coin being mentioned. That said,
one could easily play with the review process and plugin your own target text
with corresponding filter methods.

# Install
- Setup Environment Variables (discussed below)
- npm install
- npm run main

# Setup Environment Variables
The following environment variables are expected in order for this project to function.
Such variables should be kept in the `.env` and for all that is holy, keep that out
of your git tracking.

Expected Vars in .env:
(`Basic API Stuff`)
- TWILIO_SID
- TWILIO_AUTH
- TWILIO_BASE_NUM

- TWILIO_TEST_SID
- TWILIO_TEST_AUTH

- TWITTER_CONSUMER_API_KEY
- TWITTER_CONSUMER_API_SECRET
- TWITTER_ACCESS_TOKEN
- TWITTER_ACCESS_TOKEN_SECRET

(`Phone Numbers You're Sending To`)
- NUM_ONE
- NUM_TWO


# Notes
- There is an estimated 4-8 second gap between when a Tweet is reviewed and a Twilio msg is received.
- Process is set to run every 2 seconds. This can be updated at the bottom of the `main.js` file.
- This project was completed in a few hours as a labor of love. Don't expect it to be bulletproof.
