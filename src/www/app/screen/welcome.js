iris.screen(function(self) {
	self.create = function() {
		self.tmpl(iris.path.welcome.html);
  self.ui('footer', iris.path.ui.appActions.js, {}, self.PREPEND);
  
		self.screens('screens',
			[
				[ 'apis', iris.path.screens.apis.js],
				[ 'details', iris.path.screens.details.js]
			]
			);
		self.on(iris.AFTER_NAVIGATION, updateBreadcrumb);


		self.on(iris.evts.edit, function() {
			self.get("breadcrumb").find("a").bind("click", function(e) {
				e.preventDefault();
			});
		});

		self.on(iris.evts.endEdit, function() {
			self.get("breadcrumb").find("a").unbind("click");
		});

		
		
	}

	self.awake = function() {
		if (!location.hash || location.hash == "#") {
			iris.navigate('#/apis');	
		}
	}

	function updateBreadcrumb() {
		const START = "#/details?"
		var pos = location.hash.indexOf(START);
		var html = "";
		var href = START;
		if (pos === 0) {
			html += "<li><a href='#/apis'>" + iris.translate("ACTIONS.HOME") + "</a></li>";
			var params = location.hash.substr(pos + START.length).split("&");
			for (var i = 0; i < params.length; i++) {
				var param = params[i];
				var title = param.substr(0, param.indexOf("="));
				var value = param.substr(param.indexOf("=") + 1);
				if (i > 0) {
					href += "&";	
				}
				href += param;
				var link = "<li><a href='"+ href +"'>" + value + "</a></li>";
				html += link;
			}
		}
		self.get("breadcrumb").html(html);
		
	}

}, iris.path.welcome.js);