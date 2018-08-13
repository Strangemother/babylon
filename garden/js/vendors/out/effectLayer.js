
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};

var LIB;
(function (LIB) {
    /**
     * The effect layer Helps adding post process effect blended with the main pass.
     *
     * This can be for instance use to generate glow or higlight effects on the scene.
     *
     * The effect layer class can not be used directly and is intented to inherited from to be
     * customized per effects.
     */
    var EffectLayer = /** @class */ (function () {
        /**
         * Instantiates a new effect Layer and references it in the scene.
         * @param name The name of the layer
         * @param scene The scene to use the layer in
         */
        function EffectLayer(
        /** The Friendly of the effect in the scene */
        name, scene) {
            this._vertexBuffers = {};
            this._maxSize = 0;
            this._mainTextureDesiredSize = { width: 0, height: 0 };
            this._shouldRender = true;
            this._postProcesses = [];
            this._textures = [];
            this._emissiveTextureAndColor = { texture: null, color: new LIB.Color4() };
            /**
             * The clear color of the texture used to generate the glow map.
             */
            this.neutralColor = new LIB.Color4();
            /**
             * Specifies wether the highlight layer is enabled or not.
             */
            this.isEnabled = true;
            /**
             * An event triggered when the effect layer has been disposed.
             */
            this.onDisposeObservable = new LIB.Observable();
            /**
             * An event triggered when the effect layer is about rendering the main texture with the glowy parts.
             */
            this.onBeforeRenderMainTextureObservable = new LIB.Observable();
            /**
             * An event triggered when the generated texture is being merged in the scene.
             */
            this.onBeforeComposeObservable = new LIB.Observable();
            /**
             * An event triggered when the generated texture has been merged in the scene.
             */
            this.onAfterComposeObservable = new LIB.Observable();
            /**
             * An event triggered when the efffect layer changes its size.
             */
            this.onSizeChangedObservable = new LIB.Observable();
            this.name = name;
            this._scene = scene || LIB.Engine.LastCreatedScene;
            this._engine = scene.getEngine();
            this._maxSize = this._engine.getCaps().maxTextureSize;
            this._scene.effectLayers.push(this);
            // Generate Buffers
            this._generateIndexBuffer();
            this._genrateVertexBuffer();
        }
        Object.defineProperty(EffectLayer.prototype, "camera", {
            /**
             * Gets the camera attached to the layer.
             */
            get: function () {
                return this._effectLayerOptions.camera;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Initializes the effect layer with the required options.
         * @param options Sets of none mandatory options to use with the layer (see IEffectLayerOptions for more information)
         */
        EffectLayer.prototype._init = function (options) {
            // Adapt options
            this._effectLayerOptions = __assign({ mainTextureRatio: 0.5, alphaBlendingMode: LIB.Engine.ALPHA_COMBINE, camera: null }, options);
            this._setMainTextureSize();
            this._createMainTexture();
            this._createTextureAndPostProcesses();
            this._mergeEffect = this._createMergeEffect();
        };
        /**
         * Generates the index buffer of the full screen quad blending to the main canvas.
         */
        EffectLayer.prototype._generateIndexBuffer = function () {
            // Indices
            var indices = [];
            indices.push(0);
            indices.push(1);
            indices.push(2);
            indices.push(0);
            indices.push(2);
            indices.push(3);
            this._indexBuffer = this._engine.createIndexBuffer(indices);
        };
        /**
         * Generates the vertex buffer of the full screen quad blending to the main canvas.
         */
        EffectLayer.prototype._genrateVertexBuffer = function () {
            // VBO
            var vertices = [];
            vertices.push(1, 1);
            vertices.push(-1, 1);
            vertices.push(-1, -1);
            vertices.push(1, -1);
            var vertexBuffer = new LIB.VertexBuffer(this._engine, vertices, LIB.VertexBuffer.PositionKind, false, false, 2);
            this._vertexBuffers[LIB.VertexBuffer.PositionKind] = vertexBuffer;
        };
        /**
         * Sets the main texture desired size which is the closest power of two
         * of the engine canvas size.
         */
        EffectLayer.prototype._setMainTextureSize = function () {
            if (this._effectLayerOptions.mainTextureFixedSize) {
                this._mainTextureDesiredSize.width = this._effectLayerOptions.mainTextureFixedSize;
                this._mainTextureDesiredSize.height = this._effectLayerOptions.mainTextureFixedSize;
            }
            else {
                this._mainTextureDesiredSize.width = this._engine.getRenderWidth() * this._effectLayerOptions.mainTextureRatio;
                this._mainTextureDesiredSize.height = this._engine.getRenderHeight() * this._effectLayerOptions.mainTextureRatio;
                this._mainTextureDesiredSize.width = this._engine.needPOTTextures ? LIB.Tools.GetExponentOfTwo(this._mainTextureDesiredSize.width, this._maxSize) : this._mainTextureDesiredSize.width;
                this._mainTextureDesiredSize.height = this._engine.needPOTTextures ? LIB.Tools.GetExponentOfTwo(this._mainTextureDesiredSize.height, this._maxSize) : this._mainTextureDesiredSize.height;
            }
            this._mainTextureDesiredSize.width = Math.floor(this._mainTextureDesiredSize.width);
            this._mainTextureDesiredSize.height = Math.floor(this._mainTextureDesiredSize.height);
        };
        /**
         * Creates the main texture for the effect layer.
         */
        EffectLayer.prototype._createMainTexture = function () {
            var _this = this;
            this._mainTexture = new LIB.RenderTargetTexture("HighlightLayerMainRTT", {
                width: this._mainTextureDesiredSize.width,
                height: this._mainTextureDesiredSize.height
            }, this._scene, false, true, LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            this._mainTexture.activeCamera = this._effectLayerOptions.camera;
            this._mainTexture.wrapU = LIB.Texture.CLAMP_ADDRESSMODE;
            this._mainTexture.wrapV = LIB.Texture.CLAMP_ADDRESSMODE;
            this._mainTexture.anisotropicFilteringLevel = 1;
            this._mainTexture.updateSamplingMode(LIB.Texture.BILINEAR_SAMPLINGMODE);
            this._mainTexture.renderParticles = false;
            this._mainTexture.renderList = null;
            this._mainTexture.ignoreCameraViewport = true;
            // Custom render function
            this._mainTexture.customRenderFunction = function (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) {
                _this.onBeforeRenderMainTextureObservable.notifyObservers(_this);
                var index;
                var engine = _this._scene.getEngine();
                if (depthOnlySubMeshes.length) {
                    engine.setColorWrite(false);
                    for (index = 0; index < depthOnlySubMeshes.length; index++) {
                        _this._renderSubMesh(depthOnlySubMeshes.data[index]);
                    }
                    engine.setColorWrite(true);
                }
                for (index = 0; index < opaqueSubMeshes.length; index++) {
                    _this._renderSubMesh(opaqueSubMeshes.data[index]);
                }
                for (index = 0; index < alphaTestSubMeshes.length; index++) {
                    _this._renderSubMesh(alphaTestSubMeshes.data[index]);
                }
                for (index = 0; index < transparentSubMeshes.length; index++) {
                    _this._renderSubMesh(transparentSubMeshes.data[index]);
                }
            };
            this._mainTexture.onClearObservable.add(function (engine) {
                engine.clear(_this.neutralColor, true, true, true);
            });
        };
        /**
         * Checks for the readiness of the element composing the layer.
         * @param subMesh the mesh to check for
         * @param useInstances specify wether or not to use instances to render the mesh
         * @param emissiveTexture the associated emissive texture used to generate the glow
         * @return true if ready otherwise, false
         */
        EffectLayer.prototype._isReady = function (subMesh, useInstances, emissiveTexture) {
            var material = subMesh.getMaterial();
            if (!material) {
                return false;
            }
            if (!material.isReady(subMesh.getMesh(), useInstances)) {
                return false;
            }
            var defines = [];
            var attribs = [LIB.VertexBuffer.PositionKind];
            var mesh = subMesh.getMesh();
            var uv1 = false;
            var uv2 = false;
            // Alpha test
            if (material && material.needAlphaTesting()) {
                var alphaTexture = material.getAlphaTestTexture();
                if (alphaTexture) {
                    defines.push("#define ALPHATEST");
                    if (mesh.isVerticesDataPresent(LIB.VertexBuffer.UV2Kind) &&
                        alphaTexture.coordinatesIndex === 1) {
                        defines.push("#define DIFFUSEUV2");
                        uv2 = true;
                    }
                    else if (mesh.isVerticesDataPresent(LIB.VertexBuffer.UVKind)) {
                        defines.push("#define DIFFUSEUV1");
                        uv1 = true;
                    }
                }
            }
            // Emissive
            if (emissiveTexture) {
                defines.push("#define EMISSIVE");
                if (mesh.isVerticesDataPresent(LIB.VertexBuffer.UV2Kind) &&
                    emissiveTexture.coordinatesIndex === 1) {
                    defines.push("#define EMISSIVEUV2");
                    uv2 = true;
                }
                else if (mesh.isVerticesDataPresent(LIB.VertexBuffer.UVKind)) {
                    defines.push("#define EMISSIVEUV1");
                    uv1 = true;
                }
            }
            if (uv1) {
                attribs.push(LIB.VertexBuffer.UVKind);
                defines.push("#define UV1");
            }
            if (uv2) {
                attribs.push(LIB.VertexBuffer.UV2Kind);
                defines.push("#define UV2");
            }
            // Bones
            if (mesh.useBones && mesh.computeBonesUsingShaders) {
                attribs.push(LIB.VertexBuffer.MatricesIndicesKind);
                attribs.push(LIB.VertexBuffer.MatricesWeightsKind);
                if (mesh.numBoneInfluencers > 4) {
                    attribs.push(LIB.VertexBuffer.MatricesIndicesExtraKind);
                    attribs.push(LIB.VertexBuffer.MatricesWeightsExtraKind);
                }
                defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
                defines.push("#define BonesPerMesh " + (mesh.skeleton ? (mesh.skeleton.bones.length + 1) : 0));
            }
            else {
                defines.push("#define NUM_BONE_INFLUENCERS 0");
            }
            // Morph targets         
            var manager = mesh.morphTargetManager;
            var morphInfluencers = 0;
            if (manager) {
                if (manager.numInfluencers > 0) {
                    defines.push("#define MORPHTARGETS");
                    morphInfluencers = manager.numInfluencers;
                    defines.push("#define NUM_MORPH_INFLUENCERS " + morphInfluencers);
                    LIB.MaterialHelper.PrepareAttributesForMorphTargets(attribs, mesh, { "NUM_MORPH_INFLUENCERS": morphInfluencers });
                }
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
                this._effectLayerMapGenerationEffect = this._scene.getEngine().createEffect("glowMapGeneration", attribs, ["world", "mBones", "viewProjection", "diffuseMatrix", "color", "emissiveMatrix", "morphTargetInfluences"], ["diffuseSampler", "emissiveSampler"], join, undefined, undefined, undefined, { maxSimultaneousMorphTargets: morphInfluencers });
            }
            return this._effectLayerMapGenerationEffect.isReady();
        };
        /**
         * Renders the glowing part of the scene by blending the blurred glowing meshes on top of the rendered scene.
         */
        EffectLayer.prototype.render = function () {
            var currentEffect = this._mergeEffect;
            // Check
            if (!currentEffect.isReady())
                return;
            for (var i = 0; i < this._postProcesses.length; i++) {
                if (!this._postProcesses[i].isReady()) {
                    return;
                }
            }
            var engine = this._scene.getEngine();
            this.onBeforeComposeObservable.notifyObservers(this);
            // Render
            engine.enableEffect(currentEffect);
            engine.setState(false);
            // VBOs
            engine.bindBuffers(this._vertexBuffers, this._indexBuffer, currentEffect);
            // Cache
            var previousAlphaMode = engine.getAlphaMode();
            // Go Blend.
            engine.setAlphaMode(this._effectLayerOptions.alphaBlendingMode);
            // Blends the map on the main canvas.
            this._internalRender(currentEffect);
            // Restore Alpha
            engine.setAlphaMode(previousAlphaMode);
            this.onAfterComposeObservable.notifyObservers(this);
            // Handle size changes.
            var size = this._mainTexture.getSize();
            this._setMainTextureSize();
            if (size.width !== this._mainTextureDesiredSize.width || size.height !== this._mainTextureDesiredSize.height) {
                // Recreate RTT and post processes on size change.
                this.onSizeChangedObservable.notifyObservers(this);
                this._disposeTextureAndPostProcesses();
                this._createMainTexture();
                this._createTextureAndPostProcesses();
            }
        };
        /**
         * Determine if a given mesh will be used in the current effect.
         * @param mesh mesh to test
         * @returns true if the mesh will be used
         */
        EffectLayer.prototype.hasMesh = function (mesh) {
            return true;
        };
        /**
         * Returns true if the layer contains information to display, otherwise false.
         * @returns true if the glow layer should be rendered
         */
        EffectLayer.prototype.shouldRender = function () {
            return this.isEnabled && this._shouldRender;
        };
        /**
         * Returns true if the mesh should render, otherwise false.
         * @param mesh The mesh to render
         * @returns true if it should render otherwise false
         */
        EffectLayer.prototype._shouldRenderMesh = function (mesh) {
            return true;
        };
        /**
         * Returns true if the mesh should render, otherwise false.
         * @param mesh The mesh to render
         * @returns true if it should render otherwise false
         */
        EffectLayer.prototype._shouldRenderEmissiveTextureForMesh = function (mesh) {
            return true;
        };
        /**
         * Renders the submesh passed in parameter to the generation map.
         */
        EffectLayer.prototype._renderSubMesh = function (subMesh) {
            var _this = this;
            if (!this.shouldRender()) {
                return;
            }
            var material = subMesh.getMaterial();
            var mesh = subMesh.getRenderingMesh();
            var scene = this._scene;
            var engine = scene.getEngine();
            if (!material) {
                return;
            }
            // Do not block in blend mode.
            if (material.needAlphaBlendingForMesh(mesh)) {
                return;
            }
            // Culling
            engine.setState(material.backFaceCulling);
            // Managing instances
            var batch = mesh._getInstancesRenderList(subMesh._id);
            if (batch.mustReturn) {
                return;
            }
            // Early Exit per mesh
            if (!this._shouldRenderMesh(mesh)) {
                return;
            }
            var hardwareInstancedRendering = (engine.getCaps().instancedArrays) && (batch.visibleInstances[subMesh._id] !== null) && (batch.visibleInstances[subMesh._id] !== undefined);
            this._setEmissiveTextureAndColor(mesh, subMesh, material);
            if (this._isReady(subMesh, hardwareInstancedRendering, this._emissiveTextureAndColor.texture)) {
                engine.enableEffect(this._effectLayerMapGenerationEffect);
                mesh._bind(subMesh, this._effectLayerMapGenerationEffect, LIB.Material.TriangleFillMode);
                this._effectLayerMapGenerationEffect.setMatrix("viewProjection", scene.getTransformMatrix());
                this._effectLayerMapGenerationEffect.setFloat4("color", this._emissiveTextureAndColor.color.r, this._emissiveTextureAndColor.color.g, this._emissiveTextureAndColor.color.b, this._emissiveTextureAndColor.color.a);
                // Alpha test
                if (material && material.needAlphaTesting()) {
                    var alphaTexture = material.getAlphaTestTexture();
                    if (alphaTexture) {
                        this._effectLayerMapGenerationEffect.setTexture("diffuseSampler", alphaTexture);
                        var textureMatrix = alphaTexture.getTextureMatrix();
                        if (textureMatrix) {
                            this._effectLayerMapGenerationEffect.setMatrix("diffuseMatrix", textureMatrix);
                        }
                    }
                }
                // Glow emissive only
                if (this._emissiveTextureAndColor.texture) {
                    this._effectLayerMapGenerationEffect.setTexture("emissiveSampler", this._emissiveTextureAndColor.texture);
                    this._effectLayerMapGenerationEffect.setMatrix("emissiveMatrix", this._emissiveTextureAndColor.texture.getTextureMatrix());
                }
                // Bones
                if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
                    this._effectLayerMapGenerationEffect.setMatrices("mBones", mesh.skeleton.getTransformMatrices(mesh));
                }
                // Morph targets
                LIB.MaterialHelper.BindMorphTargetParameters(mesh, this._effectLayerMapGenerationEffect);
                // Draw
                mesh._processRendering(subMesh, this._effectLayerMapGenerationEffect, LIB.Material.TriangleFillMode, batch, hardwareInstancedRendering, function (isInstance, world) { return _this._effectLayerMapGenerationEffect.setMatrix("world", world); });
            }
            else {
                // Need to reset refresh rate of the shadowMap
                this._mainTexture.resetRefreshCounter();
            }
        };
        /**
         * Rebuild the required buffers.
         * @hidden Internal use only.
         */
        EffectLayer.prototype._rebuild = function () {
            var vb = this._vertexBuffers[LIB.VertexBuffer.PositionKind];
            if (vb) {
                vb._rebuild();
            }
            this._generateIndexBuffer();
        };
        /**
         * Dispose only the render target textures and post process.
         */
        EffectLayer.prototype._disposeTextureAndPostProcesses = function () {
            this._mainTexture.dispose();
            for (var i = 0; i < this._postProcesses.length; i++) {
                if (this._postProcesses[i]) {
                    this._postProcesses[i].dispose();
                }
            }
            this._postProcesses = [];
            for (var i = 0; i < this._textures.length; i++) {
                if (this._textures[i]) {
                    this._textures[i].dispose();
                }
            }
            this._textures = [];
        };
        /**
         * Dispose the highlight layer and free resources.
         */
        EffectLayer.prototype.dispose = function () {
            var vertexBuffer = this._vertexBuffers[LIB.VertexBuffer.PositionKind];
            if (vertexBuffer) {
                vertexBuffer.dispose();
                this._vertexBuffers[LIB.VertexBuffer.PositionKind] = null;
            }
            if (this._indexBuffer) {
                this._scene.getEngine()._releaseBuffer(this._indexBuffer);
                this._indexBuffer = null;
            }
            // Clean textures and post processes
            this._disposeTextureAndPostProcesses();
            // Remove from scene
            var index = this._scene.effectLayers.indexOf(this, 0);
            if (index > -1) {
                this._scene.effectLayers.splice(index, 1);
            }
            // Callback
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
            this.onBeforeRenderMainTextureObservable.clear();
            this.onBeforeComposeObservable.clear();
            this.onAfterComposeObservable.clear();
            this.onSizeChangedObservable.clear();
        };
        /**
          * Gets the class name of the effect layer
          * @returns the string with the class name of the effect layer
          */
        EffectLayer.prototype.getClassName = function () {
            return "EffectLayer";
        };
        /**
         * Creates an effect layer from parsed effect layer data
         * @param parsedEffectLayer defines effect layer data
         * @param scene defines the current scene
         * @param rootUrl defines the root URL containing the effect layer information
         * @returns a parsed effect Layer
         */
        EffectLayer.Parse = function (parsedEffectLayer, scene, rootUrl) {
            var effectLayerType = LIB.Tools.Instantiate(parsedEffectLayer.customType);
            return effectLayerType.Parse(parsedEffectLayer, scene, rootUrl);
        };
        __decorate([
            LIB.serialize()
        ], EffectLayer.prototype, "name", void 0);
        __decorate([
            LIB.serializeAsColor4()
        ], EffectLayer.prototype, "neutralColor", void 0);
        __decorate([
            LIB.serialize()
        ], EffectLayer.prototype, "isEnabled", void 0);
        __decorate([
            LIB.serializeAsCameraReference()
        ], EffectLayer.prototype, "camera", null);
        return EffectLayer;
    }());
    LIB.EffectLayer = EffectLayer;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.effectLayer.js.map
//# sourceMappingURL=LIB.effectLayer.js.map
