var BABYLON;
(function (BABYLON) {
    var VRDeviceOrientationFreeCamera = /** @class */ (function (_super) {
        __extends(VRDeviceOrientationFreeCamera, _super);
        function VRDeviceOrientationFreeCamera(name, position, scene, compensateDistortion, vrCameraMetrics) {
            if (compensateDistortion === void 0) { compensateDistortion = true; }
            if (vrCameraMetrics === void 0) { vrCameraMetrics = BABYLON.VRCameraMetrics.GetDefault(); }
            var _this = _super.call(this, name, position, scene) || this;
            vrCameraMetrics.compensateDistortion = compensateDistortion;
            _this.setCameraRigMode(BABYLON.Camera.RIG_MODE_VR, { vrCameraMetrics: vrCameraMetrics });
            return _this;
        }
        VRDeviceOrientationFreeCamera.prototype.getClassName = function () {
            return "VRDeviceOrientationFreeCamera";
        };
        return VRDeviceOrientationFreeCamera;
    }(BABYLON.DeviceOrientationCamera));
    BABYLON.VRDeviceOrientationFreeCamera = VRDeviceOrientationFreeCamera;
    var VRDeviceOrientationGamepadCamera = /** @class */ (function (_super) {
        __extends(VRDeviceOrientationGamepadCamera, _super);
        function VRDeviceOrientationGamepadCamera(name, position, scene, compensateDistortion, vrCameraMetrics) {
            if (compensateDistortion === void 0) { compensateDistortion = true; }
            if (vrCameraMetrics === void 0) { vrCameraMetrics = BABYLON.VRCameraMetrics.GetDefault(); }
            var _this = _super.call(this, name, position, scene, compensateDistortion, vrCameraMetrics) || this;
            _this.inputs.addGamepad();
            return _this;
        }
        VRDeviceOrientationGamepadCamera.prototype.getClassName = function () {
            return "VRDeviceOrientationGamepadCamera";
        };
        return VRDeviceOrientationGamepadCamera;
    }(VRDeviceOrientationFreeCamera));
    BABYLON.VRDeviceOrientationGamepadCamera = VRDeviceOrientationGamepadCamera;
    var VRDeviceOrientationArcRotateCamera = /** @class */ (function (_super) {
        __extends(VRDeviceOrientationArcRotateCamera, _super);
        function VRDeviceOrientationArcRotateCamera(name, alpha, beta, radius, target, scene, compensateDistortion, vrCameraMetrics) {
            if (compensateDistortion === void 0) { compensateDistortion = true; }
            if (vrCameraMetrics === void 0) { vrCameraMetrics = BABYLON.VRCameraMetrics.GetDefault(); }
            var _this = _super.call(this, name, alpha, beta, radius, target, scene) || this;
            vrCameraMetrics.compensateDistortion = compensateDistortion;
            _this.setCameraRigMode(BABYLON.Camera.RIG_MODE_VR, { vrCameraMetrics: vrCameraMetrics });
            _this.inputs.addVRDeviceOrientation();
            return _this;
        }
        VRDeviceOrientationArcRotateCamera.prototype.getClassName = function () {
            return "VRDeviceOrientationArcRotateCamera";
        };
        return VRDeviceOrientationArcRotateCamera;
    }(BABYLON.ArcRotateCamera));
    BABYLON.VRDeviceOrientationArcRotateCamera = VRDeviceOrientationArcRotateCamera;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.vrDeviceOrientationCamera.js.map
