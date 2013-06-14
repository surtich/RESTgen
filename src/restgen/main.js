var commons  = require('../lib/commons.js')
,   express  = commons.express
,	app  = express()
,    config  = require('../lib/config/local.json');

app.configure(
	function() {
		console.log(__dirname)
		app.use( express.static(__dirname + '/../www') );
		app.use(
			express.errorHandler(
				{	dumpExceptions : true
				,	showStack : true
				}
			)
		);
		app.listen(config.port);
		console.log('Listen	ing in port ' + config.port);
	}
);
