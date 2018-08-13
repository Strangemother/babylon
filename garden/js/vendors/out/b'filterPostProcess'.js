

var LIB;
(function (LIB) {
    var FilterPostProcess = /** @class */ (function (_super) {
        __extends(FilterPostProcess, _super);
        function FilterPostProcess(name, kernelMatrix, options, camera, samplingMode, engine, reusable) {
            var _this = _super.call(this, name, "filter", ["kernelMatrix"], null, options, camera, samplingMode, engine, reusable) || this;
            _this.kernelMatrix = kernelMatrix;
            _this.onApply = function (effect) {
                effect.setMatrix("kernelMatrix", _this.kernelMatrix);
            };
            return _this;
        }
        return FilterPostProcess;
    }(LIB.PostProcess));
    LIB.FilterPostProcess = FilterPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.filterPostProcess.js.map
//# sourceMappingURL=LIB.filterPostProcess.js.map
