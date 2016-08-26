var MongoClient = require('mongodb').MongoClient;
var db = require('db');
const async = require('async-q');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/www');

var Website = mongoose.model('Website', {
	h: String,
	H: String
});

var Transform = require('stream').Transform,
	util = require('util');

var TransformStream = function() {
	Transform.call(this, {objectMode: true});
};
util.inherits(TransformStream, Transform);
var i = 0;
TransformStream.prototype._transform = function(chunk, encoding, callback) {
	//console.log(i++);
	let data = {
		host:chunk.h,
		path:chunk.H
	};
	this.push(data);
	callback();
};
let ts = new TransformStream();

var url = 'mongodb://localhost:27017/www';

MongoClient.connect(url, async function(err, mongo) {
	let cursor = mongo.collection('websites').find({});
	let count = await db.wordpress.website.count();
	console.log('skip',count);
	let table = db.wordpress.website.toStream({writable:true});
	let stream = Website.find().skip(count).lean().stream();
	stream.pipe(ts).pipe(table).on('finish', function() {
		console.log('Done');
		db.r.getPool().drain();
	});


});