iris.ui(function(self) {

	var editable = false;
	var editor = null;
	var item = null;
	var api = null;

	self.create = function() {
		item = self.setting('item');
		api = self.setting('api');

		self.tmplMode(self.APPEND);
		self.tmpl(iris.path.ui.item.html);
		render();
		self.get('name').text(item.name + ":");
		self.get('value').text(item.value);
		var schema = item.schema;
		editor = self.ui('editor', iris.path.ui[(schema.view || 'input') + '_item'].js, {value: item.value}, self.APPEND);
	}

	self.setEditable = function(state) {
		editable = state;
		render();
	}

	self.save = function() {
		api[item.name] = editor.val();
		item.value = api[item.name];
		self.get('value').text(item.value);
	}

	self.cancel = function() {
		editor.val(item.value);
	}

	function render() {
		self.get('editor').toggle(editable);
		self.get('value').toggle(!editable);
	}



}, iris.path.ui.item.js);