(function (LIB) {
    var VRDeviceOrientationFreeCamera = /** @class */ (function (_super) {
        __extends(VRDeviceOrientationFreeCamera, _super);
        function VRDeviceOrientationFreeCamera(name, position, scene, compensateDistortion, vrCameraMetrics) {
            if (compensateDistortion === void 0) { compensateDistortion = true; }
            if (vrCameraMetrics === void 0) { vrCameraMetrics = LIB.VRCameraMetrics.GetDefault(); }
            var _this = _super.call(this, name, position, scene) || this;
            vrCameraMetrics.compensateDistortion = compensateDistortion;
            _this.setCameraRigMode(LIB.Camera.RIG_MODE_VR, { vrCameraMetrics: vrCameraMetrics });
            return _this;
        }
        VRDeviceOrientationFreeCamera.prototype.getClassName = function () {
            return "VRDeviceOrientationFreeCamera";
        };
        return VRDeviceOrientationFreeCamera;
    }(LIB.DeviceOrientationCamera));
    LIB.VRDeviceOrientationFreeCamera = VRDeviceOrientationFreeCamera;
    var VRDeviceOrientationGamepadCamera = /** @class */ (function (_super) {
        __extends(VRDeviceOrientationGamepadCamera, _super);
        function VRDeviceOrientationGamepadCamera(name, position, scene, compensateDistortion, vrCameraMetrics) {
            if (compensateDistortion === void 0) { compensateDistortion = true; }
            if (vrCameraMetrics === void 0) { vrCameraMetrics = LIB.VRCameraMetrics.GetDefault(); }
            var _this = _super.call(this, name, position, scene, compensateDistortion, vrCameraMetrics) || this;
            _this.inputs.addGamepad();
            return _this;
        }
        VRDeviceOrientationGamepadCamera.prototype.getClassName = function () {
            return "VRDeviceOrientationGamepadCamera";
        };
        return VRDeviceOrientationGamepadCamera;
    }(VRDeviceOrientationFreeCamera));
    LIB.VRDeviceOrientationGamepadCamera = VRDeviceOrientationGamepadCamera;
    var VRDeviceOrientationArcRotateCamera = /** @class */ (function (_super) {
        __extends(VRDeviceOrientationArcRotateCamera, _super);
        function VRDeviceOrientationArcRotateCamera(name, alpha, beta, radius, target, scene, compensateDistortion, vrCameraMetrics) {
            if (compensateDistortion === void 0) { compensateDistortion = true; }
            if (vrCameraMetrics === void 0) { vrCameraMetrics = LIB.VRCameraMetrics.GetDefault(); }
            var _this = _super.call(this, name, alpha, beta, radius, target, scene) || this;
            vrCameraMetrics.compensateDistortion = compensateDistortion;
            _this.setCameraRigMode(LIB.Camera.RIG_MODE_VR, { vrCameraMetrics: vrCameraMetrics });
            _this.inputs.addVRDeviceOrientation();
            return _this;
        }
        VRDeviceOrientationArcRotateCamera.prototype.getClassName = function () {
            return "VRDeviceOrientationArcRotateCamera";
        };
        return VRDeviceOrientationArcRotateCamera;
    }(LIB.ArcRotateCamera));
    LIB.VRDeviceOrientationArcRotateCamera = VRDeviceOrientationArcRotateCamera;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.vrDeviceOrientationCamera.js.map
