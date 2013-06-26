iris.ui(function(self) {
	self.create = function() {
		self.tmpl(iris.path.ui.input_field.html);
		self.get('field').val(self.setting('value')).attr("placeholder", self.setting('name'));
		if (self.setting("onchange")) {
			self.get('field').change(function () {
				self.setting("onchange")(this.value);
			});	
		}
		
	}

	self.val = function(val) {
		if (val) {
			self.get('field').val(val);
		} else {
			return self.get('field').val();	
		}
		
	}

}, iris.path.ui.input_field.js);