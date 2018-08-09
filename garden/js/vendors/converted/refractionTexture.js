(function (LIB) {
    /**
    * Creates a refraction texture used by refraction channel of the standard material.
    * @param name the texture name
    * @param size size of the underlying texture
    * @param scene root scene
    */
    var RefractionTexture = /** @class */ (function (_super) {
        __extends(RefractionTexture, _super);
        function RefractionTexture(name, size, scene, generateMipMaps) {
            var _this = _super.call(this, name, size, scene, generateMipMaps, true) || this;
            _this.refractionPlane = new LIB.Plane(0, 1, 0, 1);
            _this.depth = 2.0;
            _this.onBeforeRenderObservable.add(function () {
                scene.clipPlane = _this.refractionPlane;
            });
            _this.onAfterRenderObservable.add(function () {
                delete scene.clipPlane;
            });
            return _this;
        }
        RefractionTexture.prototype.clone = function () {
            var scene = this.getScene();
            if (!scene) {
                return this;
            }
            var textureSize = this.getSize();
            var newTexture = new RefractionTexture(this.name, textureSize.width, scene, this._generateMipMaps);
            // Base texture
            newTexture.hasAlpha = this.hasAlpha;
            newTexture.level = this.level;
            // Refraction Texture
            newTexture.refractionPlane = this.refractionPlane.clone();
            if (this.renderList) {
                newTexture.renderList = this.renderList.slice(0);
            }
            newTexture.depth = this.depth;
            return newTexture;
        };
        RefractionTexture.prototype.serialize = function () {
            if (!this.name) {
                return null;
            }
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.mirrorPlane = this.refractionPlane.asArray();
            serializationObject.depth = this.depth;
            return serializationObject;
        };
        return RefractionTexture;
    }(LIB.RenderTargetTexture));
    LIB.RefractionTexture = RefractionTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.refractionTexture.js.map
