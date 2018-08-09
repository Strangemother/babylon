(function (LIB) {
    var AbstractMesh = /** @class */ (function (_super) {
        __extends(AbstractMesh, _super);
        // Constructor
        function AbstractMesh(name, scene) {
            if (scene === void 0) { scene = null; }
            var _this = _super.call(this, name, scene, false) || this;
            _this._facetNb = 0; // facet number
            _this._partitioningSubdivisions = 10; // number of subdivisions per axis in the partioning space
            _this._partitioningBBoxRatio = 1.01; // the partioning array space is by default 1% bigger than the bounding box
            _this._facetDataEnabled = false; // is the facet data feature enabled on this mesh ?
            _this._facetParameters = {}; // keep a reference to the object parameters to avoid memory re-allocation
            _this._bbSize = LIB.Vector3.Zero(); // bbox size approximated for facet data
            _this._subDiv = {
                max: 1,
                X: 1,
                Y: 1,
                Z: 1
            };
            _this._facetDepthSort = false; // is the facet depth sort to be computed
            _this._facetDepthSortEnabled = false; // is the facet depth sort initialized
            // Events
            /**
            * An event triggered when this mesh collides with another one
            * @type {LIB.Observable}
            */
            _this.onCollideObservable = new LIB.Observable();
            /**
            * An event triggered when the collision's position changes
            * @type {LIB.Observable}
            */
            _this.onCollisionPositionChangeObservable = new LIB.Observable();
            /**
            * An event triggered when material is changed
            * @type {LIB.Observable}
            */
            _this.onMaterialChangedObservable = new LIB.Observable();
            // Properties
            _this.definedFacingForward = true; // orientation for POV movement & rotation
            /**
            * This property determines the type of occlusion query algorithm to run in WebGl, you can use:

            * AbstractMesh.OCCLUSION_ALGORITHM_TYPE_ACCURATE which is mapped to GL_ANY_SAMPLES_PASSED.

            * or

            * AbstractMesh.OCCLUSION_ALGORITHM_TYPE_CONSERVATIVE (Default Value) which is mapped to GL_ANY_SAMPLES_PASSED_CONSERVATIVE which is a false positive algorithm that is faster than GL_ANY_SAMPLES_PASSED but less accurate.

            * for more info check WebGl documentations
            */
            _this.occlusionQueryAlgorithmType = AbstractMesh.OCCLUSION_ALGORITHM_TYPE_CONSERVATIVE;
            /**
             * This property is responsible for starting the occlusion query within the Mesh or not, this property is also used     to determine what should happen when the occlusionRetryCount is reached. It has supports 3 values:

            * OCCLUSION_TYPE_NONE (Default Value): this option means no occlusion query whith the Mesh.

            * OCCLUSION_TYPE_OPTIMISTIC: this option is means use occlusion query and if occlusionRetryCount is reached and the query is broken show the mesh.

                * OCCLUSION_TYPE_STRICT: this option is means use occlusion query and if occlusionRetryCount is reached and the query is broken restore the last state of the mesh occlusion if the mesh was visible then show the mesh if was hidden then hide don't show.
             */
            _this.occlusionType = AbstractMesh.OCCLUSION_TYPE_NONE;
            /**
            * This number indicates the number of allowed retries before stop the occlusion query, this is useful if the        occlusion query is taking long time before to the query result is retireved, the query result indicates if the object is visible within the scene or not and based on that LIB.Js engine decideds to show or hide the object.

            * The default value is -1 which means don't break the query and wait till the result.
            */
            _this.occlusionRetryCount = -1;
            _this._occlusionInternalRetryCounter = 0;
            _this._isOccluded = false;
            _this._isOcclusionQueryInProgress = false;
            _this.visibility = 1.0;
            _this.alphaIndex = Number.MAX_VALUE;
            _this.isVisible = true;
            _this.isPickable = true;
            _this.showBoundingBox = false;
            _this.showSubMeshesBoundingBox = false;
            _this.isBlocker = false;
            _this.enablePointerMoveEvents = false;
            _this.renderingGroupId = 0;
            _this._receiveShadows = false;
            _this.renderOutline = false;
            _this.outlineColor = LIB.Color3.Red();
            _this.outlineWidth = 0.02;
            _this.renderOverlay = false;
            _this.overlayColor = LIB.Color3.Red();
            _this.overlayAlpha = 0.5;
            _this._hasVertexAlpha = false;
            _this._useVertexColors = true;
            _this._computeBonesUsingShaders = true;
            _this._numBoneInfluencers = 4;
            _this._applyFog = true;
            _this.useOctreeForRenderingSelection = true;
            _this.useOctreeForPicking = true;
            _this.useOctreeForCollisions = true;
            _this._layerMask = 0x0FFFFFFF;
            /**
             * True if the mesh must be rendered in any case.
             */
            _this.alwaysSelectAsActiveMesh = false;
            /**
             * This scene's action manager
             * @type {LIB.ActionManager}
            */
            _this.actionManager = null;
            // Physics
            _this.physicsImpostor = null;
            // Collisions
            _this._checkCollisions = false;
            _this._collisionMask = -1;
            _this._collisionGroup = -1;
            _this.ellipsoid = new LIB.Vector3(0.5, 1, 0.5);
            _this.ellipsoidOffset = new LIB.Vector3(0, 0, 0);
            _this._oldPositionForCollisions = new LIB.Vector3(0, 0, 0);
            _this._diffPositionForCollisions = new LIB.Vector3(0, 0, 0);
            // Edges
            _this.edgesWidth = 1;
            _this.edgesColor = new LIB.Color4(1, 0, 0, 1);
            // Cache
            _this._collisionsTransformMatrix = LIB.Matrix.Zero();
            _this._collisionsScalingMatrix = LIB.Matrix.Zero();
            _this._isDisposed = false;
            _this._renderId = 0;
            _this._intersectionsInProgress = new Array();
            _this._unIndexed = false;
            _this._lightSources = new Array();
            _this._onCollisionPositionChange = function (collisionId, newPosition, collidedMesh) {
                if (collidedMesh === void 0) { collidedMesh = null; }
                //TODO move this to the collision coordinator!
                if (_this.getScene().workerCollisions)
                    newPosition.multiplyInPlace(_this._collider._radius);
                newPosition.subtractToRef(_this._oldPositionForCollisions, _this._diffPositionForCollisions);
                if (_this._diffPositionForCollisions.length() > LIB.Engine.CollisionsEpsilon) {
                    _this.position.addInPlace(_this._diffPositionForCollisions);
                }
                if (collidedMesh) {
                    _this.onCollideObservable.notifyObservers(collidedMesh);
                }
                _this.onCollisionPositionChangeObservable.notifyObservers(_this.position);
            };
            _this.getScene().addMesh(_this);
            _this._resyncLightSources();
            return _this;
        }
        Object.defineProperty(AbstractMesh, "BILLBOARDMODE_NONE", {
            get: function () {
                return LIB.TransformNode.BILLBOARDMODE_NONE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh, "BILLBOARDMODE_X", {
            get: function () {
                return LIB.TransformNode.BILLBOARDMODE_X;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh, "BILLBOARDMODE_Y", {
            get: function () {
                return LIB.TransformNode.BILLBOARDMODE_Y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh, "BILLBOARDMODE_Z", {
            get: function () {
                return LIB.TransformNode.BILLBOARDMODE_Z;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh, "BILLBOARDMODE_ALL", {
            get: function () {
                return LIB.TransformNode.BILLBOARDMODE_ALL;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "facetNb", {
            /**
             * Read-only : the number of facets in the mesh
             */
            get: function () {
                return this._facetNb;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "partitioningSubdivisions", {
            /**
             * The number (integer) of subdivisions per axis in the partioning space
             */
            get: function () {
                return this._partitioningSubdivisions;
            },
            set: function (nb) {
                this._partitioningSubdivisions = nb;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "partitioningBBoxRatio", {
            /**
             * The ratio (float) to apply to the bouding box size to set to the partioning space.
             * Ex : 1.01 (default) the partioning space is 1% bigger than the bounding box.
             */
            get: function () {
                return this._partitioningBBoxRatio;
            },
            set: function (ratio) {
                this._partitioningBBoxRatio = ratio;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "mustDepthSortFacets", {
            /**
             * Boolean : must the facet be depth sorted on next call to `updateFacetData()` ?
             * Works only for updatable meshes.
             * Doesn't work with multi-materials.
             */
            get: function () {
                return this._facetDepthSort;
            },
            set: function (sort) {
                this._facetDepthSort = sort;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "facetDepthSortFrom", {
            /**
             * The location (Vector3) where the facet depth sort must be computed from.
             * By default, the active camera position.
             * Used only when facet depth sort is enabled.
             */
            get: function () {
                return this._facetDepthSortFrom;
            },
            set: function (location) {
                this._facetDepthSortFrom = location;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "isFacetDataEnabled", {
            /**
             * Read-only boolean : is the feature facetData enabled ?
             */
            get: function () {
                return this._facetDataEnabled;
            },
            enumerable: true,
            configurable: true
        });
        AbstractMesh.prototype._updateNonUniformScalingState = function (value) {
            if (!_super.prototype._updateNonUniformScalingState.call(this, value)) {
                return false;
            }
            this._markSubMeshesAsMiscDirty();
            return true;
        };
        Object.defineProperty(AbstractMesh.prototype, "onCollide", {
            set: function (callback) {
                if (this._onCollideObserver) {
                    this.onCollideObservable.remove(this._onCollideObserver);
                }
                this._onCollideObserver = this.onCollideObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "onCollisionPositionChange", {
            set: function (callback) {
                if (this._onCollisionPositionChangeObserver) {
                    this.onCollisionPositionChangeObservable.remove(this._onCollisionPositionChangeObserver);
                }
                this._onCollisionPositionChangeObserver = this.onCollisionPositionChangeObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "isOccluded", {
            /**
            * Property isOccluded : Gets or sets whether the mesh is occluded or not, it is used also to set the intial state of the mesh to be occluded or not.
            */
            get: function () {
                return this._isOccluded;
            },
            set: function (value) {
                this._isOccluded = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "isOcclusionQueryInProgress", {
            /**
            * Flag to check the progress status of the query
            */
            get: function () {
                return this._isOcclusionQueryInProgress;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "material", {
            get: function () {
                return this._material;
            },
            set: function (value) {
                if (this._material === value) {
                    return;
                }
                this._material = value;
                if (this.onMaterialChangedObservable.hasObservers) {
                    this.onMaterialChangedObservable.notifyObservers(this);
                }
                if (!this.subMeshes) {
                    return;
                }
                for (var _i = 0, _a = this.subMeshes; _i < _a.length; _i++) {
                    var subMesh = _a[_i];
                    subMesh.setEffect(null);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "receiveShadows", {
            get: function () {
                return this._receiveShadows;
            },
            set: function (value) {
                if (this._receiveShadows === value) {
                    return;
                }
                this._receiveShadows = value;
                this._markSubMeshesAsLightDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "hasVertexAlpha", {
            get: function () {
                return this._hasVertexAlpha;
            },
            set: function (value) {
                if (this._hasVertexAlpha === value) {
                    return;
                }
                this._hasVertexAlpha = value;
                this._markSubMeshesAsAttributesDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "useVertexColors", {
            get: function () {
                return this._useVertexColors;
            },
            set: function (value) {
                if (this._useVertexColors === value) {
                    return;
                }
                this._useVertexColors = value;
                this._markSubMeshesAsAttributesDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "computeBonesUsingShaders", {
            get: function () {
                return this._computeBonesUsingShaders;
            },
            set: function (value) {
                if (this._computeBonesUsingShaders === value) {
                    return;
                }
                this._computeBonesUsingShaders = value;
                this._markSubMeshesAsAttributesDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "numBoneInfluencers", {
            get: function () {
                return this._numBoneInfluencers;
            },
            set: function (value) {
                if (this._numBoneInfluencers === value) {
                    return;
                }
                this._numBoneInfluencers = value;
                this._markSubMeshesAsAttributesDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "applyFog", {
            get: function () {
                return this._applyFog;
            },
            set: function (value) {
                if (this._applyFog === value) {
                    return;
                }
                this._applyFog = value;
                this._markSubMeshesAsMiscDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "layerMask", {
            get: function () {
                return this._layerMask;
            },
            set: function (value) {
                if (value === this._layerMask) {
                    return;
                }
                this._layerMask = value;
                this._resyncLightSources();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "collisionMask", {
            get: function () {
                return this._collisionMask;
            },
            set: function (mask) {
                this._collisionMask = !isNaN(mask) ? mask : -1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "collisionGroup", {
            get: function () {
                return this._collisionGroup;
            },
            set: function (mask) {
                this._collisionGroup = !isNaN(mask) ? mask : -1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "_positions", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "skeleton", {
            get: function () {
                return this._skeleton;
            },
            set: function (value) {
                if (this._skeleton && this._skeleton.needInitialSkinMatrix) {
                    this._skeleton._unregisterMeshWithPoseMatrix(this);
                }
                if (value && value.needInitialSkinMatrix) {
                    value._registerMeshWithPoseMatrix(this);
                }
                this._skeleton = value;
                if (!this._skeleton) {
                    this._bonesTransformMatrices = null;
                }
                this._markSubMeshesAsAttributesDirty();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Boolean : true if the mesh has been disposed.
         */
        AbstractMesh.prototype.isDisposed = function () {
            return this._isDisposed;
        };
        /**
         * Returns the string "AbstractMesh"
         */
        AbstractMesh.prototype.getClassName = function () {
            return "AbstractMesh";
        };
        /**
         * @param {boolean} fullDetails - support for multiple levels of logging within scene loading
         */
        AbstractMesh.prototype.toString = function (fullDetails) {
            var ret = "Name: " + this.name + ", isInstance: " + (this instanceof LIB.InstancedMesh ? "YES" : "NO");
            ret += ", # of submeshes: " + (this.subMeshes ? this.subMeshes.length : 0);
            if (this._skeleton) {
                ret += ", skeleton: " + this._skeleton.name;
            }
            if (fullDetails) {
                ret += ", billboard mode: " + (["NONE", "X", "Y", null, "Z", null, null, "ALL"])[this.billboardMode];
                ret += ", freeze wrld mat: " + (this._isWorldMatrixFrozen || this._waitingFreezeWorldMatrix ? "YES" : "NO");
            }
            return ret;
        };
        AbstractMesh.prototype._rebuild = function () {
            if (this._occlusionQuery) {
                this._occlusionQuery = null;
            }
            if (this._edgesRenderer) {
                this._edgesRenderer._rebuild();
            }
            if (!this.subMeshes) {
                return;
            }
            for (var _i = 0, _a = this.subMeshes; _i < _a.length; _i++) {
                var subMesh = _a[_i];
                subMesh._rebuild();
            }
        };
        AbstractMesh.prototype._resyncLightSources = function () {
            this._lightSources.length = 0;
            for (var _i = 0, _a = this.getScene().lights; _i < _a.length; _i++) {
                var light = _a[_i];
                if (!light.isEnabled()) {
                    continue;
                }
                if (light.canAffectMesh(this)) {
                    this._lightSources.push(light);
                }
            }
            this._markSubMeshesAsLightDirty();
        };
        AbstractMesh.prototype._resyncLighSource = function (light) {
            var isIn = light.isEnabled() && light.canAffectMesh(this);
            var index = this._lightSources.indexOf(light);
            if (index === -1) {
                if (!isIn) {
                    return;
                }
                this._lightSources.push(light);
            }
            else {
                if (isIn) {
                    return;
                }
                this._lightSources.splice(index, 1);
            }
            this._markSubMeshesAsLightDirty();
        };
        AbstractMesh.prototype._removeLightSource = function (light) {
            var index = this._lightSources.indexOf(light);
            if (index === -1) {
                return;
            }
            this._lightSources.splice(index, 1);
        };
        AbstractMesh.prototype._markSubMeshesAsDirty = function (func) {
            if (!this.subMeshes) {
                return;
            }
            for (var _i = 0, _a = this.subMeshes; _i < _a.length; _i++) {
                var subMesh = _a[_i];
                if (subMesh._materialDefines) {
                    func(subMesh._materialDefines);
                }
            }
        };
        AbstractMesh.prototype._markSubMeshesAsLightDirty = function () {
            this._markSubMeshesAsDirty(function (defines) { return defines.markAsLightDirty(); });
        };
        AbstractMesh.prototype._markSubMeshesAsAttributesDirty = function () {
            this._markSubMeshesAsDirty(function (defines) { return defines.markAsAttributesDirty(); });
        };
        AbstractMesh.prototype._markSubMeshesAsMiscDirty = function () {
            if (!this.subMeshes) {
                return;
            }
            for (var _i = 0, _a = this.subMeshes; _i < _a.length; _i++) {
                var subMesh = _a[_i];
                var material = subMesh.getMaterial();
                if (material) {
                    material.markAsDirty(LIB.Material.MiscDirtyFlag);
                }
            }
        };
        Object.defineProperty(AbstractMesh.prototype, "scaling", {
            /**
            * Scaling property : a Vector3 depicting the mesh scaling along each local axis X, Y, Z.
            * Default : (1.0, 1.0, 1.0)
            */
            get: function () {
                return this._scaling;
            },
            /**
             * Scaling property : a Vector3 depicting the mesh scaling along each local axis X, Y, Z.
             * Default : (1.0, 1.0, 1.0)
             */
            set: function (newScaling) {
                this._scaling = newScaling;
                if (this.physicsImpostor) {
                    this.physicsImpostor.forceUpdate();
                }
            },
            enumerable: true,
            configurable: true
        });
        // Methods
        /**
         * Disables the mesh edger rendering mode.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.disableEdgesRendering = function () {
            if (this._edgesRenderer) {
                this._edgesRenderer.dispose();
                this._edgesRenderer = null;
            }
            return this;
        };
        /**
         * Enables the edge rendering mode on the mesh.
         * This mode makes the mesh edges visible.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.enableEdgesRendering = function (epsilon, checkVerticesInsteadOfIndices) {
            if (epsilon === void 0) { epsilon = 0.95; }
            if (checkVerticesInsteadOfIndices === void 0) { checkVerticesInsteadOfIndices = false; }
            this.disableEdgesRendering();
            this._edgesRenderer = new LIB.EdgesRenderer(this, epsilon, checkVerticesInsteadOfIndices);
            return this;
        };
        Object.defineProperty(AbstractMesh.prototype, "isBlocked", {
            /**
             * Returns true if the mesh is blocked. Used by the class Mesh.
             * Returns the boolean `false` by default.
             */
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the mesh itself by default, used by the class Mesh.
         * Returned type : AbstractMesh
         */
        AbstractMesh.prototype.getLOD = function (camera) {
            return this;
        };
        /**
         * Returns 0 by default, used by the class Mesh.
         * Returns an integer.
         */
        AbstractMesh.prototype.getTotalVertices = function () {
            return 0;
        };
        /**
         * Returns null by default, used by the class Mesh.
         * Returned type : integer array
         */
        AbstractMesh.prototype.getIndices = function () {
            return null;
        };
        /**
         * Returns the array of the requested vertex data kind. Used by the class Mesh. Returns null here.
         * Returned type : float array or Float32Array
         */
        AbstractMesh.prototype.getVerticesData = function (kind) {
            return null;
        };
        /**
         * Sets the vertex data of the mesh geometry for the requested `kind`.
         * If the mesh has no geometry, a new Geometry object is set to the mesh and then passed this vertex data.
         * The `data` are either a numeric array either a Float32Array.
         * The parameter `updatable` is passed as is to the underlying Geometry object constructor (if initianilly none) or updater.
         * The parameter `stride` is an optional positive integer, it is usually automatically deducted from the `kind` (3 for positions or normals, 2 for UV, etc).
         * Note that a new underlying VertexBuffer object is created each call.
         * If the `kind` is the `PositionKind`, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed.
         *
         * Possible `kind` values :
         * - LIB.VertexBuffer.PositionKind
         * - LIB.VertexBuffer.UVKind
         * - LIB.VertexBuffer.UV2Kind
         * - LIB.VertexBuffer.UV3Kind
         * - LIB.VertexBuffer.UV4Kind
         * - LIB.VertexBuffer.UV5Kind
         * - LIB.VertexBuffer.UV6Kind
         * - LIB.VertexBuffer.ColorKind
         * - LIB.VertexBuffer.MatricesIndicesKind
         * - LIB.VertexBuffer.MatricesIndicesExtraKind
         * - LIB.VertexBuffer.MatricesWeightsKind
         * - LIB.VertexBuffer.MatricesWeightsExtraKind
         *
         * Returns the Mesh.
         */
        AbstractMesh.prototype.setVerticesData = function (kind, data, updatable, stride) {
            return this;
        };
        /**
         * Updates the existing vertex data of the mesh geometry for the requested `kind`.
         * If the mesh has no geometry, it is simply returned as it is.
         * The `data` are either a numeric array either a Float32Array.
         * No new underlying VertexBuffer object is created.
         * If the `kind` is the `PositionKind` and if `updateExtends` is true, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed.
         * If the parameter `makeItUnique` is true, a new global geometry is created from this positions and is set to the mesh.
         *
         * Possible `kind` values :
         * - LIB.VertexBuffer.PositionKind
         * - LIB.VertexBuffer.UVKind
         * - LIB.VertexBuffer.UV2Kind
         * - LIB.VertexBuffer.UV3Kind
         * - LIB.VertexBuffer.UV4Kind
         * - LIB.VertexBuffer.UV5Kind
         * - LIB.VertexBuffer.UV6Kind
         * - LIB.VertexBuffer.ColorKind
         * - LIB.VertexBuffer.MatricesIndicesKind
         * - LIB.VertexBuffer.MatricesIndicesExtraKind
         * - LIB.VertexBuffer.MatricesWeightsKind
         * - LIB.VertexBuffer.MatricesWeightsExtraKind
         *
         * Returns the Mesh.
         */
        AbstractMesh.prototype.updateVerticesData = function (kind, data, updateExtends, makeItUnique) {
            return this;
        };
        /**
         * Sets the mesh indices.
         * Expects an array populated with integers or a typed array (Int32Array, Uint32Array, Uint16Array).
         * If the mesh has no geometry, a new Geometry object is created and set to the mesh.
         * This method creates a new index buffer each call.
         * Returns the Mesh.
         */
        AbstractMesh.prototype.setIndices = function (indices, totalVertices) {
            return this;
        };
        /** Returns false by default, used by the class Mesh.
         *  Returns a boolean
        */
        AbstractMesh.prototype.isVerticesDataPresent = function (kind) {
            return false;
        };
        /**
         * Returns the mesh BoundingInfo object or creates a new one and returns it if undefined.
         * Returns a BoundingInfo
         */
        AbstractMesh.prototype.getBoundingInfo = function () {
            if (this._masterMesh) {
                return this._masterMesh.getBoundingInfo();
            }
            if (!this._boundingInfo) {
                // this._boundingInfo is being created here
                this._updateBoundingInfo();
            }
            // cannot be null.
            return this._boundingInfo;
        };
        /**
         * Uniformly scales the mesh to fit inside of a unit cube (1 X 1 X 1 units).
         * @param includeDescendants Take the hierarchy's bounding box instead of the mesh's bounding box.
         */
        AbstractMesh.prototype.normalizeToUnitCube = function (includeDescendants) {
            if (includeDescendants === void 0) { includeDescendants = true; }
            var boundingVectors = this.getHierarchyBoundingVectors(includeDescendants);
            var sizeVec = boundingVectors.max.subtract(boundingVectors.min);
            var maxDimension = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
            if (maxDimension === 0) {
                return this;
            }
            var scale = 1 / maxDimension;
            this.scaling.scaleInPlace(scale);
            return this;
        };
        /**
         * Sets a mesh new object BoundingInfo.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.setBoundingInfo = function (boundingInfo) {
            this._boundingInfo = boundingInfo;
            return this;
        };
        Object.defineProperty(AbstractMesh.prototype, "useBones", {
            get: function () {
                return (this.skeleton && this.getScene().skeletonsEnabled && this.isVerticesDataPresent(LIB.VertexBuffer.MatricesIndicesKind) && this.isVerticesDataPresent(LIB.VertexBuffer.MatricesWeightsKind));
            },
            enumerable: true,
            configurable: true
        });
        AbstractMesh.prototype._preActivate = function () {
        };
        AbstractMesh.prototype._preActivateForIntermediateRendering = function (renderId) {
        };
        AbstractMesh.prototype._activate = function (renderId) {
            this._renderId = renderId;
        };
        /**
         * Returns the latest update of the World matrix
         * Returns a Matrix.
         */
        AbstractMesh.prototype.getWorldMatrix = function () {
            if (this._masterMesh) {
                return this._masterMesh.getWorldMatrix();
            }
            return _super.prototype.getWorldMatrix.call(this);
        };
        /**
         * Returns the latest update of the World matrix determinant.
         */
        AbstractMesh.prototype._getWorldMatrixDeterminant = function () {
            if (this._masterMesh) {
                return this._masterMesh._getWorldMatrixDeterminant();
            }
            return _super.prototype._getWorldMatrixDeterminant.call(this);
        };
        // ================================== Point of View Movement =================================
        /**
         * Perform relative position change from the point of view of behind the front of the mesh.
         * This is performed taking into account the meshes current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward.
         * @param {number} amountRight
         * @param {number} amountUp
         * @param {number} amountForward
         *
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.movePOV = function (amountRight, amountUp, amountForward) {
            this.position.addInPlace(this.calcMovePOV(amountRight, amountUp, amountForward));
            return this;
        };
        /**
         * Calculate relative position change from the point of view of behind the front of the mesh.
         * This is performed taking into account the meshes current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward.
         * @param {number} amountRight
         * @param {number} amountUp
         * @param {number} amountForward
         *
         * Returns a new Vector3.
         */
        AbstractMesh.prototype.calcMovePOV = function (amountRight, amountUp, amountForward) {
            var rotMatrix = new LIB.Matrix();
            var rotQuaternion = (this.rotationQuaternion) ? this.rotationQuaternion : LIB.Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
            rotQuaternion.toRotationMatrix(rotMatrix);
            var translationDelta = LIB.Vector3.Zero();
            var defForwardMult = this.definedFacingForward ? -1 : 1;
            LIB.Vector3.TransformCoordinatesFromFloatsToRef(amountRight * defForwardMult, amountUp, amountForward * defForwardMult, rotMatrix, translationDelta);
            return translationDelta;
        };
        // ================================== Point of View Rotation =================================
        /**
         * Perform relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param {number} flipBack
         * @param {number} twirlClockwise
         * @param {number} tiltRight
         *
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.rotatePOV = function (flipBack, twirlClockwise, tiltRight) {
            this.rotation.addInPlace(this.calcRotatePOV(flipBack, twirlClockwise, tiltRight));
            return this;
        };
        /**
         * Calculate relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param {number} flipBack
         * @param {number} twirlClockwise
         * @param {number} tiltRight
         *
         * Returns a new Vector3.
         */
        AbstractMesh.prototype.calcRotatePOV = function (flipBack, twirlClockwise, tiltRight) {
            var defForwardMult = this.definedFacingForward ? 1 : -1;
            return new LIB.Vector3(flipBack * defForwardMult, twirlClockwise, tiltRight * defForwardMult);
        };
        /**
         * Return the minimum and maximum world vectors of the entire hierarchy under current mesh
         * @param includeDescendants Include bounding info from descendants as well (true by default).
         */
        AbstractMesh.prototype.getHierarchyBoundingVectors = function (includeDescendants) {
            if (includeDescendants === void 0) { includeDescendants = true; }
            this.computeWorldMatrix(true);
            var min;
            var max;
            var boundingInfo = this.getBoundingInfo();
            if (!this.subMeshes) {
                min = new LIB.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                max = new LIB.Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            }
            else {
                min = boundingInfo.boundingBox.minimumWorld;
                max = boundingInfo.boundingBox.maximumWorld;
            }
            if (includeDescendants) {
                var descendants = this.getDescendants(false);
                for (var _i = 0, descendants_1 = descendants; _i < descendants_1.length; _i++) {
                    var descendant = descendants_1[_i];
                    var childMesh = descendant;
                    childMesh.computeWorldMatrix(true);
                    //make sure we have the needed params to get mix and max
                    if (!childMesh.getBoundingInfo || childMesh.getTotalVertices() === 0) {
                        continue;
                    }
                    var childBoundingInfo = childMesh.getBoundingInfo();
                    var boundingBox = childBoundingInfo.boundingBox;
                    var minBox = boundingBox.minimumWorld;
                    var maxBox = boundingBox.maximumWorld;
                    LIB.Tools.CheckExtends(minBox, min, max);
                    LIB.Tools.CheckExtends(maxBox, min, max);
                }
            }
            return {
                min: min,
                max: max
            };
        };
        /**
         * Updates the mesh BoundingInfo object and all its children BoundingInfo objects also.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype._updateBoundingInfo = function () {
            this._boundingInfo = this._boundingInfo || new LIB.BoundingInfo(this.absolutePosition, this.absolutePosition);
            this._boundingInfo.update(this.worldMatrixFromCache);
            this._updateSubMeshesBoundingInfo(this.worldMatrixFromCache);
            return this;
        };
        /**
         * Update a mesh's children BoundingInfo objects only.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype._updateSubMeshesBoundingInfo = function (matrix) {
            if (!this.subMeshes) {
                return this;
            }
            for (var subIndex = 0; subIndex < this.subMeshes.length; subIndex++) {
                var subMesh = this.subMeshes[subIndex];
                if (!subMesh.IsGlobal) {
                    subMesh.updateBoundingInfo(matrix);
                }
            }
            return this;
        };
        AbstractMesh.prototype._afterComputeWorldMatrix = function () {
            // Bounding info
            this._updateBoundingInfo();
        };
        /**
         * Returns `true` if the mesh is within the frustum defined by the passed array of planes.
         * A mesh is in the frustum if its bounding box intersects the frustum.
         * Boolean returned.
         */
        AbstractMesh.prototype.isInFrustum = function (frustumPlanes) {
            return this._boundingInfo !== null && this._boundingInfo.isInFrustum(frustumPlanes);
        };
        /**
         * Returns `true` if the mesh is completely in the frustum defined be the passed array of planes.
         * A mesh is completely in the frustum if its bounding box it completely inside the frustum.
         * Boolean returned.
         */
        AbstractMesh.prototype.isCompletelyInFrustum = function (frustumPlanes) {
            return this._boundingInfo !== null && this._boundingInfo.isCompletelyInFrustum(frustumPlanes);
            ;
        };
        /**
         * True if the mesh intersects another mesh or a SolidParticle object.
         * Unless the parameter `precise` is set to `true` the intersection is computed according to Axis Aligned Bounding Boxes (AABB), else according to OBB (Oriented BBoxes)
         * includeDescendants can be set to true to test if the mesh defined in parameters intersects with the current mesh or any child meshes
         * Returns a boolean.
         */
        AbstractMesh.prototype.intersectsMesh = function (mesh, precise, includeDescendants) {
            if (precise === void 0) { precise = false; }
            if (!this._boundingInfo || !mesh._boundingInfo) {
                return false;
            }
            if (this._boundingInfo.intersects(mesh._boundingInfo, precise)) {
                return true;
            }
            if (includeDescendants) {
                for (var _i = 0, _a = this.getChildMeshes(); _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child.intersectsMesh(mesh, precise, true)) {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * Returns true if the passed point (Vector3) is inside the mesh bounding box.
         * Returns a boolean.
         */
        AbstractMesh.prototype.intersectsPoint = function (point) {
            if (!this._boundingInfo) {
                return false;
            }
            return this._boundingInfo.intersectsPoint(point);
        };
        AbstractMesh.prototype.getPhysicsImpostor = function () {
            return this.physicsImpostor;
        };
        AbstractMesh.prototype.getPositionInCameraSpace = function (camera) {
            if (camera === void 0) { camera = null; }
            if (!camera) {
                camera = this.getScene().activeCamera;
            }
            return LIB.Vector3.TransformCoordinates(this.absolutePosition, camera.getViewMatrix());
        };
        /**
         * Returns the distance from the mesh to the active camera.
         * Returns a float.
         */
        AbstractMesh.prototype.getDistanceToCamera = function (camera) {
            if (camera === void 0) { camera = null; }
            if (!camera) {
                camera = this.getScene().activeCamera;
            }
            return this.absolutePosition.subtract(camera.position).length();
        };
        AbstractMesh.prototype.applyImpulse = function (force, contactPoint) {
            if (!this.physicsImpostor) {
                return this;
            }
            this.physicsImpostor.applyImpulse(force, contactPoint);
            return this;
        };
        AbstractMesh.prototype.setPhysicsLinkWith = function (otherMesh, pivot1, pivot2, options) {
            if (!this.physicsImpostor || !otherMesh.physicsImpostor) {
                return this;
            }
            this.physicsImpostor.createJoint(otherMesh.physicsImpostor, LIB.PhysicsJoint.HingeJoint, {
                mainPivot: pivot1,
                connectedPivot: pivot2,
                nativeParams: options
            });
            return this;
        };
        Object.defineProperty(AbstractMesh.prototype, "checkCollisions", {
            // Collisions
            /**
             * Property checkCollisions : Boolean, whether the camera should check the collisions against the mesh.
             * Default `false`.
             */
            get: function () {
                return this._checkCollisions;
            },
            set: function (collisionEnabled) {
                this._checkCollisions = collisionEnabled;
                if (this.getScene().workerCollisions) {
                    this.getScene().collisionCoordinator.onMeshUpdated(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "collider", {
            /**
             * Gets Collider object used to compute collisions (not physics)
             */
            get: function () {
                return this._collider;
            },
            enumerable: true,
            configurable: true
        });
        AbstractMesh.prototype.moveWithCollisions = function (displacement) {
            var globalPosition = this.getAbsolutePosition();
            globalPosition.addToRef(this.ellipsoidOffset, this._oldPositionForCollisions);
            if (!this._collider) {
                this._collider = new LIB.Collider();
            }
            this._collider._radius = this.ellipsoid;
            this.getScene().collisionCoordinator.getNewPosition(this._oldPositionForCollisions, displacement, this._collider, 3, this, this._onCollisionPositionChange, this.uniqueId);
            return this;
        };
        // Submeshes octree
        /**
        * This function will create an octree to help to select the right submeshes for rendering, picking and collision computations.
        * Please note that you must have a decent number of submeshes to get performance improvements when using an octree.
        * Returns an Octree of submeshes.
        */
        AbstractMesh.prototype.createOrUpdateSubmeshesOctree = function (maxCapacity, maxDepth) {
            if (maxCapacity === void 0) { maxCapacity = 64; }
            if (maxDepth === void 0) { maxDepth = 2; }
            if (!this._submeshesOctree) {
                this._submeshesOctree = new LIB.Octree(LIB.Octree.CreationFuncForSubMeshes, maxCapacity, maxDepth);
            }
            this.computeWorldMatrix(true);
            var boundingInfo = this.getBoundingInfo();
            // Update octree
            var bbox = boundingInfo.boundingBox;
            this._submeshesOctree.update(bbox.minimumWorld, bbox.maximumWorld, this.subMeshes);
            return this._submeshesOctree;
        };
        // Collisions
        AbstractMesh.prototype._collideForSubMesh = function (subMesh, transformMatrix, collider) {
            this._generatePointsArray();
            if (!this._positions) {
                return this;
            }
            // Transformation
            if (!subMesh._lastColliderWorldVertices || !subMesh._lastColliderTransformMatrix.equals(transformMatrix)) {
                subMesh._lastColliderTransformMatrix = transformMatrix.clone();
                subMesh._lastColliderWorldVertices = [];
                subMesh._trianglePlanes = [];
                var start = subMesh.verticesStart;
                var end = (subMesh.verticesStart + subMesh.verticesCount);
                for (var i = start; i < end; i++) {
                    subMesh._lastColliderWorldVertices.push(LIB.Vector3.TransformCoordinates(this._positions[i], transformMatrix));
                }
            }
            // Collide
            collider._collide(subMesh._trianglePlanes, subMesh._lastColliderWorldVertices, this.getIndices(), subMesh.indexStart, subMesh.indexStart + subMesh.indexCount, subMesh.verticesStart, !!subMesh.getMaterial());
            if (collider.collisionFound) {
                collider.collidedMesh = this;
            }
            return this;
        };
        AbstractMesh.prototype._processCollisionsForSubMeshes = function (collider, transformMatrix) {
            var subMeshes;
            var len;
            // Octrees
            if (this._submeshesOctree && this.useOctreeForCollisions) {
                var radius = collider._velocityWorldLength + Math.max(collider._radius.x, collider._radius.y, collider._radius.z);
                var intersections = this._submeshesOctree.intersects(collider._basePointWorld, radius);
                len = intersections.length;
                subMeshes = intersections.data;
            }
            else {
                subMeshes = this.subMeshes;
                len = subMeshes.length;
            }
            for (var index = 0; index < len; index++) {
                var subMesh = subMeshes[index];
                // Bounding test
                if (len > 1 && !subMesh._checkCollision(collider))
                    continue;
                this._collideForSubMesh(subMesh, transformMatrix, collider);
            }
            return this;
        };
        AbstractMesh.prototype._checkCollision = function (collider) {
            // Bounding box test
            if (!this._boundingInfo || !this._boundingInfo._checkCollision(collider))
                return this;
            // Transformation matrix
            LIB.Matrix.ScalingToRef(1.0 / collider._radius.x, 1.0 / collider._radius.y, 1.0 / collider._radius.z, this._collisionsScalingMatrix);
            this.worldMatrixFromCache.multiplyToRef(this._collisionsScalingMatrix, this._collisionsTransformMatrix);
            this._processCollisionsForSubMeshes(collider, this._collisionsTransformMatrix);
            return this;
        };
        // Picking
        AbstractMesh.prototype._generatePointsArray = function () {
            return false;
        };
        /**
         * Checks if the passed Ray intersects with the mesh.
         * Returns an object PickingInfo.
         */
        AbstractMesh.prototype.intersects = function (ray, fastCheck) {
            var pickingInfo = new LIB.PickingInfo();
            if (!this.subMeshes || !this._boundingInfo || !ray.intersectsSphere(this._boundingInfo.boundingSphere) || !ray.intersectsBox(this._boundingInfo.boundingBox)) {
                return pickingInfo;
            }
            if (!this._generatePointsArray()) {
                return pickingInfo;
            }
            var intersectInfo = null;
            // Octrees
            var subMeshes;
            var len;
            if (this._submeshesOctree && this.useOctreeForPicking) {
                var worldRay = LIB.Ray.Transform(ray, this.getWorldMatrix());
                var intersections = this._submeshesOctree.intersectsRay(worldRay);
                len = intersections.length;
                subMeshes = intersections.data;
            }
            else {
                subMeshes = this.subMeshes;
                len = subMeshes.length;
            }
            for (var index = 0; index < len; index++) {
                var subMesh = subMeshes[index];
                // Bounding test
                if (len > 1 && !subMesh.canIntersects(ray))
                    continue;
                var currentIntersectInfo = subMesh.intersects(ray, this._positions, this.getIndices(), fastCheck);
                if (currentIntersectInfo) {
                    if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
                        intersectInfo = currentIntersectInfo;
                        intersectInfo.subMeshId = index;
                        if (fastCheck) {
                            break;
                        }
                    }
                }
            }
            if (intersectInfo) {
                // Get picked point
                var world = this.getWorldMatrix();
                var worldOrigin = LIB.Vector3.TransformCoordinates(ray.origin, world);
                var direction = ray.direction.clone();
                direction = direction.scale(intersectInfo.distance);
                var worldDirection = LIB.Vector3.TransformNormal(direction, world);
                var pickedPoint = worldOrigin.add(worldDirection);
                // Return result
                pickingInfo.hit = true;
                pickingInfo.distance = LIB.Vector3.Distance(worldOrigin, pickedPoint);
                pickingInfo.pickedPoint = pickedPoint;
                pickingInfo.pickedMesh = this;
                pickingInfo.bu = intersectInfo.bu || 0;
                pickingInfo.bv = intersectInfo.bv || 0;
                pickingInfo.faceId = intersectInfo.faceId;
                pickingInfo.subMeshId = intersectInfo.subMeshId;
                return pickingInfo;
            }
            return pickingInfo;
        };
        /**
         * Clones the mesh, used by the class Mesh.
         * Just returns `null` for an AbstractMesh.
         */
        AbstractMesh.prototype.clone = function (name, newParent, doNotCloneChildren) {
            return null;
        };
        /**
         * Disposes all the mesh submeshes.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.releaseSubMeshes = function () {
            if (this.subMeshes) {
                while (this.subMeshes.length) {
                    this.subMeshes[0].dispose();
                }
            }
            else {
                this.subMeshes = new Array();
            }
            return this;
        };
        /**
         * Disposes the AbstractMesh.
         * By default, all the mesh children are also disposed unless the parameter `doNotRecurse` is set to `true`.
         * Returns nothing.
         */
        AbstractMesh.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
            var _this = this;
            if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
            var index;
            // Action manager
            if (this.actionManager) {
                this.actionManager.dispose();
                this.actionManager = null;
            }
            // Skeleton
            this.skeleton = null;
            // Physics
            if (this.physicsImpostor) {
                this.physicsImpostor.dispose();
            }
            // Intersections in progress
            for (index = 0; index < this._intersectionsInProgress.length; index++) {
                var other = this._intersectionsInProgress[index];
                var pos = other._intersectionsInProgress.indexOf(this);
                other._intersectionsInProgress.splice(pos, 1);
            }
            this._intersectionsInProgress = [];
            // Lights
            var lights = this.getScene().lights;
            lights.forEach(function (light) {
                var meshIndex = light.includedOnlyMeshes.indexOf(_this);
                if (meshIndex !== -1) {
                    light.includedOnlyMeshes.splice(meshIndex, 1);
                }
                meshIndex = light.excludedMeshes.indexOf(_this);
                if (meshIndex !== -1) {
                    light.excludedMeshes.splice(meshIndex, 1);
                }
                // Shadow generators
                var generator = light.getShadowGenerator();
                if (generator) {
                    var shadowMap = generator.getShadowMap();
                    if (shadowMap && shadowMap.renderList) {
                        meshIndex = shadowMap.renderList.indexOf(_this);
                        if (meshIndex !== -1) {
                            shadowMap.renderList.splice(meshIndex, 1);
                        }
                    }
                }
            });
            // Edges
            if (this._edgesRenderer) {
                this._edgesRenderer.dispose();
                this._edgesRenderer = null;
            }
            // SubMeshes
            if (this.getClassName() !== "InstancedMesh") {
                this.releaseSubMeshes();
            }
            // Octree
            var sceneOctree = this.getScene().selectionOctree;
            if (sceneOctree) {
                var index = sceneOctree.dynamicContent.indexOf(this);
                if (index !== -1) {
                    sceneOctree.dynamicContent.splice(index, 1);
                }
            }
            // Query
            var engine = this.getScene().getEngine();
            if (this._occlusionQuery) {
                this._isOcclusionQueryInProgress = false;
                engine.deleteQuery(this._occlusionQuery);
                this._occlusionQuery = null;
            }
            // Engine
            engine.wipeCaches();
            // Remove from scene
            this.getScene().removeMesh(this);
            if (disposeMaterialAndTextures) {
                if (this.material) {
                    this.material.dispose(false, true);
                }
            }
            if (!doNotRecurse) {
                // Particles
                for (index = 0; index < this.getScene().particleSystems.length; index++) {
                    if (this.getScene().particleSystems[index].emitter === this) {
                        this.getScene().particleSystems[index].dispose();
                        index--;
                    }
                }
            }
            // facet data
            if (this._facetDataEnabled) {
                this.disableFacetData();
            }
            this.onAfterWorldMatrixUpdateObservable.clear();
            this.onCollideObservable.clear();
            this.onCollisionPositionChangeObservable.clear();
            this._isDisposed = true;
            _super.prototype.dispose.call(this, doNotRecurse);
        };
        /**
         * Adds the passed mesh as a child to the current mesh.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.addChild = function (mesh) {
            mesh.setParent(this);
            return this;
        };
        /**
         * Removes the passed mesh from the current mesh children list.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.removeChild = function (mesh) {
            mesh.setParent(null);
            return this;
        };
        // Facet data
        /**
         *  Initialize the facet data arrays : facetNormals, facetPositions and facetPartitioning.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype._initFacetData = function () {
            if (!this._facetNormals) {
                this._facetNormals = new Array();
            }
            if (!this._facetPositions) {
                this._facetPositions = new Array();
            }
            if (!this._facetPartitioning) {
                this._facetPartitioning = new Array();
            }
            this._facetNb = (this.getIndices().length / 3) | 0;
            this._partitioningSubdivisions = (this._partitioningSubdivisions) ? this._partitioningSubdivisions : 10; // default nb of partitioning subdivisions = 10
            this._partitioningBBoxRatio = (this._partitioningBBoxRatio) ? this._partitioningBBoxRatio : 1.01; // default ratio 1.01 = the partitioning is 1% bigger than the bounding box
            for (var f = 0; f < this._facetNb; f++) {
                this._facetNormals[f] = LIB.Vector3.Zero();
                this._facetPositions[f] = LIB.Vector3.Zero();
            }
            this._facetDataEnabled = true;
            return this;
        };
        /**
         * Updates the mesh facetData arrays and the internal partitioning when the mesh is morphed or updated.
         * This method can be called within the render loop.
         * You don't need to call this method by yourself in the render loop when you update/morph a mesh with the methods CreateXXX() as they automatically manage this computation.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.updateFacetData = function () {
            if (!this._facetDataEnabled) {
                this._initFacetData();
            }
            var positions = this.getVerticesData(LIB.VertexBuffer.PositionKind);
            var indices = this.getIndices();
            var normals = this.getVerticesData(LIB.VertexBuffer.NormalKind);
            var bInfo = this.getBoundingInfo();
            if (this._facetDepthSort && !this._facetDepthSortEnabled) {
                // init arrays, matrix and sort function on first call
                this._facetDepthSortEnabled = true;
                if (indices instanceof Uint16Array) {
                    this._depthSortedIndices = new Uint16Array(indices);
                }
                else if (indices instanceof Uint32Array) {
                    this._depthSortedIndices = new Uint32Array(indices);
                }
                else {
                    var needs32bits = false;
                    for (var i = 0; i < indices.length; i++) {
                        if (indices[i] > 65535) {
                            needs32bits = true;
                            break;
                        }
                    }
                    if (needs32bits) {
                        this._depthSortedIndices = new Uint32Array(indices);
                    }
                    else {
                        this._depthSortedIndices = new Uint16Array(indices);
                    }
                }
                this._facetDepthSortFunction = function (f1, f2) {
                    return (f2.sqDistance - f1.sqDistance);
                };
                if (!this._facetDepthSortFrom) {
                    var camera = this.getScene().activeCamera;
                    this._facetDepthSortFrom = (camera) ? camera.position : LIB.Vector3.Zero();
                }
                this._depthSortedFacets = [];
                for (var f = 0; f < this._facetNb; f++) {
                    var depthSortedFacet = { ind: f * 3, sqDistance: 0.0 };
                    this._depthSortedFacets.push(depthSortedFacet);
                }
                this._invertedMatrix = LIB.Matrix.Identity();
                this._facetDepthSortOrigin = LIB.Vector3.Zero();
            }
            this._bbSize.x = (bInfo.maximum.x - bInfo.minimum.x > LIB.Epsilon) ? bInfo.maximum.x - bInfo.minimum.x : LIB.Epsilon;
            this._bbSize.y = (bInfo.maximum.y - bInfo.minimum.y > LIB.Epsilon) ? bInfo.maximum.y - bInfo.minimum.y : LIB.Epsilon;
            this._bbSize.z = (bInfo.maximum.z - bInfo.minimum.z > LIB.Epsilon) ? bInfo.maximum.z - bInfo.minimum.z : LIB.Epsilon;
            var bbSizeMax = (this._bbSize.x > this._bbSize.y) ? this._bbSize.x : this._bbSize.y;
            bbSizeMax = (bbSizeMax > this._bbSize.z) ? bbSizeMax : this._bbSize.z;
            this._subDiv.max = this._partitioningSubdivisions;
            this._subDiv.X = Math.floor(this._subDiv.max * this._bbSize.x / bbSizeMax); // adjust the number of subdivisions per axis
            this._subDiv.Y = Math.floor(this._subDiv.max * this._bbSize.y / bbSizeMax); // according to each bbox size per axis
            this._subDiv.Z = Math.floor(this._subDiv.max * this._bbSize.z / bbSizeMax);
            this._subDiv.X = this._subDiv.X < 1 ? 1 : this._subDiv.X; // at least one subdivision
            this._subDiv.Y = this._subDiv.Y < 1 ? 1 : this._subDiv.Y;
            this._subDiv.Z = this._subDiv.Z < 1 ? 1 : this._subDiv.Z;
            // set the parameters for ComputeNormals()
            this._facetParameters.facetNormals = this.getFacetLocalNormals();
            this._facetParameters.facetPositions = this.getFacetLocalPositions();
            this._facetParameters.facetPartitioning = this.getFacetLocalPartitioning();
            this._facetParameters.bInfo = bInfo;
            this._facetParameters.bbSize = this._bbSize;
            this._facetParameters.subDiv = this._subDiv;
            this._facetParameters.ratio = this.partitioningBBoxRatio;
            this._facetParameters.depthSort = this._facetDepthSort;
            if (this._facetDepthSort && this._facetDepthSortEnabled) {
                this.computeWorldMatrix(true);
                this._worldMatrix.invertToRef(this._invertedMatrix);
                LIB.Vector3.TransformCoordinatesToRef(this._facetDepthSortFrom, this._invertedMatrix, this._facetDepthSortOrigin);
                this._facetParameters.distanceTo = this._facetDepthSortOrigin;
            }
            this._facetParameters.depthSortedFacets = this._depthSortedFacets;
            LIB.VertexData.ComputeNormals(positions, indices, normals, this._facetParameters);
            if (this._facetDepthSort && this._facetDepthSortEnabled) {
                this._depthSortedFacets.sort(this._facetDepthSortFunction);
                var l = (this._depthSortedIndices.length / 3) | 0;
                for (var f = 0; f < l; f++) {
                    var sind = this._depthSortedFacets[f].ind;
                    this._depthSortedIndices[f * 3] = indices[sind];
                    this._depthSortedIndices[f * 3 + 1] = indices[sind + 1];
                    this._depthSortedIndices[f * 3 + 2] = indices[sind + 2];
                }
                this.updateIndices(this._depthSortedIndices);
            }
            return this;
        };
        /**
         * Returns the facetLocalNormals array.
         * The normals are expressed in the mesh local space.
         */
        AbstractMesh.prototype.getFacetLocalNormals = function () {
            if (!this._facetNormals) {
                this.updateFacetData();
            }
            return this._facetNormals;
        };
        /**
         * Returns the facetLocalPositions array.
         * The facet positions are expressed in the mesh local space.
         */
        AbstractMesh.prototype.getFacetLocalPositions = function () {
            if (!this._facetPositions) {
                this.updateFacetData();
            }
            return this._facetPositions;
        };
        /**
         * Returns the facetLocalPartioning array.
         */
        AbstractMesh.prototype.getFacetLocalPartitioning = function () {
            if (!this._facetPartitioning) {
                this.updateFacetData();
            }
            return this._facetPartitioning;
        };
        /**
         * Returns the i-th facet position in the world system.
         * This method allocates a new Vector3 per call.
         */
        AbstractMesh.prototype.getFacetPosition = function (i) {
            var pos = LIB.Vector3.Zero();
            this.getFacetPositionToRef(i, pos);
            return pos;
        };
        /**
         * Sets the reference Vector3 with the i-th facet position in the world system.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.getFacetPositionToRef = function (i, ref) {
            var localPos = (this.getFacetLocalPositions())[i];
            var world = this.getWorldMatrix();
            LIB.Vector3.TransformCoordinatesToRef(localPos, world, ref);
            return this;
        };
        /**
         * Returns the i-th facet normal in the world system.
         * This method allocates a new Vector3 per call.
         */
        AbstractMesh.prototype.getFacetNormal = function (i) {
            var norm = LIB.Vector3.Zero();
            this.getFacetNormalToRef(i, norm);
            return norm;
        };
        /**
         * Sets the reference Vector3 with the i-th facet normal in the world system.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.getFacetNormalToRef = function (i, ref) {
            var localNorm = (this.getFacetLocalNormals())[i];
            LIB.Vector3.TransformNormalToRef(localNorm, this.getWorldMatrix(), ref);
            return this;
        };
        /**
         * Returns the facets (in an array) in the same partitioning block than the one the passed coordinates are located (expressed in the mesh local system).
         */
        AbstractMesh.prototype.getFacetsAtLocalCoordinates = function (x, y, z) {
            var bInfo = this.getBoundingInfo();
            var ox = Math.floor((x - bInfo.minimum.x * this._partitioningBBoxRatio) * this._subDiv.X * this._partitioningBBoxRatio / this._bbSize.x);
            var oy = Math.floor((y - bInfo.minimum.y * this._partitioningBBoxRatio) * this._subDiv.Y * this._partitioningBBoxRatio / this._bbSize.y);
            var oz = Math.floor((z - bInfo.minimum.z * this._partitioningBBoxRatio) * this._subDiv.Z * this._partitioningBBoxRatio / this._bbSize.z);
            if (ox < 0 || ox > this._subDiv.max || oy < 0 || oy > this._subDiv.max || oz < 0 || oz > this._subDiv.max) {
                return null;
            }
            return this._facetPartitioning[ox + this._subDiv.max * oy + this._subDiv.max * this._subDiv.max * oz];
        };
        /**
         * Returns the closest mesh facet index at (x,y,z) World coordinates, null if not found.
         * If the parameter projected (vector3) is passed, it is set as the (x,y,z) World projection on the facet.
         * If checkFace is true (default false), only the facet "facing" to (x,y,z) or only the ones "turning their backs", according to the parameter "facing" are returned.
         * If facing and checkFace are true, only the facet "facing" to (x, y, z) are returned : positive dot (x, y, z) * facet position.
         * If facing si false and checkFace is true, only the facet "turning their backs" to (x, y, z) are returned : negative dot (x, y, z) * facet position.
         */
        AbstractMesh.prototype.getClosestFacetAtCoordinates = function (x, y, z, projected, checkFace, facing) {
            if (checkFace === void 0) { checkFace = false; }
            if (facing === void 0) { facing = true; }
            var world = this.getWorldMatrix();
            var invMat = LIB.Tmp.Matrix[5];
            world.invertToRef(invMat);
            var invVect = LIB.Tmp.Vector3[8];
            LIB.Vector3.TransformCoordinatesFromFloatsToRef(x, y, z, invMat, invVect); // transform (x,y,z) to coordinates in the mesh local space
            var closest = this.getClosestFacetAtLocalCoordinates(invVect.x, invVect.y, invVect.z, projected, checkFace, facing);
            if (projected) {
                // tranform the local computed projected vector to world coordinates
                LIB.Vector3.TransformCoordinatesFromFloatsToRef(projected.x, projected.y, projected.z, world, projected);
            }
            return closest;
        };
        /**
         * Returns the closest mesh facet index at (x,y,z) local coordinates, null if not found.
         * If the parameter projected (vector3) is passed, it is set as the (x,y,z) local projection on the facet.
         * If checkFace is true (default false), only the facet "facing" to (x,y,z) or only the ones "turning their backs", according to the parameter "facing" are returned.
         * If facing and checkFace are true, only the facet "facing" to (x, y, z) are returned : positive dot (x, y, z) * facet position.
         * If facing si false and checkFace is true, only the facet "turning their backs"  to (x, y, z) are returned : negative dot (x, y, z) * facet position.
         */
        AbstractMesh.prototype.getClosestFacetAtLocalCoordinates = function (x, y, z, projected, checkFace, facing) {
            if (checkFace === void 0) { checkFace = false; }
            if (facing === void 0) { facing = true; }
            var closest = null;
            var tmpx = 0.0;
            var tmpy = 0.0;
            var tmpz = 0.0;
            var d = 0.0; // tmp dot facet normal * facet position
            var t0 = 0.0;
            var projx = 0.0;
            var projy = 0.0;
            var projz = 0.0;
            // Get all the facets in the same partitioning block than (x, y, z)
            var facetPositions = this.getFacetLocalPositions();
            var facetNormals = this.getFacetLocalNormals();
            var facetsInBlock = this.getFacetsAtLocalCoordinates(x, y, z);
            if (!facetsInBlock) {
                return null;
            }
            // Get the closest facet to (x, y, z)
            var shortest = Number.MAX_VALUE; // init distance vars
            var tmpDistance = shortest;
            var fib; // current facet in the block
            var norm; // current facet normal
            var p0; // current facet barycenter position
            // loop on all the facets in the current partitioning block
            for (var idx = 0; idx < facetsInBlock.length; idx++) {
                fib = facetsInBlock[idx];
                norm = facetNormals[fib];
                p0 = facetPositions[fib];
                d = (x - p0.x) * norm.x + (y - p0.y) * norm.y + (z - p0.z) * norm.z;
                if (!checkFace || (checkFace && facing && d >= 0.0) || (checkFace && !facing && d <= 0.0)) {
                    // compute (x,y,z) projection on the facet = (projx, projy, projz)
                    d = norm.x * p0.x + norm.y * p0.y + norm.z * p0.z;
                    t0 = -(norm.x * x + norm.y * y + norm.z * z - d) / (norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);
                    projx = x + norm.x * t0;
                    projy = y + norm.y * t0;
                    projz = z + norm.z * t0;
                    tmpx = projx - x;
                    tmpy = projy - y;
                    tmpz = projz - z;
                    tmpDistance = tmpx * tmpx + tmpy * tmpy + tmpz * tmpz; // compute length between (x, y, z) and its projection on the facet
                    if (tmpDistance < shortest) {
                        shortest = tmpDistance;
                        closest = fib;
                        if (projected) {
                            projected.x = projx;
                            projected.y = projy;
                            projected.z = projz;
                        }
                    }
                }
            }
            return closest;
        };
        /**
         * Returns the object "parameter" set with all the expected parameters for facetData computation by ComputeNormals()
         */
        AbstractMesh.prototype.getFacetDataParameters = function () {
            return this._facetParameters;
        };
        /**
         * Disables the feature FacetData and frees the related memory.
         * Returns the AbstractMesh.
         */
        AbstractMesh.prototype.disableFacetData = function () {
            if (this._facetDataEnabled) {
                this._facetDataEnabled = false;
                this._facetPositions = new Array();
                this._facetNormals = new Array();
                this._facetPartitioning = new Array();
                this._facetParameters = null;
                this._depthSortedIndices = new Uint32Array(0);
            }
            return this;
        };
        /**
         * Updates the AbstractMesh indices array. Actually, used by the Mesh object.
         * Returns the mesh.
         */
        AbstractMesh.prototype.updateIndices = function (indices) {
            return this;
        };
        /**
         * The mesh Geometry. Actually used by the Mesh object.
         * Returns a blank geometry object.
         */
        /**
         * Creates new normals data for the mesh.
         * @param updatable.
         */
        AbstractMesh.prototype.createNormals = function (updatable) {
            var positions = this.getVerticesData(LIB.VertexBuffer.PositionKind);
            var indices = this.getIndices();
            var normals;
            if (this.isVerticesDataPresent(LIB.VertexBuffer.NormalKind)) {
                normals = this.getVerticesData(LIB.VertexBuffer.NormalKind);
            }
            else {
                normals = [];
            }
            LIB.VertexData.ComputeNormals(positions, indices, normals, { useRightHandedSystem: this.getScene().useRightHandedSystem });
            this.setVerticesData(LIB.VertexBuffer.NormalKind, normals, updatable);
        };
        /**
         * Align the mesh with a normal.
         * Returns the mesh.
         */
        AbstractMesh.prototype.alignWithNormal = function (normal, upDirection) {
            if (!upDirection) {
                upDirection = LIB.Axis.Y;
            }
            var axisX = LIB.Tmp.Vector3[0];
            var axisZ = LIB.Tmp.Vector3[1];
            LIB.Vector3.CrossToRef(upDirection, normal, axisZ);
            LIB.Vector3.CrossToRef(normal, axisZ, axisX);
            if (this.rotationQuaternion) {
                LIB.Quaternion.RotationQuaternionFromAxisToRef(axisX, normal, axisZ, this.rotationQuaternion);
            }
            else {
                LIB.Vector3.RotationFromAxisToRef(axisX, normal, axisZ, this.rotation);
            }
            return this;
        };
        AbstractMesh.prototype.checkOcclusionQuery = function () {
            var engine = this.getEngine();
            if (engine.webGLVersion < 2 || this.occlusionType === AbstractMesh.OCCLUSION_TYPE_NONE) {
                this._isOccluded = false;
                return;
            }
            if (this.isOcclusionQueryInProgress && this._occlusionQuery) {
                var isOcclusionQueryAvailable = engine.isQueryResultAvailable(this._occlusionQuery);
                if (isOcclusionQueryAvailable) {
                    var occlusionQueryResult = engine.getQueryResult(this._occlusionQuery);
                    this._isOcclusionQueryInProgress = false;
                    this._occlusionInternalRetryCounter = 0;
                    this._isOccluded = occlusionQueryResult === 1 ? false : true;
                }
                else {
                    this._occlusionInternalRetryCounter++;
                    if (this.occlusionRetryCount !== -1 && this._occlusionInternalRetryCounter > this.occlusionRetryCount) {
                        this._isOcclusionQueryInProgress = false;
                        this._occlusionInternalRetryCounter = 0;
                        // if optimistic set isOccluded to false regardless of the status of isOccluded. (Render in the current render loop)
                        // if strict continue the last state of the object.
                        this._isOccluded = this.occlusionType === AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC ? false : this._isOccluded;
                    }
                    else {
                        return;
                    }
                }
            }
            var scene = this.getScene();
            var occlusionBoundingBoxRenderer = scene.getBoundingBoxRenderer();
            if (!this._occlusionQuery) {
                this._occlusionQuery = engine.createQuery();
            }
            engine.beginOcclusionQuery(this.occlusionQueryAlgorithmType, this._occlusionQuery);
            occlusionBoundingBoxRenderer.renderOcclusionBoundingBox(this);
            engine.endOcclusionQuery(this.occlusionQueryAlgorithmType);
            this._isOcclusionQueryInProgress = true;
        };
        AbstractMesh.OCCLUSION_TYPE_NONE = 0;
        AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC = 1;
        AbstractMesh.OCCLUSION_TYPE_STRICT = 2;
        AbstractMesh.OCCLUSION_ALGORITHM_TYPE_ACCURATE = 0;
        AbstractMesh.OCCLUSION_ALGORITHM_TYPE_CONSERVATIVE = 1;
        return AbstractMesh;
    }(LIB.TransformNode));
    LIB.AbstractMesh = AbstractMesh;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.abstractMesh.js.map
