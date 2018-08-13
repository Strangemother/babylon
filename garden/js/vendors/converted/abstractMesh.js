

var LIB;
(function (LIB) {
    /**
     * Class used to store all common mesh properties
     */
    var AbstractMesh = /** @class */ (function (_super) {
        __extends(AbstractMesh, _super);
        // Constructor
        /**
         * Creates a new AbstractMesh
         * @param name defines the name of the mesh
         * @param scene defines the hosting scene
         */
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
            */
            _this.onCollideObservable = new LIB.Observable();
            /**
            * An event triggered when the collision's position changes
            */
            _this.onCollisionPositionChangeObservable = new LIB.Observable();
            /**
            * An event triggered when material is changed
            */
            _this.onMaterialChangedObservable = new LIB.Observable();
            // Properties
            /**
             * Gets or sets the orientation for POV movement & rotation
             */
            _this.definedFacingForward = true;
            /**
            * This property determines the type of occlusion query algorithm to run in WebGl, you can use:
            * * AbstractMesh.OCCLUSION_ALGORITHM_TYPE_ACCURATE which is mapped to GL_ANY_SAMPLES_PASSED.
            * * AbstractMesh.OCCLUSION_ALGORITHM_TYPE_CONSERVATIVE (Default Value) which is mapped to GL_ANY_SAMPLES_PASSED_CONSERVATIVE which is a false positive algorithm that is faster than GL_ANY_SAMPLES_PASSED but less accurate.
            * @see http://doc.LIBjs.com/features/occlusionquery
            */
            _this.occlusionQueryAlgorithmType = AbstractMesh.OCCLUSION_ALGORITHM_TYPE_CONSERVATIVE;
            /**
             * This property is responsible for starting the occlusion query within the Mesh or not, this property is also used to determine what should happen when the occlusionRetryCount is reached. It has supports 3 values:
             * * OCCLUSION_TYPE_NONE (Default Value): this option means no occlusion query whith the Mesh.
             * * OCCLUSION_TYPE_OPTIMISTIC: this option is means use occlusion query and if occlusionRetryCount is reached and the query is broken show the mesh.
             * * OCCLUSION_TYPE_STRICT: this option is means use occlusion query and if occlusionRetryCount is reached and the query is broken restore the last state of the mesh occlusion if the mesh was visible then show the mesh if was hidden then hide don't show.
             * @see http://doc.LIBjs.com/features/occlusionquery
             */
            _this.occlusionType = AbstractMesh.OCCLUSION_TYPE_NONE;
            /**
            * This number indicates the number of allowed retries before stop the occlusion query, this is useful if the occlusion query is taking long time before to the query result is retireved, the query result indicates if the object is visible within the scene or not and based on that LIB.Js engine decideds to show or hide the object.
            * The default value is -1 which means don't break the query and wait till the result
            * @see http://doc.LIBjs.com/features/occlusionquery
            */
            _this.occlusionRetryCount = -1;
            _this._occlusionInternalRetryCounter = 0;
            _this._isOccluded = false;
            _this._isOcclusionQueryInProgress = false;
            _this._visibility = 1.0;
            /** Gets or sets the alpha index used to sort transparent meshes
             * @see http://doc.LIBjs.com/resources/transparency_and_how_meshes_are_rendered#alpha-index
             */
            _this.alphaIndex = Number.MAX_VALUE;
            /**
             * Gets or sets a boolean indicating if the mesh is visible (renderable). Default is true
             */
            _this.isVisible = true;
            /**
             * Gets or sets a boolean indicating if the mesh can be picked (by scene.pick for instance or through actions). Default is true
             */
            _this.isPickable = true;
            /**
             * Gets or sets a boolean indicating if the bounding box must be rendered as well (false by default)
             */
            _this.showBoundingBox = false;
            /** Gets or sets a boolean indicating that bounding boxes of subMeshes must be rendered as well (false by default) */
            _this.showSubMeshesBoundingBox = false;
            /** Gets or sets a boolean indicating if the mesh must be considered as a ray blocker for lens flares (false by default)
             * @see http://doc.LIBjs.com/how_to/how_to_use_lens_flares
             */
            _this.isBlocker = false;
            /**
             * Gets or sets a boolean indicating that pointer move events must be supported on this mesh (false by default)
             */
            _this.enablePointerMoveEvents = false;
            /**
             * Specifies the rendering group id for this mesh (0 by default)
             * @see http://doc.LIBjs.com/resources/transparency_and_how_meshes_are_rendered#rendering-groups
             */
            _this.renderingGroupId = 0;
            _this._receiveShadows = false;
            /**
             * Gets or sets a boolean indicating if the outline must be rendered as well
             * @see https://www.LIBjs-playground.com/#10WJ5S#3
             */
            _this.renderOutline = false;
            /** Defines color to use when rendering outline */
            _this.outlineColor = LIB.Color3.Red();
            /** Define width to use when rendering outline */
            _this.outlineWidth = 0.02;
            /**
             * Gets or sets a boolean indicating if the overlay must be rendered as well
             * @see https://www.LIBjs-playground.com/#10WJ5S#2
             */
            _this.renderOverlay = false;
            /** Defines color to use when rendering overlay */
            _this.overlayColor = LIB.Color3.Red();
            /** Defines alpha to use when rendering overlay */
            _this.overlayAlpha = 0.5;
            _this._hasVertexAlpha = false;
            _this._useVertexColors = true;
            _this._computeBonesUsingShaders = true;
            _this._numBoneInfluencers = 4;
            _this._applyFog = true;
            /** Gets or sets a boolean indicating that internal octree (if available) can be used to boost submeshes selection (true by default) */
            _this.useOctreeForRenderingSelection = true;
            /** Gets or sets a boolean indicating that internal octree (if available) can be used to boost submeshes picking (true by default) */
            _this.useOctreeForPicking = true;
            /** Gets or sets a boolean indicating that internal octree (if available) can be used to boost submeshes collision (true by default) */
            _this.useOctreeForCollisions = true;
            _this._layerMask = 0x0FFFFFFF;
            /**
             * True if the mesh must be rendered in any case (this will shortcut the frustum clipping phase)
             */
            _this.alwaysSelectAsActiveMesh = false;
            /**
             * Gets or sets the current action manager
             * @see http://doc.LIBjs.com/how_to/how_to_use_actions
             */
            _this.actionManager = null;
            /**
             * Gets or sets impostor used for physic simulation
             * @see http://doc.LIBjs.com/features/physics_engine
             */
            _this.physicsImpostor = null;
            // Collisions
            _this._checkCollisions = false;
            _this._collisionMask = -1;
            _this._collisionGroup = -1;
            /**
             * Gets or sets the ellipsoid used to impersonate this mesh when using collision engine (default is (0.5, 1, 0.5))
             * @see http://doc.LIBjs.com/LIB101/cameras,_mesh_collisions_and_gravity
             */
            _this.ellipsoid = new LIB.Vector3(0.5, 1, 0.5);
            /**
             * Gets or sets the ellipsoid offset used to impersonate this mesh when using collision engine (default is (0, 0, 0))
             * @see http://doc.LIBjs.com/LIB101/cameras,_mesh_collisions_and_gravity
             */
            _this.ellipsoidOffset = new LIB.Vector3(0, 0, 0);
            _this._oldPositionForCollisions = new LIB.Vector3(0, 0, 0);
            _this._diffPositionForCollisions = new LIB.Vector3(0, 0, 0);
            // Edges
            /**
             * Defines edge width used when edgesRenderer is enabled
             * @see https://www.LIBjs-playground.com/#10OJSG#13
             */
            _this.edgesWidth = 1;
            /**
             * Defines edge color used when edgesRenderer is enabled
             * @see https://www.LIBjs-playground.com/#10OJSG#13
             */
            _this.edgesColor = new LIB.Color4(1, 0, 0, 1);
            // Cache
            _this._collisionsTransformMatrix = LIB.Matrix.Zero();
            _this._collisionsScalingMatrix = LIB.Matrix.Zero();
            /** @hidden */
            _this._renderId = 0;
            /** @hidden */
            _this._intersectionsInProgress = new Array();
            /** @hidden */
            _this._unIndexed = false;
            /** @hidden */
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
            /**
             * No billboard
             */
            get: function () {
                return LIB.TransformNode.BILLBOARDMODE_NONE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh, "BILLBOARDMODE_X", {
            /** Billboard on X axis */
            get: function () {
                return LIB.TransformNode.BILLBOARDMODE_X;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh, "BILLBOARDMODE_Y", {
            /** Billboard on Y axis */
            get: function () {
                return LIB.TransformNode.BILLBOARDMODE_Y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh, "BILLBOARDMODE_Z", {
            /** Billboard on Z axis */
            get: function () {
                return LIB.TransformNode.BILLBOARDMODE_Z;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh, "BILLBOARDMODE_ALL", {
            /** Billboard on all axes */
            get: function () {
                return LIB.TransformNode.BILLBOARDMODE_ALL;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "facetNb", {
            /**
             * Gets the number of facets in the mesh
             * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata#what-is-a-mesh-facet
             */
            get: function () {
                return this._facetNb;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "partitioningSubdivisions", {
            /**
             * Gets or set the number (integer) of subdivisions per axis in the partioning space
             * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata#tweaking-the-partitioning
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
             * Ex : 1.01 (default) the partioning space is 1% bigger than the bounding box
             * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata#tweaking-the-partitioning
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
             * Gets or sets a boolean indicating that the facets must be depth sorted on next call to `updateFacetData()`.
             * Works only for updatable meshes.
             * Doesn't work with multi-materials
             * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata#facet-depth-sort
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
             * Used only when facet depth sort is enabled
             * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata#facet-depth-sort
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
             * gets a boolean indicating if facetData is enabled
             * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata#what-is-a-mesh-facet
             */
            get: function () {
                return this._facetDataEnabled;
            },
            enumerable: true,
            configurable: true
        });
        /** @hidden */
        AbstractMesh.prototype._updateNonUniformScalingState = function (value) {
            if (!_super.prototype._updateNonUniformScalingState.call(this, value)) {
                return false;
            }
            this._markSubMeshesAsMiscDirty();
            return true;
        };
        Object.defineProperty(AbstractMesh.prototype, "onCollide", {
            /** Set a function to call when this mesh collides with another one */
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
            /** Set a function to call when the collision's position changes */
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
            * Gets or sets whether the mesh is occluded or not, it is used also to set the intial state of the mesh to be occluded or not
            * @see http://doc.LIBjs.com/features/occlusionquery
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
             * @see http://doc.LIBjs.com/features/occlusionquery
             */
            get: function () {
                return this._isOcclusionQueryInProgress;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "visibility", {
            /**
             * Gets or sets mesh visibility between 0 and 1 (default is 1)
             */
            get: function () {
                return this._visibility;
            },
            /**
             * Gets or sets mesh visibility between 0 and 1 (default is 1)
             */
            set: function (value) {
                if (this._visibility === value) {
                    return;
                }
                this._visibility = value;
                this._markSubMeshesAsMiscDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "material", {
            /** Gets or sets current material */
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
                this._unBindEffect();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "receiveShadows", {
            /**
             * Gets or sets a boolean indicating that this mesh can receive realtime shadows
             * @see http://doc.LIBjs.com/LIB101/shadows
             */
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
            /** Gets or sets a boolean indicating that this mesh contains vertex color data with alpha values */
            get: function () {
                return this._hasVertexAlpha;
            },
            set: function (value) {
                if (this._hasVertexAlpha === value) {
                    return;
                }
                this._hasVertexAlpha = value;
                this._markSubMeshesAsAttributesDirty();
                this._markSubMeshesAsMiscDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMesh.prototype, "useVertexColors", {
            /** Gets or sets a boolean indicating that this mesh needs to use vertex color data to render (if this kind of vertex data is available in the geometry) */
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
            /**
             * Gets or sets a boolean indicating that bone animations must be computed by the CPU (false by default)
             */
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
            /** Gets or sets the number of allowed bone influences per vertex (4 by default) */
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
            /** Gets or sets a boolean indicating that this mesh will allow fog to be rendered on it (true by default) */
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
            /**
             * Gets or sets the current layer mask (default is 0x0FFFFFFF)
             * @see http://doc.LIBjs.com/how_to/layermasks_and_multi-cam_textures
             */
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
            /**
             * Gets or sets a collision mask used to mask collisions (default is -1).
             * A collision between A and B will happen if A.collisionGroup & b.collisionMask !== 0
             */
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
            /**
             * Gets or sets the current collision group mask (-1 by default).
             * A collision between A and B will happen if A.collisionGroup & b.collisionMask !== 0
             */
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
            /** @hidden */
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
            /**
             * Gets or sets a skeleton to apply skining transformations
             * @see http://doc.LIBjs.com/how_to/how_to_use_bones_and_skeletons
             */
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
         * Returns the string "AbstractMesh"
         * @returns "AbstractMesh"
         */
        AbstractMesh.prototype.getClassName = function () {
            return "AbstractMesh";
        };
        /**
         * Gets a string representation of the current mesh
         * @param fullDetails defines a boolean indicating if full details must be included
         * @returns a string representation of the current mesh
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
        /** @hidden */
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
        /** @hidden */
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
        /** @hidden */
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
        /** @hidden */
        AbstractMesh.prototype._unBindEffect = function () {
            for (var _i = 0, _a = this.subMeshes; _i < _a.length; _i++) {
                var subMesh = _a[_i];
                subMesh.setEffect(null);
            }
        };
        /** @hidden */
        AbstractMesh.prototype._removeLightSource = function (light) {
            var index = this._lightSources.indexOf(light);
            if (index === -1) {
                return;
            }
            this._lightSources.splice(index, 1);
            this._markSubMeshesAsLightDirty();
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
        /** @hidden */
        AbstractMesh.prototype._markSubMeshesAsLightDirty = function () {
            this._markSubMeshesAsDirty(function (defines) { return defines.markAsLightDirty(); });
        };
        /** @hidden */
        AbstractMesh.prototype._markSubMeshesAsAttributesDirty = function () {
            this._markSubMeshesAsDirty(function (defines) { return defines.markAsAttributesDirty(); });
        };
        /** @hidden */
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
            * Gets or sets a Vector3 depicting the mesh scaling along each local axis X, Y, Z.  Default is (1.0, 1.0, 1.0)
            */
            get: function () {
                return this._scaling;
            },
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
         * Disables the mesh edge rendering mode
         * @returns the currentAbstractMesh
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
         * This mode makes the mesh edges visible
         * @param epsilon defines the maximal distance between two angles to detect a face
         * @param checkVerticesInsteadOfIndices indicates that we should check vertex list directly instead of faces
         * @returns the currentAbstractMesh
         * @see https://www.LIBjs-playground.com/#19O9TU#0
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
             * Returns true if the mesh is blocked. Implemented by child classes
             */
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the mesh itself by default. Implemented by child classes
         * @param camera defines the camera to use to pick the right LOD level
         * @returns the currentAbstractMesh
         */
        AbstractMesh.prototype.getLOD = function (camera) {
            return this;
        };
        /**
         * Returns 0 by default. Implemented by child classes
         * @returns an integer
         */
        AbstractMesh.prototype.getTotalVertices = function () {
            return 0;
        };
        /**
         * Returns null by default. Implemented by child classes
         * @returns null
         */
        AbstractMesh.prototype.getIndices = function () {
            return null;
        };
        /**
         * Returns the array of the requested vertex data kind. Implemented by child classes
         * @param kind defines the vertex data kind to use
         * @returns null
         */
        AbstractMesh.prototype.getVerticesData = function (kind) {
            return null;
        };
        /**
         * Sets the vertex data of the mesh geometry for the requested `kind`.
         * If the mesh has no geometry, a new Geometry object is set to the mesh and then passed this vertex data.
         * Note that a new underlying VertexBuffer object is created each call.
         * If the `kind` is the `PositionKind`, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed.
         * @param kind defines vertex data kind:
         * * LIB.VertexBuffer.PositionKind
         * * LIB.VertexBuffer.UVKind
         * * LIB.VertexBuffer.UV2Kind
         * * LIB.VertexBuffer.UV3Kind
         * * LIB.VertexBuffer.UV4Kind
         * * LIB.VertexBuffer.UV5Kind
         * * LIB.VertexBuffer.UV6Kind
         * * LIB.VertexBuffer.ColorKind
         * * LIB.VertexBuffer.MatricesIndicesKind
         * * LIB.VertexBuffer.MatricesIndicesExtraKind
         * * LIB.VertexBuffer.MatricesWeightsKind
         * * LIB.VertexBuffer.MatricesWeightsExtraKind
         * @param data defines the data source
         * @param updatable defines if the data must be flagged as updatable (or static)
         * @param stride defines the vertex stride (size of an entire vertex). Can be null and in this case will be deduced from vertex data kind
         * @returns the current mesh
         */
        AbstractMesh.prototype.setVerticesData = function (kind, data, updatable, stride) {
            return this;
        };
        /**
         * Updates the existing vertex data of the mesh geometry for the requested `kind`.
         * If the mesh has no geometry, it is simply returned as it is.
         * @param kind defines vertex data kind:
         * * LIB.VertexBuffer.PositionKind
         * * LIB.VertexBuffer.UVKind
         * * LIB.VertexBuffer.UV2Kind
         * * LIB.VertexBuffer.UV3Kind
         * * LIB.VertexBuffer.UV4Kind
         * * LIB.VertexBuffer.UV5Kind
         * * LIB.VertexBuffer.UV6Kind
         * * LIB.VertexBuffer.ColorKind
         * * LIB.VertexBuffer.MatricesIndicesKind
         * * LIB.VertexBuffer.MatricesIndicesExtraKind
         * * LIB.VertexBuffer.MatricesWeightsKind
         * * LIB.VertexBuffer.MatricesWeightsExtraKind
         * @param data defines the data source
         * @param updateExtends If `kind` is `PositionKind` and if `updateExtends` is true, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed
         * @param makeItUnique If true, a new global geometry is created from this data and is set to the mesh
         * @returns the current mesh
         */
        AbstractMesh.prototype.updateVerticesData = function (kind, data, updateExtends, makeItUnique) {
            return this;
        };
        /**
         * Sets the mesh indices,
         * If the mesh has no geometry, a new Geometry object is created and set to the mesh.
         * @param indices Expects an array populated with integers or a typed array (Int32Array, Uint32Array, Uint16Array)
         * @param totalVertices Defines the total number of vertices
         * @returns the current mesh
         */
        AbstractMesh.prototype.setIndices = function (indices, totalVertices) {
            return this;
        };
        /**
         * Gets a boolean indicating if specific vertex data is present
         * @param kind defines the vertex data kind to use
         * @returns true is data kind is present
         */
        AbstractMesh.prototype.isVerticesDataPresent = function (kind) {
            return false;
        };
        /**
         * Returns the mesh BoundingInfo object or creates a new one and returns if it was undefined
         * @returns a BoundingInfo
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
         * Uniformly scales the mesh to fit inside of a unit cube (1 X 1 X 1 units)
         * @param includeDescendants Use the hierarchy's bounding box instead of the mesh's bounding box
         * @returns the current mesh
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
         * Overwrite the current bounding info
         * @param boundingInfo defines the new bounding info
         * @returns the current mesh
         */
        AbstractMesh.prototype.setBoundingInfo = function (boundingInfo) {
            this._boundingInfo = boundingInfo;
            return this;
        };
        Object.defineProperty(AbstractMesh.prototype, "useBones", {
            /** Gets a boolean indicating if this mesh has skinning data and an attached skeleton */
            get: function () {
                return (this.skeleton && this.getScene().skeletonsEnabled && this.isVerticesDataPresent(LIB.VertexBuffer.MatricesIndicesKind) && this.isVerticesDataPresent(LIB.VertexBuffer.MatricesWeightsKind));
            },
            enumerable: true,
            configurable: true
        });
        /** @hidden */
        AbstractMesh.prototype._preActivate = function () {
        };
        /** @hidden */
        AbstractMesh.prototype._preActivateForIntermediateRendering = function (renderId) {
        };
        /** @hidden */
        AbstractMesh.prototype._activate = function (renderId) {
            this._renderId = renderId;
        };
        /**
         * Gets the current world matrix
         * @returns a Matrix
         */
        AbstractMesh.prototype.getWorldMatrix = function () {
            if (this._masterMesh) {
                return this._masterMesh.getWorldMatrix();
            }
            return _super.prototype.getWorldMatrix.call(this);
        };
        /** @hidden */
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
         * Supports definition of mesh facing forward or backward
         * @param amountRight defines the distance on the right axis
         * @param amountUp defines the distance on the up axis
         * @param amountForward defines the distance on the forward axis
         * @returns the current mesh
         */
        AbstractMesh.prototype.movePOV = function (amountRight, amountUp, amountForward) {
            this.position.addInPlace(this.calcMovePOV(amountRight, amountUp, amountForward));
            return this;
        };
        /**
         * Calculate relative position change from the point of view of behind the front of the mesh.
         * This is performed taking into account the meshes current rotation, so you do not have to care.
         * Supports definition of mesh facing forward or backward
         * @param amountRight defines the distance on the right axis
         * @param amountUp defines the distance on the up axis
         * @param amountForward defines the distance on the forward axis
         * @returns the new displacement vector
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
         * Supports definition of mesh facing forward or backward
         * @param flipBack defines the flip
         * @param twirlClockwise defines the twirl
         * @param tiltRight defines the tilt
         * @returns the current mesh
         */
        AbstractMesh.prototype.rotatePOV = function (flipBack, twirlClockwise, tiltRight) {
            this.rotation.addInPlace(this.calcRotatePOV(flipBack, twirlClockwise, tiltRight));
            return this;
        };
        /**
         * Calculate relative rotation change from the point of view of behind the front of the mesh.
         * Supports definition of mesh facing forward or backward.
         * @param flipBack defines the flip
         * @param twirlClockwise defines the twirl
         * @param tiltRight defines the tilt
         * @returns the new rotation vector
         */
        AbstractMesh.prototype.calcRotatePOV = function (flipBack, twirlClockwise, tiltRight) {
            var defForwardMult = this.definedFacingForward ? 1 : -1;
            return new LIB.Vector3(flipBack * defForwardMult, twirlClockwise, tiltRight * defForwardMult);
        };
        /**
         * Return the minimum and maximum world vectors of the entire hierarchy under current mesh
         * @param includeDescendants Include bounding info from descendants as well (true by default)
         * @returns the new bounding vectors
         */
        AbstractMesh.prototype.getHierarchyBoundingVectors = function (includeDescendants) {
            if (includeDescendants === void 0) { includeDescendants = true; }
            // Ensures that all world matrix will be recomputed.
            this.getScene().incrementRenderId();
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
        /** @hidden */
        AbstractMesh.prototype._updateBoundingInfo = function () {
            this._boundingInfo = this._boundingInfo || new LIB.BoundingInfo(this.absolutePosition, this.absolutePosition);
            this._boundingInfo.update(this.worldMatrixFromCache);
            this._updateSubMeshesBoundingInfo(this.worldMatrixFromCache);
            return this;
        };
        /** @hidden */
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
        /** @hidden */
        AbstractMesh.prototype._afterComputeWorldMatrix = function () {
            // Bounding info
            this._updateBoundingInfo();
        };
        /**
         * Returns `true` if the mesh is within the frustum defined by the passed array of planes.
         * A mesh is in the frustum if its bounding box intersects the frustum
         * @param frustumPlanes defines the frustum to test
         * @returns true if the mesh is in the frustum planes
         */
        AbstractMesh.prototype.isInFrustum = function (frustumPlanes) {
            return this._boundingInfo !== null && this._boundingInfo.isInFrustum(frustumPlanes);
        };
        /**
         * Returns `true` if the mesh is completely in the frustum defined be the passed array of planes.
         * A mesh is completely in the frustum if its bounding box it completely inside the frustum.
         * @param frustumPlanes defines the frustum to test
         * @returns true if the mesh is completely in the frustum planes
         */
        AbstractMesh.prototype.isCompletelyInFrustum = function (frustumPlanes) {
            return this._boundingInfo !== null && this._boundingInfo.isCompletelyInFrustum(frustumPlanes);
        };
        /**
         * True if the mesh intersects another mesh or a SolidParticle object
         * @param mesh defines a target mesh or SolidParticle to test
         * @param precise Unless the parameter `precise` is set to `true` the intersection is computed according to Axis Aligned Bounding Boxes (AABB), else according to OBB (Oriented BBoxes)
         * @param includeDescendants Can be set to true to test if the mesh defined in parameters intersects with the current mesh or any child meshes
         * @returns true if there is an intersection
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
         * Returns true if the passed point (Vector3) is inside the mesh bounding box
         * @param point defines the point to test
         * @returns true if there is an intersection
         */
        AbstractMesh.prototype.intersectsPoint = function (point) {
            if (!this._boundingInfo) {
                return false;
            }
            return this._boundingInfo.intersectsPoint(point);
        };
        /**
         * Gets the current physics impostor
         * @see http://doc.LIBjs.com/features/physics_engine
         * @returns a physics impostor or null
         */
        AbstractMesh.prototype.getPhysicsImpostor = function () {
            return this.physicsImpostor;
        };
        /**
         * Gets the position of the current mesh in camera space
         * @param camera defines the camera to use
         * @returns a position
         */
        AbstractMesh.prototype.getPositionInCameraSpace = function (camera) {
            if (camera === void 0) { camera = null; }
            if (!camera) {
                camera = this.getScene().activeCamera;
            }
            return LIB.Vector3.TransformCoordinates(this.absolutePosition, camera.getViewMatrix());
        };
        /**
         * Returns the distance from the mesh to the active camera
         * @param camera defines the camera to use
         * @returns the distance
         */
        AbstractMesh.prototype.getDistanceToCamera = function (camera) {
            if (camera === void 0) { camera = null; }
            if (!camera) {
                camera = this.getScene().activeCamera;
            }
            return this.absolutePosition.subtract(camera.position).length();
        };
        /**
         * Apply a physic impulse to the mesh
         * @param force defines the force to apply
         * @param contactPoint defines where to apply the force
         * @returns the current mesh
         * @see http://doc.LIBjs.com/how_to/using_the_physics_engine
         */
        AbstractMesh.prototype.applyImpulse = function (force, contactPoint) {
            if (!this.physicsImpostor) {
                return this;
            }
            this.physicsImpostor.applyImpulse(force, contactPoint);
            return this;
        };
        /**
         * Creates a physic joint between two meshes
         * @param otherMesh defines the other mesh to use
         * @param pivot1 defines the pivot to use on this mesh
         * @param pivot2 defines the pivot to use on the other mesh
         * @param options defines additional options (can be plugin dependent)
         * @returns the current mesh
         * @see https://www.LIBjs-playground.com/#0BS5U0#0
         */
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
             * Gets or sets a boolean indicating that this mesh can be used in the collision engine
             * @see http://doc.LIBjs.com/LIB101/cameras,_mesh_collisions_and_gravity
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
             * @see http://doc.LIBjs.com/LIB101/cameras,_mesh_collisions_and_gravity
             */
            get: function () {
                return this._collider;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Move the mesh using collision engine
         * @see http://doc.LIBjs.com/LIB101/cameras,_mesh_collisions_and_gravity
         * @param displacement defines the requested displacement vector
         * @returns the current mesh
         */
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
        * Please note that you must have a decent number of submeshes to get performance improvements when using an octree
        * @param maxCapacity defines the maximum size of each block (64 by default)
        * @param maxDepth defines the maximum depth to use (no more than 2 levels by default)
        * @returns the new octree
        * @see https://www.LIBjs-playground.com/#NA4OQ#12
        * @see http://doc.LIBjs.com/how_to/optimizing_your_scene_with_octrees
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
        /** @hidden */
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
        /** @hidden */
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
        /** @hidden */
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
        /** @hidden */
        AbstractMesh.prototype._generatePointsArray = function () {
            return false;
        };
        /**
         * Checks if the passed Ray intersects with the mesh
         * @param ray defines the ray to use
         * @param fastCheck defines if fast mode (but less precise) must be used (false by default)
         * @returns the picking info
         * @see http://doc.LIBjs.com/LIB101/intersect_collisions_-_mesh
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
         * Clones the current mesh
         * @param name defines the mesh name
         * @param newParent defines the new mesh parent
         * @param doNotCloneChildren defines a boolean indicating that children must not be cloned (false by default)
         * @returns the new mesh
         */
        AbstractMesh.prototype.clone = function (name, newParent, doNotCloneChildren) {
            return null;
        };
        /**
         * Disposes all the submeshes of the current meshnp
         * @returns the current mesh
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
         * Releases resources associated with this abstract mesh.
         * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
         * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
         */
        AbstractMesh.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
            var _this = this;
            if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
            var index;
            // Smart Array Retainers.
            this.getScene().freeActiveMeshes();
            this.getScene().freeRenderingGroups();
            // Action manager
            if (this.actionManager !== undefined && this.actionManager !== null) {
                this.actionManager.dispose();
                this.actionManager = null;
            }
            // Skeleton
            this._skeleton = null;
            // Physics
            if (this.physicsImpostor) {
                this.physicsImpostor.dispose( /*!doNotRecurse*/);
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
            if (sceneOctree !== undefined && sceneOctree !== null) {
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
            _super.prototype.dispose.call(this, doNotRecurse, disposeMaterialAndTextures);
        };
        /**
         * Adds the passed mesh as a child to the current mesh
         * @param mesh defines the child mesh
         * @returns the current mesh
         */
        AbstractMesh.prototype.addChild = function (mesh) {
            mesh.setParent(this);
            return this;
        };
        /**
         * Removes the passed mesh from the current mesh children list
         * @param mesh defines the child mesh
         * @returns the current mesh
         */
        AbstractMesh.prototype.removeChild = function (mesh) {
            mesh.setParent(null);
            return this;
        };
        // Facet data
        /** @hidden */
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
         * You don't need to call this method by yourself in the render loop when you update/morph a mesh with the methods CreateXXX() as they automatically manage this computation
         * @returns the current mesh
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
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
         * The normals are expressed in the mesh local spac
         * @returns an array of Vector3
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
         */
        AbstractMesh.prototype.getFacetLocalNormals = function () {
            if (!this._facetNormals) {
                this.updateFacetData();
            }
            return this._facetNormals;
        };
        /**
         * Returns the facetLocalPositions array.
         * The facet positions are expressed in the mesh local space
         * @returns an array of Vector3
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
         */
        AbstractMesh.prototype.getFacetLocalPositions = function () {
            if (!this._facetPositions) {
                this.updateFacetData();
            }
            return this._facetPositions;
        };
        /**
         * Returns the facetLocalPartioning array
         * @returns an array of array of numbers
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
         */
        AbstractMesh.prototype.getFacetLocalPartitioning = function () {
            if (!this._facetPartitioning) {
                this.updateFacetData();
            }
            return this._facetPartitioning;
        };
        /**
         * Returns the i-th facet position in the world system.
         * This method allocates a new Vector3 per call
         * @param i defines the facet index
         * @returns a new Vector3
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
         */
        AbstractMesh.prototype.getFacetPosition = function (i) {
            var pos = LIB.Vector3.Zero();
            this.getFacetPositionToRef(i, pos);
            return pos;
        };
        /**
         * Sets the reference Vector3 with the i-th facet position in the world system
         * @param i defines the facet index
         * @param ref defines the target vector
         * @returns the current mesh
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
         */
        AbstractMesh.prototype.getFacetPositionToRef = function (i, ref) {
            var localPos = (this.getFacetLocalPositions())[i];
            var world = this.getWorldMatrix();
            LIB.Vector3.TransformCoordinatesToRef(localPos, world, ref);
            return this;
        };
        /**
         * Returns the i-th facet normal in the world system.
         * This method allocates a new Vector3 per call
         * @param i defines the facet index
         * @returns a new Vector3
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
         */
        AbstractMesh.prototype.getFacetNormal = function (i) {
            var norm = LIB.Vector3.Zero();
            this.getFacetNormalToRef(i, norm);
            return norm;
        };
        /**
         * Sets the reference Vector3 with the i-th facet normal in the world system
         * @param i defines the facet index
         * @param ref defines the target vector
         * @returns the current mesh
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
         */
        AbstractMesh.prototype.getFacetNormalToRef = function (i, ref) {
            var localNorm = (this.getFacetLocalNormals())[i];
            LIB.Vector3.TransformNormalToRef(localNorm, this.getWorldMatrix(), ref);
            return this;
        };
        /**
         * Returns the facets (in an array) in the same partitioning block than the one the passed coordinates are located (expressed in the mesh local system)
         * @param x defines x coordinate
         * @param y defines y coordinate
         * @param z defines z coordinate
         * @returns the array of facet indexes
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
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
         * Returns the closest mesh facet index at (x,y,z) World coordinates, null if not found
         * @param projected sets as the (x,y,z) world projection on the facet
         * @param checkFace if true (default false), only the facet "facing" to (x,y,z) or only the ones "turning their backs", according to the parameter "facing" are returned
         * @param facing if facing and checkFace are true, only the facet "facing" to (x, y, z) are returned : positive dot (x, y, z) * facet position. If facing si false and checkFace is true, only the facet "turning their backs" to (x, y, z) are returned : negative dot (x, y, z) * facet position
         * @param x defines x coordinate
         * @param y defines y coordinate
         * @param z defines z coordinate
         * @returns the face index if found (or null instead)
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
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
         * Returns the closest mesh facet index at (x,y,z) local coordinates, null if not found
         * @param projected sets as the (x,y,z) local projection on the facet
         * @param checkFace if true (default false), only the facet "facing" to (x,y,z) or only the ones "turning their backs", according to the parameter "facing" are returned
         * @param facing if facing and checkFace are true, only the facet "facing" to (x, y, z) are returned : positive dot (x, y, z) * facet position. If facing si false and checkFace is true, only the facet "turning their backs" to (x, y, z) are returned : negative dot (x, y, z) * facet position
         * @param x defines x coordinate
         * @param y defines y coordinate
         * @param z defines z coordinate
         * @returns the face index if found (or null instead)
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
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
                    if (tmpDistance < shortest) { // just keep the closest facet to (x, y, z)
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
         * @returns the parameters
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
         */
        AbstractMesh.prototype.getFacetDataParameters = function () {
            return this._facetParameters;
        };
        /**
         * Disables the feature FacetData and frees the related memory
         * @returns the current mesh
         * @see http://doc.LIBjs.com/how_to/how_to_use_facetdata
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
         * Updates the AbstractMesh indices array
         * @param indices defines the data source
         * @returns the current mesh
         */
        AbstractMesh.prototype.updateIndices = function (indices) {
            return this;
        };
        /**
         * Creates new normals data for the mesh
         * @param updatable defines if the normal vertex buffer must be flagged as updatable
         * @returns the current mesh
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
            return this;
        };
        /**
         * Align the mesh with a normal
         * @param normal defines the normal to use
         * @param upDirection can be used to redefined the up vector to use (will use the (0, 1, 0) by default)
         * @returns the current mesh
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
        /** @hidden */
        AbstractMesh.prototype._checkOcclusionQuery = function () {
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
        /** No occlusion */
        AbstractMesh.OCCLUSION_TYPE_NONE = 0;
        /** Occlusion set to optimisitic */
        AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC = 1;
        /** Occlusion set to strict */
        AbstractMesh.OCCLUSION_TYPE_STRICT = 2;
        /** Use an accurante occlusion algorithm */
        AbstractMesh.OCCLUSION_ALGORITHM_TYPE_ACCURATE = 0;
        /** Use a conservative occlusion algorithm */
        AbstractMesh.OCCLUSION_ALGORITHM_TYPE_CONSERVATIVE = 1;
        return AbstractMesh;
    }(LIB.TransformNode));
    LIB.AbstractMesh = AbstractMesh;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.abstractMesh.js.map
//# sourceMappingURL=LIB.abstractMesh.js.map
