if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Controllers) { ORYX.Gazelle.Controllers = {} }

ORYX.Gazelle.Controllers.OperationController = Clazz.extend({
	construct: function(parent) {
		arguments.callee.$.construct.apply(this, arguments);

		this.parent = parent;
		this.model = new ORYX.Gazelle.Models.Operation();
		this.view = new ORYX.Gazelle.Views.Operation();
	},

	initialize: function(options) {
		this.model.load({url: options.link.href})
		.then(function(response) {
			this.view.load({
				model: this.model.get(),
				onSubmit: function(form) { this.handleSubmit(form); }.bind(this)
			});
			options.onSuccess();
		}.bind(this))
		['catch'](function(error) {
			// TODO
		});
	},

	handleSubmit: function(form) {
		this.request({
			request: this.model.get().request,
			values: form.getValues(),
			onSuccess: function(response) {
				// this.controller.insertItem({response: response});
			}.bind(this),
			onFailure: function(response) {
				// this.controller.insertItem({
				// 	response: JSON.stringify(response)
				// })
			}.bind(this)
		});
	},

	getView: function() {
		return this.view;
	},

	request: function(options) {
		var request = this.model.get().request;

		var values = Object.keys(options.values).map(function(key) {
			return {key: key, value: options.values[key]};
		});

		var parameters = {};
		if (typeof options.values !== 'undefined') {

			request.parameterGroups.forEach(function(parameterGroup) {

				var items = {};

				if (parameterGroup.integerParameters instanceof Array) {
					parameterGroup.integerParameters.forEach(function(integerParameter) {
						var match = values.find(function(value) {
							return value.key === integerParameter.key;
						});
						if (typeof match !== 'undefined') {
							items[integerParameter.key] = match.value;
						}
					});
				}

				if (parameterGroup.modelParameters instanceof Array) {
				}

				if (parameterGroup.stringParameters instanceof Array) {
				}
				parameters[parameterGroup.name] = items;
			});
		}

		if (this.model.hasServiceParameters()) {
			request.serviceParameters.forEach(function(parameter) {
				parameters[parameter.key] = parameter.value;
			})
		}
		this.getModel({
			modelType: 'BPMN',
			onSuccess: function(response) {
				var responseText = response.responseText;
				var xml = Ext.decode(responseText).xml
				var xmlEscaped = _.escape(xml)

				parameters['model'] = xmlEscaped;

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

					// requestOptions['params'] = searchParams;
				}

				Ext.Ajax.request(requestOptions);
			}.bind(this),
			onFailure: function(response) {
				this.view.insertItem({
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
			var serialized_rdf = this.parent.getRDFFromDOM();
			if (!serialized_rdf.startsWith("<?xml")) {
				serialized_rdf = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
				+ serialized_rdf;
			}

			parameters['resource'] = resource;
			parameters['tool'] = tool;
			parameters['data'] = serialized_rdf
		} else if (options.modelType === 'BPMN') {
			url = ORYX.CONFIG.ROOT_PATH + "bpmn2_0serialization";
			var serialized_json = this.parent.facade.getSerializedJSON();
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
	}
});
