import {exec} from 'child_process'
let apps = `
secure-oasis-63500
wp-checker-02
wp-checker-03
wp-checker-04
wp-checker-05
wp-checker-06
wp-checker-07
wp-checker-08
wp-checker-09
wp-checker-10
wp-checker-11
wp-checker-12
wp-checker-13
wp-checker-14
wp-checker-15
wp-checker-16
wp-checker-17
wp-checker-18
wp-checker-19
wp-checker-20
`.trim().split('\n');

async function restartNext() {
	if (!apps.length) return
	let app = apps.shift();
	exec("heroku restart -a "+app,(...a)=>{
		console.log(...a);
		restartNext();
	});
}
restartNext();