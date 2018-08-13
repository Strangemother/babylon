

var LIB;
(function (LIB) {
    /**
     * Defines the list of states available for a task inside a {LIB.AssetsManager}
     */
    var AssetTaskState;
    (function (AssetTaskState) {
        /**
         * Initialization
         */
        AssetTaskState[AssetTaskState["INIT"] = 0] = "INIT";
        /**
         * Running
         */
        AssetTaskState[AssetTaskState["RUNNING"] = 1] = "RUNNING";
        /**
         * Done
         */
        AssetTaskState[AssetTaskState["DONE"] = 2] = "DONE";
        /**
         * Error
         */
        AssetTaskState[AssetTaskState["ERROR"] = 3] = "ERROR";
    })(AssetTaskState = LIB.AssetTaskState || (LIB.AssetTaskState = {}));
    /**
     * Define an abstract asset task used with a {LIB.AssetsManager} class to load assets into a scene
     */
    var AbstractAssetTask = /** @class */ (function () {
        /**
         * Creates a new {LIB.AssetsManager}
         * @param name defines the name of the task
         */
        function AbstractAssetTask(
        /**
         * Task name
         */ name) {
            this.name = name;
            this._isCompleted = false;
            this._taskState = AssetTaskState.INIT;
        }
        Object.defineProperty(AbstractAssetTask.prototype, "isCompleted", {
            /**
             * Get if the task is completed
             */
            get: function () {
                return this._isCompleted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractAssetTask.prototype, "taskState", {
            /**
             * Gets the current state of the task
             */
            get: function () {
                return this._taskState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractAssetTask.prototype, "errorObject", {
            /**
             * Gets the current error object (if task is in error)
             */
            get: function () {
                return this._errorObject;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Internal only
         * @hidden
         */
        AbstractAssetTask.prototype._setErrorObject = function (message, exception) {
            if (this._errorObject) {
                return;
            }
            this._errorObject = {
                message: message,
                exception: exception
            };
        };
        /**
         * Execute the current task
         * @param scene defines the scene where you want your assets to be loaded
         * @param onSuccess is a callback called when the task is successfully executed
         * @param onError is a callback called if an error occurs
         */
        AbstractAssetTask.prototype.run = function (scene, onSuccess, onError) {
            var _this = this;
            this._taskState = AssetTaskState.RUNNING;
            this.runTask(scene, function () {
                _this.onDoneCallback(onSuccess, onError);
            }, function (msg, exception) {
                _this.onErrorCallback(onError, msg, exception);
            });
        };
        /**
         * Execute the current task
         * @param scene defines the scene where you want your assets to be loaded
         * @param onSuccess is a callback called when the task is successfully executed
         * @param onError is a callback called if an error occurs
         */
        AbstractAssetTask.prototype.runTask = function (scene, onSuccess, onError) {
            throw new Error("runTask is not implemented");
        };
        AbstractAssetTask.prototype.onErrorCallback = function (onError, message, exception) {
            this._taskState = AssetTaskState.ERROR;
            this._errorObject = {
                message: message,
                exception: exception
            };
            if (this.onError) {
                this.onError(this, message, exception);
            }
            onError();
        };
        AbstractAssetTask.prototype.onDoneCallback = function (onSuccess, onError) {
            try {
                this._taskState = AssetTaskState.DONE;
                this._isCompleted = true;
                if (this.onSuccess) {
                    this.onSuccess(this);
                }
                onSuccess();
            }
            catch (e) {
                this.onErrorCallback(onError, "Task is done, error executing success callback(s)", e);
            }
        };
        return AbstractAssetTask;
    }());
    LIB.AbstractAssetTask = AbstractAssetTask;
    /**
     * Class used to share progress information about assets loading
     */
    var AssetsProgressEvent = /** @class */ (function () {
        /**
         * Creates a {LIB.AssetsProgressEvent}
         * @param remainingCount defines the number of remaining tasks to process
         * @param totalCount defines the total number of tasks
         * @param task defines the task that was just processed
         */
        function AssetsProgressEvent(remainingCount, totalCount, task) {
            this.remainingCount = remainingCount;
            this.totalCount = totalCount;
            this.task = task;
        }
        return AssetsProgressEvent;
    }());
    LIB.AssetsProgressEvent = AssetsProgressEvent;
    /**
     * Define a task used by {LIB.AssetsManager} to load meshes
     */
    var MeshAssetTask = /** @class */ (function (_super) {
        __extends(MeshAssetTask, _super);
        /**
         * Creates a new {LIB.MeshAssetTask}
         * @param name defines the name of the task
         * @param meshesNames defines the list of mesh's names you want to load
         * @param rootUrl defines the root url to use as a base to load your meshes and associated resources
         * @param sceneFilename defines the filename of the scene to load from
         */
        function MeshAssetTask(
        /**
         * Defines the name of the task
         */
        name, 
        /**
         * Defines the list of mesh's names you want to load
         */
        meshesNames, 
        /**
         * Defines the root url to use as a base to load your meshes and associated resources
         */
        rootUrl, 
        /**
         * Defines the filename of the scene to load from
         */
        sceneFilename) {
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.meshesNames = meshesNames;
            _this.rootUrl = rootUrl;
            _this.sceneFilename = sceneFilename;
            return _this;
        }
        /**
         * Execute the current task
         * @param scene defines the scene where you want your assets to be loaded
         * @param onSuccess is a callback called when the task is successfully executed
         * @param onError is a callback called if an error occurs
         */
        MeshAssetTask.prototype.runTask = function (scene, onSuccess, onError) {
            var _this = this;
            LIB.SceneLoader.ImportMesh(this.meshesNames, this.rootUrl, this.sceneFilename, scene, function (meshes, particleSystems, skeletons) {
                _this.loadedMeshes = meshes;
                _this.loadedParticleSystems = particleSystems;
                _this.loadedSkeletons = skeletons;
                onSuccess();
            }, null, function (scene, message, exception) {
                onError(message, exception);
            });
        };
        return MeshAssetTask;
    }(AbstractAssetTask));
    LIB.MeshAssetTask = MeshAssetTask;
    /**
     * Define a task used by {LIB.AssetsManager} to load text content
     */
    var TextFileAssetTask = /** @class */ (function (_super) {
        __extends(TextFileAssetTask, _super);
        /**
         * Creates a new TextFileAssetTask object
         * @param name defines the name of the task
         * @param url defines the location of the file to load
         */
        function TextFileAssetTask(
        /**
         * Defines the name of the task
         */
        name, 
        /**
         * Defines the location of the file to load
         */
        url) {
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            return _this;
        }
        /**
         * Execute the current task
         * @param scene defines the scene where you want your assets to be loaded
         * @param onSuccess is a callback called when the task is successfully executed
         * @param onError is a callback called if an error occurs
         */
        TextFileAssetTask.prototype.runTask = function (scene, onSuccess, onError) {
            var _this = this;
            scene._loadFile(this.url, function (data) {
                _this.text = data;
                onSuccess();
            }, undefined, false, false, function (request, exception) {
                if (request) {
                    onError(request.status + " " + request.statusText, exception);
                }
            });
        };
        return TextFileAssetTask;
    }(AbstractAssetTask));
    LIB.TextFileAssetTask = TextFileAssetTask;
    /**
     * Define a task used by {LIB.AssetsManager} to load binary data
     */
    var BinaryFileAssetTask = /** @class */ (function (_super) {
        __extends(BinaryFileAssetTask, _super);
        /**
         * Creates a new BinaryFileAssetTask object
         * @param name defines the name of the new task
         * @param url defines the location of the file to load
         */
        function BinaryFileAssetTask(
        /**
         * Defines the name of the task
         */
        name, 
        /**
         * Defines the location of the file to load
         */
        url) {
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            return _this;
        }
        /**
         * Execute the current task
         * @param scene defines the scene where you want your assets to be loaded
         * @param onSuccess is a callback called when the task is successfully executed
         * @param onError is a callback called if an error occurs
         */
        BinaryFileAssetTask.prototype.runTask = function (scene, onSuccess, onError) {
            var _this = this;
            scene._loadFile(this.url, function (data) {
                _this.data = data;
                onSuccess();
            }, undefined, true, true, function (request, exception) {
                if (request) {
                    onError(request.status + " " + request.statusText, exception);
                }
            });
        };
        return BinaryFileAssetTask;
    }(AbstractAssetTask));
    LIB.BinaryFileAssetTask = BinaryFileAssetTask;
    /**
     * Define a task used by {LIB.AssetsManager} to load images
     */
    var ImageAssetTask = /** @class */ (function (_super) {
        __extends(ImageAssetTask, _super);
        /**
         * Creates a new ImageAssetTask
         * @param name defines the name of the task
         * @param url defines the location of the image to load
         */
        function ImageAssetTask(
        /**
         * Defines the name of the task
         */
        name, 
        /**
         * Defines the location of the image to load
         */
        url) {
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            return _this;
        }
        /**
         * Execute the current task
         * @param scene defines the scene where you want your assets to be loaded
         * @param onSuccess is a callback called when the task is successfully executed
         * @param onError is a callback called if an error occurs
         */
        ImageAssetTask.prototype.runTask = function (scene, onSuccess, onError) {
            var _this = this;
            var img = new Image();
            LIB.Tools.SetCorsBehavior(this.url, img);
            img.onload = function () {
                _this.image = img;
                onSuccess();
            };
            img.onerror = function (err) {
                onError("Error loading image", err);
            };
            img.src = this.url;
        };
        return ImageAssetTask;
    }(AbstractAssetTask));
    LIB.ImageAssetTask = ImageAssetTask;
    /**
     * Define a task used by {LIB.AssetsManager} to load 2D textures
     */
    var TextureAssetTask = /** @class */ (function (_super) {
        __extends(TextureAssetTask, _super);
        /**
         * Creates a new TextureAssetTask object
         * @param name defines the name of the task
         * @param url defines the location of the file to load
         * @param noMipmap defines if mipmap should not be generated (default is false)
         * @param invertY defines if texture must be inverted on Y axis (default is false)
         * @param samplingMode defines the sampling mode to use (default is LIB.Texture.TRILINEAR_SAMPLINGMODE)
         */
        function TextureAssetTask(
        /**
         * Defines the name of the task
         */
        name, 
        /**
         * Defines the location of the file to load
         */
        url, 
        /**
         * Defines if mipmap should not be generated (default is false)
         */
        noMipmap, 
        /**
         * Defines if texture must be inverted on Y axis (default is false)
         */
        invertY, 
        /**
         * Defines the sampling mode to use (default is LIB.Texture.TRILINEAR_SAMPLINGMODE)
         */
        samplingMode) {
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            _this.noMipmap = noMipmap;
            _this.invertY = invertY;
            _this.samplingMode = samplingMode;
            return _this;
        }
        /**
         * Execute the current task
         * @param scene defines the scene where you want your assets to be loaded
         * @param onSuccess is a callback called when the task is successfully executed
         * @param onError is a callback called if an error occurs
         */
        TextureAssetTask.prototype.runTask = function (scene, onSuccess, onError) {
            var onload = function () {
                onSuccess();
            };
            var onerror = function (message, exception) {
                onError(message, exception);
            };
            this.texture = new LIB.Texture(this.url, scene, this.noMipmap, this.invertY, this.samplingMode, onload, onerror);
        };
        return TextureAssetTask;
    }(AbstractAssetTask));
    LIB.TextureAssetTask = TextureAssetTask;
    /**
     * Define a task used by {LIB.AssetsManager} to load cube textures
     */
    var CubeTextureAssetTask = /** @class */ (function (_super) {
        __extends(CubeTextureAssetTask, _super);
        /**
         * Creates a new CubeTextureAssetTask
         * @param name defines the name of the task
         * @param url defines the location of the files to load (You have to specify the folder where the files are + filename with no extension)
         * @param extensions defines the extensions to use to load files (["_px", "_py", "_pz", "_nx", "_ny", "_nz"] by default)
         * @param noMipmap defines if mipmaps should not be generated (default is false)
         * @param files defines the explicit list of files (undefined by default)
         */
        function CubeTextureAssetTask(
        /**
         * Defines the name of the task
         */
        name, 
        /**
         * Defines the location of the files to load (You have to specify the folder where the files are + filename with no extension)
         */
        url, 
        /**
         * Defines the extensions to use to load files (["_px", "_py", "_pz", "_nx", "_ny", "_nz"] by default)
         */
        extensions, 
        /**
         * Defines if mipmaps should not be generated (default is false)
         */
        noMipmap, 
        /**
         * Defines the explicit list of files (undefined by default)
         */
        files) {
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            _this.extensions = extensions;
            _this.noMipmap = noMipmap;
            _this.files = files;
            return _this;
        }
        /**
         * Execute the current task
         * @param scene defines the scene where you want your assets to be loaded
         * @param onSuccess is a callback called when the task is successfully executed
         * @param onError is a callback called if an error occurs
         */
        CubeTextureAssetTask.prototype.runTask = function (scene, onSuccess, onError) {
            var onload = function () {
                onSuccess();
            };
            var onerror = function (message, exception) {
                onError(message, exception);
            };
            this.texture = new LIB.CubeTexture(this.url, scene, this.extensions, this.noMipmap, this.files, onload, onerror);
        };
        return CubeTextureAssetTask;
    }(AbstractAssetTask));
    LIB.CubeTextureAssetTask = CubeTextureAssetTask;
    /**
     * Define a task used by {LIB.AssetsManager} to load HDR cube textures
     */
    var HDRCubeTextureAssetTask = /** @class */ (function (_super) {
        __extends(HDRCubeTextureAssetTask, _super);
        /**
         * Creates a new HDRCubeTextureAssetTask object
         * @param name defines the name of the task
         * @param url defines the location of the file to load
         * @param size defines the desired size (the more it increases the longer the generation will be) If the size is omitted this implies you are using a preprocessed cubemap.
         * @param noMipmap defines if mipmaps should not be generated (default is false)
         * @param generateHarmonics specifies whether you want to extract the polynomial harmonics during the generation process (default is true)
         * @param gammaSpace specifies if the texture will be use in gamma or linear space (the PBR material requires those texture in linear space, but the standard material would require them in Gamma space) (default is false)
         * @param reserved Internal use only
         */
        function HDRCubeTextureAssetTask(
        /**
         * Defines the name of the task
         */
        name, 
        /**
         * Defines the location of the file to load
         */
        url, 
        /**
         * Defines the desired size (the more it increases the longer the generation will be)
         */
        size, 
        /**
         * Defines if mipmaps should not be generated (default is false)
         */
        noMipmap, 
        /**
         * Specifies whether you want to extract the polynomial harmonics during the generation process (default is true)
         */
        generateHarmonics, 
        /**
         * Specifies if the texture will be use in gamma or linear space (the PBR material requires those texture in linear space, but the standard material would require them in Gamma space) (default is false)
         */
        gammaSpace, 
        /**
         * Internal Use Only
         */
        reserved) {
            if (noMipmap === void 0) { noMipmap = false; }
            if (generateHarmonics === void 0) { generateHarmonics = true; }
            if (gammaSpace === void 0) { gammaSpace = false; }
            if (reserved === void 0) { reserved = false; }
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            _this.size = size;
            _this.noMipmap = noMipmap;
            _this.generateHarmonics = generateHarmonics;
            _this.gammaSpace = gammaSpace;
            _this.reserved = reserved;
            return _this;
        }
        /**
         * Execute the current task
         * @param scene defines the scene where you want your assets to be loaded
         * @param onSuccess is a callback called when the task is successfully executed
         * @param onError is a callback called if an error occurs
         */
        HDRCubeTextureAssetTask.prototype.run = function (scene, onSuccess, onError) {
            var onload = function () {
                onSuccess();
            };
            var onerror = function (message, exception) {
                onError(message, exception);
            };
            this.texture = new LIB.HDRCubeTexture(this.url, scene, this.size, this.noMipmap, this.generateHarmonics, this.gammaSpace, this.reserved, onload, onerror);
        };
        return HDRCubeTextureAssetTask;
    }(AbstractAssetTask));
    LIB.HDRCubeTextureAssetTask = HDRCubeTextureAssetTask;
    /**
     * This class can be used to easily import assets into a scene
     * @see http://doc.LIBjs.com/how_to/how_to_use_assetsmanager
     */
    var AssetsManager = /** @class */ (function () {
        /**
         * Creates a new AssetsManager
         * @param scene defines the scene to work on
         */
        function AssetsManager(scene) {
            this._isLoading = false;
            this._tasks = new Array();
            this._waitingTasksCount = 0;
            this._totalTasksCount = 0;
            /**
             * Observable called when all tasks are processed
             */
            this.onTaskSuccessObservable = new LIB.Observable();
            /**
             * Observable called when a task had an error
             */
            this.onTaskErrorObservable = new LIB.Observable();
            /**
             * Observable called when a task is successful
             */
            this.onTasksDoneObservable = new LIB.Observable();
            /**
             * Observable called when a task is done (whatever the result is)
             */
            this.onProgressObservable = new LIB.Observable();
            /**
             * Gets or sets a boolean defining if the {LIB.AssetsManager} should use the default loading screen
             * @see http://doc.LIBjs.com/how_to/creating_a_custom_loading_screen
             */
            this.useDefaultLoadingScreen = true;
            this._scene = scene;
        }
        /**
         * Add a {LIB.MeshAssetTask} to the list of active tasks
         * @param taskName defines the name of the new task
         * @param meshesNames defines the name of meshes to load
         * @param rootUrl defines the root url to use to locate files
         * @param sceneFilename defines the filename of the scene file
         * @returns a new {LIB.MeshAssetTask} object
         */
        AssetsManager.prototype.addMeshTask = function (taskName, meshesNames, rootUrl, sceneFilename) {
            var task = new MeshAssetTask(taskName, meshesNames, rootUrl, sceneFilename);
            this._tasks.push(task);
            return task;
        };
        /**
         * Add a {LIB.TextFileAssetTask} to the list of active tasks
         * @param taskName defines the name of the new task
         * @param url defines the url of the file to load
         * @returns a new {LIB.TextFileAssetTask} object
         */
        AssetsManager.prototype.addTextFileTask = function (taskName, url) {
            var task = new TextFileAssetTask(taskName, url);
            this._tasks.push(task);
            return task;
        };
        /**
         * Add a {LIB.BinaryFileAssetTask} to the list of active tasks
         * @param taskName defines the name of the new task
         * @param url defines the url of the file to load
         * @returns a new {LIB.BinaryFileAssetTask} object
         */
        AssetsManager.prototype.addBinaryFileTask = function (taskName, url) {
            var task = new BinaryFileAssetTask(taskName, url);
            this._tasks.push(task);
            return task;
        };
        /**
         * Add a {LIB.ImageAssetTask} to the list of active tasks
         * @param taskName defines the name of the new task
         * @param url defines the url of the file to load
         * @returns a new {LIB.ImageAssetTask} object
         */
        AssetsManager.prototype.addImageTask = function (taskName, url) {
            var task = new ImageAssetTask(taskName, url);
            this._tasks.push(task);
            return task;
        };
        /**
         * Add a {LIB.TextureAssetTask} to the list of active tasks
         * @param taskName defines the name of the new task
         * @param url defines the url of the file to load
         * @param noMipmap defines if the texture must not receive mipmaps (false by default)
         * @param invertY defines if you want to invert Y axis of the loaded texture (false by default)
         * @param samplingMode defines the sampling mode to use (LIB.Texture.TRILINEAR_SAMPLINGMODE by default)
         * @returns a new {LIB.TextureAssetTask} object
         */
        AssetsManager.prototype.addTextureTask = function (taskName, url, noMipmap, invertY, samplingMode) {
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            var task = new TextureAssetTask(taskName, url, noMipmap, invertY, samplingMode);
            this._tasks.push(task);
            return task;
        };
        /**
         * Add a {LIB.CubeTextureAssetTask} to the list of active tasks
         * @param taskName defines the name of the new task
         * @param url defines the url of the file to load
         * @param extensions defines the extension to use to load the cube map (can be null)
         * @param noMipmap defines if the texture must not receive mipmaps (false by default)
         * @param files defines the list of files to load (can be null)
         * @returns a new {LIB.CubeTextureAssetTask} object
         */
        AssetsManager.prototype.addCubeTextureTask = function (taskName, url, extensions, noMipmap, files) {
            var task = new CubeTextureAssetTask(taskName, url, extensions, noMipmap, files);
            this._tasks.push(task);
            return task;
        };
        /**
         *
         * Add a {LIB.HDRCubeTextureAssetTask} to the list of active tasks
         * @param taskName defines the name of the new task
         * @param url defines the url of the file to load
         * @param size defines the size you want for the cubemap (can be null)
         * @param noMipmap defines if the texture must not receive mipmaps (false by default)
         * @param generateHarmonics defines if you want to automatically generate (true by default)
         * @param gammaSpace specifies if the texture will be use in gamma or linear space (the PBR material requires those texture in linear space, but the standard material would require them in Gamma space) (default is false)
         * @param reserved Internal use only
         * @returns a new {LIB.HDRCubeTextureAssetTask} object
         */
        AssetsManager.prototype.addHDRCubeTextureTask = function (taskName, url, size, noMipmap, generateHarmonics, gammaSpace, reserved) {
            if (noMipmap === void 0) { noMipmap = false; }
            if (generateHarmonics === void 0) { generateHarmonics = true; }
            if (gammaSpace === void 0) { gammaSpace = false; }
            if (reserved === void 0) { reserved = false; }
            var task = new HDRCubeTextureAssetTask(taskName, url, size, noMipmap, generateHarmonics, gammaSpace, reserved);
            this._tasks.push(task);
            return task;
        };
        AssetsManager.prototype._decreaseWaitingTasksCount = function (task) {
            var _this = this;
            this._waitingTasksCount--;
            try {
                if (task.taskState === AssetTaskState.DONE) {
                    // Let's remove successfull tasks
                    LIB.Tools.SetImmediate(function () {
                        var index = _this._tasks.indexOf(task);
                        if (index > -1) {
                            _this._tasks.splice(index, 1);
                        }
                    });
                }
                if (this.onProgress) {
                    this.onProgress(this._waitingTasksCount, this._totalTasksCount, task);
                }
                this.onProgressObservable.notifyObservers(new AssetsProgressEvent(this._waitingTasksCount, this._totalTasksCount, task));
            }
            catch (e) {
                LIB.Tools.Error("Error running progress callbacks.");
                console.log(e);
            }
            if (this._waitingTasksCount === 0) {
                try {
                    if (this.onFinish) {
                        this.onFinish(this._tasks);
                    }
                    this.onTasksDoneObservable.notifyObservers(this._tasks);
                }
                catch (e) {
                    LIB.Tools.Error("Error running tasks-done callbacks.");
                    console.log(e);
                }
                this._isLoading = false;
                this._scene.getEngine().hideLoadingUI();
            }
        };
        AssetsManager.prototype._runTask = function (task) {
            var _this = this;
            var done = function () {
                try {
                    if (_this.onTaskSuccess) {
                        _this.onTaskSuccess(task);
                    }
                    _this.onTaskSuccessObservable.notifyObservers(task);
                    _this._decreaseWaitingTasksCount(task);
                }
                catch (e) {
                    error("Error executing task success callbacks", e);
                }
            };
            var error = function (message, exception) {
                task._setErrorObject(message, exception);
                if (_this.onTaskError) {
                    _this.onTaskError(task);
                }
                _this.onTaskErrorObservable.notifyObservers(task);
                _this._decreaseWaitingTasksCount(task);
            };
            task.run(this._scene, done, error);
        };
        /**
         * Reset the {LIB.AssetsManager} and remove all tasks
         * @return the current instance of the {LIB.AssetsManager}
         */
        AssetsManager.prototype.reset = function () {
            this._isLoading = false;
            this._tasks = new Array();
            return this;
        };
        /**
         * Start the loading process
         * @return the current instance of the {LIB.AssetsManager}
         */
        AssetsManager.prototype.load = function () {
            if (this._isLoading) {
                return this;
            }
            this._isLoading = true;
            this._waitingTasksCount = this._tasks.length;
            this._totalTasksCount = this._tasks.length;
            if (this._waitingTasksCount === 0) {
                this._isLoading = false;
                if (this.onFinish) {
                    this.onFinish(this._tasks);
                }
                this.onTasksDoneObservable.notifyObservers(this._tasks);
                return this;
            }
            if (this.useDefaultLoadingScreen) {
                this._scene.getEngine().displayLoadingUI();
            }
            for (var index = 0; index < this._tasks.length; index++) {
                var task = this._tasks[index];
                this._runTask(task);
            }
            return this;
        };
        return AssetsManager;
    }());
    LIB.AssetsManager = AssetsManager;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.assetsManager.js.map
//# sourceMappingURL=LIB.assetsManager.js.map
