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
            this._to = Number.MIN_VALUE;
            this._speedRatio = 1;
            this.onAnimationEndObservable = new LIB.Observable();
            this._scene = scene || LIB.Engine.LastCreatedScene;
            this._scene.animationGroups.push(this);
        }
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
                for (var index = 0; index < this._animatables.length; index++) {
                    var animatable = this._animatables[index];
                    animatable.speedRatio = this._speedRatio;
                }
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
         * @param beginFrame defines the new begin frame for all animations. It can't be bigger than the smaller begin frame of all animations
         * @param endFrame defines the new end frame for all animations. It can't be smaller than the larger end frame of all animations
         */
        AnimationGroup.prototype.normalize = function (beginFrame, endFrame) {
            beginFrame = Math.min(beginFrame, this._from);
            endFrame = Math.min(endFrame, this._to);
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
                        outTangent: startKey.outTangent
                    };
                    keys.splice(0, 0, newKey);
                }
                if (endKey.frame < endFrame) {
                    var newKey = {
                        frame: endFrame,
                        value: endKey.value,
                        inTangent: startKey.outTangent,
                        outTangent: startKey.outTangent
                    };
                    keys.push(newKey);
                }
            }
            return this;
        };
        /**
         * Start all animations on given targets
         * @param loop defines if animations must loop
         * @param speedRatio defines the ratio to apply to animation speed (1 by default)
         */
        AnimationGroup.prototype.start = function (loop, speedRatio) {
            var _this = this;
            if (loop === void 0) { loop = false; }
            if (speedRatio === void 0) { speedRatio = 1; }
            if (this._isStarted || this._targetedAnimations.length === 0) {
                return this;
            }
            var _loop_1 = function () {
                var targetedAnimation = this_1._targetedAnimations[index];
                this_1._animatables.push(this_1._scene.beginDirectAnimation(targetedAnimation.target, [targetedAnimation.animation], this_1._from, this_1._to, loop, speedRatio, function () {
                    _this.onAnimationEndObservable.notifyObservers(targetedAnimation);
                }));
            };
            var this_1 = this;
            for (var index = 0; index < this._targetedAnimations.length; index++) {
                _loop_1();
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
                this.start(loop);
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
