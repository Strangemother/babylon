
var LIB;
(function (LIB) {
    var BoundingBox = /** @class */ (function () {
        /**
         * Creates a new bounding box
         * @param min defines the minimum vector (in local space)
         * @param max defines the maximum vector (in local space)
         */
        function BoundingBox(min, max) {
            this.vectorsWorld = new Array();
            this.reConstruct(min, max);
        }
        // Methods
        /**
         * Recreates the entire bounding box from scratch
         * @param min defines the new minimum vector (in local space)
         * @param max defines the new maximum vector (in local space)
         */
        BoundingBox.prototype.reConstruct = function (min, max) {
            this.minimum = min.clone();
            this.maximum = max.clone();
            // Bounding vectors
            this.vectors = new Array();
            this.vectors.push(this.minimum.clone());
            this.vectors.push(this.maximum.clone());
            this.vectors.push(this.minimum.clone());
            this.vectors[2].x = this.maximum.x;
            this.vectors.push(this.minimum.clone());
            this.vectors[3].y = this.maximum.y;
            this.vectors.push(this.minimum.clone());
            this.vectors[4].z = this.maximum.z;
            this.vectors.push(this.maximum.clone());
            this.vectors[5].z = this.minimum.z;
            this.vectors.push(this.maximum.clone());
            this.vectors[6].x = this.minimum.x;
            this.vectors.push(this.maximum.clone());
            this.vectors[7].y = this.minimum.y;
            // OBB
            this.center = this.maximum.add(this.minimum).scale(0.5);
            this.extendSize = this.maximum.subtract(this.minimum).scale(0.5);
            this.directions = [LIB.Vector3.Zero(), LIB.Vector3.Zero(), LIB.Vector3.Zero()];
            // World
            for (var index = 0; index < this.vectors.length; index++) {
                this.vectorsWorld[index] = LIB.Vector3.Zero();
            }
            this.minimumWorld = LIB.Vector3.Zero();
            this.maximumWorld = LIB.Vector3.Zero();
            this.centerWorld = LIB.Vector3.Zero();
            this.extendSizeWorld = LIB.Vector3.Zero();
            this._update(this._worldMatrix || LIB.Matrix.Identity());
        };
        BoundingBox.prototype.getWorldMatrix = function () {
            return this._worldMatrix;
        };
        BoundingBox.prototype.setWorldMatrix = function (matrix) {
            this._worldMatrix.copyFrom(matrix);
            return this;
        };
        BoundingBox.prototype._update = function (world) {
            LIB.Vector3.FromFloatsToRef(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, this.minimumWorld);
            LIB.Vector3.FromFloatsToRef(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, this.maximumWorld);
            for (var index = 0; index < this.vectors.length; index++) {
                var v = this.vectorsWorld[index];
                LIB.Vector3.TransformCoordinatesToRef(this.vectors[index], world, v);
                if (v.x < this.minimumWorld.x)
                    this.minimumWorld.x = v.x;
                if (v.y < this.minimumWorld.y)
                    this.minimumWorld.y = v.y;
                if (v.z < this.minimumWorld.z)
                    this.minimumWorld.z = v.z;
                if (v.x > this.maximumWorld.x)
                    this.maximumWorld.x = v.x;
                if (v.y > this.maximumWorld.y)
                    this.maximumWorld.y = v.y;
                if (v.z > this.maximumWorld.z)
                    this.maximumWorld.z = v.z;
            }
            // Extend
            this.maximumWorld.subtractToRef(this.minimumWorld, this.extendSizeWorld);
            this.extendSizeWorld.scaleInPlace(0.5);
            // OBB
            this.maximumWorld.addToRef(this.minimumWorld, this.centerWorld);
            this.centerWorld.scaleInPlace(0.5);
            LIB.Vector3.FromFloatArrayToRef(world.m, 0, this.directions[0]);
            LIB.Vector3.FromFloatArrayToRef(world.m, 4, this.directions[1]);
            LIB.Vector3.FromFloatArrayToRef(world.m, 8, this.directions[2]);
            this._worldMatrix = world;
        };
        BoundingBox.prototype.isInFrustum = function (frustumPlanes) {
            return BoundingBox.IsInFrustum(this.vectorsWorld, frustumPlanes);
        };
        BoundingBox.prototype.isCompletelyInFrustum = function (frustumPlanes) {
            return BoundingBox.IsCompletelyInFrustum(this.vectorsWorld, frustumPlanes);
        };
        BoundingBox.prototype.intersectsPoint = function (point) {
            var delta = -LIB.Epsilon;
            if (this.maximumWorld.x - point.x < delta || delta > point.x - this.minimumWorld.x)
                return false;
            if (this.maximumWorld.y - point.y < delta || delta > point.y - this.minimumWorld.y)
                return false;
            if (this.maximumWorld.z - point.z < delta || delta > point.z - this.minimumWorld.z)
                return false;
            return true;
        };
        BoundingBox.prototype.intersectsSphere = function (sphere) {
            return BoundingBox.IntersectsSphere(this.minimumWorld, this.maximumWorld, sphere.centerWorld, sphere.radiusWorld);
        };
        BoundingBox.prototype.intersectsMinMax = function (min, max) {
            if (this.maximumWorld.x < min.x || this.minimumWorld.x > max.x)
                return false;
            if (this.maximumWorld.y < min.y || this.minimumWorld.y > max.y)
                return false;
            if (this.maximumWorld.z < min.z || this.minimumWorld.z > max.z)
                return false;
            return true;
        };
        // Statics
        BoundingBox.Intersects = function (box0, box1) {
            if (box0.maximumWorld.x < box1.minimumWorld.x || box0.minimumWorld.x > box1.maximumWorld.x)
                return false;
            if (box0.maximumWorld.y < box1.minimumWorld.y || box0.minimumWorld.y > box1.maximumWorld.y)
                return false;
            if (box0.maximumWorld.z < box1.minimumWorld.z || box0.minimumWorld.z > box1.maximumWorld.z)
                return false;
            return true;
        };
        BoundingBox.IntersectsSphere = function (minPoint, maxPoint, sphereCenter, sphereRadius) {
            var vector = LIB.Vector3.Clamp(sphereCenter, minPoint, maxPoint);
            var num = LIB.Vector3.DistanceSquared(sphereCenter, vector);
            return (num <= (sphereRadius * sphereRadius));
        };
        BoundingBox.IsCompletelyInFrustum = function (boundingVectors, frustumPlanes) {
            for (var p = 0; p < 6; p++) {
                for (var i = 0; i < 8; i++) {
                    if (frustumPlanes[p].dotCoordinate(boundingVectors[i]) < 0) {
                        return false;
                    }
                }
            }
            return true;
        };
        BoundingBox.IsInFrustum = function (boundingVectors, frustumPlanes) {
            for (var p = 0; p < 6; p++) {
                var inCount = 8;
                for (var i = 0; i < 8; i++) {
                    if (frustumPlanes[p].dotCoordinate(boundingVectors[i]) < 0) {
                        --inCount;
                    }
                    else {
                        break;
                    }
                }
                if (inCount === 0)
                    return false;
            }
            return true;
        };
        return BoundingBox;
    }());
    LIB.BoundingBox = BoundingBox;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.boundingBox.js.map
//# sourceMappingURL=LIB.boundingBox.js.map
