process.env.RETHINKDB_URL = "rethinkdb://46.8.45.97/gambling";
process.env.RABBITMQ_URL = "amqp://yourName:yourPass123@46.8.45.97";
const db = require('db');
const debug = require('debug')(__filename);
import autobind from 'autobind-decorator'
const stream = require('stream');
const util = require('util');
const Writable = stream.Writable;
const amqp = require('amqplib');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
import {EventEmitter} from 'events'

const ee = new EventEmitter()

@autobind
class Sender {

	channelName = 'wordpress';
	maxCount = 1000;

	constructor() {
		this.createSendStream();
		this.start().catch(console.log)
	}

	async start() {
		this.connection = await amqp.connect(RABBITMQ_URL);
		this.channel = await this.connection.createChannel();
		this.channel.assertQueue(this.channelName, {durable: true}).then(console.log);
		let reader = db.wordpress.website.filter(db.r.row.hasFields('status').not()).toStream();
		reader.pipe(this.sendStream).on('finish', _=> {
			console.log('Done');
		});
		clearInterval(this._checkQueueLength);
		this._checkQueueLength = setInterval(this.checkQueueLength,1000);
	}

	createSendStream() {
		function SendStream(options) {
			Writable.call(this, options);
		};
		util.inherits(SendStream, Writable);
		let i = 0;
		SendStream.prototype._write = (website, enc, callback) => {
			let msg = JSON.stringify(website);
			this.channel.sendToQueue(this.channelName, new Buffer(msg), {persistent: true});
			if (++i > 1000) {
				i = 0;
				this.checkQueueLength(callback)
			} else {
				callback()
			}
		};
		this.sendStream = new SendStream({objectMode: true});
	}

	async checkQueueLength(callback) {
		let {messageCount} = await this.channel.checkQueue(this.channelName);
		console.log('checkQueueLength',messageCount);
		if (messageCount === undefined || messageCount >= this.maxCount) {
			setTimeout(_=>{
				this.checkQueueLength(callback)
			},200)
		} else {
			callback()
		}
	}
}


new Sender();