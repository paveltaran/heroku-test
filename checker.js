const db = require('db');
const debug = require('debug')(__filename);
import autobind from 'autobind-decorator'
const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const REQ_COUNT = parseInt(process.env.REQ_COUNT || 40);
const Website = db.wordpress.website;


console.log('RABBITMQ_URL',RABBITMQ_URL);


@autobind
class Checker {

	channelName = 'wordpress';
	maxCount = REQ_COUNT;

	constructor() {
		this.start().catch(debug)
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
		let website = new Website(data);
		website.isNew = false;
		website.checkWordpress().then(res=>{
			debug(res);
			this.channel.ack(msg);	
		}).catch(e=>{
			debug(e);
			this.channel.ack(msg);
		});
	}

}



new Checker();