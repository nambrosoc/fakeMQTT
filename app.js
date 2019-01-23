var mosca = require('mosca');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
const port = 3000;

app.use(bodyParser.json())

var settings = {
  port: 1883,
};

var server = new mosca.Server(settings);
server.on('ready', () => {
  console.log('Mosca embedded MQTT broker running now');
});

server.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});

server.on('published', (packet, client) => {
  console.log('Published', packet);
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
      console.log({topic: message.topic, payload: message.payload});
    });
  }

  res.json(req.body);
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
