

var LIB;
(function (LIB) {
    /**
     * Camera used to simulate anaglyphic rendering (based on FreeCamera)
     */
    var AnaglyphFreeCamera = /** @class */ (function (_super) {
        __extends(AnaglyphFreeCamera, _super);
        /**
         * Creates a new AnaglyphFreeCamera
         * @param name defines camera name
         * @param position defines initial position
         * @param interaxialDistance defines distance between each color axis
         * @param scene defines the hosting scene
         */
        function AnaglyphFreeCamera(name, position, interaxialDistance, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.setCameraRigMode(LIB.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance: interaxialDistance });
            return _this;
        }
        /**
         * Gets camera class name
         * @returns AnaglyphFreeCamera
         */
        AnaglyphFreeCamera.prototype.getClassName = function () {
            return "AnaglyphFreeCamera";
        };
        return AnaglyphFreeCamera;
    }(LIB.FreeCamera));
    LIB.AnaglyphFreeCamera = AnaglyphFreeCamera;
    /**
     * Camera used to simulate anaglyphic rendering (based on ArcRotateCamera)
     */
    var AnaglyphArcRotateCamera = /** @class */ (function (_super) {
        __extends(AnaglyphArcRotateCamera, _super);
        /**
         * Creates a new AnaglyphArcRotateCamera
         * @param name defines camera name
         * @param alpha defines alpha angle (in radians)
         * @param beta defines beta angle (in radians)
         * @param radius defines radius
         * @param target defines camera target
         * @param interaxialDistance defines distance between each color axis
         * @param scene defines the hosting scene
         */
        function AnaglyphArcRotateCamera(name, alpha, beta, radius, target, interaxialDistance, scene) {
            var _this = _super.call(this, name, alpha, beta, radius, target, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.setCameraRigMode(LIB.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance: interaxialDistance });
            return _this;
        }
        /**
         * Gets camera class name
         * @returns AnaglyphArcRotateCamera
         */
        AnaglyphArcRotateCamera.prototype.getClassName = function () {
            return "AnaglyphArcRotateCamera";
        };
        return AnaglyphArcRotateCamera;
    }(LIB.ArcRotateCamera));
    LIB.AnaglyphArcRotateCamera = AnaglyphArcRotateCamera;
    /**
     * Camera used to simulate anaglyphic rendering (based on GamepadCamera)
     */
    var AnaglyphGamepadCamera = /** @class */ (function (_super) {
        __extends(AnaglyphGamepadCamera, _super);
        /**
         * Creates a new AnaglyphGamepadCamera
         * @param name defines camera name
         * @param position defines initial position
         * @param interaxialDistance defines distance between each color axis
         * @param scene defines the hosting scene
         */
        function AnaglyphGamepadCamera(name, position, interaxialDistance, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.setCameraRigMode(LIB.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance: interaxialDistance });
            return _this;
        }
        /**
         * Gets camera class name
         * @returns AnaglyphGamepadCamera
         */
        AnaglyphGamepadCamera.prototype.getClassName = function () {
            return "AnaglyphGamepadCamera";
        };
        return AnaglyphGamepadCamera;
    }(LIB.GamepadCamera));
    LIB.AnaglyphGamepadCamera = AnaglyphGamepadCamera;
    /**
     * Camera used to simulate anaglyphic rendering (based on UniversalCamera)
     */
    var AnaglyphUniversalCamera = /** @class */ (function (_super) {
        __extends(AnaglyphUniversalCamera, _super);
        /**
         * Creates a new AnaglyphUniversalCamera
         * @param name defines camera name
         * @param position defines initial position
         * @param interaxialDistance defines distance between each color axis
         * @param scene defines the hosting scene
         */
        function AnaglyphUniversalCamera(name, position, interaxialDistance, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.setCameraRigMode(LIB.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance: interaxialDistance });
            return _this;
        }
        /**
         * Gets camera class name
         * @returns AnaglyphUniversalCamera
         */
        AnaglyphUniversalCamera.prototype.getClassName = function () {
            return "AnaglyphUniversalCamera";
        };
        return AnaglyphUniversalCamera;
    }(LIB.UniversalCamera));
    LIB.AnaglyphUniversalCamera = AnaglyphUniversalCamera;
    /**
     * Camera used to simulate stereoscopic rendering (based on FreeCamera)
     */
    var StereoscopicFreeCamera = /** @class */ (function (_super) {
        __extends(StereoscopicFreeCamera, _super);
        /**
         * Creates a new StereoscopicFreeCamera
         * @param name defines camera name
         * @param position defines initial position
         * @param interaxialDistance defines distance between each color axis
         * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
         * @param scene defines the hosting scene
         */
        function StereoscopicFreeCamera(name, position, interaxialDistance, isStereoscopicSideBySide, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.isStereoscopicSideBySide = isStereoscopicSideBySide;
            _this.setCameraRigMode(isStereoscopicSideBySide ? LIB.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : LIB.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, { interaxialDistance: interaxialDistance });
            return _this;
        }
        /**
         * Gets camera class name
         * @returns StereoscopicFreeCamera
         */
        StereoscopicFreeCamera.prototype.getClassName = function () {
            return "StereoscopicFreeCamera";
        };
        return StereoscopicFreeCamera;
    }(LIB.FreeCamera));
    LIB.StereoscopicFreeCamera = StereoscopicFreeCamera;
    /**
     * Camera used to simulate stereoscopic rendering (based on ArcRotateCamera)
     */
    var StereoscopicArcRotateCamera = /** @class */ (function (_super) {
        __extends(StereoscopicArcRotateCamera, _super);
        /**
         * Creates a new StereoscopicArcRotateCamera
         * @param name defines camera name
         * @param alpha defines alpha angle (in radians)
         * @param beta defines beta angle (in radians)
         * @param radius defines radius
         * @param target defines camera target
         * @param interaxialDistance defines distance between each color axis
         * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
         * @param scene defines the hosting scene
         */
        function StereoscopicArcRotateCamera(name, alpha, beta, radius, target, interaxialDistance, isStereoscopicSideBySide, scene) {
            var _this = _super.call(this, name, alpha, beta, radius, target, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.isStereoscopicSideBySide = isStereoscopicSideBySide;
            _this.setCameraRigMode(isStereoscopicSideBySide ? LIB.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : LIB.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, { interaxialDistance: interaxialDistance });
            return _this;
        }
        /**
         * Gets camera class name
         * @returns StereoscopicArcRotateCamera
         */
        StereoscopicArcRotateCamera.prototype.getClassName = function () {
            return "StereoscopicArcRotateCamera";
        };
        return StereoscopicArcRotateCamera;
    }(LIB.ArcRotateCamera));
    LIB.StereoscopicArcRotateCamera = StereoscopicArcRotateCamera;
    /**
     * Camera used to simulate stereoscopic rendering (based on GamepadCamera)
     */
    var StereoscopicGamepadCamera = /** @class */ (function (_super) {
        __extends(StereoscopicGamepadCamera, _super);
        /**
         * Creates a new StereoscopicGamepadCamera
         * @param name defines camera name
         * @param position defines initial position
         * @param interaxialDistance defines distance between each color axis
         * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
         * @param scene defines the hosting scene
         */
        function StereoscopicGamepadCamera(name, position, interaxialDistance, isStereoscopicSideBySide, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.isStereoscopicSideBySide = isStereoscopicSideBySide;
            _this.setCameraRigMode(isStereoscopicSideBySide ? LIB.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : LIB.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, { interaxialDistance: interaxialDistance });
            return _this;
        }
        /**
         * Gets camera class name
         * @returns StereoscopicGamepadCamera
         */
        StereoscopicGamepadCamera.prototype.getClassName = function () {
            return "StereoscopicGamepadCamera";
        };
        return StereoscopicGamepadCamera;
    }(LIB.GamepadCamera));
    LIB.StereoscopicGamepadCamera = StereoscopicGamepadCamera;
    /**
     * Camera used to simulate stereoscopic rendering (based on UniversalCamera)
     */
    var StereoscopicUniversalCamera = /** @class */ (function (_super) {
        __extends(StereoscopicUniversalCamera, _super);
        /**
         * Creates a new StereoscopicUniversalCamera
         * @param name defines camera name
         * @param position defines initial position
         * @param interaxialDistance defines distance between each color axis
         * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
         * @param scene defines the hosting scene
         */
        function StereoscopicUniversalCamera(name, position, interaxialDistance, isStereoscopicSideBySide, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.interaxialDistance = interaxialDistance;
            _this.isStereoscopicSideBySide = isStereoscopicSideBySide;
            _this.setCameraRigMode(isStereoscopicSideBySide ? LIB.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : LIB.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, { interaxialDistance: interaxialDistance });
            return _this;
        }
        /**
         * Gets camera class name
         * @returns StereoscopicUniversalCamera
         */
        StereoscopicUniversalCamera.prototype.getClassName = function () {
            return "StereoscopicUniversalCamera";
        };
        return StereoscopicUniversalCamera;
    }(LIB.UniversalCamera));
    LIB.StereoscopicUniversalCamera = StereoscopicUniversalCamera;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.stereoscopicCameras.js.map
//# sourceMappingURL=LIB.stereoscopicCameras.js.map
