ExpenseStorage = function () {
	var self = this;
	
	var logger = new Kido("local").logging();

	self.getAll = function(objectSetName, cache) {
		var objectSet = new Kido("local").storage().objectSet(objectSetName);
        var query = objectSet.query(null, null, cache);
		query.fail(function(error) {
			logError("an error occured while querying '" + objectSetName + "': " + JSON.stringify(error));
		});
		return query;
	};

	self.query = function(query, fields, objectSetName, cache) {
		var objectSet = new Kido("local").storage().objectSet(objectSetName);
        var query = objectSet.query(query, fields, null, cache);
		query.fail(function(error) {
			logError("an error occured while querying '" + objectSetName + "': " + JSON.stringify(error));
		});
		return query;
	};

	self.getById = function(id, objectSetName) {
		var objectSet = new Kido("local").storage().objectSet(objectSetName);
        var get = objectSet.get(id, false);
        get.fail(function(error) {
			logError("an error occured while querying '" + objectSetName + "': " + JSON.stringify(error));
		});
		return get;
	};

	self.save = function(object, objectSetName) {
		var objectSet = new Kido("local").storage().objectSet(objectSetName);
		if(expenses._id == "") {
			expenses._id = undefined;
		}
		var save = objectSet.save(object, true);
		save.fail(function(error) {
			logError("An error occured while saving object into '" + objectSetName + "': " + JSON.stringify(error));
		});
		return save;
	};

	function logError(message) {
		logger.write(message, 3);
	}
	
	function logInfo(message) {
		logger.write(message, 1);
	}
};