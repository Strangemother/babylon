






var LIB;
(function (LIB) {
    /** @hidden */
    var StandardMaterialDefines = /** @class */ (function (_super) {
        __extends(StandardMaterialDefines, _super);
        function StandardMaterialDefines() {
            var _this = _super.call(this) || this;
            _this.MAINUV1 = false;
            _this.MAINUV2 = false;
            _this.DIFFUSE = false;
            _this.DIFFUSEDIRECTUV = 0;
            _this.AMBIENT = false;
            _this.AMBIENTDIRECTUV = 0;
            _this.OPACITY = false;
            _this.OPACITYDIRECTUV = 0;
            _this.OPACITYRGB = false;
            _this.REFLECTION = false;
            _this.EMISSIVE = false;
            _this.EMISSIVEDIRECTUV = 0;
            _this.SPECULAR = false;
            _this.SPECULARDIRECTUV = 0;
            _this.BUMP = false;
            _this.BUMPDIRECTUV = 0;
            _this.PARALLAX = false;
            _this.PARALLAXOCCLUSION = false;
            _this.SPECULAROVERALPHA = false;
            _this.CLIPPLANE = false;
            _this.ALPHATEST = false;
            _this.DEPTHPREPASS = false;
            _this.ALPHAFROMDIFFUSE = false;
            _this.POINTSIZE = false;
            _this.FOG = false;
            _this.SPECULARTERM = false;
            _this.DIFFUSEFRESNEL = false;
            _this.OPACITYFRESNEL = false;
            _this.REFLECTIONFRESNEL = false;
            _this.REFRACTIONFRESNEL = false;
            _this.EMISSIVEFRESNEL = false;
            _this.FRESNEL = false;
            _this.NORMAL = false;
            _this.UV1 = false;
            _this.UV2 = false;
            _this.VERTEXCOLOR = false;
            _this.VERTEXALPHA = false;
            _this.NUM_BONE_INFLUENCERS = 0;
            _this.BonesPerMesh = 0;
            _this.INSTANCES = false;
            _this.GLOSSINESS = false;
            _this.ROUGHNESS = false;
            _this.EMISSIVEASILLUMINATION = false;
            _this.LINKEMISSIVEWITHDIFFUSE = false;
            _this.REFLECTIONFRESNELFROMSPECULAR = false;
            _this.LIGHTMAP = false;
            _this.LIGHTMAPDIRECTUV = 0;
            _this.OBJECTSPACE_NORMALMAP = false;
            _this.USELIGHTMAPASSHADOWMAP = false;
            _this.REFLECTIONMAP_3D = false;
            _this.REFLECTIONMAP_SPHERICAL = false;
            _this.REFLECTIONMAP_PLANAR = false;
            _this.REFLECTIONMAP_CUBIC = false;
            _this.USE_LOCAL_REFLECTIONMAP_CUBIC = false;
            _this.REFLECTIONMAP_PROJECTION = false;
            _this.REFLECTIONMAP_SKYBOX = false;
            _this.REFLECTIONMAP_EXPLICIT = false;
            _this.REFLECTIONMAP_EQUIRECTANGULAR = false;
            _this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
            _this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
            _this.INVERTCUBICMAP = false;
            _this.LOGARITHMICDEPTH = false;
            _this.REFRACTION = false;
            _this.REFRACTIONMAP_3D = false;
            _this.REFLECTIONOVERALPHA = false;
            _this.TWOSIDEDLIGHTING = false;
            _this.SHADOWFLOAT = false;
            _this.MORPHTARGETS = false;
            _this.MORPHTARGETS_NORMAL = false;
            _this.MORPHTARGETS_TANGENT = false;
            _this.NUM_MORPH_INFLUENCERS = 0;
            _this.NONUNIFORMSCALING = false; // https://playground.LIBjs.com#V6DWIH
            _this.PREMULTIPLYALPHA = false; // https://playground.LIBjs.com#LNVJJ7
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
            /**
             * If the reflection texture on this material is in linear color space
             * @hidden
             */
            _this.IS_REFLECTION_LINEAR = false;
            /**
             * If the refraction texture on this material is in linear color space
             * @hidden
             */
            _this.IS_REFRACTION_LINEAR = false;
            _this.EXPOSURE = false;
            _this.rebuild();
            return _this;
        }
        StandardMaterialDefines.prototype.setReflectionMode = function (modeToEnable) {
            var modes = [
                "REFLECTIONMAP_CUBIC", "REFLECTIONMAP_EXPLICIT", "REFLECTIONMAP_PLANAR",
                "REFLECTIONMAP_PROJECTION", "REFLECTIONMAP_PROJECTION", "REFLECTIONMAP_SKYBOX",
                "REFLECTIONMAP_SPHERICAL", "REFLECTIONMAP_EQUIRECTANGULAR", "REFLECTIONMAP_EQUIRECTANGULAR_FIXED",
                "REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED"
            ];
            for (var _i = 0, modes_1 = modes; _i < modes_1.length; _i++) {
                var mode = modes_1[_i];
                this[mode] = (mode === modeToEnable);
            }
        };
        return StandardMaterialDefines;
    }(LIB.MaterialDefines));
    LIB.StandardMaterialDefines = StandardMaterialDefines;
    var StandardMaterial = /** @class */ (function (_super) {
        __extends(StandardMaterial, _super);
        function StandardMaterial(name, scene) {
            var _this = _super.call(this, name, scene) || this;
            _this.ambientColor = new LIB.Color3(0, 0, 0);
            _this.diffuseColor = new LIB.Color3(1, 1, 1);
            _this.specularColor = new LIB.Color3(1, 1, 1);
            _this.emissiveColor = new LIB.Color3(0, 0, 0);
            _this.specularPower = 64;
            _this._useAlphaFromDiffuseTexture = false;
            _this._useEmissiveAsIllumination = false;
            _this._linkEmissiveWithDiffuse = false;
            _this._useSpecularOverAlpha = false;
            _this._useReflectionOverAlpha = false;
            _this._disableLighting = false;
            _this._useObjectSpaceNormalMap = false;
            _this._useParallax = false;
            _this._useParallaxOcclusion = false;
            _this.parallaxScaleBias = 0.05;
            _this._roughness = 0;
            _this.indexOfRefraction = 0.98;
            _this.invertRefractionY = true;
            /**
             * Defines the alpha limits in alpha test mode
             */
            _this.alphaCutOff = 0.4;
            _this._useLightmapAsShadowmap = false;
            _this._useReflectionFresnelFromSpecular = false;
            _this._useGlossinessFromSpecularMapAlpha = false;
            _this._maxSimultaneousLights = 4;
            /**
             * If sets to true, x component of normal map value will invert (x = 1.0 - x).
             */
            _this._invertNormalMapX = false;
            /**
             * If sets to true, y component of normal map value will invert (y = 1.0 - y).
             */
            _this._invertNormalMapY = false;
            /**
             * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
             */
            _this._twoSidedLighting = false;
            _this._renderTargets = new LIB.SmartArray(16);
            _this._worldViewProjectionMatrix = LIB.Matrix.Zero();
            _this._globalAmbientColor = new LIB.Color3(0, 0, 0);
            // Setup the default processing configuration to the scene.
            _this._attachImageProcessingConfiguration(null);
            _this.getRenderTargetTextures = function () {
                _this._renderTargets.reset();
                if (StandardMaterial.ReflectionTextureEnabled && _this._reflectionTexture && _this._reflectionTexture.isRenderTarget) {
                    _this._renderTargets.push(_this._reflectionTexture);
                }
                if (StandardMaterial.RefractionTextureEnabled && _this._refractionTexture && _this._refractionTexture.isRenderTarget) {
                    _this._renderTargets.push(_this._refractionTexture);
                }
                return _this._renderTargets;
            };
            return _this;
        }
        Object.defineProperty(StandardMaterial.prototype, "imageProcessingConfiguration", {
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
        /**
         * Attaches a new image processing configuration to the Standard Material.
         * @param configuration
         */
        StandardMaterial.prototype._attachImageProcessingConfiguration = function (configuration) {
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
        Object.defineProperty(StandardMaterial.prototype, "cameraColorCurvesEnabled", {
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
        Object.defineProperty(StandardMaterial.prototype, "cameraColorGradingEnabled", {
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
        Object.defineProperty(StandardMaterial.prototype, "cameraToneMappingEnabled", {
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
        Object.defineProperty(StandardMaterial.prototype, "cameraExposure", {
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
        Object.defineProperty(StandardMaterial.prototype, "cameraContrast", {
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
        Object.defineProperty(StandardMaterial.prototype, "cameraColorGradingTexture", {
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
        Object.defineProperty(StandardMaterial.prototype, "cameraColorCurves", {
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
        StandardMaterial.prototype.getClassName = function () {
            return "StandardMaterial";
        };
        Object.defineProperty(StandardMaterial.prototype, "useLogarithmicDepth", {
            get: function () {
                return this._useLogarithmicDepth;
            },
            set: function (value) {
                this._useLogarithmicDepth = value && this.getScene().getEngine().getCaps().fragmentDepthSupported;
                this._markAllSubMeshesAsMiscDirty();
            },
            enumerable: true,
            configurable: true
        });
        StandardMaterial.prototype.needAlphaBlending = function () {
            return (this.alpha < 1.0) || (this._opacityTexture != null) || this._shouldUseAlphaFromDiffuseTexture() || this._opacityFresnelParameters && this._opacityFresnelParameters.isEnabled;
        };
        StandardMaterial.prototype.needAlphaTesting = function () {
            return this._diffuseTexture != null && this._diffuseTexture.hasAlpha;
        };
        StandardMaterial.prototype._shouldUseAlphaFromDiffuseTexture = function () {
            return this._diffuseTexture != null && this._diffuseTexture.hasAlpha && this._useAlphaFromDiffuseTexture;
        };
        StandardMaterial.prototype.getAlphaTestTexture = function () {
            return this._diffuseTexture;
        };
        /**
         * Child classes can use it to update shaders
         */
        StandardMaterial.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
            if (useInstances === void 0) { useInstances = false; }
            if (subMesh.effect && this.isFrozen) {
                if (this._wasPreviouslyReady && subMesh.effect) {
                    return true;
                }
            }
            if (!subMesh._materialDefines) {
                subMesh._materialDefines = new StandardMaterialDefines();
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
            defines._needNormals = LIB.MaterialHelper.PrepareDefinesForLights(scene, mesh, defines, true, this._maxSimultaneousLights, this._disableLighting);
            // Textures
            if (defines._areTexturesDirty) {
                defines._needUVs = false;
                defines.MAINUV1 = false;
                defines.MAINUV2 = false;
                if (scene.texturesEnabled) {
                    if (this._diffuseTexture && StandardMaterial.DiffuseTextureEnabled) {
                        if (!this._diffuseTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        else {
                            LIB.MaterialHelper.PrepareDefinesForMergedUV(this._diffuseTexture, defines, "DIFFUSE");
                        }
                    }
                    else {
                        defines.DIFFUSE = false;
                    }
                    if (this._ambientTexture && StandardMaterial.AmbientTextureEnabled) {
                        if (!this._ambientTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        else {
                            LIB.MaterialHelper.PrepareDefinesForMergedUV(this._ambientTexture, defines, "AMBIENT");
                        }
                    }
                    else {
                        defines.AMBIENT = false;
                    }
                    if (this._opacityTexture && StandardMaterial.OpacityTextureEnabled) {
                        if (!this._opacityTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        else {
                            LIB.MaterialHelper.PrepareDefinesForMergedUV(this._opacityTexture, defines, "OPACITY");
                            defines.OPACITYRGB = this._opacityTexture.getAlphaFromRGB;
                        }
                    }
                    else {
                        defines.OPACITY = false;
                    }
                    if (this._reflectionTexture && StandardMaterial.ReflectionTextureEnabled) {
                        if (!this._reflectionTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        else {
                            defines._needNormals = true;
                            defines.REFLECTION = true;
                            defines.ROUGHNESS = (this._roughness > 0);
                            defines.REFLECTIONOVERALPHA = this._useReflectionOverAlpha;
                            defines.INVERTCUBICMAP = (this._reflectionTexture.coordinatesMode === LIB.Texture.INVCUBIC_MODE);
                            defines.REFLECTIONMAP_3D = this._reflectionTexture.isCube;
                            switch (this._reflectionTexture.coordinatesMode) {
                                case LIB.Texture.EXPLICIT_MODE:
                                    defines.setReflectionMode("REFLECTIONMAP_EXPLICIT");
                                    break;
                                case LIB.Texture.PLANAR_MODE:
                                    defines.setReflectionMode("REFLECTIONMAP_PLANAR");
                                    break;
                                case LIB.Texture.PROJECTION_MODE:
                                    defines.setReflectionMode("REFLECTIONMAP_PROJECTION");
                                    break;
                                case LIB.Texture.SKYBOX_MODE:
                                    defines.setReflectionMode("REFLECTIONMAP_SKYBOX");
                                    break;
                                case LIB.Texture.SPHERICAL_MODE:
                                    defines.setReflectionMode("REFLECTIONMAP_SPHERICAL");
                                    break;
                                case LIB.Texture.EQUIRECTANGULAR_MODE:
                                    defines.setReflectionMode("REFLECTIONMAP_EQUIRECTANGULAR");
                                    break;
                                case LIB.Texture.FIXED_EQUIRECTANGULAR_MODE:
                                    defines.setReflectionMode("REFLECTIONMAP_EQUIRECTANGULAR_FIXED");
                                    break;
                                case LIB.Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE:
                                    defines.setReflectionMode("REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED");
                                    break;
                                case LIB.Texture.CUBIC_MODE:
                                case LIB.Texture.INVCUBIC_MODE:
                                default:
                                    defines.setReflectionMode("REFLECTIONMAP_CUBIC");
                                    break;
                            }
                            defines.USE_LOCAL_REFLECTIONMAP_CUBIC = this._reflectionTexture.boundingBoxSize ? true : false;
                        }
                    }
                    else {
                        defines.REFLECTION = false;
                    }
                    if (this._emissiveTexture && StandardMaterial.EmissiveTextureEnabled) {
                        if (!this._emissiveTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        else {
                            LIB.MaterialHelper.PrepareDefinesForMergedUV(this._emissiveTexture, defines, "EMISSIVE");
                        }
                    }
                    else {
                        defines.EMISSIVE = false;
                    }
                    if (this._lightmapTexture && StandardMaterial.LightmapTextureEnabled) {
                        if (!this._lightmapTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        else {
                            LIB.MaterialHelper.PrepareDefinesForMergedUV(this._lightmapTexture, defines, "LIGHTMAP");
                            defines.USELIGHTMAPASSHADOWMAP = this._useLightmapAsShadowmap;
                        }
                    }
                    else {
                        defines.LIGHTMAP = false;
                    }
                    if (this._specularTexture && StandardMaterial.SpecularTextureEnabled) {
                        if (!this._specularTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        else {
                            LIB.MaterialHelper.PrepareDefinesForMergedUV(this._specularTexture, defines, "SPECULAR");
                            defines.GLOSSINESS = this._useGlossinessFromSpecularMapAlpha;
                        }
                    }
                    else {
                        defines.SPECULAR = false;
                    }
                    if (scene.getEngine().getCaps().standardDerivatives && this._bumpTexture && StandardMaterial.BumpTextureEnabled) {
                        // Bump texure can not be not blocking.
                        if (!this._bumpTexture.isReady()) {
                            return false;
                        }
                        else {
                            LIB.MaterialHelper.PrepareDefinesForMergedUV(this._bumpTexture, defines, "BUMP");
                            defines.PARALLAX = this._useParallax;
                            defines.PARALLAXOCCLUSION = this._useParallaxOcclusion;
                        }
                        defines.OBJECTSPACE_NORMALMAP = this._useObjectSpaceNormalMap;
                    }
                    else {
                        defines.BUMP = false;
                    }
                    if (this._refractionTexture && StandardMaterial.RefractionTextureEnabled) {
                        if (!this._refractionTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        else {
                            defines._needUVs = true;
                            defines.REFRACTION = true;
                            defines.REFRACTIONMAP_3D = this._refractionTexture.isCube;
                        }
                    }
                    else {
                        defines.REFRACTION = false;
                    }
                    defines.TWOSIDEDLIGHTING = !this._backFaceCulling && this._twoSidedLighting;
                }
                else {
                    defines.DIFFUSE = false;
                    defines.AMBIENT = false;
                    defines.OPACITY = false;
                    defines.REFLECTION = false;
                    defines.EMISSIVE = false;
                    defines.LIGHTMAP = false;
                    defines.BUMP = false;
                    defines.REFRACTION = false;
                }
                defines.ALPHAFROMDIFFUSE = this._shouldUseAlphaFromDiffuseTexture();
                defines.EMISSIVEASILLUMINATION = this._useEmissiveAsIllumination;
                defines.LINKEMISSIVEWITHDIFFUSE = this._linkEmissiveWithDiffuse;
                defines.SPECULAROVERALPHA = this._useSpecularOverAlpha;
                defines.PREMULTIPLYALPHA = (this.alphaMode === LIB.Engine.ALPHA_PREMULTIPLIED || this.alphaMode === LIB.Engine.ALPHA_PREMULTIPLIED_PORTERDUFF);
            }
            if (defines._areImageProcessingDirty) {
                if (!this._imageProcessingConfiguration.isReady()) {
                    return false;
                }
                this._imageProcessingConfiguration.prepareDefines(defines);
                defines.IS_REFLECTION_LINEAR = (this.reflectionTexture != null && !this.reflectionTexture.gammaSpace);
                defines.IS_REFRACTION_LINEAR = (this.refractionTexture != null && !this.refractionTexture.gammaSpace);
            }
            if (defines._areFresnelDirty) {
                if (StandardMaterial.FresnelEnabled) {
                    // Fresnel
                    if (this._diffuseFresnelParameters || this._opacityFresnelParameters ||
                        this._emissiveFresnelParameters || this._refractionFresnelParameters ||
                        this._reflectionFresnelParameters) {
                        defines.DIFFUSEFRESNEL = (this._diffuseFresnelParameters && this._diffuseFresnelParameters.isEnabled);
                        defines.OPACITYFRESNEL = (this._opacityFresnelParameters && this._opacityFresnelParameters.isEnabled);
                        defines.REFLECTIONFRESNEL = (this._reflectionFresnelParameters && this._reflectionFresnelParameters.isEnabled);
                        defines.REFLECTIONFRESNELFROMSPECULAR = this._useReflectionFresnelFromSpecular;
                        defines.REFRACTIONFRESNEL = (this._refractionFresnelParameters && this._refractionFresnelParameters.isEnabled);
                        defines.EMISSIVEFRESNEL = (this._emissiveFresnelParameters && this._emissiveFresnelParameters.isEnabled);
                        defines._needNormals = true;
                        defines.FRESNEL = true;
                    }
                }
                else {
                    defines.FRESNEL = false;
                }
            }
            // Misc.
            LIB.MaterialHelper.PrepareDefinesForMisc(mesh, scene, this._useLogarithmicDepth, this.pointsCloud, this.fogEnabled, this._shouldTurnAlphaTestOn(mesh), defines);
            // Attribs
            LIB.MaterialHelper.PrepareDefinesForAttributes(mesh, defines, true, true, true);
            // Values that need to be evaluated on every frame
            LIB.MaterialHelper.PrepareDefinesForFrameBoundValues(scene, engine, defines, useInstances);
            // Get correct effect      
            if (defines.isDirty) {
                defines.markAsProcessed();
                scene.resetCachedMaterial();
                // Fallbacks
                var fallbacks = new LIB.EffectFallbacks();
                if (defines.REFLECTION) {
                    fallbacks.addFallback(0, "REFLECTION");
                }
                if (defines.SPECULAR) {
                    fallbacks.addFallback(0, "SPECULAR");
                }
                if (defines.BUMP) {
                    fallbacks.addFallback(0, "BUMP");
                }
                if (defines.PARALLAX) {
                    fallbacks.addFallback(1, "PARALLAX");
                }
                if (defines.PARALLAXOCCLUSION) {
                    fallbacks.addFallback(0, "PARALLAXOCCLUSION");
                }
                if (defines.SPECULAROVERALPHA) {
                    fallbacks.addFallback(0, "SPECULAROVERALPHA");
                }
                if (defines.FOG) {
                    fallbacks.addFallback(1, "FOG");
                }
                if (defines.POINTSIZE) {
                    fallbacks.addFallback(0, "POINTSIZE");
                }
                if (defines.LOGARITHMICDEPTH) {
                    fallbacks.addFallback(0, "LOGARITHMICDEPTH");
                }
                LIB.MaterialHelper.HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights);
                if (defines.SPECULARTERM) {
                    fallbacks.addFallback(0, "SPECULARTERM");
                }
                if (defines.DIFFUSEFRESNEL) {
                    fallbacks.addFallback(1, "DIFFUSEFRESNEL");
                }
                if (defines.OPACITYFRESNEL) {
                    fallbacks.addFallback(2, "OPACITYFRESNEL");
                }
                if (defines.REFLECTIONFRESNEL) {
                    fallbacks.addFallback(3, "REFLECTIONFRESNEL");
                }
                if (defines.EMISSIVEFRESNEL) {
                    fallbacks.addFallback(4, "EMISSIVEFRESNEL");
                }
                if (defines.FRESNEL) {
                    fallbacks.addFallback(4, "FRESNEL");
                }
                //Attributes
                var attribs = [LIB.VertexBuffer.PositionKind];
                if (defines.NORMAL) {
                    attribs.push(LIB.VertexBuffer.NormalKind);
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
                var shaderName = "default";
                var uniforms = ["world", "view", "viewProjection", "vEyePosition", "vLightsType", "vAmbientColor", "vDiffuseColor", "vSpecularColor", "vEmissiveColor",
                    "vFogInfos", "vFogColor", "pointSize",
                    "vDiffuseInfos", "vAmbientInfos", "vOpacityInfos", "vReflectionInfos", "vEmissiveInfos", "vSpecularInfos", "vBumpInfos", "vLightmapInfos", "vRefractionInfos",
                    "mBones",
                    "vClipPlane", "diffuseMatrix", "ambientMatrix", "opacityMatrix", "reflectionMatrix", "emissiveMatrix", "specularMatrix", "bumpMatrix", "normalMatrix", "lightmapMatrix", "refractionMatrix",
                    "diffuseLeftColor", "diffuseRightColor", "opacityParts", "reflectionLeftColor", "reflectionRightColor", "emissiveLeftColor", "emissiveRightColor", "refractionLeftColor", "refractionRightColor",
                    "vReflectionPosition", "vReflectionSize",
                    "logarithmicDepthConstant", "vTangentSpaceParams", "alphaCutOff"
                ];
                var samplers = ["diffuseSampler", "ambientSampler", "opacitySampler", "reflectionCubeSampler", "reflection2DSampler", "emissiveSampler", "specularSampler", "bumpSampler", "lightmapSampler", "refractionCubeSampler", "refraction2DSampler"];
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
                if (this.customShaderNameResolve) {
                    shaderName = this.customShaderNameResolve(shaderName, uniforms, uniformBuffers, samplers, defines);
                }
                var join = defines.toString();
                subMesh.setEffect(scene.getEngine().createEffect(shaderName, {
                    attributes: attribs,
                    uniformsNames: uniforms,
                    uniformBuffersNames: uniformBuffers,
                    samplers: samplers,
                    defines: join,
                    fallbacks: fallbacks,
                    onCompiled: this.onCompiled,
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
        StandardMaterial.prototype.buildUniformLayout = function () {
            // Order is important !
            this._uniformBuffer.addUniform("diffuseLeftColor", 4);
            this._uniformBuffer.addUniform("diffuseRightColor", 4);
            this._uniformBuffer.addUniform("opacityParts", 4);
            this._uniformBuffer.addUniform("reflectionLeftColor", 4);
            this._uniformBuffer.addUniform("reflectionRightColor", 4);
            this._uniformBuffer.addUniform("refractionLeftColor", 4);
            this._uniformBuffer.addUniform("refractionRightColor", 4);
            this._uniformBuffer.addUniform("emissiveLeftColor", 4);
            this._uniformBuffer.addUniform("emissiveRightColor", 4);
            this._uniformBuffer.addUniform("vDiffuseInfos", 2);
            this._uniformBuffer.addUniform("vAmbientInfos", 2);
            this._uniformBuffer.addUniform("vOpacityInfos", 2);
            this._uniformBuffer.addUniform("vReflectionInfos", 2);
            this._uniformBuffer.addUniform("vReflectionPosition", 3);
            this._uniformBuffer.addUniform("vReflectionSize", 3);
            this._uniformBuffer.addUniform("vEmissiveInfos", 2);
            this._uniformBuffer.addUniform("vLightmapInfos", 2);
            this._uniformBuffer.addUniform("vSpecularInfos", 2);
            this._uniformBuffer.addUniform("vBumpInfos", 3);
            this._uniformBuffer.addUniform("diffuseMatrix", 16);
            this._uniformBuffer.addUniform("ambientMatrix", 16);
            this._uniformBuffer.addUniform("opacityMatrix", 16);
            this._uniformBuffer.addUniform("reflectionMatrix", 16);
            this._uniformBuffer.addUniform("emissiveMatrix", 16);
            this._uniformBuffer.addUniform("lightmapMatrix", 16);
            this._uniformBuffer.addUniform("specularMatrix", 16);
            this._uniformBuffer.addUniform("bumpMatrix", 16);
            this._uniformBuffer.addUniform("vTangentSpaceParams", 2);
            this._uniformBuffer.addUniform("refractionMatrix", 16);
            this._uniformBuffer.addUniform("vRefractionInfos", 4);
            this._uniformBuffer.addUniform("vSpecularColor", 4);
            this._uniformBuffer.addUniform("vEmissiveColor", 3);
            this._uniformBuffer.addUniform("vDiffuseColor", 4);
            this._uniformBuffer.addUniform("pointSize", 1);
            this._uniformBuffer.create();
        };
        StandardMaterial.prototype.unbind = function () {
            if (this._activeEffect) {
                var needFlag = false;
                if (this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                    this._activeEffect.setTexture("reflection2DSampler", null);
                    needFlag = true;
                }
                if (this._refractionTexture && this._refractionTexture.isRenderTarget) {
                    this._activeEffect.setTexture("refraction2DSampler", null);
                    needFlag = true;
                }
                if (needFlag) {
                    this._markAllSubMeshesAsTexturesDirty();
                }
            }
            _super.prototype.unbind.call(this);
        };
        StandardMaterial.prototype.bindForSubMesh = function (world, mesh, subMesh) {
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
            // Normal Matrix
            if (defines.OBJECTSPACE_NORMALMAP) {
                world.toNormalMatrix(this._normalMatrix);
                this.bindOnlyNormalMatrix(this._normalMatrix);
            }
            var mustRebind = this._mustRebind(scene, effect, mesh.visibility);
            // Bones
            LIB.MaterialHelper.BindBonesParameters(mesh, effect);
            if (mustRebind) {
                this._uniformBuffer.bindToEffect(effect, "Material");
                this.bindViewProjection(effect);
                if (!this._uniformBuffer.useUbo || !this.isFrozen || !this._uniformBuffer.isSync) {
                    if (StandardMaterial.FresnelEnabled && defines.FRESNEL) {
                        // Fresnel
                        if (this.diffuseFresnelParameters && this.diffuseFresnelParameters.isEnabled) {
                            this._uniformBuffer.updateColor4("diffuseLeftColor", this.diffuseFresnelParameters.leftColor, this.diffuseFresnelParameters.power);
                            this._uniformBuffer.updateColor4("diffuseRightColor", this.diffuseFresnelParameters.rightColor, this.diffuseFresnelParameters.bias);
                        }
                        if (this.opacityFresnelParameters && this.opacityFresnelParameters.isEnabled) {
                            this._uniformBuffer.updateColor4("opacityParts", new LIB.Color3(this.opacityFresnelParameters.leftColor.toLuminance(), this.opacityFresnelParameters.rightColor.toLuminance(), this.opacityFresnelParameters.bias), this.opacityFresnelParameters.power);
                        }
                        if (this.reflectionFresnelParameters && this.reflectionFresnelParameters.isEnabled) {
                            this._uniformBuffer.updateColor4("reflectionLeftColor", this.reflectionFresnelParameters.leftColor, this.reflectionFresnelParameters.power);
                            this._uniformBuffer.updateColor4("reflectionRightColor", this.reflectionFresnelParameters.rightColor, this.reflectionFresnelParameters.bias);
                        }
                        if (this.refractionFresnelParameters && this.refractionFresnelParameters.isEnabled) {
                            this._uniformBuffer.updateColor4("refractionLeftColor", this.refractionFresnelParameters.leftColor, this.refractionFresnelParameters.power);
                            this._uniformBuffer.updateColor4("refractionRightColor", this.refractionFresnelParameters.rightColor, this.refractionFresnelParameters.bias);
                        }
                        if (this.emissiveFresnelParameters && this.emissiveFresnelParameters.isEnabled) {
                            this._uniformBuffer.updateColor4("emissiveLeftColor", this.emissiveFresnelParameters.leftColor, this.emissiveFresnelParameters.power);
                            this._uniformBuffer.updateColor4("emissiveRightColor", this.emissiveFresnelParameters.rightColor, this.emissiveFresnelParameters.bias);
                        }
                    }
                    // Textures     
                    if (scene.texturesEnabled) {
                        if (this._diffuseTexture && StandardMaterial.DiffuseTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vDiffuseInfos", this._diffuseTexture.coordinatesIndex, this._diffuseTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._diffuseTexture, this._uniformBuffer, "diffuse");
                            if (this._diffuseTexture.hasAlpha) {
                                effect.setFloat("alphaCutOff", this.alphaCutOff);
                            }
                        }
                        if (this._ambientTexture && StandardMaterial.AmbientTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vAmbientInfos", this._ambientTexture.coordinatesIndex, this._ambientTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._ambientTexture, this._uniformBuffer, "ambient");
                        }
                        if (this._opacityTexture && StandardMaterial.OpacityTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vOpacityInfos", this._opacityTexture.coordinatesIndex, this._opacityTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._opacityTexture, this._uniformBuffer, "opacity");
                        }
                        if (this._reflectionTexture && StandardMaterial.ReflectionTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vReflectionInfos", this._reflectionTexture.level, this.roughness);
                            this._uniformBuffer.updateMatrix("reflectionMatrix", this._reflectionTexture.getReflectionTextureMatrix());
                            if (this._reflectionTexture.boundingBoxSize) {
                                var cubeTexture = this._reflectionTexture;
                                this._uniformBuffer.updateVector3("vReflectionPosition", cubeTexture.boundingBoxPosition);
                                this._uniformBuffer.updateVector3("vReflectionSize", cubeTexture.boundingBoxSize);
                            }
                        }
                        if (this._emissiveTexture && StandardMaterial.EmissiveTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vEmissiveInfos", this._emissiveTexture.coordinatesIndex, this._emissiveTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._emissiveTexture, this._uniformBuffer, "emissive");
                        }
                        if (this._lightmapTexture && StandardMaterial.LightmapTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vLightmapInfos", this._lightmapTexture.coordinatesIndex, this._lightmapTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._lightmapTexture, this._uniformBuffer, "lightmap");
                        }
                        if (this._specularTexture && StandardMaterial.SpecularTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vSpecularInfos", this._specularTexture.coordinatesIndex, this._specularTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._specularTexture, this._uniformBuffer, "specular");
                        }
                        if (this._bumpTexture && scene.getEngine().getCaps().standardDerivatives && StandardMaterial.BumpTextureEnabled) {
                            this._uniformBuffer.updateFloat3("vBumpInfos", this._bumpTexture.coordinatesIndex, 1.0 / this._bumpTexture.level, this.parallaxScaleBias);
                            LIB.MaterialHelper.BindTextureMatrix(this._bumpTexture, this._uniformBuffer, "bump");
                            if (scene._mirroredCameraPosition) {
                                this._uniformBuffer.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? 1.0 : -1.0, this._invertNormalMapY ? 1.0 : -1.0);
                            }
                            else {
                                this._uniformBuffer.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? -1.0 : 1.0, this._invertNormalMapY ? -1.0 : 1.0);
                            }
                        }
                        if (this._refractionTexture && StandardMaterial.RefractionTextureEnabled) {
                            var depth = 1.0;
                            if (!this._refractionTexture.isCube) {
                                this._uniformBuffer.updateMatrix("refractionMatrix", this._refractionTexture.getReflectionTextureMatrix());
                                if (this._refractionTexture.depth) {
                                    depth = this._refractionTexture.depth;
                                }
                            }
                            this._uniformBuffer.updateFloat4("vRefractionInfos", this._refractionTexture.level, this.indexOfRefraction, depth, this.invertRefractionY ? -1 : 1);
                        }
                    }
                    // Point size
                    if (this.pointsCloud) {
                        this._uniformBuffer.updateFloat("pointSize", this.pointSize);
                    }
                    if (defines.SPECULARTERM) {
                        this._uniformBuffer.updateColor4("vSpecularColor", this.specularColor, this.specularPower);
                    }
                    this._uniformBuffer.updateColor3("vEmissiveColor", this.emissiveColor);
                    // Diffuse
                    this._uniformBuffer.updateColor4("vDiffuseColor", this.diffuseColor, this.alpha * mesh.visibility);
                }
                // Textures     
                if (scene.texturesEnabled) {
                    if (this._diffuseTexture && StandardMaterial.DiffuseTextureEnabled) {
                        effect.setTexture("diffuseSampler", this._diffuseTexture);
                    }
                    if (this._ambientTexture && StandardMaterial.AmbientTextureEnabled) {
                        effect.setTexture("ambientSampler", this._ambientTexture);
                    }
                    if (this._opacityTexture && StandardMaterial.OpacityTextureEnabled) {
                        effect.setTexture("opacitySampler", this._opacityTexture);
                    }
                    if (this._reflectionTexture && StandardMaterial.ReflectionTextureEnabled) {
                        if (this._reflectionTexture.isCube) {
                            effect.setTexture("reflectionCubeSampler", this._reflectionTexture);
                        }
                        else {
                            effect.setTexture("reflection2DSampler", this._reflectionTexture);
                        }
                    }
                    if (this._emissiveTexture && StandardMaterial.EmissiveTextureEnabled) {
                        effect.setTexture("emissiveSampler", this._emissiveTexture);
                    }
                    if (this._lightmapTexture && StandardMaterial.LightmapTextureEnabled) {
                        effect.setTexture("lightmapSampler", this._lightmapTexture);
                    }
                    if (this._specularTexture && StandardMaterial.SpecularTextureEnabled) {
                        effect.setTexture("specularSampler", this._specularTexture);
                    }
                    if (this._bumpTexture && scene.getEngine().getCaps().standardDerivatives && StandardMaterial.BumpTextureEnabled) {
                        effect.setTexture("bumpSampler", this._bumpTexture);
                    }
                    if (this._refractionTexture && StandardMaterial.RefractionTextureEnabled) {
                        var depth = 1.0;
                        if (this._refractionTexture.isCube) {
                            effect.setTexture("refractionCubeSampler", this._refractionTexture);
                        }
                        else {
                            effect.setTexture("refraction2DSampler", this._refractionTexture);
                        }
                    }
                }
                // Clip plane
                LIB.MaterialHelper.BindClipPlane(effect, scene);
                // Colors
                scene.ambientColor.multiplyToRef(this.ambientColor, this._globalAmbientColor);
                LIB.MaterialHelper.BindEyePosition(effect, scene);
                effect.setColor3("vAmbientColor", this._globalAmbientColor);
            }
            if (mustRebind || !this.isFrozen) {
                // Lights
                if (scene.lightsEnabled && !this._disableLighting) {
                    LIB.MaterialHelper.BindLights(scene, mesh, effect, defines, this._maxSimultaneousLights);
                }
                // View
                if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== LIB.Scene.FOGMODE_NONE || this._reflectionTexture || this._refractionTexture) {
                    this.bindView(effect);
                }
                // Fog
                LIB.MaterialHelper.BindFogParameters(scene, mesh, effect);
                // Morph targets
                if (defines.NUM_MORPH_INFLUENCERS) {
                    LIB.MaterialHelper.BindMorphTargetParameters(mesh, effect);
                }
                // Log. depth
                LIB.MaterialHelper.BindLogDepth(defines, effect, scene);
                // image processing
                if (!this._imageProcessingConfiguration.applyByPostProcess) {
                    this._imageProcessingConfiguration.bind(this._activeEffect);
                }
            }
            this._uniformBuffer.update();
            this._afterBind(mesh, this._activeEffect);
        };
        StandardMaterial.prototype.getAnimatables = function () {
            var results = [];
            if (this._diffuseTexture && this._diffuseTexture.animations && this._diffuseTexture.animations.length > 0) {
                results.push(this._diffuseTexture);
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
            if (this._specularTexture && this._specularTexture.animations && this._specularTexture.animations.length > 0) {
                results.push(this._specularTexture);
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
        StandardMaterial.prototype.getActiveTextures = function () {
            var activeTextures = _super.prototype.getActiveTextures.call(this);
            if (this._diffuseTexture) {
                activeTextures.push(this._diffuseTexture);
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
            if (this._specularTexture) {
                activeTextures.push(this._specularTexture);
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
        StandardMaterial.prototype.hasTexture = function (texture) {
            if (_super.prototype.hasTexture.call(this, texture)) {
                return true;
            }
            if (this._diffuseTexture === texture) {
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
            if (this._emissiveTexture === texture) {
                return true;
            }
            if (this._specularTexture === texture) {
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
        StandardMaterial.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures) {
            if (forceDisposeTextures) {
                if (this._diffuseTexture) {
                    this._diffuseTexture.dispose();
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
                if (this._emissiveTexture) {
                    this._emissiveTexture.dispose();
                }
                if (this._specularTexture) {
                    this._specularTexture.dispose();
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
            if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
                this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
            }
            _super.prototype.dispose.call(this, forceDisposeEffect, forceDisposeTextures);
        };
        StandardMaterial.prototype.clone = function (name) {
            var _this = this;
            var result = LIB.SerializationHelper.Clone(function () { return new StandardMaterial(name, _this.getScene()); }, this);
            result.name = name;
            result.id = name;
            return result;
        };
        StandardMaterial.prototype.serialize = function () {
            return LIB.SerializationHelper.Serialize(this);
        };
        // Statics
        StandardMaterial.Parse = function (source, scene, rootUrl) {
            return LIB.SerializationHelper.Parse(function () { return new StandardMaterial(source.name, scene); }, source, scene, rootUrl);
        };
        Object.defineProperty(StandardMaterial, "DiffuseTextureEnabled", {
            get: function () {
                return StandardMaterial._DiffuseTextureEnabled;
            },
            set: function (value) {
                if (StandardMaterial._DiffuseTextureEnabled === value) {
                    return;
                }
                StandardMaterial._DiffuseTextureEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardMaterial, "AmbientTextureEnabled", {
            get: function () {
                return StandardMaterial._AmbientTextureEnabled;
            },
            set: function (value) {
                if (StandardMaterial._AmbientTextureEnabled === value) {
                    return;
                }
                StandardMaterial._AmbientTextureEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardMaterial, "OpacityTextureEnabled", {
            get: function () {
                return StandardMaterial._OpacityTextureEnabled;
            },
            set: function (value) {
                if (StandardMaterial._OpacityTextureEnabled === value) {
                    return;
                }
                StandardMaterial._OpacityTextureEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardMaterial, "ReflectionTextureEnabled", {
            get: function () {
                return StandardMaterial._ReflectionTextureEnabled;
            },
            set: function (value) {
                if (StandardMaterial._ReflectionTextureEnabled === value) {
                    return;
                }
                StandardMaterial._ReflectionTextureEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardMaterial, "EmissiveTextureEnabled", {
            get: function () {
                return StandardMaterial._EmissiveTextureEnabled;
            },
            set: function (value) {
                if (StandardMaterial._EmissiveTextureEnabled === value) {
                    return;
                }
                StandardMaterial._EmissiveTextureEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardMaterial, "SpecularTextureEnabled", {
            get: function () {
                return StandardMaterial._SpecularTextureEnabled;
            },
            set: function (value) {
                if (StandardMaterial._SpecularTextureEnabled === value) {
                    return;
                }
                StandardMaterial._SpecularTextureEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardMaterial, "BumpTextureEnabled", {
            get: function () {
                return StandardMaterial._BumpTextureEnabled;
            },
            set: function (value) {
                if (StandardMaterial._BumpTextureEnabled === value) {
                    return;
                }
                StandardMaterial._BumpTextureEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardMaterial, "LightmapTextureEnabled", {
            get: function () {
                return StandardMaterial._LightmapTextureEnabled;
            },
            set: function (value) {
                if (StandardMaterial._LightmapTextureEnabled === value) {
                    return;
                }
                StandardMaterial._LightmapTextureEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardMaterial, "RefractionTextureEnabled", {
            get: function () {
                return StandardMaterial._RefractionTextureEnabled;
            },
            set: function (value) {
                if (StandardMaterial._RefractionTextureEnabled === value) {
                    return;
                }
                StandardMaterial._RefractionTextureEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardMaterial, "ColorGradingTextureEnabled", {
            get: function () {
                return StandardMaterial._ColorGradingTextureEnabled;
            },
            set: function (value) {
                if (StandardMaterial._ColorGradingTextureEnabled === value) {
                    return;
                }
                StandardMaterial._ColorGradingTextureEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandardMaterial, "FresnelEnabled", {
            get: function () {
                return StandardMaterial._FresnelEnabled;
            },
            set: function (value) {
                if (StandardMaterial._FresnelEnabled === value) {
                    return;
                }
                StandardMaterial._FresnelEnabled = value;
                LIB.Engine.MarkAllMaterialsAsDirty(LIB.Material.FresnelDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        // Flags used to enable or disable a type of texture for all Standard Materials
        StandardMaterial._DiffuseTextureEnabled = true;
        StandardMaterial._AmbientTextureEnabled = true;
        StandardMaterial._OpacityTextureEnabled = true;
        StandardMaterial._ReflectionTextureEnabled = true;
        StandardMaterial._EmissiveTextureEnabled = true;
        StandardMaterial._SpecularTextureEnabled = true;
        StandardMaterial._BumpTextureEnabled = true;
        StandardMaterial._LightmapTextureEnabled = true;
        StandardMaterial._RefractionTextureEnabled = true;
        StandardMaterial._ColorGradingTextureEnabled = true;
        StandardMaterial._FresnelEnabled = true;
        __decorate([
            LIB.serializeAsTexture("diffuseTexture")
        ], StandardMaterial.prototype, "_diffuseTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
        ], StandardMaterial.prototype, "diffuseTexture", void 0);
        __decorate([
            LIB.serializeAsTexture("ambientTexture")
        ], StandardMaterial.prototype, "_ambientTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "ambientTexture", void 0);
        __decorate([
            LIB.serializeAsTexture("opacityTexture")
        ], StandardMaterial.prototype, "_opacityTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
        ], StandardMaterial.prototype, "opacityTexture", void 0);
        __decorate([
            LIB.serializeAsTexture("reflectionTexture")
        ], StandardMaterial.prototype, "_reflectionTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "reflectionTexture", void 0);
        __decorate([
            LIB.serializeAsTexture("emissiveTexture")
        ], StandardMaterial.prototype, "_emissiveTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "emissiveTexture", void 0);
        __decorate([
            LIB.serializeAsTexture("specularTexture")
        ], StandardMaterial.prototype, "_specularTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "specularTexture", void 0);
        __decorate([
            LIB.serializeAsTexture("bumpTexture")
        ], StandardMaterial.prototype, "_bumpTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "bumpTexture", void 0);
        __decorate([
            LIB.serializeAsTexture("lightmapTexture")
        ], StandardMaterial.prototype, "_lightmapTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "lightmapTexture", void 0);
        __decorate([
            LIB.serializeAsTexture("refractionTexture")
        ], StandardMaterial.prototype, "_refractionTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "refractionTexture", void 0);
        __decorate([
            LIB.serializeAsColor3("ambient")
        ], StandardMaterial.prototype, "ambientColor", void 0);
        __decorate([
            LIB.serializeAsColor3("diffuse")
        ], StandardMaterial.prototype, "diffuseColor", void 0);
        __decorate([
            LIB.serializeAsColor3("specular")
        ], StandardMaterial.prototype, "specularColor", void 0);
        __decorate([
            LIB.serializeAsColor3("emissive")
        ], StandardMaterial.prototype, "emissiveColor", void 0);
        __decorate([
            LIB.serialize()
        ], StandardMaterial.prototype, "specularPower", void 0);
        __decorate([
            LIB.serialize("useAlphaFromDiffuseTexture")
        ], StandardMaterial.prototype, "_useAlphaFromDiffuseTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "useAlphaFromDiffuseTexture", void 0);
        __decorate([
            LIB.serialize("useEmissiveAsIllumination")
        ], StandardMaterial.prototype, "_useEmissiveAsIllumination", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "useEmissiveAsIllumination", void 0);
        __decorate([
            LIB.serialize("linkEmissiveWithDiffuse")
        ], StandardMaterial.prototype, "_linkEmissiveWithDiffuse", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "linkEmissiveWithDiffuse", void 0);
        __decorate([
            LIB.serialize("useSpecularOverAlpha")
        ], StandardMaterial.prototype, "_useSpecularOverAlpha", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "useSpecularOverAlpha", void 0);
        __decorate([
            LIB.serialize("useReflectionOverAlpha")
        ], StandardMaterial.prototype, "_useReflectionOverAlpha", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "useReflectionOverAlpha", void 0);
        __decorate([
            LIB.serialize("disableLighting")
        ], StandardMaterial.prototype, "_disableLighting", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], StandardMaterial.prototype, "disableLighting", void 0);
        __decorate([
            LIB.serialize("useObjectSpaceNormalMap")
        ], StandardMaterial.prototype, "_useObjectSpaceNormalMap", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "useObjectSpaceNormalMap", void 0);
        __decorate([
            LIB.serialize("useParallax")
        ], StandardMaterial.prototype, "_useParallax", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "useParallax", void 0);
        __decorate([
            LIB.serialize("useParallaxOcclusion")
        ], StandardMaterial.prototype, "_useParallaxOcclusion", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "useParallaxOcclusion", void 0);
        __decorate([
            LIB.serialize()
        ], StandardMaterial.prototype, "parallaxScaleBias", void 0);
        __decorate([
            LIB.serialize("roughness")
        ], StandardMaterial.prototype, "_roughness", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "roughness", void 0);
        __decorate([
            LIB.serialize()
        ], StandardMaterial.prototype, "indexOfRefraction", void 0);
        __decorate([
            LIB.serialize()
        ], StandardMaterial.prototype, "invertRefractionY", void 0);
        __decorate([
            LIB.serialize()
        ], StandardMaterial.prototype, "alphaCutOff", void 0);
        __decorate([
            LIB.serialize("useLightmapAsShadowmap")
        ], StandardMaterial.prototype, "_useLightmapAsShadowmap", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "useLightmapAsShadowmap", void 0);
        __decorate([
            LIB.serializeAsFresnelParameters("diffuseFresnelParameters")
        ], StandardMaterial.prototype, "_diffuseFresnelParameters", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsFresnelDirty")
        ], StandardMaterial.prototype, "diffuseFresnelParameters", void 0);
        __decorate([
            LIB.serializeAsFresnelParameters("opacityFresnelParameters")
        ], StandardMaterial.prototype, "_opacityFresnelParameters", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsFresnelAndMiscDirty")
        ], StandardMaterial.prototype, "opacityFresnelParameters", void 0);
        __decorate([
            LIB.serializeAsFresnelParameters("reflectionFresnelParameters")
        ], StandardMaterial.prototype, "_reflectionFresnelParameters", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsFresnelDirty")
        ], StandardMaterial.prototype, "reflectionFresnelParameters", void 0);
        __decorate([
            LIB.serializeAsFresnelParameters("refractionFresnelParameters")
        ], StandardMaterial.prototype, "_refractionFresnelParameters", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsFresnelDirty")
        ], StandardMaterial.prototype, "refractionFresnelParameters", void 0);
        __decorate([
            LIB.serializeAsFresnelParameters("emissiveFresnelParameters")
        ], StandardMaterial.prototype, "_emissiveFresnelParameters", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsFresnelDirty")
        ], StandardMaterial.prototype, "emissiveFresnelParameters", void 0);
        __decorate([
            LIB.serialize("useReflectionFresnelFromSpecular")
        ], StandardMaterial.prototype, "_useReflectionFresnelFromSpecular", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsFresnelDirty")
        ], StandardMaterial.prototype, "useReflectionFresnelFromSpecular", void 0);
        __decorate([
            LIB.serialize("useGlossinessFromSpecularMapAlpha")
        ], StandardMaterial.prototype, "_useGlossinessFromSpecularMapAlpha", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "useGlossinessFromSpecularMapAlpha", void 0);
        __decorate([
            LIB.serialize("maxSimultaneousLights")
        ], StandardMaterial.prototype, "_maxSimultaneousLights", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], StandardMaterial.prototype, "maxSimultaneousLights", void 0);
        __decorate([
            LIB.serialize("invertNormalMapX")
        ], StandardMaterial.prototype, "_invertNormalMapX", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "invertNormalMapX", void 0);
        __decorate([
            LIB.serialize("invertNormalMapY")
        ], StandardMaterial.prototype, "_invertNormalMapY", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "invertNormalMapY", void 0);
        __decorate([
            LIB.serialize("twoSidedLighting")
        ], StandardMaterial.prototype, "_twoSidedLighting", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], StandardMaterial.prototype, "twoSidedLighting", void 0);
        __decorate([
            LIB.serialize()
        ], StandardMaterial.prototype, "useLogarithmicDepth", null);
        return StandardMaterial;
    }(LIB.PushMaterial));
    LIB.StandardMaterial = StandardMaterial;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.standardMaterial.js.map
//# sourceMappingURL=LIB.standardMaterial.js.map
