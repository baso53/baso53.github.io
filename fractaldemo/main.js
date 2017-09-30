var selectedPoint, rotation, length;

function updateText(){
    new PointText({
        fontFamily: "sans-serif",
        fontSize: 22,
        fillColor: "black",
        content: "Move mouse horizontally\nto adjust angle,\nvertically to adjust size",
        point: [50, 70]
    });
    new PointText({
        fontFamily: "sans-serif",
        fontSize: 16,
        fillColor: "black",
        content: "by Sebastijan Grabar",
        point: [view.size.width - 200, view.size.height - 20]
    });
}

function branchLine (startPoint, length, currentAngle, rotation, _strokeWidth){
    var line = new Path.Line({
        from: startPoint,
        to: startPoint + new Point(
            Math.sin(currentAngle),
            Math.cos(currentAngle)
        ) * length,
        strokeColor: "black",
        strokeWidth: _strokeWidth
    });

    if (length > 15){
        branchLine(line.lastSegment.point, length/1.5, currentAngle+rotation, rotation, _strokeWidth-0.5);
        branchLine(line.lastSegment.point, length/1.5, currentAngle-rotation, rotation, _strokeWidth-0.5);
    }
}


function onMouseMove(event){
    selectedPoint = event.point / view.size;
    rotation = selectedPoint.x*2.5 + 0.1;
    length = selectedPoint.y * view.size.height/5 + 100;
    project.clear();
    updateText();
    branchLine(new Point(view.center.x, view.size.height - 50), length, Math.PI, rotation, 5);
}