
var LIB;
(function (LIB) {
    /**
     * Class used to store data associated with WebGL texture data for the engine
     * This class should not be used directly
     */
    var InternalTexture = /** @class */ (function () {
        /**
         * Creates a new InternalTexture
         * @param engine defines the engine to use
         * @param dataSource defines the type of data that will be used
         */
        function InternalTexture(engine, dataSource) {
            /**
             * Observable called when the texture is loaded
             */
            this.onLoadedObservable = new LIB.Observable();
            /**
             * Gets or set the previous tracker in the list
             */
            this.previous = null;
            /**
             * Gets or set the next tracker in the list
             */
            this.next = null;
            // Private
            /** @hidden */
            this._initialSlot = -1;
            /** @hidden */
            this._designatedSlot = -1;
            /** @hidden */
            this._dataSource = InternalTexture.DATASOURCE_UNKNOWN;
            /** @hidden */
            this._comparisonFunction = 0;
            /** @hidden */
            this._references = 1;
            this._engine = engine;
            this._dataSource = dataSource;
            this._webGLTexture = engine._createTexture();
        }
        Object.defineProperty(InternalTexture.prototype, "dataSource", {
            /**
             * Gets the data source type of the texture (can be one of the LIB.InternalTexture.DATASOURCE_XXXX)
             */
            get: function () {
                return this._dataSource;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Increments the number of references (ie. the number of {LIB.Texture} that point to it)
         */
        InternalTexture.prototype.incrementReferences = function () {
            this._references++;
        };
        /**
         * Change the size of the texture (not the size of the content)
         * @param width defines the new width
         * @param height defines the new height
         * @param depth defines the new depth (1 by default)
         */
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
        /** @hidden */
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
                    var options = new LIB.RenderTargetCreationOptions();
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
                case InternalTexture.DATASOURCE_DEPTHTEXTURE:
                    var depthTextureOptions = {
                        bilinearFiltering: this.samplingMode !== LIB.Texture.BILINEAR_SAMPLINGMODE,
                        comparisonFunction: this._comparisonFunction,
                        generateStencil: this._generateStencilBuffer,
                        isCube: this.isCube
                    };
                    proxy = this._engine.createDepthStencilTexture({ width: this.width, height: this.height }, depthTextureOptions);
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
        /**
         * Dispose the current allocated resources
         */
        InternalTexture.prototype.dispose = function () {
            if (!this._webGLTexture) {
                return;
            }
            this._references--;
            if (this._references === 0) {
                this._engine._releaseTexture(this);
                this._webGLTexture = null;
                this.previous = null;
                this.next = null;
            }
        };
        /**
         * The source of the texture data is unknown
         */
        InternalTexture.DATASOURCE_UNKNOWN = 0;
        /**
         * Texture data comes from an URL
         */
        InternalTexture.DATASOURCE_URL = 1;
        /**
         * Texture data is only used for temporary storage
         */
        InternalTexture.DATASOURCE_TEMP = 2;
        /**
         * Texture data comes from raw data (ArrayBuffer)
         */
        InternalTexture.DATASOURCE_RAW = 3;
        /**
         * Texture content is dynamic (video or dynamic texture)
         */
        InternalTexture.DATASOURCE_DYNAMIC = 4;
        /**
         * Texture content is generated by rendering to it
         */
        InternalTexture.DATASOURCE_RENDERTARGET = 5;
        /**
         * Texture content is part of a multi render target process
         */
        InternalTexture.DATASOURCE_MULTIRENDERTARGET = 6;
        /**
         * Texture data comes from a cube data file
         */
        InternalTexture.DATASOURCE_CUBE = 7;
        /**
         * Texture data comes from a raw cube data
         */
        InternalTexture.DATASOURCE_CUBERAW = 8;
        /**
         * Texture data come from a prefiltered cube data file
         */
        InternalTexture.DATASOURCE_CUBEPREFILTERED = 9;
        /**
         * Texture content is raw 3D data
         */
        InternalTexture.DATASOURCE_RAW3D = 10;
        /**
         * Texture content is a depth texture
         */
        InternalTexture.DATASOURCE_DEPTHTEXTURE = 11;
        return InternalTexture;
    }());
    LIB.InternalTexture = InternalTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.internalTexture.js.map
//# sourceMappingURL=LIB.internalTexture.js.map
