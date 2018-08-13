






var LIB;
(function (LIB) {
    /**
     * Base class of all the lights in LIB. It groups all the generic information about lights.
     * Lights are used, as you would expect, to affect how meshes are seen, in terms of both illumination and colour.
     * All meshes allow light to pass through them unless shadow generation is activated. The default number of lights allowed is four but this can be increased.
     */
    var Light = /** @class */ (function (_super) {
        __extends(Light, _super);
        /**
         * Creates a Light object in the scene.
         * Documentation : http://doc.LIBjs.com/tutorials/lights
         * @param name The firendly name of the light
         * @param scene The scene the light belongs too
         */
        function Light(name, scene) {
            var _this = _super.call(this, name, scene) || this;
            /**
             * Diffuse gives the basic color to an object.
             */
            _this.diffuse = new LIB.Color3(1.0, 1.0, 1.0);
            /**
             * Specular produces a highlight color on an object.
             * Note: This is note affecting PBR materials.
             */
            _this.specular = new LIB.Color3(1.0, 1.0, 1.0);
            /**
             * Strength of the light.
             * Note: By default it is define in the framework own unit.
             * Note: In PBR materials the intensityMode can be use to chose what unit the intensity is defined in.
             */
            _this.intensity = 1.0;
            /**
             * Defines how far from the source the light is impacting in scene units.
             * Note: Unused in PBR material as the distance light falloff is defined following the inverse squared falloff.
             */
            _this.range = Number.MAX_VALUE;
            /**
             * Cached photometric scale default to 1.0 as the automatic intensity mode defaults to 1.0 for every type
             * of light.
             */
            _this._photometricScale = 1.0;
            _this._intensityMode = Light.INTENSITYMODE_AUTOMATIC;
            _this._radius = 0.00001;
            /**
             * Defines the rendering priority of the lights. It can help in case of fallback or number of lights
             * exceeding the number allowed of the materials.
             */
            _this.renderPriority = 0;
            /**
             * Defines wether or not the shadows are enabled for this light. This can help turning off/on shadow without detaching
             * the current shadow generator.
             */
            _this.shadowEnabled = true;
            _this._excludeWithLayerMask = 0;
            _this._includeOnlyWithLayerMask = 0;
            _this._lightmapMode = 0;
            /**
             * @hidden Internal use only.
             */
            _this._excludedMeshesIds = new Array();
            /**
             * @hidden Internal use only.
             */
            _this._includedOnlyMeshesIds = new Array();
            _this.getScene().addLight(_this);
            _this._uniformBuffer = new LIB.UniformBuffer(_this.getScene().getEngine());
            _this._buildUniformLayout();
            _this.includedOnlyMeshes = new Array();
            _this.excludedMeshes = new Array();
            _this._resyncMeshes();
            return _this;
        }
        Object.defineProperty(Light, "LIGHTMAP_DEFAULT", {
            /**
             * If every light affecting the material is in this lightmapMode,
             * material.lightmapTexture adds or multiplies
             * (depends on material.useLightmapAsShadowmap)
             * after every other light calculations.
             */
            get: function () {
                return Light._LIGHTMAP_DEFAULT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "LIGHTMAP_SPECULAR", {
            /**
             * material.lightmapTexture as only diffuse lighting from this light
             * adds only specular lighting from this light
             * adds dynamic shadows
             */
            get: function () {
                return Light._LIGHTMAP_SPECULAR;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "LIGHTMAP_SHADOWSONLY", {
            /**
             * material.lightmapTexture as only lighting
             * no light calculation from this light
             * only adds dynamic shadows from this light
             */
            get: function () {
                return Light._LIGHTMAP_SHADOWSONLY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "INTENSITYMODE_AUTOMATIC", {
            /**
             * Each light type uses the default quantity according to its type:
             *      point/spot lights use luminous intensity
             *      directional lights use illuminance
             */
            get: function () {
                return Light._INTENSITYMODE_AUTOMATIC;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "INTENSITYMODE_LUMINOUSPOWER", {
            /**
             * lumen (lm)
             */
            get: function () {
                return Light._INTENSITYMODE_LUMINOUSPOWER;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "INTENSITYMODE_LUMINOUSINTENSITY", {
            /**
             * candela (lm/sr)
             */
            get: function () {
                return Light._INTENSITYMODE_LUMINOUSINTENSITY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "INTENSITYMODE_ILLUMINANCE", {
            /**
             * lux (lm/m^2)
             */
            get: function () {
                return Light._INTENSITYMODE_ILLUMINANCE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "INTENSITYMODE_LUMINANCE", {
            /**
             * nit (cd/m^2)
             */
            get: function () {
                return Light._INTENSITYMODE_LUMINANCE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "LIGHTTYPEID_POINTLIGHT", {
            /**
             * Light type const id of the point light.
             */
            get: function () {
                return Light._LIGHTTYPEID_POINTLIGHT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "LIGHTTYPEID_DIRECTIONALLIGHT", {
            /**
             * Light type const id of the directional light.
             */
            get: function () {
                return Light._LIGHTTYPEID_DIRECTIONALLIGHT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "LIGHTTYPEID_SPOTLIGHT", {
            /**
             * Light type const id of the spot light.
             */
            get: function () {
                return Light._LIGHTTYPEID_SPOTLIGHT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light, "LIGHTTYPEID_HEMISPHERICLIGHT", {
            /**
             * Light type const id of the hemispheric light.
             */
            get: function () {
                return Light._LIGHTTYPEID_HEMISPHERICLIGHT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "intensityMode", {
            /**
             * Gets the photometric scale used to interpret the intensity.
             * This is only relevant with PBR Materials where the light intensity can be defined in a physical way.
             */
            get: function () {
                return this._intensityMode;
            },
            /**
             * Sets the photometric scale used to interpret the intensity.
             * This is only relevant with PBR Materials where the light intensity can be defined in a physical way.
             */
            set: function (value) {
                this._intensityMode = value;
                this._computePhotometricScale();
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(Light.prototype, "radius", {
            /**
             * Gets the light radius used by PBR Materials to simulate soft area lights.
             */
            get: function () {
                return this._radius;
            },
            /**
             * sets the light radius used by PBR Materials to simulate soft area lights.
             */
            set: function (value) {
                this._radius = value;
                this._computePhotometricScale();
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(Light.prototype, "includedOnlyMeshes", {
            /**
             * Gets the only meshes impacted by this light.
             */
            get: function () {
                return this._includedOnlyMeshes;
            },
            /**
             * Sets the only meshes impacted by this light.
             */
            set: function (value) {
                this._includedOnlyMeshes = value;
                this._hookArrayForIncludedOnly(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "excludedMeshes", {
            /**
             * Gets the meshes not impacted by this light.
             */
            get: function () {
                return this._excludedMeshes;
            },
            /**
             * Sets the meshes not impacted by this light.
             */
            set: function (value) {
                this._excludedMeshes = value;
                this._hookArrayForExcluded(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "excludeWithLayerMask", {
            /**
             * Gets the layer id use to find what meshes are not impacted by the light.
             * Inactive if 0
             */
            get: function () {
                return this._excludeWithLayerMask;
            },
            /**
             * Sets the layer id use to find what meshes are not impacted by the light.
             * Inactive if 0
             */
            set: function (value) {
                this._excludeWithLayerMask = value;
                this._resyncMeshes();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "includeOnlyWithLayerMask", {
            /**
             * Gets the layer id use to find what meshes are impacted by the light.
             * Inactive if 0
             */
            get: function () {
                return this._includeOnlyWithLayerMask;
            },
            /**
             * Sets the layer id use to find what meshes are impacted by the light.
             * Inactive if 0
             */
            set: function (value) {
                this._includeOnlyWithLayerMask = value;
                this._resyncMeshes();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Light.prototype, "lightmapMode", {
            /**
             * Gets the lightmap mode of this light (should be one of the constants defined by Light.LIGHTMAP_x)
             */
            get: function () {
                return this._lightmapMode;
            },
            /**
             * Sets the lightmap mode of this light (should be one of the constants defined by Light.LIGHTMAP_x)
             */
            set: function (value) {
                if (this._lightmapMode === value) {
                    return;
                }
                this._lightmapMode = value;
                this._markMeshesAsLightDirty();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the string "Light".
         * @returns the class name
         */
        Light.prototype.getClassName = function () {
            return "Light";
        };
        /**
         * Converts the light information to a readable string for debug purpose.
         * @param fullDetails Supports for multiple levels of logging within scene loading
         * @returns the human readable light info
         */
        Light.prototype.toString = function (fullDetails) {
            var ret = "Name: " + this.name;
            ret += ", type: " + (["Point", "Directional", "Spot", "Hemispheric"])[this.getTypeID()];
            if (this.animations) {
                for (var i = 0; i < this.animations.length; i++) {
                    ret += ", animation[0]: " + this.animations[i].toString(fullDetails);
                }
            }
            if (fullDetails) {
            }
            return ret;
        };
        /**
         * Set the enabled state of this node.
         * @param value - the new enabled state
         */
        Light.prototype.setEnabled = function (value) {
            _super.prototype.setEnabled.call(this, value);
            this._resyncMeshes();
        };
        /**
         * Returns the Light associated shadow generator if any.
         * @return the associated shadow generator.
         */
        Light.prototype.getShadowGenerator = function () {
            return this._shadowGenerator;
        };
        /**
         * Returns a Vector3, the absolute light position in the World.
         * @returns the world space position of the light
         */
        Light.prototype.getAbsolutePosition = function () {
            return LIB.Vector3.Zero();
        };
        /**
         * Specifies if the light will affect the passed mesh.
         * @param mesh The mesh to test against the light
         * @return true the mesh is affected otherwise, false.
         */
        Light.prototype.canAffectMesh = function (mesh) {
            if (!mesh) {
                return true;
            }
            if (this.includedOnlyMeshes && this.includedOnlyMeshes.length > 0 && this.includedOnlyMeshes.indexOf(mesh) === -1) {
                return false;
            }
            if (this.excludedMeshes && this.excludedMeshes.length > 0 && this.excludedMeshes.indexOf(mesh) !== -1) {
                return false;
            }
            if (this.includeOnlyWithLayerMask !== 0 && (this.includeOnlyWithLayerMask & mesh.layerMask) === 0) {
                return false;
            }
            if (this.excludeWithLayerMask !== 0 && this.excludeWithLayerMask & mesh.layerMask) {
                return false;
            }
            return true;
        };
        /**
         * Computes and Returns the light World matrix.
         * @returns the world matrix
         */
        Light.prototype.getWorldMatrix = function () {
            this._currentRenderId = this.getScene().getRenderId();
            this._childRenderId = this._currentRenderId;
            var worldMatrix = this._getWorldMatrix();
            if (this.parent && this.parent.getWorldMatrix) {
                if (!this._parentedWorldMatrix) {
                    this._parentedWorldMatrix = LIB.Matrix.Identity();
                }
                worldMatrix.multiplyToRef(this.parent.getWorldMatrix(), this._parentedWorldMatrix);
                this._markSyncedWithParent();
                return this._parentedWorldMatrix;
            }
            return worldMatrix;
        };
        /**
         * Sort function to order lights for rendering.
         * @param a First Light object to compare to second.
         * @param b Second Light object to compare first.
         * @return -1 to reduce's a's index relative to be, 0 for no change, 1 to increase a's index relative to b.
         */
        Light.CompareLightsPriority = function (a, b) {
            //shadow-casting lights have priority over non-shadow-casting lights
            //the renderPrioirty is a secondary sort criterion
            if (a.shadowEnabled !== b.shadowEnabled) {
                return (b.shadowEnabled ? 1 : 0) - (a.shadowEnabled ? 1 : 0);
            }
            return b.renderPriority - a.renderPriority;
        };
        /**
         * Releases resources associated with this node.
         * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
         * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
         */
        Light.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
            if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
            if (this._shadowGenerator) {
                this._shadowGenerator.dispose();
                this._shadowGenerator = null;
            }
            // Animations
            this.getScene().stopAnimation(this);
            // Remove from meshes
            for (var _i = 0, _a = this.getScene().meshes; _i < _a.length; _i++) {
                var mesh = _a[_i];
                mesh._removeLightSource(this);
            }
            this._uniformBuffer.dispose();
            // Remove from scene
            this.getScene().removeLight(this);
            _super.prototype.dispose.call(this, doNotRecurse, disposeMaterialAndTextures);
        };
        /**
         * Returns the light type ID (integer).
         * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
         */
        Light.prototype.getTypeID = function () {
            return 0;
        };
        /**
         * Returns the intensity scaled by the Photometric Scale according to the light type and intensity mode.
         * @returns the scaled intensity in intensity mode unit
         */
        Light.prototype.getScaledIntensity = function () {
            return this._photometricScale * this.intensity;
        };
        /**
         * Returns a new Light object, named "name", from the current one.
         * @param name The name of the cloned light
         * @returns the new created light
         */
        Light.prototype.clone = function (name) {
            var constructor = Light.GetConstructorFromName(this.getTypeID(), name, this.getScene());
            if (!constructor) {
                return null;
            }
            return LIB.SerializationHelper.Clone(constructor, this);
        };
        /**
         * Serializes the current light into a Serialization object.
         * @returns the serialized object.
         */
        Light.prototype.serialize = function () {
            var serializationObject = LIB.SerializationHelper.Serialize(this);
            // Type
            serializationObject.type = this.getTypeID();
            // Parent
            if (this.parent) {
                serializationObject.parentId = this.parent.id;
            }
            // Inclusion / exclusions
            if (this.excludedMeshes.length > 0) {
                serializationObject.excludedMeshesIds = [];
                this.excludedMeshes.forEach(function (mesh) {
                    serializationObject.excludedMeshesIds.push(mesh.id);
                });
            }
            if (this.includedOnlyMeshes.length > 0) {
                serializationObject.includedOnlyMeshesIds = [];
                this.includedOnlyMeshes.forEach(function (mesh) {
                    serializationObject.includedOnlyMeshesIds.push(mesh.id);
                });
            }
            // Animations  
            LIB.Animation.AppendSerializedAnimations(this, serializationObject);
            serializationObject.ranges = this.serializeAnimationRanges();
            return serializationObject;
        };
        /**
         * Creates a new typed light from the passed type (integer) : point light = 0, directional light = 1, spot light = 2, hemispheric light = 3.
         * This new light is named "name" and added to the passed scene.
         * @param type Type according to the types available in Light.LIGHTTYPEID_x
         * @param name The friendly name of the light
         * @param scene The scene the new light will belong to
         * @returns the constructor function
         */
        Light.GetConstructorFromName = function (type, name, scene) {
            switch (type) {
                case 0:
                    return function () { return new LIB.PointLight(name, LIB.Vector3.Zero(), scene); };
                case 1:
                    return function () { return new LIB.DirectionalLight(name, LIB.Vector3.Zero(), scene); };
                case 2:
                    return function () { return new LIB.SpotLight(name, LIB.Vector3.Zero(), LIB.Vector3.Zero(), 0, 0, scene); };
                case 3:
                    return function () { return new LIB.HemisphericLight(name, LIB.Vector3.Zero(), scene); };
            }
            return null;
        };
        /**
         * Parses the passed "parsedLight" and returns a new instanced Light from this parsing.
         * @param parsedLight The JSON representation of the light
         * @param scene The scene to create the parsed light in
         * @returns the created light after parsing
         */
        Light.Parse = function (parsedLight, scene) {
            var constructor = Light.GetConstructorFromName(parsedLight.type, parsedLight.name, scene);
            if (!constructor) {
                return null;
            }
            var light = LIB.SerializationHelper.Parse(constructor, parsedLight, scene);
            // Inclusion / exclusions
            if (parsedLight.excludedMeshesIds) {
                light._excludedMeshesIds = parsedLight.excludedMeshesIds;
            }
            if (parsedLight.includedOnlyMeshesIds) {
                light._includedOnlyMeshesIds = parsedLight.includedOnlyMeshesIds;
            }
            // Parent
            if (parsedLight.parentId) {
                light._waitingParentId = parsedLight.parentId;
            }
            // Animations
            if (parsedLight.animations) {
                for (var animationIndex = 0; animationIndex < parsedLight.animations.length; animationIndex++) {
                    var parsedAnimation = parsedLight.animations[animationIndex];
                    light.animations.push(LIB.Animation.Parse(parsedAnimation));
                }
                LIB.Node.ParseAnimationRanges(light, parsedLight, scene);
            }
            if (parsedLight.autoAnimate) {
                scene.beginAnimation(light, parsedLight.autoAnimateFrom, parsedLight.autoAnimateTo, parsedLight.autoAnimateLoop, parsedLight.autoAnimateSpeed || 1.0);
            }
            return light;
        };
        Light.prototype._hookArrayForExcluded = function (array) {
            var _this = this;
            var oldPush = array.push;
            array.push = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i] = arguments[_i];
                }
                var result = oldPush.apply(array, items);
                for (var _a = 0, items_1 = items; _a < items_1.length; _a++) {
                    var item = items_1[_a];
                    item._resyncLighSource(_this);
                }
                return result;
            };
            var oldSplice = array.splice;
            array.splice = function (index, deleteCount) {
                var deleted = oldSplice.apply(array, [index, deleteCount]);
                for (var _i = 0, deleted_1 = deleted; _i < deleted_1.length; _i++) {
                    var item = deleted_1[_i];
                    item._resyncLighSource(_this);
                }
                return deleted;
            };
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var item = array_1[_i];
                item._resyncLighSource(this);
            }
        };
        Light.prototype._hookArrayForIncludedOnly = function (array) {
            var _this = this;
            var oldPush = array.push;
            array.push = function () {
                var items = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    items[_i] = arguments[_i];
                }
                var result = oldPush.apply(array, items);
                _this._resyncMeshes();
                return result;
            };
            var oldSplice = array.splice;
            array.splice = function (index, deleteCount) {
                var deleted = oldSplice.apply(array, [index, deleteCount]);
                _this._resyncMeshes();
                return deleted;
            };
            this._resyncMeshes();
        };
        Light.prototype._resyncMeshes = function () {
            for (var _i = 0, _a = this.getScene().meshes; _i < _a.length; _i++) {
                var mesh = _a[_i];
                mesh._resyncLighSource(this);
            }
        };
        /**
         * Forces the meshes to update their light related information in their rendering used effects
         * @hidden Internal Use Only
         */
        Light.prototype._markMeshesAsLightDirty = function () {
            for (var _i = 0, _a = this.getScene().meshes; _i < _a.length; _i++) {
                var mesh = _a[_i];
                if (mesh._lightSources.indexOf(this) !== -1) {
                    mesh._markSubMeshesAsLightDirty();
                }
            }
        };
        /**
         * Recomputes the cached photometric scale if needed.
         */
        Light.prototype._computePhotometricScale = function () {
            this._photometricScale = this._getPhotometricScale();
            this.getScene().resetCachedMaterial();
        };
        /**
         * Returns the Photometric Scale according to the light type and intensity mode.
         */
        Light.prototype._getPhotometricScale = function () {
            var photometricScale = 0.0;
            var lightTypeID = this.getTypeID();
            //get photometric mode
            var photometricMode = this.intensityMode;
            if (photometricMode === Light.INTENSITYMODE_AUTOMATIC) {
                if (lightTypeID === Light.LIGHTTYPEID_DIRECTIONALLIGHT) {
                    photometricMode = Light.INTENSITYMODE_ILLUMINANCE;
                }
                else {
                    photometricMode = Light.INTENSITYMODE_LUMINOUSINTENSITY;
                }
            }
            //compute photometric scale
            switch (lightTypeID) {
                case Light.LIGHTTYPEID_POINTLIGHT:
                case Light.LIGHTTYPEID_SPOTLIGHT:
                    switch (photometricMode) {
                        case Light.INTENSITYMODE_LUMINOUSPOWER:
                            photometricScale = 1.0 / (4.0 * Math.PI);
                            break;
                        case Light.INTENSITYMODE_LUMINOUSINTENSITY:
                            photometricScale = 1.0;
                            break;
                        case Light.INTENSITYMODE_LUMINANCE:
                            photometricScale = this.radius * this.radius;
                            break;
                    }
                    break;
                case Light.LIGHTTYPEID_DIRECTIONALLIGHT:
                    switch (photometricMode) {
                        case Light.INTENSITYMODE_ILLUMINANCE:
                            photometricScale = 1.0;
                            break;
                        case Light.INTENSITYMODE_LUMINANCE:
                            // When radius (and therefore solid angle) is non-zero a directional lights brightness can be specified via central (peak) luminance.
                            // For a directional light the 'radius' defines the angular radius (in radians) rather than world-space radius (e.g. in metres).
                            var apexAngleRadians = this.radius;
                            // Impose a minimum light angular size to avoid the light becoming an infinitely small angular light source (i.e. a dirac delta function).
                            apexAngleRadians = Math.max(apexAngleRadians, 0.001);
                            var solidAngle = 2.0 * Math.PI * (1.0 - Math.cos(apexAngleRadians));
                            photometricScale = solidAngle;
                            break;
                    }
                    break;
                case Light.LIGHTTYPEID_HEMISPHERICLIGHT:
                    // No fall off in hemisperic light.
                    photometricScale = 1.0;
                    break;
            }
            return photometricScale;
        };
        /**
         * Reorder the light in the scene according to their defined priority.
         * @hidden Internal Use Only
         */
        Light.prototype._reorderLightsInScene = function () {
            var scene = this.getScene();
            if (this._renderPriority != 0) {
                scene.requireLightSorting = true;
            }
            this.getScene().sortLightsByPriority();
        };
        //lightmapMode Consts
        Light._LIGHTMAP_DEFAULT = 0;
        Light._LIGHTMAP_SPECULAR = 1;
        Light._LIGHTMAP_SHADOWSONLY = 2;
        // Intensity Mode Consts
        Light._INTENSITYMODE_AUTOMATIC = 0;
        Light._INTENSITYMODE_LUMINOUSPOWER = 1;
        Light._INTENSITYMODE_LUMINOUSINTENSITY = 2;
        Light._INTENSITYMODE_ILLUMINANCE = 3;
        Light._INTENSITYMODE_LUMINANCE = 4;
        // Light types ids const.
        Light._LIGHTTYPEID_POINTLIGHT = 0;
        Light._LIGHTTYPEID_DIRECTIONALLIGHT = 1;
        Light._LIGHTTYPEID_SPOTLIGHT = 2;
        Light._LIGHTTYPEID_HEMISPHERICLIGHT = 3;
        __decorate([
            LIB.serializeAsColor3()
        ], Light.prototype, "diffuse", void 0);
        __decorate([
            LIB.serializeAsColor3()
        ], Light.prototype, "specular", void 0);
        __decorate([
            LIB.serialize()
        ], Light.prototype, "intensity", void 0);
        __decorate([
            LIB.serialize()
        ], Light.prototype, "range", void 0);
        __decorate([
            LIB.serialize()
        ], Light.prototype, "intensityMode", null);
        __decorate([
            LIB.serialize()
        ], Light.prototype, "radius", null);
        __decorate([
            LIB.serialize()
        ], Light.prototype, "_renderPriority", void 0);
        __decorate([
            LIB.expandToProperty("_reorderLightsInScene")
        ], Light.prototype, "renderPriority", void 0);
        __decorate([
            LIB.serialize()
        ], Light.prototype, "shadowEnabled", void 0);
        __decorate([
            LIB.serialize("excludeWithLayerMask")
        ], Light.prototype, "_excludeWithLayerMask", void 0);
        __decorate([
            LIB.serialize("includeOnlyWithLayerMask")
        ], Light.prototype, "_includeOnlyWithLayerMask", void 0);
        __decorate([
            LIB.serialize("lightmapMode")
        ], Light.prototype, "_lightmapMode", void 0);
        return Light;
    }(LIB.Node));
    LIB.Light = Light;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.light.js.map
//# sourceMappingURL=LIB.light.js.map
