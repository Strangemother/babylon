(function (LIB) {
    var PBRMaterialDefines = /** @class */ (function (_super) {
        __extends(PBRMaterialDefines, _super);
        function PBRMaterialDefines() {
            var _this = _super.call(this) || this;
            _this.PBR = true;
            _this.MAINUV1 = false;
            _this.MAINUV2 = false;
            _this.UV1 = false;
            _this.UV2 = false;
            _this.ALBEDO = false;
            _this.ALBEDODIRECTUV = 0;
            _this.VERTEXCOLOR = false;
            _this.AMBIENT = false;
            _this.AMBIENTDIRECTUV = 0;
            _this.AMBIENTINGRAYSCALE = false;
            _this.OPACITY = false;
            _this.VERTEXALPHA = false;
            _this.OPACITYDIRECTUV = 0;
            _this.OPACITYRGB = false;
            _this.ALPHATEST = false;
            _this.DEPTHPREPASS = false;
            _this.ALPHABLEND = false;
            _this.ALPHAFROMALBEDO = false;
            _this.ALPHATESTVALUE = 0.5;
            _this.SPECULAROVERALPHA = false;
            _this.RADIANCEOVERALPHA = false;
            _this.ALPHAFRESNEL = false;
            _this.LINEARALPHAFRESNEL = false;
            _this.PREMULTIPLYALPHA = false;
            _this.EMISSIVE = false;
            _this.EMISSIVEDIRECTUV = 0;
            _this.REFLECTIVITY = false;
            _this.REFLECTIVITYDIRECTUV = 0;
            _this.SPECULARTERM = false;
            _this.MICROSURFACEFROMREFLECTIVITYMAP = false;
            _this.MICROSURFACEAUTOMATIC = false;
            _this.LODBASEDMICROSFURACE = false;
            _this.MICROSURFACEMAP = false;
            _this.MICROSURFACEMAPDIRECTUV = 0;
            _this.METALLICWORKFLOW = false;
            _this.ROUGHNESSSTOREINMETALMAPALPHA = false;
            _this.ROUGHNESSSTOREINMETALMAPGREEN = false;
            _this.METALLNESSSTOREINMETALMAPBLUE = false;
            _this.AOSTOREINMETALMAPRED = false;
            _this.ENVIRONMENTBRDF = false;
            _this.NORMAL = false;
            _this.TANGENT = false;
            _this.BUMP = false;
            _this.BUMPDIRECTUV = 0;
            _this.PARALLAX = false;
            _this.PARALLAXOCCLUSION = false;
            _this.NORMALXYSCALE = true;
            _this.LIGHTMAP = false;
            _this.LIGHTMAPDIRECTUV = 0;
            _this.USELIGHTMAPASSHADOWMAP = false;
            _this.REFLECTION = false;
            _this.REFLECTIONMAP_3D = false;
            _this.REFLECTIONMAP_SPHERICAL = false;
            _this.REFLECTIONMAP_PLANAR = false;
            _this.REFLECTIONMAP_CUBIC = false;
            _this.REFLECTIONMAP_PROJECTION = false;
            _this.REFLECTIONMAP_SKYBOX = false;
            _this.REFLECTIONMAP_EXPLICIT = false;
            _this.REFLECTIONMAP_EQUIRECTANGULAR = false;
            _this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
            _this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
            _this.INVERTCUBICMAP = false;
            _this.USESPHERICALFROMREFLECTIONMAP = false;
            _this.USESPHERICALINVERTEX = false;
            _this.REFLECTIONMAP_OPPOSITEZ = false;
            _this.LODINREFLECTIONALPHA = false;
            _this.GAMMAREFLECTION = false;
            _this.RADIANCEOCCLUSION = false;
            _this.HORIZONOCCLUSION = false;
            _this.REFRACTION = false;
            _this.REFRACTIONMAP_3D = false;
            _this.REFRACTIONMAP_OPPOSITEZ = false;
            _this.LODINREFRACTIONALPHA = false;
            _this.GAMMAREFRACTION = false;
            _this.LINKREFRACTIONTOTRANSPARENCY = false;
            _this.INSTANCES = false;
            _this.NUM_BONE_INFLUENCERS = 0;
            _this.BonesPerMesh = 0;
            _this.NONUNIFORMSCALING = false;
            _this.MORPHTARGETS = false;
            _this.MORPHTARGETS_NORMAL = false;
            _this.MORPHTARGETS_TANGENT = false;
            _this.NUM_MORPH_INFLUENCERS = 0;
            _this.IMAGEPROCESSING = false;
            _this.VIGNETTE = false;
            _this.VIGNETTEBLENDMODEMULTIPLY = false;
            _this.VIGNETTEBLENDMODEOPAQUE = false;
            _this.TONEMAPPING = false;
            _this.CONTRAST = false;
            _this.COLORCURVES = false;
            _this.COLORGRADING = false;
            _this.COLORGRADING3D = false;
            _this.SAMPLER3DGREENDEPTH = false;
            _this.SAMPLER3DBGRMAP = false;
            _this.IMAGEPROCESSINGPOSTPROCESS = false;
            _this.EXPOSURE = false;
            _this.USEPHYSICALLIGHTFALLOFF = false;
            _this.TWOSIDEDLIGHTING = false;
            _this.SHADOWFLOAT = false;
            _this.CLIPPLANE = false;
            _this.POINTSIZE = false;
            _this.FOG = false;
            _this.LOGARITHMICDEPTH = false;
            _this.FORCENORMALFORWARD = false;
            _this.rebuild();
            return _this;
        }
        PBRMaterialDefines.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this.ALPHATESTVALUE = 0.5;
            this.PBR = true;
        };
        return PBRMaterialDefines;
    }(LIB.MaterialDefines));
    /**
     * The Physically based material base class of BJS.
     *
     * This offers the main features of a standard PBR material.
     * For more information, please refer to the documentation :
     * http://doc.LIBjs.com/extensions/Physically_Based_Rendering
     */
    var PBRBaseMaterial = /** @class */ (function (_super) {
        __extends(PBRBaseMaterial, _super);
        /**
         * Instantiates a new PBRMaterial instance.
         *
         * @param name The material name
         * @param scene The scene the material will be use in.
         */
        function PBRBaseMaterial(name, scene) {
            var _this = _super.call(this, name, scene) || this;
            /**
             * Intensity of the direct lights e.g. the four lights available in your scene.
             * This impacts both the direct diffuse and specular highlights.
             */
            _this._directIntensity = 1.0;
            /**
             * Intensity of the emissive part of the material.
             * This helps controlling the emissive effect without modifying the emissive color.
             */
            _this._emissiveIntensity = 1.0;
            /**
             * Intensity of the environment e.g. how much the environment will light the object
             * either through harmonics for rough material or through the refelction for shiny ones.
             */
            _this._environmentIntensity = 1.0;
            /**
             * This is a special control allowing the reduction of the specular highlights coming from the
             * four lights of the scene. Those highlights may not be needed in full environment lighting.
             */
            _this._specularIntensity = 1.0;
            _this._lightingInfos = new LIB.Vector4(_this._directIntensity, _this._emissiveIntensity, _this._environmentIntensity, _this._specularIntensity);
            /**
             * Debug Control allowing disabling the bump map on this material.
             */
            _this._disableBumpMap = false;
            /**
             * AKA Occlusion Texture Intensity in other nomenclature.
             */
            _this._ambientTextureStrength = 1.0;
            _this._ambientColor = new LIB.Color3(0, 0, 0);
            /**
             * AKA Diffuse Color in other nomenclature.
             */
            _this._albedoColor = new LIB.Color3(1, 1, 1);
            /**
             * AKA Specular Color in other nomenclature.
             */
            _this._reflectivityColor = new LIB.Color3(1, 1, 1);
            _this._reflectionColor = new LIB.Color3(1, 1, 1);
            _this._emissiveColor = new LIB.Color3(0, 0, 0);
            /**
             * AKA Glossiness in other nomenclature.
             */
            _this._microSurface = 0.9;
            /**
             * source material index of refraction (IOR)' / 'destination material IOR.
             */
            _this._indexOfRefraction = 0.66;
            /**
             * Controls if refraction needs to be inverted on Y. This could be usefull for procedural texture.
             */
            _this._invertRefractionY = false;
            /**
             * This parameters will make the material used its opacity to control how much it is refracting aginst not.
             * Materials half opaque for instance using refraction could benefit from this control.
             */
            _this._linkRefractionWithTransparency = false;
            _this._useLightmapAsShadowmap = false;
            /**
             * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
             * makes the reflect vector face the model (under horizon).
             */
            _this._useHorizonOcclusion = true;
            /**
             * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
             * too much the area relying on ambient texture to define their ambient occlusion.
             */
            _this._useRadianceOcclusion = true;
            /**
             * Specifies that the alpha is coming form the albedo channel alpha channel for alpha blending.
             */
            _this._useAlphaFromAlbedoTexture = false;
            /**
             * Specifies that the material will keeps the specular highlights over a transparent surface (only the most limunous ones).
             * A car glass is a good exemple of that. When sun reflects on it you can not see what is behind.
             */
            _this._useSpecularOverAlpha = true;
            /**
             * Specifies if the reflectivity texture contains the glossiness information in its alpha channel.
             */
            _this._useMicroSurfaceFromReflectivityMapAlpha = false;
            /**
             * Specifies if the metallic texture contains the roughness information in its alpha channel.
             */
            _this._useRoughnessFromMetallicTextureAlpha = true;
            /**
             * Specifies if the metallic texture contains the roughness information in its green channel.
             */
            _this._useRoughnessFromMetallicTextureGreen = false;
            /**
             * Specifies if the metallic texture contains the metallness information in its blue channel.
             */
            _this._useMetallnessFromMetallicTextureBlue = false;
            /**
             * Specifies if the metallic texture contains the ambient occlusion information in its red channel.
             */
            _this._useAmbientOcclusionFromMetallicTextureRed = false;
            /**
             * Specifies if the ambient texture contains the ambient occlusion information in its red channel only.
             */
            _this._useAmbientInGrayScale = false;
            /**
             * In case the reflectivity map does not contain the microsurface information in its alpha channel,
             * The material will try to infer what glossiness each pixel should be.
             */
            _this._useAutoMicroSurfaceFromReflectivityMap = false;
            /**
             * BJS is using an harcoded light falloff based on a manually sets up range.
             * In PBR, one way to represents the fallof is to use the inverse squared root algorythm.
             * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
             */
            _this._usePhysicalLightFalloff = true;
            /**
             * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most limunous ones).
             * A car glass is a good exemple of that. When the street lights reflects on it you can not see what is behind.
             */
            _this._useRadianceOverAlpha = true;
            /**
             * Allows using the bump map in parallax mode.
             */
            _this._useParallax = false;
            /**
             * Allows using the bump map in parallax occlusion mode.
             */
            _this._useParallaxOcclusion = false;
            /**
             * Controls the scale bias of the parallax mode.
             */
            _this._parallaxScaleBias = 0.05;
            /**
             * If sets to true, disables all the lights affecting the material.
             */
            _this._disableLighting = false;
            /**
             * Number of Simultaneous lights allowed on the material.
             */
            _this._maxSimultaneousLights = 4;
            /**
             * If sets to true, x component of normal map value will be inverted (x = 1.0 - x).
             */
            _this._invertNormalMapX = false;
            /**
             * If sets to true, y component of normal map value will be inverted (y = 1.0 - y).
             */
            _this._invertNormalMapY = false;
            /**
             * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
             */
            _this._twoSidedLighting = false;
            /**
             * Defines the alpha limits in alpha test mode.
             */
            _this._alphaCutOff = 0.4;
            /**
             * Enforces alpha test in opaque or blend mode in order to improve the performances of some situations.
             */
            _this._forceAlphaTest = false;
            /**
             * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
             * And/Or occlude the blended part. (alpha is converted to gamma to compute the fresnel)
             */
            _this._useAlphaFresnel = false;
            /**
             * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
             * And/Or occlude the blended part. (alpha stays linear to compute the fresnel)
             */
            _this._useLinearAlphaFresnel = false;
            /**
             * The transparency mode of the material.
             */
            _this._transparencyMode = null;
            /**
             * Specifies the environment BRDF texture used to comput the scale and offset roughness values
             * from cos thetav and roughness:
             * http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
             */
            _this._environmentBRDFTexture = null;
            /**
             * Force the shader to compute irradiance in the fragment shader in order to take bump in account.
             */
            _this._forceIrradianceInFragment = false;
            /**
             * Force normal to face away from face.
             */
            _this._forceNormalForward = false;
            _this._renderTargets = new LIB.SmartArray(16);
            _this._globalAmbientColor = new LIB.Color3(0, 0, 0);
            // Setup the default processing configuration to the scene.
            _this._attachImageProcessingConfiguration(null);
            _this.getRenderTargetTextures = function () {
                _this._renderTargets.reset();
                if (LIB.StandardMaterial.ReflectionTextureEnabled && _this._reflectionTexture && _this._reflectionTexture.isRenderTarget) {
                    _this._renderTargets.push(_this._reflectionTexture);
                }
                if (LIB.StandardMaterial.RefractionTextureEnabled && _this._refractionTexture && _this._refractionTexture.isRenderTarget) {
                    _this._renderTargets.push(_this._refractionTexture);
                }
                return _this._renderTargets;
            };
            _this._environmentBRDFTexture = LIB.TextureTools.GetEnvironmentBRDFTexture(scene);
            return _this;
        }
        /**
         * Attaches a new image processing configuration to the PBR Material.
         * @param configuration
         */
        PBRBaseMaterial.prototype._attachImageProcessingConfiguration = function (configuration) {
            var _this = this;
            if (configuration === this._imageProcessingConfiguration) {
                return;
            }
            // Detaches observer.
            if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
                this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
            }
            // Pick the scene configuration if needed.
            if (!configuration) {
                this._imageProcessingConfiguration = this.getScene().imageProcessingConfiguration;
            }
            else {
                this._imageProcessingConfiguration = configuration;
            }
            // Attaches observer.
            this._imageProcessingObserver = this._imageProcessingConfiguration.onUpdateParameters.add(function (conf) {
                _this._markAllSubMeshesAsImageProcessingDirty();
            });
        };
        PBRBaseMaterial.prototype.getClassName = function () {
            return "PBRBaseMaterial";
        };
        Object.defineProperty(PBRBaseMaterial.prototype, "useLogarithmicDepth", {
            get: function () {
                return this._useLogarithmicDepth;
            },
            set: function (value) {
                this._useLogarithmicDepth = value && this.getScene().getEngine().getCaps().fragmentDepthSupported;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRBaseMaterial.prototype, "transparencyMode", {
            /**
             * Gets the current transparency mode.
             */
            get: function () {
                return this._transparencyMode;
            },
            /**
             * Sets the transparency mode of the material.
             */
            set: function (value) {
                if (this._transparencyMode === value) {
                    return;
                }
                this._transparencyMode = value;
                this._forceAlphaTest = (value === LIB.PBRMaterial.PBRMATERIAL_ALPHATESTANDBLEND);
                this._markAllSubMeshesAsTexturesDirty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PBRBaseMaterial.prototype, "_disableAlphaBlending", {
            /**
             * Returns true if alpha blending should be disabled.
             */
            get: function () {
                return (this._linkRefractionWithTransparency ||
                    this._transparencyMode === LIB.PBRMaterial.PBRMATERIAL_OPAQUE ||
                    this._transparencyMode === LIB.PBRMaterial.PBRMATERIAL_ALPHATEST);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Specifies whether or not this material should be rendered in alpha blend mode.
         */
        PBRBaseMaterial.prototype.needAlphaBlending = function () {
            if (this._disableAlphaBlending) {
                return false;
            }
            return (this.alpha < 1.0) || (this._opacityTexture != null) || this._shouldUseAlphaFromAlbedoTexture();
        };
        /**
         * Specifies whether or not this material should be rendered in alpha blend mode for the given mesh.
         */
        PBRBaseMaterial.prototype.needAlphaBlendingForMesh = function (mesh) {
            if (this._disableAlphaBlending) {
                return false;
            }
            return _super.prototype.needAlphaBlendingForMesh.call(this, mesh);
        };
        /**
         * Specifies whether or not this material should be rendered in alpha test mode.
         */
        PBRBaseMaterial.prototype.needAlphaTesting = function () {
            if (this._forceAlphaTest) {
                return true;
            }
            if (this._linkRefractionWithTransparency) {
                return false;
            }
            return this._albedoTexture != null && this._albedoTexture.hasAlpha && (this._transparencyMode == null || this._transparencyMode === LIB.PBRMaterial.PBRMATERIAL_ALPHATEST);
        };
        /**
         * Specifies whether or not the alpha value of the albedo texture should be used for alpha blending.
         */
        PBRBaseMaterial.prototype._shouldUseAlphaFromAlbedoTexture = function () {
            return this._albedoTexture != null && this._albedoTexture.hasAlpha && this._useAlphaFromAlbedoTexture && this._transparencyMode !== LIB.PBRMaterial.PBRMATERIAL_OPAQUE;
        };
        PBRBaseMaterial.prototype.getAlphaTestTexture = function () {
            return this._albedoTexture;
        };
        PBRBaseMaterial.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
            var _this = this;
            if (subMesh.effect && this.isFrozen) {
                if (this._wasPreviouslyReady) {
                    return true;
                }
            }
            if (!subMesh._materialDefines) {
                subMesh._materialDefines = new PBRMaterialDefines();
            }
            var scene = this.getScene();
            var defines = subMesh._materialDefines;
            if (!this.checkReadyOnEveryCall && subMesh.effect) {
                if (defines._renderId === scene.getRenderId()) {
                    return true;
                }
            }
            var engine = scene.getEngine();
            // Lights
            LIB.MaterialHelper.PrepareDefinesForLights(scene, mesh, defines, true, this._maxSimultaneousLights, this._disableLighting);
            defines._needNormals = true;
            // Textures
            if (defines._areTexturesDirty) {
                defines._needUVs = false;
                if (scene.texturesEnabled) {
                    if (scene.getEngine().getCaps().textureLOD) {
                        defines.LODBASEDMICROSFURACE = true;
                    }
                    if (this._albedoTexture && LIB.StandardMaterial.DiffuseTextureEnabled) {
                        if (!this._albedoTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        LIB.MaterialHelper.PrepareDefinesForMergedUV(this._albedoTexture, defines, "ALBEDO");
                    }
                    else {
                        defines.ALBEDO = false;
                    }
                    if (this._ambientTexture && LIB.StandardMaterial.AmbientTextureEnabled) {
                        if (!this._ambientTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        LIB.MaterialHelper.PrepareDefinesForMergedUV(this._ambientTexture, defines, "AMBIENT");
                        defines.AMBIENTINGRAYSCALE = this._useAmbientInGrayScale;
                    }
                    else {
                        defines.AMBIENT = false;
                    }
                    if (this._opacityTexture && LIB.StandardMaterial.OpacityTextureEnabled) {
                        if (!this._opacityTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        LIB.MaterialHelper.PrepareDefinesForMergedUV(this._opacityTexture, defines, "OPACITY");
                        defines.OPACITYRGB = this._opacityTexture.getAlphaFromRGB;
                    }
                    else {
                        defines.OPACITY = false;
                    }
                    var reflectionTexture = this._getReflectionTexture();
                    if (reflectionTexture && LIB.StandardMaterial.ReflectionTextureEnabled) {
                        if (!reflectionTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        defines.REFLECTION = true;
                        defines.GAMMAREFLECTION = reflectionTexture.gammaSpace;
                        defines.REFLECTIONMAP_OPPOSITEZ = this.getScene().useRightHandedSystem ? !reflectionTexture.invertZ : reflectionTexture.invertZ;
                        defines.LODINREFLECTIONALPHA = reflectionTexture.lodLevelInAlpha;
                        if (reflectionTexture.coordinatesMode === LIB.Texture.INVCUBIC_MODE) {
                            defines.INVERTCUBICMAP = true;
                        }
                        defines.REFLECTIONMAP_3D = reflectionTexture.isCube;
                        switch (reflectionTexture.coordinatesMode) {
                            case LIB.Texture.CUBIC_MODE:
                            case LIB.Texture.INVCUBIC_MODE:
                                defines.REFLECTIONMAP_CUBIC = true;
                                break;
                            case LIB.Texture.EXPLICIT_MODE:
                                defines.REFLECTIONMAP_EXPLICIT = true;
                                break;
                            case LIB.Texture.PLANAR_MODE:
                                defines.REFLECTIONMAP_PLANAR = true;
                                break;
                            case LIB.Texture.PROJECTION_MODE:
                                defines.REFLECTIONMAP_PROJECTION = true;
                                break;
                            case LIB.Texture.SKYBOX_MODE:
                                defines.REFLECTIONMAP_SKYBOX = true;
                                break;
                            case LIB.Texture.SPHERICAL_MODE:
                                defines.REFLECTIONMAP_SPHERICAL = true;
                                break;
                            case LIB.Texture.EQUIRECTANGULAR_MODE:
                                defines.REFLECTIONMAP_EQUIRECTANGULAR = true;
                                break;
                            case LIB.Texture.FIXED_EQUIRECTANGULAR_MODE:
                                defines.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = true;
                                break;
                            case LIB.Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE:
                                defines.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = true;
                                break;
                        }
                        if (reflectionTexture.coordinatesMode !== LIB.Texture.SKYBOX_MODE) {
                            if (reflectionTexture.sphericalPolynomial) {
                                defines.USESPHERICALFROMREFLECTIONMAP = true;
                                if (this._forceIrradianceInFragment || scene.getEngine().getCaps().maxVaryingVectors <= 8) {
                                    defines.USESPHERICALINVERTEX = false;
                                }
                                else {
                                    defines.USESPHERICALINVERTEX = true;
                                }
                            }
                        }
                    }
                    else {
                        defines.REFLECTION = false;
                        defines.REFLECTIONMAP_3D = false;
                        defines.REFLECTIONMAP_SPHERICAL = false;
                        defines.REFLECTIONMAP_PLANAR = false;
                        defines.REFLECTIONMAP_CUBIC = false;
                        defines.REFLECTIONMAP_PROJECTION = false;
                        defines.REFLECTIONMAP_SKYBOX = false;
                        defines.REFLECTIONMAP_EXPLICIT = false;
                        defines.REFLECTIONMAP_EQUIRECTANGULAR = false;
                        defines.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
                        defines.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
                        defines.INVERTCUBICMAP = false;
                        defines.USESPHERICALFROMREFLECTIONMAP = false;
                        defines.USESPHERICALINVERTEX = false;
                        defines.REFLECTIONMAP_OPPOSITEZ = false;
                        defines.LODINREFLECTIONALPHA = false;
                        defines.GAMMAREFLECTION = false;
                    }
                    if (this._lightmapTexture && LIB.StandardMaterial.LightmapTextureEnabled) {
                        if (!this._lightmapTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        LIB.MaterialHelper.PrepareDefinesForMergedUV(this._lightmapTexture, defines, "LIGHTMAP");
                        defines.USELIGHTMAPASSHADOWMAP = this._useLightmapAsShadowmap;
                    }
                    else {
                        defines.LIGHTMAP = false;
                    }
                    if (this._emissiveTexture && LIB.StandardMaterial.EmissiveTextureEnabled) {
                        if (!this._emissiveTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        LIB.MaterialHelper.PrepareDefinesForMergedUV(this._emissiveTexture, defines, "EMISSIVE");
                    }
                    else {
                        defines.EMISSIVE = false;
                    }
                    if (LIB.StandardMaterial.SpecularTextureEnabled) {
                        if (this._metallicTexture) {
                            if (!this._metallicTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            LIB.MaterialHelper.PrepareDefinesForMergedUV(this._metallicTexture, defines, "REFLECTIVITY");
                            defines.METALLICWORKFLOW = true;
                            defines.ROUGHNESSSTOREINMETALMAPALPHA = this._useRoughnessFromMetallicTextureAlpha;
                            defines.ROUGHNESSSTOREINMETALMAPGREEN = !this._useRoughnessFromMetallicTextureAlpha && this._useRoughnessFromMetallicTextureGreen;
                            defines.METALLNESSSTOREINMETALMAPBLUE = this._useMetallnessFromMetallicTextureBlue;
                            defines.AOSTOREINMETALMAPRED = this._useAmbientOcclusionFromMetallicTextureRed;
                        }
                        else if (this._reflectivityTexture) {
                            if (!this._reflectivityTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            defines.METALLICWORKFLOW = false;
                            LIB.MaterialHelper.PrepareDefinesForMergedUV(this._reflectivityTexture, defines, "REFLECTIVITY");
                            defines.MICROSURFACEFROMREFLECTIVITYMAP = this._useMicroSurfaceFromReflectivityMapAlpha;
                            defines.MICROSURFACEAUTOMATIC = this._useAutoMicroSurfaceFromReflectivityMap;
                        }
                        else {
                            defines.METALLICWORKFLOW = false;
                            defines.REFLECTIVITY = false;
                        }
                        if (this._microSurfaceTexture) {
                            if (!this._microSurfaceTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            LIB.MaterialHelper.PrepareDefinesForMergedUV(this._microSurfaceTexture, defines, "MICROSURFACEMAP");
                        }
                        else {
                            defines.MICROSURFACEMAP = false;
                        }
                    }
                    else {
                        defines.REFLECTIVITY = false;
                        defines.MICROSURFACEMAP = false;
                    }
                    if (scene.getEngine().getCaps().standardDerivatives && this._bumpTexture && LIB.StandardMaterial.BumpTextureEnabled && !this._disableBumpMap) {
                        // Bump texure can not be none blocking.
                        if (!this._bumpTexture.isReady()) {
                            return false;
                        }
                        LIB.MaterialHelper.PrepareDefinesForMergedUV(this._bumpTexture, defines, "BUMP");
                        if (this._useParallax && this._albedoTexture && LIB.StandardMaterial.DiffuseTextureEnabled) {
                            defines.PARALLAX = true;
                            defines.PARALLAXOCCLUSION = !!this._useParallaxOcclusion;
                        }
                        else {
                            defines.PARALLAX = false;
                        }
                    }
                    else {
                        defines.BUMP = false;
                    }
                    var refractionTexture = this._getRefractionTexture();
                    if (refractionTexture && LIB.StandardMaterial.RefractionTextureEnabled) {
                        if (!refractionTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        defines.REFRACTION = true;
                        defines.REFRACTIONMAP_3D = refractionTexture.isCube;
                        defines.GAMMAREFRACTION = refractionTexture.gammaSpace;
                        defines.REFRACTIONMAP_OPPOSITEZ = refractionTexture.invertZ;
                        defines.LODINREFRACTIONALPHA = refractionTexture.lodLevelInAlpha;
                        if (this._linkRefractionWithTransparency) {
                            defines.LINKREFRACTIONTOTRANSPARENCY = true;
                        }
                    }
                    else {
                        defines.REFRACTION = false;
                    }
                    if (this._environmentBRDFTexture && LIB.StandardMaterial.ReflectionTextureEnabled) {
                        // This is blocking.
                        if (!this._environmentBRDFTexture.isReady()) {
                            return false;
                        }
                        defines.ENVIRONMENTBRDF = true;
                    }
                    else {
                        defines.ENVIRONMENTBRDF = false;
                    }
                    if (this._shouldUseAlphaFromAlbedoTexture()) {
                        defines.ALPHAFROMALBEDO = true;
                    }
                    else {
                        defines.ALPHAFROMALBEDO = false;
                    }
                }
                defines.SPECULAROVERALPHA = this._useSpecularOverAlpha;
                defines.USEPHYSICALLIGHTFALLOFF = this._usePhysicalLightFalloff;
                defines.RADIANCEOVERALPHA = this._useRadianceOverAlpha;
                if ((this._metallic !== undefined && this._metallic !== null) || (this._roughness !== undefined && this._roughness !== null)) {
                    defines.METALLICWORKFLOW = true;
                }
                else {
                    defines.METALLICWORKFLOW = false;
                }
                if (!this.backFaceCulling && this._twoSidedLighting) {
                    defines.TWOSIDEDLIGHTING = true;
                }
                else {
                    defines.TWOSIDEDLIGHTING = false;
                }
                defines.ALPHATESTVALUE = this._alphaCutOff;
                defines.PREMULTIPLYALPHA = (this.alphaMode === LIB.Engine.ALPHA_PREMULTIPLIED || this.alphaMode === LIB.Engine.ALPHA_PREMULTIPLIED_PORTERDUFF);
                defines.ALPHABLEND = this.needAlphaBlendingForMesh(mesh);
                defines.ALPHAFRESNEL = this._useAlphaFresnel || this._useLinearAlphaFresnel;
                defines.LINEARALPHAFRESNEL = this._useLinearAlphaFresnel;
            }
            if (defines._areImageProcessingDirty) {
                if (!this._imageProcessingConfiguration.isReady()) {
                    return false;
                }
                this._imageProcessingConfiguration.prepareDefines(defines);
            }
            defines.FORCENORMALFORWARD = this._forceNormalForward;
            defines.RADIANCEOCCLUSION = this._useRadianceOcclusion;
            defines.HORIZONOCCLUSION = this._useHorizonOcclusion;
            // Misc.
            LIB.MaterialHelper.PrepareDefinesForMisc(mesh, scene, this._useLogarithmicDepth, this.pointsCloud, this.fogEnabled, defines);
            // Values that need to be evaluated on every frame
            LIB.MaterialHelper.PrepareDefinesForFrameBoundValues(scene, engine, defines, useInstances ? true : false, this._forceAlphaTest);
            // Attribs
            if (LIB.MaterialHelper.PrepareDefinesForAttributes(mesh, defines, true, true, true, this._transparencyMode !== LIB.PBRMaterial.PBRMATERIAL_OPAQUE) && mesh) {
                var bufferMesh = null;
                if (mesh instanceof LIB.InstancedMesh) {
                    bufferMesh = mesh.sourceMesh;
                }
                else if (mesh instanceof LIB.Mesh) {
                    bufferMesh = mesh;
                }
                if (bufferMesh) {
                    if (bufferMesh.isVerticesDataPresent(LIB.VertexBuffer.NormalKind)) {
                        // If the first normal's components is the zero vector in one of the submeshes, we have invalid normals
                        var normalVertexBuffer = bufferMesh.getVertexBuffer(LIB.VertexBuffer.NormalKind);
                        var normals = normalVertexBuffer.getData();
                        var vertexBufferOffset = normalVertexBuffer.getOffset();
                        var strideSize = normalVertexBuffer.getStrideSize();
                        var offset = vertexBufferOffset + subMesh.indexStart * strideSize;
                        if (normals[offset] === 0 && normals[offset + 1] === 0 && normals[offset + 2] === 0) {
                            defines.NORMAL = false;
                        }
                        if (bufferMesh.isVerticesDataPresent(LIB.VertexBuffer.TangentKind)) {
                            // If the first tangent's components is the zero vector in one of the submeshes, we have invalid tangents
                            var tangentVertexBuffer = bufferMesh.getVertexBuffer(LIB.VertexBuffer.TangentKind);
                            var tangents = tangentVertexBuffer.getData();
                            var vertexBufferOffset_1 = tangentVertexBuffer.getOffset();
                            var strideSize_1 = tangentVertexBuffer.getStrideSize();
                            var offset_1 = vertexBufferOffset_1 + subMesh.indexStart * strideSize_1;
                            if (tangents[offset_1] === 0 && tangents[offset_1 + 1] === 0 && tangents[offset_1 + 2] === 0) {
                                defines.TANGENT = false;
                            }
                        }
                    }
                    else {
                        if (!scene.getEngine().getCaps().standardDerivatives) {
                            bufferMesh.createNormals(true);
                            LIB.Tools.Warn("PBRMaterial: Normals have been created for the mesh: " + bufferMesh.name);
                        }
                    }
                }
            }
            // Get correct effect
            if (defines.isDirty) {
                defines.markAsProcessed();
                scene.resetCachedMaterial();
                // Fallbacks
                var fallbacks = new LIB.EffectFallbacks();
                var fallbackRank = 0;
                if (defines.USESPHERICALINVERTEX) {
                    fallbacks.addFallback(fallbackRank++, "USESPHERICALINVERTEX");
                }
                if (defines.FOG) {
                    fallbacks.addFallback(fallbackRank, "FOG");
                }
                if (defines.POINTSIZE) {
                    fallbacks.addFallback(fallbackRank, "POINTSIZE");
                }
                if (defines.LOGARITHMICDEPTH) {
                    fallbacks.addFallback(fallbackRank, "LOGARITHMICDEPTH");
                }
                if (defines.PARALLAX) {
                    fallbacks.addFallback(fallbackRank, "PARALLAX");
                }
                if (defines.PARALLAXOCCLUSION) {
                    fallbacks.addFallback(fallbackRank++, "PARALLAXOCCLUSION");
                }
                if (defines.ENVIRONMENTBRDF) {
                    fallbacks.addFallback(fallbackRank++, "ENVIRONMENTBRDF");
                }
                if (defines.TANGENT) {
                    fallbacks.addFallback(fallbackRank++, "TANGENT");
                }
                if (defines.BUMP) {
                    fallbacks.addFallback(fallbackRank++, "BUMP");
                }
                fallbackRank = LIB.MaterialHelper.HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights, fallbackRank++);
                if (defines.SPECULARTERM) {
                    fallbacks.addFallback(fallbackRank++, "SPECULARTERM");
                }
                if (defines.USESPHERICALFROMREFLECTIONMAP) {
                    fallbacks.addFallback(fallbackRank++, "USESPHERICALFROMREFLECTIONMAP");
                }
                if (defines.LIGHTMAP) {
                    fallbacks.addFallback(fallbackRank++, "LIGHTMAP");
                }
                if (defines.NORMAL) {
                    fallbacks.addFallback(fallbackRank++, "NORMAL");
                }
                if (defines.AMBIENT) {
                    fallbacks.addFallback(fallbackRank++, "AMBIENT");
                }
                if (defines.EMISSIVE) {
                    fallbacks.addFallback(fallbackRank++, "EMISSIVE");
                }
                if (defines.VERTEXCOLOR) {
                    fallbacks.addFallback(fallbackRank++, "VERTEXCOLOR");
                }
                if (defines.NUM_BONE_INFLUENCERS > 0) {
                    fallbacks.addCPUSkinningFallback(fallbackRank++, mesh);
                }
                if (defines.MORPHTARGETS) {
                    fallbacks.addFallback(fallbackRank++, "MORPHTARGETS");
                }
                //Attributes
                var attribs = [LIB.VertexBuffer.PositionKind];
                if (defines.NORMAL) {
                    attribs.push(LIB.VertexBuffer.NormalKind);
                }
                if (defines.TANGENT) {
                    attribs.push(LIB.VertexBuffer.TangentKind);
                }
                if (defines.UV1) {
                    attribs.push(LIB.VertexBuffer.UVKind);
                }
                if (defines.UV2) {
                    attribs.push(LIB.VertexBuffer.UV2Kind);
                }
                if (defines.VERTEXCOLOR) {
                    attribs.push(LIB.VertexBuffer.ColorKind);
                }
                LIB.MaterialHelper.PrepareAttributesForBones(attribs, mesh, defines, fallbacks);
                LIB.MaterialHelper.PrepareAttributesForInstances(attribs, defines);
                LIB.MaterialHelper.PrepareAttributesForMorphTargets(attribs, mesh, defines);
                var uniforms = ["world", "view", "viewProjection", "vEyePosition", "vLightsType", "vAmbientColor", "vAlbedoColor", "vReflectivityColor", "vEmissiveColor", "vReflectionColor",
                    "vFogInfos", "vFogColor", "pointSize",
                    "vAlbedoInfos", "vAmbientInfos", "vOpacityInfos", "vReflectionInfos", "vEmissiveInfos", "vReflectivityInfos", "vMicroSurfaceSamplerInfos", "vBumpInfos", "vLightmapInfos", "vRefractionInfos",
                    "mBones",
                    "vClipPlane", "albedoMatrix", "ambientMatrix", "opacityMatrix", "reflectionMatrix", "emissiveMatrix", "reflectivityMatrix", "microSurfaceSamplerMatrix", "bumpMatrix", "lightmapMatrix", "refractionMatrix",
                    "vLightingIntensity",
                    "logarithmicDepthConstant",
                    "vSphericalX", "vSphericalY", "vSphericalZ",
                    "vSphericalXX", "vSphericalYY", "vSphericalZZ",
                    "vSphericalXY", "vSphericalYZ", "vSphericalZX",
                    "vReflectionMicrosurfaceInfos", "vRefractionMicrosurfaceInfos",
                    "vTangentSpaceParams"
                ];
                var samplers = ["albedoSampler", "reflectivitySampler", "ambientSampler", "emissiveSampler",
                    "bumpSampler", "lightmapSampler", "opacitySampler",
                    "refractionSampler", "refractionSamplerLow", "refractionSamplerHigh",
                    "reflectionSampler", "reflectionSamplerLow", "reflectionSamplerHigh",
                    "microSurfaceSampler", "environmentBrdfSampler"];
                var uniformBuffers = ["Material", "Scene"];
                LIB.ImageProcessingConfiguration.PrepareUniforms(uniforms, defines);
                LIB.ImageProcessingConfiguration.PrepareSamplers(samplers, defines);
                LIB.MaterialHelper.PrepareUniformsAndSamplersList({
                    uniformsNames: uniforms,
                    uniformBuffersNames: uniformBuffers,
                    samplers: samplers,
                    defines: defines,
                    maxSimultaneousLights: this._maxSimultaneousLights
                });
                var onCompiled = function (effect) {
                    if (_this.onCompiled) {
                        _this.onCompiled(effect);
                    }
                    _this.bindSceneUniformBuffer(effect, scene.getSceneUniformBuffer());
                };
                var join = defines.toString();
                subMesh.setEffect(scene.getEngine().createEffect("pbr", {
                    attributes: attribs,
                    uniformsNames: uniforms,
                    uniformBuffersNames: uniformBuffers,
                    samplers: samplers,
                    defines: join,
                    fallbacks: fallbacks,
                    onCompiled: onCompiled,
                    onError: this.onError,
                    indexParameters: { maxSimultaneousLights: this._maxSimultaneousLights, maxSimultaneousMorphTargets: defines.NUM_MORPH_INFLUENCERS }
                }, engine), defines);
                this.buildUniformLayout();
            }
            if (!subMesh.effect || !subMesh.effect.isReady()) {
                return false;
            }
            defines._renderId = scene.getRenderId();
            this._wasPreviouslyReady = true;
            return true;
        };
        PBRBaseMaterial.prototype.buildUniformLayout = function () {
            // Order is important !
            this._uniformBuffer.addUniform("vAlbedoInfos", 2);
            this._uniformBuffer.addUniform("vAmbientInfos", 3);
            this._uniformBuffer.addUniform("vOpacityInfos", 2);
            this._uniformBuffer.addUniform("vEmissiveInfos", 2);
            this._uniformBuffer.addUniform("vLightmapInfos", 2);
            this._uniformBuffer.addUniform("vReflectivityInfos", 3);
            this._uniformBuffer.addUniform("vMicroSurfaceSamplerInfos", 2);
            this._uniformBuffer.addUniform("vRefractionInfos", 4);
            this._uniformBuffer.addUniform("vReflectionInfos", 2);
            this._uniformBuffer.addUniform("vBumpInfos", 3);
            this._uniformBuffer.addUniform("albedoMatrix", 16);
            this._uniformBuffer.addUniform("ambientMatrix", 16);
            this._uniformBuffer.addUniform("opacityMatrix", 16);
            this._uniformBuffer.addUniform("emissiveMatrix", 16);
            this._uniformBuffer.addUniform("lightmapMatrix", 16);
            this._uniformBuffer.addUniform("reflectivityMatrix", 16);
            this._uniformBuffer.addUniform("microSurfaceSamplerMatrix", 16);
            this._uniformBuffer.addUniform("bumpMatrix", 16);
            this._uniformBuffer.addUniform("vTangentSpaceParams", 2);
            this._uniformBuffer.addUniform("refractionMatrix", 16);
            this._uniformBuffer.addUniform("reflectionMatrix", 16);
            this._uniformBuffer.addUniform("vReflectionColor", 3);
            this._uniformBuffer.addUniform("vAlbedoColor", 4);
            this._uniformBuffer.addUniform("vLightingIntensity", 4);
            this._uniformBuffer.addUniform("vRefractionMicrosurfaceInfos", 3);
            this._uniformBuffer.addUniform("vReflectionMicrosurfaceInfos", 3);
            this._uniformBuffer.addUniform("vReflectivityColor", 4);
            this._uniformBuffer.addUniform("vEmissiveColor", 3);
            this._uniformBuffer.addUniform("pointSize", 1);
            this._uniformBuffer.create();
        };
        PBRBaseMaterial.prototype.unbind = function () {
            if (this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                this._uniformBuffer.setTexture("reflectionSampler", null);
            }
            if (this._refractionTexture && this._refractionTexture.isRenderTarget) {
                this._uniformBuffer.setTexture("refractionSampler", null);
            }
            _super.prototype.unbind.call(this);
        };
        PBRBaseMaterial.prototype.bindOnlyWorldMatrix = function (world) {
            this._activeEffect.setMatrix("world", world);
        };
        PBRBaseMaterial.prototype.bindForSubMesh = function (world, mesh, subMesh) {
            var scene = this.getScene();
            var defines = subMesh._materialDefines;
            if (!defines) {
                return;
            }
            var effect = subMesh.effect;
            if (!effect) {
                return;
            }
            this._activeEffect = effect;
            // Matrices
            this.bindOnlyWorldMatrix(world);
            var mustRebind = this._mustRebind(scene, effect, mesh.visibility);
            // Bones
            LIB.MaterialHelper.BindBonesParameters(mesh, this._activeEffect);
            var reflectionTexture = null;
            if (mustRebind) {
                this._uniformBuffer.bindToEffect(effect, "Material");
                this.bindViewProjection(effect);
                reflectionTexture = this._getReflectionTexture();
                var refractionTexture = this._getRefractionTexture();
                if (!this._uniformBuffer.useUbo || !this.isFrozen || !this._uniformBuffer.isSync) {
                    // Texture uniforms
                    if (scene.texturesEnabled) {
                        if (this._albedoTexture && LIB.StandardMaterial.DiffuseTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vAlbedoInfos", this._albedoTexture.coordinatesIndex, this._albedoTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._albedoTexture, this._uniformBuffer, "albedo");
                        }
                        if (this._ambientTexture && LIB.StandardMaterial.AmbientTextureEnabled) {
                            this._uniformBuffer.updateFloat3("vAmbientInfos", this._ambientTexture.coordinatesIndex, this._ambientTexture.level, this._ambientTextureStrength);
                            LIB.MaterialHelper.BindTextureMatrix(this._ambientTexture, this._uniformBuffer, "ambient");
                        }
                        if (this._opacityTexture && LIB.StandardMaterial.OpacityTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vOpacityInfos", this._opacityTexture.coordinatesIndex, this._opacityTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._opacityTexture, this._uniformBuffer, "opacity");
                        }
                        if (reflectionTexture && LIB.StandardMaterial.ReflectionTextureEnabled) {
                            this._uniformBuffer.updateMatrix("reflectionMatrix", reflectionTexture.getReflectionTextureMatrix());
                            this._uniformBuffer.updateFloat2("vReflectionInfos", reflectionTexture.level, 0);
                            var polynomials = reflectionTexture.sphericalPolynomial;
                            if (defines.USESPHERICALFROMREFLECTIONMAP && polynomials) {
                                this._activeEffect.setFloat3("vSphericalX", polynomials.x.x, polynomials.x.y, polynomials.x.z);
                                this._activeEffect.setFloat3("vSphericalY", polynomials.y.x, polynomials.y.y, polynomials.y.z);
                                this._activeEffect.setFloat3("vSphericalZ", polynomials.z.x, polynomials.z.y, polynomials.z.z);
                                this._activeEffect.setFloat3("vSphericalXX_ZZ", polynomials.xx.x - polynomials.zz.x, polynomials.xx.y - polynomials.zz.y, polynomials.xx.z - polynomials.zz.z);
                                this._activeEffect.setFloat3("vSphericalYY_ZZ", polynomials.yy.x - polynomials.zz.x, polynomials.yy.y - polynomials.zz.y, polynomials.yy.z - polynomials.zz.z);
                                this._activeEffect.setFloat3("vSphericalZZ", polynomials.zz.x, polynomials.zz.y, polynomials.zz.z);
                                this._activeEffect.setFloat3("vSphericalXY", polynomials.xy.x, polynomials.xy.y, polynomials.xy.z);
                                this._activeEffect.setFloat3("vSphericalYZ", polynomials.yz.x, polynomials.yz.y, polynomials.yz.z);
                                this._activeEffect.setFloat3("vSphericalZX", polynomials.zx.x, polynomials.zx.y, polynomials.zx.z);
                            }
                            this._uniformBuffer.updateFloat3("vReflectionMicrosurfaceInfos", reflectionTexture.getSize().width, reflectionTexture.lodGenerationScale, reflectionTexture.lodGenerationOffset);
                        }
                        if (this._emissiveTexture && LIB.StandardMaterial.EmissiveTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vEmissiveInfos", this._emissiveTexture.coordinatesIndex, this._emissiveTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._emissiveTexture, this._uniformBuffer, "emissive");
                        }
                        if (this._lightmapTexture && LIB.StandardMaterial.LightmapTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vLightmapInfos", this._lightmapTexture.coordinatesIndex, this._lightmapTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._lightmapTexture, this._uniformBuffer, "lightmap");
                        }
                        if (LIB.StandardMaterial.SpecularTextureEnabled) {
                            if (this._metallicTexture) {
                                this._uniformBuffer.updateFloat3("vReflectivityInfos", this._metallicTexture.coordinatesIndex, this._metallicTexture.level, this._ambientTextureStrength);
                                LIB.MaterialHelper.BindTextureMatrix(this._metallicTexture, this._uniformBuffer, "reflectivity");
                            }
                            else if (this._reflectivityTexture) {
                                this._uniformBuffer.updateFloat3("vReflectivityInfos", this._reflectivityTexture.coordinatesIndex, this._reflectivityTexture.level, 1.0);
                                LIB.MaterialHelper.BindTextureMatrix(this._reflectivityTexture, this._uniformBuffer, "reflectivity");
                            }
                            if (this._microSurfaceTexture) {
                                this._uniformBuffer.updateFloat2("vMicroSurfaceSamplerInfos", this._microSurfaceTexture.coordinatesIndex, this._microSurfaceTexture.level);
                                LIB.MaterialHelper.BindTextureMatrix(this._microSurfaceTexture, this._uniformBuffer, "microSurfaceSampler");
                            }
                        }
                        if (this._bumpTexture && scene.getEngine().getCaps().standardDerivatives && LIB.StandardMaterial.BumpTextureEnabled && !this._disableBumpMap) {
                            this._uniformBuffer.updateFloat3("vBumpInfos", this._bumpTexture.coordinatesIndex, this._bumpTexture.level, this._parallaxScaleBias);
                            LIB.MaterialHelper.BindTextureMatrix(this._bumpTexture, this._uniformBuffer, "bump");
                            if (scene._mirroredCameraPosition) {
                                this._uniformBuffer.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? 1.0 : -1.0, this._invertNormalMapY ? 1.0 : -1.0);
                            }
                            else {
                                this._uniformBuffer.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? -1.0 : 1.0, this._invertNormalMapY ? -1.0 : 1.0);
                            }
                        }
                        if (refractionTexture && LIB.StandardMaterial.RefractionTextureEnabled) {
                            this._uniformBuffer.updateMatrix("refractionMatrix", refractionTexture.getReflectionTextureMatrix());
                            var depth = 1.0;
                            if (!refractionTexture.isCube) {
                                if (refractionTexture.depth) {
                                    depth = refractionTexture.depth;
                                }
                            }
                            this._uniformBuffer.updateFloat4("vRefractionInfos", refractionTexture.level, this._indexOfRefraction, depth, this._invertRefractionY ? -1 : 1);
                            this._uniformBuffer.updateFloat3("vRefractionMicrosurfaceInfos", refractionTexture.getSize().width, refractionTexture.lodGenerationScale, refractionTexture.lodGenerationOffset);
                        }
                    }
                    // Point size
                    if (this.pointsCloud) {
                        this._uniformBuffer.updateFloat("pointSize", this.pointSize);
                    }
                    // Colors
                    if (defines.METALLICWORKFLOW) {
                        LIB.PBRMaterial._scaledReflectivity.r = (this._metallic === undefined || this._metallic === null) ? 1 : this._metallic;
                        LIB.PBRMaterial._scaledReflectivity.g = (this._roughness === undefined || this._roughness === null) ? 1 : this._roughness;
                        this._uniformBuffer.updateColor4("vReflectivityColor", LIB.PBRMaterial._scaledReflectivity, 0);
                    }
                    else {
                        this._uniformBuffer.updateColor4("vReflectivityColor", this._reflectivityColor, this._microSurface);
                    }
                    this._uniformBuffer.updateColor3("vEmissiveColor", this._emissiveColor);
                    this._uniformBuffer.updateColor3("vReflectionColor", this._reflectionColor);
                    this._uniformBuffer.updateColor4("vAlbedoColor", this._albedoColor, this.alpha * mesh.visibility);
                    // Misc
                    this._lightingInfos.x = this._directIntensity;
                    this._lightingInfos.y = this._emissiveIntensity;
                    this._lightingInfos.z = this._environmentIntensity;
                    this._lightingInfos.w = this._specularIntensity;
                    this._uniformBuffer.updateVector4("vLightingIntensity", this._lightingInfos);
                }
                // Textures
                if (scene.texturesEnabled) {
                    if (this._albedoTexture && LIB.StandardMaterial.DiffuseTextureEnabled) {
                        this._uniformBuffer.setTexture("albedoSampler", this._albedoTexture);
                    }
                    if (this._ambientTexture && LIB.StandardMaterial.AmbientTextureEnabled) {
                        this._uniformBuffer.setTexture("ambientSampler", this._ambientTexture);
                    }
                    if (this._opacityTexture && LIB.StandardMaterial.OpacityTextureEnabled) {
                        this._uniformBuffer.setTexture("opacitySampler", this._opacityTexture);
                    }
                    if (reflectionTexture && LIB.StandardMaterial.ReflectionTextureEnabled) {
                        if (defines.LODBASEDMICROSFURACE) {
                            this._uniformBuffer.setTexture("reflectionSampler", reflectionTexture);
                        }
                        else {
                            this._uniformBuffer.setTexture("reflectionSampler", reflectionTexture._lodTextureMid || reflectionTexture);
                            this._uniformBuffer.setTexture("reflectionSamplerLow", reflectionTexture._lodTextureLow || reflectionTexture);
                            this._uniformBuffer.setTexture("reflectionSamplerHigh", reflectionTexture._lodTextureHigh || reflectionTexture);
                        }
                    }
                    if (defines.ENVIRONMENTBRDF) {
                        this._uniformBuffer.setTexture("environmentBrdfSampler", this._environmentBRDFTexture);
                    }
                    if (refractionTexture && LIB.StandardMaterial.RefractionTextureEnabled) {
                        if (defines.LODBASEDMICROSFURACE) {
                            this._uniformBuffer.setTexture("refractionSampler", refractionTexture);
                        }
                        else {
                            this._uniformBuffer.setTexture("refractionSampler", refractionTexture._lodTextureMid || refractionTexture);
                            this._uniformBuffer.setTexture("refractionSamplerLow", refractionTexture._lodTextureLow || refractionTexture);
                            this._uniformBuffer.setTexture("refractionSamplerHigh", refractionTexture._lodTextureHigh || refractionTexture);
                        }
                    }
                    if (this._emissiveTexture && LIB.StandardMaterial.EmissiveTextureEnabled) {
                        this._uniformBuffer.setTexture("emissiveSampler", this._emissiveTexture);
                    }
                    if (this._lightmapTexture && LIB.StandardMaterial.LightmapTextureEnabled) {
                        this._uniformBuffer.setTexture("lightmapSampler", this._lightmapTexture);
                    }
                    if (LIB.StandardMaterial.SpecularTextureEnabled) {
                        if (this._metallicTexture) {
                            this._uniformBuffer.setTexture("reflectivitySampler", this._metallicTexture);
                        }
                        else if (this._reflectivityTexture) {
                            this._uniformBuffer.setTexture("reflectivitySampler", this._reflectivityTexture);
                        }
                        if (this._microSurfaceTexture) {
                            this._uniformBuffer.setTexture("microSurfaceSampler", this._microSurfaceTexture);
                        }
                    }
                    if (this._bumpTexture && scene.getEngine().getCaps().standardDerivatives && LIB.StandardMaterial.BumpTextureEnabled && !this._disableBumpMap) {
                        this._uniformBuffer.setTexture("bumpSampler", this._bumpTexture);
                    }
                }
                // Clip plane
                LIB.MaterialHelper.BindClipPlane(this._activeEffect, scene);
                // Colors
                scene.ambientColor.multiplyToRef(this._ambientColor, this._globalAmbientColor);
                var eyePosition = scene._forcedViewPosition ? scene._forcedViewPosition : (scene._mirroredCameraPosition ? scene._mirroredCameraPosition : scene.activeCamera.globalPosition);
                var invertNormal = (scene.useRightHandedSystem === (scene._mirroredCameraPosition != null));
                effect.setFloat4("vEyePosition", eyePosition.x, eyePosition.y, eyePosition.z, invertNormal ? -1 : 1);
                effect.setColor3("vAmbientColor", this._globalAmbientColor);
            }
            if (mustRebind || !this.isFrozen) {
                // Lights
                if (scene.lightsEnabled && !this._disableLighting) {
                    LIB.MaterialHelper.BindLights(scene, mesh, this._activeEffect, defines, this._maxSimultaneousLights, this._usePhysicalLightFalloff);
                }
                // View
                if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== LIB.Scene.FOGMODE_NONE || reflectionTexture) {
                    this.bindView(effect);
                }
                // Fog
                LIB.MaterialHelper.BindFogParameters(scene, mesh, this._activeEffect);
                // Morph targets
                if (defines.NUM_MORPH_INFLUENCERS) {
                    LIB.MaterialHelper.BindMorphTargetParameters(mesh, this._activeEffect);
                }
                // image processing
                this._imageProcessingConfiguration.bind(this._activeEffect);
                // Log. depth
                LIB.MaterialHelper.BindLogDepth(defines, this._activeEffect, scene);
            }
            this._uniformBuffer.update();
            this._afterBind(mesh);
        };
        PBRBaseMaterial.prototype.getAnimatables = function () {
            var results = [];
            if (this._albedoTexture && this._albedoTexture.animations && this._albedoTexture.animations.length > 0) {
                results.push(this._albedoTexture);
            }
            if (this._ambientTexture && this._ambientTexture.animations && this._ambientTexture.animations.length > 0) {
                results.push(this._ambientTexture);
            }
            if (this._opacityTexture && this._opacityTexture.animations && this._opacityTexture.animations.length > 0) {
                results.push(this._opacityTexture);
            }
            if (this._reflectionTexture && this._reflectionTexture.animations && this._reflectionTexture.animations.length > 0) {
                results.push(this._reflectionTexture);
            }
            if (this._emissiveTexture && this._emissiveTexture.animations && this._emissiveTexture.animations.length > 0) {
                results.push(this._emissiveTexture);
            }
            if (this._metallicTexture && this._metallicTexture.animations && this._metallicTexture.animations.length > 0) {
                results.push(this._metallicTexture);
            }
            else if (this._reflectivityTexture && this._reflectivityTexture.animations && this._reflectivityTexture.animations.length > 0) {
                results.push(this._reflectivityTexture);
            }
            if (this._bumpTexture && this._bumpTexture.animations && this._bumpTexture.animations.length > 0) {
                results.push(this._bumpTexture);
            }
            if (this._lightmapTexture && this._lightmapTexture.animations && this._lightmapTexture.animations.length > 0) {
                results.push(this._lightmapTexture);
            }
            if (this._refractionTexture && this._refractionTexture.animations && this._refractionTexture.animations.length > 0) {
                results.push(this._refractionTexture);
            }
            return results;
        };
        PBRBaseMaterial.prototype._getReflectionTexture = function () {
            if (this._reflectionTexture) {
                return this._reflectionTexture;
            }
            return this.getScene().environmentTexture;
        };
        PBRBaseMaterial.prototype._getRefractionTexture = function () {
            if (this._refractionTexture) {
                return this._refractionTexture;
            }
            if (this._linkRefractionWithTransparency) {
                return this.getScene().environmentTexture;
            }
            return null;
        };
        PBRBaseMaterial.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures) {
            if (forceDisposeTextures) {
                if (this._albedoTexture) {
                    this._albedoTexture.dispose();
                }
                if (this._ambientTexture) {
                    this._ambientTexture.dispose();
                }
                if (this._opacityTexture) {
                    this._opacityTexture.dispose();
                }
                if (this._reflectionTexture) {
                    this._reflectionTexture.dispose();
                }
                if (this._environmentBRDFTexture && this.getScene()._environmentBRDFTexture !== this._environmentBRDFTexture) {
                    this._environmentBRDFTexture.dispose();
                }
                if (this._emissiveTexture) {
                    this._emissiveTexture.dispose();
                }
                if (this._metallicTexture) {
                    this._metallicTexture.dispose();
                }
                if (this._reflectivityTexture) {
                    this._reflectivityTexture.dispose();
                }
                if (this._bumpTexture) {
                    this._bumpTexture.dispose();
                }
                if (this._lightmapTexture) {
                    this._lightmapTexture.dispose();
                }
                if (this._refractionTexture) {
                    this._refractionTexture.dispose();
                }
            }
            this._renderTargets.dispose();
            if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
                this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
            }
            _super.prototype.dispose.call(this, forceDisposeEffect, forceDisposeTextures);
        };
        PBRBaseMaterial._scaledReflectivity = new LIB.Color3();
        __decorate([
            LIB.serializeAsImageProcessingConfiguration()
        ], PBRBaseMaterial.prototype, "_imageProcessingConfiguration", void 0);
        __decorate([
            LIB.serialize()
        ], PBRBaseMaterial.prototype, "useLogarithmicDepth", null);
        __decorate([
            LIB.serialize()
        ], PBRBaseMaterial.prototype, "transparencyMode", null);
        return PBRBaseMaterial;
    }(LIB.PushMaterial));
    LIB.PBRBaseMaterial = PBRBaseMaterial;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.pbrBaseMaterial.js.map
