process.env.RETHINKDB_URL = "rethinkdb://207.38.84.54/gambling";
process.env.RABBITMQ_URL = "amqp://test:test@207.38.84.54";
require('babel-register')({
	"presets": ["es2015", "react", "stage-0", "stage-1"],
	"plugins": ["transform-decorators-legacy"],
	ignore: false,
	only: /(db)|(checker\.js)|(sender\.js)/
});
require(__dirname+'/sender.js');