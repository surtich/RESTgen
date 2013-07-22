iris.ui(function(self) {

	var editable = false;
	var editor = null;
	var field = null;
	var item = null;
	var schema = null;
	var filter = "";
	var onchange = null;

	self.settings({"table": null});
	
	self.create = function() {
		field = self.setting('field');
		item = self.setting('item');
		schema = field.schema;
		editable = schema.autoedit;

		self.item = item;
		self.schema = schema;
		
		self.tmplMode(self.APPEND);
		if (self.setting("table") && schema.inline !== false) {
      		self.tmpl(iris.path.ui.field_cell.html);
      	} else {
      		self.tmpl(iris.path.ui.field.html);	
      	}
		
		self.get('field').addClass("field " + field.name);
		self.get('name').text(field.name + ":");
		self.get('value').text(field.value);
	
		
		if (schema.inline) {
			if (!self.setting("table")) {
				self.get('field').addClass("inline");	
			}
      		self.get('name').hide();
    	}

    	if (schema.show_title === false) {
      		self.get('name').hide();
    	}

    	if (schema.value_as_css) {
    		self.get('field').addClass(field.value);
    		self.setting("parent").get("item").addClass(field.value);
    	}

    	if (schema.autoedit) {
    		onchange = function (value) {
				item[field.name] = value;
				field.value = value;
				self.get('value').text(value);
    		}
    	}


		editor = self.ui('editor', iris.path.ui[(field.schema && field.schema.view || 'input') + '_field'].js, {value: field.value, name: field.name, schema: schema, "onchange": onchange}, self.APPEND);
		//render();
	}

	self.setEditable = function(state) {
		editable = schema.autoedit || state;
		render();
	}


	self.val = function() {
		return editor.val();
	}

	self.save = function() {

		if (schema.value_as_css) {
    		self.get('field').removeClass(field.value).addClass(editor.val());
    		self.setting("parent").get("item").removeClass(field.value).addClass(editor.val());
    	}

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

	self.filter = function(f) {
		filter = f;
		var regExp = filter;
		var fieldName = "";
		var pos = f.indexOf(":");
		if (pos > -1) {
			fieldName = filter.substr(0, pos);
			regExp = filter.substr(pos + 1);
		}
		

		//console.log("filter=" + filter + " field.name =" + field.name + " field.value =" + field.value)
		
		var match = !filter || new RegExp(regExp, "ig").test(field.value);
		
		if (match && fieldName) {
			match = fieldName === field.name;
			
		}

		if (schema.show) {

			self.get('field').toggle(match === true);	
		}
		
		return match;
	}

	function render() {
		self.get('editor').toggle(editable);
		self.get('value').toggle(!editable);
		if (schema.show === false) {
			self.get().toggle(editable);
		}
	}



}, iris.path.ui.field.js);