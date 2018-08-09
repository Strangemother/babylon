(function (LIB) {
    var FxaaPostProcess = /** @class */ (function (_super) {
        __extends(FxaaPostProcess, _super);
        function FxaaPostProcess(name, options, camera, samplingMode, engine, reusable, textureType) {
            if (camera === void 0) { camera = null; }
            if (textureType === void 0) { textureType = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            var _this = _super.call(this, name, "fxaa", ["texelSize"], null, options, camera, samplingMode || LIB.Texture.BILINEAR_SAMPLINGMODE, engine, reusable, null, textureType, "fxaa") || this;
            _this.onApplyObservable.add(function (effect) {
                var texelSize = _this.texelSize;
                effect.setFloat2("texelSize", texelSize.x, texelSize.y);
            });
            return _this;
        }
        return FxaaPostProcess;
    }(LIB.PostProcess));
    LIB.FxaaPostProcess = FxaaPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.fxaaPostProcess.js.map
