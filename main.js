(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/hammerjs/hammer.js":
/*!*****************************************!*\
  !*** ./node_modules/hammerjs/hammer.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
        return Hammer;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}

})(window, document, 'Hammer');


/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/app.component.html":
/*!**************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/app.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<app-header></app-header>\n\n<main class=\"\">\n  <router-outlet></router-outlet>\n</main>\n\n<app-footer></app-footer>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/edit-assistant/edit-assistant.component.html":
/*!****************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/edit-assistant/edit-assistant.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"padding-top-10p light-grey\">\n  <mat-card>\n    <mat-card-header>\n      <mat-card-title *ngIf=\"!isEditUser\" class=\"color-text-mat-card \">{{texts.titleRegedit}}</mat-card-title>\n      <mat-card-title *ngIf=\"isEditUser\" class=\"color-text-mat-card \">{{texts.titleEdit}}</mat-card-title>\n    </mat-card-header>\n    <mat-card-content class=\"padding-05p-top height-95vh\">\n\n      <div *ngIf=\"!isEditUser\">\n        <input #file type=\"file\" accept='image/*' (change)=\"preview(file.files)\" />\n      </div>\n\n      <img src=\"{{'data:image/jpg;base64,' + imageBase64}}\" />\n\n\n      <div class=\"row padding-1p-bottom\">\n        <div class=\"column padding-05p-right padding-3p-left width-50p font-size-11px\">\n          <mat-form-field appearance=\"outline\" class=\"width-100p\">\n            <mat-label>{{texts.name}}</mat-label>\n            <input matInput maxlength=\"255\" type=\"text\" placeholder=\"{{texts.name}}\" [formControl]=\"groupProfile.controls.name\" required>\n            <mat-error *ngIf=\"groupProfile.controls.name.invalid\">{{texts.required}}</mat-error>\n          </mat-form-field>\n        </div>\n\n        <div class=\"column padding-05p-left padding-3p-right width-50p font-size-11px\">\n          <mat-form-field appearance=\"outline\" class=\"width-100p\">\n            <mat-label>{{texts.surnames}}</mat-label>\n            <input matInput maxlength=\"255\" type=\"text\" placeholder=\"{{texts.surnames}}\" [formControl]=\"groupProfile.controls.surnames\"\n              required>\n            <mat-error *ngIf=\"groupProfile.controls.surnames.invalid\">{{texts.required}}</mat-error>\n          </mat-form-field>\n        </div>\n      </div>\n\n      <div class=\"row padding-1p-bottom \">\n        <div class=\"column padding-05p-right padding-3p-left width-50p font-size-11px\">\n          <mat-form-field appearance=\"outline\" class=\"width-100p\">\n            <mat-label>{{texts.nif}}</mat-label>\n            <input matInput maxlength=\"9\" minlength=\"9\" type=\"text\" placeholder=\"{{texts.nif}}\" [formControl]=\"groupProfile.controls.nif\"\n              required>\n            <mat-error *ngIf=\"groupProfile.controls.nif.invalid\">{{texts.validatorNifNoValid}}</mat-error>\n          </mat-form-field>\n        </div>\n\n        <div class=\"column padding-05p-left padding-3p-right width-50p font-size-11px\">\n          <mat-form-field appearance=\"outline\" class=\"width-100p\">\n            <mat-label>{{texts.dateOfBirth}}</mat-label>\n            <input matInput maxlength=\"255\" placeholder=\"{{texts.dateOfBirth}}\" type=\"date\" [formControl]=\"groupProfile.controls.dateOfBirth\"\n              required>\n            <mat-error *ngIf=\"groupProfile.controls.dateOfBirth.invalid\">{{texts.required}}</mat-error>\n          </mat-form-field>\n        </div>\n      </div>\n\n      <div class=\"row padding-1p-bottom\">\n        <div class=\"column padding-05p-right padding-3p-left width-50p font-size-11px\">\n          <mat-form-field appearance=\"outline\" class=\"width-100p\">\n            <mat-label>{{texts.email}}</mat-label>\n            <input matInput maxlength=\"255\" type=\"email\" placeholder=\"{{texts.email}}\" [formControl]=\"groupProfile.controls.email\" required>\n            <mat-error *ngIf=\"groupProfile.controls.email.invalid\">{{texts.validatorEmailNoValid}}</mat-error>\n          </mat-form-field>\n        </div>\n\n        <div class=\"column padding-05p-left padding-3p-right width-50p font-size-11px\">\n          <mat-form-field appearance=\"outline\" class=\"width-100p\">\n            <mat-label>{{texts.phoneNumber}}</mat-label>\n            <input matInput type=\"text\" placeholder=\"{{texts.phoneNumber}}\" [formControl]=\"groupProfile.controls.phoneNumber\" required\n              minlength=\"9\" maxlength=\"9\">\n            <mat-error *ngIf=\"groupProfile.controls.phoneNumber.invalid\">{{texts.validatorPhoneNumberNoValid}}</mat-error>\n          </mat-form-field>\n        </div>\n       </div>\n\n        <div class=\"row padding-1p-bottom\">\n          <div class=\"column padding-05p-right padding-3p-left width-50p font-size-11px\">\n            <mat-form-field appearance=\"outline\" class=\"width-100p\">\n              <mat-label>{{texts.province}}</mat-label>\n              <mat-select [formControl]=\"groupProfile.controls.province\" (selectionChange)=\"loadPopulations()\">\n                <mat-option *ngFor=\"let province of provinces\" [value]=\"province.name.toUpperCase()\" >\n                  {{province.name.toUpperCase()}}\n                </mat-option>\n              </mat-select>\n              <mat-error *ngIf=\"groupProfile.controls.province.invalid\">{{texts.validatorProvinceNoValid}}</mat-error>\n            </mat-form-field>\n          </div>\n\n          <div class=\"column padding-05p-left padding-3p-right width-50p font-size-11px\">\n            <mat-form-field appearance=\"outline\" class=\"width-100p\">\n              <mat-label>{{texts.population}}</mat-label>\n              <mat-select [formControl]=\"groupProfile.controls.population\" [disabled]=\"isDisabledPopulation()\" >\n                <mat-option *ngFor=\"let population of populations\" [value]=\"population.NOMBRE.toUpperCase()\">\n                  {{population.NOMBRE.toUpperCase()}}\n                </mat-option>\n              </mat-select>\n              <mat-error *ngIf=\"groupProfile.controls.population.invalid\">{{texts.validatorPopulationNoValid}}</mat-error>\n            </mat-form-field>\n          </div>\n        </div>\n\n        <div class=\"row padding-1p-bottom\">\n          <div class=\"column padding-05p-right padding-3p-left width-50p font-size-11px\">\n            <mat-form-field appearance=\"outline\" class=\"width-100p\">\n              <mat-label>{{texts.address}}</mat-label>\n              <input matInput maxlength=\"255\" type=\"text\" placeholder=\"{{texts.address}}\" [formControl]=\"groupProfile.controls.address\"\n                required>\n              <mat-error *ngIf=\"groupProfile.controls.address.invalid\">{{texts.required}}</mat-error>\n            </mat-form-field>\n          </div>\n\n          <div class=\"column padding-05p-left padding-3p-right width-50p font-size-11px\">\n            <mat-form-field appearance=\"outline\" class=\"width-100p\">\n              <mat-label>{{texts.postalCode}}</mat-label>\n              <input matInput type=\"text\" placeholder=\"{{texts.postalCode}}\" [formControl]=\"groupProfile.controls.postalCode\" required\n                minlength=\"5\" maxlength=\"5\">\n              <mat-error *ngIf=\"groupProfile.controls.postalCode.invalid\">{{texts.validatorPostalCodeNoValid}}</mat-error>\n            </mat-form-field>\n          </div>\n        </div>\n\n        <div class=\"row padding-1p-bottom \">\n          <div class=\"column padding-05p-right padding-3p-left width-50p font-size-11px\" *ngIf=\"!isEditUser\">\n            <mat-form-field appearance=\"outline\" class=\"width-100p\">\n              <mat-label>{{texts.username}}</mat-label>\n              <input matInput maxlength=\"255\" type=\"text\" placeholder=\"{{texts.username}}\" [formControl]=\"groupPassword.controls.username\"\n                required [readonly]=\"isEditUser\">\n              <mat-error *ngIf=\"groupPassword.controls.username.invalid\">{{texts.required}}</mat-error>\n            </mat-form-field>\n          </div>\n        </div>\n\n        <div class=\"row padding-1p-bottom \" *ngIf=\"!isEditUser\">\n          <div class=\"column padding-05p-right padding-3p-left width-50p font-size-11px\">\n            <mat-form-field appearance=\"outline\" class=\"width-100p\">\n              <mat-label>{{texts.password}}</mat-label>\n              <input matInput maxlength=\"255\" type=\"password\" placeholder=\"{{texts.password}}\" [formControl]=\"groupPassword.controls.password\"\n                required>\n              <mat-error *ngIf=\"groupPassword.controls.password.invalid\">{{texts.required}}</mat-error>\n            </mat-form-field>\n          </div>\n\n          <div class=\"column padding-05p-left padding-3p-right width-50p font-size-11px\">\n            <mat-form-field appearance=\"outline\" class=\"width-100p\">\n              <mat-label>{{texts.confirmPassword}}</mat-label>\n              <input matInput maxlength=\"255\" type=\"password\" placeholder=\"{{texts.confirmPassword}}\"\n              [formControl]=\"groupPassword.controls.confirmPassword\" required>\n              <mat-error *ngIf=\"groupPassword.controls.confirmPassword.invalid\">{{texts.passwordNotEquals}}</mat-error>\n            </mat-form-field>\n          </div>\n        </div>\n\n        <div class=\"row padding-1p-bottom\">\n          <div class=\"padding-05p-right padding-3p-left width-80p font-size-11px\" (click)=\"registerAction()\"\n            *ngIf=\"!isEditUser\">\n            <button [disabled]=\"isDisabled()\" class=\"btn waves-effect waves-light\">{{texts.register}}\n              <i class=\"material-icons right\">send</i>\n            </button>\n          </div>\n\n          <div class=\"padding-05p-right padding-3p-left width-80p font-size-11px\" (click)=\"editAction()\"\n            *ngIf=\"isEditUser\">\n            <button [disabled]=\"isDisabled()\" class=\"btn waves-effect waves-light\">{{texts.save}}\n              <i class=\"material-icons right\">send</i>\n            </button>\n          </div>\n\n          <div class=\"padding-05p-left padding-3p-right width-80p font-size-11px\" (click)=\"cancel()\">\n            <button class=\"btn waves-effect waves-light\">{{texts.cancel}}\n              <i class=\"material-icons right\">cancel</i>\n            </button>\n          </div>\n        </div>\n\n    </mat-card-content>\n  </mat-card>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/edit-userAccount/edit-userAccount.component.html":
/*!********************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/edit-userAccount/edit-userAccount.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container register\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"tab-content\" id=\"myTabContent\">\n        <div class=\"tab-pane fade show active\" aria-labelledby=\"home-tab\">\n          <h3 class=\"register-heading\">{{texts.titleEdit}}</h3>\n          <div class=\"row register-form\">\n\n            <div class=\"col-md-6\">\n              <div class=\"form-group margin-4p-bottom\">\n                <label>{{texts.username}}</label>\n                <input type=\"text\" matInput maxlength=\"255\" class=\"form-control\" placeholder=\"{{texts.username}}\"\n                  [formControl]=\"groupPassword.controls.username\" required readonly />\n              </div>\n              <div class=\"form-group margin-4p-bottom\">\n                <label>{{texts.passwordNew}}</label>\n                <input type=\"password\" matInput maxlength=\"255\" class=\"form-control\" placeholder=\"{{texts.passwordNew}}\"\n                  [formControl]=\"groupPassword.controls.passwordNew\" required />\n                <small *ngIf=\"groupPassword.controls.passwordNew.invalid\" class=\"text-danger\">\n                  {{texts.passwordNew}}\n                </small>\n              </div>\n            </div>\n\n            <div class=\"col-md-6\">\n              <div class=\"form-group margin-4p-bottom\">\n                <label>{{texts.passwordOld}}</label>\n                <input type=\"password\" matInput maxlength=\"255\" class=\"form-control\" placeholder=\"{{texts.passwordOld}}\"\n                  [formControl]=\"groupPassword.controls.passwordOld\" required />\n                <small class=\"text-danger\" *ngIf=\"groupPassword.controls.passwordOld.invalid\">\n                  {{texts.passwordOldNoValid}}\n                </small>\n\n\n              </div>\n              <div class=\"form-group margin-4p-bottom\">\n                <label>{{texts.confirmPassword}}</label>\n                <input type=\"password\" matInput maxlength=\"255\" class=\"form-control\"\n                  placeholder=\"{{texts.confirmPassword}}\" [formControl]=\"groupPassword.controls.confirmPassword\"\n                  required />\n                <small class=\"text-danger\" *ngIf=\"groupPassword.controls.confirmPassword.invalid\">\n                  {{texts.confirmPassword}}\n                </small>\n\n              </div>\n            </div>\n            <div class=\"width-50p\">\n              <button (click)=\"editAction()\" [disabled]=\"isDisabled()\" class=\"btnForm\">{{texts.save}}</button>\n              <button (click)=\"cancel()\" class=\"btnForm\">{{texts.cancel}}</button>\n            </div>\n          </div>\n\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/footer/footer.component.html":
/*!************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/footer/footer.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = " <footer class=\"footer relative-bottom\">\n  <div>\n    <div >\n      <ul class=\"social-network social-circle\">\n        <li><a class=\"icoLinkedin\" href=\"https://www.linkedin.com/\" title=\"Linkedin\"><i class=\"ti-linkedin\"></i></a>\n        </li>\n        <li><a class=\"icoTwitter\" href=\"https://twitter.com/\" title=\"Twitter\"><i class=\"ti-twitter\"></i></a></li>\n        <li><a class=\"icoMedium\" href=\"https://google.com/\" title=\"Google\"><i class=\"ti-google\"></i></a></li>\n        <li><a class=\"icoFacebook\" href=\"https://www.facebook.com/\" title=\"Facebook\"><i class=\"ti-facebook\"></i></a>\n        </li>\n        <li><a class=\"icoInstagram\" href=\"https://www.instagram.com/\" title=\"Instagram\"><i class=\"ti-instagram\"></i></a>\n        </li>\n      </ul>\n\n      <div class=\"copy-right_text\">\n        <div class=\"container\">\n          <div class=\"footer_border\"></div>\n          <div class=\"row\">\n            <div class=\"col-xl-12\">\n              <p class=\"copy_right text-center\">\n                {{texts.copyright}}\n              </p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</footer>\n\n\n\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/header/header.component.html":
/*!************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/header/header.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header class=\"bg-water\">\n  <nav class=\"navbar navbar-expand-lg navbar-dark relative-top\">\n    <div>\n      <a class=\"navbar-brand\" [routerLink]=\"['/']\">FAN</a>\n    </div>\n    <div>\n      <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\"\n        aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n        <span class=\"navbar-toggler-icon\"></span>\n      </button>\n\n      <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">\n        <ul class=\"navbar-nav m-auto\">\n          <li class=\"nav-item\">\n            <a class=\"nav-link\" [routerLink]=\"['/']\">{{texts.linkStart}}</a>\n          </li>\n          <li class=\"nav-item\">\n            <a class=\"nav-link\" *ngIf=\"!getIsLogged()\" [routerLink]=\"['/login']\">{{texts.linkLogin}}</a>\n          </li>\n          <li class=\"nav-item\">\n            <a class=\"nav-link\" *ngIf=\"getIsLogged()\" (click)=\"onLogOut()\">{{texts.linkLogout}}</a>\n          </li>\n\n          <li *ngIf=\"getIsLogged()\" class=\"nav-item dropdown\">\n            <a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbarDropdown\" role=\"button\" data-toggle=\"dropdown\"\n              aria-haspopup=\"true\" aria-expanded=\"false\">\n              {{texts.username}}\n            </a>\n            <div class=\"dropdown-menu bg-water border-0p color-fondo-blanco\" aria-labelledby=\"navbarDropdown\">\n              <a class=\"dropdown-item bg-water-trans\" (click)=\"redirectEditProfile()\">{{texts.myProfile}}</a>\n              <a class=\"dropdown-item bg-water-trans\" (click)=\"redirectEditPassword()\">{{texts.editPassword}}</a>\n            </div>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n</header>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/list-competition/list-competition.component.html":
/*!********************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/list-competition/list-competition.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container max-width-95p\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"card-body d-flex justify-content-between align-items-center\">\n        <h1>{{texts.competitions}}</h1>\n        <button class=\"btn btn-primary btn-sm\">{{texts.newCompetition}}</button>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-lg-4 col-sm-6 mb-4\" *ngFor=\"let item of competitions\">\n      <div class=\"card h-100\">\n        <a><img class=\"card-img-top\" src=\"../../assets/img/imagenWelcome_1.jpg\" alt=\"\"></a>\n        <div class=\"card-body\">\n          <h4 class=\"card-title\">\n            <a [routerLink]=\"['/view-competition']\" [queryParams]=\"{id: item.id}\">{{item.name}}+44</a>\n          </h4>\n          <p class=\"card-text\">{{item.description}} <br>{{texts.moment}}: {{item.moment}}\n            <br> {{texts.hour}}: {{item.hour}} <br>{{texts.score}}: {{item.score}}</p>\n        </div>\n      </div>\n    </div>\n\n    <td-paging-bar #pagingBar *ngIf=\"competitions.length != 0\" [pageSize]=\"pagination.size\" [total]=\"competitionsTotal\"\n      (change)=\"page($event)\">\n      <span hide-xs>{{texts.competitionPerPage}}</span>\n      <mat-select [style.width.px]=\"50\" [(ngModel)]=\"pagination.size\" name=\"size\">\n        <mat-option *ngFor=\"let dimensions of [6 , 12, 30, 60, 100]\" [value]=\"dimensions\">\n          {{dimensions}}\n        </mat-option>\n      </mat-select>\n      <span hide-xs>{{pagingBar.range}} {{texts.of}} {{pagingBar.total}}</span>\n    </td-paging-bar>\n  </div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/list-pool/list-pool.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/list-pool/list-pool.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container max-width-95p\">\n  <h1 class=\"my-4\">{{texts.pools}}</h1>\n  <div class=\"row\">\n    <div class=\"col-lg-4 col-sm-6 mb-4\" *ngFor=\"let item of pools\">\n      <div class=\"card h-100\">\n        <a><img class=\"card-img-top\" src=\"../../assets/img/imagenWelcome_1.jpg\" alt=\"\"></a>\n        <div class=\"card-body\">\n          <h4 class=\"card-title\">\n            <a [routerLink]=\"['/view-pool']\" [queryParams]=\"{id: item.id}\">{{item.code}}</a>\n          </h4>\n          <p class=\"card-text\">{{texts.code}}: {{item.code}}\n            <br> {{texts.isForCompetition}}: {{item.isForCompetition}}\n            <br>{{texts.isForTraining}}: {{item.isForTraining}}\n            <br> {{texts.numOfStreet}}: {{item.numOfStreet}}\n          </p>\n      </div>\n    </div>\n  </div>\n\n  <td-paging-bar #pagingBar *ngIf=\"pools.length != 0\" [pageSize]=\"pagination.size\" [total]=\"poolsTotal\"\n    (change)=\"page($event)\">\n    <span hide-xs>{{texts.poolPerPage}}</span>\n    <mat-select [style.width.px]=\"50\" [(ngModel)]=\"pagination.size\" name=\"size\">\n      <mat-option *ngFor=\"let dimensions of [6 , 12, 30, 60, 100]\" [value]=\"dimensions\">\n        {{dimensions}}\n      </mat-option>\n    </mat-select>\n    <span hide-xs>{{pagingBar.range}} {{texts.of}} {{pagingBar.total}}</span>\n  </td-paging-bar>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/login/login.component.html":
/*!**********************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/login/login.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"text-center\" *ngIf=\"isLogged\">\n  <h2>{{texts.sessionAlreadyExists}}</h2>\n</div>\n<div class=\"container d-flex justify-content-center margin-3p-top padding-15p-bottom\" *ngIf=\"!isLogged\">\n  <div class=\"card\">\n    <div class=\"card-body\">\n      <form #f=\"ngForm\" (ngSubmit)=\"onLogin()\" novalidate>\n        <div class=\"form-group\">\n          <label for=\"nombreUsuario\">{{texts.username}}</label>\n          <input type=\"text\" name=\"nombreUsuario\" id=\"nombreUsuario\" class=\"form-control\" [(ngModel)]=\"nombreUsuario\"\n            required>\n        </div>\n        <div class=\"form-group\">\n          <label for=\"password\">{{texts.password}}</label>\n          <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" [(ngModel)]=\"password\" required>\n        </div>\n        <div class=\"form-group\">\n          <button class=\"btn btn-outline-success btn-block\" [disabled]=\"!f.valid\">\n            <i class=\"fas fa-sign-in-alt\"></i> {{texts.session}}</button>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/view-competition/view-competition.component.html":
/*!********************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/view-competition/view-competition.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<div class=\"container max-width-95p\">\n  <h1 class=\"my-4\">{{texts.posterCompetition}}</h1>\n    <div class=\"col-lg-12\">\n      <div class=\"card h-100\">\n        <a><img class=\"card-img-top\" src=\"../../assets/img/imagenWelcome_1.jpg\" alt=\"\"></a>\n        <div class=\"card-body\">\n          <p class=\"card-text\">{{description}} <br>{{texts.moment}}: {{moment}}\n              <br> {{texts.hour}}: {{hour}} <br>{{texts.score}}: {{score}}</p>\n          <h4 class=\"card-title\">\n            <a [routerLink]=\"['/view-pavilion']\" [queryParams]=\"{id: pavilion.id}\">\n              {{texts.placOfCelebration}}: {{pavilion.name}}</a>\n          </h4>\n        </div>\n      </div>\n    </div>\n</div>\n\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/view-pavilion/view-pavilion.component.html":
/*!**************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/view-pavilion/view-pavilion.component.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container max-width-95p\">\n  <h1 class=\"my-4\">{{texts.pavilion}}</h1>\n    <div class=\"col-lg-12\">\n      <div class=\"card h-100\">\n        <a><img class=\"card-img-top\" src=\"../../assets/img/imagenWelcome_1.jpg\" alt=\"\"></a>\n        <div class=\"card-body\">\n          <p class=\"card-text\">{{texts.code}}: {{code}}\n              <br> {{texts.name}}: {{name}}\n              <br>{{texts.address}}: {{address}}\n              <br> {{texts.capacity}}: {{capacity}}\n            </p>\n          <h4 class=\"card-title\">\n            <a [routerLink]=\"['/list-pool']\" [queryParams]=\"{idPavilion: id}\">\n              {{texts.viewPools}}</a>\n          </h4>\n        </div>\n      </div>\n    </div>\n</div>\n\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/view-pool/view-pool.component.html":
/*!******************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/view-pool/view-pool.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container max-width-95p\">\n  <h1 class=\"my-4\">{{texts.pool}}</h1>\n    <div class=\"col-lg-12\">\n      <div class=\"card h-100\">\n        <a><img class=\"card-img-top\" src=\"../../assets/img/imagenWelcome_1.jpg\" alt=\"\"></a>\n        <div class=\"card-body\">\n          <p class=\"card-text\">{{texts.code}}: {{code}}\n              <br> {{texts.isForCompetition}}: {{isForCompetition}}\n              <br>{{texts.isForTraining}}: {{isForTraining}}\n              <br> {{texts.numOfStreet}}: {{numOfStreet}}\n            </p>\n          <h4 class=\"card-title\">\n            <a [routerLink]=\"['/view-pavilion']\" [queryParams]=\"{id: pavilion.id}\">\n              {{pavilion.name}}</a>\n          </h4>\n        </div>\n      </div>\n    </div>\n</div>\n\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/welcome/welcome.component.html":
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/welcome/welcome.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = " <div id=\"carousel-example-2\" class=\"carousel slide carousel-fade\" data-ride=\"carousel\">\n  <ol class=\"carousel-indicators\">\n    <li data-target=\"#carousel-example-2\" data-slide-to=\"0\" class=\"active\"></li>\n    <li data-target=\"#carousel-example-2\" data-slide-to=\"1\"></li>\n    <li data-target=\"#carousel-example-2\" data-slide-to=\"2\"></li>\n  </ol>\n\n  <div class=\"carousel-inner img-fluid\" role=\"listbox\">\n    <div class=\"carousel-item active\">\n      <div class=\"view imageCarousel\">\n        <img class=\"d-block w-100 img-carrusel\" src=\"../../assets/img/imagenWelcome_1.jpg\" alt=\"First slide\">\n        <div class=\"mask rgba-black-light\"></div>\n      </div>\n      <div class=\"carousel-caption bottom-40p text-left\">\n        <h3 class=\"h3-responsive\">{{texts.titleFan}}</h3>\n        <a href=\"#\" class=\"boxed-btn3\">{{texts.linkImagen1}}</a>\n      </div>\n    </div>\n    <div class=\"carousel-item\">\n      <div class=\"view imageCarousel\">\n        <img class=\"d-block w-100 img-carrusel\" src=\"../../assets/img/imagenWelcome_2.jpg\" alt=\"Second slide\">\n        <div class=\"mask rgba-black-strong\"></div>\n      </div>\n      <div class=\"carousel-caption bottom-40p text-left\">\n        <h3 class=\"h3-responsive\">{{texts.titleFan}}</h3>\n        <a [routerLink]=\"['/list-competition']\" class=\"boxed-btn3\">{{texts.linkImagen2}}</a>\n      </div>\n    </div>\n    <div class=\"carousel-item\">\n      <div class=\"view imageCarousel\">\n        <img class=\"d-block w-100 img-carrusel\" src=\"../../assets/img/imagenWelcome_3.jpg\" alt=\"Third slide\">\n        <div class=\"mask rgba-black-slight\"></div>\n      </div>\n      <div class=\"carousel-caption bottom-40p text-left\">\n        <h3 class=\"h3-responsive\">{{texts.titleFan}}</h3>\n        <a href=\"#\" class=\"boxed-btn3\">{{texts.linkImagen3}}</a>\n      </div>\n    </div>\n  </div>\n  <a class=\"carousel-control-prev\" href=\"#carousel-example-2\" role=\"button\" data-slide=\"prev\">\n    <span class=\"carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only\">Previous</span>\n  </a>\n  <a class=\"carousel-control-next\" href=\"#carousel-example-2\" role=\"button\" data-slide=\"next\">\n    <span class=\"carousel-control-next-icon\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only\">Next</span>\n  </a>\n</div>\n"

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routes.ts":
/*!*******************************!*\
  !*** ./src/app/app-routes.ts ***!
  \*******************************/
/*! exports provided: appRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appRoutes", function() { return appRoutes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _welcome_welcome_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./welcome/welcome.component */ "./src/app/welcome/welcome.component.ts");
/* harmony import */ var _edit_assistant_edit_assistant_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./edit-assistant/edit-assistant.component */ "./src/app/edit-assistant/edit-assistant.component.ts");
/* harmony import */ var _guards_guard_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./guards/guard.service */ "./src/app/guards/guard.service.ts");
/* harmony import */ var _edit_userAccount_edit_userAccount_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./edit-userAccount/edit-userAccount.component */ "./src/app/edit-userAccount/edit-userAccount.component.ts");
/* harmony import */ var _list_competition_list_competition_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./list-competition/list-competition.component */ "./src/app/list-competition/list-competition.component.ts");
/* harmony import */ var _view_competition_view_competition_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./view-competition/view-competition.component */ "./src/app/view-competition/view-competition.component.ts");
/* harmony import */ var _view_pavilion_view_pavilion_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./view-pavilion/view-pavilion.component */ "./src/app/view-pavilion/view-pavilion.component.ts");
/* harmony import */ var _list_pool_list_pool_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./list-pool/list-pool.component */ "./src/app/list-pool/list-pool.component.ts");
/* harmony import */ var _view_pool_view_pool_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./view-pool/view-pool.component */ "./src/app/view-pool/view-pool.component.ts");













