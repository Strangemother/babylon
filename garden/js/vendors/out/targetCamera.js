var BABYLON;
(function (BABYLON) {
    var TargetCamera = /** @class */ (function (_super) {
        __extends(TargetCamera, _super);
        function TargetCamera(name, position, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.cameraDirection = new BABYLON.Vector3(0, 0, 0);
            _this.cameraRotation = new BABYLON.Vector2(0, 0);
            _this.rotation = new BABYLON.Vector3(0, 0, 0);
            _this.speed = 2.0;
            _this.noRotationConstraint = false;
            _this.lockedTarget = null;
            _this._currentTarget = BABYLON.Vector3.Zero();
            _this._viewMatrix = BABYLON.Matrix.Zero();
            _this._camMatrix = BABYLON.Matrix.Zero();
            _this._cameraTransformMatrix = BABYLON.Matrix.Zero();
            _this._cameraRotationMatrix = BABYLON.Matrix.Zero();
            _this._referencePoint = new BABYLON.Vector3(0, 0, 1);
            _this._currentUpVector = new BABYLON.Vector3(0, 1, 0);
            _this._transformedReferencePoint = BABYLON.Vector3.Zero();
            _this._lookAtTemp = BABYLON.Matrix.Zero();
            _this._tempMatrix = BABYLON.Matrix.Zero();
            return _this;
        }
        TargetCamera.prototype.getFrontPosition = function (distance) {
            var direction = this.getTarget().subtract(this.position);
            direction.normalize();
            direction.scaleInPlace(distance);
            return this.globalPosition.add(direction);
        };
        TargetCamera.prototype._getLockedTargetPosition = function () {
            if (!this.lockedTarget) {
                return null;
            }
            if (this.lockedTarget.absolutePosition) {
                this.lockedTarget.computeWorldMatrix();
            }
            return this.lockedTarget.absolutePosition || this.lockedTarget;
        };
        TargetCamera.prototype.storeState = function () {
            this._storedPosition = this.position.clone();
            this._storedRotation = this.rotation.clone();
            if (this.rotationQuaternion) {
                this._storedRotationQuaternion = this.rotationQuaternion.clone();
            }
            return _super.prototype.storeState.call(this);
        };
        /**
         * Restored camera state. You must call storeState() first
         */
        TargetCamera.prototype._restoreStateValues = function () {
            if (!_super.prototype._restoreStateValues.call(this)) {
                return false;
            }
            this.position = this._storedPosition.clone();
            this.rotation = this._storedRotation.clone();
            if (this.rotationQuaternion) {
                this.rotationQuaternion = this._storedRotationQuaternion.clone();
            }
            this.cameraDirection.copyFromFloats(0, 0, 0);
            this.cameraRotation.copyFromFloats(0, 0);
            return true;
        };
        // Cache
        TargetCamera.prototype._initCache = function () {
            _super.prototype._initCache.call(this);
            this._cache.lockedTarget = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            this._cache.rotation = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            this._cache.rotationQuaternion = new BABYLON.Quaternion(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        };
        TargetCamera.prototype._updateCache = function (ignoreParentClass) {
            if (!ignoreParentClass) {
                _super.prototype._updateCache.call(this);
            }
            var lockedTargetPosition = this._getLockedTargetPosition();
            if (!lockedTargetPosition) {
                this._cache.lockedTarget = null;
            }
            else {
                if (!this._cache.lockedTarget) {
                    this._cache.lockedTarget = lockedTargetPosition.clone();
                }
                else {
                    this._cache.lockedTarget.copyFrom(lockedTargetPosition);
                }
            }
            this._cache.rotation.copyFrom(this.rotation);
            if (this.rotationQuaternion)
                this._cache.rotationQuaternion.copyFrom(this.rotationQuaternion);
        };
        // Synchronized
        TargetCamera.prototype._isSynchronizedViewMatrix = function () {
            if (!_super.prototype._isSynchronizedViewMatrix.call(this)) {
                return false;
            }
            var lockedTargetPosition = this._getLockedTargetPosition();
            return (this._cache.lockedTarget ? this._cache.lockedTarget.equals(lockedTargetPosition) : !lockedTargetPosition)
                && (this.rotationQuaternion ? this.rotationQuaternion.equals(this._cache.rotationQuaternion) : this._cache.rotation.equals(this.rotation));
        };
        // Methods
        TargetCamera.prototype._computeLocalCameraSpeed = function () {
            var engine = this.getEngine();
            return this.speed * Math.sqrt((engine.getDeltaTime() / (engine.getFps() * 100.0)));
        };
        // Target
        TargetCamera.prototype.setTarget = function (target) {
            this.upVector.normalize();
            BABYLON.Matrix.LookAtLHToRef(this.position, target, this.upVector, this._camMatrix);
            this._camMatrix.invert();
            this.rotation.x = Math.atan(this._camMatrix.m[6] / this._camMatrix.m[10]);
            var vDir = target.subtract(this.position);
            if (vDir.x >= 0.0) {
                this.rotation.y = (-Math.atan(vDir.z / vDir.x) + Math.PI / 2.0);
            }
            else {
                this.rotation.y = (-Math.atan(vDir.z / vDir.x) - Math.PI / 2.0);
            }
            this.rotation.z = 0;
            if (isNaN(this.rotation.x)) {
                this.rotation.x = 0;
            }
            if (isNaN(this.rotation.y)) {
                this.rotation.y = 0;
            }
            if (isNaN(this.rotation.z)) {
                this.rotation.z = 0;
            }
            if (this.rotationQuaternion) {
                BABYLON.Quaternion.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this.rotationQuaternion);
            }
        };
        /**
         * Return the current target position of the camera. This value is expressed in local space.
         */
        TargetCamera.prototype.getTarget = function () {
            return this._currentTarget;
        };
        TargetCamera.prototype._decideIfNeedsToMove = function () {
            return Math.abs(this.cameraDirection.x) > 0 || Math.abs(this.cameraDirection.y) > 0 || Math.abs(this.cameraDirection.z) > 0;
        };
        TargetCamera.prototype._updatePosition = function () {
            if (this.parent) {
                this.parent.getWorldMatrix().invertToRef(BABYLON.Tmp.Matrix[0]);
                BABYLON.Vector3.TransformNormalToRef(this.cameraDirection, BABYLON.Tmp.Matrix[0], BABYLON.Tmp.Vector3[0]);
                this.position.addInPlace(BABYLON.Tmp.Vector3[0]);
                return;
            }
            this.position.addInPlace(this.cameraDirection);
        };
        TargetCamera.prototype._checkInputs = function () {
            var needToMove = this._decideIfNeedsToMove();
            var needToRotate = Math.abs(this.cameraRotation.x) > 0 || Math.abs(this.cameraRotation.y) > 0;
            // Move
            if (needToMove) {
                this._updatePosition();
            }
            // Rotate
            if (needToRotate) {
                this.rotation.x += this.cameraRotation.x;
                this.rotation.y += this.cameraRotation.y;
                //rotate, if quaternion is set and rotation was used
                if (this.rotationQuaternion) {
                    var len = this.rotation.lengthSquared();
                    if (len) {
                        BABYLON.Quaternion.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this.rotationQuaternion);
                    }
                }
                if (!this.noRotationConstraint) {
                    var limit = (Math.PI / 2) * 0.95;
                    if (this.rotation.x > limit)
                        this.rotation.x = limit;
                    if (this.rotation.x < -limit)
                        this.rotation.x = -limit;
                }
            }
            // Inertia
            if (needToMove) {
                if (Math.abs(this.cameraDirection.x) < this.speed * BABYLON.Epsilon) {
                    this.cameraDirection.x = 0;
                }
                if (Math.abs(this.cameraDirection.y) < this.speed * BABYLON.Epsilon) {
                    this.cameraDirection.y = 0;
                }
                if (Math.abs(this.cameraDirection.z) < this.speed * BABYLON.Epsilon) {
                    this.cameraDirection.z = 0;
                }
                this.cameraDirection.scaleInPlace(this.inertia);
            }
            if (needToRotate) {
                if (Math.abs(this.cameraRotation.x) < this.speed * BABYLON.Epsilon) {
                    this.cameraRotation.x = 0;
                }
                if (Math.abs(this.cameraRotation.y) < this.speed * BABYLON.Epsilon) {
                    this.cameraRotation.y = 0;
                }
                this.cameraRotation.scaleInPlace(this.inertia);
            }
            _super.prototype._checkInputs.call(this);
        };
        TargetCamera.prototype._updateCameraRotationMatrix = function () {
            if (this.rotationQuaternion) {
                this.rotationQuaternion.toRotationMatrix(this._cameraRotationMatrix);
            }
            else {
                BABYLON.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this._cameraRotationMatrix);
            }
            //update the up vector!
            BABYLON.Vector3.TransformNormalToRef(this.upVector, this._cameraRotationMatrix, this._currentUpVector);
        };
        TargetCamera.prototype._getViewMatrix = function () {
            if (this.lockedTarget) {
                this.setTarget(this._getLockedTargetPosition());
            }
            // Compute
            this._updateCameraRotationMatrix();
            BABYLON.Vector3.TransformCoordinatesToRef(this._referencePoint, this._cameraRotationMatrix, this._transformedReferencePoint);
            // Computing target and final matrix
            this.position.addToRef(this._transformedReferencePoint, this._currentTarget);
            if (this.getScene().useRightHandedSystem) {
                BABYLON.Matrix.LookAtRHToRef(this.position, this._currentTarget, this._currentUpVector, this._viewMatrix);
            }
            else {
                BABYLON.Matrix.LookAtLHToRef(this.position, this._currentTarget, this._currentUpVector, this._viewMatrix);
            }
            return this._viewMatrix;
        };
        /**
         * @override
         * Override Camera.createRigCamera
         */
        TargetCamera.prototype.createRigCamera = function (name, cameraIndex) {
            if (this.cameraRigMode !== BABYLON.Camera.RIG_MODE_NONE) {
                var rigCamera = new TargetCamera(name, this.position.clone(), this.getScene());
                if (this.cameraRigMode === BABYLON.Camera.RIG_MODE_VR || this.cameraRigMode === BABYLON.Camera.RIG_MODE_WEBVR) {
                    if (!this.rotationQuaternion) {
                        this.rotationQuaternion = new BABYLON.Quaternion();
                    }
                    rigCamera._cameraRigParams = {};
                    rigCamera.rotationQuaternion = new BABYLON.Quaternion();
                }
                return rigCamera;
            }
            return null;
        };
        /**
         * @override
         * Override Camera._updateRigCameras
         */
        TargetCamera.prototype._updateRigCameras = function () {
            var camLeft = this._rigCameras[0];
            var camRight = this._rigCameras[1];
            switch (this.cameraRigMode) {
                case BABYLON.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
                case BABYLON.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
                case BABYLON.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
                case BABYLON.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
                    //provisionnaly using _cameraRigParams.stereoHalfAngle instead of calculations based on _cameraRigParams.interaxialDistance:
                    var leftSign = (this.cameraRigMode === BABYLON.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED) ? 1 : -1;
                    var rightSign = (this.cameraRigMode === BABYLON.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED) ? -1 : 1;
                    this._getRigCamPosition(this._cameraRigParams.stereoHalfAngle * leftSign, camLeft.position);
                    this._getRigCamPosition(this._cameraRigParams.stereoHalfAngle * rightSign, camRight.position);
                    camLeft.setTarget(this.getTarget());
                    camRight.setTarget(this.getTarget());
                    break;
                case BABYLON.Camera.RIG_MODE_VR:
                    if (camLeft.rotationQuaternion) {
                        camLeft.rotationQuaternion.copyFrom(this.rotationQuaternion);
                        camRight.rotationQuaternion.copyFrom(this.rotationQuaternion);
                    }
                    else {
                        camLeft.rotation.copyFrom(this.rotation);
                        camRight.rotation.copyFrom(this.rotation);
                    }
                    camLeft.position.copyFrom(this.position);
                    camRight.position.copyFrom(this.position);
                    break;
            }
            _super.prototype._updateRigCameras.call(this);
        };
        TargetCamera.prototype._getRigCamPosition = function (halfSpace, result) {
            if (!this._rigCamTransformMatrix) {
                this._rigCamTransformMatrix = new BABYLON.Matrix();
            }
            var target = this.getTarget();
            BABYLON.Matrix.Translation(-target.x, -target.y, -target.z).multiplyToRef(BABYLON.Matrix.RotationY(halfSpace), this._rigCamTransformMatrix);
            this._rigCamTransformMatrix = this._rigCamTransformMatrix.multiply(BABYLON.Matrix.Translation(target.x, target.y, target.z));
            BABYLON.Vector3.TransformCoordinatesToRef(this.position, this._rigCamTransformMatrix, result);
        };
        TargetCamera.prototype.getClassName = function () {
            return "TargetCamera";
        };
        __decorate([
            BABYLON.serializeAsVector3()
        ], TargetCamera.prototype, "rotation", void 0);
        __decorate([
            BABYLON.serialize()
        ], TargetCamera.prototype, "speed", void 0);
        __decorate([
            BABYLON.serializeAsMeshReference("lockedTargetId")
        ], TargetCamera.prototype, "lockedTarget", void 0);
        return TargetCamera;
    }(BABYLON.Camera));
    BABYLON.TargetCamera = TargetCamera;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.targetCamera.js.map
