iris.screen(function(self) {

	var app = iris.resource(iris.path.resource.app);

	self.create = function() {
		self.tmpl(iris.path.screens.apis.html);
		app.getSchemas(function(schemas) {
			app.getApis(function(apis) {
				self.ui("apis", iris.path.ui.list.js, {"list": {type: "api", "name": apis.name, "items": apis.items, "schema": schemas.api}, "link_schema": "api"});
			});
		});
		
	}

}, iris.path.screens.apis.js);