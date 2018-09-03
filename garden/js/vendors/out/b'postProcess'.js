
var LIB;
(function (LIB) {
    /**
     * PostProcess can be used to apply a shader to a texture after it has been rendered
     * See https://doc.LIBjs.com/how_to/how_to_use_postprocesses
     */
    var PostProcess = /** @class */ (function () {
        /**
         * Creates a new instance PostProcess
         * @param name The name of the PostProcess.
         * @param fragmentUrl The url of the fragment shader to be used.
         * @param parameters Array of the names of uniform non-sampler2D variables that will be passed to the shader.
         * @param samplers Array of the names of uniform sampler2D variables that will be passed to the shader.
         * @param options The required width/height ratio to downsize to before computing the render pass. (Use 1.0 for full size)
         * @param camera The camera to apply the render pass to.
         * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
         * @param engine The engine which the post process will be applied. (default: current engine)
         * @param reusable If the post process can be reused on the same frame. (default: false)
         * @param defines String of defines that will be set when running the fragment shader. (default: null)
         * @param textureType Type of textures used when performing the post process. (default: 0)
         * @param vertexUrl The url of the vertex shader to be used. (default: "postprocess")
         * @param indexParameters The index parameters to be used for LIBs include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in LIB.blurPostProcess.ts and kernelBlur.vertex.fx
         * @param blockCompilation If the shader should not be compiled imediatly. (default: false)
         */
        function PostProcess(/** Name of the PostProcess. */ name, fragmentUrl, parameters, samplers, options, camera, samplingMode, engine, reusable, defines, textureType, vertexUrl, indexParameters, blockCompilation) {
            if (samplingMode === void 0) { samplingMode = LIB.Texture.NEAREST_SAMPLINGMODE; }
            if (defines === void 0) { defines = null; }
            if (textureType === void 0) { textureType = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            if (vertexUrl === void 0) { vertexUrl = "postprocess"; }
            if (blockCompilation === void 0) { blockCompilation = false; }
            this.name = name;
            /**
            * Width of the texture to apply the post process on
            */
            this.width = -1;
            /**
            * Height of the texture to apply the post process on
            */
            this.height = -1;
            /**
            * Internal, reference to the location where this postprocess was output to. (Typically the texture on the next postprocess in the chain)
            */
            this._outputTexture = null;
            /**
            * If the buffer needs to be cleared before applying the post process. (default: true)
            * Should be set to false if shader will overwrite all previous pixels.
            */
            this.autoClear = true;
            /**
            * Type of alpha mode to use when performing the post process (default: Engine.ALPHA_DISABLE)
            */
            this.alphaMode = LIB.Engine.ALPHA_DISABLE;
            /**
            * Animations to be used for the post processing
            */
            this.animations = new Array();
            /**
             * Enable Pixel Perfect mode where texture is not scaled to be power of 2.
             * Can only be used on a single postprocess or on the last one of a chain. (default: false)
             */
            this.enablePixelPerfectMode = false;
            /**
            * Scale mode for the post process (default: Engine.SCALEMODE_FLOOR)
            */
            this.scaleMode = LIB.Engine.SCALEMODE_FLOOR;
            /**
            * Force textures to be a power of two (default: false)
            */
            this.alwaysForcePOT = false;
            /**
            * Number of sample textures (default: 1)
            */
            this.samples = 1;
            /**
            * Modify the scale of the post process to be the same as the viewport (default: false)
            */
            this.adaptScaleToCurrentViewport = false;
            this._reusable = false;
            /**
            * Smart array of input and output textures for the post process.
            */
            this._textures = new LIB.SmartArray(2);
            /**
            * The index in _textures that corresponds to the output texture.
            */
            this._currentRenderTextureInd = 0;
            this._scaleRatio = new LIB.Vector2(1, 1);
            this._texelSize = LIB.Vector2.Zero();
            // Events
            /**
            * An event triggered when the postprocess is activated.
            */
            this.onActivateObservable = new LIB.Observable();
            /**
            * An event triggered when the postprocess changes its size.
            */
            this.onSizeChangedObservable = new LIB.Observable();
            /**
            * An event triggered when the postprocess applies its effect.
            */
            this.onApplyObservable = new LIB.Observable();
            /**
            * An event triggered before rendering the postprocess
            */
            this.onBeforeRenderObservable = new LIB.Observable();
            /**
            * An event triggered after rendering the postprocess
            */
            this.onAfterRenderObservable = new LIB.Observable();
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
            this.renderTargetSamplingMode = samplingMode ? samplingMode : LIB.Texture.NEAREST_SAMPLINGMODE;
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
            /**
            * A function that is added to the onActivateObservable
            */
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
            /**
            * A function that is added to the onSizeChangedObservable
            */
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
            /**
            * A function that is added to the onApplyObservable
            */
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
            /**
            * A function that is added to the onBeforeRenderObservable
            */
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
            /**
            * A function that is added to the onAfterRenderObservable
            */
            set: function (callback) {
                if (this._onAfterRenderObserver) {
                    this.onAfterRenderObservable.remove(this._onAfterRenderObserver);
                }
                this._onAfterRenderObserver = this.onAfterRenderObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PostProcess.prototype, "inputTexture", {
            /**
            * The input texture for this post process and the output texture of the previous post process. When added to a pipeline the previous post process will
            * render it's output into this texture and this texture will be used as textureSampler in the fragment shader of this post process.
            */
            get: function () {
                return this._textures.data[this._currentRenderTextureInd];
            },
            set: function (value) {
                this._forcedOutputTexture = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
        * Gets the camera which post process is applied to.
        * @returns The camera the post process is applied to.
        */
        PostProcess.prototype.getCamera = function () {
            return this._camera;
        };
        Object.defineProperty(PostProcess.prototype, "texelSize", {
            /**
            * Gets the texel size of the postprocess.
            * See https://en.wikipedia.org/wiki/Texel_(graphics)
            */
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
        /**
         * Gets the engine which this post process belongs to.
         * @returns The engine the post process was enabled with.
         */
        PostProcess.prototype.getEngine = function () {
            return this._engine;
        };
        /**
         * The effect that is created when initializing the post process.
         * @returns The created effect corrisponding the the postprocess.
         */
        PostProcess.prototype.getEffect = function () {
            return this._effect;
        };
        /**
         * To avoid multiple redundant textures for multiple post process, the output the output texture for this post process can be shared with another.
         * @param postProcess The post process to share the output with.
         * @returns This post process.
         */
        PostProcess.prototype.shareOutputWith = function (postProcess) {
            this._disposeTextures();
            this._shareOutputWithPostProcess = postProcess;
            return this;
        };
        /**
         * Reverses the effect of calling shareOutputWith and returns the post process back to its original state.
         * This should be called if the post process that shares output with this post process is disabled/disposed.
         */
        PostProcess.prototype.useOwnOutput = function () {
            if (this._textures.length == 0) {
                this._textures = new LIB.SmartArray(2);
            }
            this._shareOutputWithPostProcess = null;
        };
        /**
         * Updates the effect with the current post process compile time values and recompiles the shader.
         * @param defines Define statements that should be added at the beginning of the shader. (default: null)
         * @param uniforms Set of uniform variables that will be passed to the shader. (default: null)
         * @param samplers Set of Texture2D variables that will be passed to the shader. (default: null)
         * @param indexParameters The index parameters to be used for LIBs include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in LIB.blurPostProcess.ts and kernelBlur.vertex.fx
         * @param onCompiled Called when the shader has been compiled.
         * @param onError Called if there is an error when compiling a shader.
         */
        PostProcess.prototype.updateEffect = function (defines, uniforms, samplers, indexParameters, onCompiled, onError) {
            if (defines === void 0) { defines = null; }
            if (uniforms === void 0) { uniforms = null; }
            if (samplers === void 0) { samplers = null; }
            this._effect = this._engine.createEffect({ vertex: this._vertexUrl, fragment: this._fragmentUrl }, ["position"], uniforms || this._parameters, samplers || this._samplers, defines !== null ? defines : "", undefined, onCompiled, onError, indexParameters || this._indexParameters);
        };
        /**
         * The post process is reusable if it can be used multiple times within one frame.
         * @returns If the post process is reusable
         */
        PostProcess.prototype.isReusable = function () {
            return this._reusable;
        };
        /** invalidate frameBuffer to hint the postprocess to create a depth buffer */
        PostProcess.prototype.markTextureDirty = function () {
            this.width = -1;
        };
        /**
         * Activates the post process by intializing the textures to be used when executed. Notifies onActivateObservable.
         * When this post process is used in a pipeline, this is call will bind the input texture of this post process to the output of the previous.
         * @param camera The camera that will be used in the post process. This camera will be used when calling onActivateObservable.
         * @param sourceTexture The source texture to be inspected to get the width and height if not specified in the post process constructor. (default: null)
         * @param forceDepthStencil If true, a depth and stencil buffer will be generated. (default: false)
         * @returns The target texture that was bound to be written to.
         */
        PostProcess.prototype.activate = function (camera, sourceTexture, forceDepthStencil) {
            var _this = this;
            if (sourceTexture === void 0) { sourceTexture = null; }
            camera = camera || this._camera;
            var scene = camera.getScene();
            var engine = scene.getEngine();
            var maxSize = engine.getCaps().maxTextureSize;
            var requiredWidth = ((sourceTexture ? sourceTexture.width : this._engine.getRenderWidth(true)) * this._options) | 0;
            var requiredHeight = ((sourceTexture ? sourceTexture.height : this._engine.getRenderHeight(true)) * this._options) | 0;
            // If rendering to a webvr camera's left or right eye only half the width should be used to avoid resize when rendered to screen
            var webVRCamera = camera.parent;
            if (webVRCamera && (webVRCamera.leftCamera == camera || webVRCamera.rightCamera == camera)) {
                requiredWidth /= 2;
            }
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
                if (this.renderTargetSamplingMode === LIB.Texture.TRILINEAR_SAMPLINGMODE || this.alwaysForcePOT) {
                    if (!this._options.width) {
                        desiredWidth = engine.needPOTTextures ? LIB.Tools.GetExponentOfTwo(desiredWidth, maxSize, this.scaleMode) : desiredWidth;
                    }
                    if (!this._options.height) {
                        desiredHeight = engine.needPOTTextures ? LIB.Tools.GetExponentOfTwo(desiredHeight, maxSize, this.scaleMode) : desiredHeight;
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
                target = this._shareOutputWithPostProcess.inputTexture;
            }
            else if (this._forcedOutputTexture) {
                target = this._forcedOutputTexture;
                this.width = this._forcedOutputTexture.width;
                this.height = this._forcedOutputTexture.height;
            }
            else {
                target = this.inputTexture;
            }
            // Bind the input of this post process to be used as the output of the previous post process.
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
            if (this.autoClear && this.alphaMode === LIB.Engine.ALPHA_DISABLE) {
                this._engine.clear(this.clearColor ? this.clearColor : scene.clearColor, true, true, true);
            }
            if (this._reusable) {
                this._currentRenderTextureInd = (this._currentRenderTextureInd + 1) % 2;
            }
            return target;
        };
        Object.defineProperty(PostProcess.prototype, "isSupported", {
            /**
             * If the post process is supported.
             */
            get: function () {
                return this._effect.isSupported;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PostProcess.prototype, "aspectRatio", {
            /**
             * The aspect ratio of the output texture.
             */
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
        /**
         * Get a value indicating if the post-process is ready to be used
         * @returns true if the post-process is ready (shader is compiled)
         */
        PostProcess.prototype.isReady = function () {
            return this._effect && this._effect.isReady();
        };
        /**
         * Binds all textures and uniforms to the shader, this will be run on every pass.
         * @returns the effect corrisponding to this post process. Null if not compiled or not ready.
         */
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
            // Bind the output texture of the preivous post process as the input to this post process.            
            var source;
            if (this._shareOutputWithPostProcess) {
                source = this._shareOutputWithPostProcess.inputTexture;
            }
            else if (this._forcedOutputTexture) {
                source = this._forcedOutputTexture;
            }
            else {
                source = this.inputTexture;
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
        /**
         * Disposes the post process.
         * @param camera The camera to dispose the post process on.
         */
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
                var firstPostProcess = this._camera._getFirstPostProcess();
                if (firstPostProcess) {
                    firstPostProcess.markTextureDirty();
                }
            }
            this.onActivateObservable.clear();
            this.onAfterRenderObservable.clear();
            this.onApplyObservable.clear();
            this.onBeforeRenderObservable.clear();
            this.onSizeChangedObservable.clear();
        };
        return PostProcess;
    }());
    LIB.PostProcess = PostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.postProcess.js.map
//# sourceMappingURL=LIB.postProcess.js.map