






var LIB;
(function (LIB) {
    // Inspired by http://http.developer.nvidia.com/GPUGems3/gpugems3_ch13.html
    var VolumetricLightScatteringPostProcess = /** @class */ (function (_super) {
        __extends(VolumetricLightScatteringPostProcess, _super);
        /**
         * @constructor
         * @param {string} name - The post-process name
         * @param {any} ratio - The size of the post-process and/or internal pass (0.5 means that your postprocess will have a width = canvas.width 0.5 and a height = canvas.height 0.5)
         * @param {LIB.Camera} camera - The camera that the post-process will be attached to
         * @param {LIB.Mesh} mesh - The mesh used to create the light scattering
         * @param {number} samples - The post-process quality, default 100
         * @param {number} samplingMode - The post-process filtering mode
         * @param {LIB.Engine} engine - The LIB engine
         * @param {boolean} reusable - If the post-process is reusable
         * @param {LIB.Scene} scene - The constructor needs a scene reference to initialize internal components. If "camera" is null (RenderPipelineà, "scene" must be provided
         */
        function VolumetricLightScatteringPostProcess(name, ratio, camera, mesh, samples, samplingMode, engine, reusable, scene) {
            if (samples === void 0) { samples = 100; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.BILINEAR_SAMPLINGMODE; }
            var _this = _super.call(this, name, "volumetricLightScattering", ["decay", "exposure", "weight", "meshPositionOnScreen", "density"], ["lightScatteringSampler"], ratio.postProcessRatio || ratio, camera, samplingMode, engine, reusable, "#define NUM_SAMPLES " + samples) || this;
            _this._screenCoordinates = LIB.Vector2.Zero();
            /**
            * Custom position of the mesh. Used if "useCustomMeshPosition" is set to "true"
            */
            _this.customMeshPosition = LIB.Vector3.Zero();
            /**
            * Set if the post-process should use a custom position for the light source (true) or the internal mesh position (false)
            */
            _this.useCustomMeshPosition = false;
            /**
            * If the post-process should inverse the light scattering direction
            */
            _this.invert = true;
            /**
            * Array containing the excluded meshes not rendered in the internal pass
            */
            _this.excludedMeshes = new Array();
            /**
            * Controls the overall intensity of the post-process
            */
            _this.exposure = 0.3;
            /**
            * Dissipates each sample's contribution in range [0, 1]
            */
            _this.decay = 0.96815;
            /**
            * Controls the overall intensity of each sample
            */
            _this.weight = 0.58767;
            /**
            * Controls the density of each sample
            */
            _this.density = 0.926;
            scene = ((camera === null) ? scene : camera.getScene()); // parameter "scene" can be null.
            engine = scene.getEngine();
            _this._viewPort = new LIB.Viewport(0, 0, 1, 1).toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
            // Configure mesh
            _this.mesh = ((mesh !== null) ? mesh : VolumetricLightScatteringPostProcess.CreateDefaultMesh("VolumetricLightScatteringMesh", scene));
            // Configure
            _this._createPass(scene, ratio.passRatio || ratio);
            _this.onActivate = function (camera) {
                if (!_this.isSupported) {
                    _this.dispose(camera);
                }
                _this.onActivate = null;
            };
            _this.onApplyObservable.add(function (effect) {
                _this._updateMeshScreenCoordinates(scene);
                effect.setTexture("lightScatteringSampler", _this._volumetricLightScatteringRTT);
                effect.setFloat("exposure", _this.exposure);
                effect.setFloat("decay", _this.decay);
                effect.setFloat("weight", _this.weight);
                effect.setFloat("density", _this.density);
                effect.setVector2("meshPositionOnScreen", _this._screenCoordinates);
            });
            return _this;
        }
        Object.defineProperty(VolumetricLightScatteringPostProcess.prototype, "useDiffuseColor", {
            get: function () {
                LIB.Tools.Warn("VolumetricLightScatteringPostProcess.useDiffuseColor is no longer used, use the mesh material directly instead");
                return false;
            },
            set: function (useDiffuseColor) {
                LIB.Tools.Warn("VolumetricLightScatteringPostProcess.useDiffuseColor is no longer used, use the mesh material directly instead");
            },
            enumerable: true,
            configurable: true
        });
        VolumetricLightScatteringPostProcess.prototype.getClassName = function () {
            return "VolumetricLightScatteringPostProcess";
        };
        VolumetricLightScatteringPostProcess.prototype._isReady = function (subMesh, useInstances) {
            var mesh = subMesh.getMesh();
            // Render this.mesh as default
            if (mesh === this.mesh && mesh.material) {
                return mesh.material.isReady(mesh);
            }
            var defines = [];
            var attribs = [LIB.VertexBuffer.PositionKind];
            var material = subMesh.getMaterial();
            // Alpha test
            if (material) {
                if (material.needAlphaTesting()) {
                    defines.push("#define ALPHATEST");
                }
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
                defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
                defines.push("#define BonesPerMesh " + (mesh.skeleton ? (mesh.skeleton.bones.length + 1) : 0));
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
                this._volumetricLightScatteringPass = mesh.getScene().getEngine().createEffect({ vertexElement: "depth", fragmentElement: "volumetricLightScatteringPass" }, attribs, ["world", "mBones", "viewProjection", "diffuseMatrix"], ["diffuseSampler"], join);
            }
            return this._volumetricLightScatteringPass.isReady();
        };
        /**
         * Sets the new light position for light scattering effect
         * @param {LIB.Vector3} The new custom light position
         */
        VolumetricLightScatteringPostProcess.prototype.setCustomMeshPosition = function (position) {
            this.customMeshPosition = position;
        };
        /**
         * Returns the light position for light scattering effect
         * @return {LIB.Vector3} The custom light position
         */
        VolumetricLightScatteringPostProcess.prototype.getCustomMeshPosition = function () {
            return this.customMeshPosition;
        };
        /**
         * Disposes the internal assets and detaches the post-process from the camera
         */
        VolumetricLightScatteringPostProcess.prototype.dispose = function (camera) {
            var rttIndex = camera.getScene().customRenderTargets.indexOf(this._volumetricLightScatteringRTT);
            if (rttIndex !== -1) {
                camera.getScene().customRenderTargets.splice(rttIndex, 1);
            }
            this._volumetricLightScatteringRTT.dispose();
            _super.prototype.dispose.call(this, camera);
        };
        /**
         * Returns the render target texture used by the post-process
         * @return {LIB.RenderTargetTexture} The render target texture used by the post-process
         */
        VolumetricLightScatteringPostProcess.prototype.getPass = function () {
            return this._volumetricLightScatteringRTT;
        };
        // Private methods
        VolumetricLightScatteringPostProcess.prototype._meshExcluded = function (mesh) {
            if (this.excludedMeshes.length > 0 && this.excludedMeshes.indexOf(mesh) !== -1) {
                return true;
            }
            return false;
        };
        VolumetricLightScatteringPostProcess.prototype._createPass = function (scene, ratio) {
            var _this = this;
            var engine = scene.getEngine();
            this._volumetricLightScatteringRTT = new LIB.RenderTargetTexture("volumetricLightScatteringMap", { width: engine.getRenderWidth() * ratio, height: engine.getRenderHeight() * ratio }, scene, false, true, LIB.Engine.TEXTURETYPE_UNSIGNED_INT);
            this._volumetricLightScatteringRTT.wrapU = LIB.Texture.CLAMP_ADDRESSMODE;
            this._volumetricLightScatteringRTT.wrapV = LIB.Texture.CLAMP_ADDRESSMODE;
            this._volumetricLightScatteringRTT.renderList = null;
            this._volumetricLightScatteringRTT.renderParticles = false;
            this._volumetricLightScatteringRTT.ignoreCameraViewport = true;
            var camera = this.getCamera();
            if (camera) {
                camera.customRenderTargets.push(this._volumetricLightScatteringRTT);
            }
            else {
                scene.customRenderTargets.push(this._volumetricLightScatteringRTT);
            }
            // Custom render function for submeshes
            var renderSubMesh = function (subMesh) {
                var mesh = subMesh.getRenderingMesh();
                if (_this._meshExcluded(mesh)) {
                    return;
                }
                var material = subMesh.getMaterial();
                if (!material) {
                    return;
                }
                var scene = mesh.getScene();
                var engine = scene.getEngine();
                // Culling
                engine.setState(material.backFaceCulling);
                // Managing instances
                var batch = mesh._getInstancesRenderList(subMesh._id);
                if (batch.mustReturn) {
                    return;
                }
                var hardwareInstancedRendering = (engine.getCaps().instancedArrays) && (batch.visibleInstances[subMesh._id] !== null);
                if (_this._isReady(subMesh, hardwareInstancedRendering)) {
                    var effect = _this._volumetricLightScatteringPass;
                    if (mesh === _this.mesh) {
                        if (subMesh.effect) {
                            effect = subMesh.effect;
                        }
                        else {
                            effect = material.getEffect();
                        }
                    }
                    engine.enableEffect(effect);
                    mesh._bind(subMesh, effect, LIB.Material.TriangleFillMode);
                    if (mesh === _this.mesh) {
                        material.bind(mesh.getWorldMatrix(), mesh);
                    }
                    else {
                        _this._volumetricLightScatteringPass.setMatrix("viewProjection", scene.getTransformMatrix());
                        // Alpha test
                        if (material && material.needAlphaTesting()) {
                            var alphaTexture = material.getAlphaTestTexture();
                            _this._volumetricLightScatteringPass.setTexture("diffuseSampler", alphaTexture);
                            if (alphaTexture) {
                                _this._volumetricLightScatteringPass.setMatrix("diffuseMatrix", alphaTexture.getTextureMatrix());
                            }
                        }
                        // Bones
                        if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
                            _this._volumetricLightScatteringPass.setMatrices("mBones", mesh.skeleton.getTransformMatrices(mesh));
                        }
                    }
                    // Draw
                    mesh._processRendering(subMesh, _this._volumetricLightScatteringPass, LIB.Material.TriangleFillMode, batch, hardwareInstancedRendering, function (isInstance, world) { return effect.setMatrix("world", world); });
                }
            };
            // Render target texture callbacks
            var savedSceneClearColor;
            var sceneClearColor = new LIB.Color4(0.0, 0.0, 0.0, 1.0);
            this._volumetricLightScatteringRTT.onBeforeRenderObservable.add(function () {
                savedSceneClearColor = scene.clearColor;
                scene.clearColor = sceneClearColor;
            });
            this._volumetricLightScatteringRTT.onAfterRenderObservable.add(function () {
                scene.clearColor = savedSceneClearColor;
            });
            this._volumetricLightScatteringRTT.customRenderFunction = function (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) {
                var engine = scene.getEngine();
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
                if (transparentSubMeshes.length) {
                    // Sort sub meshes
                    for (index = 0; index < transparentSubMeshes.length; index++) {
                        var submesh = transparentSubMeshes.data[index];
                        var boundingInfo = submesh.getBoundingInfo();
                        if (boundingInfo && scene.activeCamera) {
                            submesh._alphaIndex = submesh.getMesh().alphaIndex;
                            submesh._distanceToCamera = boundingInfo.boundingSphere.centerWorld.subtract(scene.activeCamera.position).length();
                        }
                    }
                    var sortedArray = transparentSubMeshes.data.slice(0, transparentSubMeshes.length);
                    sortedArray.sort(function (a, b) {
                        // Alpha index first
                        if (a._alphaIndex > b._alphaIndex) {
                            return 1;
                        }
                        if (a._alphaIndex < b._alphaIndex) {
                            return -1;
                        }
                        // Then distance to camera
                        if (a._distanceToCamera < b._distanceToCamera) {
                            return 1;
                        }
                        if (a._distanceToCamera > b._distanceToCamera) {
                            return -1;
                        }
                        return 0;
                    });
                    // Render sub meshes
                    engine.setAlphaMode(LIB.Engine.ALPHA_COMBINE);
                    for (index = 0; index < sortedArray.length; index++) {
                        renderSubMesh(sortedArray[index]);
                    }
                    engine.setAlphaMode(LIB.Engine.ALPHA_DISABLE);
                }
            };
        };
        VolumetricLightScatteringPostProcess.prototype._updateMeshScreenCoordinates = function (scene) {
            var transform = scene.getTransformMatrix();
            var meshPosition;
            if (this.useCustomMeshPosition) {
                meshPosition = this.customMeshPosition;
            }
            else if (this.attachedNode) {
                meshPosition = this.attachedNode.position;
            }
            else {
                meshPosition = this.mesh.parent ? this.mesh.getAbsolutePosition() : this.mesh.position;
            }
            var pos = LIB.Vector3.Project(meshPosition, LIB.Matrix.Identity(), transform, this._viewPort);
            this._screenCoordinates.x = pos.x / this._viewPort.width;
            this._screenCoordinates.y = pos.y / this._viewPort.height;
            if (this.invert)
                this._screenCoordinates.y = 1.0 - this._screenCoordinates.y;
        };
        // Static methods
        /**
        * Creates a default mesh for the Volumeric Light Scattering post-process
        * @param {string} The mesh name
        * @param {LIB.Scene} The scene where to create the mesh
        * @return {LIB.Mesh} the default mesh
        */
        VolumetricLightScatteringPostProcess.CreateDefaultMesh = function (name, scene) {
            var mesh = LIB.Mesh.CreatePlane(name, 1, scene);
            mesh.billboardMode = LIB.AbstractMesh.BILLBOARDMODE_ALL;
            var material = new LIB.StandardMaterial(name + "Material", scene);
            material.emissiveColor = new LIB.Color3(1, 1, 1);
            mesh.material = material;
            return mesh;
        };
        __decorate([
            LIB.serializeAsVector3()
        ], VolumetricLightScatteringPostProcess.prototype, "customMeshPosition", void 0);
        __decorate([
            LIB.serialize()
        ], VolumetricLightScatteringPostProcess.prototype, "useCustomMeshPosition", void 0);
        __decorate([
            LIB.serialize()
        ], VolumetricLightScatteringPostProcess.prototype, "invert", void 0);
        __decorate([
            LIB.serializeAsMeshReference()
        ], VolumetricLightScatteringPostProcess.prototype, "mesh", void 0);
        __decorate([
            LIB.serialize()
        ], VolumetricLightScatteringPostProcess.prototype, "excludedMeshes", void 0);
        __decorate([
            LIB.serialize()
        ], VolumetricLightScatteringPostProcess.prototype, "exposure", void 0);
        __decorate([
            LIB.serialize()
        ], VolumetricLightScatteringPostProcess.prototype, "decay", void 0);
        __decorate([
            LIB.serialize()
        ], VolumetricLightScatteringPostProcess.prototype, "weight", void 0);
        __decorate([
            LIB.serialize()
        ], VolumetricLightScatteringPostProcess.prototype, "density", void 0);
        return VolumetricLightScatteringPostProcess;
    }(LIB.PostProcess));
    LIB.VolumetricLightScatteringPostProcess = VolumetricLightScatteringPostProcess;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.volumetricLightScatteringPostProcess.js.map
//# sourceMappingURL=LIB.volumetricLightScatteringPostProcess.js.map
