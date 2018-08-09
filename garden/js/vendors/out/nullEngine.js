var BABYLON;
(function (BABYLON) {
    var NullEngineOptions = /** @class */ (function () {
        function NullEngineOptions() {
            this.renderWidth = 512;
            this.renderHeight = 256;
            this.textureSize = 512;
            this.deterministicLockstep = false;
            this.lockstepMaxSteps = 4;
        }
        return NullEngineOptions;
    }());
    BABYLON.NullEngineOptions = NullEngineOptions;
    /**
     * The null engine class provides support for headless version of babylon.js.
     * This can be used in server side scenario or for testing purposes
     */
    var NullEngine = /** @class */ (function (_super) {
        __extends(NullEngine, _super);
        function NullEngine(options) {
            if (options === void 0) { options = new NullEngineOptions(); }
            var _this = _super.call(this, null) || this;
            if (options.deterministicLockstep === undefined) {
                options.deterministicLockstep = false;
            }
            if (options.lockstepMaxSteps === undefined) {
                options.lockstepMaxSteps = 4;
            }
            _this._options = options;
            // Init caps
            // We consider we are on a webgl1 capable device
            _this._caps = new BABYLON.EngineCapabilities();
            _this._caps.maxTexturesImageUnits = 16;
            _this._caps.maxVertexTextureImageUnits = 16;
            _this._caps.maxTextureSize = 512;
            _this._caps.maxCubemapTextureSize = 512;
            _this._caps.maxRenderTextureSize = 512;
            _this._caps.maxVertexAttribs = 16;
            _this._caps.maxVaryingVectors = 16;
            _this._caps.maxFragmentUniformVectors = 16;
            _this._caps.maxVertexUniformVectors = 16;
            // Extensions
            _this._caps.standardDerivatives = false;
            _this._caps.astc = null;
            _this._caps.s3tc = null;
            _this._caps.pvrtc = null;
            _this._caps.etc1 = null;
            _this._caps.etc2 = null;
            _this._caps.textureAnisotropicFilterExtension = null;
            _this._caps.maxAnisotropy = 0;
            _this._caps.uintIndices = false;
            _this._caps.fragmentDepthSupported = false;
            _this._caps.highPrecisionShaderSupported = true;
            _this._caps.colorBufferFloat = false;
            _this._caps.textureFloat = false;
            _this._caps.textureFloatLinearFiltering = false;
            _this._caps.textureFloatRender = false;
            _this._caps.textureHalfFloat = false;
            _this._caps.textureHalfFloatLinearFiltering = false;
            _this._caps.textureHalfFloatRender = false;
            _this._caps.textureLOD = false;
            _this._caps.drawBuffersExtension = false;
            _this._caps.depthTextureExtension = false;
            _this._caps.vertexArrayObject = false;
            _this._caps.instancedArrays = false;
            BABYLON.Tools.Log("Babylon.js null engine (v" + BABYLON.Engine.Version + ") launched");
            // Wrappers
            if (typeof URL === "undefined") {
                URL = {
                    createObjectURL: function () { },
                    revokeObjectURL: function () { }
                };
            }
            if (typeof Blob === "undefined") {
                Blob = function () { };
            }
            return _this;
        }
        NullEngine.prototype.isDeterministicLockStep = function () {
            return this._options.deterministicLockstep;
        };
        NullEngine.prototype.getLockstepMaxSteps = function () {
            return this._options.lockstepMaxSteps;
        };
        NullEngine.prototype.createVertexBuffer = function (vertices) {
            return {
                capacity: 0,
                references: 1,
                is32Bits: false
            };
        };
        NullEngine.prototype.createIndexBuffer = function (indices) {
            return {
                capacity: 0,
                references: 1,
                is32Bits: false
            };
        };
        NullEngine.prototype.clear = function (color, backBuffer, depth, stencil) {
            if (stencil === void 0) { stencil = false; }
        };
        NullEngine.prototype.getRenderWidth = function (useScreen) {
            if (useScreen === void 0) { useScreen = false; }
            if (!useScreen && this._currentRenderTarget) {
                return this._currentRenderTarget.width;
            }
            return this._options.renderWidth;
        };
        NullEngine.prototype.getRenderHeight = function (useScreen) {
            if (useScreen === void 0) { useScreen = false; }
            if (!useScreen && this._currentRenderTarget) {
                return this._currentRenderTarget.height;
            }
            return this._options.renderHeight;
        };
        NullEngine.prototype.setViewport = function (viewport, requiredWidth, requiredHeight) {
            this._cachedViewport = viewport;
        };
        NullEngine.prototype.createShaderProgram = function (vertexCode, fragmentCode, defines, context) {
            return {
                transformFeedback: null,
                __SPECTOR_rebuildProgram: null
            };
        };
        NullEngine.prototype.getUniforms = function (shaderProgram, uniformsNames) {
            return [];
        };
        NullEngine.prototype.getAttributes = function (shaderProgram, attributesNames) {
            return [];
        };
        NullEngine.prototype.bindSamplers = function (effect) {
            this._currentEffect = null;
        };
        NullEngine.prototype.enableEffect = function (effect) {
            this._currentEffect = effect;
            if (effect.onBind) {
                effect.onBind(effect);
            }
            effect.onBindObservable.notifyObservers(effect);
        };
        NullEngine.prototype.setState = function (culling, zOffset, force, reverseSide) {
            if (zOffset === void 0) { zOffset = 0; }
            if (reverseSide === void 0) { reverseSide = false; }
        };
        NullEngine.prototype.setIntArray = function (uniform, array) {
        };
        NullEngine.prototype.setIntArray2 = function (uniform, array) {
        };
        NullEngine.prototype.setIntArray3 = function (uniform, array) {
        };
        NullEngine.prototype.setIntArray4 = function (uniform, array) {
        };
        NullEngine.prototype.setFloatArray = function (uniform, array) {
        };
        NullEngine.prototype.setFloatArray2 = function (uniform, array) {
        };
        NullEngine.prototype.setFloatArray3 = function (uniform, array) {
        };
        NullEngine.prototype.setFloatArray4 = function (uniform, array) {
        };
        NullEngine.prototype.setArray = function (uniform, array) {
        };
        NullEngine.prototype.setArray2 = function (uniform, array) {
        };
        NullEngine.prototype.setArray3 = function (uniform, array) {
        };
        NullEngine.prototype.setArray4 = function (uniform, array) {
        };
        NullEngine.prototype.setMatrices = function (uniform, matrices) {
        };
        NullEngine.prototype.setMatrix = function (uniform, matrix) {
        };
        NullEngine.prototype.setMatrix3x3 = function (uniform, matrix) {
        };
        NullEngine.prototype.setMatrix2x2 = function (uniform, matrix) {
        };
        NullEngine.prototype.setFloat = function (uniform, value) {
        };
        NullEngine.prototype.setFloat2 = function (uniform, x, y) {
        };
        NullEngine.prototype.setFloat3 = function (uniform, x, y, z) {
        };
        NullEngine.prototype.setBool = function (uniform, bool) {
        };
        NullEngine.prototype.setFloat4 = function (uniform, x, y, z, w) {
        };
        NullEngine.prototype.setColor3 = function (uniform, color3) {
        };
        NullEngine.prototype.setColor4 = function (uniform, color3, alpha) {
        };
        NullEngine.prototype.setAlphaMode = function (mode, noDepthWriteChange) {
            if (noDepthWriteChange === void 0) { noDepthWriteChange = false; }
            if (this._alphaMode === mode) {
                return;
            }
            this._alphaState.alphaBlend = (mode !== BABYLON.Engine.ALPHA_DISABLE);
            if (!noDepthWriteChange) {
                this.setDepthWrite(mode === BABYLON.Engine.ALPHA_DISABLE);
            }
            this._alphaMode = mode;
        };
        NullEngine.prototype.bindBuffers = function (vertexBuffers, indexBuffer, effect) {
        };
        NullEngine.prototype.wipeCaches = function (bruteForce) {
            if (this.preventCacheWipeBetweenFrames) {
                return;
            }
            this.resetTextureCache();
            this._currentEffect = null;
            if (bruteForce) {
                this._currentProgram = null;
                this._stencilState.reset();
                this._depthCullingState.reset();
                this.setDepthFunctionToLessOrEqual();
                this._alphaState.reset();
            }
            this._cachedVertexBuffers = null;
            this._cachedIndexBuffer = null;
            this._cachedEffectForVertexBuffers = null;
        };
        NullEngine.prototype.draw = function (useTriangles, indexStart, indexCount, instancesCount) {
        };
        NullEngine.prototype.drawElementsType = function (fillMode, indexStart, indexCount, instancesCount) {
        };
        NullEngine.prototype.drawArraysType = function (fillMode, verticesStart, verticesCount, instancesCount) {
        };
        NullEngine.prototype._createTexture = function () {
            return {};
        };
        NullEngine.prototype.createTexture = function (urlArg, noMipmap, invertY, scene, samplingMode, onLoad, onError, buffer, fallBack, format) {
            if (samplingMode === void 0) { samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE; }
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            if (buffer === void 0) { buffer = null; }
            var texture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_URL);
            var url = String(urlArg);
            texture.url = url;
            texture.generateMipMaps = !noMipmap;
            texture.samplingMode = samplingMode;
            texture.invertY = invertY;
            texture.baseWidth = this._options.textureSize;
            texture.baseHeight = this._options.textureSize;
            texture.width = this._options.textureSize;
            texture.height = this._options.textureSize;
            if (format) {
                texture.format = format;
            }
            texture.isReady = true;
            if (onLoad) {
                onLoad();
            }
            return texture;
        };
        NullEngine.prototype.createRenderTargetTexture = function (size, options) {
            var fullOptions = new BABYLON.RenderTargetCreationOptions();
            if (options !== undefined && typeof options === "object") {
                fullOptions.generateMipMaps = options.generateMipMaps;
                fullOptions.generateDepthBuffer = options.generateDepthBuffer === undefined ? true : options.generateDepthBuffer;
                fullOptions.generateStencilBuffer = fullOptions.generateDepthBuffer && options.generateStencilBuffer;
                fullOptions.type = options.type === undefined ? BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT : options.type;
                fullOptions.samplingMode = options.samplingMode === undefined ? BABYLON.Texture.TRILINEAR_SAMPLINGMODE : options.samplingMode;
            }
            else {
                fullOptions.generateMipMaps = options;
                fullOptions.generateDepthBuffer = true;
                fullOptions.generateStencilBuffer = false;
                fullOptions.type = BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT;
                fullOptions.samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE;
            }
            var texture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_RENDERTARGET);
            var width = size.width || size;
            var height = size.height || size;
            texture._depthStencilBuffer = {};
            texture._framebuffer = {};
            texture.baseWidth = width;
            texture.baseHeight = height;
            texture.width = width;
            texture.height = height;
            texture.isReady = true;
            texture.samples = 1;
            texture.generateMipMaps = fullOptions.generateMipMaps ? true : false;
            texture.samplingMode = fullOptions.samplingMode;
            texture.type = fullOptions.type;
            texture._generateDepthBuffer = fullOptions.generateDepthBuffer;
            texture._generateStencilBuffer = fullOptions.generateStencilBuffer ? true : false;
            return texture;
        };
        NullEngine.prototype.updateTextureSamplingMode = function (samplingMode, texture) {
            texture.samplingMode = samplingMode;
        };
        NullEngine.prototype.bindFramebuffer = function (texture, faceIndex, requiredWidth, requiredHeight, forceFullscreenViewport) {
            if (this._currentRenderTarget) {
                this.unBindFramebuffer(this._currentRenderTarget);
            }
            this._currentRenderTarget = texture;
            this._currentFramebuffer = texture._MSAAFramebuffer ? texture._MSAAFramebuffer : texture._framebuffer;
            if (this._cachedViewport && !forceFullscreenViewport) {
                this.setViewport(this._cachedViewport, requiredWidth, requiredHeight);
            }
        };
        NullEngine.prototype.unBindFramebuffer = function (texture, disableGenerateMipMaps, onBeforeUnbind) {
            if (disableGenerateMipMaps === void 0) { disableGenerateMipMaps = false; }
            this._currentRenderTarget = null;
            if (onBeforeUnbind) {
                if (texture._MSAAFramebuffer) {
                    this._currentFramebuffer = texture._framebuffer;
                }
                onBeforeUnbind();
            }
            this._currentFramebuffer = null;
        };
        NullEngine.prototype.createDynamicVertexBuffer = function (vertices) {
            var vbo = {
                capacity: 1,
                references: 1,
                is32Bits: false
            };
            return vbo;
        };
        NullEngine.prototype.updateDynamicIndexBuffer = function (indexBuffer, indices, offset) {
            if (offset === void 0) { offset = 0; }
        };
        NullEngine.prototype.updateDynamicVertexBuffer = function (vertexBuffer, vertices, offset, count) {
        };
        NullEngine.prototype._bindTextureDirectly = function (target, texture) {
            if (this._boundTexturesCache[this._activeChannel] !== texture) {
                this._boundTexturesCache[this._activeChannel] = texture;
            }
        };
        NullEngine.prototype._bindTexture = function (channel, texture) {
            if (channel < 0) {
                return;
            }
            this._bindTextureDirectly(0, texture);
        };
        NullEngine.prototype._releaseBuffer = function (buffer) {
            buffer.references--;
            if (buffer.references === 0) {
                return true;
            }
            return false;
        };
        return NullEngine;
    }(BABYLON.Engine));
    BABYLON.NullEngine = NullEngine;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.nullEngine.js.map
