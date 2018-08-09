var BABYLON;
(function (BABYLON) {
    /**
     * This represents a texture coming from an HDR input.
     *
     * The only supported format is currently panorama picture stored in RGBE format.
     * Example of such files can be found on HDRLib: http://hdrlib.com/
     */
    var HDRCubeTexture = /** @class */ (function (_super) {
        __extends(HDRCubeTexture, _super);
        /**
         * Instantiates an HDRTexture from the following parameters.
         *
         * @param url The location of the HDR raw data (Panorama stored in RGBE format)
         * @param scene The scene the texture will be used in
         * @param size The cubemap desired size (the more it increases the longer the generation will be) If the size is omitted this implies you are using a preprocessed cubemap.
         * @param noMipmap Forces to not generate the mipmap if true
         * @param generateHarmonics Specifies wether you want to extract the polynomial harmonics during the generation process
         * @param useInGammaSpace Specifies if the texture will be use in gamma or linear space (the PBR material requires those texture in linear space, but the standard material would require them in Gamma space)
         * @param usePMREMGenerator Specifies wether or not to generate the CubeMap through CubeMapGen to avoid seams issue at run time.
         */
        function HDRCubeTexture(url, scene, size, noMipmap, generateHarmonics, useInGammaSpace, usePMREMGenerator, onLoad, onError) {
            if (noMipmap === void 0) { noMipmap = false; }
            if (generateHarmonics === void 0) { generateHarmonics = true; }
            if (useInGammaSpace === void 0) { useInGammaSpace = false; }
            if (usePMREMGenerator === void 0) { usePMREMGenerator = false; }
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            var _this = _super.call(this, scene) || this;
            _this._useInGammaSpace = false;
            _this._generateHarmonics = true;
            _this._isBABYLONPreprocessed = false;
            _this._onLoad = null;
            _this._onError = null;
            /**
             * The texture coordinates mode. As this texture is stored in a cube format, please modify carefully.
             */
            _this.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
            /**
             * Specifies wether the texture has been generated through the PMREMGenerator tool.
             * This is usefull at run time to apply the good shader.
             */
            _this.isPMREM = false;
            _this._isBlocking = true;
            if (!url) {
                return _this;
            }
            _this.name = url;
            _this.url = url;
            _this.hasAlpha = false;
            _this.isCube = true;
            _this._textureMatrix = BABYLON.Matrix.Identity();
            _this._onLoad = onLoad;
            _this._onError = onError;
            _this.gammaSpace = false;
            var caps = scene.getEngine().getCaps();
            if (size) {
                _this._isBABYLONPreprocessed = false;
                _this._noMipmap = noMipmap;
                _this._size = size;
                _this._useInGammaSpace = useInGammaSpace;
                _this._usePMREMGenerator = usePMREMGenerator &&
                    caps.textureLOD &&
                    caps.textureFloat &&
                    !_this._useInGammaSpace;
            }
            else {
                _this._isBABYLONPreprocessed = true;
                _this._noMipmap = false;
                _this._useInGammaSpace = false;
                _this._usePMREMGenerator = caps.textureLOD && caps.textureFloat &&
                    !_this._useInGammaSpace;
            }
            _this.isPMREM = _this._usePMREMGenerator;
            _this._texture = _this._getFromCache(url, _this._noMipmap);
            if (!_this._texture) {
                if (!scene.useDelayedTextureLoading) {
                    _this.loadTexture();
                }
                else {
                    _this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_NOTLOADED;
                }
            }
            return _this;
        }
        Object.defineProperty(HDRCubeTexture.prototype, "isBlocking", {
            /**
             * Gets wether or not the texture is blocking during loading.
             */
            get: function () {
                return this._isBlocking;
            },
            /**
             * Sets wether or not the texture is blocking during loading.
             */
            set: function (value) {
                this._isBlocking = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Occurs when the file is a preprocessed .babylon.hdr file.
         */
        HDRCubeTexture.prototype.loadBabylonTexture = function () {
            var _this = this;
            var mipLevels = 0;
            var floatArrayView = null;
            var scene = this.getScene();
            var mipmapGenerator = (!this._useInGammaSpace && scene && scene.getEngine().getCaps().textureFloat) ? function (data) {
                var mips = new Array();
                if (!floatArrayView) {
                    return mips;
                }
                var startIndex = 30;
                for (var level = 0; level < mipLevels; level++) {
                    mips.push([]);
                    // Fill each pixel of the mip level.
                    var faceSize = Math.pow(_this._size >> level, 2) * 3;
                    for (var faceIndex = 0; faceIndex < 6; faceIndex++) {
                        var faceData = floatArrayView.subarray(startIndex, startIndex + faceSize);
                        mips[level].push(faceData);
                        startIndex += faceSize;
                    }
                }
                return mips;
            } : null;
            var callback = function (buffer) {
                var scene = _this.getScene();
                if (!scene) {
                    return null;
                }
                // Create Native Array Views
                var intArrayView = new Int32Array(buffer);
                floatArrayView = new Float32Array(buffer);
                // Fill header.
                var version = intArrayView[0]; // Version 1. (MAy be use in case of format changes for backward compaibility)
                _this._size = intArrayView[1]; // CubeMap max mip face size.
                // Update Texture Information.
                if (!_this._texture) {
                    return null;
                }
                _this._texture.updateSize(_this._size, _this._size);
                // Fill polynomial information.
                var sphericalPolynomial = new BABYLON.SphericalPolynomial();
                sphericalPolynomial.x.copyFromFloats(floatArrayView[2], floatArrayView[3], floatArrayView[4]);
                sphericalPolynomial.y.copyFromFloats(floatArrayView[5], floatArrayView[6], floatArrayView[7]);
                sphericalPolynomial.z.copyFromFloats(floatArrayView[8], floatArrayView[9], floatArrayView[10]);
                sphericalPolynomial.xx.copyFromFloats(floatArrayView[11], floatArrayView[12], floatArrayView[13]);
                sphericalPolynomial.yy.copyFromFloats(floatArrayView[14], floatArrayView[15], floatArrayView[16]);
                sphericalPolynomial.zz.copyFromFloats(floatArrayView[17], floatArrayView[18], floatArrayView[19]);
                sphericalPolynomial.xy.copyFromFloats(floatArrayView[20], floatArrayView[21], floatArrayView[22]);
                sphericalPolynomial.yz.copyFromFloats(floatArrayView[23], floatArrayView[24], floatArrayView[25]);
                sphericalPolynomial.zx.copyFromFloats(floatArrayView[26], floatArrayView[27], floatArrayView[28]);
                _this.sphericalPolynomial = sphericalPolynomial;
                // Fill pixel data.
                mipLevels = intArrayView[29]; // Number of mip levels.
                var startIndex = 30;
                var data = [];
                var faceSize = Math.pow(_this._size, 2) * 3;
                for (var faceIndex = 0; faceIndex < 6; faceIndex++) {
                    data.push(floatArrayView.subarray(startIndex, startIndex + faceSize));
                    startIndex += faceSize;
                }
                var results = [];
                var byteArray = null;
                // Push each faces.
                for (var k = 0; k < 6; k++) {
                    var dataFace = null;
                    // To be deprecated.
                    if (version === 1) {
                        var j = ([0, 2, 4, 1, 3, 5])[k]; // Transforms +X+Y+Z... to +X-X+Y-Y...
                        dataFace = data[j];
                    }
                    // If special cases.
                    if (!mipmapGenerator && dataFace) {
                        if (!scene.getEngine().getCaps().textureFloat) {
                            // 3 channels of 1 bytes per pixel in bytes.
                            var byteBuffer = new ArrayBuffer(faceSize);
                            byteArray = new Uint8Array(byteBuffer);
                        }
                        for (var i = 0; i < _this._size * _this._size; i++) {
                            // Put in gamma space if requested.
                            if (_this._useInGammaSpace) {
                                dataFace[(i * 3) + 0] = Math.pow(dataFace[(i * 3) + 0], BABYLON.ToGammaSpace);
                                dataFace[(i * 3) + 1] = Math.pow(dataFace[(i * 3) + 1], BABYLON.ToGammaSpace);
                                dataFace[(i * 3) + 2] = Math.pow(dataFace[(i * 3) + 2], BABYLON.ToGammaSpace);
                            }
                            // Convert to int texture for fallback.
                            if (byteArray) {
                                var r = Math.max(dataFace[(i * 3) + 0] * 255, 0);
                                var g = Math.max(dataFace[(i * 3) + 1] * 255, 0);
                                var b = Math.max(dataFace[(i * 3) + 2] * 255, 0);
                                // May use luminance instead if the result is not accurate.
                                var max = Math.max(Math.max(r, g), b);
                                if (max > 255) {
                                    var scale = 255 / max;
                                    r *= scale;
                                    g *= scale;
                                    b *= scale;
                                }
                                byteArray[(i * 3) + 0] = r;
                                byteArray[(i * 3) + 1] = g;
                                byteArray[(i * 3) + 2] = b;
                            }
                        }
                    }
                    // Fill the array accordingly.
                    if (byteArray) {
                        results.push(byteArray);
                    }
                    else {
                        results.push(dataFace);
                    }
                }
                return results;
            };
            if (scene) {
                this._texture = scene.getEngine().createRawCubeTextureFromUrl(this.url, scene, this._size, BABYLON.Engine.TEXTUREFORMAT_RGB, scene.getEngine().getCaps().textureFloat ? BABYLON.Engine.TEXTURETYPE_FLOAT : BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT, this._noMipmap, callback, mipmapGenerator, this._onLoad, this._onError);
            }
        };
        /**
         * Occurs when the file is raw .hdr file.
         */
        HDRCubeTexture.prototype.loadHDRTexture = function () {
            var _this = this;
            var callback = function (buffer) {
                var scene = _this.getScene();
                if (!scene) {
                    return null;
                }
                // Extract the raw linear data.
                var data = BABYLON.Internals.HDRTools.GetCubeMapTextureData(buffer, _this._size);
                // Generate harmonics if needed.
                if (_this._generateHarmonics) {
                    var sphericalPolynomial = BABYLON.Internals.CubeMapToSphericalPolynomialTools.ConvertCubeMapToSphericalPolynomial(data);
                    _this.sphericalPolynomial = sphericalPolynomial;
                }
                var results = [];
                var byteArray = null;
                // Push each faces.
                for (var j = 0; j < 6; j++) {
                    // Create uintarray fallback.
                    if (!scene.getEngine().getCaps().textureFloat) {
                        // 3 channels of 1 bytes per pixel in bytes.
                        var byteBuffer = new ArrayBuffer(_this._size * _this._size * 3);
                        byteArray = new Uint8Array(byteBuffer);
                    }
                    var dataFace = (data[HDRCubeTexture._facesMapping[j]]);
                    // If special cases.
                    if (_this._useInGammaSpace || byteArray) {
                        for (var i = 0; i < _this._size * _this._size; i++) {
                            // Put in gamma space if requested.
                            if (_this._useInGammaSpace) {
                                dataFace[(i * 3) + 0] = Math.pow(dataFace[(i * 3) + 0], BABYLON.ToGammaSpace);
                                dataFace[(i * 3) + 1] = Math.pow(dataFace[(i * 3) + 1], BABYLON.ToGammaSpace);
                                dataFace[(i * 3) + 2] = Math.pow(dataFace[(i * 3) + 2], BABYLON.ToGammaSpace);
                            }
                            // Convert to int texture for fallback.
                            if (byteArray) {
                                var r = Math.max(dataFace[(i * 3) + 0] * 255, 0);
                                var g = Math.max(dataFace[(i * 3) + 1] * 255, 0);
                                var b = Math.max(dataFace[(i * 3) + 2] * 255, 0);
                                // May use luminance instead if the result is not accurate.
                                var max = Math.max(Math.max(r, g), b);
                                if (max > 255) {
                                    var scale = 255 / max;
                                    r *= scale;
                                    g *= scale;
                                    b *= scale;
                                }
                                byteArray[(i * 3) + 0] = r;
                                byteArray[(i * 3) + 1] = g;
                                byteArray[(i * 3) + 2] = b;
                            }
                        }
                    }
                    if (byteArray) {
                        results.push(byteArray);
                    }
                    else {
                        results.push(dataFace);
                    }
                }
                return results;
            };
            var mipmapGenerator = null;
            // TODO. Implement In code PMREM Generator following the LYS toolset generation.
            // if (!this._noMipmap &&
            //     this._usePMREMGenerator) {
            //     mipmapGenerator = (data: ArrayBufferView[]) => {
            //         // Custom setup of the generator matching with the PBR shader values.
            //         var generator = new BABYLON.Internals.PMREMGenerator(data,
            //             this._size,
            //             this._size,
            //             0,
            //             3,
            //             this.getScene().getEngine().getCaps().textureFloat,
            //             2048,
            //             0.25,
            //             false,
            //             true);
            //         return generator.filterCubeMap();
            //     };
            // }
            var scene = this.getScene();
            if (scene) {
                this._texture = scene.getEngine().createRawCubeTextureFromUrl(this.url, scene, this._size, BABYLON.Engine.TEXTUREFORMAT_RGB, scene.getEngine().getCaps().textureFloat ? BABYLON.Engine.TEXTURETYPE_FLOAT : BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT, this._noMipmap, callback, mipmapGenerator, this._onLoad, this._onError);
            }
        };
        /**
         * Starts the loading process of the texture.
         */
        HDRCubeTexture.prototype.loadTexture = function () {
            if (this._isBABYLONPreprocessed) {
                this.loadBabylonTexture();
            }
            else {
                this.loadHDRTexture();
            }
        };
        HDRCubeTexture.prototype.clone = function () {
            var scene = this.getScene();
            if (!scene) {
                return this;
            }
            var size = (this._isBABYLONPreprocessed ? null : this._size);
            var newTexture = new HDRCubeTexture(this.url, scene, size, this._noMipmap, this._generateHarmonics, this._useInGammaSpace, this._usePMREMGenerator);
            // Base texture
            newTexture.level = this.level;
            newTexture.wrapU = this.wrapU;
            newTexture.wrapV = this.wrapV;
            newTexture.coordinatesIndex = this.coordinatesIndex;
            newTexture.coordinatesMode = this.coordinatesMode;
            return newTexture;
        };
        // Methods
        HDRCubeTexture.prototype.delayLoad = function () {
            if (this.delayLoadState !== BABYLON.Engine.DELAYLOADSTATE_NOTLOADED) {
                return;
            }
            this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_LOADED;
            this._texture = this._getFromCache(this.url, this._noMipmap);
            if (!this._texture) {
                this.loadTexture();
            }
        };
        HDRCubeTexture.prototype.getReflectionTextureMatrix = function () {
            return this._textureMatrix;
        };
        HDRCubeTexture.prototype.setReflectionTextureMatrix = function (value) {
            this._textureMatrix = value;
        };
        HDRCubeTexture.Parse = function (parsedTexture, scene, rootUrl) {
            var texture = null;
            if (parsedTexture.name && !parsedTexture.isRenderTarget) {
                var size = parsedTexture.isBABYLONPreprocessed ? null : parsedTexture.size;
                texture = new HDRCubeTexture(rootUrl + parsedTexture.name, scene, size, parsedTexture.noMipmap, parsedTexture.generateHarmonics, parsedTexture.useInGammaSpace, parsedTexture.usePMREMGenerator);
                texture.name = parsedTexture.name;
                texture.hasAlpha = parsedTexture.hasAlpha;
                texture.level = parsedTexture.level;
                texture.coordinatesMode = parsedTexture.coordinatesMode;
                texture.isBlocking = parsedTexture.isBlocking;
            }
            return texture;
        };
        HDRCubeTexture.prototype.serialize = function () {
            if (!this.name) {
                return null;
            }
            var serializationObject = {};
            serializationObject.name = this.name;
            serializationObject.hasAlpha = this.hasAlpha;
            serializationObject.isCube = true;
            serializationObject.level = this.level;
            serializationObject.size = this._size;
            serializationObject.coordinatesMode = this.coordinatesMode;
            serializationObject.useInGammaSpace = this._useInGammaSpace;
            serializationObject.generateHarmonics = this._generateHarmonics;
            serializationObject.usePMREMGenerator = this._usePMREMGenerator;
            serializationObject.isBABYLONPreprocessed = this._isBABYLONPreprocessed;
            serializationObject.customType = "BABYLON.HDRCubeTexture";
            serializationObject.noMipmap = this._noMipmap;
            serializationObject.isBlocking = this._isBlocking;
            return serializationObject;
        };
        /**
         * Saves as a file the data contained in the texture in a binary format.
         * This can be used to prevent the long loading tie associated with creating the seamless texture as well
         * as the spherical used in the lighting.
         * @param url The HDR file url.
         * @param size The size of the texture data to generate (one of the cubemap face desired width).
         * @param onError Method called if any error happens during download.
         * @return The packed binary data.
         */
        HDRCubeTexture.generateBabylonHDROnDisk = function (url, size, onError) {
            if (onError === void 0) { onError = null; }
            var callback = function (buffer) {
                var data = new Blob([buffer], { type: 'application/octet-stream' });
                // Returns a URL you can use as a href.
                var objUrl = window.URL.createObjectURL(data);
                // Simulates a link to it and click to dowload.
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style.display = "none";
                a.href = objUrl;
                a.download = "envmap.babylon.hdr";
                a.click();
            };
            HDRCubeTexture.generateBabylonHDR(url, size, callback, onError);
        };
        /**
         * Serializes the data contained in the texture in a binary format.
         * This can be used to prevent the long loading tie associated with creating the seamless texture as well
         * as the spherical used in the lighting.
         * @param url The HDR file url.
         * @param size The size of the texture data to generate (one of the cubemap face desired width).
         * @param onError Method called if any error happens during download.
         * @return The packed binary data.
         */
        HDRCubeTexture.generateBabylonHDR = function (url, size, callback, onError) {
            if (onError === void 0) { onError = null; }
            // Needs the url tho create the texture.
            if (!url) {
                return;
            }
            // Check Power of two size.
            if (!BABYLON.Tools.IsExponentOfTwo(size)) {
                return;
            }
            // Coming Back in 3.x.
            BABYLON.Tools.Error("Generation of Babylon HDR is coming back in 3.2.");
        };
        HDRCubeTexture._facesMapping = [
            "right",
            "left",
            "up",
            "down",
            "front",
            "back"
        ];
        return HDRCubeTexture;
    }(BABYLON.BaseTexture));
    BABYLON.HDRCubeTexture = HDRCubeTexture;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.hdrCubeTexture.js.map
