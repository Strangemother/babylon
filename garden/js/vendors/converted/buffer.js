
var LIB;
(function (LIB) {
    var Buffer = /** @class */ (function () {
        /**
         * Constructor
         * @param engine the engine
         * @param data the data to use for this buffer
         * @param updatable whether the data is updatable
         * @param stride the stride (optional)
         * @param postponeInternalCreation whether to postpone creating the internal WebGL buffer (optional)
         * @param instanced whether the buffer is instanced (optional)
         * @param useBytes set to true if the stride in in bytes (optional)
         */
        function Buffer(engine, data, updatable, stride, postponeInternalCreation, instanced, useBytes) {
            if (stride === void 0) { stride = 0; }
            if (postponeInternalCreation === void 0) { postponeInternalCreation = false; }
            if (instanced === void 0) { instanced = false; }
            if (useBytes === void 0) { useBytes = false; }
            if (engine instanceof LIB.Mesh) { // old versions of LIB.VertexBuffer accepted 'mesh' instead of 'engine'
                this._engine = engine.getScene().getEngine();
            }
            else {
                this._engine = engine;
            }
            this._updatable = updatable;
            this._instanced = instanced;
            this._data = data;
            this.byteStride = useBytes ? stride : stride * Float32Array.BYTES_PER_ELEMENT;
            if (!postponeInternalCreation) { // by default
                this.create();
            }
        }
        /**
         * Create a new {LIB.VertexBuffer} based on the current buffer
         * @param kind defines the vertex buffer kind (position, normal, etc.)
         * @param offset defines offset in the buffer (0 by default)
         * @param size defines the size in floats of attributes (position is 3 for instance)
         * @param stride defines the stride size in floats in the buffer (the offset to apply to reach next value when data is interleaved)
         * @param instanced defines if the vertex buffer contains indexed data
         * @param useBytes defines if the offset and stride are in bytes
         * @returns the new vertex buffer
         */
        Buffer.prototype.createVertexBuffer = function (kind, offset, size, stride, instanced, useBytes) {
            if (useBytes === void 0) { useBytes = false; }
            var byteOffset = useBytes ? offset : offset * Float32Array.BYTES_PER_ELEMENT;
            var byteStride = stride ? (useBytes ? stride : stride * Float32Array.BYTES_PER_ELEMENT) : this.byteStride;
            // a lot of these parameters are ignored as they are overriden by the buffer
            return new LIB.VertexBuffer(this._engine, this, kind, this._updatable, true, byteStride, instanced === undefined ? this._instanced : instanced, byteOffset, size, undefined, undefined, true);
        };
        // Properties
        Buffer.prototype.isUpdatable = function () {
            return this._updatable;
        };
        Buffer.prototype.getData = function () {
            return this._data;
        };
        Buffer.prototype.getBuffer = function () {
            return this._buffer;
        };
        /**
         * Gets the stride in float32 units (i.e. byte stride / 4).
         * May not be an integer if the byte stride is not divisible by 4.
         * DEPRECATED. Use byteStride instead.
         * @returns the stride in float32 units
         */
        Buffer.prototype.getStrideSize = function () {
            return this.byteStride / Float32Array.BYTES_PER_ELEMENT;
        };
        // Methods
        Buffer.prototype.create = function (data) {
            if (data === void 0) { data = null; }
            if (!data && this._buffer) {
                return; // nothing to do
            }
            data = data || this._data;
            if (!data) {
                return;
            }
            if (!this._buffer) { // create buffer
                if (this._updatable) {
                    this._buffer = this._engine.createDynamicVertexBuffer(data);
                    this._data = data;
                }
                else {
                    this._buffer = this._engine.createVertexBuffer(data);
                }
            }
            else if (this._updatable) { // update buffer
                this._engine.updateDynamicVertexBuffer(this._buffer, data);
                this._data = data;
            }
        };
        Buffer.prototype._rebuild = function () {
            this._buffer = null;
            this.create(this._data);
        };
        Buffer.prototype.update = function (data) {
            this.create(data);
        };
        /**
         * Updates the data directly.
         * @param data the new data
         * @param offset the new offset
         * @param vertexCount the vertex count (optional)
         * @param useBytes set to true if the offset is in bytes
         */
        Buffer.prototype.updateDirectly = function (data, offset, vertexCount, useBytes) {
            if (useBytes === void 0) { useBytes = false; }
            if (!this._buffer) {
                return;
            }
            if (this._updatable) { // update buffer
                this._engine.updateDynamicVertexBuffer(this._buffer, data, useBytes ? offset : offset * Float32Array.BYTES_PER_ELEMENT, (vertexCount ? vertexCount * this.byteStride : undefined));
                this._data = null;
            }
        };
        Buffer.prototype.dispose = function () {
            if (!this._buffer) {
                return;
            }
            if (this._engine._releaseBuffer(this._buffer)) {
                this._buffer = null;
            }
        };
        return Buffer;
    }());
    LIB.Buffer = Buffer;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.buffer.js.map
//# sourceMappingURL=LIB.buffer.js.map
