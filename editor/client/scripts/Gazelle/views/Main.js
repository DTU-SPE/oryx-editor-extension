if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Views) { ORYX.Gazelle.Views = {} }

ORYX.Gazelle.Views.Main = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);
		
		this.window = undefined;
		this.servicePanels = [];
	},

	displayWindow: function(options) {
		if (! this.window) {
			this.window = this.CreateWindow(options);
			this.window.show(this, options.onInit());
		}
		this.window.show();
	},

	displayServicePanel: function(options) {
		var servicePanel = this.CreatePanel(options);
		this.servicePanels.push(servicePanel);
		this.window.insert(1, servicePanel);
		this.window.doLayout();
	},

	displayServicePanelOperations: function(options) {
		var servicePanel = this.servicePanels.find(function(servicePanel) {
			return servicePanel.id === options.id;
		});
		servicePanel.add({items: [].concat.apply([],options.operations)});
		servicePanel.doLayout();
	},

	hideWindow: function(options) {
		this.window.hide();
	},

	CreateWindow: function(options) {
		return new Ext.Window({
			width: 500,
			height: 300,
			closeAction: 'hide',
			plain: true,
			autoScroll: true,
			listeners: {
				'hide': function(window) {
					options.onHide();
				}.bind(this)
			}
		});
	},

	CreatePanel: function(options) {
		return new Ext.Panel({
			id: options.service.service.id,
			title: options.service.service.label,
			collapsible: true,
			collapsed: false,
			autoWidth: true,
		});
	}
});
