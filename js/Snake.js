/*jslint this */
/*global circle */

var intervalSize = 5;

function BodyPart(previous) {
    "use strict";
    this.previous = previous;
    this.head = previous.head;
    this.speed = previous.speed;
    this.order = this.previous.order + 1;
    this.size = this.head.size * (1 - (this.order / this.head.numberOfParts));
    this.next = null;
    this.orientation = previous.orientation;
    this.position = {x: 0, y: 0};

    this.draw = function () {
        circle(this.position.x, this.position.y, this.size, "#0FF0FF");

        if (this.next) {
            this.next.draw();
        }
    };

    this.setPosition = function () {
        var xp = intervalSize * Math.cos(Math.toRadians(360 + this.orientation));
        var yp = intervalSize * Math.sin(Math.toRadians(360 + this.orientation));
        this.position = {
            x: previous.position.x - xp,
            y: previous.position.y - yp
        }
    };

    this.move = function () {
        this.orientation = Math.toDegrees(Math.atan2(previous.position.y - this.position.y, previous.position.x - this.position.x));
        var dist = Math.sqrt(Math.pow((previous.position.y - this.position.y), 2) + Math.pow((previous.position.x - this.position.x), 2));


        var xp = (dist - intervalSize) * Math.cos(Math.toRadians(this.orientation));
        var yp = (dist - intervalSize) * Math.sin(Math.toRadians(this.orientation));
        this.position = {
            x: this.position.x + xp,
            y: this.position.y + yp
        };
        if (this.next) {
            this.next.move();
        }
    };

    this.addBodyPart = function () {
        if (this.next) {
            this.next.addBodyPart();
        } else {
            this.next = new BodyPart(this);
        }
        this.updateSize();
    };

    this.removeBodyPart = function () {
        if (this.next.next) {
            this.next.removeBodyPart();
        } else {
            this.next = null;
        }
        this.updateSize();
    };

    this.updateSize = function() {
        this.size = this.head.size * (1 - (this.order / this.head.numberOfParts));
    };

    this.setPosition();
}


function Snake(x, y) {
    "use strict";
    this.position = {x: x, y: y};
    this.next = null;
    this.head = this;
    this.order = 1;
    this.orientation = 0;
    this.speed = 5;
    this.size = 20;
    this.numberOfParts = 1;
    this.wandering = false;

    this.draw = function () {
        circle(this.position.x, this.position.y, this.size, "#0FF0FF");

        var radius = 30;
        var xp = radius * Math.cos(Math.toRadians(this.orientation));
        var yp = radius * Math.sin(Math.toRadians(this.orientation));
        circle(this.position.x + xp, this.position.y + yp, 2, "#0FF0FF");
        if (this.next) {
            this.next.draw();
        }
    };

    this.move = function () {

        // Cas de figure ou le pointeur n'est pas sur le canvas, la bête se met à errer
        if (this.wandering) {
            var randomConeValue = 15;
            do {
                var radius = 100;
                var randomCone = (Math.random() * randomConeValue) - randomConeValue / 2;
                var xp = radius * Math.cos(Math.toRadians(this.orientation + randomCone));
                var yp = radius * Math.sin(Math.toRadians(this.orientation + randomCone));
                
                var resultX = this.position.x + xp;
                var resultY = this.position.y + yp;
                randomConeValue++;

                
            } while (resultX <= 0 || resultX >= window.innerWidth || resultY <= 0 || resultY >= window.innerHeight);
            
            this.orientation = this.orientation + randomCone;
        }

        var xp = this.speed * Math.cos(Math.toRadians(this.orientation));
        var yp = this.speed * Math.sin(Math.toRadians(this.orientation));
        this.position = {
            x: this.position.x + xp,
            y: this.position.y + yp
        };

        if (this.next) {
            this.next.move();
        }
    };

    this.addBodyPart = function () {
        this.numberOfParts++;
        if (this.next) {
            this.next.addBodyPart();
        } else {
            this.next = new BodyPart(this);
        }
    }

    this.removeBodyPart = function () {
        if (this.next) {
            if (this.next.next) {
                this.next.removeBodyPart();
            } else {
                this.next = null;
            }
            this.numberOfParts--;
        }
    };
}