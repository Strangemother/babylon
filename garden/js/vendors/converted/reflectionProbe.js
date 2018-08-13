
var LIB;
(function (LIB) {
    var ReflectionProbe = /** @class */ (function () {
        function ReflectionProbe(name, size, scene, generateMipMaps) {
            if (generateMipMaps === void 0) { generateMipMaps = true; }
            var _this = this;
            this.name = name;
            this._viewMatrix = LIB.Matrix.Identity();
            this._target = LIB.Vector3.Zero();
            this._add = LIB.Vector3.Zero();
            this._invertYAxis = false;
            this.position = LIB.Vector3.Zero();
            this._scene = scene;
            this._scene.reflectionProbes.push(this);
            this._renderTargetTexture = new LIB.RenderTargetTexture(name, size, scene, generateMipMaps, true, LIB.Engine.TEXTURETYPE_UNSIGNED_INT, true);
            this._renderTargetTexture.onBeforeRenderObservable.add(function (faceIndex) {
                switch (faceIndex) {
                    case 0:
                        _this._add.copyFromFloats(1, 0, 0);
                        break;
                    case 1:
                        _this._add.copyFromFloats(-1, 0, 0);
                        break;
                    case 2:
                        _this._add.copyFromFloats(0, _this._invertYAxis ? 1 : -1, 0);
                        break;
                    case 3:
                        _this._add.copyFromFloats(0, _this._invertYAxis ? -1 : 1, 0);
                        break;
                    case 4:
                        _this._add.copyFromFloats(0, 0, 1);
                        break;
                    case 5:
                        _this._add.copyFromFloats(0, 0, -1);
                        break;
                }
                if (_this._attachedMesh) {
                    _this.position.copyFrom(_this._attachedMesh.getAbsolutePosition());
                }
                _this.position.addToRef(_this._add, _this._target);
                LIB.Matrix.LookAtLHToRef(_this.position, _this._target, LIB.Vector3.Up(), _this._viewMatrix);
                scene.setTransformMatrix(_this._viewMatrix, _this._projectionMatrix);
                scene._forcedViewPosition = _this.position;
            });
            this._renderTargetTexture.onAfterUnbindObservable.add(function () {
                scene._forcedViewPosition = null;
                scene.updateTransformMatrix(true);
            });
            if (scene.activeCamera) {
                this._projectionMatrix = LIB.Matrix.PerspectiveFovLH(Math.PI / 2, 1, scene.activeCamera.minZ, scene.activeCamera.maxZ);
            }
        }
        Object.defineProperty(ReflectionProbe.prototype, "samples", {
            get: function () {
                return this._renderTargetTexture.samples;
            },
            set: function (value) {
                this._renderTargetTexture.samples = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ReflectionProbe.prototype, "refreshRate", {
            get: function () {
                return this._renderTargetTexture.refreshRate;
            },
            set: function (value) {
                this._renderTargetTexture.refreshRate = value;
            },
            enumerable: true,
            configurable: true
        });
        ReflectionProbe.prototype.getScene = function () {
            return this._scene;
        };
        Object.defineProperty(ReflectionProbe.prototype, "cubeTexture", {
            get: function () {
                return this._renderTargetTexture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ReflectionProbe.prototype, "renderList", {
            get: function () {
                return this._renderTargetTexture.renderList;
            },
            enumerable: true,
            configurable: true
        });
        ReflectionProbe.prototype.attachToMesh = function (mesh) {
            this._attachedMesh = mesh;
        };
        /**
         * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups.
         *
         * @param renderingGroupId The rendering group id corresponding to its index
         * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
         */
        ReflectionProbe.prototype.setRenderingAutoClearDepthStencil = function (renderingGroupId, autoClearDepthStencil) {
            this._renderTargetTexture.setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil);
        };
        ReflectionProbe.prototype.dispose = function () {
            var index = this._scene.reflectionProbes.indexOf(this);
            if (index !== -1) {
                // Remove from the scene if found 
                this._scene.reflectionProbes.splice(index, 1);
            }
            if (this._renderTargetTexture) {
                this._renderTargetTexture.dispose();
                this._renderTargetTexture = null;
            }
        };
        return ReflectionProbe;
    }());
    LIB.ReflectionProbe = ReflectionProbe;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.reflectionProbe.js.map
//# sourceMappingURL=LIB.reflectionProbe.js.map
