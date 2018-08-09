var BABYLON;
(function (BABYLON) {
    var ColorCorrectionPostProcess = /** @class */ (function (_super) {
        __extends(ColorCorrectionPostProcess, _super);
        function ColorCorrectionPostProcess(name, colorTableUrl, options, camera, samplingMode, engine, reusable) {
            var _this = _super.call(this, name, 'colorCorrection', null, ['colorTable'], options, camera, samplingMode, engine, reusable) || this;
            _this._colorTableTexture = new BABYLON.Texture(colorTableUrl, camera.getScene(), true, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
            _this._colorTableTexture.anisotropicFilteringLevel = 1;
            _this._colorTableTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
            _this._colorTableTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
            _this.onApply = function (effect) {
                effect.setTexture("colorTable", _this._colorTableTexture);
            };
            return _this;
        }
        return ColorCorrectionPostProcess;
    }(BABYLON.PostProcess));
    BABYLON.ColorCorrectionPostProcess = ColorCorrectionPostProcess;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.colorCorrectionPostProcess.js.map
