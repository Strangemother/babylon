
var canvas2D = document.getElementById("axisCanvas");
var context2D = canvas2D.getContext("2d");

//Add a placeholder function for browsers that don't have setLineDash()
if (!context2D.setLineDash) {
    context.setLineDash = function () {}
}

var clearCanvas2D = function(){
    canvas2D.width = window.innerWidth;
    canvas2D.height = window.innerHeight;
};

var drawAxis = function(camera, mesh, drawAncestors, pivot){

    context2D.lineWidth = 1;
    context2D.shadowColor = '#000000';
    context2D.lineCap = "square";
    context2D.shadowBlur = 10;
    context2D.shadowOffsetX = 0;
    context2D.shadowOffsetY = 0;

    //////////////////////// update camera view matrix
    var viewMatrix = camera.getViewMatrix();
    //////////////////////////

    var originInLocalSpace = BABYLON.Vector3.Zero();
    var xInLocalSpace = new BABYLON.Vector3(1,0,0);
    var yInLocalSpace = new BABYLON.Vector3(0,1,0);
    var zInLocalSpace = new BABYLON.Vector3(0,0,1);

    var cameraPositionInLocalSpace = camera.position.clone();

    // todo: case where camera has a parent

    var worldMatrix;
    var invWorldMatrix;
    if(mesh)
    {
        worldMatrix = mesh.getWorldMatrix();
        invWorldMatrix = worldMatrix.clone();
        invWorldMatrix.invert();
        cameraPositionInLocalSpace = BABYLON.Vector3.TransformCoordinates(cameraPositionInLocalSpace, invWorldMatrix);
    }

    var dist = originInLocalSpace.subtract(cameraPositionInLocalSpace);
    dist.normalize();
    var startInLocalSpace = dist.scale(15).add(cameraPositionInLocalSpace); // todo: use const for 15

    var startLine = _drawAxis(startInLocalSpace, xInLocalSpace, "#ff0000", camera, worldMatrix, mesh);
    _drawAxis(startInLocalSpace, yInLocalSpace, "#00ff00", camera, worldMatrix, mesh);
    _drawAxis(startInLocalSpace, zInLocalSpace, "#0000ff", camera, worldMatrix, mesh);

    if (drawAncestors && mesh) {
        var endLine = drawAxis(camera, mesh.parent, drawAncestors, pivot);
        context2D.setLineDash([3,9]);
        context2D.shadowBlur = 2;
        drawLine(startLine, endLine, "#ffffff");
        context2D.shadowBlur = 10;
        context2D.setLineDash([0]);
    }

    if(mesh && pivot)
    {
        var parentWorldMatrix = mesh.parent ? mesh.parent.getWorldMatrix() : BABYLON.Matrix.Identity();
        var pivotWorldMatrix =  mesh._localScaling.multiply(mesh._localRotation).multiply (mesh._localTranslation).multiply(parentWorldMatrix);

        var invPivotWorldMatrix = pivotWorldMatrix.clone();
        invPivotWorldMatrix.invert();
        var cameraPositionInPivotSpace = BABYLON.Vector3.TransformCoordinates(camera.position, invPivotWorldMatrix);

        var dist = originInLocalSpace.subtract(cameraPositionInPivotSpace);
        dist.normalize();
        startInLocalSpace = dist.scale(30).add(cameraPositionInPivotSpace); // todo: use const for 30

        _drawAxis(startInLocalSpace, xInLocalSpace, "#ff8888", camera, pivotWorldMatrix, mesh);
        _drawAxis(startInLocalSpace, yInLocalSpace, "#88ff88", camera, pivotWorldMatrix, mesh);
        _drawAxis(startInLocalSpace, zInLocalSpace, "#8888ff", camera, pivotWorldMatrix, mesh);
    }

    return startLine;
};

