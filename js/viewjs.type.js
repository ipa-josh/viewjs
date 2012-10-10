
if(typeof viewjs=="undefined") viewjs={};

if(!viewjs.translate) viewjs.translate = function(str) {return str;}

if(!Object.prototype.clone) Object.prototype.clone = function() {
	var newObj = (this instanceof Array) ? [] : {};
	for (i in this) {
		if (i == 'clone') continue;
		if (this[i] && typeof this[i] == "object") {
			newObj[i] = this[i].clone();
		} else newObj[i] = this[i];
	}
	return newObj;
};

if(!viewjs.types) viewjs.types = {};
if(!viewjs.getType) viewjs.getType = function(type, subid) {
	var r=viewjs.types[type].clone();
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
			}
	};
};

new viewjs.Type("boolean",false);
new viewjs.Type("float",0);
new viewjs.Type("string","");

new viewjs.Type("langString","");
viewjs.types["langString"].valueOf = function() {return viewjs.translate(this.value);}
};