
var LIB;
(function (LIB) {
    var BoundingSphere = /** @class */ (function () {
        /**
         * Creates a new bounding sphere
         * @param min defines the minimum vector (in local space)
         * @param max defines the maximum vector (in local space)
         */
        function BoundingSphere(min, max) {
            this._tempRadiusVector = LIB.Vector3.Zero();
            this.reConstruct(min, max);
        }
        /**
         * Recreates the entire bounding sphere from scratch
         * @param min defines the new minimum vector (in local space)
         * @param max defines the new maximum vector (in local space)
         */
        BoundingSphere.prototype.reConstruct = function (min, max) {
            this.minimum = min.clone();
            this.maximum = max.clone();
            var distance = LIB.Vector3.Distance(min, max);
            this.center = LIB.Vector3.Lerp(min, max, 0.5);
            this.radius = distance * 0.5;
            this.centerWorld = LIB.Vector3.Zero();
            this._update(LIB.Matrix.Identity());
        };
        // Methods
        BoundingSphere.prototype._update = function (world) {
            LIB.Vector3.TransformCoordinatesToRef(this.center, world, this.centerWorld);
            LIB.Vector3.TransformNormalFromFloatsToRef(1.0, 1.0, 1.0, world, this._tempRadiusVector);
            this.radiusWorld = Math.max(Math.abs(this._tempRadiusVector.x), Math.abs(this._tempRadiusVector.y), Math.abs(this._tempRadiusVector.z)) * this.radius;
        };
        BoundingSphere.prototype.isInFrustum = function (frustumPlanes) {
            for (var i = 0; i < 6; i++) {
                if (frustumPlanes[i].dotCoordinate(this.centerWorld) <= -this.radiusWorld)
                    return false;
            }
            return true;
        };
        BoundingSphere.prototype.intersectsPoint = function (point) {
            var x = this.centerWorld.x - point.x;
            var y = this.centerWorld.y - point.y;
            var z = this.centerWorld.z - point.z;
            var distance = Math.sqrt((x * x) + (y * y) + (z * z));
            if (Math.abs(this.radiusWorld - distance) < LIB.Epsilon)
                return false;
            return true;
        };
        // Statics
        BoundingSphere.Intersects = function (sphere0, sphere1) {
            var x = sphere0.centerWorld.x - sphere1.centerWorld.x;
            var y = sphere0.centerWorld.y - sphere1.centerWorld.y;
            var z = sphere0.centerWorld.z - sphere1.centerWorld.z;
            var distance = Math.sqrt((x * x) + (y * y) + (z * z));
            if (sphere0.radiusWorld + sphere1.radiusWorld < distance)
                return false;
            return true;
        };
        return BoundingSphere;
    }());
    LIB.BoundingSphere = BoundingSphere;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.boundingSphere.js.map
//# sourceMappingURL=LIB.boundingSphere.js.map
