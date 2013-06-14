iris.screen(function(self) {

	var app = iris.resource(iris.path.resource.app);

	self.create = function() {
		self.tmpl(iris.path.screens.apis.html);
		self.ui('footer', iris.path.ui.appActions.js);
		app.getSchemas(function(schemas) {
			app.getApis(function(apis) {
				for (var apiName in apis) {
					self.ui("apis", iris.path.ui.api.js, {"api": {"name": apiName, "items": apis[apiName], "schema": schemas.api}});	
				}
			});
		});
	}

}, iris.path.screens.apis.js);