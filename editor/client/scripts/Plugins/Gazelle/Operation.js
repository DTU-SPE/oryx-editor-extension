if (!ORYX.Plugins) {
	ORYX.Plugins = new Object();
}

ORYX.Plugins.Operation = Clazz.extend({
  construct: function(options) {
    arguments.callee.$.construct.apply(this, arguments);

    this.operation = options.operation;
  },

  hasUserParameters: function() {
    var userParameters = this.operation.request.userParameters;
    return (
      typeof userParameters !== 'undefined'
      && userParameters instanceof Array
      && userParameters.length > 0
    );
  },
});
