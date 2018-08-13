
var LIB;
(function (LIB) {
    var OutlineRenderer = /** @class */ (function () {
        function OutlineRenderer(scene) {
            this.zOffset = 1;
            this._scene = scene;
        }
        OutlineRenderer.prototype.render = function (subMesh, batch, useOverlay) {
            var _this = this;
            if (useOverlay === void 0) { useOverlay = false; }
            var scene = this._scene;
            var engine = this._scene.getEngine();
            var hardwareInstancedRendering = (engine.getCaps().instancedArrays) && (batch.visibleInstances[subMesh._id] !== null) && (batch.visibleInstances[subMesh._id] !== undefined);
            if (!this.isReady(subMesh, hardwareInstancedRendering)) {
                return;
            }
            var mesh = subMesh.getRenderingMesh();
            var material = subMesh.getMaterial();
            if (!material || !scene.activeCamera) {
                return;
            }
            engine.enableEffect(this._effect);
            // Logarithmic depth
            if (material.useLogarithmicDepth) {
                this._effect.setFloat("logarithmicDepthConstant", 2.0 / (Math.log(scene.activeCamera.maxZ + 1.0) / Math.LN2));
            }
            this._effect.setFloat("offset", useOverlay ? 0 : mesh.outlineWidth);
            this._effect.setColor4("color", useOverlay ? mesh.overlayColor : mesh.outlineColor, useOverlay ? mesh.overlayAlpha : material.alpha);
            this._effect.setMatrix("viewProjection", scene.getTransformMatrix());
            // Bones
            if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
                this._effect.setMatrices("mBones", mesh.skeleton.getTransformMatrices(mesh));
            }
            mesh._bind(subMesh, this._effect, LIB.Material.TriangleFillMode);
            // Alpha test
            if (material && material.needAlphaTesting()) {
                var alphaTexture = material.getAlphaTestTexture();
                if (alphaTexture) {
                    this._effect.setTexture("diffuseSampler", alphaTexture);
                    this._effect.setMatrix("diffuseMatrix", alphaTexture.getTextureMatrix());
                }
            }
            engine.setZOffset(-this.zOffset);
            mesh._processRendering(subMesh, this._effect, LIB.Material.TriangleFillMode, batch, hardwareInstancedRendering, function (isInstance, world) { _this._effect.setMatrix("world", world); });
            engine.setZOffset(0);
        };
        OutlineRenderer.prototype.isReady = function (subMesh, useInstances) {
            var defines = [];
            var attribs = [LIB.VertexBuffer.PositionKind, LIB.VertexBuffer.NormalKind];
            var mesh = subMesh.getMesh();
            var material = subMesh.getMaterial();
            if (material) {
                // Alpha test
                if (material.needAlphaTesting()) {
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
                //Logarithmic depth
                if (material.useLogarithmicDepth) {
                    defines.push("#define LOGARITHMICDEPTH");
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
                this._effect = this._scene.getEngine().createEffect("outline", attribs, ["world", "mBones", "viewProjection", "diffuseMatrix", "offset", "color", "logarithmicDepthConstant"], ["diffuseSampler"], join);
            }
            return this._effect.isReady();
        };
        return OutlineRenderer;
    }());
    LIB.OutlineRenderer = OutlineRenderer;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.outlineRenderer.js.map
//# sourceMappingURL=LIB.outlineRenderer.js.map
