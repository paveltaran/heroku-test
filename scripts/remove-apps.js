import {exec} from 'child_process'
let apps = `
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
	exec(`heroku apps:delete -a ${app} --confirm ${app}`,(...a)=>{
		console.log(...a);
		restartNext();
	});
}
restartNext();