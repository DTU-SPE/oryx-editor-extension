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

			var window;
			this.window = window;
		},

		react: function(button, pressed) {
			var me = this;
			if (pressed) {
				this.setActivated(button, false);
				this.reflect({
					onSuccess: function(response) {
						options = response.map(function(response) {
							return {text: response.title,
								handler: function() {
									me.request({
										request: response.request,
										onSuccess: function(response) {
											console.log(response);
										}.bind(this),
										onFailure: function(response) {
											console.log(response);
										}.bind(this)
									});
								}
							};
						});

						if(!this.window){
							this.window = new Ext.Window({
								//layout:'fit',
								width:500,
								height:300,
								closeAction:'hide',
								plain: true,
								autoScroll: true,

								buttons: [{
									text: 'Close',
									handler: function() {
										me.window.hide();
									}
								}],

								tbar: options
							});
						}
						this.window.show(this);
					}.bind(this),
					onFailure: function(response) {
						console.log(response);
					}.bind(this)
				});
			}
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
					var res = Ext.decode(request.responseText);
					options.onSuccess(res);
				}.bind(this),
				failure : function(request) {
					options.onFailure(request);
				}.bind(this)
			});
		},

		request: function(options) {
			Ext.applyIf(options || {}, {
				showErrors : true,
				onSuccess : Ext.emptyFn,
				onFailure : Ext.emptyFn
			});

			var request = options.request
			var parameters = {};
			request.parameters.forEach(function(parameter) {
				parameters[parameter.key] = parameter.value;
			})

			// Test input
			parameters['input'] = '<?xml version="1.0" encoding="UTF-8"?><pnml><module><net id="petrinet" type="PTNet"><place id="oryx_EFB196E3-78A4-4A60-B551-6E469A5369EC"><initialMarking><text>1</text></initialMarking></place><place id="oryx_17734DA1-7BF2-4FE7-B0FE-39A9624324EA"/><transition id="oryx_B0790982-42D3-48C2-9C31-9B100D09D69B"><name><text/></name></transition><arc id="from_oryx_EFB196E3-78A4-4A60-B551-6E469A5369EC_to_oryx_B0790982-42D3-48C2-9C31-9B100D09D69B" source="oryx_EFB196E3-78A4-4A60-B551-6E469A5369EC" target="oryx_B0790982-42D3-48C2-9C31-9B100D09D69B"/><arc id="from_oryx_B0790982-42D3-48C2-9C31-9B100D09D69B_to_oryx_17734DA1-7BF2-4FE7-B0FE-39A9624324EA" source="oryx_B0790982-42D3-48C2-9C31-9B100D09D69B" target="oryx_17734DA1-7BF2-4FE7-B0FE-39A9624324EA"/></net><finalmarkings><marking><place idref="oryx_17734DA1-7BF2-4FE7-B0FE-39A9624324EA"><text>1</text></place></marking></finalmarkings></module></pnml>'

			Ext.Ajax.request({
				url : request.url,
				method : request.method,
				success : function(request) {
					// how to remove?? or list properly
					console.log(this.window);

					var item = {
						title: Date.now(),
						html: request.responseText
					};

					this.window.add(item);
					this.window.doLayout();
					options.onSuccess(request.responseText);
				}.bind(this),
				failure : function(request) {
					console.log(this.window);
					options.onFailure(request);
				}.bind(this),
				params: parameters
			});
		}

	});

	ORYX.Plugins.GenericWebService.REFLECT_EVENT = "reflect";
