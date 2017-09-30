var spacing = Math.floor(Math.random() * 40 + 30);
var x=0, y=0;

view.onClick = function(){
    project.clear();
    x=0, y=0;
    spacing = Math.floor(Math.random() * 30 + 20);
}

function onFrame(){
    if (Math.random() > 0.5){
        new Path.Line({
            from: new Point (x, y),
            to: new Point (x+spacing, y+spacing),
            strokeColor: "#0088FF",
            strokeWidth: "3"
        });
    } else{
        new Path.Line({
            from: new Point (x, y+spacing),
            to: new Point (x+spacing, y),
            strokeColor: "#0088FF",
            strokeWidth: "3"
        });
    }
    x+= spacing;
    if (x>view.size.width){
        y+=spacing;
        x=0;
    }
}