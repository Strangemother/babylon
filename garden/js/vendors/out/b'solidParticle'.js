
var LIB;
(function (LIB) {
    /**
     * Represents one particle of a solid particle system.
     */
    var SolidParticle = /** @class */ (function () {
        /**
         * Creates a Solid Particle object.
         * Don't create particles manually, use instead the Solid Particle System internal tools like _addParticle()
         * @param particleIndex (integer) is the particle index in the Solid Particle System pool. It's also the particle identifier.
         * @param positionIndex (integer) is the starting index of the particle vertices in the SPS "positions" array.
         * @param indiceIndex (integer) is the starting index of the particle indices in the SPS "indices" array.
         * @param model (ModelShape) is a reference to the model shape on what the particle is designed.
         * @param shapeId (integer) is the model shape identifier in the SPS.
         * @param idxInShape (integer) is the index of the particle in the current model (ex: the 10th box of addShape(box, 30))
         * @param modelBoundingInfo is the reference to the model BoundingInfo used for intersection computations.
         */
        function SolidParticle(particleIndex, positionIndex, indiceIndex, model, shapeId, idxInShape, sps, modelBoundingInfo) {
            if (modelBoundingInfo === void 0) { modelBoundingInfo = null; }
            /**
             * particle global index
             */
            this.idx = 0;
            /**
             * The color of the particle
             */
            this.color = new LIB.Color4(1.0, 1.0, 1.0, 1.0);
            /**
             * The world space position of the particle.
             */
            this.position = LIB.Vector3.Zero();
            /**
             * The world space rotation of the particle. (Not use if rotationQuaternion is set)
             */
            this.rotation = LIB.Vector3.Zero();
            /**
             * The scaling of the particle.
             */
            this.scaling = LIB.Vector3.One();
            /**
             * The uvs of the particle.
             */
            this.uvs = new LIB.Vector4(0.0, 0.0, 1.0, 1.0);
            /**
             * The current speed of the particle.
             */
            this.velocity = LIB.Vector3.Zero();
            /**
             * The pivot point in the particle local space.
             */
            this.pivot = LIB.Vector3.Zero();
            /**
             * Must the particle be translated from its pivot point in its local space ?
             * In this case, the pivot point is set at the origin of the particle local space and the particle is translated.
             * Default : false
             */
            this.translateFromPivot = false;
            /**
             * Is the particle active or not ?
             */
            this.alive = true;
            /**
             * Is the particle visible or not ?
             */
            this.isVisible = true;
            /**
             * Index of this particle in the global "positions" array (Internal use)
             */
            this._pos = 0;
            /**
             * Index of this particle in the global "indices" array (Internal use)
             */
            this._ind = 0;
            /**
             * ModelShape id of this particle
             */
            this.shapeId = 0;
            /**
             * Index of the particle in its shape id (Internal use)
             */
            this.idxInShape = 0;
            /**
             * Still set as invisible in order to skip useless computations (Internal use)
             */
            this._stillInvisible = false;
            /**
             * Last computed particle rotation matrix
             */
            this._rotationMatrix = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
            /**
             * Parent particle Id, if any.
             * Default null.
             */
            this.parentId = null;
            /**
             * Internal global position in the SPS.
             */
            this._globalPosition = LIB.Vector3.Zero();
            this.idx = particleIndex;
            this._pos = positionIndex;
            this._ind = indiceIndex;
            this._model = model;
            this.shapeId = shapeId;
            this.idxInShape = idxInShape;
            this._sps = sps;
            if (modelBoundingInfo) {
                this._modelBoundingInfo = modelBoundingInfo;
                this._boundingInfo = new LIB.BoundingInfo(modelBoundingInfo.minimum, modelBoundingInfo.maximum);
            }
        }
        Object.defineProperty(SolidParticle.prototype, "scale", {
            /**
             * Legacy support, changed scale to scaling
             */
            get: function () {
                return this.scaling;
            },
            /**
             * Legacy support, changed scale to scaling
             */
            set: function (scale) {
                this.scaling = scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SolidParticle.prototype, "quaternion", {
            /**
             * Legacy support, changed quaternion to rotationQuaternion
             */
            get: function () {
                return this.rotationQuaternion;
            },
            /**
             * Legacy support, changed quaternion to rotationQuaternion
             */
            set: function (q) {
                this.rotationQuaternion = q;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns a boolean. True if the particle intersects another particle or another mesh, else false.
         * The intersection is computed on the particle bounding sphere and Axis Aligned Bounding Box (AABB)
         * @param target is the object (solid particle or mesh) what the intersection is computed against.
         * @returns true if it intersects
         */
        SolidParticle.prototype.intersectsMesh = function (target) {
            if (!this._boundingInfo || !target._boundingInfo) {
                return false;
            }
            if (this._sps._bSphereOnly) {
                return LIB.BoundingSphere.Intersects(this._boundingInfo.boundingSphere, target._boundingInfo.boundingSphere);
            }
            return this._boundingInfo.intersects(target._boundingInfo, false);
        };
        return SolidParticle;
    }());
    LIB.SolidParticle = SolidParticle;
    /**
     * Represents the shape of the model used by one particle of a solid particle system.
     * SPS internal tool, don't use it manually.
     */
    var ModelShape = /** @class */ (function () {
        /**
         * Creates a ModelShape object. This is an internal simplified reference to a mesh used as for a model to replicate particles from by the SPS.
         * SPS internal tool, don't use it manually.
         * @hidden
         */
        function ModelShape(id, shape, indicesLength, shapeUV, posFunction, vtxFunction) {
            /**
             * length of the shape in the model indices array (internal use)
             */
            this._indicesLength = 0;
            this.shapeID = id;
            this._shape = shape;
            this._indicesLength = indicesLength;
            this._shapeUV = shapeUV;
            this._positionFunction = posFunction;
            this._vertexFunction = vtxFunction;
        }
        return ModelShape;
    }());
    LIB.ModelShape = ModelShape;
    /**
     * Represents a Depth Sorted Particle in the solid particle system.
     */
    var DepthSortedParticle = /** @class */ (function () {
        function DepthSortedParticle() {
            /**
             * Index of the particle in the "indices" array
             */
            this.ind = 0;
            /**
             * Length of the particle shape in the "indices" array
             */
            this.indicesLength = 0;
            /**
             * Squared distance from the particle to the camera
             */
            this.sqDistance = 0.0;
        }
        return DepthSortedParticle;
    }());
    LIB.DepthSortedParticle = DepthSortedParticle;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.solidParticle.js.map
//# sourceMappingURL=LIB.solidParticle.js.map
