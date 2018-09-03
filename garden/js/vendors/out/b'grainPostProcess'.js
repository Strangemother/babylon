

var LIB;
(function (LIB) {
    /**
     * The GrainPostProcess adds noise to the image at mid luminance levels
     */
    var GrainPostProcess = /** @class */ (function (_super) {
        __extends(GrainPostProcess, _super);
        /**
         * Creates a new instance of @see GrainPostProcess
         * @param name The name of the effect.
         * @param options The required width/height ratio to downsize to before computing the render pass.
         * @param camera The camera to apply the render pass to.
         * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
         * @param engine The engine which the post process will be applied. (default: current engine)
         * @param reusable If the post process can be reused on the same frame. (default: false)
         * @param textureType Type of textures used when performing the post process. (default: 0)
         * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
         */
        function GrainPostProcess(name, options, camera, samplingMode, engine, reusable, textureType, blockCompilation) {
            if (textureType === void 0) { textureType = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            if (blockCompilation === void 0) { blockCompilation = false; }
            var _this = _super.call(this, name, "grain", ["intensity", "animatedSeed"], [], options, camera, samplingMode, engine, reusable, null, textureType, undefined, null, blockCompilation) || this;
            /**
             * The intensity of the grain added (default: 30)
             */
            _this.intensity = 30;
            /**
             * If the grain should be randomized on every frame
             */
            _this.animated = false;
            _this.onApplyObservable.add(function (effect) {
                effect.setFloat('intensity', _this.intensity);
                effect.setFloat('animatedSeed', _this.animated ? Math.random() + 1 : 1);
            });
            return _this;
        }
        return GrainPostProcess;
    }(LIB.PostProcess));
    LIB.GrainPostProcess = GrainPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.grainPostProcess.js.map
//# sourceMappingURL=LIB.grainPostProcess.js.map