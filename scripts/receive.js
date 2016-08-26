var amqp = require('amqplib/callback_api');

amqp.connect('amqp://yourName:yourPass123@46.8.45.97', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'wordpress';

    ch.assertQueue(q, {durable: true});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});