iris.ui(function(self) {
	var code = iris.resource(iris.path.resource.code);
	var app = iris.resource(iris.path.resource.app);

	self.create = function() {
		var method = self.setting("item");
		self.tmpl(iris.path.ui.code.html);

		self.get("result").append("<div id='result_" + (++code.resultCount) + "' data-id='generated-code'></div>");
		self.get("result").prepend("<button data-id='copy-code' style='float:right; margin: 8px;' data-clipboard-target='result_" + code.resultCount + "'>Copy</button>");
		
		var clip = new ZeroClipboard(self.get("copy-code"));

		self.get("code").find("li").click(function() {
			self.get("code").find("li").removeClass("selected");
			$(this).addClass("selected");
			if (code[$(this).data("id")]) {
				var html = code[$(this).data("id")](method);
				self.get("generated-code").html(html);
				hljs.highlightBlock(self.get("generated-code").get(0), null, false);
				if ($(html).find("[data-id=select]").size() > 0) {
					var doc = document;
				    var text = self.get("generated-code").find("[data-id=select]").get(0);    

				    if (doc.body.createTextRange) { // ms
				        var range = doc.body.createTextRange();
				        range.moveToElementText(text);
				        range.select();
				    } else if (window.getSelection) { // moz, opera, webkit
				        var selection = window.getSelection();            
				        var range = doc.createRange();
				        range.selectNodeContents(text);
				        selection.removeAllRanges();
				        selection.addRange(range);
				    }

				}
			} else {
				self.get("generated-code").html($(this).data("id").toUpperCase() + " code generation not implemented yet.");
			}

		});

		



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


		self.get("curl").trigger("click");




	}



}, iris.path.ui.code.js);