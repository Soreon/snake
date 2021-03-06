/*global document */
/*global window */
/*global Snake */

var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
var snake = new Snake(window.innerWidth / 2, window.innerHeight / 2);
var start = false;
var mousePosition = {x: 0, y: 0};

Math.toRadians = function (degrees) {
    "use strict";
    return degrees * Math.PI / 180;
};

Math.toDegrees = function (radians) {
    "use strict";
    return radians * 180 / Math.PI;
};

function clearCanvas() {
    "use strict";
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function circle(x, y, radius, color) {
    "use strict";
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
}

function line(ax, ay, bx, by, color, thickness) {
    var funcStrokeStyle = context.strokeStyle;
    var funcLineWidth = context.lineWidth;

    context.beginPath();
    context.moveTo(ax, ay);
    context.lineTo(bx, by);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();

    context.strokeStyle = funcStrokeStyle;
    context.lineWidth = funcLineWidth;
}

function draw() {
    "use strict";
    clearCanvas();
    snake.draw();
}

function updateCanvasSize() {
    "use strict";
    canvas.width = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;
}

function animate() {
    "use strict";
    window.requestAnimationFrame(animate);
    if (start) {
        snake.move();
    }
    draw();
}

function togglePlay(play) {
    start = play;
    if(start) {
        document.getElementById("play-button").blur();
        document.getElementById("play-button").style.opacity = '0';
        document.getElementById("play-button").style.zIndex = '0';  
        document.getElementById("pause-button").style.opacity = '1';
        document.getElementById("pause-button").style.zIndex = '1';
    } else {
        document.getElementById("pause-button").blur();
        document.getElementById("pause-button").style.opacity = '0';
        document.getElementById("pause-button").style.zIndex = '0'; 
        document.getElementById("play-button").style.opacity = '1';
        document.getElementById("play-button").style.zIndex = '1';
    }
}

canvas.addEventListener("mousemove", function (event){
    "use strict";

    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
    snake.orientation = Math.toDegrees(Math.atan2(event.clientY - snake.position.y, event.clientX - snake.position.x));
});

canvas.addEventListener("mouseleave", function (event){
    "use strict";
    snake.wandering = true;

    if(snake.position.x <= 0 || snake.position.x >= window.innerWidth || snake.position.y <= 0 || snake.position.y >= window.innerHeight) {
        snake.position.x = window.innerWidth / 2;
        snake.position.y = window.innerHeight / 2;
    }
});

canvas.addEventListener("mouseenter", function (event){
    "use strict";
    snake.wandering = false;
});

window.addEventListener("load", function () {
    "use strict";
    updateCanvasSize();
});

window.addEventListener("resize", function () {
    "use strict";
    updateCanvasSize();
});

document.addEventListener("keypress", function (event) {
    "use strict";
    if (event.keyCode === 13) {
        togglePlay(!start);
    }
    if (event.keyCode === 43) {
        snake.addBodyPart();
    }
    if (event.keyCode === 45) {
        snake.removeBodyPart();
    }
});

document.getElementById("reset-button").addEventListener("click", function (){
    "use strict";
    snake.position = {x: window.innerWidth / 2, y: window.innerHeight / 2};
    snake.orientation = 0;
    togglePlay(false);
    document.getElementById("reset-button").blur();
});

document.getElementById("play-button").addEventListener("click", function() { togglePlay(true); });
document.getElementById("pause-button").addEventListener("click", function() { togglePlay(false); });

for(var i=0; i<64; i++) {
    snake.addBodyPart();
}

animate();

//TODO: système de redimentionnement de la fenêtre
