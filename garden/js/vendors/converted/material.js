
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
     * Manages the defines for the Material
     */
    var MaterialDefines = /** @class */ (function () {
        function MaterialDefines() {
            this._isDirty = true;
            /** @hidden */
            this._areLightsDirty = true;
            /** @hidden */
            this._areAttributesDirty = true;
            /** @hidden */
            this._areTexturesDirty = true;
            /** @hidden */
            this._areFresnelDirty = true;
            /** @hidden */
            this._areMiscDirty = true;
            /** @hidden */
            this._areImageProcessingDirty = true;
            /** @hidden */
            this._normals = false;
            /** @hidden */
            this._uvs = false;
            /** @hidden */
            this._needNormals = false;
            /** @hidden */
            this._needUVs = false;
        }
        Object.defineProperty(MaterialDefines.prototype, "isDirty", {
            /**
             * Specifies if the material needs to be re-calculated
             */
            get: function () {
                return this._isDirty;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Marks the material to indicate that it has been re-calculated
         */
        MaterialDefines.prototype.markAsProcessed = function () {
            this._isDirty = false;
            this._areAttributesDirty = false;
            this._areTexturesDirty = false;
            this._areFresnelDirty = false;
            this._areLightsDirty = false;
            this._areMiscDirty = false;
            this._areImageProcessingDirty = false;
        };
        /**
         * Marks the material to indicate that it needs to be re-calculated
         */
        MaterialDefines.prototype.markAsUnprocessed = function () {
            this._isDirty = true;
        };
        /**
         * Marks the material to indicate all of its defines need to be re-calculated
         */
        MaterialDefines.prototype.markAllAsDirty = function () {
            this._areTexturesDirty = true;
            this._areAttributesDirty = true;
            this._areLightsDirty = true;
            this._areFresnelDirty = true;
            this._areMiscDirty = true;
            this._areImageProcessingDirty = true;
            this._isDirty = true;
        };
        /**
         * Marks the material to indicate that image processing needs to be re-calculated
         */
        MaterialDefines.prototype.markAsImageProcessingDirty = function () {
            this._areImageProcessingDirty = true;
            this._isDirty = true;
        };
        /**
         * Marks the material to indicate the lights need to be re-calculated
         */
        MaterialDefines.prototype.markAsLightDirty = function () {
            this._areLightsDirty = true;
            this._isDirty = true;
        };
        /**
         * Marks the attribute state as changed
         */
        MaterialDefines.prototype.markAsAttributesDirty = function () {
            this._areAttributesDirty = true;
            this._isDirty = true;
        };
        /**
         * Marks the texture state as changed
         */
        MaterialDefines.prototype.markAsTexturesDirty = function () {
            this._areTexturesDirty = true;
            this._isDirty = true;
        };
        /**
         * Marks the fresnel state as changed
         */
        MaterialDefines.prototype.markAsFresnelDirty = function () {
            this._areFresnelDirty = true;
            this._isDirty = true;
        };
        /**
         * Marks the misc state as changed
         */
        MaterialDefines.prototype.markAsMiscDirty = function () {
            this._areMiscDirty = true;
            this._isDirty = true;
        };
        /**
         * Rebuilds the material defines
         */
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
        /**
         * Specifies if two material defines are equal
         * @param other - A material define instance to compare to
         * @returns - Boolean indicating if the material defines are equal (true) or not (false)
         */
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
        /**
         * Clones this instance's defines to another instance
         * @param other - material defines to clone values to
         */
        MaterialDefines.prototype.cloneTo = function (other) {
            if (this._keys.length !== other._keys.length) {
                other._keys = this._keys.slice(0);
            }
            for (var index = 0; index < this._keys.length; index++) {
                var prop = this._keys[index];
                other[prop] = this[prop];
            }
        };
        /**
         * Resets the material define values
         */
        MaterialDefines.prototype.reset = function () {
            for (var index = 0; index < this._keys.length; index++) {
                var prop = this._keys[index];
                var type = typeof this[prop];
                switch (type) {
                    case "number":
                        this[prop] = 0;
                        break;
                    case "string":
                        this[prop] = "";
                        break;
                    default:
                        this[prop] = false;
                        break;
                }
            }
        };
        /**
         * Converts the material define values to a string
         * @returns - String of material define information
         */
        MaterialDefines.prototype.toString = function () {
            var result = "";
            for (var index = 0; index < this._keys.length; index++) {
                var prop = this._keys[index];
                var value = this[prop];
                var type = typeof value;
                switch (type) {
                    case "number":
                    case "string":
                        result += "#define " + prop + " " + value + "\n";
                        break;
                    default:
                        if (value) {
                            result += "#define " + prop + "\n";
                        }
                        break;
                }
            }
            return result;
        };
        return MaterialDefines;
    }());
    LIB.MaterialDefines = MaterialDefines;
    /**
     * Base class for the main features of a material in LIB.js
     */
    var Material = /** @class */ (function () {
        /**
         * Creates a material instance
         * @param name defines the name of the material
         * @param scene defines the scene to reference
         * @param doNotAdd specifies if the material should be added to the scene
         */
        function Material(name, scene, doNotAdd) {
            /**
             * Specifies if the ready state should be checked on each call
             */
            this.checkReadyOnEveryCall = false;
            /**
             * Specifies if the ready state should be checked once
             */
            this.checkReadyOnlyOnce = false;
            /**
             * The state of the material
             */
            this.state = "";
            /**
             * The alpha value of the material
             */
            this._alpha = 1.0;
            /**
             * Specifies if back face culling is enabled
             */
            this._backFaceCulling = true;
            /**
             * Specifies if the material should be serialized
             */
            this.doNotSerialize = false;
            /**
             * Specifies if the effect should be stored on sub meshes
             */
            this.storeEffectOnSubMeshes = false;
            /**
            * An event triggered when the material is disposed
            */
            this.onDisposeObservable = new LIB.Observable();
            /**
            * An event triggered when the material is bound
            */
            this.onBindObservable = new LIB.Observable();
            /**
            * An event triggered when the material is unbound
            */
            this.onUnBindObservable = new LIB.Observable();
            /**
             * Stores the value of the alpha mode
             */
            this._alphaMode = LIB.Engine.ALPHA_COMBINE;
            /**
             * Stores the state of the need depth pre-pass value
             */
            this._needDepthPrePass = false;
            /**
             * Specifies if depth writing should be disabled
             */
            this.disableDepthWrite = false;
            /**
             * Specifies if depth writing should be forced
             */
            this.forceDepthWrite = false;
            /**
             * Specifies if there should be a separate pass for culling
             */
            this.separateCullingPass = false;
            /**
             * Stores the state specifing if fog should be enabled
             */
            this._fogEnabled = true;
            /**
             * Stores the size of points
             */
            this.pointSize = 1.0;
            /**
             * Stores the z offset value
             */
            this.zOffset = 0;
            /**
             * Specifies if the material was previously ready
             */
            this._wasPreviouslyReady = false;
            /**
             * Stores the fill mode state
             */
            this._fillMode = Material.TriangleFillMode;
            this.name = name;
            this.id = name || LIB.Tools.RandomId();
            this._scene = scene || LIB.Engine.LastCreatedScene;
            if (this._scene.useRightHandedSystem) {
                this.sideOrientation = Material.ClockWiseSideOrientation;
            }
            else {
                this.sideOrientation = Material.CounterClockWiseSideOrientation;
            }
            this._uniformBuffer = new LIB.UniformBuffer(this._scene.getEngine());
            this._useUBO = this.getScene().getEngine().supportsUniformBuffers;
            if (!doNotAdd) {
                this._scene.materials.push(this);
            }
        }
        Object.defineProperty(Material, "TriangleFillMode", {
            /**
             * Returns the triangle fill mode
             */
            get: function () {
                return Material._TriangleFillMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "WireFrameFillMode", {
            /**
             * Returns the wireframe mode
             */
            get: function () {
                return Material._WireFrameFillMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "PointFillMode", {
            /**
             * Returns the point fill mode
             */
            get: function () {
                return Material._PointFillMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "PointListDrawMode", {
            /**
             * Returns the point list draw mode
             */
            get: function () {
                return Material._PointListDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "LineListDrawMode", {
            /**
             * Returns the line list draw mode
             */
            get: function () {
                return Material._LineListDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "LineLoopDrawMode", {
            /**
             * Returns the line loop draw mode
             */
            get: function () {
                return Material._LineLoopDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "LineStripDrawMode", {
            /**
             * Returns the line strip draw mode
             */
            get: function () {
                return Material._LineStripDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "TriangleStripDrawMode", {
            /**
             * Returns the triangle strip draw mode
             */
            get: function () {
                return Material._TriangleStripDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "TriangleFanDrawMode", {
            /**
             * Returns the triangle fan draw mode
             */
            get: function () {
                return Material._TriangleFanDrawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "ClockWiseSideOrientation", {
            /**
             * Returns the clock-wise side orientation
             */
            get: function () {
                return Material._ClockWiseSideOrientation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "CounterClockWiseSideOrientation", {
            /**
             * Returns the counter clock-wise side orientation
             */
            get: function () {
                return Material._CounterClockWiseSideOrientation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "TextureDirtyFlag", {
            /**
             * Returns the dirty texture flag value
             */
            get: function () {
                return Material._TextureDirtyFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "LightDirtyFlag", {
            /**
             * Returns the dirty light flag value
             */
            get: function () {
                return Material._LightDirtyFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "FresnelDirtyFlag", {
            /**
             * Returns the dirty fresnel flag value
             */
            get: function () {
                return Material._FresnelDirtyFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "AttributesDirtyFlag", {
            /**
             * Returns the dirty attributes flag value
             */
            get: function () {
                return Material._AttributesDirtyFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material, "MiscDirtyFlag", {
            /**
             * Returns the dirty misc flag value
             */
            get: function () {
                return Material._MiscDirtyFlag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "alpha", {
            /**
             * Gets the alpha value of the material
             */
            get: function () {
                return this._alpha;
            },
            /**
             * Sets the alpha value of the material
             */
            set: function (value) {
                if (this._alpha === value) {
                    return;
                }
                this._alpha = value;
                this.markAsDirty(Material.MiscDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "backFaceCulling", {
            /**
             * Gets the back-face culling state
             */
            get: function () {
                return this._backFaceCulling;
            },
            /**
             * Sets the back-face culling state
             */
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
            /**
             * Called during a dispose event
             */
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
            /**
             * Called during a bind event
             */
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
            /**
             * Gets the value of the alpha mode
             */
            get: function () {
                return this._alphaMode;
            },
            /**
             * Sets the value of the alpha mode.
             *
             * | Value | Type | Description |
             * | --- | --- | --- |
             * | 0 | ALPHA_DISABLE |   |
             * | 1 | ALPHA_ADD |   |
             * | 2 | ALPHA_COMBINE |   |
             * | 3 | ALPHA_SUBTRACT |   |
             * | 4 | ALPHA_MULTIPLY |   |
             * | 5 | ALPHA_MAXIMIZED |   |
             * | 6 | ALPHA_ONEONE |   |
             * | 7 | ALPHA_PREMULTIPLIED |   |
             * | 8 | ALPHA_PREMULTIPLIED_PORTERDUFF |   |
             * | 9 | ALPHA_INTERPOLATE |   |
             * | 10 | ALPHA_SCREENMODE |   |
             *
             */
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
            /**
             * Gets the depth pre-pass value
             */
            get: function () {
                return this._needDepthPrePass;
            },
            /**
             * Sets the need depth pre-pass value
             */
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
            /**
             * Gets the value of the fog enabled state
             */
            get: function () {
                return this._fogEnabled;
            },
            /**
             * Sets the state for enabling fog
             */
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
            /**
             * Gets a value specifying if wireframe mode is enabled
             */
            get: function () {
                switch (this._fillMode) {
                    case Material.WireFrameFillMode:
                    case Material.LineListDrawMode:
                    case Material.LineLoopDrawMode:
                    case Material.LineStripDrawMode:
                        return true;
                }
                return this._scene.forceWireframe;
            },
            /**
             * Sets the state of wireframe mode
             */
            set: function (value) {
                this.fillMode = (value ? Material.WireFrameFillMode : Material.TriangleFillMode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "pointsCloud", {
            /**
             * Gets the value specifying if point clouds are enabled
             */
            get: function () {
                switch (this._fillMode) {
                    case Material.PointFillMode:
                    case Material.PointListDrawMode:
                        return true;
                }
                return this._scene.forcePointsCloud;
            },
            /**
             * Sets the state of point cloud mode
             */
            set: function (value) {
                this.fillMode = (value ? Material.PointFillMode : Material.TriangleFillMode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "fillMode", {
            /**
             * Gets the material fill mode
             */
            get: function () {
                return this._fillMode;
            },
            /**
             * Sets the material fill mode
             */
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
         * Returns a string representation of the current material
         * @param fullDetails defines a boolean indicating which levels of logging is desired
         * @returns a string with material information
         */
        Material.prototype.toString = function (fullDetails) {
            var ret = "Name: " + this.name;
            if (fullDetails) {
            }
            return ret;
        };
        /**
         * Gets the class name of the material
         * @returns a string with the class name of the material
         */
        Material.prototype.getClassName = function () {
            return "Material";
        };
        Object.defineProperty(Material.prototype, "isFrozen", {
            /**
             * Specifies if updates for the material been locked
             */
            get: function () {
                return this.checkReadyOnlyOnce;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Locks updates for the material
         */
        Material.prototype.freeze = function () {
            this.checkReadyOnlyOnce = true;
        };
        /**
         * Unlocks updates for the material
         */
        Material.prototype.unfreeze = function () {
            this.checkReadyOnlyOnce = false;
        };
        /**
         * Specifies if the material is ready to be used
         * @param mesh defines the mesh to check
         * @param useInstances specifies if instances should be used
         * @returns a boolean indicating if the material is ready to be used
         */
        Material.prototype.isReady = function (mesh, useInstances) {
            return true;
        };
        /**
         * Specifies that the submesh is ready to be used
         * @param mesh defines the mesh to check
         * @param subMesh defines which submesh to check
         * @param useInstances specifies that instances should be used
         * @returns a boolean indicating that the submesh is ready or not
         */
        Material.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
            return false;
        };
        /**
         * Returns the material effect
         * @returns the effect associated with the material
         */
        Material.prototype.getEffect = function () {
            return this._effect;
        };
        /**
         * Returns the current scene
         * @returns a Scene
         */
        Material.prototype.getScene = function () {
            return this._scene;
        };
        /**
         * Specifies if the material will require alpha blending
         * @returns a boolean specifying if alpha blending is needed
         */
        Material.prototype.needAlphaBlending = function () {
            return (this.alpha < 1.0);
        };
        /**
         * Specifies if the mesh will require alpha blending
         * @param mesh defines the mesh to check
         * @returns a boolean specifying if alpha blending is needed for the mesh
         */
        Material.prototype.needAlphaBlendingForMesh = function (mesh) {
            return this.needAlphaBlending() || (mesh.visibility < 1.0) || mesh.hasVertexAlpha;
        };
        /**
         * Specifies if this material should be rendered in alpha test mode
         * @returns a boolean specifying if an alpha test is needed.
         */
        Material.prototype.needAlphaTesting = function () {
            return false;
        };
        /**
         * Gets the texture used for the alpha test
         * @returns the texture to use for alpha testing
         */
        Material.prototype.getAlphaTestTexture = function () {
            return null;
        };
        /**
         * Marks the material to indicate that it needs to be re-calculated
         */
        Material.prototype.markDirty = function () {
            this._wasPreviouslyReady = false;
        };
        /** @hidden */
        Material.prototype._preBind = function (effect, overrideOrientation) {
            if (overrideOrientation === void 0) { overrideOrientation = null; }
            var engine = this._scene.getEngine();
            var orientation = (overrideOrientation == null) ? this.sideOrientation : overrideOrientation;
            var reverse = orientation === Material.ClockWiseSideOrientation;
            engine.enableEffect(effect ? effect : this._effect);
            engine.setState(this.backFaceCulling, this.zOffset, false, reverse);
            return reverse;
        };
        /**
         * Binds the material to the mesh
         * @param world defines the world transformation matrix
         * @param mesh defines the mesh to bind the material to
         */
        Material.prototype.bind = function (world, mesh) {
        };
        /**
         * Binds the submesh to the material
         * @param world defines the world transformation matrix
         * @param mesh defines the mesh containing the submesh
         * @param subMesh defines the submesh to bind the material to
         */
        Material.prototype.bindForSubMesh = function (world, mesh, subMesh) {
        };
        /**
         * Binds the world matrix to the material
         * @param world defines the world transformation matrix
         */
        Material.prototype.bindOnlyWorldMatrix = function (world) {
        };
        /**
         * Binds the scene's uniform buffer to the effect.
         * @param effect defines the effect to bind to the scene uniform buffer
         * @param sceneUbo defines the uniform buffer storing scene data
         */
        Material.prototype.bindSceneUniformBuffer = function (effect, sceneUbo) {
            sceneUbo.bindToEffect(effect, "Scene");
        };
        /**
         * Binds the view matrix to the effect
         * @param effect defines the effect to bind the view matrix to
         */
        Material.prototype.bindView = function (effect) {
            if (!this._useUBO) {
                effect.setMatrix("view", this.getScene().getViewMatrix());
            }
            else {
                this.bindSceneUniformBuffer(effect, this.getScene().getSceneUniformBuffer());
            }
        };
        /**
         * Binds the view projection matrix to the effect
         * @param effect defines the effect to bind the view projection matrix to
         */
        Material.prototype.bindViewProjection = function (effect) {
            if (!this._useUBO) {
                effect.setMatrix("viewProjection", this.getScene().getTransformMatrix());
            }
            else {
                this.bindSceneUniformBuffer(effect, this.getScene().getSceneUniformBuffer());
            }
        };
        /**
         * Specifies if material alpha testing should be turned on for the mesh
         * @param mesh defines the mesh to check
         */
        Material.prototype._shouldTurnAlphaTestOn = function (mesh) {
            return (!this.needAlphaBlendingForMesh(mesh) && this.needAlphaTesting());
        };
        /**
         * Processes to execute after binding the material to a mesh
         * @param mesh defines the rendered mesh
         */
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
        /**
         * Unbinds the material from the mesh
         */
        Material.prototype.unbind = function () {
            this.onUnBindObservable.notifyObservers(this);
            if (this.disableDepthWrite) {
                var engine = this._scene.getEngine();
                engine.setDepthWrite(this._cachedDepthWriteState);
            }
        };
        /**
         * Gets the active textures from the material
         * @returns an array of textures
         */
        Material.prototype.getActiveTextures = function () {
            return [];
        };
        /**
         * Specifies if the material uses a texture
         * @param texture defines the texture to check against the material
         * @returns a boolean specifying if the material uses the texture
         */
        Material.prototype.hasTexture = function (texture) {
            return false;
        };
        /**
         * Makes a duplicate of the material, and gives it a new name
         * @param name defines the new name for the duplicated material
         * @returns the cloned material
         */
        Material.prototype.clone = function (name) {
            return null;
        };
        /**
         * Gets the meshes bound to the material
         * @returns an array of meshes bound to the material
         */
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
         * Force shader compilation
         * @param mesh defines the mesh associated with this material
         * @param onCompiled defines a function to execute once the material is compiled
         * @param options defines the options to configure the compilation
         */
        Material.prototype.forceCompilation = function (mesh, onCompiled, options) {
            var _this = this;
            var localOptions = __assign({ clipPlane: false }, options);
            var subMesh = new LIB.BaseSubMesh();
            var scene = this.getScene();
            var checkReady = function () {
                if (!_this._scene || !_this._scene.getEngine()) {
                    return;
                }
                if (subMesh._materialDefines) {
                    subMesh._materialDefines._renderId = -1;
                }
                var clipPlaneState = scene.clipPlane;
                if (localOptions.clipPlane) {
                    scene.clipPlane = new LIB.Plane(0, 0, 0, 1);
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
                if (localOptions.clipPlane) {
                    scene.clipPlane = clipPlaneState;
                }
            };
            checkReady();
        };
        /**
         * Force shader compilation
         * @param mesh defines the mesh that will use this material
         * @param options defines additional options for compiling the shaders
         * @returns a promise that resolves when the compilation completes
         */
        Material.prototype.forceCompilationAsync = function (mesh, options) {
            var _this = this;
            return new Promise(function (resolve) {
                _this.forceCompilation(mesh, function () {
                    resolve();
                }, options);
            });
        };
        /**
         * Marks a define in the material to indicate that it needs to be re-computed
         * @param flag defines a flag used to determine which parts of the material have to be marked as dirty
         */
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
        /**
         * Marks all submeshes of a material to indicate that their material defines need to be re-calculated
         * @param func defines a function which checks material defines against the submeshes
         */
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
        /**
         * Indicates that image processing needs to be re-calculated for all submeshes
         */
        Material.prototype._markAllSubMeshesAsImageProcessingDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsImageProcessingDirty(); });
        };
        /**
         * Indicates that textures need to be re-calculated for all submeshes
         */
        Material.prototype._markAllSubMeshesAsTexturesDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsTexturesDirty(); });
        };
        /**
         * Indicates that fresnel needs to be re-calculated for all submeshes
         */
        Material.prototype._markAllSubMeshesAsFresnelDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsFresnelDirty(); });
        };
        /**
         * Indicates that fresnel and misc need to be re-calculated for all submeshes
         */
        Material.prototype._markAllSubMeshesAsFresnelAndMiscDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) {
                defines.markAsFresnelDirty();
                defines.markAsMiscDirty();
            });
        };
        /**
         * Indicates that lights need to be re-calculated for all submeshes
         */
        Material.prototype._markAllSubMeshesAsLightsDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsLightDirty(); });
        };
        /**
         * Indicates that attributes need to be re-calculated for all submeshes
         */
        Material.prototype._markAllSubMeshesAsAttributesDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsAttributesDirty(); });
        };
        /**
         * Indicates that misc needs to be re-calculated for all submeshes
         */
        Material.prototype._markAllSubMeshesAsMiscDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) { return defines.markAsMiscDirty(); });
        };
        /**
         * Indicates that textures and misc need to be re-calculated for all submeshes
         */
        Material.prototype._markAllSubMeshesAsTexturesAndMiscDirty = function () {
            this._markAllSubMeshesAsDirty(function (defines) {
                defines.markAsTexturesDirty();
                defines.markAsMiscDirty();
            });
        };
        /**
         * Disposes the material
         * @param forceDisposeEffect specifies if effects should be forcefully disposed
         * @param forceDisposeTextures specifies if textures should be forcefully disposed
         */
        Material.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures) {
            // Animations
            this.getScene().stopAnimation(this);
            this.getScene().freeProcessedMaterials();
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
        /**
         * Serializes this material
         * @returns the serialized material object
         */
        Material.prototype.serialize = function () {
            return LIB.SerializationHelper.Serialize(this);
        };
        /**
         * Creates a MultiMaterial from parsed MultiMaterial data.
         * @param parsedMultiMaterial defines parsed MultiMaterial data.
         * @param scene defines the hosting scene
         * @returns a new MultiMaterial
         */
        Material.ParseMultiMaterial = function (parsedMultiMaterial, scene) {
            var multiMaterial = new LIB.MultiMaterial(parsedMultiMaterial.name, scene);
            multiMaterial.id = parsedMultiMaterial.id;
            if (LIB.Tags) {
                LIB.Tags.AddTagsTo(multiMaterial, parsedMultiMaterial.tags);
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
        /**
         * Creates a material from parsed material data
         * @param parsedMaterial defines parsed material data
         * @param scene defines the hosting scene
         * @param rootUrl defines the root URL to use to load textures
         * @returns a new material
         */
        Material.Parse = function (parsedMaterial, scene, rootUrl) {
            if (!parsedMaterial.customType || parsedMaterial.customType === "LIB.StandardMaterial") {
                return LIB.StandardMaterial.Parse(parsedMaterial, scene, rootUrl);
            }
            if (parsedMaterial.customType === "LIB.PBRMaterial" && parsedMaterial.overloadedAlbedo) {
                parsedMaterial.customType = "LIB.LegacyPBRMaterial";
                if (!LIB.LegacyPBRMaterial) {
                    LIB.Tools.Error("Your scene is trying to load a legacy version of the PBRMaterial, please, include it from the materials library.");
                    return;
                }
            }
            var materialType = LIB.Tools.Instantiate(parsedMaterial.customType);
            return materialType.Parse(parsedMaterial, scene, rootUrl);
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
        /**
         * Stores the clock-wise side orientation
         */
        Material._ClockWiseSideOrientation = 0;
        /**
         * Stores the counter clock-wise side orientation
         */
        Material._CounterClockWiseSideOrientation = 1;
        /**
         * The dirty texture flag value
         */
        Material._TextureDirtyFlag = 1;
        /**
         * The dirty light flag value
         */
        Material._LightDirtyFlag = 2;
        /**
         * The dirty fresnel flag value
         */
        Material._FresnelDirtyFlag = 4;
        /**
         * The dirty attribute flag value
         */
        Material._AttributesDirtyFlag = 8;
        /**
         * The dirty misc flag value
         */
        Material._MiscDirtyFlag = 16;
        __decorate([
            LIB.serialize()
        ], Material.prototype, "id", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "name", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "checkReadyOnEveryCall", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "checkReadyOnlyOnce", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "state", void 0);
        __decorate([
            LIB.serialize("alpha")
        ], Material.prototype, "_alpha", void 0);
        __decorate([
            LIB.serialize("backFaceCulling")
        ], Material.prototype, "_backFaceCulling", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "sideOrientation", void 0);
        __decorate([
            LIB.serialize("alphaMode")
        ], Material.prototype, "_alphaMode", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "_needDepthPrePass", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "disableDepthWrite", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "forceDepthWrite", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "separateCullingPass", void 0);
        __decorate([
            LIB.serialize("fogEnabled")
        ], Material.prototype, "_fogEnabled", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "pointSize", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "zOffset", void 0);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "wireframe", null);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "pointsCloud", null);
        __decorate([
            LIB.serialize()
        ], Material.prototype, "fillMode", null);
        return Material;
    }());
    LIB.Material = Material;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.material.js.map
//# sourceMappingURL=LIB.material.js.map
