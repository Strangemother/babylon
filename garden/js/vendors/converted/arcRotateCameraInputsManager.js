(function (LIB) {
    var ArcRotateCameraInputsManager = /** @class */ (function (_super) {
        __extends(ArcRotateCameraInputsManager, _super);
        function ArcRotateCameraInputsManager(camera) {
            return _super.call(this, camera) || this;
        }
        ArcRotateCameraInputsManager.prototype.addMouseWheel = function () {
            this.add(new LIB.ArcRotateCameraMouseWheelInput());
            return this;
        };
        ArcRotateCameraInputsManager.prototype.addPointers = function () {
            this.add(new LIB.ArcRotateCameraPointersInput());
            return this;
        };
        ArcRotateCameraInputsManager.prototype.addKeyboard = function () {
            this.add(new LIB.ArcRotateCameraKeyboardMoveInput());
            return this;
        };
        ArcRotateCameraInputsManager.prototype.addGamepad = function () {
            this.add(new LIB.ArcRotateCameraGamepadInput());
            return this;
        };
        ArcRotateCameraInputsManager.prototype.addVRDeviceOrientation = function () {
            this.add(new LIB.ArcRotateCameraVRDeviceOrientationInput());
            return this;
        };
        return ArcRotateCameraInputsManager;
    }(LIB.CameraInputsManager));
    LIB.ArcRotateCameraInputsManager = ArcRotateCameraInputsManager;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.arcRotateCameraInputsManager.js.map
