if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Controllers) { ORYX.Gazelle.Controllers = {} }

ORYX.Gazelle.Controllers.MainController = Clazz.extend({
	construct: function(props) {
		arguments.callee.$.construct.apply(this, arguments);

		this.model = new ORYX.Gazelle.Models.Main();
		this.view = new ORYX.Gazelle.Views.Main();
	},

	initialize: function(options) {
		this.view.load({
			onHide: function() { options.onHide(); },
			onInit: function() { options.onInit(); }
		});
	},

	hide: function() {
		this.view.hide();
	},

	show: function() {
		this.view.show();
	},

	addComponentToView: function(component) {
		this.view.addComponent(component);
	},

	isInit: function() {
		return typeof this.view !== 'undefined'
		&& this.model !== 'undefined';
	}
});
