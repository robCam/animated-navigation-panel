/**
 * Global variable contains the app.
 * @module RCAM
 */

var RCAM = RCAM || {};

/**
 * A custom set of utilities
 * @class utils
 * @static
 * @namespace RCAM
 */
RCAM.utils = (function () {

    'use strict';

    /**
     * Checks whether a CSS class name is present on a given DOM node.
     * @method hasClass
     * @param {Object} el The DOM node to check for CSS class name. 
     * @param {String} value The name of the CSS class.
     * @return {Boolean} Whether the named CSS class already exists or not.
     * @example
             RCAM.utils.hasClass(elementRef, 'element--active');
     */
    function hasClass(el, value) {
        return new RegExp('(^|\\s)' + value + '(\\s|$)').test(el.className);
    }

    /**
     * Adds a CSS class name to a specified DOM node.
     * @method addClass
     * @param {Object} el The DOM node to add the class name to
     * @param {String} value The name of the CSS class
     * @example
             RCAM.utils.addClass(elementRef, 'element--active');
     */
    function addClass(el, value) {
        if (!hasClass(el, value)) {
            el.className = el.className ? el.className + ' ' + value : value;
        }
    }

    /**
     * Removes a CSS class name from a given DOM node.
     * @method removeClass
     * @param {Object} el The DOM node to remove the class name from
     * @param {String} value The name of the CSS class 
     * @example
             RCAM.utils.removeClass(elementRef, 'element--active');
     */
    function removeClass(el, value) {
        if (!el.className) {
            return;
        }

        var classes = el.className.split(' '),
            newClasses = [],
            i = 0,
            l = classes.length;

        for (i; i < l; i += 1) {
            if (classes[i] !== value) {
                newClasses.push(classes[i]);
            }
        }
        el.className = newClasses.join(' ');
    }

    /**
     * Toggles a CSS class name from a given DOM node.
     * @method toggleClass
     * @param {Object} el The DOM node to toggle the class name
     * @param {String} value The name of the CSS class
     * @example
             RCAM.utils.toggleClass(elementRef, 'element--active');
     */
    function toggleClass(el, value) {
        if (hasClass(el, value)) {
            removeClass(el, value);
        } else {
            addClass(el, value);
        }
    }

    return {
        hasClass    : hasClass,
        addClass    : addClass,
        removeClass : removeClass,
        toggleClass : toggleClass
    };

}());