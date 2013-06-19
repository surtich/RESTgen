iris.ui(function(self) {

	var editable = false;
	var showDetails = false;
	var ui = null;

	var app = iris.resource(iris.path.resource.app);

	self.create = function() {
		ui = self.setting('ui');
		self.tmpl(iris.path.ui.item_actions.html);
		self.get("btnDetails").hide();
		self.on(iris.evts.changeState, function() {
			if (!app.isEditable()) {
				self.get('btnCancel').trigger('click');				
			} else {
				render();	
			}
			
		});
		
		self.get('btnDetails').click(function() {
			showDetails = !showDetails;
			ui.showValues(showDetails);
			render();
		});

		self.get('btnEdit').click(function() {
			editable = true;
			ui.setEditable(editable);
		});

		self.get('btnOK').click(function() {
			editable = false;
			ui.save();
		});

 
		self.get('btnCancel').click(function() {
			editable = false;
			ui.cancel();
		});

		self.get('btnDelete').click(function() {
			ui.del();
		});

		self.get('btnCopy').click(function() {
			ui.copy();
		});

		self.get('btnUp').click(function() {
			ui.move(ui.setting("pos") , ui.setting("pos") - 1);
		});

		self.get('btnDown').click(function() {
			ui.move(ui.setting("pos") , ui.setting("pos") + 1);
		});


		render();

		self.render = render;
	};

	
	function render() {
		self.get('lblOK').toggle(app.isEditable() && showDetails && editable);
		self.get('lblCancel').toggle(app.isEditable() && showDetails && editable);
		self.get('lblEdit').toggle(app.isEditable() && showDetails && !editable);
		self.get('lblDelete').toggle(app.isEditable() && !editable);
		self.get('lblCopy').toggle(app.isEditable() && !editable);
		self.get('lblUp').toggle(app.isEditable() && !editable && ui.setting("pos") != 0);
		self.get('lblDown').toggle(app.isEditable() && !editable && ui.setting("pos") < ui.setting("size") - 1);
		self.get('lblDetails').toggleClass("open", !showDetails);
		self.get('lblDetails').toggleClass("close", showDetails);
	}


}, iris.path.ui.item_actions.js);
