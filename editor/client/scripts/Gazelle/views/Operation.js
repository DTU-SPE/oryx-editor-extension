if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Views) { ORYX.Gazelle.Views = {} }

ORYX.Gazelle.Views.Operation = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.model = undefined;
		this.container = undefined
	},

	load: function(options) {
		this.model = options.model;
		this.container = this.CreateFormPanels(options.onSubmit);
	},

	CreateFormPanels: function(onSubmit) {
		var items = this.model.request.parameterGroups.map(function(parameterGroup) {
			if (parameterGroup.integerParameters instanceof Array) {
				var integerParameterItems = parameterGroup.integerParameters.map(function(integerParameter) {
					return {
						fieldLabel: integerParameter.label.text,
						name: integerParameter.key
					};
				});
				return integerParameterItems;
			}

			if (parameterGroup.modelParameters instanceof Array) {
				var modelParameterItems = parameterGroup.modelParameters.map(function(modelParameter) {
					return {
						fieldLabel: modelParameter.label.text,
						name: modelParameter.key
					};
				});
				return modelParameterItems;
			}

			if (parameterGroup.stringParameters instanceof Array) {
				var stringParameterItems = parameterGroup.modelParameters.map(function(stringParameter) {
					return {
						fieldLabel: stringParameter.label.text,
						name: stringParameter.key
					};
				});
				return stringParameterItems;
			}
		});

		var flattenedItems = [].concat.apply([],items);
		var formPanels = this.CreateFormPanel({items: flattenedItems, onSubmit: onSubmit});

		return formPanels;
	},



	CreateFormPanel: function(options) {
		var formPanel = new Ext.FormPanel({
			url: this.model.request.url,
			method: this.model.request.method,
			title: this.model.label.text,
			submit: function(form) { options.onSubmit(form) }.bind(this),
			labelWidth: 150,
			collapsible: true,
			collapsed: false,
			autoWidth: true,
			defaultType: 'textfield',
			items: options.items,
			buttons: [
				{
					text: 'Submit',
					type: 'submit',
					handler: function(formPanel) {
						var form = formPanel.ownerCt.getForm();
						form.submit(form);
					}
				},
				// {
				// 	text: 'Reset',
				// 	type: 'reset'
				// }
			]
		});
		return formPanel;
	}
});
