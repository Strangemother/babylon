
var LIB;
(function (LIB) {
    /**
     * This class can be used to get instrumentation data from a LIB engine
     */
    var SceneInstrumentation = /** @class */ (function () {
        function SceneInstrumentation(scene) {
            var _this = this;
            this.scene = scene;
            this._captureActiveMeshesEvaluationTime = false;
            this._activeMeshesEvaluationTime = new LIB.PerfCounter();
            this._captureRenderTargetsRenderTime = false;
            this._renderTargetsRenderTime = new LIB.PerfCounter();
            this._captureFrameTime = false;
            this._frameTime = new LIB.PerfCounter();
            this._captureRenderTime = false;
            this._renderTime = new LIB.PerfCounter();
            this._captureInterFrameTime = false;
            this._interFrameTime = new LIB.PerfCounter();
            this._captureParticlesRenderTime = false;
            this._particlesRenderTime = new LIB.PerfCounter();
            this._captureSpritesRenderTime = false;
            this._spritesRenderTime = new LIB.PerfCounter();
            this._capturePhysicsTime = false;
            this._physicsTime = new LIB.PerfCounter();
            this._captureAnimationsTime = false;
            this._animationsTime = new LIB.PerfCounter();
            // Observers
            this._onBeforeActiveMeshesEvaluationObserver = null;
            this._onAfterActiveMeshesEvaluationObserver = null;
            this._onBeforeRenderTargetsRenderObserver = null;
            this._onAfterRenderTargetsRenderObserver = null;
            this._onAfterRenderObserver = null;
            this._onBeforeDrawPhaseObserver = null;
            this._onAfterDrawPhaseObserver = null;
            this._onBeforeAnimationsObserver = null;
            this._onBeforeParticlesRenderingObserver = null;
            this._onAfterParticlesRenderingObserver = null;
            this._onBeforeSpritesRenderingObserver = null;
            this._onAfterSpritesRenderingObserver = null;
            this._onBeforePhysicsObserver = null;
            this._onAfterPhysicsObserver = null;
            this._onAfterAnimationsObserver = null;
            // Before render
            this._onBeforeAnimationsObserver = scene.onBeforeAnimationsObservable.add(function () {
                if (_this._captureActiveMeshesEvaluationTime) {
                    _this._activeMeshesEvaluationTime.fetchNewFrame();
                }
                if (_this._captureRenderTargetsRenderTime) {
                    _this._renderTargetsRenderTime.fetchNewFrame();
                }
                if (_this._captureFrameTime) {
                    LIB.Tools.StartPerformanceCounter("Scene rendering");
                    _this._frameTime.beginMonitoring();
                }
                if (_this._captureInterFrameTime) {
                    _this._interFrameTime.endMonitoring();
                }
                if (_this._captureParticlesRenderTime) {
                    _this._particlesRenderTime.fetchNewFrame();
                }
                if (_this._captureSpritesRenderTime) {
                    _this._spritesRenderTime.fetchNewFrame();
                }
                if (_this._captureAnimationsTime) {
                    _this._animationsTime.beginMonitoring();
                }
                _this.scene.getEngine()._drawCalls.fetchNewFrame();
                _this.scene.getEngine()._textureCollisions.fetchNewFrame();
            });
            // After render
            this._onAfterRenderObserver = scene.onAfterRenderObservable.add(function () {
                if (_this._captureFrameTime) {
                    LIB.Tools.EndPerformanceCounter("Scene rendering");
                    _this._frameTime.endMonitoring();
                }
                if (_this._captureRenderTime) {
                    _this._renderTime.endMonitoring(false);
                }
                if (_this._captureInterFrameTime) {
                    _this._interFrameTime.beginMonitoring();
                }
            });
        }
        Object.defineProperty(SceneInstrumentation.prototype, "activeMeshesEvaluationTimeCounter", {
            // Properties
            /**
             * Gets the perf counter used for active meshes evaluation time
             */
            get: function () {
                return this._activeMeshesEvaluationTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "captureActiveMeshesEvaluationTime", {
            /**
             * Gets the active meshes evaluation time capture status
             */
            get: function () {
                return this._captureActiveMeshesEvaluationTime;
            },
            /**
             * Enable or disable the active meshes evaluation time capture
             */
            set: function (value) {
                var _this = this;
                if (value === this._captureActiveMeshesEvaluationTime) {
                    return;
                }
                this._captureActiveMeshesEvaluationTime = value;
                if (value) {
                    this._onBeforeActiveMeshesEvaluationObserver = this.scene.onBeforeActiveMeshesEvaluationObservable.add(function () {
                        LIB.Tools.StartPerformanceCounter("Active meshes evaluation");
                        _this._activeMeshesEvaluationTime.beginMonitoring();
                    });
                    this._onAfterActiveMeshesEvaluationObserver = this.scene.onAfterActiveMeshesEvaluationObservable.add(function () {
                        LIB.Tools.EndPerformanceCounter("Active meshes evaluation");
                        _this._activeMeshesEvaluationTime.endMonitoring();
                    });
                }
                else {
                    this.scene.onBeforeActiveMeshesEvaluationObservable.remove(this._onBeforeActiveMeshesEvaluationObserver);
                    this._onBeforeActiveMeshesEvaluationObserver = null;
                    this.scene.onAfterActiveMeshesEvaluationObservable.remove(this._onAfterActiveMeshesEvaluationObserver);
                    this._onAfterActiveMeshesEvaluationObserver = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "renderTargetsRenderTimeCounter", {
            /**
             * Gets the perf counter used for render targets render time
             */
            get: function () {
                return this._renderTargetsRenderTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "captureRenderTargetsRenderTime", {
            /**
             * Gets the render targets render time capture status
             */
            get: function () {
                return this._captureRenderTargetsRenderTime;
            },
            /**
             * Enable or disable the render targets render time capture
             */
            set: function (value) {
                var _this = this;
                if (value === this._captureRenderTargetsRenderTime) {
                    return;
                }
                this._captureRenderTargetsRenderTime = value;
                if (value) {
                    this._onBeforeRenderTargetsRenderObserver = this.scene.onBeforeRenderTargetsRenderObservable.add(function () {
                        LIB.Tools.StartPerformanceCounter("Render targets rendering");
                        _this._renderTargetsRenderTime.beginMonitoring();
                    });
                    this._onAfterRenderTargetsRenderObserver = this.scene.onAfterRenderTargetsRenderObservable.add(function () {
                        LIB.Tools.EndPerformanceCounter("Render targets rendering");
                        _this._renderTargetsRenderTime.endMonitoring(false);
                    });
                }
                else {
                    this.scene.onBeforeRenderTargetsRenderObservable.remove(this._onBeforeRenderTargetsRenderObserver);
                    this._onBeforeRenderTargetsRenderObserver = null;
                    this.scene.onAfterRenderTargetsRenderObservable.remove(this._onAfterRenderTargetsRenderObserver);
                    this._onAfterRenderTargetsRenderObserver = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "particlesRenderTimeCounter", {
            /**
             * Gets the perf counter used for particles render time
             */
            get: function () {
                return this._particlesRenderTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "captureParticlesRenderTime", {
            /**
             * Gets the particles render time capture status
             */
            get: function () {
                return this._captureParticlesRenderTime;
            },
            /**
             * Enable or disable the particles render time capture
             */
            set: function (value) {
                var _this = this;
                if (value === this._captureParticlesRenderTime) {
                    return;
                }
                this._captureParticlesRenderTime = value;
                if (value) {
                    this._onBeforeParticlesRenderingObserver = this.scene.onBeforeParticlesRenderingObservable.add(function () {
                        LIB.Tools.StartPerformanceCounter("Particles");
                        _this._particlesRenderTime.beginMonitoring();
                    });
                    this._onAfterParticlesRenderingObserver = this.scene.onAfterParticlesRenderingObservable.add(function () {
                        LIB.Tools.EndPerformanceCounter("Particles");
                        _this._particlesRenderTime.endMonitoring(false);
                    });
                }
                else {
                    this.scene.onBeforeParticlesRenderingObservable.remove(this._onBeforeParticlesRenderingObserver);
                    this._onBeforeParticlesRenderingObserver = null;
                    this.scene.onAfterParticlesRenderingObservable.remove(this._onAfterParticlesRenderingObserver);
                    this._onAfterParticlesRenderingObserver = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "spritesRenderTimeCounter", {
            /**
             * Gets the perf counter used for sprites render time
             */
            get: function () {
                return this._spritesRenderTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "captureSpritesRenderTime", {
            /**
             * Gets the sprites render time capture status
             */
            get: function () {
                return this._captureSpritesRenderTime;
            },
            /**
             * Enable or disable the sprites render time capture
             */
            set: function (value) {
                var _this = this;
                if (value === this._captureSpritesRenderTime) {
                    return;
                }
                this._captureSpritesRenderTime = value;
                if (value) {
                    this._onBeforeSpritesRenderingObserver = this.scene.onBeforeSpritesRenderingObservable.add(function () {
                        LIB.Tools.StartPerformanceCounter("Sprites");
                        _this._spritesRenderTime.beginMonitoring();
                    });
                    this._onAfterSpritesRenderingObserver = this.scene.onAfterSpritesRenderingObservable.add(function () {
                        LIB.Tools.EndPerformanceCounter("Sprites");
                        _this._spritesRenderTime.endMonitoring(false);
                    });
                }
                else {
                    this.scene.onBeforeSpritesRenderingObservable.remove(this._onBeforeSpritesRenderingObserver);
                    this._onBeforeSpritesRenderingObserver = null;
                    this.scene.onAfterSpritesRenderingObservable.remove(this._onAfterSpritesRenderingObserver);
                    this._onAfterSpritesRenderingObserver = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "physicsTimeCounter", {
            /**
             * Gets the perf counter used for physics time
             */
            get: function () {
                return this._physicsTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "capturePhysicsTime", {
            /**
             * Gets the physics time capture status
             */
            get: function () {
                return this._capturePhysicsTime;
            },
            /**
             * Enable or disable the physics time capture
             */
            set: function (value) {
                var _this = this;
                if (value === this._capturePhysicsTime) {
                    return;
                }
                this._capturePhysicsTime = value;
                if (value) {
                    this._onBeforePhysicsObserver = this.scene.onBeforePhysicsObservable.add(function () {
                        LIB.Tools.StartPerformanceCounter("Physics");
                        _this._physicsTime.beginMonitoring();
                    });
                    this._onAfterPhysicsObserver = this.scene.onAfterPhysicsObservable.add(function () {
                        LIB.Tools.EndPerformanceCounter("Physics");
                        _this._physicsTime.endMonitoring();
                    });
                }
                else {
                    this.scene.onBeforePhysicsObservable.remove(this._onBeforePhysicsObserver);
                    this._onBeforePhysicsObserver = null;
                    this.scene.onAfterPhysicsObservable.remove(this._onAfterPhysicsObserver);
                    this._onAfterPhysicsObserver = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "animationsTimeCounter", {
            /**
             * Gets the perf counter used for animations time
             */
            get: function () {
                return this._animationsTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "captureAnimationsTime", {
            /**
             * Gets the animations time capture status
             */
            get: function () {
                return this._captureAnimationsTime;
            },
            /**
             * Enable or disable the animations time capture
             */
            set: function (value) {
                var _this = this;
                if (value === this._captureAnimationsTime) {
                    return;
                }
                this._captureAnimationsTime = value;
                if (value) {
                    this._onAfterAnimationsObserver = this.scene.onAfterAnimationsObservable.add(function () {
                        _this._animationsTime.endMonitoring();
                    });
                }
                else {
                    this.scene.onAfterAnimationsObservable.remove(this._onAfterAnimationsObserver);
                    this._onAfterAnimationsObserver = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "frameTimeCounter", {
            /**
             * Gets the perf counter used for frame time capture
             */
            get: function () {
                return this._frameTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "captureFrameTime", {
            /**
             * Gets the frame time capture status
             */
            get: function () {
                return this._captureFrameTime;
            },
            /**
             * Enable or disable the frame time capture
             */
            set: function (value) {
                this._captureFrameTime = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "interFrameTimeCounter", {
            /**
             * Gets the perf counter used for inter-frames time capture
             */
            get: function () {
                return this._interFrameTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "captureInterFrameTime", {
            /**
             * Gets the inter-frames time capture status
             */
            get: function () {
                return this._captureInterFrameTime;
            },
            /**
             * Enable or disable the inter-frames time capture
             */
            set: function (value) {
                this._captureInterFrameTime = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "renderTimeCounter", {
            /**
             * Gets the perf counter used for render time capture
             */
            get: function () {
                return this._renderTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "captureRenderTime", {
            /**
             * Gets the render time capture status
             */
            get: function () {
                return this._captureRenderTime;
            },
            /**
             * Enable or disable the render time capture
             */
            set: function (value) {
                var _this = this;
                if (value === this._captureRenderTime) {
                    return;
                }
                this._captureRenderTime = value;
                if (value) {
                    this._onBeforeDrawPhaseObserver = this.scene.onBeforeDrawPhaseObservable.add(function () {
                        _this._renderTime.beginMonitoring();
                        LIB.Tools.StartPerformanceCounter("Main render");
                    });
                    this._onAfterDrawPhaseObserver = this.scene.onAfterDrawPhaseObservable.add(function () {
                        _this._renderTime.endMonitoring(false);
                        LIB.Tools.EndPerformanceCounter("Main render");
                    });
                }
                else {
                    this.scene.onBeforeDrawPhaseObservable.remove(this._onBeforeDrawPhaseObserver);
                    this._onBeforeDrawPhaseObserver = null;
                    this.scene.onAfterDrawPhaseObservable.remove(this._onAfterDrawPhaseObserver);
                    this._onAfterDrawPhaseObserver = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "drawCallsCounter", {
            /**
             * Gets the perf counter used for draw calls
             */
            get: function () {
                return this.scene.getEngine()._drawCalls;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SceneInstrumentation.prototype, "textureCollisionsCounter", {
            /**
             * Gets the perf counter used for texture collisions
             */
            get: function () {
                return this.scene.getEngine()._textureCollisions;
            },
            enumerable: true,
            configurable: true
        });
        SceneInstrumentation.prototype.dispose = function () {
            this.scene.onAfterRenderObservable.remove(this._onAfterRenderObserver);
            this._onAfterRenderObserver = null;
            this.scene.onBeforeActiveMeshesEvaluationObservable.remove(this._onBeforeActiveMeshesEvaluationObserver);
            this._onBeforeActiveMeshesEvaluationObserver = null;
            this.scene.onAfterActiveMeshesEvaluationObservable.remove(this._onAfterActiveMeshesEvaluationObserver);
            this._onAfterActiveMeshesEvaluationObserver = null;
            this.scene.onBeforeRenderTargetsRenderObservable.remove(this._onBeforeRenderTargetsRenderObserver);
            this._onBeforeRenderTargetsRenderObserver = null;
            this.scene.onAfterRenderTargetsRenderObservable.remove(this._onAfterRenderTargetsRenderObserver);
            this._onAfterRenderTargetsRenderObserver = null;
            this.scene.onBeforeAnimationsObservable.remove(this._onBeforeAnimationsObserver);
            this._onBeforeAnimationsObserver = null;
            this.scene.onBeforeParticlesRenderingObservable.remove(this._onBeforeParticlesRenderingObserver);
            this._onBeforeParticlesRenderingObserver = null;
            this.scene.onAfterParticlesRenderingObservable.remove(this._onAfterParticlesRenderingObserver);
            this._onAfterParticlesRenderingObserver = null;
            this.scene.onBeforeSpritesRenderingObservable.remove(this._onBeforeSpritesRenderingObserver);
            this._onBeforeSpritesRenderingObserver = null;
            this.scene.onAfterSpritesRenderingObservable.remove(this._onAfterSpritesRenderingObserver);
            this._onAfterSpritesRenderingObserver = null;
            this.scene.onBeforeDrawPhaseObservable.remove(this._onBeforeDrawPhaseObserver);
            this._onBeforeDrawPhaseObserver = null;
            this.scene.onAfterDrawPhaseObservable.remove(this._onAfterDrawPhaseObserver);
            this._onAfterDrawPhaseObserver = null;
            this.scene.onBeforePhysicsObservable.remove(this._onBeforePhysicsObserver);
            this._onBeforePhysicsObserver = null;
            this.scene.onAfterPhysicsObservable.remove(this._onAfterPhysicsObserver);
            this._onAfterPhysicsObserver = null;
            this.scene.onAfterAnimationsObservable.remove(this._onAfterAnimationsObserver);
            this._onAfterAnimationsObserver = null;
            this.scene = null;
        };
        return SceneInstrumentation;
    }());
    LIB.SceneInstrumentation = SceneInstrumentation;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.sceneInstrumentation.js.map
//# sourceMappingURL=LIB.sceneInstrumentation.js.map
