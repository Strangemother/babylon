






var LIB;
(function (LIB) {
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
        /**
         * Checks to see if a texture is used in the material.
         * @param texture - Base texture to use.
         * @returns - Boolean specifying if a texture is used in the material.
         */
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
        /**
         * Makes a duplicate of the current material.
         * @param name - name to use for the new material.
         */
        PBRSpecularGlossinessMaterial.prototype.clone = function (name) {
            var _this = this;
            var clone = LIB.SerializationHelper.Clone(function () { return new PBRSpecularGlossinessMaterial(name, _this.getScene()); }, this);
            clone.id = name;
            clone.name = name;
            return clone;
        };
        /**
         * Serialize the material to a parsable JSON object.
         */
        PBRSpecularGlossinessMaterial.prototype.serialize = function () {
            var serializationObject = LIB.SerializationHelper.Serialize(this);
            serializationObject.customType = "LIB.PBRSpecularGlossinessMaterial";
            return serializationObject;
        };
        /**
         * Parses a JSON object correponding to the serialize function.
         */
        PBRSpecularGlossinessMaterial.Parse = function (source, scene, rootUrl) {
            return LIB.SerializationHelper.Parse(function () { return new PBRSpecularGlossinessMaterial(source.name, scene); }, source, scene, rootUrl);
        };
        __decorate([
            LIB.serializeAsColor3("diffuse"),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoColor")
        ], PBRSpecularGlossinessMaterial.prototype, "diffuseColor", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoTexture")
        ], PBRSpecularGlossinessMaterial.prototype, "diffuseTexture", void 0);
        __decorate([
            LIB.serializeAsColor3("specular"),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_reflectivityColor")
        ], PBRSpecularGlossinessMaterial.prototype, "specularColor", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_microSurface")
        ], PBRSpecularGlossinessMaterial.prototype, "glossiness", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_reflectivityTexture")
        ], PBRSpecularGlossinessMaterial.prototype, "specularGlossinessTexture", void 0);
        return PBRSpecularGlossinessMaterial;
    }(LIB.PBRBaseSimpleMaterial));
    LIB.PBRSpecularGlossinessMaterial = PBRSpecularGlossinessMaterial;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.pbrSpecularGlossinessMaterial.js.map
//# sourceMappingURL=LIB.pbrSpecularGlossinessMaterial.js.map
