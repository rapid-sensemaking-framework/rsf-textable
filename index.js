const EventEmitter = require('events') // nodejs native import
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const twilio = require('twilio')
const MessagingResponse = twilio.twiml.MessagingResponse

// this key will be also used by other classes that implement the "Contactable"
// trait/contract
const STANDARD_EVENT_KEY = 'msg'
module.exports.STANDARD_EVENT_KEY = STANDARD_EVENT_KEY

// export a var which will be used to determine whether to use Textable
// as their mode of contact
const TYPE_KEY = 'phone'
module.exports.TYPE_KEY = TYPE_KEY

// import environment variables
const port = process.env.TWILIO_SERVER_PORT
const senderNumber = process.env.TWILIO_SENDER_NUMBER
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_TOKEN

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

// a singleton that will act to transmit events between the webhook listener
// and the instances of Textable
const eventBus = new EventEmitter()

// listen for messages
app.post('/sms', (req, res) => {
    // send back an empty response
    res.writeHead(200, { 'Content-Type': 'text/xml' })
    res.end(new MessagingResponse().toString())

    // use the ID/phone number as the event type, and the
    // text as the event message
    // req.body.From is the phone number
    // req.body.Body is the text
    eventBus.emit(req.body.From, req.body.Body)
})

http.createServer(app).listen(port, () => {
    console.log('starting http server to listen for text messages on port ' + port)
})

const client = twilio(accountSid, authToken)

class Textable extends EventEmitter {
    constructor(id, name) {
        super()
        // the phone number
        this.id = id
        // a human name, optional
        this.name = name
        // forward messages from the event bus over the class/instance level event emitter
        eventBus.on(this.id, text => {
            // emit an event that conforms to the standard for Contactable
            this.emit(STANDARD_EVENT_KEY, text)
        })
    }

    // expose a function that conforms to the standard for Contactable
    // which can "reach" the person
    speak(string) {
        client.messages.create({
            body: string,
            from: senderNumber,
            to: this.id
        })
    }

    listen(callback) {
        // just set up the actual event listener
        // using the appropriate key,
        // but not bothering to expose it
        this.on(STANDARD_EVENT_KEY, callback)
    }
}
module.exports.Textable = Textable


