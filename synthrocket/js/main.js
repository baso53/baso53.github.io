var horizontalLines = [],
    laneVectors = [],
    targets = [],
    bullets = [];

var MIN_HEIGHT = 568,
    MIN_WIDTH = 320,
    NUMBER_OF_VERTICAL_LINES = 5,
    HOR_LINES_FREQUENCY = 10,
    BULLET_FREQUENCY = 10,
    pointOfConvergence = new Point(view.center - [0, view.size.height / 1.3]),
    button = document.getElementById("startGame"),
    scoreCount = 0,
    scoreText,
    rocket;

var music = new Howl({
    src: ["sound/soundtrack.mp3"],
    html5: true,
    autoplay: true,
    loop: true,
    volume: 1
});



init();

function gameOver() {
    view.onFrame = null;
    button.style.display = "block";
    button.textContent = "YOU SCORED " + scoreCount + " POINTS";
    music.fade(1, 0.4, 100);
    button.onclick = function () {
        init();
    }
    window.onkeyup = function(key) {
        if (key.keyCode == 32 || key.keyCode == 13){
            init();
        }
    }
}

function init() {
    project.clear();
    horizontalLines = [];
    laneVectors = [];
    targets = [];
    bullets = [];
    button.style.display = "none";
    button.onclick = null;
    window.onkeyup = null; 
    music.fade(0.4, 1, 100);
    initRocket();
    initVerticalLines();
    view.onFrame = onFrameTemplate;
    scoreCount = 0;
    scoreText = new PointText({
        point: [50, 50],
        content: 'SCORE = ' + scoreCount,
        fillColor: 'white',
        fontFamily: 'sans-serif',
        fontSize: 25
    });
    
}

function initRocket() {
    paper.project.importSVG("svg/raketa1.svg", function (item) {
        rocket = item;
        rocket.scale(view.size.width / 800)
        rocket.applyMatrix = false;
        rocket.position = [view.center.x, view.size.height * (1 - (80 / MIN_HEIGHT))];
        view.onFrame = onFrameTemplate;
    });
}


function initVerticalLines() {
    for (var i = NUMBER_OF_VERTICAL_LINES / 2; i >= -NUMBER_OF_VERTICAL_LINES / 2; i--) {
        var scale = view.size.width / view.size.height;
        new Path.Line({
            angle: 90 + i * 10 * scale,
            length: 4000,
            position: pointOfConvergence,
            strokeColor: "#6816e0",
            strokeWidth: 3
        });

        if (i < NUMBER_OF_VERTICAL_LINES / 2) {
            laneVectors.unshift(new Point({
                angle: 5 * scale * (2 * i + 1) + 90,
                length: 1
            }));
        }
    }
}

var updateHorizontalLines = function (frame) {
    if (frame.count % HOR_LINES_FREQUENCY === 0) {
        horizontalLines.push(new Path.Line({
            from: [0, 0],
            to: [view.size.width, 0],
            strokeColor: "#6816e0",
            strokeWidth: 1,
            velocity: 1
        }));

        if (horizontalLines[0].position.y >= view.size.height) {
            horizontalLines[0].remove();
            horizontalLines.shift();
        }
    }
    for (var i = 0; i < horizontalLines.length; i++) {
        horizontalLines[i].position.y += horizontalLines[i].velocity;
        horizontalLines[i].velocity *= 1.03;
    }
}

function drawBullets() {
    bullets.unshift(new Path.Circle({
        radius: 3,
        fillColor: "red",
        position: rocket.position,
        velocity: new Point({
            angle: 90 + rocket.rotation,
            length: view.size.height / 100
        })
    }));
}
function updateBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].position -= bullets[i].velocity;
        if (bullets[i].position.y <= 0) {
            bullets[i].remove();
            bullets.splice(i, 1);
        }
    }
}

function removeIntersected(p1, p2) {
    var distance = p1.position.getDistance(p2.position);
    if (distance <= (p1.bounds.width + p2.bounds.width) / 2) {
        p1.remove();
        p2.remove();
        scoreCount++;
        scoreText.content = 'SCORE = ' + scoreCount;
        return true;
    }
}
function updateTargets(frame) {
    if (frame.count % 10 === 0) {
        targets.unshift(new Path.Circle({
            position: pointOfConvergence,
            fillColor: "cyan",
            radius: 3,
            velocity: laneVectors[Math.ceil(Math.random() * 5) - 1]
        }));
    }

    loop1: for (var i = 0; i < targets.length; i++) {
        var removed = -1;
        targets[i].position += targets[i].velocity;
        targets[i].velocity *= 1.01;
        targets[i].scale(1.007);

        for (var j = 0; j < bullets.length; j++) {
            if (removeIntersected(targets[i], bullets[j])) {
                targets.splice(i, 1);
                bullets.splice(j, 1);
                break loop1;
            }
        }

        if (targets[i].position.y >= view.size.height) {
            targets[i].remove();
            targets.splice(i, 1);
            break loop1;
        }

        if (rocket.bounds.contains(targets[i].position) ||
            rocket.opacity <= 0.02) {
            targets[i].remove();
            gameOver();
            break loop1;
        }
    }
}

function checkInput(frame) {
    if (Key.isDown("left")
        && rocket.rotation <= laneVectors[4].angle - 90) {
        rocket.position.x -= (view.size.width / MIN_WIDTH) * 5;
        /* rocket.position.x <= view.center.x ?
            rocket.position.y -= (view.size.height / MIN_HEIGHT) * 4 :
            rocket.position.y += (view.size.height / MIN_HEIGHT) * 4; */
        rocket.rotation = (rocket.position - pointOfConvergence).angle - 90;
        rocket.position.y -= view.size.height / 5000
        rocket.opacity = 1;
    }
    if (Key.isDown("right")
        && rocket.rotation >= laneVectors[0].angle - 90) {
        rocket.position.x += (view.size.width / MIN_WIDTH) * 5;
        /* rocket.position.x <= view.center.x ?
            rocket.position.y += (view.size.height / MIN_HEIGHT) * 4 :
            rocket.position.y -= (view.size.height / MIN_HEIGHT) * 4; */
        rocket.rotation = (rocket.position - pointOfConvergence).angle - 90
        rocket.position.y -= view.size.height / 5000
        rocket.opacity = 1;
    }
    if (Key.isDown("space") && frame.count % 7 === 0) {
        drawBullets();
    }
}

var onFrameTemplate = function (frame) {
    updateHorizontalLines(frame);
    updateBullets();
    updateTargets(frame);
    checkInput(frame);
    rocket.opacity -= 0.01;
}

