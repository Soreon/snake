/*global document */
/*global window */
/*global Snake */
/*global Dna */


var canvas = document.getElementById("main-canvas");
var context = canvas.getContext("2d");
var start = false;
var mousePosition = {x: 0, y: 0};
var snakes = [];


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
    snakes.forEach(function(snake) {
        snake.draw();
    });
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
        snakes.forEach(function(snake) {
            snake.move();
        });
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

//Souris bouge, snake qui suis le mouvement
canvas.addEventListener("mousemove", function (event){
    "use strict";

    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
    snakes.forEach(function(snake) {
        snake.orientation = Math.toDegrees(Math.atan2(event.clientY - snake.position.y, event.clientX - snake.position.x));
    });
});

//Souris sors de la fenetre
canvas.addEventListener("mouseleave", function (event){
    "use strict";
    snakes.forEach(function(snake){
        snake.wandering = true;

        if(snake.position.x <= 0 || snake.position.x >= window.innerWidth || snake.position.y <= 0 || snake.position.y >= window.innerHeight) {
            snake.position.x = window.innerWidth / 2;
            snake.position.y = window.innerHeight / 2;
        }
    })
});

//Souris entre dans la fenetre
canvas.addEventListener("mouseenter", function (event){
    "use strict";
    snakes.forEach(function(snake) {
        snake.wandering = false;
    });
});

//Chargement ?
window.addEventListener("load", function () {
    "use strict";
    updateCanvasSize();
});

//Redimension de la fenetre ?
window.addEventListener("resize", function () {
    "use strict";
    updateCanvasSize();
});

//Controles Utilisateur
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
    if (event.keyCode === 32) {
        welcomeAFriend("AHAHHA");
    }
});

//A bah ca recommence ?
document.getElementById("reset-button").addEventListener("click", function (){
    "use strict";
    this.snakes = [];
    this.welcomeAFriend("Serpenreon Primaris");

    snakes.forEach(function(snake) {
        snake.position = {x: window.innerWidth / 2, y: window.innerHeight / 2};
        snake.orientation = 0;
    });
    togglePlay(false);
    document.getElementById("reset-button").blur();
});

document.getElementById("play-button").addEventListener("click", function() { togglePlay(true); });
document.getElementById("pause-button").addEventListener("click", function() { togglePlay(false); });


function welcomeAFriend(name, dna = null)
{
    var newDna = new Dna();
    this.snakes.push(new Snake(window.innerWidth / 2, window.innerHeight / 2, name, newDna));
    console.log("Welcome" + name);

    for(var i=0; i<64; i++) {
        this.snakes[snakes.length-1].addBodyPart();
    }
}

function init() {

    this.welcomeAFriend();
}

init();
animate();

//TODO: système de redimentionnement de la fenêtre
