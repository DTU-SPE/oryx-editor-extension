if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Models) { ORYX.Gazelle.Models = {} }

ORYX.Gazelle.Models.Operation = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.parent = undefined;
		this.model = undefined;
	},

	load: function(options) {
		this.parent = options.parent;
		return new Promise(function(resolve, reject) {
			this.CreateRequestPromise({url: options.url})
			.then(function(response) {
				this.model = Ext.decode(response.responseText);
				resolve(this.model);
			}.bind(this))
			['catch'](function(error) {
				reject(error);
			});
		}.bind(this));
	},

	get: function() {
		return this.model;
	},

	getRequest: function() {
		return this.model.request;
	},

	getRequestConfigurations: function() {
		return this.model.request.requestConfigurations;
	},

	CreateRequestPromise: function(options) {
		return new Promise(function(resolve, reject){
			Ext.Ajax.request({
				url: options.url,
				method: 'GET',
				success: function(request) {
					resolve(request);
				},
				failure: function(request) {
					reject(request);
				}
			});
		});
	},

	handleSubmit: function(options) {
		this.CreateParametersPromise({
			formValues: options.form.getValues(),
			request: this.model.request
		})
		.then(function(parameters) {
			this.request({
				request: this.model.request,
				parameters: parameters,
				onSuccess: function(response) {
					// TODO
				}.bind(this),
				onFailure: function(error) {
					console.log(error);
				}.bind(this)
			});
		}.bind(this));
	},

	request: function(options) {
		var requestOptions = {
			url: options.request.url,
			method: options.request.method,
			success: function(request) {
				options.onSuccess(request);
			}.bind(this),
			failure: function(request) {
				options.onFailure(request);
			}.bind(this)
		};

		if (options.request.contentType === 'application/json') {
			requestOptions['jsonData'] = options.parameters;
		} else if (options.request.contentType === 'application/xml') {
			//requestOptions['xmlData'] = ...; // TODO
		} else if (options.request.contentType === 'application/x-www-form-urlencoded') {
			requestOptions['params'] = options.parameters;
		} else {
			console.log('Content type of request is not supported.')
		}

		Ext.Ajax.request(requestOptions);
		// });
	},

	CreateParametersPromise: function(options) {
		return new Promise(function(resolve, reject) {
			// use form values as base parameters
			var parameters = options.formValues;

			// add key-value pair for each configuration to the parameters
			var configurations = options.request.requestConfigurations;
			configurations.forEach(function(configuration) {
				parameters[configuration.key] = configuration.value;
			});

			var modelParameters = _.filter(options.request.parameters, {'type': 'MODEL'});

			if (modelParameters.length > 0) {
				var modelPromises = _.map(modelParameters, function(modelParameter) {
					return this.CreateModelPromise({modelParameter: modelParameter});
				}.bind(this));

				Promise.all(modelPromises).then(function(modelResolves) {
					modelResolves.forEach(function(modelResolve) {
						if (typeof modelResolve.parameter.model.encoding.name !== 'undefined') {
							if (modelResolve.parameter.model.encoding.name === 'ESCAPED') {
								var xml = Ext.decode(modelResolve.request.responseText).xml
								var xmlEscaped = _.escape(xml)
								parameters[modelResolve.parameter.key] = xmlEscaped;
							} else {
								parameters[modelResolve.parameter.key] = modelResolve.request.responseText;
							}
						} else {
							parameters[modelResolve.parameter.key] = modelResolve.request.responseText;
						}
					});
					resolve(parameters);
				})
				['catch'](function(error) {
					reject(error);
				});
			} else {
				resolve(parameters);
			}
		}.bind(this));
	},

	CreateModelPromise: function(options) {
		return new Promise(function(resolve, reject) {
			var url;
			var parameters = {};
			var diagram = this.parent.facade.getJSON();
			var formats = options.modelParameter.model.formats;

			if (diagram.stencilset.namespace === 'http://b3mn.org/stencilset/petrinet#') {
				// supported Petri net transformations
				var format = _.find(formats, {'name': 'http://www.pnml.org/version-2009/grammar/pnml'});

				if (typeof format !== 'undefined') {
					var type = _.find(format.types, {'name': 'http://www.pnml.org/version-2009/grammar/ptnet'});

					if (typeof type !== 'undefined') {
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
					} else {
						console.log('type=' + type + ' is not supported for format=' + format + 'for diagram.stencilset.namespace=' + diagram.stencilset.namespace);
					}
				} else {
					console.log('format is unsupported for diagram.stencilset.namespace=' + diagram.stencilset.namespace);
				}
			} else if (diagram.stencilset.namespace === 'http://b3mn.org/stencilset/bpmn2.0#') {
				var format = _.find(formats, {'name': 'http://schema.omg.org/spec/BPMN/2.0'});

				if (typeof format !== 'undefined') {
					var type = _.find(format.types, {'name': 'http://bpmndi.org'});

					if (typeof type !== 'undefined') {
						url = ORYX.CONFIG.ROOT_PATH + "bpmn2_0serialization";
						var serialized_json = this.parent.facade.getSerializedJSON();
						parameters['data'] = serialized_json
					} else {
						console.log('type is unsupported for format=' + format + 'for diagram.stencilset.namespace=' + diagram.stencilset.namespace);
					}
				} else {
					console.log('format is unsupported for diagram.stencilset.namespace=' + diagram.stencilset.namespace);
				}
			}

			if (typeof parameters.data !== 'undefined') {
				Ext.Ajax.request({
					url: url,
					method: 'POST',
					success: function(request) {
						resolve({parameter: options.modelParameter, request: request});
					}.bind(this),
					failure: function(request) {
						reject(request);
					}.bind(this),
					params: parameters
				});
			}
		}.bind(this));
	}
});
