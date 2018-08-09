var BABYLON;
(function (BABYLON) {
    var RefractionPostProcess = /** @class */ (function (_super) {
        __extends(RefractionPostProcess, _super);
        function RefractionPostProcess(name, refractionTextureUrl, color, depth, colorLevel, options, camera, samplingMode, engine, reusable) {
            var _this = _super.call(this, name, "refraction", ["baseColor", "depth", "colorLevel"], ["refractionSampler"], options, camera, samplingMode, engine, reusable) || this;
            _this.color = color;
            _this.depth = depth;
            _this.colorLevel = colorLevel;
            _this.onActivateObservable.add(function (cam) {
                _this._refRexture = _this._refRexture || new BABYLON.Texture(refractionTextureUrl, cam.getScene());
            });
            _this.onApplyObservable.add(function (effect) {
                effect.setColor3("baseColor", _this.color);
                effect.setFloat("depth", _this.depth);
                effect.setFloat("colorLevel", _this.colorLevel);
                effect.setTexture("refractionSampler", _this._refRexture);
            });
            return _this;
        }
        // Methods
        RefractionPostProcess.prototype.dispose = function (camera) {
            if (this._refRexture) {
                this._refRexture.dispose();
            }
            _super.prototype.dispose.call(this, camera);
        };
        return RefractionPostProcess;
    }(BABYLON.PostProcess));
    BABYLON.RefractionPostProcess = RefractionPostProcess;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.refractionPostProcess.js.map
