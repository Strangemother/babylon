

var LIB;
(function (LIB) {
    var HighlightsPostProcess = /** @class */ (function (_super) {
        __extends(HighlightsPostProcess, _super);
        function HighlightsPostProcess(name, options, camera, samplingMode, engine, reusable, textureType) {
            if (textureType === void 0) { textureType = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            return _super.call(this, name, "highlights", null, null, options, camera, samplingMode, engine, reusable, null, textureType) || this;
        }
        return HighlightsPostProcess;
    }(LIB.PostProcess));
    LIB.HighlightsPostProcess = HighlightsPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.highlightsPostProcess.js.map
//# sourceMappingURL=LIB.highlightsPostProcess.js.map
