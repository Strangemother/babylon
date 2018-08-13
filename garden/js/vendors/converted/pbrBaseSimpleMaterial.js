






var LIB;
(function (LIB) {
    /**
     * The Physically based simple base material of BJS.
     *
     * This enables better naming and convention enforcements on top of the pbrMaterial.
     * It is used as the base class for both the specGloss and metalRough conventions.
     */
    var PBRBaseSimpleMaterial = /** @class */ (function (_super) {
        __extends(PBRBaseSimpleMaterial, _super);
        /**
         * Instantiates a new PBRMaterial instance.
         *
         * @param name The material name
         * @param scene The scene the material will be use in.
         */
        function PBRBaseSimpleMaterial(name, scene) {
            var _this = _super.call(this, name, scene) || this;
            /**
             * Number of Simultaneous lights allowed on the material.
             */
            _this.maxSimultaneousLights = 4;
            /**
             * If sets to true, disables all the lights affecting the material.
             */
            _this.disableLighting = false;
            /**
             * If sets to true, x component of normal map value will invert (x = 1.0 - x).
             */
            _this.invertNormalMapX = false;
            /**
             * If sets to true, y component of normal map value will invert (y = 1.0 - y).
             */
            _this.invertNormalMapY = false;
            /**
             * Emissivie color used to self-illuminate the model.
             */
            _this.emissiveColor = new LIB.Color3(0, 0, 0);
            /**
             * Occlusion Channel Strenght.
             */
            _this.occlusionStrength = 1.0;
            _this.useLightmapAsShadowmap = false;
            _this._useAlphaFromAlbedoTexture = true;
            _this._useAmbientInGrayScale = true;
            return _this;
        }
        Object.defineProperty(PBRBaseSimpleMaterial.prototype, "doubleSided", {
            /**
             * Gets the current double sided mode.
             */
            get: function () {
                return this._twoSidedLighting;
            },
            /**
             * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
             */
            set: function (value) {
                if (this._twoSidedLighting === value) {
                    return;
                }
                this._twoSidedLighting = value;
                this.backFaceCulling = !value;
                this._markAllSubMeshesAsTexturesDirty();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Return the active textures of the material.
         */
        PBRBaseSimpleMaterial.prototype.getActiveTextures = function () {
            var activeTextures = _super.prototype.getActiveTextures.call(this);
            if (this.environmentTexture) {
                activeTextures.push(this.environmentTexture);
            }
            if (this.normalTexture) {
                activeTextures.push(this.normalTexture);
            }
            if (this.emissiveTexture) {
                activeTextures.push(this.emissiveTexture);
            }
            if (this.occlusionTexture) {
                activeTextures.push(this.occlusionTexture);
            }
            if (this.lightmapTexture) {
                activeTextures.push(this.lightmapTexture);
            }
            return activeTextures;
        };
        PBRBaseSimpleMaterial.prototype.hasTexture = function (texture) {
            if (_super.prototype.hasTexture.call(this, texture)) {
                return true;
            }
            if (this.lightmapTexture === texture) {
                return true;
            }
            return false;
        };
        PBRBaseSimpleMaterial.prototype.getClassName = function () {
            return "PBRBaseSimpleMaterial";
        };
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], PBRBaseSimpleMaterial.prototype, "maxSimultaneousLights", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], PBRBaseSimpleMaterial.prototype, "disableLighting", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_reflectionTexture")
        ], PBRBaseSimpleMaterial.prototype, "environmentTexture", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRBaseSimpleMaterial.prototype, "invertNormalMapX", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRBaseSimpleMaterial.prototype, "invertNormalMapY", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_bumpTexture")
        ], PBRBaseSimpleMaterial.prototype, "normalTexture", void 0);
        __decorate([
            LIB.serializeAsColor3("emissive"),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRBaseSimpleMaterial.prototype, "emissiveColor", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRBaseSimpleMaterial.prototype, "emissiveTexture", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_ambientTextureStrength")
        ], PBRBaseSimpleMaterial.prototype, "occlusionStrength", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_ambientTexture")
        ], PBRBaseSimpleMaterial.prototype, "occlusionTexture", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", "_alphaCutOff")
        ], PBRBaseSimpleMaterial.prototype, "alphaCutOff", void 0);
        __decorate([
            LIB.serialize()
        ], PBRBaseSimpleMaterial.prototype, "doubleSided", null);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", null)
        ], PBRBaseSimpleMaterial.prototype, "lightmapTexture", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRBaseSimpleMaterial.prototype, "useLightmapAsShadowmap", void 0);
        return PBRBaseSimpleMaterial;
    }(LIB.PBRBaseMaterial));
    LIB.PBRBaseSimpleMaterial = PBRBaseSimpleMaterial;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.pbrBaseSimpleMaterial.js.map
//# sourceMappingURL=LIB.pbrBaseSimpleMaterial.js.map
