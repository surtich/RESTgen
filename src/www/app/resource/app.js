iris.resource(
 function(self){
  var loaded = false;
  var editable = false;
  var apis = null;
  var schemas = null;

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
       schemas.endpoint = {};
      }
      f_ok();
     });
    });	
   }
  };

  self.save = function() {
   debugger;
   $.ajax({
    url: '/save',
    type: 'POST',
    data: apis
   }).done(function(data) {
    alert(data);
   }).dee	;
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
   self.init(function() {
    getApi(apiKey, function(endpoints) {
     for (var i = 0; i < apis.items.length; i++) {
      var api = apis.items[i];
      if (apiKey === api.name) {
       api.enpoints = endpoints.endpoints;
      }
     }
     f_ok(endpoints);
    });
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
  
  function getApi(apiKey, f_ok) {
   getJSON("/json/" + apiKey + ".json", function(data) {
    if (data == null) {
     data = {"endpoints": []};
    }
    f_ok(data);
   });
  }


		
 },
 iris.path.resource.app);