(function (LIB) {
    var Xbox360Button;
    (function (Xbox360Button) {
        Xbox360Button[Xbox360Button["A"] = 0] = "A";
        Xbox360Button[Xbox360Button["B"] = 1] = "B";
        Xbox360Button[Xbox360Button["X"] = 2] = "X";
        Xbox360Button[Xbox360Button["Y"] = 3] = "Y";
        Xbox360Button[Xbox360Button["Start"] = 4] = "Start";
        Xbox360Button[Xbox360Button["Back"] = 5] = "Back";
        Xbox360Button[Xbox360Button["LB"] = 6] = "LB";
        Xbox360Button[Xbox360Button["RB"] = 7] = "RB";
        Xbox360Button[Xbox360Button["LeftStick"] = 8] = "LeftStick";
        Xbox360Button[Xbox360Button["RightStick"] = 9] = "RightStick";
    })(Xbox360Button = LIB.Xbox360Button || (LIB.Xbox360Button = {}));
    var Xbox360Dpad;
    (function (Xbox360Dpad) {
        Xbox360Dpad[Xbox360Dpad["Up"] = 0] = "Up";
        Xbox360Dpad[Xbox360Dpad["Down"] = 1] = "Down";
        Xbox360Dpad[Xbox360Dpad["Left"] = 2] = "Left";
        Xbox360Dpad[Xbox360Dpad["Right"] = 3] = "Right";
    })(Xbox360Dpad = LIB.Xbox360Dpad || (LIB.Xbox360Dpad = {}));
    var Xbox360Pad = /** @class */ (function (_super) {
        __extends(Xbox360Pad, _super);
        function Xbox360Pad(id, index, gamepad, xboxOne) {
            if (xboxOne === void 0) { xboxOne = false; }
            var _this = _super.call(this, id, index, gamepad, 0, 1, 2, 3) || this;
            _this._leftTrigger = 0;
            _this._rightTrigger = 0;
            _this.onButtonDownObservable = new LIB.Observable();
            _this.onButtonUpObservable = new LIB.Observable();
            _this.onPadDownObservable = new LIB.Observable();
            _this.onPadUpObservable = new LIB.Observable();
            _this._buttonA = 0;
            _this._buttonB = 0;
            _this._buttonX = 0;
            _this._buttonY = 0;
            _this._buttonBack = 0;
            _this._buttonStart = 0;
            _this._buttonLB = 0;
            _this._buttonRB = 0;
            _this._buttonLeftStick = 0;
            _this._buttonRightStick = 0;
            _this._dPadUp = 0;
            _this._dPadDown = 0;
            _this._dPadLeft = 0;
            _this._dPadRight = 0;
            _this._isXboxOnePad = false;
            _this.type = LIB.Gamepad.XBOX;
            _this._isXboxOnePad = xboxOne;
            return _this;
        }
        Xbox360Pad.prototype.onlefttriggerchanged = function (callback) {
            this._onlefttriggerchanged = callback;
        };
        Xbox360Pad.prototype.onrighttriggerchanged = function (callback) {
            this._onrighttriggerchanged = callback;
        };
        Object.defineProperty(Xbox360Pad.prototype, "leftTrigger", {
            get: function () {
                return this._leftTrigger;
            },
            set: function (newValue) {
                if (this._onlefttriggerchanged && this._leftTrigger !== newValue) {
                    this._onlefttriggerchanged(newValue);
                }
                this._leftTrigger = newValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "rightTrigger", {
            get: function () {
                return this._rightTrigger;
            },
            set: function (newValue) {
                if (this._onrighttriggerchanged && this._rightTrigger !== newValue) {
                    this._onrighttriggerchanged(newValue);
                }
                this._rightTrigger = newValue;
            },
            enumerable: true,
            configurable: true
        });
        Xbox360Pad.prototype.onbuttondown = function (callback) {
            this._onbuttondown = callback;
        };
        Xbox360Pad.prototype.onbuttonup = function (callback) {
            this._onbuttonup = callback;
        };
        Xbox360Pad.prototype.ondpaddown = function (callback) {
            this._ondpaddown = callback;
        };
        Xbox360Pad.prototype.ondpadup = function (callback) {
            this._ondpadup = callback;
        };
        Xbox360Pad.prototype._setButtonValue = function (newValue, currentValue, buttonType) {
            if (newValue !== currentValue) {
                if (newValue === 1) {
                    if (this._onbuttondown) {
                        this._onbuttondown(buttonType);
                    }
                    this.onButtonDownObservable.notifyObservers(buttonType);
                }
                if (newValue === 0) {
                    if (this._onbuttonup) {
                        this._onbuttonup(buttonType);
                    }
                    this.onButtonUpObservable.notifyObservers(buttonType);
                }
            }
            return newValue;
        };
        Xbox360Pad.prototype._setDPadValue = function (newValue, currentValue, buttonType) {
            if (newValue !== currentValue) {
                if (newValue === 1) {
                    if (this._ondpaddown) {
                        this._ondpaddown(buttonType);
                    }
                    this.onPadDownObservable.notifyObservers(buttonType);
                }
                if (newValue === 0) {
                    if (this._ondpadup) {
                        this._ondpadup(buttonType);
                    }
                    this.onPadUpObservable.notifyObservers(buttonType);
                }
            }
            return newValue;
        };
        Object.defineProperty(Xbox360Pad.prototype, "buttonA", {
            get: function () {
                return this._buttonA;
            },
            set: function (value) {
                this._buttonA = this._setButtonValue(value, this._buttonA, Xbox360Button.A);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "buttonB", {
            get: function () {
                return this._buttonB;
            },
            set: function (value) {
                this._buttonB = this._setButtonValue(value, this._buttonB, Xbox360Button.B);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "buttonX", {
            get: function () {
                return this._buttonX;
            },
            set: function (value) {
                this._buttonX = this._setButtonValue(value, this._buttonX, Xbox360Button.X);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "buttonY", {
            get: function () {
                return this._buttonY;
            },
            set: function (value) {
                this._buttonY = this._setButtonValue(value, this._buttonY, Xbox360Button.Y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "buttonStart", {
            get: function () {
                return this._buttonStart;
            },
            set: function (value) {
                this._buttonStart = this._setButtonValue(value, this._buttonStart, Xbox360Button.Start);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "buttonBack", {
            get: function () {
                return this._buttonBack;
            },
            set: function (value) {
                this._buttonBack = this._setButtonValue(value, this._buttonBack, Xbox360Button.Back);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "buttonLB", {
            get: function () {
                return this._buttonLB;
            },
            set: function (value) {
                this._buttonLB = this._setButtonValue(value, this._buttonLB, Xbox360Button.LB);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "buttonRB", {
            get: function () {
                return this._buttonRB;
            },
            set: function (value) {
                this._buttonRB = this._setButtonValue(value, this._buttonRB, Xbox360Button.RB);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "buttonLeftStick", {
            get: function () {
                return this._buttonLeftStick;
            },
            set: function (value) {
                this._buttonLeftStick = this._setButtonValue(value, this._buttonLeftStick, Xbox360Button.LeftStick);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "buttonRightStick", {
            get: function () {
                return this._buttonRightStick;
            },
            set: function (value) {
                this._buttonRightStick = this._setButtonValue(value, this._buttonRightStick, Xbox360Button.RightStick);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "dPadUp", {
            get: function () {
                return this._dPadUp;
            },
            set: function (value) {
                this._dPadUp = this._setDPadValue(value, this._dPadUp, Xbox360Dpad.Up);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "dPadDown", {
            get: function () {
                return this._dPadDown;
            },
            set: function (value) {
                this._dPadDown = this._setDPadValue(value, this._dPadDown, Xbox360Dpad.Down);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "dPadLeft", {
            get: function () {
                return this._dPadLeft;
            },
            set: function (value) {
                this._dPadLeft = this._setDPadValue(value, this._dPadLeft, Xbox360Dpad.Left);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Xbox360Pad.prototype, "dPadRight", {
            get: function () {
                return this._dPadRight;
            },
            set: function (value) {
                this._dPadRight = this._setDPadValue(value, this._dPadRight, Xbox360Dpad.Right);
            },
            enumerable: true,
            configurable: true
        });
        Xbox360Pad.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this._isXboxOnePad) {
                this.buttonA = this.browserGamepad.buttons[0].value;
                this.buttonB = this.browserGamepad.buttons[1].value;
                this.buttonX = this.browserGamepad.buttons[2].value;
                this.buttonY = this.browserGamepad.buttons[3].value;
                this.buttonLB = this.browserGamepad.buttons[4].value;
                this.buttonRB = this.browserGamepad.buttons[5].value;
                this.leftTrigger = this.browserGamepad.axes[2];
                this.rightTrigger = this.browserGamepad.axes[5];
                this.buttonBack = this.browserGamepad.buttons[9].value;
                this.buttonStart = this.browserGamepad.buttons[8].value;
                this.buttonLeftStick = this.browserGamepad.buttons[6].value;
                this.buttonRightStick = this.browserGamepad.buttons[7].value;
                this.dPadUp = this.browserGamepad.buttons[11].value;
                this.dPadDown = this.browserGamepad.buttons[12].value;
                this.dPadLeft = this.browserGamepad.buttons[13].value;
                this.dPadRight = this.browserGamepad.buttons[14].value;
            }
            else {
                this.buttonA = this.browserGamepad.buttons[0].value;
                this.buttonB = this.browserGamepad.buttons[1].value;
                this.buttonX = this.browserGamepad.buttons[2].value;
                this.buttonY = this.browserGamepad.buttons[3].value;
                this.buttonLB = this.browserGamepad.buttons[4].value;
                this.buttonRB = this.browserGamepad.buttons[5].value;
                this.leftTrigger = this.browserGamepad.buttons[6].value;
                this.rightTrigger = this.browserGamepad.buttons[7].value;
                this.buttonBack = this.browserGamepad.buttons[8].value;
                this.buttonStart = this.browserGamepad.buttons[9].value;
                this.buttonLeftStick = this.browserGamepad.buttons[10].value;
                this.buttonRightStick = this.browserGamepad.buttons[11].value;
                this.dPadUp = this.browserGamepad.buttons[12].value;
                this.dPadDown = this.browserGamepad.buttons[13].value;
                this.dPadLeft = this.browserGamepad.buttons[14].value;
                this.dPadRight = this.browserGamepad.buttons[15].value;
            }
        };
        Xbox360Pad.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.onButtonDownObservable.clear();
            this.onButtonUpObservable.clear();
            this.onPadDownObservable.clear();
            this.onPadUpObservable.clear();
        };
        return Xbox360Pad;
    }(LIB.Gamepad));
    LIB.Xbox360Pad = Xbox360Pad;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.xboxGamepad.js.map
