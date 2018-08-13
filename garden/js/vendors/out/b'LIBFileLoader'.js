
var LIB;
(function (LIB) {
    var parseMaterialById = function (id, parsedData, scene, rootUrl) {
        for (var index = 0, cache = parsedData.materials.length; index < cache; index++) {
            var parsedMaterial = parsedData.materials[index];
            if (parsedMaterial.id === id) {
                return LIB.Material.Parse(parsedMaterial, scene, rootUrl);
            }
        }
        return null;
    };
    var isDescendantOf = function (mesh, names, hierarchyIds) {
        for (var i in names) {
            if (mesh.name === names[i]) {
                hierarchyIds.push(mesh.id);
                return true;
            }
        }
        if (mesh.parentId && hierarchyIds.indexOf(mesh.parentId) !== -1) {
            hierarchyIds.push(mesh.id);
            return true;
        }
        return false;
    };
    var logOperation = function (operation, producer) {
        return operation + " of " + (producer ? producer.file + " from " + producer.name + " version: " + producer.version + ", exporter version: " + producer.exporter_version : "unknown");
    };
    var loadAssetContainer = function (scene, data, rootUrl, onError, addToScene) {
        if (addToScene === void 0) { addToScene = false; }
        var container = new LIB.AssetContainer(scene);
        // Entire method running in try block, so ALWAYS logs as far as it got, only actually writes details
        // when SceneLoader.debugLogging = true (default), or exception encountered.
        // Everything stored in var log instead of writing separate lines to support only writing in exception,
        // and avoid problems with multiple concurrent .LIB loads.
        var log = "importScene has failed JSON parse";
        try {
            var parsedData = JSON.parse(data);
            log = "";
            var fullDetails = LIB.SceneLoader.loggingLevel === LIB.SceneLoader.DETAILED_LOGGING;
            var index;
            var cache;
            // Lights
            if (parsedData.lights !== undefined && parsedData.lights !== null) {
                for (index = 0, cache = parsedData.lights.length; index < cache; index++) {
                    var parsedLight = parsedData.lights[index];
                    var light = LIB.Light.Parse(parsedLight, scene);
                    if (light) {
                        container.lights.push(light);
                        log += (index === 0 ? "\n\tLights:" : "");
                        log += "\n\t\t" + light.toString(fullDetails);
                    }
                }
            }
            // Animations
            if (parsedData.animations !== undefined && parsedData.animations !== null) {
                for (index = 0, cache = parsedData.animations.length; index < cache; index++) {
                    var parsedAnimation = parsedData.animations[index];
                    var animation = LIB.Animation.Parse(parsedAnimation);
                    scene.animations.push(animation);
                    container.animations.push(animation);
                    log += (index === 0 ? "\n\tAnimations:" : "");
                    log += "\n\t\t" + animation.toString(fullDetails);
                }
            }
            // Materials
            if (parsedData.materials !== undefined && parsedData.materials !== null) {
                for (index = 0, cache = parsedData.materials.length; index < cache; index++) {
                    var parsedMaterial = parsedData.materials[index];
                    var mat = LIB.Material.Parse(parsedMaterial, scene, rootUrl);
                    container.materials.push(mat);
                    log += (index === 0 ? "\n\tMaterials:" : "");
                    log += "\n\t\t" + mat.toString(fullDetails);
                }
            }
            if (parsedData.multiMaterials !== undefined && parsedData.multiMaterials !== null) {
                for (index = 0, cache = parsedData.multiMaterials.length; index < cache; index++) {
                    var parsedMultiMaterial = parsedData.multiMaterials[index];
                    var mmat = LIB.Material.ParseMultiMaterial(parsedMultiMaterial, scene);
                    container.multiMaterials.push(mmat);
                    log += (index === 0 ? "\n\tMultiMaterials:" : "");
                    log += "\n\t\t" + mmat.toString(fullDetails);
                }
            }
            // Morph targets
            if (parsedData.morphTargetManagers !== undefined && parsedData.morphTargetManagers !== null) {
                for (var _i = 0, _a = parsedData.morphTargetManagers; _i < _a.length; _i++) {
                    var managerData = _a[_i];
                    container.morphTargetManagers.push(LIB.MorphTargetManager.Parse(managerData, scene));
                }
            }
            // Skeletons
            if (parsedData.skeletons !== undefined && parsedData.skeletons !== null) {
                for (index = 0, cache = parsedData.skeletons.length; index < cache; index++) {
                    var parsedSkeleton = parsedData.skeletons[index];
                    var skeleton = LIB.Skeleton.Parse(parsedSkeleton, scene);
                    container.skeletons.push(skeleton);
                    log += (index === 0 ? "\n\tSkeletons:" : "");
                    log += "\n\t\t" + skeleton.toString(fullDetails);
                }
            }
            // Geometries
            var geometries = parsedData.geometries;
            if (geometries !== undefined && geometries !== null) {
                var addedGeometry = new Array();
                // Boxes
                var boxes = geometries.boxes;
                if (boxes !== undefined && boxes !== null) {
                    for (index = 0, cache = boxes.length; index < cache; index++) {
                        var parsedBox = boxes[index];
                        addedGeometry.push(LIB.BoxGeometry.Parse(parsedBox, scene));
                    }
                }
                // Spheres
                var spheres = geometries.spheres;
                if (spheres !== undefined && spheres !== null) {
                    for (index = 0, cache = spheres.length; index < cache; index++) {
                        var parsedSphere = spheres[index];
                        addedGeometry.push(LIB.SphereGeometry.Parse(parsedSphere, scene));
                    }
                }
                // Cylinders
                var cylinders = geometries.cylinders;
                if (cylinders !== undefined && cylinders !== null) {
                    for (index = 0, cache = cylinders.length; index < cache; index++) {
                        var parsedCylinder = cylinders[index];
                        addedGeometry.push(LIB.CylinderGeometry.Parse(parsedCylinder, scene));
                    }
                }
                // Toruses
                var toruses = geometries.toruses;
                if (toruses !== undefined && toruses !== null) {
                    for (index = 0, cache = toruses.length; index < cache; index++) {
                        var parsedTorus = toruses[index];
                        addedGeometry.push(LIB.TorusGeometry.Parse(parsedTorus, scene));
                    }
                }
                // Grounds
                var grounds = geometries.grounds;
                if (grounds !== undefined && grounds !== null) {
                    for (index = 0, cache = grounds.length; index < cache; index++) {
                        var parsedGround = grounds[index];
                        addedGeometry.push(LIB.GroundGeometry.Parse(parsedGround, scene));
                    }
                }
                // Planes
                var planes = geometries.planes;
                if (planes !== undefined && planes !== null) {
                    for (index = 0, cache = planes.length; index < cache; index++) {
                        var parsedPlane = planes[index];
                        addedGeometry.push(LIB.PlaneGeometry.Parse(parsedPlane, scene));
                    }
                }
                // TorusKnots
                var torusKnots = geometries.torusKnots;
                if (torusKnots !== undefined && torusKnots !== null) {
                    for (index = 0, cache = torusKnots.length; index < cache; index++) {
                        var parsedTorusKnot = torusKnots[index];
                        addedGeometry.push(LIB.TorusKnotGeometry.Parse(parsedTorusKnot, scene));
                    }
                }
                // VertexData
                var vertexData = geometries.vertexData;
                if (vertexData !== undefined && vertexData !== null) {
                    for (index = 0, cache = vertexData.length; index < cache; index++) {
                        var parsedVertexData = vertexData[index];
                        addedGeometry.push(LIB.Geometry.Parse(parsedVertexData, scene, rootUrl));
                    }
                }
                addedGeometry.forEach(function (g) {
                    if (g) {
                        container.geometries.push(g);
                    }
                });
            }
            // Transform nodes
            if (parsedData.transformNodes !== undefined && parsedData.transformNodes !== null) {
                for (index = 0, cache = parsedData.transformNodes.length; index < cache; index++) {
                    var parsedTransformNode = parsedData.transformNodes[index];
                    var node = LIB.TransformNode.Parse(parsedTransformNode, scene, rootUrl);
                    container.transformNodes.push(node);
                }
            }
            // Meshes
            if (parsedData.meshes !== undefined && parsedData.meshes !== null) {
                for (index = 0, cache = parsedData.meshes.length; index < cache; index++) {
                    var parsedMesh = parsedData.meshes[index];
                    var mesh = LIB.Mesh.Parse(parsedMesh, scene, rootUrl);
                    container.meshes.push(mesh);
                    log += (index === 0 ? "\n\tMeshes:" : "");
                    log += "\n\t\t" + mesh.toString(fullDetails);
                }
            }
            // Cameras
            if (parsedData.cameras !== undefined && parsedData.cameras !== null) {
                for (index = 0, cache = parsedData.cameras.length; index < cache; index++) {
                    var parsedCamera = parsedData.cameras[index];
                    var camera = LIB.Camera.Parse(parsedCamera, scene);
                    container.cameras.push(camera);
                    log += (index === 0 ? "\n\tCameras:" : "");
                    log += "\n\t\t" + camera.toString(fullDetails);
                }
            }
            // Browsing all the graph to connect the dots
            for (index = 0, cache = scene.cameras.length; index < cache; index++) {
                var camera = scene.cameras[index];
                if (camera._waitingParentId) {
                    camera.parent = scene.getLastEntryByID(camera._waitingParentId);
                    camera._waitingParentId = null;
                }
            }
            for (index = 0, cache = scene.lights.length; index < cache; index++) {
                var light_1 = scene.lights[index];
                if (light_1 && light_1._waitingParentId) {
                    light_1.parent = scene.getLastEntryByID(light_1._waitingParentId);
                    light_1._waitingParentId = null;
                }
            }
            // Sounds
            // TODO: add sound
            var loadedSounds = [];
            var loadedSound;
            if (LIB.AudioEngine && parsedData.sounds !== undefined && parsedData.sounds !== null) {
                for (index = 0, cache = parsedData.sounds.length; index < cache; index++) {
                    var parsedSound = parsedData.sounds[index];
                    if (LIB.Engine.audioEngine.canUseWebAudio) {
                        if (!parsedSound.url)
                            parsedSound.url = parsedSound.name;
                        if (!loadedSounds[parsedSound.url]) {
                            loadedSound = LIB.Sound.Parse(parsedSound, scene, rootUrl);
                            loadedSounds[parsedSound.url] = loadedSound;
                            container.sounds.push(loadedSound);
                        }
                        else {
                            container.sounds.push(LIB.Sound.Parse(parsedSound, scene, rootUrl, loadedSounds[parsedSound.url]));
                        }
                    }
                    else {
                        container.sounds.push(new LIB.Sound(parsedSound.name, null, scene));
                    }
                }
            }
            loadedSounds = [];
            // Connect parents & children and parse actions
            for (index = 0, cache = scene.transformNodes.length; index < cache; index++) {
                var transformNode = scene.transformNodes[index];
                if (transformNode._waitingParentId) {
                    transformNode.parent = scene.getLastEntryByID(transformNode._waitingParentId);
                    transformNode._waitingParentId = null;
                }
            }
            for (index = 0, cache = scene.meshes.length; index < cache; index++) {
                var mesh = scene.meshes[index];
                if (mesh._waitingParentId) {
                    mesh.parent = scene.getLastEntryByID(mesh._waitingParentId);
                    mesh._waitingParentId = null;
                }
                if (mesh._waitingActions) {
                    LIB.ActionManager.Parse(mesh._waitingActions, mesh, scene);
                    mesh._waitingActions = null;
                }
            }
            // freeze world matrix application
            for (index = 0, cache = scene.meshes.length; index < cache; index++) {
                var currentMesh = scene.meshes[index];
                if (currentMesh._waitingFreezeWorldMatrix) {
                    currentMesh.freezeWorldMatrix();
                    currentMesh._waitingFreezeWorldMatrix = null;
                }
                else {
                    currentMesh.computeWorldMatrix(true);
                }
            }
            // Particles Systems
            if (parsedData.particleSystems !== undefined && parsedData.particleSystems !== null) {
                for (index = 0, cache = parsedData.particleSystems.length; index < cache; index++) {
                    var parsedParticleSystem = parsedData.particleSystems[index];
                    if (parsedParticleSystem.activeParticleCount) {
                        var ps = LIB.GPUParticleSystem.Parse(parsedParticleSystem, scene, rootUrl);
                        container.particleSystems.push(ps);
                    }
                    else {
                        var ps = LIB.ParticleSystem.Parse(parsedParticleSystem, scene, rootUrl);
                        container.particleSystems.push(ps);
                    }
                }
            }
            // Lens flares
            if (parsedData.lensFlareSystems !== undefined && parsedData.lensFlareSystems !== null) {
                for (index = 0, cache = parsedData.lensFlareSystems.length; index < cache; index++) {
                    var parsedLensFlareSystem = parsedData.lensFlareSystems[index];
                    var lf = LIB.LensFlareSystem.Parse(parsedLensFlareSystem, scene, rootUrl);
                    container.lensFlareSystems.push(lf);
                }
            }
            // Shadows
            if (parsedData.shadowGenerators !== undefined && parsedData.shadowGenerators !== null) {
                for (index = 0, cache = parsedData.shadowGenerators.length; index < cache; index++) {
                    var parsedShadowGenerator = parsedData.shadowGenerators[index];
                    var sg = LIB.ShadowGenerator.Parse(parsedShadowGenerator, scene);
                    container.shadowGenerators.push(sg);
                }
            }
            // Lights exclusions / inclusions
            for (index = 0, cache = scene.lights.length; index < cache; index++) {
                var light_2 = scene.lights[index];
                // Excluded check
                if (light_2._excludedMeshesIds.length > 0) {
                    for (var excludedIndex = 0; excludedIndex < light_2._excludedMeshesIds.length; excludedIndex++) {
                        var excludedMesh = scene.getMeshByID(light_2._excludedMeshesIds[excludedIndex]);
                        if (excludedMesh) {
                            light_2.excludedMeshes.push(excludedMesh);
                        }
                    }
                    light_2._excludedMeshesIds = [];
                }
                // Included check
                if (light_2._includedOnlyMeshesIds.length > 0) {
                    for (var includedOnlyIndex = 0; includedOnlyIndex < light_2._includedOnlyMeshesIds.length; includedOnlyIndex++) {
                        var includedOnlyMesh = scene.getMeshByID(light_2._includedOnlyMeshesIds[includedOnlyIndex]);
                        if (includedOnlyMesh) {
                            light_2.includedOnlyMeshes.push(includedOnlyMesh);
                        }
                    }
                    light_2._includedOnlyMeshesIds = [];
                }
            }
            // Effect layers
            if (parsedData.effectLayers) {
                for (index = 0; index < parsedData.effectLayers.length; index++) {
                    var effectLayer = LIB.EffectLayer.Parse(parsedData.effectLayers[index], scene, rootUrl);
                    container.effectLayers.push(effectLayer);
                }
            }
            // Actions (scene)
            if (parsedData.actions !== undefined && parsedData.actions !== null) {
                LIB.ActionManager.Parse(parsedData.actions, null, scene);
            }
            if (!addToScene) {
                container.removeAllFromScene();
            }
        }
        catch (err) {
            var msg = logOperation("loadAssts", parsedData ? parsedData.producer : "Unknown") + log;
            if (onError) {
                onError(msg, err);
            }
            else {
                LIB.Tools.Log(msg);
                throw err;
            }
        }
        finally {
            if (log !== null && LIB.SceneLoader.loggingLevel !== LIB.SceneLoader.NO_LOGGING) {
                LIB.Tools.Log(logOperation("loadAssts", parsedData ? parsedData.producer : "Unknown") + (LIB.SceneLoader.loggingLevel !== LIB.SceneLoader.MINIMAL_LOGGING ? log : ""));
            }
        }
        return container;
    };
    LIB.SceneLoader.RegisterPlugin({
        name: "LIB.js",
        extensions: ".LIB",
        canDirectLoad: function (data) {
            if (data.indexOf("LIB") !== -1) { // We consider that the producer string is filled
                return true;
            }
            return false;
        },
        importMesh: function (meshesNames, scene, data, rootUrl, meshes, particleSystems, skeletons, onError) {
            // Entire method running in try block, so ALWAYS logs as far as it got, only actually writes details
            // when SceneLoader.debugLogging = true (default), or exception encountered.
            // Everything stored in var log instead of writing separate lines to support only writing in exception,
            // and avoid problems with multiple concurrent .LIB loads.
            var log = "importMesh has failed JSON parse";
            try {
                var parsedData = JSON.parse(data);
                log = "";
                var fullDetails = LIB.SceneLoader.loggingLevel === LIB.SceneLoader.DETAILED_LOGGING;
                if (!meshesNames) {
                    meshesNames = null;
                }
                else if (!Array.isArray(meshesNames)) {
                    meshesNames = [meshesNames];
                }
                var hierarchyIds = new Array();
                if (parsedData.meshes !== undefined && parsedData.meshes !== null) {
                    var loadedSkeletonsIds = [];
                    var loadedMaterialsIds = [];
                    var index;
                    var cache;
                    for (index = 0, cache = parsedData.meshes.length; index < cache; index++) {
                        var parsedMesh = parsedData.meshes[index];
                        if (meshesNames === null || isDescendantOf(parsedMesh, meshesNames, hierarchyIds)) {
                            if (meshesNames !== null) {
                                // Remove found mesh name from list.
                                delete meshesNames[meshesNames.indexOf(parsedMesh.name)];
                            }
                            //Geometry?
                            if (parsedMesh.geometryId !== undefined && parsedMesh.geometryId !== null) {
                                //does the file contain geometries?
                                if (parsedData.geometries !== undefined && parsedData.geometries !== null) {
                                    //find the correct geometry and add it to the scene
                                    var found = false;
                                    ["boxes", "spheres", "cylinders", "toruses", "grounds", "planes", "torusKnots", "vertexData"].forEach(function (geometryType) {
                                        if (found === true || !parsedData.geometries[geometryType] || !(Array.isArray(parsedData.geometries[geometryType]))) {
                                            return;
                                        }
                                        else {
                                            parsedData.geometries[geometryType].forEach(function (parsedGeometryData) {
                                                if (parsedGeometryData.id === parsedMesh.geometryId) {
                                                    switch (geometryType) {
                                                        case "boxes":
                                                            LIB.BoxGeometry.Parse(parsedGeometryData, scene);
                                                            break;
                                                        case "spheres":
                                                            LIB.SphereGeometry.Parse(parsedGeometryData, scene);
                                                            break;
                                                        case "cylinders":
                                                            LIB.CylinderGeometry.Parse(parsedGeometryData, scene);
                                                            break;
                                                        case "toruses":
                                                            LIB.TorusGeometry.Parse(parsedGeometryData, scene);
                                                            break;
                                                        case "grounds":
                                                            LIB.GroundGeometry.Parse(parsedGeometryData, scene);
                                                            break;
                                                        case "planes":
                                                            LIB.PlaneGeometry.Parse(parsedGeometryData, scene);
                                                            break;
                                                        case "torusKnots":
                                                            LIB.TorusKnotGeometry.Parse(parsedGeometryData, scene);
                                                            break;
                                                        case "vertexData":
                                                            LIB.Geometry.Parse(parsedGeometryData, scene, rootUrl);
                                                            break;
                                                    }
                                                    found = true;
                                                }
                                            });
                                        }
                                    });
                                    if (found === false) {
                                        LIB.Tools.Warn("Geometry not found for mesh " + parsedMesh.id);
                                    }
                                }
                            }
                            // Material ?
                            if (parsedMesh.materialId) {
                                var materialFound = (loadedMaterialsIds.indexOf(parsedMesh.materialId) !== -1);
                                if (materialFound === false && parsedData.multiMaterials !== undefined && parsedData.multiMaterials !== null) {
                                    for (var multimatIndex = 0, multimatCache = parsedData.multiMaterials.length; multimatIndex < multimatCache; multimatIndex++) {
                                        var parsedMultiMaterial = parsedData.multiMaterials[multimatIndex];
                                        if (parsedMultiMaterial.id === parsedMesh.materialId) {
                                            for (var matIndex = 0, matCache = parsedMultiMaterial.materials.length; matIndex < matCache; matIndex++) {
                                                var subMatId = parsedMultiMaterial.materials[matIndex];
                                                loadedMaterialsIds.push(subMatId);
                                                var mat = parseMaterialById(subMatId, parsedData, scene, rootUrl);
                                                if (mat) {
                                                    log += "\n\tMaterial " + mat.toString(fullDetails);
                                                }
                                            }
                                            loadedMaterialsIds.push(parsedMultiMaterial.id);
                                            var mmat = LIB.Material.ParseMultiMaterial(parsedMultiMaterial, scene);
                                            if (mmat) {
                                                materialFound = true;
                                                log += "\n\tMulti-Material " + mmat.toString(fullDetails);
                                            }
                                            break;
                                        }
                                    }
                                }
                                if (materialFound === false) {
                                    loadedMaterialsIds.push(parsedMesh.materialId);
                                    var mat = parseMaterialById(parsedMesh.materialId, parsedData, scene, rootUrl);
                                    if (!mat) {
                                        LIB.Tools.Warn("Material not found for mesh " + parsedMesh.id);
                                    }
                                    else {
                                        log += "\n\tMaterial " + mat.toString(fullDetails);
                                    }
                                }
                            }
                            // Skeleton ?
                            if (parsedMesh.skeletonId > -1 && parsedData.skeletons !== undefined && parsedData.skeletons !== null) {
                                var skeletonAlreadyLoaded = (loadedSkeletonsIds.indexOf(parsedMesh.skeletonId) > -1);
                                if (skeletonAlreadyLoaded === false) {
                                    for (var skeletonIndex = 0, skeletonCache = parsedData.skeletons.length; skeletonIndex < skeletonCache; skeletonIndex++) {
                                        var parsedSkeleton = parsedData.skeletons[skeletonIndex];
                                        if (parsedSkeleton.id === parsedMesh.skeletonId) {
                                            var skeleton = LIB.Skeleton.Parse(parsedSkeleton, scene);
                                            skeletons.push(skeleton);
                                            loadedSkeletonsIds.push(parsedSkeleton.id);
                                            log += "\n\tSkeleton " + skeleton.toString(fullDetails);
                                        }
                                    }
                                }
                            }
                            // Morph targets ?
                            if (parsedData.morphTargetManagers !== undefined && parsedData.morphTargetManagers !== null) {
                                for (var _i = 0, _a = parsedData.morphTargetManagers; _i < _a.length; _i++) {
                                    var managerData = _a[_i];
                                    LIB.MorphTargetManager.Parse(managerData, scene);
                                }
                            }
                            var mesh = LIB.Mesh.Parse(parsedMesh, scene, rootUrl);
                            meshes.push(mesh);
                            log += "\n\tMesh " + mesh.toString(fullDetails);
                        }
                    }
                    // Connecting parents
                    var currentMesh;
                    for (index = 0, cache = scene.meshes.length; index < cache; index++) {
                        currentMesh = scene.meshes[index];
                        if (currentMesh._waitingParentId) {
                            currentMesh.parent = scene.getLastEntryByID(currentMesh._waitingParentId);
                            currentMesh._waitingParentId = null;
                        }
                    }
                    // freeze and compute world matrix application
                    for (index = 0, cache = scene.meshes.length; index < cache; index++) {
                        currentMesh = scene.meshes[index];
                        if (currentMesh._waitingFreezeWorldMatrix) {
                            currentMesh.freezeWorldMatrix();
                            currentMesh._waitingFreezeWorldMatrix = null;
                        }
                        else {
                            currentMesh.computeWorldMatrix(true);
                        }
                    }
                }
                // Particles
                if (parsedData.particleSystems !== undefined && parsedData.particleSystems !== null) {
                    for (index = 0, cache = parsedData.particleSystems.length; index < cache; index++) {
                        var parsedParticleSystem = parsedData.particleSystems[index];
                        if (hierarchyIds.indexOf(parsedParticleSystem.emitterId) !== -1) {
                            particleSystems.push(LIB.ParticleSystem.Parse(parsedParticleSystem, scene, rootUrl));
                        }
                    }
                }
                return true;
            }
            catch (err) {
                var msg = logOperation("importMesh", parsedData ? parsedData.producer : "Unknown") + log;
                if (onError) {
                    onError(msg, err);
                }
                else {
                    LIB.Tools.Log(msg);
                    throw err;
                }
            }
            finally {
                if (log !== null && LIB.SceneLoader.loggingLevel !== LIB.SceneLoader.NO_LOGGING) {
                    LIB.Tools.Log(logOperation("importMesh", parsedData ? parsedData.producer : "Unknown") + (LIB.SceneLoader.loggingLevel !== LIB.SceneLoader.MINIMAL_LOGGING ? log : ""));
                }
            }
            return false;
        },
        load: function (scene, data, rootUrl, onError) {
            // Entire method running in try block, so ALWAYS logs as far as it got, only actually writes details
            // when SceneLoader.debugLogging = true (default), or exception encountered.
            // Everything stored in var log instead of writing separate lines to support only writing in exception,
            // and avoid problems with multiple concurrent .LIB loads.
            var log = "importScene has failed JSON parse";
            try {
                var parsedData = JSON.parse(data);
                log = "";
                // Scene
                if (parsedData.useDelayedTextureLoading !== undefined && parsedData.useDelayedTextureLoading !== null) {
                    scene.useDelayedTextureLoading = parsedData.useDelayedTextureLoading && !LIB.SceneLoader.ForceFullSceneLoadingForIncremental;
                }
                if (parsedData.autoClear !== undefined && parsedData.autoClear !== null) {
                    scene.autoClear = parsedData.autoClear;
                }
                if (parsedData.clearColor !== undefined && parsedData.clearColor !== null) {
                    scene.clearColor = LIB.Color4.FromArray(parsedData.clearColor);
                }
                if (parsedData.ambientColor !== undefined && parsedData.ambientColor !== null) {
                    scene.ambientColor = LIB.Color3.FromArray(parsedData.ambientColor);
                }
                if (parsedData.gravity !== undefined && parsedData.gravity !== null) {
                    scene.gravity = LIB.Vector3.FromArray(parsedData.gravity);
                }
                // Fog
                if (parsedData.fogMode && parsedData.fogMode !== 0) {
                    scene.fogMode = parsedData.fogMode;
                    scene.fogColor = LIB.Color3.FromArray(parsedData.fogColor);
                    scene.fogStart = parsedData.fogStart;
                    scene.fogEnd = parsedData.fogEnd;
                    scene.fogDensity = parsedData.fogDensity;
                    log += "\tFog mode for scene:  ";
                    switch (scene.fogMode) {
                        // getters not compiling, so using hardcoded
                        case 1:
                            log += "exp\n";
                            break;
                        case 2:
                            log += "exp2\n";
                            break;
                        case 3:
                            log += "linear\n";
                            break;
                    }
                }
                //Physics
                if (parsedData.physicsEnabled) {
                    var physicsPlugin;
                    if (parsedData.physicsEngine === "cannon") {
                        physicsPlugin = new LIB.CannonJSPlugin();
                    }
                    else if (parsedData.physicsEngine === "oimo") {
                        physicsPlugin = new LIB.OimoJSPlugin();
                    }
                    log = "\tPhysics engine " + (parsedData.physicsEngine ? parsedData.physicsEngine : "oimo") + " enabled\n";
                    //else - default engine, which is currently oimo
                    var physicsGravity = parsedData.physicsGravity ? LIB.Vector3.FromArray(parsedData.physicsGravity) : null;
                    scene.enablePhysics(physicsGravity, physicsPlugin);
                }
                // Metadata
                if (parsedData.metadata !== undefined && parsedData.metadata !== null) {
                    scene.metadata = parsedData.metadata;
                }
                //collisions, if defined. otherwise, default is true
                if (parsedData.collisionsEnabled !== undefined && parsedData.collisionsEnabled !== null) {
                    scene.collisionsEnabled = parsedData.collisionsEnabled;
                }
                scene.workerCollisions = !!parsedData.workerCollisions;
                var container = loadAssetContainer(scene, data, rootUrl, onError, true);
                if (!container) {
                    return false;
                }
                if (parsedData.autoAnimate) {
                    scene.beginAnimation(scene, parsedData.autoAnimateFrom, parsedData.autoAnimateTo, parsedData.autoAnimateLoop, parsedData.autoAnimateSpeed || 1.0);
                }
                if (parsedData.activeCameraID !== undefined && parsedData.activeCameraID !== null) {
                    scene.setActiveCameraByID(parsedData.activeCameraID);
                }
                // Environment texture		
                if (parsedData.environmentTexture !== undefined && parsedData.environmentTexture !== null) {
                    if (parsedData.environmentTextureType && parsedData.environmentTextureType === "LIB.HDRCubeTexture") {
                        var hdrSize = (parsedData.environmentTextureSize) ? parsedData.environmentTextureSize : 128;
                        var hdrTexture = new LIB.HDRCubeTexture(rootUrl + parsedData.environmentTexture, scene, hdrSize);
                        if (parsedData.environmentTextureRotationY) {
                            hdrTexture.rotationY = parsedData.environmentTextureRotationY;
                        }
                        scene.environmentTexture = hdrTexture;
                    }
                    else {
                        var cubeTexture = LIB.CubeTexture.CreateFromPrefilteredData(rootUrl + parsedData.environmentTexture, scene);
                        if (parsedData.environmentTextureRotationY) {
                            cubeTexture.rotationY = parsedData.environmentTextureRotationY;
                        }
                        scene.environmentTexture = cubeTexture;
                    }
                    if (parsedData.createDefaultSkybox === true) {
                        var skyboxScale = (scene.activeCamera !== undefined && scene.activeCamera !== null) ? (scene.activeCamera.maxZ - scene.activeCamera.minZ) / 2 : 1000;
                        var skyboxBlurLevel = parsedData.skyboxBlurLevel || 0;
                        scene.createDefaultSkybox(undefined, true, skyboxScale, skyboxBlurLevel);
                    }
                }
                // Finish
                return true;
            }
            catch (err) {
                var msg = logOperation("importScene", parsedData ? parsedData.producer : "Unknown") + log;
                if (onError) {
                    onError(msg, err);
                }
                else {
                    LIB.Tools.Log(msg);
                    throw err;
                }
            }
            finally {
                if (log !== null && LIB.SceneLoader.loggingLevel !== LIB.SceneLoader.NO_LOGGING) {
                    LIB.Tools.Log(logOperation("importScene", parsedData ? parsedData.producer : "Unknown") + (LIB.SceneLoader.loggingLevel !== LIB.SceneLoader.MINIMAL_LOGGING ? log : ""));
                }
            }
            return false;
        },
        loadAssetContainer: function (scene, data, rootUrl, onError) {
            var container = loadAssetContainer(scene, data, rootUrl, onError);
            return container;
        }
    });
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.LIBFileLoader.js.map
//# sourceMappingURL=LIB.LIBFileLoader.js.map
