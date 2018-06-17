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
			'icon': ORYX.PATH + "images/icon-ws.png",
			'description': 'Generic Web Service plugin', // ORYX.I18N.Gazelle.desc
			'index': 0,
			'toggle': true,
			'minShape': 0,
			'maxShape': 0
		});


		this.mainController = new ORYX.Gazelle.Controllers.MainController();
		this.services = [];
	},

	handleHide: function (button) {
		this.setActivated(button, false)
	},

	handleButtonPressed: function(button, pressed) {
		this.mainController.initialize({
			pressed: pressed,
			onHide: function() { this.handleHide(button); }.bind(this),
			onInit: function() { this.handleInit(); }.bind(this)
		})
	}
});
