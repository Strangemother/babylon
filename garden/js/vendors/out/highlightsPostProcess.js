var BABYLON;
(function (BABYLON) {
    var HighlightsPostProcess = /** @class */ (function (_super) {
        __extends(HighlightsPostProcess, _super);
        function HighlightsPostProcess(name, options, camera, samplingMode, engine, reusable, textureType) {
            if (textureType === void 0) { textureType = BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT; }
            return _super.call(this, name, "highlights", null, null, options, camera, samplingMode, engine, reusable, null, textureType) || this;
        }
        return HighlightsPostProcess;
    }(BABYLON.PostProcess));
    BABYLON.HighlightsPostProcess = HighlightsPostProcess;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.highlightsPostProcess.js.map
