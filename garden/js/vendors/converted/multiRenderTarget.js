(function (LIB) {
    ;
    var MultiRenderTarget = /** @class */ (function (_super) {
        __extends(MultiRenderTarget, _super);
        function MultiRenderTarget(name, size, count, scene, options) {
            var _this = this;
            options = options || {};
            var generateMipMaps = options.generateMipMaps ? options.generateMipMaps : false;
            var generateDepthTexture = options.generateDepthTexture ? options.generateDepthTexture : false;
            var doNotChangeAspectRatio = options.doNotChangeAspectRatio === undefined ? true : options.doNotChangeAspectRatio;
            _this = _super.call(this, name, size, scene, generateMipMaps, doNotChangeAspectRatio) || this;
            _this._engine = scene.getEngine();
            if (!_this.isSupported) {
                _this.dispose();
                return;
            }
            var types = [];
            var samplingModes = [];
            for (var i = 0; i < count; i++) {
                if (options.types && options.types[i]) {
                    types.push(options.types[i]);
                }
                else {
                    types.push(LIB.Engine.TEXTURETYPE_FLOAT);
                }
                if (options.samplingModes && options.samplingModes[i]) {
                    samplingModes.push(options.samplingModes[i]);
                }
                else {
                    samplingModes.push(LIB.Texture.BILINEAR_SAMPLINGMODE);
                }
            }
            var generateDepthBuffer = options.generateDepthBuffer === undefined ? true : options.generateDepthBuffer;
            var generateStencilBuffer = options.generateStencilBuffer === undefined ? false : options.generateStencilBuffer;
            _this._size = size;
            _this._multiRenderTargetOptions = {
                samplingModes: samplingModes,
                generateMipMaps: generateMipMaps,
                generateDepthBuffer: generateDepthBuffer,
                generateStencilBuffer: generateStencilBuffer,
                generateDepthTexture: generateDepthTexture,
                types: types,
                textureCount: count
            };
            _this._createInternalTextures();
            _this._createTextures();
            return _this;
        }
        Object.defineProperty(MultiRenderTarget.prototype, "isSupported", {
            get: function () {
                return this._engine.webGLVersion > 1 || this._engine.getCaps().drawBuffersExtension;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MultiRenderTarget.prototype, "textures", {
            get: function () {
                return this._textures;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MultiRenderTarget.prototype, "depthTexture", {
            get: function () {
                return this._textures[this._textures.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MultiRenderTarget.prototype, "wrapU", {
            set: function (wrap) {
                if (this._textures) {
                    for (var i = 0; i < this._textures.length; i++) {
                        this._textures[i].wrapU = wrap;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MultiRenderTarget.prototype, "wrapV", {
            set: function (wrap) {
                if (this._textures) {
                    for (var i = 0; i < this._textures.length; i++) {
                        this._textures[i].wrapV = wrap;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        MultiRenderTarget.prototype._rebuild = function () {
            this.releaseInternalTextures();
            this._createInternalTextures();
            for (var i = 0; i < this._internalTextures.length; i++) {
                var texture = this._textures[i];
                texture._texture = this._internalTextures[i];
            }
            // Keeps references to frame buffer and stencil/depth buffer
            this._texture = this._internalTextures[0];
        };
        MultiRenderTarget.prototype._createInternalTextures = function () {
            this._internalTextures = this._engine.createMultipleRenderTarget(this._size, this._multiRenderTargetOptions);
        };
        MultiRenderTarget.prototype._createTextures = function () {
            this._textures = [];
            for (var i = 0; i < this._internalTextures.length; i++) {
                var texture = new LIB.Texture(null, this.getScene());
                texture._texture = this._internalTextures[i];
                this._textures.push(texture);
            }
            // Keeps references to frame buffer and stencil/depth buffer
            this._texture = this._internalTextures[0];
        };
        Object.defineProperty(MultiRenderTarget.prototype, "samples", {
            get: function () {
                return this._samples;
            },
            set: function (value) {
                if (this._samples === value) {
                    return;
                }
                for (var i = 0; i < this._internalTextures.length; i++) {
                    this._samples = this._engine.updateRenderTargetTextureSampleCount(this._internalTextures[i], value);
                }
            },
            enumerable: true,
            configurable: true
        });
        MultiRenderTarget.prototype.resize = function (size) {
            this.releaseInternalTextures();
            this._internalTextures = this._engine.createMultipleRenderTarget(size, this._multiRenderTargetOptions);
            this._createInternalTextures();
        };
        MultiRenderTarget.prototype.dispose = function () {
            this.releaseInternalTextures();
            _super.prototype.dispose.call(this);
        };
        MultiRenderTarget.prototype.releaseInternalTextures = function () {
            if (!this._internalTextures) {
                return;
            }
            for (var i = this._internalTextures.length - 1; i >= 0; i--) {
                if (this._internalTextures[i] !== undefined) {
                    this._internalTextures[i].dispose();
                    this._internalTextures.splice(i, 1);
                }
            }
        };
        return MultiRenderTarget;
    }(LIB.RenderTargetTexture));
    LIB.MultiRenderTarget = MultiRenderTarget;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.multiRenderTarget.js.map
