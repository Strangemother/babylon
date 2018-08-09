(function (LIB) {
    /**
     * Background material defines definition.
     */
    var BackgroundMaterialDefines = /** @class */ (function (_super) {
        __extends(BackgroundMaterialDefines, _super);
        /**
         * Constructor of the defines.
         */
        function BackgroundMaterialDefines() {
            var _this = _super.call(this) || this;
            /**
             * True if the diffuse texture is in use.
             */
            _this.DIFFUSE = false;
            /**
             * The direct UV channel to use.
             */
            _this.DIFFUSEDIRECTUV = 0;
            /**
             * True if the diffuse texture is in gamma space.
             */
            _this.GAMMADIFFUSE = false;
            /**
             * True if the diffuse texture has opacity in the alpha channel.
             */
            _this.DIFFUSEHASALPHA = false;
            /**
             * True if you want the material to fade to transparent at grazing angle.
             */
            _this.OPACITYFRESNEL = false;
            /**
             * True if an extra blur needs to be added in the reflection.
             */
            _this.REFLECTIONBLUR = false;
            /**
             * True if you want the material to fade to reflection at grazing angle.
             */
            _this.REFLECTIONFRESNEL = false;
            /**
             * True if you want the material to falloff as far as you move away from the scene center.
             */
            _this.REFLECTIONFALLOFF = false;
            /**
             * False if the current Webgl implementation does not support the texture lod extension.
             */
            _this.TEXTURELODSUPPORT = false;
            /**
             * True to ensure the data are premultiplied.
             */
            _this.PREMULTIPLYALPHA = false;
            /**
             * True if the texture contains cooked RGB values and not gray scaled multipliers.
             */
            _this.USERGBCOLOR = false;
            /**
             * True to add noise in order to reduce the banding effect.
             */
            _this.NOISE = false;
            // Image Processing Configuration.
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
            // Reflection.
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
            _this.REFLECTIONMAP_OPPOSITEZ = false;
            _this.LODINREFLECTIONALPHA = false;
            _this.GAMMAREFLECTION = false;
            // Default BJS.
            _this.MAINUV1 = false;
            _this.MAINUV2 = false;
            _this.UV1 = false;
            _this.UV2 = false;
            _this.CLIPPLANE = false;
            _this.POINTSIZE = false;
            _this.FOG = false;
            _this.NORMAL = false;
            _this.NUM_BONE_INFLUENCERS = 0;
            _this.BonesPerMesh = 0;
            _this.INSTANCES = false;
            _this.SHADOWFLOAT = false;
            _this.rebuild();
            return _this;
        }
        return BackgroundMaterialDefines;
    }(LIB.MaterialDefines));
    /**
     * Background material used to create an efficient environement around your scene.
     */
    var BackgroundMaterial = /** @class */ (function (_super) {
        __extends(BackgroundMaterial, _super);
        /**
         * constructor
         * @param name The name of the material
         * @param scene The scene to add the material to
         */
        function BackgroundMaterial(name, scene) {
            var _this = _super.call(this, name, scene) || this;
            _this.primaryColor = LIB.Color3.White();
            _this.primaryLevel = 1;
            _this.secondaryColor = LIB.Color3.Gray();
            _this.secondaryLevel = 1;
            _this.tertiaryColor = LIB.Color3.Black();
            _this.tertiaryLevel = 1;
            _this.reflectionTexture = null;
            _this.reflectionBlur = 0;
            _this.diffuseTexture = null;
            /**
             * Specify the list of lights casting shadow on the material.
             * All scene shadow lights will be included if null.
             */
            _this._shadowLights = null;
            _this.shadowLights = null;
            _this.shadowBlurScale = 1;
            _this.shadowLevel = 0;
            _this.sceneCenter = LIB.Vector3.Zero();
            _this.opacityFresnel = true;
            _this.reflectionFresnel = false;
            _this.reflectionFalloffDistance = 0.0;
            _this.reflectionAmount = 1.0;
            _this.reflectionReflectance0 = 0.05;
            _this.reflectionReflectance90 = 0.5;
            _this.useRGBColor = true;
            _this.enableNoise = false;
            /**
             * Number of Simultaneous lights allowed on the material.
             */
            _this._maxSimultaneousLights = 4;
            _this.maxSimultaneousLights = 4;
            /**
             * Keep track of the image processing observer to allow dispose and replace.
             */
            _this._imageProcessingObserver = null;
            // Temp values kept as cache in the material.
            _this._renderTargets = new LIB.SmartArray(16);
            _this._reflectionControls = LIB.Vector4.Zero();
            // Setup the default processing configuration to the scene.
            _this._attachImageProcessingConfiguration(null);
            _this.getRenderTargetTextures = function () {
                _this._renderTargets.reset();
                if (_this._diffuseTexture && _this._diffuseTexture.isRenderTarget) {
                    _this._renderTargets.push(_this._diffuseTexture);
                }
                if (_this._reflectionTexture && _this._reflectionTexture.isRenderTarget) {
                    _this._renderTargets.push(_this._reflectionTexture);
                }
                return _this._renderTargets;
            };
            return _this;
        }
        Object.defineProperty(BackgroundMaterial.prototype, "reflectionStandardFresnelWeight", {
            /**
             * Sets the reflection reflectance fresnel values according to the default standard
             * empirically know to work well :-)
             */
            set: function (value) {
                var reflectionWeight = value;
                if (reflectionWeight < 0.5) {
                    reflectionWeight = reflectionWeight * 2.0;
                    this.reflectionReflectance0 = BackgroundMaterial.standardReflectance0 * reflectionWeight;
                    this.reflectionReflectance90 = BackgroundMaterial.standardReflectance90 * reflectionWeight;
                }
                else {
                    reflectionWeight = reflectionWeight * 2.0 - 1.0;
                    this.reflectionReflectance0 = BackgroundMaterial.standardReflectance0 + (1.0 - BackgroundMaterial.standardReflectance0) * reflectionWeight;
                    this.reflectionReflectance90 = BackgroundMaterial.standardReflectance90 + (1.0 - BackgroundMaterial.standardReflectance90) * reflectionWeight;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Attaches a new image processing configuration to the PBR Material.
         * @param configuration (if null the scene configuration will be use)
         */
        BackgroundMaterial.prototype._attachImageProcessingConfiguration = function (configuration) {
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
        Object.defineProperty(BackgroundMaterial.prototype, "imageProcessingConfiguration", {
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
        Object.defineProperty(BackgroundMaterial.prototype, "cameraColorCurvesEnabled", {
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
        Object.defineProperty(BackgroundMaterial.prototype, "cameraColorGradingEnabled", {
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
        Object.defineProperty(BackgroundMaterial.prototype, "cameraToneMappingEnabled", {
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
        Object.defineProperty(BackgroundMaterial.prototype, "cameraExposure", {
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
        Object.defineProperty(BackgroundMaterial.prototype, "cameraContrast", {
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
        Object.defineProperty(BackgroundMaterial.prototype, "cameraColorGradingTexture", {
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
                this.imageProcessingConfiguration.colorGradingTexture = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BackgroundMaterial.prototype, "cameraColorCurves", {
            /**
             * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
             * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
             * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
             * corresponding to low luminance, medium luminance, and high luminance areas respectively.
             */
            get: function () {
                return this.imageProcessingConfiguration.colorCurves;
            },
            /**
             * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
             * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
             * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
             * corresponding to low luminance, medium luminance, and high luminance areas respectively.
             */
            set: function (value) {
                this.imageProcessingConfiguration.colorCurves = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * The entire material has been created in order to prevent overdraw.
         * @returns false
         */
        BackgroundMaterial.prototype.needAlphaTesting = function () {
            return true;
        };
        /**
         * The entire material has been created in order to prevent overdraw.
         * @returns true if blending is enable
         */
        BackgroundMaterial.prototype.needAlphaBlending = function () {
            return ((this.alpha < 0) || (this._diffuseTexture != null && this._diffuseTexture.hasAlpha));
        };
        /**
         * Checks wether the material is ready to be rendered for a given mesh.
         * @param mesh The mesh to render
         * @param subMesh The submesh to check against
         * @param useInstances Specify wether or not the material is used with instances
         */
        BackgroundMaterial.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
            var _this = this;
            if (useInstances === void 0) { useInstances = false; }
            if (subMesh.effect && this.isFrozen) {
                if (this._wasPreviouslyReady) {
                    return true;
                }
            }
            if (!subMesh._materialDefines) {
                subMesh._materialDefines = new BackgroundMaterialDefines();
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
            LIB.MaterialHelper.PrepareDefinesForLights(scene, mesh, defines, false, this._maxSimultaneousLights);
            defines._needNormals = true;
            // Textures
            if (defines._areTexturesDirty) {
                defines._needUVs = false;
                if (scene.texturesEnabled) {
                    if (scene.getEngine().getCaps().textureLOD) {
                        defines.TEXTURELODSUPPORT = true;
                    }
                    if (this._diffuseTexture && LIB.StandardMaterial.DiffuseTextureEnabled) {
                        if (!this._diffuseTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        LIB.MaterialHelper.PrepareDefinesForMergedUV(this._diffuseTexture, defines, "DIFFUSE");
                        defines.DIFFUSEHASALPHA = this._diffuseTexture.hasAlpha;
                        defines.GAMMADIFFUSE = this._diffuseTexture.gammaSpace;
                        defines.OPACITYFRESNEL = this._opacityFresnel;
                    }
                    else {
                        defines.DIFFUSE = false;
                        defines.DIFFUSEHASALPHA = false;
                        defines.GAMMADIFFUSE = false;
                        defines.OPACITYFRESNEL = false;
                    }
                    var reflectionTexture = this._reflectionTexture;
                    if (reflectionTexture && LIB.StandardMaterial.ReflectionTextureEnabled) {
                        if (!reflectionTexture.isReadyOrNotBlocking()) {
                            return false;
                        }
                        defines.REFLECTION = true;
                        defines.GAMMAREFLECTION = reflectionTexture.gammaSpace;
                        defines.REFLECTIONBLUR = this._reflectionBlur > 0;
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
                        if (this.reflectionFresnel) {
                            defines.REFLECTIONFRESNEL = true;
                            defines.REFLECTIONFALLOFF = this.reflectionFalloffDistance > 0;
                            this._reflectionControls.x = this.reflectionAmount;
                            this._reflectionControls.y = this.reflectionReflectance0;
                            this._reflectionControls.z = this.reflectionReflectance90;
                            this._reflectionControls.w = 1 / this.reflectionFalloffDistance;
                        }
                        else {
                            defines.REFLECTIONFRESNEL = false;
                            defines.REFLECTIONFALLOFF = false;
                        }
                    }
                    else {
                        defines.REFLECTION = false;
                        defines.REFLECTIONFALLOFF = false;
                        defines.REFLECTIONBLUR = false;
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
                        defines.REFLECTIONMAP_OPPOSITEZ = false;
                        defines.LODINREFLECTIONALPHA = false;
                        defines.GAMMAREFLECTION = false;
                    }
                }
                defines.PREMULTIPLYALPHA = (this.alphaMode === LIB.Engine.ALPHA_PREMULTIPLIED || this.alphaMode === LIB.Engine.ALPHA_PREMULTIPLIED_PORTERDUFF);
                defines.USERGBCOLOR = this._useRGBColor;
                defines.NOISE = this._enableNoise;
            }
            if (defines._areImageProcessingDirty) {
                if (!this._imageProcessingConfiguration.isReady()) {
                    return false;
                }
                this._imageProcessingConfiguration.prepareDefines(defines);
            }
            // Misc.
            LIB.MaterialHelper.PrepareDefinesForMisc(mesh, scene, false, this.pointsCloud, this.fogEnabled, defines);
            // Values that need to be evaluated on every frame
            LIB.MaterialHelper.PrepareDefinesForFrameBoundValues(scene, engine, defines, useInstances, false);
            // Attribs
            if (LIB.MaterialHelper.PrepareDefinesForAttributes(mesh, defines, false, true, false)) {
                if (mesh) {
                    if (!scene.getEngine().getCaps().standardDerivatives && !mesh.isVerticesDataPresent(LIB.VertexBuffer.NormalKind)) {
                        mesh.createNormals(true);
                        LIB.Tools.Warn("BackgroundMaterial: Normals have been created for the mesh: " + mesh.name);
                    }
                }
            }
            // Get correct effect
            if (defines.isDirty) {
                defines.markAsProcessed();
                scene.resetCachedMaterial();
                // Fallbacks
                var fallbacks = new LIB.EffectFallbacks();
                if (defines.FOG) {
                    fallbacks.addFallback(0, "FOG");
                }
                if (defines.POINTSIZE) {
                    fallbacks.addFallback(1, "POINTSIZE");
                }
                LIB.MaterialHelper.HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights);
                if (defines.NUM_BONE_INFLUENCERS > 0) {
                    fallbacks.addCPUSkinningFallback(0, mesh);
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
                LIB.MaterialHelper.PrepareAttributesForBones(attribs, mesh, defines, fallbacks);
                LIB.MaterialHelper.PrepareAttributesForInstances(attribs, defines);
                var uniforms = ["world", "view", "viewProjection", "vEyePosition", "vLightsType",
                    "vFogInfos", "vFogColor", "pointSize",
                    "vClipPlane", "mBones",
                    "vPrimaryColor", "vSecondaryColor", "vTertiaryColor",
                    "vReflectionInfos", "reflectionMatrix", "vReflectionMicrosurfaceInfos",
                    "shadowLevel", "alpha",
                    "vBackgroundCenter", "vReflectionControl",
                    "vDiffuseInfos", "diffuseMatrix",
                ];
                var samplers = ["diffuseSampler", "reflectionSampler", "reflectionSamplerLow", "reflectionSamplerHigh"];
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
                subMesh.setEffect(scene.getEngine().createEffect("background", {
                    attributes: attribs,
                    uniformsNames: uniforms,
                    uniformBuffersNames: uniformBuffers,
                    samplers: samplers,
                    defines: join,
                    fallbacks: fallbacks,
                    onCompiled: onCompiled,
                    onError: this.onError,
                    indexParameters: { maxSimultaneousLights: this._maxSimultaneousLights }
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
        /**
         * Build the uniform buffer used in the material.
         */
        BackgroundMaterial.prototype.buildUniformLayout = function () {
            // Order is important !
            this._uniformBuffer.addUniform("vPrimaryColor", 4);
            this._uniformBuffer.addUniform("vSecondaryColor", 4);
            this._uniformBuffer.addUniform("vTertiaryColor", 4);
            this._uniformBuffer.addUniform("vDiffuseInfos", 2);
            this._uniformBuffer.addUniform("vReflectionInfos", 2);
            this._uniformBuffer.addUniform("diffuseMatrix", 16);
            this._uniformBuffer.addUniform("reflectionMatrix", 16);
            this._uniformBuffer.addUniform("vReflectionMicrosurfaceInfos", 3);
            this._uniformBuffer.addUniform("pointSize", 1);
            this._uniformBuffer.addUniform("shadowLevel", 1);
            this._uniformBuffer.addUniform("alpha", 1);
            this._uniformBuffer.addUniform("vBackgroundCenter", 3);
            this._uniformBuffer.addUniform("vReflectionControl", 4);
            this._uniformBuffer.create();
        };
        /**
         * Unbind the material.
         */
        BackgroundMaterial.prototype.unbind = function () {
            if (this._diffuseTexture && this._diffuseTexture.isRenderTarget) {
                this._uniformBuffer.setTexture("diffuseSampler", null);
            }
            if (this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                this._uniformBuffer.setTexture("reflectionSampler", null);
            }
            _super.prototype.unbind.call(this);
        };
        /**
         * Bind only the world matrix to the material.
         * @param world The world matrix to bind.
         */
        BackgroundMaterial.prototype.bindOnlyWorldMatrix = function (world) {
            this._activeEffect.setMatrix("world", world);
        };
        /**
         * Bind the material for a dedicated submeh (every used meshes will be considered opaque).
         * @param world The world matrix to bind.
         * @param subMesh The submesh to bind for.
         */
        BackgroundMaterial.prototype.bindForSubMesh = function (world, mesh, subMesh) {
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
            // Bones
            LIB.MaterialHelper.BindBonesParameters(mesh, this._activeEffect);
            var mustRebind = this._mustRebind(scene, effect, mesh.visibility);
            if (mustRebind) {
                this._uniformBuffer.bindToEffect(effect, "Material");
                this.bindViewProjection(effect);
                var reflectionTexture = this._reflectionTexture;
                if (!this._uniformBuffer.useUbo || !this.isFrozen || !this._uniformBuffer.isSync) {
                    // Texture uniforms
                    if (scene.texturesEnabled) {
                        if (this._diffuseTexture && LIB.StandardMaterial.DiffuseTextureEnabled) {
                            this._uniformBuffer.updateFloat2("vDiffuseInfos", this._diffuseTexture.coordinatesIndex, this._diffuseTexture.level);
                            LIB.MaterialHelper.BindTextureMatrix(this._diffuseTexture, this._uniformBuffer, "diffuse");
                        }
                        if (reflectionTexture && LIB.StandardMaterial.ReflectionTextureEnabled) {
                            this._uniformBuffer.updateMatrix("reflectionMatrix", reflectionTexture.getReflectionTextureMatrix());
                            this._uniformBuffer.updateFloat2("vReflectionInfos", reflectionTexture.level, this._reflectionBlur);
                            this._uniformBuffer.updateFloat3("vReflectionMicrosurfaceInfos", reflectionTexture.getSize().width, reflectionTexture.lodGenerationScale, reflectionTexture.lodGenerationOffset);
                        }
                    }
                    if (this.shadowLevel > 0) {
                        this._uniformBuffer.updateFloat("shadowLevel", this.shadowLevel);
                    }
                    this._uniformBuffer.updateFloat("alpha", this.alpha);
                    // Point size
                    if (this.pointsCloud) {
                        this._uniformBuffer.updateFloat("pointSize", this.pointSize);
                    }
                    this._uniformBuffer.updateColor4("vPrimaryColor", this._primaryColor, this._primaryLevel);
                    this._uniformBuffer.updateColor4("vSecondaryColor", this._secondaryColor, this._secondaryLevel);
                    this._uniformBuffer.updateColor4("vTertiaryColor", this._tertiaryColor, this._tertiaryLevel);
                }
                // Textures
                if (scene.texturesEnabled) {
                    if (this._diffuseTexture && LIB.StandardMaterial.DiffuseTextureEnabled) {
                        this._uniformBuffer.setTexture("diffuseSampler", this._diffuseTexture);
                    }
                    if (reflectionTexture && LIB.StandardMaterial.ReflectionTextureEnabled) {
                        if (defines.REFLECTIONBLUR && defines.TEXTURELODSUPPORT) {
                            this._uniformBuffer.setTexture("reflectionSampler", reflectionTexture);
                        }
                        else if (!defines.REFLECTIONBLUR) {
                            this._uniformBuffer.setTexture("reflectionSampler", reflectionTexture);
                        }
                        else {
                            this._uniformBuffer.setTexture("reflectionSampler", reflectionTexture._lodTextureMid || reflectionTexture);
                            this._uniformBuffer.setTexture("reflectionSamplerLow", reflectionTexture._lodTextureLow || reflectionTexture);
                            this._uniformBuffer.setTexture("reflectionSamplerHigh", reflectionTexture._lodTextureHigh || reflectionTexture);
                        }
                        if (defines.REFLECTIONFRESNEL) {
                            this._uniformBuffer.updateFloat3("vBackgroundCenter", this.sceneCenter.x, this.sceneCenter.y, this.sceneCenter.z);
                            this._uniformBuffer.updateFloat4("vReflectionControl", this._reflectionControls.x, this._reflectionControls.y, this._reflectionControls.z, this._reflectionControls.w);
                        }
                    }
                }
                // Clip plane
                LIB.MaterialHelper.BindClipPlane(this._activeEffect, scene);
                LIB.MaterialHelper.BindEyePosition(effect, scene);
            }
            if (mustRebind || !this.isFrozen) {
                if (scene.lightsEnabled) {
                    LIB.MaterialHelper.BindLights(scene, mesh, this._activeEffect, defines, this._maxSimultaneousLights, false);
                }
                // View
                this.bindView(effect);
                // Fog
                LIB.MaterialHelper.BindFogParameters(scene, mesh, this._activeEffect);
                // image processing
                this._imageProcessingConfiguration.bind(this._activeEffect);
            }
            this._uniformBuffer.update();
            this._afterBind(mesh);
        };
        /**
         * Dispose the material.
         * @forceDisposeEffect Force disposal of the associated effect.
         * @forceDisposeTextures Force disposal of the associated textures.
         */
        BackgroundMaterial.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures) {
            if (forceDisposeEffect === void 0) { forceDisposeEffect = false; }
            if (forceDisposeTextures === void 0) { forceDisposeTextures = false; }
            if (forceDisposeTextures) {
                if (this.diffuseTexture) {
                    this.diffuseTexture.dispose();
                }
                if (this.reflectionTexture) {
                    this.reflectionTexture.dispose();
                }
            }
            this._renderTargets.dispose();
            if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
                this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
            }
            _super.prototype.dispose.call(this, forceDisposeEffect);
        };
        /**
         * Clones the material.
         * @name The cloned name.
         * @returns The cloned material.
         */
        BackgroundMaterial.prototype.clone = function (name) {
            var _this = this;
            return LIB.SerializationHelper.Clone(function () { return new BackgroundMaterial(name, _this.getScene()); }, this);
        };
        /**
         * Serializes the current material to its JSON representation.
         * @returns The JSON representation.
         */
        BackgroundMaterial.prototype.serialize = function () {
            var serializationObject = LIB.SerializationHelper.Serialize(this);
            serializationObject.customType = "LIB.BackgroundMaterial";
            return serializationObject;
        };
        /**
         * Gets the class name of the material
         * @returns "BackgroundMaterial"
         */
        BackgroundMaterial.prototype.getClassName = function () {
            return "BackgroundMaterial";
        };
        /**
         * Parse a JSON input to create back a background material.
         * @param source
         * @param scene
         * @param rootUrl
         * @returns the instantiated BackgroundMaterial.
         */
        BackgroundMaterial.Parse = function (source, scene, rootUrl) {
            return LIB.SerializationHelper.Parse(function () { return new BackgroundMaterial(source.name, scene); }, source, scene, rootUrl);
        };
        /**
         * Standard reflectance value at parallel view angle.
         */
        BackgroundMaterial.standardReflectance0 = 0.05;
        /**
         * Standard reflectance value at grazing angle.
         */
        BackgroundMaterial.standardReflectance90 = 0.5;
        __decorate([
            LIB.serializeAsColor3()
        ], BackgroundMaterial.prototype, "_primaryColor", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], BackgroundMaterial.prototype, "primaryColor", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_primaryLevel", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], BackgroundMaterial.prototype, "primaryLevel", void 0);
        __decorate([
            LIB.serializeAsColor3()
        ], BackgroundMaterial.prototype, "_secondaryColor", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], BackgroundMaterial.prototype, "secondaryColor", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_secondaryLevel", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], BackgroundMaterial.prototype, "secondaryLevel", void 0);
        __decorate([
            LIB.serializeAsColor3()
        ], BackgroundMaterial.prototype, "_tertiaryColor", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], BackgroundMaterial.prototype, "tertiaryColor", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_tertiaryLevel", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsLightsDirty")
        ], BackgroundMaterial.prototype, "tertiaryLevel", void 0);
        __decorate([
            LIB.serializeAsTexture()
        ], BackgroundMaterial.prototype, "_reflectionTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "reflectionTexture", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_reflectionBlur", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "reflectionBlur", void 0);
        __decorate([
            LIB.serializeAsTexture()
        ], BackgroundMaterial.prototype, "_diffuseTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "diffuseTexture", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "shadowLights", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_shadowBlurScale", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "shadowBlurScale", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_shadowLevel", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "shadowLevel", void 0);
        __decorate([
            LIB.serializeAsVector3()
        ], BackgroundMaterial.prototype, "_sceneCenter", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "sceneCenter", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_opacityFresnel", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "opacityFresnel", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_reflectionFresnel", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "reflectionFresnel", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_reflectionFalloffDistance", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "reflectionFalloffDistance", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_reflectionAmount", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "reflectionAmount", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_reflectionReflectance0", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "reflectionReflectance0", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_reflectionReflectance90", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "reflectionReflectance90", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_useRGBColor", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "useRGBColor", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_enableNoise", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "enableNoise", void 0);
        __decorate([
            LIB.serialize()
        ], BackgroundMaterial.prototype, "_maxSimultaneousLights", void 0);
        __decorate([
            LIB.expandToProperty("_markAllSubMeshesAsTexturesDirty")
        ], BackgroundMaterial.prototype, "maxSimultaneousLights", void 0);
        __decorate([
            LIB.serializeAsImageProcessingConfiguration()
        ], BackgroundMaterial.prototype, "_imageProcessingConfiguration", void 0);
        return BackgroundMaterial;
    }(LIB.PushMaterial));
    LIB.BackgroundMaterial = BackgroundMaterial;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.backgroundMaterial.js.map
