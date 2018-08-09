var BABYLON;
(function (BABYLON) {
    var AnaglyphFreeCamera = /** @class */ (function (_super) {
        __extends(AnaglyphFreeCamera, _super);
        function AnaglyphFreeCamera(name, position, interaxialDistance, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.setCameraRigMode(BABYLON.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance: interaxialDistance });
            return _this;
        }
        AnaglyphFreeCamera.prototype.getClassName = function () {
            return "AnaglyphFreeCamera";
        };
        return AnaglyphFreeCamera;
    }(BABYLON.FreeCamera));
    BABYLON.AnaglyphFreeCamera = AnaglyphFreeCamera;
    var AnaglyphArcRotateCamera = /** @class */ (function (_super) {
        __extends(AnaglyphArcRotateCamera, _super);
        function AnaglyphArcRotateCamera(name, alpha, beta, radius, target, interaxialDistance, scene) {
            var _this = _super.call(this, name, alpha, beta, radius, target, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.setCameraRigMode(BABYLON.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance: interaxialDistance });
            return _this;
        }
        AnaglyphArcRotateCamera.prototype.getClassName = function () {
            return "AnaglyphArcRotateCamera";
        };
        return AnaglyphArcRotateCamera;
    }(BABYLON.ArcRotateCamera));
    BABYLON.AnaglyphArcRotateCamera = AnaglyphArcRotateCamera;
    var AnaglyphGamepadCamera = /** @class */ (function (_super) {
        __extends(AnaglyphGamepadCamera, _super);
        function AnaglyphGamepadCamera(name, position, interaxialDistance, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.setCameraRigMode(BABYLON.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance: interaxialDistance });
            return _this;
        }
        AnaglyphGamepadCamera.prototype.getClassName = function () {
            return "AnaglyphGamepadCamera";
        };
        return AnaglyphGamepadCamera;
    }(BABYLON.GamepadCamera));
    BABYLON.AnaglyphGamepadCamera = AnaglyphGamepadCamera;
    var AnaglyphUniversalCamera = /** @class */ (function (_super) {
        __extends(AnaglyphUniversalCamera, _super);
        function AnaglyphUniversalCamera(name, position, interaxialDistance, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.setCameraRigMode(BABYLON.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance: interaxialDistance });
            return _this;
        }
        AnaglyphUniversalCamera.prototype.getClassName = function () {
            return "AnaglyphUniversalCamera";
        };
        return AnaglyphUniversalCamera;
    }(BABYLON.UniversalCamera));
    BABYLON.AnaglyphUniversalCamera = AnaglyphUniversalCamera;
    var StereoscopicFreeCamera = /** @class */ (function (_super) {
        __extends(StereoscopicFreeCamera, _super);
        function StereoscopicFreeCamera(name, position, interaxialDistance, isStereoscopicSideBySide, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.isStereoscopicSideBySide = isStereoscopicSideBySide;
            _this.setCameraRigMode(isStereoscopicSideBySide ? BABYLON.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : BABYLON.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, { interaxialDistance: interaxialDistance });
            return _this;
        }
        StereoscopicFreeCamera.prototype.getClassName = function () {
            return "StereoscopicFreeCamera";
        };
        return StereoscopicFreeCamera;
    }(BABYLON.FreeCamera));
    BABYLON.StereoscopicFreeCamera = StereoscopicFreeCamera;
    var StereoscopicArcRotateCamera = /** @class */ (function (_super) {
        __extends(StereoscopicArcRotateCamera, _super);
        function StereoscopicArcRotateCamera(name, alpha, beta, radius, target, interaxialDistance, isStereoscopicSideBySide, scene) {
            var _this = _super.call(this, name, alpha, beta, radius, target, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.isStereoscopicSideBySide = isStereoscopicSideBySide;
            _this.setCameraRigMode(isStereoscopicSideBySide ? BABYLON.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : BABYLON.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, { interaxialDistance: interaxialDistance });
            return _this;
        }
        StereoscopicArcRotateCamera.prototype.getClassName = function () {
            return "StereoscopicArcRotateCamera";
        };
        return StereoscopicArcRotateCamera;
    }(BABYLON.ArcRotateCamera));
    BABYLON.StereoscopicArcRotateCamera = StereoscopicArcRotateCamera;
    var StereoscopicGamepadCamera = /** @class */ (function (_super) {
        __extends(StereoscopicGamepadCamera, _super);
        function StereoscopicGamepadCamera(name, position, interaxialDistance, isStereoscopicSideBySide, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.isStereoscopicSideBySide = isStereoscopicSideBySide;
            _this.setCameraRigMode(isStereoscopicSideBySide ? BABYLON.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : BABYLON.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, { interaxialDistance: interaxialDistance });
            return _this;
        }
        StereoscopicGamepadCamera.prototype.getClassName = function () {
            return "StereoscopicGamepadCamera";
        };
        return StereoscopicGamepadCamera;
    }(BABYLON.GamepadCamera));
    BABYLON.StereoscopicGamepadCamera = StereoscopicGamepadCamera;
    var StereoscopicUniversalCamera = /** @class */ (function (_super) {
        __extends(StereoscopicUniversalCamera, _super);
        function StereoscopicUniversalCamera(name, position, interaxialDistance, isStereoscopicSideBySide, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.isStereoscopicSideBySide = isStereoscopicSideBySide;
            _this.setCameraRigMode(isStereoscopicSideBySide ? BABYLON.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : BABYLON.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, { interaxialDistance: interaxialDistance });
            return _this;
        }
        StereoscopicUniversalCamera.prototype.getClassName = function () {
            return "StereoscopicUniversalCamera";
        };
        return StereoscopicUniversalCamera;
    }(BABYLON.UniversalCamera));
    BABYLON.StereoscopicUniversalCamera = StereoscopicUniversalCamera;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.stereoscopicCameras.js.map
