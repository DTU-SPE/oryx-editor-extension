if (!ORYX.Plugins.Gazelle) {
	ORYX.Plugins.Gazelle = new Object();
}

ORYX.Plugins.Gazelle.Operation = Clazz.extend({
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
