






var LIB;
(function (LIB) {
    var FollowCamera = /** @class */ (function (_super) {
        __extends(FollowCamera, _super);
        function FollowCamera(name, position, scene, lockedTarget) {
            if (lockedTarget === void 0) { lockedTarget = null; }
            var _this = _super.call(this, name, position, scene) || this;
            _this.radius = 12;
            _this.rotationOffset = 0;
            _this.heightOffset = 4;
            _this.cameraAcceleration = 0.05;
            _this.maxCameraSpeed = 20;
            _this.lockedTarget = lockedTarget;
            return _this;
        }
        FollowCamera.prototype.getRadians = function (degrees) {
            return degrees * Math.PI / 180;
        };
        FollowCamera.prototype.follow = function (cameraTarget) {
            if (!cameraTarget)
                return;
            var yRotation;
            if (cameraTarget.rotationQuaternion) {
                var rotMatrix = new LIB.Matrix();
                cameraTarget.rotationQuaternion.toRotationMatrix(rotMatrix);
                yRotation = Math.atan2(rotMatrix.m[8], rotMatrix.m[10]);
            }
            else {
                yRotation = cameraTarget.rotation.y;
            }
            var radians = this.getRadians(this.rotationOffset) + yRotation;
            var targetPosition = cameraTarget.getAbsolutePosition();
            var targetX = targetPosition.x + Math.sin(radians) * this.radius;
            var targetZ = targetPosition.z + Math.cos(radians) * this.radius;
            var dx = targetX - this.position.x;
            var dy = (targetPosition.y + this.heightOffset) - this.position.y;
            var dz = (targetZ) - this.position.z;
            var vx = dx * this.cameraAcceleration * 2; //this is set to .05
            var vy = dy * this.cameraAcceleration;
            var vz = dz * this.cameraAcceleration * 2;
            if (vx > this.maxCameraSpeed || vx < -this.maxCameraSpeed) {
                vx = vx < 1 ? -this.maxCameraSpeed : this.maxCameraSpeed;
            }
            if (vy > this.maxCameraSpeed || vy < -this.maxCameraSpeed) {
                vy = vy < 1 ? -this.maxCameraSpeed : this.maxCameraSpeed;
            }
            if (vz > this.maxCameraSpeed || vz < -this.maxCameraSpeed) {
                vz = vz < 1 ? -this.maxCameraSpeed : this.maxCameraSpeed;
            }
            this.position = new LIB.Vector3(this.position.x + vx, this.position.y + vy, this.position.z + vz);
            this.setTarget(targetPosition);
        };
        FollowCamera.prototype._checkInputs = function () {
            _super.prototype._checkInputs.call(this);
            if (this.lockedTarget) {
                this.follow(this.lockedTarget);
            }
        };
        FollowCamera.prototype.getClassName = function () {
            return "FollowCamera";
        };
        __decorate([
            LIB.serialize()
        ], FollowCamera.prototype, "radius", void 0);
        __decorate([
            LIB.serialize()
        ], FollowCamera.prototype, "rotationOffset", void 0);
        __decorate([
            LIB.serialize()
        ], FollowCamera.prototype, "heightOffset", void 0);
        __decorate([
            LIB.serialize()
        ], FollowCamera.prototype, "cameraAcceleration", void 0);
        __decorate([
            LIB.serialize()
        ], FollowCamera.prototype, "maxCameraSpeed", void 0);
        __decorate([
            LIB.serializeAsMeshReference("lockedTargetId")
        ], FollowCamera.prototype, "lockedTarget", void 0);
        return FollowCamera;
    }(LIB.TargetCamera));
    LIB.FollowCamera = FollowCamera;
    var ArcFollowCamera = /** @class */ (function (_super) {
        __extends(ArcFollowCamera, _super);
        function ArcFollowCamera(name, alpha, beta, radius, target, scene) {
            var _this = _super.call(this, name, LIB.Vector3.Zero(), scene) || this;
            _this.alpha = alpha;
            _this.beta = beta;
            _this.radius = radius;
            _this.target = target;
            _this._cartesianCoordinates = LIB.Vector3.Zero();
            _this.follow();
            return _this;
        }
        ArcFollowCamera.prototype.follow = function () {
            if (!this.target) {
                return;
            }
            this._cartesianCoordinates.x = this.radius * Math.cos(this.alpha) * Math.cos(this.beta);
            this._cartesianCoordinates.y = this.radius * Math.sin(this.beta);
            this._cartesianCoordinates.z = this.radius * Math.sin(this.alpha) * Math.cos(this.beta);
            var targetPosition = this.target.getAbsolutePosition();
            this.position = targetPosition.add(this._cartesianCoordinates);
            this.setTarget(targetPosition);
        };
        ArcFollowCamera.prototype._checkInputs = function () {
            _super.prototype._checkInputs.call(this);
            this.follow();
        };
        ArcFollowCamera.prototype.getClassName = function () {
            return "ArcFollowCamera";
        };
        return ArcFollowCamera;
    }(LIB.TargetCamera));
    LIB.ArcFollowCamera = ArcFollowCamera;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.followCamera.js.map
//# sourceMappingURL=LIB.followCamera.js.map
