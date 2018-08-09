(function (LIB) {
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
            _this.PassPostProcessId = "PassPostProcessEffect";
            _this.HighLightsPostProcessId = "HighLightsPostProcessEffect";
            _this.BlurXPostProcessId = "BlurXPostProcessEffect";
            _this.BlurYPostProcessId = "BlurYPostProcessEffect";
            _this.CopyBackPostProcessId = "CopyBackPostProcessEffect";
            _this.ImageProcessingPostProcessId = "ImageProcessingPostProcessEffect";
            _this.FxaaPostProcessId = "FxaaPostProcessEffect";
            _this.FinalMergePostProcessId = "FinalMergePostProcessEffect";
            // IAnimatable
            _this.animations = [];
            // Values
            _this._bloomEnabled = false;
            _this._fxaaEnabled = false;
            _this._imageProcessingEnabled = true;
            _this._bloomScale = 0.6;
            _this._buildAllowed = true;
            /**
             * Specifies the size of the bloom blur kernel, relative to the final output size
             */
            _this.bloomKernel = 64;
            /**
             * Specifies the weight of the bloom in the final rendering
             */
            _this._bloomWeight = 0.15;
            _this._cameras = cameras || [];
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
            _this._buildPipeline();
            return _this;
        }
        Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomWeight", {
            get: function () {
                return this._bloomWeight;
            },
            set: function (value) {
                if (this._bloomWeight === value) {
                    return;
                }
                this._bloomWeight = value;
                if (this._hdr && this.copyBack) {
                    this.copyBack.alphaConstants = new LIB.Color4(value, value, value, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomScale", {
            get: function () {
                return this._bloomScale;
            },
            set: function (value) {
                if (this._bloomScale === value) {
                    return;
                }
                this._bloomScale = value;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultRenderingPipeline.prototype, "bloomEnabled", {
            get: function () {
                return this._bloomEnabled;
            },
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
        Object.defineProperty(DefaultRenderingPipeline.prototype, "fxaaEnabled", {
            get: function () {
                return this._fxaaEnabled;
            },
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
        Object.defineProperty(DefaultRenderingPipeline.prototype, "imageProcessingEnabled", {
            get: function () {
                return this._imageProcessingEnabled;
            },
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
        /**
         * Force the compilation of the entire pipeline.
         */
        DefaultRenderingPipeline.prototype.prepare = function () {
            var previousState = this._buildAllowed;
            this._buildAllowed = true;
            this._buildPipeline();
            this._buildAllowed = previousState;
        };
        DefaultRenderingPipeline.prototype._buildPipeline = function () {
            var _this = this;
            if (!this._buildAllowed) {
                return;
            }
            var engine = this._scene.getEngine();
            this._disposePostProcesses();
            this._reset();
            if (this.bloomEnabled) {
                this.pass = new LIB.PassPostProcess("sceneRenderTarget", 1.0, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
                this.addEffect(new LIB.PostProcessRenderEffect(engine, this.PassPostProcessId, function () { return _this.pass; }, true));
                if (!this._hdr) {
                    this.highlights = new LIB.HighlightsPostProcess("highlights", this.bloomScale, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
                    this.addEffect(new LIB.PostProcessRenderEffect(engine, this.HighLightsPostProcessId, function () { return _this.highlights; }, true));
                    this.highlights.autoClear = false;
                    this.highlights.alwaysForcePOT = true;
                }
                this.blurX = new LIB.BlurPostProcess("horizontal blur", new LIB.Vector2(1.0, 0), 10.0, this.bloomScale, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
                this.addEffect(new LIB.PostProcessRenderEffect(engine, this.BlurXPostProcessId, function () { return _this.blurX; }, true));
                this.blurX.alwaysForcePOT = true;
                this.blurX.autoClear = false;
                this.blurX.onActivateObservable.add(function () {
                    var dw = _this.blurX.width / engine.getRenderWidth(true);
                    _this.blurX.kernel = _this.bloomKernel * dw;
                });
                this.blurY = new LIB.BlurPostProcess("vertical blur", new LIB.Vector2(0, 1.0), 10.0, this.bloomScale, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
                this.addEffect(new LIB.PostProcessRenderEffect(engine, this.BlurYPostProcessId, function () { return _this.blurY; }, true));
                this.blurY.alwaysForcePOT = true;
                this.blurY.autoClear = false;
                this.blurY.onActivateObservable.add(function () {
                    var dh = _this.blurY.height / engine.getRenderHeight(true);
                    _this.blurY.kernel = _this.bloomKernel * dh;
                });
                this.copyBack = new LIB.PassPostProcess("bloomBlendBlit", this.bloomScale, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
                this.addEffect(new LIB.PostProcessRenderEffect(engine, this.CopyBackPostProcessId, function () { return _this.copyBack; }, true));
                this.copyBack.alwaysForcePOT = true;
                if (this._hdr) {
                    this.copyBack.alphaMode = LIB.Engine.ALPHA_INTERPOLATE;
                    var w = this.bloomWeight;
                    this.copyBack.alphaConstants = new LIB.Color4(w, w, w, w);
                }
                else {
                    this.copyBack.alphaMode = LIB.Engine.ALPHA_SCREENMODE;
                }
                this.copyBack.autoClear = false;
            }
            if (this._imageProcessingEnabled) {
                this.imageProcessing = new LIB.ImageProcessingPostProcess("imageProcessing", 1.0, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
                if (this._hdr) {
                    this.addEffect(new LIB.PostProcessRenderEffect(engine, this.ImageProcessingPostProcessId, function () { return _this.imageProcessing; }, true));
                }
                else {
                    this._scene.imageProcessingConfiguration.applyByPostProcess = false;
                }
            }
            if (this.fxaaEnabled) {
                this.fxaa = new LIB.FxaaPostProcess("fxaa", 1.0, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
                this.addEffect(new LIB.PostProcessRenderEffect(engine, this.FxaaPostProcessId, function () { return _this.fxaa; }, true));
                this.fxaa.autoClear = !this.bloomEnabled && (!this._hdr || !this.imageProcessing);
            }
            else if (this._hdr && this.imageProcessing) {
                this.finalMerge = this.imageProcessing;
            }
            else {
                this.finalMerge = new LIB.PassPostProcess("finalMerge", 1.0, null, LIB.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._defaultPipelineTextureType);
                this.addEffect(new LIB.PostProcessRenderEffect(engine, this.FinalMergePostProcessId, function () { return _this.finalMerge; }, true));
                this.finalMerge.autoClear = !this.bloomEnabled && (!this._hdr || !this.imageProcessing);
            }
            if (this.bloomEnabled) {
                if (this._hdr) {
                    this.copyBack.shareOutputWith(this.blurX);
                    if (this.imageProcessing) {
                        this.imageProcessing.shareOutputWith(this.pass);
                        this.imageProcessing.autoClear = false;
                    }
                    else if (this.fxaa) {
                        this.fxaa.shareOutputWith(this.pass);
                    }
                    else {
                        this.finalMerge.shareOutputWith(this.pass);
                    }
                }
                else {
                    if (this.fxaa) {
                        this.fxaa.shareOutputWith(this.pass);
                    }
                    else {
                        this.finalMerge.shareOutputWith(this.pass);
                    }
                }
            }
            if (this._cameras !== null) {
                this._scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this._name, this._cameras);
            }
        };
        DefaultRenderingPipeline.prototype._disposePostProcesses = function () {
            for (var i = 0; i < this._cameras.length; i++) {
                var camera = this._cameras[i];
                if (this.pass) {
                    this.pass.dispose(camera);
                }
                if (this.highlights) {
                    this.highlights.dispose(camera);
                }
                if (this.blurX) {
                    this.blurX.dispose(camera);
                }
                if (this.blurY) {
                    this.blurY.dispose(camera);
                }
                if (this.copyBack) {
                    this.copyBack.dispose(camera);
                }
                if (this.imageProcessing) {
                    this.imageProcessing.dispose(camera);
                }
                if (this.fxaa) {
                    this.fxaa.dispose(camera);
                }
                if (this.finalMerge) {
                    this.finalMerge.dispose(camera);
                }
            }
            this.pass = null;
            this.highlights = null;
            this.blurX = null;
            this.blurY = null;
            this.copyBack = null;
            this.imageProcessing = null;
            this.fxaa = null;
            this.finalMerge = null;
        };
        // Dispose
        DefaultRenderingPipeline.prototype.dispose = function () {
            this._disposePostProcesses();
            this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
            _super.prototype.dispose.call(this);
        };
        // Serialize rendering pipeline
        DefaultRenderingPipeline.prototype.serialize = function () {
            var serializationObject = LIB.SerializationHelper.Serialize(this);
            serializationObject.customType = "DefaultRenderingPipeline";
            return serializationObject;
        };
        // Parse serialized pipeline
        DefaultRenderingPipeline.Parse = function (source, scene, rootUrl) {
            return LIB.SerializationHelper.Parse(function () { return new DefaultRenderingPipeline(source._name, source._name._hdr, scene); }, source, scene, rootUrl);
        };
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "bloomKernel", void 0);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "_bloomWeight", void 0);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "_hdr", void 0);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "bloomWeight", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "bloomScale", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "bloomEnabled", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "fxaaEnabled", null);
        __decorate([
            LIB.serialize()
        ], DefaultRenderingPipeline.prototype, "imageProcessingEnabled", null);
        return DefaultRenderingPipeline;
    }(LIB.PostProcessRenderPipeline));
    LIB.DefaultRenderingPipeline = DefaultRenderingPipeline;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.defaultRenderingPipeline.js.map
