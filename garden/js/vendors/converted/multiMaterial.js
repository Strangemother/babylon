(function (LIB) {
    var MultiMaterial = /** @class */ (function (_super) {
        __extends(MultiMaterial, _super);
        function MultiMaterial(name, scene) {
            var _this = _super.call(this, name, scene, true) || this;
            scene.multiMaterials.push(_this);
            _this.subMaterials = new Array();
            _this.storeEffectOnSubMeshes = true; // multimaterial is considered like a push material
            return _this;
        }
        Object.defineProperty(MultiMaterial.prototype, "subMaterials", {
            get: function () {
                return this._subMaterials;
            },
            set: function (value) {
                this._subMaterials = value;
                this._hookArray(value);
            },
            enumerable: true,
            configurable: true
        });
        MultiMaterial.prototype._hookArray = function (array) {
            var _this = this;
            var oldPush = array.push;
            array.push = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i] = arguments[_i];
                }
                var result = oldPush.apply(array, items);
                _this._markAllSubMeshesAsTexturesDirty();
                return result;
            };
            var oldSplice = array.splice;
            array.splice = function (index, deleteCount) {
                var deleted = oldSplice.apply(array, [index, deleteCount]);
                _this._markAllSubMeshesAsTexturesDirty();
                return deleted;
            };
        };
        // Properties
        MultiMaterial.prototype.getSubMaterial = function (index) {
            if (index < 0 || index >= this.subMaterials.length) {
                return this.getScene().defaultMaterial;
            }
            return this.subMaterials[index];
        };
        MultiMaterial.prototype.getActiveTextures = function () {
            return (_a = _super.prototype.getActiveTextures.call(this)).concat.apply(_a, this.subMaterials.map(function (subMaterial) {
                if (subMaterial) {
                    return subMaterial.getActiveTextures();
                }
                else {
                    return [];
                }
            }));
            var _a;
        };
        // Methods
        MultiMaterial.prototype.getClassName = function () {
            return "MultiMaterial";
        };
        MultiMaterial.prototype.isReadyForSubMesh = function (mesh, subMesh, useInstances) {
            for (var index = 0; index < this.subMaterials.length; index++) {
                var subMaterial = this.subMaterials[index];
                if (subMaterial) {
                    if (subMaterial.storeEffectOnSubMeshes) {
                        if (!subMaterial.isReadyForSubMesh(mesh, subMesh, useInstances)) {
                            return false;
                        }
                        continue;
                    }
                    if (!subMaterial.isReady(mesh)) {
                        return false;
                    }
                }
            }
            return true;
        };
        MultiMaterial.prototype.clone = function (name, cloneChildren) {
            var newMultiMaterial = new MultiMaterial(name, this.getScene());
            for (var index = 0; index < this.subMaterials.length; index++) {
                var subMaterial = null;
                var current = this.subMaterials[index];
                if (cloneChildren && current) {
                    subMaterial = current.clone(name + "-" + current.name);
                }
                else {
                    subMaterial = this.subMaterials[index];
                }
                newMultiMaterial.subMaterials.push(subMaterial);
            }
            return newMultiMaterial;
        };
        MultiMaterial.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.name = this.name;
            serializationObject.id = this.id;
            if (LIB.Tags) {
                serializationObject.tags = LIB.Tags.GetTags(this);
            }
            serializationObject.materials = [];
            for (var matIndex = 0; matIndex < this.subMaterials.length; matIndex++) {
                var subMat = this.subMaterials[matIndex];
                if (subMat) {
                    serializationObject.materials.push(subMat.id);
                }
                else {
                    serializationObject.materials.push(null);
                }
            }
            return serializationObject;
        };
        MultiMaterial.prototype.dispose = function (forceDisposeEffect, forceDisposeTextures) {
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            var index = scene.multiMaterials.indexOf(this);
            if (index >= 0) {
                scene.multiMaterials.splice(index, 1);
            }
            _super.prototype.dispose.call(this, forceDisposeEffect, forceDisposeTextures);
        };
        return MultiMaterial;
    }(LIB.Material));
    LIB.MultiMaterial = MultiMaterial;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.multiMaterial.js.map
