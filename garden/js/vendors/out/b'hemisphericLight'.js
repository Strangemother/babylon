






var LIB;
(function (LIB) {
    /**
     * The HemisphericLight simulates the ambient environment light,
     * so the passed direction is the light reflection direction, not the incoming direction.
     */
    var HemisphericLight = /** @class */ (function (_super) {
        __extends(HemisphericLight, _super);
        /**
         * Creates a HemisphericLight object in the scene according to the passed direction (Vector3).
         * The HemisphericLight simulates the ambient environment light, so the passed direction is the light reflection direction, not the incoming direction.
         * The HemisphericLight can't cast shadows.
         * Documentation : http://doc.LIBjs.com/tutorials/lights
         * @param name The friendly name of the light
         * @param direction The direction of the light reflection
         * @param scene The scene the light belongs to
         */
        function HemisphericLight(name, direction, scene) {
            var _this = _super.call(this, name, scene) || this;
            /**
             * The groundColor is the light in the opposite direction to the one specified during creation.
             * You can think of the diffuse and specular light as coming from the centre of the object in the given direction and the groundColor light in the opposite direction.
             */
            _this.groundColor = new LIB.Color3(0.0, 0.0, 0.0);
            _this.direction = direction || LIB.Vector3.Up();
            return _this;
        }
        HemisphericLight.prototype._buildUniformLayout = function () {
            this._uniformBuffer.addUniform("vLightData", 4);
            this._uniformBuffer.addUniform("vLightDiffuse", 4);
            this._uniformBuffer.addUniform("vLightSpecular", 3);
            this._uniformBuffer.addUniform("vLightGround", 3);
            this._uniformBuffer.addUniform("shadowsInfo", 3);
            this._uniformBuffer.addUniform("depthValues", 2);
            this._uniformBuffer.create();
        };
        /**
         * Returns the string "HemisphericLight".
         * @return The class name
         */
        HemisphericLight.prototype.getClassName = function () {
            return "HemisphericLight";
        };
        /**
         * Sets the HemisphericLight direction towards the passed target (Vector3).
         * Returns the updated direction.
         * @param target The target the direction should point to
         * @return The computed direction
         */
        HemisphericLight.prototype.setDirectionToTarget = function (target) {
            this.direction = LIB.Vector3.Normalize(target.subtract(LIB.Vector3.Zero()));
            return this.direction;
        };
        /**
         * Returns the shadow generator associated to the light.
         * @returns Always null for hemispheric lights because it does not support shadows.
         */
        HemisphericLight.prototype.getShadowGenerator = function () {
            return null;
        };
        /**
         * Sets the passed Effect object with the HemisphericLight normalized direction and color and the passed name (string).
         * @param effect The effect to update
         * @param lightIndex The index of the light in the effect to update
         * @returns The hemispheric light
         */
        HemisphericLight.prototype.transferToEffect = function (effect, lightIndex) {
            var normalizeDirection = LIB.Vector3.Normalize(this.direction);
            this._uniformBuffer.updateFloat4("vLightData", normalizeDirection.x, normalizeDirection.y, normalizeDirection.z, 0.0, lightIndex);
            this._uniformBuffer.updateColor3("vLightGround", this.groundColor.scale(this.intensity), lightIndex);
            return this;
        };
        /**
         * @hidden internal use only.
         */
        HemisphericLight.prototype._getWorldMatrix = function () {
            if (!this._worldMatrix) {
                this._worldMatrix = LIB.Matrix.Identity();
            }
            return this._worldMatrix;
        };
        /**
         * Returns the integer 3.
         * @return The light Type id as a constant defines in Light.LIGHTTYPEID_x
         */
        HemisphericLight.prototype.getTypeID = function () {
            return LIB.Light.LIGHTTYPEID_HEMISPHERICLIGHT;
        };
        __decorate([
            LIB.serializeAsColor3()
        ], HemisphericLight.prototype, "groundColor", void 0);
        __decorate([
            LIB.serializeAsVector3()
        ], HemisphericLight.prototype, "direction", void 0);
        return HemisphericLight;
    }(LIB.Light));
    LIB.HemisphericLight = HemisphericLight;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.hemisphericLight.js.map
//# sourceMappingURL=LIB.hemisphericLight.js.map
