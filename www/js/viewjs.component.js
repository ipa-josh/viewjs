
if(!viewjs) viewjs={};

if(!viewjs.catalogue) viewjs.catalogue = {};
if(!viewjs.catalogue_inst) viewjs.catalogue_inst = {};

if(!viewjs.defaultRednerer) viewjs.defaultRednerer = function() {
	var str="";
	if(typeof this.type.redner=="function") {
		str = this.type.value.redner();
	}
	else if(typeof this.type=="object") {
		str = '<div class="ui-'+this.name+'>';
		for(v in this.type)
			if(this.type[v].redner) str += this.type[v].redner();
		str+= '</div>';
	}
	else
		alert(123);
	return str;
};

if(!viewjs.createComponent) viewjs.createComponent = function(type, id) {
	var r = viewjs.clone(viewjs.catalogue[type]);
	r.setId(id);
	return r;
};

if(!viewjs.getComponent) viewjs.getComponent = function(type, subid) {
	return viewjs.clone(viewjs.catalogue[type]);
};


if(!viewjs.finishUp) viewjs.finishUp = function(type, subid) {
	for(var c in viewjs.catalogue) {
		if(viewjs.catalogue[c].finishUp) {
			viewjs.catalogue[c].finishUp();
		}
	}
};

if(!viewjs.NONE) 		viewjs.NONE=0;
if(!viewjs.EDITABLE) 	viewjs.EDITABLE=0;
if(!viewjs.EDIT_MODUS) 	viewjs.EDIT_MODUS=0;


if(!viewjs.extendComponent) viewjs.extendComponent = function(name, parent_name, type, redner) {
	var c = function(){};
	c.prototype = viewjs.getComponent(parent_name);
	c.prototype.name = name;
	for(t in type)
		c.prototype.type[t] = type[t];
	c.prototype.redner2 = c.prototype.redner;
	c.prototype.redner = redner;
	viewjs.catalogue[name] = new c();
	return viewjs.catalogue[name];
};


if(!viewjs.Component) { viewjs.Component = function(name, type, redner) {
	if(!redner)
		redner = viewjs.defaultRednerer;
	viewjs.catalogue[name] = {
			id: 	'unedfined',
			name: 	name,
			type: 	type,
			redner: redner,
			flags: viewjs.NONE,

			addFlag: function(f) {this.flags|=f;},
			remFlag: function(f) {this.flags&=~f;},

			setId: function(id) {
				if(this.subid)
					this.id = id+"_"+this.subid;
				else
					this.id = id+"_"+this.name;
				
				viewjs.catalogue_inst[this.id] = this;

				if(typeof this.type=="object") {
					for(v in this.type)
						if(this.type[v].redner) this.type[v].setId(this.id);
				}
			},

			set: function(subid, val) {
				var found = false;
				if(typeof subid=="string") {
					for(v in this.type)
						if(this.type[v].subid && this.type[v].subid==subid) {this.type[v].value=val;found=true;}
						else if(!this.type[v].subid && v==subid) {this.type[v].value=val;found=true;}
				}
				else {
					for(v in this.type)
						if(v==subid[0]) this.type[v].set(subid.slice(1),val);
						else if(this.type[v].subid && this.type[v].subid==subid[0]) {this.type[v].value=val;found=true;}
				}
				if(!found) {
					var str="";
					if(typeof subid=="string")
						for(v in this.type)
							if(this.type[v].subid) str+=this.type[v].subid+" ";
							else if(!this.type[v].subid) str+=v+" ";
							
					alert(subid+" not found\ncandidates are: "+str);
				}
				return this;
			},

			get: function(subid) {
				if(!subid) {
					var r={name: this.name};
					for(v in this.type)
						if(this.type[v].get) r[v]=this.type[v].get();
						else r[v]={name: this.type[v].name};
					return r;
				}
				else if(typeof subid=="string") {
					for(v in this.type)
						if(this.type[v].subid && this.type[v].subid==subid) return this.type[v].value;
				}
				else {
					for(v in this.type)
						if(v==subid[0]) return this.type[v].get(subid.slice(1));
						else if(this.type[v].subid && this.type[v].subid==subid[0]) return this.type[v].value;
				}
			}
			
	};
	
	return viewjs.catalogue[name];
};

new viewjs.Component("checkbox", {bool: viewjs.getType("boolean","checked"), str: viewjs.getType("langString","label")}, function() {
	return '<div class="ui-checkbox"><input type="checkbox" name="'+this.id+'" value="'+this.id+'"'+(this.type.bool.valueOf()?' checked="checked"':'')+'>'+this.type.str+'</div>';
});

new viewjs.Component("button", {str: viewjs.getType("langString","label"), cb: viewjs.getType("function","cb")}, function() {
	return '<button id="'+this.id+'">'+this.type.str+'</button>';
});
viewjs.catalogue["button"].finishUp = function() {
	$("button").button();
	$("button").each(function(indx) {
		$(this).data('view', viewjs.catalogue_inst[$(this).attr('id')]);
		$(this).click(viewjs.catalogue_inst[$(this).attr('id')].type.cb.value);
	});
};

new viewjs.Component("newline", {}, function() {
	return '<br/>';
});

new viewjs.Component("empty", {}, function() {
	return '';
});

new viewjs.Component("GridView", {width: viewjs.getType("float","width"), height: viewjs.getType("float","height")}, function() {
	var str = '<table>';
	var p=0;
	for(var i=0; i<this.type.height; i++) {
		str+="<tr>";
		for(var j=0; j<this.type.width; j++) {
			str+="<td>";
			if(p<this.content.length)
				str += this.content[p].redner();
			p+=1;
			str+="</td>";
		}
		str+="</tr>";
	}
	return str+'</table>';
});
viewjs.catalogue["GridView"].content = [];
viewjs.catalogue["GridView"].add = function(view) {
	this.content.push(view);
	return this;
};

viewjs.extendComponent("LinearLayoutH", "GridView", {}, function() {
	this.type.height = 1;
	this.type.width = this.content.length;
	return this.redner2();
});

viewjs.extendComponent("LinearLayoutV", "GridView", {}, function() {
	this.type.width = 1;
	this.type.height = this.content.length;
	return this.redner2();
});

new viewjs.Component("Dialog", {content: viewjs.getType("view","content"), title: viewjs.getType("langString","title"), uiclass: viewjs.getType("string","uiclass").set("dialog")}, function() {
	return '<div id="'+this.id+'" class="'+this.type.uiclass+'" title="'+this.type.title+'"> <p>'+this.type.content+'</p> </div>';
});
viewjs.catalogue["Dialog"].finishUp = function() {
	$(".dialog").dialog();
	$(".taskbar-dialog").taskbardialog({
        taskbar: "#taskbar"
    });
	/*$(".taskbar-dialog").each(function() {
		var title = $(this).attr('title');
		$(this).dialog().attr("title", title).taskbardialog({
        taskbar: "#taskbar"
    });
	});*/
};

}
