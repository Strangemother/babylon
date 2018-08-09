var BABYLON;
(function (BABYLON) {
    var PassPostProcess = /** @class */ (function (_super) {
        __extends(PassPostProcess, _super);
        function PassPostProcess(name, options, camera, samplingMode, engine, reusable, textureType) {
            if (camera === void 0) { camera = null; }
            if (textureType === void 0) { textureType = BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT; }
            return _super.call(this, name, "pass", null, null, options, camera, samplingMode, engine, reusable, undefined, textureType) || this;
        }
        return PassPostProcess;
    }(BABYLON.PostProcess));
    BABYLON.PassPostProcess = PassPostProcess;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.passPostProcess.js.map
