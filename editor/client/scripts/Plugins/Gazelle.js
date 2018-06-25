if(!ORYX.Plugins) {
	ORYX.Plugins = new Object();
}

/**
* Gazelle - Generic Web Service plugin
*
* @class
* @extends ORYX.Plugins.AbstractPlugin
*/
ORYX.Plugins.Gazelle = ORYX.Plugins.AbstractPlugin.extend({
	construct: function(facade) {
		// Call super class constructor
		arguments.callee.$.construct.apply(this, arguments);

		this.facade = facade;

		this.facade.offer({
			'name': 'Generic Web Service', // ORYX.I18N.Gazelle.name
			'functionality': this.handleButtonPressed.bind(this),
			'group': 'analysis', // ORYX.I18N.Gazelle.group
			'icon': ORYX.PATH + "images/icon-ws.png",
			'description': 'Generic Web Service plugin', // ORYX.I18N.Gazelle.desc
			'index': 0,
			'toggle': true,
			'minShape': 0,
			'maxShape': 0
		});

		this.mainController = new ORYX.Gazelle.Controllers.MainController();
		this.serviceControllers = [];
		this.operationControllers = []
	},

	handleHide: function (button) {
		this.setActivated(button, false)
	},

	handleInit: function() {
		var serviceResourceUrls = [
			'http://localhost:1234/service_lola_v2.json',
			'http://localhost:1234/service_plg_v2.json'
		];
		this.serviceControllers = serviceResourceUrls.map(function(serviceResourceUrl) {
			var serviceController = new ORYX.Gazelle.Controllers.ServiceController();
			serviceController.initialize({
				url: serviceResourceUrl,
				onSuccess: function() {
					this.mainController.addComponentToView(serviceController.getView());
					this.operationControllers = serviceController.getLinks().map(function(link) {
						this.getOperations({url: link.href})
						.then(function(response) {
							response.links.map(function(link) {
								var operationController = new ORYX.Gazelle.Controllers.OperationController();
								operationController.initialize({
									parent: this,
									link: link,
									onSuccess: function() {
										serviceController.addComponentToView(operationController.getView());
									}
								});
								return operationController;
							}.bind(this))
						}.bind(this))
						['catch'](function(error) {
							// TODO
						});
					}.bind(this));
				}.bind(this)
			});
			return serviceController;
		}.bind(this));
	},

	getOperations: function(options) {
		return new Promise(function(resolve, reject) {
			this.CreateRequestPromise({url: options.url})
			.then(function(response) {
				var responseText = Ext.decode(response.responseText);
				resolve(responseText);
			}.bind(this))
			['catch'](function(error) {
				reject(error);
			});
		}.bind(this));
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

	handleButtonPressed: function(button, pressed) {
		if (pressed) {
			if (! this.mainController.isLoaded()) {
				this.mainController.load({
					onHide: function() { this.handleHide(button); }.bind(this),
					onInit: function() { this.handleInit() }.bind(this)
				});
			}
			this.mainController.show();
		} else {
			this.mainController.hide();
			this.handleHide(button);
		}
	}
});
