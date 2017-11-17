var towers = [];
var drawOrder = [];
var numberOfDisks;
var diskHeight = view.size.height / 24 - 1;
var diskWidth = view.size.width / 3.9;
var selected = null;
var automaticallySolvable = true;

Array.prototype.last = function () {
    if (this.length === 0) {
        return -1;
    }
    return this[this.length - 1];
}

var welcomeText = new PointText({
    point: [view.size.width / 20, view.size.height / 20],
    content: "Welcome to Towers of Hanoi puzzle game!",
    fillColor: "#CDCDC0",
    fontFamily: "sans-serif",
    fontSize: view.size.width / 50
});

var solveHanoiButton = new PointText({
    point: [view.size.width / 20, view.size.height / 20 + welcomeText.fontSize * 2],
    content: "SOLVE =>",
    fillColor: "#86AC41",
    fontFamily: "sans-serif",
    fontSize: view.size.width / 35
});

var copyrightText = new PointText({
    point: [view.size.width - view.size.width / 5, view.size.height / 20],
    content: "by Sebastijan Grabar",
    fillColor: "#CDCDC0",
    fontFamily: "sans-serif",
    fontSize: view.size.width / 70
});

solveHanoiButton.onMouseUp = function () {
    solveHanoi(numberOfDisks, towers[0], towers[2], towers[1]);
    welcomeText.content = "You have (not actually) solved the puzzle! Congratulations!"
}

var initTowers = function () {
    for (var i = 0; i < 3; i++) {
        towers.push(new Path.Line({
            from: [view.size.width / 4 * (i + 1), view.size.height],
            to: [view.size.width / 4 * (i + 1), view.size.height / 2],
            strokeColor: '#86AC41',
            strokeWidth: view.size.width / 15
        }));
        towers[i].x = view.size.width / 4 * (i + 1);
        towers[i].stack = [];
    }
}

var initDisks = function () {
    do {
        numberOfDisks = prompt("How many disks do you want to play with (between 2 and 12), default is 4");
        if (!numberOfDisks) {
            numberOfDisks = 4;
        }
    } while (numberOfDisks > 12 || numberOfDisks <= 1);

    for (var i = 0; i < numberOfDisks; i++) {
        towers[0].stack.push(new Path.Line({
            from: [view.size.width / 4 - diskWidth / 2, view.size.height - diskHeight * (i) - diskHeight / 2],
            to: [view.size.width / 4 + diskWidth / 2, view.size.height - diskHeight * (i) - diskHeight / 2],
            strokeColor: "#7DA3A1",
            strokeWidth: diskHeight
        }));
        diskWidth -= view.size.width / 70;
    }

    //ADD LISTENERS FOR EVERY TOWER
    towers.forEach(function (tower) {
        tower.onMouseUp = function () {
            moveDisk(tower, false);
        }
    });
}

initTowers();
initDisks();

var checkIfGameOver = function () {
    if (towers[0].stack.length === 0 && towers[1].stack.length === 0 && selected === null) {
        welcomeText.content = "You have solved the puzzle! Congratulations!";
    }
}

var moveDisk = function (tower, automatic) {
    if (selected !== null && (tower.stack.length === 0 ? true : selected.length < tower.stack.last().length)) {
        tower.stack.push(selected);
        if (automatic) {
            drawOrder.push({ selected: selected, position: [tower.x, view.size.height + diskHeight / 2 - tower.stack.length * diskHeight] });
        } else {
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
        if (automatic) {
            drawOrder.push({ selected: selected, position: [tower.x, view.size.height / 2 - diskHeight * 3] });
        } else {
            selected.position = [tower.x, view.size.height / 2 - diskHeight * 3];

        }
    }
}

var solveOne = function (source, dest) {
    selectDisk(source, true);
    moveDisk(dest, true);

    if (drawOrder.length === (Math.pow(2, numberOfDisks) - 1) * 2) {
        var i = 0;
        var interval = setInterval(function () {
            drawOrder[i].selected.position = drawOrder[i].position;
            i++;
            if (i === (Math.pow(2, numberOfDisks) - 1) * 2) {
                clearInterval(interval);
            }
        }, 300);
    }
}

var solveHanoi = function (disk, source, dest, aux) {
    if (disk >= 1) {
        solveHanoi(disk - 1, source, aux, dest);
        solveOne(source, dest);
        solveHanoi(disk - 1, aux, dest, source);
    }
    solveHanoiButton.onMouseUp = null;
}

initSelectable();