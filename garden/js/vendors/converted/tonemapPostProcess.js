(function (LIB) {
    var TonemappingOperator;
    (function (TonemappingOperator) {
        TonemappingOperator[TonemappingOperator["Hable"] = 0] = "Hable";
        TonemappingOperator[TonemappingOperator["Reinhard"] = 1] = "Reinhard";
        TonemappingOperator[TonemappingOperator["HejiDawson"] = 2] = "HejiDawson";
        TonemappingOperator[TonemappingOperator["Photographic"] = 3] = "Photographic";
    })(TonemappingOperator = LIB.TonemappingOperator || (LIB.TonemappingOperator = {}));
    ;
    var TonemapPostProcess = /** @class */ (function (_super) {
        __extends(TonemapPostProcess, _super);
        function TonemapPostProcess(name, _operator, exposureAdjustment, camera, samplingMode, engine, textureFormat) {
            if (samplingMode === void 0) { samplingMode = LIB.Texture.BILINEAR_SAMPLINGMODE; }
            if (textureFormat === void 0) { textureFormat = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            var _this = _super.call(this, name, "tonemap", ["_ExposureAdjustment"], null, 1.0, camera, samplingMode, engine, true, null, textureFormat) || this;
            _this._operator = _operator;
            _this.exposureAdjustment = exposureAdjustment;
            var defines = "#define ";
            if (_this._operator === TonemappingOperator.Hable)
                defines += "HABLE_TONEMAPPING";
            else if (_this._operator === TonemappingOperator.Reinhard)
                defines += "REINHARD_TONEMAPPING";
            else if (_this._operator === TonemappingOperator.HejiDawson)
                defines += "OPTIMIZED_HEJIDAWSON_TONEMAPPING";
            else if (_this._operator === TonemappingOperator.Photographic)
                defines += "PHOTOGRAPHIC_TONEMAPPING";
            //sadly a second call to create the effect.
            _this.updateEffect(defines);
            _this.onApply = function (effect) {
                effect.setFloat("_ExposureAdjustment", _this.exposureAdjustment);
            };
            return _this;
        }
        return TonemapPostProcess;
    }(LIB.PostProcess));
    LIB.TonemapPostProcess = TonemapPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.tonemapPostProcess.js.map
