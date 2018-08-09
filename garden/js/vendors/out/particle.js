var BABYLON;
(function (BABYLON) {
    var Particle = /** @class */ (function () {
        function Particle(particleSystem) {
            this.particleSystem = particleSystem;
            this.position = BABYLON.Vector3.Zero();
            this.direction = BABYLON.Vector3.Zero();
            this.color = new BABYLON.Color4(0, 0, 0, 0);
            this.colorStep = new BABYLON.Color4(0, 0, 0, 0);
            this.lifeTime = 1.0;
            this.age = 0;
            this.size = 0;
            this.angle = 0;
            this.angularSpeed = 0;
            this._currentFrameCounter = 0;
            this.cellIndex = 0;
            if (!this.particleSystem.isAnimationSheetEnabled) {
                return;
            }
            this.cellIndex = this.particleSystem.startSpriteCellID;
            if (this.particleSystem.spriteCellChangeSpeed == 0) {
                this.updateCellIndex = this.updateCellIndexWithSpeedCalculated;
            }
            else {
                this.updateCellIndex = this.updateCellIndexWithCustomSpeed;
            }
        }
        Particle.prototype.updateCellIndexWithSpeedCalculated = function (scaledUpdateSpeed) {
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
        Particle.prototype.updateCellIndexWithCustomSpeed = function () {
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
    BABYLON.Particle = Particle;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.particle.js.map