var ROLE_ADMIN = 'ADMIN';
var ROLE_ASSISTANT = 'ASSISTANT';
var ROLE_FEDERATION = 'FEDERATION';
var ROLE_SWIMMER = 'SWIMMER';
var ROLE_JUDGE = 'JUDGE';
var routes = [
    {
        path: '',
        component: _welcome_welcome_component__WEBPACK_IMPORTED_MODULE_4__["WelcomeComponent"],
    },
    {
        path: '',
        children: [
            {
                component: _login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"],
                path: 'login',
            },
            {
                component: _edit_assistant_edit_assistant_component__WEBPACK_IMPORTED_MODULE_5__["EditAssistant"],
                path: 'register-assistant',
            },
            {
                component: _edit_assistant_edit_assistant_component__WEBPACK_IMPORTED_MODULE_5__["EditAssistant"],
                path: 'edit-assistant',
                canActivate: [_guards_guard_service__WEBPACK_IMPORTED_MODULE_6__["GuardService"]], data: { expectedRol: [ROLE_ASSISTANT] }
            },
            {
                component: _edit_userAccount_edit_userAccount_component__WEBPACK_IMPORTED_MODULE_7__["EditUserAccount"],
                path: 'edit-userAccount',
                canActivate: [_guards_guard_service__WEBPACK_IMPORTED_MODULE_6__["GuardService"]], data: { expectedRol: [ROLE_ASSISTANT] }
            },
            {
                component: _list_competition_list_competition_component__WEBPACK_IMPORTED_MODULE_8__["ListCompetition"],
                path: 'list-competition',
            },
            {
                component: _view_competition_view_competition_component__WEBPACK_IMPORTED_MODULE_9__["ViewCompetition"],
                path: 'view-competition',
            },
            {
                component: _view_pavilion_view_pavilion_component__WEBPACK_IMPORTED_MODULE_10__["ViewPavilion"],
                path: 'view-pavilion',
            },
            {
                component: _list_pool_list_pool_component__WEBPACK_IMPORTED_MODULE_11__["ListPool"],
                path: 'list-pool',
            },
            {
                component: _view_pool_view_pool_component__WEBPACK_IMPORTED_MODULE_12__["ViewPool"],
                path: 'view-pool',
            },
        ]
    },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
var appRoutes = /** @class */ (function () {
    function appRoutes() {
    }
    appRoutes = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], appRoutes);
    return appRoutes;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/sidenav */ "./node_modules/@angular/material/esm5/sidenav.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");




