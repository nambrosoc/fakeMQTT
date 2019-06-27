var mosca = require('mosca');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
const port = 3000;

app.use(bodyParser.json())

var SECURE_KEY = __dirname + '/certs/test.key';
var SECURE_CERT = __dirname + '/certs/test.pem';

var settings = {
  port: 1883
};

var server = new mosca.Server(settings);
server.on('ready', () => {
  console.log('Mosca embedded MQTT broker running now');
});

server.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});

server.on('published', (packet, client) => {
  console.log('[Published]', packet);
});

app.get('/', (req, res) => {
  res.json({
    status: 'ok'
  });
});

app.post('/api/uplink', (req, res) => {
  if(('topic' in req.body) && ('payload' in req.body)) {
    var message = {
      topic: req.body.topic,
      payload: req.body.payload,
      qos: 0,
      retain: false
    };

    server.publish(message, () => {
      // console.log({topic: message.topic, payload: message.payload});
    });
  }

  res.json(req.body);
});

let decToHex = (d) => {
  return ("00000000"+(Number(d).toString(16))).slice(-8).toUpperCase();
}

let hexToDec = (d) => {
  return parseInt(d, 16);
}

let total = 0;
let seqno = 0;
const MIN = 70;
const MAX = 120;

setInterval(() => {
  let value = parseInt(Math.random() * (MAX - MIN) + MIN);
  total = total + value
  seqno += 1;
  var message = {
    topic: '/sub/v1/users/lineacom/shared/cobo/apps/5/devices/a8610a3037428601/uplink/1',
    payload: JSON.stringify({
      payload: decToHex(value) + decToHex(total),
      seqno: seqno,
      statistics: {
        adr: true,
        channel: 7,
        duplicate: false,
        freq: 867.9,
        modBW: 125,
        rssi: -85,
        seqno: seqno,
        sf: 9,
        snr: 8.5,
        time: new Date().getTime()
      }
    }),
    qos: 0,
    retain: false
  };

  server.publish(message, () => {
    console.log({topic: message.topic, payload: message.payload});
  });
}, 30000);

// app.listen(port, () => console.log(`App listening on port ${port}!`))
