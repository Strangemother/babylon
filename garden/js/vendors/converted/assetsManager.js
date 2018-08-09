(function (LIB) {
    var AssetTaskState;
    (function (AssetTaskState) {
        AssetTaskState[AssetTaskState["INIT"] = 0] = "INIT";
        AssetTaskState[AssetTaskState["RUNNING"] = 1] = "RUNNING";
        AssetTaskState[AssetTaskState["DONE"] = 2] = "DONE";
        AssetTaskState[AssetTaskState["ERROR"] = 3] = "ERROR";
    })(AssetTaskState = LIB.AssetTaskState || (LIB.AssetTaskState = {}));
    var AbstractAssetTask = /** @class */ (function () {
        function AbstractAssetTask(name) {
            this.name = name;
            this.isCompleted = false;
            this.taskState = AssetTaskState.INIT;
        }
        AbstractAssetTask.prototype.run = function (scene, onSuccess, onError) {
            var _this = this;
            this.taskState = AssetTaskState.RUNNING;
            this.runTask(scene, function () {
                _this.onDoneCallback(onSuccess, onError);
            }, function (msg, exception) {
                _this.onErrorCallback(onError, msg, exception);
            });
        };
        AbstractAssetTask.prototype.runTask = function (scene, onSuccess, onError) {
            throw new Error("runTask is not implemented");
        };
        AbstractAssetTask.prototype.onErrorCallback = function (onError, message, exception) {
            this.taskState = AssetTaskState.ERROR;
            this.errorObject = {
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
                this.taskState = AssetTaskState.DONE;
                this.isCompleted = true;
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
    var AssetsProgressEvent = /** @class */ (function () {
        function AssetsProgressEvent(remainingCount, totalCount, task) {
            this.remainingCount = remainingCount;
            this.totalCount = totalCount;
            this.task = task;
        }
        return AssetsProgressEvent;
    }());
    LIB.AssetsProgressEvent = AssetsProgressEvent;
    var MeshAssetTask = /** @class */ (function (_super) {
        __extends(MeshAssetTask, _super);
        function MeshAssetTask(name, meshesNames, rootUrl, sceneFilename) {
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.meshesNames = meshesNames;
            _this.rootUrl = rootUrl;
            _this.sceneFilename = sceneFilename;
            return _this;
        }
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
    var TextFileAssetTask = /** @class */ (function (_super) {
        __extends(TextFileAssetTask, _super);
        function TextFileAssetTask(name, url) {
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            return _this;
        }
        TextFileAssetTask.prototype.runTask = function (scene, onSuccess, onError) {
            var _this = this;
            scene._loadFile(this.url, function (data) {
                _this.text = data;
                onSuccess();
            }, undefined, false, true, function (request, exception) {
                if (request) {
                    onError(request.status + " " + request.statusText, exception);
                }
            });
        };
        return TextFileAssetTask;
    }(AbstractAssetTask));
    LIB.TextFileAssetTask = TextFileAssetTask;
    var BinaryFileAssetTask = /** @class */ (function (_super) {
        __extends(BinaryFileAssetTask, _super);
        function BinaryFileAssetTask(name, url) {
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            return _this;
        }
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
    var ImageAssetTask = /** @class */ (function (_super) {
        __extends(ImageAssetTask, _super);
        function ImageAssetTask(name, url) {
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            return _this;
        }
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
    var TextureAssetTask = /** @class */ (function (_super) {
        __extends(TextureAssetTask, _super);
        function TextureAssetTask(name, url, noMipmap, invertY, samplingMode) {
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            _this.noMipmap = noMipmap;
            _this.invertY = invertY;
            _this.samplingMode = samplingMode;
            return _this;
        }
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
    var CubeTextureAssetTask = /** @class */ (function (_super) {
        __extends(CubeTextureAssetTask, _super);
        function CubeTextureAssetTask(name, url, extensions, noMipmap, files) {
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            _this.extensions = extensions;
            _this.noMipmap = noMipmap;
            _this.files = files;
            return _this;
        }
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
    var HDRCubeTextureAssetTask = /** @class */ (function (_super) {
        __extends(HDRCubeTextureAssetTask, _super);
        function HDRCubeTextureAssetTask(name, url, size, noMipmap, generateHarmonics, useInGammaSpace, usePMREMGenerator) {
            if (noMipmap === void 0) { noMipmap = false; }
            if (generateHarmonics === void 0) { generateHarmonics = true; }
            if (useInGammaSpace === void 0) { useInGammaSpace = false; }
            if (usePMREMGenerator === void 0) { usePMREMGenerator = false; }
            var _this = _super.call(this, name) || this;
            _this.name = name;
            _this.url = url;
            _this.size = size;
            _this.noMipmap = noMipmap;
            _this.generateHarmonics = generateHarmonics;
            _this.useInGammaSpace = useInGammaSpace;
            _this.usePMREMGenerator = usePMREMGenerator;
            return _this;
        }
        HDRCubeTextureAssetTask.prototype.run = function (scene, onSuccess, onError) {
            var onload = function () {
                onSuccess();
            };
            var onerror = function (message, exception) {
                onError(message, exception);
            };
            this.texture = new LIB.HDRCubeTexture(this.url, scene, this.size, this.noMipmap, this.generateHarmonics, this.useInGammaSpace, this.usePMREMGenerator, onload, onerror);
        };
        return HDRCubeTextureAssetTask;
    }(AbstractAssetTask));
    LIB.HDRCubeTextureAssetTask = HDRCubeTextureAssetTask;
    var AssetsManager = /** @class */ (function () {
        function AssetsManager(scene) {
            this.tasks = new Array();
            this.waitingTasksCount = 0;
            //Observables
            this.onTaskSuccessObservable = new LIB.Observable();
            this.onTaskErrorObservable = new LIB.Observable();
            this.onTasksDoneObservable = new LIB.Observable();
            this.onProgressObservable = new LIB.Observable();
            this.useDefaultLoadingScreen = true;
            this._scene = scene;
        }
        AssetsManager.prototype.addMeshTask = function (taskName, meshesNames, rootUrl, sceneFilename) {
            var task = new MeshAssetTask(taskName, meshesNames, rootUrl, sceneFilename);
            this.tasks.push(task);
            return task;
        };
        AssetsManager.prototype.addTextFileTask = function (taskName, url) {
            var task = new TextFileAssetTask(taskName, url);
            this.tasks.push(task);
            return task;
        };
        AssetsManager.prototype.addBinaryFileTask = function (taskName, url) {
            var task = new BinaryFileAssetTask(taskName, url);
            this.tasks.push(task);
            return task;
        };
        AssetsManager.prototype.addImageTask = function (taskName, url) {
            var task = new ImageAssetTask(taskName, url);
            this.tasks.push(task);
            return task;
        };
        AssetsManager.prototype.addTextureTask = function (taskName, url, noMipmap, invertY, samplingMode) {
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            var task = new TextureAssetTask(taskName, url, noMipmap, invertY, samplingMode);
            this.tasks.push(task);
            return task;
        };
        AssetsManager.prototype.addCubeTextureTask = function (name, url, extensions, noMipmap, files) {
            var task = new CubeTextureAssetTask(name, url, extensions, noMipmap, files);
            this.tasks.push(task);
            return task;
        };
        AssetsManager.prototype.addHDRCubeTextureTask = function (name, url, size, noMipmap, generateHarmonics, useInGammaSpace, usePMREMGenerator) {
            if (noMipmap === void 0) { noMipmap = false; }
            if (generateHarmonics === void 0) { generateHarmonics = true; }
            if (useInGammaSpace === void 0) { useInGammaSpace = false; }
            if (usePMREMGenerator === void 0) { usePMREMGenerator = false; }
            var task = new HDRCubeTextureAssetTask(name, url, size, noMipmap, generateHarmonics, useInGammaSpace, usePMREMGenerator);
            this.tasks.push(task);
            return task;
        };
        AssetsManager.prototype._decreaseWaitingTasksCount = function (task) {
            this.waitingTasksCount--;
            try {
                if (this.onProgress) {
                    this.onProgress(this.waitingTasksCount, this.tasks.length, task);
                }
                this.onProgressObservable.notifyObservers(new AssetsProgressEvent(this.waitingTasksCount, this.tasks.length, task));
            }
            catch (e) {
                LIB.Tools.Error("Error running progress callbacks.");
                console.log(e);
            }
            if (this.waitingTasksCount === 0) {
                try {
                    if (this.onFinish) {
                        this.onFinish(this.tasks);
                    }
                    this.onTasksDoneObservable.notifyObservers(this.tasks);
                }
                catch (e) {
                    LIB.Tools.Error("Error running tasks-done callbacks.");
                    console.log(e);
                }
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
                task.errorObject = task.errorObject || {
                    message: message,
                    exception: exception
                };
                if (_this.onTaskError) {
                    _this.onTaskError(task);
                }
                _this.onTaskErrorObservable.notifyObservers(task);
                _this._decreaseWaitingTasksCount(task);
            };
            task.run(this._scene, done, error);
        };
        AssetsManager.prototype.reset = function () {
            this.tasks = new Array();
            return this;
        };
        AssetsManager.prototype.load = function () {
            this.waitingTasksCount = this.tasks.length;
            if (this.waitingTasksCount === 0) {
                if (this.onFinish) {
                    this.onFinish(this.tasks);
                }
                this.onTasksDoneObservable.notifyObservers(this.tasks);
                return this;
            }
            if (this.useDefaultLoadingScreen) {
                this._scene.getEngine().displayLoadingUI();
            }
            for (var index = 0; index < this.tasks.length; index++) {
                var task = this.tasks[index];
                this._runTask(task);
            }
            return this;
        };
        return AssetsManager;
    }());
    LIB.AssetsManager = AssetsManager;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.assetsManager.js.map
