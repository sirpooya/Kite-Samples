//
//  Dock.js
//  Kite
//


var kMaxDockWidth = 1179;
var kMaxIconScale = 2.0;
var kToolTipYOffset = 630.0;


// Called just before the presentation starts
//
layer.canvasReady = function(event) {
    
    this.screenLayer = canvas.getLayerByName("Screen");
    this.dockBackgroundLayer = canvas.getLayerByName("Dock Background");
    this.toolTipLayer = canvas.getLayerByName("App Tool Tip");
    
    // The unscaled width of one dock icon
    //
    var iconWidth = this.sublayers[0].width;
    this.halfIconHeight = this.sublayers[0].height * 0.5;
    this.scaleBoundrySize = iconWidth * 2.75;
    this.magnifiedScaleBoundrySize = iconWidth * 4.5;
    this.dockPaddingWidth = this.calculateDockPadding();
    this.mouseInRect = false;
    
    // Don't actually scale the divider's 'icon' layer
    //
    var dividerLayer = canvas.getLayerByName("Divider");
    dividerLayer.icon = Layer();
    this.dividerLayer = dividerLayer;
};

layer.calculateDockPadding = function() {
    
    var totalIconWidth = 0;
    
    var scaleAnim = SpringAnimation();
    scaleAnim.damping = 5;
    scaleAnim.initialVelocity = 0;
    scaleAnim.mass = 0.3;
    scaleAnim.stiffness = 150;
    
    var actions = { "transform.scale": scaleAnim };
    
    for (var app of this.sublayers) {
        
        totalIconWidth += app.width;
        app.icon = app.getLayerByName("Icon");
        app.icon.actions = actions;
    }
    
    return (this.dockBackgroundLayer.width - totalIconWidth);
};

layer.scaleApps = function(pointInDock, apps, animate, scaleBoundrySize) {
    
    var totalNewIconWidth = 0;
    
    for (var app of apps) {
        
        var appDockRect = this.convertRectFromLayer(app.bounds, app);
        var centerX = appDockRect.x + (appDockRect.width * 0.5);
        var centerY = appDockRect.y + (appDockRect.height * 0.5);
        var appCenterDockPoint = { x: centerX, y: centerY };
        
        var minScaleBoundry = appCenterDockPoint.x - scaleBoundrySize;
        var maxScaleBoundry = appCenterDockPoint.x + scaleBoundrySize;
        var scaleBoundryWidth = maxScaleBoundry - minScaleBoundry;
        
        var scaleBoundryRect = { x: minScaleBoundry, y: appDockRect.y, 
                                 width: scaleBoundryWidth, height: appDockRect.height };

        var icon = app.icon;
        
        if (animate == false) {
            icon.allowsImplicitAnimations = false;
        }

        if ( this.mouseInRect && CGRectContainsPoint(scaleBoundryRect, pointInDock) ) {

            var distanceFromCenter = Math.abs(pointInDock.x - appCenterDockPoint.x);
            var normalizedScale = kMaxIconScale - (distanceFromCenter / (scaleBoundryWidth * 0.5));
            
            icon.scale = normalizedScale;
        }
        else {
            icon.scale = 1;
        }
        
        if (animate == false) {
            icon.allowsImplicitAnimations = true;
        }
        
        totalNewIconWidth += (app.width * icon.scale);
    }
    
    var newDockWidth = Math.round(totalNewIconWidth + this.dockPaddingWidth);
    
    var minCursorBoundry = pointInDock.x - this.magnifiedScaleBoundrySize;
    var maxCursorBoundry = pointInDock.x + this.magnifiedScaleBoundrySize;
    var cursorBoundryWidth = maxCursorBoundry - minCursorBoundry;
    var yCursorBoundry = (this.bounds.height * 0.5);
    
    var cursorBoundry = { x: minCursorBoundry, y: yCursorBoundry,
                          width: cursorBoundryWidth, height: 1.0 };
    
    if (animate == false) {
        this.dockBackgroundLayer.allowsImplicitAnimations = false;
        this.allowsImplicitAnimations = false;
    }
        
    this.dockBackgroundLayer.width = newDockWidth;
    this.width = newDockWidth;
    
    if (this.mouseInRect && CGRectContainsRect(this.bounds, cursorBoundry) ) {
            
        this.dockBackgroundLayer.width = kMaxDockWidth;
        this.width = kMaxDockWidth;
    }
    
    if (animate == false) {
        this.allowsImplicitAnimations = true;
        this.dockBackgroundLayer.allowsImplicitAnimations = true;
    }
};

