(function (LIB) {
    var WebVRController = /** @class */ (function (_super) {
        __extends(WebVRController, _super);
        function WebVRController(vrGamepad) {
            var _this = _super.call(this, vrGamepad) || this;
            // Observables
            _this.onTriggerStateChangedObservable = new LIB.Observable();
            _this.onMainButtonStateChangedObservable = new LIB.Observable();
            _this.onSecondaryButtonStateChangedObservable = new LIB.Observable();
            _this.onPadStateChangedObservable = new LIB.Observable();
            _this.onPadValuesChangedObservable = new LIB.Observable();
            _this.pad = { x: 0, y: 0 };
            // avoid GC, store state in a tmp object
            _this._changes = {
                pressChanged: false,
                touchChanged: false,
                valueChanged: false,
                changed: false
            };
            _this._buttons = new Array(vrGamepad.buttons.length);
            _this.hand = vrGamepad.hand;
            return _this;
        }
        WebVRController.prototype.onButtonStateChange = function (callback) {
            this._onButtonStateChange = callback;
        };
        Object.defineProperty(WebVRController.prototype, "defaultModel", {
            get: function () {
                return this._defaultModel;
            },
            enumerable: true,
            configurable: true
        });
        WebVRController.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var index = 0; index < this._buttons.length; index++) {
                this._setButtonValue(this.browserGamepad.buttons[index], this._buttons[index], index);
            }
            ;
            if (this.leftStick.x !== this.pad.x || this.leftStick.y !== this.pad.y) {
                this.pad.x = this.leftStick.x;
                this.pad.y = this.leftStick.y;
                this.onPadValuesChangedObservable.notifyObservers(this.pad);
            }
        };
        WebVRController.prototype._setButtonValue = function (newState, currentState, buttonIndex) {
            if (!newState) {
                newState = {
                    pressed: false,
                    touched: false,
                    value: 0
                };
            }
            if (!currentState) {
                this._buttons[buttonIndex] = {
                    pressed: newState.pressed,
                    touched: newState.touched,
                    value: newState.value
                };
                return;
            }
            this._checkChanges(newState, currentState);
            if (this._changes.changed) {
                this._onButtonStateChange && this._onButtonStateChange(this.index, buttonIndex, newState);
                this.handleButtonChange(buttonIndex, newState, this._changes);
            }
            this._buttons[buttonIndex].pressed = newState.pressed;
            this._buttons[buttonIndex].touched = newState.touched;
            // oculus triggers are never 0, thou not touched.
            this._buttons[buttonIndex].value = newState.value < 0.00000001 ? 0 : newState.value;
        };
        WebVRController.prototype._checkChanges = function (newState, currentState) {
            this._changes.pressChanged = newState.pressed !== currentState.pressed;
            this._changes.touchChanged = newState.touched !== currentState.touched;
            this._changes.valueChanged = newState.value !== currentState.value;
            this._changes.changed = this._changes.pressChanged || this._changes.touchChanged || this._changes.valueChanged;
            return this._changes;
        };
        WebVRController.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.onTriggerStateChangedObservable.clear();
            this.onMainButtonStateChangedObservable.clear();
            this.onSecondaryButtonStateChangedObservable.clear();
            this.onPadStateChangedObservable.clear();
            this.onPadValuesChangedObservable.clear();
        };
        return WebVRController;
    }(LIB.PoseEnabledController));
    LIB.WebVRController = WebVRController;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.webVRController.js.map
