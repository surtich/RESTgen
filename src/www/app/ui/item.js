iris.ui(function(self) {

 var item = null;
 var schema = null;
 var showDetails = false;
 var editable = false;
 var fields = [];
 var app = iris.resource(iris.path.resource.app);
 var actions = null;
 var key = null;

 self.create = function() {
  item = self.setting('item');
  schema = self.setting('schema');
  self.tmplMode(self.APPEND);
  self.tmpl(iris.path.ui.item.html);

  for (var fieldName in schema) {
    if (schema[fieldName].key) {
      self.get('name').text(item[fieldName]);
      key = fieldName;
    }
    changeLink();

    var container = 'values';
    if (schema[fieldName].inline) {
      container = "inline-values"
    }

    if (schema[fieldName].type !== "list") {
      fields.push(self.ui(container, iris.path.ui.field.js, {
        field: {
         name: fieldName,
         value: item[fieldName] || "",
         schema: schema[fieldName]
        },
        item: item
       }));
    } else {
      var nameSchema = schema[fieldName].schema;
      app.getSchemas(function(schemas) {
        var schema = schemas[nameSchema];
        if (!item[fieldName]) {
          item[fieldName] = [];
        }
        self.ui(container, iris.path.ui.list.js, {"list": {'type': nameSchema, "name": nameSchema, "items": item[fieldName], "schema": schema}, "link_schema":  self.setting('link_schema') +  "=" + item[key] + "&" + fieldName});
      });
    }
  
  }

  self.item = item;
  self.showValues = showValues;
  self.setEditable = setEditable;
  self.save = save;
  self.cancel = cancel;
  self.del = del;
  self.copy = copy;
  self.move = move;
  self.render = render;

  actions = self.ui('actions', iris.path.ui.item_actions.js, {
   'ui': self
  });

  render();

 }

 function showValues(visible) {
  if (showDetails != visible) {
   self.get('values').slideToggle();
   showDetails = visible;
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
  if (self.setting('link_schema') && key) {
    self.get("name").attr("href", "#/details?" + self.setting('link_schema') +  "=" + item[key]);
  }
 }

  


}, iris.path.ui.item.js);