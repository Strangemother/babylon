var BABYLON;
(function (BABYLON) {
    var HemisphericLight = /** @class */ (function (_super) {
        __extends(HemisphericLight, _super);
        /**
         * Creates a HemisphericLight object in the scene according to the passed direction (Vector3).
         * The HemisphericLight simulates the ambient environment light, so the passed direction is the light reflection direction, not the incoming direction.
         * The HemisphericLight can't cast shadows.
         * Documentation : http://doc.babylonjs.com/tutorials/lights
         */
        function HemisphericLight(name, direction, scene) {
            var _this = _super.call(this, name, scene) || this;
            _this.groundColor = new BABYLON.Color3(0.0, 0.0, 0.0);
            _this.direction = direction || BABYLON.Vector3.Up();
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
         */
        HemisphericLight.prototype.getClassName = function () {
            return "HemisphericLight";
        };
        /**
         * Sets the HemisphericLight direction towards the passed target (Vector3).
         * Returns the updated direction.
         */
        HemisphericLight.prototype.setDirectionToTarget = function (target) {
            this.direction = BABYLON.Vector3.Normalize(target.subtract(BABYLON.Vector3.Zero()));
            return this.direction;
        };
        HemisphericLight.prototype.getShadowGenerator = function () {
            return null;
        };
        /**
         * Sets the passed Effect object with the HemisphericLight normalized direction and color and the passed name (string).
         * Returns the HemisphericLight.
         */
        HemisphericLight.prototype.transferToEffect = function (effect, lightIndex) {
            var normalizeDirection = BABYLON.Vector3.Normalize(this.direction);
            this._uniformBuffer.updateFloat4("vLightData", normalizeDirection.x, normalizeDirection.y, normalizeDirection.z, 0.0, lightIndex);
            this._uniformBuffer.updateColor3("vLightGround", this.groundColor.scale(this.intensity), lightIndex);
            return this;
        };
        HemisphericLight.prototype._getWorldMatrix = function () {
            if (!this._worldMatrix) {
                this._worldMatrix = BABYLON.Matrix.Identity();
            }
            return this._worldMatrix;
        };
        /**
         * Returns the integer 3.
         */
        HemisphericLight.prototype.getTypeID = function () {
            return BABYLON.Light.LIGHTTYPEID_HEMISPHERICLIGHT;
        };
        __decorate([
            BABYLON.serializeAsColor3()
        ], HemisphericLight.prototype, "groundColor", void 0);
        __decorate([
            BABYLON.serializeAsVector3()
        ], HemisphericLight.prototype, "direction", void 0);
        return HemisphericLight;
    }(BABYLON.Light));
    BABYLON.HemisphericLight = HemisphericLight;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.hemisphericLight.js.map
