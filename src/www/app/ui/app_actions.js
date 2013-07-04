iris.ui(function(self) {

	var app = iris.resource(iris.path.resource.app);

	self.create = function() {
		self.tmpl(iris.path.ui.appActions.html);
		self.on(iris.evts.changeState, render);
		self.get('btnSave').click(function() {
			app.setEditable(false);
			app.save();
		});
		self.get('btnCancel').click(function() {
			app.setEditable(false);
		});
		self.get('btnEdit').click( function() {
			app.setEditable(true);
		});

		self.on(iris.evts.edit, function() {
			self.get().find("button, input").prop('disabled', true);
		});

		self.on(iris.evts.endEdit, function() {
			self.get().find("button, input").prop('disabled', false);
		});

		render();
	};

	function cancel(){
	}

	function save(){
	}

	function render() {
		self.get('btnSave').toggle(app.isEditable());
		self.get('btnCancel').toggle(app.isEditable());
		self.get('btnEdit').toggle(!app.isEditable());
	}


}, iris.path.ui.appActions.js);
