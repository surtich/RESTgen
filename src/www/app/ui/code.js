iris.ui(function(self) {
	var code = iris.resource(iris.path.resource.code);
	var app = iris.resource(iris.path.resource.app);

	self.create = function() {
		var method = self.setting("item");
		self.tmpl(iris.path.ui.code.html);

		self.get("result").append("<pre id='result_" + (++code.resultCount) + "' class='headers prettyprint' data-id='generated-code'></pre>");
		self.get("result").prepend("<button data-id='copy-code' style='float:right; margin: 8px;' data-clipboard-target='result_" + code.resultCount + "'>Copy</button>");
		
		var clip = new ZeroClipboard(self.get("copy-code"));

		self.get("code").find("li").click(function() {
			self.get("code").find("li").removeClass("selected");
			$(this).addClass("selected");
			if (code[$(this).data("id")]) {
				self.get("generated-code").html(code[$(this).data("id")](method));	
			} else {
				self.get("generated-code").html($(this).data("id"));	
			}

		});

		

		self.get("curl").trigger("click");




		iris.on(iris.evts.changeState, function() {
    		if(!app.isEditable()) {
    			self.get("code").find("li.selected").trigger("click");
    		} 
  		});

  		iris.on(iris.evts.try, function(m) {
    		if(m == method) {
				self.get("code").find("li.selected").trigger("click");
    		} 
  		});


	}



}, iris.path.ui.code.js);