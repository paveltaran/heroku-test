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
	//console.log(i++);
	let [_,host,path] = chunk.toString().match(/([^\/]+)(\/.*)$/);
	let data = {
		host:host,
		path:path
	};
	this.push(data);
	callback();
};
let ts = new TransformStream();
let filename = '/root/wordpress.txt';
var readStream = fs.createReadStream(filename);
let table = r.table('test__websites').toStream({writable:true});
readStream.pipe(es.split()).pipe(ts).pipe(table).on('finish', function() {
	console.log('Done');
	db.r.getPool().drain();
});


