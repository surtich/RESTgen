iris.ui(function(self) {

	self.settings({"item": null});
	
	self.create = function() {
		self.tmpl(iris.path.ui.try.html);
		var method = self.setting("item");
		var endpoint = method.parent;
		var version = endpoint.parent;
		var api = version.parent;

		
		self.get("try").click(
			function() {
				var settings = {
					type: method.method,
					url: version.protocol + "://" + version.host + ":" + (version.port || 80) + version.path + method.path
				};

				var data = {};
		
				for (var i = 0; i < method.param.length; i++) {
					var param = method.param[i];
					data[param.name] = param.value;
				}
				settings.data = data;
				console.log(settings)
				var popup = window.open();
				return
				$.ajax(settings).done(function(data, textStatus, jqXHR) {
					debugger
				}).fail(function(jqXHR, textStatus, errorThrown) {
					debugger
				});
			}
		);
	}



}, iris.path.ui.try.js);