var balls = new Group();
var bullets = new Group();
var gameOver = false;
var ballRadius = 50;

//GENERATE HELP TEXT AND TRADEMARK
new PointText({
    fontFamily: "sans-serif",
    fontSize: 28,
    fillColor: "white",
    content: "Use arrow keys to move, space to shoot",
    point: [70, 100]
});
new PointText({
    fontFamily: "sans-serif",
    fontSize: 16,
    fillColor: "white",
    content: "by Sebastijan Grabar",
    point: [view.size.width - 200, view.size.height - 20]
});

//GENERATE ROCKET
var rocket = new Raster("rocket", view.center);
rocket.velocity = new Point(0, 0);

//INITIALIZE BALLS
function init() {
    for (var i = 0; i < 15; i++) {
        generateBall();
    }
};

//GENERATE A BALL
function generateBall() {
    //GENERATE RANDOM POSITION WITHIN THE VIEW
    var maxPoint = new Point(view.size - 25);
    var randomPoint = Point.random();
    var possiblePoint = new Point(maxPoint * randomPoint);
    if (possiblePoint.x < 25) {
        possiblePoint.x += 25;
    }
    if (possiblePoint.y < 25) {
        possiblePoint.y += 25;
    }

    //GENERATE BALL OBJECT
    var ball = new Raster(
        String(Math.floor((Math.random() * 19)) + 1),
        possiblePoint
    );
    ball.velocity = new Point.random() * 16 - 8;
    ball.size = new Size (2*ballRadius);

    //ADD TO BALLS GROUP ITEM
    balls.addChild(ball);
};

//GENERATE A BULLET
function generateBullet() {
    var bullet = new Path.Circle({
        center: rocket.position,
        radius: 3,
        fillColor: "red"
    });
    bullet.velocity = new Point(
        Math.sin((rocket.rotation / 180) * Math.PI) * 10,
        Math.cos((rocket.rotation / 180) * Math.PI) * 10
    );

    //ADD BULLETS TO GROUP ITEM
    bullets.addChild(bullet);
}

//EVENT FOR FIRING BULLETS
function onKeyDown(key) {
    if (key.key === "space") {
        generateBullet();
    }
}

//BOUNDS CHECK FOR BALLS
function isCollided(ball) {
    if (ball.position.x < 25 || ball.position.y < 25) {
        ball.velocity = new Point.random() * 8;
    }
    if (ball.position.x > view.size.width - 25 || ball.position.y > view.size.height - 25) {
        ball.velocity = new Point.random() * -8;
    }
};

//CHECK IF BALL IS HIT
function isHit(ball, index) {
    if (ball.intersects(bullets)) {
        balls.removeChildren(index, index + 1);
    }
}

//UPDATE BALLS AND CHECK IF HIT
function updateBalls() {
    balls.children.forEach(function (ball, index) {
        isCollided(ball);
        isHit(ball, index);
        ball.setPosition(ball.position + ball.velocity);
    });
}

//UPDATE BULLETS
function updateBullets() {
    bullets.children.forEach(function (bullet, index) {
        bullet.position.x += bullet.velocity.x;
        bullet.position.y -= bullet.velocity.y;
        if (bullet.position.x < 0 || bullet.position.x > view.size.width ||
            bullet.position.y < 0 || bullet.position.y > view.size.height) {
            bullets.removeChildren(index, index + 1);
        }
    });
}

//CHECK FOR INPUT
function checkInput(){
    if (Key.isDown("left")) {
        rocket.rotate(-5);
    }
    if (Key.isDown("right")) {
        rocket.rotate(5);
    }
    if (Key.isDown("up")) {
        rocket.position.x += Math.sin((rocket.rotation / 180) * Math.PI) * 5;
        rocket.position.y -= Math.cos((rocket.rotation / 180) * Math.PI) * 5;
    }
    if (Key.isDown("down")) {
        rocket.position.x -= Math.sin((rocket.rotation / 180) * Math.PI) * 5;
        rocket.position.y += Math.cos((rocket.rotation / 180) * Math.PI) * 5;
    }
}

//CHECK IF GAME IS OVER
function isOver(){
    if (!balls.hasChildren() && !gameOver) {
        new PointText({
            point: view.center,
            justification: 'center',
            fontSize: 70,
            fillColor: 'white',
            content: "Bravo majstore"
        });
        gameOver = true;
        return gameOver;
    }
}

//DRAW FUNCTION
function onFrame() {
    updateBalls();
    updateBullets();
    checkInput();
    isOver();
}

//START GAME
init();