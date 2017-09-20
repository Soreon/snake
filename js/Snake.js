/*jslint this */
/*global circle */

var intervalSize = 5;

function finFormula(x, t) {
    return Math.abs(20*Math.log(x) - 1.5*x + 13 + Math.cos(0.4*(x-(t*0.04)))*10);
}

function bodyFormula(x) {
    return 10 * Math.log(x) - 0.8 * (x-5);
}

function BodyPart(previous) {
    "use strict";
    this.previous = previous;
    this.head = previous.head;
    this.speed = previous.speed;
    this.order = this.previous.order + 1;
    //this.size = this.head.size * (1 - (this.order / this.head.numberOfParts));
    this.size = bodyFormula(this.order);
    this.next = null;
    this.orientation = previous.orientation;
    this.position = {x: 0, y: 0};

    this.draw = function () {
        circle(this.position.x, this.position.y, this.size, "#0FF0FF");

        // Ailerons
        // var f = 0.25 * Math.pow(this.size, 2) - 2 * this.size + 13;

        var base = this.size + 5;
        var f = base + finFormula(this.order, Date.now());
        var n = base;
        var m = Math.toRadians(this.orientation - 110);
        var p = Math.toRadians(this.orientation + 110);
        var xmf = f * Math.cos(m);
        var xmn = n * Math.cos(m);
        var ymf = f * Math.sin(m);
        var ymn = n * Math.sin(m);
        var xpf = f * Math.cos(p);
        var xpn = n * Math.cos(p);
        var ypf = f * Math.sin(p);
        var ypn = n * Math.sin(p);
        line(this.position.x + xmn, this.position.y + ymn, this.position.x + xmf, this.position.y + ymf, "#FF0FF0");
        line(this.position.x + xpn, this.position.y + ypn, this.position.x + xpf, this.position.y + ypf, "#FF0FF0");

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
        //this.size = this.head.size * (1 - (this.order / this.head.numberOfParts));
        this.size = bodyFormula(this.order);
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
    this.size = bodyFormula(1);
    this.numberOfParts = 1;
    this.wandering = false;
    this.baseConeValue = 15;
    this.instantConeValue = this.baseConeValue;

    this.draw = function () {
        // Tête du snake
        circle(this.position.x, this.position.y, this.size, "#0FF0FF");

        // Nez du snake
        var radius = this.size + 10;
        var xp = radius * Math.cos(Math.toRadians(this.orientation));
        var yp = radius * Math.sin(Math.toRadians(this.orientation));
        circle(this.position.x + xp, this.position.y + yp, 2, "#0FF0FF");

        // Ailerons
        var base = this.size + 5;
        var f = base + finFormula(this.order, Date.now());
        var n = base;
        var m = Math.toRadians(this.orientation - 110);
        var p = Math.toRadians(this.orientation + 110);
        var xmf = f * Math.cos(m);
        var xmn = n * Math.cos(m);
        var ymf = f * Math.sin(m);
        var ymn = n * Math.sin(m);
        var xpf = f * Math.cos(p);
        var xpn = n * Math.cos(p);
        var ypf = f * Math.sin(p);
        var ypn = n * Math.sin(p);
        line(this.position.x + xmn, this.position.y + ymn, this.position.x + xmf, this.position.y + ymf, "#FF0FF0");
        line(this.position.x + xpn, this.position.y + ypn, this.position.x + xpf, this.position.y + ypf, "#FF0FF0");

        if (this.next) {
            this.next.draw();
        }
    };

    this.move = function () {

        // Cas de figure ou le pointeur n'est pas sur le canvas, la bête se met à errer
        if (this.wandering) {
            this.instantConeValue = this.baseConeValue;
            do {
                var radius = 100;
                var randomCone = (Math.random() * this.instantConeValue) - this.instantConeValue / 2;
                var xp = radius * Math.cos(Math.toRadians(this.orientation + randomCone));
                var yp = radius * Math.sin(Math.toRadians(this.orientation + randomCone));
                
                var resultX = this.position.x + xp;
                var resultY = this.position.y + yp;
                this.instantConeValue++;
                
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