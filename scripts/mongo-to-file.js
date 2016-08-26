var MongoClient = require('mongodb').MongoClient;
var db = require('db');
const async = require('async-q');
var mongoose = require('mongoose');
const fs = require('fs');
mongoose.connect('mongodb://localhost/www');
var wstream = fs.createWriteStream('/tmp/wordpress.txt');

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
	i++;
	let u = chunk.h+(chunk.H || '/')+'\n';
	this.push(u);
	callback();
};
let ts = new TransformStream();

var url = 'mongodb://localhost:27017/www';

MongoClient.connect(url, async function(err, mongo) {
	console.log('start')
	let stream = Website.find().lean().stream();
	stream.pipe(ts).pipe(wstream).on('finish', function() {
		console.log('Done');
		db.r.getPool().drain();
	});


});

setInterval(_=>{
	console.log(i)
},1000);