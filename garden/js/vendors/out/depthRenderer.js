var BABYLON;
(function (BABYLON) {
    var DepthRenderer = /** @class */ (function () {
        function DepthRenderer(scene, type) {
            if (type === void 0) { type = BABYLON.Engine.TEXTURETYPE_FLOAT; }
            var _this = this;
            this._scene = scene;
            var engine = scene.getEngine();
            // Render target
            this._depthMap = new BABYLON.RenderTargetTexture("depthMap", { width: engine.getRenderWidth(), height: engine.getRenderHeight() }, this._scene, false, true, type);
            this._depthMap.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
            this._depthMap.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
            this._depthMap.refreshRate = 1;
            this._depthMap.renderParticles = false;
            this._depthMap.renderList = null;
            // set default depth value to 1.0 (far away)
            this._depthMap.onClearObservable.add(function (engine) {
                engine.clear(new BABYLON.Color4(1.0, 1.0, 1.0, 1.0), true, true, true);
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
                if (_this.isReady(subMesh, hardwareInstancedRendering) && scene.activeCamera) {
                    engine.enableEffect(_this._effect);
                    mesh._bind(subMesh, _this._effect, BABYLON.Material.TriangleFillMode);
                    _this._effect.setMatrix("viewProjection", scene.getTransformMatrix());
                    _this._effect.setFloat2("depthValues", scene.activeCamera.minZ, scene.activeCamera.minZ + scene.activeCamera.maxZ);
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
                    mesh._processRendering(subMesh, _this._effect, BABYLON.Material.TriangleFillMode, batch, hardwareInstancedRendering, function (isInstance, world) { return _this._effect.setMatrix("world", world); });
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
        DepthRenderer.prototype.isReady = function (subMesh, useInstances) {
            var material = subMesh.getMaterial();
            if (material.disableDepthWrite) {
                return false;
            }
            var defines = [];
            var attribs = [BABYLON.VertexBuffer.PositionKind];
            var mesh = subMesh.getMesh();
            // Alpha test
            if (material && material.needAlphaTesting()) {
                defines.push("#define ALPHATEST");
                if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.UVKind)) {
                    attribs.push(BABYLON.VertexBuffer.UVKind);
                    defines.push("#define UV1");
                }
                if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.UV2Kind)) {
                    attribs.push(BABYLON.VertexBuffer.UV2Kind);
                    defines.push("#define UV2");
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
        DepthRenderer.prototype.getDepthMap = function () {
            return this._depthMap;
        };
        // Methods
        DepthRenderer.prototype.dispose = function () {
            this._depthMap.dispose();
        };
        return DepthRenderer;
    }());
    BABYLON.DepthRenderer = DepthRenderer;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.depthRenderer.js.map
