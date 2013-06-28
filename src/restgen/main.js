var commons  = require('../lib/commons.js')
,   express  = commons.express
,	app  = express()
,   fs  = commons.fs
,   path  = commons.path
,   beautify  = commons.beautify
,   request  = commons.request
,   config  = require('../lib/config/local.json');


app.configure(
 function() {
  app.use( express.bodyParser() );
  app.use( express.static(__dirname + '/../www') );
  app.use( app.router );
  app.use(
   express.errorHandler(
   {
    dumpExceptions : true
    ,	
    showStack : true
   }
   )
   );
		
 });

app.post("/save", function(req, res, next) {
 var apis = req.body.items;

 var apiKey = getApiKey();
	

 if (apiKey) {
  removeApis(apiKey);
  saveApiConfig(apis);
  for (var i = 0; i < apis.length; i++) {
   var api = apis[i];
   saveApi(api, apiKey);
  }
 }
 res.send("Ok");
});

// Process the API request
app.post('/processReq', processRequest, function(req, res) {
    var result = {
        headers: req.resultHeaders,
        response: req.result,
        call: req.call,
        code: req.res.statusCode
    };

    res.send(result);
});

function processRequest(req, res, next) {
  
  var url = req.body.url;

  var body = "";

  var headers = {
    'content-type' : 'application/x-www-form-urlencoded'
  }

  if (req.body.body) {
    for (var fieldName in req.body.body) {
      var fieldValue = req.body.body[fieldName];
      if (body) {
        body += "&";
      }
      body += fieldName + "=" + fieldValue;
    }
  }

  if (req.body.header) {
    for (var fieldName in req.body.header) {
      var fieldValue = req.body.header[fieldName];
      headers[fieldName] = fieldValue;
    }
  }

  if (req.body.path) {
    for (var fieldName in req.body.path) {
      var regx = new RegExp('(:' + fieldName + ")($|/)");
      var fieldValue = req.body.path[fieldName];
      url = url.replace(regx, function(match, p1, p2, offset, string) {
        return fieldValue + p2;

      });
    }
  }


console.log("*********************AQUI*******************");
  console.log("headers", headers, "body",body)


  request(
  {
   headers : headers,
   url : url,
   body: body,
   method: req.body.type,
   jar: false
  },
  function(err, r, body){
   if(err){
    console.log('error:', err);
   } else {
    console.log('statusCode:', r.statusCode);
    console.log('body:', body);
    console.log('headers:', r.headers);
    console.log("*********************END*******************");
   }
   res.write(JSON.stringify({
    error: err,
    statusCode: r.statusCode,
    body: body,
    headers: r.headers
   }));
   res.end();
  }
 );
 

}



function removeApis(apiKey) {
 var apiconfig = JSON.parse(readFile(path.join(__dirname, '/../www/json/apiconfig.json')));
 for (var i = 0; i < apiconfig.length; i++) {  
  var api = apiconfig[i];
  removeFile(path.join(__dirname, '/../www/json/' + api[apiKey] + ".json"));
 }
}

function saveApiConfig(apis) {
 createFile(path.join(__dirname, '/../www/json/apiconfig.json'), beautify(JSON.stringify(apis)) , {
  "indent_size": 1, 
  "indent_with_tabs": false, 
  "preserve_newlines": true
 });
}

function getApiKey() {
 var schemas = require(path.join(__dirname, '/../www/json/schemas.json'));

 var apiKey = null;

 for (fieldName in schemas.api) {
  var field = schemas.api[fieldName];
  if (field.key) {
   apiKey = fieldName;
   break;
  }
 }
 return apiKey;
}


function saveApi(api, apiKey) {
 createFile(path.join(__dirname, '/../www/json/' + api[apiKey] + ".json"), beautify(JSON.stringify({
  'endpoints':[]
 })) , {
  "indent_size": 1, 
  "indent_with_tabs": false, 
  "preserve_newlines": true
 });
}

app.listen(config.port);
console.log('Listening at port ' + config.port);

function createFile(path, content) {
 fs.writeFileSync(path, content);
}

function readFile(path) {  
 if (!fs.existsSync(path)) {    
  return "";
 } else {
  return fs.readFileSync(path);
 }
}

function removeFile(path) {  
 if (fs.existsSync(path)) {
  fs.unlinkSync(path);
 }
}
