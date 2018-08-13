

var LIB;
(function (LIB) {
    // We're mainly based on the logic defined into the FreeCamera code
    /**
     * This is a camera specifically designed to react to device orientation events such as a modern mobile device
     * being tilted forward or back and left or right.
     */
    var DeviceOrientationCamera = /** @class */ (function (_super) {
        __extends(DeviceOrientationCamera, _super);
        /**
         * Creates a new device orientation camera
         * @param name The name of the camera
         * @param position The start position camera
         * @param scene The scene the camera belongs to
         */
        function DeviceOrientationCamera(name, position, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this._quaternionCache = new LIB.Quaternion();
            _this.inputs.addDeviceOrientation();
            return _this;
        }
        /**
         * Gets the current instance class name ("DeviceOrientationCamera").
         * This helps avoiding instanceof at run time.
         * @returns the class name
         */
        DeviceOrientationCamera.prototype.getClassName = function () {
            return "DeviceOrientationCamera";
        };
        /**
         * Checks and applies the current values of the inputs to the camera. (Internal use only)
         */
        DeviceOrientationCamera.prototype._checkInputs = function () {
            _super.prototype._checkInputs.call(this);
            this._quaternionCache.copyFrom(this.rotationQuaternion);
            if (this._initialQuaternion) {
                this._initialQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
            }
        };
        /**
         * Reset the camera to its default orientation on the specified axis only.
         * @param axis The axis to reset
         */
        DeviceOrientationCamera.prototype.resetToCurrentRotation = function (axis) {
            var _this = this;
            if (axis === void 0) { axis = LIB.Axis.Y; }
            //can only work if this camera has a rotation quaternion already.
            if (!this.rotationQuaternion)
                return;
            if (!this._initialQuaternion) {
                this._initialQuaternion = new LIB.Quaternion();
            }
            this._initialQuaternion.copyFrom(this._quaternionCache || this.rotationQuaternion);
            ['x', 'y', 'z'].forEach(function (axisName) {
                if (!axis[axisName]) {
                    _this._initialQuaternion[axisName] = 0;
                }
                else {
                    _this._initialQuaternion[axisName] *= -1;
                }
            });
            this._initialQuaternion.normalize();
            //force rotation update
            this._initialQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
        };
        return DeviceOrientationCamera;
    }(LIB.FreeCamera));
    LIB.DeviceOrientationCamera = DeviceOrientationCamera;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.deviceOrientationCamera.js.map
//# sourceMappingURL=LIB.deviceOrientationCamera.js.map
