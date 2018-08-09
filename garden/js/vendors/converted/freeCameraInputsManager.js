(function (LIB) {
    var FreeCameraInputsManager = /** @class */ (function (_super) {
        __extends(FreeCameraInputsManager, _super);
        function FreeCameraInputsManager(camera) {
            return _super.call(this, camera) || this;
        }
        FreeCameraInputsManager.prototype.addKeyboard = function () {
            this.add(new LIB.FreeCameraKeyboardMoveInput());
            return this;
        };
        FreeCameraInputsManager.prototype.addMouse = function (touchEnabled) {
            if (touchEnabled === void 0) { touchEnabled = true; }
            this.add(new LIB.FreeCameraMouseInput(touchEnabled));
            return this;
        };
        FreeCameraInputsManager.prototype.addGamepad = function () {
            this.add(new LIB.FreeCameraGamepadInput());
            return this;
        };
        FreeCameraInputsManager.prototype.addDeviceOrientation = function () {
            this.add(new LIB.FreeCameraDeviceOrientationInput());
            return this;
        };
        FreeCameraInputsManager.prototype.addTouch = function () {
            this.add(new LIB.FreeCameraTouchInput());
            return this;
        };
        FreeCameraInputsManager.prototype.addVirtualJoystick = function () {
            this.add(new LIB.FreeCameraVirtualJoystickInput());
            return this;
        };
        return FreeCameraInputsManager;
    }(LIB.CameraInputsManager));
    LIB.FreeCameraInputsManager = FreeCameraInputsManager;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.freeCameraInputsManager.js.map
