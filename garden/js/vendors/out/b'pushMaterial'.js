

var LIB;
(function (LIB) {
    var PushMaterial = /** @class */ (function (_super) {
        __extends(PushMaterial, _super);
        function PushMaterial(name, scene) {
            var _this = _super.call(this, name, scene) || this;
            _this._normalMatrix = new LIB.Matrix();
            _this.storeEffectOnSubMeshes = true;
            return _this;
        }
        PushMaterial.prototype.getEffect = function () {
            return this._activeEffect;
        };
        PushMaterial.prototype.isReady = function (mesh, useInstances) {
            if (!mesh) {
                return false;
            }
            if (!mesh.subMeshes || mesh.subMeshes.length === 0) {
                return true;
            }
            return this.isReadyForSubMesh(mesh, mesh.subMeshes[0], useInstances);
        };
        /**
        * Binds the given world matrix to the active effect
        *
        * @param world the matrix to bind
        */
        PushMaterial.prototype.bindOnlyWorldMatrix = function (world) {
            this._activeEffect.setMatrix("world", world);
        };
        /**
         * Binds the given normal matrix to the active effect
         *
         * @param normalMatrix the matrix to bind
         */
        PushMaterial.prototype.bindOnlyNormalMatrix = function (normalMatrix) {
            this._activeEffect.setMatrix("normalMatrix", normalMatrix);
        };
        PushMaterial.prototype.bind = function (world, mesh) {
            if (!mesh) {
                return;
            }
            this.bindForSubMesh(world, mesh, mesh.subMeshes[0]);
        };
        PushMaterial.prototype._afterBind = function (mesh, effect) {
            if (effect === void 0) { effect = null; }
            _super.prototype._afterBind.call(this, mesh);
            this.getScene()._cachedEffect = effect;
        };
        PushMaterial.prototype._mustRebind = function (scene, effect, visibility) {
            if (visibility === void 0) { visibility = 1; }
            return scene.isCachedMaterialInvalid(this, effect, visibility);
        };
        return PushMaterial;
    }(LIB.Material));
    LIB.PushMaterial = PushMaterial;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.pushMaterial.js.map
//# sourceMappingURL=LIB.pushMaterial.js.map
