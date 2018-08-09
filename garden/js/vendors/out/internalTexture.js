var BABYLON;
(function (BABYLON) {
    var InternalTexture = /** @class */ (function () {
        function InternalTexture(engine, dataSource) {
            this.onLoadedObservable = new BABYLON.Observable();
            // Private
            this._initialSlot = -1;
            this._designatedSlot = -1;
            this._dataSource = InternalTexture.DATASOURCE_UNKNOWN;
            this._references = 1;
            this._engine = engine;
            this._dataSource = dataSource;
            this._webGLTexture = engine._createTexture();
        }
        Object.defineProperty(InternalTexture.prototype, "dataSource", {
            get: function () {
                return this._dataSource;
            },
            enumerable: true,
            configurable: true
        });
        InternalTexture.prototype.incrementReferences = function () {
            this._references++;
        };
        InternalTexture.prototype.updateSize = function (width, height, depth) {
            if (depth === void 0) { depth = 1; }
            this.width = width;
            this.height = height;
            this.depth = depth;
            this.baseWidth = width;
            this.baseHeight = height;
            this.baseDepth = depth;
            this._size = width * height * depth;
        };
        InternalTexture.prototype._rebuild = function () {
            var _this = this;
            var proxy;
            this.isReady = false;
            this._cachedCoordinatesMode = null;
            this._cachedWrapU = null;
            this._cachedWrapV = null;
            this._cachedAnisotropicFilteringLevel = null;
            switch (this._dataSource) {
                case InternalTexture.DATASOURCE_TEMP:
                    return;
                case InternalTexture.DATASOURCE_URL:
                    proxy = this._engine.createTexture(this.url, !this.generateMipMaps, this.invertY, null, this.samplingMode, function () {
                        _this.isReady = true;
                    }, null, this._buffer, undefined, this.format);
                    proxy._swapAndDie(this);
                    return;
                case InternalTexture.DATASOURCE_RAW:
                    proxy = this._engine.createRawTexture(this._bufferView, this.baseWidth, this.baseHeight, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression);
                    proxy._swapAndDie(this);
                    this.isReady = true;
                    return;
                case InternalTexture.DATASOURCE_RAW3D:
                    proxy = this._engine.createRawTexture3D(this._bufferView, this.baseWidth, this.baseHeight, this.baseDepth, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression);
                    proxy._swapAndDie(this);
                    this.isReady = true;
                    return;
                case InternalTexture.DATASOURCE_DYNAMIC:
                    proxy = this._engine.createDynamicTexture(this.baseWidth, this.baseHeight, this.generateMipMaps, this.samplingMode);
                    proxy._swapAndDie(this);
                    // The engine will make sure to update content so no need to flag it as isReady = true
                    return;
                case InternalTexture.DATASOURCE_RENDERTARGET:
                    var options = new BABYLON.RenderTargetCreationOptions();
                    options.generateDepthBuffer = this._generateDepthBuffer;
                    options.generateMipMaps = this.generateMipMaps;
                    options.generateStencilBuffer = this._generateStencilBuffer;
                    options.samplingMode = this.samplingMode;
                    options.type = this.type;
                    if (this.isCube) {
                        proxy = this._engine.createRenderTargetCubeTexture(this.width, options);
                    }
                    else {
                        var size = {
                            width: this.width,
                            height: this.height
                        };
                        proxy = this._engine.createRenderTargetTexture(size, options);
                    }
                    proxy._swapAndDie(this);
                    this.isReady = true;
                    return;
                case InternalTexture.DATASOURCE_CUBE:
                    proxy = this._engine.createCubeTexture(this.url, null, this._files, !this.generateMipMaps, function () {
                        _this.isReady = true;
                    }, null, this.format, this._extension);
                    proxy._swapAndDie(this);
                    return;
                case InternalTexture.DATASOURCE_CUBERAW:
                    proxy = this._engine.createRawCubeTexture(this._bufferViewArray, this.width, this.format, this.type, this.generateMipMaps, this.invertY, this.samplingMode, this._compression);
                    proxy._swapAndDie(this);
                    this.isReady = true;
                    return;
                case InternalTexture.DATASOURCE_CUBEPREFILTERED:
                    proxy = this._engine.createPrefilteredCubeTexture(this.url, null, this._lodGenerationScale, this._lodGenerationOffset, function (proxy) {
                        if (proxy) {
                            proxy._swapAndDie(_this);
                        }
                        _this.isReady = true;
                    }, null, this.format, this._extension);
                    return;
            }
        };
        InternalTexture.prototype._swapAndDie = function (target) {
            target._webGLTexture = this._webGLTexture;
            if (this._framebuffer) {
                target._framebuffer = this._framebuffer;
            }
            if (this._depthStencilBuffer) {
                target._depthStencilBuffer = this._depthStencilBuffer;
            }
            if (this._lodTextureHigh) {
                if (target._lodTextureHigh) {
                    target._lodTextureHigh.dispose();
                }
                target._lodTextureHigh = this._lodTextureHigh;
            }
            if (this._lodTextureMid) {
                if (target._lodTextureMid) {
                    target._lodTextureMid.dispose();
                }
                target._lodTextureMid = this._lodTextureMid;
            }
            if (this._lodTextureLow) {
                if (target._lodTextureLow) {
                    target._lodTextureLow.dispose();
                }
                target._lodTextureLow = this._lodTextureLow;
            }
            var cache = this._engine.getLoadedTexturesCache();
            var index = cache.indexOf(this);
            if (index !== -1) {
                cache.splice(index, 1);
            }
        };
        InternalTexture.prototype.dispose = function () {
            if (!this._webGLTexture) {
                return;
            }
            this._references--;
            if (this._references === 0) {
                this._engine._releaseTexture(this);
                this._webGLTexture = null;
            }
        };
        InternalTexture.DATASOURCE_UNKNOWN = 0;
        InternalTexture.DATASOURCE_URL = 1;
        InternalTexture.DATASOURCE_TEMP = 2;
        InternalTexture.DATASOURCE_RAW = 3;
        InternalTexture.DATASOURCE_DYNAMIC = 4;
        InternalTexture.DATASOURCE_RENDERTARGET = 5;
        InternalTexture.DATASOURCE_MULTIRENDERTARGET = 6;
        InternalTexture.DATASOURCE_CUBE = 7;
        InternalTexture.DATASOURCE_CUBERAW = 8;
        InternalTexture.DATASOURCE_CUBEPREFILTERED = 9;
        InternalTexture.DATASOURCE_RAW3D = 10;
        return InternalTexture;
    }());
    BABYLON.InternalTexture = InternalTexture;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.internalTexture.js.map
