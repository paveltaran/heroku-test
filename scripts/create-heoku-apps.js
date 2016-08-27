import {exec} from 'child_process'
const _ = require('underscore');

let xx = _.range(21,73);

function createNext() {
	if (!xx.length) return;
	let name = 'wp-checker-'+xx.shift();
	exec(`heroku create `+name, (...x)=>{
		console.log(...x);
		createNext();
	})
}

createNext()


