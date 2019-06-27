var mqtt = require('mqtt');
var fs = require('fs');

const CAfile = [fs.readFileSync(__dirname + '/cert/ptNetSuite_mqtt_ca.crt')];
const options1 = {
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

const options2 = {
  "port": 1883,
  "host": "pt-netsuite.mqtt",
  "username": "admin",
  "password": "root",
  // "protocol": "mqtts",
  // "rejectUnauthorized" : true,
  // "secureProtocol": "TLSv1_method",
  "protocolId": "MQIsdp",
  "protocolVersion": 3,
  "keepalive": 60,
  "clean": true,
  // "ca": CAfile,
  "clientId": "admin::eiwcrbyehfbuxyw"
}

client1 = mqtt.connect(options1);
client2 = mqtt.connect(options2);


// client1
client1.on('connect', function (data) {
  console.log('connect1')
  client1.subscribe('#')
})

client1.on('message', function (topic, message) {
  console.log('client1', topic)
  if(client2) {
    client2.publish(topic, message)
  }
})

// client2
client2.on('connect', function (data) {
  console.log('connect2')
})

client2.on('message', function (topic, message) {
  console.log('client2', topic)
})

client2.on('error', function (error) {
  console.log('client2', error)
})