var AppComponent = /** @class */ (function () {
    function AppComponent(sidenav, router) {
        this.sidenav = sidenav;
        this.router = router;
    }
    AppComponent.prototype.ngOnInit = function () { };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_material_sidenav__WEBPACK_IMPORTED_MODULE_2__["MatSidenavModule"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_routes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routes */ "./src/app/app-routes.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _edit_assistant_edit_assistant_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./edit-assistant/edit-assistant.component */ "./src/app/edit-assistant/edit-assistant.component.ts");
/* harmony import */ var _welcome_welcome_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./welcome/welcome.component */ "./src/app/welcome/welcome.component.ts");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./header/header.component */ "./src/app/header/header.component.ts");
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./footer/footer.component */ "./src/app/footer/footer.component.ts");
/* harmony import */ var _interceptors_prod_interceptor_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./interceptors/prod-interceptor.service */ "./src/app/interceptors/prod-interceptor.service.ts");
/* harmony import */ var _covalent_core_layout__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @covalent/core/layout */ "./node_modules/@covalent/core/fesm5/covalent-core-layout.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_material_slider__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/slider */ "./node_modules/@angular/material/esm5/slider.es5.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/esm5/tooltip.es5.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _covalent_core_common__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @covalent/core/common */ "./node_modules/@covalent/core/fesm5/covalent-core-common.js");
/* harmony import */ var _covalent_core_media__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @covalent/core/media */ "./node_modules/@covalent/core/fesm5/covalent-core-media.js");
/* harmony import */ var _covalent_core_loading__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @covalent/core/loading */ "./node_modules/@covalent/core/fesm5/covalent-core-loading.js");
/* harmony import */ var _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @covalent/core/data-table */ "./node_modules/@covalent/core/fesm5/covalent-core-data-table.js");
/* harmony import */ var _covalent_core_search__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @covalent/core/search */ "./node_modules/@covalent/core/fesm5/covalent-core-search.js");
/* harmony import */ var _covalent_core_file__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @covalent/core/file */ "./node_modules/@covalent/core/fesm5/covalent-core-file.js");
/* harmony import */ var _covalent_http__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @covalent/http */ "./node_modules/@covalent/http/fesm5/covalent-http.js");
/* harmony import */ var _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @covalent/core/dialogs */ "./node_modules/@covalent/core/fesm5/covalent-core-dialogs.js");
/* harmony import */ var _covalent_core_message__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @covalent/core/message */ "./node_modules/@covalent/core/fesm5/covalent-core-message.js");
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/menu */ "./node_modules/@angular/material/esm5/menu.es5.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var _edit_userAccount_edit_userAccount_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./edit-userAccount/edit-userAccount.component */ "./src/app/edit-userAccount/edit-userAccount.component.ts");
/* harmony import */ var _list_competition_list_competition_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./list-competition/list-competition.component */ "./src/app/list-competition/list-competition.component.ts");
/* harmony import */ var _covalent_core_paging__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @covalent/core/paging */ "./node_modules/@covalent/core/fesm5/covalent-core-paging.js");
/* harmony import */ var _view_competition_view_competition_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./view-competition/view-competition.component */ "./src/app/view-competition/view-competition.component.ts");
/* harmony import */ var _view_pavilion_view_pavilion_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./view-pavilion/view-pavilion.component */ "./src/app/view-pavilion/view-pavilion.component.ts");
/* harmony import */ var _list_pool_list_pool_component__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./list-pool/list-pool.component */ "./src/app/list-pool/list-pool.component.ts");
/* harmony import */ var _view_pool_view_pool_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./view-pool/view-pool.component */ "./src/app/view-pool/view-pool.component.ts");









































var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _welcome_welcome_component__WEBPACK_IMPORTED_MODULE_9__["WelcomeComponent"],
                _login_login_component__WEBPACK_IMPORTED_MODULE_7__["LoginComponent"],
                _header_header_component__WEBPACK_IMPORTED_MODULE_10__["HeaderComponent"],
                _footer_footer_component__WEBPACK_IMPORTED_MODULE_11__["FooterComponent"],
                _edit_assistant_edit_assistant_component__WEBPACK_IMPORTED_MODULE_8__["EditAssistant"],
                _edit_userAccount_edit_userAccount_component__WEBPACK_IMPORTED_MODULE_31__["EditUserAccount"],
                _list_competition_list_competition_component__WEBPACK_IMPORTED_MODULE_32__["ListCompetition"],
                _view_competition_view_competition_component__WEBPACK_IMPORTED_MODULE_34__["ViewCompetition"],
                _view_pavilion_view_pavilion_component__WEBPACK_IMPORTED_MODULE_35__["ViewPavilion"],
                _list_pool_list_pool_component__WEBPACK_IMPORTED_MODULE_36__["ListPool"],
                _view_pool_view_pool_component__WEBPACK_IMPORTED_MODULE_37__["ViewPool"],
            ],
            imports: [
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatSelectModule"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["BrowserAnimationsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClientModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatToolbarModule"],
                _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_16__["MatTooltipModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatExpansionModule"],
                _angular_material_menu__WEBPACK_IMPORTED_MODULE_27__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatFormFieldModule"],
                ngx_toastr__WEBPACK_IMPORTED_MODULE_28__["ToastrModule"].forRoot(),
                _covalent_core_common__WEBPACK_IMPORTED_MODULE_18__["CovalentCommonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatSidenavModule"],
                _covalent_core_layout__WEBPACK_IMPORTED_MODULE_13__["CovalentLayoutModule"],
                _covalent_core_media__WEBPACK_IMPORTED_MODULE_19__["CovalentMediaModule"],
                _covalent_core_loading__WEBPACK_IMPORTED_MODULE_20__["CovalentLoadingModule"],
                _covalent_core_file__WEBPACK_IMPORTED_MODULE_23__["CovalentFileModule"],
                _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_25__["CovalentDialogsModule"],
                _covalent_core_message__WEBPACK_IMPORTED_MODULE_26__["CovalentMessageModule"],
                _covalent_http__WEBPACK_IMPORTED_MODULE_24__["CovalentHttpModule"],
                _app_routes__WEBPACK_IMPORTED_MODULE_3__["appRoutes"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_5__["HttpClientModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatListModule"],
                _covalent_core_layout__WEBPACK_IMPORTED_MODULE_13__["CovalentLayoutModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["BrowserAnimationsModule"],
                _angular_material_slider__WEBPACK_IMPORTED_MODULE_15__["MatSliderModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatSidenavModule"],
                _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_16__["MatTooltipModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_17__["MatToolbarModule"],
                _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_21__["CovalentDataTableModule"],
                _covalent_core_search__WEBPACK_IMPORTED_MODULE_22__["CovalentSearchModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ReactiveFormsModule"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_29__["MatInputModule"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_30__["MatCardModule"],
                _covalent_core_paging__WEBPACK_IMPORTED_MODULE_33__["CovalentPagingModule"],
            ],
            providers: [_interceptors_prod_interceptor_service__WEBPACK_IMPORTED_MODULE_12__["interceptorProvider"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/edit-assistant/edit-assistant.component.ts":
/*!************************************************************!*\
  !*** ./src/app/edit-assistant/edit-assistant.component.ts ***!
  \************************************************************/
/*! exports provided: EditAssistant */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditAssistant", function() { return EditAssistant; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./texts */ "./src/app/edit-assistant/texts.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var _validators_actor_validators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../validators/actor.validators */ "./src/app/validators/actor.validators.ts");
/* harmony import */ var _models_assistant__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../models/assistant */ "./src/app/models/assistant.ts");
/* harmony import */ var _models_userAccount__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../models/userAccount */ "./src/app/models/userAccount.ts");
/* harmony import */ var _service_assistant_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../service/assistant.service */ "./src/app/service/assistant.service.ts");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm5/form-field.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _utilities_utilities__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../utilities/utilities */ "./src/app/utilities/utilities.ts");
/* harmony import */ var _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @covalent/core/dialogs */ "./node_modules/@covalent/core/fesm5/covalent-core-dialogs.js");
/* harmony import */ var _service_config_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../service/config.service */ "./src/app/service/config.service.ts");

















var EditAssistant = /** @class */ (function () {
    function EditAssistant(router, toastr, assistanService, utilities, activatedRoute, dialogService, configService) {
        this.router = router;
        this.toastr = toastr;
        this.assistanService = assistanService;
        this.utilities = utilities;
        this.activatedRoute = activatedRoute;
        this.dialogService = dialogService;
        this.configService = configService;
        this.groupProfile = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroup"]({
            name: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
            surnames: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
            province: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('', { validators: [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required] }),
            population: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('', { validators: [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required] }),
            postalCode: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('', { validators: [_validators_actor_validators__WEBPACK_IMPORTED_MODULE_8__["postalCodeValidator"]] }),
            email: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('', { validators: [_validators_actor_validators__WEBPACK_IMPORTED_MODULE_8__["emailValidator"]] }),
            address: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
            phoneNumber: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
            nif: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('', { validators: [_validators_actor_validators__WEBPACK_IMPORTED_MODULE_8__["nifValidator"]] }),
            dateOfBirth: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
        }, { validators: [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required] });
        this.groupPassword = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroup"]({
            username: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
            confirmPassword: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('')
        }, { validators: [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _validators_actor_validators__WEBPACK_IMPORTED_MODULE_8__["passwordValidator"]] });
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_4__["texts"];
    }
    EditAssistant.prototype.ngOnInit = function () {
        this.isEdit();
        this.setProvinces();
        if (this.isEditUser) {
            this.getUser();
        }
    };
    EditAssistant.prototype.isDisabled = function () {
        return this.formValid() ? false : true;
    };
    EditAssistant.prototype.isDisabledPopulation = function () {
        return this.groupProfile.controls.province.valid ? false : true;
    };
    EditAssistant.prototype.registerAction = function () {
        if (this.formValid()) {
            this.buildAssistant();
            this.register();
        }
    };
    EditAssistant.prototype.editAction = function () {
        if (this.formValid()) {
            this.buildAssistant();
            this.edit();
        }
    };
    EditAssistant.prototype.loadPopulations = function () {
        var _this = this;
        var province = this.provinces.find(function (element) { return element.name === _this.groupProfile.controls.province.value; });
        if (province !== undefined) {
            this.setPopulations(province.code);
        }
    };
    EditAssistant.prototype.cancel = function () {
        this.router.navigate(['']);
    };
    EditAssistant.prototype.getUser = function () {
        var _this = this;
        this.getUserFromService().then(function (assistant) {
            assistant !== null ? _this.setResult(assistant) : _this.showError(_texts__WEBPACK_IMPORTED_MODULE_4__["texts"].errorDataAssistant);
        });
    };
    EditAssistant.prototype.preview = function (files) {
        var _this = this;
        if (files[0].size > this.configService.getImgSizeMax()) {
            this.showError(_texts__WEBPACK_IMPORTED_MODULE_4__["texts"].errorImgSizeMax + this.utilities.formatBytes(this.configService.getImgSizeMax(), 1));
            return;
        }
        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.showError(_texts__WEBPACK_IMPORTED_MODULE_4__["texts"].errorOnlyImageSupported);
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = function (e) {
            _this.imageBase64 = reader.result.toString().split(',')[1];
        };
    };
    EditAssistant.prototype.setResult = function (assistant) {
        this.groupProfile.controls.name.setValue(assistant.name);
        this.groupProfile.controls.surnames.setValue(assistant.surnames);
        this.groupProfile.controls.address.setValue(assistant.address);
        this.groupProfile.controls.phoneNumber.setValue(assistant.phoneNumber);
        this.groupProfile.controls.nif.setValue(assistant.nif);
        this.groupProfile.controls.dateOfBirth.setValue(assistant.dateOfBirth);
        this.groupPassword.controls.username.setValue(assistant.userAccount.username);
        this.groupProfile.controls.postalCode.setValue(assistant.postalCode);
        this.groupProfile.controls.province.setValue(assistant.province);
        this.loadPopulations();
        this.groupProfile.controls.population.setValue(assistant.population);
        this.groupProfile.controls.email.setValue(assistant.email);
        this.imageBase64 = assistant.imageBase64;
    };
    EditAssistant.prototype.getUserFromService = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var error_1;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.assistanService.get().toPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EditAssistant.prototype.isEdit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            params['edit'] === "true" ? _this.isEditUser = true : _this.isEditUser = false;
        });
    };
    EditAssistant.prototype.setProvinces = function () {
        this.provinces = this.utilities.getProvinces();
    };
    EditAssistant.prototype.setPopulations = function (provinceCode) {
        var _this = this;
        this.utilities.getPopulationsFromAPI(provinceCode)
            .subscribe(function (data) {
            _this.populations = data['municipios'];
        }, function (error) {
            _this.errorMessage = _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].errorNoDataPopulationAPI;
            _this.showError(_this.errorMessage);
        });
    };
    EditAssistant.prototype.formValid = function () {
        return this.isEditUser ? this.formValidEditAssistant() : this.formValidRegister();
    };
    EditAssistant.prototype.formValidRegister = function () {
        if (this.groupProfile.valid && this.groupPassword.valid) {
            return true;
        }
        else {
            return false;
        }
    };
    EditAssistant.prototype.formValidEditAssistant = function () {
        if (this.groupProfile.valid) {
            return true;
        }
        else {
            return false;
        }
    };
    EditAssistant.prototype.buildAssistant = function () {
        this.userAccount = new _models_userAccount__WEBPACK_IMPORTED_MODULE_10__["UserAccount"](this.groupPassword.controls.username.value, this.groupPassword.controls.password.value, null);
        this.assistant = new _models_assistant__WEBPACK_IMPORTED_MODULE_9__["Assistant"](this.groupProfile.controls.name.value, this.groupProfile.controls.surnames.value, this.groupProfile.controls.email.value, this.groupProfile.controls.phoneNumber.value, this.groupProfile.controls.address.value, this.groupProfile.controls.dateOfBirth.value, this.groupProfile.controls.nif.value, this.groupProfile.controls.province.value, this.groupProfile.controls.population.value, this.groupProfile.controls.postalCode.value, this.userAccount, this.imageBase64);
    };
    EditAssistant.prototype.register = function () {
        var _this = this;
        this.dialogService.openConfirm({
            message: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].confirmMessageSave,
            title: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].titleRegedit,
            acceptButton: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].confirm,
            cancelButton: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].cancel
        }).afterClosed().subscribe(function (accept) {
            if (accept) {
                _this.assistanService.register(_this.assistant).subscribe(function (data) {
                    _this.showSuccess(_this.texts.userSuccessfullyCreated);
                    _this.router.navigate(['/login']);
                }, function (err) {
                    _this.errorMessage = err.error.message;
                    _this.showError(_this.errorMessage);
                });
            }
        });
    };
    EditAssistant.prototype.showError = function (message) {
        this.toastr.success(message, 'ERROR', {
            timeOut: 3000, positionClass: 'toast-top-right'
        });
    };
    EditAssistant.prototype.showSuccess = function (message) {
        this.toastr.success(message, 'SUCCESS', {
            timeOut: 3000, positionClass: 'toast-top-center'
        });
    };
    EditAssistant.prototype.edit = function () {
        var _this = this;
        this.dialogService.openConfirm({
            message: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].confirmMessageSave,
            title: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].titleEdit,
            acceptButton: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].confirm,
            cancelButton: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].cancel
        }).afterClosed().subscribe(function (accept) {
            if (accept) {
                _this.assistanService.edit(_this.assistant).subscribe(function (data) {
                    _this.showSuccess(_this.texts.userSuccessfullyEdited);
                    _this.router.navigate(['/edit-assistant']);
                }, function (err) {
                    _this.errorMessage = err.error.message;
                    _this.showError(_this.errorMessage);
                });
            }
        });
    };
    EditAssistant = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_6__["MatInput"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardTitle"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardContent"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardHeader"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_12__["MatFormField"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_13__["MatSelect"],
                _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_15__["TdDialogService"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroup"],
            ],
        }),
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-edit-assistant',
            template: __webpack_require__(/*! raw-loader!./edit-assistant.component.html */ "./node_modules/raw-loader/index.js!./src/app/edit-assistant/edit-assistant.component.html"),
            styles: [__webpack_require__(/*! ./edit-assitant.component.css */ "./src/app/edit-assistant/edit-assitant.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _service_assistant_service__WEBPACK_IMPORTED_MODULE_11__["AssistantService"],
            _utilities_utilities__WEBPACK_IMPORTED_MODULE_14__["Utilities"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_15__["TdDialogService"],
            _service_config_service__WEBPACK_IMPORTED_MODULE_16__["ConfigService"]])
    ], EditAssistant);
    return EditAssistant;
}());



/***/ }),

