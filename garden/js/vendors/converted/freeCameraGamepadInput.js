(function (LIB) {
    var FreeCameraGamepadInput = /** @class */ (function () {
        function FreeCameraGamepadInput() {
            this.gamepadAngularSensibility = 200;
            this.gamepadMoveSensibility = 40;
            // private members
            this._cameraTransform = LIB.Matrix.Identity();
            this._deltaTransform = LIB.Vector3.Zero();
            this._vector3 = LIB.Vector3.Zero();
            this._vector2 = LIB.Vector2.Zero();
        }
        FreeCameraGamepadInput.prototype.attachControl = function (element, noPreventDefault) {
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
        FreeCameraGamepadInput.prototype.detachControl = function (element) {
            this.camera.getScene().gamepadManager.onGamepadConnectedObservable.remove(this._onGamepadConnectedObserver);
            this.camera.getScene().gamepadManager.onGamepadDisconnectedObservable.remove(this._onGamepadDisconnectedObserver);
            this.gamepad = null;
        };
        FreeCameraGamepadInput.prototype.checkInputs = function () {
            if (this.gamepad && this.gamepad.leftStick) {
                var camera = this.camera;
                var LSValues = this.gamepad.leftStick;
                var normalizedLX = LSValues.x / this.gamepadMoveSensibility;
                var normalizedLY = LSValues.y / this.gamepadMoveSensibility;
                LSValues.x = Math.abs(normalizedLX) > 0.005 ? 0 + normalizedLX : 0;
                LSValues.y = Math.abs(normalizedLY) > 0.005 ? 0 + normalizedLY : 0;
                var RSValues = this.gamepad.rightStick;
                if (RSValues) {
                    var normalizedRX = RSValues.x / this.gamepadAngularSensibility;
                    var normalizedRY = RSValues.y / this.gamepadAngularSensibility;
                    RSValues.x = Math.abs(normalizedRX) > 0.001 ? 0 + normalizedRX : 0;
                    RSValues.y = Math.abs(normalizedRY) > 0.001 ? 0 + normalizedRY : 0;
                }
                else {
                    RSValues = { x: 0, y: 0 };
                }
                if (!camera.rotationQuaternion) {
                    LIB.Matrix.RotationYawPitchRollToRef(camera.rotation.y, camera.rotation.x, 0, this._cameraTransform);
                }
                else {
                    camera.rotationQuaternion.toRotationMatrix(this._cameraTransform);
                }
                var speed = camera._computeLocalCameraSpeed() * 50.0;
                this._vector3.copyFromFloats(LSValues.x * speed, 0, -LSValues.y * speed);
                LIB.Vector3.TransformCoordinatesToRef(this._vector3, this._cameraTransform, this._deltaTransform);
                camera.cameraDirection.addInPlace(this._deltaTransform);
                this._vector2.copyFromFloats(RSValues.y, RSValues.x);
                camera.cameraRotation.addInPlace(this._vector2);
            }
        };
        FreeCameraGamepadInput.prototype.getClassName = function () {
            return "FreeCameraGamepadInput";
        };
        FreeCameraGamepadInput.prototype.getSimpleName = function () {
            return "gamepad";
        };
        __decorate([
            LIB.serialize()
        ], FreeCameraGamepadInput.prototype, "gamepadAngularSensibility", void 0);
        __decorate([
            LIB.serialize()
        ], FreeCameraGamepadInput.prototype, "gamepadMoveSensibility", void 0);
        return FreeCameraGamepadInput;
    }());
    LIB.FreeCameraGamepadInput = FreeCameraGamepadInput;
    LIB.CameraInputTypes["FreeCameraGamepadInput"] = FreeCameraGamepadInput;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.freeCameraGamepadInput.js.map
