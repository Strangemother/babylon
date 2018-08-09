(function (LIB) {
    var BlackAndWhitePostProcess = /** @class */ (function (_super) {
        __extends(BlackAndWhitePostProcess, _super);
        function BlackAndWhitePostProcess(name, options, camera, samplingMode, engine, reusable) {
            var _this = _super.call(this, name, "blackAndWhite", ["degree"], null, options, camera, samplingMode, engine, reusable) || this;
            _this.degree = 1;
            _this.onApplyObservable.add(function (effect) {
                effect.setFloat("degree", _this.degree);
            });
            return _this;
        }
        return BlackAndWhitePostProcess;
    }(LIB.PostProcess));
    LIB.BlackAndWhitePostProcess = BlackAndWhitePostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.blackAndWhitePostProcess.js.map
