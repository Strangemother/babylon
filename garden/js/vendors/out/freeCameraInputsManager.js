var BABYLON;
(function (BABYLON) {
    var FreeCameraInputsManager = /** @class */ (function (_super) {
        __extends(FreeCameraInputsManager, _super);
        function FreeCameraInputsManager(camera) {
            return _super.call(this, camera) || this;
        }
        FreeCameraInputsManager.prototype.addKeyboard = function () {
            this.add(new BABYLON.FreeCameraKeyboardMoveInput());
            return this;
        };
        FreeCameraInputsManager.prototype.addMouse = function (touchEnabled) {
            if (touchEnabled === void 0) { touchEnabled = true; }
            this.add(new BABYLON.FreeCameraMouseInput(touchEnabled));
            return this;
        };
        FreeCameraInputsManager.prototype.addGamepad = function () {
            this.add(new BABYLON.FreeCameraGamepadInput());
            return this;
        };
        FreeCameraInputsManager.prototype.addDeviceOrientation = function () {
            this.add(new BABYLON.FreeCameraDeviceOrientationInput());
            return this;
        };
        FreeCameraInputsManager.prototype.addTouch = function () {
            this.add(new BABYLON.FreeCameraTouchInput());
            return this;
        };
        FreeCameraInputsManager.prototype.addVirtualJoystick = function () {
            this.add(new BABYLON.FreeCameraVirtualJoystickInput());
            return this;
        };
        return FreeCameraInputsManager;
    }(BABYLON.CameraInputsManager));
    BABYLON.FreeCameraInputsManager = FreeCameraInputsManager;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.freeCameraInputsManager.js.map
