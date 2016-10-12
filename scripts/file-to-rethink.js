const r = require('rethinkdbdash')({db:'gambling'});
const fs = require('fs');
const async = require('async-q');
const es = require('event-stream');


var Transform = require('stream').Transform,
	util = require('util');

var TransformStream = function() {
	Transform.call(this, {objectMode: true});
};
util.inherits(TransformStream, Transform);
var i = 0;
TransformStream.prototype._transform = function(chunk, encoding, callback) {
	let host = chunk.replace(/^www\./,'').trim();
	console.log(i++,host);
	let data = {
		id:host
	};
	this.push(data);
	callback();
};
let ts = new TransformStream();
let filename = '/root/wp.txt';
//let filename = '/Users/admin/Projects/gambling/scripts/1.txt';
var readStream = fs.createReadStream(filename);
let table = r.table('wordpress__domains').toStream({writable:true});
readStream.pipe(es.split()).pipe(ts).pipe(table)
.on('error',function (e) {
	console.log('eee',e)
})
.on('finish', function() {
	console.log('Done');
	db.r.getPool().drain();
});


