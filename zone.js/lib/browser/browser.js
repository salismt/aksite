"use strict";
require('../zone');
var event_target_1 = require('./event-target');
var define_property_1 = require('./define-property');
var register_element_1 = require('./register-element');
var property_descriptor_1 = require('./property-descriptor');
var utils_1 = require("./utils");
var set = 'set';
var clear = 'clear';
var blockingMethods = ['alert', 'prompt', 'confirm'];
var _global = typeof window == 'undefined' ? global : window;
patchTimer(_global, set, clear, 'Timeout');
patchTimer(_global, set, clear, 'Interval');
patchTimer(_global, set, clear, 'Immediate');
patchTimer(_global, 'request', 'cancelMacroTask', 'AnimationFrame');
patchTimer(_global, 'mozRequest', 'mozCancel', 'AnimationFrame');
patchTimer(_global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
for (var i = 0; i < blockingMethods.length; i++) {
    var name = blockingMethods[i];
    utils_1.patchMethod(_global, name, function (delegate, symbol, name) {
        return function (s, args) {
            return Zone.current.run(delegate, _global, args, name);
        };
    });
}
event_target_1.eventTargetPatch(_global);
property_descriptor_1.propertyDescriptorPatch(_global);
utils_1.patchClass('MutationObserver');
utils_1.patchClass('WebKitMutationObserver');
utils_1.patchClass('FileReader');
define_property_1.propertyPatch();
register_element_1.registerElementPatch(_global);
/// GEO_LOCATION
if (_global['navigator'] && _global['navigator'].geolocation) {
    utils_1.patchPrototype(_global['navigator'].geolocation, [
        'getCurrentPosition',
        'watchPosition'
    ]);
}
function patchTimer(window, setName, cancelName, nameSuffix) {
    setName += nameSuffix;
    cancelName += nameSuffix;
    function scheduleTask(task) {
        var data = task.data;
        data.args[0] = task.invoke;
        data.handleId = setNative.apply(window, data.args);
        return task;
    }
    function clearTask(task) {
        return clearNative(task.data.handleId);
    }
    var setNative = utils_1.patchMethod(window, setName, function () { return function (self, args) {
        if (typeof args[0] === 'function') {
            var zone = Zone.current;
            var options = {
                handleId: null,
                isPeriodic: nameSuffix == 'Interval',
                delay: (nameSuffix == 'Timeout' || nameSuffix == 'Interval') ? args[1] || 0 : null,
                args: args
            };
            return zone.scheduleMacroTask(setName, args[0], options, scheduleTask, clearTask);
        }
        else {
            // cause an error by calling it directly.
            return setNative.apply(window, args);
        }
    }; });
    var clearNative = utils_1.patchMethod(window, cancelName, function () { return function (self, args) {
        var task = args[0];
        task.zone.cancelTask(task);
    }; });
}
