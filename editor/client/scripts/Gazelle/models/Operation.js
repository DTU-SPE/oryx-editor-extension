if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Models) { ORYX.Gazelle.Models = {} }

ORYX.Gazelle.Models.Operation = Clazz.extend({
	construct: function(parent) {
		arguments.callee.$.construct.apply(this, arguments);

		this.parent = parent;
		this.model = undefined;
	},

	load: function(options) {
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

	hasUserParameters: function() {
		var userParameters = this.model.request.parameterGroups;
		return (
			typeof userParameters !== 'undefined'
			&& userParameters instanceof Array
			&& userParameters.length > 0
		);
	},

	hasServiceParameters: function() {
		var userParameters = this.model.request.serviceParameters;
		return (
			typeof userParameters !== 'undefined'
			&& userParameters instanceof Array
			&& userParameters.length > 0
		);
	},

	handleSubmit: function(options) {
		var parameters = this.CreateParameters({
			formValues: options.form.getValues(),
			configurations: this.model.request.requestConfigurations
		});

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
	},

	CreateParameters: function(options) {
		var parameters = options.formValues;
		var configurations = options.configurations;

		// add key-value pair for each configuration to the parameters
		configurations.forEach(function(configuration) {
			parameters[configuration.key] = configuration.value;
		});
		return parameters;
	},

	request: function(options) {
		this.getModel({
			modelType: 'BPMN',
			onSuccess: function(response) {
				var responseText = response.responseText;
				var xml = Ext.decode(responseText).xml
				var xmlEscaped = _.escape(xml)

				options.parameters['model'] = xmlEscaped;

				var requestOptions = {
					url: options.request.url,
					method: options.request.method,
					success: function(request) {
						options.onSuccess(options.request.responseText);
					}.bind(this),
					failure: function(request) {
						options.onFailure(request);
					}.bind(this)
				}

				if (options.request.contentType === 'application/json') {
					requestOptions['jsonData'] = options.parameters;
				} else if (options.request.contentType === 'application/xml') {
					//requestOptions['xmlData'] = ...; // TODO
				} else if (options.request.contentType === 'application/x-www-form-urlencoded') {
					requestOptions['params'] = options.parameters;
				}

				Ext.Ajax.request(requestOptions);
			}.bind(this),
			onFailure: function(error) {
				console.log(error);
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
