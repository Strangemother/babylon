
var LIB;
(function (LIB) {
    /**
     * This class defines the direct association between an animation and a target
     */
    var TargetedAnimation = /** @class */ (function () {
        function TargetedAnimation() {
        }
        return TargetedAnimation;
    }());
    LIB.TargetedAnimation = TargetedAnimation;
    /**
     * Use this class to create coordinated animations on multiple targets
     */
    var AnimationGroup = /** @class */ (function () {
        function AnimationGroup(name, scene) {
            if (scene === void 0) { scene = null; }
            this.name = name;
            this._targetedAnimations = new Array();
            this._animatables = new Array();
            this._from = Number.MAX_VALUE;
            this._to = -Number.MAX_VALUE;
            this._speedRatio = 1;
            this.onAnimationEndObservable = new LIB.Observable();
            this._scene = scene || LIB.Engine.LastCreatedScene;
            this._scene.animationGroups.push(this);
        }
        Object.defineProperty(AnimationGroup.prototype, "from", {
            /**
             * Gets the first frame
             */
            get: function () {
                return this._from;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationGroup.prototype, "to", {
            /**
             * Gets the last frame
             */
            get: function () {
                return this._to;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationGroup.prototype, "isStarted", {
            /**
             * Define if the animations are started
             */
            get: function () {
                return this._isStarted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationGroup.prototype, "speedRatio", {
            /**
             * Gets or sets the speed ratio to use for all animations
             */
            get: function () {
                return this._speedRatio;
            },
            /**
             * Gets or sets the speed ratio to use for all animations
             */
            set: function (value) {
                if (this._speedRatio === value) {
                    return;
                }
                this._speedRatio = value;
                for (var index = 0; index < this._animatables.length; index++) {
                    var animatable = this._animatables[index];
                    animatable.speedRatio = this._speedRatio;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationGroup.prototype, "targetedAnimations", {
            /**
             * Gets the targeted animations for this animation group
             */
            get: function () {
                return this._targetedAnimations;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationGroup.prototype, "animatables", {
            /**
             * returning the list of animatables controlled by this animation group.
             */
            get: function () {
                return this._animatables;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Add an animation (with its target) in the group
         * @param animation defines the animation we want to add
         * @param target defines the target of the animation
         * @returns the {LIB.TargetedAnimation} object
         */
        AnimationGroup.prototype.addTargetedAnimation = function (animation, target) {
            var targetedAnimation = {
                animation: animation,
                target: target
            };
            var keys = animation.getKeys();
            if (this._from > keys[0].frame) {
                this._from = keys[0].frame;
            }
            if (this._to < keys[keys.length - 1].frame) {
                this._to = keys[keys.length - 1].frame;
            }
            this._targetedAnimations.push(targetedAnimation);
            return targetedAnimation;
        };
        /**
         * This function will normalize every animation in the group to make sure they all go from beginFrame to endFrame
         * It can add constant keys at begin or end
         * @param beginFrame defines the new begin frame for all animations or the smallest begin frame of all animations if null (defaults to null)
         * @param endFrame defines the new end frame for all animations or the largest end frame of all animations if null (defaults to null)
         */
        AnimationGroup.prototype.normalize = function (beginFrame, endFrame) {
            if (beginFrame === void 0) { beginFrame = null; }
            if (endFrame === void 0) { endFrame = null; }
            if (beginFrame == null)
                beginFrame = this._from;
            if (endFrame == null)
                endFrame = this._to;
            for (var index = 0; index < this._targetedAnimations.length; index++) {
                var targetedAnimation = this._targetedAnimations[index];
                var keys = targetedAnimation.animation.getKeys();
                var startKey = keys[0];
                var endKey = keys[keys.length - 1];
                if (startKey.frame > beginFrame) {
                    var newKey = {
                        frame: beginFrame,
                        value: startKey.value,
                        inTangent: startKey.inTangent,
                        outTangent: startKey.outTangent,
                        interpolation: startKey.interpolation
                    };
                    keys.splice(0, 0, newKey);
                }
                if (endKey.frame < endFrame) {
                    var newKey = {
                        frame: endFrame,
                        value: endKey.value,
                        inTangent: endKey.outTangent,
                        outTangent: endKey.outTangent,
                        interpolation: endKey.interpolation
                    };
                    keys.push(newKey);
                }
            }
            this._from = beginFrame;
            this._to = endFrame;
            return this;
        };
        /**
         * Start all animations on given targets
         * @param loop defines if animations must loop
         * @param speedRatio defines the ratio to apply to animation speed (1 by default)
         * @param from defines the from key (optional)
         * @param to defines the to key (optional)
         * @returns the current animation group
         */
        AnimationGroup.prototype.start = function (loop, speedRatio, from, to) {
            var _this = this;
            if (loop === void 0) { loop = false; }
            if (speedRatio === void 0) { speedRatio = 1; }
            if (this._isStarted || this._targetedAnimations.length === 0) {
                return this;
            }
            var _loop_1 = function (targetedAnimation) {
                this_1._animatables.push(this_1._scene.beginDirectAnimation(targetedAnimation.target, [targetedAnimation.animation], from !== undefined ? from : this_1._from, to !== undefined ? to : this_1._to, loop, speedRatio, function () {
                    _this.onAnimationEndObservable.notifyObservers(targetedAnimation);
                }));
            };
            var this_1 = this;
            for (var _i = 0, _a = this._targetedAnimations; _i < _a.length; _i++) {
                var targetedAnimation = _a[_i];
                _loop_1(targetedAnimation);
            }
            this._speedRatio = speedRatio;
            this._isStarted = true;
            return this;
        };
        /**
         * Pause all animations
         */
        AnimationGroup.prototype.pause = function () {
            if (!this._isStarted) {
                return this;
            }
            for (var index = 0; index < this._animatables.length; index++) {
                var animatable = this._animatables[index];
                animatable.pause();
            }
            return this;
        };
        /**
         * Play all animations to initial state
         * This function will start() the animations if they were not started or will restart() them if they were paused
         * @param loop defines if animations must loop
         */
        AnimationGroup.prototype.play = function (loop) {
            if (this.isStarted) {
                if (loop !== undefined) {
                    for (var index = 0; index < this._animatables.length; index++) {
                        var animatable = this._animatables[index];
                        animatable.loopAnimation = loop;
                    }
                }
                this.restart();
            }
            else {
                this.start(loop, this._speedRatio);
            }
            return this;
        };
        /**
         * Reset all animations to initial state
         */
        AnimationGroup.prototype.reset = function () {
            if (!this._isStarted) {
                return this;
            }
            for (var index = 0; index < this._animatables.length; index++) {
                var animatable = this._animatables[index];
                animatable.reset();
            }
            return this;
        };
        /**
         * Restart animations from key 0
         */
        AnimationGroup.prototype.restart = function () {
            if (!this._isStarted) {
                return this;
            }
            for (var index = 0; index < this._animatables.length; index++) {
                var animatable = this._animatables[index];
                animatable.restart();
            }
            return this;
        };
        /**
         * Stop all animations
         */
        AnimationGroup.prototype.stop = function () {
            if (!this._isStarted) {
                return this;
            }
            for (var index = 0; index < this._animatables.length; index++) {
                var animatable = this._animatables[index];
                animatable.stop();
            }
            this._isStarted = false;
            return this;
        };
        /**
         * Set animation weight for all animatables
         * @param weight defines the weight to use
         * @return the animationGroup
         * @see http://doc.LIBjs.com/LIB101/animations#animation-weights
         */
        AnimationGroup.prototype.setWeightForAllAnimatables = function (weight) {
            for (var index = 0; index < this._animatables.length; index++) {
                var animatable = this._animatables[index];
                animatable.weight = weight;
            }
            return this;
        };
        /**
         * Synchronize and normalize all animatables with a source animatable
         * @param root defines the root animatable to synchronize with
         * @return the animationGroup
         * @see http://doc.LIBjs.com/LIB101/animations#animation-weights
         */
        AnimationGroup.prototype.syncAllAnimationsWith = function (root) {
            for (var index = 0; index < this._animatables.length; index++) {
                var animatable = this._animatables[index];
                animatable.syncWith(root);
            }
            return this;
        };
        /**
         * Goes to a specific frame in this animation group
         * @param frame the frame number to go to
         * @return the animationGroup
         */
        AnimationGroup.prototype.goToFrame = function (frame) {
            if (!this._isStarted) {
                return this;
            }
            for (var index = 0; index < this._animatables.length; index++) {
                var animatable = this._animatables[index];
                animatable.goToFrame(frame);
            }
            return this;
        };
        /**
         * Dispose all associated resources
         */
        AnimationGroup.prototype.dispose = function () {
            this._targetedAnimations = [];
            this._animatables = [];
            var index = this._scene.animationGroups.indexOf(this);
            if (index > -1) {
                this._scene.animationGroups.splice(index, 1);
            }
        };
        return AnimationGroup;
    }());
    LIB.AnimationGroup = AnimationGroup;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.animationGroup.js.map
//# sourceMappingURL=LIB.animationGroup.js.map
