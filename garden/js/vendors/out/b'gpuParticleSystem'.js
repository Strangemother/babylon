
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var LIB;
(function (LIB) {
    /**
     * This represents a GPU particle system in LIB
     * This is the fastest particle system in LIB as it uses the GPU to update the individual particle data
     * @see https://www.LIBjs-playground.com/#PU4WYI#4
     */
    var GPUParticleSystem = /** @class */ (function () {
        /**
         * Instantiates a GPU particle system.
         * Particles are often small sprites used to simulate hard-to-reproduce phenomena like fire, smoke, water, or abstract visual effects like magic glitter and faery dust.
         * @param name The name of the particle system
         * @param capacity The max number of particles alive at the same time
         * @param scene The scene the particle system belongs to
         */
        function GPUParticleSystem(name, options, scene) {
            /**
             * The emitter represents the Mesh or position we are attaching the particle system to.
             */
            this.emitter = null;
            /**
             * The rendering group used by the Particle system to chose when to render.
             */
            this.renderingGroupId = 0;
            /**
             * The layer mask we are rendering the particles through.
             */
            this.layerMask = 0x0FFFFFFF;
            this._targetIndex = 0;
            this._currentRenderId = -1;
            this._started = false;
            this._stopped = false;
            this._timeDelta = 0;
            this._attributesStrideSize = 14;
            this._actualFrame = 0;
            /**
             * List of animations used by the particle system.
             */
            this.animations = [];
            /**
            * An event triggered when the system is disposed.
            */
            this.onDisposeObservable = new LIB.Observable();
            /**
             * The overall motion speed (0.01 is default update speed, faster updates = faster animation)
             */
            this.updateSpeed = 0.01;
            /**
             * The amount of time the particle system is running (depends of the overall update speed).
             */
            this.targetStopDuration = 0;
            /**
             * Blend mode use to render the particle, it can be either ParticleSystem.BLENDMODE_ONEONE or ParticleSystem.BLENDMODE_STANDARD.
             */
            this.blendMode = LIB.ParticleSystem.BLENDMODE_ONEONE;
            /**
             * Minimum life time of emitting particles.
             */
            this.minLifeTime = 1;
            /**
             * Maximum life time of emitting particles.
             */
            this.maxLifeTime = 1;
            /**
             * Minimum Size of emitting particles.
             */
            this.minSize = 1;
            /**
             * Maximum Size of emitting particles.
             */
            this.maxSize = 1;
            /**
             * Random color of each particle after it has been emitted, between color1 and color2 vectors.
             */
            this.color1 = new LIB.Color4(1.0, 1.0, 1.0, 1.0);
            /**
             * Random color of each particle after it has been emitted, between color1 and color2 vectors.
             */
            this.color2 = new LIB.Color4(1.0, 1.0, 1.0, 1.0);
            /**
             * Color the particle will have at the end of its lifetime.
             */
            this.colorDead = new LIB.Color4(0, 0, 0, 0);
            /**
             * The maximum number of particles to emit per frame until we reach the activeParticleCount value
             */
            this.emitRate = 100;
            /**
             * You can use gravity if you want to give an orientation to your particles.
             */
            this.gravity = LIB.Vector3.Zero();
            /**
             * Minimum power of emitting particles.
             */
            this.minEmitPower = 1;
            /**
             * Maximum power of emitting particles.
             */
            this.maxEmitPower = 1;
            /**
             * Forces the particle to write their depth information to the depth buffer. This can help preventing other draw calls
             * to override the particles.
             */
            this.forceDepthWrite = false;
            this.id = name;
            this.name = name;
            this._scene = scene || LIB.Engine.LastCreatedScene;
            this._engine = this._scene.getEngine();
            var fullOptions = __assign({ capacity: 50000, randomTextureSize: this._engine.getCaps().maxTextureSize }, options);
            this._capacity = fullOptions.capacity;
            this._activeCount = fullOptions.capacity;
            this._currentActiveCount = 0;
            this._scene.particleSystems.push(this);
            this._updateEffectOptions = {
                attributes: ["position", "age", "life", "seed", "size", "color", "direction"],
                uniformsNames: ["currentCount", "timeDelta", "generalRandoms", "emitterWM", "lifeTime", "color1", "color2", "sizeRange", "gravity", "emitPower",
                    "direction1", "direction2", "minEmitBox", "maxEmitBox", "radius", "directionRandomizer", "height", "angle", "stopFactor"],
                uniformBuffersNames: [],
                samplers: ["randomSampler"],
                defines: "",
                fallbacks: null,
                onCompiled: null,
                onError: null,
                indexParameters: null,
                maxSimultaneousLights: 0,
                transformFeedbackVaryings: ["outPosition", "outAge", "outLife", "outSeed", "outSize", "outColor", "outDirection"]
            };
            // Random data
            var maxTextureSize = Math.min(this._engine.getCaps().maxTextureSize, fullOptions.randomTextureSize);
            var d = [];
            for (var i = 0; i < maxTextureSize; ++i) {
                d.push(Math.random());
                d.push(Math.random());
                d.push(Math.random());
                d.push(Math.random());
            }
            this._randomTexture = new LIB.RawTexture(new Float32Array(d), maxTextureSize, 1, LIB.Engine.TEXTUREFORMAT_RGBA32F, this._scene, false, false, LIB.Texture.NEAREST_SAMPLINGMODE, LIB.Engine.TEXTURETYPE_FLOAT);
            this._randomTexture.wrapU = LIB.Texture.WRAP_ADDRESSMODE;
            this._randomTexture.wrapV = LIB.Texture.WRAP_ADDRESSMODE;
            this._randomTextureSize = maxTextureSize;
            this.particleEmitterType = new LIB.BoxParticleEmitter();
        }
        Object.defineProperty(GPUParticleSystem, "IsSupported", {
            /**
             * Gets a boolean indicating if the GPU particles can be rendered on current browser
             */
            get: function () {
                if (!LIB.Engine.LastCreatedEngine) {
                    return false;
                }
                return LIB.Engine.LastCreatedEngine.webGLVersion > 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUParticleSystem.prototype, "direction1", {
            /**
             * Random direction of each particle after it has been emitted, between direction1 and direction2 vectors.
             * This only works when particleEmitterTyps is a BoxParticleEmitter
             */
            get: function () {
                if (this.particleEmitterType.direction1) {
                    return this.particleEmitterType.direction1;
                }
                return LIB.Vector3.Zero();
            },
            set: function (value) {
                if (this.particleEmitterType.direction1) {
                    this.particleEmitterType.direction1 = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUParticleSystem.prototype, "direction2", {
            /**
             * Random direction of each particle after it has been emitted, between direction1 and direction2 vectors.
             * This only works when particleEmitterTyps is a BoxParticleEmitter
             */
            get: function () {
                if (this.particleEmitterType.direction2) {
                    return this.particleEmitterType.direction2;
                }
                return LIB.Vector3.Zero();
            },
            set: function (value) {
                if (this.particleEmitterType.direction2) {
                    this.particleEmitterType.direction2 = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUParticleSystem.prototype, "minEmitBox", {
            /**
             * Minimum box point around our emitter. Our emitter is the center of particles source, but if you want your particles to emit from more than one point, then you can tell it to do so.
             * This only works when particleEmitterTyps is a BoxParticleEmitter
             */
            get: function () {
                if (this.particleEmitterType.minEmitBox) {
                    return this.particleEmitterType.minEmitBox;
                }
                return LIB.Vector3.Zero();
            },
            set: function (value) {
                if (this.particleEmitterType.minEmitBox) {
                    this.particleEmitterType.minEmitBox = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GPUParticleSystem.prototype, "maxEmitBox", {
            /**
             * Maximum box point around our emitter. Our emitter is the center of particles source, but if you want your particles to emit from more than one point, then you can tell it to do so.
             * This only works when particleEmitterTyps is a BoxParticleEmitter
             */
            get: function () {
                if (this.particleEmitterType.maxEmitBox) {
                    return this.particleEmitterType.maxEmitBox;
                }
                return LIB.Vector3.Zero();
            },
            set: function (value) {
                if (this.particleEmitterType.maxEmitBox) {
                    this.particleEmitterType.maxEmitBox = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the maximum number of particles active at the same time.
         * @returns The max number of active particles.
         */
        GPUParticleSystem.prototype.getCapacity = function () {
            return this._capacity;
        };
        Object.defineProperty(GPUParticleSystem.prototype, "activeParticleCount", {
            /**
             * Gets or set the number of active particles
             */
            get: function () {
                return this._activeCount;
            },
            set: function (value) {
                this._activeCount = Math.min(value, this._capacity);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Is this system ready to be used/rendered
         * @return true if the system is ready
         */
        GPUParticleSystem.prototype.isReady = function () {
            if (!this._updateEffect) {
                this._recreateUpdateEffect();
                this._recreateRenderEffect();
                return false;
            }
            if (!this.emitter || !this._updateEffect.isReady() || !this._renderEffect.isReady() || !this.particleTexture || !this.particleTexture.isReady()) {
                return false;
            }
            return true;
        };
        /**
         * Gets Wether the system has been started.
         * @returns True if it has been started, otherwise false.
         */
        GPUParticleSystem.prototype.isStarted = function () {
            return this._started;
        };
        /**
         * Starts the particle system and begins to emit.
         */
        GPUParticleSystem.prototype.start = function () {
            this._started = true;
            this._stopped = false;
        };
        /**
         * Stops the particle system.
         */
        GPUParticleSystem.prototype.stop = function () {
            this._stopped = true;
        };
        /**
         * Remove all active particles
         */
        GPUParticleSystem.prototype.reset = function () {
            this._releaseBuffers();
            this._releaseVAOs();
            this._currentActiveCount = 0;
            this._targetIndex = 0;
        };
        /**
         * Returns the string "GPUParticleSystem"
         * @returns a string containing the class name
         */
        GPUParticleSystem.prototype.getClassName = function () {
            return "GPUParticleSystem";
        };
        GPUParticleSystem.prototype._createUpdateVAO = function (source) {
            var updateVertexBuffers = {};
            updateVertexBuffers["position"] = source.createVertexBuffer("position", 0, 3);
            updateVertexBuffers["age"] = source.createVertexBuffer("age", 3, 1);
            updateVertexBuffers["life"] = source.createVertexBuffer("life", 4, 1);
            updateVertexBuffers["seed"] = source.createVertexBuffer("seed", 5, 1);
            updateVertexBuffers["size"] = source.createVertexBuffer("size", 6, 1);
            updateVertexBuffers["color"] = source.createVertexBuffer("color", 7, 4);
            updateVertexBuffers["direction"] = source.createVertexBuffer("direction", 11, 3);
            var vao = this._engine.recordVertexArrayObject(updateVertexBuffers, null, this._updateEffect);
            this._engine.bindArrayBuffer(null);
            return vao;
        };
        GPUParticleSystem.prototype._createRenderVAO = function (source, spriteSource) {
            var renderVertexBuffers = {};
            renderVertexBuffers["position"] = source.createVertexBuffer("position", 0, 3, this._attributesStrideSize, true);
            renderVertexBuffers["age"] = source.createVertexBuffer("age", 3, 1, this._attributesStrideSize, true);
            renderVertexBuffers["life"] = source.createVertexBuffer("life", 4, 1, this._attributesStrideSize, true);
            renderVertexBuffers["size"] = source.createVertexBuffer("size", 6, 1, this._attributesStrideSize, true);
            renderVertexBuffers["color"] = source.createVertexBuffer("color", 7, 4, this._attributesStrideSize, true);
            renderVertexBuffers["offset"] = spriteSource.createVertexBuffer("offset", 0, 2);
            renderVertexBuffers["uv"] = spriteSource.createVertexBuffer("uv", 2, 2);
            var vao = this._engine.recordVertexArrayObject(renderVertexBuffers, null, this._renderEffect);
            this._engine.bindArrayBuffer(null);
            return vao;
        };
        GPUParticleSystem.prototype._initialize = function (force) {
            if (force === void 0) { force = false; }
            if (this._buffer0 && !force) {
                return;
            }
            var engine = this._scene.getEngine();
            var data = new Array();
            for (var particleIndex = 0; particleIndex < this._capacity; particleIndex++) {
                // position
                data.push(0.0);
                data.push(0.0);
                data.push(0.0);
                // Age and life
                data.push(0.0); // create the particle as a dead one to create a new one at start
                data.push(0.0);
                // Seed
                data.push(Math.random());
                // Size
                data.push(0.0);
                // color
                data.push(0.0);
                data.push(0.0);
                data.push(0.0);
                data.push(0.0);
                // direction
                data.push(0.0);
                data.push(0.0);
                data.push(0.0);
            }
            // Sprite data
            var spriteData = new Float32Array([0.5, 0.5, 1, 1,
                -0.5, 0.5, 0, 1,
                -0.5, -0.5, 0, 0,
                0.5, -0.5, 1, 0]);
            // Buffers
            this._buffer0 = new LIB.Buffer(engine, data, false, this._attributesStrideSize);
            this._buffer1 = new LIB.Buffer(engine, data, false, this._attributesStrideSize);
            this._spriteBuffer = new LIB.Buffer(engine, spriteData, false, 4);
            // Update VAO
            this._updateVAO = [];
            this._updateVAO.push(this._createUpdateVAO(this._buffer0));
            this._updateVAO.push(this._createUpdateVAO(this._buffer1));
            // Render VAO
            this._renderVAO = [];
            this._renderVAO.push(this._createRenderVAO(this._buffer1, this._spriteBuffer));
            this._renderVAO.push(this._createRenderVAO(this._buffer0, this._spriteBuffer));
            // Links
            this._sourceBuffer = this._buffer0;
            this._targetBuffer = this._buffer1;
        };
        /** @hidden */
        GPUParticleSystem.prototype._recreateUpdateEffect = function () {
            var defines = this.particleEmitterType ? this.particleEmitterType.getEffectDefines() : "";
            if (this._updateEffect && this._updateEffectOptions.defines === defines) {
                return;
            }
            this._updateEffectOptions.defines = defines;
            this._updateEffect = new LIB.Effect("gpuUpdateParticles", this._updateEffectOptions, this._scene.getEngine());
        };
        /** @hidden */
        GPUParticleSystem.prototype._recreateRenderEffect = function () {
            var defines = "";
            if (this._scene.clipPlane) {
                defines = "\n#define CLIPPLANE";
            }
            if (this._renderEffect && this._renderEffect.defines === defines) {
                return;
            }
            this._renderEffect = new LIB.Effect("gpuRenderParticles", ["position", "age", "life", "size", "color", "offset", "uv"], ["view", "projection", "colorDead", "invView", "vClipPlane"], ["textureSampler"], this._scene.getEngine(), defines);
        };
        /**
         * Animates the particle system for the current frame by emitting new particles and or animating the living ones.
         */
        GPUParticleSystem.prototype.animate = function () {
            this._timeDelta = this.updateSpeed * this._scene.getAnimationRatio();
            this._actualFrame += this._timeDelta;
            if (!this._stopped) {
                if (this.targetStopDuration && this._actualFrame >= this.targetStopDuration) {
                    this.stop();
                }
            }
        };
        /**
         * Renders the particle system in its current state.
         * @returns the current number of particles
         */
        GPUParticleSystem.prototype.render = function () {
            if (!this._started) {
                return 0;
            }
            this._recreateUpdateEffect();
            this._recreateRenderEffect();
            if (!this.isReady()) {
                return 0;
            }
            if (this._currentRenderId === this._scene.getRenderId()) {
                return 0;
            }
            this._currentRenderId = this._scene.getRenderId();
            // Get everything ready to render
            this._initialize();
            this._currentActiveCount = Math.min(this._activeCount, this._currentActiveCount + (this.emitRate * this._timeDelta) | 0);
            // Enable update effect
            this._engine.enableEffect(this._updateEffect);
            this._engine.setState(false);
            this._updateEffect.setFloat("currentCount", this._currentActiveCount);
            this._updateEffect.setFloat("timeDelta", this._timeDelta);
            this._updateEffect.setFloat("stopFactor", this._stopped ? 0 : 1);
            this._updateEffect.setFloat3("generalRandoms", Math.random(), Math.random(), Math.random());
            this._updateEffect.setTexture("randomSampler", this._randomTexture);
            this._updateEffect.setFloat2("lifeTime", this.minLifeTime, this.maxLifeTime);
            this._updateEffect.setFloat2("emitPower", this.minEmitPower, this.maxEmitPower);
            this._updateEffect.setDirectColor4("color1", this.color1);
            this._updateEffect.setDirectColor4("color2", this.color2);
            this._updateEffect.setFloat2("sizeRange", this.minSize, this.maxSize);
            this._updateEffect.setVector3("gravity", this.gravity);
            if (this.particleEmitterType) {
                this.particleEmitterType.applyToShader(this._updateEffect);
            }
            var emitterWM;
            if (this.emitter.position) {
                var emitterMesh = this.emitter;
                emitterWM = emitterMesh.getWorldMatrix();
            }
            else {
                var emitterPosition = this.emitter;
                emitterWM = LIB.Matrix.Translation(emitterPosition.x, emitterPosition.y, emitterPosition.z);
            }
            this._updateEffect.setMatrix("emitterWM", emitterWM);
            // Bind source VAO
            this._engine.bindVertexArrayObject(this._updateVAO[this._targetIndex], null);
            // Update
            this._engine.bindTransformFeedbackBuffer(this._targetBuffer.getBuffer());
            this._engine.setRasterizerState(false);
            this._engine.beginTransformFeedback();
            this._engine.drawArraysType(LIB.Material.PointListDrawMode, 0, this._currentActiveCount);
            this._engine.endTransformFeedback();
            this._engine.setRasterizerState(true);
            this._engine.bindTransformFeedbackBuffer(null);
            // Enable render effect
            this._engine.enableEffect(this._renderEffect);
            var viewMatrix = this._scene.getViewMatrix();
            this._renderEffect.setMatrix("view", viewMatrix);
            this._renderEffect.setMatrix("projection", this._scene.getProjectionMatrix());
            this._renderEffect.setTexture("textureSampler", this.particleTexture);
            this._renderEffect.setDirectColor4("colorDead", this.colorDead);
            if (this._scene.clipPlane) {
                var clipPlane = this._scene.clipPlane;
                var invView = viewMatrix.clone();
                invView.invert();
                this._renderEffect.setMatrix("invView", invView);
                this._renderEffect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
            }
            // Draw order
            if (this.blendMode === LIB.ParticleSystem.BLENDMODE_ONEONE) {
                this._engine.setAlphaMode(LIB.Engine.ALPHA_ONEONE);
            }
            else {
                this._engine.setAlphaMode(LIB.Engine.ALPHA_COMBINE);
            }
            if (this.forceDepthWrite) {
                this._engine.setDepthWrite(true);
            }
            // Bind source VAO
            this._engine.bindVertexArrayObject(this._renderVAO[this._targetIndex], null);
            // Render
            this._engine.drawArraysType(LIB.Material.TriangleFanDrawMode, 0, 4, this._currentActiveCount);
            this._engine.setAlphaMode(LIB.Engine.ALPHA_DISABLE);
            // Switch VAOs
            this._targetIndex++;
            if (this._targetIndex === 2) {
                this._targetIndex = 0;
            }
            // Switch buffers
            var tmpBuffer = this._sourceBuffer;
            this._sourceBuffer = this._targetBuffer;
            this._targetBuffer = tmpBuffer;
            return this._currentActiveCount;
        };
        /**
         * Rebuilds the particle system
         */
        GPUParticleSystem.prototype.rebuild = function () {
            this._initialize(true);
        };
        GPUParticleSystem.prototype._releaseBuffers = function () {
            if (this._buffer0) {
                this._buffer0.dispose();
                this._buffer0 = null;
            }
            if (this._buffer1) {
                this._buffer1.dispose();
                this._buffer1 = null;
            }
            if (this._spriteBuffer) {
                this._spriteBuffer.dispose();
                this._spriteBuffer = null;
            }
        };
        GPUParticleSystem.prototype._releaseVAOs = function () {
            if (!this._updateVAO) {
                return;
            }
            for (var index = 0; index < this._updateVAO.length; index++) {
                this._engine.releaseVertexArrayObject(this._updateVAO[index]);
            }
            this._updateVAO = [];
            for (var index = 0; index < this._renderVAO.length; index++) {
                this._engine.releaseVertexArrayObject(this._renderVAO[index]);
            }
            this._renderVAO = [];
        };
        /**
         * Disposes the particle system and free the associated resources
         * @param disposeTexture defines if the particule texture must be disposed as well (true by default)
         */
        GPUParticleSystem.prototype.dispose = function (disposeTexture) {
            if (disposeTexture === void 0) { disposeTexture = true; }
            var index = this._scene.particleSystems.indexOf(this);
            if (index > -1) {
                this._scene.particleSystems.splice(index, 1);
            }
            this._releaseBuffers();
            this._releaseVAOs();
            if (this._randomTexture) {
                this._randomTexture.dispose();
                this._randomTexture = null;
            }
            if (disposeTexture && this.particleTexture) {
                this.particleTexture.dispose();
                this.particleTexture = null;
            }
            // Callback
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
        };
        /**
         * Clones the particle system.
         * @param name The name of the cloned object
         * @param newEmitter The new emitter to use
         * @returns the cloned particle system
         */
        GPUParticleSystem.prototype.clone = function (name, newEmitter) {
            var result = new GPUParticleSystem(name, { capacity: this._capacity, randomTextureSize: this._randomTextureSize }, this._scene);
            LIB.Tools.DeepCopy(this, result);
            if (newEmitter === undefined) {
                newEmitter = this.emitter;
            }
            result.emitter = newEmitter;
            if (this.particleTexture) {
                result.particleTexture = new LIB.Texture(this.particleTexture.url, this._scene);
            }
            return result;
        };
        /**
         * Serializes the particle system to a JSON object.
         * @returns the JSON object
         */
        GPUParticleSystem.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.name = this.name;
            serializationObject.id = this.id;
            // Emitter
            if (this.emitter.position) {
                var emitterMesh = this.emitter;
                serializationObject.emitterId = emitterMesh.id;
            }
            else {
                var emitterPosition = this.emitter;
                serializationObject.emitter = emitterPosition.asArray();
            }
            serializationObject.capacity = this.getCapacity();
            if (this.particleTexture) {
                serializationObject.textureName = this.particleTexture.name;
            }
            // Animations
            LIB.Animation.AppendSerializedAnimations(this, serializationObject);
            // Particle system
            serializationObject.activeParticleCount = this.activeParticleCount;
            serializationObject.randomTextureSize = this._randomTextureSize;
            serializationObject.minSize = this.minSize;
            serializationObject.maxSize = this.maxSize;
            serializationObject.minEmitPower = this.minEmitPower;
            serializationObject.maxEmitPower = this.maxEmitPower;
            serializationObject.minLifeTime = this.minLifeTime;
            serializationObject.maxLifeTime = this.maxLifeTime;
            serializationObject.emitRate = this.emitRate;
            serializationObject.gravity = this.gravity.asArray();
            serializationObject.color1 = this.color1.asArray();
            serializationObject.color2 = this.color2.asArray();
            serializationObject.colorDead = this.colorDead.asArray();
            serializationObject.updateSpeed = this.updateSpeed;
            serializationObject.targetStopDuration = this.targetStopDuration;
            serializationObject.blendMode = this.blendMode;
            // Emitter
            if (this.particleEmitterType) {
                serializationObject.particleEmitterType = this.particleEmitterType.serialize();
            }
            return serializationObject;
        };
        /**
         * Parses a JSON object to create a GPU particle system.
         * @param parsedParticleSystem The JSON object to parse
         * @param scene The scene to create the particle system in
         * @param rootUrl The root url to use to load external dependencies like texture
         * @returns the parsed GPU particle system
         */
        GPUParticleSystem.Parse = function (parsedParticleSystem, scene, rootUrl) {
            var name = parsedParticleSystem.name;
            var particleSystem = new GPUParticleSystem(name, { capacity: parsedParticleSystem.capacity, randomTextureSize: parsedParticleSystem.randomTextureSize }, scene);
            if (parsedParticleSystem.id) {
                particleSystem.id = parsedParticleSystem.id;
            }
            // Texture
            if (parsedParticleSystem.textureName) {
                particleSystem.particleTexture = new LIB.Texture(rootUrl + parsedParticleSystem.textureName, scene);
                particleSystem.particleTexture.name = parsedParticleSystem.textureName;
            }
            // Emitter
            if (parsedParticleSystem.emitterId) {
                particleSystem.emitter = scene.getLastMeshByID(parsedParticleSystem.emitterId);
            }
            else {
                particleSystem.emitter = LIB.Vector3.FromArray(parsedParticleSystem.emitter);
            }
            // Animations
            if (parsedParticleSystem.animations) {
                for (var animationIndex = 0; animationIndex < parsedParticleSystem.animations.length; animationIndex++) {
                    var parsedAnimation = parsedParticleSystem.animations[animationIndex];
                    particleSystem.animations.push(LIB.Animation.Parse(parsedAnimation));
                }
            }
            // Particle system
            particleSystem.activeParticleCount = parsedParticleSystem.activeParticleCount;
            particleSystem.minSize = parsedParticleSystem.minSize;
            particleSystem.maxSize = parsedParticleSystem.maxSize;
            particleSystem.minLifeTime = parsedParticleSystem.minLifeTime;
            particleSystem.maxLifeTime = parsedParticleSystem.maxLifeTime;
            particleSystem.minEmitPower = parsedParticleSystem.minEmitPower;
            particleSystem.maxEmitPower = parsedParticleSystem.maxEmitPower;
            particleSystem.emitRate = parsedParticleSystem.emitRate;
            particleSystem.gravity = LIB.Vector3.FromArray(parsedParticleSystem.gravity);
            particleSystem.color1 = LIB.Color4.FromArray(parsedParticleSystem.color1);
            particleSystem.color2 = LIB.Color4.FromArray(parsedParticleSystem.color2);
            particleSystem.colorDead = LIB.Color4.FromArray(parsedParticleSystem.colorDead);
            particleSystem.updateSpeed = parsedParticleSystem.updateSpeed;
            particleSystem.targetStopDuration = parsedParticleSystem.targetStopDuration;
            particleSystem.blendMode = parsedParticleSystem.blendMode;
            // Emitter
            if (parsedParticleSystem.particleEmitterType) {
                var emitterType = void 0;
                switch (parsedParticleSystem.particleEmitterType.type) {
                    case "SphereEmitter":
                        emitterType = new LIB.SphereParticleEmitter();
                        break;
                    case "SphereDirectedParticleEmitter":
                        emitterType = new LIB.SphereDirectedParticleEmitter();
                        break;
                    case "ConeEmitter":
                        emitterType = new LIB.ConeParticleEmitter();
                        break;
                    case "BoxEmitter":
                    default:
                        emitterType = new LIB.BoxParticleEmitter();
                        break;
                }
                emitterType.parse(parsedParticleSystem.particleEmitterType);
                particleSystem.particleEmitterType = emitterType;
            }
            return particleSystem;
        };
        return GPUParticleSystem;
    }());
    LIB.GPUParticleSystem = GPUParticleSystem;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.gpuParticleSystem.js.map
//# sourceMappingURL=LIB.gpuParticleSystem.js.map
