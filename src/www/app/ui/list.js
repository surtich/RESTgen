iris.ui(function(self) {
	var list = null;
	var items = [];
	var app = iris.resource(iris.path.resource.app);

	self.settings({"view": null, "schema": null});

	self.create = function() {

		list = self.setting('list');
		self.tmplMode(self.APPEND);
		if (self.setting("view") === "table") {
			//self.get("values").addClass("table");
			self.tmpl(iris.path.ui.list_table.html);

			createTableHeader();
			self.header = self.get('header');
		} else {
			self.tmpl(iris.path.ui.list.html);
		}


		self.get('list').addClass("list " + list.type);
		self.get('list').toggle(false);
		self.get('list').attr('href',"#").text(list.name);
		if (window.location.href.indexOf("#/details") != -1 || list.type == "api") {
			self.ui('actions', iris.path.ui.list_actions.js, {'add': newItem, 'list': list});	
			createUIs();
		}

		self.add = newItem;
		
	}

	function createTableHeader() {
		var html = "<tr data-id='header'><td class='field'></td><td class='field'>" + list.type + "</td>";
		for (var fieldName in list.schema) {
			var field = list.schema[fieldName];
			var style = "";
			if (field.show === false) {
				style = "data-show='x' style='display:none'";
			}
			if (field.inline) {
				html += "<td class='field' " + style + ">" + fieldName + "</td>";
			}
		}
		html += "<td></td></tr>";
		self.get("values").html(html);

	}

	function createUIs() {
		items = [];
		self.items = items;
		if (!list.items) {
			list.items = [];
		}

		for (var i = 0; i < list.items.length; i++) {
			var item = list.items[i];
			add(item, list.schema, i);
		}

		render();
	}

	function add(item, schema, pos, size, autoEdit) {
		var ui = self.ui('values', iris.path.ui.item.js, {'link_schema': self.setting('link_schema'), 'item': item, 'itemParent': list.itemParent, 'schema': schema, 'pos': pos, 'size': list.items.length, 'delete': del, 'add': newItem, 'move': move, 'render': render, 'view': self.setting("view"), header: self.header, autoEdit: autoEdit || false});
		
		items.push(ui);

		return ui;
	}

	function newItem(clon, createUI) {
		var item = app.clone(clon) || {};
		for (var fieldName in list.schema) {
			if (list.schema[fieldName].key) {
				item[fieldName] = ( clon ? clon[fieldName] + "_" + iris.translate("STATES.COPY") : list.schema[fieldName].default || iris.translate("STATES.NEW") + "_" + (list.type || list.name) );	
			}

			if (!clon) {
				if (list.schema[fieldName].default) {
					item[fieldName] = list.schema[fieldName].default;
				}

				if (list.schema[fieldName].type == "list") {
					item[fieldName] = [];
				}
			}
		}

		item.parent = list.itemParent;

		list.items.push(item);
		if (createUI !== false) {
			var ui = add(item, list.schema, list.items.length - 1, list.items.length, true);
			updateSize();
			render();	
		}	
	}


	function del(pos) {
		list.items.splice(pos, 1);
		for (var i = pos + 1; i < items.length; i++) {
			var item = items[i];
			item.setting('pos', i - 1);
		}
		updateSize();		
		items.splice(pos, 1);
		render();
	}

	function move(pos1, pos2) {
		for (var i = 0; i < items.length; i++) {
			var ui = items[i];
			ui.destroyUI();
		}
		var item = list.items[pos1];
		list.items[pos1] = list.items[pos2];
		list.items[pos2] = item;
		createUIs();
	}

	function updateSize() {
		for (var i = 0; i < items.length; i++) {
			var ui = items[i];	
			ui.setting('size', list.items.length);
		}
	}


	function render() {
		for (var i = 0; i < items.length; i++) {
			var ui = items[i];
			ui.render();
		}
	}


}, iris.path.ui.list.js);