var _drawAxis = function (startInLocalSpace, axisInLocalSpace, color, camera, worldMatrix, mesh) {

    var endInLocalSpace = startInLocalSpace.add(axisInLocalSpace);

    var startInWorld = startInLocalSpace.clone();
    var endInWorld = endInLocalSpace.clone();

    if (mesh)
    {
       startInWorld = BABYLON.Vector3.TransformCoordinates(startInWorld, worldMatrix);
       endInWorld = BABYLON.Vector3.TransformCoordinates(endInWorld, worldMatrix);
    }

    var v = _startEndLine(startInWorld, endInWorld, camera);

    var startVectorInView = v.start;
    if (!startVectorInView) return;
    var endVectorInView = v.end;

    var cW = canvas.width;
    var cH = canvas.height;

    var projectionMatrix = camera.getProjectionMatrix();

    var startLine = BABYLON.Vector3.TransformCoordinates(startVectorInView, projectionMatrix);
    startLine = new BABYLON.Vector2((startLine.x + 1) * (cW / 2), (1 - startLine.y) * (cH / 2));

    var endLine = BABYLON.Vector3.TransformCoordinates(endVectorInView, projectionMatrix);
    endLine = new BABYLON.Vector2((endLine.x + 1) * (cW / 2), (1 - endLine.y) * (cH / 2));

    drawLine(startLine, endLine, color);

    return startLine;
}

var _startEndLine = function (startVector, endVector, camera) {

    var res = {};

    var viewMatrix = camera.getViewMatrix();

    var pointOfPlane = new BABYLON.Vector3(0,0,camera.minZ);
    var normalOfPlane = new BABYLON.Vector3(0,0,1);

    var startVectorInView = BABYLON.Vector3.TransformCoordinates(startVector, viewMatrix);
    var endVectorInView = BABYLON.Vector3.TransformCoordinates(endVector, viewMatrix);

    if (startVectorInView.z < 0 && endVectorInView.z < 0) {
        return res;
    }

    var startLine;
    var endLine;

    if (startVectorInView.z >=0 && endVectorInView.z >= 0) {
        res.start = startVectorInView;
        res.end = endVectorInView;
        return res;
    }

    if (startVectorInView.z < 0) {
        startVectorInView = _intersectionPoint(startVectorInView, endVectorInView, pointOfPlane, normalOfPlane);
    }
    else {
        endVectorInView = _intersectionPoint(startVectorInView, endVectorInView, pointOfPlane, normalOfPlane);
    }

    res.start = startVectorInView;
    res.end = endVectorInView;

    return res;
};

// inspiration from Blender
var _intersectionPoint = function(p0, p1, pointOfPlane, normalOfPlane) {
    /*
        p0, p1: define the line
        pointOfPlane, normalOfPlane: define the plane:
        pointOfPlane is a point on the plane (plane coordinate).
        normalOfPlane is a normal vector defining the plane direction; does not need to be normalized.

        return a Vector or None (when the intersection can't be found).
    */

    var u = p1.subtract(p0);
    var w = p0.subtract(pointOfPlane);
    var dot = BABYLON.Vector3.Dot(normalOfPlane, u);

    if (Math.abs(dot) > 0.000001) {
        // the factor of the point between p0 -> p1 (0 - 1)
        // if 'fac' is between (0 - 1) the point intersects with the segment.
        // otherwise:
        //  < 0.0: behind p0.
        //  > 1.0: infront of p1.
        var fac = -BABYLON.Vector3.Dot(normalOfPlane, w) / dot;
        u = u.scale(fac);
        return p0.add(u);
    }
    else {
        // The segment is parallel to plane
        return undefined;
    }
};

var drawLine = function(startPosition, endPosition, color){
    var prevStrokeStyle = context2D.strokeStyle;
    context2D.strokeStyle= color;
    context2D.beginPath();
    context2D.moveTo(startPosition.x, startPosition.y);
    context2D.lineTo(endPosition.x, endPosition.y);
    context2D.stroke();
    context2D.strokeStyle= prevStrokeStyle;
};
