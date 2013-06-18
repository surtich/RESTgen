iris.ui(function(self) {
	var api = null;
	var items = [];
	self.create = function() {

		api = self.setting('api');

		self.tmplMode(self.APPEND);
		self.tmpl(iris.path.ui.api.html);
		self.get('api').attr('href',"#").text(api.name);

		render();
		for (var itemName in api.items) {
			items.push(self.ui('values', iris.path.ui.item.js, {'api': api, 'item': {'name': itemName, 'value': api.items[itemName], schema: api.schema[itemName]}}));
		}

		self.ui('actions', iris.path.ui.apiActions.js, {values: self.get('values'), items: items});

	}

	function render() {
		self.get('values').hide();
	}


}, iris.path.ui.api.js);