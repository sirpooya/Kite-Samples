//
//  Document Layer.js
//  Kite
//
//


// ------------------------------------------
// Called just before the presentation starts
// ------------------------------------------

layer.canvasReady = function(event) {

    // Find the layers we need in the layer tree
    //
    var scrollLayer = canvas.getLayerByName("Scroll Layer");
    var appIcon = canvas.getLayerByName("App Icon");
    var iPhone = canvas.getLayerByName("iPhone");
    var downloadButton = canvas.getLayerByName("Download Button");
    var buyButton = canvas.getLayerByName("Buy Button");
    var feature1 = canvas.getLayerByName("Feature 1");
    var feature2 = canvas.getLayerByName("Feature 2");
    var thisLayer = this;

    var allLayers = [appIcon, iPhone, downloadButton,
                     buyButton, feature1, feature2 ];

    // Turn off implicit animations
    //
    for (lay of allLayers) {
        lay.allowsImplicitAnimations = false;
    }

    // When the scroll view scrolls, call us back and update
    // parallax layer positions.
    //
    scrollLayer.observe("bounds", function (object, oldValue, newValue) {

        var newYOffset = newValue.origin.y;
        var oldYOffset = oldValue.origin.y;
        var scrollDelta = newYOffset - oldYOffset;

        appIcon.y += (scrollDelta * 0.2);
        iPhone.y += (scrollDelta * 0.3);
        downloadButton.y += (scrollDelta * 0.05);
        buyButton.y += (scrollDelta * 0.05);
        feature1.y += (scrollDelta * 0.05);
        feature2.y += (scrollDelta * 0.05);
    });
}
