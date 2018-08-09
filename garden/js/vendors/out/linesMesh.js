var BABYLON;
(function (BABYLON) {
    var LinesMesh = /** @class */ (function (_super) {
        __extends(LinesMesh, _super);
        function LinesMesh(name, scene, parent, source, doNotCloneChildren, useVertexColor, useVertexAlpha) {
            if (scene === void 0) { scene = null; }
            if (parent === void 0) { parent = null; }
            var _this = _super.call(this, name, scene, parent, source, doNotCloneChildren) || this;
            _this.useVertexColor = useVertexColor;
            _this.useVertexAlpha = useVertexAlpha;
            _this.color = new BABYLON.Color3(1, 1, 1);
            _this.alpha = 1;
            if (source) {
                _this.color = source.color.clone();
                _this.alpha = source.alpha;
                _this.useVertexColor = source.useVertexColor;
                _this.useVertexAlpha = source.useVertexAlpha;
            }
            _this._intersectionThreshold = 0.1;
            var defines = [];
            var options = {
                attributes: [BABYLON.VertexBuffer.PositionKind],
                uniforms: ["world", "viewProjection"],
                needAlphaBlending: true,
                defines: defines
            };
            if (useVertexAlpha === false) {
                options.needAlphaBlending = false;
            }
            if (!useVertexColor) {
                options.uniforms.push("color");
            }
            else {
                options.defines.push("#define VERTEXCOLOR");
                options.attributes.push(BABYLON.VertexBuffer.ColorKind);
            }
            _this._colorShader = new BABYLON.ShaderMaterial("colorShader", _this.getScene(), "color", options);
            return _this;
        }
        Object.defineProperty(LinesMesh.prototype, "intersectionThreshold", {
            /**
             * The intersection Threshold is the margin applied when intersection a segment of the LinesMesh with a Ray.
             * This margin is expressed in world space coordinates, so its value may vary.
             * Default value is 0.1
             * @returns the intersection Threshold value.
             */
            get: function () {
                return this._intersectionThreshold;
            },
            /**
             * The intersection Threshold is the margin applied when intersection a segment of the LinesMesh with a Ray.
             * This margin is expressed in world space coordinates, so its value may vary.
             * @param value the new threshold to apply
             */
            set: function (value) {
                if (this._intersectionThreshold === value) {
                    return;
                }
                this._intersectionThreshold = value;
                if (this.geometry) {
                    this.geometry.boundingBias = new BABYLON.Vector2(0, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the string "LineMesh"
         */
        LinesMesh.prototype.getClassName = function () {
            return "LinesMesh";
        };
        Object.defineProperty(LinesMesh.prototype, "material", {
            get: function () {
                return this._colorShader;
            },
            set: function (value) {
                // Do nothing
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinesMesh.prototype, "checkCollisions", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        LinesMesh.prototype.createInstance = function (name) {
            throw new Error("LinesMeshes do not support createInstance.");
        };
        LinesMesh.prototype._bind = function (subMesh, effect, fillMode) {
            if (!this._geometry) {
                return this;
            }
            // VBOs
            this._geometry._bind(this._colorShader.getEffect());
            // Color
            if (!this.useVertexColor) {
                this._colorShader.setColor4("color", this.color.toColor4(this.alpha));
            }
            return this;
        };
        LinesMesh.prototype._draw = function (subMesh, fillMode, instancesCount) {
            if (!this._geometry || !this._geometry.getVertexBuffers() || !this._geometry.getIndexBuffer()) {
                return this;
            }
            var engine = this.getScene().getEngine();
            // Draw order
            engine.drawElementsType(BABYLON.Material.LineListDrawMode, subMesh.indexStart, subMesh.indexCount);
            return this;
        };
        LinesMesh.prototype.dispose = function (doNotRecurse) {
            this._colorShader.dispose();
            _super.prototype.dispose.call(this, doNotRecurse);
        };
        /**
         * Returns a new LineMesh object cloned from the current one.
         */
        LinesMesh.prototype.clone = function (name, newParent, doNotCloneChildren) {
            return new LinesMesh(name, this.getScene(), newParent, this, doNotCloneChildren);
        };
        return LinesMesh;
    }(BABYLON.Mesh));
    BABYLON.LinesMesh = LinesMesh;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.linesMesh.js.map
