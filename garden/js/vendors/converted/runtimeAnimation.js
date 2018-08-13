
var LIB;
(function (LIB) {
    /**
     * Defines a runtime animation
     */
    var RuntimeAnimation = /** @class */ (function () {
        /**
         * Create a new RuntimeAnimation object
         * @param target defines the target of the animation
         * @param animation defines the source animation object
         * @param scene defines the hosting scene
         * @param host defines the initiating Animatable
         */
        function RuntimeAnimation(target, animation, scene, host) {
            /**
             * The current frame of the runtime animation
             */
            this._currentFrame = 0;
            /**
             * The original value of the runtime animation
             */
            this._originalValue = new Array();
            /**
             * The offsets cache of the runtime animation
             */
            this._offsetsCache = {};
            /**
             * The high limits cache of the runtime animation
             */
            this._highLimitsCache = {};
            /**
             * Specifies if the runtime animation has been stopped
             */
            this._stopped = false;
            /**
             * The blending factor of the runtime animation
             */
            this._blendingFactor = 0;
            /**
             * The target path of the runtime animation
             */
            this._targetPath = "";
            /**
             * The weight of the runtime animation
             */
            this._weight = 1.0;
            /**
             * The ratio offset of the runtime animation
             */
            this._ratioOffset = 0;
            /**
             * The previous delay of the runtime animation
             */
            this._previousDelay = 0;
            /**
             * The previous ratio of the runtime animation
             */
            this._previousRatio = 0;
            this._animation = animation;
            this._target = target;
            this._scene = scene;
            this._host = host;
            animation._runtimeAnimations.push(this);
        }
        Object.defineProperty(RuntimeAnimation.prototype, "currentFrame", {
            /**
             * Gets the current frame of the runtime animation
             */
            get: function () {
                return this._currentFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RuntimeAnimation.prototype, "weight", {
            /**
             * Gets the weight of the runtime animation
             */
            get: function () {
                return this._weight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RuntimeAnimation.prototype, "currentValue", {
            /**
             * Gets the current value of the runtime animation
             */
            get: function () {
                return this._currentValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RuntimeAnimation.prototype, "targetPath", {
            /**
             * Gets the target path of the runtime animation
             */
            get: function () {
                return this._targetPath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RuntimeAnimation.prototype, "target", {
            /**
             * Gets the actual target of the runtime animation
             */
            get: function () {
                return this._activeTarget;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RuntimeAnimation.prototype, "animation", {
            /**
             * Gets the animation from the runtime animation
             */
            get: function () {
                return this._animation;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Resets the runtime animation to the beginning
         * @param restoreOriginal defines whether to restore the target property to the original value
         */
        RuntimeAnimation.prototype.reset = function (restoreOriginal) {
            if (restoreOriginal === void 0) { restoreOriginal = false; }
            if (restoreOriginal) {
                if (this._target instanceof Array) {
                    var index = 0;
                    for (var _i = 0, _a = this._target; _i < _a.length; _i++) {
                        var target = _a[_i];
                        if (this._originalValue[index] !== undefined) {
                            this._setValue(target, this._originalValue[index], -1);
                        }
                        index++;
                    }
                }
                else {
                    if (this._originalValue[0] !== undefined) {
                        this._setValue(this._target, this._originalValue[0], -1);
                    }
                }
            }
            this._offsetsCache = {};
            this._highLimitsCache = {};
            this._currentFrame = 0;
            this._blendingFactor = 0;
            this._originalValue = new Array();
        };
        /**
         * Specifies if the runtime animation is stopped
         * @returns Boolean specifying if the runtime animation is stopped
         */
        RuntimeAnimation.prototype.isStopped = function () {
            return this._stopped;
        };
        /**
         * Disposes of the runtime animation
         */
        RuntimeAnimation.prototype.dispose = function () {
            var index = this._animation.runtimeAnimations.indexOf(this);
            if (index > -1) {
                this._animation.runtimeAnimations.splice(index, 1);
            }
        };
        /**
         * Interpolates the animation from the current frame
         * @param currentFrame The frame to interpolate the animation to
         * @param repeatCount The number of times that the animation should loop
         * @param loopMode The type of looping mode to use
         * @param offsetValue Animation offset value
         * @param highLimitValue The high limit value
         * @returns The interpolated value
         */
        RuntimeAnimation.prototype._interpolate = function (currentFrame, repeatCount, loopMode, offsetValue, highLimitValue) {
            this._currentFrame = currentFrame;
            if (this._animation.dataType === LIB.Animation.ANIMATIONTYPE_MATRIX && !this._workValue) {
                this._workValue = LIB.Matrix.Zero();
            }
            return this._animation._interpolate(currentFrame, repeatCount, this._workValue, loopMode, offsetValue, highLimitValue);
        };
        /**
         * Apply the interpolated value to the target
         * @param currentValue defines the value computed by the animation
         * @param weight defines the weight to apply to this value (Defaults to 1.0)
         */
        RuntimeAnimation.prototype.setValue = function (currentValue, weight) {
            if (weight === void 0) { weight = 1.0; }
            if (this._target instanceof Array) {
                var index = 0;
                for (var _i = 0, _a = this._target; _i < _a.length; _i++) {
                    var target = _a[_i];
                    this._setValue(target, currentValue, weight, index);
                    index++;
                }
            }
            else {
                this._setValue(this._target, currentValue, weight);
            }
        };
        RuntimeAnimation.prototype._setValue = function (target, currentValue, weight, targetIndex) {
            if (targetIndex === void 0) { targetIndex = 0; }
            // Set value
            var path;
            var destination;
            var targetPropertyPath = this._animation.targetPropertyPath;
            if (targetPropertyPath.length > 1) {
                var property = target[targetPropertyPath[0]];
                for (var index = 1; index < targetPropertyPath.length - 1; index++) {
                    property = property[targetPropertyPath[index]];
                }
                path = targetPropertyPath[targetPropertyPath.length - 1];
                destination = property;
            }
            else {
                path = targetPropertyPath[0];
                destination = target;
            }
            this._targetPath = path;
            this._activeTarget = destination;
            this._weight = weight;
            if (this._originalValue[targetIndex] === undefined) {
                var originalValue = void 0;
                if (destination.getRestPose && path === "_matrix") { // For bones
                    originalValue = destination.getRestPose();
                }
                else {
                    originalValue = destination[path];
                }
                if (originalValue && originalValue.clone) {
                    this._originalValue[targetIndex] = originalValue.clone();
                }
                else {
                    this._originalValue[targetIndex] = originalValue;
                }
            }
            // Blending
            var enableBlending = target && target.animationPropertiesOverride ? target.animationPropertiesOverride.enableBlending : this._animation.enableBlending;
            if (enableBlending && this._blendingFactor <= 1.0) {
                if (!this._originalBlendValue) {
                    var originalValue = destination[path];
                    if (originalValue.clone) {
                        this._originalBlendValue = originalValue.clone();
                    }
                    else {
                        this._originalBlendValue = originalValue;
                    }
                }
                if (this._originalBlendValue.m) { // Matrix
                    if (LIB.Animation.AllowMatrixDecomposeForInterpolation) {
                        if (this._currentValue) {
                            LIB.Matrix.DecomposeLerpToRef(this._originalBlendValue, currentValue, this._blendingFactor, this._currentValue);
                        }
                        else {
                            this._currentValue = LIB.Matrix.DecomposeLerp(this._originalBlendValue, currentValue, this._blendingFactor);
                        }
                    }
                    else {
                        if (this._currentValue) {
                            LIB.Matrix.LerpToRef(this._originalBlendValue, currentValue, this._blendingFactor, this._currentValue);
                        }
                        else {
                            this._currentValue = LIB.Matrix.Lerp(this._originalBlendValue, currentValue, this._blendingFactor);
                        }
                    }
                }
                else {
                    this._currentValue = LIB.Animation._UniversalLerp(this._originalBlendValue, currentValue, this._blendingFactor);
                }
                var blendingSpeed = target && target.animationPropertiesOverride ? target.animationPropertiesOverride.blendingSpeed : this._animation.blendingSpeed;
                this._blendingFactor += blendingSpeed;
            }
            else {
                this._currentValue = currentValue;
            }
            if (weight !== -1.0) {
                this._scene._registerTargetForLateAnimationBinding(this, this._originalValue[targetIndex]);
            }
            else {
                destination[path] = this._currentValue;
            }
            if (target.markAsDirty) {
                target.markAsDirty(this._animation.targetProperty);
            }
        };
        /**
         * Gets the loop pmode of the runtime animation
         * @returns Loop Mode
         */
        RuntimeAnimation.prototype._getCorrectLoopMode = function () {
            if (this._target && this._target.animationPropertiesOverride) {
                return this._target.animationPropertiesOverride.loopMode;
            }
            return this._animation.loopMode;
        };
        /**
         * Move the current animation to a given frame
         * @param frame defines the frame to move to
         */
        RuntimeAnimation.prototype.goToFrame = function (frame) {
            var keys = this._animation.getKeys();
            if (frame < keys[0].frame) {
                frame = keys[0].frame;
            }
            else if (frame > keys[keys.length - 1].frame) {
                frame = keys[keys.length - 1].frame;
            }
            var currentValue = this._interpolate(frame, 0, this._getCorrectLoopMode());
            this.setValue(currentValue, -1);
        };
        /**
         * @hidden Internal use only
         */
        RuntimeAnimation.prototype._prepareForSpeedRatioChange = function (newSpeedRatio) {
            var newRatio = this._previousDelay * (this._animation.framePerSecond * newSpeedRatio) / 1000.0;
            this._ratioOffset = this._previousRatio - newRatio;
        };
        /**
         * Execute the current animation
         * @param delay defines the delay to add to the current frame
         * @param from defines the lower bound of the animation range
         * @param to defines the upper bound of the animation range
         * @param loop defines if the current animation must loop
         * @param speedRatio defines the current speed ratio
         * @param weight defines the weight of the animation (default is -1 so no weight)
         * @returns a boolean indicating if the animation has ended
         */
        RuntimeAnimation.prototype.animate = function (delay, from, to, loop, speedRatio, weight) {
            if (weight === void 0) { weight = -1.0; }
            var targetPropertyPath = this._animation.targetPropertyPath;
            if (!targetPropertyPath || targetPropertyPath.length < 1) {
                this._stopped = true;
                return false;
            }
            var returnValue = true;
            var keys = this._animation.getKeys();
            // Adding a start key at frame 0 if missing
            if (keys[0].frame !== 0) {
                var newKey = { frame: 0, value: keys[0].value };
                keys.splice(0, 0, newKey);
            }
            // Check limits
            if (from < keys[0].frame || from > keys[keys.length - 1].frame) {
                from = keys[0].frame;
            }
            if (to < keys[0].frame || to > keys[keys.length - 1].frame) {
                to = keys[keys.length - 1].frame;
            }
            //to and from cannot be the same key
            if (from === to) {
                if (from > keys[0].frame) {
                    from--;
                }
                else if (to < keys[keys.length - 1].frame) {
                    to++;
                }
            }
            // Compute ratio
            var range = to - from;
            var offsetValue;
            // ratio represents the frame delta between from and to
            var ratio = (delay * (this._animation.framePerSecond * speedRatio) / 1000.0) + this._ratioOffset;
            var highLimitValue = 0;
            this._previousDelay = delay;
            this._previousRatio = ratio;
            if (((to > from && ratio > range) || (from > to && ratio < range)) && !loop) { // If we are out of range and not looping get back to caller
                returnValue = false;
                highLimitValue = this._animation._getKeyValue(keys[keys.length - 1].value);
            }
            else {
                // Get max value if required
                if (this._getCorrectLoopMode() !== LIB.Animation.ANIMATIONLOOPMODE_CYCLE) {
                    var keyOffset = to.toString() + from.toString();
                    if (!this._offsetsCache[keyOffset]) {
                        var fromValue = this._interpolate(from, 0, LIB.Animation.ANIMATIONLOOPMODE_CYCLE);
                        var toValue = this._interpolate(to, 0, LIB.Animation.ANIMATIONLOOPMODE_CYCLE);
                        switch (this._animation.dataType) {
                            // Float
                            case LIB.Animation.ANIMATIONTYPE_FLOAT:
                                this._offsetsCache[keyOffset] = toValue - fromValue;
                                break;
                            // Quaternion
                            case LIB.Animation.ANIMATIONTYPE_QUATERNION:
                                this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                                break;
                            // Vector3
                            case LIB.Animation.ANIMATIONTYPE_VECTOR3:
                                this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                            // Vector2
                            case LIB.Animation.ANIMATIONTYPE_VECTOR2:
                                this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                            // Size
                            case LIB.Animation.ANIMATIONTYPE_SIZE:
                                this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                            // Color3
                            case LIB.Animation.ANIMATIONTYPE_COLOR3:
                                this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                            default:
                                break;
                        }
                        this._highLimitsCache[keyOffset] = toValue;
                    }
                    highLimitValue = this._highLimitsCache[keyOffset];
                    offsetValue = this._offsetsCache[keyOffset];
                }
            }
            if (offsetValue === undefined) {
                switch (this._animation.dataType) {
                    // Float
                    case LIB.Animation.ANIMATIONTYPE_FLOAT:
                        offsetValue = 0;
                        break;
                    // Quaternion
                    case LIB.Animation.ANIMATIONTYPE_QUATERNION:
                        offsetValue = new LIB.Quaternion(0, 0, 0, 0);
                        break;
                    // Vector3
                    case LIB.Animation.ANIMATIONTYPE_VECTOR3:
                        offsetValue = LIB.Vector3.Zero();
                        break;
                    // Vector2
                    case LIB.Animation.ANIMATIONTYPE_VECTOR2:
                        offsetValue = LIB.Vector2.Zero();
                        break;
                    // Size
                    case LIB.Animation.ANIMATIONTYPE_SIZE:
                        offsetValue = LIB.Size.Zero();
                        break;
                    // Color3
                    case LIB.Animation.ANIMATIONTYPE_COLOR3:
                        offsetValue = LIB.Color3.Black();
                }
            }
            // Compute value
            var repeatCount = (ratio / range) >> 0;
            var currentFrame = returnValue ? from + ratio % range : to;
            // Need to normalize?
            if (this._host && this._host.syncRoot) {
                var syncRoot = this._host.syncRoot;
                var hostNormalizedFrame = (syncRoot.masterFrame - syncRoot.fromFrame) / (syncRoot.toFrame - syncRoot.fromFrame);
                currentFrame = from + (to - from) * hostNormalizedFrame;
            }
            var currentValue = this._interpolate(currentFrame, repeatCount, this._getCorrectLoopMode(), offsetValue, highLimitValue);
            // Set value
            this.setValue(currentValue, weight);
            // Check events
            var events = this._animation.getEvents();
            for (var index = 0; index < events.length; index++) {
                // Make sure current frame has passed event frame and that event frame is within the current range
                // Also, handle both forward and reverse animations
                if ((range > 0 && currentFrame >= events[index].frame && events[index].frame >= from) ||
                    (range < 0 && currentFrame <= events[index].frame && events[index].frame <= from)) {
                    var event = events[index];
                    if (!event.isDone) {
                        // If event should be done only once, remove it.
                        if (event.onlyOnce) {
                            events.splice(index, 1);
                            index--;
                        }
                        event.isDone = true;
                        event.action();
                    } // Don't do anything if the event has already be done.
                }
                else if (events[index].isDone && !events[index].onlyOnce) {
                    // reset event, the animation is looping
                    events[index].isDone = false;
                }
            }
            if (!returnValue) {
                this._stopped = true;
            }
            return returnValue;
        };
        return RuntimeAnimation;
    }());
    LIB.RuntimeAnimation = RuntimeAnimation;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.runtimeAnimation.js.map
//# sourceMappingURL=LIB.runtimeAnimation.js.map
