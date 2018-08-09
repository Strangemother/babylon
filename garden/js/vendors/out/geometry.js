var BABYLON;
(function (BABYLON) {
    var Geometry = /** @class */ (function () {
        function Geometry(id, scene, vertexData, updatable, mesh) {
            if (updatable === void 0) { updatable = false; }
            if (mesh === void 0) { mesh = null; }
            this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_NONE;
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
                    this.boundingBias = new BABYLON.Vector2(0, mesh.intersectionThreshold);
                    this.updateExtend();
                }
                this.applyToMesh(mesh);
                mesh.computeWorldMatrix(true);
            }
        }
        Object.defineProperty(Geometry.prototype, "boundingBias", {
            /**
             *  The Bias Vector to apply on the bounding elements (box/sphere), the max extend is computed as v += v * bias.x + bias.y, the min is computed as v -= v * bias.x + bias.y
             * @returns The Bias Vector
             */
            get: function () {
                return this._boundingBias;
            },
            set: function (value) {
                if (this._boundingBias && this._boundingBias.equals(value)) {
                    return;
                }
                this._boundingBias = value.clone();
                this.updateBoundingInfo(true, null);
            },
            enumerable: true,
            configurable: true
        });
        Geometry.CreateGeometryForMesh = function (mesh) {
            var geometry = new Geometry(Geometry.RandomId(), mesh.getScene());
            geometry.applyToMesh(mesh);
            return geometry;
        };
        Object.defineProperty(Geometry.prototype, "extend", {
            get: function () {
                return this._extend;
            },
            enumerable: true,
            configurable: true
        });
        Geometry.prototype.getScene = function () {
            return this._scene;
        };
        Geometry.prototype.getEngine = function () {
            return this._engine;
        };
        Geometry.prototype.isReady = function () {
            return this.delayLoadState === BABYLON.Engine.DELAYLOADSTATE_LOADED || this.delayLoadState === BABYLON.Engine.DELAYLOADSTATE_NONE;
        };
        Object.defineProperty(Geometry.prototype, "doNotSerialize", {
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
        Geometry.prototype.setAllVerticesData = function (vertexData, updatable) {
            vertexData.applyToGeometry(this, updatable);
            this.notifyUpdate();
        };
        Geometry.prototype.setVerticesData = function (kind, data, updatable, stride) {
            if (updatable === void 0) { updatable = false; }
            var buffer = new BABYLON.VertexBuffer(this._engine, data, kind, updatable, this._meshes.length === 0, stride);
            this.setVerticesBuffer(buffer);
        };
        Geometry.prototype.removeVerticesData = function (kind) {
            if (this._vertexBuffers[kind]) {
                this._vertexBuffers[kind].dispose();
                delete this._vertexBuffers[kind];
            }
        };
        Geometry.prototype.setVerticesBuffer = function (buffer) {
            var kind = buffer.getKind();
            if (this._vertexBuffers[kind]) {
                this._vertexBuffers[kind].dispose();
            }
            this._vertexBuffers[kind] = buffer;
            if (kind === BABYLON.VertexBuffer.PositionKind) {
                var data = buffer.getData();
                var stride = buffer.getStrideSize();
                this._totalVertices = data.length / stride;
                this.updateExtend(data, stride);
                this._resetPointsArrayCache();
                var meshes = this._meshes;
                var numOfMeshes = meshes.length;
                for (var index = 0; index < numOfMeshes; index++) {
                    var mesh = meshes[index];
                    mesh._boundingInfo = new BABYLON.BoundingInfo(this._extend.minimum, this._extend.maximum);
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
        Geometry.prototype.updateVerticesDataDirectly = function (kind, data, offset) {
            var vertexBuffer = this.getVertexBuffer(kind);
            if (!vertexBuffer) {
                return;
            }
            vertexBuffer.updateDirectly(data, offset);
            this.notifyUpdate(kind);
        };
        Geometry.prototype.updateVerticesData = function (kind, data, updateExtends) {
            if (updateExtends === void 0) { updateExtends = false; }
            var vertexBuffer = this.getVertexBuffer(kind);
            if (!vertexBuffer) {
                return;
            }
            vertexBuffer.update(data);
            if (kind === BABYLON.VertexBuffer.PositionKind) {
                var stride = vertexBuffer.getStrideSize();
                this._totalVertices = data.length / stride;
                this.updateBoundingInfo(updateExtends, data);
            }
            this.notifyUpdate(kind);
        };
        Geometry.prototype.updateBoundingInfo = function (updateExtends, data) {
            if (updateExtends) {
                this.updateExtend(data);
            }
            var meshes = this._meshes;
            var numOfMeshes = meshes.length;
            this._resetPointsArrayCache();
            for (var index = 0; index < numOfMeshes; index++) {
                var mesh = meshes[index];
                if (updateExtends) {
                    mesh._boundingInfo = new BABYLON.BoundingInfo(this._extend.minimum, this._extend.maximum);
                    for (var subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
                        var subMesh = mesh.subMeshes[subIndex];
                        subMesh.refreshBoundingInfo();
                    }
                }
            }
        };
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
        Geometry.prototype.getTotalVertices = function () {
            if (!this.isReady()) {
                return 0;
            }
            return this._totalVertices;
        };
        Geometry.prototype.getVerticesData = function (kind, copyWhenShared, forceCopy) {
            var vertexBuffer = this.getVertexBuffer(kind);
            if (!vertexBuffer) {
                return null;
            }
            var orig = vertexBuffer.getData();
            if (!forceCopy && (!copyWhenShared || this._meshes.length === 1)) {
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
         * Returns a boolean defining if the vertex data for the requested `kind` is updatable.
         * Possible `kind` values :
         * - BABYLON.VertexBuffer.PositionKind
         * - BABYLON.VertexBuffer.UVKind
         * - BABYLON.VertexBuffer.UV2Kind
         * - BABYLON.VertexBuffer.UV3Kind
         * - BABYLON.VertexBuffer.UV4Kind
         * - BABYLON.VertexBuffer.UV5Kind
         * - BABYLON.VertexBuffer.UV6Kind
         * - BABYLON.VertexBuffer.ColorKind
         * - BABYLON.VertexBuffer.MatricesIndicesKind
         * - BABYLON.VertexBuffer.MatricesIndicesExtraKind
         * - BABYLON.VertexBuffer.MatricesWeightsKind
         * - BABYLON.VertexBuffer.MatricesWeightsExtraKind
         */
        Geometry.prototype.isVertexBufferUpdatable = function (kind) {
            var vb = this._vertexBuffers[kind];
            if (!vb) {
                return false;
            }
            return vb.isUpdatable();
        };
        Geometry.prototype.getVertexBuffer = function (kind) {
            if (!this.isReady()) {
                return null;
            }
            return this._vertexBuffers[kind];
        };
        Geometry.prototype.getVertexBuffers = function () {
            if (!this.isReady()) {
                return null;
            }
            return this._vertexBuffers;
        };
        Geometry.prototype.isVerticesDataPresent = function (kind) {
            if (!this._vertexBuffers) {
                if (this._delayInfo) {
                    return this._delayInfo.indexOf(kind) !== -1;
                }
                return false;
            }
            return this._vertexBuffers[kind] !== undefined;
        };
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
            if (totalVertices != undefined) {
                this._totalVertices = totalVertices;
            }
            var meshes = this._meshes;
            var numOfMeshes = meshes.length;
            for (var index = 0; index < numOfMeshes; index++) {
                meshes[index]._createGlobalSubMesh(true);
            }
            this.notifyUpdate();
        };
        Geometry.prototype.getTotalIndices = function () {
            if (!this.isReady()) {
                return 0;
            }
            return this._indices.length;
        };
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
        Geometry.prototype.getIndexBuffer = function () {
            if (!this.isReady()) {
                return null;
            }
            return this._indexBuffer;
        };
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
        Geometry.prototype.updateExtend = function (data, stride) {
            if (data === void 0) { data = null; }
            if (!data) {
                data = this._vertexBuffers[BABYLON.VertexBuffer.PositionKind].getData();
            }
            this._extend = BABYLON.Tools.ExtractMinAndMax(data, 0, this._totalVertices, this.boundingBias, stride);
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
                if (kind === BABYLON.VertexBuffer.PositionKind) {
                    if (!this._extend) {
                        this.updateExtend(this._vertexBuffers[kind].getData());
                    }
                    mesh._boundingInfo = new BABYLON.BoundingInfo(this._extend.minimum, this._extend.maximum);
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
        Geometry.prototype.load = function (scene, onLoaded) {
            if (this.delayLoadState === BABYLON.Engine.DELAYLOADSTATE_LOADING) {
                return;
            }
            if (this.isReady()) {
                if (onLoaded) {
                    onLoaded();
                }
                return;
            }
            this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_LOADING;
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
                _this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_LOADED;
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
            var tPositions = this.getVerticesData(BABYLON.VertexBuffer.PositionKind, false);
            if (tPositions != null && tPositions.length > 0) {
                for (var i = 0; i < tPositions.length; i += 3) {
                    tPositions[i + 2] = -tPositions[i + 2];
                }
                this.setVerticesData(BABYLON.VertexBuffer.PositionKind, tPositions, false);
            }
            // Negate normal.z
            var tNormals = this.getVerticesData(BABYLON.VertexBuffer.NormalKind, false);
            if (tNormals != null && tNormals.length > 0) {
                for (var i = 0; i < tNormals.length; i += 3) {
                    tNormals[i + 2] = -tNormals[i + 2];
                }
                this.setVerticesData(BABYLON.VertexBuffer.NormalKind, tNormals, false);
            }
        };
        // Cache
        Geometry.prototype._resetPointsArrayCache = function () {
            this._positions = null;
        };
        Geometry.prototype._generatePointsArray = function () {
            if (this._positions)
                return true;
            this._positions = [];
            var data = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            if (!data) {
                return false;
            }
            for (var index = 0; index < data.length; index += 3) {
                this._positions.push(BABYLON.Vector3.FromArray(data, index));
            }
            return true;
        };
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
            this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_NONE;
            this.delayLoadingFile = null;
            this._delayLoadingFunction = null;
            this._delayInfo = [];
            this._boundingInfo = null;
            this._scene.removeGeometry(this);
            this._isDisposed = true;
        };
        Geometry.prototype.copy = function (id) {
            var vertexData = new BABYLON.VertexData();
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
            geometry._boundingInfo = new BABYLON.BoundingInfo(this._extend.minimum, this._extend.maximum);
            return geometry;
        };
        Geometry.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.id = this.id;
            serializationObject.updatable = this._updatable;
            if (BABYLON.Tags && BABYLON.Tags.HasTags(this)) {
                serializationObject.tags = BABYLON.Tags.GetTags(this);
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
        Geometry.prototype.serializeVerticeData = function () {
            var serializationObject = this.serialize();
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.PositionKind)) {
                serializationObject.positions = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.PositionKind));
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.PositionKind)) {
                    serializationObject.positions._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.NormalKind)) {
                serializationObject.normals = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.NormalKind));
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.NormalKind)) {
                    serializationObject.normals._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.UVKind)) {
                serializationObject.uvs = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.UVKind));
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.UVKind)) {
                    serializationObject.uvs._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.UV2Kind)) {
                serializationObject.uv2s = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.UV2Kind));
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.UV2Kind)) {
                    serializationObject.uv2s._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.UV3Kind)) {
                serializationObject.uv3s = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.UV3Kind));
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.UV3Kind)) {
                    serializationObject.uv3s._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.UV4Kind)) {
                serializationObject.uv4s = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.UV4Kind));
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.UV4Kind)) {
                    serializationObject.uv4s._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.UV5Kind)) {
                serializationObject.uv5s = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.UV5Kind));
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.UV5Kind)) {
                    serializationObject.uv5s._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.UV6Kind)) {
                serializationObject.uv6s = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.UV6Kind));
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.UV6Kind)) {
                    serializationObject.uv6s._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.ColorKind)) {
                serializationObject.colors = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.ColorKind));
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.ColorKind)) {
                    serializationObject.colors._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesIndicesKind)) {
                serializationObject.matricesIndices = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind));
                serializationObject.matricesIndices._isExpanded = true;
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.MatricesIndicesKind)) {
                    serializationObject.matricesIndices._updatable = true;
                }
            }
            if (this.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesWeightsKind)) {
                serializationObject.matricesWeights = this.toNumberArray(this.getVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind));
                if (this.isVertexBufferUpdatable(BABYLON.VertexBuffer.MatricesWeightsKind)) {
                    serializationObject.matricesWeights._updatable = true;
                }
            }
            serializationObject.indices = this.toNumberArray(this.getIndices());
            return serializationObject;
        };
        // Statics
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
         */
        Geometry.RandomId = function () {
            return BABYLON.Tools.RandomId();
        };
        Geometry.ImportGeometry = function (parsedGeometry, mesh) {
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
                    mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, positionsData, false);
                }
                if (binaryInfo.normalsAttrDesc && binaryInfo.normalsAttrDesc.count > 0) {
                    var normalsData = new Float32Array(parsedGeometry, binaryInfo.normalsAttrDesc.offset, binaryInfo.normalsAttrDesc.count);
                    mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, normalsData, false);
                }
                if (binaryInfo.uvsAttrDesc && binaryInfo.uvsAttrDesc.count > 0) {
                    var uvsData = new Float32Array(parsedGeometry, binaryInfo.uvsAttrDesc.offset, binaryInfo.uvsAttrDesc.count);
                    mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, uvsData, false);
                }
                if (binaryInfo.uvs2AttrDesc && binaryInfo.uvs2AttrDesc.count > 0) {
                    var uvs2Data = new Float32Array(parsedGeometry, binaryInfo.uvs2AttrDesc.offset, binaryInfo.uvs2AttrDesc.count);
                    mesh.setVerticesData(BABYLON.VertexBuffer.UV2Kind, uvs2Data, false);
                }
                if (binaryInfo.uvs3AttrDesc && binaryInfo.uvs3AttrDesc.count > 0) {
                    var uvs3Data = new Float32Array(parsedGeometry, binaryInfo.uvs3AttrDesc.offset, binaryInfo.uvs3AttrDesc.count);
                    mesh.setVerticesData(BABYLON.VertexBuffer.UV3Kind, uvs3Data, false);
                }
                if (binaryInfo.uvs4AttrDesc && binaryInfo.uvs4AttrDesc.count > 0) {
                    var uvs4Data = new Float32Array(parsedGeometry, binaryInfo.uvs4AttrDesc.offset, binaryInfo.uvs4AttrDesc.count);
                    mesh.setVerticesData(BABYLON.VertexBuffer.UV4Kind, uvs4Data, false);
                }
                if (binaryInfo.uvs5AttrDesc && binaryInfo.uvs5AttrDesc.count > 0) {
                    var uvs5Data = new Float32Array(parsedGeometry, binaryInfo.uvs5AttrDesc.offset, binaryInfo.uvs5AttrDesc.count);
                    mesh.setVerticesData(BABYLON.VertexBuffer.UV5Kind, uvs5Data, false);
                }
                if (binaryInfo.uvs6AttrDesc && binaryInfo.uvs6AttrDesc.count > 0) {
                    var uvs6Data = new Float32Array(parsedGeometry, binaryInfo.uvs6AttrDesc.offset, binaryInfo.uvs6AttrDesc.count);
                    mesh.setVerticesData(BABYLON.VertexBuffer.UV6Kind, uvs6Data, false);
                }
                if (binaryInfo.colorsAttrDesc && binaryInfo.colorsAttrDesc.count > 0) {
                    var colorsData = new Float32Array(parsedGeometry, binaryInfo.colorsAttrDesc.offset, binaryInfo.colorsAttrDesc.count);
                    mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, colorsData, false, binaryInfo.colorsAttrDesc.stride);
                }
                if (binaryInfo.matricesIndicesAttrDesc && binaryInfo.matricesIndicesAttrDesc.count > 0) {
                    var matricesIndicesData = new Int32Array(parsedGeometry, binaryInfo.matricesIndicesAttrDesc.offset, binaryInfo.matricesIndicesAttrDesc.count);
                    mesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, matricesIndicesData, false);
                }
                if (binaryInfo.matricesWeightsAttrDesc && binaryInfo.matricesWeightsAttrDesc.count > 0) {
                    var matricesWeightsData = new Float32Array(parsedGeometry, binaryInfo.matricesWeightsAttrDesc.offset, binaryInfo.matricesWeightsAttrDesc.count);
                    mesh.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, matricesWeightsData, false);
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
                        BABYLON.SubMesh.AddToMesh(materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh);
                    }
                }
            }
            else if (parsedGeometry.positions && parsedGeometry.normals && parsedGeometry.indices) {
                mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, parsedGeometry.positions, parsedGeometry.positions._updatable);
                mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, parsedGeometry.normals, parsedGeometry.normals._updatable);
                if (parsedGeometry.uvs) {
                    mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, parsedGeometry.uvs, parsedGeometry.uvs._updatable);
                }
                if (parsedGeometry.uvs2) {
                    mesh.setVerticesData(BABYLON.VertexBuffer.UV2Kind, parsedGeometry.uvs2, parsedGeometry.uvs2._updatable);
                }
                if (parsedGeometry.uvs3) {
                    mesh.setVerticesData(BABYLON.VertexBuffer.UV3Kind, parsedGeometry.uvs3, parsedGeometry.uvs3._updatable);
                }
                if (parsedGeometry.uvs4) {
                    mesh.setVerticesData(BABYLON.VertexBuffer.UV4Kind, parsedGeometry.uvs4, parsedGeometry.uvs4._updatable);
                }
                if (parsedGeometry.uvs5) {
                    mesh.setVerticesData(BABYLON.VertexBuffer.UV5Kind, parsedGeometry.uvs5, parsedGeometry.uvs5._updatable);
                }
                if (parsedGeometry.uvs6) {
                    mesh.setVerticesData(BABYLON.VertexBuffer.UV6Kind, parsedGeometry.uvs6, parsedGeometry.uvs6._updatable);
                }
                if (parsedGeometry.colors) {
                    mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, BABYLON.Color4.CheckColors4(parsedGeometry.colors, parsedGeometry.positions.length / 3), parsedGeometry.colors._updatable);
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
                        mesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, floatIndices, parsedGeometry.matricesIndices._updatable);
                    }
                    else {
                        delete parsedGeometry.matricesIndices._isExpanded;
                        mesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, parsedGeometry.matricesIndices, parsedGeometry.matricesIndices._updatable);
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
                        mesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesExtraKind, floatIndices, parsedGeometry.matricesIndicesExtra._updatable);
                    }
                    else {
                        delete parsedGeometry.matricesIndices._isExpanded;
                        mesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesExtraKind, parsedGeometry.matricesIndicesExtra, parsedGeometry.matricesIndicesExtra._updatable);
                    }
                }
                if (parsedGeometry.matricesWeights) {
                    Geometry._CleanMatricesWeights(parsedGeometry, mesh);
                    mesh.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, parsedGeometry.matricesWeights, parsedGeometry.matricesWeights._updatable);
                }
                if (parsedGeometry.matricesWeightsExtra) {
                    mesh.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsExtraKind, parsedGeometry.matricesWeightsExtra, parsedGeometry.matricesWeights._updatable);
                }
                mesh.setIndices(parsedGeometry.indices, null);
            }
            // SubMeshes
            if (parsedGeometry.subMeshes) {
                mesh.subMeshes = [];
                for (var subIndex = 0; subIndex < parsedGeometry.subMeshes.length; subIndex++) {
                    var parsedSubMesh = parsedGeometry.subMeshes[subIndex];
                    BABYLON.SubMesh.AddToMesh(parsedSubMesh.materialIndex, parsedSubMesh.verticesStart, parsedSubMesh.verticesCount, parsedSubMesh.indexStart, parsedSubMesh.indexCount, mesh);
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
            if (scene['_selectionOctree']) {
                scene['_selectionOctree'].addMesh(mesh);
            }
        };
        Geometry._CleanMatricesWeights = function (parsedGeometry, mesh) {
            var epsilon = 1e-3;
            if (!BABYLON.SceneLoader.CleanBoneMatrixWeights) {
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
            var matricesIndices = mesh.getVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind);
            var matricesIndicesExtra = mesh.getVerticesData(BABYLON.VertexBuffer.MatricesIndicesExtraKind);
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
            mesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, matricesIndices);
            if (parsedGeometry.matricesWeightsExtra) {
                mesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesExtraKind, matricesIndicesExtra);
            }
        };
        Geometry.Parse = function (parsedVertexData, scene, rootUrl) {
            if (scene.getGeometryByID(parsedVertexData.id)) {
                return null; // null since geometry could be something else than a box...
            }
            var geometry = new Geometry(parsedVertexData.id, scene, undefined, parsedVertexData.updatable);
            if (BABYLON.Tags) {
                BABYLON.Tags.AddTagsTo(geometry, parsedVertexData.tags);
            }
            if (parsedVertexData.delayLoadingFile) {
                geometry.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_NOTLOADED;
                geometry.delayLoadingFile = rootUrl + parsedVertexData.delayLoadingFile;
                geometry._boundingInfo = new BABYLON.BoundingInfo(BABYLON.Vector3.FromArray(parsedVertexData.boundingBoxMinimum), BABYLON.Vector3.FromArray(parsedVertexData.boundingBoxMaximum));
                geometry._delayInfo = [];
                if (parsedVertexData.hasUVs) {
                    geometry._delayInfo.push(BABYLON.VertexBuffer.UVKind);
                }
                if (parsedVertexData.hasUVs2) {
                    geometry._delayInfo.push(BABYLON.VertexBuffer.UV2Kind);
                }
                if (parsedVertexData.hasUVs3) {
                    geometry._delayInfo.push(BABYLON.VertexBuffer.UV3Kind);
                }
                if (parsedVertexData.hasUVs4) {
                    geometry._delayInfo.push(BABYLON.VertexBuffer.UV4Kind);
                }
                if (parsedVertexData.hasUVs5) {
                    geometry._delayInfo.push(BABYLON.VertexBuffer.UV5Kind);
                }
                if (parsedVertexData.hasUVs6) {
                    geometry._delayInfo.push(BABYLON.VertexBuffer.UV6Kind);
                }
                if (parsedVertexData.hasColors) {
                    geometry._delayInfo.push(BABYLON.VertexBuffer.ColorKind);
                }
                if (parsedVertexData.hasMatricesIndices) {
                    geometry._delayInfo.push(BABYLON.VertexBuffer.MatricesIndicesKind);
                }
                if (parsedVertexData.hasMatricesWeights) {
                    geometry._delayInfo.push(BABYLON.VertexBuffer.MatricesWeightsKind);
                }
                geometry._delayLoadingFunction = BABYLON.VertexData.ImportVertexData;
            }
            else {
                BABYLON.VertexData.ImportVertexData(parsedVertexData, geometry);
            }
            scene.pushGeometry(geometry, true);
            return geometry;
        };
        return Geometry;
    }());
    BABYLON.Geometry = Geometry;
    /////// Primitives //////////////////////////////////////////////
    (function (Geometry) {
        var Primitives;
        (function (Primitives) {
            /// Abstract class
            var _Primitive = /** @class */ (function (_super) {
                __extends(_Primitive, _super);
                function _Primitive(id, scene, _canBeRegenerated, mesh) {
                    if (_canBeRegenerated === void 0) { _canBeRegenerated = false; }
                    if (mesh === void 0) { mesh = null; }
                    var _this = _super.call(this, id, scene, undefined, false, mesh) || this;
                    _this._canBeRegenerated = _canBeRegenerated;
                    _this._beingRegenerated = true;
                    _this.regenerate();
                    _this._beingRegenerated = false;
                    return _this;
                }
                _Primitive.prototype.canBeRegenerated = function () {
                    return this._canBeRegenerated;
                };
                _Primitive.prototype.regenerate = function () {
                    if (!this._canBeRegenerated) {
                        return;
                    }
                    this._beingRegenerated = true;
                    this.setAllVerticesData(this._regenerateVertexData(), false);
                    this._beingRegenerated = false;
                };
                _Primitive.prototype.asNewGeometry = function (id) {
                    return _super.prototype.copy.call(this, id);
                };
                // overrides
                _Primitive.prototype.setAllVerticesData = function (vertexData, updatable) {
                    if (!this._beingRegenerated) {
                        return;
                    }
                    _super.prototype.setAllVerticesData.call(this, vertexData, false);
                };
                _Primitive.prototype.setVerticesData = function (kind, data, updatable) {
                    if (!this._beingRegenerated) {
                        return;
                    }
                    _super.prototype.setVerticesData.call(this, kind, data, false);
                };
                // to override
                // protected
                _Primitive.prototype._regenerateVertexData = function () {
                    throw new Error("Abstract method");
                };
                _Primitive.prototype.copy = function (id) {
                    throw new Error("Must be overriden in sub-classes.");
                };
                _Primitive.prototype.serialize = function () {
                    var serializationObject = _super.prototype.serialize.call(this);
                    serializationObject.canBeRegenerated = this.canBeRegenerated();
                    return serializationObject;
                };
                return _Primitive;
            }(Geometry));
            Primitives._Primitive = _Primitive;
            var Ribbon = /** @class */ (function (_super) {
                __extends(Ribbon, _super);
                // Members
                function Ribbon(id, scene, pathArray, closeArray, closePath, offset, canBeRegenerated, mesh, side) {
                    if (side === void 0) { side = BABYLON.Mesh.DEFAULTSIDE; }
                    var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
                    _this.pathArray = pathArray;
                    _this.closeArray = closeArray;
                    _this.closePath = closePath;
                    _this.offset = offset;
                    _this.side = side;
                    return _this;
                }
                Ribbon.prototype._regenerateVertexData = function () {
                    return BABYLON.VertexData.CreateRibbon({ pathArray: this.pathArray, closeArray: this.closeArray, closePath: this.closePath, offset: this.offset, sideOrientation: this.side });
                };
                Ribbon.prototype.copy = function (id) {
                    return new Ribbon(id, this.getScene(), this.pathArray, this.closeArray, this.closePath, this.offset, this.canBeRegenerated(), undefined, this.side);
                };
                return Ribbon;
            }(_Primitive));
            Primitives.Ribbon = Ribbon;
            var Box = /** @class */ (function (_super) {
                __extends(Box, _super);
                // Members
                function Box(id, scene, size, canBeRegenerated, mesh, side) {
                    if (mesh === void 0) { mesh = null; }
                    if (side === void 0) { side = BABYLON.Mesh.DEFAULTSIDE; }
                    var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
                    _this.size = size;
                    _this.side = side;
                    return _this;
                }
                Box.prototype._regenerateVertexData = function () {
                    return BABYLON.VertexData.CreateCube({ size: this.size, sideOrientation: this.side });
                };
                Box.prototype.copy = function (id) {
                    return new Box(id, this.getScene(), this.size, this.canBeRegenerated(), undefined, this.side);
                };
                Box.prototype.serialize = function () {
                    var serializationObject = _super.prototype.serialize.call(this);
                    serializationObject.size = this.size;
                    return serializationObject;
                };
                Box.Parse = function (parsedBox, scene) {
                    if (scene.getGeometryByID(parsedBox.id)) {
                        return null; // null since geometry could be something else than a box...
                    }
                    var box = new Geometry.Primitives.Box(parsedBox.id, scene, parsedBox.size, parsedBox.canBeRegenerated, null);
                    if (BABYLON.Tags) {
                        BABYLON.Tags.AddTagsTo(box, parsedBox.tags);
                    }
                    scene.pushGeometry(box, true);
                    return box;
                };
                return Box;
            }(_Primitive));
            Primitives.Box = Box;
            var Sphere = /** @class */ (function (_super) {
                __extends(Sphere, _super);
                function Sphere(id, scene, segments, diameter, canBeRegenerated, mesh, side) {
                    if (mesh === void 0) { mesh = null; }
                    if (side === void 0) { side = BABYLON.Mesh.DEFAULTSIDE; }
                    var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
                    _this.segments = segments;
                    _this.diameter = diameter;
                    _this.side = side;
                    return _this;
                }
                Sphere.prototype._regenerateVertexData = function () {
                    return BABYLON.VertexData.CreateSphere({ segments: this.segments, diameter: this.diameter, sideOrientation: this.side });
                };
                Sphere.prototype.copy = function (id) {
                    return new Sphere(id, this.getScene(), this.segments, this.diameter, this.canBeRegenerated(), null, this.side);
                };
                Sphere.prototype.serialize = function () {
                    var serializationObject = _super.prototype.serialize.call(this);
                    serializationObject.segments = this.segments;
                    serializationObject.diameter = this.diameter;
                    return serializationObject;
                };
                Sphere.Parse = function (parsedSphere, scene) {
                    if (scene.getGeometryByID(parsedSphere.id)) {
                        return null; // null since geometry could be something else than a sphere...
                    }
                    var sphere = new Geometry.Primitives.Sphere(parsedSphere.id, scene, parsedSphere.segments, parsedSphere.diameter, parsedSphere.canBeRegenerated, null);
                    if (BABYLON.Tags) {
                        BABYLON.Tags.AddTagsTo(sphere, parsedSphere.tags);
                    }
                    scene.pushGeometry(sphere, true);
                    return sphere;
                };
                return Sphere;
            }(_Primitive));
            Primitives.Sphere = Sphere;
            var Disc = /** @class */ (function (_super) {
                __extends(Disc, _super);
                // Members
                function Disc(id, scene, radius, tessellation, canBeRegenerated, mesh, side) {
                    if (mesh === void 0) { mesh = null; }
                    if (side === void 0) { side = BABYLON.Mesh.DEFAULTSIDE; }
                    var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
                    _this.radius = radius;
                    _this.tessellation = tessellation;
                    _this.side = side;
                    return _this;
                }
                Disc.prototype._regenerateVertexData = function () {
                    return BABYLON.VertexData.CreateDisc({ radius: this.radius, tessellation: this.tessellation, sideOrientation: this.side });
                };
                Disc.prototype.copy = function (id) {
                    return new Disc(id, this.getScene(), this.radius, this.tessellation, this.canBeRegenerated(), null, this.side);
                };
                return Disc;
            }(_Primitive));
            Primitives.Disc = Disc;
            var Cylinder = /** @class */ (function (_super) {
                __extends(Cylinder, _super);
                function Cylinder(id, scene, height, diameterTop, diameterBottom, tessellation, subdivisions, canBeRegenerated, mesh, side) {
                    if (subdivisions === void 0) { subdivisions = 1; }
                    if (mesh === void 0) { mesh = null; }
                    if (side === void 0) { side = BABYLON.Mesh.DEFAULTSIDE; }
                    var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
                    _this.height = height;
                    _this.diameterTop = diameterTop;
                    _this.diameterBottom = diameterBottom;
                    _this.tessellation = tessellation;
                    _this.subdivisions = subdivisions;
                    _this.side = side;
                    return _this;
                }
                Cylinder.prototype._regenerateVertexData = function () {
                    return BABYLON.VertexData.CreateCylinder({ height: this.height, diameterTop: this.diameterTop, diameterBottom: this.diameterBottom, tessellation: this.tessellation, subdivisions: this.subdivisions, sideOrientation: this.side });
                };
                Cylinder.prototype.copy = function (id) {
                    return new Cylinder(id, this.getScene(), this.height, this.diameterTop, this.diameterBottom, this.tessellation, this.subdivisions, this.canBeRegenerated(), null, this.side);
                };
                Cylinder.prototype.serialize = function () {
                    var serializationObject = _super.prototype.serialize.call(this);
                    serializationObject.height = this.height;
                    serializationObject.diameterTop = this.diameterTop;
                    serializationObject.diameterBottom = this.diameterBottom;
                    serializationObject.tessellation = this.tessellation;
                    return serializationObject;
                };
                Cylinder.Parse = function (parsedCylinder, scene) {
                    if (scene.getGeometryByID(parsedCylinder.id)) {
                        return null; // null since geometry could be something else than a cylinder...
                    }
                    var cylinder = new Geometry.Primitives.Cylinder(parsedCylinder.id, scene, parsedCylinder.height, parsedCylinder.diameterTop, parsedCylinder.diameterBottom, parsedCylinder.tessellation, parsedCylinder.subdivisions, parsedCylinder.canBeRegenerated, null);
                    if (BABYLON.Tags) {
                        BABYLON.Tags.AddTagsTo(cylinder, parsedCylinder.tags);
                    }
                    scene.pushGeometry(cylinder, true);
                    return cylinder;
                };
                return Cylinder;
            }(_Primitive));
            Primitives.Cylinder = Cylinder;
            var Torus = /** @class */ (function (_super) {
                __extends(Torus, _super);
                function Torus(id, scene, diameter, thickness, tessellation, canBeRegenerated, mesh, side) {
                    if (mesh === void 0) { mesh = null; }
                    if (side === void 0) { side = BABYLON.Mesh.DEFAULTSIDE; }
                    var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
                    _this.diameter = diameter;
                    _this.thickness = thickness;
                    _this.tessellation = tessellation;
                    _this.side = side;
                    return _this;
                }
                Torus.prototype._regenerateVertexData = function () {
                    return BABYLON.VertexData.CreateTorus({ diameter: this.diameter, thickness: this.thickness, tessellation: this.tessellation, sideOrientation: this.side });
                };
                Torus.prototype.copy = function (id) {
                    return new Torus(id, this.getScene(), this.diameter, this.thickness, this.tessellation, this.canBeRegenerated(), null, this.side);
                };
                Torus.prototype.serialize = function () {
                    var serializationObject = _super.prototype.serialize.call(this);
                    serializationObject.diameter = this.diameter;
                    serializationObject.thickness = this.thickness;
                    serializationObject.tessellation = this.tessellation;
                    return serializationObject;
                };
                Torus.Parse = function (parsedTorus, scene) {
                    if (scene.getGeometryByID(parsedTorus.id)) {
                        return null; // null since geometry could be something else than a torus...
                    }
                    var torus = new Geometry.Primitives.Torus(parsedTorus.id, scene, parsedTorus.diameter, parsedTorus.thickness, parsedTorus.tessellation, parsedTorus.canBeRegenerated, null);
                    if (BABYLON.Tags) {
                        BABYLON.Tags.AddTagsTo(torus, parsedTorus.tags);
                    }
                    scene.pushGeometry(torus, true);
                    return torus;
                };
                return Torus;
            }(_Primitive));
            Primitives.Torus = Torus;
            var Ground = /** @class */ (function (_super) {
                __extends(Ground, _super);
                function Ground(id, scene, width, height, subdivisions, canBeRegenerated, mesh) {
                    if (mesh === void 0) { mesh = null; }
                    var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
                    _this.width = width;
                    _this.height = height;
                    _this.subdivisions = subdivisions;
                    return _this;
                }
                Ground.prototype._regenerateVertexData = function () {
                    return BABYLON.VertexData.CreateGround({ width: this.width, height: this.height, subdivisions: this.subdivisions });
                };
                Ground.prototype.copy = function (id) {
                    return new Ground(id, this.getScene(), this.width, this.height, this.subdivisions, this.canBeRegenerated(), null);
                };
                Ground.prototype.serialize = function () {
                    var serializationObject = _super.prototype.serialize.call(this);
                    serializationObject.width = this.width;
                    serializationObject.height = this.height;
                    serializationObject.subdivisions = this.subdivisions;
                    return serializationObject;
                };
                Ground.Parse = function (parsedGround, scene) {
                    if (scene.getGeometryByID(parsedGround.id)) {
                        return null; // null since geometry could be something else than a ground...
                    }
                    var ground = new Geometry.Primitives.Ground(parsedGround.id, scene, parsedGround.width, parsedGround.height, parsedGround.subdivisions, parsedGround.canBeRegenerated, null);
                    if (BABYLON.Tags) {
                        BABYLON.Tags.AddTagsTo(ground, parsedGround.tags);
                    }
                    scene.pushGeometry(ground, true);
                    return ground;
                };
                return Ground;
            }(_Primitive));
            Primitives.Ground = Ground;
            var TiledGround = /** @class */ (function (_super) {
                __extends(TiledGround, _super);
                function TiledGround(id, scene, xmin, zmin, xmax, zmax, subdivisions, precision, canBeRegenerated, mesh) {
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
                TiledGround.prototype._regenerateVertexData = function () {
                    return BABYLON.VertexData.CreateTiledGround({ xmin: this.xmin, zmin: this.zmin, xmax: this.xmax, zmax: this.zmax, subdivisions: this.subdivisions, precision: this.precision });
                };
                TiledGround.prototype.copy = function (id) {
                    return new TiledGround(id, this.getScene(), this.xmin, this.zmin, this.xmax, this.zmax, this.subdivisions, this.precision, this.canBeRegenerated(), null);
                };
                return TiledGround;
            }(_Primitive));
            Primitives.TiledGround = TiledGround;
            var Plane = /** @class */ (function (_super) {
                __extends(Plane, _super);
                function Plane(id, scene, size, canBeRegenerated, mesh, side) {
                    if (mesh === void 0) { mesh = null; }
                    if (side === void 0) { side = BABYLON.Mesh.DEFAULTSIDE; }
                    var _this = _super.call(this, id, scene, canBeRegenerated, mesh) || this;
                    _this.size = size;
                    _this.side = side;
                    return _this;
                }
                Plane.prototype._regenerateVertexData = function () {
                    return BABYLON.VertexData.CreatePlane({ size: this.size, sideOrientation: this.side });
                };
                Plane.prototype.copy = function (id) {
                    return new Plane(id, this.getScene(), this.size, this.canBeRegenerated(), null, this.side);
                };
                Plane.prototype.serialize = function () {
                    var serializationObject = _super.prototype.serialize.call(this);
                    serializationObject.size = this.size;
                    return serializationObject;
                };
                Plane.Parse = function (parsedPlane, scene) {
                    if (scene.getGeometryByID(parsedPlane.id)) {
                        return null; // null since geometry could be something else than a ground...
                    }
                    var plane = new Geometry.Primitives.Plane(parsedPlane.id, scene, parsedPlane.size, parsedPlane.canBeRegenerated, null);
                    if (BABYLON.Tags) {
                        BABYLON.Tags.AddTagsTo(plane, parsedPlane.tags);
                    }
                    scene.pushGeometry(plane, true);
                    return plane;
                };
                return Plane;
            }(_Primitive));
            Primitives.Plane = Plane;
            var TorusKnot = /** @class */ (function (_super) {
                __extends(TorusKnot, _super);
                function TorusKnot(id, scene, radius, tube, radialSegments, tubularSegments, p, q, canBeRegenerated, mesh, side) {
                    if (mesh === void 0) { mesh = null; }
                    if (side === void 0) { side = BABYLON.Mesh.DEFAULTSIDE; }
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
                TorusKnot.prototype._regenerateVertexData = function () {
                    return BABYLON.VertexData.CreateTorusKnot({ radius: this.radius, tube: this.tube, radialSegments: this.radialSegments, tubularSegments: this.tubularSegments, p: this.p, q: this.q, sideOrientation: this.side });
                };
                TorusKnot.prototype.copy = function (id) {
                    return new TorusKnot(id, this.getScene(), this.radius, this.tube, this.radialSegments, this.tubularSegments, this.p, this.q, this.canBeRegenerated(), null, this.side);
                };
                TorusKnot.prototype.serialize = function () {
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
                TorusKnot.Parse = function (parsedTorusKnot, scene) {
                    if (scene.getGeometryByID(parsedTorusKnot.id)) {
                        return null; // null since geometry could be something else than a ground...
                    }
                    var torusKnot = new Geometry.Primitives.TorusKnot(parsedTorusKnot.id, scene, parsedTorusKnot.radius, parsedTorusKnot.tube, parsedTorusKnot.radialSegments, parsedTorusKnot.tubularSegments, parsedTorusKnot.p, parsedTorusKnot.q, parsedTorusKnot.canBeRegenerated, null);
                    if (BABYLON.Tags) {
                        BABYLON.Tags.AddTagsTo(torusKnot, parsedTorusKnot.tags);
                    }
                    scene.pushGeometry(torusKnot, true);
                    return torusKnot;
                };
                return TorusKnot;
            }(_Primitive));
            Primitives.TorusKnot = TorusKnot;
        })(Primitives = Geometry.Primitives || (Geometry.Primitives = {}));
    })(Geometry = BABYLON.Geometry || (BABYLON.Geometry = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.geometry.js.map
