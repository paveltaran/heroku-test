require('babel-register')({
	"presets": ["es2015", "react", "stage-0", "stage-1"],
	"plugins": ["transform-decorators"],
	ignore: false,
	only: /(db)|(checker\.js)/
});
require(__dirname+'/checker.js');