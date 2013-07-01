iris.ui(function(self) {
	
	var test = iris.resource(iris.path.resource.try);
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
		
		self.get("server-try").click(
			function() {
				test.serverTry(method, function(data) {
					processresults(data);
				});
			}
		);

		self.get("client-try").click(
			function() {
				test.clientTry(method, function(data) {
					processresults(data);					
				});
			}
		);

		function processresults(data) {
			console.log(data)
			var body = data.body;
			var headers = data.headers;
			if (typeof body !== "string") {

				body = JSON.stringify(body);
			}
			if (typeof headers !== "string") {

				headers = JSON.stringify(headers);
			}
			self.get("clear-results").show();
			self.get("response-code").html(data.statusCode);
			self.get("response-body").html(body);
			self.get("response-headers").html(headers);
			self.get("result").show();
		}
	}



}, iris.path.ui.try.js);