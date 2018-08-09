(function (LIB) {
    // We're mainly based on the logic defined into the FreeCamera code
    var TouchCamera = /** @class */ (function (_super) {
        __extends(TouchCamera, _super);
        //-- end properties for backward compatibility for inputs
        function TouchCamera(name, position, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.inputs.addTouch();
            _this._setupInputs();
            return _this;
        }
        Object.defineProperty(TouchCamera.prototype, "touchAngularSensibility", {
            //-- Begin properties for backward compatibility for inputs
            get: function () {
                var touch = this.inputs.attached["touch"];
                if (touch)
                    return touch.touchAngularSensibility;
                return 0;
            },
            set: function (value) {
                var touch = this.inputs.attached["touch"];
                if (touch)
                    touch.touchAngularSensibility = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TouchCamera.prototype, "touchMoveSensibility", {
            get: function () {
                var touch = this.inputs.attached["touch"];
                if (touch)
                    return touch.touchMoveSensibility;
                return 0;
            },
            set: function (value) {
                var touch = this.inputs.attached["touch"];
                if (touch)
                    touch.touchMoveSensibility = value;
            },
            enumerable: true,
            configurable: true
        });
        TouchCamera.prototype.getClassName = function () {
            return "TouchCamera";
        };
        TouchCamera.prototype._setupInputs = function () {
            var mouse = this.inputs.attached["mouse"];
            if (mouse) {
                mouse.touchEnabled = false;
            }
        };
        return TouchCamera;
    }(LIB.FreeCamera));
    LIB.TouchCamera = TouchCamera;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.touchCamera.js.map
