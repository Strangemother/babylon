(function (LIB) {
    var ColorCorrectionPostProcess = /** @class */ (function (_super) {
        __extends(ColorCorrectionPostProcess, _super);
        function ColorCorrectionPostProcess(name, colorTableUrl, options, camera, samplingMode, engine, reusable) {
            var _this = _super.call(this, name, 'colorCorrection', null, ['colorTable'], options, camera, samplingMode, engine, reusable) || this;
            _this._colorTableTexture = new LIB.Texture(colorTableUrl, camera.getScene(), true, false, LIB.Texture.TRILINEAR_SAMPLINGMODE);
            _this._colorTableTexture.anisotropicFilteringLevel = 1;
            _this._colorTableTexture.wrapU = LIB.Texture.CLAMP_ADDRESSMODE;
            _this._colorTableTexture.wrapV = LIB.Texture.CLAMP_ADDRESSMODE;
            _this.onApply = function (effect) {
                effect.setTexture("colorTable", _this._colorTableTexture);
            };
            return _this;
        }
        return ColorCorrectionPostProcess;
    }(LIB.PostProcess));
    LIB.ColorCorrectionPostProcess = ColorCorrectionPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.colorCorrectionPostProcess.js.map
