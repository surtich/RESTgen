iris.ui(function(self) {
	self.create = function() {
		self.tmpl(iris.path.ui.input_item.html);
		self.get('item').val(self.setting('value'));
	}

	self.val = function(val) {
		if (val) {
			self.get('item').val(val);
		} else {
			return self.get('item').val();	
		}
		
	}

}, iris.path.ui.input_item.js);