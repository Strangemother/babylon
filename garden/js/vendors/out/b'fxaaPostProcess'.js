

var LIB;
(function (LIB) {
    var FxaaPostProcess = /** @class */ (function (_super) {
        __extends(FxaaPostProcess, _super);
        function FxaaPostProcess(name, options, camera, samplingMode, engine, reusable, textureType) {
            if (camera === void 0) { camera = null; }
            if (textureType === void 0) { textureType = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            var _this = _super.call(this, name, "fxaa", ["texelSize"], null, options, camera, samplingMode || LIB.Texture.BILINEAR_SAMPLINGMODE, engine, reusable, null, textureType, "fxaa", undefined, true) || this;
            var defines = _this._getDefines();
            _this.updateEffect(defines);
            _this.onApplyObservable.add(function (effect) {
                var texelSize = _this.texelSize;
                effect.setFloat2("texelSize", texelSize.x, texelSize.y);
            });
            return _this;
        }
        FxaaPostProcess.prototype._getDefines = function () {
            var engine = this.getEngine();
            if (!engine) {
                return null;
            }
            var glInfo = engine.getGlInfo();
            if (glInfo && glInfo.renderer && glInfo.renderer.toLowerCase().indexOf("mali") > -1) {
                return "#define MALI 1\n";
            }
            return null;
        };
        return FxaaPostProcess;
    }(LIB.PostProcess));
    LIB.FxaaPostProcess = FxaaPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.fxaaPostProcess.js.map
//# sourceMappingURL=LIB.fxaaPostProcess.js.map
