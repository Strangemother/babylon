

var LIB;
(function (LIB) {
    /**
     * The extract highlights post process sets all pixels to black except pixels above the specified luminance threshold. Used as the first step for a bloom effect.
     */
    var ExtractHighlightsPostProcess = /** @class */ (function (_super) {
        __extends(ExtractHighlightsPostProcess, _super);
        function ExtractHighlightsPostProcess(name, options, camera, samplingMode, engine, reusable, textureType, blockCompilation) {
            if (textureType === void 0) { textureType = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            if (blockCompilation === void 0) { blockCompilation = false; }
            var _this = _super.call(this, name, "extractHighlights", ["threshold", "exposure"], null, options, camera, samplingMode, engine, reusable, null, textureType, undefined, null, blockCompilation) || this;
            /**
             * The luminance threshold, pixels below this value will be set to black.
             */
            _this.threshold = 0.9;
            /**
             * Internal
             */
            _this._exposure = 1;
            /**
             * Post process which has the input texture to be used when performing highlight extraction
             */
            _this._inputPostProcess = null;
            _this.onApplyObservable.add(function (effect) {
                if (_this._inputPostProcess) {
                    effect.setTextureFromPostProcess("textureSampler", _this._inputPostProcess);
                }
                effect.setFloat('threshold', Math.pow(_this.threshold, LIB.ToGammaSpace));
                effect.setFloat('exposure', _this._exposure);
            });
            return _this;
        }
        return ExtractHighlightsPostProcess;
    }(LIB.PostProcess));
    LIB.ExtractHighlightsPostProcess = ExtractHighlightsPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.extractHighlightsPostProcess.js.map
//# sourceMappingURL=LIB.extractHighlightsPostProcess.js.map
