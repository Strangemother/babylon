var BABYLON;
(function (BABYLON) {
    var TransformNode = /** @class */ (function (_super) {
        __extends(TransformNode, _super);
        function TransformNode(name, scene, isPure) {
            if (scene === void 0) { scene = null; }
            if (isPure === void 0) { isPure = true; }
            var _this = _super.call(this, name, scene) || this;
            // Properties
            _this._rotation = BABYLON.Vector3.Zero();
            _this._scaling = BABYLON.Vector3.One();
            _this._isDirty = false;
            _this.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_NONE;
            _this.scalingDeterminant = 1;
            _this.infiniteDistance = false;
            _this.position = BABYLON.Vector3.Zero();
            _this._localWorld = BABYLON.Matrix.Zero();
            _this._worldMatrix = BABYLON.Matrix.Zero();
            _this._worldMatrixDeterminant = 0;
            _this._absolutePosition = BABYLON.Vector3.Zero();
            _this._pivotMatrix = BABYLON.Matrix.Identity();
            _this._postMultiplyPivotMatrix = false;
            _this._isWorldMatrixFrozen = false;
            /**
            * An event triggered after the world matrix is updated
            * @type {BABYLON.Observable}
            */
            _this.onAfterWorldMatrixUpdateObservable = new BABYLON.Observable();
            _this._nonUniformScaling = false;
            if (isPure) {
                _this.getScene().addTransformNode(_this);
            }
            return _this;
        }
        Object.defineProperty(TransformNode.prototype, "rotation", {
            /**
              * Rotation property : a Vector3 depicting the rotation value in radians around each local axis X, Y, Z.
              * If rotation quaternion is set, this Vector3 will (almost always) be the Zero vector!
              * Default : (0.0, 0.0, 0.0)
              */
            get: function () {
                return this._rotation;
            },
            set: function (newRotation) {
                this._rotation = newRotation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransformNode.prototype, "scaling", {
            /**
             * Scaling property : a Vector3 depicting the mesh scaling along each local axis X, Y, Z.
             * Default : (1.0, 1.0, 1.0)
             */
            get: function () {
                return this._scaling;
            },
            /**
             * Scaling property : a Vector3 depicting the mesh scaling along each local axis X, Y, Z.
             * Default : (1.0, 1.0, 1.0)
            */
            set: function (newScaling) {
                this._scaling = newScaling;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransformNode.prototype, "rotationQuaternion", {
            /**
             * Rotation Quaternion property : this a Quaternion object depicting the mesh rotation by using a unit quaternion.
             * It's null by default.
             * If set, only the rotationQuaternion is then used to compute the mesh rotation and its property `.rotation\ is then ignored and set to (0.0, 0.0, 0.0)
             */
            get: function () {
                return this._rotationQuaternion;
            },
            set: function (quaternion) {
                this._rotationQuaternion = quaternion;
                //reset the rotation vector.
                if (quaternion && this.rotation.length()) {
                    this.rotation.copyFromFloats(0.0, 0.0, 0.0);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the latest update of the World matrix
         * Returns a Matrix.
         */
        TransformNode.prototype.getWorldMatrix = function () {
            if (this._currentRenderId !== this.getScene().getRenderId()) {
                this.computeWorldMatrix();
            }
            return this._worldMatrix;
        };
        /**
         * Returns the latest update of the World matrix determinant.
         */
        TransformNode.prototype._getWorldMatrixDeterminant = function () {
            if (this._currentRenderId !== this.getScene().getRenderId()) {
                this._worldMatrixDeterminant = this.computeWorldMatrix().determinant();
            }
            return this._worldMatrixDeterminant;
        };
        Object.defineProperty(TransformNode.prototype, "worldMatrixFromCache", {
            /**
             * Returns directly the latest state of the mesh World matrix.
             * A Matrix is returned.
             */
            get: function () {
                return this._worldMatrix;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Copies the paramater passed Matrix into the mesh Pose matrix.
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.updatePoseMatrix = function (matrix) {
            this._poseMatrix.copyFrom(matrix);
            return this;
        };
        /**
         * Returns the mesh Pose matrix.
         * Returned object : Matrix
         */
        TransformNode.prototype.getPoseMatrix = function () {
            return this._poseMatrix;
        };
        TransformNode.prototype._isSynchronized = function () {
            if (this._isDirty) {
                return false;
            }
            if (this.billboardMode !== this._cache.billboardMode || this.billboardMode !== BABYLON.AbstractMesh.BILLBOARDMODE_NONE)
                return false;
            if (this._cache.pivotMatrixUpdated) {
                return false;
            }
            if (this.infiniteDistance) {
                return false;
            }
            if (!this._cache.position.equals(this.position))
                return false;
            if (this.rotationQuaternion) {
                if (!this._cache.rotationQuaternion.equals(this.rotationQuaternion))
                    return false;
            }
            if (!this._cache.rotation.equals(this.rotation))
                return false;
            if (!this._cache.scaling.equals(this.scaling))
                return false;
            return true;
        };
        TransformNode.prototype._initCache = function () {
            _super.prototype._initCache.call(this);
            this._cache.localMatrixUpdated = false;
            this._cache.position = BABYLON.Vector3.Zero();
            this._cache.scaling = BABYLON.Vector3.Zero();
            this._cache.rotation = BABYLON.Vector3.Zero();
            this._cache.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 0);
            this._cache.billboardMode = -1;
        };
        TransformNode.prototype.markAsDirty = function (property) {
            if (property === "rotation") {
                this.rotationQuaternion = null;
            }
            this._currentRenderId = Number.MAX_VALUE;
            this._isDirty = true;
            return this;
        };
        Object.defineProperty(TransformNode.prototype, "absolutePosition", {
            /**
             * Returns the current mesh absolute position.
             * Retuns a Vector3.
             */
            get: function () {
                return this._absolutePosition;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Sets a new pivot matrix to the mesh.
         * Returns the AbstractMesh.
        */
        TransformNode.prototype.setPivotMatrix = function (matrix, postMultiplyPivotMatrix) {
            if (postMultiplyPivotMatrix === void 0) { postMultiplyPivotMatrix = false; }
            this._pivotMatrix = matrix.clone();
            this._cache.pivotMatrixUpdated = true;
            this._postMultiplyPivotMatrix = postMultiplyPivotMatrix;
            if (this._postMultiplyPivotMatrix) {
                this._pivotMatrixInverse = BABYLON.Matrix.Invert(matrix);
            }
            return this;
        };
        /**
         * Returns the mesh pivot matrix.
         * Default : Identity.
         * A Matrix is returned.
         */
        TransformNode.prototype.getPivotMatrix = function () {
            return this._pivotMatrix;
        };
        /**
         * Prevents the World matrix to be computed any longer.
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.freezeWorldMatrix = function () {
            this._isWorldMatrixFrozen = false; // no guarantee world is not already frozen, switch off temporarily
            this.computeWorldMatrix(true);
            this._isWorldMatrixFrozen = true;
            return this;
        };
        /**
         * Allows back the World matrix computation.
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.unfreezeWorldMatrix = function () {
            this._isWorldMatrixFrozen = false;
            this.computeWorldMatrix(true);
            return this;
        };
        Object.defineProperty(TransformNode.prototype, "isWorldMatrixFrozen", {
            /**
             * True if the World matrix has been frozen.
             * Returns a boolean.
             */
            get: function () {
                return this._isWorldMatrixFrozen;
            },
            enumerable: true,
            configurable: true
        });
        /**
            * Retuns the mesh absolute position in the World.
            * Returns a Vector3.
            */
        TransformNode.prototype.getAbsolutePosition = function () {
            this.computeWorldMatrix();
            return this._absolutePosition;
        };
        /**
         * Sets the mesh absolute position in the World from a Vector3 or an Array(3).
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.setAbsolutePosition = function (absolutePosition) {
            if (!absolutePosition) {
                return this;
            }
            var absolutePositionX;
            var absolutePositionY;
            var absolutePositionZ;
            if (absolutePosition.x === undefined) {
                if (arguments.length < 3) {
                    return this;
                }
                absolutePositionX = arguments[0];
                absolutePositionY = arguments[1];
                absolutePositionZ = arguments[2];
            }
            else {
                absolutePositionX = absolutePosition.x;
                absolutePositionY = absolutePosition.y;
                absolutePositionZ = absolutePosition.z;
            }
            if (this.parent) {
                var invertParentWorldMatrix = this.parent.getWorldMatrix().clone();
                invertParentWorldMatrix.invert();
                var worldPosition = new BABYLON.Vector3(absolutePositionX, absolutePositionY, absolutePositionZ);
                this.position = BABYLON.Vector3.TransformCoordinates(worldPosition, invertParentWorldMatrix);
            }
            else {
                this.position.x = absolutePositionX;
                this.position.y = absolutePositionY;
                this.position.z = absolutePositionZ;
            }
            return this;
        };
        /**
           * Sets the mesh position in its local space.
           * Returns the AbstractMesh.
           */
        TransformNode.prototype.setPositionWithLocalVector = function (vector3) {
            this.computeWorldMatrix();
            this.position = BABYLON.Vector3.TransformNormal(vector3, this._localWorld);
            return this;
        };
        /**
         * Returns the mesh position in the local space from the current World matrix values.
         * Returns a new Vector3.
         */
        TransformNode.prototype.getPositionExpressedInLocalSpace = function () {
            this.computeWorldMatrix();
            var invLocalWorldMatrix = this._localWorld.clone();
            invLocalWorldMatrix.invert();
            return BABYLON.Vector3.TransformNormal(this.position, invLocalWorldMatrix);
        };
        /**
         * Translates the mesh along the passed Vector3 in its local space.
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.locallyTranslate = function (vector3) {
            this.computeWorldMatrix(true);
            this.position = BABYLON.Vector3.TransformCoordinates(vector3, this._localWorld);
            return this;
        };
        /**
         * Orients a mesh towards a target point. Mesh must be drawn facing user.
         * @param targetPoint the position (must be in same space as current mesh) to look at
         * @param yawCor optional yaw (y-axis) correction in radians
         * @param pitchCor optional pitch (x-axis) correction in radians
         * @param rollCor optional roll (z-axis) correction in radians
         * @param space the choosen space of the target
         * @returns the TransformNode.
         */
        TransformNode.prototype.lookAt = function (targetPoint, yawCor, pitchCor, rollCor, space) {
            if (yawCor === void 0) { yawCor = 0; }
            if (pitchCor === void 0) { pitchCor = 0; }
            if (rollCor === void 0) { rollCor = 0; }
            if (space === void 0) { space = BABYLON.Space.LOCAL; }
            var dv = BABYLON.AbstractMesh._lookAtVectorCache;
            var pos = space === BABYLON.Space.LOCAL ? this.position : this.getAbsolutePosition();
            targetPoint.subtractToRef(pos, dv);
            var yaw = -Math.atan2(dv.z, dv.x) - Math.PI / 2;
            var len = Math.sqrt(dv.x * dv.x + dv.z * dv.z);
            var pitch = Math.atan2(dv.y, len);
            if (this.rotationQuaternion) {
                BABYLON.Quaternion.RotationYawPitchRollToRef(yaw + yawCor, pitch + pitchCor, rollCor, this.rotationQuaternion);
            }
            else {
                this.rotation.x = pitch + pitchCor;
                this.rotation.y = yaw + yawCor;
                this.rotation.z = rollCor;
            }
            return this;
        };
        /**
          * Returns a new Vector3 what is the localAxis, expressed in the mesh local space, rotated like the mesh.
          * This Vector3 is expressed in the World space.
          */
        TransformNode.prototype.getDirection = function (localAxis) {
            var result = BABYLON.Vector3.Zero();
            this.getDirectionToRef(localAxis, result);
            return result;
        };
        /**
         * Sets the Vector3 "result" as the rotated Vector3 "localAxis" in the same rotation than the mesh.
         * localAxis is expressed in the mesh local space.
         * result is computed in the Wordl space from the mesh World matrix.
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.getDirectionToRef = function (localAxis, result) {
            BABYLON.Vector3.TransformNormalToRef(localAxis, this.getWorldMatrix(), result);
            return this;
        };
        TransformNode.prototype.setPivotPoint = function (point, space) {
            if (space === void 0) { space = BABYLON.Space.LOCAL; }
            if (this.getScene().getRenderId() == 0) {
                this.computeWorldMatrix(true);
            }
            var wm = this.getWorldMatrix();
            if (space == BABYLON.Space.WORLD) {
                var tmat = BABYLON.Tmp.Matrix[0];
                wm.invertToRef(tmat);
                point = BABYLON.Vector3.TransformCoordinates(point, tmat);
            }
            BABYLON.Vector3.TransformCoordinatesToRef(point, wm, this.position);
            this._pivotMatrix.m[12] = -point.x;
            this._pivotMatrix.m[13] = -point.y;
            this._pivotMatrix.m[14] = -point.z;
            this._cache.pivotMatrixUpdated = true;
            return this;
        };
        /**
         * Returns a new Vector3 set with the mesh pivot point coordinates in the local space.
         */
        TransformNode.prototype.getPivotPoint = function () {
            var point = BABYLON.Vector3.Zero();
            this.getPivotPointToRef(point);
            return point;
        };
        /**
         * Sets the passed Vector3 "result" with the coordinates of the mesh pivot point in the local space.
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.getPivotPointToRef = function (result) {
            result.x = -this._pivotMatrix.m[12];
            result.y = -this._pivotMatrix.m[13];
            result.z = -this._pivotMatrix.m[14];
            return this;
        };
        /**
         * Returns a new Vector3 set with the mesh pivot point World coordinates.
         */
        TransformNode.prototype.getAbsolutePivotPoint = function () {
            var point = BABYLON.Vector3.Zero();
            this.getAbsolutePivotPointToRef(point);
            return point;
        };
        /**
         * Sets the Vector3 "result" coordinates with the mesh pivot point World coordinates.
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.getAbsolutePivotPointToRef = function (result) {
            result.x = this._pivotMatrix.m[12];
            result.y = this._pivotMatrix.m[13];
            result.z = this._pivotMatrix.m[14];
            this.getPivotPointToRef(result);
            BABYLON.Vector3.TransformCoordinatesToRef(result, this.getWorldMatrix(), result);
            return this;
        };
        /**
         * Defines the passed node as the parent of the current node.
         * The node will remain exactly where it is and its position / rotation will be updated accordingly
         * Returns the TransformNode.
         */
        TransformNode.prototype.setParent = function (node) {
            if (node == null) {
                var rotation = BABYLON.Tmp.Quaternion[0];
                var position = BABYLON.Tmp.Vector3[0];
                var scale = BABYLON.Tmp.Vector3[1];
                if (this.parent && this.parent.computeWorldMatrix) {
                    this.parent.computeWorldMatrix(true);
                }
                this.computeWorldMatrix(true);
                this.getWorldMatrix().decompose(scale, rotation, position);
                if (this.rotationQuaternion) {
                    this.rotationQuaternion.copyFrom(rotation);
                }
                else {
                    rotation.toEulerAnglesToRef(this.rotation);
                }
                this.scaling.x = scale.x;
                this.scaling.y = scale.y;
                this.scaling.z = scale.z;
                this.position.x = position.x;
                this.position.y = position.y;
                this.position.z = position.z;
            }
            else {
                var rotation = BABYLON.Tmp.Quaternion[0];
                var position = BABYLON.Tmp.Vector3[0];
                var scale = BABYLON.Tmp.Vector3[1];
                var diffMatrix = BABYLON.Tmp.Matrix[0];
                var invParentMatrix = BABYLON.Tmp.Matrix[1];
                this.computeWorldMatrix(true);
                node.computeWorldMatrix(true);
                node.getWorldMatrix().invertToRef(invParentMatrix);
                this.getWorldMatrix().multiplyToRef(invParentMatrix, diffMatrix);
                diffMatrix.decompose(scale, rotation, position);
                if (this.rotationQuaternion) {
                    this.rotationQuaternion.copyFrom(rotation);
                }
                else {
                    rotation.toEulerAnglesToRef(this.rotation);
                }
                this.position.x = position.x;
                this.position.y = position.y;
                this.position.z = position.z;
                this.scaling.x = scale.x;
                this.scaling.y = scale.y;
                this.scaling.z = scale.z;
            }
            this.parent = node;
            return this;
        };
        Object.defineProperty(TransformNode.prototype, "nonUniformScaling", {
            get: function () {
                return this._nonUniformScaling;
            },
            enumerable: true,
            configurable: true
        });
        TransformNode.prototype._updateNonUniformScalingState = function (value) {
            if (this._nonUniformScaling === value) {
                return false;
            }
            this._nonUniformScaling = true;
            return true;
        };
        /**
         * Attach the current TransformNode to another TransformNode associated with a bone
         * @param bone Bone affecting the TransformNode
         * @param affectedTransformNode TransformNode associated with the bone
         */
        TransformNode.prototype.attachToBone = function (bone, affectedTransformNode) {
            this._transformToBoneReferal = affectedTransformNode;
            this.parent = bone;
            if (bone.getWorldMatrix().determinant() < 0) {
                this.scalingDeterminant *= -1;
            }
            return this;
        };
        TransformNode.prototype.detachFromBone = function () {
            if (!this.parent) {
                return this;
            }
            if (this.parent.getWorldMatrix().determinant() < 0) {
                this.scalingDeterminant *= -1;
            }
            this._transformToBoneReferal = null;
            this.parent = null;
            return this;
        };
        /**
         * Rotates the mesh around the axis vector for the passed angle (amount) expressed in radians, in the given space.
         * space (default LOCAL) can be either BABYLON.Space.LOCAL, either BABYLON.Space.WORLD.
         * Note that the property `rotationQuaternion` is then automatically updated and the property `rotation` is set to (0,0,0) and no longer used.
         * The passed axis is also normalized.
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.rotate = function (axis, amount, space) {
            axis.normalize();
            if (!this.rotationQuaternion) {
                this.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
                this.rotation = BABYLON.Vector3.Zero();
            }
            var rotationQuaternion;
            if (!space || space === BABYLON.Space.LOCAL) {
                rotationQuaternion = BABYLON.Quaternion.RotationAxisToRef(axis, amount, BABYLON.AbstractMesh._rotationAxisCache);
                this.rotationQuaternion.multiplyToRef(rotationQuaternion, this.rotationQuaternion);
            }
            else {
                if (this.parent) {
                    var invertParentWorldMatrix = this.parent.getWorldMatrix().clone();
                    invertParentWorldMatrix.invert();
                    axis = BABYLON.Vector3.TransformNormal(axis, invertParentWorldMatrix);
                }
                rotationQuaternion = BABYLON.Quaternion.RotationAxisToRef(axis, amount, BABYLON.AbstractMesh._rotationAxisCache);
                rotationQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
            }
            return this;
        };
        /**
         * Rotates the mesh around the axis vector for the passed angle (amount) expressed in radians, in world space.
         * Note that the property `rotationQuaternion` is then automatically updated and the property `rotation` is set to (0,0,0) and no longer used.
         * The passed axis is also normalized.
         * Returns the AbstractMesh.
         * Method is based on http://www.euclideanspace.com/maths/geometry/affine/aroundPoint/index.htm
         */
        TransformNode.prototype.rotateAround = function (point, axis, amount) {
            axis.normalize();
            if (!this.rotationQuaternion) {
                this.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
                this.rotation.copyFromFloats(0, 0, 0);
            }
            point.subtractToRef(this.position, BABYLON.Tmp.Vector3[0]);
            BABYLON.Matrix.TranslationToRef(BABYLON.Tmp.Vector3[0].x, BABYLON.Tmp.Vector3[0].y, BABYLON.Tmp.Vector3[0].z, BABYLON.Tmp.Matrix[0]);
            BABYLON.Tmp.Matrix[0].invertToRef(BABYLON.Tmp.Matrix[2]);
            BABYLON.Matrix.RotationAxisToRef(axis, amount, BABYLON.Tmp.Matrix[1]);
            BABYLON.Tmp.Matrix[2].multiplyToRef(BABYLON.Tmp.Matrix[1], BABYLON.Tmp.Matrix[2]);
            BABYLON.Tmp.Matrix[2].multiplyToRef(BABYLON.Tmp.Matrix[0], BABYLON.Tmp.Matrix[2]);
            BABYLON.Tmp.Matrix[2].decompose(BABYLON.Tmp.Vector3[0], BABYLON.Tmp.Quaternion[0], BABYLON.Tmp.Vector3[1]);
            this.position.addInPlace(BABYLON.Tmp.Vector3[1]);
            BABYLON.Tmp.Quaternion[0].multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
            return this;
        };
        /**
         * Translates the mesh along the axis vector for the passed distance in the given space.
         * space (default LOCAL) can be either BABYLON.Space.LOCAL, either BABYLON.Space.WORLD.
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.translate = function (axis, distance, space) {
            var displacementVector = axis.scale(distance);
            if (!space || space === BABYLON.Space.LOCAL) {
                var tempV3 = this.getPositionExpressedInLocalSpace().add(displacementVector);
                this.setPositionWithLocalVector(tempV3);
            }
            else {
                this.setAbsolutePosition(this.getAbsolutePosition().add(displacementVector));
            }
            return this;
        };
        /**
         * Adds a rotation step to the mesh current rotation.
         * x, y, z are Euler angles expressed in radians.
         * This methods updates the current mesh rotation, either mesh.rotation, either mesh.rotationQuaternion if it's set.
         * This means this rotation is made in the mesh local space only.
         * It's useful to set a custom rotation order different from the BJS standard one YXZ.
         * Example : this rotates the mesh first around its local X axis, then around its local Z axis, finally around its local Y axis.
         * ```javascript
         * mesh.addRotation(x1, 0, 0).addRotation(0, 0, z2).addRotation(0, 0, y3);
         * ```
         * Note that `addRotation()` accumulates the passed rotation values to the current ones and computes the .rotation or .rotationQuaternion updated values.
         * Under the hood, only quaternions are used. So it's a little faster is you use .rotationQuaternion because it doesn't need to translate them back to Euler angles.
         * Returns the AbstractMesh.
         */
        TransformNode.prototype.addRotation = function (x, y, z) {
            var rotationQuaternion;
            if (this.rotationQuaternion) {
                rotationQuaternion = this.rotationQuaternion;
            }
            else {
                rotationQuaternion = BABYLON.Tmp.Quaternion[1];
                BABYLON.Quaternion.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, rotationQuaternion);
            }
            var accumulation = BABYLON.Tmp.Quaternion[0];
            BABYLON.Quaternion.RotationYawPitchRollToRef(y, x, z, accumulation);
            rotationQuaternion.multiplyInPlace(accumulation);
            if (!this.rotationQuaternion) {
                rotationQuaternion.toEulerAnglesToRef(this.rotation);
            }
            return this;
        };
        /**
         * Computes the mesh World matrix and returns it.
         * If the mesh world matrix is frozen, this computation does nothing more than returning the last frozen values.
         * If the parameter `force` is let to `false` (default), the current cached World matrix is returned.
         * If the parameter `force`is set to `true`, the actual computation is done.
         * Returns the mesh World Matrix.
         */
        TransformNode.prototype.computeWorldMatrix = function (force) {
            if (this._isWorldMatrixFrozen) {
                return this._worldMatrix;
            }
            if (!force && this.isSynchronized(true)) {
                return this._worldMatrix;
            }
            this._cache.position.copyFrom(this.position);
            this._cache.scaling.copyFrom(this.scaling);
            this._cache.pivotMatrixUpdated = false;
            this._cache.billboardMode = this.billboardMode;
            this._currentRenderId = this.getScene().getRenderId();
            this._isDirty = false;
            // Scaling
            BABYLON.Matrix.ScalingToRef(this.scaling.x * this.scalingDeterminant, this.scaling.y * this.scalingDeterminant, this.scaling.z * this.scalingDeterminant, BABYLON.Tmp.Matrix[1]);
            // Rotation
            //rotate, if quaternion is set and rotation was used
            if (this.rotationQuaternion) {
                var len = this.rotation.length();
                if (len) {
                    this.rotationQuaternion.multiplyInPlace(BABYLON.Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z));
                    this.rotation.copyFromFloats(0, 0, 0);
                }
            }
            if (this.rotationQuaternion) {
                this.rotationQuaternion.toRotationMatrix(BABYLON.Tmp.Matrix[0]);
                this._cache.rotationQuaternion.copyFrom(this.rotationQuaternion);
            }
            else {
                BABYLON.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, BABYLON.Tmp.Matrix[0]);
                this._cache.rotation.copyFrom(this.rotation);
            }
            // Translation
            var camera = this.getScene().activeCamera;
            if (this.infiniteDistance && !this.parent && camera) {
                var cameraWorldMatrix = camera.getWorldMatrix();
                var cameraGlobalPosition = new BABYLON.Vector3(cameraWorldMatrix.m[12], cameraWorldMatrix.m[13], cameraWorldMatrix.m[14]);
                BABYLON.Matrix.TranslationToRef(this.position.x + cameraGlobalPosition.x, this.position.y + cameraGlobalPosition.y, this.position.z + cameraGlobalPosition.z, BABYLON.Tmp.Matrix[2]);
            }
            else {
                BABYLON.Matrix.TranslationToRef(this.position.x, this.position.y, this.position.z, BABYLON.Tmp.Matrix[2]);
            }
            // Composing transformations
            this._pivotMatrix.multiplyToRef(BABYLON.Tmp.Matrix[1], BABYLON.Tmp.Matrix[4]);
            BABYLON.Tmp.Matrix[4].multiplyToRef(BABYLON.Tmp.Matrix[0], BABYLON.Tmp.Matrix[5]);
            // Billboarding (testing PG:http://www.babylonjs-playground.com/#UJEIL#13)
            if (this.billboardMode !== BABYLON.AbstractMesh.BILLBOARDMODE_NONE && camera) {
                if ((this.billboardMode & BABYLON.AbstractMesh.BILLBOARDMODE_ALL) !== BABYLON.AbstractMesh.BILLBOARDMODE_ALL) {
                    // Need to decompose each rotation here
                    var currentPosition = BABYLON.Tmp.Vector3[3];
                    if (this.parent && this.parent.getWorldMatrix) {
                        if (this._transformToBoneReferal) {
                            this.parent.getWorldMatrix().multiplyToRef(this._transformToBoneReferal.getWorldMatrix(), BABYLON.Tmp.Matrix[6]);
                            BABYLON.Vector3.TransformCoordinatesToRef(this.position, BABYLON.Tmp.Matrix[6], currentPosition);
                        }
                        else {
                            BABYLON.Vector3.TransformCoordinatesToRef(this.position, this.parent.getWorldMatrix(), currentPosition);
                        }
                    }
                    else {
                        currentPosition.copyFrom(this.position);
                    }
                    currentPosition.subtractInPlace(camera.globalPosition);
                    var finalEuler = BABYLON.Tmp.Vector3[4].copyFromFloats(0, 0, 0);
                    if ((this.billboardMode & BABYLON.AbstractMesh.BILLBOARDMODE_X) === BABYLON.AbstractMesh.BILLBOARDMODE_X) {
                        finalEuler.x = Math.atan2(-currentPosition.y, currentPosition.z);
                    }
                    if ((this.billboardMode & BABYLON.AbstractMesh.BILLBOARDMODE_Y) === BABYLON.AbstractMesh.BILLBOARDMODE_Y) {
                        finalEuler.y = Math.atan2(currentPosition.x, currentPosition.z);
                    }
                    if ((this.billboardMode & BABYLON.AbstractMesh.BILLBOARDMODE_Z) === BABYLON.AbstractMesh.BILLBOARDMODE_Z) {
                        finalEuler.z = Math.atan2(currentPosition.y, currentPosition.x);
                    }
                    BABYLON.Matrix.RotationYawPitchRollToRef(finalEuler.y, finalEuler.x, finalEuler.z, BABYLON.Tmp.Matrix[0]);
                }
                else {
                    BABYLON.Tmp.Matrix[1].copyFrom(camera.getViewMatrix());
                    BABYLON.Tmp.Matrix[1].setTranslationFromFloats(0, 0, 0);
                    BABYLON.Tmp.Matrix[1].invertToRef(BABYLON.Tmp.Matrix[0]);
                }
                BABYLON.Tmp.Matrix[1].copyFrom(BABYLON.Tmp.Matrix[5]);
                BABYLON.Tmp.Matrix[1].multiplyToRef(BABYLON.Tmp.Matrix[0], BABYLON.Tmp.Matrix[5]);
            }
            // Local world
            BABYLON.Tmp.Matrix[5].multiplyToRef(BABYLON.Tmp.Matrix[2], this._localWorld);
            // Parent
            if (this.parent && this.parent.getWorldMatrix) {
                if (this.billboardMode !== BABYLON.AbstractMesh.BILLBOARDMODE_NONE) {
                    if (this._transformToBoneReferal) {
                        this.parent.getWorldMatrix().multiplyToRef(this._transformToBoneReferal.getWorldMatrix(), BABYLON.Tmp.Matrix[6]);
                        BABYLON.Tmp.Matrix[5].copyFrom(BABYLON.Tmp.Matrix[6]);
                    }
                    else {
                        BABYLON.Tmp.Matrix[5].copyFrom(this.parent.getWorldMatrix());
                    }
                    this._localWorld.getTranslationToRef(BABYLON.Tmp.Vector3[5]);
                    BABYLON.Vector3.TransformCoordinatesToRef(BABYLON.Tmp.Vector3[5], BABYLON.Tmp.Matrix[5], BABYLON.Tmp.Vector3[5]);
                    this._worldMatrix.copyFrom(this._localWorld);
                    this._worldMatrix.setTranslation(BABYLON.Tmp.Vector3[5]);
                }
                else {
                    if (this._transformToBoneReferal) {
                        this._localWorld.multiplyToRef(this.parent.getWorldMatrix(), BABYLON.Tmp.Matrix[6]);
                        BABYLON.Tmp.Matrix[6].multiplyToRef(this._transformToBoneReferal.getWorldMatrix(), this._worldMatrix);
                    }
                    else {
                        this._localWorld.multiplyToRef(this.parent.getWorldMatrix(), this._worldMatrix);
                    }
                }
                this._markSyncedWithParent();
            }
            else {
                this._worldMatrix.copyFrom(this._localWorld);
            }
            // Post multiply inverse of pivotMatrix
            if (this._postMultiplyPivotMatrix) {
                this._worldMatrix.multiplyToRef(this._pivotMatrixInverse, this._worldMatrix);
            }
            // Normal matrix
            if (this.scaling.isNonUniform) {
                this._updateNonUniformScalingState(true);
            }
            else if (this.parent && this.parent._nonUniformScaling) {
                this._updateNonUniformScalingState(this.parent._nonUniformScaling);
            }
            else {
                this._updateNonUniformScalingState(false);
            }
            this._afterComputeWorldMatrix();
            // Absolute position
            this._absolutePosition.copyFromFloats(this._worldMatrix.m[12], this._worldMatrix.m[13], this._worldMatrix.m[14]);
            // Callbacks
            this.onAfterWorldMatrixUpdateObservable.notifyObservers(this);
            if (!this._poseMatrix) {
                this._poseMatrix = BABYLON.Matrix.Invert(this._worldMatrix);
            }
            return this._worldMatrix;
        };
        TransformNode.prototype._afterComputeWorldMatrix = function () {
        };
        /**
        * If you'd like to be called back after the mesh position, rotation or scaling has been updated.
        * @param func: callback function to add
        *
        * Returns the TransformNode.
        */
        TransformNode.prototype.registerAfterWorldMatrixUpdate = function (func) {
            this.onAfterWorldMatrixUpdateObservable.add(func);
            return this;
        };
        /**
         * Removes a registered callback function.
         * Returns the TransformNode.
         */
        TransformNode.prototype.unregisterAfterWorldMatrixUpdate = function (func) {
            this.onAfterWorldMatrixUpdateObservable.removeCallback(func);
            return this;
        };
        /**
         * Clone the current transform node
         * Returns the new transform node
         * @param name Name of the new clone
         * @param newParent New parent for the clone
         * @param doNotCloneChildren Do not clone children hierarchy
         */
        TransformNode.prototype.clone = function (name, newParent, doNotCloneChildren) {
            var _this = this;
            var result = BABYLON.SerializationHelper.Clone(function () { return new TransformNode(name, _this.getScene()); }, this);
            result.name = name;
            result.id = name;
            if (newParent) {
                result.parent = newParent;
            }
            if (!doNotCloneChildren) {
                // Children
                var directDescendants = this.getDescendants(true);
                for (var index = 0; index < directDescendants.length; index++) {
                    var child = directDescendants[index];
                    if (child.clone) {
                        child.clone(name + "." + child.name, result);
                    }
                }
            }
            return result;
        };
        TransformNode.prototype.serialize = function (currentSerializationObject) {
            var serializationObject = BABYLON.SerializationHelper.Serialize(this, currentSerializationObject);
            serializationObject.type = this.getClassName();
            // Parent
            if (this.parent) {
                serializationObject.parentId = this.parent.id;
            }
            if (BABYLON.Tags && BABYLON.Tags.HasTags(this)) {
                serializationObject.tags = BABYLON.Tags.GetTags(this);
            }
            serializationObject.localMatrix = this.getPivotMatrix().asArray();
            serializationObject.isEnabled = this.isEnabled();
            // Parent
            if (this.parent) {
                serializationObject.parentId = this.parent.id;
            }
            return serializationObject;
        };
        // Statics
        /**
         * Returns a new TransformNode object parsed from the source provided.
         * The parameter `parsedMesh` is the source.
         * The parameter `rootUrl` is a string, it's the root URL to prefix the `delayLoadingFile` property with
         */
        TransformNode.Parse = function (parsedTransformNode, scene, rootUrl) {
            var transformNode = BABYLON.SerializationHelper.Parse(function () { return new TransformNode(parsedTransformNode.name, scene); }, parsedTransformNode, scene, rootUrl);
            if (BABYLON.Tags) {
                BABYLON.Tags.AddTagsTo(transformNode, parsedTransformNode.tags);
            }
            if (parsedTransformNode.localMatrix) {
                transformNode.setPivotMatrix(BABYLON.Matrix.FromArray(parsedTransformNode.localMatrix));
            }
            else if (parsedTransformNode.pivotMatrix) {
                transformNode.setPivotMatrix(BABYLON.Matrix.FromArray(parsedTransformNode.pivotMatrix));
            }
            transformNode.setEnabled(parsedTransformNode.isEnabled);
            // Parent
            if (parsedTransformNode.parentId) {
                transformNode._waitingParentId = parsedTransformNode.parentId;
            }
            return transformNode;
        };
        /**
         * Disposes the TransformNode.
         * By default, all the children are also disposed unless the parameter `doNotRecurse` is set to `true`.
         * Returns nothing.
         */
        TransformNode.prototype.dispose = function (doNotRecurse) {
            // Animations
            this.getScene().stopAnimation(this);
            // Remove from scene
            this.getScene().removeTransformNode(this);
            this._cache = {};
            if (!doNotRecurse) {
                // Children
                var objects = this.getDescendants(true);
                for (var index = 0; index < objects.length; index++) {
                    objects[index].dispose();
                }
            }
            else {
                var childMeshes = this.getChildMeshes(true);
                for (index = 0; index < childMeshes.length; index++) {
                    var child = childMeshes[index];
                    child.parent = null;
                    child.computeWorldMatrix(true);
                }
            }
            this.onAfterWorldMatrixUpdateObservable.clear();
            _super.prototype.dispose.call(this);
        };
        // Statics
        TransformNode.BILLBOARDMODE_NONE = 0;
        TransformNode.BILLBOARDMODE_X = 1;
        TransformNode.BILLBOARDMODE_Y = 2;
        TransformNode.BILLBOARDMODE_Z = 4;
        TransformNode.BILLBOARDMODE_ALL = 7;
        TransformNode._lookAtVectorCache = new BABYLON.Vector3(0, 0, 0);
        TransformNode._rotationAxisCache = new BABYLON.Quaternion();
        __decorate([
            BABYLON.serializeAsVector3()
        ], TransformNode.prototype, "_rotation", void 0);
        __decorate([
            BABYLON.serializeAsQuaternion()
        ], TransformNode.prototype, "_rotationQuaternion", void 0);
        __decorate([
            BABYLON.serializeAsVector3()
        ], TransformNode.prototype, "_scaling", void 0);
        __decorate([
            BABYLON.serialize()
        ], TransformNode.prototype, "billboardMode", void 0);
        __decorate([
            BABYLON.serialize()
        ], TransformNode.prototype, "scalingDeterminant", void 0);
        __decorate([
            BABYLON.serialize()
        ], TransformNode.prototype, "infiniteDistance", void 0);
        __decorate([
            BABYLON.serializeAsVector3()
        ], TransformNode.prototype, "position", void 0);
        return TransformNode;
    }(BABYLON.Node));
    BABYLON.TransformNode = TransformNode;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.transformNode.js.map
