iris.ui(function(self) {
	
	var app = iris.resource(iris.path.resource.app);
	self.settings({"item": null});
	
	self.create = function() {
		self.tmpl(iris.path.ui.try.html);
		var method = self.setting("item");
		self.get("result").hide();
		self.get("clear-results").hide();
		

		self.get("clear-results").click(
			function(e) {
				self.get("result").hide(400);
				self.get("clear-results").hide();
				e.preventDefault();
			}
		);
		
		self.get("try").click(
			function() {
				app.try(method, function(data) {
					console.log(data)
					self.get("clear-results").show();
					self.get("response-code").html(data.statusCode);
					self.get("response-body").html(data.body);
					self.get("response-headers").html(JSON.stringify(data.headers));
					self.get("result").show();
				});
			}
		);
	}



}, iris.path.ui.try.js);