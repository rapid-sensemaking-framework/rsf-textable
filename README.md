# rsf-smsable

A class that can send and receive text messages via twilio,
that has a clean and simple speak/listen API.

In order to make this work, not only do you need to set up a twilio account, and number,
but you also need to use an [ngrok tunnel](https://ngrok.com/) to your temp server, to receive webhook events.
It is possible to do free of charge testing with Twilio, it just appends a little message into the text messages that it sends, which is fine for testing.
This is all explained here: https://www.twilio.com/docs/sms/quickstart/node#sign-up-for-twilio-and-get-a-twilio-phone-number

## Installation
`npm install --save rsf-smsable`

## Usage

You must be running an instance of [rsf-twilio-bot](https://github.com/rapid-sensemaking-framework/rsf-twilio-bot) to connect to via websockets in order for the following to work.

```javascript
const { init, shutdown, Smsable } = require('rsf-smsable')

const config = {
  socketUrl: 'ws://localhost:3022'
}
init(config).then(() => {
  const person = new Smsable('+12223334444')
  // log anything that we hear from them
  person.listen(console.log)
  person.speak('hello!')

  // after 5 seconds, shutdown/disconnect
  // person methods will no longer work, or be fired
  setTimeout(() => {
    shutdown()
  }, 5000)
})

```