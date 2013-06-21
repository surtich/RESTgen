iris.ui(function(self) {
	var list = null;
	var items = [];

	self.settings({"view": null});

	self.create = function() {

		list = self.setting('list');

		self.tmplMode(self.APPEND);
		self.tmpl(iris.path.ui.list.html);
		self.get('list').addClass("list " + list.type);
		self.get('list').toggle(false);
		self.get('list').attr('href',"#").text(list.name);
		self.ui('actions', iris.path.ui.list_actions.js, {'add': newItem, 'list': list});

		if (self.setting("view") === "table") {
			//self.get("values").addClass("table");
			createTableHeader();
		}

	
		createUIs();
		
	}

	function createTableHeader() {
		var html = "<div ><span class='cell2' id='first'>" + list.type + "</span>";
		for (var fieldName in list.schema) {
			var field = list.schema[fieldName];
			if (field.inline) {
				html += "<span class='cell'>" + fieldName + "</span>";
			}
		}
		html += "</div>";
		self.get("values").html(html);
		console.log($("#first").offset().left)

	}

	function createUIs() {
		items = [];
		self.items = items;
		for (var i = 0; i < list.items.length; i++) {
			var item = list.items[i];
			add(item, list.schema, i);
		}

		render();
	}

	function add(item, schema, pos, size) {
		var ui = self.ui('values', iris.path.ui.item.js, {'link_schema': self.setting('link_schema'), 'item': item, 'schema': schema, 'pos': pos, 'size': list.items.length, 'delete': del, 'add': newItem, 'move': move, 'render': render, 'view': self.setting("view")});
		ui.get("item").addClass("item " + list.type);
		items.push(ui);
	}

	function newItem(clon) {
		var item = $.extend({}, clon);
		for (var fieldName in list.schema) {
			if (list.schema[fieldName].key) {
				item[fieldName] = clon ? clon[fieldName] + "_" + iris.translate("STATES.COPY") : iris.translate("STATES.NEW") + "_" + (list.type || list.name);	
			} else {
				item[fieldName] = (clon ? clon[fieldName] : "");	
			}

			if (!clon && list.schema[fieldName].default) {
				item[fieldName] = list.schema[fieldName].default;
			}
		}

		list.items.push(item);
		
		add(item, list.schema, list.items.length - 1, list.items.length);
		updateSize();
		render();
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