/***/ "./src/app/edit-assistant/edit-assitant.component.css":
/*!************************************************************!*\
  !*** ./src/app/edit-assistant/edit-assitant.component.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2VkaXQtYXNzaXN0YW50L2VkaXQtYXNzaXRhbnQuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/edit-assistant/texts.ts":
/*!*****************************************!*\
  !*** ./src/app/edit-assistant/texts.ts ***!
  \*****************************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    titleRegedit: 'Registro de Asistente',
    titleEdit: 'Editar perfil de asistente',
    name: 'Nombre',
    surnames: 'Apellidos',
    email: 'Email',
    address: 'Dirección',
    phoneNumber: 'Número de teléfono',
    nif: 'N.I.F',
    dateOfBirth: 'Fecha de nacimiento',
    username: 'Nombre de usuario',
    password: 'Contraseña (Mínimo 8 caracteres)',
    confirmPassword: 'Confirmar contraseña',
    province: 'Provincia',
    population: 'Población',
    postalCode: 'Código postal',
    register: 'Registrar',
    cancel: 'Cancelar',
    validatorNifNoValid: 'El nif no es válido',
    validatorPhoneNumberNoValid: 'El número de teléfono no es válido',
    validatorPostalCodeNoValid: 'El código postal no es válido',
    validatorEmailNoValid: 'El email no es válido',
    validatorProvinceNoValid: 'La provincia no es válida',
    validatorPopulationNoValid: 'La población no es válida',
    required: 'El campo es requerido',
    userSuccessfullyCreated: 'Usuario creado correctamente',
    save: 'Guardar',
    errorDataAssistant: 'Error al recuperar los datos',
    errorNoDataPopulationAPI: 'No se han podido facilitar los municipios de la provincia seleccioanda',
    confirmMessageSave: '¿Está seguro de que desea guardar los cambios?',
    confirm: 'Confirmar',
    userSuccessfullyEdited: 'Usuario editado correctamente',
    passwordNotEquals: 'Las contraseñas no son iguales',
    errorImgSizeMax: 'Se ha excedido el tamaño máximo permitido de ',
    errorOnlyImageSupported: 'Solo se permiten imágenes ',
};


/***/ }),

/***/ "./src/app/edit-userAccount/edit-userAccount.component.css":
/*!*****************************************************************!*\
  !*** ./src/app/edit-userAccount/edit-userAccount.component.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".register .register-form{\n  padding: 10%;\n  margin-top: 10%;\n}\n\n.btnForm{\n  margin-top: 10%;\n  border: none;\n  border-radius: 1.5rem;\n  padding: 2%;\n  background: #0062cc;\n  color: #fff;\n  font-weight: 600;\n  cursor: pointer;\n  padding-inline: 10%;\n  margin-inline: 0.5%;\n}\n\n.register-heading{\n  text-align: center;\n  margin-top: 8%;\n  margin-bottom: -15%;\n  margin-left: 3%;\n  color: #495057;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZWRpdC11c2VyQWNjb3VudC9lZGl0LXVzZXJBY2NvdW50LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxZQUFZO0VBQ1osZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGVBQWU7RUFDZixZQUFZO0VBQ1oscUJBQXFCO0VBQ3JCLFdBQVc7RUFDWCxtQkFBbUI7RUFDbkIsV0FBVztFQUNYLGdCQUFnQjtFQUNoQixlQUFlO0VBQ2YsbUJBQW1CO0VBQ25CLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixjQUFjO0VBQ2QsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZixjQUFjO0FBQ2hCIiwiZmlsZSI6InNyYy9hcHAvZWRpdC11c2VyQWNjb3VudC9lZGl0LXVzZXJBY2NvdW50LmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucmVnaXN0ZXIgLnJlZ2lzdGVyLWZvcm17XG4gIHBhZGRpbmc6IDEwJTtcbiAgbWFyZ2luLXRvcDogMTAlO1xufVxuXG4uYnRuRm9ybXtcbiAgbWFyZ2luLXRvcDogMTAlO1xuICBib3JkZXI6IG5vbmU7XG4gIGJvcmRlci1yYWRpdXM6IDEuNXJlbTtcbiAgcGFkZGluZzogMiU7XG4gIGJhY2tncm91bmQ6ICMwMDYyY2M7XG4gIGNvbG9yOiAjZmZmO1xuICBmb250LXdlaWdodDogNjAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHBhZGRpbmctaW5saW5lOiAxMCU7XG4gIG1hcmdpbi1pbmxpbmU6IDAuNSU7XG59XG5cbi5yZWdpc3Rlci1oZWFkaW5ne1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIG1hcmdpbi10b3A6IDglO1xuICBtYXJnaW4tYm90dG9tOiAtMTUlO1xuICBtYXJnaW4tbGVmdDogMyU7XG4gIGNvbG9yOiAjNDk1MDU3O1xufVxuIl19 */"

/***/ }),

/***/ "./src/app/edit-userAccount/edit-userAccount.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/edit-userAccount/edit-userAccount.component.ts ***!
  \****************************************************************/
/*! exports provided: EditUserAccount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditUserAccount", function() { return EditUserAccount; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./texts */ "./src/app/edit-userAccount/texts.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var _validators_actor_validators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../validators/actor.validators */ "./src/app/validators/actor.validators.ts");
/* harmony import */ var _models_userAccount__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../models/userAccount */ "./src/app/models/userAccount.ts");
/* harmony import */ var _service_userAccount_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../service/userAccount.service */ "./src/app/service/userAccount.service.ts");
/* harmony import */ var _service_token_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../service/token.service */ "./src/app/service/token.service.ts");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm5/form-field.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @covalent/core/dialogs */ "./node_modules/@covalent/core/fesm5/covalent-core-dialogs.js");















var EditUserAccount = /** @class */ (function () {
    function EditUserAccount(router, toastr, userAccountService, dialogService, tokenService) {
        this.router = router;
        this.toastr = toastr;
        this.userAccountService = userAccountService;
        this.dialogService = dialogService;
        this.tokenService = tokenService;
        this.groupPassword = new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroup"]({
            username: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
            passwordNew: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
            passwordOld: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](''),
            confirmPassword: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('')
        }, { validators: [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _validators_actor_validators__WEBPACK_IMPORTED_MODULE_8__["editPasswordValidator"]] });
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_4__["texts"];
    }
    EditUserAccount.prototype.ngOnInit = function () {
        this.getUsername();
    };
    EditUserAccount.prototype.isDisabled = function () {
        return this.formValid() ? false : true;
    };
    EditUserAccount.prototype.editAction = function () {
        if (this.formValid()) {
            this.buildUserAccount();
            this.edit();
        }
    };
    EditUserAccount.prototype.cancel = function () {
        this.router.navigate(['']);
    };
    EditUserAccount.prototype.getUsername = function () {
        this.groupPassword.controls.username.setValue(this.tokenService.getUserName());
    };
    EditUserAccount.prototype.formValid = function () {
        return this.formValidEditUserAccount();
    };
    EditUserAccount.prototype.formValidEditUserAccount = function () {
        if (this.groupPassword.valid) {
            return true;
        }
        else {
            return false;
        }
    };
    EditUserAccount.prototype.buildUserAccount = function () {
        this.userAccount = new _models_userAccount__WEBPACK_IMPORTED_MODULE_9__["UserAccount"](this.groupPassword.controls.username.value, this.groupPassword.controls.passwordNew.value, this.groupPassword.controls.passwordOld.value);
    };
    EditUserAccount.prototype.showError = function (message) {
        this.toastr.error(message, 'ERROR', {
            timeOut: 3000, positionClass: 'toast-top-right'
        });
    };
    EditUserAccount.prototype.showSuccess = function (message) {
        this.toastr.success(message, 'SUCCESS', {
            timeOut: 3000, positionClass: 'toast-top-center'
        });
    };
    EditUserAccount.prototype.edit = function () {
        var _this = this;
        this.dialogService.openConfirm({
            message: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].confirmMessageSave,
            title: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].titleEdit,
            acceptButton: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].confirm,
            cancelButton: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].cancel
        }).afterClosed().subscribe(function (accept) {
            if (accept) {
                _this.userAccountService.edit(_this.userAccount).subscribe(function (data) {
                    _this.showSuccess(_this.texts.userAccountSuccessfullyEdited);
                    _this.router.navigate(['/']);
                }, function (err) {
                    _this.errorMessage = err.error.message;
                    _this.showError(_this.errorMessage);
                });
            }
        });
    };
    EditUserAccount = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_6__["MatInput"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardTitle"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardContent"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardHeader"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_12__["MatFormField"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_13__["MatSelect"],
                _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_14__["TdDialogService"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormGroup"],
            ],
        }),
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-edit-userAccount',
            template: __webpack_require__(/*! raw-loader!./edit-userAccount.component.html */ "./node_modules/raw-loader/index.js!./src/app/edit-userAccount/edit-userAccount.component.html"),
            styles: [__webpack_require__(/*! ./edit-userAccount.component.css */ "./src/app/edit-userAccount/edit-userAccount.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _service_userAccount_service__WEBPACK_IMPORTED_MODULE_10__["UserAccountService"],
            _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_14__["TdDialogService"],
            _service_token_service__WEBPACK_IMPORTED_MODULE_11__["TokenService"]])
    ], EditUserAccount);
    return EditUserAccount;
}());



/***/ }),

/***/ "./src/app/edit-userAccount/texts.ts":
/*!*******************************************!*\
  !*** ./src/app/edit-userAccount/texts.ts ***!
  \*******************************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    titleEdit: 'Editar contraseña de asistente',
    username: 'Nombre de usuario',
    passwordOld: 'Antigua contraseña',
    passwordNew: 'Nueva contraseña (Mínimo 8 caracteres)',
    confirmPassword: 'Repita nueva contraseña',
    passwordOldNoValid: 'La antigua contraseña no es correcta',
    cancel: 'Cancelar',
    required: 'El campo es requerido',
    save: 'Guardar',
    confirmMessageSave: '¿Está seguro de que desea guardar los cambios?',
    confirm: 'Confirmar',
    userAccountSuccessfullyEdited: 'Contraseña editada correctamente',
    passwordNotEquals: 'Las contraseñas no son iguales',
    errorDataAssistant: 'Error al recuperar los datos',
};


/***/ }),

