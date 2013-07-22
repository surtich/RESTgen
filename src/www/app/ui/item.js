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
 var listItemsLoaded = false;
 var listSchema = null;
 
 self.settings({"view": null, "header": null, "item": null, "itemParent": null, "autoEdit": false});

 self.create = function() {
  item = self.setting('item');
  item.parent = self.setting('itemParent');
  view = self.setting('view');
  schema = self.setting('schema');

  self.tmplMode(self.APPEND);


    self.on(iris.evts.edit, function() {
      self.get("name").bind("click", function(e) {
        e.preventDefault();
      });
    });

    self.on(iris.evts.endEdit, function() {
      self.get("name").unbind("click");
    });


  if (view === "table") {
    self.tmpl(iris.path.ui.item_row.html);
    self.get("line").addClass("field");
    self.get("actions").addClass("field");
  } else {
    self.tmpl(iris.path.ui.item.html);  

  }

  self.get().addClass("item");

  actions = self.ui('actions', iris.path.ui.item_actions.js, {
     'ui': self
    }, self.APPEND);

  
  for (var fieldName in schema) {
      if (schema[fieldName].key) {
        self.get('name').text(item[fieldName]);
        key = fieldName;
        if (schema[fieldName].link === false) {
          link = schema[fieldName].link;
          self.get('name').addClass("no_events");
        }
        if (schema[fieldName].filter === false) {
          self.canFilter = false;
        }
        if (schema[fieldName].unfilter) {
          self.unFilter = true;
        }
        if (schema[fieldName].expand === false) {
          self.expand = false;
        }
        if (schema[fieldName].details === false) {
          self.details = false;
        }
        if (schema[fieldName].canCopy === false) {
          self.canCopy = false;
        }
        if (schema[fieldName].showPastedItems === false) {
          self.showPastedItems = false;
        }
        if (schema[fieldName].more) {
          var uis = schema[fieldName].more.split(",");
          for (var i = 0; i < uis.length; i++) {
            var tokens = uis[i].split(".");
            var presenter = iris.path;
            for (var j = 0; j < tokens.length; j++) {
              var token = tokens[j];
              presenter = presenter[token];
            }
            self.ui("more", presenter, {item: item}, self.APPEND);
          }
        }
        changeLink(); 
      }
      var container = 'values';
      if (view == "table") {
        if (schema[fieldName].inline  === false) {
          container = 'values2';  
        } else {
          container = 'values';
        }
      } else {
        if (schema[fieldName].inline) {
          if (schema[fieldName].pre) {
            container = "pre-inline-values";
          } else {
            container = "inline-values";
          }
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
          if (app.getClip().schema && listSchema == app.getClip().schema) {
           actions.showPaste(true);
          } else {
            actions.showPaste(false);
          }
          
        });

        self.on(iris.evts.copy, function() {
          app.getSchemas(function(schemas) {
            listSchema = schemas[nameSchema];
            if (app.getClip().schema && listSchema == app.getClip().schema) {
              actions.showPaste(true);
            } else {
              actions.showPaste(false);
            }
          });
            
        });

      }
      
    }

    actions.init();


  function createListItems() {
    if (listItemsLoaded) {
      return;
    } else {
      listItemsLoaded = true;
    }
    for (var fieldName in schema) {
      
      var container = 'values';
      if (view == "table") {
        if (schema[fieldName].inline  === false) {
          container = 'values2';  
        } else {
          container = 'values';
        }
      } else {
        if (schema[fieldName].inline) {
          if (schema[fieldName].pre) {
            container = "pre-inline-values";
          } else {
            container = "inline-values";
          }
        }  
      }
      

      if (schema[fieldName].type == "list") {
        var nameSchema = schema[fieldName].schema;
        app.getSchemas(function(schemas) {
          var listSchema = schemas[nameSchema];
          if (!item[fieldName]) {
            item[fieldName] = [];
          }

          lists.push(self.ui(container, iris.path.ui.list.js, {"list": {'type': nameSchema, "name": nameSchema, "itemParent": item, "items": item[fieldName], "schema": listSchema}, "link_schema":  self.setting('link_schema') +  "=" + item[key] + "&" + fieldName, view: schema[fieldName].view}));
        });
      }
    
    }
  }
  
  
  self.item = item;
  self.schema = schema;
  self.showValues = showValues;
  self.toggleAll = toggleAll;
  self.filter = filter;
  self.setEditable = setEditable;
  self.save = save;
  self.cancel = cancel;
  self.del = del;
  self.copy = copy;
  self.paste = paste;
  self.move = move;
  self.render = render;
  self.actions = actions;
  self.createListItems = createListItems;


  self.on(iris.evts.changeState, function() {
    self.get("more").toggle(!app.isEditable());  
  });

  self.get("more").toggle(!app.isEditable());  

  //render();
  if (self.setting("autoEdit")) {
    self.setting("autoEdit", false);
    actions.edit();
  }
 };

 self.awake = function() {
  
};

 function showValues(visible) {
  if (!listItemsLoaded) {
    self.createListItems();
  }
  var id = 'expand';
  
  var container = self.get(id);
  if (container.css("display") === "none" && visible || container.css("display") === "block" && !visible ) {
   container.slideToggle();
  }
  showDetails = visible;
 }

 function toggleAll(visible) {
  showValues(visible);
  for (var i = 0; i < lists.length; i++) {
    var list = lists[i];
    if (list.items) {
      for (var j = 0; j < list.items.length; j++) {
        var item = list.items[j];
        item.toggleAll(visible);
        item.actions.showDetails(visible);
      }  
    }
  }
 }

 function filter(filter, retain) {
  if (!listItemsLoaded) {
    self.createListItems();
  }
  var match = !filter ;
  for (var k = 0; k < fields.length; k++) {
        var field = fields[k];
        if (field.filter(filter)) {
          match = true;
        }
      }
  for (var i = 0; i < lists.length; i++) {
    var list = lists[i];
    for (var j = 0; j < list.items.length; j++) {
      var item = list.items[j];
      if (item.filter(filter)) {
        match = true;
      }
      item.actions.filter(filter);
    }
  }
  //console.log("match "+match  +" retain " +  retain)
  var container = "item";
  if (view == "table") {
    container = "values";
  }
  self.get(container).toggle(match === true || retain === true);

  return match || retain;
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

 function paste() {
  if (!listItemsLoaded) {
    self.createListItems();
  }
  for (var i = 0; i < lists.length; i++) {
   var list = lists[i];
   if (list.setting("list").schema == app.getClip().schema ) {
    list.add(app.getClip().item, self.showPastedItems);
   }
  }
 }

 function render() {
  if (view === "table") {
    self.get('values').toggle(true);
  }
  self.get('expand').toggle(showDetails);
  
  for (var i = 0; i < fields.length; i++) {
   var field = fields[i];
   field.setEditable(app.isEditable() && editable);	
  }
  if (self.setting("header")) {
    self.setting("header").find("[data-show]").toggle(editable);  
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