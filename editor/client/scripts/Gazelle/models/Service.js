if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Models) { ORYX.Gazelle.Models = {} }

ORYX.Gazelle.Models.Service = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.service = options.service;
		this.operations = [];
	},

	getLinks: function() {
		return this.service.links;
	},

	addOperation: function(operation) {
		this.operations.push(operation);
	},

	getOperations: function() {
		return this.operations;
	}
});
