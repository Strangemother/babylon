

var LIB;
(function (LIB) {
    var RefractionPostProcess = /** @class */ (function (_super) {
        __extends(RefractionPostProcess, _super);
        function RefractionPostProcess(name, refractionTextureUrl, color, depth, colorLevel, options, camera, samplingMode, engine, reusable) {
            var _this = _super.call(this, name, "refraction", ["baseColor", "depth", "colorLevel"], ["refractionSampler"], options, camera, samplingMode, engine, reusable) || this;
            _this.color = color;
            _this.depth = depth;
            _this.colorLevel = colorLevel;
            _this._ownRefractionTexture = true;
            _this.onActivateObservable.add(function (cam) {
                _this._refTexture = _this._refTexture || new LIB.Texture(refractionTextureUrl, cam.getScene());
            });
            _this.onApplyObservable.add(function (effect) {
                effect.setColor3("baseColor", _this.color);
                effect.setFloat("depth", _this.depth);
                effect.setFloat("colorLevel", _this.colorLevel);
                effect.setTexture("refractionSampler", _this._refTexture);
            });
            return _this;
        }
        Object.defineProperty(RefractionPostProcess.prototype, "refractionTexture", {
            /**
             * Gets or sets the refraction texture
             * Please note that you are responsible for disposing the texture if you set it manually
             */
            get: function () {
                return this._refTexture;
            },
            set: function (value) {
                if (this._refTexture && this._ownRefractionTexture) {
                    this._refTexture.dispose();
                }
                this._refTexture = value;
                this._ownRefractionTexture = false;
            },
            enumerable: true,
            configurable: true
        });
        // Methods
        RefractionPostProcess.prototype.dispose = function (camera) {
            if (this._refTexture && this._ownRefractionTexture) {
                this._refTexture.dispose();
                this._refTexture = null;
            }
            _super.prototype.dispose.call(this, camera);
        };
        return RefractionPostProcess;
    }(LIB.PostProcess));
    LIB.RefractionPostProcess = RefractionPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.refractionPostProcess.js.map
//# sourceMappingURL=LIB.refractionPostProcess.js.map
