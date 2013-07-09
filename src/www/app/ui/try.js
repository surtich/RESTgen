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
			var body = data.body;	
			var headers = data.headers;
			if (typeof body !== "string") {

				body = JSON.stringify(body);
			}
			if (typeof headers !== "string") {

				headers = JSON.stringify(headers);
			}
			self.get("clear-results").show();
			self.get("response-code").text(data.statusCode);
			self.get("response-body").text(body);
			self.get("response-headers").text(headers);
			self.get("result").show();
			hljs.highlightBlock(self.get("response-code").get(0), null, false);			
			hljs.highlightBlock(self.get("response-body").get(0), null, false);
			hljs.highlightBlock(self.get("response-headers").get(0), null, false);;
		}
	}



}, iris.path.ui.try.js);