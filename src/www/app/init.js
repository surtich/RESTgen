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
		details: {
			js: 'app/screen/details.js',
			html: 'app/screen/details.html'
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
		list_table: {
			html: 'app/ui/list_table.html'
		},
		item: {
			js: 'app/ui/item.js',
			html: 'app/ui/item.html'
		},
		item_row: {
			html: 'app/ui/item_row.html'
		},
		field: {
			js: 'app/ui/field.js',
			html: 'app/ui/field.html'
		},
		field_cell: {
			html: 'app/ui/field_cell.html'
		},
		input_field: {
			js: 'app/ui/input_field.js',
			html: 'app/ui/input_field.html'
		},
		select_field: {
			js: 'app/ui/select_field.js',
			html: 'app/ui/select_field.html'
		},
		textarea_field: {
			js: 'app/ui/textarea_field.js',
			html: 'app/ui/textarea_field.html'
		},
		checkbox_field: {
			js: 'app/ui/checkbox_field.js',
			html: 'app/ui/checkbox_field.html'
		},
		"try": {
			js: 'app/ui/try.js',
			html: 'app/ui/try.html'
		},
		"code": {
			js: 'app/ui/code.js',
			html: 'app/ui/code.html'
		}
	},
	resource: {
		app: 'app/resource/app.js',
		try: 'app/resource/try.js',
		code: 'app/resource/code.js'
	}
};


iris.evts = {
	changeState: 'CHANGE_STATE',
	try: "TRY",
	copy: "COPY",
	edit: "EDIT",
	endEdit: "END_EDIT"
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

