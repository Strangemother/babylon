
var LIB;
(function (LIB) {
    /**
     * Class used to override all child animations of a given target
     */
    var AnimationPropertiesOverride = /** @class */ (function () {
        function AnimationPropertiesOverride() {
            /**
             * Gets or sets a value indicating if animation blending must be used
             */
            this.enableBlending = false;
            /**
             * Gets or sets the blending speed to use when enableBlending is true
             */
            this.blendingSpeed = 0.01;
            /**
             * Gets or sets the default loop mode to use
             */
            this.loopMode = LIB.Animation.ANIMATIONLOOPMODE_CYCLE;
        }
        return AnimationPropertiesOverride;
    }());
    LIB.AnimationPropertiesOverride = AnimationPropertiesOverride;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.animationPropertiesOverride.js.map
//# sourceMappingURL=LIB.animationPropertiesOverride.js.map
