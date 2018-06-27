if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Controllers) { ORYX.Gazelle.Controllers = {} }

ORYX.Gazelle.Controllers.OperationController = Clazz.extend({
	construct: function(props) {
		arguments.callee.$.construct.apply(this, arguments);

		this.model = new ORYX.Gazelle.Models.Operation({
			getJSON: function() { return props.facade.getJSON(); },
			getSerializedJSON: function() { return props.facade.getSerializedJSON(); },
			getRDFFromDOM: function() { return props.getRDFFromDOM(); }
		});
		this.view = new ORYX.Gazelle.Views.Operation();
	},

	initialize: function(options) {
		this.model.load({url: options.link.href})
		.then(function(response) {
			this.view.load({
				model: response,
				onSubmit: function(form) { this.handleSubmit(form); }.bind(this)
			});
			options.onSuccess();
		}.bind(this))
		['catch'](function(error) {
			// TODO
			console.log(error);
		});
	},

	getView: function() {
		return this.view;
	},

	handleSubmit: function(form) {
		// delegate user input from view to model and then update view
		this.model.handleSubmit({
			form: form,
			onSuccess: function(response) {
				// do something to the view
			},
			onFailure: function(error) {
				// do something to the view
			}
		});
	}
});
