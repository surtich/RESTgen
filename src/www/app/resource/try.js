iris.resource(
 function(self){
  

  self.serverTry = function(method, p_cbk) {
    var endpoint = method.parent;
    var version = endpoint.parent;
    var api = version.parent;
    var json = method.type == "json";
    var options = {
      type: method.method,
      url: version.protocol + "://" + version.host + ":" + (version.port || 80) + version.path + endpoint.path + method.path,
      json: json,
      body: {},
      header: {},
      path: {},
      query: {},
      "content-type": method["content-type"]
    };


    for (var i = 0; i < method.param.length; i++) {
      var param = method.param[i];
      if (param.value !== "") {
        if (param.isList !== "true" || param.value.indexOf("[") === 0) {
          options[param.location][param.name] = param.value;
        } else {
          options[param.location][param.name] = "[" + param.value + "]";
        }
        
      }
    }
    
    var settings = {
      type: "POST",
      url: "/processReq",
      data: {"options": options},
      dataType: "json"
    };



    $.ajax(settings).done(function(data, textStatus, jqXHR) {
      if (p_cbk) {
        p_cbk(data);
      }
      iris.notify(iris.evts.try, method);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log("error");
      if (p_cbk) {
        p_cbk({statusCode: "error " + textStatus});
      }
    });

  }

  self.clientTry = function(method, p_cbk) {
    var endpoint = method.parent;
    var version = endpoint.parent;
    var api = version.parent;
    var json = method.type == "json";
    var options = {
      type: method.method,
      url: version.protocol + "://" + version.host + ":" + (version.port || 80) + version.path + endpoint.path + method.path,
      proccessData: true,
      data: {},
      headers: {}
    };

    for (var i = 0; i < method.param.length; i++) {
      var param = method.param[i];
      if (param.value !== "") {
        if (param.location == "body" && json) {
          options.data[param.name] = JSON.parse(param.value);  
        } else if (param.location == "body" || param.location == "query") {
          options.data[param.name] = param.value;  
        }  else if (param.location == "path") {
          var regx = new RegExp('(:' + param.name + ")($|/)", "g");
          options.url = options.url.replace(regx, function(match, p1, p2, offset, string) {
            return param.value + p2;
          });
        } else if (param.location == "header") {
          options.headers[param.name] = param.value;  
        }
      }
    }
    
    $.ajax(options).done(function(data, textStatus, jqXHR) {
      if (p_cbk) {
        p_cbk({"statusCode": jqXHR.status, "body": data, "headers": jqXHR.getAllResponseHeaders()});
      }
      iris.notify(iris.evts.try, method);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log("error");
      if (p_cbk) {
        p_cbk({"statusCode": jqXHR.status, "body": errorThrown, "headers": jqXHR.getAllResponseHeaders()});
      }
    });

  }
		
 },
 iris.path.resource.try);