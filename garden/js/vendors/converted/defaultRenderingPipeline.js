






var LIB;
(function (LIB) {
    /**
     * The default rendering pipeline can be added to a scene to apply common post processing effects such as anti-aliasing or depth of field.
     * See https://doc.LIBjs.com/how_to/using_default_rendering_pipeline
     */
    var DefaultRenderingPipeline = /** @class */ (function (_super) {
        __extends(DefaultRenderingPipeline, _super);
        /**
         * @constructor
         * @param {string} name - The rendering pipeline name
         * @param {LIB.Scene} scene - The scene linked to this pipeline
         * @param {any} ratio - The size of the postprocesses (0.5 means that your postprocess will have a width = canvas.width 0.5 and a height = canvas.height 0.5)
         * @param {LIB.Camera[]} cameras - The array of cameras that the rendering pipeline will be attached to
         * @param {boolean} automaticBuild - if false, you will have to manually call prepare() to update the pipeline
         */
        function DefaultRenderingPipeline(name, hdr, scene, cameras, automaticBuild) {
            if (automaticBuild === void 0) { automaticBuild = true; }
            var _this = _super.call(this, scene.getEngine(), name) || this;
            _this._originalCameras = [];
            /**
             * ID of the sharpen post process,
             */
            _this.SharpenPostProcessId = "SharpenPostProcessEffect";
            /**
             * ID of the image processing post process;
             */
            _this.ImageProcessingPostProcessId = "ImageProcessingPostProcessEffect";
            /**
             * ID of the Fast Approximate Anti-Aliasing post process;
             */
            _this.FxaaPostProcessId = "FxaaPostProcessEffect";
            /**
             * ID of the chromatic aberration post process,
             */
            _this.ChromaticAberrationPostProcessId = "ChromaticAberrationPostProcessEffect";
            /**
             * ID of the grain post process
             */
            _this.GrainPostProcessId = "GrainPostProcessEffect";
            /**
             * Animations which can be used to tweak settings over a period of time
             */
            _this.animations = [];
            _this._imageProcessingConfigurationObserver = null;
            // Values   
            _this._sharpenEnabled = false;
            _this._bloomEnabled = false;
            _this._depthOfFieldEnabled = false;
            _this._depthOfFieldBlurLevel = LIB.DepthOfFieldEffectBlurLevel.Low;
            _this._fxaaEnabled = false;
            _this._imageProcessingEnabled = true;
            _this._bloomScale = 0.5;
            _this._chromaticAberrationEnabled = false;
            _this._grainEnabled = false;
            _this._buildAllowed = true;
            _this._resizeObserver = null;
            _this._hardwareScaleLevel = 1.0;
            _this._bloomKernel = 64;
            /**
             * Specifies the weight of the bloom in the final rendering
             */
            _this._bloomWeight = 0.15;
            /**
             * Specifies the luma threshold for the area that will be blurred by the bloom
             */
            _this._bloomThreshold = 0.9;
            _this._samples = 1;
            _this._hasCleared = false;
            _this._prevPostProcess = null;
            _this._prevPrevPostProcess = null;
            _this._cameras = cameras || [];
            _this._originalCameras = _this._cameras.slice();
            _this._buildAllowed = automaticBuild;
            // Initialize
            _this._scene = scene;
            var caps = _this._scene.getEngine().getCaps();
            _this._hdr = hdr && (caps.textureHalfFloatRender || caps.textureFloatRender);
            // Misc
            if (_this._hdr) {
                if (caps.textureHalfFloatRender) {
                    _this._defaultPipelineTextureType = LIB.Engine.TEXTURETYPE_HALF_FLOAT;
                }
                else if (caps.textureFloatRender) {
                    _this._defaultPipelineTextureType = LIB.Engine.TEXTURETYPE_FLOAT;
                }
            }
            else {
                _this._defaultPipelineTextureType = LIB.Engine.TEXTURETYPE_UNSIGNED_INT;
            }
            // Attach
            scene.postProcessRenderPipelineManager.addPipeline(_this);
            var engine = _this._scene.getEngine();
            // Create post processes before hand so they can be modified before enabled.
            // Block compilation flag is set to true to avoid compilation prior to use, these will be updated on first use in build pipeline.
            _this.sharpen = new LIB.SharpenPostProcess("sharpen", 1.0, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, _this._defaultPipelineTextureType, true);
            _this._sharpenEffect = new LIB.PostProcessRenderEffect(engine, _this.SharpenPostProcessId, function () { return _this.sharpen; }, true);
            _this.depthOfField = new LIB.DepthOfFieldEffect(_this._scene, null, _this._depthOfFieldBlurLevel, _this._defaultPipelineTextureType, true);
            _this.bloom = new LIB.BloomEffect(_this._scene, _this._bloomScale, _this._bloomWeight, _this.bloomKernel, _this._defaultPipelineTextureType, true);
            _this.chromaticAberration = new LIB.ChromaticAberrationPostProcess("ChromaticAberration", engine.getRenderWidth(), engine.getRenderHeight(), 1.0, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, _this._defaultPipelineTextureType, true);
            _this._chromaticAberrationEffect = new LIB.PostProcessRenderEffect(engine, _this.ChromaticAberrationPostProcessId, function () { return _this.chromaticAberration; }, true);
            _this.grain = new LIB.GrainPostProcess("Grain", 1.0, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, _this._defaultPipelineTextureType, true);
            _this._grainEffect = new LIB.PostProcessRenderEffect(engine, _this.GrainPostProcessId, function () { return _this.grain; }, true);
            _this._resizeObserver = engine.onResizeObservable.add(function () {
                _this._hardwareScaleLevel = engine.getHardwareScalingLevel();
                _this.bloomKernel = _this.bloomKernel;
            });
            _this._imageProcessingConfigurationObserver = _this._scene.imageProcessingConfiguration.onUpdateParameters.add(function () {
                _this.bloom._downscale._exposure = _this._scene.imageProcessingConfiguration.exposure;
            });
            _this._buildPipeline();
            return _this;
        }
        Object.defineProperty(DefaultRenderingPipeline.prototype, "sharpenEnabled", {
            get: function () {
                return this._sharpenEnabled;
            },
            /**
             * Enable or disable the sharpen process from the pipeline
             */
            set: function (enabled) {
                if (this._sharpenEnabled === enabled) {
                    return;
                }
                this._sharpenEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomKernel", {
            /**
             * Specifies the size of the bloom blur kernel, relative to the final output size
             */
            get: function () {
                return this._bloomKernel;
            },
            set: function (value) {
                this._bloomKernel = value;
                this.bloom.kernel = value / this._hardwareScaleLevel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomWeight", {
            get: function () {
                return this._bloomWeight;
            },
            /**
             * The strength of the bloom.
             */
            set: function (value) {
                if (this._bloomWeight === value) {
                    return;
                }
                this.bloom.weight = value;
                this._bloomWeight = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomThreshold", {
            get: function () {
                return this._bloomThreshold;
            },
            /**
             * The strength of the bloom.
             */
            set: function (value) {
                if (this._bloomThreshold === value) {
                    return;
                }
                this.bloom.threshold = value;
                this._bloomThreshold = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomScale", {
            get: function () {
                return this._bloomScale;
            },
            /**
             * The scale of the bloom, lower value will provide better performance.
             */
            set: function (value) {
                if (this._bloomScale === value) {
                    return;
                }
                this._bloomScale = value;
                // recreate bloom and dispose old as this setting is not dynamic
                this._rebuildBloom();
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomEnabled", {
            get: function () {
                return this._bloomEnabled;
            },
            /**
             * Enable or disable the bloom from the pipeline
             */
            set: function (enabled) {
                if (this._bloomEnabled === enabled) {
                    return;
                }
                this._bloomEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        DefaultRenderingPipeline.prototype._rebuildBloom = function () {
            // recreate bloom and dispose old as this setting is not dynamic
            var oldBloom = this.bloom;
            this.bloom = new LIB.BloomEffect(this._scene, this.bloomScale, this._bloomWeight, this.bloomKernel, this._defaultPipelineTextureType, false);
            this.bloom.threshold = oldBloom.threshold;
            for (var i = 0; i < this._cameras.length; i++) {
                oldBloom.disposeEffects(this._cameras[i]);
            }
        };
        Object.defineProperty(DefaultRenderingPipeline.prototype, "depthOfFieldEnabled", {
            /**
             * If the depth of field is enabled.
             */
            get: function () {
                return this._depthOfFieldEnabled;
            },
            set: function (enabled) {
                if (this._depthOfFieldEnabled === enabled) {
                    return;
                }
                this._depthOfFieldEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "depthOfFieldBlurLevel", {
            /**
             * Blur level of the depth of field effect. (Higher blur will effect performance)
             */
            get: function () {
                return this._depthOfFieldBlurLevel;
            },
            set: function (value) {
                if (this._depthOfFieldBlurLevel === value) {
                    return;
                }
                this._depthOfFieldBlurLevel = value;
                // recreate dof and dispose old as this setting is not dynamic
                var oldDof = this.depthOfField;
                this.depthOfField = new LIB.DepthOfFieldEffect(this._scene, null, this._depthOfFieldBlurLevel, this._defaultPipelineTextureType, false);
                this.depthOfField.focalLength = oldDof.focalLength;
                this.depthOfField.focusDistance = oldDof.focusDistance;
                this.depthOfField.fStop = oldDof.fStop;
                this.depthOfField.lensSize = oldDof.lensSize;
                for (var i = 0; i < this._cameras.length; i++) {
                    oldDof.disposeEffects(this._cameras[i]);
                }
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "fxaaEnabled", {
            get: function () {
                return this._fxaaEnabled;
            },
            /**
             * If the anti aliasing is enabled.
             */
            set: function (enabled) {
                if (this._fxaaEnabled === enabled) {
                    return;
                }
                this._fxaaEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "samples", {
            get: function () {
                return this._samples;
            },
            /**
             * MSAA sample count, setting this to 4 will provide 4x anti aliasing. (default: 1)
             */
            set: function (sampleCount) {
                if (this._samples === sampleCount) {
                    return;
                }
                this._samples = sampleCount;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "imageProcessingEnabled", {
            get: function () {
                return this._imageProcessingEnabled;
            },
            /**
             * If image processing is enabled.
             */
            set: function (enabled) {
                if (this._imageProcessingEnabled === enabled) {
                    return;
                }
                this._imageProcessingEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "chromaticAberrationEnabled", {
            get: function () {
                return this._chromaticAberrationEnabled;
            },
            /**
             * Enable or disable the chromaticAberration process from the pipeline
             */
            set: function (enabled) {
                if (this._chromaticAberrationEnabled === enabled) {
                    return;
                }
                this._chromaticAberrationEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "grainEnabled", {
            get: function () {
                return this._grainEnabled;
            },
            /**
             * Enable or disable the grain process from the pipeline
             */
            set: function (enabled) {
                if (this._grainEnabled === enabled) {
                    return;
                }
                this._grainEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Force the compilation of the entire pipeline.
         */
        DefaultRenderingPipeline.prototype.prepare = function () {
            var previousState = this._buildAllowed;
            this._buildAllowed = true;
            this._buildPipeline();
            this._buildAllowed = previousState;
        };
        DefaultRenderingPipeline.prototype._setAutoClearAndTextureSharing = function (postProcess, skipTextureSharing) {
            if (skipTextureSharing === void 0) { skipTextureSharing = false; }
            if (this._hasCleared) {
                postProcess.autoClear = false;
            }
            else {
                postProcess.autoClear = true;
                this._scene.autoClear = false;
                this._hasCleared = true;
            }
            if (!skipTextureSharing) {
                if (this._prevPrevPostProcess) {
                    postProcess.shareOutputWith(this._prevPrevPostProcess);
                }
                else {
                    postProcess.useOwnOutput();
                }
                if (this._prevPostProcess) {
                    this._prevPrevPostProcess = this._prevPostProcess;
                }
                this._prevPostProcess = postProcess;
            }
        };
        DefaultRenderingPipeline.prototype._buildPipeline = function () {
            var _this = this;
            if (!this._buildAllowed) {
                return;
            }
            this._scene.autoClear = true;
            var engine = this._scene.getEngine();
            this._disposePostProcesses();
            if (this._cameras !== null) {
                this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
                // get back cameras to be used to reattach pipeline
                this._cameras = this._originalCameras.slice();
            }
            this._reset();
            this._prevPostProcess = null;
            this._prevPrevPostProcess = null;
            this._hasCleared = false;
            if (this.depthOfFieldEnabled) {
                var depthTexture = this._scene.enableDepthRenderer(this._cameras[0]).getDepthMap();
                this.depthOfField.depthTexture = depthTexture;
                if (!this.depthOfField._isReady()) {
                    this.depthOfField._updateEffects();
                }
                this.addEffect(this.depthOfField);
                this._setAutoClearAndTextureSharing(this.depthOfField._effects[0], true);
            }
            if (this.bloomEnabled) {
                if (!this.bloom._isReady()) {
                    this.bloom._updateEffects();
                }
                this.addEffect(this.bloom);
                this._setAutoClearAndTextureSharing(this.bloom._effects[0], true);
            }
            if (this._imageProcessingEnabled) {
                this.imageProcessing = new LIB.ImageProcessingPostProcess("imageProcessing", 1.0, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
                if (this._hdr) {
                    this.addEffect(new LIB.PostProcessRenderEffect(engine, this.ImageProcessingPostProcessId, function () { return _this.imageProcessing; }, true));
                    this._setAutoClearAndTextureSharing(this.imageProcessing);
                }
                else {
                    this._scene.imageProcessingConfiguration.applyByPostProcess = false;
                }
            }
            if (this.sharpenEnabled) {
                if (!this.sharpen.isReady()) {
                    this.sharpen.updateEffect();
                }
                this.addEffect(this._sharpenEffect);
                this._setAutoClearAndTextureSharing(this.sharpen);
            }
            if (this.grainEnabled) {
                if (!this.grain.isReady()) {
                    this.grain.updateEffect();
                }
                this.addEffect(this._grainEffect);
                this._setAutoClearAndTextureSharing(this.grain);
            }
            if (this.chromaticAberrationEnabled) {
                if (!this.chromaticAberration.isReady()) {
                    this.chromaticAberration.updateEffect();
                }
                this.addEffect(this._chromaticAberrationEffect);
                this._setAutoClearAndTextureSharing(this.chromaticAberration);
            }
            if (this.fxaaEnabled) {
                this.fxaa = new LIB.FxaaPostProcess("fxaa", 1.0, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
                this.addEffect(new LIB.PostProcessRenderEffect(engine, this.FxaaPostProcessId, function () { return _this.fxaa; }, true));
                this._setAutoClearAndTextureSharing(this.fxaa, true);
            }
            if (this._cameras !== null) {
                this._scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this._name, this._cameras);
            }
            if (!this._enableMSAAOnFirstPostProcess(this.samples) && this.samples > 1) {
                LIB.Tools.Warn("MSAA failed to enable, MSAA is only supported in browsers that support webGL >= 2.0");
            }
        };
        DefaultRenderingPipeline.prototype._disposePostProcesses = function (disposeNonRecreated) {
            if (disposeNonRecreated === void 0) { disposeNonRecreated = false; }
            for (var i = 0; i < this._cameras.length; i++) {
                var camera = this._cameras[i];
                if (this.imageProcessing) {
                    this.imageProcessing.dispose(camera);
                }
                if (this.fxaa) {
                    this.fxaa.dispose(camera);
                }
                // These are created in the constructor and should not be disposed on every pipeline change
                if (disposeNonRecreated) {
                    if (this.sharpen) {
                        this.sharpen.dispose(camera);
                    }
                    if (this.depthOfField) {
                        this.depthOfField.disposeEffects(camera);
                    }
                    if (this.bloom) {
                        this.bloom.disposeEffects(camera);
                    }
                    if (this.chromaticAberration) {
                        this.chromaticAberration.dispose(camera);
                    }
                    if (this.grain) {
                        this.grain.dispose(camera);
                    }
                }
            }
            this.imageProcessing = null;
            this.fxaa = null;
            if (disposeNonRecreated) {
                this.sharpen = null;
                this._sharpenEffect = null;
                this.depthOfField = null;
                this.bloom = null;
                this.chromaticAberration = null;
                this._chromaticAberrationEffect = null;
                this.grain = null;
                this._grainEffect = null;
            }
        };
        /**
         * Dispose of the pipeline and stop all post processes
         */
        DefaultRenderingPipeline.prototype.dispose = function () {
            this._disposePostProcesses(true);
            this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
            this._scene.autoClear = true;
            if (this._resizeObserver) {
                this._scene.getEngine().onResizeObservable.remove(this._resizeObserver);
                this._resizeObserver = null;
            }
            this._scene.imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingConfigurationObserver);
            _super.prototype.dispose.call(this);
        };
        /**
         * Serialize the rendering pipeline (Used when exporting)
         * @returns the serialized object
         */
        DefaultRenderingPipeline.prototype.serialize = function () {
            var serializationObject = LIB.SerializationHelper.Serialize(this);
            serializationObject.customType = "DefaultRenderingPipeline";
            return serializationObject;
        };
        /**
         * Parse the serialized pipeline
         * @param source Source pipeline.
         * @param scene The scene to load the pipeline to.
         * @param rootUrl The URL of the serialized pipeline.
         * @returns An instantiated pipeline from the serialized object.
         */
        DefaultRenderingPipeline.Parse = function (source, scene, rootUrl) {
            return LIB.SerializationHelper.Parse(function () { return new DefaultRenderingPipeline(source._name, source._name._hdr, scene); }, source, scene, rootUrl);
        };
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "sharpenEnabled", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "bloomKernel", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "_bloomWeight", void 0);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "_bloomThreshold", void 0);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "_hdr", void 0);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "bloomWeight", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "bloomThreshold", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "bloomScale", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "bloomEnabled", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "depthOfFieldEnabled", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "depthOfFieldBlurLevel", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "fxaaEnabled", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "samples", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "imageProcessingEnabled", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "chromaticAberrationEnabled", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "grainEnabled", null);
        return DefaultRenderingPipeline;
    }(LIB.PostProcessRenderPipeline));
    LIB.DefaultRenderingPipeline = DefaultRenderingPipeline;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.defaultRenderingPipeline.js.map
//# sourceMappingURL=LIB.defaultRenderingPipeline.js.map
