var BABYLON;
(function (BABYLON) {
    // We're mainly based on the logic defined into the FreeCamera code
    var DeviceOrientationCamera = /** @class */ (function (_super) {
        __extends(DeviceOrientationCamera, _super);
        function DeviceOrientationCamera(name, position, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this._quaternionCache = new BABYLON.Quaternion();
            _this.inputs.addDeviceOrientation();
            return _this;
        }
        DeviceOrientationCamera.prototype.getClassName = function () {
            return "DeviceOrientationCamera";
        };
        DeviceOrientationCamera.prototype._checkInputs = function () {
            _super.prototype._checkInputs.call(this);
            this._quaternionCache.copyFrom(this.rotationQuaternion);
            if (this._initialQuaternion) {
                this._initialQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
            }
        };
        DeviceOrientationCamera.prototype.resetToCurrentRotation = function (axis) {
            var _this = this;
            if (axis === void 0) { axis = BABYLON.Axis.Y; }
            //can only work if this camera has a rotation quaternion already.
            if (!this.rotationQuaternion)
                return;
            if (!this._initialQuaternion) {
                this._initialQuaternion = new BABYLON.Quaternion();
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
    }(BABYLON.FreeCamera));
    BABYLON.DeviceOrientationCamera = DeviceOrientationCamera;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.deviceOrientationCamera.js.map
