if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Models) { ORYX.Gazelle.Models = {} }

ORYX.Gazelle.Models.Main = Clazz.extend({
	construct: function(props) {
		arguments.callee.$.construct.apply(this, arguments);

		this.props = props;
		this.model = undefined;
	}
});
