

var LIB;
(function (LIB) {
    /**
    * Defines the types of pose enabled controllers that are supported
    */
    var PoseEnabledControllerType;
    (function (PoseEnabledControllerType) {
        /**
         * HTC Vive
         */
        PoseEnabledControllerType[PoseEnabledControllerType["VIVE"] = 0] = "VIVE";
        /**
         * Oculus Rift
         */
        PoseEnabledControllerType[PoseEnabledControllerType["OCULUS"] = 1] = "OCULUS";
        /**
         * Windows mixed reality
         */
        PoseEnabledControllerType[PoseEnabledControllerType["WINDOWS"] = 2] = "WINDOWS";
        /**
         * Samsung gear VR
         */
        PoseEnabledControllerType[PoseEnabledControllerType["GEAR_VR"] = 3] = "GEAR_VR";
        /**
         * Google Daydream
         */
        PoseEnabledControllerType[PoseEnabledControllerType["DAYDREAM"] = 4] = "DAYDREAM";
        /**
         * Generic
         */
        PoseEnabledControllerType[PoseEnabledControllerType["GENERIC"] = 5] = "GENERIC";
    })(PoseEnabledControllerType = LIB.PoseEnabledControllerType || (LIB.PoseEnabledControllerType = {}));
    /**
     * Defines the PoseEnabledControllerHelper object that is used initialize a gamepad as the controller type it is specified as (eg. windows mixed reality controller)
     */
    var PoseEnabledControllerHelper = /** @class */ (function () {
        function PoseEnabledControllerHelper() {
        }
        /**
         * Initializes a gamepad as the controller type it is specified as (eg. windows mixed reality controller)
         * @param vrGamepad the gamepad to initialized
         * @returns a vr controller of the type the gamepad identified as
         */
        PoseEnabledControllerHelper.InitiateController = function (vrGamepad) {
            // Oculus Touch
            if (vrGamepad.id.indexOf('Oculus Touch') !== -1) {
                return new LIB.OculusTouchController(vrGamepad);
            }
            // Windows Mixed Reality controllers 
            else if (vrGamepad.id.indexOf(LIB.WindowsMotionController.GAMEPAD_ID_PREFIX) === 0) {
                return new LIB.WindowsMotionController(vrGamepad);
            }
            // HTC Vive
            else if (vrGamepad.id.toLowerCase().indexOf('openvr') !== -1) {
                return new LIB.ViveController(vrGamepad);
            }
            // Samsung/Oculus Gear VR
            else if (vrGamepad.id.indexOf(LIB.GearVRController.GAMEPAD_ID_PREFIX) === 0) {
                return new LIB.GearVRController(vrGamepad);
            }
            // Google Daydream
            else if (vrGamepad.id.indexOf(LIB.DaydreamController.GAMEPAD_ID_PREFIX) === 0) {
                return new LIB.DaydreamController(vrGamepad);
            }
            // Generic 
            else {
                return new LIB.GenericController(vrGamepad);
            }
        };
        return PoseEnabledControllerHelper;
    }());
    LIB.PoseEnabledControllerHelper = PoseEnabledControllerHelper;
    /**
     * Defines the PoseEnabledController object that contains state of a vr capable controller
     */
    var PoseEnabledController = /** @class */ (function (_super) {
        __extends(PoseEnabledController, _super);
        /**
         * Creates a new PoseEnabledController from a gamepad
         * @param browserGamepad the gamepad that the PoseEnabledController should be created from
         */
        function PoseEnabledController(browserGamepad) {
            var _this = _super.call(this, browserGamepad.id, browserGamepad.index, browserGamepad) || this;
            // Represents device position and rotation in room space. Should only be used to help calculate LIB space values
            _this._deviceRoomPosition = LIB.Vector3.Zero();
            _this._deviceRoomRotationQuaternion = new LIB.Quaternion();
            /**
             * The device position in LIB space
             */
            _this.devicePosition = LIB.Vector3.Zero();
            /**
             * The device rotation in LIB space
             */
            _this.deviceRotationQuaternion = new LIB.Quaternion();
            /**
             * The scale factor of the device in LIB space
             */
            _this.deviceScaleFactor = 1;
            _this._leftHandSystemQuaternion = new LIB.Quaternion();
            /**
             * Internal, matrix used to convert room space to LIB space
             */
            _this._deviceToWorld = LIB.Matrix.Identity();
            /**
             * Node to be used when casting a ray from the controller
             */
            _this._pointingPoseNode = null;
            _this._workingMatrix = LIB.Matrix.Identity();
            /**
             * @hidden
             */
            _this._meshAttachedObservable = new LIB.Observable();
            _this.type = LIB.Gamepad.POSE_ENABLED;
            _this.controllerType = PoseEnabledControllerType.GENERIC;
            _this.position = LIB.Vector3.Zero();
            _this.rotationQuaternion = new LIB.Quaternion();
            _this._calculatedPosition = LIB.Vector3.Zero();
            _this._calculatedRotation = new LIB.Quaternion();
            LIB.Quaternion.RotationYawPitchRollToRef(Math.PI, 0, 0, _this._leftHandSystemQuaternion);
            return _this;
        }
        /**
         * Updates the state of the pose enbaled controller and mesh based on the current position and rotation of the controller
         */
        PoseEnabledController.prototype.update = function () {
            _super.prototype.update.call(this);
            var pose = this.browserGamepad.pose;
            this.updateFromDevice(pose);
            LIB.Vector3.TransformCoordinatesToRef(this._calculatedPosition, this._deviceToWorld, this.devicePosition);
            this._deviceToWorld.getRotationMatrixToRef(this._workingMatrix);
            LIB.Quaternion.FromRotationMatrixToRef(this._workingMatrix, this.deviceRotationQuaternion);
            this.deviceRotationQuaternion.multiplyInPlace(this._calculatedRotation);
            if (this._mesh) {
                this._mesh.position.copyFrom(this.devicePosition);
                if (this._mesh.rotationQuaternion) {
                    this._mesh.rotationQuaternion.copyFrom(this.deviceRotationQuaternion);
                }
            }
        };
        /**
         * Updates the state of the pose enbaled controller based on the raw pose data from the device
         * @param poseData raw pose fromthe device
         */
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
        /**
         * Attaches a mesh to the controller
         * @param mesh the mesh to be attached
         */
        PoseEnabledController.prototype.attachToMesh = function (mesh) {
            if (this._mesh) {
                this._mesh.parent = null;
            }
            this._mesh = mesh;
            if (this._poseControlledCamera) {
                this._mesh.parent = this._poseControlledCamera;
            }
            if (!this._mesh.rotationQuaternion) {
                this._mesh.rotationQuaternion = new LIB.Quaternion();
            }
            this._meshAttachedObservable.notifyObservers(mesh);
        };
        /**
         * Attaches the controllers mesh to a camera
         * @param camera the camera the mesh should be attached to
         */
        PoseEnabledController.prototype.attachToPoseControlledCamera = function (camera) {
            this._poseControlledCamera = camera;
            if (this._mesh) {
                this._mesh.parent = this._poseControlledCamera;
            }
        };
        /**
         * Disposes of the controller
         */
        PoseEnabledController.prototype.dispose = function () {
            if (this._mesh) {
                this._mesh.dispose();
            }
            this._mesh = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(PoseEnabledController.prototype, "mesh", {
            /**
             * The mesh that is attached to the controller
             */
            get: function () {
                return this._mesh;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the ray of the controller in the direction the controller is pointing
         * @param length the length the resulting ray should be
         * @returns a ray in the direction the controller is pointing
         */
        PoseEnabledController.prototype.getForwardRay = function (length) {
            if (length === void 0) { length = 100; }
            if (!this.mesh) {
                return new LIB.Ray(LIB.Vector3.Zero(), new LIB.Vector3(0, 0, 1), length);
            }
            var m = this._pointingPoseNode ? this._pointingPoseNode.getWorldMatrix() : this.mesh.getWorldMatrix();
            var origin = m.getTranslation();
            var forward = new LIB.Vector3(0, 0, -1);
            var forwardWorld = LIB.Vector3.TransformNormal(forward, m);
            var direction = LIB.Vector3.Normalize(forwardWorld);
            return new LIB.Ray(origin, direction, length);
        };
        /**
         * Name of the child mesh that can be used to cast a ray from the controller
         */
        PoseEnabledController.POINTING_POSE = "POINTING_POSE";
        return PoseEnabledController;
    }(LIB.Gamepad));
    LIB.PoseEnabledController = PoseEnabledController;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.poseEnabledController.js.map
//# sourceMappingURL=LIB.poseEnabledController.js.map
