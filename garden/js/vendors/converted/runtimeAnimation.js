(function (LIB) {
    var RuntimeAnimation = /** @class */ (function () {
        function RuntimeAnimation(target, animation) {
            this._offsetsCache = {};
            this._highLimitsCache = {};
            this._stopped = false;
            this._blendingFactor = 0;
            this._ratioOffset = 0;
            this._animation = animation;
            this._target = target;
            animation._runtimeAnimations.push(this);
        }
        Object.defineProperty(RuntimeAnimation.prototype, "animation", {
            get: function () {
                return this._animation;
            },
            enumerable: true,
            configurable: true
        });
        RuntimeAnimation.prototype.reset = function () {
            this._offsetsCache = {};
            this._highLimitsCache = {};
            this.currentFrame = 0;
            this._blendingFactor = 0;
            this._originalBlendValue = null;
        };
        RuntimeAnimation.prototype.isStopped = function () {
            return this._stopped;
        };
        RuntimeAnimation.prototype.dispose = function () {
            var index = this._animation.runtimeAnimations.indexOf(this);
            if (index > -1) {
                this._animation.runtimeAnimations.splice(index, 1);
            }
        };
        RuntimeAnimation.prototype._getKeyValue = function (value) {
            if (typeof value === "function") {
                return value();
            }
            return value;
        };
        RuntimeAnimation.prototype._interpolate = function (currentFrame, repeatCount, loopMode, offsetValue, highLimitValue) {
            if (loopMode === LIB.Animation.ANIMATIONLOOPMODE_CONSTANT && repeatCount > 0) {
                return highLimitValue.clone ? highLimitValue.clone() : highLimitValue;
            }
            this.currentFrame = currentFrame;
            var keys = this._animation.getKeys();
            // Try to get a hash to find the right key
            var startKeyIndex = Math.max(0, Math.min(keys.length - 1, Math.floor(keys.length * (currentFrame - keys[0].frame) / (keys[keys.length - 1].frame - keys[0].frame)) - 1));
            if (keys[startKeyIndex].frame >= currentFrame) {
                while (startKeyIndex - 1 >= 0 && keys[startKeyIndex].frame >= currentFrame) {
                    startKeyIndex--;
                }
            }
            for (var key = startKeyIndex; key < keys.length; key++) {
                var endKey = keys[key + 1];
                if (endKey.frame >= currentFrame) {
                    var startKey = keys[key];
                    var startValue = this._getKeyValue(startKey.value);
                    var endValue = this._getKeyValue(endKey.value);
                    var useTangent = startKey.outTangent !== undefined && endKey.inTangent !== undefined;
                    var frameDelta = endKey.frame - startKey.frame;
                    // gradient : percent of currentFrame between the frame inf and the frame sup
                    var gradient = (currentFrame - startKey.frame) / frameDelta;
                    // check for easingFunction and correction of gradient
                    var easingFunction = this._animation.getEasingFunction();
                    if (easingFunction != null) {
                        gradient = easingFunction.ease(gradient);
                    }
                    switch (this._animation.dataType) {
                        // Float
                        case LIB.Animation.ANIMATIONTYPE_FLOAT:
                            var floatValue = useTangent ? this._animation.floatInterpolateFunctionWithTangents(startValue, startKey.outTangent * frameDelta, endValue, endKey.inTangent * frameDelta, gradient) : this._animation.floatInterpolateFunction(startValue, endValue, gradient);
                            switch (loopMode) {
                                case LIB.Animation.ANIMATIONLOOPMODE_CYCLE:
                                case LIB.Animation.ANIMATIONLOOPMODE_CONSTANT:
                                    return floatValue;
                                case LIB.Animation.ANIMATIONLOOPMODE_RELATIVE:
                                    return offsetValue * repeatCount + floatValue;
                            }
                            break;
                        // Quaternion
                        case LIB.Animation.ANIMATIONTYPE_QUATERNION:
                            var quatValue = useTangent ? this._animation.quaternionInterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this._animation.quaternionInterpolateFunction(startValue, endValue, gradient);
                            switch (loopMode) {
                                case LIB.Animation.ANIMATIONLOOPMODE_CYCLE:
                                case LIB.Animation.ANIMATIONLOOPMODE_CONSTANT:
                                    return quatValue;
                                case LIB.Animation.ANIMATIONLOOPMODE_RELATIVE:
                                    return quatValue.add(offsetValue.scale(repeatCount));
                            }
                            return quatValue;
                        // Vector3
                        case LIB.Animation.ANIMATIONTYPE_VECTOR3:
                            var vec3Value = useTangent ? this._animation.vector3InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this._animation.vector3InterpolateFunction(startValue, endValue, gradient);
                            switch (loopMode) {
                                case LIB.Animation.ANIMATIONLOOPMODE_CYCLE:
                                case LIB.Animation.ANIMATIONLOOPMODE_CONSTANT:
                                    return vec3Value;
                                case LIB.Animation.ANIMATIONLOOPMODE_RELATIVE:
                                    return vec3Value.add(offsetValue.scale(repeatCount));
                            }
                        // Vector2
                        case LIB.Animation.ANIMATIONTYPE_VECTOR2:
                            var vec2Value = useTangent ? this._animation.vector2InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this._animation.vector2InterpolateFunction(startValue, endValue, gradient);
                            switch (loopMode) {
                                case LIB.Animation.ANIMATIONLOOPMODE_CYCLE:
                                case LIB.Animation.ANIMATIONLOOPMODE_CONSTANT:
                                    return vec2Value;
                                case LIB.Animation.ANIMATIONLOOPMODE_RELATIVE:
                                    return vec2Value.add(offsetValue.scale(repeatCount));
                            }
                        // Size
                        case LIB.Animation.ANIMATIONTYPE_SIZE:
                            switch (loopMode) {
                                case LIB.Animation.ANIMATIONLOOPMODE_CYCLE:
                                case LIB.Animation.ANIMATIONLOOPMODE_CONSTANT:
                                    return this._animation.sizeInterpolateFunction(startValue, endValue, gradient);
                                case LIB.Animation.ANIMATIONLOOPMODE_RELATIVE:
                                    return this._animation.sizeInterpolateFunction(startValue, endValue, gradient).add(offsetValue.scale(repeatCount));
                            }
                        // Color3
                        case LIB.Animation.ANIMATIONTYPE_COLOR3:
                            switch (loopMode) {
                                case LIB.Animation.ANIMATIONLOOPMODE_CYCLE:
                                case LIB.Animation.ANIMATIONLOOPMODE_CONSTANT:
                                    return this._animation.color3InterpolateFunction(startValue, endValue, gradient);
                                case LIB.Animation.ANIMATIONLOOPMODE_RELATIVE:
                                    return this._animation.color3InterpolateFunction(startValue, endValue, gradient).add(offsetValue.scale(repeatCount));
                            }
                        // Matrix
                        case LIB.Animation.ANIMATIONTYPE_MATRIX:
                            switch (loopMode) {
                                case LIB.Animation.ANIMATIONLOOPMODE_CYCLE:
                                case LIB.Animation.ANIMATIONLOOPMODE_CONSTANT:
                                    if (LIB.Animation.AllowMatricesInterpolation) {
                                        return this._animation.matrixInterpolateFunction(startValue, endValue, gradient);
                                    }
                                case LIB.Animation.ANIMATIONLOOPMODE_RELATIVE:
                                    return startValue;
                            }
                        default:
                            break;
                    }
                    break;
                }
            }
            return this._getKeyValue(keys[keys.length - 1].value);
        };
        RuntimeAnimation.prototype.setValue = function (currentValue, blend) {
            if (blend === void 0) { blend = false; }
            // Set value
            var path;
            var destination;
            var targetPropertyPath = this._animation.targetPropertyPath;
            if (targetPropertyPath.length > 1) {
                var property = this._target[targetPropertyPath[0]];
                for (var index = 1; index < targetPropertyPath.length - 1; index++) {
                    property = property[targetPropertyPath[index]];
                }
                path = targetPropertyPath[targetPropertyPath.length - 1];
                destination = property;
            }
            else {
                path = targetPropertyPath[0];
                destination = this._target;
            }
            // Blending
            if (this._animation.enableBlending && this._blendingFactor <= 1.0) {
                if (!this._originalBlendValue) {
                    if (destination[path].clone) {
                        this._originalBlendValue = destination[path].clone();
                    }
                    else {
                        this._originalBlendValue = destination[path];
                    }
                }
                if (this._originalBlendValue.prototype) {
                    if (this._originalBlendValue.prototype.Lerp) {
                        destination[path] = this._originalBlendValue.construtor.prototype.Lerp(currentValue, this._originalBlendValue, this._blendingFactor);
                    }
                    else {
                        destination[path] = currentValue;
                    }
                }
                else if (this._originalBlendValue.m) {
                    destination[path] = LIB.Matrix.Lerp(this._originalBlendValue, currentValue, this._blendingFactor);
                }
                else {
                    destination[path] = this._originalBlendValue * (1.0 - this._blendingFactor) + this._blendingFactor * currentValue;
                }
                this._blendingFactor += this._animation.blendingSpeed;
            }
            else {
                destination[path] = currentValue;
            }
            if (this._target.markAsDirty) {
                this._target.markAsDirty(this._animation.targetProperty);
            }
        };
        RuntimeAnimation.prototype.goToFrame = function (frame) {
            var keys = this._animation.getKeys();
            if (frame < keys[0].frame) {
                frame = keys[0].frame;
            }
            else if (frame > keys[keys.length - 1].frame) {
                frame = keys[keys.length - 1].frame;
            }
            var currentValue = this._interpolate(frame, 0, this._animation.loopMode);
            this.setValue(currentValue);
        };
        RuntimeAnimation.prototype._prepareForSpeedRatioChange = function (newSpeedRatio) {
            var newRatio = this._previousDelay * (this._animation.framePerSecond * newSpeedRatio) / 1000.0;
            this._ratioOffset = this._previousRatio - newRatio;
        };
        RuntimeAnimation.prototype.animate = function (delay, from, to, loop, speedRatio, blend) {
            if (blend === void 0) { blend = false; }
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
            if (((to > from && ratio > range) || (from > to && ratio < range)) && !loop) {
                returnValue = false;
                highLimitValue = this._getKeyValue(keys[keys.length - 1].value);
            }
            else {
                // Get max value if required
                if (this._animation.loopMode !== LIB.Animation.ANIMATIONLOOPMODE_CYCLE) {
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
            var currentValue = this._interpolate(currentFrame, repeatCount, this._animation.loopMode, offsetValue, highLimitValue);
            // Set value
            this.setValue(currentValue);
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
