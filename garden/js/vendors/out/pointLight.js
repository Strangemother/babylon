var BABYLON;
(function (BABYLON) {
    var PointLight = /** @class */ (function (_super) {
        __extends(PointLight, _super);
        /**
         * Creates a PointLight object from the passed name and position (Vector3) and adds it in the scene.
         * A PointLight emits the light in every direction.
         * It can cast shadows.
         * If the scene camera is already defined and you want to set your PointLight at the camera position, just set it :
         * ```javascript
         * var pointLight = new BABYLON.PointLight("pl", camera.position, scene);
         * ```
         * Documentation : http://doc.babylonjs.com/tutorials/lights
         */
        function PointLight(name, position, scene) {
            var _this = _super.call(this, name, scene) || this;
            _this._shadowAngle = Math.PI / 2;
            _this.position = position;
            return _this;
        }
        Object.defineProperty(PointLight.prototype, "shadowAngle", {
            /**
             * Getter: In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
             * This specifies what angle the shadow will use to be created.
             *
             * It default to 90 degrees to work nicely with the cube texture generation for point lights shadow maps.
             */
            get: function () {
                return this._shadowAngle;
            },
            /**
             * Setter: In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
             * This specifies what angle the shadow will use to be created.
             *
             * It default to 90 degrees to work nicely with the cube texture generation for point lights shadow maps.
             */
            set: function (value) {
                this._shadowAngle = value;
                this.forceProjectionMatrixCompute();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointLight.prototype, "direction", {
            get: function () {
                return this._direction;
            },
            /**
             * In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
             */
            set: function (value) {
                var previousNeedCube = this.needCube();
                this._direction = value;
                if (this.needCube() !== previousNeedCube && this._shadowGenerator) {
                    this._shadowGenerator.recreateShadowMap();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the string "PointLight"
         */
        PointLight.prototype.getClassName = function () {
            return "PointLight";
        };
        /**
         * Returns the integer 0.
         */
        PointLight.prototype.getTypeID = function () {
            return BABYLON.Light.LIGHTTYPEID_POINTLIGHT;
        };
        /**
         * Specifies wether or not the shadowmap should be a cube texture.
         */
        PointLight.prototype.needCube = function () {
            return !this.direction;
        };
        /**
         * Returns a new Vector3 aligned with the PointLight cube system according to the passed cube face index (integer).
         */
        PointLight.prototype.getShadowDirection = function (faceIndex) {
            if (this.direction) {
                return _super.prototype.getShadowDirection.call(this, faceIndex);
            }
            else {
                switch (faceIndex) {
                    case 0:
                        return new BABYLON.Vector3(1.0, 0.0, 0.0);
                    case 1:
                        return new BABYLON.Vector3(-1.0, 0.0, 0.0);
                    case 2:
                        return new BABYLON.Vector3(0.0, -1.0, 0.0);
                    case 3:
                        return new BABYLON.Vector3(0.0, 1.0, 0.0);
                    case 4:
                        return new BABYLON.Vector3(0.0, 0.0, 1.0);
                    case 5:
                        return new BABYLON.Vector3(0.0, 0.0, -1.0);
                }
            }
            return BABYLON.Vector3.Zero();
        };
        /**
         * Sets the passed matrix "matrix" as a left-handed perspective projection matrix with the following settings :
         * - fov = PI / 2
         * - aspect ratio : 1.0
         * - z-near and far equal to the active camera minZ and maxZ.
         * Returns the PointLight.
         */
        PointLight.prototype._setDefaultShadowProjectionMatrix = function (matrix, viewMatrix, renderList) {
            var activeCamera = this.getScene().activeCamera;
            if (!activeCamera) {
                return;
            }
            BABYLON.Matrix.PerspectiveFovLHToRef(this.shadowAngle, 1.0, this.getDepthMinZ(activeCamera), this.getDepthMaxZ(activeCamera), matrix);
        };
        PointLight.prototype._buildUniformLayout = function () {
            this._uniformBuffer.addUniform("vLightData", 4);
            this._uniformBuffer.addUniform("vLightDiffuse", 4);
            this._uniformBuffer.addUniform("vLightSpecular", 3);
            this._uniformBuffer.addUniform("shadowsInfo", 3);
            this._uniformBuffer.addUniform("depthValues", 2);
            this._uniformBuffer.create();
        };
        /**
         * Sets the passed Effect "effect" with the PointLight transformed position (or position, if none) and passed name (string).
         * Returns the PointLight.
         */
        PointLight.prototype.transferToEffect = function (effect, lightIndex) {
            if (this.computeTransformedInformation()) {
                this._uniformBuffer.updateFloat4("vLightData", this.transformedPosition.x, this.transformedPosition.y, this.transformedPosition.z, 0.0, lightIndex);
                return this;
            }
            this._uniformBuffer.updateFloat4("vLightData", this.position.x, this.position.y, this.position.z, 0, lightIndex);
            return this;
        };
        __decorate([
            BABYLON.serialize()
        ], PointLight.prototype, "shadowAngle", null);
        return PointLight;
    }(BABYLON.ShadowLight));
    BABYLON.PointLight = PointLight;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.pointLight.js.map
