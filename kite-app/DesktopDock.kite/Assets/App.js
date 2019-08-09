//
//  App.js
//  Kite
//

// Called just before the presentation starts
//
layer.canvasReady = function(event) {
    
    var shadowLayer = canvas.getLayerByName("App Shadow");
    
    this.allowsImplicitAnimations = false;
    shadowLayer.allowsImplicitAnimations = false;
    
    var thisLayer = this;
    
    var shadowXOffset = shadowLayer.position.x - this.position.x;
    var shadowYOffset = shadowLayer.position.y - this.position.y;
    
    // Observe changes in position of the 'App' layer
    // When the app's position changes, update its shadow's position
    // based on the original offset of the shadow layer
    //
    this.observe("position", function (object, oldValue, newValue) {
        
        var newPoint = newValue.pointValue;
        var newPosition = { x: newPoint.x, y: newPoint.y };
        
        // Offset the new position by the shadowLayer's original
        // offset
        //
        newPosition.x += shadowXOffset;
        newPosition.y += shadowYOffset;
        
        shadowLayer.position = newPosition;
    });
};
