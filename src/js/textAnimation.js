/**
 * Global variable contains the app.
 * @module RCAM
 */
var RCAM = RCAM || {};/*,

    nextFrame = (function (window) {
        'use strict';
        return window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function(callback) { window.setTimeout(callback, 1000 / 60); };
    }(this));*/

/**
 * Object container to hold custom interactive widgets.
 * @module RCAM.widgets
 */
RCAM.widgets = RCAM.widgets || {};

/**
 * Constructs animated text instances
 * @class TextAnimate
 * @constructor
 * @namespace RCAM.widgets
 * @requires RCAM.utils, RCAM.param
 * @param {Object} el The ID reference for the parent element containing the text to animate.
 * @param {Object} options The configuration options.
 * @example
        var textAnimation = new RCAM.widgets.TextAnimate('js-main-header__panel', {
            direction: 'topToBottom',
            distance: 20,
            durationForEach: 340,
            onLastAnimationHasPlayed : function () {
                button.activateInput();
            }
        });
 */
RCAM.widgets.TextAnimate = (function (global) {

    'use strict';

    /*jslint nomen:true*/

    var param = RCAM.param,
        utils = RCAM.utils,
        doc = global.document,
        win = global.window,
        nextFrame = win.requestAnimFrame;

    function TextAnimate(el, options) {

        var i = 0,
            max,
            style;
//this.results = document.querySelector('.results');
        /**
         * Ensure the constructor is new agnostic.
         * Checks the receiver value is a proper instance of Header.
         * This ensures no error if instantiated without 'new' keyword.
         */
        if (!(this instanceof TextAnimate)) {
            return new TextAnimate(el, options);
        }

        /** 
         * Object containing the default configuration options.
         * (These defults are used when no options are provided on intantiation)
         * @property options
         * @type Object
         */
        this.options = {

            /**
             * Optional key/value, can be used to pass in a callback for when the last animated text instance completes.
             * @property options.onLastAnimationHasPlayed
             * @type Object
             * @default null
             */
            onLastAnimationHasPlayed : null,

            /**
             * Optional key/value can be used to reverse the order in which each text animation is played.
             * @property options.reversePlayOrder
             * @type Object
             * @default false
             */
            reversePlayOrder : false,

            /**
             * Optional key/value and value to indicate the animation direction for the text.
             * Permitted values are: 'topToBottom', 'leftToRight', 'rightToLeft'.
             * @property options.direction
             * @type String
             * @default 'topToBottom'
             */
            direction : 'topToBottom',

            /**
             * Optional key/value for the distance/pixels the animated text travels.
             * @property options.distance
             * @type Number
             * @default 20
             */
            distance  : 20,

            /**
             * Optional key/value to specify the duration of the text animation (milliseconds).
             * @property options.duration
             * @type Number
             * @default 400
             */
            duration  : 400
        };

        // Merge/replace the user defined options
        this._extend(this.options, options);

        /**
         * Used to indicate whether the text animation is at its final end state.
         * @property isActive
         * @type boolean
         */
        this.isActive = false;

        /**
         * After each text animation has played this is incremented by 1.
         * @property animationHasPlayedCounter
         * @type Number
         */
        this.animationHasPlayedCounter = 0;

        /**
         * The parent DOM element containing the text to animate.
         * @property el
         * @type Object
         */
        this.el = typeof el === 'object' ? el : doc.getElementById(el);

        /**
         * An array of each text instance to be animated.
         * @property instances
         * @type Array
         */
        this.instances = [].slice.call(this.el.querySelectorAll('.panel__text'));

        this._createFirstKeyframes();
        this._createSecondKeyframes();

        for (i, max = this.instances.length; i < max; i += 1) {
            style = this._defineAnimations(i);
            this._insertAnimationRule('panel__text--active-' + i, style);

            this.instances[i].addEventListener(param.animationEnd, this, false);
        }
    }

    TextAnimate.prototype = {

        constructor: TextAnimate,

        /**
         * Handles events when they are fired.
         * @method handleEvent
         * @private 
         */
        handleEvent : function (e) {
            switch (e.type) {
            case param.animationEnd:
                this._onAnimationEnd(e);
                break;
            }
        },

        /**
         * Handles events when they are fired.
         * @method _defineAnimations
         * @param {Object} i The loop number.
         * @private 
         */
        _defineAnimations : function (i) {
            var vendorPrefix = param.cssVendorPref,
                durationForEach = this.options.durationForEach,
                definition = vendorPrefix + 'animation: First ' + durationForEach + 'ms ease-in ' + (i * 200) + 'ms 1 forwards, ' +
                        'Second ' + durationForEach + 'ms ease ' + (durationForEach + (i * 200)) + 'ms 1 forwards;';

            return definition;
        },

        /*
        NOTE: '_defineAnimations' creates animation rules similar to example below:

            animation: First .4s ease-in  0s 1 forwards, Second .4s ease .4s 1 forwards;
            animation: First .4s ease-in .2s 1 forwards, Second .4s ease .6s 1 forwards;
            animation: First .4s ease-in .4s 1 forwards, Second .4s ease .8s 1 forwards;
            animation: First .4s ease-in .6s 1 forwards, Second .4s ease  1s 1 forwards;
        */

        /**
         * Enumerate properties of the 'source' object and copy them to the 'target'.
         * @method _extend
         * @private
         */
        _extend : function (target, source) {
            var i;
            if (typeof source === 'object') {
                for (i in source) {
                    if (source.hasOwnProperty(i)) {
                        target[i] = source[i];
                    }
                }
            }
        },

        /**
         * Inserts a css animation rule.
         * @method _insertAnimationRule
         * @param {Object} name The name of the css rule.
         * @param {Object} properties The css rule properties.
         * @private 
         */
        _insertAnimationRule : function (name, properties) {
            var animStyle = '.' + name + ' { ' + properties + ' }';
            doc.styleSheets[0].insertRule(animStyle, 0);
        },

        /**
         * Generates and inserts the first animation keyframes.
         * @method _createFirstKeyframes
         * @private 
         */
        _createFirstKeyframes : function () {

            var vp = param.cssVendorPref,
                distance = this.options.distance,
                keyframes;

            if (this.options.direction === 'topToBottom') {
                keyframes = '@' + vp + 'keyframes First {' +
                    '0% {opacity: 0;'   + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,' + -distance + ',0,1); ' + vp + 'transform-origin: center bottom;}' +
                    '90% {opacity: .3;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,0.9,0.00,0,0,0,1,0,0,' + (distance / 4) + ',0,1);}' +
                    '}';
            } else if (this.options.direction === 'bottomToTop') {
                keyframes = '@' + vp + 'keyframes First {' +
                    '0% {opacity: 0;'   + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,' + distance + ',0,1); ' + vp + 'transform-origin: center bottom;}' +
                    '90% {opacity: .3;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,0.9,0.00,0,0,0,1,0,0,' + -(distance / 4) + ',0,1);}' +
                    '}';
            } else if (this.options.direction === 'leftToRight') {
                keyframes = '@' + vp + 'keyframes First {' +
                    '0% {opacity: 0;'   + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + -distance + ',0,0,1); ' + vp + 'transform-origin: right center;}' +
                    '90% {opacity: .3;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(0.9,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (distance / 4) + ',0,0,1);}' +
                    '}';
            } else if (this.options.direction === 'rightToLeft') {
                keyframes = '@' + vp + 'keyframes First {' +
                    '0% {opacity: 0;'   + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + distance + ',0,0,1); ' + vp + 'transform-origin: left center;}' +
                    '90% {opacity: .3;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(0.9,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + -(distance / 4) + ',0,0,1);}' +
                    '}';
            }
            doc.styleSheets[0].insertRule(keyframes, 0);
        },

        /**
         * Generates and inserts the second animation keyframes.
         * @method _createSecondKeyframes
         * @private 
         */
        _createSecondKeyframes : function () {

            var vendorPrefix = param.cssVendorPref,
                distance = this.options.distance,
                keyframes;

            if (this.options.direction === 'topToBottom') {
                keyframes = '@' + vendorPrefix + 'keyframes Second {' +
                    '0% {opacity: 1;'   + vendorPrefix + 'transform: matrix3d(1,0,0.00,0,0.00,0.9,0.00,0,0,0,1,0,0,' + (distance / 4) + ',0,1);}' +
                    '100% {opacity: 1;' + vendorPrefix + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '}';
            } else if (this.options.direction === 'bottomToTop') {
                keyframes = '@' + vendorPrefix + 'keyframes Second {' +
                    '0% {opacity: 1;'   + vendorPrefix + 'transform: matrix3d(1,0,0.00,0,0.00,0.9,0.00,0,0,0,1,0,0,' + -(distance / 4) + ',0,1);}' +
                    '100% {opacity: 1;' + vendorPrefix + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '}';
            } else if (this.options.direction === 'leftToRight') {
                keyframes = '@' + vendorPrefix + 'keyframes Second {' +
                    '0% {opacity: 1;'   + vendorPrefix + 'transform: matrix3d(0.9,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (distance / 4) + ',0,0,1);}' +
                    '100% {opacity: 1;' + vendorPrefix + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '}';
            } else if (this.options.direction === 'rightToLeft') {
                keyframes = '@' + vendorPrefix + 'keyframes Second {' +
                    '0% {opacity: 1;'   + vendorPrefix + 'transform: matrix3d(0.9,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + -(distance / 4) + ',0,0,1);}' +
                    '100% {opacity: 1;' + vendorPrefix + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '}';
            }
            doc.styleSheets[0].insertRule(keyframes, 0);
        },

        /**
         * Called when the text completes its animation.
         * @method _onAnimationEnd
         * @private
         */
        _onAnimationEnd : function (e) {

            if (!this.isActive) {
                return;
            }

            if (e.animationName === 'Second' && this.isActive) {
                var classesArray = e.target.classList.toString().split(' '),
                    max = classesArray.length,
                    i = 0,
                    self = this;

                this.animationHasPlayedCounter += 1;

//this.results.innerHTML = this.animationHasPlayedCounter + ':' + this.instances.length + ' : ' + e.animationName;
                for (i; i < max; i += 1) {

                    if (classesArray[i].indexOf('panel__text--active-') !== -1) {
                        e.target.classList.remove(classesArray[i]);
                    } else {
                        e.target.style.opacity = '1';
                    }
                }

                // The last animated text instance has completed its transition.
                if (this.animationHasPlayedCounter === this.instances.length &&
                        typeof this.options.onLastAnimationHasPlayed === 'function') {
                    this.options.onLastAnimationHasPlayed.call(self);
                }

            }
        },

        /**
         * Plays/activates the text animation.
         * @method play
         * @example
             textAnimation.play();
         */
        play : function () {
            var self = this,
                max = self.instances.length,
                i = 0;

            this.animationHasPlayedCounter = 0;

            if (this.options.reversePlayOrder) {
                this.instances = this.instances.reverse();
            }

            if (!this.isActive) {
                nextFrame(function() {
                    for (i; i < max; i += 1) {
                        self.instances[i].style.opacity = '0';
                        utils.addClass(self.instances[i], 'panel__text--active-' + i);
                    }
                });
            }

            this.isActive = this.isActive ? false : true;
        }

    };

    return TextAnimate;

}(this));