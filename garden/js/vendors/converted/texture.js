(function (LIB) {
    var Texture = /** @class */ (function (_super) {
        __extends(Texture, _super);
        function Texture(url, scene, noMipmap, invertY, samplingMode, onLoad, onError, buffer, deleteBuffer, format) {
            if (noMipmap === void 0) { noMipmap = false; }
            if (invertY === void 0) { invertY = true; }
            if (samplingMode === void 0) { samplingMode = Texture.TRILINEAR_SAMPLINGMODE; }
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            if (buffer === void 0) { buffer = null; }
            if (deleteBuffer === void 0) { deleteBuffer = false; }
            var _this = _super.call(this, scene) || this;
            _this.uOffset = 0;
            _this.vOffset = 0;
            _this.uScale = 1.0;
            _this.vScale = 1.0;
            _this.uAng = 0;
            _this.vAng = 0;
            _this.wAng = 0;
            _this._isBlocking = true;
            _this.name = url || "";
            _this.url = url;
            _this._noMipmap = noMipmap;
            _this._invertY = invertY;
            _this._samplingMode = samplingMode;
            _this._buffer = buffer;
            _this._deleteBuffer = deleteBuffer;
            if (format) {
                _this._format = format;
            }
            scene = _this.getScene();
            if (!scene) {
                return _this;
            }
            scene.getEngine().onBeforeTextureInitObservable.notifyObservers(_this);
            var load = function () {
                if (_this._onLoadObservable && _this._onLoadObservable.hasObservers()) {
                    _this.onLoadObservable.notifyObservers(_this);
                }
                if (onLoad) {
                    onLoad();
                }
                if (!_this.isBlocking && scene) {
                    scene.resetCachedMaterial();
                }
            };
            if (!_this.url) {
                _this._delayedOnLoad = load;
                _this._delayedOnError = onError;
                return _this;
            }
            _this._texture = _this._getFromCache(_this.url, noMipmap, samplingMode);
            if (!_this._texture) {
                if (!scene.useDelayedTextureLoading) {
                    _this._texture = scene.getEngine().createTexture(_this.url, noMipmap, invertY, scene, _this._samplingMode, load, onError, _this._buffer, undefined, _this._format);
                    if (deleteBuffer) {
                        delete _this._buffer;
                    }
                }
                else {
                    _this.delayLoadState = LIB.Engine.DELAYLOADSTATE_NOTLOADED;
                    _this._delayedOnLoad = load;
                    _this._delayedOnError = onError;
                }
            }
            else {
                if (_this._texture.isReady) {
                    LIB.Tools.SetImmediate(function () { return load(); });
                }
                else {
                    _this._texture.onLoadedObservable.add(load);
                }
            }
            return _this;
        }
        Object.defineProperty(Texture.prototype, "noMipmap", {
            get: function () {
                return this._noMipmap;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "isBlocking", {
            get: function () {
                return this._isBlocking;
            },
            set: function (value) {
                this._isBlocking = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "samplingMode", {
            get: function () {
                return this._samplingMode;
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype.updateURL = function (url) {
            this.url = url;
            this.delayLoadState = LIB.Engine.DELAYLOADSTATE_NOTLOADED;
            this.delayLoad();
        };
        Texture.prototype.delayLoad = function () {
            var _this = this;
            if (this.delayLoadState !== LIB.Engine.DELAYLOADSTATE_NOTLOADED) {
                return;
            }
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            this.delayLoadState = LIB.Engine.DELAYLOADSTATE_LOADED;
            this._texture = this._getFromCache(this.url, this._noMipmap, this._samplingMode);
            if (!this._texture) {
                this._texture = scene.getEngine().createTexture(this.url, this._noMipmap, this._invertY, scene, this._samplingMode, this._delayedOnLoad, this._delayedOnError, this._buffer, null, this._format);
                if (this._deleteBuffer) {
                    delete this._buffer;
                }
            }
            else {
                if (this._texture.isReady) {
                    LIB.Tools.SetImmediate(function () {
                        if (!_this._delayedOnLoad) {
                            return;
                        }
                        _this._delayedOnLoad();
                    });
                }
                else {
                    if (this._delayedOnLoad) {
                        this._texture.onLoadedObservable.add(this._delayedOnLoad);
                    }
                }
            }
        };
        Texture.prototype.updateSamplingMode = function (samplingMode) {
            if (!this._texture) {
                return;
            }
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            this._samplingMode = samplingMode;
            scene.getEngine().updateTextureSamplingMode(samplingMode, this._texture);
        };
        Texture.prototype._prepareRowForTextureGeneration = function (x, y, z, t) {
            x *= this.uScale;
            y *= this.vScale;
            x -= 0.5 * this.uScale;
            y -= 0.5 * this.vScale;
            z -= 0.5;
            LIB.Vector3.TransformCoordinatesFromFloatsToRef(x, y, z, this._rowGenerationMatrix, t);
            t.x += 0.5 * this.uScale + this.uOffset;
            t.y += 0.5 * this.vScale + this.vOffset;
            t.z += 0.5;
        };
        Texture.prototype.getTextureMatrix = function () {
            var _this = this;
            if (this.uOffset === this._cachedUOffset &&
                this.vOffset === this._cachedVOffset &&
                this.uScale === this._cachedUScale &&
                this.vScale === this._cachedVScale &&
                this.uAng === this._cachedUAng &&
                this.vAng === this._cachedVAng &&
                this.wAng === this._cachedWAng) {
                return this._cachedTextureMatrix;
            }
            this._cachedUOffset = this.uOffset;
            this._cachedVOffset = this.vOffset;
            this._cachedUScale = this.uScale;
            this._cachedVScale = this.vScale;
            this._cachedUAng = this.uAng;
            this._cachedVAng = this.vAng;
            this._cachedWAng = this.wAng;
            if (!this._cachedTextureMatrix) {
                this._cachedTextureMatrix = LIB.Matrix.Zero();
                this._rowGenerationMatrix = new LIB.Matrix();
                this._t0 = LIB.Vector3.Zero();
                this._t1 = LIB.Vector3.Zero();
                this._t2 = LIB.Vector3.Zero();
            }
            LIB.Matrix.RotationYawPitchRollToRef(this.vAng, this.uAng, this.wAng, this._rowGenerationMatrix);
            this._prepareRowForTextureGeneration(0, 0, 0, this._t0);
            this._prepareRowForTextureGeneration(1.0, 0, 0, this._t1);
            this._prepareRowForTextureGeneration(0, 1.0, 0, this._t2);
            this._t1.subtractInPlace(this._t0);
            this._t2.subtractInPlace(this._t0);
            LIB.Matrix.IdentityToRef(this._cachedTextureMatrix);
            this._cachedTextureMatrix.m[0] = this._t1.x;
            this._cachedTextureMatrix.m[1] = this._t1.y;
            this._cachedTextureMatrix.m[2] = this._t1.z;
            this._cachedTextureMatrix.m[4] = this._t2.x;
            this._cachedTextureMatrix.m[5] = this._t2.y;
            this._cachedTextureMatrix.m[6] = this._t2.z;
            this._cachedTextureMatrix.m[8] = this._t0.x;
            this._cachedTextureMatrix.m[9] = this._t0.y;
            this._cachedTextureMatrix.m[10] = this._t0.z;
            var scene = this.getScene();
            if (!scene) {
                return this._cachedTextureMatrix;
            }
            scene.markAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag, function (mat) {
                return mat.hasTexture(_this);
            });
            return this._cachedTextureMatrix;
        };
        Texture.prototype.getReflectionTextureMatrix = function () {
            var _this = this;
            var scene = this.getScene();
            if (!scene) {
                return this._cachedTextureMatrix;
            }
            if (this.uOffset === this._cachedUOffset &&
                this.vOffset === this._cachedVOffset &&
                this.uScale === this._cachedUScale &&
                this.vScale === this._cachedVScale &&
                this.coordinatesMode === this._cachedCoordinatesMode) {
                if (this.coordinatesMode === Texture.PROJECTION_MODE) {
                    if (this._cachedProjectionMatrixId === scene.getProjectionMatrix().updateFlag) {
                        return this._cachedTextureMatrix;
                    }
                }
                else {
                    return this._cachedTextureMatrix;
                }
            }
            if (!this._cachedTextureMatrix) {
                this._cachedTextureMatrix = LIB.Matrix.Zero();
            }
            if (!this._projectionModeMatrix) {
                this._projectionModeMatrix = LIB.Matrix.Zero();
            }
            this._cachedUOffset = this.uOffset;
            this._cachedVOffset = this.vOffset;
            this._cachedUScale = this.uScale;
            this._cachedVScale = this.vScale;
            this._cachedCoordinatesMode = this.coordinatesMode;
            switch (this.coordinatesMode) {
                case Texture.PLANAR_MODE:
                    LIB.Matrix.IdentityToRef(this._cachedTextureMatrix);
                    this._cachedTextureMatrix[0] = this.uScale;
                    this._cachedTextureMatrix[5] = this.vScale;
                    this._cachedTextureMatrix[12] = this.uOffset;
                    this._cachedTextureMatrix[13] = this.vOffset;
                    break;
                case Texture.PROJECTION_MODE:
                    LIB.Matrix.IdentityToRef(this._projectionModeMatrix);
                    this._projectionModeMatrix.m[0] = 0.5;
                    this._projectionModeMatrix.m[5] = -0.5;
                    this._projectionModeMatrix.m[10] = 0.0;
                    this._projectionModeMatrix.m[12] = 0.5;
                    this._projectionModeMatrix.m[13] = 0.5;
                    this._projectionModeMatrix.m[14] = 1.0;
                    this._projectionModeMatrix.m[15] = 1.0;
                    var projectionMatrix = scene.getProjectionMatrix();
                    this._cachedProjectionMatrixId = projectionMatrix.updateFlag;
                    projectionMatrix.multiplyToRef(this._projectionModeMatrix, this._cachedTextureMatrix);
                    break;
                default:
                    LIB.Matrix.IdentityToRef(this._cachedTextureMatrix);
                    break;
            }
            scene.markAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag, function (mat) {
                return (mat.getActiveTextures().indexOf(_this) !== -1);
            });
            return this._cachedTextureMatrix;
        };
        Texture.prototype.clone = function () {
            var _this = this;
            return LIB.SerializationHelper.Clone(function () {
                return new Texture(_this._texture ? _this._texture.url : null, _this.getScene(), _this._noMipmap, _this._invertY, _this._samplingMode);
            }, this);
        };
        Object.defineProperty(Texture.prototype, "onLoadObservable", {
            get: function () {
                if (!this._onLoadObservable) {
                    this._onLoadObservable = new LIB.Observable();
                }
                return this._onLoadObservable;
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype.serialize = function () {
            var serializationObject = _super.prototype.serialize.call(this);
            if (typeof this._buffer === "string" && this._buffer.substr(0, 5) === "data:") {
                serializationObject.base64String = this._buffer;
                serializationObject.name = serializationObject.name.replace("data:", "");
            }
            return serializationObject;
        };
        Texture.prototype.getClassName = function () {
            return "Texture";
        };
        Texture.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.onLoadObservable) {
                this.onLoadObservable.clear();
                this._onLoadObservable = null;
            }
            this._delayedOnLoad = null;
            this._delayedOnError = null;
        };
        // Statics
        Texture.CreateFromBase64String = function (data, name, scene, noMipmap, invertY, samplingMode, onLoad, onError, format) {
            if (samplingMode === void 0) { samplingMode = Texture.TRILINEAR_SAMPLINGMODE; }
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            if (format === void 0) { format = LIB.Engine.TEXTUREFORMAT_RGBA; }
            return new Texture("data:" + name, scene, noMipmap, invertY, samplingMode, onLoad, onError, data, false, format);
        };
        Texture.Parse = function (parsedTexture, scene, rootUrl) {
            if (parsedTexture.customType) {
                var customTexture = LIB.Tools.Instantiate(parsedTexture.customType);
                // Update Sampling Mode
                var parsedCustomTexture = customTexture.Parse(parsedTexture, scene, rootUrl);
                if (parsedTexture.samplingMode && parsedCustomTexture.updateSamplingMode && parsedCustomTexture._samplingMode) {
                    if (parsedCustomTexture._samplingMode !== parsedTexture.samplingMode) {
                        parsedCustomTexture.updateSamplingMode(parsedTexture.samplingMode);
                    }
                }
                return parsedCustomTexture;
            }
            if (parsedTexture.isCube) {
                return LIB.CubeTexture.Parse(parsedTexture, scene, rootUrl);
            }
            if (!parsedTexture.name && !parsedTexture.isRenderTarget) {
                return null;
            }
            var texture = LIB.SerializationHelper.Parse(function () {
                var generateMipMaps = true;
                if (parsedTexture.noMipmap) {
                    generateMipMaps = false;
                }
                if (parsedTexture.mirrorPlane) {
                    var mirrorTexture = new LIB.MirrorTexture(parsedTexture.name, parsedTexture.renderTargetSize, scene, generateMipMaps);
                    mirrorTexture._waitingRenderList = parsedTexture.renderList;
                    mirrorTexture.mirrorPlane = LIB.Plane.FromArray(parsedTexture.mirrorPlane);
                    return mirrorTexture;
                }
                else if (parsedTexture.isRenderTarget) {
                    var renderTargetTexture = new LIB.RenderTargetTexture(parsedTexture.name, parsedTexture.renderTargetSize, scene, generateMipMaps);
                    renderTargetTexture._waitingRenderList = parsedTexture.renderList;
                    return renderTargetTexture;
                }
                else {
                    var texture;
                    if (parsedTexture.base64String) {
                        texture = Texture.CreateFromBase64String(parsedTexture.base64String, parsedTexture.name, scene, !generateMipMaps);
                    }
                    else {
                        texture = new Texture(rootUrl + parsedTexture.name, scene, !generateMipMaps);
                    }
                    return texture;
                }
            }, parsedTexture, scene);
            // Update Sampling Mode
            if (parsedTexture.samplingMode) {
                var sampling = parsedTexture.samplingMode;
                if (texture._samplingMode !== sampling) {
                    texture.updateSamplingMode(sampling);
                }
            }
            // Animations
            if (parsedTexture.animations) {
                for (var animationIndex = 0; animationIndex < parsedTexture.animations.length; animationIndex++) {
                    var parsedAnimation = parsedTexture.animations[animationIndex];
                    texture.animations.push(LIB.Animation.Parse(parsedAnimation));
                }
            }
            return texture;
        };
        Texture.LoadFromDataString = function (name, buffer, scene, deleteBuffer, noMipmap, invertY, samplingMode, onLoad, onError, format) {
            if (deleteBuffer === void 0) { deleteBuffer = false; }
            if (noMipmap === void 0) { noMipmap = false; }
            if (invertY === void 0) { invertY = true; }
            if (samplingMode === void 0) { samplingMode = Texture.TRILINEAR_SAMPLINGMODE; }
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            if (format === void 0) { format = LIB.Engine.TEXTUREFORMAT_RGBA; }
            if (name.substr(0, 5) !== "data:") {
                name = "data:" + name;
            }
            return new Texture(name, scene, noMipmap, invertY, samplingMode, onLoad, onError, buffer, deleteBuffer, format);
        };
        // Constants
        Texture.NEAREST_SAMPLINGMODE = 1;
        Texture.NEAREST_NEAREST_MIPLINEAR = 1; // nearest is mag = nearest and min = nearest and mip = linear
        Texture.BILINEAR_SAMPLINGMODE = 2;
        Texture.LINEAR_LINEAR_MIPNEAREST = 2; // Bilinear is mag = linear and min = linear and mip = nearest
        Texture.TRILINEAR_SAMPLINGMODE = 3;
        Texture.LINEAR_LINEAR_MIPLINEAR = 3; // Trilinear is mag = linear and min = linear and mip = linear
        Texture.NEAREST_NEAREST_MIPNEAREST = 4;
        Texture.NEAREST_LINEAR_MIPNEAREST = 5;
        Texture.NEAREST_LINEAR_MIPLINEAR = 6;
        Texture.NEAREST_LINEAR = 7;
        Texture.NEAREST_NEAREST = 8;
        Texture.LINEAR_NEAREST_MIPNEAREST = 9;
        Texture.LINEAR_NEAREST_MIPLINEAR = 10;
        Texture.LINEAR_LINEAR = 11;
        Texture.LINEAR_NEAREST = 12;
        Texture.EXPLICIT_MODE = 0;
        Texture.SPHERICAL_MODE = 1;
        Texture.PLANAR_MODE = 2;
        Texture.CUBIC_MODE = 3;
        Texture.PROJECTION_MODE = 4;
        Texture.SKYBOX_MODE = 5;
        Texture.INVCUBIC_MODE = 6;
        Texture.EQUIRECTANGULAR_MODE = 7;
        Texture.FIXED_EQUIRECTANGULAR_MODE = 8;
        Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9;
        Texture.CLAMP_ADDRESSMODE = 0;
        Texture.WRAP_ADDRESSMODE = 1;
        Texture.MIRROR_ADDRESSMODE = 2;
        __decorate([
            LIB.serialize()
        ], Texture.prototype, "url", void 0);
        __decorate([
            LIB.serialize()
        ], Texture.prototype, "uOffset", void 0);
        __decorate([
            LIB.serialize()
        ], Texture.prototype, "vOffset", void 0);
        __decorate([
            LIB.serialize()
        ], Texture.prototype, "uScale", void 0);
        __decorate([
            LIB.serialize()
        ], Texture.prototype, "vScale", void 0);
        __decorate([
            LIB.serialize()
        ], Texture.prototype, "uAng", void 0);
        __decorate([
            LIB.serialize()
        ], Texture.prototype, "vAng", void 0);
        __decorate([
            LIB.serialize()
        ], Texture.prototype, "wAng", void 0);
        __decorate([
            LIB.serialize()
        ], Texture.prototype, "isBlocking", null);
        return Texture;
    }(LIB.BaseTexture));
    LIB.Texture = Texture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.texture.js.map
