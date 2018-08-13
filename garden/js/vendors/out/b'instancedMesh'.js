

var LIB;
(function (LIB) {
    /**
     * Creates an instance based on a source mesh.
     */
    var InstancedMesh = /** @class */ (function (_super) {
        __extends(InstancedMesh, _super);
        function InstancedMesh(name, source) {
            var _this = _super.call(this, name, source.getScene()) || this;
            source.instances.push(_this);
            _this._sourceMesh = source;
            _this.position.copyFrom(source.position);
            _this.rotation.copyFrom(source.rotation);
            _this.scaling.copyFrom(source.scaling);
            if (source.rotationQuaternion) {
                _this.rotationQuaternion = source.rotationQuaternion.clone();
            }
            _this.infiniteDistance = source.infiniteDistance;
            _this.setPivotMatrix(source.getPivotMatrix());
            _this.refreshBoundingInfo();
            _this._syncSubMeshes();
            return _this;
        }
        /**
         * Returns the string "InstancedMesh".
         */
        InstancedMesh.prototype.getClassName = function () {
            return "InstancedMesh";
        };
        Object.defineProperty(InstancedMesh.prototype, "receiveShadows", {
            // Methods      
            get: function () {
                return this._sourceMesh.receiveShadows;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstancedMesh.prototype, "material", {
            get: function () {
                return this._sourceMesh.material;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstancedMesh.prototype, "visibility", {
            get: function () {
                return this._sourceMesh.visibility;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstancedMesh.prototype, "skeleton", {
            get: function () {
                return this._sourceMesh.skeleton;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstancedMesh.prototype, "renderingGroupId", {
            get: function () {
                return this._sourceMesh.renderingGroupId;
            },
            set: function (value) {
                if (!this._sourceMesh || value === this._sourceMesh.renderingGroupId) {
                    return;
                }
                //no-op with warning
                LIB.Tools.Warn("Note - setting renderingGroupId of an instanced mesh has no effect on the scene");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the total number of vertices (integer).
         */
        InstancedMesh.prototype.getTotalVertices = function () {
            return this._sourceMesh.getTotalVertices();
        };
        Object.defineProperty(InstancedMesh.prototype, "sourceMesh", {
            get: function () {
                return this._sourceMesh;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Is this node ready to be used/rendered
         * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
         * @return {boolean} is it ready
         */
        InstancedMesh.prototype.isReady = function (completeCheck) {
            if (completeCheck === void 0) { completeCheck = false; }
            return this._sourceMesh.isReady(completeCheck, true);
        };
        /**
         * Returns a float array or a Float32Array of the requested kind of data : positons, normals, uvs, etc.
         */
        InstancedMesh.prototype.getVerticesData = function (kind, copyWhenShared) {
            return this._sourceMesh.getVerticesData(kind, copyWhenShared);
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
        InstancedMesh.prototype.setVerticesData = function (kind, data, updatable, stride) {
            if (this.sourceMesh) {
                this.sourceMesh.setVerticesData(kind, data, updatable, stride);
            }
            return this.sourceMesh;
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
        InstancedMesh.prototype.updateVerticesData = function (kind, data, updateExtends, makeItUnique) {
            if (this.sourceMesh) {
                this.sourceMesh.updateVerticesData(kind, data, updateExtends, makeItUnique);
            }
            return this.sourceMesh;
        };
        /**
         * Sets the mesh indices.
         * Expects an array populated with integers or a typed array (Int32Array, Uint32Array, Uint16Array).
         * If the mesh has no geometry, a new Geometry object is created and set to the mesh.
         * This method creates a new index buffer each call.
         * Returns the Mesh.
         */
        InstancedMesh.prototype.setIndices = function (indices, totalVertices) {
            if (totalVertices === void 0) { totalVertices = null; }
            if (this.sourceMesh) {
                this.sourceMesh.setIndices(indices, totalVertices);
            }
            return this.sourceMesh;
        };
        /**
         * Boolean : True if the mesh owns the requested kind of data.
         */
        InstancedMesh.prototype.isVerticesDataPresent = function (kind) {
            return this._sourceMesh.isVerticesDataPresent(kind);
        };
        /**
         * Returns an array of indices (IndicesArray).
         */
        InstancedMesh.prototype.getIndices = function () {
            return this._sourceMesh.getIndices();
        };
        Object.defineProperty(InstancedMesh.prototype, "_positions", {
            get: function () {
                return this._sourceMesh._positions;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Sets a new updated BoundingInfo to the mesh.
         * Returns the mesh.
         */
        InstancedMesh.prototype.refreshBoundingInfo = function () {
            var meshBB = this._sourceMesh.getBoundingInfo();
            this._boundingInfo = new LIB.BoundingInfo(meshBB.minimum.clone(), meshBB.maximum.clone());
            this._updateBoundingInfo();
            return this;
        };
        InstancedMesh.prototype._preActivate = function () {
            if (this._currentLOD) {
                this._currentLOD._preActivate();
            }
            return this;
        };
        InstancedMesh.prototype._activate = function (renderId) {
            if (this._currentLOD) {
                this._currentLOD._registerInstanceForRenderId(this, renderId);
            }
            return this;
        };
        /**
         * Returns the current associated LOD AbstractMesh.
         */
        InstancedMesh.prototype.getLOD = function (camera) {
            if (!camera) {
                return this;
            }
            var boundingInfo = this.getBoundingInfo();
            this._currentLOD = this.sourceMesh.getLOD(camera, boundingInfo.boundingSphere);
            if (this._currentLOD === this.sourceMesh) {
                return this;
            }
            return this._currentLOD;
        };
        InstancedMesh.prototype._syncSubMeshes = function () {
            this.releaseSubMeshes();
            if (this._sourceMesh.subMeshes) {
                for (var index = 0; index < this._sourceMesh.subMeshes.length; index++) {
                    this._sourceMesh.subMeshes[index].clone(this, this._sourceMesh);
                }
            }
            return this;
        };
        InstancedMesh.prototype._generatePointsArray = function () {
            return this._sourceMesh._generatePointsArray();
        };
        /**
         * Creates a new InstancedMesh from the current mesh.
         * - name (string) : the cloned mesh name
         * - newParent (optional Node) : the optional Node to parent the clone to.
         * - doNotCloneChildren (optional boolean, default `false`) : if `true` the model children aren't cloned.
         *
         * Returns the clone.
         */
        InstancedMesh.prototype.clone = function (name, newParent, doNotCloneChildren) {
            var result = this._sourceMesh.createInstance(name);
            // Deep copy
            LIB.Tools.DeepCopy(this, result, ["name", "subMeshes", "uniqueId"], []);
            // Bounding info
            this.refreshBoundingInfo();
            // Parent
            if (newParent) {
                result.parent = newParent;
            }
            if (!doNotCloneChildren) {
                // Children
                for (var index = 0; index < this.getScene().meshes.length; index++) {
                    var mesh = this.getScene().meshes[index];
                    if (mesh.parent === this) {
                        mesh.clone(mesh.name, result);
                    }
                }
            }
            result.computeWorldMatrix(true);
            return result;
        };
        /**
         * Disposes the InstancedMesh.
         * Returns nothing.
         */
        InstancedMesh.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
            if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
            // Remove from mesh
            var index = this._sourceMesh.instances.indexOf(this);
            this._sourceMesh.instances.splice(index, 1);
            _super.prototype.dispose.call(this, doNotRecurse, disposeMaterialAndTextures);
        };
        return InstancedMesh;
    }(LIB.AbstractMesh));
    LIB.InstancedMesh = InstancedMesh;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.instancedMesh.js.map
//# sourceMappingURL=LIB.instancedMesh.js.map
