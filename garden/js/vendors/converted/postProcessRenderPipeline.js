

var LIB;
(function (LIB) {
    var PostProcessRenderPipeline = /** @class */ (function () {
        function PostProcessRenderPipeline(engine, name) {
            this.engine = engine;
            this._name = name;
            this._renderEffects = {};
            this._renderEffectsForIsolatedPass = new Array();
            this._cameras = [];
        }
        PostProcessRenderPipeline.prototype.getClassName = function () {
            return "PostProcessRenderPipeline";
        };
        Object.defineProperty(PostProcessRenderPipeline.prototype, "isSupported", {
            get: function () {
                for (var renderEffectName in this._renderEffects) {
                    if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                        if (!this._renderEffects[renderEffectName].isSupported) {
                            return false;
                        }
                    }
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        PostProcessRenderPipeline.prototype.addEffect = function (renderEffect) {
            this._renderEffects[renderEffect._name] = renderEffect;
        };
        // private
        PostProcessRenderPipeline.prototype._rebuild = function () {
        };
        PostProcessRenderPipeline.prototype._enableEffect = function (renderEffectName, cameras) {
            var renderEffects = this._renderEffects[renderEffectName];
            if (!renderEffects) {
                return;
            }
            renderEffects._enable(LIB.Tools.MakeArray(cameras || this._cameras));
        };
        PostProcessRenderPipeline.prototype._disableEffect = function (renderEffectName, cameras) {
            var renderEffects = this._renderEffects[renderEffectName];
            if (!renderEffects) {
                return;
            }
            renderEffects._disable(LIB.Tools.MakeArray(cameras || this._cameras));
        };
        PostProcessRenderPipeline.prototype._attachCameras = function (cameras, unique) {
            var cams = LIB.Tools.MakeArray(cameras || this._cameras);
            if (!cams) {
                return;
            }
            var indicesToDelete = [];
            var i;
            for (i = 0; i < cams.length; i++) {
                var camera = cams[i];
                var cameraName = camera.name;
                if (this._cameras.indexOf(camera) === -1) {
                    this._cameras[cameraName] = camera;
                }
                else if (unique) {
                    indicesToDelete.push(i);
                }
            }
            for (i = 0; i < indicesToDelete.length; i++) {
                cameras.splice(indicesToDelete[i], 1);
            }
            for (var renderEffectName in this._renderEffects) {
                if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                    this._renderEffects[renderEffectName]._attachCameras(cams);
                }
            }
        };
        PostProcessRenderPipeline.prototype._detachCameras = function (cameras) {
            var cams = LIB.Tools.MakeArray(cameras || this._cameras);
            if (!cams) {
                return;
            }
            for (var renderEffectName in this._renderEffects) {
                if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                    this._renderEffects[renderEffectName]._detachCameras(cams);
                }
            }
            for (var i = 0; i < cams.length; i++) {
                this._cameras.splice(this._cameras.indexOf(cams[i]), 1);
            }
        };
        PostProcessRenderPipeline.prototype._update = function () {
            for (var renderEffectName in this._renderEffects) {
                if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                    this._renderEffects[renderEffectName]._update();
                }
            }
            for (var i = 0; i < this._cameras.length; i++) {
                var cameraName = this._cameras[i].name;
                if (this._renderEffectsForIsolatedPass[cameraName]) {
                    this._renderEffectsForIsolatedPass[cameraName]._update();
                }
            }
        };
        PostProcessRenderPipeline.prototype._reset = function () {
            this._renderEffects = {};
            this._renderEffectsForIsolatedPass = new Array();
        };
        PostProcessRenderPipeline.prototype._enableMSAAOnFirstPostProcess = function (sampleCount) {
            // Set samples of the very first post process to 4 to enable native anti-aliasing in browsers that support webGL 2.0 (See: https://github.com/LIBJS/LIB.js/issues/3754)
            var effectKeys = Object.keys(this._renderEffects);
            if (this.engine.webGLVersion >= 2 && effectKeys.length > 0) {
                var postProcesses = this._renderEffects[effectKeys[0]].getPostProcesses();
                if (postProcesses) {
                    postProcesses[0].samples = sampleCount;
                    return true;
                }
            }
            return false;
        };
        PostProcessRenderPipeline.prototype.dispose = function () {
            // Must be implemented by children 
        };
        __decorate([
            LIB.serialize()
        ], PostProcessRenderPipeline.prototype, "_name", void 0);
        return PostProcessRenderPipeline;
    }());
    LIB.PostProcessRenderPipeline = PostProcessRenderPipeline;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.postProcessRenderPipeline.js.map
//# sourceMappingURL=LIB.postProcessRenderPipeline.js.map
