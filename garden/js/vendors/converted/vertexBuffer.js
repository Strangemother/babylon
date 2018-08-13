
var LIB;
(function (LIB) {
    var VertexBuffer = /** @class */ (function () {
        /**
         * Constructor
         * @param engine the engine
         * @param data the data to use for this vertex buffer
         * @param kind the vertex buffer kind
         * @param updatable whether the data is updatable
         * @param postponeInternalCreation whether to postpone creating the internal WebGL buffer (optional)
         * @param stride the stride (optional)
         * @param instanced whether the buffer is instanced (optional)
         * @param offset the offset of the data (optional)
         * @param size the number of components (optional)
         * @param type the type of the component (optional)
         * @param normalized whether the data contains normalized data (optional)
         * @param useBytes set to true if stride and offset are in bytes (optional)
         */
        function VertexBuffer(engine, data, kind, updatable, postponeInternalCreation, stride, instanced, offset, size, type, normalized, useBytes) {
            if (normalized === void 0) { normalized = false; }
            if (useBytes === void 0) { useBytes = false; }
            if (data instanceof LIB.Buffer) {
                this._buffer = data;
                this._ownsBuffer = false;
            }
            else {
                this._buffer = new LIB.Buffer(engine, data, updatable, stride, postponeInternalCreation, instanced, useBytes);
                this._ownsBuffer = true;
            }
            this._kind = kind;
            if (type == undefined) {
                var data_1 = this.getData();
                this.type = VertexBuffer.FLOAT;
                if (data_1 instanceof Int8Array)
                    this.type = VertexBuffer.BYTE;
                else if (data_1 instanceof Uint8Array)
                    this.type = VertexBuffer.UNSIGNED_BYTE;
                else if (data_1 instanceof Int16Array)
                    this.type = VertexBuffer.SHORT;
                else if (data_1 instanceof Uint16Array)
                    this.type = VertexBuffer.UNSIGNED_SHORT;
                else if (data_1 instanceof Int32Array)
                    this.type = VertexBuffer.INT;
                else if (data_1 instanceof Uint32Array)
                    this.type = VertexBuffer.UNSIGNED_INT;
            }
            else {
                this.type = type;
            }
            var typeByteLength = VertexBuffer.GetTypeByteLength(this.type);
            if (useBytes) {
                this._size = size || (stride ? (stride / typeByteLength) : VertexBuffer.DeduceStride(kind));
                this.byteStride = stride || this._buffer.byteStride || (this._size * typeByteLength);
                this.byteOffset = offset || 0;
            }
            else {
                this._size = size || stride || VertexBuffer.DeduceStride(kind);
                this.byteStride = stride ? (stride * typeByteLength) : (this._buffer.byteStride || (this._size * typeByteLength));
                this.byteOffset = (offset || 0) * typeByteLength;
            }
            this.normalized = normalized;
            this._instanced = instanced !== undefined ? instanced : false;
            this._instanceDivisor = instanced ? 1 : 0;
        }
        Object.defineProperty(VertexBuffer.prototype, "instanceDivisor", {
            /**
             * Gets or sets the instance divisor when in instanced mode
             */
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
        VertexBuffer.prototype._rebuild = function () {
            if (!this._buffer) {
                return;
            }
            this._buffer._rebuild();
        };
        /**
         * Returns the kind of the VertexBuffer (string).
         */
        VertexBuffer.prototype.getKind = function () {
            return this._kind;
        };
        // Properties
        /**
         * Boolean : is the VertexBuffer updatable ?
         */
        VertexBuffer.prototype.isUpdatable = function () {
            return this._buffer.isUpdatable();
        };
        /**
         * Returns an array of numbers or a typed array containing the VertexBuffer data.
         */
        VertexBuffer.prototype.getData = function () {
            return this._buffer.getData();
        };
        /**
         * Returns the WebGLBuffer associated to the VertexBuffer.
         */
        VertexBuffer.prototype.getBuffer = function () {
            return this._buffer.getBuffer();
        };
        /**
         * Returns the stride as a multiple of the type byte length.
         * DEPRECATED. Use byteStride instead.
         */
        VertexBuffer.prototype.getStrideSize = function () {
            return this.byteStride / VertexBuffer.GetTypeByteLength(this.type);
        };
        /**
         * Returns the offset as a multiple of the type byte length.
         * DEPRECATED. Use byteOffset instead.
         */
        VertexBuffer.prototype.getOffset = function () {
            return this.byteOffset / VertexBuffer.GetTypeByteLength(this.type);
        };
        /**
         * Returns the number of components per vertex attribute (integer).
         */
        VertexBuffer.prototype.getSize = function () {
            return this._size;
        };
        /**
         * Boolean : is the WebGLBuffer of the VertexBuffer instanced now ?
         */
        VertexBuffer.prototype.getIsInstanced = function () {
            return this._instanced;
        };
        /**
         * Returns the instancing divisor, zero for non-instanced (integer).
         */
        VertexBuffer.prototype.getInstanceDivisor = function () {
            return this._instanceDivisor;
        };
        // Methods
        /**
         * Creates the underlying WebGLBuffer from the passed numeric array or Float32Array.
         * Returns the created WebGLBuffer.
         */
        VertexBuffer.prototype.create = function (data) {
            return this._buffer.create(data);
        };
        /**
         * Updates the underlying WebGLBuffer according to the passed numeric array or Float32Array.
         * This function will create a new buffer if the current one is not updatable
         * Returns the updated WebGLBuffer.
         */
        VertexBuffer.prototype.update = function (data) {
            return this._buffer.update(data);
        };
        /**
         * Updates directly the underlying WebGLBuffer according to the passed numeric array or Float32Array.
         * Returns the directly updated WebGLBuffer.
         * @param data the new data
         * @param offset the new offset
         * @param useBytes set to true if the offset is in bytes
         */
        VertexBuffer.prototype.updateDirectly = function (data, offset, useBytes) {
            if (useBytes === void 0) { useBytes = false; }
            this._buffer.updateDirectly(data, offset, undefined, useBytes);
        };
        /**
         * Disposes the VertexBuffer and the underlying WebGLBuffer.
         */
        VertexBuffer.prototype.dispose = function () {
            if (this._ownsBuffer) {
                this._buffer.dispose();
            }
        };
        /**
         * Enumerates each value of this vertex buffer as numbers.
         * @param count the number of values to enumerate
         * @param callback the callback function called for each value
         */
        VertexBuffer.prototype.forEach = function (count, callback) {
            VertexBuffer.ForEach(this._buffer.getData(), this.byteOffset, this.byteStride, this._size, this.type, count, this.normalized, callback);
        };
        Object.defineProperty(VertexBuffer, "PositionKind", {
            get: function () {
                return VertexBuffer._PositionKind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "NormalKind", {
            get: function () {
                return VertexBuffer._NormalKind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "TangentKind", {
            get: function () {
                return VertexBuffer._TangentKind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "UVKind", {
            get: function () {
                return VertexBuffer._UVKind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "UV2Kind", {
            get: function () {
                return VertexBuffer._UV2Kind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "UV3Kind", {
            get: function () {
                return VertexBuffer._UV3Kind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "UV4Kind", {
            get: function () {
                return VertexBuffer._UV4Kind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "UV5Kind", {
            get: function () {
                return VertexBuffer._UV5Kind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "UV6Kind", {
            get: function () {
                return VertexBuffer._UV6Kind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "ColorKind", {
            get: function () {
                return VertexBuffer._ColorKind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "MatricesIndicesKind", {
            get: function () {
                return VertexBuffer._MatricesIndicesKind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "MatricesWeightsKind", {
            get: function () {
                return VertexBuffer._MatricesWeightsKind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "MatricesIndicesExtraKind", {
            get: function () {
                return VertexBuffer._MatricesIndicesExtraKind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer, "MatricesWeightsExtraKind", {
            get: function () {
                return VertexBuffer._MatricesWeightsExtraKind;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Deduces the stride given a kind.
         * @param kind The kind string to deduce
         * @returns The deduced stride
         */
        VertexBuffer.DeduceStride = function (kind) {
            switch (kind) {
                case VertexBuffer.UVKind:
                case VertexBuffer.UV2Kind:
                case VertexBuffer.UV3Kind:
                case VertexBuffer.UV4Kind:
                case VertexBuffer.UV5Kind:
                case VertexBuffer.UV6Kind:
                    return 2;
                case VertexBuffer.NormalKind:
                case VertexBuffer.PositionKind:
                    return 3;
                case VertexBuffer.ColorKind:
                case VertexBuffer.MatricesIndicesKind:
                case VertexBuffer.MatricesIndicesExtraKind:
                case VertexBuffer.MatricesWeightsKind:
                case VertexBuffer.MatricesWeightsExtraKind:
                case VertexBuffer.TangentKind:
                    return 4;
                default:
                    throw new Error("Invalid kind '" + kind + "'");
            }
        };
        /**
         * Gets the byte length of the given type.
         * @param type the type
         * @returns the number of bytes
         */
        VertexBuffer.GetTypeByteLength = function (type) {
            switch (type) {
                case VertexBuffer.BYTE:
                case VertexBuffer.UNSIGNED_BYTE:
                    return 1;
                case VertexBuffer.SHORT:
                case VertexBuffer.UNSIGNED_SHORT:
                    return 2;
                case VertexBuffer.INT:
                case VertexBuffer.FLOAT:
                    return 4;
                default:
                    throw new Error("Invalid type '" + type + "'");
            }
        };
        /**
         * Enumerates each value of the given parameters as numbers.
         * @param data the data to enumerate
         * @param byteOffset the byte offset of the data
         * @param byteStride the byte stride of the data
         * @param componentCount the number of components per element
         * @param componentType the type of the component
         * @param count the total number of components
         * @param normalized whether the data is normalized
         * @param callback the callback function called for each value
         */
        VertexBuffer.ForEach = function (data, byteOffset, byteStride, componentCount, componentType, count, normalized, callback) {
            if (data instanceof Array) {
                var offset = byteOffset / 4;
                var stride = byteStride / 4;
                for (var index = 0; index < count; index += componentCount) {
                    for (var componentIndex = 0; componentIndex < componentCount; componentIndex++) {
                        callback(data[offset + componentIndex], index + componentIndex);
                    }
                    offset += stride;
                }
            }
            else {
                var dataView = data instanceof ArrayBuffer ? new DataView(data) : new DataView(data.buffer, data.byteOffset, data.byteLength);
                var componentByteLength = VertexBuffer.GetTypeByteLength(componentType);
                for (var index = 0; index < count; index += componentCount) {
                    var componentByteOffset = byteOffset;
                    for (var componentIndex = 0; componentIndex < componentCount; componentIndex++) {
                        var value = VertexBuffer._GetFloatValue(dataView, componentType, componentByteOffset, normalized);
                        callback(value, index + componentIndex);
                        componentByteOffset += componentByteLength;
                    }
                    byteOffset += byteStride;
                }
            }
        };
        VertexBuffer._GetFloatValue = function (dataView, type, byteOffset, normalized) {
            switch (type) {
                case VertexBuffer.BYTE: {
                    var value = dataView.getInt8(byteOffset);
                    if (normalized) {
                        value = Math.max(value / 127, -1);
                    }
                    return value;
                }
                case VertexBuffer.UNSIGNED_BYTE: {
                    var value = dataView.getUint8(byteOffset);
                    if (normalized) {
                        value = value / 255;
                    }
                    return value;
                }
                case VertexBuffer.SHORT: {
                    var value = dataView.getInt16(byteOffset, true);
                    if (normalized) {
                        value = Math.max(value / 16383, -1);
                    }
                    return value;
                }
                case VertexBuffer.UNSIGNED_SHORT: {
                    var value = dataView.getUint16(byteOffset, true);
                    if (normalized) {
                        value = value / 65535;
                    }
                    return value;
                }
                case VertexBuffer.FLOAT: {
                    return dataView.getFloat32(byteOffset, true);
                }
                default: {
                    throw new Error("Invalid component type " + type);
                }
            }
        };
        /**
         * The byte type.
         */
        VertexBuffer.BYTE = 5120;
        /**
         * The unsigned byte type.
         */
        VertexBuffer.UNSIGNED_BYTE = 5121;
        /**
         * The short type.
         */
        VertexBuffer.SHORT = 5122;
        /**
         * The unsigned short type.
         */
        VertexBuffer.UNSIGNED_SHORT = 5123;
        /**
         * The integer type.
         */
        VertexBuffer.INT = 5124;
        /**
         * The unsigned integer type.
         */
        VertexBuffer.UNSIGNED_INT = 5125;
        /**
         * The float type.
         */
        VertexBuffer.FLOAT = 5126;
        // Enums
        VertexBuffer._PositionKind = "position";
        VertexBuffer._NormalKind = "normal";
        VertexBuffer._TangentKind = "tangent";
        VertexBuffer._UVKind = "uv";
        VertexBuffer._UV2Kind = "uv2";
        VertexBuffer._UV3Kind = "uv3";
        VertexBuffer._UV4Kind = "uv4";
        VertexBuffer._UV5Kind = "uv5";
        VertexBuffer._UV6Kind = "uv6";
        VertexBuffer._ColorKind = "color";
        VertexBuffer._MatricesIndicesKind = "matricesIndices";
        VertexBuffer._MatricesWeightsKind = "matricesWeights";
        VertexBuffer._MatricesIndicesExtraKind = "matricesIndicesExtra";
        VertexBuffer._MatricesWeightsExtraKind = "matricesWeightsExtra";
        return VertexBuffer;
    }());
    LIB.VertexBuffer = VertexBuffer;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.vertexBuffer.js.map
//# sourceMappingURL=LIB.vertexBuffer.js.map
