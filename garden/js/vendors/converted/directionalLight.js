(function (LIB) {
    var DirectionalLight = /** @class */ (function (_super) {
        __extends(DirectionalLight, _super);
        /**
         * Creates a DirectionalLight object in the scene, oriented towards the passed direction (Vector3).
         * The directional light is emitted from everywhere in the given direction.
         * It can cast shawdows.
         * Documentation : http://doc.LIBjs.com/tutorials/lights
         */
        function DirectionalLight(name, direction, scene) {
            var _this = _super.call(this, name, scene) || this;
            _this._shadowFrustumSize = 0;
            _this._shadowOrthoScale = 0.5;
            _this.autoUpdateExtends = true;
            // Cache
            _this._orthoLeft = Number.MAX_VALUE;
            _this._orthoRight = Number.MIN_VALUE;
            _this._orthoTop = Number.MIN_VALUE;
            _this._orthoBottom = Number.MAX_VALUE;
            _this.position = direction.scale(-1.0);
            _this.direction = direction;
            return _this;
        }
        Object.defineProperty(DirectionalLight.prototype, "shadowFrustumSize", {
            /**
             * Fix frustum size for the shadow generation. This is disabled if the value is 0.
             */
            get: function () {
                return this._shadowFrustumSize;
            },
            /**
             * Specifies a fix frustum size for the shadow generation.
             */
            set: function (value) {
                this._shadowFrustumSize = value;
                this.forceProjectionMatrixCompute();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectionalLight.prototype, "shadowOrthoScale", {
            get: function () {
                return this._shadowOrthoScale;
            },
            set: function (value) {
                this._shadowOrthoScale = value;
                this.forceProjectionMatrixCompute();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the string "DirectionalLight".
         */
        DirectionalLight.prototype.getClassName = function () {
            return "DirectionalLight";
        };
        /**
         * Returns the integer 1.
         */
        DirectionalLight.prototype.getTypeID = function () {
            return LIB.Light.LIGHTTYPEID_DIRECTIONALLIGHT;
        };
        /**
         * Sets the passed matrix "matrix" as projection matrix for the shadows cast by the light according to the passed view matrix.
         * Returns the DirectionalLight Shadow projection matrix.
         */
        DirectionalLight.prototype._setDefaultShadowProjectionMatrix = function (matrix, viewMatrix, renderList) {
            if (this.shadowFrustumSize > 0) {
                this._setDefaultFixedFrustumShadowProjectionMatrix(matrix, viewMatrix);
            }
            else {
                this._setDefaultAutoExtendShadowProjectionMatrix(matrix, viewMatrix, renderList);
            }
        };
        /**
         * Sets the passed matrix "matrix" as fixed frustum projection matrix for the shadows cast by the light according to the passed view matrix.
         * Returns the DirectionalLight Shadow projection matrix.
         */
        DirectionalLight.prototype._setDefaultFixedFrustumShadowProjectionMatrix = function (matrix, viewMatrix) {
            var activeCamera = this.getScene().activeCamera;
            if (!activeCamera) {
                return;
            }
            LIB.Matrix.OrthoLHToRef(this.shadowFrustumSize, this.shadowFrustumSize, this.shadowMinZ !== undefined ? this.shadowMinZ : activeCamera.minZ, this.shadowMaxZ !== undefined ? this.shadowMaxZ : activeCamera.maxZ, matrix);
        };
        /**
         * Sets the passed matrix "matrix" as auto extend projection matrix for the shadows cast by the light according to the passed view matrix.
         * Returns the DirectionalLight Shadow projection matrix.
         */
        DirectionalLight.prototype._setDefaultAutoExtendShadowProjectionMatrix = function (matrix, viewMatrix, renderList) {
            var activeCamera = this.getScene().activeCamera;
            if (!activeCamera) {
                return;
            }
            // Check extends
            if (this.autoUpdateExtends || this._orthoLeft === Number.MAX_VALUE) {
                var tempVector3 = LIB.Vector3.Zero();
                this._orthoLeft = Number.MAX_VALUE;
                this._orthoRight = Number.MIN_VALUE;
                this._orthoTop = Number.MIN_VALUE;
                this._orthoBottom = Number.MAX_VALUE;
                for (var meshIndex = 0; meshIndex < renderList.length; meshIndex++) {
                    var mesh = renderList[meshIndex];
                    if (!mesh) {
                        continue;
                    }
                    var boundingInfo = mesh.getBoundingInfo();
                    var boundingBox = boundingInfo.boundingBox;
                    for (var index = 0; index < boundingBox.vectorsWorld.length; index++) {
                        LIB.Vector3.TransformCoordinatesToRef(boundingBox.vectorsWorld[index], viewMatrix, tempVector3);
                        if (tempVector3.x < this._orthoLeft)
                            this._orthoLeft = tempVector3.x;
                        if (tempVector3.y < this._orthoBottom)
                            this._orthoBottom = tempVector3.y;
                        if (tempVector3.x > this._orthoRight)
                            this._orthoRight = tempVector3.x;
                        if (tempVector3.y > this._orthoTop)
                            this._orthoTop = tempVector3.y;
                    }
                }
            }
            var xOffset = this._orthoRight - this._orthoLeft;
            var yOffset = this._orthoTop - this._orthoBottom;
            LIB.Matrix.OrthoOffCenterLHToRef(this._orthoLeft - xOffset * this.shadowOrthoScale, this._orthoRight + xOffset * this.shadowOrthoScale, this._orthoBottom - yOffset * this.shadowOrthoScale, this._orthoTop + yOffset * this.shadowOrthoScale, this.shadowMinZ !== undefined ? this.shadowMinZ : activeCamera.minZ, this.shadowMaxZ !== undefined ? this.shadowMaxZ : activeCamera.maxZ, matrix);
        };
        DirectionalLight.prototype._buildUniformLayout = function () {
            this._uniformBuffer.addUniform("vLightData", 4);
            this._uniformBuffer.addUniform("vLightDiffuse", 4);
            this._uniformBuffer.addUniform("vLightSpecular", 3);
            this._uniformBuffer.addUniform("shadowsInfo", 3);
            this._uniformBuffer.addUniform("depthValues", 2);
            this._uniformBuffer.create();
        };
        /**
         * Sets the passed Effect object with the DirectionalLight transformed position (or position if not parented) and the passed name.
         * Returns the DirectionalLight.
         */
        DirectionalLight.prototype.transferToEffect = function (effect, lightIndex) {
            if (this.computeTransformedInformation()) {
                this._uniformBuffer.updateFloat4("vLightData", this.transformedDirection.x, this.transformedDirection.y, this.transformedDirection.z, 1, lightIndex);
                return this;
            }
            this._uniformBuffer.updateFloat4("vLightData", this.direction.x, this.direction.y, this.direction.z, 1, lightIndex);
            return this;
        };
        /**
         * Gets the minZ used for shadow according to both the scene and the light.
         *
         * Values are fixed on directional lights as it relies on an ortho projection hence the need to convert being
         * -1 and 1 to 0 and 1 doing (depth + min) / (min + max) -> (depth + 1) / (1 + 1) -> (depth * 0.5) + 0.5.
         * @param activeCamera
         */
        DirectionalLight.prototype.getDepthMinZ = function (activeCamera) {
            return 1;
        };
        /**
         * Gets the maxZ used for shadow according to both the scene and the light.
         *
         * Values are fixed on directional lights as it relies on an ortho projection hence the need to convert being
         * -1 and 1 to 0 and 1 doing (depth + min) / (min + max) -> (depth + 1) / (1 + 1) -> (depth * 0.5) + 0.5.
         * @param activeCamera
         */
        DirectionalLight.prototype.getDepthMaxZ = function (activeCamera) {
            return 1;
        };
        __decorate([
            LIB.serialize()
        ], DirectionalLight.prototype, "shadowFrustumSize", null);
        __decorate([
            LIB.serialize()
        ], DirectionalLight.prototype, "shadowOrthoScale", null);
        __decorate([
            LIB.serialize()
        ], DirectionalLight.prototype, "autoUpdateExtends", void 0);
        return DirectionalLight;
    }(LIB.ShadowLight));
    LIB.DirectionalLight = DirectionalLight;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.directionalLight.js.map
