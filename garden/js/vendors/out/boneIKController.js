var BABYLON;
(function (BABYLON) {
    var BoneIKController = /** @class */ (function () {
        function BoneIKController(mesh, bone, options) {
            this.targetPosition = BABYLON.Vector3.Zero();
            this.poleTargetPosition = BABYLON.Vector3.Zero();
            this.poleTargetLocalOffset = BABYLON.Vector3.Zero();
            this.poleAngle = 0;
            this.slerpAmount = 1;
            this._bone1Quat = BABYLON.Quaternion.Identity();
            this._bone1Mat = BABYLON.Matrix.Identity();
            this._bone2Ang = Math.PI;
            this._maxAngle = Math.PI;
            this._rightHandedSystem = false;
            this._bendAxis = BABYLON.Vector3.Right();
            this._slerping = false;
            this._adjustRoll = 0;
            this._bone2 = bone;
            this._bone1 = bone.getParent();
            if (!this._bone1) {
                return;
            }
            this.mesh = mesh;
            var bonePos = bone.getPosition();
            if (bone.getAbsoluteTransform().determinant() > 0) {
                this._rightHandedSystem = true;
                this._bendAxis.x = 0;
                this._bendAxis.y = 0;
                this._bendAxis.z = -1;
                if (bonePos.x > bonePos.y && bonePos.x > bonePos.z) {
                    this._adjustRoll = Math.PI * .5;
                    this._bendAxis.z = 1;
                }
            }
            if (this._bone1.length) {
                var boneScale1 = this._bone1.getScale();
                var boneScale2 = this._bone2.getScale();
                this._bone1Length = this._bone1.length * boneScale1.y * this.mesh.scaling.y;
                this._bone2Length = this._bone2.length * boneScale2.y * this.mesh.scaling.y;
            }
            else if (this._bone1.children[0]) {
                mesh.computeWorldMatrix(true);
                var pos1 = this._bone2.children[0].getAbsolutePosition(mesh);
                var pos2 = this._bone2.getAbsolutePosition(mesh);
                var pos3 = this._bone1.getAbsolutePosition(mesh);
                this._bone1Length = BABYLON.Vector3.Distance(pos1, pos2);
                this._bone2Length = BABYLON.Vector3.Distance(pos2, pos3);
            }
            this._bone1.getRotationMatrixToRef(BABYLON.Space.WORLD, mesh, this._bone1Mat);
            this.maxAngle = Math.PI;
            if (options) {
                if (options.targetMesh) {
                    this.targetMesh = options.targetMesh;
                    this.targetMesh.computeWorldMatrix(true);
                }
                if (options.poleTargetMesh) {
                    this.poleTargetMesh = options.poleTargetMesh;
                    this.poleTargetMesh.computeWorldMatrix(true);
                }
                else if (options.poleTargetBone) {
                    this.poleTargetBone = options.poleTargetBone;
                }
                else if (this._bone1.getParent()) {
                    this.poleTargetBone = this._bone1.getParent();
                }
                if (options.poleTargetLocalOffset) {
                    this.poleTargetLocalOffset.copyFrom(options.poleTargetLocalOffset);
                }
                if (options.poleAngle) {
                    this.poleAngle = options.poleAngle;
                }
                if (options.bendAxis) {
                    this._bendAxis.copyFrom(options.bendAxis);
                }
                if (options.maxAngle) {
                    this.maxAngle = options.maxAngle;
                }
                if (options.slerpAmount) {
                    this.slerpAmount = options.slerpAmount;
                }
            }
        }
        Object.defineProperty(BoneIKController.prototype, "maxAngle", {
            get: function () {
                return this._maxAngle;
            },
            set: function (value) {
                this._setMaxAngle(value);
            },
            enumerable: true,
            configurable: true
        });
        BoneIKController.prototype._setMaxAngle = function (ang) {
            if (ang < 0) {
                ang = 0;
            }
            if (ang > Math.PI || ang == undefined) {
                ang = Math.PI;
            }
            this._maxAngle = ang;
            var a = this._bone1Length;
            var b = this._bone2Length;
            this._maxReach = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(ang));
        };
        BoneIKController.prototype.update = function () {
            var bone1 = this._bone1;
            if (!bone1) {
                return;
            }
            var target = this.targetPosition;
            var poleTarget = this.poleTargetPosition;
            var mat1 = BoneIKController._tmpMats[0];
            var mat2 = BoneIKController._tmpMats[1];
            if (this.targetMesh) {
                target.copyFrom(this.targetMesh.getAbsolutePosition());
            }
            if (this.poleTargetBone) {
                this.poleTargetBone.getAbsolutePositionFromLocalToRef(this.poleTargetLocalOffset, this.mesh, poleTarget);
            }
            else if (this.poleTargetMesh) {
                BABYLON.Vector3.TransformCoordinatesToRef(this.poleTargetLocalOffset, this.poleTargetMesh.getWorldMatrix(), poleTarget);
            }
            var bonePos = BoneIKController._tmpVecs[0];
            var zaxis = BoneIKController._tmpVecs[1];
            var xaxis = BoneIKController._tmpVecs[2];
            var yaxis = BoneIKController._tmpVecs[3];
            var upAxis = BoneIKController._tmpVecs[4];
            var _tmpQuat = BoneIKController._tmpQuat;
            bone1.getAbsolutePositionToRef(this.mesh, bonePos);
            poleTarget.subtractToRef(bonePos, upAxis);
            if (upAxis.x == 0 && upAxis.y == 0 && upAxis.z == 0) {
                upAxis.y = 1;
            }
            else {
                upAxis.normalize();
            }
            target.subtractToRef(bonePos, yaxis);
            yaxis.normalize();
            BABYLON.Vector3.CrossToRef(yaxis, upAxis, zaxis);
            zaxis.normalize();
            BABYLON.Vector3.CrossToRef(yaxis, zaxis, xaxis);
            xaxis.normalize();
            BABYLON.Matrix.FromXYZAxesToRef(xaxis, yaxis, zaxis, mat1);
            var a = this._bone1Length;
            var b = this._bone2Length;
            var c = BABYLON.Vector3.Distance(bonePos, target);
            if (this._maxReach > 0) {
                c = Math.min(this._maxReach, c);
            }
            var acosa = (b * b + c * c - a * a) / (2 * b * c);
            var acosb = (c * c + a * a - b * b) / (2 * c * a);
            if (acosa > 1) {
                acosa = 1;
            }
            if (acosb > 1) {
                acosb = 1;
            }
            if (acosa < -1) {
                acosa = -1;
            }
            if (acosb < -1) {
                acosb = -1;
            }
            var angA = Math.acos(acosa);
            var angB = Math.acos(acosb);
            var angC = -angA - angB;
            if (this._rightHandedSystem) {
                BABYLON.Matrix.RotationYawPitchRollToRef(0, 0, this._adjustRoll, mat2);
                mat2.multiplyToRef(mat1, mat1);
                BABYLON.Matrix.RotationAxisToRef(this._bendAxis, angB, mat2);
                mat2.multiplyToRef(mat1, mat1);
            }
            else {
                var _tmpVec = BoneIKController._tmpVecs[5];
                _tmpVec.copyFrom(this._bendAxis);
                _tmpVec.x *= -1;
                BABYLON.Matrix.RotationAxisToRef(_tmpVec, -angB, mat2);
                mat2.multiplyToRef(mat1, mat1);
            }
            if (this.poleAngle) {
                BABYLON.Matrix.RotationAxisToRef(yaxis, this.poleAngle, mat2);
                mat1.multiplyToRef(mat2, mat1);
            }
            if (this._bone1) {
                if (this.slerpAmount < 1) {
                    if (!this._slerping) {
                        BABYLON.Quaternion.FromRotationMatrixToRef(this._bone1Mat, this._bone1Quat);
                    }
                    BABYLON.Quaternion.FromRotationMatrixToRef(mat1, _tmpQuat);
                    BABYLON.Quaternion.SlerpToRef(this._bone1Quat, _tmpQuat, this.slerpAmount, this._bone1Quat);
                    angC = this._bone2Ang * (1.0 - this.slerpAmount) + angC * this.slerpAmount;
                    this._bone1.setRotationQuaternion(this._bone1Quat, BABYLON.Space.WORLD, this.mesh);
                    this._slerping = true;
                }
                else {
                    this._bone1.setRotationMatrix(mat1, BABYLON.Space.WORLD, this.mesh);
                    this._bone1Mat.copyFrom(mat1);
                    this._slerping = false;
                }
            }
            this._bone2.setAxisAngle(this._bendAxis, angC, BABYLON.Space.LOCAL);
            this._bone2Ang = angC;
        };
        BoneIKController._tmpVecs = [BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero()];
        BoneIKController._tmpQuat = BABYLON.Quaternion.Identity();
        BoneIKController._tmpMats = [BABYLON.Matrix.Identity(), BABYLON.Matrix.Identity()];
        return BoneIKController;
    }());
    BABYLON.BoneIKController = BoneIKController;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.boneIKController.js.map
