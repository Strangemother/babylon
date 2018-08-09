var BABYLON;
(function (BABYLON) {
    var ArcRotateCameraInputsManager = /** @class */ (function (_super) {
        __extends(ArcRotateCameraInputsManager, _super);
        function ArcRotateCameraInputsManager(camera) {
            return _super.call(this, camera) || this;
        }
        ArcRotateCameraInputsManager.prototype.addMouseWheel = function () {
            this.add(new BABYLON.ArcRotateCameraMouseWheelInput());
            return this;
        };
        ArcRotateCameraInputsManager.prototype.addPointers = function () {
            this.add(new BABYLON.ArcRotateCameraPointersInput());
            return this;
        };
        ArcRotateCameraInputsManager.prototype.addKeyboard = function () {
            this.add(new BABYLON.ArcRotateCameraKeyboardMoveInput());
            return this;
        };
        ArcRotateCameraInputsManager.prototype.addGamepad = function () {
            this.add(new BABYLON.ArcRotateCameraGamepadInput());
            return this;
        };
        ArcRotateCameraInputsManager.prototype.addVRDeviceOrientation = function () {
            this.add(new BABYLON.ArcRotateCameraVRDeviceOrientationInput());
            return this;
        };
        return ArcRotateCameraInputsManager;
    }(BABYLON.CameraInputsManager));
    BABYLON.ArcRotateCameraInputsManager = ArcRotateCameraInputsManager;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.arcRotateCameraInputsManager.js.map
