
var LIB;
(function (LIB) {
    var AutoRotationBehavior = /** @class */ (function () {
        function AutoRotationBehavior() {
            this._zoomStopsAnimation = false;
            this._idleRotationSpeed = 0.05;
            this._idleRotationWaitTime = 2000;
            this._idleRotationSpinupTime = 2000;
            this._isPointerDown = false;
            this._lastFrameTime = null;
            this._lastInteractionTime = -Infinity;
            this._cameraRotationSpeed = 0;
            this._lastFrameRadius = 0;
        }
        Object.defineProperty(AutoRotationBehavior.prototype, "name", {
            get: function () {
                return "AutoRotation";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AutoRotationBehavior.prototype, "zoomStopsAnimation", {
            /**
            * Gets the flag that indicates if user zooming should stop animation.
            */
            get: function () {
                return this._zoomStopsAnimation;
            },
            /**
            * Sets the flag that indicates if user zooming should stop animation.
            */
            set: function (flag) {
                this._zoomStopsAnimation = flag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AutoRotationBehavior.prototype, "idleRotationSpeed", {
            /**
            * Gets the default speed at which the camera rotates around the model.
            */
            get: function () {
                return this._idleRotationSpeed;
            },
            /**
            * Sets the default speed at which the camera rotates around the model.
            */
            set: function (speed) {
                this._idleRotationSpeed = speed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AutoRotationBehavior.prototype, "idleRotationWaitTime", {
            /**
            * Gets the time (milliseconds) to wait after user interaction before the camera starts rotating.
            */
            get: function () {
                return this._idleRotationWaitTime;
            },
            /**
            * Sets the time (in milliseconds) to wait after user interaction before the camera starts rotating.
            */
            set: function (time) {
                this._idleRotationWaitTime = time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AutoRotationBehavior.prototype, "idleRotationSpinupTime", {
            /**
            * Gets the time (milliseconds) to take to spin up to the full idle rotation speed.
            */
            get: function () {
                return this._idleRotationSpinupTime;
            },
            /**
            * Sets the time (milliseconds) to take to spin up to the full idle rotation speed.
            */
            set: function (time) {
                this._idleRotationSpinupTime = time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AutoRotationBehavior.prototype, "rotationInProgress", {
            /**
             * Gets a value indicating if the camera is currently rotating because of this behavior
             */
            get: function () {
                return Math.abs(this._cameraRotationSpeed) > 0;
            },
            enumerable: true,
            configurable: true
        });
        AutoRotationBehavior.prototype.init = function () {
            // Do notihng
        };
        AutoRotationBehavior.prototype.attach = function (camera) {
            var _this = this;
            this._attachedCamera = camera;
            var scene = this._attachedCamera.getScene();
            this._onPrePointerObservableObserver = scene.onPrePointerObservable.add(function (pointerInfoPre) {
                if (pointerInfoPre.type === LIB.PointerEventTypes.POINTERDOWN) {
                    _this._isPointerDown = true;
                    return;
                }
                if (pointerInfoPre.type === LIB.PointerEventTypes.POINTERUP) {
                    _this._isPointerDown = false;
                }
            });
            this._onAfterCheckInputsObserver = camera.onAfterCheckInputsObservable.add(function () {
                var now = LIB.Tools.Now;
                var dt = 0;
                if (_this._lastFrameTime != null) {
                    dt = now - _this._lastFrameTime;
                }
                _this._lastFrameTime = now;
                // Stop the animation if there is user interaction and the animation should stop for this interaction
                _this._applyUserInteraction();
                var timeToRotation = now - _this._lastInteractionTime - _this._idleRotationWaitTime;
                var scale = Math.max(Math.min(timeToRotation / (_this._idleRotationSpinupTime), 1), 0);
                _this._cameraRotationSpeed = _this._idleRotationSpeed * scale;
                // Step camera rotation by rotation speed
                if (_this._attachedCamera) {
                    _this._attachedCamera.alpha -= _this._cameraRotationSpeed * (dt / 1000);
                }
            });
        };
        AutoRotationBehavior.prototype.detach = function () {
            if (!this._attachedCamera) {
                return;
            }
            var scene = this._attachedCamera.getScene();
            if (this._onPrePointerObservableObserver) {
                scene.onPrePointerObservable.remove(this._onPrePointerObservableObserver);
            }
            this._attachedCamera.onAfterCheckInputsObservable.remove(this._onAfterCheckInputsObserver);
            this._attachedCamera = null;
        };
        /**
         * Returns true if user is scrolling.
         * @return true if user is scrolling.
         */
        AutoRotationBehavior.prototype._userIsZooming = function () {
            if (!this._attachedCamera) {
                return false;
            }
            return this._attachedCamera.inertialRadiusOffset !== 0;
        };
        AutoRotationBehavior.prototype._shouldAnimationStopForInteraction = function () {
            if (!this._attachedCamera) {
                return false;
            }
            var zoomHasHitLimit = false;
            if (this._lastFrameRadius === this._attachedCamera.radius && this._attachedCamera.inertialRadiusOffset !== 0) {
                zoomHasHitLimit = true;
            }
            // Update the record of previous radius - works as an approx. indicator of hitting radius limits
            this._lastFrameRadius = this._attachedCamera.radius;
            return this._zoomStopsAnimation ? zoomHasHitLimit : this._userIsZooming();
        };
        /**
         *  Applies any current user interaction to the camera. Takes into account maximum alpha rotation.
         */
        AutoRotationBehavior.prototype._applyUserInteraction = function () {
            if (this._userIsMoving() && !this._shouldAnimationStopForInteraction()) {
                this._lastInteractionTime = LIB.Tools.Now;
            }
        };
        // Tools
        AutoRotationBehavior.prototype._userIsMoving = function () {
            if (!this._attachedCamera) {
                return false;
            }
            return this._attachedCamera.inertialAlphaOffset !== 0 ||
                this._attachedCamera.inertialBetaOffset !== 0 ||
                this._attachedCamera.inertialRadiusOffset !== 0 ||
                this._attachedCamera.inertialPanningX !== 0 ||
                this._attachedCamera.inertialPanningY !== 0 ||
                this._isPointerDown;
        };
        return AutoRotationBehavior;
    }());
    LIB.AutoRotationBehavior = AutoRotationBehavior;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.autoRotationBehavior.js.map
//# sourceMappingURL=LIB.autoRotationBehavior.js.map
