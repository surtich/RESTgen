iris.screen(function(self) {
	self.create = function() {
		self.tmpl(iris.path.welcome.html);
  self.ui('footer', iris.path.ui.appActions.js);
  
		self.screens('screens',
			[
				[ 'apis', iris.path.screens.apis.js],
				[ 'api', iris.path.screens.api.js]
			]
			);
		
		
	}

	self.awake = function() {
		iris.navigate('#/apis');
	}

}, iris.path.welcome.js);