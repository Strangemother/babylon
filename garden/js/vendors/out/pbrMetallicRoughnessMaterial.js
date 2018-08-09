var BABYLON;
(function (BABYLON) {
    /**
     * The PBR material of BJS following the metal roughness convention.
     *
     * This fits to the PBR convention in the GLTF definition:
     * https://github.com/KhronosGroup/glTF/tree/2.0/specification/2.0
     */
    var PBRMetallicRoughnessMaterial = /** @class */ (function (_super) {
        __extends(PBRMetallicRoughnessMaterial, _super);
        /**
         * Instantiates a new PBRMetalRoughnessMaterial instance.
         *
         * @param name The material name
         * @param scene The scene the material will be use in.
         */
        function PBRMetallicRoughnessMaterial(name, scene) {
            var _this = _super.call(this, name, scene) || this;
            _this._useRoughnessFromMetallicTextureAlpha = false;
            _this._useRoughnessFromMetallicTextureGreen = true;
            _this._useMetallnessFromMetallicTextureBlue = true;
            return _this;
        }
        /**
         * Return the currrent class name of the material.
         */
        PBRMetallicRoughnessMaterial.prototype.getClassName = function () {
            return "PBRMetallicRoughnessMaterial";
        };
        /**
         * Return the active textures of the material.
         */
        PBRMetallicRoughnessMaterial.prototype.getActiveTextures = function () {
            var activeTextures = _super.prototype.getActiveTextures.call(this);
            if (this.baseTexture) {
                activeTextures.push(this.baseTexture);
            }
            if (this.metallicRoughnessTexture) {
                activeTextures.push(this.metallicRoughnessTexture);
            }
            return activeTextures;
        };
        PBRMetallicRoughnessMaterial.prototype.hasTexture = function (texture) {
            if (_super.prototype.hasTexture.call(this, texture)) {
                return true;
            }
            if (this.baseTexture === texture) {
                return true;
            }
            if (this.metallicRoughnessTexture === texture) {
                return true;
            }
            return false;
        };
        PBRMetallicRoughnessMaterial.prototype.clone = function (name) {
            var _this = this;
            var clone = BABYLON.SerializationHelper.Clone(function () { return new PBRMetallicRoughnessMaterial(name, _this.getScene()); }, this);
            clone.id = name;
            clone.name = name;
            return clone;
        };
        /**
         * Serialize the material to a parsable JSON object.
         */
        PBRMetallicRoughnessMaterial.prototype.serialize = function () {
            var serializationObject = BABYLON.SerializationHelper.Serialize(this);
            serializationObject.customType = "BABYLON.PBRMetallicRoughnessMaterial";
            return serializationObject;
        };
        /**
         * Parses a JSON object correponding to the serialize function.
         */
        PBRMetallicRoughnessMaterial.Parse = function (source, scene, rootUrl) {
            return BABYLON.SerializationHelper.Parse(function () { return new PBRMetallicRoughnessMaterial(source.name, scene); }, source, scene, rootUrl);
        };
        __decorate([
            BABYLON.serializeAsColor3(),
            BABYLON.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoColor")
        ], PBRMetallicRoughnessMaterial.prototype, "baseColor", void 0);
        __decorate([
            BABYLON.serializeAsTexture(),
            BABYLON.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoTexture")
        ], PBRMetallicRoughnessMaterial.prototype, "baseTexture", void 0);
        __decorate([
            BABYLON.serialize(),
            BABYLON.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMetallicRoughnessMaterial.prototype, "metallic", void 0);
        __decorate([
            BABYLON.serialize(),
            BABYLON.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMetallicRoughnessMaterial.prototype, "roughness", void 0);
        __decorate([
            BABYLON.serializeAsTexture(),
            BABYLON.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_metallicTexture")
        ], PBRMetallicRoughnessMaterial.prototype, "metallicRoughnessTexture", void 0);
        return PBRMetallicRoughnessMaterial;
    }(BABYLON.Internals.PBRBaseSimpleMaterial));
    BABYLON.PBRMetallicRoughnessMaterial = PBRMetallicRoughnessMaterial;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.pbrMetallicRoughnessMaterial.js.map
