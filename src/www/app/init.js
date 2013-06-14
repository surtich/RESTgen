iris.path = {
	welcome: {
		js: 'app/screen/welcome.js',
		html: 'app/screen/welcome.html'
	},
	screens: {
		apis: {
			js: 'app/screen/apis.js',
			html: 'app/screen/apis.html'
		},
		endpoints: {
			js: 'app/screen/endpoints.js',
			html: 'app/screen/endpoints.html'
		}
	},
	ui: {
		appActions: {
			js: 'app/ui/app_actions.js',
			html: 'app/ui/app_actions.html'
		},
		list_actions: {
			js: 'app/ui/list_actions.js',
			html: 'app/ui/list_actions.html'
		},
		item_actions: {
			js: 'app/ui/item_actions.js',
			html: 'app/ui/item_actions.html'
		},
		list: {
			js: 'app/ui/list.js',
			html: 'app/ui/list.html'
		},
		item: {
			js: 'app/ui/item.js',
			html: 'app/ui/item.html'
		},
		field: {
			js: 'app/ui/field.js',
			html: 'app/ui/field.html'
		},
		input_field: {
			js: 'app/ui/input_field.js',
			html: 'app/ui/input_field.html'
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