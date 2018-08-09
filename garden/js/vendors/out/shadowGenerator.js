var BABYLON;
(function (BABYLON) {
    var ShadowGenerator = /** @class */ (function () {
        /**
         * Creates a ShadowGenerator object.
         * A ShadowGenerator is the required tool to use the shadows.
         * Each light casting shadows needs to use its own ShadowGenerator.
         * Required parameters :
         * - `mapSize` (integer): the size of the texture what stores the shadows. Example : 1024.
         * - `light`: the light object generating the shadows.
         * - `useFullFloatFirst`: by default the generator will try to use half float textures but if you need precision (for self shadowing for instance), you can use this option to enforce full float texture.
         * Documentation : http://doc.babylonjs.com/tutorials/shadows
         */
        function ShadowGenerator(mapSize, light, useFullFloatFirst) {
            // Members
            this._bias = 0.00005;
            this._blurBoxOffset = 1;
            this._blurScale = 2;
            this._blurKernel = 1;
            this._useKernelBlur = false;
            this._filter = ShadowGenerator.FILTER_NONE;
            this._darkness = 0;
            this._transparencyShadow = false;
            /**
             * Controls the extent to which the shadows fade out at the edge of the frustum
             * Used only by directionals and spots
             */
            this.frustumEdgeFalloff = 0;
            this.forceBackFacesOnly = false;
            this._lightDirection = BABYLON.Vector3.Zero();
            this._viewMatrix = BABYLON.Matrix.Zero();
            this._projectionMatrix = BABYLON.Matrix.Zero();
            this._transformMatrix = BABYLON.Matrix.Zero();
            this._currentFaceIndex = 0;
            this._currentFaceIndexCache = 0;
            this._defaultTextureMatrix = BABYLON.Matrix.Identity();
            this._mapSize = mapSize;
            this._light = light;
            this._scene = light.getScene();
            light._shadowGenerator = this;
            // Texture type fallback from float to int if not supported.
            var caps = this._scene.getEngine().getCaps();
            if (!useFullFloatFirst) {
                if (caps.textureHalfFloatRender && caps.textureHalfFloatLinearFiltering) {
                    this._textureType = BABYLON.Engine.TEXTURETYPE_HALF_FLOAT;
                }
                else if (caps.textureFloatRender && caps.textureFloatLinearFiltering) {
                    this._textureType = BABYLON.Engine.TEXTURETYPE_FLOAT;
                }
                else {
                    this._textureType = BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT;
                }
            }
            else {
                if (caps.textureFloatRender && caps.textureFloatLinearFiltering) {
                    this._textureType = BABYLON.Engine.TEXTURETYPE_FLOAT;
                }
                else if (caps.textureHalfFloatRender && caps.textureHalfFloatLinearFiltering) {
                    this._textureType = BABYLON.Engine.TEXTURETYPE_HALF_FLOAT;
                }
                else {
                    this._textureType = BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT;
                }
            }
            this._initializeGenerator();
        }
        Object.defineProperty(ShadowGenerator, "FILTER_NONE", {
            // Static
            get: function () {
                return ShadowGenerator._FILTER_NONE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator, "FILTER_POISSONSAMPLING", {
            get: function () {
                return ShadowGenerator._FILTER_POISSONSAMPLING;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator, "FILTER_EXPONENTIALSHADOWMAP", {
            get: function () {
                return ShadowGenerator._FILTER_EXPONENTIALSHADOWMAP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator, "FILTER_BLUREXPONENTIALSHADOWMAP", {
            get: function () {
                return ShadowGenerator._FILTER_BLUREXPONENTIALSHADOWMAP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator, "FILTER_CLOSEEXPONENTIALSHADOWMAP", {
            get: function () {
                return ShadowGenerator._FILTER_CLOSEEXPONENTIALSHADOWMAP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator, "FILTER_BLURCLOSEEXPONENTIALSHADOWMAP", {
            get: function () {
                return ShadowGenerator._FILTER_BLURCLOSEEXPONENTIALSHADOWMAP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "bias", {
            get: function () {
                return this._bias;
            },
            set: function (bias) {
                this._bias = bias;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "blurBoxOffset", {
            get: function () {
                return this._blurBoxOffset;
            },
            set: function (value) {
                if (this._blurBoxOffset === value) {
                    return;
                }
                this._blurBoxOffset = value;
                this._disposeBlurPostProcesses();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "blurScale", {
            get: function () {
                return this._blurScale;
            },
            set: function (value) {
                if (this._blurScale === value) {
                    return;
                }
                this._blurScale = value;
                this._disposeBlurPostProcesses();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "blurKernel", {
            get: function () {
                return this._blurKernel;
            },
            set: function (value) {
                if (this._blurKernel === value) {
                    return;
                }
                this._blurKernel = value;
                this._disposeBlurPostProcesses();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "useKernelBlur", {
            get: function () {
                return this._useKernelBlur;
            },
            set: function (value) {
                if (this._useKernelBlur === value) {
                    return;
                }
                this._useKernelBlur = value;
                this._disposeBlurPostProcesses();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "depthScale", {
            get: function () {
                return this._depthScale !== undefined ? this._depthScale : this._light.getDepthScale();
            },
            set: function (value) {
                this._depthScale = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "filter", {
            get: function () {
                return this._filter;
            },
            set: function (value) {
                // Blurring the cubemap is going to be too expensive. Reverting to unblurred version
                if (this._light.needCube()) {
                    if (value === ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP) {
                        this.useExponentialShadowMap = true;
                        return;
                    }
                    else if (value === ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP) {
                        this.useCloseExponentialShadowMap = true;
                        return;
                    }
                }
                if (this._filter === value) {
                    return;
                }
                this._filter = value;
                this._disposeBlurPostProcesses();
                this._applyFilterValues();
                this._light._markMeshesAsLightDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "usePoissonSampling", {
            get: function () {
                return this.filter === ShadowGenerator.FILTER_POISSONSAMPLING;
            },
            set: function (value) {
                if (!value && this.filter !== ShadowGenerator.FILTER_POISSONSAMPLING) {
                    return;
                }
                this.filter = (value ? ShadowGenerator.FILTER_POISSONSAMPLING : ShadowGenerator.FILTER_NONE);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "useVarianceShadowMap", {
            get: function () {
                BABYLON.Tools.Warn("VSM are now replaced by ESM. Please use useExponentialShadowMap instead.");
                return this.useExponentialShadowMap;
            },
            set: function (value) {
                BABYLON.Tools.Warn("VSM are now replaced by ESM. Please use useExponentialShadowMap instead.");
                this.useExponentialShadowMap = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "useBlurVarianceShadowMap", {
            get: function () {
                BABYLON.Tools.Warn("VSM are now replaced by ESM. Please use useBlurExponentialShadowMap instead.");
                return this.useBlurExponentialShadowMap;
            },
            set: function (value) {
                BABYLON.Tools.Warn("VSM are now replaced by ESM. Please use useBlurExponentialShadowMap instead.");
                this.useBlurExponentialShadowMap = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "useExponentialShadowMap", {
            get: function () {
                return this.filter === ShadowGenerator.FILTER_EXPONENTIALSHADOWMAP;
            },
            set: function (value) {
                if (!value && this.filter !== ShadowGenerator.FILTER_EXPONENTIALSHADOWMAP) {
                    return;
                }
                this.filter = (value ? ShadowGenerator.FILTER_EXPONENTIALSHADOWMAP : ShadowGenerator.FILTER_NONE);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "useBlurExponentialShadowMap", {
            get: function () {
                return this.filter === ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP;
            },
            set: function (value) {
                if (!value && this.filter !== ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP) {
                    return;
                }
                this.filter = (value ? ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP : ShadowGenerator.FILTER_NONE);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "useCloseExponentialShadowMap", {
            get: function () {
                return this.filter === ShadowGenerator.FILTER_CLOSEEXPONENTIALSHADOWMAP;
            },
            set: function (value) {
                if (!value && this.filter !== ShadowGenerator.FILTER_CLOSEEXPONENTIALSHADOWMAP) {
                    return;
                }
                this.filter = (value ? ShadowGenerator.FILTER_CLOSEEXPONENTIALSHADOWMAP : ShadowGenerator.FILTER_NONE);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowGenerator.prototype, "useBlurCloseExponentialShadowMap", {
            get: function () {
                return this.filter === ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP;
            },
            set: function (value) {
                if (!value && this.filter !== ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP) {
                    return;
                }
                this.filter = (value ? ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP : ShadowGenerator.FILTER_NONE);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the darkness value (float).
         */
        ShadowGenerator.prototype.getDarkness = function () {
            return this._darkness;
        };
        /**
         * Sets the ShadowGenerator darkness value (float <= 1.0).
         * Returns the ShadowGenerator.
         */
        ShadowGenerator.prototype.setDarkness = function (darkness) {
            if (darkness >= 1.0)
                this._darkness = 1.0;
            else if (darkness <= 0.0)
                this._darkness = 0.0;
            else
                this._darkness = darkness;
            return this;
        };
        /**
         * Sets the ability to have transparent shadow (boolean).
         * Returns the ShadowGenerator.
         */
        ShadowGenerator.prototype.setTransparencyShadow = function (hasShadow) {
            this._transparencyShadow = hasShadow;
            return this;
        };
        /**
         * Returns a RenderTargetTexture object : the shadow map texture.
         */
        ShadowGenerator.prototype.getShadowMap = function () {
            return this._shadowMap;
        };
        /**
         * Returns the most ready computed shadow map as a RenderTargetTexture object.
         */
        ShadowGenerator.prototype.getShadowMapForRendering = function () {
            if (this._shadowMap2) {
                return this._shadowMap2;
            }
            return this._shadowMap;
        };
        /**
         * Helper function to add a mesh and its descendants to the list of shadow casters
         * @param mesh Mesh to add
         * @param includeDescendants boolean indicating if the descendants should be added. Default to true
         */
        ShadowGenerator.prototype.addShadowCaster = function (mesh, includeDescendants) {
            if (includeDescendants === void 0) { includeDescendants = true; }
            if (!this._shadowMap) {
                return this;
            }
            if (!this._shadowMap.renderList) {
                this._shadowMap.renderList = [];
            }
            this._shadowMap.renderList.push(mesh);
            if (includeDescendants) {
                (_a = this._shadowMap.renderList).push.apply(_a, mesh.getChildMeshes());
            }
            return this;
            var _a;
        };
        /**
         * Helper function to remove a mesh and its descendants from the list of shadow casters
         * @param mesh Mesh to remove
         * @param includeDescendants boolean indicating if the descendants should be removed. Default to true
         */
        ShadowGenerator.prototype.removeShadowCaster = function (mesh, includeDescendants) {
            if (includeDescendants === void 0) { includeDescendants = true; }
            if (!this._shadowMap || !this._shadowMap.renderList) {
                return this;
            }
            var index = this._shadowMap.renderList.indexOf(mesh);
            if (index !== -1) {
                this._shadowMap.renderList.splice(index, 1);
            }
            if (includeDescendants) {
                for (var _i = 0, _a = mesh.getChildren(); _i < _a.length; _i++) {
                    var child = _a[_i];
                    this.removeShadowCaster(child);
                }
            }
            return this;
        };
        /**
         * Returns the associated light object.
         */
        ShadowGenerator.prototype.getLight = function () {
            return this._light;
        };
        ShadowGenerator.prototype._initializeGenerator = function () {
            this._light._markMeshesAsLightDirty();
            this._initializeShadowMap();
        };
        ShadowGenerator.prototype._initializeShadowMap = function () {
            var _this = this;
            // Render target
            this._shadowMap = new BABYLON.RenderTargetTexture(this._light.name + "_shadowMap", this._mapSize, this._scene, false, true, this._textureType, this._light.needCube());
            this._shadowMap.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
            this._shadowMap.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
            this._shadowMap.anisotropicFilteringLevel = 1;
            this._shadowMap.updateSamplingMode(BABYLON.Texture.BILINEAR_SAMPLINGMODE);
            this._shadowMap.renderParticles = false;
            this._shadowMap.ignoreCameraViewport = true;
            // Record Face Index before render.
            this._shadowMap.onBeforeRenderObservable.add(function (faceIndex) {
                _this._currentFaceIndex = faceIndex;
            });
            // Custom render function.
            this._shadowMap.customRenderFunction = this._renderForShadowMap.bind(this);
            // Blur if required afer render.
            this._shadowMap.onAfterUnbindObservable.add(function () {
                if (!_this.useBlurExponentialShadowMap && !_this.useBlurCloseExponentialShadowMap) {
                    return;
                }
                if (!_this._blurPostProcesses || !_this._blurPostProcesses.length) {
                    _this._initializeBlurRTTAndPostProcesses();
                }
                var shadowMap = _this.getShadowMapForRendering();
                if (shadowMap) {
                    _this._scene.postProcessManager.directRender(_this._blurPostProcesses, shadowMap.getInternalTexture(), true);
                }
            });
            // Clear according to the chosen filter.
            this._shadowMap.onClearObservable.add(function (engine) {
                if (_this.useExponentialShadowMap || _this.useBlurExponentialShadowMap) {
                    engine.clear(new BABYLON.Color4(0, 0, 0, 0), true, true, true);
                }
                else {
                    engine.clear(new BABYLON.Color4(1.0, 1.0, 1.0, 1.0), true, true, true);
                }
            });
        };
        ShadowGenerator.prototype._initializeBlurRTTAndPostProcesses = function () {
            var _this = this;
            var engine = this._scene.getEngine();
            var targetSize = this._mapSize / this.blurScale;
            if (!this.useKernelBlur || this.blurScale !== 1.0) {
                this._shadowMap2 = new BABYLON.RenderTargetTexture(this._light.name + "_shadowMap2", targetSize, this._scene, false, true, this._textureType);
                this._shadowMap2.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                this._shadowMap2.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                this._shadowMap2.updateSamplingMode(BABYLON.Texture.BILINEAR_SAMPLINGMODE);
            }
            if (this.useKernelBlur) {
                this._kernelBlurXPostprocess = new BABYLON.BlurPostProcess(this._light.name + "KernelBlurX", new BABYLON.Vector2(1, 0), this.blurKernel, 1.0, null, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._textureType);
                this._kernelBlurXPostprocess.width = targetSize;
                this._kernelBlurXPostprocess.height = targetSize;
                this._kernelBlurXPostprocess.onApplyObservable.add(function (effect) {
                    effect.setTexture("textureSampler", _this._shadowMap);
                });
                this._kernelBlurYPostprocess = new BABYLON.BlurPostProcess(this._light.name + "KernelBlurY", new BABYLON.Vector2(0, 1), this.blurKernel, 1.0, null, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false, this._textureType);
                this._kernelBlurXPostprocess.autoClear = false;
                this._kernelBlurYPostprocess.autoClear = false;
                if (this._textureType === BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT) {
                    this._kernelBlurXPostprocess.packedFloat = true;
                    this._kernelBlurYPostprocess.packedFloat = true;
                }
                this._blurPostProcesses = [this._kernelBlurXPostprocess, this._kernelBlurYPostprocess];
            }
            else {
                this._boxBlurPostprocess = new BABYLON.PostProcess(this._light.name + "DepthBoxBlur", "depthBoxBlur", ["screenSize", "boxOffset"], [], 1.0, null, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false, "#define OFFSET " + this._blurBoxOffset, this._textureType);
                this._boxBlurPostprocess.onApplyObservable.add(function (effect) {
                    effect.setFloat2("screenSize", targetSize, targetSize);
                    effect.setTexture("textureSampler", _this._shadowMap);
                });
                this._boxBlurPostprocess.autoClear = false;
                this._blurPostProcesses = [this._boxBlurPostprocess];
            }
        };
        ShadowGenerator.prototype._renderForShadowMap = function (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) {
            var index;
            var engine = this._scene.getEngine();
            if (depthOnlySubMeshes.length) {
                engine.setColorWrite(false);
                for (index = 0; index < depthOnlySubMeshes.length; index++) {
                    this._renderSubMeshForShadowMap(depthOnlySubMeshes.data[index]);
                }
                engine.setColorWrite(true);
            }
            for (index = 0; index < opaqueSubMeshes.length; index++) {
                this._renderSubMeshForShadowMap(opaqueSubMeshes.data[index]);
            }
            for (index = 0; index < alphaTestSubMeshes.length; index++) {
                this._renderSubMeshForShadowMap(alphaTestSubMeshes.data[index]);
            }
            if (this._transparencyShadow) {
                for (index = 0; index < transparentSubMeshes.length; index++) {
                    this._renderSubMeshForShadowMap(transparentSubMeshes.data[index]);
                }
            }
        };
        ShadowGenerator.prototype._renderSubMeshForShadowMap = function (subMesh) {
            var _this = this;
            var mesh = subMesh.getRenderingMesh();
            var scene = this._scene;
            var engine = scene.getEngine();
            var material = subMesh.getMaterial();
            if (!material) {
                return;
            }
            // Culling
            engine.setState(material.backFaceCulling);
            // Managing instances
            var batch = mesh._getInstancesRenderList(subMesh._id);
            if (batch.mustReturn) {
                return;
            }
            var hardwareInstancedRendering = (engine.getCaps().instancedArrays) && (batch.visibleInstances[subMesh._id] !== null) && (batch.visibleInstances[subMesh._id] !== undefined);
            if (this.isReady(subMesh, hardwareInstancedRendering)) {
                engine.enableEffect(this._effect);
                mesh._bind(subMesh, this._effect, BABYLON.Material.TriangleFillMode);
                this._effect.setFloat2("biasAndScale", this.bias, this.depthScale);
                this._effect.setMatrix("viewProjection", this.getTransformMatrix());
                this._effect.setVector3("lightPosition", this.getLight().position);
                if (scene.activeCamera) {
                    this._effect.setFloat2("depthValues", this.getLight().getDepthMinZ(scene.activeCamera), this.getLight().getDepthMinZ(scene.activeCamera) + this.getLight().getDepthMaxZ(scene.activeCamera));
                }
                // Alpha test
                if (material && material.needAlphaTesting()) {
                    var alphaTexture = material.getAlphaTestTexture();
                    if (alphaTexture) {
                        this._effect.setTexture("diffuseSampler", alphaTexture);
                        this._effect.setMatrix("diffuseMatrix", alphaTexture.getTextureMatrix() || this._defaultTextureMatrix);
                    }
                }
                // Bones
                if (mesh.useBones && mesh.computeBonesUsingShaders) {
                    this._effect.setMatrices("mBones", mesh.skeleton.getTransformMatrices((mesh)));
                }
                if (this.forceBackFacesOnly) {
                    engine.setState(true, 0, false, true);
                }
                // Draw
                mesh._processRendering(subMesh, this._effect, BABYLON.Material.TriangleFillMode, batch, hardwareInstancedRendering, function (isInstance, world) { return _this._effect.setMatrix("world", world); });
                if (this.forceBackFacesOnly) {
                    engine.setState(true, 0, false, false);
                }
            }
            else {
                // Need to reset refresh rate of the shadowMap
                if (this._shadowMap) {
                    this._shadowMap.resetRefreshCounter();
                }
            }
        };
        ShadowGenerator.prototype._applyFilterValues = function () {
            if (!this._shadowMap) {
                return;
            }
            if (this.filter === ShadowGenerator.FILTER_NONE) {
                this._shadowMap.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
            }
            else {
                this._shadowMap.updateSamplingMode(BABYLON.Texture.BILINEAR_SAMPLINGMODE);
            }
        };
        /**
         * Force shader compilation including textures ready check
         */
        ShadowGenerator.prototype.forceCompilation = function (onCompiled, options) {
            var _this = this;
            var localOptions = __assign({ useInstances: false }, options);
            var shadowMap = this.getShadowMap();
            if (!shadowMap) {
                if (onCompiled) {
                    onCompiled(this);
                }
                return;
            }
            var renderList = shadowMap.renderList;
            if (!renderList) {
                if (onCompiled) {
                    onCompiled(this);
                }
                return;
            }
            var subMeshes = new Array();
            for (var _i = 0, renderList_1 = renderList; _i < renderList_1.length; _i++) {
                var mesh = renderList_1[_i];
                subMeshes.push.apply(subMeshes, mesh.subMeshes);
            }
            if (subMeshes.length === 0) {
                if (onCompiled) {
                    onCompiled(this);
                }
                return;
            }
            var currentIndex = 0;
            var checkReady = function () {
                if (!_this._scene || !_this._scene.getEngine()) {
                    return;
                }
                while (_this.isReady(subMeshes[currentIndex], localOptions.useInstances)) {
                    currentIndex++;
                    if (currentIndex >= subMeshes.length) {
                        if (onCompiled) {
                            onCompiled(_this);
                        }
                        return;
                    }
                }
                setTimeout(checkReady, 16);
            };
            checkReady();
        };
        /**
         * Boolean : true when the ShadowGenerator is finally computed.
         */
        ShadowGenerator.prototype.isReady = function (subMesh, useInstances) {
            var defines = [];
            if (this._textureType !== BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT) {
                defines.push("#define FLOAT");
            }
            if (this.useExponentialShadowMap || this.useBlurExponentialShadowMap) {
                defines.push("#define ESM");
            }
            var attribs = [BABYLON.VertexBuffer.PositionKind];
            var mesh = subMesh.getMesh();
            var material = subMesh.getMaterial();
            // Alpha test
            if (material && material.needAlphaTesting()) {
                var alphaTexture = material.getAlphaTestTexture();
                if (alphaTexture) {
                    defines.push("#define ALPHATEST");
                    if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.UVKind)) {
                        attribs.push(BABYLON.VertexBuffer.UVKind);
                        defines.push("#define UV1");
                    }
                    if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.UV2Kind)) {
                        if (alphaTexture.coordinatesIndex === 1) {
                            attribs.push(BABYLON.VertexBuffer.UV2Kind);
                            defines.push("#define UV2");
                        }
                    }
                }
            }
            // Bones
            if (mesh.useBones && mesh.computeBonesUsingShaders) {
                attribs.push(BABYLON.VertexBuffer.MatricesIndicesKind);
                attribs.push(BABYLON.VertexBuffer.MatricesWeightsKind);
                if (mesh.numBoneInfluencers > 4) {
                    attribs.push(BABYLON.VertexBuffer.MatricesIndicesExtraKind);
                    attribs.push(BABYLON.VertexBuffer.MatricesWeightsExtraKind);
                }
                defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
                defines.push("#define BonesPerMesh " + (mesh.skeleton.bones.length + 1));
            }
            else {
                defines.push("#define NUM_BONE_INFLUENCERS 0");
            }
            // Instances
            if (useInstances) {
                defines.push("#define INSTANCES");
                attribs.push("world0");
                attribs.push("world1");
                attribs.push("world2");
                attribs.push("world3");
            }
            // Get correct effect
            var join = defines.join("\n");
            if (this._cachedDefines !== join) {
                this._cachedDefines = join;
                this._effect = this._scene.getEngine().createEffect("shadowMap", attribs, ["world", "mBones", "viewProjection", "diffuseMatrix", "lightPosition", "depthValues", "biasAndScale"], ["diffuseSampler"], join);
            }
            return this._effect.isReady();
        };
        /**
         * This creates the defines related to the standard BJS materials.
         */
        ShadowGenerator.prototype.prepareDefines = function (defines, lightIndex) {
            var scene = this._scene;
            var light = this._light;
            if (!scene.shadowsEnabled || !light.shadowEnabled) {
                return;
            }
            defines["SHADOW" + lightIndex] = true;
            if (this.usePoissonSampling) {
                defines["SHADOWPCF" + lightIndex] = true;
            }
            else if (this.useExponentialShadowMap || this.useBlurExponentialShadowMap) {
                defines["SHADOWESM" + lightIndex] = true;
            }
            else if (this.useCloseExponentialShadowMap || this.useBlurCloseExponentialShadowMap) {
                defines["SHADOWCLOSEESM" + lightIndex] = true;
            }
            if (light.needCube()) {
                defines["SHADOWCUBE" + lightIndex] = true;
            }
        };
        /**
         * This binds shadow lights related to the standard BJS materials.
         * It implies the unifroms available on the materials are the standard BJS ones.
         */
        ShadowGenerator.prototype.bindShadowLight = function (lightIndex, effect) {
            var light = this._light;
            var scene = this._scene;
            if (!scene.shadowsEnabled || !light.shadowEnabled) {
                return;
            }
            var camera = scene.activeCamera;
            if (!camera) {
                return;
            }
            var shadowMap = this.getShadowMap();
            if (!shadowMap) {
                return;
            }
            if (!light.needCube()) {
                effect.setMatrix("lightMatrix" + lightIndex, this.getTransformMatrix());
            }
            effect.setTexture("shadowSampler" + lightIndex, this.getShadowMapForRendering());
            light._uniformBuffer.updateFloat4("shadowsInfo", this.getDarkness(), this.blurScale / shadowMap.getSize().width, this.depthScale, this.frustumEdgeFalloff, lightIndex);
            light._uniformBuffer.updateFloat2("depthValues", this.getLight().getDepthMinZ(camera), this.getLight().getDepthMinZ(camera) + this.getLight().getDepthMaxZ(camera), lightIndex);
        };
        // Methods
        /**
         * Returns a Matrix object : the updated transformation matrix.
         */
        ShadowGenerator.prototype.getTransformMatrix = function () {
            var scene = this._scene;
            if (this._currentRenderID === scene.getRenderId() && this._currentFaceIndexCache === this._currentFaceIndex) {
                return this._transformMatrix;
            }
            this._currentRenderID = scene.getRenderId();
            this._currentFaceIndexCache = this._currentFaceIndex;
            var lightPosition = this._light.position;
            if (this._light.computeTransformedInformation()) {
                lightPosition = this._light.transformedPosition;
            }
            BABYLON.Vector3.NormalizeToRef(this._light.getShadowDirection(this._currentFaceIndex), this._lightDirection);
            if (Math.abs(BABYLON.Vector3.Dot(this._lightDirection, BABYLON.Vector3.Up())) === 1.0) {
                this._lightDirection.z = 0.0000000000001; // Required to avoid perfectly perpendicular light
            }
            if (this._light.needProjectionMatrixCompute() || !this._cachedPosition || !this._cachedDirection || !lightPosition.equals(this._cachedPosition) || !this._lightDirection.equals(this._cachedDirection)) {
                this._cachedPosition = lightPosition.clone();
                this._cachedDirection = this._lightDirection.clone();
                BABYLON.Matrix.LookAtLHToRef(lightPosition, lightPosition.add(this._lightDirection), BABYLON.Vector3.Up(), this._viewMatrix);
                var shadowMap = this.getShadowMap();
                if (shadowMap) {
                    var renderList = shadowMap.renderList;
                    if (renderList) {
                        this._light.setShadowProjectionMatrix(this._projectionMatrix, this._viewMatrix, renderList);
                    }
                }
                this._viewMatrix.multiplyToRef(this._projectionMatrix, this._transformMatrix);
            }
            return this._transformMatrix;
        };
        ShadowGenerator.prototype.recreateShadowMap = function () {
            var shadowMap = this._shadowMap;
            if (!shadowMap) {
                return;
            }
            // Track render list.
            var renderList = shadowMap.renderList;
            // Clean up existing data.
            this._disposeRTTandPostProcesses();
            // Reinitializes.
            this._initializeGenerator();
            // Reaffect the filter to ensure a correct fallback if necessary.
            this.filter = this.filter;
            // Reaffect the filter.
            this._applyFilterValues();
            // Reaffect Render List.
            this._shadowMap.renderList = renderList;
        };
        ShadowGenerator.prototype._disposeBlurPostProcesses = function () {
            if (this._shadowMap2) {
                this._shadowMap2.dispose();
                this._shadowMap2 = null;
            }
            if (this._downSamplePostprocess) {
                this._downSamplePostprocess.dispose();
                this._downSamplePostprocess = null;
            }
            if (this._boxBlurPostprocess) {
                this._boxBlurPostprocess.dispose();
                this._boxBlurPostprocess = null;
            }
            if (this._kernelBlurXPostprocess) {
                this._kernelBlurXPostprocess.dispose();
                this._kernelBlurXPostprocess = null;
            }
            if (this._kernelBlurYPostprocess) {
                this._kernelBlurYPostprocess.dispose();
                this._kernelBlurYPostprocess = null;
            }
            this._blurPostProcesses = [];
        };
        ShadowGenerator.prototype._disposeRTTandPostProcesses = function () {
            if (this._shadowMap) {
                this._shadowMap.dispose();
                this._shadowMap = null;
            }
            this._disposeBlurPostProcesses();
        };
        /**
         * Disposes the ShadowGenerator.
         * Returns nothing.
         */
        ShadowGenerator.prototype.dispose = function () {
            this._disposeRTTandPostProcesses();
            if (this._light) {
                this._light._shadowGenerator = null;
                this._light._markMeshesAsLightDirty();
            }
        };
        /**
         * Serializes the ShadowGenerator and returns a serializationObject.
         */
        ShadowGenerator.prototype.serialize = function () {
            var serializationObject = {};
            var shadowMap = this.getShadowMap();
            if (!shadowMap) {
                return serializationObject;
            }
            serializationObject.lightId = this._light.id;
            serializationObject.mapSize = shadowMap.getRenderSize();
            serializationObject.useExponentialShadowMap = this.useExponentialShadowMap;
            serializationObject.useBlurExponentialShadowMap = this.useBlurExponentialShadowMap;
            serializationObject.useCloseExponentialShadowMap = this.useBlurExponentialShadowMap;
            serializationObject.useBlurCloseExponentialShadowMap = this.useBlurExponentialShadowMap;
            serializationObject.usePoissonSampling = this.usePoissonSampling;
            serializationObject.forceBackFacesOnly = this.forceBackFacesOnly;
            serializationObject.depthScale = this.depthScale;
            serializationObject.darkness = this.getDarkness();
            serializationObject.blurBoxOffset = this.blurBoxOffset;
            serializationObject.blurKernel = this.blurKernel;
            serializationObject.blurScale = this.blurScale;
            serializationObject.useKernelBlur = this.useKernelBlur;
            serializationObject.transparencyShadow = this._transparencyShadow;
            serializationObject.renderList = [];
            if (shadowMap.renderList) {
                for (var meshIndex = 0; meshIndex < shadowMap.renderList.length; meshIndex++) {
                    var mesh = shadowMap.renderList[meshIndex];
                    serializationObject.renderList.push(mesh.id);
                }
            }
            return serializationObject;
        };
        /**
         * Parses a serialized ShadowGenerator and returns a new ShadowGenerator.
         */
        ShadowGenerator.Parse = function (parsedShadowGenerator, scene) {
            //casting to point light, as light is missing the position attr and typescript complains.
            var light = scene.getLightByID(parsedShadowGenerator.lightId);
            var shadowGenerator = new ShadowGenerator(parsedShadowGenerator.mapSize, light);
            var shadowMap = shadowGenerator.getShadowMap();
            for (var meshIndex = 0; meshIndex < parsedShadowGenerator.renderList.length; meshIndex++) {
                var meshes = scene.getMeshesByID(parsedShadowGenerator.renderList[meshIndex]);
                meshes.forEach(function (mesh) {
                    if (!shadowMap) {
                        return;
                    }
                    if (!shadowMap.renderList) {
                        shadowMap.renderList = [];
                    }
                    shadowMap.renderList.push(mesh);
                });
            }
            if (parsedShadowGenerator.usePoissonSampling) {
                shadowGenerator.usePoissonSampling = true;
            }
            else if (parsedShadowGenerator.useExponentialShadowMap) {
                shadowGenerator.useExponentialShadowMap = true;
            }
            else if (parsedShadowGenerator.useBlurExponentialShadowMap) {
                shadowGenerator.useBlurExponentialShadowMap = true;
            }
            else if (parsedShadowGenerator.useCloseExponentialShadowMap) {
                shadowGenerator.useCloseExponentialShadowMap = true;
            }
            else if (parsedShadowGenerator.useBlurCloseExponentialShadowMap) {
                shadowGenerator.useBlurCloseExponentialShadowMap = true;
            }
            else if (parsedShadowGenerator.useVarianceShadowMap) {
                shadowGenerator.useExponentialShadowMap = true;
            }
            else if (parsedShadowGenerator.useBlurVarianceShadowMap) {
                shadowGenerator.useBlurExponentialShadowMap = true;
            }
            if (parsedShadowGenerator.depthScale) {
                shadowGenerator.depthScale = parsedShadowGenerator.depthScale;
            }
            if (parsedShadowGenerator.blurScale) {
                shadowGenerator.blurScale = parsedShadowGenerator.blurScale;
            }
            if (parsedShadowGenerator.blurBoxOffset) {
                shadowGenerator.blurBoxOffset = parsedShadowGenerator.blurBoxOffset;
            }
            if (parsedShadowGenerator.useKernelBlur) {
                shadowGenerator.useKernelBlur = parsedShadowGenerator.useKernelBlur;
            }
            if (parsedShadowGenerator.blurKernel) {
                shadowGenerator.blurKernel = parsedShadowGenerator.blurKernel;
            }
            if (parsedShadowGenerator.bias !== undefined) {
                shadowGenerator.bias = parsedShadowGenerator.bias;
            }
            if (parsedShadowGenerator.darkness) {
                shadowGenerator.setDarkness(parsedShadowGenerator.darkness);
            }
            if (parsedShadowGenerator.transparencyShadow) {
                shadowGenerator.setTransparencyShadow(true);
            }
            shadowGenerator.forceBackFacesOnly = parsedShadowGenerator.forceBackFacesOnly;
            return shadowGenerator;
        };
        ShadowGenerator._FILTER_NONE = 0;
        ShadowGenerator._FILTER_EXPONENTIALSHADOWMAP = 1;
        ShadowGenerator._FILTER_POISSONSAMPLING = 2;
        ShadowGenerator._FILTER_BLUREXPONENTIALSHADOWMAP = 3;
        ShadowGenerator._FILTER_CLOSEEXPONENTIALSHADOWMAP = 4;
        ShadowGenerator._FILTER_BLURCLOSEEXPONENTIALSHADOWMAP = 5;
        return ShadowGenerator;
    }());
    BABYLON.ShadowGenerator = ShadowGenerator;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.shadowGenerator.js.map
