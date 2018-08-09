(function (LIB) {
    var SSAO2RenderingPipeline = /** @class */ (function (_super) {
        __extends(SSAO2RenderingPipeline, _super);
        /**
         * @constructor
         * @param {string} name - The rendering pipeline name
         * @param {LIB.Scene} scene - The scene linked to this pipeline
         * @param {any} ratio - The size of the postprocesses. Can be a number shared between passes or an object for more precision: { ssaoRatio: 0.5, blurRatio: 1.0 }
         * @param {LIB.Camera[]} cameras - The array of cameras that the rendering pipeline will be attached to
         */
        function SSAO2RenderingPipeline(name, scene, ratio, cameras) {
            var _this = _super.call(this, scene.getEngine(), name) || this;
            // Members
            /**
            * The PassPostProcess id in the pipeline that contains the original scene color
            * @type {string}
            */
            _this.SSAOOriginalSceneColorEffect = "SSAOOriginalSceneColorEffect";
            /**
            * The SSAO PostProcess id in the pipeline
            * @type {string}
            */
            _this.SSAORenderEffect = "SSAORenderEffect";
            /**
            * The horizontal blur PostProcess id in the pipeline
            * @type {string}
            */
            _this.SSAOBlurHRenderEffect = "SSAOBlurHRenderEffect";
            /**
            * The vertical blur PostProcess id in the pipeline
            * @type {string}
            */
            _this.SSAOBlurVRenderEffect = "SSAOBlurVRenderEffect";
            /**
            * The PostProcess id in the pipeline that combines the SSAO-Blur output with the original scene color (SSAOOriginalSceneColorEffect)
            * @type {string}
            */
            _this.SSAOCombineRenderEffect = "SSAOCombineRenderEffect";
            /**
            * The output strength of the SSAO post-process. Default value is 1.0.
            * @type {number}
            */
            _this.totalStrength = 1.0;
            /**
            * Maximum depth value to still render AO. A smooth falloff makes the dimming more natural, so there will be no abrupt shading change.
            * @type {number}
            */
            _this.maxZ = 100.0;
            /**
            * In order to save performances, SSAO radius is clamped on close geometry. This ratio changes by how much
            * @type {number}
            */
            _this.minZAspect = 0.2;
            /**
            * Number of samples used for the SSAO calculations. Default value is 8
            * @type {number}
            */
            _this._samples = 8;
            /**
            * Are we using bilateral blur ?
            * @type {boolean}
            */
            _this._expensiveBlur = true;
            /**
            * The radius around the analyzed pixel used by the SSAO post-process. Default value is 2.0
            * @type {number}
            */
            _this.radius = 2.0;
            /**
            * The base color of the SSAO post-process
            * The final result is "base + ssao" between [0, 1]
            * @type {number}
            */
            _this.base = 0.1;
            _this._firstUpdate = true;
            _this._scene = scene;
            if (!_this.isSupported) {
                LIB.Tools.Error("SSAO 2 needs WebGL 2 support.");
                return _this;
            }
            var ssaoRatio = ratio.ssaoRatio || ratio;
            var blurRatio = ratio.blurRatio || ratio;
            // Set up assets
            var geometryBufferRenderer = scene.enableGeometryBufferRenderer();
            _this._createRandomTexture();
            _this._depthTexture = geometryBufferRenderer.getGBuffer().textures[0];
            _this._normalTexture = geometryBufferRenderer.getGBuffer().textures[1];
            _this._originalColorPostProcess = new LIB.PassPostProcess("SSAOOriginalSceneColor", 1.0, null, LIB.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false);
            _this._createSSAOPostProcess(1.0);
            _this._createBlurPostProcess(ssaoRatio, blurRatio);
            _this._createSSAOCombinePostProcess(blurRatio);
            // Set up pipeline
            _this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), _this.SSAOOriginalSceneColorEffect, function () { return _this._originalColorPostProcess; }, true));
            _this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), _this.SSAORenderEffect, function () { return _this._ssaoPostProcess; }, true));
            _this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), _this.SSAOBlurHRenderEffect, function () { return _this._blurHPostProcess; }, true));
            _this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), _this.SSAOBlurVRenderEffect, function () { return _this._blurVPostProcess; }, true));
            _this.addEffect(new LIB.PostProcessRenderEffect(scene.getEngine(), _this.SSAOCombineRenderEffect, function () { return _this._ssaoCombinePostProcess; }, true));
            // Finish
            scene.postProcessRenderPipelineManager.addPipeline(_this);
            if (cameras)
                scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(name, cameras);
            return _this;
        }
        Object.defineProperty(SSAO2RenderingPipeline.prototype, "samples", {
            get: function () {
                return this._samples;
            },
            set: function (n) {
                this._ssaoPostProcess.updateEffect("#define SAMPLES " + n + "\n#define SSAO");
                this._samples = n;
                this._sampleSphere = this._generateHemisphere();
                this._firstUpdate = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SSAO2RenderingPipeline.prototype, "expensiveBlur", {
            get: function () {
                return this._expensiveBlur;
            },
            set: function (b) {
                this._blurHPostProcess.updateEffect("#define BILATERAL_BLUR\n#define BILATERAL_BLUR_H\n#define SAMPLES 16\n#define EXPENSIVE " + (b ? "1" : "0") + "\n", null, ["textureSampler", "depthSampler"]);
                this._blurVPostProcess.updateEffect("#define BILATERAL_BLUR\n#define SAMPLES 16\n#define EXPENSIVE " + (b ? "1" : "0") + "\n", null, ["textureSampler", "depthSampler"]);
                this._expensiveBlur = b;
                this._firstUpdate = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SSAO2RenderingPipeline, "IsSupported", {
            /**
            *  Support test.
            * @type {boolean}
            */
            get: function () {
                var engine = LIB.Engine.LastCreatedEngine;
                if (!engine) {
                    return false;
                }
                return engine.getCaps().drawBuffersExtension;
            },
            enumerable: true,
            configurable: true
        });
        // Public Methods
        /**
         * Removes the internal pipeline assets and detatches the pipeline from the scene cameras
         */
        SSAO2RenderingPipeline.prototype.dispose = function (disableGeometryBufferRenderer) {
            if (disableGeometryBufferRenderer === void 0) { disableGeometryBufferRenderer = false; }
            for (var i = 0; i < this._scene.cameras.length; i++) {
                var camera = this._scene.cameras[i];
                this._originalColorPostProcess.dispose(camera);
                this._ssaoPostProcess.dispose(camera);
                this._blurHPostProcess.dispose(camera);
                this._blurVPostProcess.dispose(camera);
                this._ssaoCombinePostProcess.dispose(camera);
            }
            this._randomTexture.dispose();
            if (disableGeometryBufferRenderer)
                this._scene.disableGeometryBufferRenderer();
            this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._scene.cameras);
            _super.prototype.dispose.call(this);
        };
        // Private Methods
        SSAO2RenderingPipeline.prototype._createBlurPostProcess = function (ssaoRatio, blurRatio) {
            var _this = this;
            this._samplerOffsets = [];
            var expensive = this.expensiveBlur;
            for (var i = -8; i < 8; i++) {
                this._samplerOffsets.push(i * 2 + 0.5);
            }
            this._blurHPostProcess = new LIB.PostProcess("BlurH", "ssao2", ["outSize", "samplerOffsets", "near", "far", "radius"], ["depthSampler"], ssaoRatio, null, LIB.Texture.TRILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, "#define BILATERAL_BLUR\n#define BILATERAL_BLUR_H\n#define SAMPLES 16\n#define EXPENSIVE " + (expensive ? "1" : "0") + "\n");
            this._blurHPostProcess.onApply = function (effect) {
                if (!_this._scene.activeCamera) {
                    return;
                }
                effect.setFloat("outSize", _this._ssaoCombinePostProcess.width > 0 ? _this._ssaoCombinePostProcess.width : _this._originalColorPostProcess.width);
                effect.setFloat("near", _this._scene.activeCamera.minZ);
                effect.setFloat("far", _this._scene.activeCamera.maxZ);
                effect.setFloat("radius", _this.radius);
                effect.setTexture("depthSampler", _this._depthTexture);
                if (_this._firstUpdate) {
                    effect.setArray("samplerOffsets", _this._samplerOffsets);
                }
            };
            this._blurVPostProcess = new LIB.PostProcess("BlurV", "ssao2", ["outSize", "samplerOffsets", "near", "far", "radius"], ["depthSampler"], blurRatio, null, LIB.Texture.TRILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, "#define BILATERAL_BLUR\n#define BILATERAL_BLUR_V\n#define SAMPLES 16\n#define EXPENSIVE " + (expensive ? "1" : "0") + "\n");
            this._blurVPostProcess.onApply = function (effect) {
                if (!_this._scene.activeCamera) {
                    return;
                }
                effect.setFloat("outSize", _this._ssaoCombinePostProcess.height > 0 ? _this._ssaoCombinePostProcess.height : _this._originalColorPostProcess.height);
                effect.setFloat("near", _this._scene.activeCamera.minZ);
                effect.setFloat("far", _this._scene.activeCamera.maxZ);
                effect.setFloat("radius", _this.radius);
                effect.setTexture("depthSampler", _this._depthTexture);
                if (_this._firstUpdate) {
                    effect.setArray("samplerOffsets", _this._samplerOffsets);
                    _this._firstUpdate = false;
                }
            };
        };
        SSAO2RenderingPipeline.prototype._rebuild = function () {
            this._firstUpdate = true;
            _super.prototype._rebuild.call(this);
        };
        SSAO2RenderingPipeline.prototype._generateHemisphere = function () {
            var numSamples = this.samples;
            var result = [];
            var vector, scale;
            var rand = function (min, max) {
                return Math.random() * (max - min) + min;
            };
            var i = 0;
            while (i < numSamples) {
                vector = new LIB.Vector3(rand(-1.0, 1.0), rand(-1.0, 1.0), rand(0.30, 1.0));
                vector.normalize();
                scale = i / numSamples;
                scale = LIB.Scalar.Lerp(0.1, 1.0, scale * scale);
                vector.scaleInPlace(scale);
                result.push(vector.x, vector.y, vector.z);
                i++;
            }
            return result;
        };
        SSAO2RenderingPipeline.prototype._createSSAOPostProcess = function (ratio) {
            var _this = this;
            var numSamples = this.samples;
            this._sampleSphere = this._generateHemisphere();
            this._ssaoPostProcess = new LIB.PostProcess("ssao2", "ssao2", [
                "sampleSphere", "samplesFactor", "randTextureTiles", "totalStrength", "radius",
                "base", "range", "projection", "near", "far", "texelSize",
                "xViewport", "yViewport", "maxZ", "minZAspect"
            ], ["randomSampler", "normalSampler"], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, "#define SAMPLES " + numSamples + "\n#define SSAO");
            this._ssaoPostProcess.onApply = function (effect) {
                if (_this._firstUpdate) {
                    effect.setArray3("sampleSphere", _this._sampleSphere);
                    effect.setFloat("randTextureTiles", 4.0);
                }
                if (!_this._scene.activeCamera) {
                    return;
                }
                effect.setFloat("samplesFactor", 1 / _this.samples);
                effect.setFloat("totalStrength", _this.totalStrength);
                effect.setFloat2("texelSize", 1 / _this._ssaoPostProcess.width, 1 / _this._ssaoPostProcess.height);
                effect.setFloat("radius", _this.radius);
                effect.setFloat("maxZ", _this.maxZ);
                effect.setFloat("minZAspect", _this.minZAspect);
                effect.setFloat("base", _this.base);
                effect.setFloat("near", _this._scene.activeCamera.minZ);
                effect.setFloat("far", _this._scene.activeCamera.maxZ);
                effect.setFloat("xViewport", Math.tan(_this._scene.activeCamera.fov / 2) * _this._scene.getEngine().getAspectRatio(_this._scene.activeCamera, true));
                effect.setFloat("yViewport", Math.tan(_this._scene.activeCamera.fov / 2));
                effect.setMatrix("projection", _this._scene.getProjectionMatrix());
                effect.setTexture("textureSampler", _this._depthTexture);
                effect.setTexture("normalSampler", _this._normalTexture);
                effect.setTexture("randomSampler", _this._randomTexture);
            };
        };
        SSAO2RenderingPipeline.prototype._createSSAOCombinePostProcess = function (ratio) {
            var _this = this;
            this._ssaoCombinePostProcess = new LIB.PostProcess("ssaoCombine", "ssaoCombine", [], ["originalColor"], ratio, null, LIB.Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false);
            this._ssaoCombinePostProcess.onApply = function (effect) {
                effect.setTextureFromPostProcess("originalColor", _this._originalColorPostProcess);
            };
        };
        SSAO2RenderingPipeline.prototype._createRandomTexture = function () {
            var size = 512;
            this._randomTexture = new LIB.DynamicTexture("SSAORandomTexture", size, this._scene, false, LIB.Texture.TRILINEAR_SAMPLINGMODE);
            this._randomTexture.wrapU = LIB.Texture.WRAP_ADDRESSMODE;
            this._randomTexture.wrapV = LIB.Texture.WRAP_ADDRESSMODE;
            var context = this._randomTexture.getContext();
            var rand = function (min, max) {
                return Math.random() * (max - min) + min;
            };
            var randVector = LIB.Vector3.Zero();
            for (var x = 0; x < size; x++) {
                for (var y = 0; y < size; y++) {
                    randVector.x = rand(0.0, 1.0);
                    randVector.y = rand(0.0, 1.0);
                    randVector.z = 0.0;
                    randVector.normalize();
                    randVector.scaleInPlace(255);
                    randVector.x = Math.floor(randVector.x);
                    randVector.y = Math.floor(randVector.y);
                    context.fillStyle = 'rgb(' + randVector.x + ', ' + randVector.y + ', ' + randVector.z + ')';
                    context.fillRect(x, y, 1, 1);
                }
            }
            this._randomTexture.update(false);
        };
        __decorate([
            LIB.serialize()
        ], SSAO2RenderingPipeline.prototype, "totalStrength", void 0);
        __decorate([
            LIB.serialize()
        ], SSAO2RenderingPipeline.prototype, "maxZ", void 0);
        __decorate([
            LIB.serialize()
        ], SSAO2RenderingPipeline.prototype, "minZAspect", void 0);
        __decorate([
            LIB.serialize("samples")
        ], SSAO2RenderingPipeline.prototype, "_samples", void 0);
        __decorate([
            LIB.serialize("expensiveBlur")
        ], SSAO2RenderingPipeline.prototype, "_expensiveBlur", void 0);
        __decorate([
            LIB.serialize()
        ], SSAO2RenderingPipeline.prototype, "radius", void 0);
        __decorate([
            LIB.serialize()
        ], SSAO2RenderingPipeline.prototype, "base", void 0);
        return SSAO2RenderingPipeline;
    }(LIB.PostProcessRenderPipeline));
    LIB.SSAO2RenderingPipeline = SSAO2RenderingPipeline;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.ssao2RenderingPipeline.js.map
