






var LIB;
(function (LIB) {
    /**
     * The Physically based material of BJS.
     *
     * This offers the main features of a standard PBR material.
     * For more information, please refer to the documentation :
     * http://doc.LIBjs.com/extensions/Physically_Based_Rendering
     */
    var PBRMaterial = /** @class */ (function (_super) {
        __extends(PBRMaterial, _super);
        /**
         * Instantiates a new PBRMaterial instance.
         *
         * @param name The material name
         * @param scene The scene the material will be use in.
         */
        function PBRMaterial(name, scene) {
            var _this = _super.call(this, name, scene) || this;
            /**
             * Intensity of the direct lights e.g. the four lights available in your scene.
             * This impacts both the direct diffuse and specular highlights.
             */
            _this.directIntensity = 1.0;
            /**
             * Intensity of the emissive part of the material.
             * This helps controlling the emissive effect without modifying the emissive color.
             */
            _this.emissiveIntensity = 1.0;
            /**
             * Intensity of the environment e.g. how much the environment will light the object
             * either through harmonics for rough material or through the refelction for shiny ones.
             */
            _this.environmentIntensity = 1.0;
            /**
             * This is a special control allowing the reduction of the specular highlights coming from the
             * four lights of the scene. Those highlights may not be needed in full environment lighting.
             */
            _this.specularIntensity = 1.0;
            /**
             * Debug Control allowing disabling the bump map on this material.
             */
            _this.disableBumpMap = false;
            /**
             * AKA Occlusion Texture Intensity in other nomenclature.
             */
            _this.ambientTextureStrength = 1.0;
            /**
             * The color of a material in ambient lighting.
             */
            _this.ambientColor = new LIB.Color3(0, 0, 0);
            /**
             * AKA Diffuse Color in other nomenclature.
             */
            _this.albedoColor = new LIB.Color3(1, 1, 1);
            /**
             * AKA Specular Color in other nomenclature.
             */
            _this.reflectivityColor = new LIB.Color3(1, 1, 1);
            /**
             * The color reflected from the material.
             */
            _this.reflectionColor = new LIB.Color3(1.0, 1.0, 1.0);
            /**
             * The color emitted from the material.
             */
            _this.emissiveColor = new LIB.Color3(0, 0, 0);
            /**
             * AKA Glossiness in other nomenclature.
             */
            _this.microSurface = 1.0;
            /**
             * source material index of refraction (IOR)' / 'destination material IOR.
             */
            _this.indexOfRefraction = 0.66;
            /**
             * Controls if refraction needs to be inverted on Y. This could be usefull for procedural texture.
             */
            _this.invertRefractionY = false;
            /**
             * This parameters will make the material used its opacity to control how much it is refracting aginst not.
             * Materials half opaque for instance using refraction could benefit from this control.
             */
            _this.linkRefractionWithTransparency = false;
            _this.useLightmapAsShadowmap = false;
            /**
             * Specifies that the alpha is coming form the albedo channel alpha channel for alpha blending.
             */
            _this.useAlphaFromAlbedoTexture = false;
            /**
             * Enforces alpha test in opaque or blend mode in order to improve the performances of some situations.
             */
            _this.forceAlphaTest = false;
            /**
             * Defines the alpha limits in alpha test mode.
             */
            _this.alphaCutOff = 0.4;
            /**
             * Specifies that the material will keeps the specular highlights over a transparent surface (only the most limunous ones).
             * A car glass is a good exemple of that. When sun reflects on it you can not see what is behind.
             */
            _this.useSpecularOverAlpha = true;
            /**
             * Specifies if the reflectivity texture contains the glossiness information in its alpha channel.
             */
            _this.useMicroSurfaceFromReflectivityMapAlpha = false;
            /**
             * Specifies if the metallic texture contains the roughness information in its alpha channel.
             */
            _this.useRoughnessFromMetallicTextureAlpha = true;
            /**
             * Specifies if the metallic texture contains the roughness information in its green channel.
             */
            _this.useRoughnessFromMetallicTextureGreen = false;
            /**
             * Specifies if the metallic texture contains the metallness information in its blue channel.
             */
            _this.useMetallnessFromMetallicTextureBlue = false;
            /**
             * Specifies if the metallic texture contains the ambient occlusion information in its red channel.
             */
            _this.useAmbientOcclusionFromMetallicTextureRed = false;
            /**
             * Specifies if the ambient texture contains the ambient occlusion information in its red channel only.
             */
            _this.useAmbientInGrayScale = false;
            /**
             * In case the reflectivity map does not contain the microsurface information in its alpha channel,
             * The material will try to infer what glossiness each pixel should be.
             */
            _this.useAutoMicroSurfaceFromReflectivityMap = false;
            /**
             * BJS is using an harcoded light falloff based on a manually sets up range.
             * In PBR, one way to represents the fallof is to use the inverse squared root algorythm.
             * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
             */
            _this.usePhysicalLightFalloff = true;
            /**
             * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most limunous ones).
             * A car glass is a good exemple of that. When the street lights reflects on it you can not see what is behind.
             */
            _this.useRadianceOverAlpha = true;
            /**
             * Allows using an object space normal map (instead of tangent space).
             */
            _this.useObjectSpaceNormalMap = false;
            /**
             * Allows using the bump map in parallax mode.
             */
            _this.useParallax = false;
            /**
             * Allows using the bump map in parallax occlusion mode.
             */
            _this.useParallaxOcclusion = false;
            /**
             * Controls the scale bias of the parallax mode.
             */
            _this.parallaxScaleBias = 0.05;
            /**
             * If sets to true, disables all the lights affecting the material.
             */
            _this.disableLighting = false;
            /**
             * Force the shader to compute irradiance in the fragment shader in order to take bump in account.
             */
            _this.forceIrradianceInFragment = false;
            /**
             * Number of Simultaneous lights allowed on the material.
             */
            _this.maxSimultaneousLights = 4;
            /**
             * If sets to true, x component of normal map value will invert (x = 1.0 - x).
             */
            _this.invertNormalMapX = false;
            /**
             * If sets to true, y component of normal map value will invert (y = 1.0 - y).
             */
            _this.invertNormalMapY = false;
            /**
             * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
             */
            _this.twoSidedLighting = false;
            /**
             * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
             * And/Or occlude the blended part. (alpha is converted to gamma to compute the fresnel)
             */
            _this.useAlphaFresnel = false;
            /**
             * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
             * And/Or occlude the blended part. (alpha stays linear to compute the fresnel)
             */
            _this.useLinearAlphaFresnel = false;
            /**
             * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
             * And/Or occlude the blended part.
             */
            _this.environmentBRDFTexture = null;
            /**
             * Force normal to face away from face.
             */
            _this.forceNormalForward = false;
            /**
             * Enables specular anti aliasing in the PBR shader.
             * It will both interacts on the Geometry for analytical and IBL lighting.
             * It also prefilter the roughness map based on the bump values.
             */
            _this.enableSpecularAntiAliasing = false;
            /**
             * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
             * makes the reflect vector face the model (under horizon).
             */
            _this.useHorizonOcclusion = true;
            /**
             * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
             * too much the area relying on ambient texture to define their ambient occlusion.
             */
            _this.useRadianceOcclusion = true;
            /**
             * If set to true, no lighting calculations will be applied.
             */
            _this.unlit = false;
            _this._environmentBRDFTexture = LIB.TextureTools.GetEnvironmentBRDFTexture(scene);
            return _this;
        }
        Object.defineProperty(PBRMaterial, "PBRMATERIAL_OPAQUE", {
            /**
             * PBRMaterialTransparencyMode: No transparency mode, Alpha channel is not use.
             */
            get: function () {
                return this._PBRMATERIAL_OPAQUE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRMaterial, "PBRMATERIAL_ALPHATEST", {
            /**
             * PBRMaterialTransparencyMode: Alpha Test mode, pixel are discarded below a certain threshold defined by the alpha cutoff value.
             */
            get: function () {
                return this._PBRMATERIAL_ALPHATEST;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRMaterial, "PBRMATERIAL_ALPHABLEND", {
            /**
             * PBRMaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
             */
            get: function () {
                return this._PBRMATERIAL_ALPHABLEND;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRMaterial, "PBRMATERIAL_ALPHATESTANDBLEND", {
            /**
             * PBRMaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
             * They are also discarded below the alpha cutoff threshold to improve performances.
             */
            get: function () {
                return this._PBRMATERIAL_ALPHATESTANDBLEND;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRMaterial.prototype, "imageProcessingConfiguration", {
            /**
             * Gets the image processing configuration used either in this material.
             */
            get: function () {
                return this._imageProcessingConfiguration;
            },
            /**
             * Sets the Default image processing configuration used either in the this material.
             *
             * If sets to null, the scene one is in use.
             */
            set: function (value) {
                this._attachImageProcessingConfiguration(value);
                // Ensure the effect will be rebuilt.
                this._markAllSubMeshesAsTexturesDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRMaterial.prototype, "cameraColorCurvesEnabled", {
            /**
             * Gets wether the color curves effect is enabled.
             */
            get: function () {
                return this.imageProcessingConfiguration.colorCurvesEnabled;
            },
            /**
             * Sets wether the color curves effect is enabled.
             */
            set: function (value) {
                this.imageProcessingConfiguration.colorCurvesEnabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRMaterial.prototype, "cameraColorGradingEnabled", {
            /**
             * Gets wether the color grading effect is enabled.
             */
            get: function () {
                return this.imageProcessingConfiguration.colorGradingEnabled;
            },
            /**
             * Gets wether the color grading effect is enabled.
             */
            set: function (value) {
                this.imageProcessingConfiguration.colorGradingEnabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRMaterial.prototype, "cameraToneMappingEnabled", {
            /**
             * Gets wether tonemapping is enabled or not.
             */
            get: function () {
                return this._imageProcessingConfiguration.toneMappingEnabled;
            },
            /**
             * Sets wether tonemapping is enabled or not
             */
            set: function (value) {
                this._imageProcessingConfiguration.toneMappingEnabled = value;
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(PBRMaterial.prototype, "cameraExposure", {
            /**
             * The camera exposure used on this material.
             * This property is here and not in the camera to allow controlling exposure without full screen post process.
             * This corresponds to a photographic exposure.
             */
            get: function () {
                return this._imageProcessingConfiguration.exposure;
            },
            /**
             * The camera exposure used on this material.
             * This property is here and not in the camera to allow controlling exposure without full screen post process.
             * This corresponds to a photographic exposure.
             */
            set: function (value) {
                this._imageProcessingConfiguration.exposure = value;
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(PBRMaterial.prototype, "cameraContrast", {
            /**
             * Gets The camera contrast used on this material.
             */
            get: function () {
                return this._imageProcessingConfiguration.contrast;
            },
            /**
             * Sets The camera contrast used on this material.
             */
            set: function (value) {
                this._imageProcessingConfiguration.contrast = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRMaterial.prototype, "cameraColorGradingTexture", {
            /**
             * Gets the Color Grading 2D Lookup Texture.
             */
            get: function () {
                return this._imageProcessingConfiguration.colorGradingTexture;
            },
            /**
             * Sets the Color Grading 2D Lookup Texture.
             */
            set: function (value) {
                this._imageProcessingConfiguration.colorGradingTexture = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRMaterial.prototype, "cameraColorCurves", {
            /**
             * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
             * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
             * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
             * corresponding to low luminance, medium luminance, and high luminance areas respectively.
             */
            get: function () {
                return this._imageProcessingConfiguration.colorCurves;
            },
            /**
             * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
             * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
             * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
             * corresponding to low luminance, medium luminance, and high luminance areas respectively.
             */
            set: function (value) {
                this._imageProcessingConfiguration.colorCurves = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the name of this material class.
         */
        PBRMaterial.prototype.getClassName = function () {
            return "PBRMaterial";
        };
        /**
         * Returns an array of the actively used textures.
         * @returns - Array of BaseTextures
         */
        PBRMaterial.prototype.getActiveTextures = function () {
            var activeTextures = _super.prototype.getActiveTextures.call(this);
            if (this._albedoTexture) {
                activeTextures.push(this._albedoTexture);
            }
            if (this._ambientTexture) {
                activeTextures.push(this._ambientTexture);
            }
            if (this._opacityTexture) {
                activeTextures.push(this._opacityTexture);
            }
            if (this._reflectionTexture) {
                activeTextures.push(this._reflectionTexture);
            }
            if (this._emissiveTexture) {
                activeTextures.push(this._emissiveTexture);
            }
            if (this._reflectivityTexture) {
                activeTextures.push(this._reflectivityTexture);
            }
            if (this._metallicTexture) {
                activeTextures.push(this._metallicTexture);
            }
            if (this._microSurfaceTexture) {
                activeTextures.push(this._microSurfaceTexture);
            }
            if (this._bumpTexture) {
                activeTextures.push(this._bumpTexture);
            }
            if (this._lightmapTexture) {
                activeTextures.push(this._lightmapTexture);
            }
            if (this._refractionTexture) {
                activeTextures.push(this._refractionTexture);
            }
            return activeTextures;
        };
        /**
         * Checks to see if a texture is used in the material.
         * @param texture - Base texture to use.
         * @returns - Boolean specifying if a texture is used in the material.
         */
        PBRMaterial.prototype.hasTexture = function (texture) {
            if (_super.prototype.hasTexture.call(this, texture)) {
                return true;
            }
            if (this._albedoTexture === texture) {
                return true;
            }
            if (this._ambientTexture === texture) {
                return true;
            }
            if (this._opacityTexture === texture) {
                return true;
            }
            if (this._reflectionTexture === texture) {
                return true;
            }
            if (this._reflectivityTexture === texture) {
                return true;
            }
            if (this._metallicTexture === texture) {
                return true;
            }
            if (this._microSurfaceTexture === texture) {
                return true;
            }
            if (this._bumpTexture === texture) {
                return true;
            }
            if (this._lightmapTexture === texture) {
                return true;
            }
            if (this._refractionTexture === texture) {
                return true;
            }
            return false;
        };
        /**
         * Makes a duplicate of the current material.
         * @param name - name to use for the new material.
         */
        PBRMaterial.prototype.clone = function (name) {
            var _this = this;
            var clone = LIB.SerializationHelper.Clone(function () { return new PBRMaterial(name, _this.getScene()); }, this);
            clone.id = name;
            clone.name = name;
            return clone;
        };
        /**
         * Serializes this PBR Material.
         * @returns - An object with the serialized material.
         */
        PBRMaterial.prototype.serialize = function () {
            var serializationObject = LIB.SerializationHelper.Serialize(this);
            serializationObject.customType = "LIB.PBRMaterial";
            return serializationObject;
        };
        // Statics
        /**
         * Parses a PBR Material from a serialized object.
         * @param source - Serialized object.
         * @param scene - BJS scene instance.
         * @param rootUrl - url for the scene object
         * @returns - PBRMaterial
         */
        PBRMaterial.Parse = function (source, scene, rootUrl) {
            return LIB.SerializationHelper.Parse(function () { return new PBRMaterial(source.name, scene); }, source, scene, rootUrl);
        };
        PBRMaterial._PBRMATERIAL_OPAQUE = 0;
        /**
         * Alpha Test mode, pixel are discarded below a certain threshold defined by the alpha cutoff value.
         */
        PBRMaterial._PBRMATERIAL_ALPHATEST = 1;
        /**
         * Represents the value for Alpha Blend.  Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
         */
        PBRMaterial._PBRMATERIAL_ALPHABLEND = 2;
        /**
         * Represents the value for Alpha Test and Blend.  Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
         * They are also discarded below the alpha cutoff threshold to improve performances.
         */
        PBRMaterial._PBRMATERIAL_ALPHATESTANDBLEND = 3;
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "directIntensity", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "emissiveIntensity", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "environmentIntensity", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "specularIntensity", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "disableBumpMap", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "albedoTexture", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "ambientTexture", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "ambientTextureStrength", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
        ], PBRMaterial.prototype, "opacityTexture", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "reflectionTexture", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "emissiveTexture", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "reflectivityTexture", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "metallicTexture", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "metallic", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "roughness", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "microSurfaceTexture", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "bumpTexture", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty", null)
        ], PBRMaterial.prototype, "lightmapTexture", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "refractionTexture", void 0);
        __decorate([
            LIB.serializeAsColor3("ambient"),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "ambientColor", void 0);
        __decorate([
            LIB.serializeAsColor3("albedo"),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "albedoColor", void 0);
        __decorate([
            LIB.serializeAsColor3("reflectivity"),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "reflectivityColor", void 0);
        __decorate([
            LIB.serializeAsColor3("reflection"),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "reflectionColor", void 0);
        __decorate([
            LIB.serializeAsColor3("emissive"),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "emissiveColor", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "microSurface", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "indexOfRefraction", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "invertRefractionY", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "linkRefractionWithTransparency", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useLightmapAsShadowmap", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
        ], PBRMaterial.prototype, "useAlphaFromAlbedoTexture", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
        ], PBRMaterial.prototype, "forceAlphaTest", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
        ], PBRMaterial.prototype, "alphaCutOff", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useSpecularOverAlpha", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useMicroSurfaceFromReflectivityMapAlpha", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useRoughnessFromMetallicTextureAlpha", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useRoughnessFromMetallicTextureGreen", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useMetallnessFromMetallicTextureBlue", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useAmbientOcclusionFromMetallicTextureRed", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useAmbientInGrayScale", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useAutoMicroSurfaceFromReflectivityMap", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "usePhysicalLightFalloff", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useRadianceOverAlpha", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useObjectSpaceNormalMap", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useParallax", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useParallaxOcclusion", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "parallaxScaleBias", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], PBRMaterial.prototype, "disableLighting", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "forceIrradianceInFragment", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], PBRMaterial.prototype, "maxSimultaneousLights", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "invertNormalMapX", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "invertNormalMapY", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "twoSidedLighting", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useAlphaFresnel", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useLinearAlphaFresnel", void 0);
        __decorate([
            LIB.serializeAsTexture(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "environmentBRDFTexture", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "forceNormalForward", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "enableSpecularAntiAliasing", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useHorizonOcclusion", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], PBRMaterial.prototype, "useRadianceOcclusion", void 0);
        __decorate([
            LIB.serialize(),
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], PBRMaterial.prototype, "unlit", void 0);
        return PBRMaterial;
    }(LIB.PBRBaseMaterial));
    LIB.PBRMaterial = PBRMaterial;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.pbrMaterial.js.map
//# sourceMappingURL=LIB.pbrMaterial.js.map