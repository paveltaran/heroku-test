import {exec} from 'child_process'
const _ = require('underscore');

let xx = _.range(1,20);

function createNext() {
	if (!xx.length) return;
	let n = ('0'+xx.shift()).slice(-2);
	let name = 'wp-checker-'+n;
	exec(`heroku create `+name, (...x)=>{
		console.log(...x);
		createNext();
	})
}

createNext();


