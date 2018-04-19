/**
* Copyright (c) 2008, Gero Decker, refactored by Kai Schlichting
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
Analyze Petri nets using LoLA 2
@class ORYX.Plugins.Lola
@constructor Creates a new instance
@extends ORYX.Plugins.AbstractPlugin
*/
ORYX.Plugins.Lola = ORYX.Plugins.AbstractPlugin.extend({
  /**@private*/
  construct: function(){
    arguments.callee.$.construct.apply(this, arguments);

    this.active = false;
    this.raisedEventIds = [];

    this.facade.offer({
      'name': "LoLA 2.0", // ORYX.I18N.Lola.name
      'functionality': this.perform.bind(this),
      'group': "Verification", // ORYX.I18N.Lola.group
      'icon': ORYX.PATH + "images/lola2.png",
      'description': "Analyze Petri nets using LoLA 2", // ORYX.I18N.Lola.desc
      'index': 0,
      'toggle': true,
      'minShape': 0,
      'maxShape': 0
    });

    this.facade.registerOnEvent(ORYX.Plugins.Lola.ANALYZE_EVENT, this.analyze.bind(this));
  },

  perform: function(button, pressed){
    if (!pressed) {
    } else {
      this.setActivated(button, false);
      this.analyze({
        onSuccess: function(response) {
          this.facade.raiseEvent({
            type:ORYX.CONFIG.EVENT_LOADING_STATUS,
            text:'Response: ' + response,
            timeout:10000
          });
        }.bind(this)
      });
    }
  },

  /**
  * Sets the activated state of the plugin
  * @param {Ext.Button} Toolbar button
  * @param {Object} activated
  */
  setActivated: function(button, activated){
    button.toggle(activated);
    if(activated === undefined){
      this.active = !this.active;
    } else {
      this.active = activated;
    }
  },

  /**
  * Analyze Petri net
  * @methodOf ORYX.Plugins.Lola.prototype
  * @param {Object} options Configuration hash
  * @param {Function} [options.onSuccess] Raised when model is counted.
  * @param {boolean} [options.showErrors=true] Display errors on nodes on canvas (by calling ORYX.Plugins.PetrinetCountObjects.prototype.showErrors)
  */
  analyze: function(options) {
    Ext.applyIf(options || {}, {
      showErrors: true,
      onSuccess: Ext.emptyFn
    });

    Ext.Msg.wait('Analyzing...'); // ORYX.I18N.Lola.analyzingMessage

    var serialized_rdf = this.getRDFFromDOM();
    if (!serialized_rdf.startsWith("<?xml")) {
      serialized_rdf = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serialized_rdf;
    }
    // Check other soundness criteria which needs server requests
    Ext.Ajax.request({
      url: ORYX.CONFIG.ROOT_PATH + 'lola2',
      method: 'POST',
      success: function(request){
        var res = Ext.decode(request.responseText);
        console.log(res);
        options.onSuccess(JSON.stringify(res));
      }.bind(this),
      failure: function(){

      }.bind(this),
      params: {
        data: serialized_rdf
      }
    });

    Ext.Msg.hide();


  }
});

ORYX.Plugins.Lola.ANALYZE_EVENT = "analyze";
