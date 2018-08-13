
var LIB;
(function (LIB) {
    /**
     * This represents a depth renderer in LIB.
     * A depth renderer will render to it's depth map every frame which can be displayed or used in post processing
     */
    var DepthRenderer = /** @class */ (function () {
        /**
         * Instantiates a depth renderer
         * @param scene The scene the renderer belongs to
         * @param type The texture type of the depth map (default: Engine.TEXTURETYPE_FLOAT)
         * @param camera The camera to be used to render the depth map (default: scene's active camera)
         */
        function DepthRenderer(scene, type, camera) {
            if (type === void 0) { type = LIB.Engine.TEXTURETYPE_FLOAT; }
            if (camera === void 0) { camera = null; }
            var _this = this;
            this._scene = scene;
            this._camera = camera;
            var engine = scene.getEngine();
            // Render target
            this._depthMap = new LIB.RenderTargetTexture("depthMap", { width: engine.getRenderWidth(), height: engine.getRenderHeight() }, this._scene, false, true, type);
            this._depthMap.wrapU = LIB.Texture.CLAMP_ADDRESSMODE;
            this._depthMap.wrapV = LIB.Texture.CLAMP_ADDRESSMODE;
            this._depthMap.refreshRate = 1;
            this._depthMap.renderParticles = false;
            this._depthMap.renderList = null;
            // Camera to get depth map from to support multiple concurrent cameras
            this._depthMap.activeCamera = this._camera;
            this._depthMap.ignoreCameraViewport = true;
            this._depthMap.useCameraPostProcesses = false;
            // set default depth value to 1.0 (far away)
            this._depthMap.onClearObservable.add(function (engine) {
                engine.clear(new LIB.Color4(1.0, 1.0, 1.0, 1.0), true, true, true);
            });
            // Custom render function
            var renderSubMesh = function (subMesh) {
                var mesh = subMesh.getRenderingMesh();
                var scene = _this._scene;
                var engine = scene.getEngine();
                var material = subMesh.getMaterial();
                if (!material) {
                    return;
                }
                // Culling and reverse (right handed system)
                engine.setState(material.backFaceCulling, 0, false, scene.useRightHandedSystem);
                // Managing instances
                var batch = mesh._getInstancesRenderList(subMesh._id);
                if (batch.mustReturn) {
                    return;
                }
                var hardwareInstancedRendering = (engine.getCaps().instancedArrays) && (batch.visibleInstances[subMesh._id] !== null);
                var camera = _this._camera || scene.activeCamera;
                if (_this.isReady(subMesh, hardwareInstancedRendering) && camera) {
                    engine.enableEffect(_this._effect);
                    mesh._bind(subMesh, _this._effect, LIB.Material.TriangleFillMode);
                    _this._effect.setMatrix("viewProjection", scene.getTransformMatrix());
                    _this._effect.setFloat2("depthValues", camera.minZ, camera.minZ + camera.maxZ);
                    // Alpha test
                    if (material && material.needAlphaTesting()) {
                        var alphaTexture = material.getAlphaTestTexture();
                        if (alphaTexture) {
                            _this._effect.setTexture("diffuseSampler", alphaTexture);
                            _this._effect.setMatrix("diffuseMatrix", alphaTexture.getTextureMatrix());
                        }
                    }
                    // Bones
                    if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
                        _this._effect.setMatrices("mBones", mesh.skeleton.getTransformMatrices(mesh));
                    }
                    // Draw
                    mesh._processRendering(subMesh, _this._effect, LIB.Material.TriangleFillMode, batch, hardwareInstancedRendering, function (isInstance, world) { return _this._effect.setMatrix("world", world); });
                }
            };
            this._depthMap.customRenderFunction = function (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) {
                var index;
                if (depthOnlySubMeshes.length) {
                    engine.setColorWrite(false);
                    for (index = 0; index < depthOnlySubMeshes.length; index++) {
                        renderSubMesh(depthOnlySubMeshes.data[index]);
                    }
                    engine.setColorWrite(true);
                }
                for (index = 0; index < opaqueSubMeshes.length; index++) {
                    renderSubMesh(opaqueSubMeshes.data[index]);
                }
                for (index = 0; index < alphaTestSubMeshes.length; index++) {
                    renderSubMesh(alphaTestSubMeshes.data[index]);
                }
            };
        }
        /**
         * Creates the depth rendering effect and checks if the effect is ready.
         * @param subMesh The submesh to be used to render the depth map of
         * @param useInstances If multiple world instances should be used
         * @returns if the depth renderer is ready to render the depth map
         */
        DepthRenderer.prototype.isReady = function (subMesh, useInstances) {
            var material = subMesh.getMaterial();
            if (material.disableDepthWrite) {
                return false;
            }
            var defines = [];
            var attribs = [LIB.VertexBuffer.PositionKind];
            var mesh = subMesh.getMesh();
            // Alpha test
            if (material && material.needAlphaTesting() && material.getAlphaTestTexture()) {
                defines.push("#define ALPHATEST");
                if (mesh.isVerticesDataPresent(LIB.VertexBuffer.UVKind)) {
                    attribs.push(LIB.VertexBuffer.UVKind);
                    defines.push("#define UV1");
                }
                if (mesh.isVerticesDataPresent(LIB.VertexBuffer.UV2Kind)) {
                    attribs.push(LIB.VertexBuffer.UV2Kind);
                    defines.push("#define UV2");
                }
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
                defines.push("#define BonesPerMesh " + (mesh.skeleton ? mesh.skeleton.bones.length + 1 : 0));
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
                this._effect = this._scene.getEngine().createEffect("depth", attribs, ["world", "mBones", "viewProjection", "diffuseMatrix", "depthValues"], ["diffuseSampler"], join);
            }
            return this._effect.isReady();
        };
        /**
         * Gets the texture which the depth map will be written to.
         * @returns The depth map texture
         */
        DepthRenderer.prototype.getDepthMap = function () {
            return this._depthMap;
        };
        /**
         * Disposes of the depth renderer.
         */
        DepthRenderer.prototype.dispose = function () {
            this._depthMap.dispose();
        };
        return DepthRenderer;
    }());
    LIB.DepthRenderer = DepthRenderer;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.depthRenderer.js.map
//# sourceMappingURL=LIB.depthRenderer.js.map
