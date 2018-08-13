
var LIB;
(function (LIB) {
    /**
     * Draco compression (https://google.github.io/draco/)
     */
    var DracoCompression = /** @class */ (function () {
        /**
         * Constructor
         */
        function DracoCompression() {
        }
        Object.defineProperty(DracoCompression, "DecoderAvailable", {
            /**
             * Returns true if the decoder is available.
             */
            get: function () {
                if (typeof DracoDecoderModule !== "undefined") {
                    return true;
                }
                var decoder = DracoCompression.Configuration.decoder;
                if (decoder) {
                    if (decoder.wasmUrl && decoder.wasmBinaryUrl && typeof WebAssembly === "object") {
                        return true;
                    }
                    if (decoder.fallbackUrl) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Stop all async operations and release resources.
         */
        DracoCompression.prototype.dispose = function () {
        };
        /**
         * Decode Draco compressed mesh data to vertex data.
         * @param data The array buffer view for the Draco compression data
         * @param attributes A map of attributes from vertex buffer kinds to Draco unique ids
         * @returns A promise that resolves with the decoded vertex data
         */
        DracoCompression.prototype.decodeMeshAsync = function (data, attributes) {
            return DracoCompression._GetDecoderModule().then(function (wrappedModule) {
                var module = wrappedModule.module;
                var vertexData = new LIB.VertexData();
                var buffer = new module.DecoderBuffer();
                buffer.Init(data, data.byteLength);
                var decoder = new module.Decoder();
                var geometry;
                var status;
                try {
                    var type = decoder.GetEncodedGeometryType(buffer);
                    switch (type) {
                        case module.TRIANGULAR_MESH:
                            geometry = new module.Mesh();
                            status = decoder.DecodeBufferToMesh(buffer, geometry);
                            break;
                        case module.POINT_CLOUD:
                            geometry = new module.PointCloud();
                            status = decoder.DecodeBufferToPointCloud(buffer, geometry);
                            break;
                        default:
                            throw new Error("Invalid geometry type " + type);
                    }
                    if (!status.ok() || !geometry.ptr) {
                        throw new Error(status.error_msg());
                    }
                    var numPoints = geometry.num_points();
                    if (type === module.TRIANGULAR_MESH) {
                        var numFaces = geometry.num_faces();
                        var faceIndices = new module.DracoInt32Array();
                        try {
                            var indices = new Uint32Array(numFaces * 3);
                            for (var i = 0; i < numFaces; i++) {
                                decoder.GetFaceFromMesh(geometry, i, faceIndices);
                                var offset = i * 3;
                                indices[offset + 0] = faceIndices.GetValue(0);
                                indices[offset + 1] = faceIndices.GetValue(1);
                                indices[offset + 2] = faceIndices.GetValue(2);
                            }
                            vertexData.indices = indices;
                        }
                        finally {
                            module.destroy(faceIndices);
                        }
                    }
                    for (var kind in attributes) {
                        var uniqueId = attributes[kind];
                        var attribute = decoder.GetAttributeByUniqueId(geometry, uniqueId);
                        var dracoData = new module.DracoFloat32Array();
                        try {
                            decoder.GetAttributeFloatForAllPoints(geometry, attribute, dracoData);
                            var LIBData = new Float32Array(numPoints * attribute.num_components());
                            for (var i = 0; i < LIBData.length; i++) {
                                LIBData[i] = dracoData.GetValue(i);
                            }
                            vertexData.set(LIBData, kind);
                        }
                        finally {
                            module.destroy(dracoData);
                        }
                    }
                }
                finally {
                    if (geometry) {
                        module.destroy(geometry);
                    }
                    module.destroy(decoder);
                    module.destroy(buffer);
                }
                return vertexData;
            });
        };
        DracoCompression._GetDecoderModule = function () {
            if (!DracoCompression._DecoderModulePromise) {
                var promise = null;
                var config_1 = {};
                if (typeof DracoDecoderModule !== "undefined") {
                    promise = Promise.resolve();
                }
                else {
                    var decoder = DracoCompression.Configuration.decoder;
                    if (decoder) {
                        if (decoder.wasmUrl && decoder.wasmBinaryUrl && typeof WebAssembly === "object") {
                            promise = Promise.all([
                                DracoCompression._LoadScriptAsync(decoder.wasmUrl),
                                DracoCompression._LoadFileAsync(decoder.wasmBinaryUrl).then(function (data) {
                                    config_1.wasmBinary = data;
                                })
                            ]);
                        }
                        else if (decoder.fallbackUrl) {
                            promise = DracoCompression._LoadScriptAsync(decoder.fallbackUrl);
                        }
                    }
                }
                if (!promise) {
                    throw new Error("Draco decoder module is not available");
                }
                DracoCompression._DecoderModulePromise = promise.then(function () {
                    return new Promise(function (resolve) {
                        config_1.onModuleLoaded = function (decoderModule) {
                            // decoderModule is Promise-like. Wrap before resolving to avoid loop.
                            resolve({ module: decoderModule });
                        };
                        DracoDecoderModule(config_1);
                    });
                });
            }
            return DracoCompression._DecoderModulePromise;
        };
        DracoCompression._LoadScriptAsync = function (url) {
            return new Promise(function (resolve, reject) {
                LIB.Tools.LoadScript(url, function () {
                    resolve();
                }, function (message) {
                    reject(new Error(message));
                });
            });
        };
        DracoCompression._LoadFileAsync = function (url) {
            return new Promise(function (resolve, reject) {
                LIB.Tools.LoadFile(url, function (data) {
                    resolve(data);
                }, undefined, undefined, true, function (request, exception) {
                    reject(exception);
                });
            });
        };
        /**
         * The configuration.
         */
        DracoCompression.Configuration = {
            decoder: {
                wasmUrl: "https://preview.LIBjs.com/draco_wasm_wrapper_gltf.js",
                wasmBinaryUrl: "https://preview.LIBjs.com/draco_decoder_gltf.wasm",
                fallbackUrl: "https://preview.LIBjs.com/draco_decoder_gltf.js"
            }
        };
        return DracoCompression;
    }());
    LIB.DracoCompression = DracoCompression;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.dracoCompression.js.map
//# sourceMappingURL=LIB.dracoCompression.js.map
