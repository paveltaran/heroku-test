require('babel-register')({
	"presets": ["es2015", "stage-0", "stage-1"],
	"plugins": ["transform-decorators-legacy"],
	ignore: false,
	only: /(checker\.js)/
});
require(__dirname+'/checker.js');