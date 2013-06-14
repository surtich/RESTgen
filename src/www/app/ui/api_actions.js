iris.ui(function(self) {

	var app = iris.resource(iris.path.resource.app);
	var showDetails = false;
	var editable = false; 
	var items = null;

	self.create = function() {
		items = self.setting('items');
		self.tmpl(iris.path.ui.apiActions.html);
		self.on(iris.evts.changeState, function() {
			editable = false;
			render();
		});
		
		self.get('btnDetails').click(function() {
			showDetails = !showDetails;
			self.setting('values').slideToggle(showDetails);
			render();
		});

		self.get('btnEdit').click(function() {
			editable = true;
			render();
		});

		self.get('btnOK').click(function() {
			editable = false;
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				item.save();
			}
			render();
		});

 
		self.get('btnCancel').click(function() {
			editable = false;
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				item.cancel();
			}
			render();
		});

		render();
	};

	function cancel(){
	}

	function save(){
	}

	function render() {
		self.get('btnOK').toggle(app.isEditable() && showDetails && editable);
		self.get('btnCancel').toggle(app.isEditable() && showDetails && editable);
		self.get('btnEdit').toggle(app.isEditable() && showDetails && !editable);
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			item.setEditable(app.isEditable() && editable);	
		}
		
	}


}, iris.path.ui.apiActions.js);
