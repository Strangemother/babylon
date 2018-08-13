






var LIB;
(function (LIB) {
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
            _this.metallic = 1.0;
            _this.roughness = 1.0;
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
        /**
         * Checks to see if a texture is used in the material.
         * @param texture - Base texture to use.
         * @returns - Boolean specifying if a texture is used in the material.
         */
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
        /**
         * Makes a duplicate of the current material.
         * @param name - name to use for the new material.
         */
        PBRMetallicRoughnessMaterial.prototype.clone = function (name) {
            var _this = this;
            var clone = LIB.SerializationHelper.Clone(function () { return new PBRMetallicRoughnessMaterial(name, _this.getScene()); }, this);
            clone.id = name;
            clone.name = name;
            return clone;
        };
        /**
         * Serialize the material to a parsable JSON object.
         */
        PBRMetallicRoughnessMaterial.prototype.serialize = function () {
            var serializationObject = LIB.SerializationHelper.Serialize(this);
            serializationObject.customType = "LIB.PBRMetallicRoughnessMaterial";
            return serializationObject;
        };
        /**
         * Parses a JSON object correponding to the serialize function.
         */
        PBRMetallicRoughnessMaterial.Parse = function (source, scene, rootUrl) {
            return LIB.SerializationHelper.Parse(function () { return new PBRMetallicRoughnessMaterial(source.name, scene); }, source, scene, rootUrl);
        };
        __decorate([
            LIB.serializeAsColor3(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoColor")
        ], PBRMetallicRoughnessMaterial.prototype, "baseColor", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoTexture")
        ], PBRMetallicRoughnessMaterial.prototype, "baseTexture", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMetallicRoughnessMaterial.prototype, "metallic", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMetallicRoughnessMaterial.prototype, "roughness", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_metallicTexture")
        ], PBRMetallicRoughnessMaterial.prototype, "metallicRoughnessTexture", void 0);
        return PBRMetallicRoughnessMaterial;
    }(LIB.PBRBaseSimpleMaterial));
    LIB.PBRMetallicRoughnessMaterial = PBRMetallicRoughnessMaterial;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.pbrMetallicRoughnessMaterial.js.map
//# sourceMappingURL=LIB.pbrMetallicRoughnessMaterial.js.map
