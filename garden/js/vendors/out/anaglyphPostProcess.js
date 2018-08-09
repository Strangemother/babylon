var BABYLON;
(function (BABYLON) {
    var AnaglyphPostProcess = /** @class */ (function (_super) {
        __extends(AnaglyphPostProcess, _super);
        function AnaglyphPostProcess(name, options, rigCameras, samplingMode, engine, reusable) {
            var _this = _super.call(this, name, "anaglyph", null, ["leftSampler"], options, rigCameras[1], samplingMode, engine, reusable) || this;
            _this._passedProcess = rigCameras[0]._rigPostProcess;
            _this.onApplyObservable.add(function (effect) {
                effect.setTextureFromPostProcess("leftSampler", _this._passedProcess);
            });
            return _this;
        }
        return AnaglyphPostProcess;
    }(BABYLON.PostProcess));
    BABYLON.AnaglyphPostProcess = AnaglyphPostProcess;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.anaglyphPostProcess.js.map
