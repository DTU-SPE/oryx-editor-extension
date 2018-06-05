if (!ORYX.Plugins.Gazelle) {
	ORYX.Plugins.Gazelle = new Object();
}

ORYX.Plugins.Gazelle.Operation = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.operation = options.operation;
		this.controller = options.controller;
	},

	hasUserParameters: function() {
		var userParameters = this.operation.request.userParameters;
		return (
			typeof userParameters !== 'undefined'
			&& userParameters instanceof Array
			&& userParameters.length > 0
		);
	},

	hasServiceParameters: function() {
		var userParameters = this.operation.request.serviceParameters;
		return (
			typeof userParameters !== 'undefined'
			&& userParameters instanceof Array
			&& userParameters.length > 0
		);
	},

	CreateButton: function() {
		return new Ext.Button({
			text: this.operation.label,
			handler: function() {
				this.request({
					request: this.operation.request,
					onSuccess: function(response) {
						this.controller.insertItem({response: response});
					}.bind(this),
					onFailure: function(response) {
						this.controller.insertItem({
							response: JSON.stringify(response)
						})
					}.bind(this)
				})
			}.bind(this)
		});
	},

	CreatePanel: function() {
		return new Ext.Panel({
			title: this.operation.label,
			collapsible: true,
			frame:true,
			bodyStyle: 'padding: 5px 5px 5px 5px',
			autoWidth: true,
		});
	},

	CreateFormPanel: function() {
		var userParameters = [{}];
		if (this.hasUserParameters()) {
			userParameters = this.operation.request.userParameters.map(function(userParameter) {
				return {
					fieldLabel: userParameter.label,
					name: userParameter.key
				}
			});
		}

		var formPanel = new Ext.FormPanel({
			url: this.operation.request.url,
			method: this.operation.request.method,
			title: this.operation.label,
			submit: function(form) {
				this.request({
					request: this.operation.request,
					values: form.getValues(),
					onSuccess: function(response) {
						this.controller.insertItem({response: response});
					}.bind(this),
					onFailure: function(response) {
						this.controller.insertItem({
							response: JSON.stringify(response)
						})
					}.bind(this)
				})
			}.bind(this),
			labelWidth: 150,
			collapsible: true,
			collapsed: false,
			autoWidth: true,
			defaultType: 'textfield',
			items: userParameters,
			buttons: [{
				text: 'Submit',
				type: 'submit',
				handler: function(formPanel) {
					var form = formPanel.ownerCt.getForm();
					form.submit(form);
				}
			},{
				text: 'Reset',
				type: 'reset'
			}]
		});
		return formPanel;
	},

	request: function(options) {
		var request = this.operation.request;

		var parameters = {};
		if (typeof options.values !== 'undefined') {
			parameters = options.values
		}

		if (this.hasServiceParameters()) {
			request.serviceParameters.forEach(function(parameter) {
				parameters[parameter.key] = parameter.value;
			})
		}

		this.getPNML({
			onSuccess: function(response) {
				parameters['input'] = response.responseText;

				Ext.lib.Ajax.setDefaultPostHeader(false);

				Ext.Ajax.request({
					url: request.url,
					method: request.method,
					useDefaultHeader:false,
					headers: { 'content-type' : 'application/json' },
					params: parameters,
					success: function(request) {
						options.onSuccess(request.responseText);
					}.bind(this),
					failure: function(request) {
						options.onFailure(request);
					}.bind(this)
				});
			}.bind(this),
			onFailure: function(response) {
				this.insertItem({
					response: JSON.stringify(response)
				})
			}.bind(this)
		})
	},

	getPNML: function(options) {
		var serialized_rdf = this.controller.getRDFFromDOM();
		if (!serialized_rdf.startsWith("<?xml")) {
			serialized_rdf = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
			+ serialized_rdf;
		}

		var resource = location.href;
		var tool = 'lola';

		Ext.Ajax.request({
			url: ORYX.CONFIG.SIMPLE_PNML_EXPORT_URL,
			method: 'POST',
			success: function(request) {
				options.onSuccess(request);
			}.bind(this),
			failure: function(request) {
				options.onFailure(request);
			}.bind(this),
			params: {
				resource: resource,
				data: serialized_rdf,
				tool: tool
			}
		});
	},
});
