var BABYLON;
(function (BABYLON) {
    var Debug;
    (function (Debug) {
        var BoneAxesViewer = /** @class */ (function (_super) {
            __extends(BoneAxesViewer, _super);
            function BoneAxesViewer(scene, bone, mesh, scaleLines) {
                if (scaleLines === void 0) { scaleLines = 1; }
                var _this = _super.call(this, scene, scaleLines) || this;
                _this.pos = BABYLON.Vector3.Zero();
                _this.xaxis = BABYLON.Vector3.Zero();
                _this.yaxis = BABYLON.Vector3.Zero();
                _this.zaxis = BABYLON.Vector3.Zero();
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
                bone.getDirectionToRef(BABYLON.Axis.X, this.mesh, this.xaxis);
                bone.getDirectionToRef(BABYLON.Axis.Y, this.mesh, this.yaxis);
                bone.getDirectionToRef(BABYLON.Axis.Z, this.mesh, this.zaxis);
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
    })(Debug = BABYLON.Debug || (BABYLON.Debug = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.boneAxesViewer.js.map
