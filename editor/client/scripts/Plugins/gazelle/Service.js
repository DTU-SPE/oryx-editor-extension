if (!ORYX.Plugins.Gazelle) {
	ORYX.Plugins.Gazelle = new Object();
}

ORYX.Plugins.Gazelle.Service = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.service = options.service;
		var operations = [];
		this.operations = operations;
	},

	CreatePanel: function() {
		return new Ext.Panel({
			title: this.service.label,
			collapsible: true,
			collapsed: false,
			autoWidth: true,
		});
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
