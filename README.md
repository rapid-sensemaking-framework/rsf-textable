# rsf-textable

A class that can send and receive text messages via twilio,
that has a clean and simple speak/listen API.

In order to make this work, not only do you need to set up a twilio account, and number,
but you also need to use an NGROK tunnel to your temp server, to receive webhook events.
This is all explained here: https://www.twilio.com/docs/sms/quickstart/node#sign-up-for-twilio-and-get-a-twilio-phone-number

## Installation
`npm install --save rsf-textable`

## environment variables

- `TWILIO_SERVER_PORT`  : `Number`, the port on which to temporarily run the server
- `TWILIO_SENDER_NUMBER`: `String`, the phone number associated with the twilio account, formatted like +12223334444
- `TWILIO_ACCOUNT_SID`  : `String`, the account sid value taken from twilio
- `TWILIO_TOKEN`        : `String`, the secret token given by twilio

## API

__`Textable`__

`constructor(id, name)`: A Textable is a wrapped version of a bidirectional communication channel between the program, and a person, in which messages of text/strings can be sent and received

`id`: `String`, the phone number to reach this person at

`name`: `String`, optional, a name of the person being contacted

### __Instance methods__
___

`speak(string)`: Contact the person represented by the Textable, sending them a message

`string`: `String`, the string of text to send the person represented

___

`listen(callback)`: Handle a message from the person represented by the Textable, received as a simple string

`callback(string)`: `Function`, give a function which will be called whenever a message from the person is received