Kido.prototype.storage = function(name) {

	var storageName = name || 'local';
	var parentKido = this;

    return {
		// Name of the storage, valid values are:
		// local, global and any application name.
		name: storageName,
		kido: parentKido,

		getObjectSetNames: function()
		{
			return parentKido.send({
					url: "/storage/" +	(storageName==='local' ? parentKido.applicationName : storageName),
					type: "GET"
				});
		},

		objectSet: function(name)
		{
			var objectSetName = name || 'default';
			var parentStorage = this;

			var invoke = function(data){
				if (!data) throw "data argument is required";
				if (!data.settings) throw "data.settings property is required";

				var params = [];
				if (data.query) params.push("query=" + JSON.stringify(data.query));
				if (data.options) params.push("options=" + JSON.stringify(data.options));
				if (data.fields) params.push("fields=" + JSON.stringify(data.fields));
				if (data.isPrivate === true || data.isPrivate === false) params.push("isPrivate=" + data.isPrivate);

				data.settings.url = "/storage/" +
					(parentStorage.name=='local' ? parentStorage.kido.applicationName : parentStorage.name) + "/" +
					objectSetName +
					(data.objectId ? "/" + data.objectId : "") +
					(data.indexes ? "/" + data.indexes : "") +
					(params.length ? "?" + params.join("&") : "");

				data.settings.url = encodeURI(data.settings.url);

				data.settings.cache = data.cache;
 
				return parentKido.send(data.settings);
			};

			return {
				storage : parentStorage,
				name: objectSetName,

				// Stores a new obj into the set
				insert: function(obj, isPrivate){
					if(!obj) throw "obj argument is requiered.";

					obj._id = undefined;

					var data = {
						settings: {
							type: "POST",
							data: JSON.stringify(obj)
					}};

					if (isPrivate) data.isPrivate = isPrivate;

					return invoke(data).pipe(function(result){
						return $.extend({}, obj, result);
					});
				},

				// Updates an existing object, the object instance
				// must contains the object's key
				update:function(obj, isPrivate){
					if(!obj) throw "obj argument is requiered.";

					var data = {
						settings: {
							type: "PUT",
							data: JSON.stringify(obj)
					}};

					if (isPrivate) data.isPrivate = isPrivate;

					return invoke(data).pipe(function(result){
						return $.extend({}, obj, result);
					});
				},

				// Inserts or updates the object instance.
				// If the object instance contains the object's key
				// then this function will update it, if the object
				// instance doesn't contain the object's key then this
				// function will try to insert it
				save: function(obj, isPrivate){
					if(!obj) throw "obj argument is requiered.";

					if(obj && obj._id && obj._id.length > 0) {
						return this.update(obj, isPrivate);
					}
					else {
						return this.insert(obj, isPrivate);
					}
				},

				// Retrieves an object by its key
				get: function(objectId){
					if(!objectId) throw "objectId argument is requiered.";

					return invoke ({
						settings: { type: "GET" },
						objectId: objectId,
						cache: false
					}).pipe(function(a){ return a;});
				},

				// Executes the query
				query: function(query, fields, options, cache){
					return invoke ({
						settings: { type: "GET" },
						query: query,
						fields: fields,
						options: options,
						cache: cache
					});
				},

				// Delete an object from the set by its key
				del: function(objectId){
					return invoke ({
						settings: { type: "DELETE" },
						objectId: objectId
					});
				},

				drop: function(){
					return invoke ({
						settings: { type: "DELETE" }
					});
				}

				// deleteMany: function(query, settings){},
				// exists: function(objectId, settings){},
				// existAny: function(query, settings){}
			};
		}
	};
};
