iris.ui(function(self) {

	var editable = false;
	var editor = null;
	var field = null;
	var item = null;
	var schema = null;
	
	self.create = function() {
		field = self.setting('field');
		item = self.setting('item');
		schema = field.schema;
		self.tmplMode(self.APPEND);
		self.tmpl(iris.path.ui.field.html);
		self.get('field').addClass("field " + field.name);
		self.get('name').text(field.name + ":");
		self.get('value').text(field.value);
		

		if (schema.inline) {
      		self.get('field').addClass("inline");
      		self.get('name').hide();
    	}

		editor = self.ui('editor', iris.path.ui[(field.schema && field.schema.view || 'input') + '_field'].js, {value: field.value}, self.APPEND);
		render();
	}

	self.setEditable = function(state) {
		editable = state;
		render();
	}


	self.val = function() {
		return editor.val();
	}

	self.save = function() {
		item[field.name] = editor.val();
		field.value = editor.val();
		self.get('value').text(field.value);
		self.setEditable(false);
	}

	self.cancel = function() {
		if (field.value) {
			editor.val(field.value);
		} else {
			editor.get(0).get(0).value = "";
		}
		self.setEditable(true);
	}

	function render() {
		self.get('editor').toggle(editable);
		self.get('value').toggle(!editable);
		if (schema.show === false) {
			self.get().toggle(editable);
		}
	}



}, iris.path.ui.field.js);