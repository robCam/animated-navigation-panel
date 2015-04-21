var RCAM = RCAM || {};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function (window) {

    'use strict';

    RCAM.publisher = {

        subscribers: {
            any: [] // event type: subscribers
        },

        subscribe: function(type, fn, context) {
            type = type || 'any';
            fn = typeof fn === 'function' ? fn : context[fn];

            if (this.subscribers[type] === undefined) {
                this.subscribers[type] = [];
            }
            this.subscribers[type].push({fn: fn, context: context || this});
        },

        unsubscribe: function(type, fn, context) {
            this.visitSubscribers('unsubscribe', type, fn, context);
        },

        publish: function(type, publication) {
            this.visitSubscribers('publish', type, publication);
        },

        visitSubscribers: function(action, type, arg, context) {
            var pubtype = type || 'any',
                subscribers = this.subscribers[pubtype],
                max = subscribers ? subscribers.length : 0,
                i = 0;

            for (i; i < max; i += 1) {
                if (action === 'publish') {
                    // Call our observers, passing along arguments
                    subscribers[i].fn.call(subscribers[i].context, arg);
                } else {
                    if (subscribers[i].fn === arg &&
                            subscribers[i].context === context) {
                        subscribers.splice(i, 1);
                    }
                }
            }
        }
    };

    window.RCAM.publisher = RCAM.publisher;

}(this));

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

RCAM.makePublisher = function (o) {

    'use strict';

    var i;

    for (i in RCAM.publisher) {
        if (RCAM.publisher.hasOwnProperty(i) &&
                typeof RCAM.publisher[i] === 'function') {
            o[i] = RCAM.publisher[i];
        }
    }
    o.subscribers = { any: [] };
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
