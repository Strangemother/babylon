






var LIB;
(function (LIB) {
    var ArcRotateCamera = /** @class */ (function (_super) {
        __extends(ArcRotateCamera, _super);
        function ArcRotateCamera(name, alpha, beta, radius, target, scene, setActiveOnSceneIfNoneActive) {
            if (setActiveOnSceneIfNoneActive === void 0) { setActiveOnSceneIfNoneActive = true; }
            var _this = _super.call(this, name, LIB.Vector3.Zero(), scene, setActiveOnSceneIfNoneActive) || this;
            _this.inertialAlphaOffset = 0;
            _this.inertialBetaOffset = 0;
            _this.inertialRadiusOffset = 0;
            _this.lowerAlphaLimit = null;
            _this.upperAlphaLimit = null;
            _this.lowerBetaLimit = 0.01;
            _this.upperBetaLimit = Math.PI;
            _this.lowerRadiusLimit = null;
            _this.upperRadiusLimit = null;
            _this.inertialPanningX = 0;
            _this.inertialPanningY = 0;
            _this.pinchToPanMaxDistance = 20;
            _this.panningDistanceLimit = null;
            _this.panningOriginTarget = LIB.Vector3.Zero();
            _this.panningInertia = 0.9;
            //-- end properties for backward compatibility for inputs
            _this.zoomOnFactor = 1;
            _this.targetScreenOffset = LIB.Vector2.Zero();
            _this.allowUpsideDown = true;
            _this._viewMatrix = new LIB.Matrix();
            // Panning
            _this.panningAxis = new LIB.Vector3(1, 1, 0);
            _this.onMeshTargetChangedObservable = new LIB.Observable();
            _this.checkCollisions = false;
            _this.collisionRadius = new LIB.Vector3(0.5, 0.5, 0.5);
            _this._previousPosition = LIB.Vector3.Zero();
            _this._collisionVelocity = LIB.Vector3.Zero();
            _this._newPosition = LIB.Vector3.Zero();
            _this._computationVector = LIB.Vector3.Zero();
            _this._onCollisionPositionChange = function (collisionId, newPosition, collidedMesh) {
                if (collidedMesh === void 0) { collidedMesh = null; }
                if (_this.getScene().workerCollisions && _this.checkCollisions) {
                    newPosition.multiplyInPlace(_this._collider._radius);
                }
                if (!collidedMesh) {
                    _this._previousPosition.copyFrom(_this.position);
                }
                else {
                    _this.setPosition(newPosition);
                    if (_this.onCollide) {
                        _this.onCollide(collidedMesh);
                    }
                }
                // Recompute because of constraints
                var cosa = Math.cos(_this.alpha);
                var sina = Math.sin(_this.alpha);
                var cosb = Math.cos(_this.beta);
                var sinb = Math.sin(_this.beta);
                if (sinb === 0) {
                    sinb = 0.0001;
                }
                var target = _this._getTargetPosition();
                _this._computationVector.copyFromFloats(_this.radius * cosa * sinb, _this.radius * cosb, _this.radius * sina * sinb);
                target.addToRef(_this._computationVector, _this._newPosition);
                _this.position.copyFrom(_this._newPosition);
                var up = _this.upVector;
                if (_this.allowUpsideDown && _this.beta < 0) {
                    up = up.clone();
                    up = up.negate();
                }
                LIB.Matrix.LookAtLHToRef(_this.position, target, up, _this._viewMatrix);
                _this._viewMatrix.m[12] += _this.targetScreenOffset.x;
                _this._viewMatrix.m[13] += _this.targetScreenOffset.y;
                _this._collisionTriggered = false;
            };
            _this._target = LIB.Vector3.Zero();
            if (target) {
                _this.setTarget(target);
            }
            _this.alpha = alpha;
            _this.beta = beta;
            _this.radius = radius;
            _this.getViewMatrix();
            _this.inputs = new LIB.ArcRotateCameraInputsManager(_this);
            _this.inputs.addKeyboard().addMouseWheel().addPointers();
            return _this;
        }
        Object.defineProperty(ArcRotateCamera.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (value) {
                this.setTarget(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "angularSensibilityX", {
            //-- begin properties for backward compatibility for inputs
            get: function () {
                var pointers = this.inputs.attached["pointers"];
                if (pointers)
                    return pointers.angularSensibilityX;
                return 0;
            },
            set: function (value) {
                var pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.angularSensibilityX = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "angularSensibilityY", {
            get: function () {
                var pointers = this.inputs.attached["pointers"];
                if (pointers)
                    return pointers.angularSensibilityY;
                return 0;
            },
            set: function (value) {
                var pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.angularSensibilityY = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "pinchPrecision", {
            get: function () {
                var pointers = this.inputs.attached["pointers"];
                if (pointers)
                    return pointers.pinchPrecision;
                return 0;
            },
            set: function (value) {
                var pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.pinchPrecision = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "pinchDeltaPercentage", {
            get: function () {
                var pointers = this.inputs.attached["pointers"];
                if (pointers)
                    return pointers.pinchDeltaPercentage;
                return 0;
            },
            set: function (value) {
                var pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.pinchDeltaPercentage = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "panningSensibility", {
            get: function () {
                var pointers = this.inputs.attached["pointers"];
                if (pointers)
                    return pointers.panningSensibility;
                return 0;
            },
            set: function (value) {
                var pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.panningSensibility = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "keysUp", {
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
        Object.defineProperty(ArcRotateCamera.prototype, "keysDown", {
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
        Object.defineProperty(ArcRotateCamera.prototype, "keysLeft", {
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
        Object.defineProperty(ArcRotateCamera.prototype, "keysRight", {
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
        Object.defineProperty(ArcRotateCamera.prototype, "wheelPrecision", {
            get: function () {
                var mousewheel = this.inputs.attached["mousewheel"];
                if (mousewheel)
                    return mousewheel.wheelPrecision;
                return 0;
            },
            set: function (value) {
                var mousewheel = this.inputs.attached["mousewheel"];
                if (mousewheel)
                    mousewheel.wheelPrecision = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "wheelDeltaPercentage", {
            get: function () {
                var mousewheel = this.inputs.attached["mousewheel"];
                if (mousewheel)
                    return mousewheel.wheelDeltaPercentage;
                return 0;
            },
            set: function (value) {
                var mousewheel = this.inputs.attached["mousewheel"];
                if (mousewheel)
                    mousewheel.wheelDeltaPercentage = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "bouncingBehavior", {
            get: function () {
                return this._bouncingBehavior;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "useBouncingBehavior", {
            get: function () {
                return this._bouncingBehavior != null;
            },
            set: function (value) {
                if (value === this.useBouncingBehavior) {
                    return;
                }
                if (value) {
                    this._bouncingBehavior = new LIB.BouncingBehavior();
                    this.addBehavior(this._bouncingBehavior);
                }
                else if (this._bouncingBehavior) {
                    this.removeBehavior(this._bouncingBehavior);
                    this._bouncingBehavior = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "framingBehavior", {
            get: function () {
                return this._framingBehavior;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "useFramingBehavior", {
            get: function () {
                return this._framingBehavior != null;
            },
            set: function (value) {
                if (value === this.useFramingBehavior) {
                    return;
                }
                if (value) {
                    this._framingBehavior = new LIB.FramingBehavior();
                    this.addBehavior(this._framingBehavior);
                }
                else if (this._framingBehavior) {
                    this.removeBehavior(this._framingBehavior);
                    this._framingBehavior = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "autoRotationBehavior", {
            get: function () {
                return this._autoRotationBehavior;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcRotateCamera.prototype, "useAutoRotationBehavior", {
            get: function () {
                return this._autoRotationBehavior != null;
            },
            set: function (value) {
                if (value === this.useAutoRotationBehavior) {
                    return;
                }
                if (value) {
                    this._autoRotationBehavior = new LIB.AutoRotationBehavior();
                    this.addBehavior(this._autoRotationBehavior);
                }
                else if (this._autoRotationBehavior) {
                    this.removeBehavior(this._autoRotationBehavior);
                    this._autoRotationBehavior = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        // Cache
        ArcRotateCamera.prototype._initCache = function () {
            _super.prototype._initCache.call(this);
            this._cache._target = new LIB.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            this._cache.alpha = undefined;
            this._cache.beta = undefined;
            this._cache.radius = undefined;
            this._cache.targetScreenOffset = LIB.Vector2.Zero();
        };
        ArcRotateCamera.prototype._updateCache = function (ignoreParentClass) {
            if (!ignoreParentClass) {
                _super.prototype._updateCache.call(this);
            }
            this._cache._target.copyFrom(this._getTargetPosition());
            this._cache.alpha = this.alpha;
            this._cache.beta = this.beta;
            this._cache.radius = this.radius;
            this._cache.targetScreenOffset.copyFrom(this.targetScreenOffset);
        };
        ArcRotateCamera.prototype._getTargetPosition = function () {
            if (this._targetHost && this._targetHost.getAbsolutePosition) {
                var pos = this._targetHost.getAbsolutePosition();
                if (this._targetBoundingCenter) {
                    pos.addToRef(this._targetBoundingCenter, this._target);
                }
                else {
                    this._target.copyFrom(pos);
                }
            }
            var lockedTargetPosition = this._getLockedTargetPosition();
            if (lockedTargetPosition) {
                return lockedTargetPosition;
            }
            return this._target;
        };
        ArcRotateCamera.prototype.storeState = function () {
            this._storedAlpha = this.alpha;
            this._storedBeta = this.beta;
            this._storedRadius = this.radius;
            this._storedTarget = this._getTargetPosition().clone();
            return _super.prototype.storeState.call(this);
        };
        /**
         * Restored camera state. You must call storeState() first
         */
        ArcRotateCamera.prototype._restoreStateValues = function () {
            if (!_super.prototype._restoreStateValues.call(this)) {
                return false;
            }
            this.alpha = this._storedAlpha;
            this.beta = this._storedBeta;
            this.radius = this._storedRadius;
            this.setTarget(this._storedTarget.clone());
            this.inertialAlphaOffset = 0;
            this.inertialBetaOffset = 0;
            this.inertialRadiusOffset = 0;
            this.inertialPanningX = 0;
            this.inertialPanningY = 0;
            return true;
        };
        // Synchronized
        ArcRotateCamera.prototype._isSynchronizedViewMatrix = function () {
            if (!_super.prototype._isSynchronizedViewMatrix.call(this))
                return false;
            return this._cache._target.equals(this._getTargetPosition())
                && this._cache.alpha === this.alpha
                && this._cache.beta === this.beta
                && this._cache.radius === this.radius
                && this._cache.targetScreenOffset.equals(this.targetScreenOffset);
        };
        // Methods
        ArcRotateCamera.prototype.attachControl = function (element, noPreventDefault, useCtrlForPanning, panningMouseButton) {
            var _this = this;
            if (useCtrlForPanning === void 0) { useCtrlForPanning = true; }
            if (panningMouseButton === void 0) { panningMouseButton = 2; }
            this._useCtrlForPanning = useCtrlForPanning;
            this._panningMouseButton = panningMouseButton;
            this.inputs.attachElement(element, noPreventDefault);
            this._reset = function () {
                _this.inertialAlphaOffset = 0;
                _this.inertialBetaOffset = 0;
                _this.inertialRadiusOffset = 0;
                _this.inertialPanningX = 0;
                _this.inertialPanningY = 0;
            };
        };
        ArcRotateCamera.prototype.detachControl = function (element) {
            this.inputs.detachElement(element);
            if (this._reset) {
                this._reset();
            }
        };
        ArcRotateCamera.prototype._checkInputs = function () {
            //if (async) collision inspection was triggered, don't update the camera's position - until the collision callback was called.
            if (this._collisionTriggered) {
                return;
            }
            this.inputs.checkInputs();
            // Inertia
            if (this.inertialAlphaOffset !== 0 || this.inertialBetaOffset !== 0 || this.inertialRadiusOffset !== 0) {
                var inertialAlphaOffset = this.inertialAlphaOffset;
                if (this.beta <= 0)
                    inertialAlphaOffset *= -1;
                if (this.getScene().useRightHandedSystem)
                    inertialAlphaOffset *= -1;
                if (this.parent && this.parent._getWorldMatrixDeterminant() < 0)
                    inertialAlphaOffset *= -1;
                this.alpha += inertialAlphaOffset;
                this.beta += this.inertialBetaOffset;
                this.radius -= this.inertialRadiusOffset;
                this.inertialAlphaOffset *= this.inertia;
                this.inertialBetaOffset *= this.inertia;
                this.inertialRadiusOffset *= this.inertia;
                if (Math.abs(this.inertialAlphaOffset) < LIB.Epsilon)
                    this.inertialAlphaOffset = 0;
                if (Math.abs(this.inertialBetaOffset) < LIB.Epsilon)
                    this.inertialBetaOffset = 0;
                if (Math.abs(this.inertialRadiusOffset) < this.speed * LIB.Epsilon)
                    this.inertialRadiusOffset = 0;
            }
            // Panning inertia
            if (this.inertialPanningX !== 0 || this.inertialPanningY !== 0) {
                if (!this._localDirection) {
                    this._localDirection = LIB.Vector3.Zero();
                    this._transformedDirection = LIB.Vector3.Zero();
                }
                this._localDirection.copyFromFloats(this.inertialPanningX, this.inertialPanningY, this.inertialPanningY);
                this._localDirection.multiplyInPlace(this.panningAxis);
                this._viewMatrix.invertToRef(this._cameraTransformMatrix);
                LIB.Vector3.TransformNormalToRef(this._localDirection, this._cameraTransformMatrix, this._transformedDirection);
                //Eliminate y if map panning is enabled (panningAxis == 1,0,1)
                if (!this.panningAxis.y) {
                    this._transformedDirection.y = 0;
                }
                if (!this._targetHost) {
                    if (this.panningDistanceLimit) {
                        this._transformedDirection.addInPlace(this._target);
                        var distanceSquared = LIB.Vector3.DistanceSquared(this._transformedDirection, this.panningOriginTarget);
                        if (distanceSquared <= (this.panningDistanceLimit * this.panningDistanceLimit)) {
                            this._target.copyFrom(this._transformedDirection);
                        }
                    }
                    else {
                        this._target.addInPlace(this._transformedDirection);
                    }
                }
                this.inertialPanningX *= this.panningInertia;
                this.inertialPanningY *= this.panningInertia;
                if (Math.abs(this.inertialPanningX) < this.speed * LIB.Epsilon)
                    this.inertialPanningX = 0;
                if (Math.abs(this.inertialPanningY) < this.speed * LIB.Epsilon)
                    this.inertialPanningY = 0;
            }
            // Limits
            this._checkLimits();
            _super.prototype._checkInputs.call(this);
        };
        ArcRotateCamera.prototype._checkLimits = function () {
            if (this.lowerBetaLimit === null || this.lowerBetaLimit === undefined) {
                if (this.allowUpsideDown && this.beta > Math.PI) {
                    this.beta = this.beta - (2 * Math.PI);
                }
            }
            else {
                if (this.beta < this.lowerBetaLimit) {
                    this.beta = this.lowerBetaLimit;
                }
            }
            if (this.upperBetaLimit === null || this.upperBetaLimit === undefined) {
                if (this.allowUpsideDown && this.beta < -Math.PI) {
                    this.beta = this.beta + (2 * Math.PI);
                }
            }
            else {
                if (this.beta > this.upperBetaLimit) {
                    this.beta = this.upperBetaLimit;
                }
            }
            if (this.lowerAlphaLimit && this.alpha < this.lowerAlphaLimit) {
                this.alpha = this.lowerAlphaLimit;
            }
            if (this.upperAlphaLimit && this.alpha > this.upperAlphaLimit) {
                this.alpha = this.upperAlphaLimit;
            }
            if (this.lowerRadiusLimit && this.radius < this.lowerRadiusLimit) {
                this.radius = this.lowerRadiusLimit;
            }
            if (this.upperRadiusLimit && this.radius > this.upperRadiusLimit) {
                this.radius = this.upperRadiusLimit;
            }
        };
        ArcRotateCamera.prototype.rebuildAnglesAndRadius = function () {
            this.position.subtractToRef(this._getTargetPosition(), this._computationVector);
            this.radius = this._computationVector.length();
            if (this.radius === 0) {
                this.radius = 0.0001; // Just to avoid division by zero
            }
            // Alpha
            this.alpha = Math.acos(this._computationVector.x / Math.sqrt(Math.pow(this._computationVector.x, 2) + Math.pow(this._computationVector.z, 2)));
            if (this._computationVector.z < 0) {
                this.alpha = 2 * Math.PI - this.alpha;
            }
            // Beta
            this.beta = Math.acos(this._computationVector.y / this.radius);
            this._checkLimits();
        };
        ArcRotateCamera.prototype.setPosition = function (position) {
            if (this.position.equals(position)) {
                return;
            }
            this.position.copyFrom(position);
            this.rebuildAnglesAndRadius();
        };
        ArcRotateCamera.prototype.setTarget = function (target, toBoundingCenter, allowSamePosition) {
            if (toBoundingCenter === void 0) { toBoundingCenter = false; }
            if (allowSamePosition === void 0) { allowSamePosition = false; }
            if (target.getBoundingInfo) {
                if (toBoundingCenter) {
                    this._targetBoundingCenter = target.getBoundingInfo().boundingBox.centerWorld.clone();
                }
                else {
                    this._targetBoundingCenter = null;
                }
                this._targetHost = target;
                this._target = this._getTargetPosition();
                this.onMeshTargetChangedObservable.notifyObservers(this._targetHost);
            }
            else {
                var newTarget = target;
                var currentTarget = this._getTargetPosition();
                if (currentTarget && !allowSamePosition && currentTarget.equals(newTarget)) {
                    return;
                }
                this._targetHost = null;
                this._target = newTarget;
                this._targetBoundingCenter = null;
                this.onMeshTargetChangedObservable.notifyObservers(null);
            }
            this.rebuildAnglesAndRadius();
        };
        ArcRotateCamera.prototype._getViewMatrix = function () {
            // Compute
            var cosa = Math.cos(this.alpha);
            var sina = Math.sin(this.alpha);
            var cosb = Math.cos(this.beta);
            var sinb = Math.sin(this.beta);
            if (sinb === 0) {
                sinb = 0.0001;
            }
            var target = this._getTargetPosition();
            this._computationVector.copyFromFloats(this.radius * cosa * sinb, this.radius * cosb, this.radius * sina * sinb);
            target.addToRef(this._computationVector, this._newPosition);
            if (this.getScene().collisionsEnabled && this.checkCollisions) {
                if (!this._collider) {
                    this._collider = new LIB.Collider();
                }
                this._collider._radius = this.collisionRadius;
                this._newPosition.subtractToRef(this.position, this._collisionVelocity);
                this._collisionTriggered = true;
                this.getScene().collisionCoordinator.getNewPosition(this.position, this._collisionVelocity, this._collider, 3, null, this._onCollisionPositionChange, this.uniqueId);
            }
            else {
                this.position.copyFrom(this._newPosition);
                var up = this.upVector;
                if (this.allowUpsideDown && sinb < 0) {
                    up = up.clone();
                    up = up.negate();
                }
                this._computeViewMatrix(this.position, target, up);
                this._viewMatrix.m[12] += this.targetScreenOffset.x;
                this._viewMatrix.m[13] += this.targetScreenOffset.y;
            }
            this._currentTarget = target;
            return this._viewMatrix;
        };
        ArcRotateCamera.prototype.zoomOn = function (meshes, doNotUpdateMaxZ) {
            if (doNotUpdateMaxZ === void 0) { doNotUpdateMaxZ = false; }
            meshes = meshes || this.getScene().meshes;
            var minMaxVector = LIB.Mesh.MinMax(meshes);
            var distance = LIB.Vector3.Distance(minMaxVector.min, minMaxVector.max);
            this.radius = distance * this.zoomOnFactor;
            this.focusOn({ min: minMaxVector.min, max: minMaxVector.max, distance: distance }, doNotUpdateMaxZ);
        };
        ArcRotateCamera.prototype.focusOn = function (meshesOrMinMaxVectorAndDistance, doNotUpdateMaxZ) {
            if (doNotUpdateMaxZ === void 0) { doNotUpdateMaxZ = false; }
            var meshesOrMinMaxVector;
            var distance;
            if (meshesOrMinMaxVectorAndDistance.min === undefined) { // meshes
                var meshes = meshesOrMinMaxVectorAndDistance || this.getScene().meshes;
                meshesOrMinMaxVector = LIB.Mesh.MinMax(meshes);
                distance = LIB.Vector3.Distance(meshesOrMinMaxVector.min, meshesOrMinMaxVector.max);
            }
            else { //minMaxVector and distance
                var minMaxVectorAndDistance = meshesOrMinMaxVectorAndDistance;
                meshesOrMinMaxVector = minMaxVectorAndDistance;
                distance = minMaxVectorAndDistance.distance;
            }
            this._target = LIB.Mesh.Center(meshesOrMinMaxVector);
            if (!doNotUpdateMaxZ) {
                this.maxZ = distance * 2;
            }
        };
        /**
         * @override
         * Override Camera.createRigCamera
         */
        ArcRotateCamera.prototype.createRigCamera = function (name, cameraIndex) {
            var alphaShift = 0;
            switch (this.cameraRigMode) {
                case LIB.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
                case LIB.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
                case LIB.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
                case LIB.Camera.RIG_MODE_VR:
                    alphaShift = this._cameraRigParams.stereoHalfAngle * (cameraIndex === 0 ? 1 : -1);
                    break;
                case LIB.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
                    alphaShift = this._cameraRigParams.stereoHalfAngle * (cameraIndex === 0 ? -1 : 1);
                    break;
            }
            var rigCam = new ArcRotateCamera(name, this.alpha + alphaShift, this.beta, this.radius, this._target, this.getScene());
            rigCam._cameraRigParams = {};
            return rigCam;
        };
        /**
         * @override
         * Override Camera._updateRigCameras
         */
        ArcRotateCamera.prototype._updateRigCameras = function () {
            var camLeft = this._rigCameras[0];
            var camRight = this._rigCameras[1];
            camLeft.beta = camRight.beta = this.beta;
            camLeft.radius = camRight.radius = this.radius;
            switch (this.cameraRigMode) {
                case LIB.Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
                case LIB.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
                case LIB.Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
                case LIB.Camera.RIG_MODE_VR:
                    camLeft.alpha = this.alpha - this._cameraRigParams.stereoHalfAngle;
                    camRight.alpha = this.alpha + this._cameraRigParams.stereoHalfAngle;
                    break;
                case LIB.Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
                    camLeft.alpha = this.alpha + this._cameraRigParams.stereoHalfAngle;
                    camRight.alpha = this.alpha - this._cameraRigParams.stereoHalfAngle;
                    break;
            }
            _super.prototype._updateRigCameras.call(this);
        };
        ArcRotateCamera.prototype.dispose = function () {
            this.inputs.clear();
            _super.prototype.dispose.call(this);
        };
        ArcRotateCamera.prototype.getClassName = function () {
            return "ArcRotateCamera";
        };
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "alpha", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "beta", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "radius", void 0);
        __decorate([
            LIB.serializeAsVector3("target")
        ], ArcRotateCamera.prototype, "_target", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "inertialAlphaOffset", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "inertialBetaOffset", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "inertialRadiusOffset", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "lowerAlphaLimit", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "upperAlphaLimit", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "lowerBetaLimit", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "upperBetaLimit", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "lowerRadiusLimit", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "upperRadiusLimit", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "inertialPanningX", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "inertialPanningY", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "pinchToPanMaxDistance", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "panningDistanceLimit", void 0);
        __decorate([
            LIB.serializeAsVector3()
        ], ArcRotateCamera.prototype, "panningOriginTarget", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "panningInertia", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "zoomOnFactor", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCamera.prototype, "allowUpsideDown", void 0);
        return ArcRotateCamera;
    }(LIB.TargetCamera));
    LIB.ArcRotateCamera = ArcRotateCamera;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.arcRotateCamera.js.map
//# sourceMappingURL=LIB.arcRotateCamera.js.map
