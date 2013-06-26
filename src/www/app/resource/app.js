iris.resource(
 function(self){
  var loaded = false;
  var editable = false;
  var apis = null;
  var schemas = null;
  var order = [];
  order.push({"api": "api"});
  
  
  self.order = order;
  

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
  
    var copy = $.extend({}, apis);
    cleanParents(copy);
   $.ajax({
    url: '/save',
    type: 'POST',
    data: copy
   }).done(function(data) {
    alert(data);
   })	;
  }

		
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
   getJSON("/json/apiconfig.json", function(data) {
    f_ok(data);
   });
  }
  
  function getSchemas(f_ok) {
   getJSON("/json/schemas.json", function(data) {
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

  function cleanParents(object) {
   for (var fieldName in object) {
    if (fieldName == "parent" && typeof object[fieldName] == "object") {
      delete object[fieldName];
    } else {
      var field = object[fieldName];
      if (Object.prototype.toString.call( field ) === '[object Array]' || Object.prototype.toString.call( field ) === '[object Object]') {
        cleanParents(field);
      }
    }
   }
  }
		
 },
 iris.path.resource.app);