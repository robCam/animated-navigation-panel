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
 * Constructs animated sliding header panels
 * @class HeaderPanel
 * @constructor
 * @namespace RCAM.widgets
 * @requires RCAM.utils, RCAM.param
 * @param {Object} el The ID reference for the button element in the DOM.
 * @param {Object} options The configuration options.
 * @example
        var header = new RCAM.widgets.HeaderPanel('js-main-header__panel', {
            dropShadow: false,
            direction: 'leftToRight',
            onPanelHasClosed : function () {
                button.activateInput();
            }
        });
 */
RCAM.widgets.HeaderPanel = (function (global) {

    'use strict';

    /*jslint nomen:true*/

    var param = RCAM.param,
        utils = RCAM.utils,
        doc   = global.document,
        win   = global.window,
        nextFrame = win.requestAnimFrame;

    function HeaderPanel(el, options) {

        /**
         * Ensure the constructor is new-agnostic
         * Checks the receiver value is a proper instance of Header.
         * This ensures no error if instantiated without 'new' keyword.
         */
        if (!(this instanceof HeaderPanel)) {
            return new HeaderPanel(el, options);
        }

        /**
         * Object containing the default configuration options.
         * (These defults are used when no options are provided on intantiation)
         * @property options
         * @type Object
         */
        this.options = {

            /**
             * Optional key/value to indicate whether to apply a drop shadow.
             * @property options.dropShadow
             * @type Boolean
             * @default false
             */
            dropShadow : false,

            /**
             * Optional key/value to indicate the animation direction for the panel.
             * Permitted values are: 'topToBottom', 'leftToRight', 'rightToLeft'.
             * @property options.direction
             * @type String
             * @default 'topToBottom'
             */
            direction : 'topToBottom',

            /**
             * Optional key/value can be used to pass in a callback for when the panel has closed.
             * @property options.onPanelHasClosed
             * @type Object
             * @default null
             */
            onPanelHasClosed : null
        };

        // Merge/replace default options with any user defined options
        this._extend(this.options, options);

        /**
         * Used to indicate the panels active state.
         * @property isActive
         * @type Boolean
         */
        this.isActive = false;

        /**
         * The DOM node for the header panel.
         * @property headerPanel
         * @type Object
         */
        this.headerPanel = typeof el === 'object' ? el : doc.getElementById(el);

        this._createKeyframes();

        this._appendPanelStyles();

        this.headerPanel.addEventListener(param.animationEnd, this, false);
    }

    HeaderPanel.prototype = {

        constructor: HeaderPanel,

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
         * Called when the header panel completes its animation.
         * @method _onAnimationEnd
         * @private
         */
        _onAnimationEnd : function (e) {
            var self = this,
                fp;

            if (e.animationName === 'panelBounce') {

                if (this.options.direction === 'topToBottom') {
                    this.headerPanel.style.cssText += param.cssVendorPref + 'transform: translateY(460px)';
                } else if (this.options.direction === 'bottomToTop') {
                    this.headerPanel.style.cssText += param.cssVendorPref + 'transform: translateY(-460px)';
                } else if (this.options.direction === 'leftToRight') {
                    this.headerPanel.style.cssText += param.cssVendorPref + 'transform: translateX(320px)';
                } else if (this.options.direction === 'rightToLeft') {
                    this.headerPanel.style.cssText += param.cssVendorPref + 'transform: translateX(-320px)';
                }

                fp = this.headerPanel.offsetHeight; //Force paint
                return;
            }

            if (e.animationName === 'panelHide') {

                if (this.options.direction === 'topToBottom' || this.options.direction === 'bottomToTop') {
                    this.headerPanel.style.cssText += param.cssVendorPref + 'transform: translateY(0px)';
                } else if (this.options.direction === 'leftToRight' || this.options.direction === 'rightToLeft') {
                    this.headerPanel.style.cssText += param.cssVendorPref + 'transform: translateX(0px)';
                }

                fp = this.headerPanel.offsetHeight;  //Force paint

                if (this.options.onPanelHasClosed) {
                    this.options.onPanelHasClosed.call(self);
                }
                return;
            }

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
         * Generates and inserts the applicable animation keyframes as per the defined 'direction' option.
         * @method _createKeyframes
         * @private
         */
        _createKeyframes : function () {
            var sheet = doc.styleSheets[0],
                vp = param.cssVendorPref,
                revealKeyframes,
                bounceKeyframes,
                hideKeyframes;

            if (this.options.direction === 'topToBottom') {
                revealKeyframes = '@' + vp + 'keyframes panelReveal {' +
                    '0%   {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,460,0,1);}' +
                    '}';

                bounceKeyframes = '@' + vp + 'keyframes panelBounce {' +
                    '0%   {' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,460,0,1);}' +
                    '50%  {' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,0.96,0.00,0,0,0,1,0,0,460,0,1);}' +
                    '100% {' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,460,0,1);}' +
                    '}';

                hideKeyframes = '@' + vp + 'keyframes panelHide {' +
                    '0%   {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,460,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '}';

            } else if (this.options.direction === 'bottomToTop') {
                revealKeyframes = '@' + vp + 'keyframes panelReveal {' +
                    '0%   {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,-460,0,1);}' +
                    '}';

                bounceKeyframes = '@' + vp + 'keyframes panelBounce {' +
                    '0%   {' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,-460,0,1);}' +
                    '50%  {' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,0.96,0.00,0,0,0,1,0,0,-460,0,1);}' +
                    '100% {' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,-460,0,1);}' +
                    '}';

                hideKeyframes = '@' + vp + 'keyframes panelHide {' +
                    '0%   {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,-460,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '}';

            } else if (this.options.direction === 'leftToRight') {
                revealKeyframes = '@' + vp + 'keyframes panelReveal {' +
                    '0%   {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,320,0,0,1);}' +
                    '}';

                bounceKeyframes = '@' + vp + 'keyframes panelBounce {' +
                    '0%   {' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,320,0,0,1);}' +
                    '50%  {' + vp + 'transform: matrix3d(0.96,0,0.00,0,0.00,1,0.00,0,0,0,1,0,320,0,0,1);}' +
                    '100% {' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,320,0,0,1);}' +
                    '}';

                hideKeyframes = '@' + vp + 'keyframes panelHide {' +
                    '0%   {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,320,0,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '}';

            } else if (this.options.direction === 'rightToLeft') {
                revealKeyframes = '@' + vp + 'keyframes panelReveal {' +
                    '0%   {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,-320,0,0,1);}' +
                    '}';

                bounceKeyframes = '@' + vp + 'keyframes panelBounce {' +
                    '0%   {' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,-320,0,0,1);}' +
                    '50%  {' + vp + 'transform: matrix3d(0.96,0,0.00,0,0.00,1,0.00,0,0,0,1,0,-320,0,0,1);}' +
                    '100% {' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,-320,0,0,1);}' +
                    '}';

                hideKeyframes = '@' + vp + 'keyframes panelHide {' +
                    '0%   {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,-320,0,0,1);}' +
                    '100% {opacity: 1;' + vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1)}' +
                    '}';
            }
            sheet.insertRule(revealKeyframes, 0);
            sheet.insertRule(bounceKeyframes, 0);
            sheet.insertRule(hideKeyframes, 0);

        },

        /**
         * Creates and inserts the applicable css properties for the panel,
         * including properties for its 'active' and 'inactive' states.
         * @method _appendPanelStyles
         * @private
         */
        _appendPanelStyles : function () {

            var sheet = doc.styleSheets[0],
                vp = param.cssVendorPref,
                panelStyle,
                panelStyleActive,
                panelStyleInactive;

            if (this.options.direction === 'topToBottom') {
                panelStyle = '.main-header__panel {' +
                        'position: relative;' +
                        'margin: auto;' +
                        'left: 0px;' +
                        'top: -460px;' +
                        'width: 100%;' +
                        'height: 460px;' +
                        'border-bottom: 1px solid hsl(0, 0%, 100%);' +
                        'padding-top: 86px;';

                panelStyleActive = '.main-header__panel--active {' +
                        vp + 'transform-origin: center top;';

                panelStyleInactive = '.main-header__panel--inactive {' +
                        vp + 'transform-origin: center top;';

            } else if (this.options.direction === 'bottomToTop') {
                panelStyle = '.main-header__panel {' +
                        'position: absolute;' +
                        'left: 0px;' +
                        /*'top: 0px;' +*/
                        'width: 100%;' +
                        'bottom: -460px;' +
                        'height: 460px' +
                        'border-top: 1px solid hsl(0, 0%, 100%);' +
                        'backgrounbd: red;' +
                        'padding-top: 46px;';

                panelStyleActive = '.main-header__panel--active {' +
                        vp + 'transform-origin: center bottom;';

                panelStyleInactive = '.main-header__panel--inactive {' +
                        vp + 'transform-origin: center bottom;';

            } else if (this.options.direction === 'leftToRight') {
                panelStyle = '.main-header__panel {' +
                        'position: absolute;' +
                        'left: -320px;' +
                        'top: 0px;' +
                        'width: 320px;' +
                        'bottom: 0px;' +
                        'border-right: 1px solid hsl(0, 0%, 100%);' +
                        'padding-top: 86px;';

                panelStyleActive = '.main-header__panel--active {' +
                        vp + 'transform-origin: left top;';

                panelStyleInactive = '.main-header__panel--inactive {' +
                        vp + 'transform-origin: left top;';

            } else if (this.options.direction === 'rightToLeft') {
                panelStyle = '.main-header__panel {' +
                        'position: absolute;' +
                        'right: -320px;' +
                        'top: 0px;' +
                        'width: 320px;' +
                        'bottom: 0px;' +
                        'border-left: 1px solid hsl(0, 0%, 100%);' +
                        'padding-top: 86px;';

                panelStyleActive = '.main-header__panel--active {' +
                        vp + 'transform-origin: right top;';

                panelStyleInactive = '.main-header__panel--inactive {' +
                        vp + 'transform-origin: right top;';
            }

            panelStyle += 'overflow: hidden;' + 'opacity: 0;' +
                    vp + 'transform: matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1);' +
                    'will-change: transform,' +
                    'opacity;' +
                    'background: hsl(0, 0%, 100%);';

            panelStyleActive += vp + 'animation: panelReveal .300s ease-out 0s 1 forwards,' +
                    'panelBounce .350s ease-out .350s 1 forwards; opacity: 1;}';

            panelStyleInactive += vp + 'animation: panelHide .300s ease-out 0s 1 forwards; opacity: 1;}';

            if (this.options.dropShadow) {
                panelStyle += 'box-shadow: 0 0 100px hsl(0, 0%, 0%);}';
            } else {
                panelStyle += '}';
            }

            sheet.insertRule(panelStyle, 0);
            sheet.insertRule(panelStyleActive, 0);
            sheet.insertRule(panelStyleInactive, 0);
        },

        /**
         * Toggles the active/non-active panel state.
         * @method toggleState
         * @example
             panel.toggleState();
         */
        toggleState : function () {
            var self = this;

            this.isActive = this.isActive ? false : true;

            if (!utils.hasClass(this.headerPanel, 'main-header__panel--active')) {
                nextFrame(function() {
                    utils.addClass(self.headerPanel, 'main-header__panel--active');
                    utils.removeClass(self.headerPanel, 'main-header__panel--inactive');
                });
                return;
            }

            if (!utils.hasClass(this.headerPanel, 'main-header__panel--inactive')) {
                nextFrame(function() {
                    utils.addClass(self.headerPanel, 'main-header__panel--inactive');
                    utils.removeClass(self.headerPanel, 'main-header__panel--active');
                });
                return;
            }
        }

    };

    return HeaderPanel;

}(this));