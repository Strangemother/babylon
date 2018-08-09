var BABYLON;
(function (BABYLON) {
    var CustomProceduralTexture = /** @class */ (function (_super) {
        __extends(CustomProceduralTexture, _super);
        function CustomProceduralTexture(name, texturePath, size, scene, fallbackTexture, generateMipMaps) {
            var _this = _super.call(this, name, size, null, scene, fallbackTexture, generateMipMaps) || this;
            _this._animate = true;
            _this._time = 0;
            _this._texturePath = texturePath;
            //Try to load json
            _this.loadJson(texturePath);
            _this.refreshRate = 1;
            return _this;
        }
        CustomProceduralTexture.prototype.loadJson = function (jsonUrl) {
            var _this = this;
            var noConfigFile = function () {
                BABYLON.Tools.Log("No config file found in " + jsonUrl + " trying to use ShadersStore or DOM element");
                try {
                    _this.setFragment(_this._texturePath);
                }
                catch (ex) {
                    BABYLON.Tools.Error("No json or ShaderStore or DOM element found for CustomProceduralTexture");
                }
            };
            var configFileUrl = jsonUrl + "/config.json";
            var xhr = new XMLHttpRequest();
            xhr.open("GET", configFileUrl, true);
            xhr.addEventListener("load", function () {
                if (xhr.status === 200 || BABYLON.Tools.ValidateXHRData(xhr, 1)) {
                    try {
                        _this._config = JSON.parse(xhr.response);
                        _this.updateShaderUniforms();
                        _this.updateTextures();
                        _this.setFragment(_this._texturePath + "/custom");
                        _this._animate = _this._config.animate;
                        _this.refreshRate = _this._config.refreshrate;
                    }
                    catch (ex) {
                        noConfigFile();
                    }
                }
                else {
                    noConfigFile();
                }
            }, false);
            xhr.addEventListener("error", function () {
                noConfigFile();
            }, false);
            try {
                xhr.send();
            }
            catch (ex) {
                BABYLON.Tools.Error("CustomProceduralTexture: Error on XHR send request.");
            }
        };
        CustomProceduralTexture.prototype.isReady = function () {
            if (!_super.prototype.isReady.call(this)) {
                return false;
            }
            for (var name in this._textures) {
                var texture = this._textures[name];
                if (!texture.isReady()) {
                    return false;
                }
            }
            return true;
        };
        CustomProceduralTexture.prototype.render = function (useCameraPostProcess) {
            var scene = this.getScene();
            if (this._animate && scene) {
                this._time += scene.getAnimationRatio() * 0.03;
                this.updateShaderUniforms();
            }
            _super.prototype.render.call(this, useCameraPostProcess);
        };
        CustomProceduralTexture.prototype.updateTextures = function () {
            for (var i = 0; i < this._config.sampler2Ds.length; i++) {
                this.setTexture(this._config.sampler2Ds[i].sample2Dname, new BABYLON.Texture(this._texturePath + "/" + this._config.sampler2Ds[i].textureRelativeUrl, this.getScene()));
            }
        };
        CustomProceduralTexture.prototype.updateShaderUniforms = function () {
            if (this._config) {
                for (var j = 0; j < this._config.uniforms.length; j++) {
                    var uniform = this._config.uniforms[j];
                    switch (uniform.type) {
                        case "float":
                            this.setFloat(uniform.name, uniform.value);
                            break;
                        case "color3":
                            this.setColor3(uniform.name, new BABYLON.Color3(uniform.r, uniform.g, uniform.b));
                            break;
                        case "color4":
                            this.setColor4(uniform.name, new BABYLON.Color4(uniform.r, uniform.g, uniform.b, uniform.a));
                            break;
                        case "vector2":
                            this.setVector2(uniform.name, new BABYLON.Vector2(uniform.x, uniform.y));
                            break;
                        case "vector3":
                            this.setVector3(uniform.name, new BABYLON.Vector3(uniform.x, uniform.y, uniform.z));
                            break;
                    }
                }
            }
            this.setFloat("time", this._time);
        };
        Object.defineProperty(CustomProceduralTexture.prototype, "animate", {
            get: function () {
                return this._animate;
            },
            set: function (value) {
                this._animate = value;
            },
            enumerable: true,
            configurable: true
        });
        return CustomProceduralTexture;
    }(BABYLON.ProceduralTexture));
    BABYLON.CustomProceduralTexture = CustomProceduralTexture;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.customProceduralTexture.js.map
