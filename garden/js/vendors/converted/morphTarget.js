(function (LIB) {
    var MorphTarget = /** @class */ (function () {
        function MorphTarget(name, influence) {
            if (influence === void 0) { influence = 0; }
            this.name = name;
            this.animations = new Array();
            this._positions = null;
            this._normals = null;
            this._tangents = null;
            this.onInfluenceChanged = new LIB.Observable();
            this.influence = influence;
        }
        Object.defineProperty(MorphTarget.prototype, "influence", {
            get: function () {
                return this._influence;
            },
            set: function (influence) {
                if (this._influence === influence) {
                    return;
                }
                var previous = this._influence;
                this._influence = influence;
                if (this.onInfluenceChanged.hasObservers) {
                    this.onInfluenceChanged.notifyObservers(previous === 0 || influence === 0);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTarget.prototype, "hasPositions", {
            get: function () {
                return !!this._positions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTarget.prototype, "hasNormals", {
            get: function () {
                return !!this._normals;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTarget.prototype, "hasTangents", {
            get: function () {
                return !!this._tangents;
            },
            enumerable: true,
            configurable: true
        });
        MorphTarget.prototype.setPositions = function (data) {
            this._positions = data;
        };
        MorphTarget.prototype.getPositions = function () {
            return this._positions;
        };
        MorphTarget.prototype.setNormals = function (data) {
            this._normals = data;
        };
        MorphTarget.prototype.getNormals = function () {
            return this._normals;
        };
        MorphTarget.prototype.setTangents = function (data) {
            this._tangents = data;
        };
        MorphTarget.prototype.getTangents = function () {
            return this._tangents;
        };
        /**
         * Serializes the current target into a Serialization object.
         * Returns the serialized object.
         */
        MorphTarget.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.name = this.name;
            serializationObject.influence = this.influence;
            serializationObject.positions = Array.prototype.slice.call(this.getPositions());
            if (this.hasNormals) {
                serializationObject.normals = Array.prototype.slice.call(this.getNormals());
            }
            if (this.hasTangents) {
                serializationObject.tangents = Array.prototype.slice.call(this.getTangents());
            }
            // Animations
            LIB.Animation.AppendSerializedAnimations(this, serializationObject);
            return serializationObject;
        };
        // Statics
        MorphTarget.Parse = function (serializationObject) {
            var result = new MorphTarget(serializationObject.name, serializationObject.influence);
            result.setPositions(serializationObject.positions);
            if (serializationObject.normals) {
                result.setNormals(serializationObject.normals);
            }
            if (serializationObject.tangents) {
                result.setTangents(serializationObject.tangents);
            }
            // Animations
            if (serializationObject.animations) {
                for (var animationIndex = 0; animationIndex < serializationObject.animations.length; animationIndex++) {
                    var parsedAnimation = serializationObject.animations[animationIndex];
                    result.animations.push(LIB.Animation.Parse(parsedAnimation));
                }
            }
            return result;
        };
        MorphTarget.FromMesh = function (mesh, name, influence) {
            if (!name) {
                name = mesh.name;
            }
            var result = new MorphTarget(name, influence);
            result.setPositions(mesh.getVerticesData(LIB.VertexBuffer.PositionKind));
            if (mesh.isVerticesDataPresent(LIB.VertexBuffer.NormalKind)) {
                result.setNormals(mesh.getVerticesData(LIB.VertexBuffer.NormalKind));
            }
            if (mesh.isVerticesDataPresent(LIB.VertexBuffer.TangentKind)) {
                result.setTangents(mesh.getVerticesData(LIB.VertexBuffer.TangentKind));
            }
            return result;
        };
        return MorphTarget;
    }());
    LIB.MorphTarget = MorphTarget;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.morphTarget.js.map
