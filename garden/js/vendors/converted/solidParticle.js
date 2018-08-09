(function (LIB) {
    var SolidParticle = /** @class */ (function () {
        /**
         * Creates a Solid Particle object.
         * Don't create particles manually, use instead the Solid Particle System internal tools like _addParticle()
         * `particleIndex` (integer) is the particle index in the Solid Particle System pool. It's also the particle identifier.
         * `positionIndex` (integer) is the starting index of the particle vertices in the SPS "positions" array.
         * `indiceIndex` (integer) is the starting index of the particle indices in the SPS "indices" array.
         * `model` (ModelShape) is a reference to the model shape on what the particle is designed.
         * `shapeId` (integer) is the model shape identifier in the SPS.
         * `idxInShape` (integer) is the index of the particle in the current model (ex: the 10th box of addShape(box, 30))
         * `modelBoundingInfo` is the reference to the model BoundingInfo used for intersection computations.
         */
        function SolidParticle(particleIndex, positionIndex, indiceIndex, model, shapeId, idxInShape, sps, modelBoundingInfo) {
            if (modelBoundingInfo === void 0) { modelBoundingInfo = null; }
            this.idx = 0; // particle global index
            this.color = new LIB.Color4(1.0, 1.0, 1.0, 1.0); // color
            this.position = LIB.Vector3.Zero(); // position
            this.rotation = LIB.Vector3.Zero(); // rotation
            this.scaling = LIB.Vector3.One(); // scaling
            this.uvs = new LIB.Vector4(0.0, 0.0, 1.0, 1.0); // uvs
            this.velocity = LIB.Vector3.Zero(); // velocity
            this.pivot = LIB.Vector3.Zero(); // pivot point in the particle local space
            this.alive = true; // alive
            this.isVisible = true; // visibility
            this._pos = 0; // index of this particle in the global "positions" array
            this._ind = 0; // index of this particle in the global "indices" array
            this.shapeId = 0; // model shape id
            this.idxInShape = 0; // index of the particle in its shape id
            this._stillInvisible = false; // still set as invisible in order to skip useless computations
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
             * legacy support, changed scale to scaling
             */
            get: function () {
                return this.scaling;
            },
            set: function (scale) {
                this.scaling = scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SolidParticle.prototype, "quaternion", {
            /**
             * legacy support, changed quaternion to rotationQuaternion
             */
            get: function () {
                return this.rotationQuaternion;
            },
            set: function (q) {
                this.rotationQuaternion = q;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns a boolean. True if the particle intersects another particle or another mesh, else false.
         * The intersection is computed on the particle bounding sphere and Axis Aligned Bounding Box (AABB)
         * `target` is the object (solid particle or mesh) what the intersection is computed against.
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
    var ModelShape = /** @class */ (function () {
        /**
         * Creates a ModelShape object. This is an internal simplified reference to a mesh used as for a model to replicate particles from by the SPS.
         * SPS internal tool, don't use it manually.
         */
        function ModelShape(id, shape, indicesLength, shapeUV, posFunction, vtxFunction) {
            this._indicesLength = 0; // length of the shape in the model indices array
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
    var DepthSortedParticle = /** @class */ (function () {
        function DepthSortedParticle() {
            this.ind = 0; // index of the particle in the "indices" array
            this.indicesLength = 0; // length of the particle shape in the "indices" array
            this.sqDistance = 0.0; // squared distance from the particle to the camera
        }
        return DepthSortedParticle;
    }());
    LIB.DepthSortedParticle = DepthSortedParticle;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.solidParticle.js.map