/***/ "./src/app/footer/footer.component.css":
/*!*********************************************!*\
  !*** ./src/app/footer/footer.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* footer social icons */\n.footer {\n  background-color: #FAFCFF;\n  padding: 1%;\n  text-align: center;\n  bottom: 0;\n  width: 100%;\n\n}\nul.social-network {\n  list-style: none;\n  display: inline;\n  margin: auto;\n}\nul.social-network li {\n  display: inline;\n  margin: 0 10px;\n}\n/* footer social icons */\n.social-network a.icoFacebook:hover {\n  background-color: #3B5998;\n}\n.social-network a.icoTwitter:hover {\n  background-color: #33ccff;\n}\n.social-network a.icoMedium:hover {\n  background-color: #00AB6C;\n}\n.social-network a.icoQuora:hover {\n  background-color: #AA2200;\n}\n.social-network a.icoLinkedin:hover {\n  background-color: #007bb7;\n}\n.social-network a.icoInstagram:hover {\n  background: #f09433;\n  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f09433', endColorstr='#bc1888', GradientType=1);\n}\n.social-network a.icoRss:hover i, .social-network a.icoFacebook:hover i, .social-network a.icoTwitter:hover i, .social-network a.icoMedium:hover i, .social-network a.icoVimeo:hover i, .social-network a.icoLinkedin:hover i {\n  color: #fff;\n}\n.social-circle li a {\n  display: inline-block;\n  position: relative;\n  margin: 0 auto 0 auto;\n  border-radius: 50%;\n  text-align: center;\n  width: 60px;\n  height: 60px;\n  font-size: 22px;\n}\n.social-circle li i {\n  margin: 0;\n  line-height: 60px;\n  text-align: center;\n}\n.social-circle li a:hover i, .triggeredHover {\n  -moz-transform: rotate(360deg);\n  -webkit-transform: rotate(360deg);\n  -ms--transform: rotate(360deg);\n  transform: rotate(360deg);\n  transition: all 0.2s;\n}\n.social-circle i {\n  color: #fff;\n  transition: all 0.8s;\n}\n.social-circle a {\n  background-color: #CCD8EA;\n}\n@media screen and (max-width: 500px) {\n  ul.social-network li {\n    display: inline;\n    margin: 0 5px;\n  }\n}\n@media screen and (max-width: 450px) {\n  ul.social-network li {\n    display: inline;\n    margin: 0 5px;\n  }\n\n  .social-circle li a {\n    display: inline-block;\n    position: relative;\n    margin: 0 auto 0 auto;\n    border-radius: 50%;\n    text-align: center;\n    width: 40px;\n    height: 40px;\n    font-size: 16px;\n  }\n\n  .social-circle li i {\n    margin: 0;\n    line-height: 40px;\n    text-align: center;\n  }\n}\n@media screen and (max-width: 350px) {\n  ul.social-network li {\n    display: inline;\n    margin: 0 2px;\n  }\n\n  .social-circle li a {\n    display: inline-block;\n    position: relative;\n    margin: 0 auto 0 auto;\n    border-radius: 50%;\n    text-align: center;\n    width: 40px;\n    height: 40px;\n    font-size: 16px;\n  }\n\n  .social-circle li i {\n    margin: 0;\n    line-height: 40px;\n    text-align: center;\n  }\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHdCQUF3QjtBQUN4QjtFQUNFLHlCQUF5QjtFQUN6QixXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLFNBQVM7RUFDVCxXQUFXOztBQUViO0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsZUFBZTtFQUNmLFlBQVk7QUFDZDtBQUNBO0VBQ0UsZUFBZTtFQUNmLGNBQWM7QUFDaEI7QUFFQSx3QkFBd0I7QUFDeEI7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHlCQUF5QjtBQUMzQjtBQUNBO0VBQ0UseUJBQXlCO0FBQzNCO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHlCQUF5QjtBQUMzQjtBQUNBO0VBQ0UsbUJBQW1CO0VBR25CLG1HQUFtRztFQUNuRyxtSEFBbUg7QUFDckg7QUFFQTtFQUNFLFdBQVc7QUFDYjtBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLGtCQUFrQjtFQUNsQixxQkFBcUI7RUFHckIsa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsWUFBWTtFQUNaLGVBQWU7QUFDakI7QUFFQTtFQUNFLFNBQVM7RUFDVCxpQkFBaUI7RUFDakIsa0JBQWtCO0FBQ3BCO0FBRUE7RUFDRSw4QkFBOEI7RUFDOUIsaUNBQWlDO0VBQ2pDLDhCQUE4QjtFQUM5Qix5QkFBeUI7RUFLekIsb0JBQW9CO0FBQ3RCO0FBRUE7RUFDRSxXQUFXO0VBS1gsb0JBQW9CO0FBQ3RCO0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7QUFFQTtFQUNFO0lBQ0UsZUFBZTtJQUNmLGFBQWE7RUFDZjtBQUNGO0FBQ0E7RUFDRTtJQUNFLGVBQWU7SUFDZixhQUFhO0VBQ2Y7O0VBRUE7SUFDRSxxQkFBcUI7SUFDckIsa0JBQWtCO0lBQ2xCLHFCQUFxQjtJQUdyQixrQkFBa0I7SUFDbEIsa0JBQWtCO0lBQ2xCLFdBQVc7SUFDWCxZQUFZO0lBQ1osZUFBZTtFQUNqQjs7RUFFQTtJQUNFLFNBQVM7SUFDVCxpQkFBaUI7SUFDakIsa0JBQWtCO0VBQ3BCO0FBQ0Y7QUFDQTtFQUNFO0lBQ0UsZUFBZTtJQUNmLGFBQWE7RUFDZjs7RUFFQTtJQUNFLHFCQUFxQjtJQUNyQixrQkFBa0I7SUFDbEIscUJBQXFCO0lBR3JCLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIsV0FBVztJQUNYLFlBQVk7SUFDWixlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsU0FBUztJQUNULGlCQUFpQjtJQUNqQixrQkFBa0I7RUFDcEI7QUFDRiIsImZpbGUiOiJzcmMvYXBwL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGZvb3RlciBzb2NpYWwgaWNvbnMgKi9cbi5mb290ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkFGQ0ZGO1xuICBwYWRkaW5nOiAxJTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBib3R0b206IDA7XG4gIHdpZHRoOiAxMDAlO1xuXG59XG5cbnVsLnNvY2lhbC1uZXR3b3JrIHtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbiAgZGlzcGxheTogaW5saW5lO1xuICBtYXJnaW46IGF1dG87XG59XG51bC5zb2NpYWwtbmV0d29yayBsaSB7XG4gIGRpc3BsYXk6IGlubGluZTtcbiAgbWFyZ2luOiAwIDEwcHg7XG59XG5cbi8qIGZvb3RlciBzb2NpYWwgaWNvbnMgKi9cbi5zb2NpYWwtbmV0d29yayBhLmljb0ZhY2Vib29rOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNCNTk5ODtcbn1cbi5zb2NpYWwtbmV0d29yayBhLmljb1R3aXR0ZXI6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzNjY2ZmO1xufVxuLnNvY2lhbC1uZXR3b3JrIGEuaWNvTWVkaXVtOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwQUI2Qztcbn1cbi5zb2NpYWwtbmV0d29yayBhLmljb1F1b3JhOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0FBMjIwMDtcbn1cbi5zb2NpYWwtbmV0d29yayBhLmljb0xpbmtlZGluOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwN2JiNztcbn1cbi5zb2NpYWwtbmV0d29yayBhLmljb0luc3RhZ3JhbTpob3ZlciB7XG4gIGJhY2tncm91bmQ6ICNmMDk0MzM7XG4gIGJhY2tncm91bmQ6IC1tb3otbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCAjZjA5NDMzIDAlLCAjZTY2ODNjIDI1JSwgI2RjMjc0MyA1MCUsICNjYzIzNjYgNzUlLCAjYmMxODg4IDEwMCUpO1xuICBiYWNrZ3JvdW5kOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCg0NWRlZywgI2YwOTQzMyAwJSwgI2U2NjgzYyAyNSUsICNkYzI3NDMgNTAlLCAjY2MyMzY2IDc1JSwgI2JjMTg4OCAxMDAlKTtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDQ1ZGVnLCAjZjA5NDMzIDAlLCAjZTY2ODNjIDI1JSwgI2RjMjc0MyA1MCUsICNjYzIzNjYgNzUlLCAjYmMxODg4IDEwMCUpO1xuICBmaWx0ZXI6IHByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5ncmFkaWVudCggc3RhcnRDb2xvcnN0cj0nI2YwOTQzMycsIGVuZENvbG9yc3RyPScjYmMxODg4JywgR3JhZGllbnRUeXBlPTEpO1xufVxuXG4uc29jaWFsLW5ldHdvcmsgYS5pY29Sc3M6aG92ZXIgaSwgLnNvY2lhbC1uZXR3b3JrIGEuaWNvRmFjZWJvb2s6aG92ZXIgaSwgLnNvY2lhbC1uZXR3b3JrIGEuaWNvVHdpdHRlcjpob3ZlciBpLCAuc29jaWFsLW5ldHdvcmsgYS5pY29NZWRpdW06aG92ZXIgaSwgLnNvY2lhbC1uZXR3b3JrIGEuaWNvVmltZW86aG92ZXIgaSwgLnNvY2lhbC1uZXR3b3JrIGEuaWNvTGlua2VkaW46aG92ZXIgaSB7XG4gIGNvbG9yOiAjZmZmO1xufVxuXG4uc29jaWFsLWNpcmNsZSBsaSBhIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1hcmdpbjogMCBhdXRvIDAgYXV0bztcbiAgLW1vei1ib3JkZXItcmFkaXVzOiA1MCU7XG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNTAlO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IDYwcHg7XG4gIGhlaWdodDogNjBweDtcbiAgZm9udC1zaXplOiAyMnB4O1xufVxuXG4uc29jaWFsLWNpcmNsZSBsaSBpIHtcbiAgbWFyZ2luOiAwO1xuICBsaW5lLWhlaWdodDogNjBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4uc29jaWFsLWNpcmNsZSBsaSBhOmhvdmVyIGksIC50cmlnZ2VyZWRIb3ZlciB7XG4gIC1tb3otdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICAtbXMtLXRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gIC13ZWJraXQtdHJhbnNpdGlvbjogYWxsIDAuMnM7XG4gIC1tb3otdHJhbnNpdGlvbjogYWxsIDAuMnM7XG4gIC1vLXRyYW5zaXRpb246IGFsbCAwLjJzO1xuICAtbXMtdHJhbnNpdGlvbjogYWxsIDAuMnM7XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzO1xufVxuXG4uc29jaWFsLWNpcmNsZSBpIHtcbiAgY29sb3I6ICNmZmY7XG4gIC13ZWJraXQtdHJhbnNpdGlvbjogYWxsIDAuOHM7XG4gIC1tb3otdHJhbnNpdGlvbjogYWxsIDAuOHM7XG4gIC1vLXRyYW5zaXRpb246IGFsbCAwLjhzO1xuICAtbXMtdHJhbnNpdGlvbjogYWxsIDAuOHM7XG4gIHRyYW5zaXRpb246IGFsbCAwLjhzO1xufVxuXG4uc29jaWFsLWNpcmNsZSBhIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI0NDRDhFQTtcbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgdWwuc29jaWFsLW5ldHdvcmsgbGkge1xuICAgIGRpc3BsYXk6IGlubGluZTtcbiAgICBtYXJnaW46IDAgNXB4O1xuICB9XG59XG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0NTBweCkge1xuICB1bC5zb2NpYWwtbmV0d29yayBsaSB7XG4gICAgZGlzcGxheTogaW5saW5lO1xuICAgIG1hcmdpbjogMCA1cHg7XG4gIH1cblxuICAuc29jaWFsLWNpcmNsZSBsaSBhIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIG1hcmdpbjogMCBhdXRvIDAgYXV0bztcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHdpZHRoOiA0MHB4O1xuICAgIGhlaWdodDogNDBweDtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gIH1cblxuICAuc29jaWFsLWNpcmNsZSBsaSBpIHtcbiAgICBtYXJnaW46IDA7XG4gICAgbGluZS1oZWlnaHQ6IDQwcHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB9XG59XG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAzNTBweCkge1xuICB1bC5zb2NpYWwtbmV0d29yayBsaSB7XG4gICAgZGlzcGxheTogaW5saW5lO1xuICAgIG1hcmdpbjogMCAycHg7XG4gIH1cblxuICAuc29jaWFsLWNpcmNsZSBsaSBhIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIG1hcmdpbjogMCBhdXRvIDAgYXV0bztcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHdpZHRoOiA0MHB4O1xuICAgIGhlaWdodDogNDBweDtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gIH1cblxuICAuc29jaWFsLWNpcmNsZSBsaSBpIHtcbiAgICBtYXJnaW46IDA7XG4gICAgbGluZS1oZWlnaHQ6IDQwcHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB9XG59XG4iXX0= */"

/***/ }),

/***/ "./src/app/footer/footer.component.ts":
/*!********************************************!*\
  !*** ./src/app/footer/footer.component.ts ***!
  \********************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./texts */ "./src/app/footer/texts.ts");




var FooterComponent = /** @class */ (function () {
    function FooterComponent(router) {
        this.router = router;
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_3__["texts"];
    }
    FooterComponent.prototype.ngOnInit = function () { };
    FooterComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-footer',
            template: __webpack_require__(/*! raw-loader!./footer.component.html */ "./node_modules/raw-loader/index.js!./src/app/footer/footer.component.html"),
            styles: [__webpack_require__(/*! ./footer.component.css */ "./src/app/footer/footer.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/footer/texts.ts":
/*!*********************************!*\
  !*** ./src/app/footer/texts.ts ***!
  \*********************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    copyright: '© 2020 Copyright Text',
    change: 'cambiar'
};


/***/ }),

/***/ "./src/app/guards/guard.service.ts":
/*!*****************************************!*\
  !*** ./src/app/guards/guard.service.ts ***!
  \*****************************************/
/*! exports provided: GuardService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuardService", function() { return GuardService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _service_token_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../service/token.service */ "./src/app/service/token.service.ts");




var GuardService = /** @class */ (function () {
    function GuardService(tokenService, router) {
        this.tokenService = tokenService;
        this.router = router;
    }
    GuardService.prototype.canActivate = function (route, state) {
        var _this = this;
        var expectedRol = route.data.expectedRol;
        var roles = this.tokenService.getAuthorities();
        var realRol = false;
        //TODO: aleromlop cambiar foreach para poner break
        roles.forEach(function (rol) {
            if (_this.roleFound(expectedRol, rol)) {
                realRol = true;
            }
        });
        if (!this.tokenService.getToken() || realRol === false) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    };
    GuardService.prototype.roleFound = function (expectedRol, rol) {
        return expectedRol.includes(rol);
    };
    GuardService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_service_token_service__WEBPACK_IMPORTED_MODULE_3__["TokenService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], GuardService);
    return GuardService;
}());



/***/ }),

/***/ "./src/app/header/header.component.css":
/*!*********************************************!*\
  !*** ./src/app/header/header.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2hlYWRlci9oZWFkZXIuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/header/header.component.ts":
/*!********************************************!*\
  !*** ./src/app/header/header.component.ts ***!
  \********************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _service_token_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../service/token.service */ "./src/app/service/token.service.ts");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./texts */ "./src/app/header/texts.ts");





var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(router, tokenService) {
        this.router = router;
        this.tokenService = tokenService;
        this.isLogged = false;
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_4__["texts"];
    }
    HeaderComponent.prototype.ngOnInit = function () {
        this.initIsLogged();
    };
    HeaderComponent.prototype.getIsLogged = function () {
        return this.tokenService.getToken() ? true : false;
    };
    HeaderComponent.prototype.redirectEditProfile = function () {
        this.router.navigate(['edit-assistant'], { queryParams: { edit: true }, skipLocationChange: true });
    };
    HeaderComponent.prototype.redirectEditPassword = function () {
        this.router.navigate(['edit-userAccount'], { skipLocationChange: true });
    };
    HeaderComponent.prototype.onLogOut = function () {
        this.tokenService.logOut();
        window.location.reload();
    };
    HeaderComponent.prototype.navigateTo = function (route) {
        this.router.navigate([route]);
    };
    HeaderComponent.prototype.initIsLogged = function () {
        if (this.tokenService.getToken()) {
            this.isLogged = true;
        }
        else {
            this.isLogged = false;
        }
    };
    HeaderComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-header',
            template: __webpack_require__(/*! raw-loader!./header.component.html */ "./node_modules/raw-loader/index.js!./src/app/header/header.component.html"),
            styles: [__webpack_require__(/*! ./header.component.css */ "./src/app/header/header.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _service_token_service__WEBPACK_IMPORTED_MODULE_3__["TokenService"]])
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/header/texts.ts":
/*!*********************************!*\
  !*** ./src/app/header/texts.ts ***!
  \*********************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    title: 'F.A.N',
    linkStart: 'Inicio',
    linkLogin: 'Login',
    linkLogout: 'Logout',
    username: 'Usuario',
    myProfile: 'Mi perfil',
    editPassword: 'Cambiar contraseña',
};


/***/ }),

/***/ "./src/app/interceptors/prod-interceptor.service.ts":
/*!**********************************************************!*\
  !*** ./src/app/interceptors/prod-interceptor.service.ts ***!
  \**********************************************************/
/*! exports provided: ProdInterceptorService, interceptorProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProdInterceptorService", function() { return ProdInterceptorService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interceptorProvider", function() { return interceptorProvider; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _service_token_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../service/token.service */ "./src/app/service/token.service.ts");




var ProdInterceptorService = /** @class */ (function () {
    function ProdInterceptorService(tokenService) {
        this.tokenService = tokenService;
    }
    ProdInterceptorService.prototype.intercept = function (req, next) {
        var intReq = req;
        var token = this.tokenService.getToken();
        if (token != null) {
            intReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
        }
        return next.handle(intReq);
    };
    ProdInterceptorService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_service_token_service__WEBPACK_IMPORTED_MODULE_3__["TokenService"]])
    ], ProdInterceptorService);
    return ProdInterceptorService;
}());

var interceptorProvider = [{ provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HTTP_INTERCEPTORS"], useClass: ProdInterceptorService, multi: true }];


/***/ }),

/***/ "./src/app/list-competition/list-competition.component.css":
/*!*****************************************************************!*\
  !*** ./src/app/list-competition/list-competition.component.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2xpc3QtY29tcGV0aXRpb24vbGlzdC1jb21wZXRpdGlvbi5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/list-competition/list-competition.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/list-competition/list-competition.component.ts ***!
  \****************************************************************/
/*! exports provided: ListCompetition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListCompetition", function() { return ListCompetition; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./texts */ "./src/app/list-competition/texts.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm5/form-field.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @covalent/core/dialogs */ "./node_modules/@covalent/core/fesm5/covalent-core-dialogs.js");
/* harmony import */ var _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @covalent/core/data-table */ "./node_modules/@covalent/core/fesm5/covalent-core-data-table.js");
/* harmony import */ var _service_competition_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../service/competition.service */ "./src/app/service/competition.service.ts");
/* harmony import */ var _covalent_core_paging__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @covalent/core/paging */ "./node_modules/@covalent/core/fesm5/covalent-core-paging.js");














var ListCompetition = /** @class */ (function () {
    function ListCompetition(router, toastr, competitionServie) {
        this.router = router;
        this.toastr = toastr;
        this.competitionServie = competitionServie;
        this.competitions = new Array();
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_4__["texts"];
        this.columns = [
            { name: 'id', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].id, width: { min: 5, max: 500 } },
            { name: 'moment', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].moment, width: { min: 5, max: 500 } },
            { name: 'hour', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].hour, width: { min: 5, max: 500 } },
            { name: 'score', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].score, width: { min: 5, max: 500 } },
            { name: 'description', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].description, width: { min: 5, max: 500 } },
        ];
    }
    ListCompetition.prototype.ngOnInit = function () {
        this.initPagination();
        this.setCompetitions();
    };
    ListCompetition.prototype.sortEvent = function (sortEvent) {
        if (this.competitions.length !== 0) {
            this.sortOrder = (this.sortOrder === _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableSortingOrder"].Ascending)
                ? _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableSortingOrder"].Descending : _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableSortingOrder"].Ascending;
            this.pagination.sortOrder = sortEvent.order;
            this.pagination.sortField = sortEvent.name;
            this.setCompetitions();
        }
    };
    ListCompetition.prototype.page = function (pagingEvent) {
        this.pagination.size = pagingEvent.pageSize;
        this.pagination.page = pagingEvent.page - 1;
        this.setCompetitions();
    };
    ListCompetition.prototype.setCompetitions = function () {
        var _this = this;
        this.competitionServie.competitions(this.pagination).subscribe(function (data) {
            _this.competitions = data.content;
            _this.competitionsTotal = data.totalElements;
            _this.pagination.page = data.number;
            _this.pagination.size = data.size;
        }, function (err) {
            console.log(err);
        });
    };
    ListCompetition.prototype.initPagination = function () {
        this.pagination = { size: 10, page: 0, sortField: 'moment', sortOrder: 'DESC', };
        this.competitionsTotal = 0;
    };
    ListCompetition = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_6__["MatInput"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardTitle"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardContent"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardHeader"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormField"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_9__["MatSelect"],
                _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_10__["TdDialogService"],
                _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableColumnComponent"],
                _covalent_core_paging__WEBPACK_IMPORTED_MODULE_13__["TdPagingBarComponent"],
            ],
        }),
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-list-competition',
            template: __webpack_require__(/*! raw-loader!./list-competition.component.html */ "./node_modules/raw-loader/index.js!./src/app/list-competition/list-competition.component.html"),
            styles: [__webpack_require__(/*! ./list-competition.component.css */ "./src/app/list-competition/list-competition.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _service_competition_service__WEBPACK_IMPORTED_MODULE_12__["CompetitionService"]])
    ], ListCompetition);
    return ListCompetition;
}());



