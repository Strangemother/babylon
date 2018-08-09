var BABYLON;
(function (BABYLON) {
    var MirrorTexture = /** @class */ (function (_super) {
        __extends(MirrorTexture, _super);
        function MirrorTexture(name, size, scene, generateMipMaps, type, samplingMode, generateDepthBuffer) {
            if (type === void 0) { type = BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT; }
            if (samplingMode === void 0) { samplingMode = BABYLON.Texture.BILINEAR_SAMPLINGMODE; }
            if (generateDepthBuffer === void 0) { generateDepthBuffer = true; }
            var _this = _super.call(this, name, size, scene, generateMipMaps, true, type, false, samplingMode, generateDepthBuffer) || this;
            _this.mirrorPlane = new BABYLON.Plane(0, 1, 0, 1);
            _this._transformMatrix = BABYLON.Matrix.Zero();
            _this._mirrorMatrix = BABYLON.Matrix.Zero();
            _this._adaptiveBlurKernel = 0;
            _this._blurKernelX = 0;
            _this._blurKernelY = 0;
            _this._blurRatio = 1.0;
            _this.ignoreCameraViewport = true;
            _this.onBeforeRenderObservable.add(function () {
                BABYLON.Matrix.ReflectionToRef(_this.mirrorPlane, _this._mirrorMatrix);
                _this._savedViewMatrix = scene.getViewMatrix();
                _this._mirrorMatrix.multiplyToRef(_this._savedViewMatrix, _this._transformMatrix);
                scene.setTransformMatrix(_this._transformMatrix, scene.getProjectionMatrix());
                scene.clipPlane = _this.mirrorPlane;
                scene.getEngine().cullBackFaces = false;
                scene._mirroredCameraPosition = BABYLON.Vector3.TransformCoordinates(scene.activeCamera.globalPosition, _this._mirrorMatrix);
            });
            _this.onAfterRenderObservable.add(function () {
                scene.setTransformMatrix(_this._savedViewMatrix, scene.getProjectionMatrix());
                scene.getEngine().cullBackFaces = true;
                scene._mirroredCameraPosition = null;
                delete scene.clipPlane;
            });
            return _this;
        }
        Object.defineProperty(MirrorTexture.prototype, "blurRatio", {
            get: function () {
                return this._blurRatio;
            },
            set: function (value) {
                if (this._blurRatio === value) {
                    return;
                }
                this._blurRatio = value;
                this._preparePostProcesses();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MirrorTexture.prototype, "adaptiveBlurKernel", {
            set: function (value) {
                this._adaptiveBlurKernel = value;
                this._autoComputeBlurKernel();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MirrorTexture.prototype, "blurKernel", {
            set: function (value) {
                this.blurKernelX = value;
                this.blurKernelY = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MirrorTexture.prototype, "blurKernelX", {
            get: function () {
                return this._blurKernelX;
            },
            set: function (value) {
                if (this._blurKernelX === value) {
                    return;
                }
                this._blurKernelX = value;
                this._preparePostProcesses();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MirrorTexture.prototype, "blurKernelY", {
            get: function () {
                return this._blurKernelY;
            },
            set: function (value) {
                if (this._blurKernelY === value) {
                    return;
                }
                this._blurKernelY = value;
                this._preparePostProcesses();
            },
            enumerable: true,
            configurable: true
        });
        MirrorTexture.prototype._autoComputeBlurKernel = function () {
            var engine = this.getScene().getEngine();
            var dw = this.getRenderWidth() / engine.getRenderWidth();
            var dh = this.getRenderHeight() / engine.getRenderHeight();
            this.blurKernelX = this._adaptiveBlurKernel * dw;
            this.blurKernelY = this._adaptiveBlurKernel * dh;
        };
        MirrorTexture.prototype._onRatioRescale = function () {
            if (this._sizeRatio) {
                this.resize(this._initialSizeParameter);
                if (!this._adaptiveBlurKernel) {
                    this._preparePostProcesses();
                }
            }
            if (this._adaptiveBlurKernel) {
                this._autoComputeBlurKernel();
            }
        };
        MirrorTexture.prototype._preparePostProcesses = function () {
            this.clearPostProcesses(true);
            if (this._blurKernelX && this._blurKernelY) {
                var engine = this.getScene().getEngine();
                var textureType = engine.getCaps().textureFloatRender ? BABYLON.Engine.TEXTURETYPE_FLOAT : BABYLON.Engine.TEXTURETYPE_HALF_FLOAT;
                this._blurX = new BABYLON.BlurPostProcess("horizontal blur", new BABYLON.Vector2(1.0, 0), this._blurKernelX, this._blurRatio, null, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false, textureType);
                this._blurX.autoClear = false;
                if (this._blurRatio === 1 && this.samples < 2 && this._texture) {
                    this._blurX.outputTexture = this._texture;
                }
                else {
                    this._blurX.alwaysForcePOT = true;
                }
                this._blurY = new BABYLON.BlurPostProcess("vertical blur", new BABYLON.Vector2(0, 1.0), this._blurKernelY, this._blurRatio, null, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false, textureType);
                this._blurY.autoClear = false;
                this._blurY.alwaysForcePOT = this._blurRatio !== 1;
                this.addPostProcess(this._blurX);
                this.addPostProcess(this._blurY);
            }
            else {
                if (this._blurY) {
                    this.removePostProcess(this._blurY);
                    this._blurY.dispose();
                    this._blurY = null;
                }
                if (this._blurX) {
                    this.removePostProcess(this._blurX);
                    this._blurX.dispose();
                    this._blurX = null;
                }
            }
        };
        MirrorTexture.prototype.clone = function () {
            var scene = this.getScene();
            if (!scene) {
                return this;
            }
            var textureSize = this.getSize();
            var newTexture = new MirrorTexture(this.name, textureSize.width, scene, this._renderTargetOptions.generateMipMaps, this._renderTargetOptions.type, this._renderTargetOptions.samplingMode, this._renderTargetOptions.generateDepthBuffer);
            // Base texture
            newTexture.hasAlpha = this.hasAlpha;
            newTexture.level = this.level;
            // Mirror Texture
            newTexture.mirrorPlane = this.mirrorPlane.clone();
            if (this.renderList) {
                newTexture.renderList = this.renderList.slice(0);
            }
            return newTexture;
        };
        MirrorTexture.prototype.serialize = function () {
            if (!this.name) {
                return null;
            }
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.mirrorPlane = this.mirrorPlane.asArray();
            return serializationObject;
        };
        return MirrorTexture;
    }(BABYLON.RenderTargetTexture));
    BABYLON.MirrorTexture = MirrorTexture;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.mirrorTexture.js.map
