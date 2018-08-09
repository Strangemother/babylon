var BABYLON;
(function (BABYLON) {
    var AnimationRange = /** @class */ (function () {
        function AnimationRange(name, from, to) {
            this.name = name;
            this.from = from;
            this.to = to;
        }
        AnimationRange.prototype.clone = function () {
            return new AnimationRange(this.name, this.from, this.to);
        };
        return AnimationRange;
    }());
    BABYLON.AnimationRange = AnimationRange;
    /**
     * Composed of a frame, and an action function
     */
    var AnimationEvent = /** @class */ (function () {
        function AnimationEvent(frame, action, onlyOnce) {
            this.frame = frame;
            this.action = action;
            this.onlyOnce = onlyOnce;
            this.isDone = false;
        }
        return AnimationEvent;
    }());
    BABYLON.AnimationEvent = AnimationEvent;
    var PathCursor = /** @class */ (function () {
        function PathCursor(path) {
            this.path = path;
            this._onchange = new Array();
            this.value = 0;
            this.animations = new Array();
        }
        PathCursor.prototype.getPoint = function () {
            var point = this.path.getPointAtLengthPosition(this.value);
            return new BABYLON.Vector3(point.x, 0, point.y);
        };
        PathCursor.prototype.moveAhead = function (step) {
            if (step === void 0) { step = 0.002; }
            this.move(step);
            return this;
        };
        PathCursor.prototype.moveBack = function (step) {
            if (step === void 0) { step = 0.002; }
            this.move(-step);
            return this;
        };
        PathCursor.prototype.move = function (step) {
            if (Math.abs(step) > 1) {
                throw "step size should be less than 1.";
            }
            this.value += step;
            this.ensureLimits();
            this.raiseOnChange();
            return this;
        };
        PathCursor.prototype.ensureLimits = function () {
            while (this.value > 1) {
                this.value -= 1;
            }
            while (this.value < 0) {
                this.value += 1;
            }
            return this;
        };
        // used by animation engine
        PathCursor.prototype.raiseOnChange = function () {
            var _this = this;
            this._onchange.forEach(function (f) { return f(_this); });
            return this;
        };
        PathCursor.prototype.onchange = function (f) {
            this._onchange.push(f);
            return this;
        };
        return PathCursor;
    }());
    BABYLON.PathCursor = PathCursor;
    var Animation = /** @class */ (function () {
        function Animation(name, targetProperty, framePerSecond, dataType, loopMode, enableBlending) {
            this.name = name;
            this.targetProperty = targetProperty;
            this.framePerSecond = framePerSecond;
            this.dataType = dataType;
            this.loopMode = loopMode;
            this.enableBlending = enableBlending;
            this._runtimeAnimations = new Array();
            // The set of event that will be linked to this animation
            this._events = new Array();
            this.blendingSpeed = 0.01;
            this._ranges = {};
            this.targetPropertyPath = targetProperty.split(".");
            this.dataType = dataType;
            this.loopMode = loopMode === undefined ? Animation.ANIMATIONLOOPMODE_CYCLE : loopMode;
        }
        Animation._PrepareAnimation = function (name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction) {
            var dataType = undefined;
            if (!isNaN(parseFloat(from)) && isFinite(from)) {
                dataType = Animation.ANIMATIONTYPE_FLOAT;
            }
            else if (from instanceof BABYLON.Quaternion) {
                dataType = Animation.ANIMATIONTYPE_QUATERNION;
            }
            else if (from instanceof BABYLON.Vector3) {
                dataType = Animation.ANIMATIONTYPE_VECTOR3;
            }
            else if (from instanceof BABYLON.Vector2) {
                dataType = Animation.ANIMATIONTYPE_VECTOR2;
            }
            else if (from instanceof BABYLON.Color3) {
                dataType = Animation.ANIMATIONTYPE_COLOR3;
            }
            else if (from instanceof BABYLON.Size) {
                dataType = Animation.ANIMATIONTYPE_SIZE;
            }
            if (dataType == undefined) {
                return null;
            }
            var animation = new Animation(name, targetProperty, framePerSecond, dataType, loopMode);
            var keys = [{ frame: 0, value: from }, { frame: totalFrame, value: to }];
            animation.setKeys(keys);
            if (easingFunction !== undefined) {
                animation.setEasingFunction(easingFunction);
            }
            return animation;
        };
        /**
         * Sets up an animation.
         * @param property the property to animate
         * @param animationType the animation type to apply
         * @param easingFunction the easing function used in the animation
         * @returns The created animation
         */
        Animation.CreateAnimation = function (property, animationType, framePerSecond, easingFunction) {
            var animation = new Animation(property + "Animation", property, framePerSecond, animationType, Animation.ANIMATIONLOOPMODE_CONSTANT);
            animation.setEasingFunction(easingFunction);
            return animation;
        };
        Animation.CreateAndStartAnimation = function (name, node, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
            var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
            if (!animation) {
                return null;
            }
            return node.getScene().beginDirectAnimation(node, [animation], 0, totalFrame, (animation.loopMode === 1), 1.0, onAnimationEnd);
        };
        Animation.CreateMergeAndStartAnimation = function (name, node, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
            var animation = Animation._PrepareAnimation(name, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
            if (!animation) {
                return null;
            }
            node.animations.push(animation);
            return node.getScene().beginAnimation(node, 0, totalFrame, (animation.loopMode === 1), 1.0, onAnimationEnd);
        };
        /**
         * Transition property of the Camera to the target Value.
         * @param property The property to transition
         * @param targetValue The target Value of the property
         * @param host The object where the property to animate belongs
         * @param scene Scene used to run the animation
         * @param frameRate Framerate (in frame/s) to use
         * @param transition The transition type we want to use
         * @param duration The duration of the animation, in milliseconds
         * @param onAnimationEnd Call back trigger at the end of the animation.
         */
        Animation.TransitionTo = function (property, targetValue, host, scene, frameRate, transition, duration, onAnimationEnd) {
            if (onAnimationEnd === void 0) { onAnimationEnd = null; }
            if (duration <= 0) {
                host[property] = targetValue;
                if (onAnimationEnd) {
                    onAnimationEnd();
                }
                return null;
            }
            var endFrame = frameRate * (duration / 1000);
            transition.setKeys([{
                    frame: 0,
                    value: host[property].clone ? host[property].clone() : host[property]
                },
                {
                    frame: endFrame,
                    value: targetValue
                }]);
            if (!host.animations) {
                host.animations = [];
            }
            host.animations.push(transition);
            var animation = scene.beginAnimation(host, 0, endFrame, false);
            animation.onAnimationEnd = onAnimationEnd;
            return animation;
        };
        Object.defineProperty(Animation.prototype, "runtimeAnimations", {
            /**
             * Return the array of runtime animations currently using this animation
             */
            get: function () {
                return this._runtimeAnimations;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "hasRunningRuntimeAnimations", {
            get: function () {
                for (var _i = 0, _a = this._runtimeAnimations; _i < _a.length; _i++) {
                    var runtimeAnimation = _a[_i];
                    if (!runtimeAnimation.isStopped) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        // Methods
        /**
         * @param {boolean} fullDetails - support for multiple levels of logging within scene loading
         */
        Animation.prototype.toString = function (fullDetails) {
            var ret = "Name: " + this.name + ", property: " + this.targetProperty;
            ret += ", datatype: " + (["Float", "Vector3", "Quaternion", "Matrix", "Color3", "Vector2"])[this.dataType];
            ret += ", nKeys: " + (this._keys ? this._keys.length : "none");
            ret += ", nRanges: " + (this._ranges ? Object.keys(this._ranges).length : "none");
            if (fullDetails) {
                ret += ", Ranges: {";
                var first = true;
                for (var name in this._ranges) {
                    if (first) {
                        ret += ", ";
                        first = false;
                    }
                    ret += name;
                }
                ret += "}";
            }
            return ret;
        };
        /**
         * Add an event to this animation.
         */
        Animation.prototype.addEvent = function (event) {
            this._events.push(event);
        };
        /**
         * Remove all events found at the given frame
         * @param frame
         */
        Animation.prototype.removeEvents = function (frame) {
            for (var index = 0; index < this._events.length; index++) {
                if (this._events[index].frame === frame) {
                    this._events.splice(index, 1);
                    index--;
                }
            }
        };
        Animation.prototype.getEvents = function () {
            return this._events;
        };
        Animation.prototype.createRange = function (name, from, to) {
            // check name not already in use; could happen for bones after serialized
            if (!this._ranges[name]) {
                this._ranges[name] = new AnimationRange(name, from, to);
            }
        };
        Animation.prototype.deleteRange = function (name, deleteFrames) {
            if (deleteFrames === void 0) { deleteFrames = true; }
            var range = this._ranges[name];
            if (!range) {
                return;
            }
            if (deleteFrames) {
                var from = range.from;
                var to = range.to;
                // this loop MUST go high to low for multiple splices to work
                for (var key = this._keys.length - 1; key >= 0; key--) {
                    if (this._keys[key].frame >= from && this._keys[key].frame <= to) {
                        this._keys.splice(key, 1);
                    }
                }
            }
            this._ranges[name] = null; // said much faster than 'delete this._range[name]'
        };
        Animation.prototype.getRange = function (name) {
            return this._ranges[name];
        };
        Animation.prototype.getKeys = function () {
            return this._keys;
        };
        Animation.prototype.getHighestFrame = function () {
            var ret = 0;
            for (var key = 0, nKeys = this._keys.length; key < nKeys; key++) {
                if (ret < this._keys[key].frame) {
                    ret = this._keys[key].frame;
                }
            }
            return ret;
        };
        Animation.prototype.getEasingFunction = function () {
            return this._easingFunction;
        };
        Animation.prototype.setEasingFunction = function (easingFunction) {
            this._easingFunction = easingFunction;
        };
        Animation.prototype.floatInterpolateFunction = function (startValue, endValue, gradient) {
            return BABYLON.Scalar.Lerp(startValue, endValue, gradient);
        };
        Animation.prototype.floatInterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
            return BABYLON.Scalar.Hermite(startValue, outTangent, endValue, inTangent, gradient);
        };
        Animation.prototype.quaternionInterpolateFunction = function (startValue, endValue, gradient) {
            return BABYLON.Quaternion.Slerp(startValue, endValue, gradient);
        };
        Animation.prototype.quaternionInterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
            return BABYLON.Quaternion.Hermite(startValue, outTangent, endValue, inTangent, gradient).normalize();
        };
        Animation.prototype.vector3InterpolateFunction = function (startValue, endValue, gradient) {
            return BABYLON.Vector3.Lerp(startValue, endValue, gradient);
        };
        Animation.prototype.vector3InterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
            return BABYLON.Vector3.Hermite(startValue, outTangent, endValue, inTangent, gradient);
        };
        Animation.prototype.vector2InterpolateFunction = function (startValue, endValue, gradient) {
            return BABYLON.Vector2.Lerp(startValue, endValue, gradient);
        };
        Animation.prototype.vector2InterpolateFunctionWithTangents = function (startValue, outTangent, endValue, inTangent, gradient) {
            return BABYLON.Vector2.Hermite(startValue, outTangent, endValue, inTangent, gradient);
        };
        Animation.prototype.sizeInterpolateFunction = function (startValue, endValue, gradient) {
            return BABYLON.Size.Lerp(startValue, endValue, gradient);
        };
        Animation.prototype.color3InterpolateFunction = function (startValue, endValue, gradient) {
            return BABYLON.Color3.Lerp(startValue, endValue, gradient);
        };
        Animation.prototype.matrixInterpolateFunction = function (startValue, endValue, gradient) {
            return BABYLON.Matrix.Lerp(startValue, endValue, gradient);
        };
        Animation.prototype.clone = function () {
            var clone = new Animation(this.name, this.targetPropertyPath.join("."), this.framePerSecond, this.dataType, this.loopMode);
            clone.enableBlending = this.enableBlending;
            clone.blendingSpeed = this.blendingSpeed;
            if (this._keys) {
                clone.setKeys(this._keys);
            }
            if (this._ranges) {
                clone._ranges = {};
                for (var name in this._ranges) {
                    var range = this._ranges[name];
                    if (!range) {
                        continue;
                    }
                    clone._ranges[name] = range.clone();
                }
            }
            return clone;
        };
        Animation.prototype.setKeys = function (values) {
            this._keys = values.slice(0);
        };
        Animation.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.name = this.name;
            serializationObject.property = this.targetProperty;
            serializationObject.framePerSecond = this.framePerSecond;
            serializationObject.dataType = this.dataType;
            serializationObject.loopBehavior = this.loopMode;
            serializationObject.enableBlending = this.enableBlending;
            serializationObject.blendingSpeed = this.blendingSpeed;
            var dataType = this.dataType;
            serializationObject.keys = [];
            var keys = this.getKeys();
            for (var index = 0; index < keys.length; index++) {
                var animationKey = keys[index];
                var key = {};
                key.frame = animationKey.frame;
                switch (dataType) {
                    case Animation.ANIMATIONTYPE_FLOAT:
                        key.values = [animationKey.value];
                        break;
                    case Animation.ANIMATIONTYPE_QUATERNION:
                    case Animation.ANIMATIONTYPE_MATRIX:
                    case Animation.ANIMATIONTYPE_VECTOR3:
                    case Animation.ANIMATIONTYPE_COLOR3:
                        key.values = animationKey.value.asArray();
                        break;
                }
                serializationObject.keys.push(key);
            }
            serializationObject.ranges = [];
            for (var name in this._ranges) {
                var source = this._ranges[name];
                if (!source) {
                    continue;
                }
                var range = {};
                range.name = name;
                range.from = source.from;
                range.to = source.to;
                serializationObject.ranges.push(range);
            }
            return serializationObject;
        };
        Object.defineProperty(Animation, "ANIMATIONTYPE_FLOAT", {
            get: function () {
                return Animation._ANIMATIONTYPE_FLOAT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation, "ANIMATIONTYPE_VECTOR3", {
            get: function () {
                return Animation._ANIMATIONTYPE_VECTOR3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation, "ANIMATIONTYPE_VECTOR2", {
            get: function () {
                return Animation._ANIMATIONTYPE_VECTOR2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation, "ANIMATIONTYPE_SIZE", {
            get: function () {
                return Animation._ANIMATIONTYPE_SIZE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation, "ANIMATIONTYPE_QUATERNION", {
            get: function () {
                return Animation._ANIMATIONTYPE_QUATERNION;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation, "ANIMATIONTYPE_MATRIX", {
            get: function () {
                return Animation._ANIMATIONTYPE_MATRIX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation, "ANIMATIONTYPE_COLOR3", {
            get: function () {
                return Animation._ANIMATIONTYPE_COLOR3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation, "ANIMATIONLOOPMODE_RELATIVE", {
            get: function () {
                return Animation._ANIMATIONLOOPMODE_RELATIVE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation, "ANIMATIONLOOPMODE_CYCLE", {
            get: function () {
                return Animation._ANIMATIONLOOPMODE_CYCLE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation, "ANIMATIONLOOPMODE_CONSTANT", {
            get: function () {
                return Animation._ANIMATIONLOOPMODE_CONSTANT;
            },
            enumerable: true,
            configurable: true
        });
        Animation.Parse = function (parsedAnimation) {
            var animation = new Animation(parsedAnimation.name, parsedAnimation.property, parsedAnimation.framePerSecond, parsedAnimation.dataType, parsedAnimation.loopBehavior);
            var dataType = parsedAnimation.dataType;
            var keys = [];
            var data;
            var index;
            if (parsedAnimation.enableBlending) {
                animation.enableBlending = parsedAnimation.enableBlending;
            }
            if (parsedAnimation.blendingSpeed) {
                animation.blendingSpeed = parsedAnimation.blendingSpeed;
            }
            for (index = 0; index < parsedAnimation.keys.length; index++) {
                var key = parsedAnimation.keys[index];
                var inTangent;
                var outTangent;
                switch (dataType) {
                    case Animation.ANIMATIONTYPE_FLOAT:
                        data = key.values[0];
                        if (key.values.length >= 1) {
                            inTangent = key.values[1];
                        }
                        if (key.values.length >= 2) {
                            outTangent = key.values[2];
                        }
                        break;
                    case Animation.ANIMATIONTYPE_QUATERNION:
                        data = BABYLON.Quaternion.FromArray(key.values);
                        if (key.values.length >= 8) {
                            var _inTangent = BABYLON.Quaternion.FromArray(key.values.slice(4, 8));
                            if (!_inTangent.equals(BABYLON.Quaternion.Zero())) {
                                inTangent = _inTangent;
                            }
                        }
                        if (key.values.length >= 12) {
                            var _outTangent = BABYLON.Quaternion.FromArray(key.values.slice(8, 12));
                            if (!_outTangent.equals(BABYLON.Quaternion.Zero())) {
                                outTangent = _outTangent;
                            }
                        }
                        break;
                    case Animation.ANIMATIONTYPE_MATRIX:
                        data = BABYLON.Matrix.FromArray(key.values);
                        break;
                    case Animation.ANIMATIONTYPE_COLOR3:
                        data = BABYLON.Color3.FromArray(key.values);
                        break;
                    case Animation.ANIMATIONTYPE_VECTOR3:
                    default:
                        data = BABYLON.Vector3.FromArray(key.values);
                        break;
                }
                var keyData = {};
                keyData.frame = key.frame;
                keyData.value = data;
                if (inTangent != undefined) {
                    keyData.inTangent = inTangent;
                }
                if (outTangent != undefined) {
                    keyData.outTangent = outTangent;
                }
                keys.push(keyData);
            }
            animation.setKeys(keys);
            if (parsedAnimation.ranges) {
                for (index = 0; index < parsedAnimation.ranges.length; index++) {
                    data = parsedAnimation.ranges[index];
                    animation.createRange(data.name, data.from, data.to);
                }
            }
            return animation;
        };
        Animation.AppendSerializedAnimations = function (source, destination) {
            if (source.animations) {
                destination.animations = [];
                for (var animationIndex = 0; animationIndex < source.animations.length; animationIndex++) {
                    var animation = source.animations[animationIndex];
                    destination.animations.push(animation.serialize());
                }
            }
        };
        Animation.AllowMatricesInterpolation = false;
        // Statics
        Animation._ANIMATIONTYPE_FLOAT = 0;
        Animation._ANIMATIONTYPE_VECTOR3 = 1;
        Animation._ANIMATIONTYPE_QUATERNION = 2;
        Animation._ANIMATIONTYPE_MATRIX = 3;
        Animation._ANIMATIONTYPE_COLOR3 = 4;
        Animation._ANIMATIONTYPE_VECTOR2 = 5;
        Animation._ANIMATIONTYPE_SIZE = 6;
        Animation._ANIMATIONLOOPMODE_RELATIVE = 0;
        Animation._ANIMATIONLOOPMODE_CYCLE = 1;
        Animation._ANIMATIONLOOPMODE_CONSTANT = 2;
        return Animation;
    }());
    BABYLON.Animation = Animation;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.animation.js.map
