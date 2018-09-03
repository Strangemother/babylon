

var LIB;
(function (LIB) {
    /**
     * Postprocess used to generate anaglyphic rendering
     */
    var AnaglyphPostProcess = /** @class */ (function (_super) {
        __extends(AnaglyphPostProcess, _super);
        /**
         * Creates a new AnaglyphPostProcess
         * @param name defines postprocess name
         * @param options defines creation options or target ratio scale
         * @param rigCameras defines cameras using this postprocess
         * @param samplingMode defines required sampling mode (LIB.Texture.NEAREST_SAMPLINGMODE by default)
         * @param engine defines hosting engine
         * @param reusable defines if the postprocess will be reused multiple times per frame
         */
        function AnaglyphPostProcess(name, options, rigCameras, samplingMode, engine, reusable) {
            var _this = _super.call(this, name, "anaglyph", null, ["leftSampler"], options, rigCameras[1], samplingMode, engine, reusable) || this;
            _this._passedProcess = rigCameras[0]._rigPostProcess;
            _this.onApplyObservable.add(function (effect) {
                effect.setTextureFromPostProcess("leftSampler", _this._passedProcess);
            });
            return _this;
        }
        return AnaglyphPostProcess;
    }(LIB.PostProcess));
    LIB.AnaglyphPostProcess = AnaglyphPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.anaglyphPostProcess.js.map
//# sourceMappingURL=LIB.anaglyphPostProcess.js.map