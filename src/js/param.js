var RCAM = RCAM || {};

RCAM.param = RCAM.param || {};

RCAM.init = (function (global) {

    'use strict';

    var param = RCAM.param,
        doc = global.document,
        win = global.window,
        nav = global.navigator;

    function getPrefix(transitions) {
        var t,
            el = doc.createElement('tempElement');
        for (t in transitions) {
            if (transitions.hasOwnProperty(t)) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }
        el = null;
    }

    function getDeviceParameters() {
        var hasOrientation = win.hasOwnProperty('onorientationchange'),
            styles = win.getComputedStyle(doc.documentElement, ''),
            pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            )[1];

        param.hasTouch = doc.hasOwnProperty('ontouchstart') ||
                       (nav.MaxTouchPoints > 0) ||
                       (nav.msMaxTouchPoints > 0);

        param.resizeEvent  = hasOrientation ? 'orientationchange' : 'resize';
        param.pointerStart = param.hasTouch ? 'touchstart' : 'mousedown';
        param.pointerMove  = param.hasTouch ? 'touchmove'  : 'mousemove';
        param.pointerEnd   = param.hasTouch ? 'touchend'   : 'mouseup';

        if (param.hasTouch) { param.pointerCancel = 'touchcancel'; }

        param.cssVendorPref = '-' + pre + '-';
        param.jsVendorPref  = pre[0].toUpperCase() + pre.substr(1);

        param.transitionStart = getPrefix({
            'transition'       : 'transitionstart',
            'OTransition'      : 'oTransitionStart',
            'MozTransition'    : 'transitionstart',
            'WebkitTransition' : 'webkitTransitionStart'
        });

        param.transitionEnd = getPrefix({
            'transition'       : 'transitionend',
            'OTransition'      : 'oTransitionEnd',
            'MozTransition'    : 'transitionend',
            'WebkitTransition' : 'webkitTransitionEnd'
        });

        param.animationStart = getPrefix({
            'animation'       : 'animationstart',
            'Oanimation'      : 'oAnimationStart',
            'MozAnimation'    : 'animationstart',
            'WebkitAnimation' : 'webkitAnimationStart'
        });

        param.animationEnd = getPrefix({
            'animation'       : 'animationend',
            'Oanimation'      : 'oAnimationEnd',
            'MozAnimation'    : 'animationend',
            'WebkitAnimation' : 'webkitAnimationEnd'
        });
    }

    function init() {
        getDeviceParameters();
    }

    return init;

}(this));

RCAM.init();
