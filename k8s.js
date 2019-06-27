var mosca = require('mosca');
var mqtt = require('mqtt');
var fs = require('fs');

const CAfile = [fs.readFileSync(__dirname + '/cert/ptNetSuite_mqtt_ca.crt')];
const options = {
  "port": 8883,
  "host": "ptnetsuite.a2asmartcity.io",
  "username": "lineacom",
  "password": "r0hs4rd903.#",
  "protocol": "mqtts",
  "rejectUnauthorized" : true,
  "secureProtocol": "TLSv1_method",
  "protocolId": "MQIsdp",
  "protocolVersion": 3,
  "keepalive": 60,
  "clean": true,
  // "ca": CAfile,
  "clientId": "lineacom::43456435243"
}

client = mqtt.connect(options);

var settings = {
  port: 1883,
  http: {
    port: 8083,
  }
};

var server = new mosca.Server(settings);
server.on('ready', () => {
  console.log('Mosca embedded MQTT broker running now');
});

server.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});

server.on('published', (packet, client) => {
  // console.log('[Published]', packet);
});

// client
client.on('connect', function (data) {
  console.log('connect');
  client.subscribe('#')
})

client.on('message', function (topic, message) {
  console.log('message', topic);

  let msg = {
    topic: topic,
    payload: message.toString()
  }

  server.publish(msg, () => {
    // console.log(msg);
  });
})