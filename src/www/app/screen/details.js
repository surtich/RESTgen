iris.screen(function(self) {

	var app = iris.resource(iris.path.resource.app);
 	var ui = null;
 	var order = app.order;  	

	self.create = function() {
		self.tmpl(iris.path.screens.details.html);	
	}
 
 self.awake = function(params) {
	  if (ui) {
	   ui.destroyUI();
	  }
	app.getSchemas(function(schemas) {
	  app.getApi(params.api, function(api) {

	  	var items = api;
	  	var schema = schemas.api;
	  	var type = "api";
	  	var key = "name";
	  	var nextType = "api";
	  	var itemParent = null;

	  	for (var i = 0; i < order.length - 1; i++) {
	  		var elem = order[i];
	  		for (list in elem) {
	  			if (params[list]) {
	  				var next = order[i + 1];
	  				for (list2 in next) {
	  					if( Object.prototype.toString.call( items ) === '[object Array]' ) {
	  						for (var fieldName in schema) {
	  							if (schema[fieldName].key) {
	  								key = fieldName;
	  								break;
	  							}
	  						}
	  						for (var j = 0; j < items.length; j++) {
	  							var item = items[j];
	  							if (item[key] == params[list]) {
	  								items = item;
	  								break;
	  							}
	  						}
	  					}
	  					items.parent = itemParent;
	  					itemParent = items;
	  					items = items[list2];
	  					schema = schemas[next[list2]];
	  					
	  					break;
	  				}
	  				type = list;
	  				nextType = list2;
	  				break;
	  			}
	  		}
	  	}

	  	ui = self.ui("values", iris.path.ui.list.js, {"list": {'type': nextType, "name": params[type], "hideName": true, "items": items, "itemParent": itemParent, "schema": schema}, "link_schema": location.hash.replace(/^.*\?/,"") + "&" + nextType});
	  });
  	});
 }


}, iris.path.screens.details.js);