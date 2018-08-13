
var LIB;
(function (LIB) {
    var RenderingManager = /** @class */ (function () {
        function RenderingManager(scene) {
            this._renderingGroups = new Array();
            this._autoClearDepthStencil = {};
            this._customOpaqueSortCompareFn = {};
            this._customAlphaTestSortCompareFn = {};
            this._customTransparentSortCompareFn = {};
            this._renderinGroupInfo = null;
            this._scene = scene;
            for (var i = RenderingManager.MIN_RENDERINGGROUPS; i < RenderingManager.MAX_RENDERINGGROUPS; i++) {
                this._autoClearDepthStencil[i] = { autoClear: true, depth: true, stencil: true };
            }
        }
        RenderingManager.prototype._clearDepthStencilBuffer = function (depth, stencil) {
            if (depth === void 0) { depth = true; }
            if (stencil === void 0) { stencil = true; }
            if (this._depthStencilBufferAlreadyCleaned) {
                return;
            }
            this._scene.getEngine().clear(null, false, depth, stencil);
            this._depthStencilBufferAlreadyCleaned = true;
        };
        RenderingManager.prototype.render = function (customRenderFunction, activeMeshes, renderParticles, renderSprites) {
            // Check if there's at least on observer on the onRenderingGroupObservable and initialize things to fire it
            var observable = this._scene.onRenderingGroupObservable.hasObservers() ? this._scene.onRenderingGroupObservable : null;
            var info = null;
            if (observable) {
                if (!this._renderinGroupInfo) {
                    this._renderinGroupInfo = new LIB.RenderingGroupInfo();
                }
                info = this._renderinGroupInfo;
                info.scene = this._scene;
                info.camera = this._scene.activeCamera;
            }
            // Dispatch sprites
            if (renderSprites) {
                for (var index = 0; index < this._scene.spriteManagers.length; index++) {
                    var manager = this._scene.spriteManagers[index];
                    this.dispatchSprites(manager);
                }
            }
            // Render
            for (var index = RenderingManager.MIN_RENDERINGGROUPS; index < RenderingManager.MAX_RENDERINGGROUPS; index++) {
                this._depthStencilBufferAlreadyCleaned = index === RenderingManager.MIN_RENDERINGGROUPS;
                var renderingGroup = this._renderingGroups[index];
                if (!renderingGroup && !observable)
                    continue;
                var renderingGroupMask = 0;
                // Fire PRECLEAR stage
                if (observable && info) {
                    renderingGroupMask = Math.pow(2, index);
                    info.renderStage = LIB.RenderingGroupInfo.STAGE_PRECLEAR;
                    info.renderingGroupId = index;
                    observable.notifyObservers(info, renderingGroupMask);
                }
                // Clear depth/stencil if needed
                if (RenderingManager.AUTOCLEAR) {
                    var autoClear = this._autoClearDepthStencil[index];
                    if (autoClear && autoClear.autoClear) {
                        this._clearDepthStencilBuffer(autoClear.depth, autoClear.stencil);
                    }
                }
                if (observable && info) {
                    // Fire PREOPAQUE stage
                    info.renderStage = LIB.RenderingGroupInfo.STAGE_PREOPAQUE;
                    observable.notifyObservers(info, renderingGroupMask);
                    // Fire PRETRANSPARENT stage
                    info.renderStage = LIB.RenderingGroupInfo.STAGE_PRETRANSPARENT;
                    observable.notifyObservers(info, renderingGroupMask);
                }
                if (renderingGroup)
                    renderingGroup.render(customRenderFunction, renderSprites, renderParticles, activeMeshes);
                // Fire POSTTRANSPARENT stage
                if (observable && info) {
                    info.renderStage = LIB.RenderingGroupInfo.STAGE_POSTTRANSPARENT;
                    observable.notifyObservers(info, renderingGroupMask);
                }
            }
        };
        RenderingManager.prototype.reset = function () {
            for (var index = RenderingManager.MIN_RENDERINGGROUPS; index < RenderingManager.MAX_RENDERINGGROUPS; index++) {
                var renderingGroup = this._renderingGroups[index];
                if (renderingGroup) {
                    renderingGroup.prepare();
                }
            }
        };
        RenderingManager.prototype.dispose = function () {
            this.freeRenderingGroups();
            this._renderingGroups.length = 0;
        };
        /**
         * Clear the info related to rendering groups preventing retention points during dispose.
         */
        RenderingManager.prototype.freeRenderingGroups = function () {
            for (var index = RenderingManager.MIN_RENDERINGGROUPS; index < RenderingManager.MAX_RENDERINGGROUPS; index++) {
                var renderingGroup = this._renderingGroups[index];
                if (renderingGroup) {
                    renderingGroup.dispose();
                }
            }
        };
        RenderingManager.prototype._prepareRenderingGroup = function (renderingGroupId) {
            if (this._renderingGroups[renderingGroupId] === undefined) {
                this._renderingGroups[renderingGroupId] = new LIB.RenderingGroup(renderingGroupId, this._scene, this._customOpaqueSortCompareFn[renderingGroupId], this._customAlphaTestSortCompareFn[renderingGroupId], this._customTransparentSortCompareFn[renderingGroupId]);
            }
        };
        RenderingManager.prototype.dispatchSprites = function (spriteManager) {
            var renderingGroupId = spriteManager.renderingGroupId || 0;
            this._prepareRenderingGroup(renderingGroupId);
            this._renderingGroups[renderingGroupId].dispatchSprites(spriteManager);
        };
        RenderingManager.prototype.dispatchParticles = function (particleSystem) {
            var renderingGroupId = particleSystem.renderingGroupId || 0;
            this._prepareRenderingGroup(renderingGroupId);
            this._renderingGroups[renderingGroupId].dispatchParticles(particleSystem);
        };
        /**
         * @param subMesh The submesh to dispatch
         * @param [mesh] Optional reference to the submeshes's mesh. Provide if you have an exiting reference to improve performance.
         * @param [material] Optional reference to the submeshes's material. Provide if you have an exiting reference to improve performance.
         */
        RenderingManager.prototype.dispatch = function (subMesh, mesh, material) {
            if (mesh === undefined) {
                mesh = subMesh.getMesh();
            }
            var renderingGroupId = mesh.renderingGroupId || 0;
            this._prepareRenderingGroup(renderingGroupId);
            this._renderingGroups[renderingGroupId].dispatch(subMesh, mesh, material);
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
        RenderingManager.prototype.setRenderingOrder = function (renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn) {
            if (opaqueSortCompareFn === void 0) { opaqueSortCompareFn = null; }
            if (alphaTestSortCompareFn === void 0) { alphaTestSortCompareFn = null; }
            if (transparentSortCompareFn === void 0) { transparentSortCompareFn = null; }
            this._customOpaqueSortCompareFn[renderingGroupId] = opaqueSortCompareFn;
            this._customAlphaTestSortCompareFn[renderingGroupId] = alphaTestSortCompareFn;
            this._customTransparentSortCompareFn[renderingGroupId] = transparentSortCompareFn;
            if (this._renderingGroups[renderingGroupId]) {
                var group = this._renderingGroups[renderingGroupId];
                group.opaqueSortCompareFn = this._customOpaqueSortCompareFn[renderingGroupId];
                group.alphaTestSortCompareFn = this._customAlphaTestSortCompareFn[renderingGroupId];
                group.transparentSortCompareFn = this._customTransparentSortCompareFn[renderingGroupId];
            }
        };
        /**
         * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups.
         *
         * @param renderingGroupId The rendering group id corresponding to its index
         * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
         * @param depth Automatically clears depth between groups if true and autoClear is true.
         * @param stencil Automatically clears stencil between groups if true and autoClear is true.
         */
        RenderingManager.prototype.setRenderingAutoClearDepthStencil = function (renderingGroupId, autoClearDepthStencil, depth, stencil) {
            if (depth === void 0) { depth = true; }
            if (stencil === void 0) { stencil = true; }
            this._autoClearDepthStencil[renderingGroupId] = {
                autoClear: autoClearDepthStencil,
                depth: depth,
                stencil: stencil
            };
        };
        /**
         * The max id used for rendering groups (not included)
         */
        RenderingManager.MAX_RENDERINGGROUPS = 4;
        /**
         * The min id used for rendering groups (included)
         */
        RenderingManager.MIN_RENDERINGGROUPS = 0;
        /**
         * Used to globally prevent autoclearing scenes.
         */
        RenderingManager.AUTOCLEAR = true;
        return RenderingManager;
    }());
    LIB.RenderingManager = RenderingManager;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.renderingManager.js.map
//# sourceMappingURL=LIB.renderingManager.js.map
