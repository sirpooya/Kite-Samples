//
//  App Tool Tip.js
//  Kite
//
//


// Called just before the presentation starts
//
layer.canvasReady = function(event) {
    
    this.toolTipTextLayer = canvas.getLayerByName("Tool Tip Text");
    
    var positionAnim = BasicAnimation();
    positionAnim.duration = 0.01;
    
    this.actions = { "position": positionAnim };
};

layer.setToolTipText = function(toolTipText) {
    
    var toolTipTextLayer = this.toolTipTextLayer;
    
    if (toolTipTextLayer == null || toolTipTextLayer == undefined) { return; }
    
    toolTipTextLayer.string = toolTipText;
}
