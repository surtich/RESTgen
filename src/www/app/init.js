iris.path = {
	welcome: {
		js: 'app/screen/welcome.js',
		html: 'app/screen/welcome.html'
	},
	screens: {
		apis: {
			js: 'app/screen/apis.js',
			html: 'app/screen/apis.html'
		}
	},
	ui: {
		appActions: {
			js: 'app/ui/app_actions.js',
			html: 'app/ui/app_actions.html'
		},
		apiActions: {
			js: 'app/ui/api_actions.js',
			html: 'app/ui/api_actions.html'
		},
		api: {
			js: 'app/ui/api.js',
			html: 'app/ui/api.html'
		},
		item: {
			js: 'app/ui/item.js',
			html: 'app/ui/item.html'
		},
		input_item: {
			js: 'app/ui/input_item.js',
			html: 'app/ui/input_item.html'
		},
		radio_item: {
			js: 'app/ui/radio_item.js',
			html: 'app/ui/radio_item.html'
		}
	},
	resource: {
		app: 'app/resource/app.js'
	}
};


iris.evts = {
	changeState: 'CHANGE_STATE'
};

$(document).ready(
	function () {
		iris.translations('en-US', './app/lang/en-us.js');

		iris.baseUri('./');

		iris.locale(
			'en-US', {
				dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				dateFormat: 'd M Y H:i:s',
				currency: {
					formatPos: 'n',
					formatNeg: '-n',
					decimal: '.',
					thousand: ',',
					precision: 2
				}
			}
			);

		iris.welcome(iris.path.welcome.js);
	}
);