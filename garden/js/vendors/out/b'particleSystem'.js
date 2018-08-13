
var LIB;
(function (LIB) {
    /**
     * This represents a particle system in LIB.
     * Particles are often small sprites used to simulate hard-to-reproduce phenomena like fire, smoke, water, or abstract visual effects like magic glitter and faery dust.
     * Particles can take different shapes while emitted like box, sphere, cone or you can write your custom function.
     * @example https://doc.LIBjs.com/LIB101/particles
     */
    var ParticleSystem = /** @class */ (function () {
        /**
         * Instantiates a particle system.
         * Particles are often small sprites used to simulate hard-to-reproduce phenomena like fire, smoke, water, or abstract visual effects like magic glitter and faery dust.
         * @param name The name of the particle system
         * @param capacity The max number of particles alive at the same time
         * @param scene The scene the particle system belongs to
         * @param customEffect a custom effect used to change the way particles are rendered by default
         * @param isAnimationSheetEnabled Must be true if using a spritesheet to animate the particles texture
         * @param epsilon Offset used to render the particles
         */
        function ParticleSystem(name, capacity, scene, customEffect, isAnimationSheetEnabled, epsilon) {
            if (customEffect === void 0) { customEffect = null; }
            if (isAnimationSheetEnabled === void 0) { isAnimationSheetEnabled = false; }
            if (epsilon === void 0) { epsilon = 0.01; }
            var _this = this;
            /**
             * List of animations used by the particle system.
             */
            this.animations = [];
            /**
             * The rendering group used by the Particle system to chose when to render.
             */
            this.renderingGroupId = 0;
            /**
             * The emitter represents the Mesh or position we are attaching the particle system to.
             */
            this.emitter = null;
            /**
             * The maximum number of particles to emit per frame
             */
            this.emitRate = 10;
            /**
             * If you want to launch only a few particles at once, that can be done, as well.
             */
            this.manualEmitCount = -1;
            /**
             * The overall motion speed (0.01 is default update speed, faster updates = faster animation)
             */
            this.updateSpeed = 0.01;
            /**
             * The amount of time the particle system is running (depends of the overall update speed).
             */
            this.targetStopDuration = 0;
            /**
             * Specifies whether the particle system will be disposed once it reaches the end of the animation.
             */
            this.disposeOnStop = false;
            /**
             * Minimum power of emitting particles.
             */
            this.minEmitPower = 1;
            /**
             * Maximum power of emitting particles.
             */
            this.maxEmitPower = 1;
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
             * Minimum angular speed of emitting particles (Z-axis rotation for each particle).
             */
            this.minAngularSpeed = 0;
            /**
             * Maximum angular speed of emitting particles (Z-axis rotation for each particle).
             */
            this.maxAngularSpeed = 0;
            /**
             * The layer mask we are rendering the particles through.
             */
            this.layerMask = 0x0FFFFFFF;
            /**
             * This can help using your own shader to render the particle system.
             * The according effect will be created
             */
            this.customShader = null;
            /**
             * By default particle system starts as soon as they are created. This prevents the
             * automatic start to happen and let you decide when to start emitting particles.
             */
            this.preventAutoStart = false;
            /**
             * Callback triggered when the particle animation is ending.
             */
            this.onAnimationEnd = null;
            /**
             * Blend mode use to render the particle, it can be either ParticleSystem.BLENDMODE_ONEONE or ParticleSystem.BLENDMODE_STANDARD.
             */
            this.blendMode = ParticleSystem.BLENDMODE_ONEONE;
            /**
             * Forces the particle to write their depth information to the depth buffer. This can help preventing other draw calls
             * to override the particles.
             */
            this.forceDepthWrite = false;
            /**
             * You can use gravity if you want to give an orientation to your particles.
             */
            this.gravity = LIB.Vector3.Zero();
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
            this.colorDead = new LIB.Color4(0, 0, 0, 1.0);
            /**
             * An optional mask to filter some colors out of the texture, or filter a part of the alpha channel.
             */
            this.textureMask = new LIB.Color4(1.0, 1.0, 1.0, 1.0);
            /**
             * If using a spritesheet (isAnimationSheetEnabled), defines if the sprite animation should loop between startSpriteCellID and endSpriteCellID or not.
             */
            this.spriteCellLoop = true;
            /**
             * If using a spritesheet (isAnimationSheetEnabled) and spriteCellLoop defines the speed of the sprite loop.
             */
            this.spriteCellChangeSpeed = 0;
            /**
             * If using a spritesheet (isAnimationSheetEnabled) and spriteCellLoop defines the first sprite cell to display.
             */
            this.startSpriteCellID = 0;
            /**
             * If using a spritesheet (isAnimationSheetEnabled) and spriteCellLoop defines the last sprite cell to display.
             */
            this.endSpriteCellID = 0;
            /**
             * If using a spritesheet (isAnimationSheetEnabled), defines the sprite cell width to use.
             */
            this.spriteCellWidth = 0;
            /**
             * If using a spritesheet (isAnimationSheetEnabled), defines the sprite cell height to use.
             */
            this.spriteCellHeight = 0;
            /**
            * An event triggered when the system is disposed.
            */
            this.onDisposeObservable = new LIB.Observable();
            this._particles = new Array();
            this._stockParticles = new Array();
            this._newPartsExcess = 0;
            this._vertexBuffers = {};
            this._scaledColorStep = new LIB.Color4(0, 0, 0, 0);
            this._colorDiff = new LIB.Color4(0, 0, 0, 0);
            this._scaledDirection = LIB.Vector3.Zero();
            this._scaledGravity = LIB.Vector3.Zero();
            this._currentRenderId = -1;
            this._started = false;
            this._stopped = false;
            this._actualFrame = 0;
            this._vertexBufferSize = 11;
            // start of sub system methods
            /**
             * "Recycles" one of the particle by copying it back to the "stock" of particles and removing it from the active list.
             * Its lifetime will start back at 0.
             */
            this.recycleParticle = function (particle) {
                var lastParticle = _this._particles.pop();
                if (lastParticle !== particle) {
                    lastParticle.copyTo(particle);
                }
                _this._stockParticles.push(lastParticle);
            };
            this._createParticle = function () {
                var particle;
                if (_this._stockParticles.length !== 0) {
                    particle = _this._stockParticles.pop();
                    particle.age = 0;
                    particle.cellIndex = _this.startSpriteCellID;
                }
                else {
                    particle = new LIB.Particle(_this);
                }
                return particle;
            };
            this._emitFromParticle = function (particle) {
                if (!_this.subEmitters || _this.subEmitters.length === 0) {
                    return;
                }
                var templateIndex = Math.floor(Math.random() * _this.subEmitters.length);
                var subSystem = _this.subEmitters[templateIndex].clone(_this.name + "_sub", particle.position.clone());
                subSystem._rootParticleSystem = _this;
                _this.activeSubSystems.push(subSystem);
                subSystem.start();
            };
            this._appendParticleVertexes = null;
            this.id = name;
            this.name = name;
            this._capacity = capacity;
            this._epsilon = epsilon;
            this._isAnimationSheetEnabled = isAnimationSheetEnabled;
            if (isAnimationSheetEnabled) {
                this._vertexBufferSize = 12;
            }
            this._scene = scene || LIB.Engine.LastCreatedScene;
            this._customEffect = customEffect;
            scene.particleSystems.push(this);
            this._createIndexBuffer();
            // 11 floats per particle (x, y, z, r, g, b, a, angle, size, offsetX, offsetY) + 1 filler
            this._vertexData = new Float32Array(capacity * this._vertexBufferSize * 4);
            this._vertexBuffer = new LIB.Buffer(scene.getEngine(), this._vertexData, true, this._vertexBufferSize);
            var positions = this._vertexBuffer.createVertexBuffer(LIB.VertexBuffer.PositionKind, 0, 3);
            var colors = this._vertexBuffer.createVertexBuffer(LIB.VertexBuffer.ColorKind, 3, 4);
            var options = this._vertexBuffer.createVertexBuffer("options", 7, 4);
            if (this._isAnimationSheetEnabled) {
                var cellIndexBuffer = this._vertexBuffer.createVertexBuffer("cellIndex", 11, 1);
                this._vertexBuffers["cellIndex"] = cellIndexBuffer;
            }
            this._vertexBuffers[LIB.VertexBuffer.PositionKind] = positions;
            this._vertexBuffers[LIB.VertexBuffer.ColorKind] = colors;
            this._vertexBuffers["options"] = options;
            // Default emitter type
            this.particleEmitterType = new LIB.BoxParticleEmitter();
            this.updateFunction = function (particles) {
                for (var index = 0; index < particles.length; index++) {
                    var particle = particles[index];
                    particle.age += _this._scaledUpdateSpeed;
                    if (particle.age >= particle.lifeTime) { // Recycle by swapping with last particle
                        _this._emitFromParticle(particle);
                        _this.recycleParticle(particle);
                        index--;
                        continue;
                    }
                    else {
                        particle.colorStep.scaleToRef(_this._scaledUpdateSpeed, _this._scaledColorStep);
                        particle.color.addInPlace(_this._scaledColorStep);
                        if (particle.color.a < 0)
                            particle.color.a = 0;
                        particle.angle += particle.angularSpeed * _this._scaledUpdateSpeed;
                        particle.direction.scaleToRef(_this._scaledUpdateSpeed, _this._scaledDirection);
                        particle.position.addInPlace(_this._scaledDirection);
                        _this.gravity.scaleToRef(_this._scaledUpdateSpeed, _this._scaledGravity);
                        particle.direction.addInPlace(_this._scaledGravity);
                        if (_this._isAnimationSheetEnabled) {
                            particle.updateCellIndex(_this._scaledUpdateSpeed);
                        }
                    }
                }
            };
        }
        Object.defineProperty(ParticleSystem.prototype, "direction1", {
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
        Object.defineProperty(ParticleSystem.prototype, "direction2", {
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
        Object.defineProperty(ParticleSystem.prototype, "minEmitBox", {
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
        Object.defineProperty(ParticleSystem.prototype, "maxEmitBox", {
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
        Object.defineProperty(ParticleSystem.prototype, "onDispose", {
            /**
             * Sets a callback that will be triggered when the system is disposed.
             */
            set: function (callback) {
                if (this._onDisposeObserver) {
                    this.onDisposeObservable.remove(this._onDisposeObserver);
                }
                this._onDisposeObserver = this.onDisposeObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParticleSystem.prototype, "isAnimationSheetEnabled", {
            /**
             * Gets wether an animation sprite sheet is enabled or not on the particle system.
             */
            get: function () {
                return this._isAnimationSheetEnabled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ParticleSystem.prototype, "particles", {
            //end of Sub-emitter
            /**
             * Gets the current list of active particles
             */
            get: function () {
                return this._particles;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the string "ParticleSystem"
         * @returns a string containing the class name
         */
        ParticleSystem.prototype.getClassName = function () {
            return "ParticleSystem";
        };
        ParticleSystem.prototype._createIndexBuffer = function () {
            var indices = [];
            var index = 0;
            for (var count = 0; count < this._capacity; count++) {
                indices.push(index);
                indices.push(index + 1);
                indices.push(index + 2);
                indices.push(index);
                indices.push(index + 2);
                indices.push(index + 3);
                index += 4;
            }
            this._indexBuffer = this._scene.getEngine().createIndexBuffer(indices);
        };
        /**
         * Gets the maximum number of particles active at the same time.
         * @returns The max number of active particles.
         */
        ParticleSystem.prototype.getCapacity = function () {
            return this._capacity;
        };
        /**
         * Gets Wether there are still active particles in the system.
         * @returns True if it is alive, otherwise false.
         */
        ParticleSystem.prototype.isAlive = function () {
            return this._alive;
        };
        /**
         * Gets Wether the system has been started.
         * @returns True if it has been started, otherwise false.
         */
        ParticleSystem.prototype.isStarted = function () {
            return this._started;
        };
        /**
         * Starts the particle system and begins to emit.
         */
        ParticleSystem.prototype.start = function () {
            this._started = true;
            this._stopped = false;
            this._actualFrame = 0;
            if (this.subEmitters && this.subEmitters.length != 0) {
                this.activeSubSystems = new Array();
            }
        };
        /**
         * Stops the particle system.
         * @param stopSubEmitters if true it will stop the current system and all created sub-Systems if false it will stop the current root system only, this param is used by the root particle system only. the default value is true.
         */
        ParticleSystem.prototype.stop = function (stopSubEmitters) {
            if (stopSubEmitters === void 0) { stopSubEmitters = true; }
            this._stopped = true;
            if (stopSubEmitters) {
                this._stopSubEmitters();
            }
        };
        // animation sheet
        /**
         * Remove all active particles
         */
        ParticleSystem.prototype.reset = function () {
            this._stockParticles = [];
            this._particles = [];
        };
        /**
         * @hidden (for internal use only)
         */
        ParticleSystem.prototype._appendParticleVertex = function (index, particle, offsetX, offsetY) {
            var offset = index * this._vertexBufferSize;
            this._vertexData[offset] = particle.position.x;
            this._vertexData[offset + 1] = particle.position.y;
            this._vertexData[offset + 2] = particle.position.z;
            this._vertexData[offset + 3] = particle.color.r;
            this._vertexData[offset + 4] = particle.color.g;
            this._vertexData[offset + 5] = particle.color.b;
            this._vertexData[offset + 6] = particle.color.a;
            this._vertexData[offset + 7] = particle.angle;
            this._vertexData[offset + 8] = particle.size;
            this._vertexData[offset + 9] = offsetX;
            this._vertexData[offset + 10] = offsetY;
        };
        /**
         * @hidden (for internal use only)
         */
        ParticleSystem.prototype._appendParticleVertexWithAnimation = function (index, particle, offsetX, offsetY) {
            if (offsetX === 0)
                offsetX = this._epsilon;
            else if (offsetX === 1)
                offsetX = 1 - this._epsilon;
            if (offsetY === 0)
                offsetY = this._epsilon;
            else if (offsetY === 1)
                offsetY = 1 - this._epsilon;
            var offset = index * this._vertexBufferSize;
            this._vertexData[offset] = particle.position.x;
            this._vertexData[offset + 1] = particle.position.y;
            this._vertexData[offset + 2] = particle.position.z;
            this._vertexData[offset + 3] = particle.color.r;
            this._vertexData[offset + 4] = particle.color.g;
            this._vertexData[offset + 5] = particle.color.b;
            this._vertexData[offset + 6] = particle.color.a;
            this._vertexData[offset + 7] = particle.angle;
            this._vertexData[offset + 8] = particle.size;
            this._vertexData[offset + 9] = offsetX;
            this._vertexData[offset + 10] = offsetY;
            this._vertexData[offset + 11] = particle.cellIndex;
        };
        ParticleSystem.prototype._stopSubEmitters = function () {
            if (!this.activeSubSystems) {
                return;
            }
            this.activeSubSystems.forEach(function (subSystem) {
                subSystem.stop(true);
            });
            this.activeSubSystems = new Array();
        };
        ParticleSystem.prototype._removeFromRoot = function () {
            if (!this._rootParticleSystem) {
                return;
            }
            var index = this._rootParticleSystem.activeSubSystems.indexOf(this);
            if (index !== -1) {
                this._rootParticleSystem.activeSubSystems.splice(index, 1);
            }
        };
        // end of sub system methods
        ParticleSystem.prototype._update = function (newParticles) {
            // Update current
            this._alive = this._particles.length > 0;
            this.updateFunction(this._particles);
            // Add new ones
            var worldMatrix;
            if (this.emitter.position) {
                var emitterMesh = this.emitter;
                worldMatrix = emitterMesh.getWorldMatrix();
            }
            else {
                var emitterPosition = this.emitter;
                worldMatrix = LIB.Matrix.Translation(emitterPosition.x, emitterPosition.y, emitterPosition.z);
            }
            var particle;
            for (var index = 0; index < newParticles; index++) {
                if (this._particles.length === this._capacity) {
                    break;
                }
                particle = this._createParticle();
                this._particles.push(particle);
                var emitPower = LIB.Scalar.RandomRange(this.minEmitPower, this.maxEmitPower);
                if (this.startPositionFunction) {
                    this.startPositionFunction(worldMatrix, particle.position, particle);
                }
                else {
                    this.particleEmitterType.startPositionFunction(worldMatrix, particle.position, particle);
                }
                if (this.startDirectionFunction) {
                    this.startDirectionFunction(emitPower, worldMatrix, particle.direction, particle);
                }
                else {
                    this.particleEmitterType.startDirectionFunction(emitPower, worldMatrix, particle.direction, particle);
                }
                particle.lifeTime = LIB.Scalar.RandomRange(this.minLifeTime, this.maxLifeTime);
                particle.size = LIB.Scalar.RandomRange(this.minSize, this.maxSize);
                particle.angularSpeed = LIB.Scalar.RandomRange(this.minAngularSpeed, this.maxAngularSpeed);
                var step = LIB.Scalar.RandomRange(0, 1.0);
                LIB.Color4.LerpToRef(this.color1, this.color2, step, particle.color);
                this.colorDead.subtractToRef(particle.color, this._colorDiff);
                this._colorDiff.scaleToRef(1.0 / particle.lifeTime, particle.colorStep);
            }
        };
        ParticleSystem.prototype._getEffect = function () {
            if (this._customEffect) {
                return this._customEffect;
            }
            ;
            var defines = [];
            if (this._scene.clipPlane) {
                defines.push("#define CLIPPLANE");
            }
            if (this._isAnimationSheetEnabled) {
                defines.push("#define ANIMATESHEET");
            }
            // Effect
            var join = defines.join("\n");
            if (this._cachedDefines !== join) {
                this._cachedDefines = join;
                var attributesNamesOrOptions;
                var effectCreationOption;
                if (this._isAnimationSheetEnabled) {
                    attributesNamesOrOptions = [LIB.VertexBuffer.PositionKind, LIB.VertexBuffer.ColorKind, "options", "cellIndex"];
                    effectCreationOption = ["invView", "view", "projection", "particlesInfos", "vClipPlane", "textureMask"];
                }
                else {
                    attributesNamesOrOptions = [LIB.VertexBuffer.PositionKind, LIB.VertexBuffer.ColorKind, "options"];
                    effectCreationOption = ["invView", "view", "projection", "vClipPlane", "textureMask"];
                }
                this._effect = this._scene.getEngine().createEffect("particles", attributesNamesOrOptions, effectCreationOption, ["diffuseSampler"], join);
            }
            return this._effect;
        };
        /**
         * Animates the particle system for the current frame by emitting new particles and or animating the living ones.
         */
        ParticleSystem.prototype.animate = function () {
            if (!this._started)
                return;
            var effect = this._getEffect();
            // Check
            if (!this.emitter || !effect.isReady() || !this.particleTexture || !this.particleTexture.isReady())
                return;
            if (this._currentRenderId === this._scene.getRenderId()) {
                return;
            }
            this._currentRenderId = this._scene.getRenderId();
            this._scaledUpdateSpeed = this.updateSpeed * this._scene.getAnimationRatio();
            // determine the number of particles we need to create
            var newParticles;
            if (this.manualEmitCount > -1) {
                newParticles = this.manualEmitCount;
                this._newPartsExcess = 0;
                this.manualEmitCount = 0;
            }
            else {
                newParticles = ((this.emitRate * this._scaledUpdateSpeed) >> 0);
                this._newPartsExcess += this.emitRate * this._scaledUpdateSpeed - newParticles;
            }
            if (this._newPartsExcess > 1.0) {
                newParticles += this._newPartsExcess >> 0;
                this._newPartsExcess -= this._newPartsExcess >> 0;
            }
            this._alive = false;
            if (!this._stopped) {
                this._actualFrame += this._scaledUpdateSpeed;
                if (this.targetStopDuration && this._actualFrame >= this.targetStopDuration)
                    this.stop();
            }
            else {
                newParticles = 0;
            }
            this._update(newParticles);
            // Stopped?
            if (this._stopped) {
                if (!this._alive) {
                    this._started = false;
                    if (this.onAnimationEnd) {
                        this.onAnimationEnd();
                    }
                    if (this.disposeOnStop) {
                        this._scene._toBeDisposed.push(this);
                    }
                }
            }
            // Animation sheet
            if (this._isAnimationSheetEnabled) {
                this._appendParticleVertexes = this._appenedParticleVertexesWithSheet;
            }
            else {
                this._appendParticleVertexes = this._appenedParticleVertexesNoSheet;
            }
            // Update VBO
            var offset = 0;
            for (var index = 0; index < this._particles.length; index++) {
                var particle = this._particles[index];
                this._appendParticleVertexes(offset, particle);
                offset += 4;
            }
            if (this._vertexBuffer) {
                this._vertexBuffer.update(this._vertexData);
            }
            if (this.manualEmitCount === 0 && this.disposeOnStop) {
                this.stop();
            }
        };
        ParticleSystem.prototype._appenedParticleVertexesWithSheet = function (offset, particle) {
            this._appendParticleVertexWithAnimation(offset++, particle, 0, 0);
            this._appendParticleVertexWithAnimation(offset++, particle, 1, 0);
            this._appendParticleVertexWithAnimation(offset++, particle, 1, 1);
            this._appendParticleVertexWithAnimation(offset++, particle, 0, 1);
        };
        ParticleSystem.prototype._appenedParticleVertexesNoSheet = function (offset, particle) {
            this._appendParticleVertex(offset++, particle, 0, 0);
            this._appendParticleVertex(offset++, particle, 1, 0);
            this._appendParticleVertex(offset++, particle, 1, 1);
            this._appendParticleVertex(offset++, particle, 0, 1);
        };
        /**
         * Rebuilds the particle system.
         */
        ParticleSystem.prototype.rebuild = function () {
            this._createIndexBuffer();
            if (this._vertexBuffer) {
                this._vertexBuffer._rebuild();
            }
        };
        /**
         * Is this system ready to be used/rendered
         * @return true if the system is ready
         */
        ParticleSystem.prototype.isReady = function () {
            var effect = this._getEffect();
            if (!this.emitter || !effect.isReady() || !this.particleTexture || !this.particleTexture.isReady()) {
                return false;
            }
            return true;
        };
        /**
         * Renders the particle system in its current state.
         * @returns the current number of particles
         */
        ParticleSystem.prototype.render = function () {
            var effect = this._getEffect();
            // Check
            if (!this.isReady() || !this._particles.length) {
                return 0;
            }
            var engine = this._scene.getEngine();
            // Render
            engine.enableEffect(effect);
            engine.setState(false);
            var viewMatrix = this._scene.getViewMatrix();
            effect.setTexture("diffuseSampler", this.particleTexture);
            effect.setMatrix("view", viewMatrix);
            effect.setMatrix("projection", this._scene.getProjectionMatrix());
            if (this._isAnimationSheetEnabled && this.particleTexture) {
                var baseSize = this.particleTexture.getBaseSize();
                effect.setFloat3("particlesInfos", this.spriteCellWidth / baseSize.width, this.spriteCellHeight / baseSize.height, baseSize.width / this.spriteCellWidth);
            }
            effect.setFloat4("textureMask", this.textureMask.r, this.textureMask.g, this.textureMask.b, this.textureMask.a);
            if (this._scene.clipPlane) {
                var clipPlane = this._scene.clipPlane;
                var invView = viewMatrix.clone();
                invView.invert();
                effect.setMatrix("invView", invView);
                effect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
            }
            // VBOs
            engine.bindBuffers(this._vertexBuffers, this._indexBuffer, effect);
            // Draw order
            if (this.blendMode === ParticleSystem.BLENDMODE_ONEONE) {
                engine.setAlphaMode(LIB.Engine.ALPHA_ONEONE);
            }
            else {
                engine.setAlphaMode(LIB.Engine.ALPHA_COMBINE);
            }
            if (this.forceDepthWrite) {
                engine.setDepthWrite(true);
            }
            engine.drawElementsType(LIB.Material.TriangleFillMode, 0, this._particles.length * 6);
            engine.setAlphaMode(LIB.Engine.ALPHA_DISABLE);
            return this._particles.length;
        };
        /**
         * Disposes the particle system and free the associated resources
         * @param disposeTexture defines if the particule texture must be disposed as well (true by default)
         */
        ParticleSystem.prototype.dispose = function (disposeTexture) {
            if (disposeTexture === void 0) { disposeTexture = true; }
            if (this._vertexBuffer) {
                this._vertexBuffer.dispose();
                this._vertexBuffer = null;
            }
            if (this._indexBuffer) {
                this._scene.getEngine()._releaseBuffer(this._indexBuffer);
                this._indexBuffer = null;
            }
            if (disposeTexture && this.particleTexture) {
                this.particleTexture.dispose();
                this.particleTexture = null;
            }
            this._removeFromRoot();
            // Remove from scene
            var index = this._scene.particleSystems.indexOf(this);
            if (index > -1) {
                this._scene.particleSystems.splice(index, 1);
            }
            // Callback
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
        };
        /**
         * Creates a Sphere Emitter for the particle system. (emits along the sphere radius)
         * @param radius The radius of the sphere to emit from
         * @returns the emitter
         */
        ParticleSystem.prototype.createSphereEmitter = function (radius) {
            if (radius === void 0) { radius = 1; }
            var particleEmitter = new LIB.SphereParticleEmitter(radius);
            this.particleEmitterType = particleEmitter;
            return particleEmitter;
        };
        /**
         * Creates a Directed Sphere Emitter for the particle system. (emits between direction1 and direction2)
         * @param radius The radius of the sphere to emit from
         * @param direction1 Particles are emitted between the direction1 and direction2 from within the sphere
         * @param direction2 Particles are emitted between the direction1 and direction2 from within the sphere
         * @returns the emitter
         */
        ParticleSystem.prototype.createDirectedSphereEmitter = function (radius, direction1, direction2) {
            if (radius === void 0) { radius = 1; }
            if (direction1 === void 0) { direction1 = new LIB.Vector3(0, 1.0, 0); }
            if (direction2 === void 0) { direction2 = new LIB.Vector3(0, 1.0, 0); }
            var particleEmitter = new LIB.SphereDirectedParticleEmitter(radius, direction1, direction2);
            this.particleEmitterType = particleEmitter;
            return particleEmitter;
        };
        /**
         * Creates a Cone Emitter for the particle system. (emits from the cone to the particle position)
         * @param radius The radius of the cone to emit from
         * @param angle The base angle of the cone
         * @returns the emitter
         */
        ParticleSystem.prototype.createConeEmitter = function (radius, angle) {
            if (radius === void 0) { radius = 1; }
            if (angle === void 0) { angle = Math.PI / 4; }
            var particleEmitter = new LIB.ConeParticleEmitter(radius, angle);
            this.particleEmitterType = particleEmitter;
            return particleEmitter;
        };
        // this method needs to be changed when breaking changes will be allowed to match the sphere and cone methods and properties direction1,2 and minEmitBox,maxEmitBox to be removed from the system.
        /**
         * Creates a Box Emitter for the particle system. (emits between direction1 and direction2 from withing the box defined by minEmitBox and maxEmitBox)
         * @param direction1 Particles are emitted between the direction1 and direction2 from within the box
         * @param direction2 Particles are emitted between the direction1 and direction2 from within the box
         * @param minEmitBox Particles are emitted from the box between minEmitBox and maxEmitBox
         * @param maxEmitBox  Particles are emitted from the box between minEmitBox and maxEmitBox
         * @returns the emitter
         */
        ParticleSystem.prototype.createBoxEmitter = function (direction1, direction2, minEmitBox, maxEmitBox) {
            var particleEmitter = new LIB.BoxParticleEmitter();
            this.particleEmitterType = particleEmitter;
            this.direction1 = direction1;
            this.direction2 = direction2;
            this.minEmitBox = minEmitBox;
            this.maxEmitBox = maxEmitBox;
            return particleEmitter;
        };
        // Clone
        /**
         * Clones the particle system.
         * @param name The name of the cloned object
         * @param newEmitter The new emitter to use
         * @returns the cloned particle system
         */
        ParticleSystem.prototype.clone = function (name, newEmitter) {
            var custom = null;
            var program = null;
            if (this.customShader != null) {
                program = this.customShader;
                var defines = (program.shaderOptions.defines.length > 0) ? program.shaderOptions.defines.join("\n") : "";
                custom = this._scene.getEngine().createEffectForParticles(program.shaderPath.fragmentElement, program.shaderOptions.uniforms, program.shaderOptions.samplers, defines);
            }
            var result = new ParticleSystem(name, this._capacity, this._scene, custom);
            result.customShader = program;
            LIB.Tools.DeepCopy(this, result, ["particles", "customShader"]);
            if (newEmitter === undefined) {
                newEmitter = this.emitter;
            }
            result.emitter = newEmitter;
            if (this.particleTexture) {
                result.particleTexture = new LIB.Texture(this.particleTexture.url, this._scene);
            }
            if (!this.preventAutoStart) {
                result.start();
            }
            return result;
        };
        /**
         * Serializes the particle system to a JSON object.
         * @returns the JSON object
         */
        ParticleSystem.prototype.serialize = function () {
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
            serializationObject.minAngularSpeed = this.minAngularSpeed;
            serializationObject.maxAngularSpeed = this.maxAngularSpeed;
            serializationObject.minSize = this.minSize;
            serializationObject.maxSize = this.maxSize;
            serializationObject.minEmitPower = this.minEmitPower;
            serializationObject.maxEmitPower = this.maxEmitPower;
            serializationObject.minLifeTime = this.minLifeTime;
            serializationObject.maxLifeTime = this.maxLifeTime;
            serializationObject.emitRate = this.emitRate;
            serializationObject.minEmitBox = this.minEmitBox.asArray();
            serializationObject.maxEmitBox = this.maxEmitBox.asArray();
            serializationObject.gravity = this.gravity.asArray();
            serializationObject.direction1 = this.direction1.asArray();
            serializationObject.direction2 = this.direction2.asArray();
            serializationObject.color1 = this.color1.asArray();
            serializationObject.color2 = this.color2.asArray();
            serializationObject.colorDead = this.colorDead.asArray();
            serializationObject.updateSpeed = this.updateSpeed;
            serializationObject.targetStopDuration = this.targetStopDuration;
            serializationObject.textureMask = this.textureMask.asArray();
            serializationObject.blendMode = this.blendMode;
            serializationObject.customShader = this.customShader;
            serializationObject.preventAutoStart = this.preventAutoStart;
            serializationObject.startSpriteCellID = this.startSpriteCellID;
            serializationObject.endSpriteCellID = this.endSpriteCellID;
            serializationObject.spriteCellLoop = this.spriteCellLoop;
            serializationObject.spriteCellChangeSpeed = this.spriteCellChangeSpeed;
            serializationObject.spriteCellWidth = this.spriteCellWidth;
            serializationObject.spriteCellHeight = this.spriteCellHeight;
            serializationObject.isAnimationSheetEnabled = this._isAnimationSheetEnabled;
            // Emitter
            if (this.particleEmitterType) {
                serializationObject.particleEmitterType = this.particleEmitterType.serialize();
            }
            return serializationObject;
        };
        /**
         * Parses a JSON object to create a particle system.
         * @param parsedParticleSystem The JSON object to parse
         * @param scene The scene to create the particle system in
         * @param rootUrl The root url to use to load external dependencies like texture
         * @returns the Parsed particle system
         */
        ParticleSystem.Parse = function (parsedParticleSystem, scene, rootUrl) {
            var name = parsedParticleSystem.name;
            var custom = null;
            var program = null;
            if (parsedParticleSystem.customShader) {
                program = parsedParticleSystem.customShader;
                var defines = (program.shaderOptions.defines.length > 0) ? program.shaderOptions.defines.join("\n") : "";
                custom = scene.getEngine().createEffectForParticles(program.shaderPath.fragmentElement, program.shaderOptions.uniforms, program.shaderOptions.samplers, defines);
            }
            var particleSystem = new ParticleSystem(name, parsedParticleSystem.capacity, scene, custom, parsedParticleSystem.isAnimationSheetEnabled);
            particleSystem.customShader = program;
            if (parsedParticleSystem.id) {
                particleSystem.id = parsedParticleSystem.id;
            }
            // Auto start
            if (parsedParticleSystem.preventAutoStart) {
                particleSystem.preventAutoStart = parsedParticleSystem.preventAutoStart;
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
            if (parsedParticleSystem.autoAnimate) {
                scene.beginAnimation(particleSystem, parsedParticleSystem.autoAnimateFrom, parsedParticleSystem.autoAnimateTo, parsedParticleSystem.autoAnimateLoop, parsedParticleSystem.autoAnimateSpeed || 1.0);
            }
            // Particle system
            particleSystem.minAngularSpeed = parsedParticleSystem.minAngularSpeed;
            particleSystem.maxAngularSpeed = parsedParticleSystem.maxAngularSpeed;
            particleSystem.minSize = parsedParticleSystem.minSize;
            particleSystem.maxSize = parsedParticleSystem.maxSize;
            particleSystem.minLifeTime = parsedParticleSystem.minLifeTime;
            particleSystem.maxLifeTime = parsedParticleSystem.maxLifeTime;
            particleSystem.minEmitPower = parsedParticleSystem.minEmitPower;
            particleSystem.maxEmitPower = parsedParticleSystem.maxEmitPower;
            particleSystem.emitRate = parsedParticleSystem.emitRate;
            particleSystem.minEmitBox = LIB.Vector3.FromArray(parsedParticleSystem.minEmitBox);
            particleSystem.maxEmitBox = LIB.Vector3.FromArray(parsedParticleSystem.maxEmitBox);
            particleSystem.gravity = LIB.Vector3.FromArray(parsedParticleSystem.gravity);
            particleSystem.direction1 = LIB.Vector3.FromArray(parsedParticleSystem.direction1);
            particleSystem.direction2 = LIB.Vector3.FromArray(parsedParticleSystem.direction2);
            particleSystem.color1 = LIB.Color4.FromArray(parsedParticleSystem.color1);
            particleSystem.color2 = LIB.Color4.FromArray(parsedParticleSystem.color2);
            particleSystem.colorDead = LIB.Color4.FromArray(parsedParticleSystem.colorDead);
            particleSystem.updateSpeed = parsedParticleSystem.updateSpeed;
            particleSystem.targetStopDuration = parsedParticleSystem.targetStopDuration;
            particleSystem.textureMask = LIB.Color4.FromArray(parsedParticleSystem.textureMask);
            particleSystem.blendMode = parsedParticleSystem.blendMode;
            particleSystem.startSpriteCellID = parsedParticleSystem.startSpriteCellID;
            particleSystem.endSpriteCellID = parsedParticleSystem.endSpriteCellID;
            particleSystem.spriteCellLoop = parsedParticleSystem.spriteCellLoop;
            particleSystem.spriteCellChangeSpeed = parsedParticleSystem.spriteCellChangeSpeed;
            particleSystem.spriteCellWidth = parsedParticleSystem.spriteCellWidth;
            particleSystem.spriteCellHeight = parsedParticleSystem.spriteCellHeight;
            if (!particleSystem.preventAutoStart) {
                particleSystem.start();
            }
            return particleSystem;
        };
        /**
         * Source color is added to the destination color without alpha affecting the result.
         */
        ParticleSystem.BLENDMODE_ONEONE = 0;
        /**
         * Blend current color and particle color using particle’s alpha.
         */
        ParticleSystem.BLENDMODE_STANDARD = 1;
        return ParticleSystem;
    }());
    LIB.ParticleSystem = ParticleSystem;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.particleSystem.js.map
//# sourceMappingURL=LIB.particleSystem.js.map
