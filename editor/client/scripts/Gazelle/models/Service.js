if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Models) { ORYX.Gazelle.Models = {} }

ORYX.Gazelle.Models.Service = Clazz.extend({
	construct: function(props) {
		arguments.callee.$.construct.apply(this, arguments);

		this.props = props;
		this.model = undefined;
	},

	load: function(options) {
		return new Promise(function(resolve, reject) {
			this.CreateRequestPromise({url: options.url})
			.then(function(response) {
				this.model = Ext.decode(response.responseText);
				resolve(response);
			}.bind(this))
			['catch'](function(error) {
				reject(error);
			});
		}.bind(this));
	},

	get: function() {
		return this.model;
	},

	getLinks: function() {
		return this.model.links;
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
	}
});
