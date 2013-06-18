iris.screen(function(self) {

	var app = iris.resource(iris.path.resource.app);
 var ui = null;

	self.create = function() {
		self.tmpl(iris.path.screens.api.html);	
	}
 
 self.awake = function(params) {
  if (ui) {
   ui.destroyUI();
  }
  app.getSchemas(function(schemas) {
			app.getApi(params.key, function(api) {
				if (!api) {
					alert("API not found: " + params.key);	
				} else {
					if (!api.endpoints) {
						api.endpoints = [];
					}
					ui = self.ui("endpoints", iris.path.ui.list.js, {"list": {'type': 'endpoint', "name": params.key, "items": api.endpoints, "schema": schemas.endpoint}});	
				}
				
			});
		});
 }

}, iris.path.screens.api.js);