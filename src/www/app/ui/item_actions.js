iris.ui(function(self) {

	var editable = false;
	var showDetails = false;
	var showPaste = false;
	var expandAll = false;
	var ui = null;
 	var filter = "";
 	var canCopy = true;

	var app = iris.resource(iris.path.resource.app);

	self.create = function() {
		ui = self.setting('ui');
		self.tmpl(iris.path.ui.item_actions.html);
		self.get("btnDetails").hide();
  		self.get('txtFilter').hide();

	};

	self.init = function() {

  		if (ui.canFilter === false) {
  			self.get('filter').hide();
  		}

  		if (ui.expand === false) {
  			self.get("lblExpandAll").hide();
  			self.get("lblCollapseAll").hide();
  		}

  		if (ui.details === false) {
  			self.get("lblDetails").hide();
  		}

  		if (ui.canCopy === false) {
  			canCopy = false;
  		}
		self.on(iris.evts.changeState, function() {
			if (!app.isEditable()) {
				self.get('btnCancel').trigger('click');				
			} else {
				render();	
			}
			
		});

		self.on(iris.evts.edit, function() {
			self.get().find("button, input").prop('disabled', true);
		});

		self.on(iris.evts.endEdit, function() {
			self.get().find("button, input").prop('disabled', false);
		});


		self.canCopy = true;
		
		self.get('btnDetails').click(function() {
			showDetails = !showDetails;
			ui.showValues(showDetails);
			render();
		});

		self.get('btnExpandAll').click(function() {
			showDetails = true;
			ui.toggleAll(true);
			render();
		});

		self.get('btnCollapseAll').click(function() {
			showDetails = false;
			ui.toggleAll(false);
			render();
		});

		self.get('btnEdit').click(function() {
			editable = true;
			showDetails = true;
			ui.showValues(showDetails);
			ui.setEditable(editable);
			self.notify(iris.evts.edit);
			self.get("btnOK").prop('disabled', false);
			self.get("btnCancel").prop('disabled', false);
		})

		self.get('btnOK').click(function() {
			editable = false;
			ui.save();
			self.notify(iris.evts.endEdit);
		});


		self.get('btnCancel').click(function() {
			editable = false;
			ui.cancel();
			self.notify(iris.evts.endEdit);
		});

		self.get('btnDelete').click(function() {
			ui.del();
		});

		self.get('btnDuplicate').click(function() {
			ui.copy();
		});

		self.get('btnPaste').click(function() {
			ui.paste();
		});



-		self.get('btnCopy').click(function() {
			app.copy(ui.item, ui.schema);
		});

		self.get('btnUp').click(function() {
			ui.move(ui.setting("pos") , ui.setting("pos") - 1);
		});

		self.get('btnDown').click(function() {
			ui.move(ui.setting("pos") , ui.setting("pos") + 1);
		});
  
		  self.get('btnFilter').click(function() {
		   var txtFilter = self.get("txtFilter");
		   if (txtFilter.val().trim() == "") {
		    txtFilter.toggle();
		   } else {
		    if (txtFilter.val() !== filter) {
		     self.get('btnExpandAll').trigger('click');
		     filter = txtFilter.val();
		    } else {
		     txtFilter.val("").hide();
		     filter ="";
		    }
		    ui.filter(filter, true);
		    if (ui.canFilter === false) {
		 		self.get("filter").hide();
		    }
		    
		   }
		});

	 	self.filter = function(f) {
	 		filter = f;
	 		self.get("txtFilter").val(filter).toggle(filter != "");
	 		if (ui.canFilter === false && ui.unFilter === true) {
	 			self.get("txtFilter").hide();
	 			self.get("filter").toggle(filter != "");
	 		}
	 	}


			render();

			self.render = render;
	};

	self.showDetails = function(visible) {
		showDetails = visible;
		render();
	}

	self.showPaste = function(visible) {
		showPaste = visible;
		render();	
	}


	self.edit = function () {
		self.get('btnEdit').trigger("click");
	}
	
	function render() {
		self.get('lblOK').toggle(app.isEditable() && showDetails && editable);
		self.get('lblCancel').toggle(app.isEditable() && showDetails && editable);
		self.get('lblEdit').toggle(app.isEditable() && !editable);
		self.get('lblDelete').toggle(app.isEditable() && !editable);
		self.get('lblCopy').toggle(app.isEditable() && !editable && canCopy);
		self.get('lblPaste').toggle(app.isEditable() && !editable && showPaste);
		self.get('lblDuplicate').toggle(app.isEditable() && !editable);
		self.get('lblUp').toggle(app.isEditable() && !editable && ui.setting("pos") != 0);
		self.get('lblDown').toggle(app.isEditable() && !editable && ui.setting("pos") < ui.setting("size") - 1);
		self.get('lblDetails').toggleClass("open", !showDetails);
		self.get('lblDetails').toggleClass("close", showDetails);
	}


}, iris.path.ui.item_actions.js);
