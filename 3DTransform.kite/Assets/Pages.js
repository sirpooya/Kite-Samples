//
//  Pages.js
//  Kite
//
//  Created on 5/22/17.
//

// ------------------------------------------
// Called just before the presentation starts
// ------------------------------------------

layer.canvasReady = function(event) {

    // Locate Layers in the layer tree
    //
    var scrollLayer = canvas.getLayerByName("Pages Proxy Scroll");
    var scrollOffsetY =  scrollLayer.bounds.origin.y;
    
    // Turn off automatic animations
    //
    this.allowsImplicitAnimations = false;
    
    // Get a reference to this layer to use in the observation block scope
    //
    var thisLayer = this;

    scrollLayer.observe("bounds", function (object, oldValue, newValue) {

        var newYPos = scrollOffsetY - newValue.origin.y;
        thisLayer.sublayerTranslationZ = newYPos;
    });
};
