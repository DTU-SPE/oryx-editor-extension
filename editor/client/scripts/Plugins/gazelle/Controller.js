if (!ORYX.Plugins.Gazelle) {
	ORYX.Plugins.Gazelle = new Object();
}

/**
* Generic Web Service plugin
*
* @class
* @extends ORYX.Plugins.AbstractPlugin
*/
ORYX.Plugins.Gazelle.Controller = ORYX.Plugins.AbstractPlugin.extend({
	construct: function() {
		// Call super class constructor
		arguments.callee.$.construct.apply(this, arguments);

		this.facade.offer({
			'name': 'Generic Web Service', // ORYX.I18N.Controller.name
			'functionality': this.react.bind(this),
			'group': 'analysis', // ORYX.I18N.Controller.group
			'icon': ORYX.PATH + "images/icon-ws.png",
			'description': 'Generic Web Service plugin', // ORYX.I18N.Controller.desc
			'index': 0,
			'toggle': true,
			'minShape': 0,
			'maxShape': 0
		});

		var window = undefined;
		var services = [];
		this.window = window;
		this.services= services;
	},

	react: function(button, pressed) {
		if (pressed) {
			this.setActivated(button, false);

			if(!this.window) {
				this.window = this.CreateWindow();
				this.window.show(this, this.initialize());
			} else {
				this.window.show();
			}
		}
	},

	setActivated: function(button, activated) {
		button.toggle(activated);
		if (activated === undefined) {
			this.active = !this.active;
		} else {
			this.active = activated;
		}
	},

	initialize: function() {
		// Expected input from the user
		var service_endpoint_url = 'http://localhost:1234/service.json'

		this.CreateService({
			url: service_endpoint_url,
			onSuccess: function(service) {
				// add service to controller
				this.addService(service);

				// add service to view
				var servicePanel = service.CreatePanel();
				this.window.insert(1, servicePanel);
				this.window.doLayout();

				// add operations to view
				this.addOperations({
					operations: service.getOperations(),
					container: servicePanel
				});
			}.bind(this),
			onFailure: function(response) {
				console.log(response);
			}.bind(this)
		})
	},

	CreateService: function(options) {
		this.getAsyncData({url: options.url})
		.then(function(response) {
			var contentType = response.getResponseHeader["Content-Type"].replace(/\s/g, "")
			if (contentType === 'application/json') {
				// TODO
			}
			var responseText = Ext.decode(response.responseText);
			var service = new ORYX.Plugins.Gazelle.Service({service: responseText});

			var links = service.getLinks();
			var promises = links.map(function(link) {
				return this.getAsyncData({url: link.href});
			}.bind(this));

			return Promise.all(promises).then(function(values) {
				return {values: values, service: service};
			});
		}.bind(this))
		.then(function(response) {
			response.values.forEach(function(r) {
				var array = Ext.decode(r.responseText);
				array.forEach(function(value) {
					var operation = new ORYX.Plugins.Gazelle.Operation({operation: value, controller: this});
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
					return operation.CreateFormPanel();
				} else {
					return operation.CreateButton();
				}
			}.bind(this)
		);
		options.container.add({items: operations});
		options.container.doLayout();
	},

	request: function(options) {
		Ext.applyIf(options || {}, {
			showErrors: true,
			onSuccess: Ext.emptyFn,
			onFailure: Ext.emptyFn
		});
		var request = options.request;
		var parameters = {};
		request.serviceParameters.forEach(function(parameter) {
			parameters[parameter.key] = parameter.value;
		})

		this.getPNML({
			onSuccess: function(response) {
				parameters['input'] = response.responseText;

				Ext.Ajax.request({
					url: request.url,
					method: request.method,
					success: function(request) {
						options.onSuccess(request.responseText);
					}.bind(this),
					failure: function(request) {
						options.onFailure(request);
					}.bind(this),
					params: parameters
				});
			}.bind(this),
			onFailure: function(response) {
				this.insertItem({
					response: JSON.stringify(response)
				})
			}.bind(this)
		})
	},



	CreateWindow: function() {
		return new Ext.Window({
			width: 500,
			height: 300,
			closeAction: 'hide',
			plain: true,
			autoScroll: true,
			buttons: [
				{
					text: 'Close',
					handler: function() {
						this.window.hide();
					}.bind(this)
				}
			]
		});
	},

	handleAddOperation: function(options) {
		this.request({
			request: options.operation.request,
			onSuccess: function(response) {
				this.insertItem({response: response});
			}.bind(this),
			onFailure: function(response) {
				this.insertItem({
					response: JSON.stringify(response)
				})
			}.bind(this)
		});
	},

	addService: function(service) {
		this.services.push(service);
	}
});
