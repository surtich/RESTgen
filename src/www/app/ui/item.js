iris.ui(function(self) {

 var item = null;
 var schema = null;
 var showDetails = false;
 var editable = false;
 var fields = [];
 var app = iris.resource(iris.path.resource.app);
 var actions = null;
 var key = null;
 var link = true;
 var lists = [];
 var view = null;

 self.settings({"view": null});

 self.create = function() {
  item = self.setting('item');
  view = self.setting('view');
  schema = self.setting('schema');
  self.tmplMode(self.APPEND);
  self.tmpl(iris.path.ui.item.html);


  for (var fieldName in schema) {
    if (schema[fieldName].key) {
      self.get('name').text(item[fieldName]);
      key = fieldName;
      if (schema[fieldName].link === false) {
        link = schema[fieldName].link;
        self.get('name').addClass("no_events");
      }
    }
    changeLink();

    var container = 'values';
    if (schema[fieldName].inline) {
      if (schema[fieldName].pre) {
        container = "pre-inline-values";
      } else {
        container = "inline-values";
      }
    }

    if (schema[fieldName].type !== "list") {
      fields.push(self.ui(container, iris.path.ui.field.js, {
        field: {
         name: fieldName,
         value: item[fieldName] || "",
         schema: schema[fieldName]
        },
        item: item,
        parent: self,
        "table": view == "table"
       }));

    } else {
      var nameSchema = schema[fieldName].schema;
      app.getSchemas(function(schemas) {
        var listSchema = schemas[nameSchema];
        if (!item[fieldName]) {
          item[fieldName] = [];
        }

        lists.push(self.ui(container, iris.path.ui.list.js, {"list": {'type': nameSchema, "name": nameSchema, "items": item[fieldName], "schema": listSchema}, "link_schema":  self.setting('link_schema') +  "=" + item[key] + "&" + fieldName, view: schema[fieldName].view}));
      });
    }
  
  }

  
  actions = self.ui('actions', iris.path.ui.item_actions.js, {
   'ui': self
  });

  self.item = item;
  self.showValues = showValues;
  self.toggleAll = toggleAll;
  self.setEditable = setEditable;
  self.save = save;
  self.cancel = cancel;
  self.del = del;
  self.copy = copy;
  self.move = move;
  self.render = render;
  self.actions = actions;


  render();

 }

 function showValues(visible) {
  if (self.get('values').css("display") === "none" && visible || self.get('values').css("display") === "block" && !visible ) {
   self.get('values').slideToggle();
   showDetails = visible;
  }
 }

 function toggleAll(visible) {
  showValues(visible);
  for (var i = 0; i < lists.length; i++) {
    var list = lists[i];
    for (var j = 0; j < list.items.length; j++) {
      var item = list.items[j];
      item.toggleAll(visible);
      item.actions.showDetails(visible);
    }

  }
 }


 function setEditable(state) {
  editable = state;
  render();
 }

 function save() {
  for (var i = 0; i < fields.length; i++) {
   var field = fields[i];
   field.save();
  }

  if (key) {
    self.get('name').text(item[key]);
  }

  changeLink();


  editable = false;
  render();
 }

 function cancel() {
  for (var i = 0; i < fields.length; i++) {
   var field = fields[i];
   field.cancel();
  }
  editable = false;
  render();
 }

 function del() {
  self.destroyUI();
  self.setting('delete')(self.setting('pos'));
 }

 function copy() {
  self.setting('add')(item);
 }

 function render() {

  self.get('values').toggle(showDetails);
  for (var i = 0; i < fields.length; i++) {
   var field = fields[i];
   field.setEditable(app.isEditable() && editable);	
  }
  actions.render();
 }

 function move(pos1, pos2) {
  self.setting('move')(pos1, pos2);	
 }

 function changeLink() {
  if (self.setting('link_schema') && key && link) {
    self.get("name").attr("href", "#/details?" + self.setting('link_schema') +  "=" + item[key]);
  }
 }

  


}, iris.path.ui.item.js);