/***/ }),

/***/ "./src/app/list-competition/texts.ts":
/*!*******************************************!*\
  !*** ./src/app/list-competition/texts.ts ***!
  \*******************************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    moment: 'Fecha',
    hour: 'Hora',
    score: 'Puntuación',
    noResultsFound: 'No se han encontrado resultados',
    competitions: 'Competiciones',
    id: 'ID',
    description: 'Descripción',
    competitionPerPage: 'Competiciones por página',
    of: 'de',
    newCompetition: 'Nueva competición',
};


/***/ }),

/***/ "./src/app/list-pool/list-pool.component.css":
/*!***************************************************!*\
  !*** ./src/app/list-pool/list-pool.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2xpc3QtcG9vbC9saXN0LXBvb2wuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/list-pool/list-pool.component.ts":
/*!**************************************************!*\
  !*** ./src/app/list-pool/list-pool.component.ts ***!
  \**************************************************/
/*! exports provided: ListPool */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListPool", function() { return ListPool; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./texts */ "./src/app/list-pool/texts.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm5/form-field.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @covalent/core/dialogs */ "./node_modules/@covalent/core/fesm5/covalent-core-dialogs.js");
/* harmony import */ var _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @covalent/core/data-table */ "./node_modules/@covalent/core/fesm5/covalent-core-data-table.js");
/* harmony import */ var _service_pool_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../service/pool.service */ "./src/app/service/pool.service.ts");
/* harmony import */ var _covalent_core_paging__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @covalent/core/paging */ "./node_modules/@covalent/core/fesm5/covalent-core-paging.js");














var ListPool = /** @class */ (function () {
    function ListPool(router, activatedRoute, toastr, poolServie) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.toastr = toastr;
        this.poolServie = poolServie;
        this.pools = new Array();
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_4__["texts"];
        this.columns = [
            { name: 'id', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].id, width: { min: 5, max: 500 } },
            { name: 'code', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].code, width: { min: 5, max: 500 } },
            { name: 'isForCompetition', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].isForCompetition, width: { min: 5, max: 500 } },
            { name: 'isForTraining', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].isForTraining, width: { min: 5, max: 500 } },
            { name: 'pavilion', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].pavilion, width: { min: 5, max: 500 } },
            { name: 'numOfStreet', label: _texts__WEBPACK_IMPORTED_MODULE_4__["texts"].numOfStreet, width: { min: 5, max: 500 } },
        ];
    }
    ListPool.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            _this.idPavilion = params['idPavilion'];
        });
        this.initPagination();
        this.setPools();
    };
    ListPool.prototype.sortEvent = function (sortEvent) {
        if (this.pools.length !== 0) {
            this.sortOrder = (this.sortOrder === _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableSortingOrder"].Ascending)
                ? _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableSortingOrder"].Descending : _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableSortingOrder"].Ascending;
            this.pagination.sortOrder = sortEvent.order;
            this.pagination.sortField = sortEvent.name;
            this.setPools();
        }
    };
    ListPool.prototype.page = function (pagingEvent) {
        this.pagination.size = pagingEvent.pageSize;
        this.pagination.page = pagingEvent.page - 1;
        this.setPools();
    };
    ListPool.prototype.setPools = function () {
        var _this = this;
        this.poolServie.pools(this.pagination, this.idPavilion).subscribe(function (data) {
            _this.pools = data.content;
            _this.poolsTotal = data.totalElements;
            _this.pagination.page = data.number;
            _this.pagination.size = data.size;
        }, function (err) {
            console.log(err);
        });
    };
    ListPool.prototype.initPagination = function () {
        this.pagination = { size: 10, page: 0, sortField: 'code', sortOrder: 'DESC', };
        this.poolsTotal = 0;
    };
    ListPool = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_6__["MatInput"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardTitle"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardContent"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardHeader"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormField"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_9__["MatSelect"],
                _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_10__["TdDialogService"],
                _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableColumnComponent"],
                _covalent_core_paging__WEBPACK_IMPORTED_MODULE_13__["TdPagingBarComponent"],
            ],
        }),
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-list-pool',
            template: __webpack_require__(/*! raw-loader!./list-pool.component.html */ "./node_modules/raw-loader/index.js!./src/app/list-pool/list-pool.component.html"),
            styles: [__webpack_require__(/*! ./list-pool.component.css */ "./src/app/list-pool/list-pool.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _service_pool_service__WEBPACK_IMPORTED_MODULE_12__["PoolService"]])
    ], ListPool);
    return ListPool;
}());



/***/ }),

/***/ "./src/app/list-pool/texts.ts":
/*!************************************!*\
  !*** ./src/app/list-pool/texts.ts ***!
  \************************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    code: 'Código',
    isForCompetition: 'Apta para competición',
    isForTraining: 'Apta para entrenamiento',
    id: 'ID',
    numOfStreet: 'Número de calles',
    pavilion: 'Pavellón',
    pools: 'Piscinas',
    poolPerPage: 'Piscinas por página',
    of: 'de',
};


/***/ }),

/***/ "./src/app/login/login.component.css":
/*!*******************************************!*\
  !*** ./src/app/login/login.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2xvZ2luL2xvZ2luLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/login/login.component.ts":
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _service_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../service/auth.service */ "./src/app/service/auth.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _models_login_usuario__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/login-usuario */ "./src/app/models/login-usuario.ts");
/* harmony import */ var _service_token_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../service/token.service */ "./src/app/service/token.service.ts");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./texts */ "./src/app/login/texts.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");










var LoginComponent = /** @class */ (function () {
    function LoginComponent(tokenService, authService, router, toastr) {
        this.tokenService = tokenService;
        this.authService = authService;
        this.router = router;
        this.toastr = toastr;
        this.isLogged = false;
        this.isLoginFail = false;
        this.roles = [];
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_7__["texts"];
    }
    LoginComponent.prototype.ngOnInit = function () {
        if (this.tokenService.getToken()) {
            this.isLogged = true;
            this.isLoginFail = false;
            this.roles = this.tokenService.getAuthorities();
        }
    };
    LoginComponent.prototype.onLogin = function () {
        var _this = this;
        this.loginUsuario = new _models_login_usuario__WEBPACK_IMPORTED_MODULE_4__["LoginUsuario"](this.nombreUsuario, this.password);
        this.authService.login(this.loginUsuario).subscribe(function (data) {
            _this.isLogged = true;
            _this.tokenService.setToken(data.token);
            _this.tokenService.setUserName(data.nombreUsuario);
            _this.tokenService.setAuthorities(data.authorities);
            _this.roles = data.authorities;
            _this.router.navigate(['/']);
            _this.toastr.success(_texts__WEBPACK_IMPORTED_MODULE_7__["texts"].welcome + data.nombreUsuario, 'SUCCESS', {
                timeOut: 3000, positionClass: 'toast-top-right'
            });
        }, function (err) {
            _this.isLogged = false;
            _this.errMsj = _texts__WEBPACK_IMPORTED_MODULE_7__["texts"].errorLogin;
            _this.toastr.error(_this.errMsj, 'ERROR', {
                timeOut: 3000, positionClass: 'toast-top-right',
            });
            console.log(err.error.message);
        });
    };
    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormControl"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_9__["MatInput"]
            ],
        }),
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! raw-loader!./login.component.html */ "./node_modules/raw-loader/index.js!./src/app/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/login/login.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_service_token_service__WEBPACK_IMPORTED_MODULE_5__["TokenService"],
            _service_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_6__["ToastrService"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/login/texts.ts":
/*!********************************!*\
  !*** ./src/app/login/texts.ts ***!
  \********************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    username: 'Nombre de usuario',
    password: 'Contraseña',
    session: 'Iniciar sesión',
    errorLogin: 'Usuario o contraseña inválidos',
    welcome: 'Bienvenido',
    sessionAlreadyExists: 'Ya has iniciado sesión',
};


/***/ }),

/***/ "./src/app/models/actor.ts":
/*!*********************************!*\
  !*** ./src/app/models/actor.ts ***!
  \*********************************/
/*! exports provided: Actor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Actor", function() { return Actor; });
var Actor = /** @class */ (function () {
    function Actor(name, surnames, email, phoneNumber, address, dateOfBirth, nif, province, population, postalCode, userAccount, imageBase64) {
        this.name = name;
        this.surnames = surnames;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.nif = nif;
        this.province = province;
        this.population = population;
        this.postalCode = postalCode;
        this.userAccount = userAccount;
        this.imageBase64 = imageBase64;
    }
    return Actor;
}());



/***/ }),

/***/ "./src/app/models/assistant.ts":
/*!*************************************!*\
  !*** ./src/app/models/assistant.ts ***!
  \*************************************/
/*! exports provided: Assistant */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Assistant", function() { return Assistant; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _actor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actor */ "./src/app/models/actor.ts");


var Assistant = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](Assistant, _super);
    function Assistant(name, surnames, email, phoneNumber, address, dateOfBirth, nif, province, population, postalCode, userAccount, imageBase64) {
        return _super.call(this, name, surnames, email, phoneNumber, address, dateOfBirth, nif, province, population, postalCode, userAccount, imageBase64) || this;
    }
    return Assistant;
}(_actor__WEBPACK_IMPORTED_MODULE_1__["Actor"]));



/***/ }),

/***/ "./src/app/models/login-usuario.ts":
/*!*****************************************!*\
  !*** ./src/app/models/login-usuario.ts ***!
  \*****************************************/
/*! exports provided: LoginUsuario */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginUsuario", function() { return LoginUsuario; });
var LoginUsuario = /** @class */ (function () {
    function LoginUsuario(nombreUsuario, password) {
        this.nombreUsuario = nombreUsuario;
        this.password = password;
    }
    return LoginUsuario;
}());



/***/ }),

/***/ "./src/app/models/userAccount.ts":
/*!***************************************!*\
  !*** ./src/app/models/userAccount.ts ***!
  \***************************************/
/*! exports provided: UserAccount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserAccount", function() { return UserAccount; });
var UserAccount = /** @class */ (function () {
    function UserAccount(username, password, passwordOld) {
        this.username = username;
        this.password = password;
        this.passwordOld = passwordOld;
    }
    return UserAccount;
}());



/***/ }),

/***/ "./src/app/service/assistant.service.ts":
/*!**********************************************!*\
  !*** ./src/app/service/assistant.service.ts ***!
  \**********************************************/
/*! exports provided: AssistantService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AssistantService", function() { return AssistantService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.service */ "./src/app/service/config.service.ts");




var AssistantService = /** @class */ (function () {
    function AssistantService(httpClient, configService) {
        this.httpClient = httpClient;
        this.configService = configService;
        this.baseURL = this.configService.getBasePath() + '/assistant/';
    }
    AssistantService.prototype.register = function (assistant) {
        return this.httpClient.post(this.baseURL + 'register', assistant);
    };
    AssistantService.prototype.get = function () {
        return this.httpClient.get(this.baseURL + 'assistant/get');
    };
    AssistantService.prototype.edit = function (assistant) {
        return this.httpClient.post(this.baseURL + 'assistant/edit', assistant);
    };
    AssistantService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _config_service__WEBPACK_IMPORTED_MODULE_3__["ConfigService"]])
    ], AssistantService);
    return AssistantService;
}());



/***/ }),

/***/ "./src/app/service/auth.service.ts":
/*!*****************************************!*\
  !*** ./src/app/service/auth.service.ts ***!
  \*****************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.service */ "./src/app/service/config.service.ts");




var AuthService = /** @class */ (function () {
    function AuthService(httpClient, configService) {
        this.httpClient = httpClient;
        this.configService = configService;
        this.authURL = this.configService.getBasePath() + '/auth/';
    }
    AuthService.prototype.login = function (loginUsuario) {
        return this.httpClient.post(this.authURL + 'login', loginUsuario);
    };
    AuthService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _config_service__WEBPACK_IMPORTED_MODULE_3__["ConfigService"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/service/competition.service.ts":
/*!************************************************!*\
  !*** ./src/app/service/competition.service.ts ***!
  \************************************************/
/*! exports provided: CompetitionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompetitionService", function() { return CompetitionService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.service */ "./src/app/service/config.service.ts");




var CompetitionService = /** @class */ (function () {
    function CompetitionService(httpClient, configService) {
        this.httpClient = httpClient;
        this.configService = configService;
        this.baseURL = this.configService.getBasePath() + '/competition/';
    }
    CompetitionService.prototype.competitions = function (pagination) {
        var parameters = 'page=' + pagination.page + '&size=' + pagination.size + '&sort=' +
            pagination.sortField + ',' + pagination.sortOrder.toLowerCase();
        return this.httpClient.get(this.baseURL + 'competitions?' + parameters);
    };
    CompetitionService.prototype.get = function (id) {
        return this.httpClient.get(this.baseURL + 'view?id=' + id);
    };
    CompetitionService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _config_service__WEBPACK_IMPORTED_MODULE_3__["ConfigService"]])
    ], CompetitionService);
    return CompetitionService;
}());



/***/ }),

/***/ "./src/app/service/config.service.ts":
/*!*******************************************!*\
  !*** ./src/app/service/config.service.ts ***!
  \*******************************************/
/*! exports provided: ConfigService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigService", function() { return ConfigService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var BASE_PATH = 'http://localhost:8080';
var IMG_SIZE_MAX_BYTE = 5242880;
var ConfigService = /** @class */ (function () {
    function ConfigService() {
    }
    ConfigService.prototype.getBasePath = function () {
        return BASE_PATH;
    };
    ConfigService.prototype.getImgSizeMax = function () {
        return IMG_SIZE_MAX_BYTE;
    };
    ConfigService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ConfigService);
    return ConfigService;
}());



/***/ }),

/***/ "./src/app/service/pavilion.service.ts":
/*!*********************************************!*\
  !*** ./src/app/service/pavilion.service.ts ***!
  \*********************************************/
/*! exports provided: PavilionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PavilionService", function() { return PavilionService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.service */ "./src/app/service/config.service.ts");




var PavilionService = /** @class */ (function () {
    function PavilionService(httpClient, configService) {
        this.httpClient = httpClient;
        this.configService = configService;
        this.baseURL = this.configService.getBasePath() + '/pavilion/';
    }
    /*   public pavilions(pagination: Pagination): Observable<IPaginationPage<Pavilion>> {
    
        const parameters = 'page=' + pagination.page + '&size=' + pagination.size + '&sort=' +
              pagination.sortField + ',' + pagination.sortOrder.toLowerCase();
    
    
        return this.httpClient.get<IPaginationPage<Pavilion>>(this.baseURL + 'pavilion?' + parameters);
      } */
    PavilionService.prototype.get = function (id) {
        return this.httpClient.get(this.baseURL + 'view?id=' + id);
    };
    PavilionService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _config_service__WEBPACK_IMPORTED_MODULE_3__["ConfigService"]])
    ], PavilionService);
    return PavilionService;
}());



/***/ }),

/***/ "./src/app/service/pool.service.ts":
/*!*****************************************!*\
  !*** ./src/app/service/pool.service.ts ***!
  \*****************************************/
/*! exports provided: PoolService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PoolService", function() { return PoolService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.service */ "./src/app/service/config.service.ts");




var PoolService = /** @class */ (function () {
    function PoolService(httpClient, configService) {
        this.httpClient = httpClient;
        this.configService = configService;
        this.baseURL = this.configService.getBasePath() + '/pool/';
    }
    PoolService.prototype.pools = function (pagination, idPavilion) {
        var parameters = 'idPavilion=' + idPavilion + '&page=' + pagination.page + '&size=' + pagination.size + '&sort=' +
            pagination.sortField + ',' + pagination.sortOrder.toLowerCase();
        return this.httpClient.get(this.baseURL + 'pools?' + parameters);
    };
    PoolService.prototype.get = function (id) {
        return this.httpClient.get(this.baseURL + 'view?id=' + id);
    };
    PoolService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _config_service__WEBPACK_IMPORTED_MODULE_3__["ConfigService"]])
    ], PoolService);
    return PoolService;
}());



