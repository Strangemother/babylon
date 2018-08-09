var BABYLON;
(function (BABYLON) {
    var PostProcessRenderPipeline = /** @class */ (function () {
        function PostProcessRenderPipeline(engine, name) {
            this._engine = engine;
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
            renderEffects._enable(BABYLON.Tools.MakeArray(cameras || this._cameras));
        };
        PostProcessRenderPipeline.prototype._disableEffect = function (renderEffectName, cameras) {
            var renderEffects = this._renderEffects[renderEffectName];
            if (!renderEffects) {
                return;
            }
            renderEffects._disable(BABYLON.Tools.MakeArray(cameras || this._cameras));
        };
        PostProcessRenderPipeline.prototype._attachCameras = function (cameras, unique) {
            var cams = BABYLON.Tools.MakeArray(cameras || this._cameras);
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
            var cams = BABYLON.Tools.MakeArray(cameras || this._cameras);
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
        PostProcessRenderPipeline.prototype._enableDisplayOnlyPass = function (passName, cameras) {
            var _this = this;
            var cams = BABYLON.Tools.MakeArray(cameras || this._cameras);
            if (!cams) {
                return;
            }
            var pass = null;
            var renderEffectName;
            for (renderEffectName in this._renderEffects) {
                if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                    pass = this._renderEffects[renderEffectName].getPass(passName);
                    if (pass != null) {
                        break;
                    }
                }
            }
            if (pass === null) {
                return;
            }
            for (renderEffectName in this._renderEffects) {
                if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                    this._renderEffects[renderEffectName]._disable(cams);
                }
            }
            pass._name = PostProcessRenderPipeline.PASS_SAMPLER_NAME;
            for (var i = 0; i < cams.length; i++) {
                var camera = cams[i];
                var cameraName = camera.name;
                this._renderEffectsForIsolatedPass[cameraName] = this._renderEffectsForIsolatedPass[cameraName] || new BABYLON.PostProcessRenderEffect(this._engine, PostProcessRenderPipeline.PASS_EFFECT_NAME, function () { return new BABYLON.DisplayPassPostProcess(PostProcessRenderPipeline.PASS_EFFECT_NAME, 1.0, null, undefined, _this._engine, true); });
                this._renderEffectsForIsolatedPass[cameraName].emptyPasses();
                this._renderEffectsForIsolatedPass[cameraName].addPass(pass);
                this._renderEffectsForIsolatedPass[cameraName]._attachCameras(camera);
            }
        };
        PostProcessRenderPipeline.prototype._disableDisplayOnlyPass = function (cameras) {
            var _this = this;
            var cams = BABYLON.Tools.MakeArray(cameras || this._cameras);
            if (!cams) {
                return;
            }
            for (var i = 0; i < cams.length; i++) {
                var camera = cams[i];
                var cameraName = camera.name;
                this._renderEffectsForIsolatedPass[cameraName] = this._renderEffectsForIsolatedPass[cameraName] || new BABYLON.PostProcessRenderEffect(this._engine, PostProcessRenderPipeline.PASS_EFFECT_NAME, function () { return new BABYLON.DisplayPassPostProcess(PostProcessRenderPipeline.PASS_EFFECT_NAME, 1.0, null, undefined, _this._engine, true); });
                this._renderEffectsForIsolatedPass[cameraName]._disable(camera);
            }
            for (var renderEffectName in this._renderEffects) {
                if (this._renderEffects.hasOwnProperty(renderEffectName)) {
                    this._renderEffects[renderEffectName]._enable(cams);
                }
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
        PostProcessRenderPipeline.prototype.dispose = function () {
            // Must be implemented by children
        };
        PostProcessRenderPipeline.PASS_EFFECT_NAME = "passEffect";
        PostProcessRenderPipeline.PASS_SAMPLER_NAME = "passSampler";
        __decorate([
            BABYLON.serialize()
        ], PostProcessRenderPipeline.prototype, "_name", void 0);
        return PostProcessRenderPipeline;
    }());
    BABYLON.PostProcessRenderPipeline = PostProcessRenderPipeline;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.postProcessRenderPipeline.js.map
