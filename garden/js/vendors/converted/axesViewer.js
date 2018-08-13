
/**
 * Module Debug contains the (visual) components to debug a scene correctly
 */
var LIB;
(function (LIB) {
    var Debug;
    (function (Debug) {
        /**
         * The Axes viewer will show 3 axes in a specific point in space
         */
        var AxesViewer = /** @class */ (function () {
            function AxesViewer(scene, scaleLines) {
                if (scaleLines === void 0) { scaleLines = 1; }
                this._xline = [LIB.Vector3.Zero(), LIB.Vector3.Zero()];
                this._yline = [LIB.Vector3.Zero(), LIB.Vector3.Zero()];
                this._zline = [LIB.Vector3.Zero(), LIB.Vector3.Zero()];
                this.scaleLines = 1;
                this.scaleLines = scaleLines;
                this._xmesh = LIB.Mesh.CreateLines("xline", this._xline, scene, true);
                this._ymesh = LIB.Mesh.CreateLines("yline", this._yline, scene, true);
                this._zmesh = LIB.Mesh.CreateLines("zline", this._zline, scene, true);
                this._xmesh.renderingGroupId = 2;
                this._ymesh.renderingGroupId = 2;
                this._zmesh.renderingGroupId = 2;
                this._xmesh.material.checkReadyOnlyOnce = true;
                this._xmesh.color = new LIB.Color3(1, 0, 0);
                this._ymesh.material.checkReadyOnlyOnce = true;
                this._ymesh.color = new LIB.Color3(0, 1, 0);
                this._zmesh.material.checkReadyOnlyOnce = true;
                this._zmesh.color = new LIB.Color3(0, 0, 1);
                this.scene = scene;
            }
            AxesViewer.prototype.update = function (position, xaxis, yaxis, zaxis) {
                var scaleLines = this.scaleLines;
                if (this._xmesh) {
                    this._xmesh.position.copyFrom(position);
                }
                if (this._ymesh) {
                    this._ymesh.position.copyFrom(position);
                }
                if (this._zmesh) {
                    this._zmesh.position.copyFrom(position);
                }
                var point2 = this._xline[1];
                point2.x = xaxis.x * scaleLines;
                point2.y = xaxis.y * scaleLines;
                point2.z = xaxis.z * scaleLines;
                LIB.Mesh.CreateLines("", this._xline, null, false, this._xmesh);
                point2 = this._yline[1];
                point2.x = yaxis.x * scaleLines;
                point2.y = yaxis.y * scaleLines;
                point2.z = yaxis.z * scaleLines;
                LIB.Mesh.CreateLines("", this._yline, null, false, this._ymesh);
                point2 = this._zline[1];
                point2.x = zaxis.x * scaleLines;
                point2.y = zaxis.y * scaleLines;
                point2.z = zaxis.z * scaleLines;
                LIB.Mesh.CreateLines("", this._zline, null, false, this._zmesh);
            };
            AxesViewer.prototype.dispose = function () {
                if (this._xmesh) {
                    this._xmesh.dispose();
                }
                if (this._ymesh) {
                    this._ymesh.dispose();
                }
                if (this._zmesh) {
                    this._zmesh.dispose();
                }
                this._xmesh = null;
                this._ymesh = null;
                this._zmesh = null;
                this.scene = null;
            };
            return AxesViewer;
        }());
        Debug.AxesViewer = AxesViewer;
    })(Debug = LIB.Debug || (LIB.Debug = {}));
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.axesViewer.js.map
//# sourceMappingURL=LIB.axesViewer.js.map
