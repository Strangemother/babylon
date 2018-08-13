
var LIB;
(function (LIB) {
    var FilesInput = /** @class */ (function () {
        function FilesInput(engine, scene, sceneLoadedCallback, progressCallback, additionalRenderLoopLogicCallback, textureLoadingCallback, startingProcessingFilesCallback, onReloadCallback, errorCallback) {
            this.onProcessFileCallback = function () { return true; };
            this._engine = engine;
            this._currentScene = scene;
            this._sceneLoadedCallback = sceneLoadedCallback;
            this._progressCallback = progressCallback;
            this._additionalRenderLoopLogicCallback = additionalRenderLoopLogicCallback;
            this._textureLoadingCallback = textureLoadingCallback;
            this._startingProcessingFilesCallback = startingProcessingFilesCallback;
            this._onReloadCallback = onReloadCallback;
            this._errorCallback = errorCallback;
        }
        FilesInput.prototype.monitorElementForDragNDrop = function (elementToMonitor) {
            var _this = this;
            if (elementToMonitor) {
                this._elementToMonitor = elementToMonitor;
                this._dragEnterHandler = function (e) { _this.drag(e); };
                this._dragOverHandler = function (e) { _this.drag(e); };
                this._dropHandler = function (e) { _this.drop(e); };
                this._elementToMonitor.addEventListener("dragenter", this._dragEnterHandler, false);
                this._elementToMonitor.addEventListener("dragover", this._dragOverHandler, false);
                this._elementToMonitor.addEventListener("drop", this._dropHandler, false);
            }
        };
        FilesInput.prototype.dispose = function () {
            if (!this._elementToMonitor) {
                return;
            }
            this._elementToMonitor.removeEventListener("dragenter", this._dragEnterHandler);
            this._elementToMonitor.removeEventListener("dragover", this._dragOverHandler);
            this._elementToMonitor.removeEventListener("drop", this._dropHandler);
        };
        FilesInput.prototype.renderFunction = function () {
            if (this._additionalRenderLoopLogicCallback) {
                this._additionalRenderLoopLogicCallback();
            }
            if (this._currentScene) {
                if (this._textureLoadingCallback) {
                    var remaining = this._currentScene.getWaitingItemsCount();
                    if (remaining > 0) {
                        this._textureLoadingCallback(remaining);
                    }
                }
                this._currentScene.render();
            }
        };
        FilesInput.prototype.drag = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        FilesInput.prototype.drop = function (eventDrop) {
            eventDrop.stopPropagation();
            eventDrop.preventDefault();
            this.loadFiles(eventDrop);
        };
        FilesInput.prototype._traverseFolder = function (folder, files, remaining, callback) {
            var _this = this;
            var reader = folder.createReader();
            var relativePath = folder.fullPath.replace(/^\//, "").replace(/(.+?)\/?$/, "$1/");
            reader.readEntries(function (entries) {
                remaining.count += entries.length;
                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    var entry = entries_1[_i];
                    if (entry.isFile) {
                        entry.file(function (file) {
                            file.correctName = relativePath + file.name;
                            files.push(file);
                            if (--remaining.count === 0) {
                                callback();
                            }
                        });
                    }
                    else if (entry.isDirectory) {
                        _this._traverseFolder(entry, files, remaining, callback);
                    }
                }
                if (--remaining.count) {
                    callback();
                }
            });
        };
        FilesInput.prototype._processFiles = function (files) {
            for (var i = 0; i < files.length; i++) {
                var name = files[i].correctName.toLowerCase();
                var extension = name.split('.').pop();
                if (!this.onProcessFileCallback(files[i], name, extension)) {
                    continue;
                }
                if ((extension === "LIB" || extension === "stl" || extension === "obj" || extension === "gltf" || extension === "glb")
                    && name.indexOf(".binary.LIB") === -1 && name.indexOf(".incremental.LIB") === -1) {
                    this._sceneFileToLoad = files[i];
                }
                else {
                    FilesInput.FilesToLoad[name] = files[i];
                }
            }
        };
        FilesInput.prototype.loadFiles = function (event) {
            var _this = this;
            if (this._startingProcessingFilesCallback)
                this._startingProcessingFilesCallback();
            // Handling data transfer via drag'n'drop
            if (event && event.dataTransfer && event.dataTransfer.files) {
                this._filesToLoad = event.dataTransfer.files;
            }
            // Handling files from input files
            if (event && event.target && event.target.files) {
                this._filesToLoad = event.target.files;
            }
            if (this._filesToLoad && this._filesToLoad.length > 0) {
                var files_1 = new Array();
                var folders = [];
                var items = event.dataTransfer ? event.dataTransfer.items : null;
                for (var i = 0; i < this._filesToLoad.length; i++) {
                    var fileToLoad = this._filesToLoad[i];
                    var name_1 = fileToLoad.name.toLowerCase();
                    var entry = void 0;
                    fileToLoad.correctName = name_1;
                    if (items) {
                        var item = items[i];
                        if (item.getAsEntry) {
                            entry = item.getAsEntry();
                        }
                        else if (item.webkitGetAsEntry) {
                            entry = item.webkitGetAsEntry();
                        }
                    }
                    if (!entry) {
                        files_1.push(fileToLoad);
                    }
                    else {
                        if (entry.isDirectory) {
                            folders.push(entry);
                        }
                        else {
                            files_1.push(fileToLoad);
                        }
                    }
                }
                if (folders.length === 0) {
                    this._processFiles(files_1);
                    this._processReload();
                }
                else {
                    var remaining = { count: folders.length };
                    for (var _i = 0, folders_1 = folders; _i < folders_1.length; _i++) {
                        var folder = folders_1[_i];
                        this._traverseFolder(folder, files_1, remaining, function () {
                            _this._processFiles(files_1);
                            if (remaining.count === 0) {
                                _this._processReload();
                            }
                        });
                    }
                }
            }
        };
        FilesInput.prototype._processReload = function () {
            if (this._onReloadCallback) {
                this._onReloadCallback(this._sceneFileToLoad);
            }
            else {
                this.reload();
            }
        };
        FilesInput.prototype.reload = function () {
            var _this = this;
            // If a scene file has been provided
            if (this._sceneFileToLoad) {
                if (this._currentScene) {
                    if (LIB.Tools.errorsCount > 0) {
                        LIB.Tools.ClearLogCache();
                    }
                    this._engine.stopRenderLoop();
                    this._currentScene.dispose();
                }
                LIB.SceneLoader.LoadAsync("file:", this._sceneFileToLoad, this._engine, function (progress) {
                    if (_this._progressCallback) {
                        _this._progressCallback(progress);
                    }
                }).then(function (scene) {
                    _this._currentScene = scene;
                    if (_this._sceneLoadedCallback) {
                        _this._sceneLoadedCallback(_this._sceneFileToLoad, _this._currentScene);
                    }
                    // Wait for textures and shaders to be ready
                    _this._currentScene.executeWhenReady(function () {
                        _this._engine.runRenderLoop(function () {
                            _this.renderFunction();
                        });
                    });
                }).catch(function (error) {
                    if (_this._errorCallback) {
                        _this._errorCallback(_this._sceneFileToLoad, _this._currentScene, error.message);
                    }
                });
            }
            else {
                LIB.Tools.Error("Please provide a valid .LIB file.");
            }
        };
        FilesInput.FilesToLoad = {};
        return FilesInput;
    }());
    LIB.FilesInput = FilesInput;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.filesInput.js.map
//# sourceMappingURL=LIB.filesInput.js.map
