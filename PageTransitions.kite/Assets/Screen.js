//
//  Screen.js
//  Kite
//

// ------------------------------------------
// Called just before the presentation starts
// ------------------------------------------

layer.canvasReady = function(event) {
    
    var play3DTouch = this.interactions[0]
    console.log("Canavas Ready with: " + play3DTouch.name);
    
    this.play3DTouch = play3DTouch;
};

layer.startAnimation = function() {
    
    var thisLayer = this;
    
    var timer = new Timer(4, true, function(timer) {
    
        console.log("Firing animation!");
        thisLayer.play3DTouch.fire();    
    });
    
    this.timer = timer;
    this.play3DTouch.fire();
};

layer.stopAnimation = function() {
    
    this.timer.invalidate();
    this.timier = null;
    this.play3DTouch = null;
};
