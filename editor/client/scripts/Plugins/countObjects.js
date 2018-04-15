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
Count objects in the diagram to show proof of concept
@class ORYX.Plugins.PetrinetCountObjects
@constructor Creates a new instance
@extends ORYX.Plugins.AbstractPlugin
*/
ORYX.Plugins.PetrinetCountObjects = ORYX.Plugins.AbstractPlugin.extend({
  /**@private*/
  construct: function(){
    arguments.callee.$.construct.apply(this, arguments);

    this.active = false;
    this.raisedEventIds = [];

    this.facade.offer({
      'name': "Count Objects", // ORYX.I18N.CountObjects.name
      'functionality': this.perform.bind(this),
      'group': "Verification", // ORYX.I18N.CountObjects.group
      'icon': ORYX.PATH + "images/sum.png",
      'description': "Count respectively drawn and selected objects", // ORYX.I18N.CountObjects.desc
      'index': 0,
      'toggle': true,
      'minShape': 0,
      'maxShape': 0
    });

    this.facade.registerOnEvent(ORYX.Plugins.PetrinetCountObjects.COUNT_OBJECTS_EVENT, this.countObjects.bind(this));
  },

  perform: function(button, pressed){
    if (!pressed) {
    } else {
      this.setActivated(button, false);
      this.countObjects({
        onSuccess: function(numObjects, numSelectedObjects) {
          this.facade.raiseEvent({
            type:ORYX.CONFIG.EVENT_LOADING_STATUS,
            text:'Objects in diagram: ' + numObjects + ', ' + 'Selected objects: ' + numSelectedObjects,
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
  * Count respectively drawn and selected objects
  * @methodOf ORYX.Plugins.PetrinetCountObjects.prototype
  * @param {Object} options Configuration hash
  * @param {Function} [options.onSuccess] Raised when model is counted.
  * @param {boolean} [options.showErrors=true] Display errors on nodes on canvas (by calling ORYX.Plugins.PetrinetCountObjects.prototype.showErrors)
  */
  countObjects: function(options) {
    Ext.applyIf(options || {}, {
      showErrors: true,
      onSuccess: Ext.emptyFn
    });

    Ext.Msg.wait('Counting...'); // ORYX.I18N.CountObjects.checkingMessage

    var numObjects = this.facade.getCanvas().children.length;
    var numSelectedObjects = this.facade.getSelection().length;

    Ext.Msg.hide();

    options.onSuccess(numObjects, numSelectedObjects);
  }
});

ORYX.Plugins.PetrinetCountObjects.COUNT_OBJECTS_EVENT = "countObjects";
