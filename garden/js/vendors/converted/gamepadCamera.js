(function (LIB) {
    // We're mainly based on the logic defined into the FreeCamera code
    var GamepadCamera = /** @class */ (function (_super) {
        __extends(GamepadCamera, _super);
        //-- end properties for backward compatibility for inputs
        function GamepadCamera(name, position, scene) {
            return _super.call(this, name, position, scene) || this;
        }
        Object.defineProperty(GamepadCamera.prototype, "gamepadAngularSensibility", {
            //-- Begin properties for backward compatibility for inputs
            get: function () {
                var gamepad = this.inputs.attached["gamepad"];
                if (gamepad)
                    return gamepad.gamepadAngularSensibility;
                return 0;
            },
            set: function (value) {
                var gamepad = this.inputs.attached["gamepad"];
                if (gamepad)
                    gamepad.gamepadAngularSensibility = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GamepadCamera.prototype, "gamepadMoveSensibility", {
            get: function () {
                var gamepad = this.inputs.attached["gamepad"];
                if (gamepad)
                    return gamepad.gamepadMoveSensibility;
                return 0;
            },
            set: function (value) {
                var gamepad = this.inputs.attached["gamepad"];
                if (gamepad)
                    gamepad.gamepadMoveSensibility = value;
            },
            enumerable: true,
            configurable: true
        });
        GamepadCamera.prototype.getClassName = function () {
            return "GamepadCamera";
        };
        return GamepadCamera;
    }(LIB.UniversalCamera));
    LIB.GamepadCamera = GamepadCamera;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.gamepadCamera.js.map
