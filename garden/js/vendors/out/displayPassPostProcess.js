var BABYLON;
(function (BABYLON) {
    var DisplayPassPostProcess = /** @class */ (function (_super) {
        __extends(DisplayPassPostProcess, _super);
        function DisplayPassPostProcess(name, options, camera, samplingMode, engine, reusable) {
            return _super.call(this, name, "displayPass", ["passSampler"], ["passSampler"], options, camera, samplingMode, engine, reusable) || this;
        }
        return DisplayPassPostProcess;
    }(BABYLON.PostProcess));
    BABYLON.DisplayPassPostProcess = DisplayPassPostProcess;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.displayPassPostProcess.js.map
