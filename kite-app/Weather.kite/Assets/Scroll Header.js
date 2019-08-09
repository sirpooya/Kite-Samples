//
//  Scroll Header.js
//  Kite
//


// ------------------------------------------
// Called just before the presentation starts
// ------------------------------------------

layer.canvasReady = function(event) {

    // Locate Layers in the layer tree
    //
    var forcastLayer = canvas.getLayerByName("Week Forcast Scroll Layer");
    var localConditionsLayer = canvas.getLayerByName("Current Local Conditions");
    var currentConditionsHeaderLayer = canvas.getLayerByName("Current Conditions");
    var largeTemperatureLayer = canvas.getLayerByName("Temperature");

    // Note initial Positions
    //
    var initialForcastYPos = this.y;
    var smallestForcastYPos = forcastLayer.y;
    
    var initialLocalConditionsYPos = localConditionsLayer.y;
    var smallestLocalConditionsYPos = 27;
    
    // Turn off automatic animations
    //
    this.allowsImplicitAnimations = false;
    localConditionsLayer.allowsImplicitAnimations = false;
    largeTemperatureLayer.allowsImplicitAnimations = false;
    currentConditionsHeaderLayer.allowsImplicitAnimations = false;
    
    // Get a reference to this layer to use in the observation block scope
    //
    var thisLayer = this;

    // Observe changes to the main scroll layer to calculate the new positions
    // and opacities of layers
    //
    forcastLayer.observe("bounds", function (object, oldValue, newValue) {

        var newYPos = newValue.origin.y;
        var newForcastYOffset = initialForcastYPos - newYPos;
        var newLocalConditionsYOffset = initialLocalConditionsYPos - newYPos;
        
        var temperatureScrollPercentage = ((newYPos * 1.4) / smallestForcastYPos);
        var conditionsScrollPercentage = ((newYPos * 1.9) / smallestForcastYPos);
        
        largeTemperatureLayer.opacity = 1 - temperatureScrollPercentage;
        currentConditionsHeaderLayer.opacity = 1 - conditionsScrollPercentage;
        
        thisLayer.y = Math.max(newForcastYOffset, smallestForcastYPos);
        localConditionsLayer.y = Math.max(newLocalConditionsYOffset, smallestLocalConditionsYPos);
    });
};
