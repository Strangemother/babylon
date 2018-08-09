(function (LIB) {
    var MaterialHelper = /** @class */ (function () {
        function MaterialHelper() {
        }
        MaterialHelper.BindEyePosition = function (effect, scene) {
            if (scene._forcedViewPosition) {
                effect.setVector3("vEyePosition", scene._forcedViewPosition);
                return;
            }
            effect.setVector3("vEyePosition", scene._mirroredCameraPosition ? scene._mirroredCameraPosition : scene.activeCamera.globalPosition);
        };
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
        MaterialHelper.BindTextureMatrix = function (texture, uniformBuffer, key) {
            var matrix = texture.getTextureMatrix();
            if (!matrix.isIdentity(true)) {
                uniformBuffer.updateMatrix(key + "Matrix", matrix);
            }
        };
        MaterialHelper.PrepareDefinesForMisc = function (mesh, scene, useLogarithmicDepth, pointsCloud, fogEnabled, defines) {
            if (defines._areMiscDirty) {
                defines["LOGARITHMICDEPTH"] = useLogarithmicDepth;
                defines["POINTSIZE"] = (pointsCloud || scene.forcePointsCloud);
                defines["FOG"] = (scene.fogEnabled && mesh.applyFog && scene.fogMode !== LIB.Scene.FOGMODE_NONE && fogEnabled);
                defines["NONUNIFORMSCALING"] = mesh.nonUniformScaling;
            }
        };
        MaterialHelper.PrepareDefinesForFrameBoundValues = function (scene, engine, defines, useInstances, forceAlphaTest) {
            if (forceAlphaTest === void 0) { forceAlphaTest = false; }
            var changed = false;
            if (defines["CLIPPLANE"] !== (scene.clipPlane !== undefined && scene.clipPlane !== null)) {
                defines["CLIPPLANE"] = !defines["CLIPPLANE"];
                changed = true;
            }
            if (defines["ALPHATEST"] !== (engine.getAlphaTesting() || forceAlphaTest)) {
                defines["ALPHATEST"] = !defines["ALPHATEST"];
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
                    defines["SHADOWESM" + lightIndex] = false;
                    defines["SHADOWCUBE" + lightIndex] = false;
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
            }
            if (defines["NUM_MORPH_INFLUENCERS"]) {
                uniformsList.push("morphTargetInfluences");
            }
        };
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
                    if (defines["SHADOWESM" + lightIndex]) {
                        fallbacks.addFallback(rank, "SHADOWESM" + lightIndex);
                    }
                }
            }
            return lightFallbackRank++;
        };
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
        MaterialHelper.PrepareAttributesForInstances = function (attribs, defines) {
            if (defines["INSTANCES"]) {
                attribs.push("world0");
                attribs.push("world1");
                attribs.push("world2");
                attribs.push("world3");
            }
        };
        // Bindings
        MaterialHelper.BindLightShadow = function (light, scene, mesh, lightIndex, effect) {
            if (light.shadowEnabled && mesh.receiveShadows) {
                var shadowGenerator = light.getShadowGenerator();
                if (shadowGenerator) {
                    shadowGenerator.bindShadowLight(lightIndex, effect);
                }
            }
        };
        MaterialHelper.BindLightProperties = function (light, effect, lightIndex) {
            light.transferToEffect(effect, lightIndex + "");
        };
        MaterialHelper.BindLights = function (scene, mesh, effect, defines, maxSimultaneousLights, usePhysicalLightFalloff) {
            if (maxSimultaneousLights === void 0) { maxSimultaneousLights = 4; }
            if (usePhysicalLightFalloff === void 0) { usePhysicalLightFalloff = false; }
            var lightIndex = 0;
            for (var _i = 0, _a = mesh._lightSources; _i < _a.length; _i++) {
                var light = _a[_i];
                var scaledIntensity = light.getScaledIntensity();
                light._uniformBuffer.bindToEffect(effect, "Light" + lightIndex);
                MaterialHelper.BindLightProperties(light, effect, lightIndex);
                light.diffuse.scaleToRef(scaledIntensity, LIB.Tmp.Color3[0]);
                light._uniformBuffer.updateColor4("vLightDiffuse", LIB.Tmp.Color3[0], usePhysicalLightFalloff ? light.radius : light.range, lightIndex + "");
                if (defines["SPECULARTERM"]) {
                    light.specular.scaleToRef(scaledIntensity, LIB.Tmp.Color3[1]);
                    light._uniformBuffer.updateColor3("vLightSpecular", LIB.Tmp.Color3[1], lightIndex + "");
                }
                // Shadows
                if (scene.shadowsEnabled) {
                    this.BindLightShadow(light, scene, mesh, lightIndex + "", effect);
                }
                light._uniformBuffer.update();
                lightIndex++;
                if (lightIndex === maxSimultaneousLights)
                    break;
            }
        };
        MaterialHelper.BindFogParameters = function (scene, mesh, effect) {
            if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== LIB.Scene.FOGMODE_NONE) {
                effect.setFloat4("vFogInfos", scene.fogMode, scene.fogStart, scene.fogEnd, scene.fogDensity);
                effect.setColor3("vFogColor", scene.fogColor);
            }
        };
        MaterialHelper.BindBonesParameters = function (mesh, effect) {
            if (mesh && mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
                var matrices = mesh.skeleton.getTransformMatrices(mesh);
                if (matrices && effect) {
                    effect.setMatrices("mBones", matrices);
                }
            }
        };
        MaterialHelper.BindMorphTargetParameters = function (abstractMesh, effect) {
            var manager = abstractMesh.morphTargetManager;
            if (!abstractMesh || !manager) {
                return;
            }
            effect.setFloatArray("morphTargetInfluences", manager.influences);
        };
        MaterialHelper.BindLogDepth = function (defines, effect, scene) {
            if (defines["LOGARITHMICDEPTH"]) {
                effect.setFloat("logarithmicDepthConstant", 2.0 / (Math.log(scene.activeCamera.maxZ + 1.0) / Math.LN2));
            }
        };
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
