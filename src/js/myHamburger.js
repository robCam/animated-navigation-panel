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
 * Constructs animated hamburger buttons
 * @class Hamburger
 * @constructor
 * @namespace RCAM.widgets
 * @requires RCAM.utils, RCAM.param
 * @param {Object} nodes The element ID references to the DOM nodes.
 * @param {Object} options The configuration options.
 * @example
        var button = new RCAM.widgets.Hamburger({
            buttonId: 'js-rc-hamburger',
            buttonLineTopId: 'js-rc-hamburger__top',
            buttonLineBottomId: 'js-rc-hamburger__bottom'
        }, {
            onToggleState : function () {
                this.publish('stateToggled', this);
            }
        });
 */
RCAM.widgets.Hamburger = (function (global) {

    'use strict';

    /*jslint nomen:true*/

    var param = RCAM.param,
        utils = RCAM.utils,
        doc = global.document,
        win = global.window,
        nextFrame = win.requestAnimFrame;

    function Hamburger(nodes, options) {

        /**
         * Ensure the constructor is new-agnostic
         * Checks the receiver value is a proper instance of Header.
         * This ensures no error if instantiated without 'new' keyword.
         */
        if (!(this instanceof Hamburger)) {
            return new Hamburger(nodes, options);
        }

        // Check and normalize nodes arguments
        var buttonId = nodes.buttonId === undefined ?
                    'js-rc-hamburger' : nodes.buttonId,
            buttonLineTopId = nodes.buttonLineTopId === undefined ?
                    'js-rc-hamburger__top' : nodes.buttonLineTopId,
            buttonLineBottomId = nodes.buttonLineBottomId === undefined ?
                    'js-rc-hamburger__bottom' : nodes.buttonLineBottomId;

        /**
         * Object containing the default configuration options.
         * (These defults are used when no options are provided on intantiation)
         * @property options
         * @type Object
         */
        this.options = {

            /**
             * Optional key/value can be used to pass in a callback for when the panel has closed.
             * @property options.onToggleState
             * @type Object
             * @default null
             */
            onToggleState : null
        };

        // Merge/replace with user defined options
        this._extend(this.options, options);

        /**
         * Used to indicate the buttons active state.
         * @property isActive
         * @type Boolean
         */
        this.isActive = false;

        /**
         * The DOM node for the activate button.
         * @property button
         * @type Object
         */
        this.button = doc.getElementById(buttonId);

        /**
         * The DOM node for the hamburger menu's top line.
         * @property buttonLineTop
         * @type Object
         */
        this.buttonLineTop = doc.getElementById(buttonLineTopId);

        /**
         * The DOM node for the hamburger menu's bottom line.
         * @property buttonLineBottom
         * @type Object
         */
        this.buttonLineBottom = doc.getElementById(buttonLineBottomId);

        this.button.addEventListener(param.pointerStart, this, false);
        /*this.button.addEventListener(param.pointerEnd, this, false);*/
        this.button.addEventListener(param.transitionEnd, this, false);
    }

    Hamburger.prototype = {

        constructor: Hamburger,

        /**
         * Handles events when they are fired.
         * @method handleEvent
         * @private 
         */
        handleEvent : function (e) {
            switch (e.type) {
            case param.pointerStart:
                this._onStart(e);
                break;
            case param.pointerEnd:
            case param.pointerCancel:
                this._onEnd(e);
                break;
            case param.transitionEnd:
                this._onTransitionEnd(e);
                break;
            }
        },

        /**
         * Called when a pointer or touch event starts.
         * @method _onStart
         * @private 
         */
        _onStart : function (e) {
            this.button.addEventListener(param.pointerEnd, this, false);
            this.button.removeEventListener(param.pointerStart, this, false);
            e.preventDefault();
            e.stopPropagation();
        },

        /**
         * Called when a pointer or touch event ends.
         * @method _onEnd
         * @private
         */
        _onEnd : function (e) {
            this.deactivateInput();
            this.toggleState();

            e.preventDefault();
            e.stopPropagation();
        },

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
         * Called when the hamburger menu completes its animation.
         * @method _onTransitionEnd
         * @private
         */
        _onTransitionEnd : function () {
            if (this.isActive) { // Accessibility - toggle button label
                this.button.setAttribute("aria-label", "Close navigation menu");
            } else {
                this.button.setAttribute("aria-label", "Open navigation menu");
            }
            //this.activateInput();
        },

        /**
         * Enables the buttons pointer inputs (pointerStart).
         * @method activateInput
         * @example
             button.activateInput();
         */
        activateInput : function () {
            this.button.addEventListener(param.pointerStart, this, false);
        },

        /**
         * Disables the buttons pointer inputs (pointerstart, pointerEnd, and pointerCancel)
         * @method deactivateInput
         * @example
             button.deactivateInput();
         */
        deactivateInput : function () {
            this.button.removeEventListener(param.pointerStart, this, false);
            this.button.removeEventListener(param.pointerEnd, this, false);
            this.button.removeEventListener(param.pointerCancel, this, false);
        },

        /**
         * Toggles the active/non-active button state.
         * @method toggleState
         * @example
             button.toggleState();
         */
        toggleState : function () {
            var self = this;

            if (this.options.onToggleState) {
                this.options.onToggleState.call(self);
            }

            nextFrame(function () {
                utils.toggleClass(self.button, 'rc-hamburger--active');
                utils.toggleClass(self.buttonLineTop, 'rc-hamburger__top--active');
                utils.toggleClass(self.buttonLineBottom, 'rc-hamburger__bottom--active');
            });

            this.isActive = this.isActive ? false : true;
        }

    };

    return Hamburger;

}(this));