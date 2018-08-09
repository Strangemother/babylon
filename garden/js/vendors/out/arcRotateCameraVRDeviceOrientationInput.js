var BABYLON;
(function (BABYLON) {
    var ArcRotateCameraVRDeviceOrientationInput = /** @class */ (function () {
        function ArcRotateCameraVRDeviceOrientationInput() {
            this.alphaCorrection = 1;
            this.betaCorrection = 1;
            this.gammaCorrection = 1;
            this._alpha = 0;
            this._gamma = 0;
            this._dirty = false;
            this._deviceOrientationHandler = this._onOrientationEvent.bind(this);
        }
        ArcRotateCameraVRDeviceOrientationInput.prototype.attachControl = function (element, noPreventDefault) {
            this.camera.attachControl(element, noPreventDefault);
            window.addEventListener("deviceorientation", this._deviceOrientationHandler);
        };
        ArcRotateCameraVRDeviceOrientationInput.prototype._onOrientationEvent = function (evt) {
            if (evt.alpha !== null) {
                this._alpha = +evt.alpha | 0;
            }
            if (evt.gamma !== null) {
                this._gamma = +evt.gamma | 0;
            }
            this._dirty = true;
        };
        ArcRotateCameraVRDeviceOrientationInput.prototype.checkInputs = function () {
            if (this._dirty) {
                this._dirty = false;
                if (this._gamma < 0) {
                    this._gamma = 180 + this._gamma;
                }
                this.camera.alpha = (-this._alpha / 180.0 * Math.PI) % Math.PI * 2;
                this.camera.beta = (this._gamma / 180.0 * Math.PI);
            }
        };
        ArcRotateCameraVRDeviceOrientationInput.prototype.detachControl = function (element) {
            window.removeEventListener("deviceorientation", this._deviceOrientationHandler);
        };
        ArcRotateCameraVRDeviceOrientationInput.prototype.getClassName = function () {
            return "ArcRotateCameraVRDeviceOrientationInput";
        };
        ArcRotateCameraVRDeviceOrientationInput.prototype.getSimpleName = function () {
            return "VRDeviceOrientation";
        };
        return ArcRotateCameraVRDeviceOrientationInput;
    }());
    BABYLON.ArcRotateCameraVRDeviceOrientationInput = ArcRotateCameraVRDeviceOrientationInput;
    BABYLON.CameraInputTypes["ArcRotateCameraVRDeviceOrientationInput"] = ArcRotateCameraVRDeviceOrientationInput;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.arcRotateCameraVRDeviceOrientationInput.js.map
