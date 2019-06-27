var mosca = require('mosca')

var SECURE_KEY = __dirname + '/certs/test.key'
var SECURE_CERT = __dirname + '/certs/test.pem'

const TIMEOUT = 30000
const AWAIT = TIMEOUT - 15000
const RESET = 10

let seqno = 0

var settings = {
  port: 1883
}

var server = new mosca.Server(settings)
server.on('ready', () => {
  console.log('Mosca embedded MQTT broker running now')
})

server.on('clientConnected', (client) => {
  console.log('client connected', client.id)
})

server.on('published', (packet, client) => {
  // console.log('[Published]', packet)
})

setInterval(() => {
  var messageLORA = {
    topic: '/sub/v1/users/lora-e/apps/1/devices/1122334455000210/uplink/3',
    payload: JSON.stringify({
      payload: 18010203,
      seqno: seqno,
      statistics: {
        adr: false,
        channel: 7,
        duplicate: false,
        freq: 867.9,
        modBW: 125,
        modu: 'LORA',
        rssi: -85,
        seqno: seqno,
        sf: 12,
        snr: 8.5,
        time: new Date().getTime()
      }
    }),
    qos: 0,
    retain: false
  }

  seqno += 1

  var messageLORAE = {
    topic: '/sub/v1/users/lora-e/apps/1/devices/1122334455000210/uplink/3',
    payload: JSON.stringify({
      payload: 18010203,
      seqno: seqno,
      statistics: {
        adr: false,
        channel: 7,
        duplicate: false,
        freq: 867.9,
        modBW: 125,
        modu: 'LORAE',
        rssi: -85,
        seqno: seqno,
        sf: 12,
        snr: 8.5,
        time: new Date().getTime()
      }
    }),
    qos: 0,
    retain: false
  }

  if (seqno >= RESET) {
    seqno = 0
  } else {
    seqno += 1
  }

  const minimum = 0
  const maximum = 100
  const LIMIT = 50

  let random = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum

  if (random < LIMIT) {
    server.publish(messageLORA, () => {
      console.log('[LORA]', messageLORA.topic)
    })
  } else {
    console.log('[LORA] lost')
  }

  setTimeout(() => {
    random = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
  
    if (random < LIMIT) {
      server.publish(messageLORAE, () => {
        console.log('[LORAE]', messageLORAE.topic)
      })
    } else {
      console.log('[LORAE] lost')
    }
  }, AWAIT)

}, TIMEOUT)