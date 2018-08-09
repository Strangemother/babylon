var BABYLON;
(function (BABYLON) {
    var MaterialDefines = /** @class */ (function () {
        function MaterialDefines() {
            this._isDirty = true;
            this._areLightsDirty = true;
            this._areAttributesDirty = true;
            this._areTexturesDirty = true;
            this._areFresnelDirty = true;
            this._areMiscDirty = true;
            this._areImageProcessingDirty = true;
            this._normals = false;
            this._uvs = false;
            this._needNormals = false;
            this._needUVs = false;
        }
        Object.defineProperty(MaterialDefines.prototype, "isDirty", {
            get: function () {
                return this._isDirty;
            },
            enumerable: true,
            configurable: true
        });
        MaterialDefines.prototype.markAsProcessed = function () {
            this._isDirty = false;
            this._areAttributesDirty = false;
            this._areTexturesDirty = false;
            this._areFresnelDirty = false;
            this._areLightsDirty = false;
            this._areMiscDirty = false;
            this._areImageProcessingDirty = false;
        };
        MaterialDefines.prototype.markAsUnprocessed = function () {
            this._isDirty = true;
        };
        MaterialDefines.prototype.markAllAsDirty = function () {
            this._areTexturesDirty = true;
            this._areAttributesDirty = true;
            this._areLightsDirty = true;
            this._areFresnelDirty = true;
            this._areMiscDirty = true;
            this._areImageProcessingDirty = true;
            this._isDirty = true;
        };
        MaterialDefines.prototype.markAsImageProcessingDirty = function () {
            this._areImageProcessingDirty = true;
            this._isDirty = true;
        };
        MaterialDefines.prototype.markAsLightDirty = function () {
            this._areLightsDirty = true;
            this._isDirty = true;
        };
        MaterialDefines.prototype.markAsAttributesDirty = function () {
            this._areAttributesDirty = true;
            this._isDirty = true;
        };
        MaterialDefines.prototype.markAsTexturesDirty = function () {
            this._areTexturesDirty = true;
            this._isDirty = true;
        };
        MaterialDefines.prototype.markAsFresnelDirty = function () {
            this._areFresnelDirty = true;
            this._isDirty = true;
        };
        MaterialDefines.prototype.markAsMiscDirty = function () {
            this._areMiscDirty = true;
            this._isDirty = true;
        };
        MaterialDefines.prototype.rebuild = function () {
            if (this._keys) {
                delete this._keys;
            }
            this._keys = [];
            for (var _i = 0, _a = Object.keys(this); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key[0] === "_") {
                    continue;
                }
                this._keys.push(key);
            }
        };
        MaterialDefines.prototype.isEqual = function (other) {
            if (this._keys.length !== other._keys.length) {
                return false;
            }
            for (var index = 0; index < this._keys.length; index++) {
                var prop = this._keys[index];
                if (this[prop] !== other[prop]) {
                    return false;
                }
            }
            return true;
        };
        MaterialDefines.prototype.cloneTo = function (other) {
            if (this._keys.length !== other._keys.length) {
                other._keys = this._keys.slice(0);
            }
            for (var index = 0; index < this._keys.length; index++) {
                var prop = this._keys[index];
                other[prop] = this[prop];
            }
        };
        MaterialDefines.prototype.reset = function () {
            for (var index = 0; index < this._keys.length; index++) {
                var prop = this._keys[index];
                if (typeof (this[prop]) === "number") {
                    this[prop] = 0;
                }
                else {
                    this[prop] = false;
                }
            }
        };
        MaterialDefines.prototype.toString = function () {
            var result = "";
            for (var index = 0; index < this._keys.length; index++) {
                var prop = this._keys[index];
                var value = this[prop];
                if (typeof (value) === "number") {
                    result += "#define " + prop + " " + this[prop] + "\n";
                }
                else if (value) {
                    result += "#define " + prop + "\n";
                }
            }
            return result;
        };
        return MaterialDefines;
    }());
    BABYLON.MaterialDefines = MaterialDefines;
    var Material = /** @class */ (function () {
        function Material(name, scene, doNotAdd) {
            this.checkReadyOnEveryCall = false;
            this.checkReadyOnlyOnce = false;
            this.state = "";
            this.alpha = 1.0;
            this._backFaceCulling = true;
            this.doNotSerialize = false;
            this.storeEffectOnSubMeshes = false;
            /**
            * An event triggered when the material is disposed.
            * @type {BABYLON.Observable}
            */
            this.onDisposeObservable = new BABYLON.Observable();
            /**
            * An event triggered when the material is bound.
            * @type {BABYLON.Observable}
            */
            this.onBindObservable = new BABYLON.Observable();
            /**
            * An event triggered when the material is unbound.
            * @type {BABYLON.Observable}
            */
            this.onUnBindObservable = new BABYLON.Observable();
            this._alphaMode = BABYLON.Engine.ALPHA_COMBINE;
            this._needDepthPrePass = false;
            this.disableDepthWrite = false;
            this.forceDepthWrite = false;
            this.separateCullingPass = false;
            this._fogEnabled = true;
            this.pointSize = 1.0;
            this.zOffset = 0;
            this._wasPreviouslyReady = false;
            this._fillMode = Material.TriangleFillMode;
            this.name = name;
            this.id = name || BABYLON.Tools.RandomId();
            this._scene = scene || BABYLON.Engine.LastCreatedScene;
            if (this._scene.useRightHandedSystem) {
                this.sideOrientation = Material.ClockWiseSideOrientation;
            }
            else {
                this.sideOrientation = Material.CounterClockWiseSideOrientation;
            }
            this._uniformBuffer = new BABYLON.UniformBuffer(this._scene.getEngine());
            this._useUBO = this.getScene().getEngine().supportsUniformBuffers;
            if (!doNotAdd) {
                this._scene.materials.push(this);
            }
        }
        Object.defineProperty(Material, "TriangleFillMode", {
            get: function () {
                return Material._TriangleFillMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "WireFrameFillMode", {
            get: function () {
                return Material._WireFrameFillMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "PointFillMode", {
            get: function () {
                return Material._PointFillMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "PointListDrawMode", {
            get: function () {
                return Material._PointListDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "LineListDrawMode", {
            get: function () {
                return Material._LineListDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "LineLoopDrawMode", {
            get: function () {
                return Material._LineLoopDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "LineStripDrawMode", {
            get: function () {
                return Material._LineStripDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "TriangleStripDrawMode", {
            get: function () {
                return Material._TriangleStripDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "TriangleFanDrawMode", {
            get: function () {
                return Material._TriangleFanDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "ClockWiseSideOrientation", {
            get: function () {
                return Material._ClockWiseSideOrientation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "CounterClockWiseSideOrientation", {
            get: function () {
                return Material._CounterClockWiseSideOrientation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "TextureDirtyFlag", {
            get: function () {
                return Material._TextureDirtyFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "LightDirtyFlag", {
            get: function () {
                return Material._LightDirtyFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "FresnelDirtyFlag", {
            get: function () {
                return Material._FresnelDirtyFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "AttributesDirtyFlag", {
            get: function () {
                return Material._AttributesDirtyFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "MiscDirtyFlag", {
            get: function () {
                return Material._MiscDirtyFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "backFaceCulling", {
            get: function () {
                return this._backFaceCulling;
            },
            set: function (value) {
                if (this._backFaceCulling === value) {
                    return;
                }
                this._backFaceCulling = value;
                this.markAsDirty(Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "onDispose", {
            set: function (callback) {
                if (this._onDisposeObserver) {
                    this.onDisposeObservable.remove(this._onDisposeObserver);
                }
                this._onDisposeObserver = this.onDisposeObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "onBind", {
            set: function (callback) {
                if (this._onBindObserver) {
                    this.onBindObservable.remove(this._onBindObserver);
                }
                this._onBindObserver = this.onBindObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "alphaMode", {
            get: function () {
                return this._alphaMode;
            },
            set: function (value) {
                if (this._alphaMode === value) {
                    return;
                }
                this._alphaMode = value;
                this.markAsDirty(Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "needDepthPrePass", {
            get: function () {
                return this._needDepthPrePass;
            },
            set: function (value) {
                if (this._needDepthPrePass === value) {
                    return;
                }
                this._needDepthPrePass = value;
                if (this._needDepthPrePass) {
                    this.checkReadyOnEveryCall = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "fogEnabled", {
            get: function () {
                return this._fogEnabled;
            },
            set: function (value) {
                if (this._fogEnabled === value) {
                    return;
                }
                this._fogEnabled = value;
                this.markAsDirty(Material.MiscDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "wireframe", {
            get: function () {
                return this._fillMode === Material.WireFrameFillMode;
            },
            set: function (value) {
                this._fillMode = (value ? Material.WireFrameFillMode : Material.TriangleFillMode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "pointsCloud", {
            get: function () {
                return this._fillMode === Material.PointFillMode;
            },
            set: function (value) {
                this._fillMode = (value ? Material.PointFillMode : Material.TriangleFillMode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "fillMode", {
            get: function () {
                return this._fillMode;
            },
            set: function (value) {
                if (this._fillMode === value) {
                    return;
                }
                this._fillMode = value;
                this.markAsDirty(Material.MiscDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {boolean} fullDetails - support for multiple levels of logging within scene loading
         * subclasses should override adding information pertainent to themselves
         */
        Material.prototype.toString = function (fullDetails) {
            var ret = "Name: " + this.name;
            if (fullDetails) {
            }
            return ret;
        };
        /**
         * Child classes can use it to update shaders
         */
        Material.prototype.getClassName = function () {
            return "Material";
        };
        Object.defineProperty(Material.prototype, "isFrozen", {
            get: function () {
                return this.checkReadyOnlyOnce;
            },
            enumerable: true,
            configurable: true
        });
        Material.prototype.freeze = function () {
            this.checkReadyOnlyOnce = true;
        };
        Material.prototype.unfreeze = function () {
            this.checkReadyOnlyOnce = false;
        };
        Material.prototype.isReady = function (mesh, useInstances) {
            return true;
        };
        Material.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
            return false;
        };
        Material.prototype.getEffect = function () {
            return this._effect;
        };
        Material.prototype.getScene = function () {
            return this._scene;
        };
        Material.prototype.needAlphaBlending = function () {
            return (this.alpha < 1.0);
        };
        Material.prototype.needAlphaBlendingForMesh = function (mesh) {
            return this.needAlphaBlending() || (mesh.visibility < 1.0) || mesh.hasVertexAlpha;
        };
        Material.prototype.needAlphaTesting = function () {
            return false;
        };
        Material.prototype.getAlphaTestTexture = function () {
            return null;
        };
        Material.prototype.markDirty = function () {
            this._wasPreviouslyReady = false;
        };
        Material.prototype._preBind = function (effect, overrideOrientation) {
            if (overrideOrientation === void 0) { overrideOrientation = null; }
            var engine = this._scene.getEngine();
            var orientation = (overrideOrientation == null) ? this.sideOrientation : overrideOrientation;
            var reverse = orientation === Material.ClockWiseSideOrientation;
            engine.enableEffect(effect ? effect : this._effect);
            engine.setState(this.backFaceCulling, this.zOffset, false, reverse);
            return reverse;
        };
        Material.prototype.bind = function (world, mesh) {
        };
        Material.prototype.bindForSubMesh = function (world, mesh, subMesh) {
        };
        Material.prototype.bindOnlyWorldMatrix = function (world) {
        };
        Material.prototype.bindSceneUniformBuffer = function (effect, sceneUbo) {
            sceneUbo.bindToEffect(effect, "Scene");
        };
        Material.prototype.bindView = function (effect) {
            if (!this._useUBO) {
                effect.setMatrix("view", this.getScene().getViewMatrix());
            }
            else {
                this.bindSceneUniformBuffer(effect, this.getScene().getSceneUniformBuffer());
            }
        };
        Material.prototype.bindViewProjection = function (effect) {
            if (!this._useUBO) {
                effect.setMatrix("viewProjection", this.getScene().getTransformMatrix());
            }
            else {
                this.bindSceneUniformBuffer(effect, this.getScene().getSceneUniformBuffer());
            }
        };
        Material.prototype._afterBind = function (mesh) {
            this._scene._cachedMaterial = this;
            if (mesh) {
                this._scene._cachedVisibility = mesh.visibility;
            }
            else {
                this._scene._cachedVisibility = 1;
            }
            if (mesh) {
                this.onBindObservable.notifyObservers(mesh);
            }
            if (this.disableDepthWrite) {
                var engine = this._scene.getEngine();
                this._cachedDepthWriteState = engine.getDepthWrite();
                engine.setDepthWrite(false);
            }
        };
        Material.prototype.unbind = function () {
            this.onUnBindObservable.notifyObservers(this);
            if (this.disableDepthWrite) {
                var engine = this._scene.getEngine();
                engine.setDepthWrite(this._cachedDepthWriteState);
            }
        };
        Material.prototype.getActiveTextures = function () {
            return [];
        };
        Material.prototype.hasTexture = function (texture) {
            return false;
        };
        Material.prototype.clone = function (name) {
            return null;
        };
        Material.prototype.getBindedMeshes = function () {
            var result = new Array();
            for (var index = 0; index < this._scene.meshes.length; index++) {
                var mesh = this._scene.meshes[index];
                if (mesh.material === this) {
                    result.push(mesh);
                }
            }
            return result;
        };
        /**
         * Force shader compilation including textures ready check
         */
        Material.prototype.forceCompilation = function (mesh, onCompiled, options) {
            var _this = this;
            var localOptions = __assign({ alphaTest: null, clipPlane: false }, options);
            var subMesh = new BABYLON.BaseSubMesh();
            var scene = this.getScene();
            var engine = scene.getEngine();
            var checkReady = function () {
                if (!_this._scene || !_this._scene.getEngine()) {
                    return;
                }
                if (subMesh._materialDefines) {
                    subMesh._materialDefines._renderId = -1;
                }
                var alphaTestState = engine.getAlphaTesting();
                var clipPlaneState = scene.clipPlane;
                engine.setAlphaTesting(localOptions.alphaTest || (!_this.needAlphaBlendingForMesh(mesh) && _this.needAlphaTesting()));
                if (localOptions.clipPlane) {
                    scene.clipPlane = new BABYLON.Plane(0, 0, 0, 1);
                }
                if (_this.storeEffectOnSubMeshes) {
                    if (_this.isReadyForSubMesh(mesh, subMesh)) {
                        if (onCompiled) {
                            onCompiled(_this);
                        }
                    }
                    else {
                        setTimeout(checkReady, 16);
                    }
                }
                else {
                    if (_this.isReady(mesh)) {
                        if (onCompiled) {
                            onCompiled(_this);
                        }
                    }
                    else {
                        setTimeout(checkReady, 16);
                    }
                }
                engine.setAlphaTesting(alphaTestState);
                if (options && options.clipPlane) {
                    scene.clipPlane = clipPlaneState;
                }
            };
            checkReady();
        };
        Material.prototype.markAsDirty = function (flag) {
            if (flag & Material.TextureDirtyFlag) {
                this._markAllSubMeshesAsTexturesDirty();
            }
            if (flag & Material.LightDirtyFlag) {
                this._markAllSubMeshesAsLightsDirty();
            }
            if (flag & Material.FresnelDirtyFlag) {
                this._markAllSubMeshesAsFresnelDirty();
            }
            if (flag & Material.AttributesDirtyFlag) {
                this._markAllSubMeshesAsAttributesDirty();
            }
            if (flag & Material.MiscDirtyFlag) {
                this._markAllSubMeshesAsMiscDirty();
            }
            this.getScene().resetCachedMaterial();
        };
        Material.prototype._markAllSubMeshesAsDirty = function (func) {
            for (var _i = 0, _a = this.getScene().meshes; _i < _a.length; _i++) {
                var mesh = _a[_i];
                if (!mesh.subMeshes) {
                    continue;
                }
                for (var _b = 0, _c = mesh.subMeshes; _b < _c.length; _b++) {
                    var subMesh = _c[_b];
                    if (subMesh.getMaterial() !== this) {
                        continue;
                    }
                    if (!subMesh._materialDefines) {
                        continue;
                    }
                    func(subMesh._materialDefines);
                }
            }
        };
        Material.prototype._markAllSubMeshesAsImageProcessingDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsImageProcessingDirty(); });
        };
        Material.prototype._markAllSubMeshesAsTexturesDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsTexturesDirty(); });
        };
        Material.prototype._markAllSubMeshesAsFresnelDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsFresnelDirty(); });
        };
        Material.prototype._markAllSubMeshesAsLightsDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsLightDirty(); });
        };
        Material.prototype._markAllSubMeshesAsAttributesDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsAttributesDirty(); });
        };
        Material.prototype._markAllSubMeshesAsMiscDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsMiscDirty(); });
        };
        Material.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures) {
            // Animations
            this.getScene().stopAnimation(this);
            // Remove from scene
            var index = this._scene.materials.indexOf(this);
            if (index >= 0) {
                this._scene.materials.splice(index, 1);
            }
            // Remove from meshes
            for (index = 0; index < this._scene.meshes.length; index++) {
                var mesh = this._scene.meshes[index];
                if (mesh.material === this) {
                    mesh.material = null;
                    if (mesh.geometry) {
                        var geometry = (mesh.geometry);
                        if (this.storeEffectOnSubMeshes) {
                            for (var _i = 0, _a = mesh.subMeshes; _i < _a.length; _i++) {
                                var subMesh = _a[_i];
                                geometry._releaseVertexArrayObject(subMesh._materialEffect);
                                if (forceDisposeEffect && subMesh._materialEffect) {
                                    this._scene.getEngine()._releaseEffect(subMesh._materialEffect);
                                }
                            }
                        }
                        else {
                            geometry._releaseVertexArrayObject(this._effect);
                        }
                    }
                }
            }
            this._uniformBuffer.dispose();
            // Shader are kept in cache for further use but we can get rid of this by using forceDisposeEffect
            if (forceDisposeEffect && this._effect) {
                if (!this.storeEffectOnSubMeshes) {
                    this._scene.getEngine()._releaseEffect(this._effect);
                }
                this._effect = null;
            }
            // Callback
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
            this.onBindObservable.clear();
            this.onUnBindObservable.clear();
        };
        Material.prototype.serialize = function () {
            return BABYLON.SerializationHelper.Serialize(this);
        };
        Material.ParseMultiMaterial = function (parsedMultiMaterial, scene) {
            var multiMaterial = new BABYLON.MultiMaterial(parsedMultiMaterial.name, scene);
            multiMaterial.id = parsedMultiMaterial.id;
            if (BABYLON.Tags) {
                BABYLON.Tags.AddTagsTo(multiMaterial, parsedMultiMaterial.tags);
            }
            for (var matIndex = 0; matIndex < parsedMultiMaterial.materials.length; matIndex++) {
                var subMatId = parsedMultiMaterial.materials[matIndex];
                if (subMatId) {
                    multiMaterial.subMaterials.push(scene.getMaterialByID(subMatId));
                }
                else {
                    multiMaterial.subMaterials.push(null);
                }
            }
            return multiMaterial;
        };
        Material.Parse = function (parsedMaterial, scene, rootUrl) {
            if (!parsedMaterial.customType) {
                return BABYLON.StandardMaterial.Parse(parsedMaterial, scene, rootUrl);
            }
            if (parsedMaterial.customType === "BABYLON.PBRMaterial" && parsedMaterial.overloadedAlbedo) {
                parsedMaterial.customType = "BABYLON.LegacyPBRMaterial";
                if (!BABYLON.LegacyPBRMaterial) {
                    BABYLON.Tools.Error("Your scene is trying to load a legacy version of the PBRMaterial, please, include it from the materials library.");
                    return;
                }
            }
            var materialType = BABYLON.Tools.Instantiate(parsedMaterial.customType);
            return materialType.Parse(parsedMaterial, scene, rootUrl);
            ;
        };
        // Triangle views
        Material._TriangleFillMode = 0;
        Material._WireFrameFillMode = 1;
        Material._PointFillMode = 2;
        // Draw modes
        Material._PointListDrawMode = 3;
        Material._LineListDrawMode = 4;
        Material._LineLoopDrawMode = 5;
        Material._LineStripDrawMode = 6;
        Material._TriangleStripDrawMode = 7;
        Material._TriangleFanDrawMode = 8;
        Material._ClockWiseSideOrientation = 0;
        Material._CounterClockWiseSideOrientation = 1;
        Material._TextureDirtyFlag = 1;
        Material._LightDirtyFlag = 2;
        Material._FresnelDirtyFlag = 4;
        Material._AttributesDirtyFlag = 8;
        Material._MiscDirtyFlag = 16;
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "id", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "name", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "checkReadyOnEveryCall", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "checkReadyOnlyOnce", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "state", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "alpha", void 0);
        __decorate([
            BABYLON.serialize("backFaceCulling")
        ], Material.prototype, "_backFaceCulling", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "sideOrientation", void 0);
        __decorate([
            BABYLON.serialize("alphaMode")
        ], Material.prototype, "_alphaMode", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "_needDepthPrePass", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "disableDepthWrite", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "forceDepthWrite", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "separateCullingPass", void 0);
        __decorate([
            BABYLON.serialize("fogEnabled")
        ], Material.prototype, "_fogEnabled", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "pointSize", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "zOffset", void 0);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "wireframe", null);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "pointsCloud", null);
        __decorate([
            BABYLON.serialize()
        ], Material.prototype, "fillMode", null);
        return Material;
    }());
    BABYLON.Material = Material;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.material.js.map
