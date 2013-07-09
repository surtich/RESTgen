iris.resource(
 function(self){
  
  self.resultCount = 0;

  self.curl = function(method) {
    var endpoint = method.parent;
    var version = endpoint.parent;
    var api = version.parent;
    var json = method.type == "json";
    var url =  version.protocol + "://" + version.host + ":" + (version.port || 80) + version.path + endpoint.path + method.path;
    var strHeaders = '';
    var requestBody = '';
    var queryString = '';

    if (json) {
      strHeaders += ' -H "Content-Type: application/json"';
      requestBody = {};
    }

    if (method.param) {
      for (var i = 0; i < method.param.length; i++) {
        var param = method.param[i];
        if (param.value !== "") {
          if (param.location == "path") {
            var regx = new RegExp('(:' + param.name + ")($|/)");
            url = url.replace(regx, function(match, p1, p2, offset, string) {
              return param.value + p2;
            });
          } else if (param.location == "header") {
            strHeaders += ' -H "' + param.name + ':' + param.value + '"';
          } else if (param.location == "body") {
            if (!json) {
              if (requestBody) {
              requestBody += "&";
              }
              requestBody += param.name + "=" + param.value;  
            } else {
              requestBody[param.name] = JSON.parse(param.value);  
            }
            
          } else if (param.location == "query") {
            if (queryString) {
              queryString += "&";
            }
            queryString += param.name + "=" + param.value;
          }
        }
      }
      
    }

    if (json) {
      requestBody = JSON.stringify(requestBody);
    }

    
    var curl =  'curl -v -L -X ' + method.method + strHeaders + (requestBody ? ' -d \'' + requestBody + '\' ' : ' ') + '\'' + url  + (queryString ? '?' + queryString : '') + '\'';

    return "<pre class='headers prettyprint'>" + curl + "</pre>";
  }

  self.jquery = function(method) {
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
          var regx = new RegExp('(:' + param.name + ")($|/)");
          options.url = options.url.replace(regx, function(match, p1, p2, offset, string) {
            return param.value + p2;
          });
        } else if (param.location == "header") {
          options.headers[param.name] = param.value;  
        }
      }
    }

    var jquery = "var options = " + JSON.stringify(options);

    jquery += "\n\n$.ajax(options).done(function(data, textStatus, jqXHR) {\n\n}).fail(function(jqXHR, textStatus, errorThrown) {\n\n});";

    
    return "<pre class='headers prettyprint'>" + jquery + "</pre>";


  }

  self.iris = function(actualMethod) {
    var endpoint = actualMethod.parent;
    var version = endpoint.parent;
    
    var iris = "iris.resource(\n\tfunction(self) {";
    if (endpoint.method) {
      for (var i = 0 ; i < endpoint.method.length; i++) {

        var method = endpoint.method[i];
        var tokens = method.name.split(" ");
        var name = "";

        var url = version.path + endpoint.path + method.path;
        var endWithParam = url.search(/\/:[^/]*$/) !== -1;
        var bodyParams = "";
        var queryParams = "";
        var paramPaths = false;


        $.each(tokens, function(index, value) {
          name += value.replace(/^([a-z])/i, function(match, p1, offset, string) {
            if (index === 0) {
              return p1.toLowerCase();
            } else {
              return p1.toUpperCase();
            }
            
          });
        });
        iris += "\n\n";
        if (method === actualMethod) {
          iris += "<span data-id='select'>";
        }
        iris += "\t\tself." + name + " = function(";
        var params = [];
        if (method.param) {
          for (var j = 0; j < method.param.length; j++) {
            var param = method.param[j];
            if (param.location !== "header") {
              params.push("p_" + param.name);
              if (param.location == "body") {
                if (method.method === "POST" || method.method === "PUT") {
                  if (bodyParams) {
                   bodyParams += ", ";
                  }
                  bodyParams += param.name + ": " + "p_" + param.name;
                }
              } else if (param.location == "path") {
                paramPaths = true;
                url = url.replace(new RegExp("/:" + param.name + "(/*.)"), "/\" + " + "p_" + param.name + " + \"$1");
                url = url.replace(new RegExp("/:" + param.name + "$"), "/\" + " + "p_" + param.name);
              } else if (param.location == "query") {
                if (method.method === "GET" || method.method === "DELETE") {
                  if (queryParams) {
                   queryParams += " + \"&";
                  }
                  queryParams += param.name + "=\" + " + "p_" + param.name;
                }
              }
            }
          }
        }

        params.push("f_ok");
        params.push("f_error");
        iris += params.join(",").replace(/,/g, ", ") + ") {";
        iris += "\n\t\t\treturn self." + (method.method === "DELETE" ? "del" : method.method.toLowerCase()) + "(";
        iris += "\"" + url;

        if (!endWithParam) {
         iris += "\"";
        }
        if (queryParams) {
          if (!paramPaths) {
            iris += "\"";   
          }
         iris += " + \"?" + queryParams;
        }
        if (method.method === "POST" || method.method === "PUT") {
          iris += ", {" + bodyParams + "}";
        }
        iris += ", f_ok, f_error);";
        iris += "\n\t\t};"

        if (method === actualMethod) {
          iris += "</span>";
        }

      }
    }

    iris += "\n\t},";
    iris += "\niris.path.resource." + endpoint.name.substr(0, 1).toLowerCase() + endpoint.name.substr(1) + ");";

    return "<pre class='headers prettyprint'>" + iris + "</pre>";
  }
		
 },
 iris.path.resource.code);