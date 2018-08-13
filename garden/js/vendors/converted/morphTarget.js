
var LIB;
(function (LIB) {
    /**
     * Defines a target to use with MorphTargetManager
     * @see http://doc.LIBjs.com/how_to/how_to_use_morphtargets
     */
    var MorphTarget = /** @class */ (function () {
        /**
         * Creates a new MorphTarget
         * @param name defines the name of the target
         * @param influence defines the influence to use
         */
        function MorphTarget(
        /** defines the name of the target */
        name, influence, scene) {
            if (influence === void 0) { influence = 0; }
            if (scene === void 0) { scene = null; }
            this.name = name;
            /**
             * Gets or sets the list of animations
             */
            this.animations = new Array();
            this._positions = null;
            this._normals = null;
            this._tangents = null;
            /**
             * Observable raised when the influence changes
             */
            this.onInfluenceChanged = new LIB.Observable();
            this._animationPropertiesOverride = null;
            this._scene = scene || LIB.Engine.LastCreatedScene;
            this.influence = influence;
        }
        Object.defineProperty(MorphTarget.prototype, "influence", {
            /**
             * Gets or sets the influence of this target (ie. its weight in the overall morphing)
             */
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
        Object.defineProperty(MorphTarget.prototype, "animationPropertiesOverride", {
            /**
             * Gets or sets the animation properties override
             */
            get: function () {
                if (!this._animationPropertiesOverride && this._scene) {
                    return this._scene.animationPropertiesOverride;
                }
                return this._animationPropertiesOverride;
            },
            set: function (value) {
                this._animationPropertiesOverride = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTarget.prototype, "hasPositions", {
            /**
             * Gets a boolean defining if the target contains position data
             */
            get: function () {
                return !!this._positions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTarget.prototype, "hasNormals", {
            /**
             * Gets a boolean defining if the target contains normal data
             */
            get: function () {
                return !!this._normals;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MorphTarget.prototype, "hasTangents", {
            /**
             * Gets a boolean defining if the target contains tangent data
             */
            get: function () {
                return !!this._tangents;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Affects position data to this target
         * @param data defines the position data to use
         */
        MorphTarget.prototype.setPositions = function (data) {
            this._positions = data;
        };
        /**
         * Gets the position data stored in this target
         * @returns a FloatArray containing the position data (or null if not present)
         */
        MorphTarget.prototype.getPositions = function () {
            return this._positions;
        };
        /**
         * Affects normal data to this target
         * @param data defines the normal data to use
         */
        MorphTarget.prototype.setNormals = function (data) {
            this._normals = data;
        };
        /**
         * Gets the normal data stored in this target
         * @returns a FloatArray containing the normal data (or null if not present)
         */
        MorphTarget.prototype.getNormals = function () {
            return this._normals;
        };
        /**
         * Affects tangent data to this target
         * @param data defines the tangent data to use
         */
        MorphTarget.prototype.setTangents = function (data) {
            this._tangents = data;
        };
        /**
         * Gets the tangent data stored in this target
         * @returns a FloatArray containing the tangent data (or null if not present)
         */
        MorphTarget.prototype.getTangents = function () {
            return this._tangents;
        };
        /**
         * Serializes the current target into a Serialization object
         * @returns the serialized object
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
        /**
         * Creates a new target from serialized data
         * @param serializationObject defines the serialized data to use
         * @returns a new MorphTarget
         */
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
        /**
         * Creates a MorphTarget from mesh data
         * @param mesh defines the source mesh
         * @param name defines the name to use for the new target
         * @param influence defines the influence to attach to the target
         * @returns a new MorphTarget
         */
        MorphTarget.FromMesh = function (mesh, name, influence) {
            if (!name) {
                name = mesh.name;
            }
            var result = new MorphTarget(name, influence, mesh.getScene());
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
//# sourceMappingURL=LIB.morphTarget.js.map
