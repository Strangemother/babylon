var BABYLON;
(function (BABYLON) {
    var StickValues = /** @class */ (function () {
        function StickValues(x, y) {
            this.x = x;
            this.y = y;
        }
        return StickValues;
    }());
    BABYLON.StickValues = StickValues;
    var Gamepad = /** @class */ (function () {
        function Gamepad(id, index, browserGamepad, leftStickX, leftStickY, rightStickX, rightStickY) {
            if (leftStickX === void 0) { leftStickX = 0; }
            if (leftStickY === void 0) { leftStickY = 1; }
            if (rightStickX === void 0) { rightStickX = 2; }
            if (rightStickY === void 0) { rightStickY = 3; }
            this.id = id;
            this.index = index;
            this.browserGamepad = browserGamepad;
            this._isConnected = true;
            this._invertLeftStickY = false;
            this.type = Gamepad.GAMEPAD;
            this._leftStickAxisX = leftStickX;
            this._leftStickAxisY = leftStickY;
            this._rightStickAxisX = rightStickX;
            this._rightStickAxisY = rightStickY;
            if (this.browserGamepad.axes.length >= 2) {
                this._leftStick = { x: this.browserGamepad.axes[this._leftStickAxisX], y: this.browserGamepad.axes[this._leftStickAxisY] };
            }
            if (this.browserGamepad.axes.length >= 4) {
                this._rightStick = { x: this.browserGamepad.axes[this._rightStickAxisX], y: this.browserGamepad.axes[this._rightStickAxisY] };
            }
        }
        Object.defineProperty(Gamepad.prototype, "isConnected", {
            get: function () {
                return this._isConnected;
            },
            enumerable: true,
            configurable: true
        });
        Gamepad.prototype.onleftstickchanged = function (callback) {
            this._onleftstickchanged = callback;
        };
        Gamepad.prototype.onrightstickchanged = function (callback) {
            this._onrightstickchanged = callback;
        };
        Object.defineProperty(Gamepad.prototype, "leftStick", {
            get: function () {
                return this._leftStick;
            },
            set: function (newValues) {
                if (this._onleftstickchanged && (this._leftStick.x !== newValues.x || this._leftStick.y !== newValues.y)) {
                    this._onleftstickchanged(newValues);
                }
                this._leftStick = newValues;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamepad.prototype, "rightStick", {
            get: function () {
                return this._rightStick;
            },
            set: function (newValues) {
                if (this._onrightstickchanged && (this._rightStick.x !== newValues.x || this._rightStick.y !== newValues.y)) {
                    this._onrightstickchanged(newValues);
                }
                this._rightStick = newValues;
            },
            enumerable: true,
            configurable: true
        });
        Gamepad.prototype.update = function () {
            if (this._leftStick) {
                this.leftStick = { x: this.browserGamepad.axes[this._leftStickAxisX], y: this.browserGamepad.axes[this._leftStickAxisY] };
                if (this._invertLeftStickY) {
                    this.leftStick.y *= -1;
                }
            }
            if (this._rightStick) {
                this.rightStick = { x: this.browserGamepad.axes[this._rightStickAxisX], y: this.browserGamepad.axes[this._rightStickAxisY] };
            }
        };
        Gamepad.prototype.dispose = function () {
        };
        Gamepad.GAMEPAD = 0;
        Gamepad.GENERIC = 1;
        Gamepad.XBOX = 2;
        Gamepad.POSE_ENABLED = 3;
        return Gamepad;
    }());
    BABYLON.Gamepad = Gamepad;
    var GenericPad = /** @class */ (function (_super) {
        __extends(GenericPad, _super);
        function GenericPad(id, index, browserGamepad) {
            var _this = _super.call(this, id, index, browserGamepad) || this;
            _this.onButtonDownObservable = new BABYLON.Observable();
            _this.onButtonUpObservable = new BABYLON.Observable();
            _this.type = Gamepad.GENERIC;
            _this._buttons = new Array(browserGamepad.buttons.length);
            return _this;
        }
        GenericPad.prototype.onbuttondown = function (callback) {
            this._onbuttondown = callback;
        };
        GenericPad.prototype.onbuttonup = function (callback) {
            this._onbuttonup = callback;
        };
        GenericPad.prototype._setButtonValue = function (newValue, currentValue, buttonIndex) {
            if (newValue !== currentValue) {
                if (newValue === 1) {
                    if (this._onbuttondown) {
                        this._onbuttondown(buttonIndex);
                    }
                    this.onButtonDownObservable.notifyObservers(buttonIndex);
                }
                if (newValue === 0) {
                    if (this._onbuttonup) {
                        this._onbuttonup(buttonIndex);
                    }
                    this.onButtonUpObservable.notifyObservers(buttonIndex);
                }
            }
            return newValue;
        };
        GenericPad.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var index = 0; index < this._buttons.length; index++) {
                this._buttons[index] = this._setButtonValue(this.browserGamepad.buttons[index].value, this._buttons[index], index);
            }
        };
        GenericPad.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.onButtonDownObservable.clear();
            this.onButtonUpObservable.clear();
        };
        return GenericPad;
    }(Gamepad));
    BABYLON.GenericPad = GenericPad;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.gamepad.js.map
