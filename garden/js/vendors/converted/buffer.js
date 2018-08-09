(function (LIB) {
    var Buffer = /** @class */ (function () {
        function Buffer(engine, data, updatable, stride, postponeInternalCreation, instanced) {
            if (instanced === void 0) { instanced = false; }
            if (engine instanceof LIB.Mesh) {
                this._engine = engine.getScene().getEngine();
            }
            else {
                this._engine = engine;
            }
            this._updatable = updatable;
            this._data = data;
            this._strideSize = stride;
            if (!postponeInternalCreation) {
                this.create();
            }
            this._instanced = instanced;
            this._instanceDivisor = instanced ? 1 : 0;
        }
        Buffer.prototype.createVertexBuffer = function (kind, offset, size, stride) {
            // a lot of these parameters are ignored as they are overriden by the buffer
            return new LIB.VertexBuffer(this._engine, this, kind, this._updatable, true, stride ? stride : this._strideSize, this._instanced, offset, size);
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
        Buffer.prototype.getStrideSize = function () {
            return this._strideSize;
        };
        Buffer.prototype.getIsInstanced = function () {
            return this._instanced;
        };
        Object.defineProperty(Buffer.prototype, "instanceDivisor", {
            get: function () {
                return this._instanceDivisor;
            },
            set: function (value) {
                this._instanceDivisor = value;
                if (value == 0) {
                    this._instanced = false;
                }
                else {
                    this._instanced = true;
                }
            },
            enumerable: true,
            configurable: true
        });
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
            if (!this._buffer) {
                if (this._updatable) {
                    this._buffer = this._engine.createDynamicVertexBuffer(data);
                    this._data = data;
                }
                else {
                    this._buffer = this._engine.createVertexBuffer(data);
                }
            }
            else if (this._updatable) {
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
        Buffer.prototype.updateDirectly = function (data, offset, vertexCount) {
            if (!this._buffer) {
                return;
            }
            if (this._updatable) {
                this._engine.updateDynamicVertexBuffer(this._buffer, data, offset, (vertexCount ? vertexCount * this.getStrideSize() : undefined));
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
