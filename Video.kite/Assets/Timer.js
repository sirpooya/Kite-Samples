//
//  Timer.js
//  Kite
//
//  Created on 12/8/16.
//


// ------------------------------------------
// Called just before the presentation starts
// ------------------------------------------

layer.canvasReady = function(event) {

    this.timeLayer = canvas.getLayerByName("Recording Time");
    this.timeValue = 1;
};


// ------------------------------------------
// Handle Events
// ------------------------------------------

layer.startIncrementingTime = function() {
    
    var self = this;
    
    var timer = new Timer(1, true, function(timer) {
        
        var timeValue = self.timeValue;
        var timeString = timeValue < 10 ? "0:0" : "0:";
        
        self.timeLayer.string = timeString + self.timeValue;
        self.timeValue++;
    });
    
    self.timer = timer;
};

layer.stopIncrementingTime = function() {
    
    this.timer.invalidate();
    this.timer = null;
};