layer.repositionApps = function(apps, animate) {
    
    var padding = this.dockPaddingWidth * 0.5;
    var xPosition = padding;
    
    for (var app of apps) {
        
        if (animate == false) {
            app.allowsImplicitAnimations = false;
        }
        
        var scale = app.icon.scale;
        var newXPos = 0;
        
        if (scale > 1.0) {
            newXPos = xPosition + (app.width * (scale - 1) * 0.5);
        }
        else {
            newXPos = xPosition;
        }
        
        app.x = Math.floor(newXPos);
        
        if (animate == false) {
            app.allowsImplicitAnimations = true;
        }
        
        var effectiveAppWidth = app.width * scale;
        xPosition += effectiveAppWidth;
    }
};

layer.scaledRectForApp = function(app) {
    
    var scale = app.icon.scale;
    var appDockRect = this.convertRectFromLayer(app.bounds, app);
    var adjustedPositionDelta = ((appDockRect.width * scale) - appDockRect.width) * 0.5;
        
    var scaledAppRect = { x: appDockRect.x - adjustedPositionDelta,
                          y: appDockRect.y - adjustedPositionDelta,
                          width: appDockRect.width * scale,
                          height: appDockRect.height * scale };
 
    return scaledAppRect;
}

layer.appAtPoint = function(pointInDock, apps) {
    
    var appAtPoint = null;
    
    for (var app of apps) {
        
        if (app == this.dividerLayer) { continue; }

        var scaledAppRect = this.scaledRectForApp(app);
                              
        if ( CGRectContainsPoint(scaledAppRect, pointInDock) ) {
            appAtPoint = app;
            break;
        }
    } 
    
    return appAtPoint;
}

layer.repositionToolTip = function(pointInDock, apps) {
    
    var toolTipLayer = this.toolTipLayer;
    var app = this.appAtPoint(pointInDock, apps);
    
    if (app == null || this.mouseInRect == false) {
        
        toolTipLayer.opacity = 0;
        return;
    }
    
    var appPosition = this.screenLayer.convertPointFromLayer(app.icon.position, app);
    var newPosition = { x: appPosition.x, y: kToolTipYOffset }
    
    toolTipLayer.opacity = 1;
    toolTipLayer.setToolTipText(app.name);
    toolTipLayer.position = newPosition;
}

layer.mouseMoved = function(event) {
    
    var pointInDock = event.locationInLayer(this);

    if ( CGRectContainsPoint(this.bounds, pointInDock) == false ) {

        pointInDock.y = (this.bounds.height * 0.5);

        if (this.mouseInRect == true) {

            this.mouseExit(pointInDock);
        }

        return;
    }
    else {

        pointInDock.y = (this.bounds.height * 0.5);
        
        if (this.mouseInRect == false) {

            this.mouseEnter(pointInDock);
            return;
        }
    }
    
    if ( this.mouseInRect == undefined || this.mouseInRect == false ) { return; }
    
    var apps = this.sublayers;
    
    this.scaleApps(pointInDock, apps, false, this.magnifiedScaleBoundrySize);
    this.repositionApps(apps, false);
    this.repositionToolTip(pointInDock, apps);
};

layer.mouseEnter = function(pointInDock) {
    
    this.mouseInRect = true;
    var apps = this.sublayers;
    
    this.scaleApps(pointInDock, apps, true, this.scaleBoundrySize);
    this.repositionApps(apps, true);
    this.repositionToolTip(pointInDock, apps);
};

layer.mouseExit = function(pointInDock) {
    
    this.mouseInRect = false;
    var apps = this.sublayers;
    
    this.scaleApps(pointInDock, apps, true, this.magnifiedScaleBoundrySize);
    this.repositionApps(apps, true);
    this.repositionToolTip(pointInDock, apps);
};
