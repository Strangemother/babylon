(function (LIB) {
    var RayHelper = /** @class */ (function () {
        function RayHelper(ray) {
            this.ray = ray;
        }
        RayHelper.CreateAndShow = function (ray, scene, color) {
            var helper = new RayHelper(ray);
            helper.show(scene, color);
            return helper;
        };
        RayHelper.prototype.show = function (scene, color) {
            if (!this._renderFunction && this.ray) {
                var ray = this.ray;
                this._renderFunction = this._render.bind(this);
                this._scene = scene;
                this._renderPoints = [ray.origin, ray.origin.add(ray.direction.scale(ray.length))];
                this._renderLine = LIB.Mesh.CreateLines("ray", this._renderPoints, scene, true);
                if (this._renderFunction) {
                    this._scene.registerBeforeRender(this._renderFunction);
                }
            }
            if (color && this._renderLine) {
                this._renderLine.color.copyFrom(color);
            }
        };
        RayHelper.prototype.hide = function () {
            if (this._renderFunction && this._scene) {
                this._scene.unregisterBeforeRender(this._renderFunction);
                this._scene = null;
                this._renderFunction = null;
                if (this._renderLine) {
                    this._renderLine.dispose();
                    this._renderLine = null;
                }
                this._renderPoints = [];
            }
        };
        RayHelper.prototype._render = function () {
            var ray = this.ray;
            if (!ray) {
                return;
            }
            var point = this._renderPoints[1];
            var len = Math.min(ray.length, 1000000);
            point.copyFrom(ray.direction);
            point.scaleInPlace(len);
            point.addInPlace(ray.origin);
            LIB.Mesh.CreateLines("ray", this._renderPoints, this._scene, true, this._renderLine);
        };
        RayHelper.prototype.attachToMesh = function (mesh, meshSpaceDirection, meshSpaceOrigin, length) {
            this._attachedToMesh = mesh;
            var ray = this.ray;
            if (!ray) {
                return;
            }
            if (!ray.direction) {
                ray.direction = LIB.Vector3.Zero();
            }
            if (!ray.origin) {
                ray.origin = LIB.Vector3.Zero();
            }
            if (length) {
                ray.length = length;
            }
            if (!meshSpaceOrigin) {
                meshSpaceOrigin = LIB.Vector3.Zero();
            }
            if (!meshSpaceDirection) {
                // -1 so that this will work with Mesh.lookAt
                meshSpaceDirection = new LIB.Vector3(0, 0, -1);
            }
            if (!this._meshSpaceDirection) {
                this._meshSpaceDirection = meshSpaceDirection.clone();
                this._meshSpaceOrigin = meshSpaceOrigin.clone();
            }
            else {
                this._meshSpaceDirection.copyFrom(meshSpaceDirection);
                this._meshSpaceOrigin.copyFrom(meshSpaceOrigin);
            }
            if (!this._updateToMeshFunction) {
                this._updateToMeshFunction = this._updateToMesh.bind(this);
                this._attachedToMesh.getScene().registerBeforeRender(this._updateToMeshFunction);
            }
            this._updateToMesh();
        };
        RayHelper.prototype.detachFromMesh = function () {
            if (this._attachedToMesh) {
                if (this._updateToMeshFunction) {
                    this._attachedToMesh.getScene().unregisterBeforeRender(this._updateToMeshFunction);
                }
                this._attachedToMesh = null;
                this._updateToMeshFunction = null;
            }
        };
        RayHelper.prototype._updateToMesh = function () {
            var ray = this.ray;
            if (!this._attachedToMesh || !ray) {
                return;
            }
            if (this._attachedToMesh._isDisposed) {
                this.detachFromMesh();
                return;
            }
            this._attachedToMesh.getDirectionToRef(this._meshSpaceDirection, ray.direction);
            LIB.Vector3.TransformCoordinatesToRef(this._meshSpaceOrigin, this._attachedToMesh.getWorldMatrix(), ray.origin);
        };
        RayHelper.prototype.dispose = function () {
            this.hide();
            this.detachFromMesh();
            this.ray = null;
        };
        return RayHelper;
    }());
    LIB.RayHelper = RayHelper;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.rayHelper.js.map
