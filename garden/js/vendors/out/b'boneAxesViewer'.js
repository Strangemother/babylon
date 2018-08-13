

var LIB;
(function (LIB) {
    var Debug;
    (function (Debug) {
        /**
         * The BoneAxesViewer will attach 3 axes to a specific bone of a specific mesh
         */
        var BoneAxesViewer = /** @class */ (function (_super) {
            __extends(BoneAxesViewer, _super);
            function BoneAxesViewer(scene, bone, mesh, scaleLines) {
                if (scaleLines === void 0) { scaleLines = 1; }
                var _this = _super.call(this, scene, scaleLines) || this;
                _this.pos = LIB.Vector3.Zero();
                _this.xaxis = LIB.Vector3.Zero();
                _this.yaxis = LIB.Vector3.Zero();
                _this.zaxis = LIB.Vector3.Zero();
                _this.mesh = mesh;
                _this.bone = bone;
                return _this;
            }
            BoneAxesViewer.prototype.update = function () {
                if (!this.mesh || !this.bone) {
                    return;
                }
                var bone = this.bone;
                bone.getAbsolutePositionToRef(this.mesh, this.pos);
                bone.getDirectionToRef(LIB.Axis.X, this.mesh, this.xaxis);
                bone.getDirectionToRef(LIB.Axis.Y, this.mesh, this.yaxis);
                bone.getDirectionToRef(LIB.Axis.Z, this.mesh, this.zaxis);
                _super.prototype.update.call(this, this.pos, this.xaxis, this.yaxis, this.zaxis);
            };
            BoneAxesViewer.prototype.dispose = function () {
                if (this.mesh) {
                    this.mesh = null;
                    this.bone = null;
                    _super.prototype.dispose.call(this);
                }
            };
            return BoneAxesViewer;
        }(Debug.AxesViewer));
        Debug.BoneAxesViewer = BoneAxesViewer;
    })(Debug = LIB.Debug || (LIB.Debug = {}));
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.boneAxesViewer.js.map
//# sourceMappingURL=LIB.boneAxesViewer.js.map
