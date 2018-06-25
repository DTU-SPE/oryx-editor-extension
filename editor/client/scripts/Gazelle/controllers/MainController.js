if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Controllers) { ORYX.Gazelle.Controllers = {} }

ORYX.Gazelle.Controllers.MainController = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.model = new ORYX.Gazelle.Models.Main();
		this.view = new ORYX.Gazelle.Views.Main();
	},

	display: function(options) {
		this.view.load({
			onHide: function() { options.onHide(); },
			onInit: function() { options.onInit(); }
		});
	},

	hideWindow: function() {
		this.view.hideWindow();
	},

	addComponentToView: function(component) {
		this.view.addComponent(component);
	}
});
