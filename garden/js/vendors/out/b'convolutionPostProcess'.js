

var LIB;
(function (LIB) {
    /**
     * The ConvolutionPostProcess applies a 3x3 kernel to every pixel of the
     * input texture to perform effects such as edge detection or sharpening
     * See http://en.wikipedia.org/wiki/Kernel_(image_processing)
     */
    var ConvolutionPostProcess = /** @class */ (function (_super) {
        __extends(ConvolutionPostProcess, _super);
        /**
         * Creates a new instance ConvolutionPostProcess
         * @param name The name of the effect.
         * @param kernel Array of 9 values corrisponding to the 3x3 kernel to be applied
         * @param options The required width/height ratio to downsize to before computing the render pass.
         * @param camera The camera to apply the render pass to.
         * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
         * @param engine The engine which the post process will be applied. (default: current engine)
         * @param reusable If the post process can be reused on the same frame. (default: false)
         * @param textureType Type of textures used when performing the post process. (default: 0)
         */
        function ConvolutionPostProcess(name, /** Array of 9 values corrisponding to the 3x3 kernel to be applied */ kernel, options, camera, samplingMode, engine, reusable, textureType) {
            if (textureType === void 0) { textureType = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            var _this = _super.call(this, name, "convolution", ["kernel", "screenSize"], null, options, camera, samplingMode, engine, reusable, null, textureType) || this;
            _this.kernel = kernel;
            _this.onApply = function (effect) {
                effect.setFloat2("screenSize", _this.width, _this.height);
                effect.setArray("kernel", _this.kernel);
            };
            return _this;
        }
        // Statics
        /**
         * Edge detection 0 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        ConvolutionPostProcess.EdgeDetect0Kernel = [1, 0, -1, 0, 0, 0, -1, 0, 1];
        /**
         * Edge detection 1 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        ConvolutionPostProcess.EdgeDetect1Kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0];
        /**
         * Edge detection 2 see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        ConvolutionPostProcess.EdgeDetect2Kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
        /**
         * Kernel to sharpen an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        ConvolutionPostProcess.SharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
        /**
         * Kernel to emboss an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        ConvolutionPostProcess.EmbossKernel = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
        /**
         * Kernel to blur an image see https://en.wikipedia.org/wiki/Kernel_(image_processing)
         */
        ConvolutionPostProcess.GaussianKernel = [0, 1, 0, 1, 1, 1, 0, 1, 0];
        return ConvolutionPostProcess;
    }(LIB.PostProcess));
    LIB.ConvolutionPostProcess = ConvolutionPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.convolutionPostProcess.js.map
//# sourceMappingURL=LIB.convolutionPostProcess.js.map