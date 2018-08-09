var BABYLON;
(function (BABYLON) {
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
    }(BABYLON.PostProcess));
    BABYLON.FilterPostProcess = FilterPostProcess;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.filterPostProcess.js.map
