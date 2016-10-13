import {exec} from 'child_process'
let apps = `
wp-checker-21
wp-checker-22
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