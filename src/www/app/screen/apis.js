iris.screen(function(self) {

	var app = iris.resource(iris.path.resource.app);

	self.create = function() {
		self.tmpl(iris.path.screens.apis.html);
		self.ui('footer', iris.path.ui.appActions.js);
		app.getSchemas(function(schemas) {
			app.getApis(function(apis) {
				self.ui("apis", iris.path.ui.list.js, {"list": {"name": apis.name, "items": apis.items, "schema": schemas.api}});
			});
		});
		
	}

}, iris.path.screens.apis.js);