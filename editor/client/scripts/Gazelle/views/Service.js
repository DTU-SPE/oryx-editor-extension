if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Views) { ORYX.Gazelle.Views = {} }

ORYX.Gazelle.Views.Service = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.model = undefined;
		this.container = undefined
	},

	load: function(model) {
		this.model = model;
		this.container = this.CreatePanel();
	},

	displayServicePanelOperations: function(options) {
		this.container.add({items: [].concat.apply([], options.operations)});
		this.container.doLayout();
	},

	addComponent: function(options) {
		this.container.insert(1, options.container);
		this.container.doLayout();
	},

	hideWindow: function(options) {
		this.window.hide();
	},

	CreatePanel: function() {
		return new Ext.Panel({
			id: this.model.id,
			title: this.model.label,
			collapsible: true,
			collapsed: false,
			autoWidth: true,
		});
	}
});
