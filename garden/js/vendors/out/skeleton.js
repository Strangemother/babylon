var BABYLON;
(function (BABYLON) {
    var Skeleton = /** @class */ (function () {
        function Skeleton(name, id, scene) {
            this.name = name;
            this.id = id;
            this.bones = new Array();
            this.needInitialSkinMatrix = false;
            this._isDirty = true;
            this._meshesWithPoseMatrix = new Array();
            this._identity = BABYLON.Matrix.Identity();
            this._ranges = {};
            this._lastAbsoluteTransformsUpdateId = -1;
            // Events
            /**
             * An event triggered before computing the skeleton's matrices
             * @type {BABYLON.Observable}
             */
            this.onBeforeComputeObservable = new BABYLON.Observable();
            this.bones = [];
            this._scene = scene || BABYLON.Engine.LastCreatedScene;
            scene.skeletons.push(this);
            //make sure it will recalculate the matrix next time prepare is called.
            this._isDirty = true;
        }
        // Members
        Skeleton.prototype.getTransformMatrices = function (mesh) {
            if (this.needInitialSkinMatrix && mesh._bonesTransformMatrices) {
                return mesh._bonesTransformMatrices;
            }
            if (!this._transformMatrices) {
                this.prepare();
            }
            return this._transformMatrices;
        };
        Skeleton.prototype.getScene = function () {
            return this._scene;
        };
        // Methods
        /**
         * @param {boolean} fullDetails - support for multiple levels of logging within scene loading
         */
        Skeleton.prototype.toString = function (fullDetails) {
            var ret = "Name: " + this.name + ", nBones: " + this.bones.length;
            ret += ", nAnimationRanges: " + (this._ranges ? Object.keys(this._ranges).length : "none");
            if (fullDetails) {
                ret += ", Ranges: {";
                var first = true;
                for (var name_1 in this._ranges) {
                    if (first) {
                        ret += ", ";
                        first = false;
                    }
                    ret += name_1;
                }
                ret += "}";
            }
            return ret;
        };
        /**
        * Get bone's index searching by name
        * @param {string} name is bone's name to search for
        * @return {number} Indice of the bone. Returns -1 if not found
        */
        Skeleton.prototype.getBoneIndexByName = function (name) {
            for (var boneIndex = 0, cache = this.bones.length; boneIndex < cache; boneIndex++) {
                if (this.bones[boneIndex].name === name) {
                    return boneIndex;
                }
            }
            return -1;
        };
        Skeleton.prototype.createAnimationRange = function (name, from, to) {
            // check name not already in use
            if (!this._ranges[name]) {
                this._ranges[name] = new BABYLON.AnimationRange(name, from, to);
                for (var i = 0, nBones = this.bones.length; i < nBones; i++) {
                    if (this.bones[i].animations[0]) {
                        this.bones[i].animations[0].createRange(name, from, to);
                    }
                }
            }
        };
        Skeleton.prototype.deleteAnimationRange = function (name, deleteFrames) {
            if (deleteFrames === void 0) { deleteFrames = true; }
            for (var i = 0, nBones = this.bones.length; i < nBones; i++) {
                if (this.bones[i].animations[0]) {
                    this.bones[i].animations[0].deleteRange(name, deleteFrames);
                }
            }
            this._ranges[name] = null; // said much faster than 'delete this._range[name]'
        };
        Skeleton.prototype.getAnimationRange = function (name) {
            return this._ranges[name];
        };
        /**
         *  Returns as an Array, all AnimationRanges defined on this skeleton
         */
        Skeleton.prototype.getAnimationRanges = function () {
            var animationRanges = [];
            var name;
            var i = 0;
            for (name in this._ranges) {
                animationRanges[i] = this._ranges[name];
                i++;
            }
            return animationRanges;
        };
        /**
         *  note: This is not for a complete retargeting, only between very similar skeleton's with only possible bone length differences
         */
        Skeleton.prototype.copyAnimationRange = function (source, name, rescaleAsRequired) {
            if (rescaleAsRequired === void 0) { rescaleAsRequired = false; }
            if (this._ranges[name] || !source.getAnimationRange(name)) {
                return false;
            }
            var ret = true;
            var frameOffset = this._getHighestAnimationFrame() + 1;
            // make a dictionary of source skeleton's bones, so exact same order or doublely nested loop is not required
            var boneDict = {};
            var sourceBones = source.bones;
            var nBones;
            var i;
            for (i = 0, nBones = sourceBones.length; i < nBones; i++) {
                boneDict[sourceBones[i].name] = sourceBones[i];
            }
            if (this.bones.length !== sourceBones.length) {
                BABYLON.Tools.Warn("copyAnimationRange: this rig has " + this.bones.length + " bones, while source as " + sourceBones.length);
                ret = false;
            }
            var skelDimensionsRatio = (rescaleAsRequired && this.dimensionsAtRest && source.dimensionsAtRest) ? this.dimensionsAtRest.divide(source.dimensionsAtRest) : null;
            for (i = 0, nBones = this.bones.length; i < nBones; i++) {
                var boneName = this.bones[i].name;
                var sourceBone = boneDict[boneName];
                if (sourceBone) {
                    ret = ret && this.bones[i].copyAnimationRange(sourceBone, name, frameOffset, rescaleAsRequired, skelDimensionsRatio);
                }
                else {
                    BABYLON.Tools.Warn("copyAnimationRange: not same rig, missing source bone " + boneName);
                    ret = false;
                }
            }
            // do not call createAnimationRange(), since it also is done to bones, which was already done
            var range = source.getAnimationRange(name);
            if (range) {
                this._ranges[name] = new BABYLON.AnimationRange(name, range.from + frameOffset, range.to + frameOffset);
            }
            return ret;
        };
        Skeleton.prototype.returnToRest = function () {
            for (var index = 0; index < this.bones.length; index++) {
                this.bones[index].returnToRest();
            }
        };
        Skeleton.prototype._getHighestAnimationFrame = function () {
            var ret = 0;
            for (var i = 0, nBones = this.bones.length; i < nBones; i++) {
                if (this.bones[i].animations[0]) {
                    var highest = this.bones[i].animations[0].getHighestFrame();
                    if (ret < highest) {
                        ret = highest;
                    }
                }
            }
            return ret;
        };
        Skeleton.prototype.beginAnimation = function (name, loop, speedRatio, onAnimationEnd) {
            var range = this.getAnimationRange(name);
            if (!range) {
                return null;
            }
            return this._scene.beginAnimation(this, range.from, range.to, loop, speedRatio, onAnimationEnd);
        };
        Skeleton.prototype._markAsDirty = function () {
            this._isDirty = true;
        };
        Skeleton.prototype._registerMeshWithPoseMatrix = function (mesh) {
            this._meshesWithPoseMatrix.push(mesh);
        };
        Skeleton.prototype._unregisterMeshWithPoseMatrix = function (mesh) {
            var index = this._meshesWithPoseMatrix.indexOf(mesh);
            if (index > -1) {
                this._meshesWithPoseMatrix.splice(index, 1);
            }
        };
        Skeleton.prototype._computeTransformMatrices = function (targetMatrix, initialSkinMatrix) {
            this.onBeforeComputeObservable.notifyObservers(this);
            for (var index = 0; index < this.bones.length; index++) {
                var bone = this.bones[index];
                var parentBone = bone.getParent();
                if (parentBone) {
                    bone.getLocalMatrix().multiplyToRef(parentBone.getWorldMatrix(), bone.getWorldMatrix());
                }
                else {
                    if (initialSkinMatrix) {
                        bone.getLocalMatrix().multiplyToRef(initialSkinMatrix, bone.getWorldMatrix());
                    }
                    else {
                        bone.getWorldMatrix().copyFrom(bone.getLocalMatrix());
                    }
                }
                if (bone._index !== -1) {
                    var mappedIndex = bone._index === null ? index : bone._index;
                    bone.getInvertedAbsoluteTransform().multiplyToArray(bone.getWorldMatrix(), targetMatrix, mappedIndex * 16);
                }
            }
            this._identity.copyToArray(targetMatrix, this.bones.length * 16);
        };
        Skeleton.prototype.prepare = function () {
            if (!this._isDirty) {
                return;
            }
            if (this.needInitialSkinMatrix) {
                for (var index = 0; index < this._meshesWithPoseMatrix.length; index++) {
                    var mesh = this._meshesWithPoseMatrix[index];
                    var poseMatrix = mesh.getPoseMatrix();
                    if (!mesh._bonesTransformMatrices || mesh._bonesTransformMatrices.length !== 16 * (this.bones.length + 1)) {
                        mesh._bonesTransformMatrices = new Float32Array(16 * (this.bones.length + 1));
                    }
                    if (this._synchronizedWithMesh !== mesh) {
                        this._synchronizedWithMesh = mesh;
                        // Prepare bones
                        for (var boneIndex = 0; boneIndex < this.bones.length; boneIndex++) {
                            var bone = this.bones[boneIndex];
                            if (!bone.getParent()) {
                                var matrix = bone.getBaseMatrix();
                                matrix.multiplyToRef(poseMatrix, BABYLON.Tmp.Matrix[1]);
                                bone._updateDifferenceMatrix(BABYLON.Tmp.Matrix[1]);
                            }
                        }
                    }
                    this._computeTransformMatrices(mesh._bonesTransformMatrices, poseMatrix);
                }
            }
            else {
                if (!this._transformMatrices || this._transformMatrices.length !== 16 * (this.bones.length + 1)) {
                    this._transformMatrices = new Float32Array(16 * (this.bones.length + 1));
                }
                this._computeTransformMatrices(this._transformMatrices, null);
            }
            this._isDirty = false;
            this._scene._activeBones.addCount(this.bones.length, false);
        };
        Skeleton.prototype.getAnimatables = function () {
            if (!this._animatables || this._animatables.length !== this.bones.length) {
                this._animatables = [];
                for (var index = 0; index < this.bones.length; index++) {
                    this._animatables.push(this.bones[index]);
                }
            }
            return this._animatables;
        };
        Skeleton.prototype.clone = function (name, id) {
            var result = new Skeleton(name, id || name, this._scene);
            result.needInitialSkinMatrix = this.needInitialSkinMatrix;
            for (var index = 0; index < this.bones.length; index++) {
                var source = this.bones[index];
                var parentBone = null;
                var parent_1 = source.getParent();
                if (parent_1) {
                    var parentIndex = this.bones.indexOf(parent_1);
                    parentBone = result.bones[parentIndex];
                }
                var bone = new BABYLON.Bone(source.name, result, parentBone, source.getBaseMatrix().clone(), source.getRestPose().clone());
                BABYLON.Tools.DeepCopy(source.animations, bone.animations);
            }
            if (this._ranges) {
                result._ranges = {};
                for (var rangeName in this._ranges) {
                    var range = this._ranges[rangeName];
                    if (range) {
                        result._ranges[rangeName] = range.clone();
                    }
                }
            }
            this._isDirty = true;
            return result;
        };
        Skeleton.prototype.enableBlending = function (blendingSpeed) {
            if (blendingSpeed === void 0) { blendingSpeed = 0.01; }
            this.bones.forEach(function (bone) {
                bone.animations.forEach(function (animation) {
                    animation.enableBlending = true;
                    animation.blendingSpeed = blendingSpeed;
                });
            });
        };
        Skeleton.prototype.dispose = function () {
            this._meshesWithPoseMatrix = [];
            // Animations
            this.getScene().stopAnimation(this);
            // Remove from scene
            this.getScene().removeSkeleton(this);
        };
        Skeleton.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.name = this.name;
            serializationObject.id = this.id;
            serializationObject.dimensionsAtRest = this.dimensionsAtRest;
            serializationObject.bones = [];
            serializationObject.needInitialSkinMatrix = this.needInitialSkinMatrix;
            for (var index = 0; index < this.bones.length; index++) {
                var bone = this.bones[index];
                var parent_2 = bone.getParent();
                var serializedBone = {
                    parentBoneIndex: parent_2 ? this.bones.indexOf(parent_2) : -1,
                    name: bone.name,
                    matrix: bone.getBaseMatrix().toArray(),
                    rest: bone.getRestPose().toArray()
                };
                serializationObject.bones.push(serializedBone);
                if (bone.length) {
                    serializedBone.length = bone.length;
                }
                if (bone.animations && bone.animations.length > 0) {
                    serializedBone.animation = bone.animations[0].serialize();
                }
                serializationObject.ranges = [];
                for (var name in this._ranges) {
                    var source = this._ranges[name];
                    if (!source) {
                        continue;
                    }
                    var range = {};
                    range.name = name;
                    range.from = source.from;
                    range.to = source.to;
                    serializationObject.ranges.push(range);
                }
            }
            return serializationObject;
        };
        Skeleton.Parse = function (parsedSkeleton, scene) {
            var skeleton = new Skeleton(parsedSkeleton.name, parsedSkeleton.id, scene);
            if (parsedSkeleton.dimensionsAtRest) {
                skeleton.dimensionsAtRest = BABYLON.Vector3.FromArray(parsedSkeleton.dimensionsAtRest);
            }
            skeleton.needInitialSkinMatrix = parsedSkeleton.needInitialSkinMatrix;
            var index;
            for (index = 0; index < parsedSkeleton.bones.length; index++) {
                var parsedBone = parsedSkeleton.bones[index];
                var parentBone = null;
                if (parsedBone.parentBoneIndex > -1) {
                    parentBone = skeleton.bones[parsedBone.parentBoneIndex];
                }
                var rest = parsedBone.rest ? BABYLON.Matrix.FromArray(parsedBone.rest) : null;
                var bone = new BABYLON.Bone(parsedBone.name, skeleton, parentBone, BABYLON.Matrix.FromArray(parsedBone.matrix), rest);
                if (parsedBone.length) {
                    bone.length = parsedBone.length;
                }
                if (parsedBone.animation) {
                    bone.animations.push(BABYLON.Animation.Parse(parsedBone.animation));
                }
            }
            // placed after bones, so createAnimationRange can cascade down
            if (parsedSkeleton.ranges) {
                for (index = 0; index < parsedSkeleton.ranges.length; index++) {
                    var data = parsedSkeleton.ranges[index];
                    skeleton.createAnimationRange(data.name, data.from, data.to);
                }
            }
            return skeleton;
        };
        Skeleton.prototype.computeAbsoluteTransforms = function (forceUpdate) {
            if (forceUpdate === void 0) { forceUpdate = false; }
            var renderId = this._scene.getRenderId();
            if (this._lastAbsoluteTransformsUpdateId != renderId || forceUpdate) {
                this.bones[0].computeAbsoluteTransforms();
                this._lastAbsoluteTransformsUpdateId = renderId;
            }
        };
        Skeleton.prototype.getPoseMatrix = function () {
            var poseMatrix = null;
            if (this._meshesWithPoseMatrix.length > 0) {
                poseMatrix = this._meshesWithPoseMatrix[0].getPoseMatrix();
            }
            return poseMatrix;
        };
        Skeleton.prototype.sortBones = function () {
            var bones = new Array();
            var visited = new Array(this.bones.length);
            for (var index = 0; index < this.bones.length; index++) {
                this._sortBones(index, bones, visited);
            }
            this.bones = bones;
        };
        Skeleton.prototype._sortBones = function (index, bones, visited) {
            if (visited[index]) {
                return;
            }
            visited[index] = true;
            var bone = this.bones[index];
            if (bone._index === undefined) {
                bone._index = index;
            }
            var parentBone = bone.getParent();
            if (parentBone) {
                this._sortBones(this.bones.indexOf(parentBone), bones, visited);
            }
            bones.push(bone);
        };
        return Skeleton;
    }());
    BABYLON.Skeleton = Skeleton;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.skeleton.js.map
