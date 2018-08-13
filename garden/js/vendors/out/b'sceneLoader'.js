
var LIB;
(function (LIB) {
    var SceneLoaderProgressEvent = /** @class */ (function () {
        function SceneLoaderProgressEvent(lengthComputable, loaded, total) {
            this.lengthComputable = lengthComputable;
            this.loaded = loaded;
            this.total = total;
        }
        SceneLoaderProgressEvent.FromProgressEvent = function (event) {
            return new SceneLoaderProgressEvent(event.lengthComputable, event.loaded, event.total);
        };
        return SceneLoaderProgressEvent;
    }());
    LIB.SceneLoaderProgressEvent = SceneLoaderProgressEvent;
    var SceneLoader = /** @class */ (function () {
        function SceneLoader() {
        }
        Object.defineProperty(SceneLoader, "NO_LOGGING", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLoader, "MINIMAL_LOGGING", {
            get: function () {
                return 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLoader, "SUMMARY_LOGGING", {
            get: function () {
                return 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLoader, "DETAILED_LOGGING", {
            get: function () {
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLoader, "ForceFullSceneLoadingForIncremental", {
            get: function () {
                return SceneLoader._ForceFullSceneLoadingForIncremental;
            },
            set: function (value) {
                SceneLoader._ForceFullSceneLoadingForIncremental = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLoader, "ShowLoadingScreen", {
            get: function () {
                return SceneLoader._ShowLoadingScreen;
            },
            set: function (value) {
                SceneLoader._ShowLoadingScreen = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLoader, "loggingLevel", {
            get: function () {
                return SceneLoader._loggingLevel;
            },
            set: function (value) {
                SceneLoader._loggingLevel = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneLoader, "CleanBoneMatrixWeights", {
            get: function () {
                return SceneLoader._CleanBoneMatrixWeights;
            },
            set: function (value) {
                SceneLoader._CleanBoneMatrixWeights = value;
            },
            enumerable: true,
            configurable: true
        });
        SceneLoader._getDefaultPlugin = function () {
            return SceneLoader._registeredPlugins[".LIB"];
        };
        SceneLoader._getPluginForExtension = function (extension) {
            var registeredPlugin = SceneLoader._registeredPlugins[extension];
            if (registeredPlugin) {
                return registeredPlugin;
            }
            LIB.Tools.Warn("Unable to find a plugin to load " + extension + " files. Trying to use .LIB default plugin.");
            return SceneLoader._getDefaultPlugin();
        };
        SceneLoader._getPluginForDirectLoad = function (data) {
            for (var extension in SceneLoader._registeredPlugins) {
                var plugin = SceneLoader._registeredPlugins[extension].plugin;
                if (plugin.canDirectLoad && plugin.canDirectLoad(data)) {
                    return SceneLoader._registeredPlugins[extension];
                }
            }
            return SceneLoader._getDefaultPlugin();
        };
        SceneLoader._getPluginForFilename = function (sceneFilename) {
            if (sceneFilename.name) {
                sceneFilename = sceneFilename.name;
            }
            var queryStringPosition = sceneFilename.indexOf("?");
            if (queryStringPosition !== -1) {
                sceneFilename = sceneFilename.substring(0, queryStringPosition);
            }
            var dotPosition = sceneFilename.lastIndexOf(".");
            var extension = sceneFilename.substring(dotPosition, sceneFilename.length).toLowerCase();
            return SceneLoader._getPluginForExtension(extension);
        };
        // use LIB file loader directly if sceneFilename is prefixed with "data:"
        SceneLoader._getDirectLoad = function (sceneFilename) {
            if (sceneFilename.substr && sceneFilename.substr(0, 5) === "data:") {
                return sceneFilename.substr(5);
            }
            return null;
        };
        SceneLoader._loadData = function (rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, onDispose, pluginExtension) {
            var directLoad = SceneLoader._getDirectLoad(sceneFilename);
            var registeredPlugin = pluginExtension ? SceneLoader._getPluginForExtension(pluginExtension) : (directLoad ? SceneLoader._getPluginForDirectLoad(sceneFilename) : SceneLoader._getPluginForFilename(sceneFilename));
            var plugin;
            if (registeredPlugin.plugin.createPlugin) {
                plugin = registeredPlugin.plugin.createPlugin();
            }
            else {
                plugin = registeredPlugin.plugin;
            }
            var useArrayBuffer = registeredPlugin.isBinary;
            var database;
            SceneLoader.OnPluginActivatedObservable.notifyObservers(plugin);
            var dataCallback = function (data, responseURL) {
                if (scene.isDisposed) {
                    onError("Scene has been disposed");
                    return;
                }
                scene.database = database;
                onSuccess(plugin, data, responseURL);
            };
            var request = null;
            var pluginDisposed = false;
            var onDisposeObservable = plugin.onDisposeObservable;
            if (onDisposeObservable) {
                onDisposeObservable.add(function () {
                    pluginDisposed = true;
                    if (request) {
                        request.abort();
                        request = null;
                    }
                    onDispose();
                });
            }
            var manifestChecked = function () {
                if (pluginDisposed) {
                    return;
                }
                var url = rootUrl + sceneFilename;
                request = LIB.Tools.LoadFile(url, dataCallback, onProgress ? function (event) {
                    onProgress(SceneLoaderProgressEvent.FromProgressEvent(event));
                } : undefined, database, useArrayBuffer, function (request, exception) {
                    onError("Failed to load scene." + (exception ? "" : " " + exception.message), exception);
                });
            };
            if (directLoad) {
                dataCallback(directLoad);
                return plugin;
            }
            if (rootUrl.indexOf("file:") === -1) {
                var engine = scene.getEngine();
                var canUseOfflineSupport = engine.enableOfflineSupport;
                if (canUseOfflineSupport) {
                    // Also check for exceptions
                    var exceptionFound = false;
                    for (var _i = 0, _a = scene.disableOfflineSupportExceptionRules; _i < _a.length; _i++) {
                        var regex = _a[_i];
                        if (regex.test(rootUrl + sceneFilename)) {
                            exceptionFound = true;
                            break;
                        }
                    }
                    canUseOfflineSupport = !exceptionFound;
                }
                if (canUseOfflineSupport) {
                    // Checking if a manifest file has been set for this scene and if offline mode has been requested
                    database = new LIB.Database(rootUrl + sceneFilename, manifestChecked, engine.disableManifestCheck);
                }
                else {
                    manifestChecked();
                }
            }
            // Loading file from disk via input file or drag'n'drop
            else {
                var fileOrString = sceneFilename;
                if (fileOrString.name) { // File
                    request = LIB.Tools.ReadFile(fileOrString, dataCallback, onProgress, useArrayBuffer);
                }
                else if (LIB.FilesInput.FilesToLoad[sceneFilename]) {
                    request = LIB.Tools.ReadFile(LIB.FilesInput.FilesToLoad[sceneFilename], dataCallback, onProgress, useArrayBuffer);
                }
                else {
                    onError("Unable to find file named " + sceneFilename);
                }
            }
            return plugin;
        };
        // Public functions
        SceneLoader.GetPluginForExtension = function (extension) {
            return SceneLoader._getPluginForExtension(extension).plugin;
        };
        SceneLoader.IsPluginForExtensionAvailable = function (extension) {
            return !!SceneLoader._registeredPlugins[extension];
        };
        SceneLoader.RegisterPlugin = function (plugin) {
            if (typeof plugin.extensions === "string") {
                var extension = plugin.extensions;
                SceneLoader._registeredPlugins[extension.toLowerCase()] = {
                    plugin: plugin,
                    isBinary: false
                };
            }
            else {
                var extensions = plugin.extensions;
                Object.keys(extensions).forEach(function (extension) {
                    SceneLoader._registeredPlugins[extension.toLowerCase()] = {
                        plugin: plugin,
                        isBinary: extensions[extension].isBinary
                    };
                });
            }
        };
        /**
         * Import meshes into a scene
         * @param meshNames an array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
         * @param rootUrl a string that defines the root url for scene and resources
         * @param sceneFilename a string that defines the name of the scene file. can start with "data:" following by the stringified version of the scene
         * @param scene the instance of LIB.Scene to append to
         * @param onSuccess a callback with a list of imported meshes, particleSystems, and skeletons when import succeeds
         * @param onProgress a callback with a progress event for each file being loaded
         * @param onError a callback with the scene, a message, and possibly an exception when import fails
         * @param pluginExtension the extension used to determine the plugin
         * @returns The loaded plugin
         */
        SceneLoader.ImportMesh = function (meshNames, rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, pluginExtension) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onProgress === void 0) { onProgress = null; }
            if (onError === void 0) { onError = null; }
            if (pluginExtension === void 0) { pluginExtension = null; }
            if (sceneFilename.substr && sceneFilename.substr(0, 1) === "/") {
                LIB.Tools.Error("Wrong sceneFilename parameter");
                return null;
            }
            var loadingToken = {};
            scene._addPendingData(loadingToken);
            var disposeHandler = function () {
                scene._removePendingData(loadingToken);
            };
            var errorHandler = function (message, exception) {
                var errorMessage = "Unable to import meshes from " + rootUrl + sceneFilename + ": " + message;
                if (onError) {
                    onError(scene, errorMessage, exception);
                }
                else {
                    LIB.Tools.Error(errorMessage);
                    // should the exception be thrown?
                }
                disposeHandler();
            };
            var progressHandler = onProgress ? function (event) {
                try {
                    onProgress(event);
                }
                catch (e) {
                    errorHandler("Error in onProgress callback", e);
                }
            } : undefined;
            var successHandler = function (meshes, particleSystems, skeletons, animationGroups) {
                scene.importedMeshesFiles.push(rootUrl + sceneFilename);
                if (onSuccess) {
                    try {
                        onSuccess(meshes, particleSystems, skeletons, animationGroups);
                    }
                    catch (e) {
                        errorHandler("Error in onSuccess callback", e);
                    }
                }
                scene._removePendingData(loadingToken);
            };
            return SceneLoader._loadData(rootUrl, sceneFilename, scene, function (plugin, data, responseURL) {
                if (plugin.rewriteRootURL) {
                    rootUrl = plugin.rewriteRootURL(rootUrl, responseURL);
                }
                if (sceneFilename === "") {
                    if (sceneFilename === "") {
                        rootUrl = LIB.Tools.GetFolderPath(rootUrl, true);
                    }
                }
                if (plugin.importMesh) {
                    var syncedPlugin = plugin;
                    var meshes = new Array();
                    var particleSystems = new Array();
                    var skeletons = new Array();
                    if (!syncedPlugin.importMesh(meshNames, scene, data, rootUrl, meshes, particleSystems, skeletons, errorHandler)) {
                        return;
                    }
                    scene.loadingPluginName = plugin.name;
                    successHandler(meshes, particleSystems, skeletons, []);
                }
                else {
                    var asyncedPlugin = plugin;
                    asyncedPlugin.importMeshAsync(meshNames, scene, data, rootUrl, progressHandler).then(function (result) {
                        scene.loadingPluginName = plugin.name;
                        successHandler(result.meshes, result.particleSystems, result.skeletons, result.animationGroups);
                    }).catch(function (error) {
                        errorHandler(error.message, error);
                    });
                }
            }, progressHandler, errorHandler, disposeHandler, pluginExtension);
        };
        /**
        * Import meshes into a scene
        * @param meshNames an array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
        * @param rootUrl a string that defines the root url for scene and resources
        * @param sceneFilename a string that defines the name of the scene file. can start with "data:" following by the stringified version of the scene
        * @param scene the instance of LIB.Scene to append to
        * @param onProgress a callback with a progress event for each file being loaded
        * @param pluginExtension the extension used to determine the plugin
        * @returns The loaded list of imported meshes, particle systems, skeletons, and animation groups
        */
        SceneLoader.ImportMeshAsync = function (meshNames, rootUrl, sceneFilename, scene, onProgress, pluginExtension) {
            if (onProgress === void 0) { onProgress = null; }
            if (pluginExtension === void 0) { pluginExtension = null; }
            return new Promise(function (resolve, reject) {
                SceneLoader.ImportMesh(meshNames, rootUrl, sceneFilename, scene, function (meshes, particleSystems, skeletons, animationGroups) {
                    resolve({
                        meshes: meshes,
                        particleSystems: particleSystems,
                        skeletons: skeletons,
                        animationGroups: animationGroups
                    });
                }, onProgress, function (scene, message, exception) {
                    reject(exception || new Error(message));
                }, pluginExtension);
            });
        };
        /**
        * Load a scene
        * @param rootUrl a string that defines the root url for scene and resources
        * @param sceneFilename a string that defines the name of the scene file. can start with "data:" following by the stringified version of the scene
        * @param engine is the instance of LIB.Engine to use to create the scene
        * @param onSuccess a callback with the scene when import succeeds
        * @param onProgress a callback with a progress event for each file being loaded
        * @param onError a callback with the scene, a message, and possibly an exception when import fails
        * @param pluginExtension the extension used to determine the plugin
        * @returns The loaded plugin
        */
        SceneLoader.Load = function (rootUrl, sceneFilename, engine, onSuccess, onProgress, onError, pluginExtension) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onProgress === void 0) { onProgress = null; }
            if (onError === void 0) { onError = null; }
            if (pluginExtension === void 0) { pluginExtension = null; }
            return SceneLoader.Append(rootUrl, sceneFilename, new LIB.Scene(engine), onSuccess, onProgress, onError, pluginExtension);
        };
        /**
        * Load a scene
        * @param rootUrl a string that defines the root url for scene and resources
        * @param sceneFilename a string that defines the name of the scene file. can start with "data:" following by the stringified version of the scene
        * @param engine is the instance of LIB.Engine to use to create the scene
        * @param onProgress a callback with a progress event for each file being loaded
        * @param pluginExtension the extension used to determine the plugin
        * @returns The loaded scene
        */
        SceneLoader.LoadAsync = function (rootUrl, sceneFilename, engine, onProgress, pluginExtension) {
            if (onProgress === void 0) { onProgress = null; }
            if (pluginExtension === void 0) { pluginExtension = null; }
            return new Promise(function (resolve, reject) {
                SceneLoader.Load(rootUrl, sceneFilename, engine, function (scene) {
                    resolve(scene);
                }, onProgress, function (scene, message, exception) {
                    reject(exception || new Error(message));
                }, pluginExtension);
            });
        };
        /**
        * Append a scene
        * @param rootUrl a string that defines the root url for scene and resources
        * @param sceneFilename a string that defines the name of the scene file. can start with "data:" following by the stringified version of the scene
        * @param scene is the instance of LIB.Scene to append to
        * @param onSuccess a callback with the scene when import succeeds
        * @param onProgress a callback with a progress event for each file being loaded
        * @param onError a callback with the scene, a message, and possibly an exception when import fails
        * @param pluginExtension the extension used to determine the plugin
        * @returns The loaded plugin
        */
        SceneLoader.Append = function (rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, pluginExtension) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onProgress === void 0) { onProgress = null; }
            if (onError === void 0) { onError = null; }
            if (pluginExtension === void 0) { pluginExtension = null; }
            if (sceneFilename.substr && sceneFilename.substr(0, 1) === "/") {
                LIB.Tools.Error("Wrong sceneFilename parameter");
                return null;
            }
            if (SceneLoader.ShowLoadingScreen) {
                scene.getEngine().displayLoadingUI();
            }
            var loadingToken = {};
            scene._addPendingData(loadingToken);
            var disposeHandler = function () {
                scene._removePendingData(loadingToken);
                scene.getEngine().hideLoadingUI();
            };
            var errorHandler = function (message, exception) {
                var errorMessage = "Unable to load from " + rootUrl + sceneFilename + (message ? ": " + message : "");
                if (onError) {
                    onError(scene, errorMessage, exception);
                }
                else {
                    LIB.Tools.Error(errorMessage);
                    // should the exception be thrown?
                }
                disposeHandler();
            };
            var progressHandler = onProgress ? function (event) {
                try {
                    onProgress(event);
                }
                catch (e) {
                    errorHandler("Error in onProgress callback", e);
                }
            } : undefined;
            var successHandler = function () {
                if (onSuccess) {
                    try {
                        onSuccess(scene);
                    }
                    catch (e) {
                        errorHandler("Error in onSuccess callback", e);
                    }
                }
                scene._removePendingData(loadingToken);
            };
            return SceneLoader._loadData(rootUrl, sceneFilename, scene, function (plugin, data, responseURL) {
                if (sceneFilename === "") {
                    rootUrl = LIB.Tools.GetFolderPath(rootUrl, true);
                }
                if (plugin.load) {
                    var syncedPlugin = plugin;
                    if (!syncedPlugin.load(scene, data, rootUrl, errorHandler)) {
                        return;
                    }
                    scene.loadingPluginName = plugin.name;
                    successHandler();
                }
                else {
                    var asyncedPlugin = plugin;
                    asyncedPlugin.loadAsync(scene, data, rootUrl, progressHandler).then(function () {
                        scene.loadingPluginName = plugin.name;
                        successHandler();
                    }).catch(function (error) {
                        errorHandler(error.message, error);
                    });
                }
                if (SceneLoader.ShowLoadingScreen) {
                    scene.executeWhenReady(function () {
                        scene.getEngine().hideLoadingUI();
                    });
                }
            }, progressHandler, errorHandler, disposeHandler, pluginExtension);
        };
        /**
        * Append a scene
        * @param rootUrl a string that defines the root url for scene and resources
        * @param sceneFilename a string that defines the name of the scene file. can start with "data:" following by the stringified version of the scene
        * @param scene is the instance of LIB.Scene to append to
        * @param onProgress a callback with a progress event for each file being loaded
        * @param pluginExtension the extension used to determine the plugin
        * @returns The given scene
        */
        SceneLoader.AppendAsync = function (rootUrl, sceneFilename, scene, onProgress, pluginExtension) {
            if (onProgress === void 0) { onProgress = null; }
            if (pluginExtension === void 0) { pluginExtension = null; }
            return new Promise(function (resolve, reject) {
                SceneLoader.Append(rootUrl, sceneFilename, scene, function (scene) {
                    resolve(scene);
                }, onProgress, function (scene, message, exception) {
                    reject(exception || new Error(message));
                }, pluginExtension);
            });
        };
        /**
        * Load a scene into an asset container
        * @param rootUrl a string that defines the root url for scene and resources
        * @param sceneFilename a string that defines the name of the scene file. can start with "data:" following by the stringified version of the scene
        * @param scene is the instance of LIB.Scene to append to
        * @param onSuccess a callback with the scene when import succeeds
        * @param onProgress a callback with a progress event for each file being loaded
        * @param onError a callback with the scene, a message, and possibly an exception when import fails
        * @param pluginExtension the extension used to determine the plugin
        * @returns The loaded plugin
        */
        SceneLoader.LoadAssetContainer = function (rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, pluginExtension) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onProgress === void 0) { onProgress = null; }
            if (onError === void 0) { onError = null; }
            if (pluginExtension === void 0) { pluginExtension = null; }
            if (sceneFilename.substr && sceneFilename.substr(0, 1) === "/") {
                LIB.Tools.Error("Wrong sceneFilename parameter");
                return null;
            }
            var loadingToken = {};
            scene._addPendingData(loadingToken);
            var disposeHandler = function () {
                scene._removePendingData(loadingToken);
            };
            var errorHandler = function (message, exception) {
                var errorMessage = "Unable to load assets from " + rootUrl + sceneFilename + (message ? ": " + message : "");
                if (onError) {
                    onError(scene, errorMessage, exception);
                }
                else {
                    LIB.Tools.Error(errorMessage);
                    // should the exception be thrown?
                }
                disposeHandler();
            };
            var progressHandler = onProgress ? function (event) {
                try {
                    onProgress(event);
                }
                catch (e) {
                    errorHandler("Error in onProgress callback", e);
                }
            } : undefined;
            var successHandler = function (assets) {
                if (onSuccess) {
                    try {
                        onSuccess(assets);
                    }
                    catch (e) {
                        errorHandler("Error in onSuccess callback", e);
                    }
                }
                scene._removePendingData(loadingToken);
            };
            return SceneLoader._loadData(rootUrl, sceneFilename, scene, function (plugin, data, responseURL) {
                if (plugin.loadAssetContainer) {
                    var syncedPlugin = plugin;
                    var assetContainer = syncedPlugin.loadAssetContainer(scene, data, rootUrl, errorHandler);
                    if (!assetContainer) {
                        return;
                    }
                    scene.loadingPluginName = plugin.name;
                    successHandler(assetContainer);
                }
                else if (plugin.loadAssetContainerAsync) {
                    var asyncedPlugin = plugin;
                    asyncedPlugin.loadAssetContainerAsync(scene, data, rootUrl, progressHandler).then(function (assetContainer) {
                        scene.loadingPluginName = plugin.name;
                        successHandler(assetContainer);
                    }).catch(function (error) {
                        errorHandler(error.message, error);
                    });
                }
                else {
                    errorHandler("LoadAssetContainer is not supported by this plugin. Plugin did not provide a loadAssetContainer or loadAssetContainerAsync method.");
                }
                if (SceneLoader.ShowLoadingScreen) {
                    scene.executeWhenReady(function () {
                        scene.getEngine().hideLoadingUI();
                    });
                }
            }, progressHandler, errorHandler, disposeHandler, pluginExtension);
        };
        /**
        * Load a scene into an asset container
        * @param rootUrl a string that defines the root url for scene and resources
        * @param sceneFilename a string that defines the name of the scene file. can start with "data:" following by the stringified version of the scene
        * @param scene is the instance of LIB.Scene to append to
        * @param onProgress a callback with a progress event for each file being loaded
        * @param pluginExtension the extension used to determine the plugin
        * @returns The loaded asset container
        */
        SceneLoader.LoadAssetContainerAsync = function (rootUrl, sceneFilename, scene, onProgress, pluginExtension) {
            if (onProgress === void 0) { onProgress = null; }
            if (pluginExtension === void 0) { pluginExtension = null; }
            return new Promise(function (resolve, reject) {
                SceneLoader.LoadAssetContainer(rootUrl, sceneFilename, scene, function (assetContainer) {
                    resolve(assetContainer);
                }, onProgress, function (scene, message, exception) {
                    reject(exception || new Error(message));
                }, pluginExtension);
            });
        };
        // Flags
        SceneLoader._ForceFullSceneLoadingForIncremental = false;
        SceneLoader._ShowLoadingScreen = true;
        SceneLoader._CleanBoneMatrixWeights = false;
        SceneLoader._loggingLevel = SceneLoader.NO_LOGGING;
        // Members
        SceneLoader.OnPluginActivatedObservable = new LIB.Observable();
        SceneLoader._registeredPlugins = {};
        return SceneLoader;
    }());
    LIB.SceneLoader = SceneLoader;
    ;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.sceneLoader.js.map
//# sourceMappingURL=LIB.sceneLoader.js.map
