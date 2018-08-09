(function (LIB) {
    var ConvolutionPostProcess = /** @class */ (function (_super) {
        __extends(ConvolutionPostProcess, _super);
        function ConvolutionPostProcess(name, kernel, options, camera, samplingMode, engine, reusable) {
            var _this = _super.call(this, name, "convolution", ["kernel", "screenSize"], null, options, camera, samplingMode, engine, reusable) || this;
            _this.kernel = kernel;
            _this.onApply = function (effect) {
                effect.setFloat2("screenSize", _this.width, _this.height);
                effect.setArray("kernel", _this.kernel);
            };
            return _this;
        }
        // Statics
        // Based on http://en.wikipedia.org/wiki/Kernel_(image_processing)
        ConvolutionPostProcess.EdgeDetect0Kernel = [1, 0, -1, 0, 0, 0, -1, 0, 1];
        ConvolutionPostProcess.EdgeDetect1Kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0];
        ConvolutionPostProcess.EdgeDetect2Kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
        ConvolutionPostProcess.SharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
        ConvolutionPostProcess.EmbossKernel = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
        ConvolutionPostProcess.GaussianKernel = [0, 1, 0, 1, 1, 1, 0, 1, 0];
        return ConvolutionPostProcess;
    }(LIB.PostProcess));
    LIB.ConvolutionPostProcess = ConvolutionPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.convolutionPostProcess.js.map
