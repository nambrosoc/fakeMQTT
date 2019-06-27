var mosca = require('mosca')

var settings = {
  port: 1883
}

var seqno = 0

var server = new mosca.Server(settings)
server.on('ready', () => {
  console.log('Mosca embedded MQTT broker running now')
})

server.on('clientConnected', (client) => {
  console.log('client connected', client.id)
})

setInterval(() => {
  seqno = seqno + 1

  var msg = {
    topic: '/sub/v1/users/lineacom/shared/cobo/apps/5/devices/a8610a3037428601/uplink/1',
    payload: JSON.stringify({
      payload: '4e',
      seqno: seqno,
      statistics: {
        adr: false,
        channel: 7,
        duplicate: false,
        freq: 867.9,
        modBW: 125,
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

  server.publish(msg, () => {
    console.log('topic', msg.topic, 'message', JSON.stringify(msg.payload))
  })
}, 10000)