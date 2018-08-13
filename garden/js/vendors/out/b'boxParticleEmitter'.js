
var LIB;
(function (LIB) {
    /**
     * Particle emitter emitting particles from the inside of a box.
     * It emits the particles randomly between 2 given directions.
     */
    var BoxParticleEmitter = /** @class */ (function () {
        /**
         * Creates a new instance BoxParticleEmitter
         */
        function BoxParticleEmitter() {
            /**
             * Random direction of each particle after it has been emitted, between direction1 and direction2 vectors.
             */
            this.direction1 = new LIB.Vector3(0, 1.0, 0);
            /**
             * Random direction of each particle after it has been emitted, between direction1 and direction2 vectors.
             */
            this.direction2 = new LIB.Vector3(0, 1.0, 0);
            /**
             * Minimum box point around our emitter. Our emitter is the center of particles source, but if you want your particles to emit from more than one point, then you can tell it to do so.
             */
            this.minEmitBox = new LIB.Vector3(-0.5, -0.5, -0.5);
            /**
             * Maximum box point around our emitter. Our emitter is the center of particles source, but if you want your particles to emit from more than one point, then you can tell it to do so.
             */
            this.maxEmitBox = new LIB.Vector3(0.5, 0.5, 0.5);
        }
        /**
         * Called by the particle System when the direction is computed for the created particle.
         * @param emitPower is the power of the particle (speed)
         * @param worldMatrix is the world matrix of the particle system
         * @param directionToUpdate is the direction vector to update with the result
         * @param particle is the particle we are computed the direction for
         */
        BoxParticleEmitter.prototype.startDirectionFunction = function (emitPower, worldMatrix, directionToUpdate, particle) {
            var randX = LIB.Scalar.RandomRange(this.direction1.x, this.direction2.x);
            var randY = LIB.Scalar.RandomRange(this.direction1.y, this.direction2.y);
            var randZ = LIB.Scalar.RandomRange(this.direction1.z, this.direction2.z);
            LIB.Vector3.TransformNormalFromFloatsToRef(randX * emitPower, randY * emitPower, randZ * emitPower, worldMatrix, directionToUpdate);
        };
        /**
         * Called by the particle System when the position is computed for the created particle.
         * @param worldMatrix is the world matrix of the particle system
         * @param positionToUpdate is the position vector to update with the result
         * @param particle is the particle we are computed the position for
         */
        BoxParticleEmitter.prototype.startPositionFunction = function (worldMatrix, positionToUpdate, particle) {
            var randX = LIB.Scalar.RandomRange(this.minEmitBox.x, this.maxEmitBox.x);
            var randY = LIB.Scalar.RandomRange(this.minEmitBox.y, this.maxEmitBox.y);
            var randZ = LIB.Scalar.RandomRange(this.minEmitBox.z, this.maxEmitBox.z);
            LIB.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
        };
        /**
         * Clones the current emitter and returns a copy of it
         * @returns the new emitter
         */
        BoxParticleEmitter.prototype.clone = function () {
            var newOne = new BoxParticleEmitter();
            LIB.Tools.DeepCopy(this, newOne);
            return newOne;
        };
        /**
         * Called by the {LIB.GPUParticleSystem} to setup the update shader
         * @param effect defines the update shader
         */
        BoxParticleEmitter.prototype.applyToShader = function (effect) {
            effect.setVector3("direction1", this.direction1);
            effect.setVector3("direction2", this.direction2);
            effect.setVector3("minEmitBox", this.minEmitBox);
            effect.setVector3("maxEmitBox", this.maxEmitBox);
        };
        /**
         * Returns a string to use to update the GPU particles update shader
         * @returns a string containng the defines string
         */
        BoxParticleEmitter.prototype.getEffectDefines = function () {
            return "#define BOXEMITTER";
        };
        /**
         * Returns the string "BoxEmitter"
         * @returns a string containing the class name
         */
        BoxParticleEmitter.prototype.getClassName = function () {
            return "BoxEmitter";
        };
        /**
         * Serializes the particle system to a JSON object.
         * @returns the JSON object
         */
        BoxParticleEmitter.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.type = this.getClassName();
            serializationObject.direction1 = this.direction1.asArray();
            serializationObject.direction2 = this.direction2.asArray();
            serializationObject.minEmitBox = this.minEmitBox.asArray();
            serializationObject.maxEmitBox = this.maxEmitBox.asArray();
            return serializationObject;
        };
        /**
         * Parse properties from a JSON object
         * @param serializationObject defines the JSON object
         */
        BoxParticleEmitter.prototype.parse = function (serializationObject) {
            this.direction1.copyFrom(serializationObject.direction1);
            this.direction2.copyFrom(serializationObject.direction2);
            this.minEmitBox.copyFrom(serializationObject.minEmitBox);
            this.maxEmitBox.copyFrom(serializationObject.maxEmitBox);
        };
        return BoxParticleEmitter;
    }());
    LIB.BoxParticleEmitter = BoxParticleEmitter;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.boxParticleEmitter.js.map
//# sourceMappingURL=LIB.boxParticleEmitter.js.map
