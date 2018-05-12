/**
 * Copyright (c) 2018
 * Jesper B. Hansen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 **/

if (!ORYX.Plugins)
	ORYX.Plugins = new Object();

/**
 * Generic Web Service plugin
 * @class
 * @extends ORYX.Plugins.AbstractPlugin
 */
ORYX.Plugins.GenericWebService = ORYX.Plugins.AbstractPlugin.extend({
	construct : function() {
    // Call super class constructor
		arguments.callee.$.construct.apply(this, arguments);

		this.facade.offer({
			'name' : 'Generic Web Service', // ORYX.I18N.GenericWebService.name
			'functionality' : this.react.bind(this),
			'group' : 'Analysis', // ORYX.I18N.GenericWebService.group
			'icon' : ORYX.PATH + "images/icon-ws.png",
			'description' : 'Generic Web Service plugin', // ORYX.I18N.GenericWebService.desc
			'index' : 0,
			'toggle' : true,
			'minShape' : 0,
			'maxShape' : 0
		});

		this.facade.registerOnEvent(ORYX.Plugins.GenericWebService.REFLECT_EVENT,
				this.reflect.bind(this));
	},

	react: function(button, pressed) {
			this.reflect({
				onSuccess : function(response) {
					console.log(response);
          this.setActivated(button, false);
				}.bind(this),
				onFailure : function(response) {
					console.log(response);
          this.setActivated(button, false);
				}.bind(this)
			});
	},

	/**
	 * Sets the activated state of the plugin
	 * @param {Ext.Button} Toolbar button
	 * @param {Object} activated
	 */
	setActivated : function(button, activated) {
		button.toggle(activated);
		if (activated === undefined) {
			this.active = !this.active;
		} else {
			this.active = activated;
		}
	},

	/**
	 * TODO
	 * @param {Object} options Configuration hash
	 * @param {Function} [options.onSuccess] TODO
	 * @param {boolean} [options.showErrors=true] TODO
	 */
	reflect: function(options) {
		Ext.applyIf(options || {}, {
			showErrors : true,
			onSuccess : Ext.emptyFn,
			onFailure : Ext.emptyFn
		});

		Ext.Ajax.request({
			url : 'http://localhost:1234/operations.json',
			method : 'GET',
			success : function(request) {
				console.log(request);
				var res = Ext.decode(request.responseText);
				console.log(res);
				options.onSuccess(JSON.stringify(res));
			}.bind(this),
			failure : function(request) {
				console.log(request)
				options.onFailure(request);
			}.bind(this)
		});
	}
});

ORYX.Plugins.GenericWebService.REFLECT_EVENT = "reflect";
