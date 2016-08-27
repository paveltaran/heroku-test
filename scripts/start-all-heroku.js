import {exec} from 'child_process'
let apps = `
wp-checker-21
wp-checker-22
wp-checker-23
wp-checker-24
wp-checker-25
wp-checker-26
wp-checker-27
wp-checker-28
wp-checker-29
wp-checker-30
wp-checker-31
wp-checker-32
wp-checker-33
wp-checker-34
wp-checker-35
wp-checker-36
wp-checker-37
wp-checker-38
wp-checker-39
wp-checker-40
wp-checker-41
wp-checker-42
wp-checker-43
wp-checker-44
wp-checker-45
wp-checker-46
wp-checker-47
wp-checker-48
wp-checker-49
wp-checker-50
`.trim().split('\n');

async function scaleNext() {
	if (!apps.length) return
	let app = apps.shift();
	exec("heroku ps:scale web=0 worker=1 -a "+app,(...a)=>{
		console.log(...a);
		scaleNext();
	});
}
scaleNext();