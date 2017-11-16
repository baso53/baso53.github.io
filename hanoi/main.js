var towers = [];
var drawOrder = [];
var numberOfDisks;
var diskHeight = view.size.height / 27;
var diskWidth = view.size.width / 3.9;
var selected = null;


Array.prototype.last = function () {
    if (this.length === 0) {
        return -1;
    }
    return this[this.length - 1];
}


var text = new PointText({
    point: [50, 50],
    content: "Welcome to Towers of Hanoi puzzle game!",
    fillColor: "#7DA3A1",
    fontFamily: "sans-serif",
    fontSize: view.size.width / 50
});


var copyrightText = new PointText({
    point: [view.size.width - view.size.width / 5, 50],
    content: "by Sebastijan Grabar",
    fillColor: "#7DA3A1",
    fontFamily: "sans-serif",
    fontSize: view.size.width / 100
});


var initTowers = function () {
    for (var i = 0; i < 3; i++) {
        towers.push(new Path.Line({
            from: [view.size.width / 4 * (i + 1), view.size.height],
            to: [view.size.width / 4 * (i + 1), view.size.height / 3],
            strokeColor: '#86AC41',
            strokeWidth: 20
        }));
        towers[i].x = view.size.width / 4 * (i + 1);
        towers[i].stack = [];
    }
}


var initDisks = function () {
    do {
        numberOfDisks = prompt("How many disks do you want to play with (between 2 and 16), default is 4");
        if (!numberOfDisks) {
            numberOfDisks = 4;
        }
    } while (numberOfDisks > 16 || numberOfDisks <= 1);

    for (var i = 0; i < numberOfDisks; i++) {
        towers[0].stack.push(new Path.Line({
            from: [view.size.width / 4 - diskWidth / 2, view.size.height - diskHeight * (i) - diskHeight / 2],
            to: [view.size.width / 4 + diskWidth / 2, view.size.height - diskHeight * (i) - diskHeight / 2],
            strokeColor: "#7DA3A1",
            strokeWidth: diskHeight
        }));
        diskWidth -= view.size.width / 70;
    }
}


initTowers();
initDisks();


//ADD LISTENERS FOR EVERY TOWER
towers.forEach(function (tower) {
    tower.onMouseUp = function () {
        moveDisk(tower, false);
    }
});

var checkIfGameOver = function () {
    if (towers[0].stack.length === 0 && towers[1].stack.length === 0 && selected === null) {
        text.content = "You have solved the puzzle! Congratulations!";
    }
}

var moveDisk = function (tower, automatic) {
    if (selected !== null && (tower.stack.length === 0 ? true : selected.length < tower.stack.last().length)) {
        tower.stack.push(selected);
        if (automatic){
            drawOrder.push({selected: selected, position: [tower.x, view.size.height + diskHeight / 2 - tower.stack.length * diskHeight]});
        } else{
            selected.position = [tower.x, view.size.height + diskHeight / 2 - tower.stack.length * diskHeight];
        }
        selected = null;
        initSelectable();
    }
    checkIfGameOver();
}

var initSelectable = function () {
    towers.forEach(function (tower) {
        if (tower.stack.length !== 0 && selected === null) {
            tower.stack.last().onMouseUp = function () {
                this.onMouseUp = null;
                selectDisk(tower, false);
            }
        }
    });
}

var selectDisk = function (tower, automatic) {
    if (selected === null) {
        selected = tower.stack.pop();
        if (automatic){
            drawOrder.push({selected: selected, position: [tower.x, diskHeight * 5]});
        } else{
            selected.position = [tower.x, diskHeight * 5];
        }
    }
}


var solve = function (source, dest) {
    selectDisk(source, true);
    moveDisk(dest, true);

    if (drawOrder.length === (Math.pow(2, numberOfDisks) - 1)*2) {
        var i=0;
        var interval = setInterval (function(){
            drawOrder[i].selected.position = drawOrder[i].position;
            i++;
            if (i === (Math.pow(2, numberOfDisks) - 1)*2){
                clearInterval(interval);
            }
        }, 120);
    }
    
}

var solveHanoi = function (disk, source, dest, aux) {
    if (disk >= 1) {
        solveHanoi(disk - 1, source, aux, dest);
        solve(source, dest);
        solveHanoi(disk - 1, aux, dest, source);
    } 
    solveHanoiButton.onMouseUp = null;
}

var solveHanoiButton = new PointText({
    point: [50, 50 + view.size.width / 30],
    content: "Press [ME] to solve automatically!",
    fillColor: "#7DA3A1",
    fontFamily: "sans-serif",
    fontSize: view.size.width / 50
});

solveHanoiButton.onMouseUp = function () {
    solveHanoi(numberOfDisks, towers[0], towers[2], towers[1]);
    text.content = "You have (not actually) solved the puzzle! Congratulations!"
}

initSelectable();