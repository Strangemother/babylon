var BABYLON;
(function (BABYLON) {
    var FreeCamera = /** @class */ (function (_super) {
        __extends(FreeCamera, _super);
        function FreeCamera(name, position, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
            _this.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
            _this.checkCollisions = false;
            _this.applyGravity = false;
            _this._needMoveForGravity = false;
            _this._oldPosition = BABYLON.Vector3.Zero();
            _this._diffPosition = BABYLON.Vector3.Zero();
            _this._newPosition = BABYLON.Vector3.Zero();
            // Collisions
            _this._collisionMask = -1;
            _this._onCollisionPositionChange = function (collisionId, newPosition, collidedMesh) {
                if (collidedMesh === void 0) { collidedMesh = null; }
                //TODO move this to the collision coordinator!
                if (_this.getScene().workerCollisions)
                    newPosition.multiplyInPlace(_this._collider._radius);
                var updatePosition = function (newPos) {
                    _this._newPosition.copyFrom(newPos);
                    _this._newPosition.subtractToRef(_this._oldPosition, _this._diffPosition);
                    if (_this._diffPosition.length() > BABYLON.Engine.CollisionsEpsilon) {
                        _this.position.addInPlace(_this._diffPosition);
                        if (_this.onCollide && collidedMesh) {
                            _this.onCollide(collidedMesh);
                        }
                    }
                };
                updatePosition(newPosition);
            };
            _this.inputs = new BABYLON.FreeCameraInputsManager(_this);
            _this.inputs.addKeyboard().addMouse();
            return _this;
        }
        Object.defineProperty(FreeCamera.prototype, "angularSensibility", {
            //-- begin properties for backward compatibility for inputs
            get: function () {
                var mouse = this.inputs.attached["mouse"];
                if (mouse)
                    return mouse.angularSensibility;
                return 0;
            },
            set: function (value) {
                var mouse = this.inputs.attached["mouse"];
                if (mouse)
                    mouse.angularSensibility = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FreeCamera.prototype, "keysUp", {
            get: function () {
                var keyboard = this.inputs.attached["keyboard"];
                if (keyboard)
                    return keyboard.keysUp;
                return [];
            },
            set: function (value) {
                var keyboard = this.inputs.attached["keyboard"];
                if (keyboard)
                    keyboard.keysUp = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FreeCamera.prototype, "keysDown", {
            get: function () {
                var keyboard = this.inputs.attached["keyboard"];
                if (keyboard)
                    return keyboard.keysDown;
                return [];
            },
            set: function (value) {
                var keyboard = this.inputs.attached["keyboard"];
                if (keyboard)
                    keyboard.keysDown = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FreeCamera.prototype, "keysLeft", {
            get: function () {
                var keyboard = this.inputs.attached["keyboard"];
                if (keyboard)
                    return keyboard.keysLeft;
                return [];
            },
            set: function (value) {
                var keyboard = this.inputs.attached["keyboard"];
                if (keyboard)
                    keyboard.keysLeft = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FreeCamera.prototype, "keysRight", {
            get: function () {
                var keyboard = this.inputs.attached["keyboard"];
                if (keyboard)
                    return keyboard.keysRight;
                return [];
            },
            set: function (value) {
                var keyboard = this.inputs.attached["keyboard"];
                if (keyboard)
                    keyboard.keysRight = value;
            },
            enumerable: true,
            configurable: true
        });
        // Controls
        FreeCamera.prototype.attachControl = function (element, noPreventDefault) {
            this.inputs.attachElement(element, noPreventDefault);
        };
        FreeCamera.prototype.detachControl = function (element) {
            this.inputs.detachElement(element);
            this.cameraDirection = new BABYLON.Vector3(0, 0, 0);
            this.cameraRotation = new BABYLON.Vector2(0, 0);
        };
        Object.defineProperty(FreeCamera.prototype, "collisionMask", {
            get: function () {
                return this._collisionMask;
            },
            set: function (mask) {
                this._collisionMask = !isNaN(mask) ? mask : -1;
            },
            enumerable: true,
            configurable: true
        });
        FreeCamera.prototype._collideWithWorld = function (displacement) {
            var globalPosition;
            if (this.parent) {
                globalPosition = BABYLON.Vector3.TransformCoordinates(this.position, this.parent.getWorldMatrix());
            }
            else {
                globalPosition = this.position;
            }
            globalPosition.subtractFromFloatsToRef(0, this.ellipsoid.y, 0, this._oldPosition);
            this._oldPosition.addInPlace(this.ellipsoidOffset);
            if (!this._collider) {
                this._collider = new BABYLON.Collider();
            }
            this._collider._radius = this.ellipsoid;
            this._collider.collisionMask = this._collisionMask;
            //no need for clone, as long as gravity is not on.
            var actualDisplacement = displacement;
            //add gravity to the direction to prevent the dual-collision checking
            if (this.applyGravity) {
                //this prevents mending with cameraDirection, a global variable of the free camera class.
                actualDisplacement = displacement.add(this.getScene().gravity);
            }
            this.getScene().collisionCoordinator.getNewPosition(this._oldPosition, actualDisplacement, this._collider, 3, null, this._onCollisionPositionChange, this.uniqueId);
        };
        FreeCamera.prototype._checkInputs = function () {
            if (!this._localDirection) {
                this._localDirection = BABYLON.Vector3.Zero();
                this._transformedDirection = BABYLON.Vector3.Zero();
            }
            this.inputs.checkInputs();
            _super.prototype._checkInputs.call(this);
        };
        FreeCamera.prototype._decideIfNeedsToMove = function () {
            return this._needMoveForGravity || Math.abs(this.cameraDirection.x) > 0 || Math.abs(this.cameraDirection.y) > 0 || Math.abs(this.cameraDirection.z) > 0;
        };
        FreeCamera.prototype._updatePosition = function () {
            if (this.checkCollisions && this.getScene().collisionsEnabled) {
                this._collideWithWorld(this.cameraDirection);
            }
            else {
                _super.prototype._updatePosition.call(this);
            }
        };
        FreeCamera.prototype.dispose = function () {
            this.inputs.clear();
            _super.prototype.dispose.call(this);
        };
        FreeCamera.prototype.getClassName = function () {
            return "FreeCamera";
        };
        __decorate([
            BABYLON.serializeAsVector3()
        ], FreeCamera.prototype, "ellipsoid", void 0);
        __decorate([
            BABYLON.serializeAsVector3()
        ], FreeCamera.prototype, "ellipsoidOffset", void 0);
        __decorate([
            BABYLON.serialize()
        ], FreeCamera.prototype, "checkCollisions", void 0);
        __decorate([
            BABYLON.serialize()
        ], FreeCamera.prototype, "applyGravity", void 0);
        return FreeCamera;
    }(BABYLON.TargetCamera));
    BABYLON.FreeCamera = FreeCamera;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.freeCamera.js.map
