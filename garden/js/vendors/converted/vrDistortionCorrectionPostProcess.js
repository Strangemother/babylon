

var LIB;
(function (LIB) {
    var VRDistortionCorrectionPostProcess = /** @class */ (function (_super) {
        __extends(VRDistortionCorrectionPostProcess, _super);
        function VRDistortionCorrectionPostProcess(name, camera, isRightEye, vrMetrics) {
            var _this = _super.call(this, name, "vrDistortionCorrection", [
                'LensCenter',
                'Scale',
                'ScaleIn',
                'HmdWarpParam'
            ], null, vrMetrics.postProcessScaleFactor, camera, LIB.Texture.BILINEAR_SAMPLINGMODE) || this;
            _this._isRightEye = isRightEye;
            _this._distortionFactors = vrMetrics.distortionK;
            _this._postProcessScaleFactor = vrMetrics.postProcessScaleFactor;
            _this._lensCenterOffset = vrMetrics.lensCenterOffset;
            _this.adaptScaleToCurrentViewport = true;
            _this.onSizeChangedObservable.add(function () {
                _this._scaleIn = new LIB.Vector2(2, 2 / _this.aspectRatio);
                _this._scaleFactor = new LIB.Vector2(.5 * (1 / _this._postProcessScaleFactor), .5 * (1 / _this._postProcessScaleFactor) * _this.aspectRatio);
                _this._lensCenter = new LIB.Vector2(_this._isRightEye ? 0.5 - _this._lensCenterOffset * 0.5 : 0.5 + _this._lensCenterOffset * 0.5, 0.5);
            });
            _this.onApplyObservable.add(function (effect) {
                effect.setFloat2("LensCenter", _this._lensCenter.x, _this._lensCenter.y);
                effect.setFloat2("Scale", _this._scaleFactor.x, _this._scaleFactor.y);
                effect.setFloat2("ScaleIn", _this._scaleIn.x, _this._scaleIn.y);
                effect.setFloat4("HmdWarpParam", _this._distortionFactors[0], _this._distortionFactors[1], _this._distortionFactors[2], _this._distortionFactors[3]);
            });
            return _this;
        }
        return VRDistortionCorrectionPostProcess;
    }(LIB.PostProcess));
    LIB.VRDistortionCorrectionPostProcess = VRDistortionCorrectionPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.vrDistortionCorrectionPostProcess.js.map
//# sourceMappingURL=LIB.vrDistortionCorrectionPostProcess.js.map
