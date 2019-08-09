//
//  Profile Image.js
//  Kite
//
//

layer.canvasReady = function(event) {
    
    var infoLayer = canvas.getLayerByName("Scrollable Info");
    var profileTitleLayer = canvas.getLayerByName("Profile Title");
    var initialHeight = this.height;

    this.allowsImplicitAnimations = false;
    profileTitleLayer.allowsImplicitAnimations = false;
    
    // Get a reference to this layer to use in the observation block scope
    //
    var thisLayer = this;

    infoLayer.observe("bounds", function (object, oldValue, newValue) {

        var newYOffset = newValue.origin.y;
        
        if (newYOffset < 0) {
            thisLayer.bounds.height = (initialHeight - newYOffset);
        }
        else {
            thisLayer.bounds.height = initialHeight;
        }
        
        updateProfileTitleLayerPosition(profileTitleLayer, thisLayer);
    });
};

function updateProfileTitleLayerPosition(profileTitleLayer, profileImageLayer) {
    
    var halfProfileLayerHeight = profileImageLayer.height * 0.5;
    var halfTitleLayerHeight = profileTitleLayer.height * 0.5;
    var currentPosition = profileTitleLayer.position;
    
    var newPosition = { x: currentPosition.x,
                        y: halfProfileLayerHeight - halfTitleLayerHeight };
                        
    profileTitleLayer.position = newPosition;
}
