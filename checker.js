process.env.RETHINKDB_URL = "rethinkdb://207.38.84.54/gambling";
process.env.RABBITMQ_URL = "amqp://test:test@207.38.84.54";
require('coffee-script/register')
const db = require('seokit-db');
const debug = require('debug')(__filename);
import autobind from 'autobind-decorator'
const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const REQ_COUNT = parseInt(process.env.REQ_COUNT || 40);
var Website = null;


console.log('RABBITMQ_URL',RABBITMQ_URL);


@autobind
class Checker {

	channelName = 'wordpress';
	maxCount = REQ_COUNT;

	constructor() {
		db('Website',model=>{
			Website = model;
			this.start().catch(debug)
		});
	}

	async start() {
		this.connection = await amqp.connect(RABBITMQ_URL);
		this.channel = await this.connection.createChannel();
		this.channel.assertQueue(this.channelName, {durable: true}).then(console.log);
		this.channel.prefetch(this.maxCount);
		this.channel.consume(this.channelName, this.receivedMsg, {noAck: false});
	}

	receivedMsg(msg) {
		console.log(msg.content.toString());
		let data = JSON.parse(msg.content.toString());
		let url = 'http://'+data.n;
		console.log(url);
		db.website.addWordpress(url,_=>{
			this.channel.ack(msg);
		});

	}

}



new Checker();