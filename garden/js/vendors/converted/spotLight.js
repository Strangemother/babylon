(function (LIB) {
    var SpotLight = /** @class */ (function (_super) {
        __extends(SpotLight, _super);
        /**
         * Creates a SpotLight object in the scene with the passed parameters :
         * - `position` (Vector3) is the initial SpotLight position,
         * - `direction` (Vector3) is the initial SpotLight direction,
         * - `angle` (float, in radians) is the spot light cone angle,
         * - `exponent` (float) is the light decay speed with the distance from the emission spot.
         * A spot light is a simply light oriented cone.
         * It can cast shadows.
         * Documentation : http://doc.LIBjs.com/tutorials/lights
         */
        function SpotLight(name, position, direction, angle, exponent, scene) {
            var _this = _super.call(this, name, scene) || this;
            _this.position = position;
            _this.direction = direction;
            _this.angle = angle;
            _this.exponent = exponent;
            return _this;
        }
        Object.defineProperty(SpotLight.prototype, "angle", {
            get: function () {
                return this._angle;
            },
            set: function (value) {
                this._angle = value;
                this.forceProjectionMatrixCompute();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpotLight.prototype, "shadowAngleScale", {
            get: function () {
                return this._shadowAngleScale;
            },
            /**
             * Allows scaling the angle of the light for shadow generation only.
             */
            set: function (value) {
                this._shadowAngleScale = value;
                this.forceProjectionMatrixCompute();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the string "SpotLight".
         */
        SpotLight.prototype.getClassName = function () {
            return "SpotLight";
        };
        /**
         * Returns the integer 2.
         */
        SpotLight.prototype.getTypeID = function () {
            return LIB.Light.LIGHTTYPEID_SPOTLIGHT;
        };
        /**
         * Sets the passed matrix "matrix" as perspective projection matrix for the shadows and the passed view matrix with the fov equal to the SpotLight angle and and aspect ratio of 1.0.
         * Returns the SpotLight.
         */
        SpotLight.prototype._setDefaultShadowProjectionMatrix = function (matrix, viewMatrix, renderList) {
            var activeCamera = this.getScene().activeCamera;
            if (!activeCamera) {
                return;
            }
            this._shadowAngleScale = this._shadowAngleScale || 1;
            var angle = this._shadowAngleScale * this._angle;
            LIB.Matrix.PerspectiveFovLHToRef(angle, 1.0, this.getDepthMinZ(activeCamera), this.getDepthMaxZ(activeCamera), matrix);
        };
        SpotLight.prototype._buildUniformLayout = function () {
            this._uniformBuffer.addUniform("vLightData", 4);
            this._uniformBuffer.addUniform("vLightDiffuse", 4);
            this._uniformBuffer.addUniform("vLightSpecular", 3);
            this._uniformBuffer.addUniform("vLightDirection", 3);
            this._uniformBuffer.addUniform("shadowsInfo", 3);
            this._uniformBuffer.addUniform("depthValues", 2);
            this._uniformBuffer.create();
        };
        /**
         * Sets the passed Effect object with the SpotLight transfomed position (or position if not parented) and normalized direction.
         * Return the SpotLight.
         */
        SpotLight.prototype.transferToEffect = function (effect, lightIndex) {
            var normalizeDirection;
            if (this.computeTransformedInformation()) {
                this._uniformBuffer.updateFloat4("vLightData", this.transformedPosition.x, this.transformedPosition.y, this.transformedPosition.z, this.exponent, lightIndex);
                normalizeDirection = LIB.Vector3.Normalize(this.transformedDirection);
            }
            else {
                this._uniformBuffer.updateFloat4("vLightData", this.position.x, this.position.y, this.position.z, this.exponent, lightIndex);
                normalizeDirection = LIB.Vector3.Normalize(this.direction);
            }
            this._uniformBuffer.updateFloat4("vLightDirection", normalizeDirection.x, normalizeDirection.y, normalizeDirection.z, Math.cos(this.angle * 0.5), lightIndex);
            return this;
        };
        __decorate([
            LIB.serialize()
        ], SpotLight.prototype, "angle", null);
        __decorate([
            LIB.serialize()
            /**
             * Allows scaling the angle of the light for shadow generation only.
             */
        ], SpotLight.prototype, "shadowAngleScale", null);
        __decorate([
            LIB.serialize()
        ], SpotLight.prototype, "exponent", void 0);
        return SpotLight;
    }(LIB.ShadowLight));
    LIB.SpotLight = SpotLight;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.spotLight.js.map
