var requestAnimFrame = (function (window) {
    'use strict';
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function(callback) { window.setTimeout(callback, 1000 / 60); };
}(this));