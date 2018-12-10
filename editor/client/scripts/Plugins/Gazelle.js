if(!ORYX.Plugins) {
	ORYX.Plugins = new Object();
}

/**
* Gazelle - Generic Web Service plugin
*
* @class
* @extends ORYX.Plugins.AbstractPlugin
*/
ORYX.Plugins.Gazelle = ORYX.Plugins.AbstractPlugin.extend({
	construct: function(facade) {
		// Call super class constructor
		arguments.callee.$.construct.apply(this, arguments);

		this.facade = facade;

		this.facade.offer({
			'name': 'Generic Web Service', // ORYX.I18N.Gazelle.name
			'functionality': this.handleButtonPressed.bind(this),
			'group': 'analysis', // ORYX.I18N.Gazelle.group
			'icon': ORYX.PATH + 'images/icon-ws.png',
			'description': 'Generic Web Service plugin', // ORYX.I18N.Gazelle.desc
			'index': 0,
			'toggle': true,
			'minShape': 0,
			'maxShape': 0
		});

		this.container = undefined;
	},

	getFacade: function() {
		return this.facade;
	},

	handleHide: function (button) {
		this.container.hide();
		this.setActivated(button, false)
	},

	handleInit: function() {
		this.container.doLayout();
		var script = document.createElement("script");
		script.src = '/oryx/lib/utilities/gazelle.js';
		document.head.appendChild(script);
	},

	handleButtonPressed: function(button, pressed) {
		if (pressed) {
			if (typeof this.container === 'undefined') {
				this.container = this.CreateContainer({
					onHide: function() { this.handleHide(button); }.bind(this)
				});
				this.container.show(this, this.handleInit());;
			} else {
				this.container.show();
			}
		} else {
			this.handleHide(button);
		}
	},

	CreateContainer: function(options) {
		return new Ext.Window({
			width: 500,
			height: 300,
			closeAction: 'hide',
			plain: true,
			autoScroll: true,
			html: '<div id="gazelle-app"></div>',
			listeners: {
				'hide': function(window) {
					options.onHide();
				}.bind(this)
			}
		});
	}
});
