var BABYLON;
(function (BABYLON) {
    /**
     * The PBR material of BJS following the specular glossiness convention.
     *
     * This fits to the PBR convention in the GLTF definition:
     * https://github.com/KhronosGroup/glTF/tree/2.0/extensions/Khronos/KHR_materials_pbrSpecularGlossiness
     */
    var PBRSpecularGlossinessMaterial = /** @class */ (function (_super) {
        __extends(PBRSpecularGlossinessMaterial, _super);
        /**
         * Instantiates a new PBRSpecularGlossinessMaterial instance.
         *
         * @param name The material name
         * @param scene The scene the material will be use in.
         */
        function PBRSpecularGlossinessMaterial(name, scene) {
            var _this = _super.call(this, name, scene) || this;
            _this._useMicroSurfaceFromReflectivityMapAlpha = true;
            return _this;
        }
        /**
         * Return the currrent class name of the material.
         */
        PBRSpecularGlossinessMaterial.prototype.getClassName = function () {
            return "PBRSpecularGlossinessMaterial";
        };
        /**
         * Return the active textures of the material.
         */
        PBRSpecularGlossinessMaterial.prototype.getActiveTextures = function () {
            var activeTextures = _super.prototype.getActiveTextures.call(this);
            if (this.diffuseTexture) {
                activeTextures.push(this.diffuseTexture);
            }
            if (this.specularGlossinessTexture) {
                activeTextures.push(this.specularGlossinessTexture);
            }
            return activeTextures;
        };
        PBRSpecularGlossinessMaterial.prototype.hasTexture = function (texture) {
            if (_super.prototype.hasTexture.call(this, texture)) {
                return true;
            }
            if (this.diffuseTexture === texture) {
                return true;
            }
            if (this.specularGlossinessTexture === texture) {
                return true;
            }
            return false;
        };
        PBRSpecularGlossinessMaterial.prototype.clone = function (name) {
            var _this = this;
            var clone = BABYLON.SerializationHelper.Clone(function () { return new PBRSpecularGlossinessMaterial(name, _this.getScene()); }, this);
            clone.id = name;
            clone.name = name;
            return clone;
        };
        /**
         * Serialize the material to a parsable JSON object.
         */
        PBRSpecularGlossinessMaterial.prototype.serialize = function () {
            var serializationObject = BABYLON.SerializationHelper.Serialize(this);
            serializationObject.customType = "BABYLON.PBRSpecularGlossinessMaterial";
            return serializationObject;
        };
        /**
         * Parses a JSON object correponding to the serialize function.
         */
        PBRSpecularGlossinessMaterial.Parse = function (source, scene, rootUrl) {
            return BABYLON.SerializationHelper.Parse(function () { return new PBRSpecularGlossinessMaterial(source.name, scene); }, source, scene, rootUrl);
        };
        __decorate([
            BABYLON.serializeAsColor3("diffuse"),
            BABYLON.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoColor")
        ], PBRSpecularGlossinessMaterial.prototype, "diffuseColor", void 0);
        __decorate([
            BABYLON.serializeAsTexture(),
            BABYLON.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoTexture")
        ], PBRSpecularGlossinessMaterial.prototype, "diffuseTexture", void 0);
        __decorate([
            BABYLON.serializeAsColor3("specular"),
            BABYLON.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_reflectivityColor")
        ], PBRSpecularGlossinessMaterial.prototype, "specularColor", void 0);
        __decorate([
            BABYLON.serialize(),
            BABYLON.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_microSurface")
        ], PBRSpecularGlossinessMaterial.prototype, "glossiness", void 0);
        __decorate([
            BABYLON.serializeAsTexture(),
            BABYLON.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_reflectivityTexture")
        ], PBRSpecularGlossinessMaterial.prototype, "specularGlossinessTexture", void 0);
        return PBRSpecularGlossinessMaterial;
    }(BABYLON.Internals.PBRBaseSimpleMaterial));
    BABYLON.PBRSpecularGlossinessMaterial = PBRSpecularGlossinessMaterial;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.pbrSpecularGlossinessMaterial.js.map
