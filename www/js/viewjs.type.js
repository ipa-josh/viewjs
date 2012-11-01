
if(typeof viewjs=="undefined") viewjs={};

if(!viewjs.translate) viewjs.translate = function(str) {return str;}

if(!viewjs.clone) viewjs.clone = function(obj) {
	var newObj = (obj instanceof Array) ? [] : {};
	for (i in obj) {
		if (i == 'clone') continue;
		if (obj[i] && typeof obj[i] == "object") {
			newObj[i] = viewjs.clone(obj[i]);
		} else newObj[i] = obj[i];
	}
	return newObj;
};

if(!viewjs.types) viewjs.types = {};
if(!viewjs.getType) viewjs.getType = function(type, subid) {
	var r=viewjs.clone(viewjs.types[type]);
	r.subid = subid;
	return r;
};

if(!viewjs.Type) {viewjs.Type = function(type, val) {
	viewjs.types[type] = {
			name 	: type,
			subid 	: "",
			value 	: val,
			atomic	: ((typeof val)!="object") && ((typeof val)!=undefined),
			valueOf : function() {
				return this.value;
			},
			set		: function(v) {this.value=v;return this;}
	};
};

new viewjs.Type("boolean",false);
new viewjs.Type("float",0);
new viewjs.Type("string","");
new viewjs.Type("function",function() {});

new viewjs.Type("langString","");
viewjs.types["langString"].valueOf = function() {return viewjs.translate(this.value);};

new viewjs.Type("view","");
viewjs.types["view"].valueOf = function() {if(this.value.redner) return this.value.redner(); return "";};


};
