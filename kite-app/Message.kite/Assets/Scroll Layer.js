//
//  Scroll Layer.js
//  Kite
//
//


// ------------------------------------------
// Helper
// ------------------------------------------

// Called just before the presentation starts
//
layer.canvasReady = function(event) {
    
    this.allowsImplicitAnimations = false;
    var boundsAnimation = this.animations[0];
    var thisLayer = this;

    boundsAnimation.onCompletion = function(finished) {

        thisLayer.bounds.origin.y = 423;
        thisLayer.removeAllAnimations();
    };
};
