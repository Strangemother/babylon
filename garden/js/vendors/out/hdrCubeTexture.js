

var LIB;
(function (LIB) {
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
         * @param size The cubemap desired size (the more it increases the longer the generation will be)
         * @param noMipmap Forces to not generate the mipmap if true
         * @param generateHarmonics Specifies whether you want to extract the polynomial harmonics during the generation process
         * @param gammaSpace Specifies if the texture will be use in gamma or linear space (the PBR material requires those texture in linear space, but the standard material would require them in Gamma space)
         * @param reserved Reserved flag for internal use.
         */
        function HDRCubeTexture(url, scene, size, noMipmap, generateHarmonics, gammaSpace, reserved, onLoad, onError) {
            if (noMipmap === void 0) { noMipmap = false; }
            if (generateHarmonics === void 0) { generateHarmonics = true; }
            if (gammaSpace === void 0) { gammaSpace = false; }
            if (reserved === void 0) { reserved = false; }
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            var _this = _super.call(this, scene) || this;
            _this._generateHarmonics = true;
            _this._onLoad = null;
            _this._onError = null;
            /**
             * The texture coordinates mode. As this texture is stored in a cube format, please modify carefully.
             */
            _this.coordinatesMode = LIB.Texture.CUBIC_MODE;
            _this._isBlocking = true;
            _this._rotationY = 0;
            /**
             * Gets or sets the center of the bounding box associated with the cube texture
             * It must define where the camera used to render the texture was set
             */
            _this.boundingBoxPosition = LIB.Vector3.Zero();
            if (!url) {
                return _this;
            }
            _this.name = url;
            _this.url = url;
            _this.hasAlpha = false;
            _this.isCube = true;
            _this._textureMatrix = LIB.Matrix.Identity();
            _this._onLoad = onLoad;
            _this._onError = onError;
            _this.gammaSpace = gammaSpace;
            _this._noMipmap = noMipmap;
            _this._size = size;
            _this._texture = _this._getFromCache(url, _this._noMipmap);
            if (!_this._texture) {
                if (!scene.useDelayedTextureLoading) {
                    _this.loadTexture();
                }
                else {
                    _this.delayLoadState = LIB.Engine.DELAYLOADSTATE_NOTLOADED;
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
        Object.defineProperty(HDRCubeTexture.prototype, "rotationY", {
            /**
             * Gets texture matrix rotation angle around Y axis radians.
             */
            get: function () {
                return this._rotationY;
            },
            /**
             * Sets texture matrix rotation angle around Y axis in radians.
             */
            set: function (value) {
                this._rotationY = value;
                this.setReflectionTextureMatrix(LIB.Matrix.RotationY(this._rotationY));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HDRCubeTexture.prototype, "boundingBoxSize", {
            get: function () {
                return this._boundingBoxSize;
            },
            /**
             * Gets or sets the size of the bounding box associated with the cube texture
             * When defined, the cubemap will switch to local mode
             * @see https://community.arm.com/graphics/b/blog/posts/reflections-based-on-local-cubemaps-in-unity
             * @example https://www.LIBjs-playground.com/#RNASML
             */
            set: function (value) {
                if (this._boundingBoxSize && this._boundingBoxSize.equals(value)) {
                    return;
                }
                this._boundingBoxSize = value;
                var scene = this.getScene();
                if (scene) {
                    scene.markAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Occurs when the file is raw .hdr file.
         */
        HDRCubeTexture.prototype.loadTexture = function () {
            var _this = this;
            var callback = function (buffer) {
                var scene = _this.getScene();
                if (!scene) {
                    return null;
                }
                // Extract the raw linear data.
                var data = LIB.HDRTools.GetCubeMapTextureData(buffer, _this._size);
                // Generate harmonics if needed.
                if (_this._generateHarmonics) {
                    var sphericalPolynomial = LIB.CubeMapToSphericalPolynomialTools.ConvertCubeMapToSphericalPolynomial(data);
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
                    if (_this.gammaSpace || byteArray) {
                        for (var i = 0; i < _this._size * _this._size; i++) {
                            // Put in gamma space if requested.
                            if (_this.gammaSpace) {
                                dataFace[(i * 3) + 0] = Math.pow(dataFace[(i * 3) + 0], LIB.ToGammaSpace);
                                dataFace[(i * 3) + 1] = Math.pow(dataFace[(i * 3) + 1], LIB.ToGammaSpace);
                                dataFace[(i * 3) + 2] = Math.pow(dataFace[(i * 3) + 2], LIB.ToGammaSpace);
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
            var scene = this.getScene();
            if (scene) {
                this._texture = scene.getEngine().createRawCubeTextureFromUrl(this.url, scene, this._size, LIB.Engine.TEXTUREFORMAT_RGB, scene.getEngine().getCaps().textureFloat ? LIB.Engine.TEXTURETYPE_FLOAT : LIB.Engine.TEXTURETYPE_UNSIGNED_INT, this._noMipmap, callback, null, this._onLoad, this._onError);
            }
        };
        HDRCubeTexture.prototype.clone = function () {
            var scene = this.getScene();
            if (!scene) {
                return this;
            }
            var newTexture = new HDRCubeTexture(this.url, scene, this._size, this._noMipmap, this._generateHarmonics, this.gammaSpace);
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
            if (this.delayLoadState !== LIB.Engine.DELAYLOADSTATE_NOTLOADED) {
                return;
            }
            this.delayLoadState = LIB.Engine.DELAYLOADSTATE_LOADED;
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
                texture = new HDRCubeTexture(rootUrl + parsedTexture.name, scene, parsedTexture.size, parsedTexture.noMipmap, parsedTexture.generateHarmonics, parsedTexture.useInGammaSpace);
                texture.name = parsedTexture.name;
                texture.hasAlpha = parsedTexture.hasAlpha;
                texture.level = parsedTexture.level;
                texture.coordinatesMode = parsedTexture.coordinatesMode;
                texture.isBlocking = parsedTexture.isBlocking;
            }
            if (texture) {
                if (parsedTexture.boundingBoxPosition) {
                    texture.boundingBoxPosition = LIB.Vector3.FromArray(parsedTexture.boundingBoxPosition);
                }
                if (parsedTexture.boundingBoxSize) {
                    texture.boundingBoxSize = LIB.Vector3.FromArray(parsedTexture.boundingBoxSize);
                }
                if (parsedTexture.rotationY) {
                    texture.rotationY = parsedTexture.rotationY;
                }
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
            serializationObject.useInGammaSpace = this.gammaSpace;
            serializationObject.generateHarmonics = this._generateHarmonics;
            serializationObject.customType = "LIB.HDRCubeTexture";
            serializationObject.noMipmap = this._noMipmap;
            serializationObject.isBlocking = this._isBlocking;
            serializationObject.rotationY = this._rotationY;
            return serializationObject;
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
    }(LIB.BaseTexture));
    LIB.HDRCubeTexture = HDRCubeTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.hdrCubeTexture.js.map
//# sourceMappingURL=LIB.hdrCubeTexture.js.map