/***/ }),

/***/ "./src/app/service/token.service.ts":
/*!******************************************!*\
  !*** ./src/app/service/token.service.ts ***!
  \******************************************/
/*! exports provided: TokenService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TokenService", function() { return TokenService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var TOKEN_KEY = 'AuthToken';
var USERNAME_KEY = 'AuthUserName';
var AUTHORITIES_KEY = 'AuthAuthorities';
var TokenService = /** @class */ (function () {
    function TokenService() {
        this.roles = [];
    }
    TokenService.prototype.setToken = function (token) {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    };
    TokenService.prototype.getToken = function () {
        return sessionStorage.getItem(TOKEN_KEY);
    };
    TokenService.prototype.setUserName = function (userName) {
        window.sessionStorage.removeItem(USERNAME_KEY);
        window.sessionStorage.setItem(USERNAME_KEY, userName);
    };
    TokenService.prototype.getUserName = function () {
        return sessionStorage.getItem(USERNAME_KEY);
    };
    TokenService.prototype.setAuthorities = function (authorities) {
        window.sessionStorage.removeItem(AUTHORITIES_KEY);
        window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
    };
    TokenService.prototype.getAuthorities = function () {
        var _this = this;
        this.roles = [];
        if (sessionStorage.getItem(AUTHORITIES_KEY)) {
            JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(function (authority) {
                _this.roles.push(authority.authority);
            });
        }
        return this.roles;
    };
    TokenService.prototype.logOut = function () {
        window.sessionStorage.clear();
    };
    TokenService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], TokenService);
    return TokenService;
}());



/***/ }),

/***/ "./src/app/service/userAccount.service.ts":
/*!************************************************!*\
  !*** ./src/app/service/userAccount.service.ts ***!
  \************************************************/
/*! exports provided: UserAccountService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserAccountService", function() { return UserAccountService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.service */ "./src/app/service/config.service.ts");




var UserAccountService = /** @class */ (function () {
    function UserAccountService(httpClient, configService) {
        this.httpClient = httpClient;
        this.configService = configService;
        this.baseURL = this.configService.getBasePath() + '/userAccount/';
    }
    UserAccountService.prototype.edit = function (userAccount) {
        return this.httpClient.post(this.baseURL + 'edit', userAccount);
    };
    UserAccountService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _config_service__WEBPACK_IMPORTED_MODULE_3__["ConfigService"]])
    ], UserAccountService);
    return UserAccountService;
}());



/***/ }),

/***/ "./src/app/utilities/utilities.ts":
/*!****************************************!*\
  !*** ./src/app/utilities/utilities.ts ***!
  \****************************************/
/*! exports provided: Utilities */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Utilities", function() { return Utilities; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var Utilities = /** @class */ (function () {
    function Utilities(httpClient) {
        this.httpClient = httpClient;
    }
    Utilities.prototype.getProvinces = function () {
        var populations = [
            { code: '01', name: 'ÁLAVA' },
            { code: '02', name: 'ALBACETE' },
            { code: '03', name: 'ALICANTE' },
            { code: '04', name: 'ALMERÍA' },
            { code: '33', name: 'ASTURIAS' },
            { code: '05', name: 'ÁVILA' },
            { code: '06', name: 'BADAJOZ' },
            { code: '08', name: 'BARCELONA' },
            { code: '09', name: 'BURGOS' },
            { code: '10', name: 'CÁCERES' },
            { code: '11', name: 'CÁDIZ' },
            { code: '39', name: 'CANTABRIA' },
            { code: '12', name: 'CASTELLÓN' },
            { code: '51', name: 'CEUTA' },
            { code: '13', name: 'CIUDAD REAL' },
            { code: '14', name: 'CÓRDOBA' },
            { code: '15', name: 'A CORUÑA' },
            { code: '16', name: 'CUENCA' },
            { code: '17', name: 'GIRONA' },
            { code: '18', name: 'GRANADA' },
            { code: '19', name: 'GUADALAJARA' },
            { code: '20', name: 'GUIPÚZCOA' },
            { code: '21', name: 'HUELVA' },
            { code: '22', name: 'HUESCA' },
            { code: '07', name: 'ILLES BALEARS' },
            { code: '23', name: 'JAÉN' },
            { code: '24', name: 'LEÓN' },
            { code: '25', name: 'LLEIDA' },
            { code: '27', name: 'LUGO' },
            { code: '28', name: 'MADRID' },
            { code: '29', name: 'MÁLAGA' },
            { code: '52', name: 'MELILLA' },
            { code: '30', name: 'MURCIA' },
            { code: '31', name: 'NAVARRA' },
            { code: '32', name: 'OURENSE' },
            { code: '34', name: 'PALENCIA' },
            { code: '35', name: 'LAS PALMAS' },
            { code: '36', name: 'PONTEVEDRA' },
            { code: '26', name: 'LA RIOJA' },
            { code: '37', name: 'SALAMANCA' },
            { code: '38', name: 'SANTA CRUZ DE TENERIFE' },
            { code: '40', name: 'SEGOVIA' },
            { code: '41', name: 'SEVILLA' },
            { code: '42', name: 'SORIA' },
            { code: '43', name: 'TARRAGONA' },
            { code: '44', name: 'TERUEL' },
            { code: '45', name: 'TOLEDO' },
            { code: '46', name: 'VALENCIA' },
            { code: '47', name: 'VALLADOLID' },
            { code: '48', name: 'VIZCAYA' },
            { code: '49', name: 'ZAMORA' },
            { code: '50', name: 'ZARAGOZA' }
        ];
        return populations;
    };
    Utilities.prototype.getPopulationsFromAPI = function (provinceCode) {
        var URLApiV2 = 'https://www.el-tiempo.net/api/json/v2/provincias/' + provinceCode + '/municipios';
        return this.httpClient.get(URLApiV2);
    };
    Utilities.prototype.formatBytes = function (bytes, decimals) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        var unitMultiple = 1024;
        var unitNames = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));
        return parseFloat((bytes / Math.pow(unitMultiple, unitChanges)).toFixed(decimals || 0)) + ' ' + unitNames[unitChanges];
    };
    Utilities = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], Utilities);
    return Utilities;
}());



/***/ }),

/***/ "./src/app/validators/actor.validators.ts":
/*!************************************************!*\
  !*** ./src/app/validators/actor.validators.ts ***!
  \************************************************/
/*! exports provided: nifValidator, isNif, postalCodeValidator, isPostalCode, phoneNumberValidator, isPhoneNumber, emailValidator, isEmail, editPasswordValidator, passwordValidator, areEquals */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nifValidator", function() { return nifValidator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNif", function() { return isNif; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "postalCodeValidator", function() { return postalCodeValidator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPostalCode", function() { return isPostalCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "phoneNumberValidator", function() { return phoneNumberValidator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPhoneNumber", function() { return isPhoneNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "emailValidator", function() { return emailValidator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEmail", function() { return isEmail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "editPasswordValidator", function() { return editPasswordValidator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "passwordValidator", function() { return passwordValidator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "areEquals", function() { return areEquals; });
function nifValidator(control) {
    if (control.value !== null && isNif(control.value.toUpperCase())) {
        return null;
    }
    else {
        return { 'nif': true };
    }
}
function isNif(nif) {
    if (nif.length !== 9) {
        return false;
    }
    var nifLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    try {
        var nifNumber = nif.substring(0, 8);
        if (isNaN(nifNumber) || (nif.charAt(8) !== nifLetters.charAt((nifNumber % 23)))) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (error) {
        console.error('Ha ocurrido un error al validar el NIF:' + nif);
        throw error;
    }
}
function postalCodeValidator(control) {
    if (control.value !== null && isPostalCode(control.value)) {
        return null;
    }
    else {
        return { 'postalCode': true };
    }
}
function isPostalCode(postalCode) {
    try {
        if (isNaN(postalCode) || String(postalCode).length !== 5) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (error) {
        console.error('Ha ocurrido un error al validar el código postal:' + postalCode);
        throw error;
    }
}
function phoneNumberValidator(control) {
    if (control.value !== null && isPhoneNumber(control.value)) {
        return null;
    }
    else {
        return null;
    }
}
function isPhoneNumber(phoneNumber) {
    try {
        if (isNaN(phoneNumber) || String(phoneNumber).length !== 9) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (error) {
        console.error('Ha ocurrido un error al validar el número de teléfono:' + phoneNumber);
        throw error;
    }
}
function emailValidator(control) {
    if (control.value !== null && isEmail(control.value)) {
        return null;
    }
    else {
        return { 'email': true };
    }
}
function isEmail(email) {
    try {
        if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/.test(email))) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (error) {
        console.error('Ha ocurrido un error al validar el email:' + email);
        throw error;
    }
}
function editPasswordValidator(group) {
    if (group.controls.passwordOld.value !== null && group.controls.passwordNew.value !== null
        && group.controls.confirmPassword.value !== null
        && areEquals(group.controls.passwordNew.value, group.controls.confirmPassword.value)) {
        return null;
    }
    else {
        return { 'confirmPassword': true };
    }
}
function passwordValidator(group) {
    if (group.controls.password.value !== null && group.controls.confirmPassword.value !== null
        && areEquals(group.controls.password.value, group.controls.confirmPassword.value)) {
        return null;
    }
    else {
        return { 'confirmPassword': true };
    }
}
function areEquals(password, confirmPassword) {
    try {
        if (password.length < 8 || confirmPassword.length < 8 || password !== confirmPassword) {
            return false;
        }
        else {
            return true;
        }
    }
    catch (error) {
        console.error('Ha ocurrido un error al validar las contraseñas:' + confirmPassword);
        throw error;
    }
}


/***/ }),

/***/ "./src/app/view-competition/texts.ts":
/*!*******************************************!*\
  !*** ./src/app/view-competition/texts.ts ***!
  \*******************************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    moment: 'Fecha',
    hour: 'Hora',
    score: 'Puntuación',
    description: 'Descripción',
    posterCompetition: 'Cartel de competición',
    errorDataCompetition: 'Error al recuperar la competición',
    placOfCelebration: 'Lugar de celebración',
};


/***/ }),

/***/ "./src/app/view-competition/view-competition.component.css":
/*!*****************************************************************!*\
  !*** ./src/app/view-competition/view-competition.component.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3ZpZXctY29tcGV0aXRpb24vdmlldy1jb21wZXRpdGlvbi5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/view-competition/view-competition.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/view-competition/view-competition.component.ts ***!
  \****************************************************************/
/*! exports provided: ViewCompetition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewCompetition", function() { return ViewCompetition; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./texts */ "./src/app/view-competition/texts.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm5/form-field.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @covalent/core/dialogs */ "./node_modules/@covalent/core/fesm5/covalent-core-dialogs.js");
/* harmony import */ var _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @covalent/core/data-table */ "./node_modules/@covalent/core/fesm5/covalent-core-data-table.js");
/* harmony import */ var _service_competition_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../service/competition.service */ "./src/app/service/competition.service.ts");
/* harmony import */ var _covalent_core_paging__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @covalent/core/paging */ "./node_modules/@covalent/core/fesm5/covalent-core-paging.js");














var ViewCompetition = /** @class */ (function () {
    function ViewCompetition(router, activatedRoute, toastr, competitionService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.toastr = toastr;
        this.competitionService = competitionService;
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_4__["texts"];
    }
    ViewCompetition.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            _this.id = params['id'];
        });
        this.getCompetition();
    };
    ViewCompetition.prototype.getCompetition = function () {
        var _this = this;
        this.getCompetitionFromService().then(function (competition) {
            competition !== null ? _this.setResult(competition) : _this.showError(_texts__WEBPACK_IMPORTED_MODULE_4__["texts"].errorDataCompetition);
        });
    };
    ViewCompetition.prototype.setResult = function (competition) {
        this.moment = competition.moment;
        this.hour = competition.hour;
        this.score = competition.score;
        this.description = competition.description;
        this.name = competition.name;
        this.pavilion = competition.pavilion;
    };
    ViewCompetition.prototype.getCompetitionFromService = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var error_1;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.competitionService.get(this.id).toPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ViewCompetition.prototype.showError = function (message) {
        this.toastr.success(message, 'ERROR', {
            timeOut: 3000, positionClass: 'toast-top-right'
        });
    };
    ViewCompetition = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_6__["MatInput"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardTitle"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardContent"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardHeader"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormField"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_9__["MatSelect"],
                _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_10__["TdDialogService"],
                _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableColumnComponent"],
                _covalent_core_paging__WEBPACK_IMPORTED_MODULE_13__["TdPagingBarComponent"],
            ],
        }),
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-view-competition',
            template: __webpack_require__(/*! raw-loader!./view-competition.component.html */ "./node_modules/raw-loader/index.js!./src/app/view-competition/view-competition.component.html"),
            styles: [__webpack_require__(/*! ./view-competition.component.css */ "./src/app/view-competition/view-competition.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _service_competition_service__WEBPACK_IMPORTED_MODULE_12__["CompetitionService"]])
    ], ViewCompetition);
    return ViewCompetition;
}());



/***/ }),

/***/ "./src/app/view-pavilion/texts.ts":
/*!****************************************!*\
  !*** ./src/app/view-pavilion/texts.ts ***!
  \****************************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    name: 'Nombre',
    capacity: 'Capacidad',
    code: 'Código',
    address: 'Dirección',
    errorDataPavilion: 'Error al recuperar el pabellón',
    pavilion: 'Pabellón',
    viewPools: 'Ver las piscinas del pabellón',
    placOfCelebration: 'Lugar de celebración',
};


/***/ }),

/***/ "./src/app/view-pavilion/view-pavilion.component.css":
/*!***********************************************************!*\
  !*** ./src/app/view-pavilion/view-pavilion.component.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3ZpZXctcGF2aWxpb24vdmlldy1wYXZpbGlvbi5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/view-pavilion/view-pavilion.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/view-pavilion/view-pavilion.component.ts ***!
  \**********************************************************/
/*! exports provided: ViewPavilion */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewPavilion", function() { return ViewPavilion; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./texts */ "./src/app/view-pavilion/texts.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm5/form-field.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @covalent/core/dialogs */ "./node_modules/@covalent/core/fesm5/covalent-core-dialogs.js");
/* harmony import */ var _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @covalent/core/data-table */ "./node_modules/@covalent/core/fesm5/covalent-core-data-table.js");
/* harmony import */ var _service_pavilion_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../service/pavilion.service */ "./src/app/service/pavilion.service.ts");
/* harmony import */ var _covalent_core_paging__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @covalent/core/paging */ "./node_modules/@covalent/core/fesm5/covalent-core-paging.js");














var ViewPavilion = /** @class */ (function () {
    function ViewPavilion(router, activatedRoute, toastr, pavilionService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.toastr = toastr;
        this.pavilionService = pavilionService;
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_4__["texts"];
    }
    ViewPavilion.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            _this.id = params['id'];
        });
        this.getPavilion();
    };
    ViewPavilion.prototype.getPavilion = function () {
        var _this = this;
        this.getPavilionFromService().then(function (pavilion) {
            pavilion !== null ? _this.setResult(pavilion) : _this.showError(_texts__WEBPACK_IMPORTED_MODULE_4__["texts"].errorDataPavilion);
        });
    };
    ViewPavilion.prototype.setResult = function (pavilion) {
        this.id = pavilion.id;
        this.code = pavilion.code;
        this.name = pavilion.name;
        this.address = pavilion.address;
        this.capacity = pavilion.capacity;
    };
    ViewPavilion.prototype.getPavilionFromService = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var error_1;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.pavilionService.get(this.id).toPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ViewPavilion.prototype.showError = function (message) {
        this.toastr.success(message, 'ERROR', {
            timeOut: 3000, positionClass: 'toast-top-right'
        });
    };
    ViewPavilion = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_6__["MatInput"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardTitle"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardContent"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardHeader"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormField"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_9__["MatSelect"],
                _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_10__["TdDialogService"],
                _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableColumnComponent"],
                _covalent_core_paging__WEBPACK_IMPORTED_MODULE_13__["TdPagingBarComponent"],
            ],
        }),
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-view-pavilion',
            template: __webpack_require__(/*! raw-loader!./view-pavilion.component.html */ "./node_modules/raw-loader/index.js!./src/app/view-pavilion/view-pavilion.component.html"),
            styles: [__webpack_require__(/*! ./view-pavilion.component.css */ "./src/app/view-pavilion/view-pavilion.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _service_pavilion_service__WEBPACK_IMPORTED_MODULE_12__["PavilionService"]])
    ], ViewPavilion);
    return ViewPavilion;
}());



