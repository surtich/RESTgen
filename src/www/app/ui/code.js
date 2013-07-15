iris.ui(function(self) {
	var code = iris.resource(iris.path.resource.code);
	var app = iris.resource(iris.path.resource.app);
	var language = "curl";

	self.create = function() {
		var method = self.setting("item");
		self.tmpl(iris.path.ui.code.html);

		self.get("result").append("<div id='result_" + (++code.resultCount) + "' data-id='generated-code'></div>");
		self.get("result").prepend("<button data-id='copy-code' style='float:right; margin: 8px;' data-clipboard-target='result_" + code.resultCount + "'>Copy</button>");
		self.get("result").prepend("<button data-id='see-all' style='display:none; float:right; margin: 8px;'>See all</button>");
		
		var clip = new ZeroClipboard(self.get("copy-code"));

		self.get("code").find("li").click(function() {
			language = $(this).data("id");
			self.get("code").find("li").removeClass("selected");
			$(this).addClass("selected");
			self.get("see-all").toggle(language === "iris" || language === "java");
			if (code[language]) {
				showCode(method);		
			} else {
				self.get("generated-code").html(language.toUpperCase() + " code generation not implemented yet.");
			}

		});

		self.get("see-all").click(function() {
			if (code[language + "All"]) {
				showCode(method, true);		
			} else {
				self.get("generated-code").html((language + " All").toUpperCase() + " code generation not implemented yet.");
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

	function showCode(method, showAll) {
		var html = code[language + ( showAll ? "All": "" )](method);
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
	}



}, iris.path.ui.code.js);