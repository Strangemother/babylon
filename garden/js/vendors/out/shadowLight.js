var BABYLON;
(function (BABYLON) {
    var ShadowLight = /** @class */ (function (_super) {
        __extends(ShadowLight, _super);
        function ShadowLight() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._needProjectionMatrixCompute = true;
            return _this;
        }
        Object.defineProperty(ShadowLight.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            set: function (value) {
                this._direction = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowLight.prototype, "shadowMinZ", {
            get: function () {
                return this._shadowMinZ;
            },
            set: function (value) {
                this._shadowMinZ = value;
                this.forceProjectionMatrixCompute();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowLight.prototype, "shadowMaxZ", {
            get: function () {
                return this._shadowMaxZ;
            },
            set: function (value) {
                this._shadowMaxZ = value;
                this.forceProjectionMatrixCompute();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Computes the light transformed position/direction in case the light is parented. Returns true if parented, else false.
         */
        ShadowLight.prototype.computeTransformedInformation = function () {
            if (this.parent && this.parent.getWorldMatrix) {
                if (!this.transformedPosition) {
                    this.transformedPosition = BABYLON.Vector3.Zero();
                }
                BABYLON.Vector3.TransformCoordinatesToRef(this.position, this.parent.getWorldMatrix(), this.transformedPosition);
                // In case the direction is present.
                if (this.direction) {
                    if (!this.transformedDirection) {
                        this.transformedDirection = BABYLON.Vector3.Zero();
                    }
                    BABYLON.Vector3.TransformNormalToRef(this.direction, this.parent.getWorldMatrix(), this.transformedDirection);
                }
                return true;
            }
            return false;
        };
        /**
         * Return the depth scale used for the shadow map.
         */
        ShadowLight.prototype.getDepthScale = function () {
            return 50.0;
        };
        /**
         * Returns the light direction (Vector3) for any passed face index.
         */
        ShadowLight.prototype.getShadowDirection = function (faceIndex) {
            return this.transformedDirection ? this.transformedDirection : this.direction;
        };
        /**
         * Returns the DirectionalLight absolute position in the World.
         */
        ShadowLight.prototype.getAbsolutePosition = function () {
            return this.transformedPosition ? this.transformedPosition : this.position;
        };
        /**
         * Sets the DirectionalLight direction toward the passed target (Vector3).
         * Returns the updated DirectionalLight direction (Vector3).
         */
        ShadowLight.prototype.setDirectionToTarget = function (target) {
            this.direction = BABYLON.Vector3.Normalize(target.subtract(this.position));
            return this.direction;
        };
        /**
         * Returns the light rotation (Vector3).
         */
        ShadowLight.prototype.getRotation = function () {
            this.direction.normalize();
            var xaxis = BABYLON.Vector3.Cross(this.direction, BABYLON.Axis.Y);
            var yaxis = BABYLON.Vector3.Cross(xaxis, this.direction);
            return BABYLON.Vector3.RotationFromAxis(xaxis, yaxis, this.direction);
        };
        /**
         * Boolean : false by default.
         */
        ShadowLight.prototype.needCube = function () {
            return false;
        };
        /**
         * Specifies wether or not the projection matrix should be recomputed this frame.
         */
        ShadowLight.prototype.needProjectionMatrixCompute = function () {
            return this._needProjectionMatrixCompute;
        };
        /**
         * Forces the shadow generator to recompute the projection matrix even if position and direction did not changed.
         */
        ShadowLight.prototype.forceProjectionMatrixCompute = function () {
            this._needProjectionMatrixCompute = true;
        };
        /**
         * Get the world matrix of the sahdow lights.
         */
        ShadowLight.prototype._getWorldMatrix = function () {
            if (!this._worldMatrix) {
                this._worldMatrix = BABYLON.Matrix.Identity();
            }
            BABYLON.Matrix.TranslationToRef(this.position.x, this.position.y, this.position.z, this._worldMatrix);
            return this._worldMatrix;
        };
        /**
         * Gets the minZ used for shadow according to both the scene and the light.
         * @param activeCamera
         */
        ShadowLight.prototype.getDepthMinZ = function (activeCamera) {
            return this.shadowMinZ !== undefined ? this.shadowMinZ : activeCamera.minZ;
        };
        /**
         * Gets the maxZ used for shadow according to both the scene and the light.
         * @param activeCamera
         */
        ShadowLight.prototype.getDepthMaxZ = function (activeCamera) {
            return this.shadowMaxZ !== undefined ? this.shadowMaxZ : activeCamera.maxZ;
        };
        /**
         * Sets the projection matrix according to the type of light and custom projection matrix definition.
         * Returns the light.
         */
        ShadowLight.prototype.setShadowProjectionMatrix = function (matrix, viewMatrix, renderList) {
            if (this.customProjectionMatrixBuilder) {
                this.customProjectionMatrixBuilder(viewMatrix, renderList, matrix);
            }
            else {
                this._setDefaultShadowProjectionMatrix(matrix, viewMatrix, renderList);
            }
            return this;
        };
        __decorate([
            BABYLON.serializeAsVector3()
        ], ShadowLight.prototype, "position", void 0);
        __decorate([
            BABYLON.serializeAsVector3()
        ], ShadowLight.prototype, "direction", null);
        __decorate([
            BABYLON.serialize()
        ], ShadowLight.prototype, "shadowMinZ", null);
        __decorate([
            BABYLON.serialize()
        ], ShadowLight.prototype, "shadowMaxZ", null);
        return ShadowLight;
    }(BABYLON.Light));
    BABYLON.ShadowLight = ShadowLight;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.shadowLight.js.map
