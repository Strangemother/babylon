
var LIB;
(function (LIB) {
    /**
     * Particle emitter emitting particles from the inside of a cone.
     * It emits the particles alongside the cone volume from the base to the particle.
     * The emission direction might be randomized.
     */
    var ConeParticleEmitter = /** @class */ (function () {
        /**
         * Creates a new instance ConeParticleEmitter
         * @param radius the radius of the emission cone (1 by default)
         * @param angles the cone base angle (PI by default)
         * @param directionRandomizer defines how much to randomize the particle direction [0-1]
         */
        function ConeParticleEmitter(radius, 
        /**
         * The radius of the emission cone.
         */
        angle, 
        /**
         * The cone base angle.
         */
        directionRandomizer) {
            if (radius === void 0) { radius = 1; }
            if (angle === void 0) { angle = Math.PI; }
            if (directionRandomizer === void 0) { directionRandomizer = 0; }
            this.angle = angle;
            this.directionRandomizer = directionRandomizer;
            this.radius = radius;
        }
        Object.defineProperty(ConeParticleEmitter.prototype, "radius", {
            /**
             * Gets the radius of the emission cone.
             */
            get: function () {
                return this._radius;
            },
            /**
             * Sets the radius of the emission cone.
             */
            set: function (value) {
                this._radius = value;
                if (this.angle !== 0) {
                    this._height = value / Math.tan(this.angle / 2);
                }
                else {
                    this._height = 1;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Called by the particle System when the direction is computed for the created particle.
         * @param emitPower is the power of the particle (speed)
         * @param worldMatrix is the world matrix of the particle system
         * @param directionToUpdate is the direction vector to update with the result
         * @param particle is the particle we are computed the direction for
         */
        ConeParticleEmitter.prototype.startDirectionFunction = function (emitPower, worldMatrix, directionToUpdate, particle) {
            if (this.angle === 0) {
                LIB.Vector3.TransformNormalFromFloatsToRef(0, emitPower, 0, worldMatrix, directionToUpdate);
            }
            else {
                // measure the direction Vector from the emitter to the particle.
                var direction = particle.position.subtract(worldMatrix.getTranslation()).normalize();
                var randX = LIB.Scalar.RandomRange(0, this.directionRandomizer);
                var randY = LIB.Scalar.RandomRange(0, this.directionRandomizer);
                var randZ = LIB.Scalar.RandomRange(0, this.directionRandomizer);
                direction.x += randX;
                direction.y += randY;
                direction.z += randZ;
                direction.normalize();
                LIB.Vector3.TransformNormalFromFloatsToRef(direction.x * emitPower, direction.y * emitPower, direction.z * emitPower, worldMatrix, directionToUpdate);
            }
        };
        /**
         * Called by the particle System when the position is computed for the created particle.
         * @param worldMatrix is the world matrix of the particle system
         * @param positionToUpdate is the position vector to update with the result
         * @param particle is the particle we are computed the position for
         */
        ConeParticleEmitter.prototype.startPositionFunction = function (worldMatrix, positionToUpdate, particle) {
            var s = LIB.Scalar.RandomRange(0, Math.PI * 2);
            var h = LIB.Scalar.RandomRange(0, 1);
            // Better distribution in a cone at normal angles.
            h = 1 - h * h;
            var radius = LIB.Scalar.RandomRange(0, this._radius);
            radius = radius * h;
            var randX = radius * Math.sin(s);
            var randZ = radius * Math.cos(s);
            var randY = h * this._height;
            LIB.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
        };
        /**
         * Clones the current emitter and returns a copy of it
         * @returns the new emitter
         */
        ConeParticleEmitter.prototype.clone = function () {
            var newOne = new ConeParticleEmitter(this.radius, this.angle, this.directionRandomizer);
            LIB.Tools.DeepCopy(this, newOne);
            return newOne;
        };
        /**
         * Called by the {LIB.GPUParticleSystem} to setup the update shader
         * @param effect defines the update shader
         */
        ConeParticleEmitter.prototype.applyToShader = function (effect) {
            effect.setFloat("radius", this.radius);
            effect.setFloat("angle", this.angle);
            effect.setFloat("height", this._height);
            effect.setFloat("directionRandomizer", this.directionRandomizer);
        };
        /**
         * Returns a string to use to update the GPU particles update shader
         * @returns a string containng the defines string
         */
        ConeParticleEmitter.prototype.getEffectDefines = function () {
            return "#define CONEEMITTER";
        };
        /**
         * Returns the string "BoxEmitter"
         * @returns a string containing the class name
         */
        ConeParticleEmitter.prototype.getClassName = function () {
            return "ConeEmitter";
        };
        /**
         * Serializes the particle system to a JSON object.
         * @returns the JSON object
         */
        ConeParticleEmitter.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.type = this.getClassName();
            serializationObject.radius = this.radius;
            serializationObject.angle = this.angle;
            serializationObject.directionRandomizer = this.directionRandomizer;
            return serializationObject;
        };
        /**
         * Parse properties from a JSON object
         * @param serializationObject defines the JSON object
         */
        ConeParticleEmitter.prototype.parse = function (serializationObject) {
            this.radius = serializationObject.radius;
            this.angle = serializationObject.angle;
            this.directionRandomizer = serializationObject.directionRandomizer;
        };
        return ConeParticleEmitter;
    }());
    LIB.ConeParticleEmitter = ConeParticleEmitter;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.coneParticleEmitter.js.map
//# sourceMappingURL=LIB.coneParticleEmitter.js.map
