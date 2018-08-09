(function (LIB) {
    var BaseSubMesh = /** @class */ (function () {
        function BaseSubMesh() {
        }
        Object.defineProperty(BaseSubMesh.prototype, "effect", {
            get: function () {
                return this._materialEffect;
            },
            enumerable: true,
            configurable: true
        });
        BaseSubMesh.prototype.setEffect = function (effect, defines) {
            if (defines === void 0) { defines = null; }
            if (this._materialEffect === effect) {
                if (!effect) {
                    this._materialDefines = null;
                }
                return;
            }
            this._materialDefines = defines;
            this._materialEffect = effect;
        };
        return BaseSubMesh;
    }());
    LIB.BaseSubMesh = BaseSubMesh;
    var SubMesh = /** @class */ (function (_super) {
        __extends(SubMesh, _super);
        function SubMesh(materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh, renderingMesh, createBoundingBox) {
            if (createBoundingBox === void 0) { createBoundingBox = true; }
            var _this = _super.call(this) || this;
            _this.materialIndex = materialIndex;
            _this.verticesStart = verticesStart;
            _this.verticesCount = verticesCount;
            _this.indexStart = indexStart;
            _this.indexCount = indexCount;
            _this._renderId = 0;
            _this._mesh = mesh;
            _this._renderingMesh = renderingMesh || mesh;
            mesh.subMeshes.push(_this);
            _this._trianglePlanes = [];
            _this._id = mesh.subMeshes.length - 1;
            if (createBoundingBox) {
                _this.refreshBoundingInfo();
                mesh.computeWorldMatrix(true);
            }
            return _this;
        }
        SubMesh.AddToMesh = function (materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh, renderingMesh, createBoundingBox) {
            if (createBoundingBox === void 0) { createBoundingBox = true; }
            return new SubMesh(materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh, renderingMesh, createBoundingBox);
        };
        Object.defineProperty(SubMesh.prototype, "IsGlobal", {
            get: function () {
                return (this.verticesStart === 0 && this.verticesCount == this._mesh.getTotalVertices());
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the submesh BoudingInfo object.
         */
        SubMesh.prototype.getBoundingInfo = function () {
            if (this.IsGlobal) {
                return this._mesh.getBoundingInfo();
            }
            return this._boundingInfo;
        };
        /**
         * Sets the submesh BoundingInfo.
         * Return the SubMesh.
         */
        SubMesh.prototype.setBoundingInfo = function (boundingInfo) {
            this._boundingInfo = boundingInfo;
            return this;
        };
        /**
         * Returns the mesh of the current submesh.
         */
        SubMesh.prototype.getMesh = function () {
            return this._mesh;
        };
        /**
         * Returns the rendering mesh of the submesh.
         */
        SubMesh.prototype.getRenderingMesh = function () {
            return this._renderingMesh;
        };
        /**
         * Returns the submesh material.
         */
        SubMesh.prototype.getMaterial = function () {
            var rootMaterial = this._renderingMesh.material;
            if (rootMaterial && rootMaterial.getSubMaterial) {
                var multiMaterial = rootMaterial;
                var effectiveMaterial = multiMaterial.getSubMaterial(this.materialIndex);
                if (this._currentMaterial !== effectiveMaterial) {
                    this._currentMaterial = effectiveMaterial;
                    this._materialDefines = null;
                }
                return effectiveMaterial;
            }
            if (!rootMaterial) {
                return this._mesh.getScene().defaultMaterial;
            }
            return rootMaterial;
        };
        // Methods
        /**
         * Sets a new updated BoundingInfo object to the submesh.
         * Returns the SubMesh.
         */
        SubMesh.prototype.refreshBoundingInfo = function () {
            this._lastColliderWorldVertices = null;
            if (this.IsGlobal || !this._renderingMesh || !this._renderingMesh.geometry) {
                return this;
            }
            var data = this._renderingMesh.getVerticesData(LIB.VertexBuffer.PositionKind);
            if (!data) {
                this._boundingInfo = this._mesh.getBoundingInfo();
                return this;
            }
            var indices = this._renderingMesh.getIndices();
            var extend;
            //is this the only submesh?
            if (this.indexStart === 0 && this.indexCount === indices.length) {
                var boundingInfo = this._renderingMesh.getBoundingInfo();
                //the rendering mesh's bounding info can be used, it is the standard submesh for all indices.
                extend = { minimum: boundingInfo.minimum.clone(), maximum: boundingInfo.maximum.clone() };
            }
            else {
                extend = LIB.Tools.ExtractMinAndMaxIndexed(data, indices, this.indexStart, this.indexCount, this._renderingMesh.geometry.boundingBias);
            }
            this._boundingInfo = new LIB.BoundingInfo(extend.minimum, extend.maximum);
            return this;
        };
        SubMesh.prototype._checkCollision = function (collider) {
            var boundingInfo = this._renderingMesh.getBoundingInfo();
            return boundingInfo._checkCollision(collider);
        };
        /**
         * Updates the submesh BoundingInfo.
         * Returns the Submesh.
         */
        SubMesh.prototype.updateBoundingInfo = function (world) {
            var boundingInfo = this.getBoundingInfo();
            if (!boundingInfo) {
                this.refreshBoundingInfo();
                boundingInfo = this.getBoundingInfo();
            }
            boundingInfo.update(world);
            return this;
        };
        /**
         * True is the submesh bounding box intersects the frustum defined by the passed array of planes.
         * Boolean returned.
         */
        SubMesh.prototype.isInFrustum = function (frustumPlanes) {
            var boundingInfo = this.getBoundingInfo();
            if (!boundingInfo) {
                return false;
            }
            return boundingInfo.isInFrustum(frustumPlanes);
        };
        /**
         * True is the submesh bounding box is completely inside the frustum defined by the passed array of planes.
         * Boolean returned.
         */
        SubMesh.prototype.isCompletelyInFrustum = function (frustumPlanes) {
            var boundingInfo = this.getBoundingInfo();
            if (!boundingInfo) {
                return false;
            }
            return boundingInfo.isCompletelyInFrustum(frustumPlanes);
        };
        /**
         * Renders the submesh.
         * Returns it.
         */
        SubMesh.prototype.render = function (enableAlphaMode) {
            this._renderingMesh.render(this, enableAlphaMode);
            return this;
        };
        /**
         * Returns a new Index Buffer.
         * Type returned : WebGLBuffer.
         */
        SubMesh.prototype.getLinesIndexBuffer = function (indices, engine) {
            if (!this._linesIndexBuffer) {
                var linesIndices = [];
                for (var index = this.indexStart; index < this.indexStart + this.indexCount; index += 3) {
                    linesIndices.push(indices[index], indices[index + 1], indices[index + 1], indices[index + 2], indices[index + 2], indices[index]);
                }
                this._linesIndexBuffer = engine.createIndexBuffer(linesIndices);
                this.linesIndexCount = linesIndices.length;
            }
            return this._linesIndexBuffer;
        };
        /**
         * True is the passed Ray intersects the submesh bounding box.
         * Boolean returned.
         */
        SubMesh.prototype.canIntersects = function (ray) {
            var boundingInfo = this.getBoundingInfo();
            if (!boundingInfo) {
                return false;
            }
            return ray.intersectsBox(boundingInfo.boundingBox);
        };
        /**
         * Returns an object IntersectionInfo.
         */
        SubMesh.prototype.intersects = function (ray, positions, indices, fastCheck) {
            var intersectInfo = null;
            // LineMesh first as it's also a Mesh...
            if (LIB.LinesMesh && this._mesh instanceof LIB.LinesMesh) {
                var lineMesh = this._mesh;
                // Line test
                for (var index = this.indexStart; index < this.indexStart + this.indexCount; index += 2) {
                    var p0 = positions[indices[index]];
                    var p1 = positions[indices[index + 1]];
                    var length = ray.intersectionSegment(p0, p1, lineMesh.intersectionThreshold);
                    if (length < 0) {
                        continue;
                    }
                    if (fastCheck || !intersectInfo || length < intersectInfo.distance) {
                        intersectInfo = new LIB.IntersectionInfo(null, null, length);
                        if (fastCheck) {
                            break;
                        }
                    }
                }
            }
            else {
                // Triangles test
                for (var index = this.indexStart; index < this.indexStart + this.indexCount; index += 3) {
                    var p0 = positions[indices[index]];
                    var p1 = positions[indices[index + 1]];
                    var p2 = positions[indices[index + 2]];
                    var currentIntersectInfo = ray.intersectsTriangle(p0, p1, p2);
                    if (currentIntersectInfo) {
                        if (currentIntersectInfo.distance < 0) {
                            continue;
                        }
                        if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
                            intersectInfo = currentIntersectInfo;
                            intersectInfo.faceId = index / 3;
                            if (fastCheck) {
                                break;
                            }
                        }
                    }
                }
            }
            return intersectInfo;
        };
        SubMesh.prototype._rebuild = function () {
            if (this._linesIndexBuffer) {
                this._linesIndexBuffer = null;
            }
        };
        // Clone
        /**
         * Creates a new Submesh from the passed Mesh.
         */
        SubMesh.prototype.clone = function (newMesh, newRenderingMesh) {
            var result = new SubMesh(this.materialIndex, this.verticesStart, this.verticesCount, this.indexStart, this.indexCount, newMesh, newRenderingMesh, false);
            if (!this.IsGlobal) {
                var boundingInfo = this.getBoundingInfo();
                if (!boundingInfo) {
                    return result;
                }
                result._boundingInfo = new LIB.BoundingInfo(boundingInfo.minimum, boundingInfo.maximum);
            }
            return result;
        };
        // Dispose
        /**
         * Disposes the Submesh.
         * Returns nothing.
         */
        SubMesh.prototype.dispose = function () {
            if (this._linesIndexBuffer) {
                this._mesh.getScene().getEngine()._releaseBuffer(this._linesIndexBuffer);
                this._linesIndexBuffer = null;
            }
            // Remove from mesh
            var index = this._mesh.subMeshes.indexOf(this);
            this._mesh.subMeshes.splice(index, 1);
        };
        // Statics
        /**
         * Creates a new Submesh from the passed parameters :
         * - materialIndex (integer) : the index of the main mesh material.
         * - startIndex (integer) : the index where to start the copy in the mesh indices array.
         * - indexCount (integer) : the number of indices to copy then from the startIndex.
         * - mesh (Mesh) : the main mesh to create the submesh from.
         * - renderingMesh (optional Mesh) : rendering mesh.
         */
        SubMesh.CreateFromIndices = function (materialIndex, startIndex, indexCount, mesh, renderingMesh) {
            var minVertexIndex = Number.MAX_VALUE;
            var maxVertexIndex = -Number.MAX_VALUE;
            renderingMesh = (renderingMesh || mesh);
            var indices = renderingMesh.getIndices();
            for (var index = startIndex; index < startIndex + indexCount; index++) {
                var vertexIndex = indices[index];
                if (vertexIndex < minVertexIndex)
                    minVertexIndex = vertexIndex;
                if (vertexIndex > maxVertexIndex)
                    maxVertexIndex = vertexIndex;
            }
            return new SubMesh(materialIndex, minVertexIndex, maxVertexIndex - minVertexIndex + 1, startIndex, indexCount, mesh, renderingMesh);
        };
        return SubMesh;
    }(BaseSubMesh));
    LIB.SubMesh = SubMesh;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.subMesh.js.map
