
var LIB;
(function (LIB) {
    /**
     * Set of assets to keep when moving a scene into an asset container.
     */
    var KeepAssets = /** @class */ (function () {
        function KeepAssets() {
            /**
             * Cameras to keep.
             */
            this.cameras = new Array();
            /**
             * Lights to keep.
             */
            this.lights = new Array();
            /**
             * Meshes to keep.
             */
            this.meshes = new Array();
            /**
             * Skeletons to keep.
             */
            this.skeletons = new Array();
            /**
             * ParticleSystems to keep.
             */
            this.particleSystems = new Array();
            /**
             * Animations to keep.
             */
            this.animations = new Array();
            /**
             * AnimationGroups to keep.
             */
            this.animationGroups = new Array();
            /**
             * MultiMaterials to keep.
             */
            this.multiMaterials = new Array();
            /**
             * Materials to keep.
             */
            this.materials = new Array();
            /**
             * MorphTargetManagers to keep.
             */
            this.morphTargetManagers = new Array();
            /**
             * Geometries to keep.
             */
            this.geometries = new Array();
            /**
             * TransformNodes to keep.
             */
            this.transformNodes = new Array();
            /**
             * LensFlareSystems to keep.
             */
            this.lensFlareSystems = new Array();
            /**
             * ShadowGenerators to keep.
             */
            this.shadowGenerators = new Array();
            /**
             * ActionManagers to keep.
             */
            this.actionManagers = new Array();
            /**
             * Sounds to keep.
             */
            this.sounds = new Array();
            /**
             * Textures to keep.
             */
            this.textures = new Array();
            /**
             * Effect layers to keep.
             */
            this.effectLayers = new Array();
        }
        return KeepAssets;
    }());
    LIB.KeepAssets = KeepAssets;
    /**
     * Container with a set of assets that can be added or removed from a scene.
     */
    var AssetContainer = /** @class */ (function () {
        /**
         * Instantiates an AssetContainer.
         * @param scene The scene the AssetContainer belongs to.
         */
        function AssetContainer(scene) {
            // Objects
            /**
             * Cameras populated in the container.
             */
            this.cameras = new Array();
            /**
             * Lights populated in the container.
             */
            this.lights = new Array();
            /**
             * Meshes populated in the container.
             */
            this.meshes = new Array();
            /**
             * Skeletons populated in the container.
             */
            this.skeletons = new Array();
            /**
             * ParticleSystems populated in the container.
             */
            this.particleSystems = new Array();
            /**
             * Animations populated in the container.
             */
            this.animations = new Array();
            /**
             * AnimationGroups populated in the container.
             */
            this.animationGroups = new Array();
            /**
             * MultiMaterials populated in the container.
             */
            this.multiMaterials = new Array();
            /**
             * Materials populated in the container.
             */
            this.materials = new Array();
            /**
             * MorphTargetManagers populated in the container.
             */
            this.morphTargetManagers = new Array();
            /**
             * Geometries populated in the container.
             */
            this.geometries = new Array();
            /**
             * TransformNodes populated in the container.
             */
            this.transformNodes = new Array();
            /**
             * LensFlareSystems populated in the container.
             */
            this.lensFlareSystems = new Array();
            /**
             * ShadowGenerators populated in the container.
             */
            this.shadowGenerators = new Array();
            /**
             * ActionManagers populated in the container.
             */
            this.actionManagers = new Array();
            /**
             * Sounds populated in the container.
             */
            this.sounds = new Array();
            /**
             * Textures populated in the container.
             */
            this.textures = new Array();
            /**
             * Effect layers populated in the container.
             */
            this.effectLayers = new Array();
            this.scene = scene;
        }
        /**
         * Adds all the assets from the container to the scene.
         */
        AssetContainer.prototype.addAllToScene = function () {
            var _this = this;
            this.cameras.forEach(function (o) {
                _this.scene.addCamera(o);
            });
            this.lights.forEach(function (o) {
                _this.scene.addLight(o);
            });
            this.meshes.forEach(function (o) {
                _this.scene.addMesh(o);
            });
            this.skeletons.forEach(function (o) {
                _this.scene.addSkeleton(o);
            });
            this.particleSystems.forEach(function (o) {
                _this.scene.addParticleSystem(o);
            });
            this.animations.forEach(function (o) {
                _this.scene.addAnimation(o);
            });
            this.animationGroups.forEach(function (o) {
                _this.scene.addAnimationGroup(o);
            });
            this.multiMaterials.forEach(function (o) {
                _this.scene.addMultiMaterial(o);
            });
            this.materials.forEach(function (o) {
                _this.scene.addMaterial(o);
            });
            this.morphTargetManagers.forEach(function (o) {
                _this.scene.addMorphTargetManager(o);
            });
            this.geometries.forEach(function (o) {
                _this.scene.addGeometry(o);
            });
            this.transformNodes.forEach(function (o) {
                _this.scene.addTransformNode(o);
            });
            this.lensFlareSystems.forEach(function (o) {
                _this.scene.addLensFlareSystem(o);
            });
            this.actionManagers.forEach(function (o) {
                _this.scene.addActionManager(o);
            });
            this.sounds.forEach(function (o) {
                o.play();
                o.autoplay = true;
                _this.scene.mainSoundTrack.AddSound(o);
            });
            this.textures.forEach(function (o) {
                _this.scene.addTexture(o);
            });
            this.effectLayers.forEach(function (o) {
                _this.scene.addEffectLayer(o);
            });
        };
        /**
         * Removes all the assets in the container from the scene
         */
        AssetContainer.prototype.removeAllFromScene = function () {
            var _this = this;
            this.cameras.forEach(function (o) {
                _this.scene.removeCamera(o);
            });
            this.lights.forEach(function (o) {
                _this.scene.removeLight(o);
            });
            this.meshes.forEach(function (o) {
                _this.scene.removeMesh(o);
            });
            this.skeletons.forEach(function (o) {
                _this.scene.removeSkeleton(o);
            });
            this.particleSystems.forEach(function (o) {
                _this.scene.removeParticleSystem(o);
            });
            this.animations.forEach(function (o) {
                _this.scene.removeAnimation(o);
            });
            this.animationGroups.forEach(function (o) {
                _this.scene.removeAnimationGroup(o);
            });
            this.multiMaterials.forEach(function (o) {
                _this.scene.removeMultiMaterial(o);
            });
            this.materials.forEach(function (o) {
                _this.scene.removeMaterial(o);
            });
            this.morphTargetManagers.forEach(function (o) {
                _this.scene.removeMorphTargetManager(o);
            });
            this.geometries.forEach(function (o) {
                _this.scene.removeGeometry(o);
            });
            this.transformNodes.forEach(function (o) {
                _this.scene.removeTransformNode(o);
            });
            this.lensFlareSystems.forEach(function (o) {
                _this.scene.removeLensFlareSystem(o);
            });
            this.actionManagers.forEach(function (o) {
                _this.scene.removeActionManager(o);
            });
            this.sounds.forEach(function (o) {
                o.stop();
                o.autoplay = false;
                _this.scene.mainSoundTrack.RemoveSound(o);
            });
            this.textures.forEach(function (o) {
                _this.scene.removeTexture(o);
            });
            this.effectLayers.forEach(function (o) {
                _this.scene.removeEffectLayer(o);
            });
        };
        AssetContainer.prototype._moveAssets = function (sourceAssets, targetAssets, keepAssets) {
            for (var _i = 0, sourceAssets_1 = sourceAssets; _i < sourceAssets_1.length; _i++) {
                var asset = sourceAssets_1[_i];
                var move = true;
                for (var _a = 0, keepAssets_1 = keepAssets; _a < keepAssets_1.length; _a++) {
                    var keepAsset = keepAssets_1[_a];
                    if (asset === keepAsset) {
                        move = false;
                        break;
                    }
                }
                if (move) {
                    targetAssets.push(asset);
                }
            }
        };
        /**
         * Removes all the assets contained in the scene and adds them to the container.
         * @param keepAssets Set of assets to keep in the scene. (default: empty)
         */
        AssetContainer.prototype.moveAllFromScene = function (keepAssets) {
            if (keepAssets === undefined) {
                keepAssets = new KeepAssets();
            }
            this._moveAssets(this.scene.cameras, this.cameras, keepAssets.cameras);
            this._moveAssets(this.scene.meshes, this.meshes, keepAssets.meshes);
            this._moveAssets(this.scene.getGeometries(), this.geometries, keepAssets.geometries);
            this._moveAssets(this.scene.materials, this.materials, keepAssets.materials);
            this._moveAssets(this.scene._actionManagers, this.actionManagers, keepAssets.actionManagers);
            this._moveAssets(this.scene.animations, this.animations, keepAssets.animations);
            this._moveAssets(this.scene.animationGroups, this.animationGroups, keepAssets.animationGroups);
            this._moveAssets(this.scene.lensFlareSystems, this.lensFlareSystems, keepAssets.lensFlareSystems);
            this._moveAssets(this.scene.lights, this.lights, keepAssets.lights);
            this._moveAssets(this.scene.morphTargetManagers, this.morphTargetManagers, keepAssets.morphTargetManagers);
            this._moveAssets(this.scene.multiMaterials, this.multiMaterials, keepAssets.multiMaterials);
            this._moveAssets(this.scene.skeletons, this.skeletons, keepAssets.skeletons);
            this._moveAssets(this.scene.particleSystems, this.particleSystems, keepAssets.particleSystems);
            this._moveAssets(this.scene.mainSoundTrack.soundCollection, this.sounds, keepAssets.sounds);
            this._moveAssets(this.scene.transformNodes, this.transformNodes, keepAssets.transformNodes);
            this._moveAssets(this.scene.textures, this.textures, keepAssets.textures);
            this._moveAssets(this.scene.effectLayers, this.effectLayers, keepAssets.effectLayers);
            this.removeAllFromScene();
        };
        return AssetContainer;
    }());
    LIB.AssetContainer = AssetContainer;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.assetContainer.js.map
//# sourceMappingURL=LIB.assetContainer.js.map