/***/ }),

/***/ "./src/app/view-pool/texts.ts":
/*!************************************!*\
  !*** ./src/app/view-pool/texts.ts ***!
  \************************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    code: 'Código',
    isForCompetition: 'Apta para competición',
    isForTraining: 'Apta para entrenamiento',
    numOfStreet: 'Número de calles',
    pavilion: 'Pavellón',
    pool: 'Piscina',
    errorDataPool: 'Error al recuperar la piscina',
};


/***/ }),

/***/ "./src/app/view-pool/view-pool.component.css":
/*!***************************************************!*\
  !*** ./src/app/view-pool/view-pool.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3ZpZXctcG9vbC92aWV3LXBvb2wuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/view-pool/view-pool.component.ts":
/*!**************************************************!*\
  !*** ./src/app/view-pool/view-pool.component.ts ***!
  \**************************************************/
/*! exports provided: ViewPool */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewPool", function() { return ViewPool; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./texts */ "./src/app/view-pool/texts.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "./node_modules/@angular/material/esm5/card.es5.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm5/form-field.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @covalent/core/dialogs */ "./node_modules/@covalent/core/fesm5/covalent-core-dialogs.js");
/* harmony import */ var _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @covalent/core/data-table */ "./node_modules/@covalent/core/fesm5/covalent-core-data-table.js");
/* harmony import */ var _covalent_core_paging__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @covalent/core/paging */ "./node_modules/@covalent/core/fesm5/covalent-core-paging.js");
/* harmony import */ var _service_pool_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../service/pool.service */ "./src/app/service/pool.service.ts");














var ViewPool = /** @class */ (function () {
    function ViewPool(router, activatedRoute, toastr, poolService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.toastr = toastr;
        this.poolService = poolService;
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_4__["texts"];
    }
    ViewPool.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            _this.id = params['id'];
        });
        this.getPool();
    };
    ViewPool.prototype.getPool = function () {
        var _this = this;
        this.getPoolFromService().then(function (pool) {
            pool !== null ? _this.setResult(pool) : _this.showError(_texts__WEBPACK_IMPORTED_MODULE_4__["texts"].errorDataPool);
        });
    };
    ViewPool.prototype.setResult = function (pool) {
        this.id = pool.id;
        this.code = pool.code;
        this.isForCompetition = pool.isForCompetition ? "Si" : "No";
        this.isForTraining = pool.isForTraining ? "Si" : "No";
        this.numOfStreet = pool.numOfStreet;
        this.pavilion = pool.pavilion;
    };
    ViewPool.prototype.getPoolFromService = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var error_1;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.poolService.get(this.id).toPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ViewPool.prototype.showError = function (message) {
        this.toastr.success(message, 'ERROR', {
            timeOut: 3000, positionClass: 'toast-top-right'
        });
    };
    ViewPool = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_6__["MatInput"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardTitle"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardContent"],
                _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardHeader"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormField"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_9__["MatSelect"],
                _covalent_core_dialogs__WEBPACK_IMPORTED_MODULE_10__["TdDialogService"],
                _covalent_core_data_table__WEBPACK_IMPORTED_MODULE_11__["TdDataTableColumnComponent"],
                _covalent_core_paging__WEBPACK_IMPORTED_MODULE_12__["TdPagingBarComponent"],
            ],
        }),
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-view-pool',
            template: __webpack_require__(/*! raw-loader!./view-pool.component.html */ "./node_modules/raw-loader/index.js!./src/app/view-pool/view-pool.component.html"),
            styles: [__webpack_require__(/*! ./view-pool.component.css */ "./src/app/view-pool/view-pool.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            ngx_toastr__WEBPACK_IMPORTED_MODULE_3__["ToastrService"],
            _service_pool_service__WEBPACK_IMPORTED_MODULE_13__["PoolService"]])
    ], ViewPool);
    return ViewPool;
}());



/***/ }),

/***/ "./src/app/welcome/texts.ts":
/*!**********************************!*\
  !*** ./src/app/welcome/texts.ts ***!
  \**********************************/
/*! exports provided: texts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "texts", function() { return texts; });
var texts = {
    titleFan: 'Federación andaluza de natación',
    linkImagen1: 'Entradas',
    linkImagen2: 'Competiciones',
    linkImagen3: 'Estadios'
};


/***/ }),

/***/ "./src/app/welcome/welcome.component.css":
/*!***********************************************!*\
  !*** ./src/app/welcome/welcome.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".carousel-item {\n  height: auto;\n  background: no-repeat center center scroll;\n  background-size: cover;\n}\n\n/* line 29, ../../Arafath/CL/CL October/216. Consulting/HTML/scss/_btn.scss */\n\n.boxed-btn3 {\n  /* FF3.6-15 */\n  /* Chrome10-25,Safari5.1-6 */\n  background: linear-gradient(to bottom, #0181f5 0%, rgba(93, 178, 255, 0.99) 100%);\n  /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0181f5', endColorstr='#fc5db2ff',GradientType=0 );\n  /* IE6-9 */\n  color: #fff;\n  display: inline-block;\n  padding: 1% 5%;\n  font-family: \"Poppins\", sans-serif;\n  font-size: 15px;\n  font-weight: 500;\n  border: 0;\n  border-radius: 30px;\n  text-align: center;\n  color: #fff !important;\n  text-transform: capitalize;\n  transition: 0.3s;\n  cursor: pointer;\n}\n\n/* line 52, ../../Arafath/CL/CL October/216. Consulting/HTML/scss/_btn.scss */\n\n.boxed-btn3:hover {\n  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#0181f5+0,5db2ff+100&0.96+0,0.96+100 */\n  /* FF3.6-15 */\n  /* Chrome10-25,Safari5.1-6 */\n  background: linear-gradient(to left, rgba(1, 129, 245, 0.96) 0%, rgba(93, 178, 255, 0.96) 100%);\n  /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f50181f5', endColorstr='#f55db2ff',GradientType=0 );\n  /* IE6-9 */\n  color: #fff !important;\n}\n\n/* line 62, ../../Arafath/CL/CL October/216. Consulting/HTML/scss/_btn.scss */\n\n.boxed-btn3:focus {\n  outline: none;\n}\n\n/* line 65, ../../Arafath/CL/CL October/216. Consulting/HTML/scss/_btn.scss */\n\n.boxed-btn3.large-width {\n  width: 220px;\n}\n\n\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvd2VsY29tZS93ZWxjb21lLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxZQUFZO0VBQ1osMENBQTBDO0VBSTFDLHNCQUFzQjtBQUN4Qjs7QUFLQSw2RUFBNkU7O0FBQzdFO0VBRUUsYUFBYTtFQUViLDRCQUE0QjtFQUM1QixpRkFBaUY7RUFDakYscURBQXFEO0VBQ3JELHFIQUFxSDtFQUNySCxVQUFVO0VBQ1YsV0FBVztFQUNYLHFCQUFxQjtFQUNyQixjQUFjO0VBQ2Qsa0NBQWtDO0VBQ2xDLGVBQWU7RUFDZixnQkFBZ0I7RUFDaEIsU0FBUztFQUdULG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsc0JBQXNCO0VBQ3RCLDBCQUEwQjtFQUkxQixnQkFBZ0I7RUFDaEIsZUFBZTtBQUNqQjs7QUFFQSw2RUFBNkU7O0FBQzdFO0VBQ0UsaUlBQWlJO0VBRWpJLGFBQWE7RUFFYiw0QkFBNEI7RUFDNUIsK0ZBQStGO0VBQy9GLHFEQUFxRDtFQUNyRCx1SEFBdUg7RUFDdkgsVUFBVTtFQUNWLHNCQUFzQjtBQUN4Qjs7QUFFQSw2RUFBNkU7O0FBQzdFO0VBQ0UsYUFBYTtBQUNmOztBQUVBLDZFQUE2RTs7QUFDN0U7RUFDRSxZQUFZO0FBQ2QiLCJmaWxlIjoic3JjL2FwcC93ZWxjb21lL3dlbGNvbWUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jYXJvdXNlbC1pdGVtIHtcbiAgaGVpZ2h0OiBhdXRvO1xuICBiYWNrZ3JvdW5kOiBuby1yZXBlYXQgY2VudGVyIGNlbnRlciBzY3JvbGw7XG4gIC13ZWJraXQtYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgLW1vei1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAtby1iYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xufVxuXG5AaW1wb3J0IHVybChcImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1Qb3BwaW5zOjIwMCwyMDBpLDMwMCwzMDBpLDQwMCw0MDBpLDUwMCw1MDBpLDYwMCw2MDBpLDcwMCZkaXNwbGF5PXN3YXBcIik7XG5AaW1wb3J0IHVybChcImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1Qb3BwaW5zOjIwMCwyMDBpLDMwMCwzMDBpLDQwMCw0MDBpLDUwMCw1MDBpLDYwMCw2MDBpLDcwMCZkaXNwbGF5PXN3YXBcIik7XG5cbi8qIGxpbmUgMjksIC4uLy4uL0FyYWZhdGgvQ0wvQ0wgT2N0b2Jlci8yMTYuIENvbnN1bHRpbmcvSFRNTC9zY3NzL19idG4uc2NzcyAqL1xuLmJveGVkLWJ0bjMge1xuICBiYWNrZ3JvdW5kOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsICMwMTgxZjUgMCUsIHJnYmEoOTMsIDE3OCwgMjU1LCAwLjk5KSAxMDAlKTtcbiAgLyogRkYzLjYtMTUgKi9cbiAgYmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCAjMDE4MWY1IDAlLCByZ2JhKDkzLCAxNzgsIDI1NSwgMC45OSkgMTAwJSk7XG4gIC8qIENocm9tZTEwLTI1LFNhZmFyaTUuMS02ICovXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICMwMTgxZjUgMCUsIHJnYmEoOTMsIDE3OCwgMjU1LCAwLjk5KSAxMDAlKTtcbiAgLyogVzNDLCBJRTEwKywgRkYxNissIENocm9tZTI2KywgT3BlcmExMissIFNhZmFyaTcrICovXG4gIGZpbHRlcjogcHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LmdyYWRpZW50KCBzdGFydENvbG9yc3RyPScjMDE4MWY1JywgZW5kQ29sb3JzdHI9JyNmYzVkYjJmZicsR3JhZGllbnRUeXBlPTAgKTtcbiAgLyogSUU2LTkgKi9cbiAgY29sb3I6ICNmZmY7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgcGFkZGluZzogMSUgNSU7XG4gIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgc2Fucy1zZXJpZjtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBmb250LXdlaWdodDogNTAwO1xuICBib3JkZXI6IDA7XG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogMzBweDtcbiAgLW1vei1ib3JkZXItcmFkaXVzOiAzMHB4O1xuICBib3JkZXItcmFkaXVzOiAzMHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGNvbG9yOiAjZmZmICFpbXBvcnRhbnQ7XG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xuICAtd2Via2l0LXRyYW5zaXRpb246IDAuM3M7XG4gIC1tb3otdHJhbnNpdGlvbjogMC4zcztcbiAgLW8tdHJhbnNpdGlvbjogMC4zcztcbiAgdHJhbnNpdGlvbjogMC4zcztcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4vKiBsaW5lIDUyLCAuLi8uLi9BcmFmYXRoL0NML0NMIE9jdG9iZXIvMjE2LiBDb25zdWx0aW5nL0hUTUwvc2Nzcy9fYnRuLnNjc3MgKi9cbi5ib3hlZC1idG4zOmhvdmVyIHtcbiAgLyogUGVybWFsaW5rIC0gdXNlIHRvIGVkaXQgYW5kIHNoYXJlIHRoaXMgZ3JhZGllbnQ6IGh0dHBzOi8vY29sb3J6aWxsYS5jb20vZ3JhZGllbnQtZWRpdG9yLyMwMTgxZjUrMCw1ZGIyZmYrMTAwJjAuOTYrMCwwLjk2KzEwMCAqL1xuICBiYWNrZ3JvdW5kOiAtbW96LWxpbmVhci1ncmFkaWVudChyaWdodCwgcmdiYSgxLCAxMjksIDI0NSwgMC45NikgMCUsIHJnYmEoOTMsIDE3OCwgMjU1LCAwLjk2KSAxMDAlKTtcbiAgLyogRkYzLjYtMTUgKi9cbiAgYmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQocmlnaHQsIHJnYmEoMSwgMTI5LCAyNDUsIDAuOTYpIDAlLCByZ2JhKDkzLCAxNzgsIDI1NSwgMC45NikgMTAwJSk7XG4gIC8qIENocm9tZTEwLTI1LFNhZmFyaTUuMS02ICovXG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBsZWZ0LCByZ2JhKDEsIDEyOSwgMjQ1LCAwLjk2KSAwJSwgcmdiYSg5MywgMTc4LCAyNTUsIDAuOTYpIDEwMCUpO1xuICAvKiBXM0MsIElFMTArLCBGRjE2KywgQ2hyb21lMjYrLCBPcGVyYTEyKywgU2FmYXJpNysgKi9cbiAgZmlsdGVyOiBwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuZ3JhZGllbnQoIHN0YXJ0Q29sb3JzdHI9JyNmNTAxODFmNScsIGVuZENvbG9yc3RyPScjZjU1ZGIyZmYnLEdyYWRpZW50VHlwZT0wICk7XG4gIC8qIElFNi05ICovXG4gIGNvbG9yOiAjZmZmICFpbXBvcnRhbnQ7XG59XG5cbi8qIGxpbmUgNjIsIC4uLy4uL0FyYWZhdGgvQ0wvQ0wgT2N0b2Jlci8yMTYuIENvbnN1bHRpbmcvSFRNTC9zY3NzL19idG4uc2NzcyAqL1xuLmJveGVkLWJ0bjM6Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xufVxuXG4vKiBsaW5lIDY1LCAuLi8uLi9BcmFmYXRoL0NML0NMIE9jdG9iZXIvMjE2LiBDb25zdWx0aW5nL0hUTUwvc2Nzcy9fYnRuLnNjc3MgKi9cbi5ib3hlZC1idG4zLmxhcmdlLXdpZHRoIHtcbiAgd2lkdGg6IDIyMHB4O1xufVxuXG5cblxuIl19 */"

/***/ }),

/***/ "./src/app/welcome/welcome.component.ts":
/*!**********************************************!*\
  !*** ./src/app/welcome/welcome.component.ts ***!
  \**********************************************/
/*! exports provided: WelcomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WelcomeComponent", function() { return WelcomeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _texts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./texts */ "./src/app/welcome/texts.ts");




var WelcomeComponent = /** @class */ (function () {
    function WelcomeComponent(router) {
        this.router = router;
        this.texts = _texts__WEBPACK_IMPORTED_MODULE_3__["texts"];
    }
    WelcomeComponent.prototype.ngOnInit = function () { };
    WelcomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-welcome',
            template: __webpack_require__(/*! raw-loader!./welcome.component.html */ "./node_modules/raw-loader/index.js!./src/app/welcome/welcome.component.html"),
            styles: [__webpack_require__(/*! ./welcome.component.css */ "./src/app/welcome/welcome.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], WelcomeComponent);
    return WelcomeComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");





if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/alejandroromerolopez/Documents/GitHub/tfg-gestion-nadadores/TFG-Natacion-Frontend/ui/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map