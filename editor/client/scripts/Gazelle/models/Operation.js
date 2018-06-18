if(!ORYX) { var ORYX = {} }
if(!ORYX.Gazelle) { ORYX.Gazelle = {} }
if(!ORYX.Gazelle.Models) { ORYX.Gazelle.Models = {} }

ORYX.Gazelle.Models.Operation = Clazz.extend({
	construct: function(options) {
		arguments.callee.$.construct.apply(this, arguments);

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
	}
});
