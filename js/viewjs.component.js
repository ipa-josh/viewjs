
if(!viewjs) viewjs={};

if(!viewjs.catalogue) viewjs.catalogue = {};

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
	var r = viewjs.catalogue[type].clone();
	r.setId(id);
	return r;
};

if(!viewjs.getComponent) viewjs.getComponent = function(type, subid) {
	return viewjs.catalogue[type].clone();
};


if(!viewjs.NONE) 		viewjs.NONE=0;
if(!viewjs.EDITABLE) 	viewjs.EDITABLE=0;
if(!viewjs.EDIT_MODUS) 	viewjs.EDIT_MODUS=0;

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
					id = id+"_"+this.subid;
				else
					id = id+"_"+this.name;

				if(typeof this.type=="object") {
					for(v in this.type)
						if(this.type[v].redner) this.type[v].setId(id);
				}
			},

			set: function(subid, val) {
				if(typeof subid=="string") {
					for(v in this.type)
						if(this.type[v].subid && this.type[v].subid==subid) this.type[v].value=val;
				}
				else {
					for(v in this.type)
						if(v==subid[0]) this.type[v].set(subid.slice(1),val);
						else if(this.type[v].subid && this.type[v].subid==subid[0]) this.type[v].value=val;
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

}
