iris.ui(function(self) {
	self.create = function() {
		self.tmpl(iris.path.ui.select_field.html);
		
		var values = self.setting("schema").values.split(",");
		var html = ""
		for (var i = 0; i < values.length; i++) {
			var value = values[i].trim();
			html += "<option value='" + value + "'>" + value + "</option>";
		}

		//self.get('field').val(self.setting('value')).attr("placeholder", self.setting('name'));

		self.get('field').html(html).val(self.setting('value'));
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

}, iris.path.ui.select_field.js);