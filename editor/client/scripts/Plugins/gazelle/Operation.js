if (!ORYX.Plugins.Gazelle) {
	ORYX.Plugins.Gazelle = new Object();
}

ORYX.Plugins.Gazelle.Operation = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.operation = options.operation;
	},

	hasUserParameters: function() {
		var userParameters = this.operation.request.userParameters;
		return (
			typeof userParameters !== 'undefined'
			&& userParameters instanceof Array
			&& userParameters.length > 0
		);
	},

	CreateButton: function(options) {
		return new Ext.Button({
			text: this.operation.title,
			handler: function() {
				options.ref.handleAddOperation({operation: this.operation});
			}.bind(this)
		});
	},

	CreatePanel: function() {
		return new Ext.Panel({
			title: this.operation.title,
			collapsible: true,
			frame:true,
			bodyStyle: 'padding: 5px 5px 5px 5px',
			autoWidth: true,
		});
	},

	CreateFormPanel: function() {
		var userParameters = [];
		if (this.hasUserParameters()) {
			userParameters = this.operation.request.userParameters.map(function(userParameter) {
				return {
					fieldLabel: userParameter.key,
					name: userParameter.key
				}
			});
		}

		return new Ext.FormPanel({
			labelWidth: 150,
			url:'save-form.php',
			frame:true,
			title: this.operation.title,
			collapsible: true,
			collapsed: false,
			autoWidth: true,
			defaultType: 'textfield',
			items: userParameters,
			buttons: [
				{
					text: 'Submit'
				}
			]
		});
	}
});
