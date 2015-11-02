// How many pixels does a user have to move across the globe to change frames?  (14 is about a full rotation with a move across the entire globe)
var movePixelsPerFrame  = 14;
// What's the minimum speed the globe will go, if it's spun?
var minSpinSpeed 	= 8;
// What's the minimum move speed required to spin the globe w/ momentum?
var minSpeedForSpin	= 3;
// How much friction should there be when the globe is spun?
var friction 		= .75;
// How often should the friction be taken into account?
var frictionTimer	= 200;
// How fast should the globe spin?
var spinSpeed		= 100;

var mouseDown		= false; // whether mouse is down at a given time

var lastX, lastChange, turnInterval, animInterval, speed, lastMove;

var animation = {
    images: [],
    canvas: document.getElementById('animation'),
    context: document.getElementById('animation').getContext('2d'),
    counter: 0,
    event: null,
    initialize: function() {
        this.load();

        // Link mousedown / touchstart to a handler
        this.canvas.addEventListener('mousedown', animation.mousedown, false);
        this.canvas.addEventListener('touchstart', animation.mousedown, false);

        // Link mousemove / touchmove to a handler
        window.addEventListener('mousemove', animation.mousemove, false);
        window.addEventListener('touchmove', animation.mousemove, false);

        // Link mouseup / touchend to a handler
        window.addEventListener('mouseup', animation.mouseup, false);
        window.addEventListener('touchend', animation.mouseup, false);

        if (this.images.length == 0) { return false; }

        this.context.drawImage(this.images[this.counter], 0, 0);
    },
    load: function() {
        var self = this;
        // Loop through the number of images we have
        $('.animation-image').each(function() {
            self.images.push($(this)[0]);
        });
    },
    mouseup: function(e) {
        if (mouseDown) {
            mouseDown = false;
            if (e.cancelable) { e.preventDefault(); }
            if (lastChange < minSpinSpeed && lastChange >= minSpeedForSpin) {
                // If our last change is less than the minimum spinning speed, but greater than the
                speed = minSpinSpeed;
            } else if (lastChange > -minSpinSpeed && lastChange <= -minSpeedForSpin) {
                speed = -minSpinSpeed;
            } else if (lastChange > -minSpeedForSpin && lastChange < minSpeedForSpin) {
                speed = 0;
            } else {
                speed = lastChange;
            }
            // Handle the momentum events
            animation.turn();
            return false;
        }
        return true;
    },
    mousedown: function(e) {
        speed = lastChange = 0;
        local = animation.getCoords(this.canvas, e);
        mouseDown = true;
        lastX = local.x;
        lastMove = 0;
        if (e.cancelable) { e.preventDefault(); }
        return false;
    },
    mousemove: function(e) {
        if (!mouseDown) { return true; }
        local = animation.getCoords(this.canvas, e);
        console.log(local);
        lastChange 	= local.x - lastX;
        lastX 		= local.x;
        lastMove 	= lastMove + lastChange;
        if (lastMove >= movePixelsPerFrame || lastMove <= -movePixelsPerFrame) {
            moveAmount = Math.floor(lastMove / movePixelsPerFrame);
            lastMove = lastMove - moveAmount * movePixelsPerFrame;
            animation.counter += moveAmount;
            if (animation.counter >= animation.images.length) { animation.counter = 0; }
            if (animation.counter < 0) { animation.counter = animation.images.length - 1; }
            animation.canvas.width = animation.canvas.width;
            animation.context.drawImage(animation.images[animation.counter], 0, 0);
        }
        if (e.cancelable) { e.preventDefault(); }
        return false;
    },
    turn: function() {
        clearInterval(turnInterval);
        clearInterval(animInterval);
        animInterval = setInterval(function() {
            animation.animate();
        }, Math.abs(spinSpeed / speed));
        turnInterval = setInterval(function() {
            if (speed == 0) {
                clearInterval(turnInterval);
            }
            console.log(speed);
            clearInterval(animInterval);
            animInterval = setInterval(function() {
                animation.animate();
            }, Math.abs(spinSpeed / speed));
            speed = speed > 0 ? Math.floor(speed * friction) : Math.floor(Math.abs(speed * friction)) * -1;
        }, frictionTimer);
    },
    getCoords: function(elem, ev) {
        var ox = 0, oy = 0;
        var first;
        var pageX, pageY;

        while (elem != null) {
            ox += elem.offsetLeft;
            oy += elem.offsetTop;
            elem = elem.offsetParent;
        }

        if (ev.hasOwnProperty('changedTouches')) {
            first = ev.changedTouches[0];
            pageX = first.pageX;
            pageY = first.pageY;
        } else {
            pageX = ev.pageX;
            pageY = ev.pageY;
        }

        return { 'x': pageX - ox, 'y': pageY - oy };
    },
    animate: function() {
        if (speed == 0) { return false; }
        animation.counter = speed > 0 ? animation.counter + 1 : animation.counter - 1;
        if (animation.counter >= animation.images.length) { animation.counter = 0; }
        if (animation.counter < 0) { animation.counter = animation.images.length - 1; }
        animation.canvas.width = animation.canvas.width;
        animation.context.drawImage(animation.images[animation.counter], 0, 0);
    }
};
$(window).ready(function() {
    animation.initialize();
});
