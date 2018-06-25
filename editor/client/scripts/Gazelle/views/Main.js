if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Views) { ORYX.Gazelle.Views = {} }

ORYX.Gazelle.Views.Main = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.container = undefined;
	},

	load: function(options) {
		this.container = this.CreateWindow(options);
		this.container.show(this, options.onInit());
	},

	addComponent: function(options) {
		this.container.insert(1, options.container);
		this.container.doLayout();
	},

	show: function() {
		this.container.show()
	},

	hide: function() {
		this.container.hide();
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
	}
});
