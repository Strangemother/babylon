(function (LIB) {
    var ArcRotateCameraGamepadInput = /** @class */ (function () {
        function ArcRotateCameraGamepadInput() {
            this.gamepadRotationSensibility = 80;
            this.gamepadMoveSensibility = 40;
        }
        ArcRotateCameraGamepadInput.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            var manager = this.camera.getScene().gamepadManager;
            this._onGamepadConnectedObserver = manager.onGamepadConnectedObservable.add(function (gamepad) {
                if (gamepad.type !== LIB.Gamepad.POSE_ENABLED) {
                    // prioritize XBOX gamepads.
                    if (!_this.gamepad || gamepad.type === LIB.Gamepad.XBOX) {
                        _this.gamepad = gamepad;
                    }
                }
            });
            this._onGamepadDisconnectedObserver = manager.onGamepadDisconnectedObservable.add(function (gamepad) {
                if (_this.gamepad === gamepad) {
                    _this.gamepad = null;
                }
            });
            this.gamepad = manager.getGamepadByType(LIB.Gamepad.XBOX);
        };
        ArcRotateCameraGamepadInput.prototype.detachControl = function (element) {
            this.camera.getScene().gamepadManager.onGamepadConnectedObservable.remove(this._onGamepadConnectedObserver);
            this.camera.getScene().gamepadManager.onGamepadDisconnectedObservable.remove(this._onGamepadDisconnectedObserver);
            this.gamepad = null;
        };
        ArcRotateCameraGamepadInput.prototype.checkInputs = function () {
            if (this.gamepad) {
                var camera = this.camera;
                var RSValues = this.gamepad.rightStick;
                if (RSValues) {
                    if (RSValues.x != 0) {
                        var normalizedRX = RSValues.x / this.gamepadRotationSensibility;
                        if (normalizedRX != 0 && Math.abs(normalizedRX) > 0.005) {
                            camera.inertialAlphaOffset += normalizedRX;
                        }
                    }
                    if (RSValues.y != 0) {
                        var normalizedRY = RSValues.y / this.gamepadRotationSensibility;
                        if (normalizedRY != 0 && Math.abs(normalizedRY) > 0.005) {
                            camera.inertialBetaOffset += normalizedRY;
                        }
                    }
                }
                var LSValues = this.gamepad.leftStick;
                if (LSValues && LSValues.y != 0) {
                    var normalizedLY = LSValues.y / this.gamepadMoveSensibility;
                    if (normalizedLY != 0 && Math.abs(normalizedLY) > 0.005) {
                        this.camera.inertialRadiusOffset -= normalizedLY;
                    }
                }
            }
        };
        ArcRotateCameraGamepadInput.prototype.getClassName = function () {
            return "ArcRotateCameraGamepadInput";
        };
        ArcRotateCameraGamepadInput.prototype.getSimpleName = function () {
            return "gamepad";
        };
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraGamepadInput.prototype, "gamepadRotationSensibility", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraGamepadInput.prototype, "gamepadMoveSensibility", void 0);
        return ArcRotateCameraGamepadInput;
    }());
    LIB.ArcRotateCameraGamepadInput = ArcRotateCameraGamepadInput;
    LIB.CameraInputTypes["ArcRotateCameraGamepadInput"] = ArcRotateCameraGamepadInput;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.arcRotateCameraGamepadInput.js.map
