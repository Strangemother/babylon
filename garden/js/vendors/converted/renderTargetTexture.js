(function (LIB) {
    var RenderTargetTexture = /** @class */ (function (_super) {
        __extends(RenderTargetTexture, _super);
        function RenderTargetTexture(name, size, scene, generateMipMaps, doNotChangeAspectRatio, type, isCube, samplingMode, generateDepthBuffer, generateStencilBuffer, isMulti) {
            if (doNotChangeAspectRatio === void 0) { doNotChangeAspectRatio = true; }
            if (type === void 0) { type = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            if (isCube === void 0) { isCube = false; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            if (generateDepthBuffer === void 0) { generateDepthBuffer = true; }
            if (generateStencilBuffer === void 0) { generateStencilBuffer = false; }
            if (isMulti === void 0) { isMulti = false; }
            var _this = _super.call(this, null, scene, !generateMipMaps) || this;
            _this.isCube = isCube;
            /**
            * Use this list to define the list of mesh you want to render.
            */
            _this.renderList = new Array();
            _this.renderParticles = true;
            _this.renderSprites = false;
            _this.coordinatesMode = LIB.Texture.PROJECTION_MODE;
            _this.ignoreCameraViewport = false;
            // Events
            /**
            * An event triggered when the texture is unbind.
            * @type {LIB.Observable}
            */
            _this.onBeforeBindObservable = new LIB.Observable();
            /**
            * An event triggered when the texture is unbind.
            * @type {LIB.Observable}
            */
            _this.onAfterUnbindObservable = new LIB.Observable();
            /**
            * An event triggered before rendering the texture
            * @type {LIB.Observable}
            */
            _this.onBeforeRenderObservable = new LIB.Observable();
            /**
            * An event triggered after rendering the texture
            * @type {LIB.Observable}
            */
            _this.onAfterRenderObservable = new LIB.Observable();
            /**
            * An event triggered after the texture clear
            * @type {LIB.Observable}
            */
            _this.onClearObservable = new LIB.Observable();
            _this._currentRefreshId = -1;
            _this._refreshRate = 1;
            _this._samples = 1;
            scene = _this.getScene();
            if (!scene) {
                return _this;
            }
            _this._engine = scene.getEngine();
            _this.name = name;
            _this.isRenderTarget = true;
            _this._initialSizeParameter = size;
            _this._processSizeParameter(size);
            _this._resizeObserver = _this.getScene().getEngine().onResizeObservable.add(function () {
            });
            _this._generateMipMaps = generateMipMaps ? true : false;
            _this._doNotChangeAspectRatio = doNotChangeAspectRatio;
            // Rendering groups
            _this._renderingManager = new LIB.RenderingManager(scene);
            if (isMulti) {
                return _this;
            }
            _this._renderTargetOptions = {
                generateMipMaps: generateMipMaps,
                type: type,
                samplingMode: samplingMode,
                generateDepthBuffer: generateDepthBuffer,
                generateStencilBuffer: generateStencilBuffer
            };
            if (samplingMode === LIB.Texture.NEAREST_SAMPLINGMODE) {
                _this.wrapU = LIB.Texture.CLAMP_ADDRESSMODE;
                _this.wrapV = LIB.Texture.CLAMP_ADDRESSMODE;
            }
            if (isCube) {
                _this._texture = scene.getEngine().createRenderTargetCubeTexture(_this.getRenderSize(), _this._renderTargetOptions);
                _this.coordinatesMode = LIB.Texture.INVCUBIC_MODE;
                _this._textureMatrix = LIB.Matrix.Identity();
            }
            else {
                _this._texture = scene.getEngine().createRenderTargetTexture(_this._size, _this._renderTargetOptions);
            }
            return _this;
        }
        Object.defineProperty(RenderTargetTexture, "REFRESHRATE_RENDER_ONCE", {
            get: function () {
                return RenderTargetTexture._REFRESHRATE_RENDER_ONCE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTargetTexture, "REFRESHRATE_RENDER_ONEVERYFRAME", {
            get: function () {
                return RenderTargetTexture._REFRESHRATE_RENDER_ONEVERYFRAME;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTargetTexture, "REFRESHRATE_RENDER_ONEVERYTWOFRAMES", {
            get: function () {
                return RenderTargetTexture._REFRESHRATE_RENDER_ONEVERYTWOFRAMES;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTargetTexture.prototype, "onAfterUnbind", {
            set: function (callback) {
                if (this._onAfterUnbindObserver) {
                    this.onAfterUnbindObservable.remove(this._onAfterUnbindObserver);
                }
                this._onAfterUnbindObserver = this.onAfterUnbindObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTargetTexture.prototype, "onBeforeRender", {
            set: function (callback) {
                if (this._onBeforeRenderObserver) {
                    this.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
                }
                this._onBeforeRenderObserver = this.onBeforeRenderObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTargetTexture.prototype, "onAfterRender", {
            set: function (callback) {
                if (this._onAfterRenderObserver) {
                    this.onAfterRenderObservable.remove(this._onAfterRenderObserver);
                }
                this._onAfterRenderObserver = this.onAfterRenderObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTargetTexture.prototype, "onClear", {
            set: function (callback) {
                if (this._onClearObserver) {
                    this.onClearObservable.remove(this._onClearObserver);
                }
                this._onClearObserver = this.onClearObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTargetTexture.prototype, "renderTargetOptions", {
            get: function () {
                return this._renderTargetOptions;
            },
            enumerable: true,
            configurable: true
        });
        RenderTargetTexture.prototype._onRatioRescale = function () {
            if (this._sizeRatio) {
                this.resize(this._initialSizeParameter);
            }
        };
        RenderTargetTexture.prototype._processSizeParameter = function (size) {
            if (size.ratio) {
                this._sizeRatio = size.ratio;
                this._size = {
                    width: this._bestReflectionRenderTargetDimension(this._engine.getRenderWidth(), this._sizeRatio),
                    height: this._bestReflectionRenderTargetDimension(this._engine.getRenderHeight(), this._sizeRatio)
                };
            }
            else {
                this._size = size;
            }
        };
        Object.defineProperty(RenderTargetTexture.prototype, "samples", {
            get: function () {
                return this._samples;
            },
            set: function (value) {
                if (this._samples === value) {
                    return;
                }
                var scene = this.getScene();
                if (!scene) {
                    return;
                }
                this._samples = scene.getEngine().updateRenderTargetTextureSampleCount(this._texture, value);
            },
            enumerable: true,
            configurable: true
        });
        RenderTargetTexture.prototype.resetRefreshCounter = function () {
            this._currentRefreshId = -1;
        };
        Object.defineProperty(RenderTargetTexture.prototype, "refreshRate", {
            get: function () {
                return this._refreshRate;
            },
            // Use 0 to render just once, 1 to render on every frame, 2 to render every two frames and so on...
            set: function (value) {
                this._refreshRate = value;
                this.resetRefreshCounter();
            },
            enumerable: true,
            configurable: true
        });
        RenderTargetTexture.prototype.addPostProcess = function (postProcess) {
            if (!this._postProcessManager) {
                var scene = this.getScene();
                if (!scene) {
                    return;
                }
                this._postProcessManager = new LIB.PostProcessManager(scene);
                this._postProcesses = new Array();
            }
            this._postProcesses.push(postProcess);
            this._postProcesses[0].autoClear = false;
        };
        RenderTargetTexture.prototype.clearPostProcesses = function (dispose) {
            if (!this._postProcesses) {
                return;
            }
            if (dispose) {
                for (var _i = 0, _a = this._postProcesses; _i < _a.length; _i++) {
                    var postProcess = _a[_i];
                    postProcess.dispose();
                }
            }
            this._postProcesses = [];
        };
        RenderTargetTexture.prototype.removePostProcess = function (postProcess) {
            if (!this._postProcesses) {
                return;
            }
            var index = this._postProcesses.indexOf(postProcess);
            if (index === -1) {
                return;
            }
            this._postProcesses.splice(index, 1);
            if (this._postProcesses.length > 0) {
                this._postProcesses[0].autoClear = false;
            }
        };
        RenderTargetTexture.prototype._shouldRender = function () {
            if (this._currentRefreshId === -1) {
                this._currentRefreshId = 1;
                return true;
            }
            if (this.refreshRate === this._currentRefreshId) {
                this._currentRefreshId = 1;
                return true;
            }
            this._currentRefreshId++;
            return false;
        };
        RenderTargetTexture.prototype.getRenderSize = function () {
            if (this._size.width) {
                return this._size.width;
            }
            return this._size;
        };
        RenderTargetTexture.prototype.getRenderWidth = function () {
            if (this._size.width) {
                return this._size.width;
            }
            return this._size;
        };
        RenderTargetTexture.prototype.getRenderHeight = function () {
            if (this._size.width) {
                return this._size.height;
            }
            return this._size;
        };
        Object.defineProperty(RenderTargetTexture.prototype, "canRescale", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        RenderTargetTexture.prototype.scale = function (ratio) {
            var newSize = this.getRenderSize() * ratio;
            this.resize(newSize);
        };
        RenderTargetTexture.prototype.getReflectionTextureMatrix = function () {
            if (this.isCube) {
                return this._textureMatrix;
            }
            return _super.prototype.getReflectionTextureMatrix.call(this);
        };
        RenderTargetTexture.prototype.resize = function (size) {
            this.releaseInternalTexture();
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            this._processSizeParameter(size);
            if (this.isCube) {
                this._texture = scene.getEngine().createRenderTargetCubeTexture(this.getRenderSize(), this._renderTargetOptions);
            }
            else {
                this._texture = scene.getEngine().createRenderTargetTexture(this._size, this._renderTargetOptions);
            }
        };
        RenderTargetTexture.prototype.render = function (useCameraPostProcess, dumpForDebug) {
            if (useCameraPostProcess === void 0) { useCameraPostProcess = false; }
            if (dumpForDebug === void 0) { dumpForDebug = false; }
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            var engine = scene.getEngine();
            if (this.useCameraPostProcesses !== undefined) {
                useCameraPostProcess = this.useCameraPostProcesses;
            }
            if (this._waitingRenderList) {
                this.renderList = [];
                for (var index = 0; index < this._waitingRenderList.length; index++) {
                    var id = this._waitingRenderList[index];
                    var mesh_1 = scene.getMeshByID(id);
                    if (mesh_1) {
                        this.renderList.push(mesh_1);
                    }
                }
                delete this._waitingRenderList;
            }
            // Is predicate defined?
            if (this.renderListPredicate) {
                if (this.renderList) {
                    this.renderList.splice(0); // Clear previous renderList
                }
                else {
                    this.renderList = [];
                }
                var scene = this.getScene();
                if (!scene) {
                    return;
                }
                var sceneMeshes = scene.meshes;
                for (var index = 0; index < sceneMeshes.length; index++) {
                    var mesh = sceneMeshes[index];
                    if (this.renderListPredicate(mesh)) {
                        this.renderList.push(mesh);
                    }
                }
            }
            this.onBeforeBindObservable.notifyObservers(this);
            // Set custom projection.
            // Needs to be before binding to prevent changing the aspect ratio.
            var camera;
            if (this.activeCamera) {
                camera = this.activeCamera;
                engine.setViewport(this.activeCamera.viewport, this.getRenderWidth(), this.getRenderHeight());
                if (this.activeCamera !== scene.activeCamera) {
                    scene.setTransformMatrix(this.activeCamera.getViewMatrix(), this.activeCamera.getProjectionMatrix(true));
                }
            }
            else {
                camera = scene.activeCamera;
                if (camera) {
                    engine.setViewport(camera.viewport, this.getRenderWidth(), this.getRenderHeight());
                }
            }
            // Prepare renderingManager
            this._renderingManager.reset();
            var currentRenderList = this.renderList ? this.renderList : scene.getActiveMeshes().data;
            var currentRenderListLength = this.renderList ? this.renderList.length : scene.getActiveMeshes().length;
            var sceneRenderId = scene.getRenderId();
            for (var meshIndex = 0; meshIndex < currentRenderListLength; meshIndex++) {
                var mesh = currentRenderList[meshIndex];
                if (mesh) {
                    if (!mesh.isReady()) {
                        // Reset _currentRefreshId
                        this.resetRefreshCounter();
                        continue;
                    }
                    mesh._preActivateForIntermediateRendering(sceneRenderId);
                    var isMasked = void 0;
                    if (!this.renderList && camera) {
                        isMasked = ((mesh.layerMask & camera.layerMask) === 0);
                    }
                    else {
                        isMasked = false;
                    }
                    if (mesh.isEnabled() && mesh.isVisible && mesh.subMeshes && !isMasked) {
                        mesh._activate(sceneRenderId);
                        for (var subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
                            var subMesh = mesh.subMeshes[subIndex];
                            scene._activeIndices.addCount(subMesh.indexCount, false);
                            this._renderingManager.dispatch(subMesh);
                        }
                    }
                }
            }
            for (var particleIndex = 0; particleIndex < scene.particleSystems.length; particleIndex++) {
                var particleSystem = scene.particleSystems[particleIndex];
                var emitter = particleSystem.emitter;
                if (!particleSystem.isStarted() || !emitter || !emitter.position || !emitter.isEnabled()) {
                    continue;
                }
                if (currentRenderList.indexOf(emitter) >= 0) {
                    this._renderingManager.dispatchParticles(particleSystem);
                }
            }
            if (this.isCube) {
                for (var face = 0; face < 6; face++) {
                    this.renderToTarget(face, currentRenderList, currentRenderListLength, useCameraPostProcess, dumpForDebug);
                    scene.incrementRenderId();
                    scene.resetCachedMaterial();
                }
            }
            else {
                this.renderToTarget(0, currentRenderList, currentRenderListLength, useCameraPostProcess, dumpForDebug);
            }
            this.onAfterUnbindObservable.notifyObservers(this);
            if (scene.activeCamera) {
                if (this.activeCamera && this.activeCamera !== scene.activeCamera) {
                    scene.setTransformMatrix(scene.activeCamera.getViewMatrix(), scene.activeCamera.getProjectionMatrix(true));
                }
                engine.setViewport(scene.activeCamera.viewport);
            }
            scene.resetCachedMaterial();
        };
        RenderTargetTexture.prototype._bestReflectionRenderTargetDimension = function (renderDimension, scale) {
            var minimum = 128;
            var x = renderDimension * scale;
            var curved = LIB.Tools.NearestPOT(x + (minimum * minimum / (minimum + x)));
            // Ensure we don't exceed the render dimension (while staying POT)
            return Math.min(LIB.Tools.FloorPOT(renderDimension), curved);
        };
        RenderTargetTexture.prototype.renderToTarget = function (faceIndex, currentRenderList, currentRenderListLength, useCameraPostProcess, dumpForDebug) {
            var _this = this;
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            var engine = scene.getEngine();
            if (!this._texture) {
                return;
            }
            // Bind
            if (this._postProcessManager) {
                this._postProcessManager._prepareFrame(this._texture, this._postProcesses);
            }
            else if (!useCameraPostProcess || !scene.postProcessManager._prepareFrame(this._texture)) {
                if (this._texture) {
                    engine.bindFramebuffer(this._texture, this.isCube ? faceIndex : undefined, undefined, undefined, this.ignoreCameraViewport);
                }
            }
            this.onBeforeRenderObservable.notifyObservers(faceIndex);
            // Clear
            if (this.onClearObservable.hasObservers()) {
                this.onClearObservable.notifyObservers(engine);
            }
            else {
                engine.clear(this.clearColor || scene.clearColor, true, true, true);
            }
            if (!this._doNotChangeAspectRatio) {
                scene.updateTransformMatrix(true);
            }
            // Render
            this._renderingManager.render(this.customRenderFunction, currentRenderList, this.renderParticles, this.renderSprites);
            if (this._postProcessManager) {
                this._postProcessManager._finalizeFrame(false, this._texture, faceIndex, this._postProcesses, this.ignoreCameraViewport);
            }
            else if (useCameraPostProcess) {
                scene.postProcessManager._finalizeFrame(false, this._texture, faceIndex);
            }
            if (!this._doNotChangeAspectRatio) {
                scene.updateTransformMatrix(true);
            }
            // Dump ?
            if (dumpForDebug) {
                LIB.Tools.DumpFramebuffer(this.getRenderWidth(), this.getRenderHeight(), engine);
            }
            // Unbind
            if (!this.isCube || faceIndex === 5) {
                if (this.isCube) {
                    if (faceIndex === 5) {
                        engine.generateMipMapsForCubemap(this._texture);
                    }
                }
                engine.unBindFramebuffer(this._texture, this.isCube, function () {
                    _this.onAfterRenderObservable.notifyObservers(faceIndex);
                });
            }
            else {
                this.onAfterRenderObservable.notifyObservers(faceIndex);
            }
        };
        /**
         * Overrides the default sort function applied in the renderging group to prepare the meshes.
         * This allowed control for front to back rendering or reversly depending of the special needs.
         *
         * @param renderingGroupId The rendering group id corresponding to its index
         * @param opaqueSortCompareFn The opaque queue comparison function use to sort.
         * @param alphaTestSortCompareFn The alpha test queue comparison function use to sort.
         * @param transparentSortCompareFn The transparent queue comparison function use to sort.
         */
        RenderTargetTexture.prototype.setRenderingOrder = function (renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn) {
            if (opaqueSortCompareFn === void 0) { opaqueSortCompareFn = null; }
            if (alphaTestSortCompareFn === void 0) { alphaTestSortCompareFn = null; }
            if (transparentSortCompareFn === void 0) { transparentSortCompareFn = null; }
            this._renderingManager.setRenderingOrder(renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn);
        };
        /**
         * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups.
         *
         * @param renderingGroupId The rendering group id corresponding to its index
         * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
         */
        RenderTargetTexture.prototype.setRenderingAutoClearDepthStencil = function (renderingGroupId, autoClearDepthStencil) {
            this._renderingManager.setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil);
        };
        RenderTargetTexture.prototype.clone = function () {
            var textureSize = this.getSize();
            var newTexture = new RenderTargetTexture(this.name, textureSize.width, this.getScene(), this._renderTargetOptions.generateMipMaps, this._doNotChangeAspectRatio, this._renderTargetOptions.type, this.isCube, this._renderTargetOptions.samplingMode, this._renderTargetOptions.generateDepthBuffer, this._renderTargetOptions.generateStencilBuffer);
            // Base texture
            newTexture.hasAlpha = this.hasAlpha;
            newTexture.level = this.level;
            // RenderTarget Texture
            newTexture.coordinatesMode = this.coordinatesMode;
            if (this.renderList) {
                newTexture.renderList = this.renderList.slice(0);
            }
            return newTexture;
        };
        RenderTargetTexture.prototype.serialize = function () {
            if (!this.name) {
                return null;
            }
            var serializationObject = _super.prototype.serialize.call(this);
            serializationObject.renderTargetSize = this.getRenderSize();
            serializationObject.renderList = [];
            if (this.renderList) {
                for (var index = 0; index < this.renderList.length; index++) {
                    serializationObject.renderList.push(this.renderList[index].id);
                }
            }
            return serializationObject;
        };
        // This will remove the attached framebuffer objects. The texture will not be able to be used as render target anymore
        RenderTargetTexture.prototype.disposeFramebufferObjects = function () {
            var objBuffer = this.getInternalTexture();
            var scene = this.getScene();
            if (objBuffer && scene) {
                scene.getEngine()._releaseFramebufferObjects(objBuffer);
            }
        };
        RenderTargetTexture.prototype.dispose = function () {
            if (this._postProcessManager) {
                this._postProcessManager.dispose();
                this._postProcessManager = null;
            }
            this.clearPostProcesses(true);
            if (this._resizeObserver) {
                this.getScene().getEngine().onResizeObservable.remove(this._resizeObserver);
                this._resizeObserver = null;
            }
            this.renderList = null;
            // Remove from custom render targets
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            var index = scene.customRenderTargets.indexOf(this);
            if (index >= 0) {
                scene.customRenderTargets.splice(index, 1);
            }
            for (var _i = 0, _a = scene.cameras; _i < _a.length; _i++) {
                var camera = _a[_i];
                index = camera.customRenderTargets.indexOf(this);
                if (index >= 0) {
                    camera.customRenderTargets.splice(index, 1);
                }
            }
            _super.prototype.dispose.call(this);
        };
        RenderTargetTexture.prototype._rebuild = function () {
            if (this.refreshRate === RenderTargetTexture.REFRESHRATE_RENDER_ONCE) {
                this.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
            }
            if (this._postProcessManager) {
                this._postProcessManager._rebuild();
            }
        };
        RenderTargetTexture._REFRESHRATE_RENDER_ONCE = 0;
        RenderTargetTexture._REFRESHRATE_RENDER_ONEVERYFRAME = 1;
        RenderTargetTexture._REFRESHRATE_RENDER_ONEVERYTWOFRAMES = 2;
        return RenderTargetTexture;
    }(LIB.Texture));
    LIB.RenderTargetTexture = RenderTargetTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.renderTargetTexture.js.map
