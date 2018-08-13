

var LIB;
(function (LIB) {
    /**
     * Class used to store geometry data (vertex buffers + index buffer)
     */
    var Geometry = /** @class */ (function () {
        /**
         * Creates a new geometry
         * @param id defines the unique ID
         * @param scene defines the hosting scene
         * @param vertexData defines the {LIB.VertexData} used to get geometry data
         * @param updatable defines if geometry must be updatable (false by default)
         * @param mesh defines the mesh that will be associated with the geometry
         */
        function Geometry(id, scene, vertexData, updatable, mesh) {
            if (updatable === void 0) { updatable = false; }
            if (mesh === void 0) { mesh = null; }
            /**
             * Gets the delay loading state of the geometry (none by default which means not delayed)
             */
            this.delayLoadState = LIB.Engine.DELAYLOADSTATE_NONE;
            this._totalVertices = 0;
            this._isDisposed = false;
            this._indexBufferIsUpdatable = false;
            this.id = id;
            this._engine = scene.getEngine();
            this._meshes = [];
            this._scene = scene;
            //Init vertex buffer cache
            this._vertexBuffers = {};
            this._indices = [];
            this._updatable = updatable;
            // vertexData
            if (vertexData) {
                this.setAllVerticesData(vertexData, updatable);
            }
            else {
                this._totalVertices = 0;
                this._indices = [];
            }
            if (this._engine.getCaps().vertexArrayObject) {
                this._vertexArrayObjects = {};
            }
            // applyToMesh
            if (mesh) {
                if (mesh.getClassName() === "LinesMesh") {
                    this.boundingBias = new LIB.Vector2(0, mesh.intersectionThreshold);
                    this._updateExtend();
                }
                this.applyToMesh(mesh);
                mesh.computeWorldMatrix(true);
            }
        }
        Object.defineProperty(Geometry.prototype, "boundingBias", {
            /**
             *  Gets or sets the Bias Vector to apply on the bounding elements (box/sphere), the max extend is computed as v += v * bias.x + bias.y, the min is computed as v -= v * bias.x + bias.y
             */
            get: function () {
                return this._boundingBias;
            },
            /**
             *  Gets or sets the Bias Vector to apply on the bounding elements (box/sphere), the max extend is computed as v += v * bias.x + bias.y, the min is computed as v -= v * bias.x + bias.y
             */
            set: function (value) {
                if (this._boundingBias && this._boundingBias.equals(value)) {
                    return;
                }
                this._boundingBias = value.clone();
                this._updateBoundingInfo(true, null);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Static function used to attach a new empty geometry to a mesh
         * @param mesh defines the mesh to attach the geometry to
         * @returns the new {LIB.Geometry}
         */
        Geometry.CreateGeometryForMesh = function (mesh) {
            var geometry = new Geometry(Geometry.RandomId(), mesh.getScene());
            geometry.applyToMesh(mesh);
            return geometry;
        };
        Object.defineProperty(Geometry.prototype, "extend", {
            /**
             * Gets the current extend of the geometry
             */
            get: function () {
                return this._extend;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the hosting scene
         * @returns the hosting {LIB.Scene}
         */
        Geometry.prototype.getScene = function () {
            return this._scene;
        };
        /**
         * Gets the hosting engine
         * @returns the hosting {LIB.Engine}
         */
        Geometry.prototype.getEngine = function () {
            return this._engine;
        };
        /**
         * Defines if the geometry is ready to use
         * @returns true if the geometry is ready to be used
         */
        Geometry.prototype.isReady = function () {
            return this.delayLoadState === LIB.Engine.DELAYLOADSTATE_LOADED || this.delayLoadState === LIB.Engine.DELAYLOADSTATE_NONE;
        };
        Object.defineProperty(Geometry.prototype, "doNotSerialize", {
            /**
             * Gets a value indicating that the geometry should not be serialized
             */
            get: function () {
                for (var index = 0; index < this._meshes.length; index++) {
                    if (!this._meshes[index].doNotSerialize) {
                        return false;
                    }
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        /** @hidden */
        Geometry.prototype._rebuild = function () {
            if (this._vertexArrayObjects) {
                this._vertexArrayObjects = {};
            }
            // Index buffer
            if (this._meshes.length !== 0 && this._indices) {
                this._indexBuffer = this._engine.createIndexBuffer(this._indices);
            }
            // Vertex buffers
            for (var key in this._vertexBuffers) {
                var vertexBuffer = this._vertexBuffers[key];
                vertexBuffer._rebuild();
            }
        };
        /**
         * Affects all gemetry data in one call
         * @param vertexData defines the geometry data
         * @param updatable defines if the geometry must be flagged as updatable (false as default)
         */
        Geometry.prototype.setAllVerticesData = function (vertexData, updatable) {
            vertexData.applyToGeometry(this, updatable);
            this.notifyUpdate();
        };
        /**
         * Set specific vertex data
         * @param kind defines the data kind (Position, normal, etc...)
         * @param data defines the vertex data to use
         * @param updatable defines if the vertex must be flagged as updatable (false as default)
         * @param stride defines the stride to use (0 by default). This value is deduced from the kind value if not specified
         */
        Geometry.prototype.setVerticesData = function (kind, data, updatable, stride) {
            if (updatable === void 0) { updatable = false; }
            var buffer = new LIB.VertexBuffer(this._engine, data, kind, updatable, this._meshes.length === 0, stride);
            this.setVerticesBuffer(buffer);
        };
        /**
         * Removes a specific vertex data
         * @param kind defines the data kind (Position, normal, etc...)
         */
        Geometry.prototype.removeVerticesData = function (kind) {
            if (this._vertexBuffers[kind]) {
                this._vertexBuffers[kind].dispose();
                delete this._vertexBuffers[kind];
            }
        };
        /**
         * Affect a vertex buffer to the geometry. the vertexBuffer.getKind() function is used to determine where to store the data
         * @param buffer defines the vertex buffer to use
         * @param totalVertices defines the total number of vertices for position kind (could be null)
         */
        Geometry.prototype.setVerticesBuffer = function (buffer, totalVertices) {
            if (totalVertices === void 0) { totalVertices = null; }
            var kind = buffer.getKind();
            if (this._vertexBuffers[kind]) {
                this._vertexBuffers[kind].dispose();
            }
            this._vertexBuffers[kind] = buffer;
            if (kind === LIB.VertexBuffer.PositionKind) {
                var data = buffer.getData();
                if (totalVertices != null) {
                    this._totalVertices = totalVertices;
                }
                else {
                    if (data != null) {
                        this._totalVertices = data.length / (buffer.byteStride / 4);
                    }
                }
                this._updateExtend(data);
                this._resetPointsArrayCache();
                var meshes = this._meshes;
                var numOfMeshes = meshes.length;
                for (var index = 0; index < numOfMeshes; index++) {
                    var mesh = meshes[index];
                    mesh._boundingInfo = new LIB.BoundingInfo(this._extend.minimum, this._extend.maximum);
                    mesh._createGlobalSubMesh(false);
                    mesh.computeWorldMatrix(true);
                }
            }
            this.notifyUpdate(kind);
            if (this._vertexArrayObjects) {
                this._disposeVertexArrayObjects();
                this._vertexArrayObjects = {}; // Will trigger a rebuild of the VAO if supported
            }
        };
        /**
         * Update a specific vertex buffer
         * This function will directly update the underlying WebGLBuffer according to the passed numeric array or Float32Array
         * It will do nothing if the buffer is not updatable
         * @param kind defines the data kind (Position, normal, etc...)
         * @param data defines the data to use
         * @param offset defines the offset in the target buffer where to store the data
         * @param useBytes set to true if the offset is in bytes
         */
        Geometry.prototype.updateVerticesDataDirectly = function (kind, data, offset, useBytes) {
            if (useBytes === void 0) { useBytes = false; }
            var vertexBuffer = this.getVertexBuffer(kind);
            if (!vertexBuffer) {
                return;
            }
            vertexBuffer.updateDirectly(data, offset, useBytes);
            this.notifyUpdate(kind);
        };
        /**
         * Update a specific vertex buffer
         * This function will create a new buffer if the current one is not updatable
         * @param kind defines the data kind (Position, normal, etc...)
         * @param data defines the data to use
         * @param updateExtends defines if the geometry extends must be recomputed (false by default)
         */
        Geometry.prototype.updateVerticesData = function (kind, data, updateExtends) {
            if (updateExtends === void 0) { updateExtends = false; }
            var vertexBuffer = this.getVertexBuffer(kind);
            if (!vertexBuffer) {
                return;
            }
            vertexBuffer.update(data);
            if (kind === LIB.VertexBuffer.PositionKind) {
                this._updateBoundingInfo(updateExtends, data);
            }
            this.notifyUpdate(kind);
        };
        Geometry.prototype._updateBoundingInfo = function (updateExtends, data) {
            if (updateExtends) {
                this._updateExtend(data);
            }
            var meshes = this._meshes;
            var numOfMeshes = meshes.length;
            this._resetPointsArrayCache();
            for (var index = 0; index < numOfMeshes; index++) {
                var mesh = meshes[index];
                if (updateExtends) {
                    mesh._boundingInfo = new LIB.BoundingInfo(this._extend.minimum, this._extend.maximum);
                    for (var subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
                        var subMesh = mesh.subMeshes[subIndex];
                        subMesh.refreshBoundingInfo();
                    }
                }
            }
        };
        /** @hidden */
        Geometry.prototype._bind = function (effect, indexToBind) {
            if (!effect) {
                return;
            }
            if (indexToBind === undefined) {
                indexToBind = this._indexBuffer;
            }
            var vbs = this.getVertexBuffers();
            if (!vbs) {
                return;
            }
            if (indexToBind != this._indexBuffer || !this._vertexArrayObjects) {
                this._engine.bindBuffers(vbs, indexToBind, effect);
                return;
            }
            // Using VAO
            if (!this._vertexArrayObjects[effect.key]) {
                this._vertexArrayObjects[effect.key] = this._engine.recordVertexArrayObject(vbs, indexToBind, effect);
            }
            this._engine.bindVertexArrayObject(this._vertexArrayObjects[effect.key], indexToBind);
        };
        /**
         * Gets total number of vertices
         * @returns the total number of vertices
         */
        Geometry.prototype.getTotalVertices = function () {
            if (!this.isReady()) {
                return 0;
            }
            return this._totalVertices;
        };
        /**
         * Gets a specific vertex data attached to this geometry. Float data is constructed if the vertex buffer data cannot be returned directly.
         * @param kind defines the data kind (Position, normal, etc...)
         * @param copyWhenShared defines if the returned array must be cloned upon returning it if the current geometry is shared between multiple meshes
         * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
         * @returns a float array containing vertex data
         */
        Geometry.prototype.getVerticesData = function (kind, copyWhenShared, forceCopy) {
            var vertexBuffer = this.getVertexBuffer(kind);
            if (!vertexBuffer) {
                return null;
            }
            var data = vertexBuffer.getData();
            if (!data) {
                return null;
            }
            var tightlyPackedByteStride = vertexBuffer.getSize() * LIB.VertexBuffer.GetTypeByteLength(vertexBuffer.type);
            var count = this._totalVertices * vertexBuffer.getSize();
            if (vertexBuffer.type !== LIB.VertexBuffer.FLOAT || vertexBuffer.byteStride !== tightlyPackedByteStride) {
                var copy_1 = new Array(count);
                vertexBuffer.forEach(count, function (value, index) {
                    copy_1[index] = value;
                });
                return copy_1;
            }
            if (!((data instanceof Array) || (data instanceof Float32Array)) || vertexBuffer.byteOffset !== 0 || data.length !== count) {
                if (data instanceof Array) {
                    var offset = vertexBuffer.byteOffset / 4;
                    return LIB.Tools.Slice(data, offset, offset + count);
                }
                else if (data instanceof ArrayBuffer) {
                    return new Float32Array(data, vertexBuffer.byteOffset, count);
                }
                else {
                    return new Float32Array(data.buffer, data.byteOffset + vertexBuffer.byteOffset, count);
                }
            }
            if (forceCopy || (copyWhenShared && this._meshes.length !== 1)) {
                return LIB.Tools.Slice(data);
            }
            return data;
        };
        /**
         * Returns a boolean defining if the vertex data for the requested `kind` is updatable
         * @param kind defines the data kind (Position, normal, etc...)
         * @returns true if the vertex buffer with the specified kind is updatable
         */
        Geometry.prototype.isVertexBufferUpdatable = function (kind) {
            var vb = this._vertexBuffers[kind];
            if (!vb) {
                return false;
            }
            return vb.isUpdatable();
        };
        /**
         * Gets a specific vertex buffer
         * @param kind defines the data kind (Position, normal, etc...)
         * @returns a {LIB.VertexBuffer}
         */
        Geometry.prototype.getVertexBuffer = function (kind) {
            if (!this.isReady()) {
                return null;
            }
            return this._vertexBuffers[kind];
        };
        /**
         * Returns all vertex buffers
         * @return an object holding all vertex buffers indexed by kind
         */
        Geometry.prototype.getVertexBuffers = function () {
            if (!this.isReady()) {
                return null;
            }
            return this._vertexBuffers;
        };
        /**
         * Gets a boolean indicating if specific vertex buffer is present
         * @param kind defines the data kind (Position, normal, etc...)
         * @returns true if data is present
         */
        Geometry.prototype.isVerticesDataPresent = function (kind) {
            if (!this._vertexBuffers) {
                if (this._delayInfo) {
                    return this._delayInfo.indexOf(kind) !== -1;
                }
                return false;
            }
            return this._vertexBuffers[kind] !== undefined;
        };
        /**
         * Gets a list of all attached data kinds (Position, normal, etc...)
         * @returns a list of string containing all kinds
         */
        Geometry.prototype.getVerticesDataKinds = function () {
            var result = [];
            var kind;
            if (!this._vertexBuffers && this._delayInfo) {
                for (kind in this._delayInfo) {
                    result.push(kind);
                }
            }
            else {
                for (kind in this._vertexBuffers) {
                    result.push(kind);
                }
            }
            return result;
        };
        /**
         * Update index buffer
         * @param indices defines the indices to store in the index buffer
         * @param offset defines the offset in the target buffer where to store the data
         */
        Geometry.prototype.updateIndices = function (indices, offset) {
            if (!this._indexBuffer) {
                return;
            }
            if (!this._indexBufferIsUpdatable) {
                this.setIndices(indices, null, true);
            }
            else {
                this._engine.updateDynamicIndexBuffer(this._indexBuffer, indices, offset);
            }
        };
        /**
         * Creates a new index buffer
         * @param indices defines the indices to store in the index buffer
         * @param totalVertices defines the total number of vertices (could be null)
         * @param updatable defines if the index buffer must be flagged as updatable (false by default)
         */
        Geometry.prototype.setIndices = function (indices, totalVertices, updatable) {
            if (totalVertices === void 0) { totalVertices = null; }
            if (updatable === void 0) { updatable = false; }
            if (this._indexBuffer) {
                this._engine._releaseBuffer(this._indexBuffer);
            }
            this._disposeVertexArrayObjects();
            this._indices = indices;
            this._indexBufferIsUpdatable = updatable;
            if (this._meshes.length !== 0 && this._indices) {
                this._indexBuffer = this._engine.createIndexBuffer(this._indices, updatable);
            }
            if (totalVertices != undefined) { // including null and undefined
                this._totalVertices = totalVertices;
            }
            var meshes = this._meshes;
            var numOfMeshes = meshes.length;
            for (var index = 0; index < numOfMeshes; index++) {
                meshes[index]._createGlobalSubMesh(true);
            }
            this.notifyUpdate();
        };
        /**
         * Return the total number of indices
         * @returns the total number of indices
         */
        Geometry.prototype.getTotalIndices = function () {
            if (!this.isReady()) {
                return 0;
            }
            return this._indices.length;
        };
        /**
         * Gets the index buffer array
         * @param copyWhenShared defines if the returned array must be cloned upon returning it if the current geometry is shared between multiple meshes
         * @returns the index buffer array
         */
        Geometry.prototype.getIndices = function (copyWhenShared) {
            if (!this.isReady()) {
                return null;
            }
            var orig = this._indices;
            if (!copyWhenShared || this._meshes.length === 1) {
                return orig;
            }
            else {
                var len = orig.length;
                var copy = [];
                for (var i = 0; i < len; i++) {
                    copy.push(orig[i]);
                }
                return copy;
            }
        };
        /**
         * Gets the index buffer
         * @return the index buffer
         */
        Geometry.prototype.getIndexBuffer = function () {
            if (!this.isReady()) {
                return null;
            }
            return this._indexBuffer;
        };
        /** @hidden */
        Geometry.prototype._releaseVertexArrayObject = function (effect) {
            if (effect === void 0) { effect = null; }
            if (!effect || !this._vertexArrayObjects) {
                return;
            }
            if (this._vertexArrayObjects[effect.key]) {
                this._engine.releaseVertexArrayObject(this._vertexArrayObjects[effect.key]);
                delete this._vertexArrayObjects[effect.key];
            }
        };
        /**
         * Release the associated resources for a specific mesh
         * @param mesh defines the source mesh
         * @param shouldDispose defines if the geometry must be disposed if there is no more mesh pointing to it
         */
        Geometry.prototype.releaseForMesh = function (mesh, shouldDispose) {
            var meshes = this._meshes;
            var index = meshes.indexOf(mesh);
            if (index === -1) {
                return;
            }
            meshes.splice(index, 1);
            mesh._geometry = null;
            if (meshes.length === 0 && shouldDispose) {
                this.dispose();
            }
        };
        /**
         * Apply current geometry to a given mesh
         * @param mesh defines the mesh to apply geometry to
         */
        Geometry.prototype.applyToMesh = function (mesh) {
            if (mesh._geometry === this) {
                return;
            }
            var previousGeometry = mesh._geometry;
            if (previousGeometry) {
                previousGeometry.releaseForMesh(mesh);
            }
            var meshes = this._meshes;
            // must be done before setting vertexBuffers because of mesh._createGlobalSubMesh()
            mesh._geometry = this;
            this._scene.pushGeometry(this);
            meshes.push(mesh);
            if (this.isReady()) {
                this._applyToMesh(mesh);
            }
            else {
                mesh._boundingInfo = this._boundingInfo;
            }
        };
        Geometry.prototype._updateExtend = function (data) {
            if (data === void 0) { data = null; }
            if (!data) {
                data = this.getVerticesData(LIB.VertexBuffer.PositionKind);
            }
            this._extend = LIB.Tools.ExtractMinAndMax(data, 0, this._totalVertices, this.boundingBias, 3);
        };
        Geometry.prototype._applyToMesh = function (mesh) {
            var numOfMeshes = this._meshes.length;
            // vertexBuffers
            for (var kind in this._vertexBuffers) {
                if (numOfMeshes === 1) {
                    this._vertexBuffers[kind].create();
                }
                var buffer = this._vertexBuffers[kind].getBuffer();
                if (buffer)
                    buffer.references = numOfMeshes;
                if (kind === LIB.VertexBuffer.PositionKind) {
                    if (!this._extend) {
                        this._updateExtend();
                    }
                    mesh._boundingInfo = new LIB.BoundingInfo(this._extend.minimum, this._extend.maximum);
                    mesh._createGlobalSubMesh(false);
                    //bounding info was just created again, world matrix should be applied again.
                    mesh._updateBoundingInfo();
                }
            }
            // indexBuffer
            if (numOfMeshes === 1 && this._indices && this._indices.length > 0) {
                this._indexBuffer = this._engine.createIndexBuffer(this._indices);
            }
            if (this._indexBuffer) {
                this._indexBuffer.references = numOfMeshes;
            }
        };
        Geometry.prototype.notifyUpdate = function (kind) {
            if (this.onGeometryUpdated) {
                this.onGeometryUpdated(this, kind);
            }
            for (var _i = 0, _a = this._meshes; _i < _a.length; _i++) {
                var mesh = _a[_i];
                mesh._markSubMeshesAsAttributesDirty();
            }
        };
        /**
         * Load the geometry if it was flagged as delay loaded
         * @param scene defines the hosting scene
         * @param onLoaded defines a callback called when the geometry is loaded
         */
        Geometry.prototype.load = function (scene, onLoaded) {
            if (this.delayLoadState === LIB.Engine.DELAYLOADSTATE_LOADING) {
                return;
            }
            if (this.isReady()) {
                if (onLoaded) {
                    onLoaded();
                }
                return;
            }
            this.delayLoadState = LIB.Engine.DELAYLOADSTATE_LOADING;
            this._queueLoad(scene, onLoaded);
        };
        Geometry.prototype._queueLoad = function (scene, onLoaded) {
            var _this = this;
            if (!this.delayLoadingFile) {
                return;
            }
            scene._addPendingData(this);
            scene._loadFile(this.delayLoadingFile, function (data) {
                if (!_this._delayLoadingFunction) {
                    return;
                }
                _this._delayLoadingFunction(JSON.parse(data), _this);
                _this.delayLoadState = LIB.Engine.DELAYLOADSTATE_LOADED;
                _this._delayInfo = [];
                scene._removePendingData(_this);
                var meshes = _this._meshes;
                var numOfMeshes = meshes.length;
                for (var index = 0; index < numOfMeshes; index++) {
                    _this._applyToMesh(meshes[index]);
                }
                if (onLoaded) {
                    onLoaded();
                }
            }, undefined, true);
        };
        /**
         * Invert the geometry to move from a right handed system to a left handed one.
         */
        Geometry.prototype.toLeftHanded = function () {
            // Flip faces
            var tIndices = this.getIndices(false);
            if (tIndices != null && tIndices.length > 0) {
                for (var i = 0; i < tIndices.length; i += 3) {
                    var tTemp = tIndices[i + 0];
                    tIndices[i + 0] = tIndices[i + 2];
                    tIndices[i + 2] = tTemp;
                }
                this.setIndices(tIndices);
            }
            // Negate position.z
            var tPositions = this.getVerticesData(LIB.VertexBuffer.PositionKind, false);
            if (tPositions != null && tPositions.length > 0) {
                for (var i = 0; i < tPositions.length; i += 3) {
                    tPositions[i + 2] = -tPositions[i + 2];
                }
                this.setVerticesData(LIB.VertexBuffer.PositionKind, tPositions, false);
            }
            // Negate normal.z
            var tNormals = this.getVerticesData(LIB.VertexBuffer.NormalKind, false);
            if (tNormals != null && tNormals.length > 0) {
                for (var i = 0; i < tNormals.length; i += 3) {
                    tNormals[i + 2] = -tNormals[i + 2];
                }
                this.setVerticesData(LIB.VertexBuffer.NormalKind, tNormals, false);
            }
        };
        // Cache
        /** @hidden */
        Geometry.prototype._resetPointsArrayCache = function () {
            this._positions = null;
        };
        /** @hidden */
        Geometry.prototype._generatePointsArray = function () {
            if (this._positions)
                return true;
            this._positions = [];
            var data = this.getVerticesData(LIB.VertexBuffer.PositionKind);
            if (!data) {
                return false;
            }
            for (var index = 0; index < data.length; index += 3) {
                this._positions.push(LIB.Vector3.FromArray(data, index));
            }
            return true;
        };
        /**
         * Gets a value indicating if the geometry is disposed
         * @returns true if the geometry was disposed
         */
        Geometry.prototype.isDisposed = function () {
            return this._isDisposed;
        };
        Geometry.prototype._disposeVertexArrayObjects = function () {
            if (this._vertexArrayObjects) {
                for (var kind in this._vertexArrayObjects) {
                    this._engine.releaseVertexArrayObject(this._vertexArrayObjects[kind]);
                }
                this._vertexArrayObjects = {};
            }
        };
        /**
         * Free all associated resources
         */
        Geometry.prototype.dispose = function () {
            var meshes = this._meshes;
            var numOfMeshes = meshes.length;
            var index;
            for (index = 0; index < numOfMeshes; index++) {
                this.releaseForMesh(meshes[index]);
            }
            this._meshes = [];
            this._disposeVertexArrayObjects();
            for (var kind in this._vertexBuffers) {
                this._vertexBuffers[kind].dispose();
            }
            this._vertexBuffers = {};
            this._totalVertices = 0;
            if (this._indexBuffer) {
                this._engine._releaseBuffer(this._indexBuffer);
            }
            this._indexBuffer = null;
            this._indices = [];
            this.delayLoadState = LIB.Engine.DELAYLOADSTATE_NONE;
            this.delayLoadingFile = null;
            this._delayLoadingFunction = null;
            this._delayInfo = [];
            this._boundingInfo = null;
            this._scene.removeGeometry(this);
            this._isDisposed = true;
        };
        /**
         * Clone the current geometry into a new geometry
         * @param id defines the unique ID of the new geometry
         * @returns a new geometry object
         */
        Geometry.prototype.copy = function (id) {
            var vertexData = new LIB.VertexData();
            vertexData.indices = [];
            var indices = this.getIndices();
            if (indices) {
                for (var index = 0; index < indices.length; index++) {
                    vertexData.indices.push(indices[index]);
                }
            }
            var updatable = false;
            var stopChecking = false;
            var kind;
            for (kind in this._vertexBuffers) {
                // using slice() to make a copy of the array and not just reference it
                var data = this.getVerticesData(kind);
                if (data instanceof Float32Array) {
                    vertexData.set(new Float32Array(data), kind);
                }
                else {
                    vertexData.set(data.slice(0), kind);
                }
                if (!stopChecking) {
                    var vb = this.getVertexBuffer(kind);
                    if (vb) {
                        updatable = vb.isUpdatable();
                        stopChecking = !updatable;
                    }
                }
            }
            var geometry = new Geometry(id, this._scene, vertexData, updatable);
            geometry.delayLoadState = this.delayLoadState;
            geometry.delayLoadingFile = this.delayLoadingFile;
            geometry._delayLoadingFunction = this._delayLoadingFunction;
            for (kind in this._delayInfo) {
                geometry._delayInfo = geometry._delayInfo || [];
                geometry._delayInfo.push(kind);
            }
            // Bounding info
            geometry._boundingInfo = new LIB.BoundingInfo(this._extend.minimum, this._extend.maximum);
            return geometry;
        };
        /**
         * Serialize the current geometry info (and not the vertices data) into a JSON object
         * @return a JSON representation of the current geometry data (without the vertices data)
         */
        Geometry.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.id = this.id;
            serializationObject.updatable = this._updatable;
            if (LIB.Tags && LIB.Tags.HasTags(this)) {
                serializationObject.tags = LIB.Tags.GetTags(this);
            }
            return serializationObject;
        };
        Geometry.prototype.toNumberArray = function (origin) {
            if (Array.isArray(origin)) {
                return origin;
            }
            else {
                return Array.prototype.slice.call(origin);
            }
        };
        /**
         * Serialize all vertices data into a JSON oject
         * @returns a JSON representation of the current geometry data
         */
        Geometry.prototype.serializeVerticeData = function () {
            var serializationObject = this.serialize();
            if (this.isVerticesDataPresent(LIB.VertexBuffer.PositionKind)) {
                serializationObject.positions = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.PositionKind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.PositionKind)) {
                    serializationObject.positions._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.NormalKind)) {
                serializationObject.normals = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.NormalKind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.NormalKind)) {
                    serializationObject.normals._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.TangentKind)) {
                serializationObject.tangets = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.TangentKind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.TangentKind)) {
                    serializationObject.tangets._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.UVKind)) {
                serializationObject.uvs = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.UVKind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.UVKind)) {
                    serializationObject.uvs._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.UV2Kind)) {
                serializationObject.uv2s = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.UV2Kind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.UV2Kind)) {
                    serializationObject.uv2s._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.UV3Kind)) {
                serializationObject.uv3s = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.UV3Kind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.UV3Kind)) {
                    serializationObject.uv3s._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.UV4Kind)) {
                serializationObject.uv4s = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.UV4Kind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.UV4Kind)) {
                    serializationObject.uv4s._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.UV5Kind)) {
                serializationObject.uv5s = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.UV5Kind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.UV5Kind)) {
                    serializationObject.uv5s._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.UV6Kind)) {
                serializationObject.uv6s = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.UV6Kind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.UV6Kind)) {
                    serializationObject.uv6s._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.ColorKind)) {
                serializationObject.colors = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.ColorKind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.ColorKind)) {
                    serializationObject.colors._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.MatricesIndicesKind)) {
                serializationObject.matricesIndices = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.MatricesIndicesKind));
                serializationObject.matricesIndices._isExpanded = true;
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.MatricesIndicesKind)) {
                    serializationObject.matricesIndices._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(LIB.VertexBuffer.MatricesWeightsKind)) {
                serializationObject.matricesWeights = this.toNumberArray(this.getVerticesData(LIB.VertexBuffer.MatricesWeightsKind));
                if (this.isVertexBufferUpdatable(LIB.VertexBuffer.MatricesWeightsKind)) {
                    serializationObject.matricesWeights._updatable = true;
                }
            }
            serializationObject.indices = this.toNumberArray(this.getIndices());
            return serializationObject;
        };
        // Statics
        /**
         * Extracts a clone of a mesh geometry
         * @param mesh defines the source mesh
         * @param id defines the unique ID of the new geometry object
         * @returns the new geometry object
         */
        Geometry.ExtractFromMesh = function (mesh, id) {
            var geometry = mesh._geometry;
            if (!geometry) {
                return null;
            }
            return geometry.copy(id);
        };
        /**
         * You should now use Tools.RandomId(), this method is still here for legacy reasons.
         * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
         * Be aware Math.random() could cause collisions, but:
         * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
         * @returns a string containing a new GUID
         */
        Geometry.RandomId = function () {
            return LIB.Tools.RandomId();
        };
        /** @hidden */
        Geometry._ImportGeometry = function (parsedGeometry, mesh) {
            var scene = mesh.getScene();
            // Geometry
            var geometryId = parsedGeometry.geometryId;
            if (geometryId) {
                var geometry = scene.getGeometryByID(geometryId);
                if (geometry) {
                    geometry.applyToMesh(mesh);
                }
            }
            else if (parsedGeometry instanceof ArrayBuffer) {
                var binaryInfo = mesh._binaryInfo;
                if (binaryInfo.positionsAttrDesc && binaryInfo.positionsAttrDesc.count > 0) {
                    var positionsData = new Float32Array(parsedGeometry, binaryInfo.positionsAttrDesc.offset, binaryInfo.positionsAttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.PositionKind, positionsData, false);
                }
                if (binaryInfo.normalsAttrDesc && binaryInfo.normalsAttrDesc.count > 0) {
                    var normalsData = new Float32Array(parsedGeometry, binaryInfo.normalsAttrDesc.offset, binaryInfo.normalsAttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.NormalKind, normalsData, false);
                }
                if (binaryInfo.tangetsAttrDesc && binaryInfo.tangetsAttrDesc.count > 0) {
                    var tangentsData = new Float32Array(parsedGeometry, binaryInfo.tangetsAttrDesc.offset, binaryInfo.tangetsAttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.TangentKind, tangentsData, false);
                }
                if (binaryInfo.uvsAttrDesc && binaryInfo.uvsAttrDesc.count > 0) {
                    var uvsData = new Float32Array(parsedGeometry, binaryInfo.uvsAttrDesc.offset, binaryInfo.uvsAttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.UVKind, uvsData, false);
                }
                if (binaryInfo.uvs2AttrDesc && binaryInfo.uvs2AttrDesc.count > 0) {
                    var uvs2Data = new Float32Array(parsedGeometry, binaryInfo.uvs2AttrDesc.offset, binaryInfo.uvs2AttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.UV2Kind, uvs2Data, false);
                }
                if (binaryInfo.uvs3AttrDesc && binaryInfo.uvs3AttrDesc.count > 0) {
                    var uvs3Data = new Float32Array(parsedGeometry, binaryInfo.uvs3AttrDesc.offset, binaryInfo.uvs3AttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.UV3Kind, uvs3Data, false);
                }
                if (binaryInfo.uvs4AttrDesc && binaryInfo.uvs4AttrDesc.count > 0) {
                    var uvs4Data = new Float32Array(parsedGeometry, binaryInfo.uvs4AttrDesc.offset, binaryInfo.uvs4AttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.UV4Kind, uvs4Data, false);
                }
                if (binaryInfo.uvs5AttrDesc && binaryInfo.uvs5AttrDesc.count > 0) {
                    var uvs5Data = new Float32Array(parsedGeometry, binaryInfo.uvs5AttrDesc.offset, binaryInfo.uvs5AttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.UV5Kind, uvs5Data, false);
                }
                if (binaryInfo.uvs6AttrDesc && binaryInfo.uvs6AttrDesc.count > 0) {
                    var uvs6Data = new Float32Array(parsedGeometry, binaryInfo.uvs6AttrDesc.offset, binaryInfo.uvs6AttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.UV6Kind, uvs6Data, false);
                }
                if (binaryInfo.colorsAttrDesc && binaryInfo.colorsAttrDesc.count > 0) {
                    var colorsData = new Float32Array(parsedGeometry, binaryInfo.colorsAttrDesc.offset, binaryInfo.colorsAttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.ColorKind, colorsData, false, binaryInfo.colorsAttrDesc.stride);
                }
                if (binaryInfo.matricesIndicesAttrDesc && binaryInfo.matricesIndicesAttrDesc.count > 0) {
                    var matricesIndicesData = new Int32Array(parsedGeometry, binaryInfo.matricesIndicesAttrDesc.offset, binaryInfo.matricesIndicesAttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.MatricesIndicesKind, matricesIndicesData, false);
                }
                if (binaryInfo.matricesWeightsAttrDesc && binaryInfo.matricesWeightsAttrDesc.count > 0) {
                    var matricesWeightsData = new Float32Array(parsedGeometry, binaryInfo.matricesWeightsAttrDesc.offset, binaryInfo.matricesWeightsAttrDesc.count);
                    mesh.setVerticesData(LIB.VertexBuffer.MatricesWeightsKind, matricesWeightsData, false);
                }
                if (binaryInfo.indicesAttrDesc && binaryInfo.indicesAttrDesc.count > 0) {
                    var indicesData = new Int32Array(parsedGeometry, binaryInfo.indicesAttrDesc.offset, binaryInfo.indicesAttrDesc.count);
                    mesh.setIndices(indicesData, null);
                }
                if (binaryInfo.subMeshesAttrDesc && binaryInfo.subMeshesAttrDesc.count > 0) {
                    var subMeshesData = new Int32Array(parsedGeometry, binaryInfo.subMeshesAttrDesc.offset, binaryInfo.subMeshesAttrDesc.count * 5);
                    mesh.subMeshes = [];
                    for (var i = 0; i < binaryInfo.subMeshesAttrDesc.count; i++) {
                        var materialIndex = subMeshesData[(i * 5) + 0];
                        var verticesStart = subMeshesData[(i * 5) + 1];
                        var verticesCount = subMeshesData[(i * 5) + 2];
                        var indexStart = subMeshesData[(i * 5) + 3];
                        var indexCount = subMeshesData[(i * 5) + 4];
                        LIB.SubMesh.AddToMesh(materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh);
                    }
                }
            }
            else if (parsedGeometry.positions && parsedGeometry.normals && parsedGeometry.indices) {
                mesh.setVerticesData(LIB.VertexBuffer.PositionKind, parsedGeometry.positions, parsedGeometry.positions._updatable);
                mesh.setVerticesData(LIB.VertexBuffer.NormalKind, parsedGeometry.normals, parsedGeometry.normals._updatable);
                if (parsedGeometry.tangents) {
                    mesh.setVerticesData(LIB.VertexBuffer.TangentKind, parsedGeometry.tangents, parsedGeometry.tangents._updatable);
                }
                if (parsedGeometry.uvs) {
                    mesh.setVerticesData(LIB.VertexBuffer.UVKind, parsedGeometry.uvs, parsedGeometry.uvs._updatable);
                }
                if (parsedGeometry.uvs2) {
                    mesh.setVerticesData(LIB.VertexBuffer.UV2Kind, parsedGeometry.uvs2, parsedGeometry.uvs2._updatable);
                }
                if (parsedGeometry.uvs3) {
                    mesh.setVerticesData(LIB.VertexBuffer.UV3Kind, parsedGeometry.uvs3, parsedGeometry.uvs3._updatable);
                }
                if (parsedGeometry.uvs4) {
                    mesh.setVerticesData(LIB.VertexBuffer.UV4Kind, parsedGeometry.uvs4, parsedGeometry.uvs4._updatable);
                }
                if (parsedGeometry.uvs5) {
                    mesh.setVerticesData(LIB.VertexBuffer.UV5Kind, parsedGeometry.uvs5, parsedGeometry.uvs5._updatable);
                }
                if (parsedGeometry.uvs6) {
                    mesh.setVerticesData(LIB.VertexBuffer.UV6Kind, parsedGeometry.uvs6, parsedGeometry.uvs6._updatable);
                }
                if (parsedGeometry.colors) {
                    mesh.setVerticesData(LIB.VertexBuffer.ColorKind, LIB.Color4.CheckColors4(parsedGeometry.colors, parsedGeometry.positions.length / 3), parsedGeometry.colors._updatable);
                }
                if (parsedGeometry.matricesIndices) {
                    if (!parsedGeometry.matricesIndices._isExpanded) {
                        var floatIndices = [];
                        for (var i = 0; i < parsedGeometry.matricesIndices.length; i++) {
                            var matricesIndex = parsedGeometry.matricesIndices[i];
                            floatIndices.push(matricesIndex & 0x000000FF);
                            floatIndices.push((matricesIndex & 0x0000FF00) >> 8);
                            floatIndices.push((matricesIndex & 0x00FF0000) >> 16);
                            floatIndices.push(matricesIndex >> 24);
                        }
                        mesh.setVerticesData(LIB.VertexBuffer.MatricesIndicesKind, floatIndices, parsedGeometry.matricesIndices._updatable);
                    }
                    else {
                        delete parsedGeometry.matricesIndices._isExpanded;
                        mesh.setVerticesData(LIB.VertexBuffer.MatricesIndicesKind, parsedGeometry.matricesIndices, parsedGeometry.matricesIndices._updatable);
                    }
                }
                if (parsedGeometry.matricesIndicesExtra) {
                    if (!parsedGeometry.matricesIndicesExtra._isExpanded) {
                        var floatIndices = [];
                        for (var i = 0; i < parsedGeometry.matricesIndicesExtra.length; i++) {
                            var matricesIndex = parsedGeometry.matricesIndicesExtra[i];
                            floatIndices.push(matricesIndex & 0x000000FF);
                            floatIndices.push((matricesIndex & 0x0000FF00) >> 8);
                            floatIndices.push((matricesIndex & 0x00FF0000) >> 16);
                            floatIndices.push(matricesIndex >> 24);
                        }
                        mesh.setVerticesData(LIB.VertexBuffer.MatricesIndicesExtraKind, floatIndices, parsedGeometry.matricesIndicesExtra._updatable);
                    }
                    else {
                        delete parsedGeometry.matricesIndices._isExpanded;
                        mesh.setVerticesData(LIB.VertexBuffer.MatricesIndicesExtraKind, parsedGeometry.matricesIndicesExtra, parsedGeometry.matricesIndicesExtra._updatable);
                    }
                }
                if (parsedGeometry.matricesWeights) {
                    Geometry._CleanMatricesWeights(parsedGeometry, mesh);
                    mesh.setVerticesData(LIB.VertexBuffer.MatricesWeightsKind, parsedGeometry.matricesWeights, parsedGeometry.matricesWeights._updatable);
                }
                if (parsedGeometry.matricesWeightsExtra) {
                    mesh.setVerticesData(LIB.VertexBuffer.MatricesWeightsExtraKind, parsedGeometry.matricesWeightsExtra, parsedGeometry.matricesWeights._updatable);
                }
                mesh.setIndices(parsedGeometry.indices, null);
            }
            // SubMeshes
            if (parsedGeometry.subMeshes) {
                mesh.subMeshes = [];
                for (var subIndex = 0; subIndex < parsedGeometry.subMeshes.length; subIndex++) {
                    var parsedSubMesh = parsedGeometry.subMeshes[subIndex];
                    LIB.SubMesh.AddToMesh(parsedSubMesh.materialIndex, parsedSubMesh.verticesStart, parsedSubMesh.verticesCount, parsedSubMesh.indexStart, parsedSubMesh.indexCount, mesh);
                }
            }
            // Flat shading
            if (mesh._shouldGenerateFlatShading) {
                mesh.convertToFlatShadedMesh();
                delete mesh._shouldGenerateFlatShading;
            }
            // Update
            mesh.computeWorldMatrix(true);
            // Octree
            var sceneOctree = scene.selectionOctree;
            if (sceneOctree !== undefined && sceneOctree !== null) {
                sceneOctree.addMesh(mesh);
            }
        };
        Geometry._CleanMatricesWeights = function (parsedGeometry, mesh) {
            var epsilon = 1e-3;
            if (!LIB.SceneLoader.CleanBoneMatrixWeights) {
                return;
            }
            var noInfluenceBoneIndex = 0.0;
            if (parsedGeometry.skeletonId > -1) {
                var skeleton = mesh.getScene().getLastSkeletonByID(parsedGeometry.skeletonId);
                if (!skeleton) {
                    return;
                }
                noInfluenceBoneIndex = skeleton.bones.length;
            }
            else {
                return;
            }
            var matricesIndices = mesh.getVerticesData(LIB.VertexBuffer.MatricesIndicesKind);
            var matricesIndicesExtra = mesh.getVerticesData(LIB.VertexBuffer.MatricesIndicesExtraKind);
            var matricesWeights = parsedGeometry.matricesWeights;
            var matricesWeightsExtra = parsedGeometry.matricesWeightsExtra;
            var influencers = parsedGeometry.numBoneInfluencer;
            var size = matricesWeights.length;
            for (var i = 0; i < size; i += 4) {
                var weight = 0.0;
                var firstZeroWeight = -1;
                for (var j = 0; j < 4; j++) {
                    var w = matricesWeights[i + j];
                    weight += w;
                    if (w < epsilon && firstZeroWeight < 0) {
                        firstZeroWeight = j;
                    }
                }
                if (matricesWeightsExtra) {
                    for (var j = 0; j < 4; j++) {
                        var w = matricesWeightsExtra[i + j];
                        weight += w;
                        if (w < epsilon && firstZeroWeight < 0) {
                            firstZeroWeight = j + 4;
                        }
                    }
                }
                if (firstZeroWeight < 0 || firstZeroWeight > (influencers - 1)) {
                    firstZeroWeight = influencers - 1;
                }
                if (weight > epsilon) {
                    var mweight = 1.0 / weight;
                    for (var j = 0; j < 4; j++) {
                        matricesWeights[i + j] *= mweight;
                    }
                    if (matricesWeightsExtra) {
                        for (var j = 0; j < 4; j++) {
                            matricesWeightsExtra[i + j] *= mweight;
                        }
                    }
                }
                else {
                    if (firstZeroWeight >= 4) {
                        matricesWeightsExtra[i + firstZeroWeight - 4] = 1.0 - weight;
                        matricesIndicesExtra[i + firstZeroWeight - 4] = noInfluenceBoneIndex;
                    }
                    else {
                        matricesWeights[i + firstZeroWeight] = 1.0 - weight;
                        matricesIndices[i + firstZeroWeight] = noInfluenceBoneIndex;
                    }
                }
            }
            mesh.setVerticesData(LIB.VertexBuffer.MatricesIndicesKind, matricesIndices);
            if (parsedGeometry.matricesWeightsExtra) {
                mesh.setVerticesData(LIB.VertexBuffer.MatricesIndicesExtraKind, matricesIndicesExtra);
            }
        };
        /**
         * Create a new geometry from persisted data (Using .LIB file format)
         * @param parsedVertexData defines the persisted data
         * @param scene defines the hosting scene
         * @param rootUrl defines the root url to use to load assets (like delayed data)
         * @returns the new geometry object
         */
        Geometry.Parse = function (parsedVertexData, scene, rootUrl) {
            if (scene.getGeometryByID(parsedVertexData.id)) {
                return null; // null since geometry could be something else than a box...
            }
            var geometry = new Geometry(parsedVertexData.id, scene, undefined, parsedVertexData.updatable);
            if (LIB.Tags) {
                LIB.Tags.AddTagsTo(geometry, parsedVertexData.tags);
            }
            if (parsedVertexData.delayLoadingFile) {
                geometry.delayLoadState = LIB.Engine.DELAYLOADSTATE_NOTLOADED;
                geometry.delayLoadingFile = rootUrl + parsedVertexData.delayLoadingFile;
                geometry._boundingInfo = new LIB.BoundingInfo(LIB.Vector3.FromArray(parsedVertexData.boundingBoxMinimum), LIB.Vector3.FromArray(parsedVertexData.boundingBoxMaximum));
                geometry._delayInfo = [];
                if (parsedVertexData.hasUVs) {
                    geometry._delayInfo.push(LIB.VertexBuffer.UVKind);
                }
                if (parsedVertexData.hasUVs2) {
                    geometry._delayInfo.push(LIB.VertexBuffer.UV2Kind);
                }
                if (parsedVertexData.hasUVs3) {
                    geometry._delayInfo.push(LIB.VertexBuffer.UV3Kind);
                }
                if (parsedVertexData.hasUVs4) {
                    geometry._delayInfo.push(LIB.VertexBuffer.UV4Kind);
                }
                if (parsedVertexData.hasUVs5) {
                    geometry._delayInfo.push(LIB.VertexBuffer.UV5Kind);
                }
                if (parsedVertexData.hasUVs6) {
                    geometry._delayInfo.push(LIB.VertexBuffer.UV6Kind);
                }
                if (parsedVertexData.hasColors) {
                    geometry._delayInfo.push(LIB.VertexBuffer.ColorKind);
                }
                if (parsedVertexData.hasMatricesIndices) {
                    geometry._delayInfo.push(LIB.VertexBuffer.MatricesIndicesKind);
                }
                if (parsedVertexData.hasMatricesWeights) {
                    geometry._delayInfo.push(LIB.VertexBuffer.MatricesWeightsKind);
                }
                geometry._delayLoadingFunction = LIB.VertexData.ImportVertexData;
            }
            else {
                LIB.VertexData.ImportVertexData(parsedVertexData, geometry);
            }
            scene.pushGeometry(geometry, true);
            return geometry;
        };
        return Geometry;
    }());
    LIB.Geometry = Geometry;
    // Primitives
    /// Abstract class
    /**
     * Abstract class used to provide common services for all typed geometries
     * @hidden
     */
    var _PrimitiveGeometry = /** @class */ (function (_super) {
        __extends(_PrimitiveGeometry, _super);
        /**
         * Creates a new typed geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param _canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         */
        function _PrimitiveGeometry(id, scene, _canBeRegenerated, mesh) {
            if (_canBeRegenerated === void 0) { _canBeRegenerated = false; }
            if (mesh === void 0) { mesh = null; }
            var _this = _super.call(this, id, scene, undefined, false, mesh) || this;
            _this._canBeRegenerated = _canBeRegenerated;
            _this._beingRegenerated = true;
            _this.regenerate();
            _this._beingRegenerated = false;
            return _this;
        }
        /**
         * Gets a value indicating if the geometry supports being regenerated with new parameters (false by default)
         * @returns true if the geometry can be regenerated
         */
        _PrimitiveGeometry.prototype.canBeRegenerated = function () {
            return this._canBeRegenerated;
        };
        /**
         * If the geometry supports regeneration, the function will recreates the geometry with updated parameter values
         */
        _PrimitiveGeometry.prototype.regenerate = function () {
            if (!this._canBeRegenerated) {
                return;
            }
            this._beingRegenerated = true;
            this.setAllVerticesData(this._regenerateVertexData(), false);
            this._beingRegenerated = false;
        };
        /**
         * Clone the geometry
         * @param id defines the unique ID of the new geometry
         * @returns the new geometry
         */
        _PrimitiveGeometry.prototype.asNewGeometry = function (id) {
            return _super.prototype.copy.call(this, id);
        };
        // overrides
        _PrimitiveGeometry.prototype.setAllVerticesData = function (vertexData, updatable) {
            if (!this._beingRegenerated) {
                return;
            }
            _super.prototype.setAllVerticesData.call(this, vertexData, false);
        };
        _PrimitiveGeometry.prototype.setVerticesData = function (kind, data, updatable) {
            if (!this._beingRegenerated) {
                return;
            }
            _super.prototype.setVerticesData.call(this, kind, data, false);
        };
        // to override
        /** @hidden */
        _PrimitiveGeometry.prototype._regenerateVertexData = function () {
            throw new Error("Abstract method");
        };
        _PrimitiveGeometry.prototype.copy = function (id) {
            throw new Error("Must be overriden in sub-classes.");
        };
        _PrimitiveGeometry.prototype.serialize = function () {
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.canBeRegenerated = this.canBeRegenerated();
            return serializationObject;
        };
        return _PrimitiveGeometry;
    }(Geometry));
    LIB._PrimitiveGeometry = _PrimitiveGeometry;
    /**
     * Creates a ribbon geometry
     * @description See http://doc.LIBjs.com/how_to/ribbon_tutorial, http://doc.LIBjs.com/resources/maths_make_ribbons
     */
    var RibbonGeometry = /** @class */ (function (_super) {
        __extends(RibbonGeometry, _super);
        /**
         * Creates a ribbon geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param pathArray defines the array of paths to use
         * @param closeArray defines if the last path and the first path must be  joined
         * @param closePath defines if the last and first points of each path in your pathArray must be joined
         * @param offset defines the offset between points
         * @param canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         * @param side defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        function RibbonGeometry(id, scene,
        /**
         * Defines the array of paths to use
         */
        pathArray,
        /**
         * Defines if the last and first points of each path in your pathArray must be joined
         */
        closeArray,
        /**
         * Defines if the last and first points of each path in your pathArray must be joined
         */
        closePath,
        /**
         * Defines the offset between points
         */
        offset, canBeRegenerated, mesh,
        /**
         * Defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        side) {
            if (side === void 0) { side = LIB.Mesh.DEFAULTSIDE; }
            var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
            _this.pathArray = pathArray;
            _this.closeArray = closeArray;
            _this.closePath = closePath;
            _this.offset = offset;
            _this.side = side;
            return _this;
        }
        /** @hidden */
        RibbonGeometry.prototype._regenerateVertexData = function () {
            return LIB.VertexData.CreateRibbon({ pathArray: this.pathArray, closeArray: this.closeArray, closePath: this.closePath, offset: this.offset, sideOrientation: this.side });
        };
        RibbonGeometry.prototype.copy = function (id) {
            return new RibbonGeometry(id, this.getScene(), this.pathArray, this.closeArray, this.closePath, this.offset, this.canBeRegenerated(), undefined, this.side);
        };
        return RibbonGeometry;
    }(_PrimitiveGeometry));
    LIB.RibbonGeometry = RibbonGeometry;
    /**
     * Creates a box geometry
     * @description see http://doc.LIBjs.com/how_to/set_shapes#box
     */
    var BoxGeometry = /** @class */ (function (_super) {
        __extends(BoxGeometry, _super);
        /**
         * Creates a box geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param size defines the zise of the box (width, height and depth are the same)
         * @param canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         * @param side defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        function BoxGeometry(id, scene,
        /**
         * Defines the zise of the box (width, height and depth are the same)
         */
        size, canBeRegenerated, mesh,
        /**
         * Defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        side) {
            if (mesh === void 0) { mesh = null; }
            if (side === void 0) { side = LIB.Mesh.DEFAULTSIDE; }
            var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
            _this.size = size;
            _this.side = side;
            return _this;
        }
        BoxGeometry.prototype._regenerateVertexData = function () {
            return LIB.VertexData.CreateCube({ size: this.size, sideOrientation: this.side });
        };
        BoxGeometry.prototype.copy = function (id) {
            return new BoxGeometry(id, this.getScene(), this.size, this.canBeRegenerated(), undefined, this.side);
        };
        BoxGeometry.prototype.serialize = function () {
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.size = this.size;
            return serializationObject;
        };
        BoxGeometry.Parse = function (parsedBox, scene) {
            if (scene.getGeometryByID(parsedBox.id)) {
                return null; // null since geometry could be something else than a box...
            }
            var box = new BoxGeometry(parsedBox.id, scene, parsedBox.size, parsedBox.canBeRegenerated, null);
            if (LIB.Tags) {
                LIB.Tags.AddTagsTo(box, parsedBox.tags);
            }
            scene.pushGeometry(box, true);
            return box;
        };
        return BoxGeometry;
    }(_PrimitiveGeometry));
    LIB.BoxGeometry = BoxGeometry;
    /**
     * Creates a sphere geometry
     * @description see http://doc.LIBjs.com/how_to/set_shapes#sphere
     */
    var SphereGeometry = /** @class */ (function (_super) {
        __extends(SphereGeometry, _super);
        /**
         * Create a new sphere geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param segments defines the number of segments to use to create the sphere
         * @param diameter defines the diameter of the sphere
         * @param canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         * @param side defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        function SphereGeometry(id, scene,
        /**
         * Defines the number of segments to use to create the sphere
         */
        segments,
        /**
         * Defines the diameter of the sphere
         */
        diameter, canBeRegenerated, mesh,
        /**
         * Defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        side) {
            if (mesh === void 0) { mesh = null; }
            if (side === void 0) { side = LIB.Mesh.DEFAULTSIDE; }
            var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
            _this.segments = segments;
            _this.diameter = diameter;
            _this.side = side;
            return _this;
        }
        SphereGeometry.prototype._regenerateVertexData = function () {
            return LIB.VertexData.CreateSphere({ segments: this.segments, diameter: this.diameter, sideOrientation: this.side });
        };
        SphereGeometry.prototype.copy = function (id) {
            return new SphereGeometry(id, this.getScene(), this.segments, this.diameter, this.canBeRegenerated(), null, this.side);
        };
        SphereGeometry.prototype.serialize = function () {
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.segments = this.segments;
            serializationObject.diameter = this.diameter;
            return serializationObject;
        };
        SphereGeometry.Parse = function (parsedSphere, scene) {
            if (scene.getGeometryByID(parsedSphere.id)) {
                return null; // null since geometry could be something else than a sphere...
            }
            var sphere = new SphereGeometry(parsedSphere.id, scene, parsedSphere.segments, parsedSphere.diameter, parsedSphere.canBeRegenerated, null);
            if (LIB.Tags) {
                LIB.Tags.AddTagsTo(sphere, parsedSphere.tags);
            }
            scene.pushGeometry(sphere, true);
            return sphere;
        };
        return SphereGeometry;
    }(_PrimitiveGeometry));
    LIB.SphereGeometry = SphereGeometry;
    /**
     * Creates a disc geometry
     * @description see http://doc.LIBjs.com/how_to/set_shapes#disc-or-regular-polygon
     */
    var DiscGeometry = /** @class */ (function (_super) {
        __extends(DiscGeometry, _super);
        /**
         * Creates a new disc geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param radius defines the radius of the disc
         * @param tessellation defines the tesselation factor to apply to the disc
         * @param canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         * @param side defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        function DiscGeometry(id, scene,
        /**
         * Defines the radius of the disc
         */
        radius,
        /**
         * Defines the tesselation factor to apply to the disc
         */
        tessellation, canBeRegenerated, mesh,
        /**
         * Defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        side) {
            if (mesh === void 0) { mesh = null; }
            if (side === void 0) { side = LIB.Mesh.DEFAULTSIDE; }
            var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
            _this.radius = radius;
            _this.tessellation = tessellation;
            _this.side = side;
            return _this;
        }
        DiscGeometry.prototype._regenerateVertexData = function () {
            return LIB.VertexData.CreateDisc({ radius: this.radius, tessellation: this.tessellation, sideOrientation: this.side });
        };
        DiscGeometry.prototype.copy = function (id) {
            return new DiscGeometry(id, this.getScene(), this.radius, this.tessellation, this.canBeRegenerated(), null, this.side);
        };
        return DiscGeometry;
    }(_PrimitiveGeometry));
    LIB.DiscGeometry = DiscGeometry;
    /**
     * Creates a new cylinder geometry
     * @description see http://doc.LIBjs.com/how_to/set_shapes#cylinder-or-cone
     */
    var CylinderGeometry = /** @class */ (function (_super) {
        __extends(CylinderGeometry, _super);
        /**
         * Creates a new cylinder geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param height defines the height of the cylinder
         * @param diameterTop defines the diameter of the cylinder's top cap
         * @param diameterBottom defines the diameter of the cylinder's bottom cap
         * @param tessellation defines the tessellation factor to apply to the cylinder (number of radial sides)
         * @param subdivisions defines the number of subdivisions to apply to the cylinder (number of rings) (1 by default)
         * @param canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         * @param side defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        function CylinderGeometry(id, scene,
        /**
         * Defines the height of the cylinder
         */
        height,
        /**
         * Defines the diameter of the cylinder's top cap
         */
        diameterTop,
        /**
         * Defines the diameter of the cylinder's bottom cap
         */
        diameterBottom,
        /**
         * Defines the tessellation factor to apply to the cylinder
         */
        tessellation,
        /**
         * Defines the number of subdivisions to apply to the cylinder (1 by default)
         */
        subdivisions, canBeRegenerated, mesh,
        /**
         * Defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        side) {
            if (subdivisions === void 0) { subdivisions = 1; }
            if (mesh === void 0) { mesh = null; }
            if (side === void 0) { side = LIB.Mesh.DEFAULTSIDE; }
            var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
            _this.height = height;
            _this.diameterTop = diameterTop;
            _this.diameterBottom = diameterBottom;
            _this.tessellation = tessellation;
            _this.subdivisions = subdivisions;
            _this.side = side;
            return _this;
        }
        CylinderGeometry.prototype._regenerateVertexData = function () {
            return LIB.VertexData.CreateCylinder({ height: this.height, diameterTop: this.diameterTop, diameterBottom: this.diameterBottom, tessellation: this.tessellation, subdivisions: this.subdivisions, sideOrientation: this.side });
        };
        CylinderGeometry.prototype.copy = function (id) {
            return new CylinderGeometry(id, this.getScene(), this.height, this.diameterTop, this.diameterBottom, this.tessellation, this.subdivisions, this.canBeRegenerated(), null, this.side);
        };
        CylinderGeometry.prototype.serialize = function () {
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.height = this.height;
            serializationObject.diameterTop = this.diameterTop;
            serializationObject.diameterBottom = this.diameterBottom;
            serializationObject.tessellation = this.tessellation;
            return serializationObject;
        };
        CylinderGeometry.Parse = function (parsedCylinder, scene) {
            if (scene.getGeometryByID(parsedCylinder.id)) {
                return null; // null since geometry could be something else than a cylinder...
            }
            var cylinder = new CylinderGeometry(parsedCylinder.id, scene, parsedCylinder.height, parsedCylinder.diameterTop, parsedCylinder.diameterBottom, parsedCylinder.tessellation, parsedCylinder.subdivisions, parsedCylinder.canBeRegenerated, null);
            if (LIB.Tags) {
                LIB.Tags.AddTagsTo(cylinder, parsedCylinder.tags);
            }
            scene.pushGeometry(cylinder, true);
            return cylinder;
        };
        return CylinderGeometry;
    }(_PrimitiveGeometry));
    LIB.CylinderGeometry = CylinderGeometry;
    /**
     * Creates a new torus geometry
     * @description see http://doc.LIBjs.com/how_to/set_shapes#torus
     */
    var TorusGeometry = /** @class */ (function (_super) {
        __extends(TorusGeometry, _super);
        /**
         * Creates a new torus geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param diameter defines the diameter of the torus
         * @param thickness defines the thickness of the torus (ie. internal diameter)
         * @param tessellation defines the tesselation factor to apply to the torus (number of segments along the circle)
         * @param canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         * @param side defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        function TorusGeometry(id, scene,
        /**
         * Defines the diameter of the torus
         */
        diameter,
        /**
         * Defines the thickness of the torus (ie. internal diameter)
         */
        thickness,
        /**
         * Defines the tesselation factor to apply to the torus
         */
        tessellation, canBeRegenerated, mesh,
        /**
         * Defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        side) {
            if (mesh === void 0) { mesh = null; }
            if (side === void 0) { side = LIB.Mesh.DEFAULTSIDE; }
            var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
            _this.diameter = diameter;
            _this.thickness = thickness;
            _this.tessellation = tessellation;
            _this.side = side;
            return _this;
        }
        TorusGeometry.prototype._regenerateVertexData = function () {
            return LIB.VertexData.CreateTorus({ diameter: this.diameter, thickness: this.thickness, tessellation: this.tessellation, sideOrientation: this.side });
        };
        TorusGeometry.prototype.copy = function (id) {
            return new TorusGeometry(id, this.getScene(), this.diameter, this.thickness, this.tessellation, this.canBeRegenerated(), null, this.side);
        };
        TorusGeometry.prototype.serialize = function () {
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.diameter = this.diameter;
            serializationObject.thickness = this.thickness;
            serializationObject.tessellation = this.tessellation;
            return serializationObject;
        };
        TorusGeometry.Parse = function (parsedTorus, scene) {
            if (scene.getGeometryByID(parsedTorus.id)) {
                return null; // null since geometry could be something else than a torus...
            }
            var torus = new TorusGeometry(parsedTorus.id, scene, parsedTorus.diameter, parsedTorus.thickness, parsedTorus.tessellation, parsedTorus.canBeRegenerated, null);
            if (LIB.Tags) {
                LIB.Tags.AddTagsTo(torus, parsedTorus.tags);
            }
            scene.pushGeometry(torus, true);
            return torus;
        };
        return TorusGeometry;
    }(_PrimitiveGeometry));
    LIB.TorusGeometry = TorusGeometry;
    /**
     * Creates a new ground geometry
     * @description see http://doc.LIBjs.com/how_to/set_shapes#ground
     */
    var GroundGeometry = /** @class */ (function (_super) {
        __extends(GroundGeometry, _super);
        /**
         * Creates a new ground geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param width defines the width of the ground
         * @param height defines the height of the ground
         * @param subdivisions defines the subdivisions to apply to the ground
         * @param canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         */
        function GroundGeometry(id, scene,
        /**
         * Defines the width of the ground
         */
        width,
        /**
         * Defines the height of the ground
         */
        height,
        /**
         * Defines the subdivisions to apply to the ground
         */
        subdivisions, canBeRegenerated, mesh) {
            if (mesh === void 0) { mesh = null; }
            var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
            _this.width = width;
            _this.height = height;
            _this.subdivisions = subdivisions;
            return _this;
        }
        GroundGeometry.prototype._regenerateVertexData = function () {
            return LIB.VertexData.CreateGround({ width: this.width, height: this.height, subdivisions: this.subdivisions });
        };
        GroundGeometry.prototype.copy = function (id) {
            return new GroundGeometry(id, this.getScene(), this.width, this.height, this.subdivisions, this.canBeRegenerated(), null);
        };
        GroundGeometry.prototype.serialize = function () {
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.width = this.width;
            serializationObject.height = this.height;
            serializationObject.subdivisions = this.subdivisions;
            return serializationObject;
        };
        GroundGeometry.Parse = function (parsedGround, scene) {
            if (scene.getGeometryByID(parsedGround.id)) {
                return null; // null since geometry could be something else than a ground...
            }
            var ground = new GroundGeometry(parsedGround.id, scene, parsedGround.width, parsedGround.height, parsedGround.subdivisions, parsedGround.canBeRegenerated, null);
            if (LIB.Tags) {
                LIB.Tags.AddTagsTo(ground, parsedGround.tags);
            }
            scene.pushGeometry(ground, true);
            return ground;
        };
        return GroundGeometry;
    }(_PrimitiveGeometry));
    LIB.GroundGeometry = GroundGeometry;
    /**
     * Creates a tiled ground geometry
     * @description see http://doc.LIBjs.com/how_to/set_shapes#tiled-ground
     */
    var TiledGroundGeometry = /** @class */ (function (_super) {
        __extends(TiledGroundGeometry, _super);
        /**
         * Creates a tiled ground geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param xmin defines the minimum value on X axis
         * @param zmin defines the minimum value on Z axis
         * @param xmax defines the maximum value on X axis
         * @param zmax defines the maximum value on Z axis
         * @param subdivisions defines the subdivisions to apply to the ground (number of subdivisions (tiles) on the height and the width of the map)
         * @param precision defines the precision to use when computing the tiles
         * @param canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         */
        function TiledGroundGeometry(id, scene,
        /**
         * Defines the minimum value on X axis
         */
        xmin,
        /**
         * Defines the minimum value on Z axis
         */
        zmin,
        /**
         * Defines the maximum value on X axis
         */
        xmax,
        /**
         * Defines the maximum value on Z axis
         */
        zmax,
        /**
         * Defines the subdivisions to apply to the ground
         */
        subdivisions,
        /**
         * Defines the precision to use when computing the tiles
         */
        precision, canBeRegenerated, mesh) {
            if (mesh === void 0) { mesh = null; }
            var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
            _this.xmin = xmin;
            _this.zmin = zmin;
            _this.xmax = xmax;
            _this.zmax = zmax;
            _this.subdivisions = subdivisions;
            _this.precision = precision;
            return _this;
        }
        TiledGroundGeometry.prototype._regenerateVertexData = function () {
            return LIB.VertexData.CreateTiledGround({ xmin: this.xmin, zmin: this.zmin, xmax: this.xmax, zmax: this.zmax, subdivisions: this.subdivisions, precision: this.precision });
        };
        TiledGroundGeometry.prototype.copy = function (id) {
            return new TiledGroundGeometry(id, this.getScene(), this.xmin, this.zmin, this.xmax, this.zmax, this.subdivisions, this.precision, this.canBeRegenerated(), null);
        };
        return TiledGroundGeometry;
    }(_PrimitiveGeometry));
    LIB.TiledGroundGeometry = TiledGroundGeometry;
    /**
     * Creates a plane geometry
     * @description see http://doc.LIBjs.com/how_to/set_shapes#plane
     */
    var PlaneGeometry = /** @class */ (function (_super) {
        __extends(PlaneGeometry, _super);
        /**
         * Creates a plane geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param size defines the size of the plane (width === height)
         * @param canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         * @param side defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        function PlaneGeometry(id, scene,
        /**
         * Defines the size of the plane (width === height)
         */
        size, canBeRegenerated, mesh,
        /**
         * Defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        side) {
            if (mesh === void 0) { mesh = null; }
            if (side === void 0) { side = LIB.Mesh.DEFAULTSIDE; }
            var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
            _this.size = size;
            _this.side = side;
            return _this;
        }
        PlaneGeometry.prototype._regenerateVertexData = function () {
            return LIB.VertexData.CreatePlane({ size: this.size, sideOrientation: this.side });
        };
        PlaneGeometry.prototype.copy = function (id) {
            return new PlaneGeometry(id, this.getScene(), this.size, this.canBeRegenerated(), null, this.side);
        };
        PlaneGeometry.prototype.serialize = function () {
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.size = this.size;
            return serializationObject;
        };
        PlaneGeometry.Parse = function (parsedPlane, scene) {
            if (scene.getGeometryByID(parsedPlane.id)) {
                return null; // null since geometry could be something else than a ground...
            }
            var plane = new PlaneGeometry(parsedPlane.id, scene, parsedPlane.size, parsedPlane.canBeRegenerated, null);
            if (LIB.Tags) {
                LIB.Tags.AddTagsTo(plane, parsedPlane.tags);
            }
            scene.pushGeometry(plane, true);
            return plane;
        };
        return PlaneGeometry;
    }(_PrimitiveGeometry));
    LIB.PlaneGeometry = PlaneGeometry;
    /**
     * Creates a torus knot geometry
     * @description see http://doc.LIBjs.com/how_to/set_shapes#torus-knot
     */
    var TorusKnotGeometry = /** @class */ (function (_super) {
        __extends(TorusKnotGeometry, _super);
        /**
         * Creates a torus knot geometry
         * @param id defines the unique ID of the geometry
         * @param scene defines the hosting scene
         * @param radius defines the radius of the torus knot
         * @param tube defines the thickness of the torus knot tube
         * @param radialSegments defines the number of radial segments
         * @param tubularSegments defines the number of tubular segments
         * @param p defines the first number of windings
         * @param q defines the second number of windings
         * @param canBeRegenerated defines if the geometry supports being regenerated with new parameters (false by default)
         * @param mesh defines the hosting mesh (can be null)
         * @param side defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        function TorusKnotGeometry(id, scene,
        /**
         * Defines the radius of the torus knot
         */
        radius,
        /**
         * Defines the thickness of the torus knot tube
         */
        tube,
        /**
         * Defines the number of radial segments
         */
        radialSegments,
        /**
         * Defines the number of tubular segments
         */
        tubularSegments,
        /**
         * Defines the first number of windings
         */
        p,
        /**
         * Defines the second number of windings
         */
        q, canBeRegenerated, mesh,
        /**
         * Defines if the created geometry is double sided or not (default is LIB.Mesh.DEFAULTSIDE)
         */
        side) {
            if (mesh === void 0) { mesh = null; }
            if (side === void 0) { side = LIB.Mesh.DEFAULTSIDE; }
            var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
            _this.radius = radius;
            _this.tube = tube;
            _this.radialSegments = radialSegments;
            _this.tubularSegments = tubularSegments;
            _this.p = p;
            _this.q = q;
            _this.side = side;
            return _this;
        }
        TorusKnotGeometry.prototype._regenerateVertexData = function () {
            return LIB.VertexData.CreateTorusKnot({ radius: this.radius, tube: this.tube, radialSegments: this.radialSegments, tubularSegments: this.tubularSegments, p: this.p, q: this.q, sideOrientation: this.side });
        };
        TorusKnotGeometry.prototype.copy = function (id) {
            return new TorusKnotGeometry(id, this.getScene(), this.radius, this.tube, this.radialSegments, this.tubularSegments, this.p, this.q, this.canBeRegenerated(), null, this.side);
        };
        TorusKnotGeometry.prototype.serialize = function () {
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.radius = this.radius;
            serializationObject.tube = this.tube;
            serializationObject.radialSegments = this.radialSegments;
            serializationObject.tubularSegments = this.tubularSegments;
            serializationObject.p = this.p;
            serializationObject.q = this.q;
            return serializationObject;
        };
        ;
        TorusKnotGeometry.Parse = function (parsedTorusKnot, scene) {
            if (scene.getGeometryByID(parsedTorusKnot.id)) {
                return null; // null since geometry could be something else than a ground...
            }
            var torusKnot = new TorusKnotGeometry(parsedTorusKnot.id, scene, parsedTorusKnot.radius, parsedTorusKnot.tube, parsedTorusKnot.radialSegments, parsedTorusKnot.tubularSegments, parsedTorusKnot.p, parsedTorusKnot.q, parsedTorusKnot.canBeRegenerated, null);
            if (LIB.Tags) {
                LIB.Tags.AddTagsTo(torusKnot, parsedTorusKnot.tags);
            }
            scene.pushGeometry(torusKnot, true);
            return torusKnot;
        };
        return TorusKnotGeometry;
    }(_PrimitiveGeometry));
    LIB.TorusKnotGeometry = TorusKnotGeometry;
    //}
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.geometry.js.map
//# sourceMappingURL=LIB.geometry.js.map
