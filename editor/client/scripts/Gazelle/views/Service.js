if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Views) { ORYX.Gazelle.Views = {} }

ORYX.Gazelle.Views.Service = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.container = undefined
	},

	load: function(model) {
		this.container = this.CreatePanel(model);
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

	CreatePanel: function(model) {
		return new Ext.Panel({
			id: model.id,
			title: model.label,
			collapsible: true,
			collapsed: false,
			autoWidth: true,
		});
	}
});
