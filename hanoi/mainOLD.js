var towers = [];
var disksStack1 =[];

new PointText({
    point: [50, 50],
    content: "Welcome to Towers of Hanoi app!",
    fillColor: "white",
    fontFamily: "sans-serif",
    fontSize: view.size.width/50
});

var initTowers = function (){
    for (var i=0; i<3; i++){
        towers.push(new Path.Line({
            from: [view.size.width/4*(i+1), view.size.height],
            to: [view.size.width/4*(i+1), view.size.height/2.5],
            strokeColor: 'red',
            strokeWidth: 20
        }));
        towers.x = view.size.width/4*(i+1);
    }
}



var initDisks = function (){
    /* do{
        var numberOfDisks = prompt("How many disks do you want to play with?");
    } while (numberOfDisks < 10); */


    var numberOfDisks = 10;
    var diskHeight = view.size.height/20;
    var diskWidth = view.size.width/4;
    for (var i=0; i<numberOfDisks; i++){
        disksStack1.push(new Path.Line({
            from: [view.size.width/4 - diskWidth/2, view.size.height-diskHeight*(i)-diskHeight/2],
            to: [view.size.width/4 + diskWidth/2, view.size.height-diskHeight*(i)-diskHeight/2],
            strokeColor: "white",
            strokeWidth: diskHeight
        }));
        diskWidth -= view.size.width/45;
    }
}

var moveDisk = function (){
    var lastPosition = disksStack1[disksStack1.length - 1].position;
    disksStack1[disksStack1.length - 1].attach("mousedrag", function(event){
        this.position += event.delta;
    });
    disksStack1[disksStack1.length - 1].attach("mouseup", function(event){
        if (this.intersects(towers[0])){
            this.position = lastPosition;
        }
    })
}

initTowers();
initDisks();

moveDisk();




