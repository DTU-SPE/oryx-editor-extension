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
		if (options.pressed) {
			this.view.displayWindow({
				onHide: function() { options.onHide(); },
				onInit: function() { options.onInit(); }
			});
		} else {
			this.view.hideWindow();
			options.onHide();
		}
	},

	addComponentToView: function(component) {
		this.view.addComponent(component);
	}
});
