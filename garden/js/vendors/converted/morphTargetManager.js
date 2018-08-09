(function (LIB) {
    var MorphTargetManager = /** @class */ (function () {
        function MorphTargetManager(scene) {
            if (scene === void 0) { scene = null; }
            this._targets = new Array();
            this._targetObservable = new Array();
            this._activeTargets = new LIB.SmartArray(16);
            this._supportsNormals = false;
            this._supportsTangents = false;
            this._vertexCount = 0;
            this._uniqueId = 0;
            this._tempInfluences = new Array();
            if (!scene) {
                scene = LIB.Engine.LastCreatedScene;
            }
            this._scene = scene;
            if (this._scene) {
                this._scene.morphTargetManagers.push(this);
                this._uniqueId = this._scene.getUniqueId();
            }
        }
        Object.defineProperty(MorphTargetManager.prototype, "uniqueId", {
            get: function () {
                return this._uniqueId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTargetManager.prototype, "vertexCount", {
            get: function () {
                return this._vertexCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTargetManager.prototype, "supportsNormals", {
            get: function () {
                return this._supportsNormals;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTargetManager.prototype, "supportsTangents", {
            get: function () {
                return this._supportsTangents;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTargetManager.prototype, "numTargets", {
            get: function () {
                return this._targets.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTargetManager.prototype, "numInfluencers", {
            get: function () {
                return this._activeTargets.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTargetManager.prototype, "influences", {
            get: function () {
                return this._influences;
            },
            enumerable: true,
            configurable: true
        });
        MorphTargetManager.prototype.getActiveTarget = function (index) {
            return this._activeTargets.data[index];
        };
        MorphTargetManager.prototype.getTarget = function (index) {
            return this._targets[index];
        };
        MorphTargetManager.prototype.addTarget = function (target) {
            var _this = this;
            this._targets.push(target);
            this._targetObservable.push(target.onInfluenceChanged.add(function (needUpdate) {
                _this._syncActiveTargets(needUpdate);
            }));
            this._syncActiveTargets(true);
        };
        MorphTargetManager.prototype.removeTarget = function (target) {
            var index = this._targets.indexOf(target);
            if (index >= 0) {
                this._targets.splice(index, 1);
                target.onInfluenceChanged.remove(this._targetObservable.splice(index, 1)[0]);
                this._syncActiveTargets(true);
            }
        };
        /**
         * Serializes the current manager into a Serialization object.
         * Returns the serialized object.
         */
        MorphTargetManager.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.id = this.uniqueId;
            serializationObject.targets = [];
            for (var _i = 0, _a = this._targets; _i < _a.length; _i++) {
                var target = _a[_i];
                serializationObject.targets.push(target.serialize());
            }
            return serializationObject;
        };
        MorphTargetManager.prototype._syncActiveTargets = function (needUpdate) {
            var influenceCount = 0;
            this._activeTargets.reset();
            this._supportsNormals = true;
            this._supportsTangents = true;
            this._vertexCount = 0;
            for (var _i = 0, _a = this._targets; _i < _a.length; _i++) {
                var target = _a[_i];
                if (target.influence > 0) {
                    this._activeTargets.push(target);
                    this._tempInfluences[influenceCount++] = target.influence;
                    this._supportsNormals = this._supportsNormals && target.hasNormals;
                    this._supportsTangents = this._supportsTangents && target.hasTangents;
                    var positions = target.getPositions();
                    if (!positions) {
                        LIB.Tools.Error("Invalid target. Target must positions.");
                        return;
                    }
                    var vertexCount = positions.length / 3;
                    if (this._vertexCount === 0) {
                        this._vertexCount = vertexCount;
                    }
                    else if (this._vertexCount !== vertexCount) {
                        LIB.Tools.Error("Incompatible target. Targets must all have the same vertices count.");
                        return;
                    }
                }
            }
            if (!this._influences || this._influences.length !== influenceCount) {
                this._influences = new Float32Array(influenceCount);
            }
            for (var index = 0; index < influenceCount; index++) {
                this._influences[index] = this._tempInfluences[index];
            }
            if (needUpdate && this._scene) {
                // Flag meshes as dirty to resync with the active targets
                for (var _b = 0, _c = this._scene.meshes; _b < _c.length; _b++) {
                    var mesh = _c[_b];
                    if (mesh.morphTargetManager === this) {
                        mesh._syncGeometryWithMorphTargetManager();
                    }
                }
            }
        };
        // Statics
        MorphTargetManager.Parse = function (serializationObject, scene) {
            var result = new MorphTargetManager(scene);
            result._uniqueId = serializationObject.id;
            for (var _i = 0, _a = serializationObject.targets; _i < _a.length; _i++) {
                var targetData = _a[_i];
                result.addTarget(LIB.MorphTarget.Parse(targetData));
            }
            return result;
        };
        return MorphTargetManager;
    }());
    LIB.MorphTargetManager = MorphTargetManager;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.morphTargetManager.js.map
