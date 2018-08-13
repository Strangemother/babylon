
var LIB;
(function (LIB) {
    /**
     * PostProcessManager is used to manage one or more post processes or post process pipelines
     * See https://doc.LIBjs.com/how_to/how_to_use_postprocesses
     */
    var PostProcessManager = /** @class */ (function () {
        /**
         * Creates a new instance PostProcess
         * @param scene The scene that the post process is associated with.
         */
        function PostProcessManager(scene) {
            this._vertexBuffers = {};
            this._scene = scene;
        }
        PostProcessManager.prototype._prepareBuffers = function () {
            if (this._vertexBuffers[LIB.VertexBuffer.PositionKind]) {
                return;
            }
            // VBO
            var vertices = [];
            vertices.push(1, 1);
            vertices.push(-1, 1);
            vertices.push(-1, -1);
            vertices.push(1, -1);
            this._vertexBuffers[LIB.VertexBuffer.PositionKind] = new LIB.VertexBuffer(this._scene.getEngine(), vertices, LIB.VertexBuffer.PositionKind, false, false, 2);
            this._buildIndexBuffer();
        };
        PostProcessManager.prototype._buildIndexBuffer = function () {
            // Indices
            var indices = [];
            indices.push(0);
            indices.push(1);
            indices.push(2);
            indices.push(0);
            indices.push(2);
            indices.push(3);
            this._indexBuffer = this._scene.getEngine().createIndexBuffer(indices);
        };
        /**
         * Rebuilds the vertex buffers of the manager.
         */
        PostProcessManager.prototype._rebuild = function () {
            var vb = this._vertexBuffers[LIB.VertexBuffer.PositionKind];
            if (!vb) {
                return;
            }
            vb._rebuild();
            this._buildIndexBuffer();
        };
        // Methods
        /**
         * Prepares a frame to be run through a post process.
         * @param sourceTexture The input texture to the post procesess. (default: null)
         * @param postProcesses An array of post processes to be run. (default: null)
         * @returns True if the post processes were able to be run.
         */
        PostProcessManager.prototype._prepareFrame = function (sourceTexture, postProcesses) {
            if (sourceTexture === void 0) { sourceTexture = null; }
            if (postProcesses === void 0) { postProcesses = null; }
            var camera = this._scene.activeCamera;
            if (!camera) {
                return false;
            }
            var postProcesses = postProcesses || camera._postProcesses.filter(function (pp) { return pp != null; });
            if (!postProcesses || postProcesses.length === 0 || !this._scene.postProcessesEnabled) {
                return false;
            }
            postProcesses[0].activate(camera, sourceTexture, postProcesses !== null && postProcesses !== undefined);
            return true;
        };
        /**
         * Manually render a set of post processes to a texture.
         * @param postProcesses An array of post processes to be run.
         * @param targetTexture The target texture to render to.
         * @param forceFullscreenViewport force gl.viewport to be full screen eg. 0,0,textureWidth,textureHeight
         */
        PostProcessManager.prototype.directRender = function (postProcesses, targetTexture, forceFullscreenViewport) {
            if (targetTexture === void 0) { targetTexture = null; }
            if (forceFullscreenViewport === void 0) { forceFullscreenViewport = false; }
            var engine = this._scene.getEngine();
            for (var index = 0; index < postProcesses.length; index++) {
                if (index < postProcesses.length - 1) {
                    postProcesses[index + 1].activate(this._scene.activeCamera, targetTexture);
                }
                else {
                    if (targetTexture) {
                        engine.bindFramebuffer(targetTexture, 0, undefined, undefined, forceFullscreenViewport);
                    }
                    else {
                        engine.restoreDefaultFramebuffer();
                    }
                }
                var pp = postProcesses[index];
                var effect = pp.apply();
                if (effect) {
                    pp.onBeforeRenderObservable.notifyObservers(effect);
                    // VBOs
                    this._prepareBuffers();
                    engine.bindBuffers(this._vertexBuffers, this._indexBuffer, effect);
                    // Draw order
                    engine.drawElementsType(LIB.Material.TriangleFillMode, 0, 6);
                    pp.onAfterRenderObservable.notifyObservers(effect);
                }
            }
            // Restore depth buffer
            engine.setDepthBuffer(true);
            engine.setDepthWrite(true);
        };
        /**
         * Finalize the result of the output of the postprocesses.
         * @param doNotPresent If true the result will not be displayed to the screen.
         * @param targetTexture The target texture to render to.
         * @param faceIndex The index of the face to bind the target texture to.
         * @param postProcesses The array of post processes to render.
         * @param forceFullscreenViewport force gl.viewport to be full screen eg. 0,0,textureWidth,textureHeight (default: false)
         */
        PostProcessManager.prototype._finalizeFrame = function (doNotPresent, targetTexture, faceIndex, postProcesses, forceFullscreenViewport) {
            if (forceFullscreenViewport === void 0) { forceFullscreenViewport = false; }
            var camera = this._scene.activeCamera;
            if (!camera) {
                return;
            }
            postProcesses = postProcesses || camera._postProcesses.filter(function (pp) { return pp != null; });
            if (postProcesses.length === 0 || !this._scene.postProcessesEnabled) {
                return;
            }
            var engine = this._scene.getEngine();
            for (var index = 0, len = postProcesses.length; index < len; index++) {
                var pp = postProcesses[index];
                if (index < len - 1) {
                    pp._outputTexture = postProcesses[index + 1].activate(camera, targetTexture);
                }
                else {
                    if (targetTexture) {
                        engine.bindFramebuffer(targetTexture, faceIndex, undefined, undefined, forceFullscreenViewport);
                        pp._outputTexture = targetTexture;
                    }
                    else {
                        engine.restoreDefaultFramebuffer();
                        pp._outputTexture = null;
                    }
                }
                if (doNotPresent) {
                    break;
                }
                var effect = pp.apply();
                if (effect) {
                    pp.onBeforeRenderObservable.notifyObservers(effect);
                    // VBOs
                    this._prepareBuffers();
                    engine.bindBuffers(this._vertexBuffers, this._indexBuffer, effect);
                    // Draw order
                    engine.drawElementsType(LIB.Material.TriangleFillMode, 0, 6);
                    pp.onAfterRenderObservable.notifyObservers(effect);
                }
            }
            // Restore states
            engine.setDepthBuffer(true);
            engine.setDepthWrite(true);
            engine.setAlphaMode(LIB.Engine.ALPHA_DISABLE);
        };
        /**
         * Disposes of the post process manager.
         */
        PostProcessManager.prototype.dispose = function () {
            var buffer = this._vertexBuffers[LIB.VertexBuffer.PositionKind];
            if (buffer) {
                buffer.dispose();
                this._vertexBuffers[LIB.VertexBuffer.PositionKind] = null;
            }
            if (this._indexBuffer) {
                this._scene.getEngine()._releaseBuffer(this._indexBuffer);
                this._indexBuffer = null;
            }
        };
        return PostProcessManager;
    }());
    LIB.PostProcessManager = PostProcessManager;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.postProcessManager.js.map
//# sourceMappingURL=LIB.postProcessManager.js.map
