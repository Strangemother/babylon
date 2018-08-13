

var LIB;
(function (LIB) {
    /** Defines operator used for tonemapping */
    var TonemappingOperator;
    (function (TonemappingOperator) {
        /** Hable */
        TonemappingOperator[TonemappingOperator["Hable"] = 0] = "Hable";
        /** Reinhard */
        TonemappingOperator[TonemappingOperator["Reinhard"] = 1] = "Reinhard";
        /** HejiDawson */
        TonemappingOperator[TonemappingOperator["HejiDawson"] = 2] = "HejiDawson";
        /** Photographic */
        TonemappingOperator[TonemappingOperator["Photographic"] = 3] = "Photographic";
    })(TonemappingOperator = LIB.TonemappingOperator || (LIB.TonemappingOperator = {}));
    ;
    /**
     * Defines a post process to apply tone mapping
     */
    var TonemapPostProcess = /** @class */ (function (_super) {
        __extends(TonemapPostProcess, _super);
        /**
         * Creates a new TonemapPostProcess
         * @param name defines the name of the postprocess
         * @param _operator defines the operator to use
         * @param exposureAdjustment defines the required exposure adjustement
         * @param camera defines the camera to use (can be null)
         * @param samplingMode defines the required sampling mode (LIB.Texture.BILINEAR_SAMPLINGMODE by default)
         * @param engine defines the hosting engine (can be ignore if camera is set)
         * @param textureFormat defines the texture format to use (LIB.Engine.TEXTURETYPE_UNSIGNED_INT by default)
         */
        function TonemapPostProcess(name, _operator, 
        /** Defines the required exposure adjustement */
        exposureAdjustment, camera, samplingMode, engine, textureFormat) {
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
//# sourceMappingURL=LIB.tonemapPostProcess.js.map
