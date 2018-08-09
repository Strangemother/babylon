(function (LIB) {
    /**
     * A class serves as a medium between the observable and its observers
     */
    var EventState = /** @class */ (function () {
        /**
        * If the callback of a given Observer set skipNextObservers to true the following observers will be ignored
        */
        function EventState(mask, skipNextObservers, target, currentTarget) {
            if (skipNextObservers === void 0) { skipNextObservers = false; }
            this.initalize(mask, skipNextObservers, target, currentTarget);
        }
        EventState.prototype.initalize = function (mask, skipNextObservers, target, currentTarget) {
            if (skipNextObservers === void 0) { skipNextObservers = false; }
            this.mask = mask;
            this.skipNextObservers = skipNextObservers;
            this.target = target;
            this.currentTarget = currentTarget;
            return this;
        };
        return EventState;
    }());
    LIB.EventState = EventState;
    /**
     * Represent an Observer registered to a given Observable object.
     */
    var Observer = /** @class */ (function () {
        function Observer(callback, mask, scope) {
            if (scope === void 0) { scope = null; }
            this.callback = callback;
            this.mask = mask;
            this.scope = scope;
        }
        return Observer;
    }());
    LIB.Observer = Observer;
    /**
     * Represent a list of observers registered to multiple Observables object.
     */
    var MultiObserver = /** @class */ (function () {
        function MultiObserver() {
        }
        MultiObserver.prototype.dispose = function () {
            if (this._observers && this._observables) {
                for (var index = 0; index < this._observers.length; index++) {
                    this._observables[index].remove(this._observers[index]);
                }
            }
            this._observers = null;
            this._observables = null;
        };
        MultiObserver.Watch = function (observables, callback, mask, scope) {
            if (mask === void 0) { mask = -1; }
            if (scope === void 0) { scope = null; }
            var result = new MultiObserver();
            result._observers = new Array();
            result._observables = observables;
            for (var _i = 0, observables_1 = observables; _i < observables_1.length; _i++) {
                var observable = observables_1[_i];
                var observer = observable.add(callback, mask, false, scope);
                if (observer) {
                    result._observers.push(observer);
                }
            }
            return result;
        };
        return MultiObserver;
    }());
    LIB.MultiObserver = MultiObserver;
    /**
     * The Observable class is a simple implementation of the Observable pattern.
     * There's one slight particularity though: a given Observable can notify its observer using a particular mask value, only the Observers registered with this mask value will be notified.
     * This enable a more fine grained execution without having to rely on multiple different Observable objects.
     * For instance you may have a given Observable that have four different types of notifications: Move (mask = 0x01), Stop (mask = 0x02), Turn Right (mask = 0X04), Turn Left (mask = 0X08).
     * A given observer can register itself with only Move and Stop (mask = 0x03), then it will only be notified when one of these two occurs and will never be for Turn Left/Right.
     */
    var Observable = /** @class */ (function () {
        function Observable(onObserverAdded) {
            this._observers = new Array();
            this._eventState = new EventState(0);
            if (onObserverAdded) {
                this._onObserverAdded = onObserverAdded;
            }
        }
        /**
         * Create a new Observer with the specified callback
         * @param callback the callback that will be executed for that Observer
         * @param mask the mask used to filter observers
         * @param insertFirst if true the callback will be inserted at the first position, hence executed before the others ones. If false (default behavior) the callback will be inserted at the last position, executed after all the others already present.
         * @param scope optional scope for the callback to be called from
         */
        Observable.prototype.add = function (callback, mask, insertFirst, scope) {
            if (mask === void 0) { mask = -1; }
            if (insertFirst === void 0) { insertFirst = false; }
            if (scope === void 0) { scope = null; }
            if (!callback) {
                return null;
            }
            var observer = new Observer(callback, mask, scope);
            if (insertFirst) {
                this._observers.unshift(observer);
            }
            else {
                this._observers.push(observer);
            }
            if (this._onObserverAdded) {
                this._onObserverAdded(observer);
            }
            return observer;
        };
        /**
         * Remove an Observer from the Observable object
         * @param observer the instance of the Observer to remove. If it doesn't belong to this Observable, false will be returned.
         */
        Observable.prototype.remove = function (observer) {
            if (!observer) {
                return false;
            }
            var index = this._observers.indexOf(observer);
            if (index !== -1) {
                this._observers.splice(index, 1);
                return true;
            }
            return false;
        };
        /**
         * Remove a callback from the Observable object
         * @param callback the callback to remove. If it doesn't belong to this Observable, false will be returned.
        */
        Observable.prototype.removeCallback = function (callback) {
            for (var index = 0; index < this._observers.length; index++) {
                if (this._observers[index].callback === callback) {
                    this._observers.splice(index, 1);
                    return true;
                }
            }
            return false;
        };
        /**
         * Notify all Observers by calling their respective callback with the given data
         * Will return true if all observers were executed, false if an observer set skipNextObservers to true, then prevent the subsequent ones to execute
         * @param eventData
         * @param mask
         */
        Observable.prototype.notifyObservers = function (eventData, mask, target, currentTarget) {
            if (mask === void 0) { mask = -1; }
            if (!this._observers.length) {
                return true;
            }
            var state = this._eventState;
            state.mask = mask;
            state.target = target;
            state.currentTarget = currentTarget;
            state.skipNextObservers = false;
            for (var _i = 0, _a = this._observers; _i < _a.length; _i++) {
                var obs = _a[_i];
                if (obs.mask & mask) {
                    if (obs.scope) {
                        obs.callback.apply(obs.scope, [eventData, state]);
                    }
                    else {
                        obs.callback(eventData, state);
                    }
                }
                if (state.skipNextObservers) {
                    return false;
                }
            }
            return true;
        };
        /**
         * Notify a specific observer
         * @param eventData
         * @param mask
         */
        Observable.prototype.notifyObserver = function (observer, eventData, mask) {
            if (mask === void 0) { mask = -1; }
            var state = this._eventState;
            state.mask = mask;
            state.skipNextObservers = false;
            observer.callback(eventData, state);
        };
        /**
         * return true is the Observable has at least one Observer registered
         */
        Observable.prototype.hasObservers = function () {
            return this._observers.length > 0;
        };
        /**
        * Clear the list of observers
        */
        Observable.prototype.clear = function () {
            this._observers = new Array();
            this._onObserverAdded = null;
        };
        /**
        * Clone the current observable
        */
        Observable.prototype.clone = function () {
            var result = new Observable();
            result._observers = this._observers.slice(0);
            return result;
        };
        /**
         * Does this observable handles observer registered with a given mask
         * @param {number} trigger - the mask to be tested
         * @return {boolean} whether or not one observer registered with the given mask is handeled
        **/
        Observable.prototype.hasSpecificMask = function (mask) {
            if (mask === void 0) { mask = -1; }
            for (var _i = 0, _a = this._observers; _i < _a.length; _i++) {
                var obs = _a[_i];
                if (obs.mask & mask || obs.mask === mask) {
                    return true;
                }
            }
            return false;
        };
        return Observable;
    }());
    LIB.Observable = Observable;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.observable.js.map
