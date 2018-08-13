
var LIB;
(function (LIB) {
    /**
     * "Static Class" containing the most commonly used helper while dealing with material for
     * rendering purpose.
     *
     * It contains the basic tools to help defining defines, binding uniform for the common part of the materials.
     *
     * This works by convention in LIBJS but is meant to be use only with shader following the in place naming rules and conventions.
     */
    var MaterialHelper = /** @class */ (function () {
        function MaterialHelper() {
        }
        /**
         * Bind the current view position to an effect.
         * @param effect The effect to be bound
         * @param scene The scene the eyes position is used from
         */
        MaterialHelper.BindEyePosition = function (effect, scene) {
            if (scene._forcedViewPosition) {
                effect.setVector3("vEyePosition", scene._forcedViewPosition);
                return;
            }
            effect.setVector3("vEyePosition", scene._mirroredCameraPosition ? scene._mirroredCameraPosition : scene.activeCamera.globalPosition);
        };
        /**
         * Helps preparing the defines values about the UVs in used in the effect.
         * UVs are shared as much as we can accross chanels in the shaders.
         * @param texture The texture we are preparing the UVs for
         * @param defines The defines to update
         * @param key The chanel key "diffuse", "specular"... used in the shader
         */
        MaterialHelper.PrepareDefinesForMergedUV = function (texture, defines, key) {
            defines._needUVs = true;
            defines[key] = true;
            if (texture.getTextureMatrix().isIdentity(true)) {
                defines[key + "DIRECTUV"] = texture.coordinatesIndex + 1;
                if (texture.coordinatesIndex === 0) {
                    defines["MAINUV1"] = true;
                }
                else {
                    defines["MAINUV2"] = true;
                }
            }
            else {
                defines[key + "DIRECTUV"] = 0;
            }
        };
        /**
         * Binds a texture matrix value to its corrsponding uniform
         * @param texture The texture to bind the matrix for
         * @param uniformBuffer The uniform buffer receivin the data
         * @param key The chanel key "diffuse", "specular"... used in the shader
         */
        MaterialHelper.BindTextureMatrix = function (texture, uniformBuffer, key) {
            var matrix = texture.getTextureMatrix();
            if (!matrix.isIdentity(true)) {
                uniformBuffer.updateMatrix(key + "Matrix", matrix);
            }
        };
        /**
         * Helper used to prepare the list of defines associated with misc. values for shader compilation
         * @param mesh defines the current mesh
         * @param scene defines the current scene
         * @param useLogarithmicDepth defines if logarithmic depth has to be turned on
         * @param pointsCloud defines if point cloud rendering has to be turned on
         * @param fogEnabled defines if fog has to be turned on
         * @param alphaTest defines if alpha testing has to be turned on
         * @param defines defines the current list of defines
         */
        MaterialHelper.PrepareDefinesForMisc = function (mesh, scene, useLogarithmicDepth, pointsCloud, fogEnabled, alphaTest, defines) {
            if (defines._areMiscDirty) {
                defines["LOGARITHMICDEPTH"] = useLogarithmicDepth;
                defines["POINTSIZE"] = pointsCloud;
                defines["FOG"] = (scene.fogEnabled && mesh.applyFog && scene.fogMode !== LIB.Scene.FOGMODE_NONE && fogEnabled);
                defines["NONUNIFORMSCALING"] = mesh.nonUniformScaling;
                defines["ALPHATEST"] = alphaTest;
            }
        };
        /**
         * Helper used to prepare the list of defines associated with frame values for shader compilation
         * @param scene defines the current scene
         * @param engine defines the current engine
         * @param defines specifies the list of active defines
         * @param useInstances defines if instances have to be turned on
         * @param useClipPlane defines if clip plane have to be turned on
         */
        MaterialHelper.PrepareDefinesForFrameBoundValues = function (scene, engine, defines, useInstances, useClipPlane) {
            if (useClipPlane === void 0) { useClipPlane = null; }
            var changed = false;
            if (useClipPlane == null) {
                useClipPlane = (scene.clipPlane !== undefined && scene.clipPlane !== null);
            }
            if (defines["CLIPPLANE"] !== useClipPlane) {
                defines["CLIPPLANE"] = useClipPlane;
                changed = true;
            }
            if (defines["DEPTHPREPASS"] !== !engine.getColorWrite()) {
                defines["DEPTHPREPASS"] = !defines["DEPTHPREPASS"];
                changed = true;
            }
            if (defines["INSTANCES"] !== useInstances) {
                defines["INSTANCES"] = useInstances;
                changed = true;
            }
            if (changed) {
                defines.markAsUnprocessed();
            }
        };
        /**
         * Prepares the defines used in the shader depending on the attributes data available in the mesh
         * @param mesh The mesh containing the geometry data we will draw
         * @param defines The defines to update
         * @param useVertexColor Precise whether vertex colors should be used or not (override mesh info)
         * @param useBones Precise whether bones should be used or not (override mesh info)
         * @param useMorphTargets Precise whether morph targets should be used or not (override mesh info)
         * @param useVertexAlpha Precise whether vertex alpha should be used or not (override mesh info)
         * @returns false if defines are considered not dirty and have not been checked
         */
        MaterialHelper.PrepareDefinesForAttributes = function (mesh, defines, useVertexColor, useBones, useMorphTargets, useVertexAlpha) {
            if (useMorphTargets === void 0) { useMorphTargets = false; }
            if (useVertexAlpha === void 0) { useVertexAlpha = true; }
            if (!defines._areAttributesDirty && defines._needNormals === defines._normals && defines._needUVs === defines._uvs) {
                return false;
            }
            defines._normals = defines._needNormals;
            defines._uvs = defines._needUVs;
            defines["NORMAL"] = (defines._needNormals && mesh.isVerticesDataPresent(LIB.VertexBuffer.NormalKind));
            if (defines._needNormals && mesh.isVerticesDataPresent(LIB.VertexBuffer.TangentKind)) {
                defines["TANGENT"] = true;
            }
            if (defines._needUVs) {
                defines["UV1"] = mesh.isVerticesDataPresent(LIB.VertexBuffer.UVKind);
                defines["UV2"] = mesh.isVerticesDataPresent(LIB.VertexBuffer.UV2Kind);
            }
            else {
                defines["UV1"] = false;
                defines["UV2"] = false;
            }
            if (useVertexColor) {
                var hasVertexColors = mesh.useVertexColors && mesh.isVerticesDataPresent(LIB.VertexBuffer.ColorKind);
                defines["VERTEXCOLOR"] = hasVertexColors;
                defines["VERTEXALPHA"] = mesh.hasVertexAlpha && hasVertexColors && useVertexAlpha;
            }
            if (useBones) {
                if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
                    defines["NUM_BONE_INFLUENCERS"] = mesh.numBoneInfluencers;
                    defines["BonesPerMesh"] = (mesh.skeleton.bones.length + 1);
                }
                else {
                    defines["NUM_BONE_INFLUENCERS"] = 0;
                    defines["BonesPerMesh"] = 0;
                }
            }
            if (useMorphTargets) {
                var manager = mesh.morphTargetManager;
                if (manager) {
                    defines["MORPHTARGETS_TANGENT"] = manager.supportsTangents && defines["TANGENT"];
                    defines["MORPHTARGETS_NORMAL"] = manager.supportsNormals && defines["NORMAL"];
                    defines["MORPHTARGETS"] = (manager.numInfluencers > 0);
                    defines["NUM_MORPH_INFLUENCERS"] = manager.numInfluencers;
                }
                else {
                    defines["MORPHTARGETS_TANGENT"] = false;
                    defines["MORPHTARGETS_NORMAL"] = false;
                    defines["MORPHTARGETS"] = false;
                    defines["NUM_MORPH_INFLUENCERS"] = 0;
                }
            }
            return true;
        };
        /**
         * Prepares the defines related to the light information passed in parameter
         * @param scene The scene we are intending to draw
         * @param mesh The mesh the effect is compiling for
         * @param defines The defines to update
         * @param specularSupported Specifies whether specular is supported or not (override lights data)
         * @param maxSimultaneousLights Specfies how manuy lights can be added to the effect at max
         * @param disableLighting Specifies whether the lighting is disabled (override scene and light)
         * @returns true if normals will be required for the rest of the effect
         */
        MaterialHelper.PrepareDefinesForLights = function (scene, mesh, defines, specularSupported, maxSimultaneousLights, disableLighting) {
            if (maxSimultaneousLights === void 0) { maxSimultaneousLights = 4; }
            if (disableLighting === void 0) { disableLighting = false; }
            if (!defines._areLightsDirty) {
                return defines._needNormals;
            }
            var lightIndex = 0;
            var needNormals = false;
            var needRebuild = false;
            var lightmapMode = false;
            var shadowEnabled = false;
            var specularEnabled = false;
            if (scene.lightsEnabled && !disableLighting) {
                for (var _i = 0, _a = mesh._lightSources; _i < _a.length; _i++) {
                    var light = _a[_i];
                    needNormals = true;
                    if (defines["LIGHT" + lightIndex] === undefined) {
                        needRebuild = true;
                    }
                    defines["LIGHT" + lightIndex] = true;
                    defines["SPOTLIGHT" + lightIndex] = false;
                    defines["HEMILIGHT" + lightIndex] = false;
                    defines["POINTLIGHT" + lightIndex] = false;
                    defines["DIRLIGHT" + lightIndex] = false;
                    var type;
                    if (light.getTypeID() === LIB.Light.LIGHTTYPEID_SPOTLIGHT) {
                        type = "SPOTLIGHT" + lightIndex;
                        var spotLight = light;
                        defines["PROJECTEDLIGHTTEXTURE" + lightIndex] = spotLight.projectionTexture ? true : false;
                    }
                    else if (light.getTypeID() === LIB.Light.LIGHTTYPEID_HEMISPHERICLIGHT) {
                        type = "HEMILIGHT" + lightIndex;
                    }
                    else if (light.getTypeID() === LIB.Light.LIGHTTYPEID_POINTLIGHT) {
                        type = "POINTLIGHT" + lightIndex;
                    }
                    else {
                        type = "DIRLIGHT" + lightIndex;
                    }
                    defines[type] = true;
                    // Specular
                    if (specularSupported && !light.specular.equalsFloats(0, 0, 0)) {
                        specularEnabled = true;
                    }
                    // Shadows
                    defines["SHADOW" + lightIndex] = false;
                    defines["SHADOWPCF" + lightIndex] = false;
                    defines["SHADOWPCSS" + lightIndex] = false;
                    defines["SHADOWPOISSON" + lightIndex] = false;
                    defines["SHADOWESM" + lightIndex] = false;
                    defines["SHADOWCUBE" + lightIndex] = false;
                    defines["SHADOWLOWQUALITY" + lightIndex] = false;
                    defines["SHADOWMEDIUMQUALITY" + lightIndex] = false;
                    if (mesh && mesh.receiveShadows && scene.shadowsEnabled && light.shadowEnabled) {
                        var shadowGenerator = light.getShadowGenerator();
                        if (shadowGenerator) {
                            shadowEnabled = true;
                            shadowGenerator.prepareDefines(defines, lightIndex);
                        }
                    }
                    if (light.lightmapMode != LIB.Light.LIGHTMAP_DEFAULT) {
                        lightmapMode = true;
                        defines["LIGHTMAPEXCLUDED" + lightIndex] = true;
                        defines["LIGHTMAPNOSPECULAR" + lightIndex] = (light.lightmapMode == LIB.Light.LIGHTMAP_SHADOWSONLY);
                    }
                    else {
                        defines["LIGHTMAPEXCLUDED" + lightIndex] = false;
                        defines["LIGHTMAPNOSPECULAR" + lightIndex] = false;
                    }
                    lightIndex++;
                    if (lightIndex === maxSimultaneousLights)
                        break;
                }
            }
            defines["SPECULARTERM"] = specularEnabled;
            defines["SHADOWS"] = shadowEnabled;
            // Resetting all other lights if any
            for (var index = lightIndex; index < maxSimultaneousLights; index++) {
                if (defines["LIGHT" + index] !== undefined) {
                    defines["LIGHT" + index] = false;
                    defines["HEMILIGHT" + lightIndex] = false;
                    defines["POINTLIGHT" + lightIndex] = false;
                    defines["DIRLIGHT" + lightIndex] = false;
                    defines["SPOTLIGHT" + lightIndex] = false;
                    defines["SHADOW" + lightIndex] = false;
                }
            }
            var caps = scene.getEngine().getCaps();
            if (defines["SHADOWFLOAT"] === undefined) {
                needRebuild = true;
            }
            defines["SHADOWFLOAT"] = shadowEnabled &&
                ((caps.textureFloatRender && caps.textureFloatLinearFiltering) ||
                    (caps.textureHalfFloatRender && caps.textureHalfFloatLinearFiltering));
            defines["LIGHTMAPEXCLUDED"] = lightmapMode;
            if (needRebuild) {
                defines.rebuild();
            }
            return needNormals;
        };
        /**
         * Prepares the uniforms and samplers list to be used in the effect. This can automatically remove from the list uniforms
         * that won t be acctive due to defines being turned off.
         * @param uniformsListOrOptions The uniform names to prepare or an EffectCreationOptions containing the liist and extra information
         * @param samplersList The samplers list
         * @param defines The defines helping in the list generation
         * @param maxSimultaneousLights The maximum number of simultanous light allowed in the effect
         */
        MaterialHelper.PrepareUniformsAndSamplersList = function (uniformsListOrOptions, samplersList, defines, maxSimultaneousLights) {
            if (maxSimultaneousLights === void 0) { maxSimultaneousLights = 4; }
            var uniformsList;
            var uniformBuffersList = null;
            if (uniformsListOrOptions.uniformsNames) {
                var options = uniformsListOrOptions;
                uniformsList = options.uniformsNames;
                uniformBuffersList = options.uniformBuffersNames;
                samplersList = options.samplers;
                defines = options.defines;
                maxSimultaneousLights = options.maxSimultaneousLights;
            }
            else {
                uniformsList = uniformsListOrOptions;
                if (!samplersList) {
                    samplersList = [];
                }
            }
            for (var lightIndex = 0; lightIndex < maxSimultaneousLights; lightIndex++) {
                if (!defines["LIGHT" + lightIndex]) {
                    break;
                }
                uniformsList.push("vLightData" + lightIndex, "vLightDiffuse" + lightIndex, "vLightSpecular" + lightIndex, "vLightDirection" + lightIndex, "vLightGround" + lightIndex, "lightMatrix" + lightIndex, "shadowsInfo" + lightIndex, "depthValues" + lightIndex);
                if (uniformBuffersList) {
                    uniformBuffersList.push("Light" + lightIndex);
                }
                samplersList.push("shadowSampler" + lightIndex);
                samplersList.push("depthSampler" + lightIndex);
                if (defines["PROJECTEDLIGHTTEXTURE" + lightIndex]) {
                    samplersList.push("projectionLightSampler" + lightIndex);
                    uniformsList.push("textureProjectionMatrix" + lightIndex);
                }
            }
            if (defines["NUM_MORPH_INFLUENCERS"]) {
                uniformsList.push("morphTargetInfluences");
            }
        };
        /**
         * This helps decreasing rank by rank the shadow quality (0 being the highest rank and quality)
         * @param defines The defines to update while falling back
         * @param fallbacks The authorized effect fallbacks
         * @param maxSimultaneousLights The maximum number of lights allowed
         * @param rank the current rank of the Effect
         * @returns The newly affected rank
         */
        MaterialHelper.HandleFallbacksForShadows = function (defines, fallbacks, maxSimultaneousLights, rank) {
            if (maxSimultaneousLights === void 0) { maxSimultaneousLights = 4; }
            if (rank === void 0) { rank = 0; }
            var lightFallbackRank = 0;
            for (var lightIndex = 0; lightIndex < maxSimultaneousLights; lightIndex++) {
                if (!defines["LIGHT" + lightIndex]) {
                    break;
                }
                if (lightIndex > 0) {
                    lightFallbackRank = rank + lightIndex;
                    fallbacks.addFallback(lightFallbackRank, "LIGHT" + lightIndex);
                }
                if (!defines["SHADOWS"]) {
                    if (defines["SHADOW" + lightIndex]) {
                        fallbacks.addFallback(rank, "SHADOW" + lightIndex);
                    }
                    if (defines["SHADOWPCF" + lightIndex]) {
                        fallbacks.addFallback(rank, "SHADOWPCF" + lightIndex);
                    }
                    if (defines["SHADOWPCSS" + lightIndex]) {
                        fallbacks.addFallback(rank, "SHADOWPCSS" + lightIndex);
                    }
                    if (defines["SHADOWPOISSON" + lightIndex]) {
                        fallbacks.addFallback(rank, "SHADOWPOISSON" + lightIndex);
                    }
                    if (defines["SHADOWESM" + lightIndex]) {
                        fallbacks.addFallback(rank, "SHADOWESM" + lightIndex);
                    }
                }
            }
            return lightFallbackRank++;
        };
        /**
         * Prepares the list of attributes required for morph targets according to the effect defines.
         * @param attribs The current list of supported attribs
         * @param mesh The mesh to prepare the morph targets attributes for
         * @param defines The current Defines of the effect
         */
        MaterialHelper.PrepareAttributesForMorphTargets = function (attribs, mesh, defines) {
            var influencers = defines["NUM_MORPH_INFLUENCERS"];
            if (influencers > 0 && LIB.Engine.LastCreatedEngine) {
                var maxAttributesCount = LIB.Engine.LastCreatedEngine.getCaps().maxVertexAttribs;
                var manager = mesh.morphTargetManager;
                var normal = manager && manager.supportsNormals && defines["NORMAL"];
                var tangent = manager && manager.supportsTangents && defines["TANGENT"];
                for (var index = 0; index < influencers; index++) {
                    attribs.push(LIB.VertexBuffer.PositionKind + index);
                    if (normal) {
                        attribs.push(LIB.VertexBuffer.NormalKind + index);
                    }
                    if (tangent) {
                        attribs.push(LIB.VertexBuffer.TangentKind + index);
                    }
                    if (attribs.length > maxAttributesCount) {
                        LIB.Tools.Error("Cannot add more vertex attributes for mesh " + mesh.name);
                    }
                }
            }
        };
        /**
         * Prepares the list of attributes required for bones according to the effect defines.
         * @param attribs The current list of supported attribs
         * @param mesh The mesh to prepare the bones attributes for
         * @param defines The current Defines of the effect
         * @param fallbacks The current efffect fallback strategy
         */
        MaterialHelper.PrepareAttributesForBones = function (attribs, mesh, defines, fallbacks) {
            if (defines["NUM_BONE_INFLUENCERS"] > 0) {
                fallbacks.addCPUSkinningFallback(0, mesh);
                attribs.push(LIB.VertexBuffer.MatricesIndicesKind);
                attribs.push(LIB.VertexBuffer.MatricesWeightsKind);
                if (defines["NUM_BONE_INFLUENCERS"] > 4) {
                    attribs.push(LIB.VertexBuffer.MatricesIndicesExtraKind);
                    attribs.push(LIB.VertexBuffer.MatricesWeightsExtraKind);
                }
            }
        };
        /**
         * Prepares the list of attributes required for instances according to the effect defines.
         * @param attribs The current list of supported attribs
         * @param defines The current Defines of the effect
         */
        MaterialHelper.PrepareAttributesForInstances = function (attribs, defines) {
            if (defines["INSTANCES"]) {
                attribs.push("world0");
                attribs.push("world1");
                attribs.push("world2");
                attribs.push("world3");
            }
        };
        /**
         * Binds the light shadow information to the effect for the given mesh.
         * @param light The light containing the generator
         * @param scene The scene the lights belongs to
         * @param mesh The mesh we are binding the information to render
         * @param lightIndex The light index in the effect used to render the mesh
         * @param effect The effect we are binding the data to
         */
        MaterialHelper.BindLightShadow = function (light, scene, mesh, lightIndex, effect) {
            if (light.shadowEnabled && mesh.receiveShadows) {
                var shadowGenerator = light.getShadowGenerator();
                if (shadowGenerator) {
                    shadowGenerator.bindShadowLight(lightIndex, effect);
                }
            }
        };
        /**
         * Binds the light information to the effect.
         * @param light The light containing the generator
         * @param effect The effect we are binding the data to
         * @param lightIndex The light index in the effect used to render
         */
        MaterialHelper.BindLightProperties = function (light, effect, lightIndex) {
            light.transferToEffect(effect, lightIndex + "");
        };
        /**
         * Binds the lights information from the scene to the effect for the given mesh.
         * @param scene The scene the lights belongs to
         * @param mesh The mesh we are binding the information to render
         * @param effect The effect we are binding the data to
         * @param defines The generated defines for the effect
         * @param maxSimultaneousLights The maximum number of light that can be bound to the effect
         * @param usePhysicalLightFalloff Specifies whether the light falloff is defined physically or not
         */
        MaterialHelper.BindLights = function (scene, mesh, effect, defines, maxSimultaneousLights, usePhysicalLightFalloff) {
            if (maxSimultaneousLights === void 0) { maxSimultaneousLights = 4; }
            if (usePhysicalLightFalloff === void 0) { usePhysicalLightFalloff = false; }
            var len = Math.min(mesh._lightSources.length, maxSimultaneousLights);
            for (var i = 0; i < len; i++) {
                var light = mesh._lightSources[i];
                var iAsString = i.toString();
                var scaledIntensity = light.getScaledIntensity();
                light._uniformBuffer.bindToEffect(effect, "Light" + i);
                MaterialHelper.BindLightProperties(light, effect, i);
                light.diffuse.scaleToRef(scaledIntensity, LIB.Tmp.Color3[0]);
                light._uniformBuffer.updateColor4("vLightDiffuse", LIB.Tmp.Color3[0], usePhysicalLightFalloff ? light.radius : light.range, iAsString);
                if (defines["SPECULARTERM"]) {
                    light.specular.scaleToRef(scaledIntensity, LIB.Tmp.Color3[1]);
                    light._uniformBuffer.updateColor3("vLightSpecular", LIB.Tmp.Color3[1], iAsString);
                }
                // Shadows
                if (scene.shadowsEnabled) {
                    this.BindLightShadow(light, scene, mesh, iAsString, effect);
                }
                light._uniformBuffer.update();
            }
        };
        /**
         * Binds the fog information from the scene to the effect for the given mesh.
         * @param scene The scene the lights belongs to
         * @param mesh The mesh we are binding the information to render
         * @param effect The effect we are binding the data to
         */
        MaterialHelper.BindFogParameters = function (scene, mesh, effect) {
            if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== LIB.Scene.FOGMODE_NONE) {
                effect.setFloat4("vFogInfos", scene.fogMode, scene.fogStart, scene.fogEnd, scene.fogDensity);
                effect.setColor3("vFogColor", scene.fogColor);
            }
        };
        /**
         * Binds the bones information from the mesh to the effect.
         * @param mesh The mesh we are binding the information to render
         * @param effect The effect we are binding the data to
         */
        MaterialHelper.BindBonesParameters = function (mesh, effect) {
            if (!effect || !mesh) {
                return;
            }
            if (mesh.computeBonesUsingShaders && effect._bonesComputationForcedToCPU) {
                mesh.computeBonesUsingShaders = false;
            }
            if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
                var matrices = mesh.skeleton.getTransformMatrices(mesh);
                if (matrices) {
                    effect.setMatrices("mBones", matrices);
                }
            }
        };
        /**
         * Binds the morph targets information from the mesh to the effect.
         * @param abstractMesh The mesh we are binding the information to render
         * @param effect The effect we are binding the data to
         */
        MaterialHelper.BindMorphTargetParameters = function (abstractMesh, effect) {
            var manager = abstractMesh.morphTargetManager;
            if (!abstractMesh || !manager) {
                return;
            }
            effect.setFloatArray("morphTargetInfluences", manager.influences);
        };
        /**
         * Binds the logarithmic depth information from the scene to the effect for the given defines.
         * @param defines The generated defines used in the effect
         * @param effect The effect we are binding the data to
         * @param scene The scene we are willing to render with logarithmic scale for
         */
        MaterialHelper.BindLogDepth = function (defines, effect, scene) {
            if (defines["LOGARITHMICDEPTH"]) {
                effect.setFloat("logarithmicDepthConstant", 2.0 / (Math.log(scene.activeCamera.maxZ + 1.0) / Math.LN2));
            }
        };
        /**
         * Binds the clip plane information from the scene to the effect.
         * @param scene The scene the clip plane information are extracted from
         * @param effect The effect we are binding the data to
         */
        MaterialHelper.BindClipPlane = function (effect, scene) {
            if (scene.clipPlane) {
                var clipPlane = scene.clipPlane;
                effect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
            }
        };
        return MaterialHelper;
    }());
    LIB.MaterialHelper = MaterialHelper;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.materialHelper.js.map
//# sourceMappingURL=LIB.materialHelper.js.map
