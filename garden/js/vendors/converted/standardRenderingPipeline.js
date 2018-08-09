(function (LIB) {
    var StandardRenderingPipeline = /** @class */ (function (_super) {
        __extends(StandardRenderingPipeline, _super);
        /**
         * @constructor
         * @param {string} name - The rendering pipeline name
         * @param {LIB.Scene} scene - The scene linked to this pipeline
         * @param {any} ratio - The size of the postprocesses (0.5 means that your postprocess will have a width = canvas.width 0.5 and a height = canvas.height 0.5)
         * @param {LIB.PostProcess} originalPostProcess - the custom original color post-process. Must be "reusable". Can be null.
         * @param {LIB.Camera[]} cameras - The array of cameras that the rendering pipeline will be attached to
         */
        function StandardRenderingPipeline(name, scene, ratio, originalPostProcess, cameras) {
            if (originalPostProcess === void 0) { originalPostProcess = null; }
            var _this = _super.call(this, scene.getEngine(), name) || this;
            _this.downSampleX4PostProcess = null;
            _this.brightPassPostProcess = null;
            _this.blurHPostProcesses = [];
            _this.blurVPostProcesses = [];
            _this.textureAdderPostProcess = null;
            _this.volumetricLightPostProcess = null;
            _this.volumetricLightSmoothXPostProcess = null;
            _this.volumetricLightSmoothYPostProcess = null;
            _this.volumetricLightMergePostProces = null;
            _this.volumetricLightFinalPostProcess = null;
            _this.luminancePostProcess = null;
            _this.luminanceDownSamplePostProcesses = [];
            _this.hdrPostProcess = null;
            _this.textureAdderFinalPostProcess = null;
            _this.lensFlareFinalPostProcess = null;
            _this.hdrFinalPostProcess = null;
            _this.lensFlarePostProcess = null;
            _this.lensFlareComposePostProcess = null;
            _this.motionBlurPostProcess = null;
            _this.depthOfFieldPostProcess = null;
            // Values
            _this.brightThreshold = 1.0;
            _this.blurWidth = 512.0;
            _this.horizontalBlur = false;
            _this.exposure = 1.0;
            _this.lensTexture = null;
            _this.volumetricLightCoefficient = 0.2;
            _this.volumetricLightPower = 4.0;
            _this.volumetricLightBlurScale = 64.0;
            _this.sourceLight = null;
            _this.hdrMinimumLuminance = 1.0;
            _this.hdrDecreaseRate = 0.5;
            _this.hdrIncreaseRate = 0.5;
            _this.lensColorTexture = null;
            _this.lensFlareStrength = 20.0;
            _this.lensFlareGhostDispersal = 1.4;
            _this.lensFlareHaloWidth = 0.7;
            _this.lensFlareDistortionStrength = 16.0;
            _this.lensStarTexture = null;
            _this.lensFlareDirtTexture = null;
            _this.depthOfFieldDistance = 10.0;
            _this.depthOfFieldBlurWidth = 64.0;
            _this.motionStrength = 1.0;
            // IAnimatable
            _this.animations = [];
            _this._currentDepthOfFieldSource = null;
            _this._hdrCurrentLuminance = 1.0;
            // Getters and setters
            _this._bloomEnabled = true;
            _this._depthOfFieldEnabled = false;
            _this._vlsEnabled = false;
            _this._lensFlareEnabled = false;
            _this._hdrEnabled = false;
            _this._motionBlurEnabled = false;
            _this._motionBlurSamples = 64.0;
            _this._volumetricLightStepsCount = 50.0;
            _this._cameras = cameras || [];
            // Initialize
            _this._scene = scene;
            _this._basePostProcess = originalPostProcess;
            _this._ratio = ratio;
            // Misc
            _this._floatTextureType = scene.getEngine().getCaps().textureFloatRender ? LIB.Engine.TEXTURETYPE_FLOAT : LIB.Engine.TEXTURETYPE_HALF_FLOAT;
            // Finish
            scene.postProcessRenderPipelineManager.addPipeline(_this);
            _this._buildPipeline();
            return _this;
        }
        Object.defineProperty(StandardRenderingPipeline.prototype, "BloomEnabled", {
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
        Object.defineProperty(StandardRenderingPipeline.prototype, "DepthOfFieldEnabled", {
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
        Object.defineProperty(StandardRenderingPipeline.prototype, "LensFlareEnabled", {
            get: function () {
                return this._lensFlareEnabled;
            },
            set: function (enabled) {
                if (this._lensFlareEnabled === enabled) {
                    return;
                }
                this._lensFlareEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardRenderingPipeline.prototype, "HDREnabled", {
            get: function () {
                return this._hdrEnabled;
            },
            set: function (enabled) {
                if (this._hdrEnabled === enabled) {
                    return;
                }
                this._hdrEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardRenderingPipeline.prototype, "VLSEnabled", {
            get: function () {
                return this._vlsEnabled;
            },
            set: function (enabled) {
                if (this._vlsEnabled === enabled) {
                    return;
                }
                if (enabled) {
                    var geometry = this._scene.enableGeometryBufferRenderer();
                    if (!geometry) {
                        LIB.Tools.Warn("Geometry renderer is not supported, cannot create volumetric lights in Standard Rendering Pipeline");
                        return;
                    }
                }
                this._vlsEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardRenderingPipeline.prototype, "MotionBlurEnabled", {
            get: function () {
                return this._motionBlurEnabled;
            },
            set: function (enabled) {
                if (this._motionBlurEnabled === enabled) {
                    return;
                }
                this._motionBlurEnabled = enabled;
                this._buildPipeline();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardRenderingPipeline.prototype, "volumetricLightStepsCount", {
            get: function () {
                return this._volumetricLightStepsCount;
            },
            set: function (count) {
                if (this.volumetricLightPostProcess) {
                    this.volumetricLightPostProcess.updateEffect("#define VLS\n#define NB_STEPS " + count.toFixed(1));
                }
                this._volumetricLightStepsCount = count;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardRenderingPipeline.prototype, "motionBlurSamples", {
            get: function () {
                return this._motionBlurSamples;
            },
            set: function (samples) {
                if (this.motionBlurPostProcess) {
                    this.motionBlurPostProcess.updateEffect("#define MOTION_BLUR\n#define MAX_MOTION_SAMPLES " + samples.toFixed(1));
                }
                this._motionBlurSamples = samples;
            },
            enumerable: true,
            configurable: true
        });
        StandardRenderingPipeline.prototype._buildPipeline = function () {
            var _this = this;
            var ratio = this._ratio;
            var scene = this._scene;
            this._disposePostProcesses();
            this._reset();
            // Create pass post-process
            if (!this._basePostProcess) {
                this.originalPostProcess = new LIB.PostProcess("HDRPass", "standard", [], [], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define PASS_POST_PROCESS", this._floatTextureType);
                this.originalPostProcess.onApply = function (effect) {
                    _this._currentDepthOfFieldSource = _this.originalPostProcess;
                };
            }
            else {
                this.originalPostProcess = this._basePostProcess;
            }
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRPassPostProcess", function () { return _this.originalPostProcess; }, true));
            this._currentDepthOfFieldSource = this.originalPostProcess;
            if (this._vlsEnabled) {
                // Create volumetric light
                this._createVolumetricLightPostProcess(scene, ratio);
                // Create volumetric light final post-process
                this.volumetricLightFinalPostProcess = new LIB.PostProcess("HDRVLSFinal", "standard", [], [], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define PASS_POST_PROCESS", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
                this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRVLSFinal", function () { return _this.volumetricLightFinalPostProcess; }, true));
            }
            if (this._bloomEnabled) {
                // Create down sample X4 post-process
                this._createDownSampleX4PostProcess(scene, ratio / 2);
                // Create bright pass post-process
                this._createBrightPassPostProcess(scene, ratio / 2);
                // Create gaussian blur post-processes (down sampling blurs)
                this._createBlurPostProcesses(scene, ratio / 4, 1);
                // Create texture adder post-process
                this._createTextureAdderPostProcess(scene, ratio);
                // Create depth-of-field source post-process
                this.textureAdderFinalPostProcess = new LIB.PostProcess("HDRDepthOfFieldSource", "standard", [], [], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define PASS_POST_PROCESS", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
                this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRBaseDepthOfFieldSource", function () { return _this.textureAdderFinalPostProcess; }, true));
            }
            if (this._lensFlareEnabled) {
                // Create lens flare post-process
                this._createLensFlarePostProcess(scene, ratio);
                // Create depth-of-field source post-process post lens-flare and disable it now
                this.lensFlareFinalPostProcess = new LIB.PostProcess("HDRPostLensFlareDepthOfFieldSource", "standard", [], [], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define PASS_POST_PROCESS", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
                this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRPostLensFlareDepthOfFieldSource", function () { return _this.lensFlareFinalPostProcess; }, true));
            }
            if (this._hdrEnabled) {
                // Create luminance
                this._createLuminancePostProcesses(scene, this._floatTextureType);
                // Create HDR
                this._createHdrPostProcess(scene, ratio);
                // Create depth-of-field source post-process post hdr and disable it now
                this.hdrFinalPostProcess = new LIB.PostProcess("HDRPostHDReDepthOfFieldSource", "standard", [], [], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define PASS_POST_PROCESS", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
                this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRPostHDReDepthOfFieldSource", function () { return _this.hdrFinalPostProcess; }, true));
            }
            if (this._depthOfFieldEnabled) {
                // Create gaussian blur used by depth-of-field
                this._createBlurPostProcesses(scene, ratio / 2, 3, "depthOfFieldBlurWidth");
                // Create depth-of-field post-process
                this._createDepthOfFieldPostProcess(scene, ratio);
            }
            if (this._motionBlurEnabled) {
                // Create motion blur post-process
                this._createMotionBlurPostProcess(scene, ratio);
            }
            if (this._cameras !== null) {
                this._scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this._name, this._cameras);
            }
        };
        // Down Sample X4 Post-Processs
        StandardRenderingPipeline.prototype._createDownSampleX4PostProcess = function (scene, ratio) {
            var _this = this;
            var downSampleX4Offsets = new Array(32);
            this.downSampleX4PostProcess = new LIB.PostProcess("HDRDownSampleX4", "standard", ["dsOffsets"], [], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define DOWN_SAMPLE_X4", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            this.downSampleX4PostProcess.onApply = function (effect) {
                var id = 0;
                var width = _this.downSampleX4PostProcess.width;
                var height = _this.downSampleX4PostProcess.height;
                for (var i = -2; i < 2; i++) {
                    for (var j = -2; j < 2; j++) {
                        downSampleX4Offsets[id] = (i + 0.5) * (1.0 / width);
                        downSampleX4Offsets[id + 1] = (j + 0.5) * (1.0 / height);
                        id += 2;
                    }
                }
                effect.setArray2("dsOffsets", downSampleX4Offsets);
            };
            // Add to pipeline
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRDownSampleX4", function () { return _this.downSampleX4PostProcess; }, true));
        };
        // Brightpass Post-Process
        StandardRenderingPipeline.prototype._createBrightPassPostProcess = function (scene, ratio) {
            var _this = this;
            var brightOffsets = new Array(8);
            this.brightPassPostProcess = new LIB.PostProcess("HDRBrightPass", "standard", ["dsOffsets", "brightThreshold"], [], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define BRIGHT_PASS", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            this.brightPassPostProcess.onApply = function (effect) {
                var sU = (1.0 / _this.brightPassPostProcess.width);
                var sV = (1.0 / _this.brightPassPostProcess.height);
                brightOffsets[0] = -0.5 * sU;
                brightOffsets[1] = 0.5 * sV;
                brightOffsets[2] = 0.5 * sU;
                brightOffsets[3] = 0.5 * sV;
                brightOffsets[4] = -0.5 * sU;
                brightOffsets[5] = -0.5 * sV;
                brightOffsets[6] = 0.5 * sU;
                brightOffsets[7] = -0.5 * sV;
                effect.setArray2("dsOffsets", brightOffsets);
                effect.setFloat("brightThreshold", _this.brightThreshold);
            };
            // Add to pipeline
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRBrightPass", function () { return _this.brightPassPostProcess; }, true));
        };
        // Create blur H&V post-processes
        StandardRenderingPipeline.prototype._createBlurPostProcesses = function (scene, ratio, indice, blurWidthKey) {
            var _this = this;
            if (blurWidthKey === void 0) { blurWidthKey = "blurWidth"; }
            var engine = scene.getEngine();
            var blurX = new LIB.BlurPostProcess("HDRBlurH" + "_" + indice, new LIB.Vector2(1, 0), this[blurWidthKey], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            var blurY = new LIB.BlurPostProcess("HDRBlurV" + "_" + indice, new LIB.Vector2(0, 1), this[blurWidthKey], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            blurX.onActivateObservable.add(function () {
                var dw = blurX.width / engine.getRenderWidth();
                blurX.kernel = _this[blurWidthKey] * dw;
            });
            blurY.onActivateObservable.add(function () {
                var dw = blurY.height / engine.getRenderHeight();
                blurY.kernel = _this.horizontalBlur ? 64 * dw : _this[blurWidthKey] * dw;
            });
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRBlurH" + indice, function () { return blurX; }, true));
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRBlurV" + indice, function () { return blurY; }, true));
            this.blurHPostProcesses.push(blurX);
            this.blurVPostProcesses.push(blurY);
        };
        // Create texture adder post-process
        StandardRenderingPipeline.prototype._createTextureAdderPostProcess = function (scene, ratio) {
            var _this = this;
            this.textureAdderPostProcess = new LIB.PostProcess("HDRTextureAdder", "standard", ["exposure"], ["otherSampler", "lensSampler"], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define TEXTURE_ADDER", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            this.textureAdderPostProcess.onApply = function (effect) {
                effect.setTextureFromPostProcess("otherSampler", _this._vlsEnabled ? _this._currentDepthOfFieldSource : _this.originalPostProcess);
                effect.setTexture("lensSampler", _this.lensTexture);
                effect.setFloat("exposure", _this.exposure);
                _this._currentDepthOfFieldSource = _this.textureAdderFinalPostProcess;
            };
            // Add to pipeline
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRTextureAdder", function () { return _this.textureAdderPostProcess; }, true));
        };
        StandardRenderingPipeline.prototype._createVolumetricLightPostProcess = function (scene, ratio) {
            var _this = this;
            var geometryRenderer = scene.enableGeometryBufferRenderer();
            geometryRenderer.enablePosition = true;
            var geometry = geometryRenderer.getGBuffer();
            // Base post-process
            this.volumetricLightPostProcess = new LIB.PostProcess("HDRVLS", "standard", ["shadowViewProjection", "cameraPosition", "sunDirection", "sunColor", "scatteringCoefficient", "scatteringPower", "depthValues"], ["shadowMapSampler", "positionSampler"], ratio / 8, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define VLS\n#define NB_STEPS " + this._volumetricLightStepsCount.toFixed(1));
            var depthValues = LIB.Vector2.Zero();
            this.volumetricLightPostProcess.onApply = function (effect) {
                if (_this.sourceLight && _this.sourceLight.getShadowGenerator() && _this._scene.activeCamera) {
                    var generator = _this.sourceLight.getShadowGenerator();
                    effect.setTexture("shadowMapSampler", generator.getShadowMap());
                    effect.setTexture("positionSampler", geometry.textures[2]);
                    effect.setColor3("sunColor", _this.sourceLight.diffuse);
                    effect.setVector3("sunDirection", _this.sourceLight.getShadowDirection());
                    effect.setVector3("cameraPosition", _this._scene.activeCamera.globalPosition);
                    effect.setMatrix("shadowViewProjection", generator.getTransformMatrix());
                    effect.setFloat("scatteringCoefficient", _this.volumetricLightCoefficient);
                    effect.setFloat("scatteringPower", _this.volumetricLightPower);
                    depthValues.x = generator.getLight().getDepthMinZ(_this._scene.activeCamera);
                    depthValues.y = generator.getLight().getDepthMaxZ(_this._scene.activeCamera);
                    effect.setVector2("depthValues", depthValues);
                }
            };
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRVLS", function () { return _this.volumetricLightPostProcess; }, true));
            // Smooth
            this._createBlurPostProcesses(scene, ratio / 4, 0, "volumetricLightBlurScale");
            // Merge
            this.volumetricLightMergePostProces = new LIB.PostProcess("HDRVLSMerge", "standard", [], ["originalSampler"], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define VLSMERGE");
            this.volumetricLightMergePostProces.onApply = function (effect) {
                effect.setTextureFromPostProcess("originalSampler", _this.originalPostProcess);
                _this._currentDepthOfFieldSource = _this.volumetricLightFinalPostProcess;
            };
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRVLSMerge", function () { return _this.volumetricLightMergePostProces; }, true));
        };
        // Create luminance
        StandardRenderingPipeline.prototype._createLuminancePostProcesses = function (scene, textureType) {
            var _this = this;
            // Create luminance
            var size = Math.pow(3, StandardRenderingPipeline.LuminanceSteps);
            this.luminancePostProcess = new LIB.PostProcess("HDRLuminance", "standard", ["lumOffsets"], [], { width: size, height: size }, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define LUMINANCE", textureType);
            var offsets = [];
            this.luminancePostProcess.onApply = function (effect) {
                var sU = (1.0 / _this.luminancePostProcess.width);
                var sV = (1.0 / _this.luminancePostProcess.height);
                offsets[0] = -0.5 * sU;
                offsets[1] = 0.5 * sV;
                offsets[2] = 0.5 * sU;
                offsets[3] = 0.5 * sV;
                offsets[4] = -0.5 * sU;
                offsets[5] = -0.5 * sV;
                offsets[6] = 0.5 * sU;
                offsets[7] = -0.5 * sV;
                effect.setArray2("lumOffsets", offsets);
            };
            // Add to pipeline
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRLuminance", function () { return _this.luminancePostProcess; }, true));
            // Create down sample luminance
            for (var i = StandardRenderingPipeline.LuminanceSteps - 1; i >= 0; i--) {
                var size = Math.pow(3, i);
                var defines = "#define LUMINANCE_DOWN_SAMPLE\n";
                if (i === 0) {
                    defines += "#define FINAL_DOWN_SAMPLER";
                }
                var postProcess = new LIB.PostProcess("HDRLuminanceDownSample" + i, "standard", ["dsOffsets", "halfDestPixelSize"], [], { width: size, height: size }, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, defines, textureType);
                this.luminanceDownSamplePostProcesses.push(postProcess);
            }
            // Create callbacks and add effects
            var lastLuminance = this.luminancePostProcess;
            this.luminanceDownSamplePostProcesses.forEach(function (pp, index) {
                var downSampleOffsets = new Array(18);
                pp.onApply = function (effect) {
                    if (!lastLuminance) {
                        return;
                    }
                    var id = 0;
                    for (var x = -1; x < 2; x++) {
                        for (var y = -1; y < 2; y++) {
                            downSampleOffsets[id] = x / lastLuminance.width;
                            downSampleOffsets[id + 1] = y / lastLuminance.height;
                            id += 2;
                        }
                    }
                    effect.setArray2("dsOffsets", downSampleOffsets);
                    effect.setFloat("halfDestPixelSize", 0.5 / lastLuminance.width);
                    if (index === _this.luminanceDownSamplePostProcesses.length - 1) {
                        lastLuminance = _this.luminancePostProcess;
                    }
                    else {
                        lastLuminance = pp;
                    }
                };
                if (index === _this.luminanceDownSamplePostProcesses.length - 1) {
                    pp.onAfterRender = function (effect) {
                        var pixel = scene.getEngine().readPixels(0, 0, 1, 1);
                        var bit_shift = new LIB.Vector4(1.0 / (255.0 * 255.0 * 255.0), 1.0 / (255.0 * 255.0), 1.0 / 255.0, 1.0);
                        _this._hdrCurrentLuminance = (pixel[0] * bit_shift.x + pixel[1] * bit_shift.y + pixel[2] * bit_shift.z + pixel[3] * bit_shift.w) / 100.0;
                    };
                }
                _this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRLuminanceDownSample" + index, function () { return pp; }, true));
            });
        };
        // Create HDR post-process
        StandardRenderingPipeline.prototype._createHdrPostProcess = function (scene, ratio) {
            var _this = this;
            this.hdrPostProcess = new LIB.PostProcess("HDR", "standard", ["averageLuminance"], ["textureAdderSampler"], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define HDR", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            var outputLiminance = 1;
            var time = 0;
            var lastTime = 0;
            this.hdrPostProcess.onApply = function (effect) {
                effect.setTextureFromPostProcess("textureAdderSampler", _this._currentDepthOfFieldSource);
                time += scene.getEngine().getDeltaTime();
                if (outputLiminance < 0) {
                    outputLiminance = _this._hdrCurrentLuminance;
                }
                else {
                    var dt = (lastTime - time) / 1000.0;
                    if (_this._hdrCurrentLuminance < outputLiminance + _this.hdrDecreaseRate * dt) {
                        outputLiminance += _this.hdrDecreaseRate * dt;
                    }
                    else if (_this._hdrCurrentLuminance > outputLiminance - _this.hdrIncreaseRate * dt) {
                        outputLiminance -= _this.hdrIncreaseRate * dt;
                    }
                    else {
                        outputLiminance = _this._hdrCurrentLuminance;
                    }
                }
                outputLiminance = LIB.Scalar.Clamp(outputLiminance, _this.hdrMinimumLuminance, 1e20);
                effect.setFloat("averageLuminance", outputLiminance);
                lastTime = time;
                _this._currentDepthOfFieldSource = _this.hdrFinalPostProcess;
            };
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDR", function () { return _this.hdrPostProcess; }, true));
        };
        // Create lens flare post-process
        StandardRenderingPipeline.prototype._createLensFlarePostProcess = function (scene, ratio) {
            var _this = this;
            this.lensFlarePostProcess = new LIB.PostProcess("HDRLensFlare", "standard", ["strength", "ghostDispersal", "haloWidth", "resolution", "distortionStrength"], ["lensColorSampler"], ratio / 2, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define LENS_FLARE", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRLensFlare", function () { return _this.lensFlarePostProcess; }, true));
            this._createBlurPostProcesses(scene, ratio / 4, 2);
            this.lensFlareComposePostProcess = new LIB.PostProcess("HDRLensFlareCompose", "standard", ["lensStarMatrix"], ["otherSampler", "lensDirtSampler", "lensStarSampler"], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define LENS_FLARE_COMPOSE", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRLensFlareCompose", function () { return _this.lensFlareComposePostProcess; }, true));
            var resolution = new LIB.Vector2(0, 0);
            // Lens flare
            this.lensFlarePostProcess.onApply = function (effect) {
                effect.setTextureFromPostProcess("textureSampler", _this._bloomEnabled ? _this.blurHPostProcesses[0] : _this.originalPostProcess);
                effect.setTexture("lensColorSampler", _this.lensColorTexture);
                effect.setFloat("strength", _this.lensFlareStrength);
                effect.setFloat("ghostDispersal", _this.lensFlareGhostDispersal);
                effect.setFloat("haloWidth", _this.lensFlareHaloWidth);
                // Shift
                resolution.x = _this.lensFlarePostProcess.width;
                resolution.y = _this.lensFlarePostProcess.height;
                effect.setVector2("resolution", resolution);
                effect.setFloat("distortionStrength", _this.lensFlareDistortionStrength);
            };
            // Compose
            var scaleBias1 = LIB.Matrix.FromValues(2.0, 0.0, -1.0, 0.0, 0.0, 2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
            var scaleBias2 = LIB.Matrix.FromValues(0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
            this.lensFlareComposePostProcess.onApply = function (effect) {
                if (!_this._scene.activeCamera) {
                    return;
                }
                effect.setTextureFromPostProcess("otherSampler", _this._currentDepthOfFieldSource);
                effect.setTexture("lensDirtSampler", _this.lensFlareDirtTexture);
                effect.setTexture("lensStarSampler", _this.lensStarTexture);
                // Lens start rotation matrix
                var camerax = _this._scene.activeCamera.getViewMatrix().getRow(0);
                var cameraz = _this._scene.activeCamera.getViewMatrix().getRow(2);
                var camRot = LIB.Vector3.Dot(camerax.toVector3(), new LIB.Vector3(1.0, 0.0, 0.0)) + LIB.Vector3.Dot(cameraz.toVector3(), new LIB.Vector3(0.0, 0.0, 1.0));
                camRot *= 4.0;
                var starRotation = LIB.Matrix.FromValues(Math.cos(camRot) * 0.5, -Math.sin(camRot), 0.0, 0.0, Math.sin(camRot), Math.cos(camRot) * 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
                var lensStarMatrix = scaleBias2.multiply(starRotation).multiply(scaleBias1);
                effect.setMatrix("lensStarMatrix", lensStarMatrix);
                _this._currentDepthOfFieldSource = _this.lensFlareFinalPostProcess;
            };
        };
        // Create depth-of-field post-process
        StandardRenderingPipeline.prototype._createDepthOfFieldPostProcess = function (scene, ratio) {
            var _this = this;
            this.depthOfFieldPostProcess = new LIB.PostProcess("HDRDepthOfField", "standard", ["distance"], ["otherSampler", "depthSampler"], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define DEPTH_OF_FIELD", LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            this.depthOfFieldPostProcess.onApply = function (effect) {
                effect.setTextureFromPostProcess("otherSampler", _this._currentDepthOfFieldSource);
                effect.setTexture("depthSampler", _this._getDepthTexture());
                effect.setFloat("distance", _this.depthOfFieldDistance);
            };
            // Add to pipeline
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRDepthOfField", function () { return _this.depthOfFieldPostProcess; }, true));
        };
        // Create motion blur post-process
        StandardRenderingPipeline.prototype._createMotionBlurPostProcess = function (scene, ratio) {
            var _this = this;
            this.motionBlurPostProcess = new LIB.PostProcess("HDRMotionBlur", "standard", ["inverseViewProjection", "prevViewProjection", "screenSize", "motionScale", "motionStrength"], ["depthSampler"], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false, "#define MOTION_BLUR\n#define MAX_MOTION_SAMPLES " + this.motionBlurSamples.toFixed(1), LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            var motionScale = 0;
            var prevViewProjection = LIB.Matrix.Identity();
            var invViewProjection = LIB.Matrix.Identity();
            var viewProjection = LIB.Matrix.Identity();
            var screenSize = LIB.Vector2.Zero();
            this.motionBlurPostProcess.onApply = function (effect) {
                viewProjection = scene.getProjectionMatrix().multiply(scene.getViewMatrix());
                viewProjection.invertToRef(invViewProjection);
                effect.setMatrix("inverseViewProjection", invViewProjection);
                effect.setMatrix("prevViewProjection", prevViewProjection);
                prevViewProjection = viewProjection;
                screenSize.x = _this.motionBlurPostProcess.width;
                screenSize.y = _this.motionBlurPostProcess.height;
                effect.setVector2("screenSize", screenSize);
                motionScale = scene.getEngine().getFps() / 60.0;
                effect.setFloat("motionScale", motionScale);
                effect.setFloat("motionStrength", _this.motionStrength);
                effect.setTexture("depthSampler", _this._getDepthTexture());
            };
            this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), "HDRMotionBlur", function () { return _this.motionBlurPostProcess; }, true));
        };
        StandardRenderingPipeline.prototype._getDepthTexture = function () {
            if (this._scene.getEngine().getCaps().drawBuffersExtension) {
                var renderer = this._scene.enableGeometryBufferRenderer();
                return renderer.getGBuffer().textures[0];
            }
            return this._scene.enableDepthRenderer().getDepthMap();
        };
        StandardRenderingPipeline.prototype._disposePostProcesses = function () {
            for (var i = 0; i < this._cameras.length; i++) {
                var camera = this._cameras[i];
                if (this.originalPostProcess) {
                    this.originalPostProcess.dispose(camera);
                }
                if (this.downSampleX4PostProcess) {
                    this.downSampleX4PostProcess.dispose(camera);
                }
                if (this.brightPassPostProcess) {
                    this.brightPassPostProcess.dispose(camera);
                }
                if (this.textureAdderPostProcess) {
                    this.textureAdderPostProcess.dispose(camera);
                }
                if (this.textureAdderFinalPostProcess) {
                    this.textureAdderFinalPostProcess.dispose(camera);
                }
                if (this.volumetricLightPostProcess) {
                    this.volumetricLightPostProcess.dispose(camera);
                }
                if (this.volumetricLightSmoothXPostProcess) {
                    this.volumetricLightSmoothXPostProcess.dispose(camera);
                }
                if (this.volumetricLightSmoothYPostProcess) {
                    this.volumetricLightSmoothYPostProcess.dispose(camera);
                }
                if (this.volumetricLightMergePostProces) {
                    this.volumetricLightMergePostProces.dispose(camera);
                }
                if (this.volumetricLightFinalPostProcess) {
                    this.volumetricLightFinalPostProcess.dispose(camera);
                }
                if (this.lensFlarePostProcess) {
                    this.lensFlarePostProcess.dispose(camera);
                }
                if (this.lensFlareComposePostProcess) {
                    this.lensFlareComposePostProcess.dispose(camera);
                }
                for (var j = 0; j < this.luminanceDownSamplePostProcesses.length; j++) {
                    this.luminanceDownSamplePostProcesses[j].dispose(camera);
                }
                if (this.luminancePostProcess) {
                    this.luminancePostProcess.dispose(camera);
                }
                if (this.hdrPostProcess) {
                    this.hdrPostProcess.dispose(camera);
                }
                if (this.hdrFinalPostProcess) {
                    this.hdrFinalPostProcess.dispose(camera);
                }
                if (this.depthOfFieldPostProcess) {
                    this.depthOfFieldPostProcess.dispose(camera);
                }
                if (this.motionBlurPostProcess) {
                    this.motionBlurPostProcess.dispose(camera);
                }
                for (var j = 0; j < this.blurHPostProcesses.length; j++) {
                    this.blurHPostProcesses[j].dispose(camera);
                }
                for (var j = 0; j < this.blurVPostProcesses.length; j++) {
                    this.blurVPostProcesses[j].dispose(camera);
                }
            }
            this.originalPostProcess = null;
            this.downSampleX4PostProcess = null;
            this.brightPassPostProcess = null;
            this.textureAdderPostProcess = null;
            this.textureAdderFinalPostProcess = null;
            this.volumetricLightPostProcess = null;
            this.volumetricLightSmoothXPostProcess = null;
            this.volumetricLightSmoothYPostProcess = null;
            this.volumetricLightMergePostProces = null;
            this.volumetricLightFinalPostProcess = null;
            this.lensFlarePostProcess = null;
            this.lensFlareComposePostProcess = null;
            this.luminancePostProcess = null;
            this.hdrPostProcess = null;
            this.hdrFinalPostProcess = null;
            this.depthOfFieldPostProcess = null;
            this.motionBlurPostProcess = null;
            this.luminanceDownSamplePostProcesses = [];
            this.blurHPostProcesses = [];
            this.blurVPostProcesses = [];
        };
        // Dispose
        StandardRenderingPipeline.prototype.dispose = function () {
            this._disposePostProcesses();
            this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
            _super.prototype.dispose.call(this);
        };
        // Serialize rendering pipeline
        StandardRenderingPipeline.prototype.serialize = function () {
            var serializationObject = LIB.SerializationHelper.Serialize(this);
            serializationObject.customType = "StandardRenderingPipeline";
            return serializationObject;
        };
        /**
         * Static members
         */
        // Parse serialized pipeline
        StandardRenderingPipeline.Parse = function (source, scene, rootUrl) {
            return LIB.SerializationHelper.Parse(function () { return new StandardRenderingPipeline(source._name, scene, source._ratio); }, source, scene, rootUrl);
        };
        // Luminance steps
        StandardRenderingPipeline.LuminanceSteps = 6;
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "brightThreshold", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "blurWidth", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "horizontalBlur", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "exposure", void 0);
        __decorate([
            LIB.serializeAsTexture("lensTexture")
        ], StandardRenderingPipeline.prototype, "lensTexture", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "volumetricLightCoefficient", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "volumetricLightPower", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "volumetricLightBlurScale", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "hdrMinimumLuminance", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "hdrDecreaseRate", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "hdrIncreaseRate", void 0);
        __decorate([
            LIB.serializeAsTexture("lensColorTexture")
        ], StandardRenderingPipeline.prototype, "lensColorTexture", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "lensFlareStrength", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "lensFlareGhostDispersal", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "lensFlareHaloWidth", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "lensFlareDistortionStrength", void 0);
        __decorate([
            LIB.serializeAsTexture("lensStarTexture")
        ], StandardRenderingPipeline.prototype, "lensStarTexture", void 0);
        __decorate([
            LIB.serializeAsTexture("lensFlareDirtTexture")
        ], StandardRenderingPipeline.prototype, "lensFlareDirtTexture", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "depthOfFieldDistance", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "depthOfFieldBlurWidth", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "motionStrength", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "_ratio", void 0);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "BloomEnabled", null);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "DepthOfFieldEnabled", null);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "LensFlareEnabled", null);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "HDREnabled", null);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "VLSEnabled", null);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "MotionBlurEnabled", null);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "volumetricLightStepsCount", null);
        __decorate([
            LIB.serialize()
        ], StandardRenderingPipeline.prototype, "motionBlurSamples", null);
        return StandardRenderingPipeline;
    }(LIB.PostProcessRenderPipeline));
    LIB.StandardRenderingPipeline = StandardRenderingPipeline;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.standardRenderingPipeline.js.map
