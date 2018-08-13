
var LIB;
(function (LIB) {
    /**
     * Takes information about the orientation of the device as reported by the deviceorientation event to orient the camera.
     * Screen rotation is taken into account.
     */
    var FreeCameraDeviceOrientationInput = /** @class */ (function () {
        function FreeCameraDeviceOrientationInput() {
            var _this = this;
            this._screenOrientationAngle = 0;
            this._screenQuaternion = new LIB.Quaternion();
            this._alpha = 0;
            this._beta = 0;
            this._gamma = 0;
            this._orientationChanged = function () {
                _this._screenOrientationAngle = (window.orientation !== undefined ? +window.orientation : (window.screen.orientation && window.screen.orientation['angle'] ? window.screen.orientation.angle : 0));
                _this._screenOrientationAngle = -LIB.Tools.ToRadians(_this._screenOrientationAngle / 2);
                _this._screenQuaternion.copyFromFloats(0, Math.sin(_this._screenOrientationAngle), 0, Math.cos(_this._screenOrientationAngle));
            };
            this._deviceOrientation = function (evt) {
                _this._alpha = evt.alpha !== null ? evt.alpha : 0;
                _this._beta = evt.beta !== null ? evt.beta : 0;
                _this._gamma = evt.gamma !== null ? evt.gamma : 0;
            };
            this._constantTranform = new LIB.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
            this._orientationChanged();
        }
        Object.defineProperty(FreeCameraDeviceOrientationInput.prototype, "camera", {
            get: function () {
                return this._camera;
            },
            set: function (camera) {
                this._camera = camera;
                if (this._camera != null && !this._camera.rotationQuaternion) {
                    this._camera.rotationQuaternion = new LIB.Quaternion();
                }
            },
            enumerable: true,
            configurable: true
        });
        FreeCameraDeviceOrientationInput.prototype.attachControl = function (element, noPreventDefault) {
            window.addEventListener("orientationchange", this._orientationChanged);
            window.addEventListener("deviceorientation", this._deviceOrientation);
            //In certain cases, the attach control is called AFTER orientation was changed,
            //So this is needed.
            this._orientationChanged();
        };
        FreeCameraDeviceOrientationInput.prototype.detachControl = function (element) {
            window.removeEventListener("orientationchange", this._orientationChanged);
            window.removeEventListener("deviceorientation", this._deviceOrientation);
        };
        FreeCameraDeviceOrientationInput.prototype.checkInputs = function () {
            //if no device orientation provided, don't update the rotation.
            //Only testing against alpha under the assumption thatnorientation will never be so exact when set.
            if (!this._alpha)
                return;
            LIB.Quaternion.RotationYawPitchRollToRef(LIB.Tools.ToRadians(this._alpha), LIB.Tools.ToRadians(this._beta), -LIB.Tools.ToRadians(this._gamma), this.camera.rotationQuaternion);
            this._camera.rotationQuaternion.multiplyInPlace(this._screenQuaternion);
            this._camera.rotationQuaternion.multiplyInPlace(this._constantTranform);
            //Mirror on XY Plane
            this._camera.rotationQuaternion.z *= -1;
            this._camera.rotationQuaternion.w *= -1;
        };
        FreeCameraDeviceOrientationInput.prototype.getClassName = function () {
            return "FreeCameraDeviceOrientationInput";
        };
        FreeCameraDeviceOrientationInput.prototype.getSimpleName = function () {
            return "deviceOrientation";
        };
        return FreeCameraDeviceOrientationInput;
    }());
    LIB.FreeCameraDeviceOrientationInput = FreeCameraDeviceOrientationInput;
    LIB.CameraInputTypes["FreeCameraDeviceOrientationInput"] = FreeCameraDeviceOrientationInput;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.freeCameraDeviceOrientationInput.js.map
//# sourceMappingURL=LIB.freeCameraDeviceOrientationInput.js.map
