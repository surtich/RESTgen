iris.resource(
 function(self){
  
  self.resultCount = 0;

  self.curl = function(method) {
    var endpoint = method.parent;
    var version = endpoint.parent;
    var api = version.parent;
    var json = method.type == "json";
    var url =  version.protocol + "://" + version.host + ":" + (version.port || 80) + version.path + method.path;
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

    if (json) {
      requestBody = JSON.stringify(requestBody);
    }

    
    var curl =  'curl -v -L -X ' + method.method + strHeaders + (requestBody ? ' -d \'' + requestBody + '\' ' : ' ') + '\'' + url  + (queryString ? '?' + queryString : '') + '\'';

    return curl;
  

  }


  

		
 },
 iris.path.resource.code);