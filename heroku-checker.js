process.env.RETHINKDB_URL = "rethinkdb://46.8.45.97/gambling";
process.env.RABBITMQ_URL = "amqp://yourName:yourPass123@46.8.45.97";
require('babel-register')({
	"presets": ["es2015", "react", "stage-0", "stage-1"],
	"plugins": ["transform-decorators-legacy"],
	ignore: false,
	only: /(db)|(checker\.js)/
});
require(__dirname+'/checker.js');