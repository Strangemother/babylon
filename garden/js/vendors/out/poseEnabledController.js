var BABYLON;
(function (BABYLON) {
    var PoseEnabledControllerType;
    (function (PoseEnabledControllerType) {
        PoseEnabledControllerType[PoseEnabledControllerType["VIVE"] = 0] = "VIVE";
        PoseEnabledControllerType[PoseEnabledControllerType["OCULUS"] = 1] = "OCULUS";
        PoseEnabledControllerType[PoseEnabledControllerType["WINDOWS"] = 2] = "WINDOWS";
        PoseEnabledControllerType[PoseEnabledControllerType["GENERIC"] = 3] = "GENERIC";
    })(PoseEnabledControllerType = BABYLON.PoseEnabledControllerType || (BABYLON.PoseEnabledControllerType = {}));
    var PoseEnabledControllerHelper = /** @class */ (function () {
        function PoseEnabledControllerHelper() {
        }
        PoseEnabledControllerHelper.InitiateController = function (vrGamepad) {
            // Oculus Touch
            if (vrGamepad.id.indexOf('Oculus Touch') !== -1) {
                return new BABYLON.OculusTouchController(vrGamepad);
            }
            else if (vrGamepad.id.indexOf(BABYLON.WindowsMotionController.GAMEPAD_ID_PREFIX) === 0) {
                return new BABYLON.WindowsMotionController(vrGamepad);
            }
            else if (vrGamepad.id.toLowerCase().indexOf('openvr') !== -1) {
                return new BABYLON.ViveController(vrGamepad);
            }
            else {
                return new BABYLON.GenericController(vrGamepad);
            }
        };
        return PoseEnabledControllerHelper;
    }());
    BABYLON.PoseEnabledControllerHelper = PoseEnabledControllerHelper;
    var PoseEnabledController = /** @class */ (function (_super) {
        __extends(PoseEnabledController, _super);
        function PoseEnabledController(browserGamepad) {
            var _this = _super.call(this, browserGamepad.id, browserGamepad.index, browserGamepad) || this;
            // Represents device position and rotation in room space. Should only be used to help calculate babylon space values
            _this._deviceRoomPosition = BABYLON.Vector3.Zero();
            _this._deviceRoomRotationQuaternion = new BABYLON.Quaternion();
            // Represents device position and rotation in babylon space
            _this.devicePosition = BABYLON.Vector3.Zero();
            _this.deviceRotationQuaternion = new BABYLON.Quaternion();
            _this.deviceScaleFactor = 1;
            _this._leftHandSystemQuaternion = new BABYLON.Quaternion();
            _this._deviceToWorld = BABYLON.Matrix.Identity();
            _this._workingMatrix = BABYLON.Matrix.Identity();
            _this.type = BABYLON.Gamepad.POSE_ENABLED;
            _this.controllerType = PoseEnabledControllerType.GENERIC;
            _this.position = BABYLON.Vector3.Zero();
            _this.rotationQuaternion = new BABYLON.Quaternion();
            _this._calculatedPosition = BABYLON.Vector3.Zero();
            _this._calculatedRotation = new BABYLON.Quaternion();
            BABYLON.Quaternion.RotationYawPitchRollToRef(Math.PI, 0, 0, _this._leftHandSystemQuaternion);
            return _this;
        }
        PoseEnabledController.prototype.update = function () {
            _super.prototype.update.call(this);
            var pose = this.browserGamepad.pose;
            this.updateFromDevice(pose);
            BABYLON.Vector3.TransformCoordinatesToRef(this._calculatedPosition, this._deviceToWorld, this.devicePosition);
            this._deviceToWorld.getRotationMatrixToRef(this._workingMatrix);
            BABYLON.Quaternion.FromRotationMatrixToRef(this._workingMatrix, this.deviceRotationQuaternion);
            this.deviceRotationQuaternion.multiplyInPlace(this._calculatedRotation);
            if (this._mesh) {
                this._mesh.position.copyFrom(this.devicePosition);
                if (this._mesh.rotationQuaternion) {
                    this._mesh.rotationQuaternion.copyFrom(this.deviceRotationQuaternion);
                }
            }
        };
        PoseEnabledController.prototype.updateFromDevice = function (poseData) {
            if (poseData) {
                this.rawPose = poseData;
                if (poseData.position) {
                    this._deviceRoomPosition.copyFromFloats(poseData.position[0], poseData.position[1], -poseData.position[2]);
                    if (this._mesh && this._mesh.getScene().useRightHandedSystem) {
                        this._deviceRoomPosition.z *= -1;
                    }
                    this._deviceRoomPosition.scaleToRef(this.deviceScaleFactor, this._calculatedPosition);
                    this._calculatedPosition.addInPlace(this.position);
                }
                var pose = this.rawPose;
                if (poseData.orientation && pose.orientation) {
                    this._deviceRoomRotationQuaternion.copyFromFloats(pose.orientation[0], pose.orientation[1], -pose.orientation[2], -pose.orientation[3]);
                    if (this._mesh) {
                        if (this._mesh.getScene().useRightHandedSystem) {
                            this._deviceRoomRotationQuaternion.z *= -1;
                            this._deviceRoomRotationQuaternion.w *= -1;
                        }
                        else {
                            this._deviceRoomRotationQuaternion.multiplyToRef(this._leftHandSystemQuaternion, this._deviceRoomRotationQuaternion);
                        }
                    }
                    // if the camera is set, rotate to the camera's rotation
                    this._deviceRoomRotationQuaternion.multiplyToRef(this.rotationQuaternion, this._calculatedRotation);
                }
            }
        };
        PoseEnabledController.prototype.attachToMesh = function (mesh) {
            if (this._mesh) {
                this._mesh.parent = null;
            }
            this._mesh = mesh;
            if (this._poseControlledCamera) {
                this._mesh.parent = this._poseControlledCamera;
            }
            if (!this._mesh.rotationQuaternion) {
                this._mesh.rotationQuaternion = new BABYLON.Quaternion();
            }
        };
        PoseEnabledController.prototype.attachToPoseControlledCamera = function (camera) {
            this._poseControlledCamera = camera;
            if (this._mesh) {
                this._mesh.parent = this._poseControlledCamera;
            }
        };
        PoseEnabledController.prototype.dispose = function () {
            if (this._mesh) {
                this._mesh.dispose();
            }
            this._mesh = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(PoseEnabledController.prototype, "mesh", {
            get: function () {
                return this._mesh;
            },
            enumerable: true,
            configurable: true
        });
        PoseEnabledController.prototype.getForwardRay = function (length) {
            if (length === void 0) { length = 100; }
            if (!this.mesh) {
                return new BABYLON.Ray(BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, 1), length);
            }
            var m = this.mesh.getWorldMatrix();
            var origin = m.getTranslation();
            var forward = new BABYLON.Vector3(0, 0, -1);
            var forwardWorld = BABYLON.Vector3.TransformNormal(forward, m);
            var direction = BABYLON.Vector3.Normalize(forwardWorld);
            return new BABYLON.Ray(origin, direction, length);
        };
        return PoseEnabledController;
    }(BABYLON.Gamepad));
    BABYLON.PoseEnabledController = PoseEnabledController;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.poseEnabledController.js.map
