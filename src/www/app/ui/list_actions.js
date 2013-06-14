iris.ui(function(self) {

	var app = iris.resource(iris.path.resource.app);

	self.create = function() {
		self.tmpl(iris.path.ui.list_actions.html);
		self.on(iris.evts.changeState, render);
		
		self.get('btnAdd').click(function() {
			self.setting('add')();
		});

		render();
	}


	function render() {
		self.get('btnAdd').toggle(app.isEditable());
	}

}, iris.path.ui.list_actions.js);
