var BABYLON;
(function (BABYLON) {
    var PostProcess = /** @class */ (function () {
        function PostProcess(name, fragmentUrl, parameters, samplers, options, camera, samplingMode, engine, reusable, defines, textureType, vertexUrl, indexParameters, blockCompilation) {
            if (samplingMode === void 0) { samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE; }
            if (defines === void 0) { defines = null; }
            if (textureType === void 0) { textureType = BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT; }
            if (vertexUrl === void 0) { vertexUrl = "postprocess"; }
            if (blockCompilation === void 0) { blockCompilation = false; }
            this.name = name;
            this.width = -1;
            this.height = -1;
            this.autoClear = true;
            this.alphaMode = BABYLON.Engine.ALPHA_DISABLE;
            this.animations = new Array();
            /*
                Enable Pixel Perfect mode where texture is not scaled to be power of 2.
                Can only be used on a single postprocess or on the last one of a chain.
            */
            this.enablePixelPerfectMode = false;
            this.scaleMode = BABYLON.Engine.SCALEMODE_FLOOR;
            this.alwaysForcePOT = false;
            this.samples = 1;
            this.adaptScaleToCurrentViewport = false;
            this._reusable = false;
            this._textures = new BABYLON.SmartArray(2);
            this._currentRenderTextureInd = 0;
            this._scaleRatio = new BABYLON.Vector2(1, 1);
            this._texelSize = BABYLON.Vector2.Zero();
            // Events
            /**
            * An event triggered when the postprocess is activated.
            * @type {BABYLON.Observable}
            */
            this.onActivateObservable = new BABYLON.Observable();
            /**
            * An event triggered when the postprocess changes its size.
            * @type {BABYLON.Observable}
            */
            this.onSizeChangedObservable = new BABYLON.Observable();
            /**
            * An event triggered when the postprocess applies its effect.
            * @type {BABYLON.Observable}
            */
            this.onApplyObservable = new BABYLON.Observable();
            /**
            * An event triggered before rendering the postprocess
            * @type {BABYLON.Observable}
            */
            this.onBeforeRenderObservable = new BABYLON.Observable();
            /**
            * An event triggered after rendering the postprocess
            * @type {BABYLON.Observable}
            */
            this.onAfterRenderObservable = new BABYLON.Observable();
            if (camera != null) {
                this._camera = camera;
                this._scene = camera.getScene();
                camera.attachPostProcess(this);
                this._engine = this._scene.getEngine();
                this._scene.postProcesses.push(this);
            }
            else if (engine) {
                this._engine = engine;
                this._engine.postProcesses.push(this);
            }
            this._options = options;
            this.renderTargetSamplingMode = samplingMode ? samplingMode : BABYLON.Texture.NEAREST_SAMPLINGMODE;
            this._reusable = reusable || false;
            this._textureType = textureType;
            this._samplers = samplers || [];
            this._samplers.push("textureSampler");
            this._fragmentUrl = fragmentUrl;
            this._vertexUrl = vertexUrl;
            this._parameters = parameters || [];
            this._parameters.push("scale");
            this._indexParameters = indexParameters;
            if (!blockCompilation) {
                this.updateEffect(defines);
            }
        }
        Object.defineProperty(PostProcess.prototype, "onActivate", {
            set: function (callback) {
                if (this._onActivateObserver) {
                    this.onActivateObservable.remove(this._onActivateObserver);
                }
                if (callback) {
                    this._onActivateObserver = this.onActivateObservable.add(callback);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PostProcess.prototype, "onSizeChanged", {
            set: function (callback) {
                if (this._onSizeChangedObserver) {
                    this.onSizeChangedObservable.remove(this._onSizeChangedObserver);
                }
                this._onSizeChangedObserver = this.onSizeChangedObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PostProcess.prototype, "onApply", {
            set: function (callback) {
                if (this._onApplyObserver) {
                    this.onApplyObservable.remove(this._onApplyObserver);
                }
                this._onApplyObserver = this.onApplyObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PostProcess.prototype, "onBeforeRender", {
            set: function (callback) {
                if (this._onBeforeRenderObserver) {
                    this.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
                }
                this._onBeforeRenderObserver = this.onBeforeRenderObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PostProcess.prototype, "onAfterRender", {
            set: function (callback) {
                if (this._onAfterRenderObserver) {
                    this.onAfterRenderObservable.remove(this._onAfterRenderObserver);
                }
                this._onAfterRenderObserver = this.onAfterRenderObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PostProcess.prototype, "outputTexture", {
            get: function () {
                return this._textures.data[this._currentRenderTextureInd];
            },
            set: function (value) {
                this._forcedOutputTexture = value;
            },
            enumerable: true,
            configurable: true
        });
        PostProcess.prototype.getCamera = function () {
            return this._camera;
        };
        Object.defineProperty(PostProcess.prototype, "texelSize", {
            get: function () {
                if (this._shareOutputWithPostProcess) {
                    return this._shareOutputWithPostProcess.texelSize;
                }
                if (this._forcedOutputTexture) {
                    this._texelSize.copyFromFloats(1.0 / this._forcedOutputTexture.width, 1.0 / this._forcedOutputTexture.height);
                }
                return this._texelSize;
            },
            enumerable: true,
            configurable: true
        });
        PostProcess.prototype.getEngine = function () {
            return this._engine;
        };
        PostProcess.prototype.getEffect = function () {
            return this._effect;
        };
        PostProcess.prototype.shareOutputWith = function (postProcess) {
            this._disposeTextures();
            this._shareOutputWithPostProcess = postProcess;
            return this;
        };
        PostProcess.prototype.updateEffect = function (defines, uniforms, samplers, indexParameters, onCompiled, onError) {
            if (defines === void 0) { defines = null; }
            if (uniforms === void 0) { uniforms = null; }
            if (samplers === void 0) { samplers = null; }
            this._effect = this._engine.createEffect({ vertex: this._vertexUrl, fragment: this._fragmentUrl }, ["position"], uniforms || this._parameters, samplers || this._samplers, defines !== null ? defines : "", undefined, onCompiled, onError, indexParameters || this._indexParameters);
        };
        PostProcess.prototype.isReusable = function () {
            return this._reusable;
        };
        /** invalidate frameBuffer to hint the postprocess to create a depth buffer */
        PostProcess.prototype.markTextureDirty = function () {
            this.width = -1;
        };
        PostProcess.prototype.activate = function (camera, sourceTexture, forceDepthStencil) {
            var _this = this;
            if (sourceTexture === void 0) { sourceTexture = null; }
            camera = camera || this._camera;
            var scene = camera.getScene();
            var engine = scene.getEngine();
            var maxSize = engine.getCaps().maxTextureSize;
            var requiredWidth = ((sourceTexture ? sourceTexture.width : this._engine.getRenderWidth(true)) * this._options) | 0;
            var requiredHeight = ((sourceTexture ? sourceTexture.height : this._engine.getRenderHeight(true)) * this._options) | 0;
            var desiredWidth = (this._options.width || requiredWidth);
            var desiredHeight = this._options.height || requiredHeight;
            if (!this._shareOutputWithPostProcess && !this._forcedOutputTexture) {
                if (this.adaptScaleToCurrentViewport) {
                    var currentViewport = engine.currentViewport;
                    if (currentViewport) {
                        desiredWidth *= currentViewport.width;
                        desiredHeight *= currentViewport.height;
                    }
                }
                if (this.renderTargetSamplingMode === BABYLON.Texture.TRILINEAR_SAMPLINGMODE || this.alwaysForcePOT) {
                    if (!this._options.width) {
                        desiredWidth = engine.needPOTTextures ? BABYLON.Tools.GetExponentOfTwo(desiredWidth, maxSize, this.scaleMode) : desiredWidth;
                    }
                    if (!this._options.height) {
                        desiredHeight = engine.needPOTTextures ? BABYLON.Tools.GetExponentOfTwo(desiredHeight, maxSize, this.scaleMode) : desiredHeight;
                    }
                }
                if (this.width !== desiredWidth || this.height !== desiredHeight) {
                    if (this._textures.length > 0) {
                        for (var i = 0; i < this._textures.length; i++) {
                            this._engine._releaseTexture(this._textures.data[i]);
                        }
                        this._textures.reset();
                    }
                    this.width = desiredWidth;
                    this.height = desiredHeight;
                    var textureSize = { width: this.width, height: this.height };
                    var textureOptions = {
                        generateMipMaps: false,
                        generateDepthBuffer: forceDepthStencil || camera._postProcesses.indexOf(this) === 0,
                        generateStencilBuffer: (forceDepthStencil || camera._postProcesses.indexOf(this) === 0) && this._engine.isStencilEnable,
                        samplingMode: this.renderTargetSamplingMode,
                        type: this._textureType
                    };
                    this._textures.push(this._engine.createRenderTargetTexture(textureSize, textureOptions));
                    if (this._reusable) {
                        this._textures.push(this._engine.createRenderTargetTexture(textureSize, textureOptions));
                    }
                    this._texelSize.copyFromFloats(1.0 / this.width, 1.0 / this.height);
                    this.onSizeChangedObservable.notifyObservers(this);
                }
                this._textures.forEach(function (texture) {
                    if (texture.samples !== _this.samples) {
                        _this._engine.updateRenderTargetTextureSampleCount(texture, _this.samples);
                    }
                });
            }
            var target;
            if (this._shareOutputWithPostProcess) {
                target = this._shareOutputWithPostProcess.outputTexture;
            }
            else if (this._forcedOutputTexture) {
                target = this._forcedOutputTexture;
                this.width = this._forcedOutputTexture.width;
                this.height = this._forcedOutputTexture.height;
            }
            else {
                target = this.outputTexture;
            }
            if (this.enablePixelPerfectMode) {
                this._scaleRatio.copyFromFloats(requiredWidth / desiredWidth, requiredHeight / desiredHeight);
                this._engine.bindFramebuffer(target, 0, requiredWidth, requiredHeight, true);
            }
            else {
                this._scaleRatio.copyFromFloats(1, 1);
                this._engine.bindFramebuffer(target, 0, undefined, undefined, true);
            }
            this.onActivateObservable.notifyObservers(camera);
            // Clear
            if (this.autoClear && this.alphaMode === BABYLON.Engine.ALPHA_DISABLE) {
                this._engine.clear(this.clearColor ? this.clearColor : scene.clearColor, true, true, true);
            }
            if (this._reusable) {
                this._currentRenderTextureInd = (this._currentRenderTextureInd + 1) % 2;
            }
        };
        Object.defineProperty(PostProcess.prototype, "isSupported", {
            get: function () {
                return this._effect.isSupported;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PostProcess.prototype, "aspectRatio", {
            get: function () {
                if (this._shareOutputWithPostProcess) {
                    return this._shareOutputWithPostProcess.aspectRatio;
                }
                if (this._forcedOutputTexture) {
                    return this._forcedOutputTexture.width / this._forcedOutputTexture.height;
                }
                return this.width / this.height;
            },
            enumerable: true,
            configurable: true
        });
        PostProcess.prototype.apply = function () {
            // Check
            if (!this._effect || !this._effect.isReady())
                return null;
            // States
            this._engine.enableEffect(this._effect);
            this._engine.setState(false);
            this._engine.setDepthBuffer(false);
            this._engine.setDepthWrite(false);
            // Alpha
            this._engine.setAlphaMode(this.alphaMode);
            if (this.alphaConstants) {
                this.getEngine().setAlphaConstants(this.alphaConstants.r, this.alphaConstants.g, this.alphaConstants.b, this.alphaConstants.a);
            }
            // Texture
            var source;
            if (this._shareOutputWithPostProcess) {
                source = this._shareOutputWithPostProcess.outputTexture;
            }
            else if (this._forcedOutputTexture) {
                source = this._forcedOutputTexture;
            }
            else {
                source = this.outputTexture;
            }
            this._effect._bindTexture("textureSampler", source);
            // Parameters
            this._effect.setVector2("scale", this._scaleRatio);
            this.onApplyObservable.notifyObservers(this._effect);
            return this._effect;
        };
        PostProcess.prototype._disposeTextures = function () {
            if (this._shareOutputWithPostProcess || this._forcedOutputTexture) {
                return;
            }
            if (this._textures.length > 0) {
                for (var i = 0; i < this._textures.length; i++) {
                    this._engine._releaseTexture(this._textures.data[i]);
                }
            }
            this._textures.dispose();
        };
        PostProcess.prototype.dispose = function (camera) {
            camera = camera || this._camera;
            this._disposeTextures();
            if (this._scene) {
                var index_1 = this._scene.postProcesses.indexOf(this);
                if (index_1 !== -1) {
                    this._scene.postProcesses.splice(index_1, 1);
                }
            }
            else {
                var index_2 = this._engine.postProcesses.indexOf(this);
                if (index_2 !== -1) {
                    this._engine.postProcesses.splice(index_2, 1);
                }
            }
            if (!camera) {
                return;
            }
            camera.detachPostProcess(this);
            var index = camera._postProcesses.indexOf(this);
            if (index === 0 && camera._postProcesses.length > 0) {
                this._camera._postProcesses[0].markTextureDirty();
            }
            this.onActivateObservable.clear();
            this.onAfterRenderObservable.clear();
            this.onApplyObservable.clear();
            this.onBeforeRenderObservable.clear();
            this.onSizeChangedObservable.clear();
        };
        return PostProcess;
    }());
    BABYLON.PostProcess = PostProcess;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.postProcess.js.map
