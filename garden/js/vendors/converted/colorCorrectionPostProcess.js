
//
//  This post-process allows the modification of rendered colors by using
//  a 'look-up table' (LUT). This effect is also called Color Grading.
// 
//  The object needs to be provided an url to a texture containing the color
//  look-up table: the texture must be 256 pixels wide and 16 pixels high.
//  Use an image editing software to tweak the LUT to match your needs.
// 
//  For an example of a color LUT, see here:
//      http://udn.epicgames.com/Three/rsrc/Three/ColorGrading/RGBTable16x1.png
//  For explanations on color grading, see here:
//      http://udn.epicgames.com/Three/ColorGrading.html
//

var LIB;
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
//# sourceMappingURL=LIB.colorCorrectionPostProcess.js.map
