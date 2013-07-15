iris.ui(function(self) {
	self.create = function() {
		self.tmpl(iris.path.ui.checkbox_field.html);
		self.get('field').val(self.setting('value')).attr("placeholder", self.setting('name')).click(function (e) {
			if ($(this).prop("checked")) {
				$(this).val("true");
			} else {
				$(this).val("false");
			}
		});
		self.val(self.setting('value'));
		if (self.setting("onchange")) {
			self.get('field').change(function () {
				self.setting("onchange")(this.value);
			});	
		}
		
	}

	self.val = function(val) {
		if (val) {
			self.get('field').val(val).prop("checked", val === "true");

		} else {
			return self.get('field').val();	
		}
		
	}

}, iris.path.ui.checkbox_field.js);