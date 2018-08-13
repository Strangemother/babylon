
var LIB;
(function (LIB) {
    /**
     * A particle represents one of the element emitted by a particle system.
     * This is mainly define by its coordinates, direction, velocity and age.
     */
    var Particle = /** @class */ (function () {
        /**
         * Creates a new instance Particle
         * @param particleSystem the particle system the particle belongs to
         */
        function Particle(
        /**
         * particleSystem the particle system the particle belongs to.
         */
        particleSystem) {
            this.particleSystem = particleSystem;
            /**
             * The world position of the particle in the scene.
             */
            this.position = LIB.Vector3.Zero();
            /**
             * The world direction of the particle in the scene.
             */
            this.direction = LIB.Vector3.Zero();
            /**
             * The color of the particle.
             */
            this.color = new LIB.Color4(0, 0, 0, 0);
            /**
             * The color change of the particle per step.
             */
            this.colorStep = new LIB.Color4(0, 0, 0, 0);
            /**
             * Defines how long will the life of the particle be.
             */
            this.lifeTime = 1.0;
            /**
             * The current age of the particle.
             */
            this.age = 0;
            /**
             * The current size of the particle.
             */
            this.size = 0;
            /**
             * The current angle of the particle.
             */
            this.angle = 0;
            /**
             * Defines how fast is the angle changing.
             */
            this.angularSpeed = 0;
            /**
             * Defines the cell index used by the particle to be rendered from a sprite.
             */
            this.cellIndex = 0;
            this._currentFrameCounter = 0;
            if (!this.particleSystem.isAnimationSheetEnabled) {
                return;
            }
            this.updateCellInfoFromSystem();
        }
        Particle.prototype.updateCellInfoFromSystem = function () {
            this.cellIndex = this.particleSystem.startSpriteCellID;
            if (this.particleSystem.spriteCellChangeSpeed == 0) {
                this.updateCellIndex = this._updateCellIndexWithSpeedCalculated;
            }
            else {
                this.updateCellIndex = this._updateCellIndexWithCustomSpeed;
            }
        };
        Particle.prototype._updateCellIndexWithSpeedCalculated = function (scaledUpdateSpeed) {
            //   (ageOffset / scaledUpdateSpeed) / available cells
            var numberOfScaledUpdatesPerCell = ((this.lifeTime - this.age) / scaledUpdateSpeed) / (this.particleSystem.endSpriteCellID + 1 - this.cellIndex);
            this._currentFrameCounter += scaledUpdateSpeed;
            if (this._currentFrameCounter >= numberOfScaledUpdatesPerCell * scaledUpdateSpeed) {
                this._currentFrameCounter = 0;
                this.cellIndex++;
                if (this.cellIndex > this.particleSystem.endSpriteCellID) {
                    this.cellIndex = this.particleSystem.endSpriteCellID;
                }
            }
        };
        Particle.prototype._updateCellIndexWithCustomSpeed = function () {
            if (this._currentFrameCounter >= this.particleSystem.spriteCellChangeSpeed) {
                this.cellIndex++;
                this._currentFrameCounter = 0;
                if (this.cellIndex > this.particleSystem.endSpriteCellID) {
                    if (this.particleSystem.spriteCellLoop) {
                        this.cellIndex = this.particleSystem.startSpriteCellID;
                    }
                    else {
                        this.cellIndex = this.particleSystem.endSpriteCellID;
                    }
                }
            }
            else {
                this._currentFrameCounter++;
            }
        };
        /**
         * Copy the properties of particle to another one.
         * @param other the particle to copy the information to.
         */
        Particle.prototype.copyTo = function (other) {
            other.position.copyFrom(this.position);
            other.direction.copyFrom(this.direction);
            other.color.copyFrom(this.color);
            other.colorStep.copyFrom(this.colorStep);
            other.lifeTime = this.lifeTime;
            other.age = this.age;
            other.size = this.size;
            other.angle = this.angle;
            other.angularSpeed = this.angularSpeed;
            other.particleSystem = this.particleSystem;
            other.cellIndex = this.cellIndex;
        };
        return Particle;
    }());
    LIB.Particle = Particle;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.particle.js.map
//# sourceMappingURL=LIB.particle.js.map
