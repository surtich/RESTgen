iris.ui(function(self) {
	
	var app = iris.resource(iris.path.resource.app);
	self.settings({"item": null});
	
	self.create = function() {
		self.tmpl(iris.path.ui.try.html);
		var method = self.setting("item");
		
		
		self.get("try").click(
			function() {
				app.try(method, function() {
					
				})
			}
		);
	}



}, iris.path.ui.try.js);