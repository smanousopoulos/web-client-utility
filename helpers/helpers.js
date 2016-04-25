var Helpers = {
		
	pluck: function(arr, key){
		    return arr.map(function (e) { return e[key]; });
	},
	
	/* From an array of objects, we pick those, 
	 * having a specific value for a given key
	 * */
	pickQualiffied: function(arr, key, value){
		var qualified =  arr.map(function(e) { 
			if (e.hasOwnProperty(key)){
				if (e[key] === value) {
					return e; 
				}
			}
		});
		return qualified.filter(function (e) { if (e !== undefined) return e;} );
	},
	
	getDistinctValuesArrayObjects: function(array, property){
		var distincts = [];
		var shownBefore = {};
		
		array.forEach(function (v, i){
			if(!shownBefore[v[property]]){
				shownBefore[v[property]] = true;
				distincts.push(v[property]);
			}
		});
		return distincts;
	},
	
	// http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
	toTitleCase: function(str){
	    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
};

module.exports = Helpers;