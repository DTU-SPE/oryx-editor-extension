if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Controllers) { ORYX.Gazelle.Controllers = {} }

ORYX.Gazelle.Controllers.MainController = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

		this.services = [];
		this.view = new ORYX.Gazelle.Views.Main();
	},

	handleInit: function() {
		var service_endpoint_lola = 'http://localhost:1234/service_lola.json';
		var service_endpoint_plg = 'http://localhost:1234/service_plg_v2.json';
		this.configureService({url: service_endpoint_lola});
		this.configureService({url: service_endpoint_plg});
	},

	initialize: function(options) {
		if (options.pressed) {
			this.view.displayWindow({
				onHide: function() { options.onHide(); },
				onInit: function() { this.handleInit(); }.bind(this)
			});
		} else {
			this.view.hideWindow();
			options.onHide();
		}
	},

	handleServiceConfigurationSuccess: function(service) {
		// add service to controller
		this.addService(service);

		// add service to view
		this.view.displayServicePanel({service: service});

		// add operations to view
		var operations = this.addOperations({
			operations: service.getOperations(),
		});
		this.view.displayServicePanelOperations({
			id: service.service.id, operations: operations
		});
	},

	configureService: function(options) {
		this.CreateService({
			url: options.url,
			onSuccess: function(service) {
				this.handleServiceConfigurationSuccess(service);
			}.bind(this),
			onFailure: function(response) {
				this.insertItem({
					response: JSON.stringify(response)
				})
			}.bind(this)
		});
	},

	CreateService: function(options) {
		this.getAsyncData({url: options.url})
		.then(function(response) {
			// var contentType = response.getResponseHeader["Content-Type"].replace(/\s/g, "")
			// if (contentType === 'application/json') {
			var model = Ext.decode(response.responseText);
			var service = new ORYX.Gazelle.Models.Service({service: model});
			var links = service.getLinks();
			var promises = links.map(function(link) {
				return this.getAsyncData({url: link.href});
			}.bind(this));
			return Promise.all(promises).then(function(values) {
				return {values: values, service: service};
			});
			// }
		}.bind(this))
		.then(function(response) {
			response.values.forEach(function(r) {
				var array = Ext.decode(r.responseText);
				array.forEach(function(value) {
					var operation = new ORYX.Gazelle.Models.Operation({operation: value});
					response.service.addOperation(operation);
				}, this);
			}, this);
			options.onSuccess(response.service);
		}.bind(this))
		['catch'](function(error) {
			options.onFailure(error);
		});
	},

	getAsyncData: function(options){
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

	insertItem: function(options) {
		var item = {
			title: Date.now(),
			html: options.response
		};
		this.window.insert(1, item);
		this.window.doLayout();
	},

	addOperations: function(options) {
		var operations = options.operations.map(
			function(operation) {
				if (operation.hasUserParameters()) {
					return operation.CreateFormPanels();
					//return operation.CreateFormPanel();
				} else {
					return operation.CreateButton();
				}
			}.bind(this)
		);
		return operations;
	},

	addService: function(service) {
		this.services.push(service);
	}
});
