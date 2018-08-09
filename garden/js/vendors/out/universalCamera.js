var BABYLON;
(function (BABYLON) {
    // We're mainly based on the logic defined into the FreeCamera code
    var UniversalCamera = /** @class */ (function (_super) {
        __extends(UniversalCamera, _super);
        //-- end properties for backward compatibility for inputs
        function UniversalCamera(name, position, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.inputs.addGamepad();
            return _this;
        }
        Object.defineProperty(UniversalCamera.prototype, "gamepadAngularSensibility", {
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
        Object.defineProperty(UniversalCamera.prototype, "gamepadMoveSensibility", {
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
        UniversalCamera.prototype.getClassName = function () {
            return "UniversalCamera";
        };
        return UniversalCamera;
    }(BABYLON.TouchCamera));
    BABYLON.UniversalCamera = UniversalCamera;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.universalCamera.js.map
