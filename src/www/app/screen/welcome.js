iris.screen(function(self) {
	self.create = function() {
		self.tmpl(iris.path.welcome.html);
  self.ui('footer', iris.path.ui.appActions.js);
  
		self.screens('screens',
			[
				[ 'apis', iris.path.screens.apis.js],
				[ 'details', iris.path.screens.details.js]
			]
			);
		self.on(iris.AFTER_NAVIGATION, updateBreadcrumb);
		
		
	}

	self.awake = function() {
		iris.navigate('#/apis');
	}

	function updateBreadcrumb() {
		const START = "#/details?"
		var pos = location.hash.indexOf(START);
		var html = "";
		var href = START;
		if (pos === 0) {
			html += "<a href='#/apis'>#</a>";
			var params = location.hash.substr(pos + START.length).split("&");
			for (var i = 0; i < params.length; i++) {
				var param = params[i];
				var title = param.substr(0, param.indexOf("="));
				var value = param.substr(param.indexOf("=") + 1);
				if (i > 0) {
					href += "&";	
				}
				href += param;
				var link = "<a href='"+ href +"'>" + value + "</a>";
				html += " > " + link;
			}
		}
		self.get("breadcrumb").html(html);
		
	}

}, iris.path.welcome.js);