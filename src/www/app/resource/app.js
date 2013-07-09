iris.resource(
 function(self){
  var loaded = false;
  var editable = false;
  var apis = null;
  var schemas = null;
  var order = [];
  order.push({"api": "api"});
  
  
  self.order = order;

  var clip = {};

  self.copy = function(item, schema) {
    clip = {
      item: clone(item),
      schema: schema
    } 

    iris.notify(iris.evts.copy);
  }

  self.getClip = function() {
    return clip;
  }
  

  self.init = function(f_ok) {
   if (loaded) {
    f_ok();
   } else {
    getApis(function(data) {
     apis = {};
     apis.name = "api";
     if (!data) {
      apis.items = [];
     } else {
      apis.items = data;
     }

     getSchemas(function(data){
						
      schemas = data;

      if (!schemas) {
       schemas = {};
      }
      if (!schemas.api) {
       schemas.api = {};
      }
      createOrder();
      f_ok();
     });
    });	
   }
  };



  self.save = function() {
    var copy = clone(apis);
   $.ajax({
    url: '/save',
    type: 'POST',
    data: copy
   }).done(function(data) {
    alert(data);
   })	;
  }

  self.clone = clone;

		
  self.isEditable = function() {
   return editable;
  };

  self.setEditable = function(edit) {
   editable = edit;
   iris.notify(iris.evts.changeState);
  };

  self.getApis = function(f_ok) {
   self.init(function() {
    f_ok(apis);
   });
  }

  self.getSchemas = function(f_ok) {
   self.init(function() {
    f_ok(schemas);
   });
  }
  
  self.getApi = function(apiKey, f_ok) {
   var api = null;
   self.init(function() {    
     for (var i = 0; i < apis.items.length; i++) {
      if (apiKey === apis.items[i].name) {
       api = apis.items[i];
       break;
      }
     }
     f_ok(api);
   });
  }

  function getJSON(file, f_ok) {
   self.get(file, function(data) {
    loaded = true;
    f_ok(data);
   }, function() {
    loaded = true;
    f_ok(null);
   }	
   );
  }

  function getApis(f_ok) {
   getJSON("json/apiconfig.json", function(data) {
    f_ok(data);
   });
  }
  
  function getSchemas(f_ok) {
   getJSON("json/schemas.json", function(data) {
    f_ok(data);
   });
  }

  function createOrder() {
    var schema = schemas.api;
    var changed = true;
    while (changed) {
      changed = false;
      for (var fieldName in schema) {
        if (schema[fieldName].type == "list") {
          var elem = {};
          elem[fieldName] = schema[fieldName].schema;
          order.push(elem);
          changed = true;
          schema = schemas[schema[fieldName].schema];
          break;
        }
      }  
    }    
  }


  function clone(item, removeParents) {
    if (!item) { return item; } // null, undefined values check

    var types = [ Number, String, Boolean ], 
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type) {
        if (item instanceof type) {
            result = type( item );
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
            result = [];
            item.forEach(function(child, index, array) { 
                result[index] = clone( child, removeParents );
            });

        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode( true );    
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        if (i === "parent") {
                          if (removeParents === false) {
                            result[i] = item[i];  
                          }
                        } else {
                          result[i] = clone( item[i], removeParents );
                        }
                        
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}

		
 },
 iris.path.resource.app);