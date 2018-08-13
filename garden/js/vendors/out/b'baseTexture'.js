

var LIB;
(function (LIB) {
    var BaseTexture = /** @class */ (function () {
        function BaseTexture(scene) {
            this._hasAlpha = false;
            this.getAlphaFromRGB = false;
            this.level = 1;
            this.coordinatesIndex = 0;
            this._coordinatesMode = LIB.Texture.EXPLICIT_MODE;
            /**
            * | Value | Type               | Description |
            * | ----- | ------------------ | ----------- |
            * | 0     | CLAMP_ADDRESSMODE  |             |
            * | 1     | WRAP_ADDRESSMODE   |             |
            * | 2     | MIRROR_ADDRESSMODE |             |
            */
            this.wrapU = LIB.Texture.WRAP_ADDRESSMODE;
            /**
            * | Value | Type               | Description |
            * | ----- | ------------------ | ----------- |
            * | 0     | CLAMP_ADDRESSMODE  |             |
            * | 1     | WRAP_ADDRESSMODE   |             |
            * | 2     | MIRROR_ADDRESSMODE |             |
            */
            this.wrapV = LIB.Texture.WRAP_ADDRESSMODE;
            /**
            * | Value | Type               | Description |
            * | ----- | ------------------ | ----------- |
            * | 0     | CLAMP_ADDRESSMODE  |             |
            * | 1     | WRAP_ADDRESSMODE   |             |
            * | 2     | MIRROR_ADDRESSMODE |             |
            */
            this.wrapR = LIB.Texture.WRAP_ADDRESSMODE;
            this.anisotropicFilteringLevel = BaseTexture.DEFAULT_ANISOTROPIC_FILTERING_LEVEL;
            this.isCube = false;
            this.is3D = false;
            this.gammaSpace = true;
            this.invertZ = false;
            this.lodLevelInAlpha = false;
            this.lodGenerationOffset = 0.0;
            this.lodGenerationScale = 0.8;
            this.isRenderTarget = false;
            this.animations = new Array();
            /**
            * An event triggered when the texture is disposed.
            */
            this.onDisposeObservable = new LIB.Observable();
            this.delayLoadState = LIB.Engine.DELAYLOADSTATE_NONE;
            this._scene = scene || LIB.Engine.LastCreatedScene;
            if (this._scene) {
                this._scene.textures.push(this);
            }
            this._uid = null;
        }
        Object.defineProperty(BaseTexture.prototype, "hasAlpha", {
            get: function () {
                return this._hasAlpha;
            },
            set: function (value) {
                if (this._hasAlpha === value) {
                    return;
                }
                this._hasAlpha = value;
                if (this._scene) {
                    this._scene.markAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag | LIB.Material.MiscDirtyFlag);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseTexture.prototype, "coordinatesMode", {
            get: function () {
                return this._coordinatesMode;
            },
            /**
            * How a texture is mapped.
            *
            * | Value | Type                                | Description |
            * | ----- | ----------------------------------- | ----------- |
            * | 0     | EXPLICIT_MODE                       |             |
            * | 1     | SPHERICAL_MODE                      |             |
            * | 2     | PLANAR_MODE                         |             |
            * | 3     | CUBIC_MODE                          |             |
            * | 4     | PROJECTION_MODE                     |             |
            * | 5     | SKYBOX_MODE                         |             |
            * | 6     | INVCUBIC_MODE                       |             |
            * | 7     | EQUIRECTANGULAR_MODE                |             |
            * | 8     | FIXED_EQUIRECTANGULAR_MODE          |             |
            * | 9     | FIXED_EQUIRECTANGULAR_MIRRORED_MODE |             |
            */
            set: function (value) {
                if (this._coordinatesMode === value) {
                    return;
                }
                this._coordinatesMode = value;
                if (this._scene) {
                    this._scene.markAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseTexture.prototype, "uid", {
            get: function () {
                if (!this._uid) {
                    this._uid = LIB.Tools.RandomId();
                }
                return this._uid;
            },
            enumerable: true,
            configurable: true
        });
        BaseTexture.prototype.toString = function () {
            return this.name;
        };
        BaseTexture.prototype.getClassName = function () {
            return "BaseTexture";
        };
        Object.defineProperty(BaseTexture.prototype, "onDispose", {
            set: function (callback) {
                if (this._onDisposeObserver) {
                    this.onDisposeObservable.remove(this._onDisposeObserver);
                }
                this._onDisposeObserver = this.onDisposeObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseTexture.prototype, "isBlocking", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        BaseTexture.prototype.getScene = function () {
            return this._scene;
        };
        BaseTexture.prototype.getTextureMatrix = function () {
            return LIB.Matrix.IdentityReadOnly;
        };
        BaseTexture.prototype.getReflectionTextureMatrix = function () {
            return LIB.Matrix.IdentityReadOnly;
        };
        BaseTexture.prototype.getInternalTexture = function () {
            return this._texture;
        };
        BaseTexture.prototype.isReadyOrNotBlocking = function () {
            return !this.isBlocking || this.isReady();
        };
        BaseTexture.prototype.isReady = function () {
            if (this.delayLoadState === LIB.Engine.DELAYLOADSTATE_NOTLOADED) {
                this.delayLoad();
                return false;
            }
            if (this._texture) {
                return this._texture.isReady;
            }
            return false;
        };
        BaseTexture.prototype.getSize = function () {
            if (this._texture && this._texture.width) {
                return new LIB.Size(this._texture.width, this._texture.height);
            }
            if (this._texture && this._texture._size) {
                return new LIB.Size(this._texture._size, this._texture._size);
            }
            return LIB.Size.Zero();
        };
        BaseTexture.prototype.getBaseSize = function () {
            if (!this.isReady() || !this._texture)
                return LIB.Size.Zero();
            if (this._texture._size) {
                return new LIB.Size(this._texture._size, this._texture._size);
            }
            return new LIB.Size(this._texture.baseWidth, this._texture.baseHeight);
        };
        BaseTexture.prototype.scale = function (ratio) {
        };
        Object.defineProperty(BaseTexture.prototype, "canRescale", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        BaseTexture.prototype._getFromCache = function (url, noMipmap, sampling) {
            if (!this._scene) {
                return null;
            }
            var texturesCache = this._scene.getEngine().getLoadedTexturesCache();
            for (var index = 0; index < texturesCache.length; index++) {
                var texturesCacheEntry = texturesCache[index];
                if (texturesCacheEntry.url === url && texturesCacheEntry.generateMipMaps === !noMipmap) {
                    if (!sampling || sampling === texturesCacheEntry.samplingMode) {
                        texturesCacheEntry.incrementReferences();
                        return texturesCacheEntry;
                    }
                }
            }
            return null;
        };
        BaseTexture.prototype._rebuild = function () {
        };
        BaseTexture.prototype.delayLoad = function () {
        };
        BaseTexture.prototype.clone = function () {
            return null;
        };
        Object.defineProperty(BaseTexture.prototype, "textureType", {
            get: function () {
                if (!this._texture) {
                    return LIB.Engine.TEXTURETYPE_UNSIGNED_INT;
                }
                return (this._texture.type !== undefined) ? this._texture.type : LIB.Engine.TEXTURETYPE_UNSIGNED_INT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseTexture.prototype, "textureFormat", {
            get: function () {
                if (!this._texture) {
                    return LIB.Engine.TEXTUREFORMAT_RGBA;
                }
                return (this._texture.format !== undefined) ? this._texture.format : LIB.Engine.TEXTUREFORMAT_RGBA;
            },
            enumerable: true,
            configurable: true
        });
        BaseTexture.prototype.readPixels = function (faceIndex) {
            if (faceIndex === void 0) { faceIndex = 0; }
            if (!this._texture) {
                return null;
            }
            var size = this.getSize();
            var scene = this.getScene();
            if (!scene) {
                return null;
            }
            var engine = scene.getEngine();
            if (this._texture.isCube) {
                return engine._readTexturePixels(this._texture, size.width, size.height, faceIndex);
            }
            return engine._readTexturePixels(this._texture, size.width, size.height, -1);
        };
        BaseTexture.prototype.releaseInternalTexture = function () {
            if (this._texture) {
                this._texture.dispose();
                this._texture = null;
            }
        };
        Object.defineProperty(BaseTexture.prototype, "sphericalPolynomial", {
            get: function () {
                if (!this._texture || !LIB.CubeMapToSphericalPolynomialTools || !this.isReady()) {
                    return null;
                }
                if (!this._texture._sphericalPolynomial) {
                    this._texture._sphericalPolynomial =
                        LIB.CubeMapToSphericalPolynomialTools.ConvertCubeMapTextureToSphericalPolynomial(this);
                }
                return this._texture._sphericalPolynomial;
            },
            set: function (value) {
                if (this._texture) {
                    this._texture._sphericalPolynomial = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseTexture.prototype, "_lodTextureHigh", {
            get: function () {
                if (this._texture) {
                    return this._texture._lodTextureHigh;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseTexture.prototype, "_lodTextureMid", {
            get: function () {
                if (this._texture) {
                    return this._texture._lodTextureMid;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseTexture.prototype, "_lodTextureLow", {
            get: function () {
                if (this._texture) {
                    return this._texture._lodTextureLow;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        BaseTexture.prototype.dispose = function () {
            if (!this._scene) {
                return;
            }
            // Animations
            this._scene.stopAnimation(this);
            // Remove from scene
            this._scene._removePendingData(this);
            var index = this._scene.textures.indexOf(this);
            if (index >= 0) {
                this._scene.textures.splice(index, 1);
            }
            if (this._texture === undefined) {
                return;
            }
            // Release
            this.releaseInternalTexture();
            // Callback
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
        };
        BaseTexture.prototype.serialize = function () {
            if (!this.name) {
                return null;
            }
            var serializationObject = LIB.SerializationHelper.Serialize(this);
            // Animations
            LIB.Animation.AppendSerializedAnimations(this, serializationObject);
            return serializationObject;
        };
        BaseTexture.WhenAllReady = function (textures, callback) {
            var numRemaining = textures.length;
            if (numRemaining === 0) {
                callback();
                return;
            }
            var _loop_1 = function () {
                texture = textures[i];
                if (texture.isReady()) {
                    if (--numRemaining === 0) {
                        callback();
                    }
                }
                else {
                    onLoadObservable = texture.onLoadObservable;
                    var onLoadCallback_1 = function () {
                        onLoadObservable.removeCallback(onLoadCallback_1);
                        if (--numRemaining === 0) {
                            callback();
                        }
                    };
                    onLoadObservable.add(onLoadCallback_1);
                }
            };
            var texture, onLoadObservable;
            for (var i = 0; i < textures.length; i++) {
                _loop_1();
            }
        };
        BaseTexture.DEFAULT_ANISOTROPIC_FILTERING_LEVEL = 4;
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "name", void 0);
        __decorate([
            LIB.serialize("hasAlpha")
        ], BaseTexture.prototype, "_hasAlpha", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "getAlphaFromRGB", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "level", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "coordinatesIndex", void 0);
        __decorate([
            LIB.serialize("coordinatesMode")
        ], BaseTexture.prototype, "_coordinatesMode", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "wrapU", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "wrapV", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "wrapR", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "anisotropicFilteringLevel", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "isCube", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "is3D", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "gammaSpace", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "invertZ", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "lodLevelInAlpha", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "lodGenerationOffset", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "lodGenerationScale", void 0);
        __decorate([
            LIB.serialize()
        ], BaseTexture.prototype, "isRenderTarget", void 0);
        return BaseTexture;
    }());
    LIB.BaseTexture = BaseTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.baseTexture.js.map
//# sourceMappingURL=LIB.baseTexture.js.map
