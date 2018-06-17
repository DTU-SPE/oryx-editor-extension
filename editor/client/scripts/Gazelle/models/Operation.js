if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Models) { ORYX.Gazelle.Models = {} }

ORYX.Gazelle.Models.Operation = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.operation = options.operation;
	},

	hasUserParameters: function() {
		var userParameters = this.operation.request.parameterGroups;
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

	CreateFormPanels: function() {
		var items = this.operation.request.parameterGroups.map(function(parameterGroup) {
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
				return [{
					fieldLabel: 'model',
					name: 'model'
				}];
			}

			if (parameterGroup.stringParameters instanceof Array) {
				return [{
					fieldLabel: 'model',
					name: 'model'
				}];
			}
		});

		var flattenedItems = [].concat.apply([],items);
		var formPanels = this.CreateFormPanel({items: flattenedItems});

		// var formPanels = items.map(function(item) {
		// 	return this.CreateFormPanel({items: item});
		// }.bind(this));
		//

		return formPanels;
	},

	CreateFormPanel: function(options) {
		// var userParameters = [{}];
		// if (this.hasUserParameters()) {
		// 	userParameters = this.operation.request.parameterGroups.map(function(userParameter) {
		// 		if (userParameter.integerParameters !== 'undefined') {
		// 			return userParameter.integerParameters.map(function(integerParameter) {
		// 				return ({
		// 					fieldLabel: integerParameter.label,
		// 					name: integerParameter.key
		// 				});
		// 			});
		// 		}
		// 	});
		// }

		var formPanel = new Ext.FormPanel({
			url: this.operation.request.url,
			method: this.operation.request.method,
			title: this.operation.label.text,
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
			items: options.items,
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

		var values = Object.keys(options.values).map(function(key) {
			return {key: key, value: options.values[key]};
		});

		var parameters = {};
		if (typeof options.values !== 'undefined') {

			this.operation.request.parameterGroups.forEach(function(parameterGroup) {

				var items = {};

				if (parameterGroup.integerParameters instanceof Array) {
					parameterGroup.integerParameters.forEach(function(integerParameter) {
						var match = values.find(function(value) {
							return value.key === integerParameter.key;
						});
						if (typeof match !== 'undefined') {
							items[integerParameter.key] = match.value;
						}

						// find(function(value) {
						// })
						// items[integerParameter.key] = 'hmm';
						// return {
						// 	fieldLabel: integerParameter.label.text,
						// 	name: integerParameter.key
						// };
					});
					// return integerParameterItems;
				}

				if (parameterGroup.modelParameters instanceof Array) {
					// return [{
					// 	fieldLabel: 'model',
					// 	name: 'model'
					// }];
				}

				if (parameterGroup.stringParameters instanceof Array) {
					// return [{
					// 	fieldLabel: 'model',
					// 	name: 'model'
					// }];
				}
				parameters[parameterGroup.name] = items;
			});
			// if key exists amoung options.values


			//parameters = options.values
		}

		if (this.hasServiceParameters()) {
			request.serviceParameters.forEach(function(parameter) {
				parameters[parameter.key] = parameter.value;
			})
		}
		this.getModel({
			modelType: 'BPMN',
			onSuccess: function(response) {
				//parameters['input'] = response.responseText;

				var requestOptions = {
					url: request.url,
					method: request.method,
					success: function(request) {
						options.onSuccess(request.responseText);
					}.bind(this),
					failure: function(request) {
						options.onFailure(request);
					}.bind(this)
				}

				if (request.contentType === 'application/json') {
					requestOptions['jsonData'] = parameters;
				} else if (request.contentType === 'application/xml') {
					//requestOptions['xmlData'] = ...; // TODO
				} else if (request.contentType === 'application/x-www-form-urlencoded') {
					//requestOptions['params'] = parameters;

					// TODO => not understood by transpiler
					// const searchParams = Object.keys(parameters).map((key) => {
  				// 	return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(parameters[key]));
					// }).join('&');

					requestOptions['params'] = searchParams;
				}

				Ext.Ajax.request(requestOptions);
			}.bind(this),
			onFailure: function(response) {
				this.insertItem({
					response: JSON.stringify(response)
				})
			}.bind(this)
		});
	},

	getModel: function(options) {
		var url;
		var parameters = {};
		if (options.modelType === 'PNML') {
			url = ORYX.CONFIG.SIMPLE_PNML_EXPORT_URL;
			var resource = location.href;
			var tool = 'lola';
			var serialized_rdf = this.controller.getRDFFromDOM();
			if (!serialized_rdf.startsWith("<?xml")) {
				serialized_rdf = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
				+ serialized_rdf;
			}

			parameters['resource'] = resource;
			parameters['tool'] = tool;
			parameters['data'] = serialized_rdf
		} else if (options.modelType === 'BPMN') {
			url = ORYX.CONFIG.ROOT_PATH + "bpmn2_0serialization";
			var serialized_json = this.controller.facade.getSerializedJSON();
			parameters['data'] = serialized_json
		}

		Ext.Ajax.request({
			url: url,
			method: 'POST',
			success: function(request) {
				options.onSuccess(request);
			}.bind(this),
			failure: function(request) {
				options.onFailure(request);
			}.bind(this),
			params: parameters
		});
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
	}
});
