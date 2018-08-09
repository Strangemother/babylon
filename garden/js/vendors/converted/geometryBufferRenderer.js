(function (LIB) {
    var GeometryBufferRenderer = /** @class */ (function () {
        function GeometryBufferRenderer(scene, ratio) {
            if (ratio === void 0) { ratio = 1; }
            this._enablePosition = false;
            this._scene = scene;
            this._ratio = ratio;
            // Render target
            this._createRenderTargets();
        }
        Object.defineProperty(GeometryBufferRenderer.prototype, "renderList", {
            set: function (meshes) {
                this._multiRenderTarget.renderList = meshes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeometryBufferRenderer.prototype, "isSupported", {
            get: function () {
                return this._multiRenderTarget.isSupported;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeometryBufferRenderer.prototype, "enablePosition", {
            get: function () {
                return this._enablePosition;
            },
            set: function (enable) {
                this._enablePosition = enable;
                this.dispose();
                this._createRenderTargets();
            },
            enumerable: true,
            configurable: true
        });
        GeometryBufferRenderer.prototype.isReady = function (subMesh, useInstances) {
            var material = subMesh.getMaterial();
            if (material && material.disableDepthWrite) {
                return false;
            }
            var defines = [];
            var attribs = [LIB.VertexBuffer.PositionKind, LIB.VertexBuffer.NormalKind];
            var mesh = subMesh.getMesh();
            // Alpha test
            if (material && material.needAlphaTesting()) {
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
            // Buffers
            if (this._enablePosition) {
                defines.push("#define POSITION");
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
                this._effect = this._scene.getEngine().createEffect("geometry", attribs, ["world", "mBones", "viewProjection", "diffuseMatrix", "view"], ["diffuseSampler"], join, undefined, undefined, undefined, { buffersCount: this._enablePosition ? 3 : 2 });
            }
            return this._effect.isReady();
        };
        GeometryBufferRenderer.prototype.getGBuffer = function () {
            return this._multiRenderTarget;
        };
        // Methods
        GeometryBufferRenderer.prototype.dispose = function () {
            this.getGBuffer().dispose();
        };
        GeometryBufferRenderer.prototype._createRenderTargets = function () {
            var _this = this;
            var engine = this._scene.getEngine();
            var count = this._enablePosition ? 3 : 2;
            this._multiRenderTarget = new LIB.MultiRenderTarget("gBuffer", { width: engine.getRenderWidth() * this._ratio, height: engine.getRenderHeight() * this._ratio }, count, this._scene, { generateMipMaps: false, generateDepthTexture: true });
            if (!this.isSupported) {
                return;
            }
            this._multiRenderTarget.wrapU = LIB.Texture.CLAMP_ADDRESSMODE;
            this._multiRenderTarget.wrapV = LIB.Texture.CLAMP_ADDRESSMODE;
            this._multiRenderTarget.refreshRate = 1;
            this._multiRenderTarget.renderParticles = false;
            this._multiRenderTarget.renderList = null;
            // set default depth value to 1.0 (far away)
            this._multiRenderTarget.onClearObservable.add(function (engine) {
                engine.clear(new LIB.Color4(0.0, 0.0, 0.0, 1.0), true, true, true);
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
                // Culling
                engine.setState(material.backFaceCulling, 0, false, scene.useRightHandedSystem);
                // Managing instances
                var batch = mesh._getInstancesRenderList(subMesh._id);
                if (batch.mustReturn) {
                    return;
                }
                var hardwareInstancedRendering = (engine.getCaps().instancedArrays) && (batch.visibleInstances[subMesh._id] !== null);
                if (_this.isReady(subMesh, hardwareInstancedRendering)) {
                    engine.enableEffect(_this._effect);
                    mesh._bind(subMesh, _this._effect, LIB.Material.TriangleFillMode);
                    _this._effect.setMatrix("viewProjection", scene.getTransformMatrix());
                    _this._effect.setMatrix("view", scene.getViewMatrix());
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
            this._multiRenderTarget.customRenderFunction = function (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) {
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
        };
        return GeometryBufferRenderer;
    }());
    LIB.GeometryBufferRenderer = GeometryBufferRenderer;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.geometryBufferRenderer.js.map
