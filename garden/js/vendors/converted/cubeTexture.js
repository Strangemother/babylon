(function (LIB) {
    var CubeTexture = /** @class */ (function (_super) {
        __extends(CubeTexture, _super);
        function CubeTexture(rootUrl, scene, extensions, noMipmap, files, onLoad, onError, format, prefiltered, forcedExtension) {
            if (extensions === void 0) { extensions = null; }
            if (noMipmap === void 0) { noMipmap = false; }
            if (files === void 0) { files = null; }
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            if (format === void 0) { format = LIB.Engine.TEXTUREFORMAT_RGBA; }
            if (prefiltered === void 0) { prefiltered = false; }
            if (forcedExtension === void 0) { forcedExtension = null; }
            var _this = _super.call(this, scene) || this;
            _this.coordinatesMode = LIB.Texture.CUBIC_MODE;
            _this.name = rootUrl;
            _this.url = rootUrl;
            _this._noMipmap = noMipmap;
            _this.hasAlpha = false;
            _this._format = format;
            _this._prefiltered = prefiltered;
            _this.isCube = true;
            _this._textureMatrix = LIB.Matrix.Identity();
            if (prefiltered) {
                _this.gammaSpace = false;
            }
            if (!rootUrl && !files) {
                return _this;
            }
            _this._texture = _this._getFromCache(rootUrl, noMipmap);
            var lastDot = rootUrl.lastIndexOf(".");
            var extension = forcedExtension ? forcedExtension : (lastDot > -1 ? rootUrl.substring(lastDot).toLowerCase() : "");
            var isDDS = (extension === ".dds");
            if (!files) {
                if (!isDDS && !extensions) {
                    extensions = ["_px.jpg", "_py.jpg", "_pz.jpg", "_nx.jpg", "_ny.jpg", "_nz.jpg"];
                }
                files = [];
                if (extensions) {
                    for (var index = 0; index < extensions.length; index++) {
                        files.push(rootUrl + extensions[index]);
                    }
                }
            }
            _this._files = files;
            if (!_this._texture) {
                if (!scene.useDelayedTextureLoading) {
                    if (prefiltered) {
                        _this._texture = scene.getEngine().createPrefilteredCubeTexture(rootUrl, scene, _this.lodGenerationScale, _this.lodGenerationOffset, onLoad, onError, format, forcedExtension);
                    }
                    else {
                        _this._texture = scene.getEngine().createCubeTexture(rootUrl, scene, files, noMipmap, onLoad, onError, _this._format, forcedExtension);
                    }
                }
                else {
                    _this.delayLoadState = LIB.Engine.DELAYLOADSTATE_NOTLOADED;
                }
            }
            else if (onLoad) {
                if (_this._texture.isReady) {
                    LIB.Tools.SetImmediate(function () { return onLoad(); });
                }
                else {
                    _this._texture.onLoadedObservable.add(onLoad);
                }
            }
            return _this;
        }
        CubeTexture.CreateFromImages = function (files, scene, noMipmap) {
            return new CubeTexture("", scene, null, noMipmap, files);
        };
        CubeTexture.CreateFromPrefilteredData = function (url, scene, forcedExtension) {
            if (forcedExtension === void 0) { forcedExtension = null; }
            return new CubeTexture(url, scene, null, false, null, null, null, undefined, true, forcedExtension);
        };
        // Methods
        CubeTexture.prototype.delayLoad = function () {
            if (this.delayLoadState !== LIB.Engine.DELAYLOADSTATE_NOTLOADED) {
                return;
            }
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            this.delayLoadState = LIB.Engine.DELAYLOADSTATE_LOADED;
            this._texture = this._getFromCache(this.url, this._noMipmap);
            if (!this._texture) {
                if (this._prefiltered) {
                    this._texture = scene.getEngine().createPrefilteredCubeTexture(this.url, scene, this.lodGenerationScale, this.lodGenerationOffset, undefined, undefined, this._format);
                }
                else {
                    this._texture = scene.getEngine().createCubeTexture(this.url, scene, this._files, this._noMipmap, undefined, undefined, this._format);
                }
            }
        };
        CubeTexture.prototype.getReflectionTextureMatrix = function () {
            return this._textureMatrix;
        };
        CubeTexture.prototype.setReflectionTextureMatrix = function (value) {
            this._textureMatrix = value;
        };
        CubeTexture.Parse = function (parsedTexture, scene, rootUrl) {
            var texture = LIB.SerializationHelper.Parse(function () {
                return new CubeTexture(rootUrl + parsedTexture.name, scene, parsedTexture.extensions);
            }, parsedTexture, scene);
            // Animations
            if (parsedTexture.animations) {
                for (var animationIndex = 0; animationIndex < parsedTexture.animations.length; animationIndex++) {
                    var parsedAnimation = parsedTexture.animations[animationIndex];
                    texture.animations.push(LIB.Animation.Parse(parsedAnimation));
                }
            }
            return texture;
        };
        CubeTexture.prototype.clone = function () {
            var _this = this;
            return LIB.SerializationHelper.Clone(function () {
                var scene = _this.getScene();
                if (!scene) {
                    return _this;
                }
                return new CubeTexture(_this.url, scene, _this._extensions, _this._noMipmap, _this._files);
            }, this);
        };
        return CubeTexture;
    }(LIB.BaseTexture));
    LIB.CubeTexture = CubeTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.cubeTexture.js.map
