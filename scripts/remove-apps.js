import {exec} from 'child_process'
let apps = `
wp-checker-81
wp-checker-82
wp-checker-83
wp-checker-84
wp-checker-85
wp-checker-86
wp-checker-87
wp-checker-88
wp-checker-89
wp-checker-90
wp-checker-91
wp-checker-92
wp-checker-93
wp-checker-94
wp-checker-95
wp-checker-96
wp-checker-97
wp-checker-98
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