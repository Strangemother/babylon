(function (LIB) {
    var GPUParticleSystem = /** @class */ (function () {
        function GPUParticleSystem(name, capacity, scene) {
            this.name = name;
            this.emitter = null;
            this.renderingGroupId = 0;
            this.layerMask = 0x0FFFFFFF; // TODO
            this._updateVertexBuffers = {};
            this._renderVertexBuffers = {};
            this._currentRenderId = -1;
            this._started = true;
            /**
            * An event triggered when the system is disposed.
            * @type {LIB.Observable}
            */
            this.onDisposeObservable = new LIB.Observable();
            this.id = name;
            this._scene = scene || LIB.Engine.LastCreatedScene;
            this._capacity = capacity;
            this._engine = this._scene.getEngine();
            this._scene.particleSystems.push(this);
            this._renderEffect = new LIB.Effect("gpuRenderParticles", ["position", "age", "life", "velocity"], [], [], this._scene.getEngine());
            var updateEffectOptions = {
                attributes: ["position", "age", "life", "velocity"],
                uniformsNames: [],
                uniformBuffersNames: [],
                samplers: [],
                defines: "",
                fallbacks: null,
                onCompiled: null,
                onError: null,
                indexParameters: null,
                maxSimultaneousLights: 0,
                transformFeedbackVaryings: ["outPosition", "outAge", "outLife", "outVelocity"]
            };
            this._updateEffect = new LIB.Effect("gpuUpdateParticles", updateEffectOptions, this._scene.getEngine());
        }
        GPUParticleSystem.prototype.isStarted = function () {
            return this._started;
        };
        GPUParticleSystem.prototype.start = function () {
            this._started = true;
        };
        GPUParticleSystem.prototype.stop = function () {
            this._started = false;
        };
        GPUParticleSystem.prototype.animate = function () {
            // Do nothing
        };
        GPUParticleSystem.prototype._initialize = function () {
            if (this._renderVAO) {
                return;
            }
            var data = new Array();
            for (var particleIndex = 0; particleIndex < this._capacity; particleIndex++) {
                // position
                data.push(0.0);
                data.push(0.0);
                data.push(0.0);
                var life = 1 + Math.random() * 10; // TODO: var
                data.push(life + 1); // create the particle as a dead one to create a new one at start
                data.push(life);
                // velocity
                data.push(0.0);
                data.push(0.0);
                data.push(0.0);
            }
            // Update VAO
            this._updateBuffer = new LIB.Buffer(this._scene.getEngine(), data, false, 0);
            this._updateVertexBuffers["position"] = this._updateBuffer.createVertexBuffer("position", 0, 3, 3);
            this._updateVertexBuffers["age"] = this._updateBuffer.createVertexBuffer("age", 3, 1, 1);
            this._updateVertexBuffers["life"] = this._updateBuffer.createVertexBuffer("life", 4, 1, 1);
            this._updateVertexBuffers["velocity"] = this._updateBuffer.createVertexBuffer("velocity", 5, 3, 3);
            this._updateVAO = this._engine.recordVertexArrayObject(this._updateVertexBuffers, null, this._updateEffect);
            this._engine.bindArrayBuffer(null);
            // Render VAO
            this._renderBuffer = new LIB.Buffer(this._scene.getEngine(), data, false, 0);
            this._renderVertexBuffers["position"] = this._renderBuffer.createVertexBuffer("position", 0, 3, 3);
            this._renderVertexBuffers["age"] = this._renderBuffer.createVertexBuffer("age", 3, 1, 1);
            this._renderVertexBuffers["life"] = this._renderBuffer.createVertexBuffer("life", 4, 1, 1);
            this._renderVertexBuffers["velocity"] = this._renderBuffer.createVertexBuffer("velocity", 5, 3, 3);
            this._renderVAO = this._engine.recordVertexArrayObject(this._renderVertexBuffers, null, this._renderEffect);
            this._engine.bindArrayBuffer(null);
            // Links
            this._sourceVAO = this._updateVAO;
            this._targetVAO = this._renderVAO;
            this._sourceBuffer = this._updateBuffer;
            this._targetBuffer = this._renderBuffer;
        };
        GPUParticleSystem.prototype.render = function () {
            if (!this.emitter || !this._updateEffect.isReady() || !this._renderEffect.isReady()) {
                return 0;
            }
            // Get everything ready to render
            this._initialize();
            if (this._currentRenderId === this._scene.getRenderId()) {
                return 0;
            }
            this._currentRenderId = this._scene.getRenderId();
            // Enable update effect
            this._engine.enableEffect(this._updateEffect);
            this._engine.setState(false);
            // Bind source VAO
            this._engine.bindVertexArrayObject(this._sourceVAO, null);
            // Update
            this._engine.bindTransformFeedbackBuffer(this._targetBuffer.getBuffer());
            this._engine.setRasterizerState(false);
            this._engine.beginTransformFeedback();
            this._engine.drawArraysType(LIB.Material.PointListDrawMode, 0, this._capacity);
            this._engine.endTransformFeedback();
            this._engine.setRasterizerState(true);
            this._engine.bindTransformFeedbackBuffer(null);
            // Enable render effect
            this._engine.enableEffect(this._renderEffect);
            // Bind source VAO
            this._engine.bindVertexArrayObject(this._targetVAO, null);
            // Render
            this._engine.drawArraysType(LIB.Material.PointListDrawMode, 0, this._capacity);
            // Switch VAOs
            var tmpVAO = this._sourceVAO;
            this._sourceVAO = this._targetVAO;
            this._targetVAO = tmpVAO;
            // Switch buffers
            var tmpBuffer = this._sourceBuffer;
            this._sourceBuffer = this._targetBuffer;
            this._targetBuffer = tmpBuffer;
            return 0;
        };
        GPUParticleSystem.prototype.rebuild = function () {
        };
        GPUParticleSystem.prototype.dispose = function () {
            var index = this._scene.particleSystems.indexOf(this);
            if (index > -1) {
                this._scene.particleSystems.splice(index, 1);
            }
            //TODO: this._dataBuffer.dispose();
            // Callback
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
        };
        //TODO: Clone / Parse / serialize
        GPUParticleSystem.prototype.clone = function (name, newEmitter) {
            return null;
        };
        GPUParticleSystem.prototype.serialize = function () {
        };
        return GPUParticleSystem;
    }());
    LIB.GPUParticleSystem = GPUParticleSystem;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.gpuParticleSystem.js.map
