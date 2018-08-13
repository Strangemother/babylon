
var LIB;
(function (LIB) {
    var PhysicsHelper = /** @class */ (function () {
        function PhysicsHelper(scene) {
            this._scene = scene;
            this._physicsEngine = this._scene.getPhysicsEngine();
            if (!this._physicsEngine) {
                LIB.Tools.Warn('Physics engine not enabled. Please enable the physics before you can use the methods.');
            }
        }
        /**
         * @param {Vector3} origin the origin of the explosion
         * @param {number} radius the explosion radius
         * @param {number} strength the explosion strength
         * @param {PhysicsRadialImpulseFalloff} falloff possible options: Constant & Linear. Defaults to Constant
         */
        PhysicsHelper.prototype.applyRadialExplosionImpulse = function (origin, radius, strength, falloff) {
            if (falloff === void 0) { falloff = PhysicsRadialImpulseFalloff.Constant; }
            if (!this._physicsEngine) {
                LIB.Tools.Warn('Physics engine not enabled. Please enable the physics before you call this method.');
                return null;
            }
            var impostors = this._physicsEngine.getImpostors();
            if (impostors.length === 0) {
                return null;
            }
            var event = new PhysicsRadialExplosionEvent(this._scene);
            impostors.forEach(function (impostor) {
                var impostorForceAndContactPoint = event.getImpostorForceAndContactPoint(impostor, origin, radius, strength, falloff);
                if (!impostorForceAndContactPoint) {
                    return;
                }
                impostor.applyImpulse(impostorForceAndContactPoint.force, impostorForceAndContactPoint.contactPoint);
            });
            event.dispose(false);
            return event;
        };
        /**
         * @param {Vector3} origin the origin of the explosion
         * @param {number} radius the explosion radius
         * @param {number} strength the explosion strength
         * @param {PhysicsRadialImpulseFalloff} falloff possible options: Constant & Linear. Defaults to Constant
         */
        PhysicsHelper.prototype.applyRadialExplosionForce = function (origin, radius, strength, falloff) {
            if (falloff === void 0) { falloff = PhysicsRadialImpulseFalloff.Constant; }
            if (!this._physicsEngine) {
                LIB.Tools.Warn('Physics engine not enabled. Please enable the physics before you call the PhysicsHelper.');
                return null;
            }
            var impostors = this._physicsEngine.getImpostors();
            if (impostors.length === 0) {
                return null;
            }
            var event = new PhysicsRadialExplosionEvent(this._scene);
            impostors.forEach(function (impostor) {
                var impostorForceAndContactPoint = event.getImpostorForceAndContactPoint(impostor, origin, radius, strength, falloff);
                if (!impostorForceAndContactPoint) {
                    return;
                }
                impostor.applyForce(impostorForceAndContactPoint.force, impostorForceAndContactPoint.contactPoint);
            });
            event.dispose(false);
            return event;
        };
        /**
         * @param {Vector3} origin the origin of the explosion
         * @param {number} radius the explosion radius
         * @param {number} strength the explosion strength
         * @param {PhysicsRadialImpulseFalloff} falloff possible options: Constant & Linear. Defaults to Constant
         */
        PhysicsHelper.prototype.gravitationalField = function (origin, radius, strength, falloff) {
            if (falloff === void 0) { falloff = PhysicsRadialImpulseFalloff.Constant; }
            if (!this._physicsEngine) {
                LIB.Tools.Warn('Physics engine not enabled. Please enable the physics before you call the PhysicsHelper.');
                return null;
            }
            var impostors = this._physicsEngine.getImpostors();
            if (impostors.length === 0) {
                return null;
            }
            var event = new PhysicsGravitationalFieldEvent(this, this._scene, origin, radius, strength, falloff);
            event.dispose(false);
            return event;
        };
        /**
         * @param {Vector3} origin the origin of the updraft
         * @param {number} radius the radius of the updraft
         * @param {number} strength the strength of the updraft
         * @param {number} height the height of the updraft
         * @param {PhysicsUpdraftMode} updraftMode possible options: Center & Perpendicular. Defaults to Center
         */
        PhysicsHelper.prototype.updraft = function (origin, radius, strength, height, updraftMode) {
            if (updraftMode === void 0) { updraftMode = PhysicsUpdraftMode.Center; }
            if (!this._physicsEngine) {
                LIB.Tools.Warn('Physics engine not enabled. Please enable the physics before you call the PhysicsHelper.');
                return null;
            }
            if (this._physicsEngine.getImpostors().length === 0) {
                return null;
            }
            var event = new PhysicsUpdraftEvent(this._scene, origin, radius, strength, height, updraftMode);
            event.dispose(false);
            return event;
        };
        /**
         * @param {Vector3} origin the of the vortex
         * @param {number} radius the radius of the vortex
         * @param {number} strength the strength of the vortex
         * @param {number} height   the height of the vortex
         */
        PhysicsHelper.prototype.vortex = function (origin, radius, strength, height) {
            if (!this._physicsEngine) {
                LIB.Tools.Warn('Physics engine not enabled. Please enable the physics before you call the PhysicsHelper.');
                return null;
            }
            if (this._physicsEngine.getImpostors().length === 0) {
                return null;
            }
            var event = new PhysicsVortexEvent(this._scene, origin, radius, strength, height);
            event.dispose(false);
            return event;
        };
        return PhysicsHelper;
    }());
    LIB.PhysicsHelper = PhysicsHelper;
    /***** Radial explosion *****/
    var PhysicsRadialExplosionEvent = /** @class */ (function () {
        function PhysicsRadialExplosionEvent(scene) {
            this._sphereOptions = { segments: 32, diameter: 1 }; // TODO: make configurable
            this._rays = [];
            this._dataFetched = false; // check if the data has been fetched. If not, do cleanup
            this._scene = scene;
        }
        /**
         * Returns the data related to the radial explosion event (sphere & rays).
         * @returns {PhysicsRadialExplosionEventData}
         */
        PhysicsRadialExplosionEvent.prototype.getData = function () {
            this._dataFetched = true;
            return {
                sphere: this._sphere,
                rays: this._rays,
            };
        };
        /**
         * Returns the force and contact point of the impostor or false, if the impostor is not affected by the force/impulse.
         * @param impostor
         * @param {Vector3} origin the origin of the explosion
         * @param {number} radius the explosion radius
         * @param {number} strength the explosion strength
         * @param {PhysicsRadialImpulseFalloff} falloff possible options: Constant & Linear
         * @returns {Nullable<PhysicsForceAndContactPoint>}
         */
        PhysicsRadialExplosionEvent.prototype.getImpostorForceAndContactPoint = function (impostor, origin, radius, strength, falloff) {
            if (impostor.mass === 0) {
                return null;
            }
            if (!this._intersectsWithSphere(impostor, origin, radius)) {
                return null;
            }
            if (impostor.object.getClassName() !== 'Mesh' && impostor.object.getClassName() !== 'InstancedMesh') {
                return null;
            }
            var impostorObjectCenter = impostor.getObjectCenter();
            var direction = impostorObjectCenter.subtract(origin);
            var ray = new LIB.Ray(origin, direction, radius);
            this._rays.push(ray);
            var hit = ray.intersectsMesh(impostor.object);
            var contactPoint = hit.pickedPoint;
            if (!contactPoint) {
                return null;
            }
            var distanceFromOrigin = LIB.Vector3.Distance(origin, contactPoint);
            if (distanceFromOrigin > radius) {
                return null;
            }
            var multiplier = falloff === PhysicsRadialImpulseFalloff.Constant
                ? strength
                : strength * (1 - (distanceFromOrigin / radius));
            var force = direction.multiplyByFloats(multiplier, multiplier, multiplier);
            return { force: force, contactPoint: contactPoint };
        };
        /**
         * Disposes the sphere.
         * @param {bolean} force
         */
        PhysicsRadialExplosionEvent.prototype.dispose = function (force) {
            var _this = this;
            if (force === void 0) { force = true; }
            if (force) {
                this._sphere.dispose();
            }
            else {
                setTimeout(function () {
                    if (!_this._dataFetched) {
                        _this._sphere.dispose();
                    }
                }, 0);
            }
        };
        /*** Helpers ***/
        PhysicsRadialExplosionEvent.prototype._prepareSphere = function () {
            if (!this._sphere) {
                this._sphere = LIB.MeshBuilder.CreateSphere("radialExplosionEventSphere", this._sphereOptions, this._scene);
                this._sphere.isVisible = false;
            }
        };
        PhysicsRadialExplosionEvent.prototype._intersectsWithSphere = function (impostor, origin, radius) {
            var impostorObject = impostor.object;
            this._prepareSphere();
            this._sphere.position = origin;
            this._sphere.scaling = new LIB.Vector3(radius * 2, radius * 2, radius * 2);
            this._sphere._updateBoundingInfo();
            this._sphere.computeWorldMatrix(true);
            return this._sphere.intersectsMesh(impostorObject, true);
        };
        return PhysicsRadialExplosionEvent;
    }());
    LIB.PhysicsRadialExplosionEvent = PhysicsRadialExplosionEvent;
    /***** Gravitational Field *****/
    var PhysicsGravitationalFieldEvent = /** @class */ (function () {
        function PhysicsGravitationalFieldEvent(physicsHelper, scene, origin, radius, strength, falloff) {
            if (falloff === void 0) { falloff = PhysicsRadialImpulseFalloff.Constant; }
            this._dataFetched = false; // check if the has been fetched the data. If not, do cleanup
            this._physicsHelper = physicsHelper;
            this._scene = scene;
            this._origin = origin;
            this._radius = radius;
            this._strength = strength;
            this._falloff = falloff;
            this._tickCallback = this._tick.bind(this);
        }
        /**
         * Returns the data related to the gravitational field event (sphere).
         * @returns {PhysicsGravitationalFieldEventData}
         */
        PhysicsGravitationalFieldEvent.prototype.getData = function () {
            this._dataFetched = true;
            return {
                sphere: this._sphere,
            };
        };
        /**
         * Enables the gravitational field.
         */
        PhysicsGravitationalFieldEvent.prototype.enable = function () {
            this._tickCallback.call(this);
            this._scene.registerBeforeRender(this._tickCallback);
        };
        /**
         * Disables the gravitational field.
         */
        PhysicsGravitationalFieldEvent.prototype.disable = function () {
            this._scene.unregisterBeforeRender(this._tickCallback);
        };
        /**
         * Disposes the sphere.
         * @param {bolean} force
         */
        PhysicsGravitationalFieldEvent.prototype.dispose = function (force) {
            var _this = this;
            if (force === void 0) { force = true; }
            if (force) {
                this._sphere.dispose();
            }
            else {
                setTimeout(function () {
                    if (!_this._dataFetched) {
                        _this._sphere.dispose();
                    }
                }, 0);
            }
        };
        PhysicsGravitationalFieldEvent.prototype._tick = function () {
            // Since the params won't change, we fetch the event only once
            if (this._sphere) {
                this._physicsHelper.applyRadialExplosionForce(this._origin, this._radius, this._strength * -1, this._falloff);
            }
            else {
                var radialExplosionEvent = this._physicsHelper.applyRadialExplosionForce(this._origin, this._radius, this._strength * -1, this._falloff);
                if (radialExplosionEvent) {
                    this._sphere = radialExplosionEvent.getData().sphere.clone('radialExplosionEventSphereClone');
                }
            }
        };
        return PhysicsGravitationalFieldEvent;
    }());
    LIB.PhysicsGravitationalFieldEvent = PhysicsGravitationalFieldEvent;
    /***** Updraft *****/
    var PhysicsUpdraftEvent = /** @class */ (function () {
        function PhysicsUpdraftEvent(_scene, _origin, _radius, _strength, _height, _updraftMode) {
            this._scene = _scene;
            this._origin = _origin;
            this._radius = _radius;
            this._strength = _strength;
            this._height = _height;
            this._updraftMode = _updraftMode;
            this._originTop = LIB.Vector3.Zero(); // the most upper part of the cylinder
            this._originDirection = LIB.Vector3.Zero(); // used if the updraftMode is perpendicular
            this._cylinderPosition = LIB.Vector3.Zero(); // to keep the cylinders position, because normally the origin is in the center and not on the bottom
            this._dataFetched = false; // check if the has been fetched the data. If not, do cleanup
            this._physicsEngine = this._scene.getPhysicsEngine();
            this._origin.addToRef(new LIB.Vector3(0, this._height / 2, 0), this._cylinderPosition);
            this._origin.addToRef(new LIB.Vector3(0, this._height, 0), this._originTop);
            if (this._updraftMode === PhysicsUpdraftMode.Perpendicular) {
                this._originDirection = this._origin.subtract(this._originTop).normalize();
            }
            this._tickCallback = this._tick.bind(this);
        }
        /**
         * Returns the data related to the updraft event (cylinder).
         * @returns {PhysicsUpdraftEventData}
         */
        PhysicsUpdraftEvent.prototype.getData = function () {
            this._dataFetched = true;
            return {
                cylinder: this._cylinder,
            };
        };
        /**
         * Enables the updraft.
         */
        PhysicsUpdraftEvent.prototype.enable = function () {
            this._tickCallback.call(this);
            this._scene.registerBeforeRender(this._tickCallback);
        };
        /**
         * Disables the cortex.
         */
        PhysicsUpdraftEvent.prototype.disable = function () {
            this._scene.unregisterBeforeRender(this._tickCallback);
        };
        /**
         * Disposes the sphere.
         * @param {bolean} force
         */
        PhysicsUpdraftEvent.prototype.dispose = function (force) {
            var _this = this;
            if (force === void 0) { force = true; }
            if (force) {
                this._cylinder.dispose();
            }
            else {
                setTimeout(function () {
                    if (!_this._dataFetched) {
                        _this._cylinder.dispose();
                    }
                }, 0);
            }
        };
        PhysicsUpdraftEvent.prototype.getImpostorForceAndContactPoint = function (impostor) {
            if (impostor.mass === 0) {
                return null;
            }
            if (!this._intersectsWithCylinder(impostor)) {
                return null;
            }
            var impostorObjectCenter = impostor.getObjectCenter();
            if (this._updraftMode === PhysicsUpdraftMode.Perpendicular) {
                var direction = this._originDirection;
            }
            else {
                var direction = impostorObjectCenter.subtract(this._originTop);
            }
            var multiplier = this._strength * -1;
            var force = direction.multiplyByFloats(multiplier, multiplier, multiplier);
            return { force: force, contactPoint: impostorObjectCenter };
        };
        PhysicsUpdraftEvent.prototype._tick = function () {
            var _this = this;
            this._physicsEngine.getImpostors().forEach(function (impostor) {
                var impostorForceAndContactPoint = _this.getImpostorForceAndContactPoint(impostor);
                if (!impostorForceAndContactPoint) {
                    return;
                }
                impostor.applyForce(impostorForceAndContactPoint.force, impostorForceAndContactPoint.contactPoint);
            });
        };
        /*** Helpers ***/
        PhysicsUpdraftEvent.prototype._prepareCylinder = function () {
            if (!this._cylinder) {
                this._cylinder = LIB.MeshBuilder.CreateCylinder("updraftEventCylinder", {
                    height: this._height,
                    diameter: this._radius * 2,
                }, this._scene);
                this._cylinder.isVisible = false;
            }
        };
        PhysicsUpdraftEvent.prototype._intersectsWithCylinder = function (impostor) {
            var impostorObject = impostor.object;
            this._prepareCylinder();
            this._cylinder.position = this._cylinderPosition;
            return this._cylinder.intersectsMesh(impostorObject, true);
        };
        return PhysicsUpdraftEvent;
    }());
    LIB.PhysicsUpdraftEvent = PhysicsUpdraftEvent;
    /***** Vortex *****/
    var PhysicsVortexEvent = /** @class */ (function () {
        function PhysicsVortexEvent(_scene, _origin, _radius, _strength, _height) {
            this._scene = _scene;
            this._origin = _origin;
            this._radius = _radius;
            this._strength = _strength;
            this._height = _height;
            this._originTop = LIB.Vector3.Zero(); // the most upper part of the cylinder
            this._centripetalForceThreshold = 0.7; // at which distance, relative to the radius the centripetal forces should kick in
            this._updraftMultiplier = 0.02;
            this._cylinderPosition = LIB.Vector3.Zero(); // to keep the cylinders position, because normally the origin is in the center and not on the bottom
            this._dataFetched = false; // check if the has been fetched the data. If not, do cleanup
            this._physicsEngine = this._scene.getPhysicsEngine();
            this._origin.addToRef(new LIB.Vector3(0, this._height / 2, 0), this._cylinderPosition);
            this._origin.addToRef(new LIB.Vector3(0, this._height, 0), this._originTop);
            this._tickCallback = this._tick.bind(this);
        }
        /**
         * Returns the data related to the vortex event (cylinder).
         * @returns {PhysicsVortexEventData}
         */
        PhysicsVortexEvent.prototype.getData = function () {
            this._dataFetched = true;
            return {
                cylinder: this._cylinder,
            };
        };
        /**
         * Enables the vortex.
         */
        PhysicsVortexEvent.prototype.enable = function () {
            this._tickCallback.call(this);
            this._scene.registerBeforeRender(this._tickCallback);
        };
        /**
         * Disables the cortex.
         */
        PhysicsVortexEvent.prototype.disable = function () {
            this._scene.unregisterBeforeRender(this._tickCallback);
        };
        /**
         * Disposes the sphere.
         * @param {bolean} force
         */
        PhysicsVortexEvent.prototype.dispose = function (force) {
            var _this = this;
            if (force === void 0) { force = true; }
            if (force) {
                this._cylinder.dispose();
            }
            else {
                setTimeout(function () {
                    if (!_this._dataFetched) {
                        _this._cylinder.dispose();
                    }
                }, 0);
            }
        };
        PhysicsVortexEvent.prototype.getImpostorForceAndContactPoint = function (impostor) {
            if (impostor.mass === 0) {
                return null;
            }
            if (!this._intersectsWithCylinder(impostor)) {
                return null;
            }
            if (impostor.object.getClassName() !== 'Mesh' && impostor.object.getClassName() !== 'InstancedMesh') {
                return null;
            }
            var impostorObjectCenter = impostor.getObjectCenter();
            var originOnPlane = new LIB.Vector3(this._origin.x, impostorObjectCenter.y, this._origin.z); // the distance to the origin as if both objects were on a plane (Y-axis)
            var originToImpostorDirection = impostorObjectCenter.subtract(originOnPlane);
            var ray = new LIB.Ray(originOnPlane, originToImpostorDirection, this._radius);
            var hit = ray.intersectsMesh(impostor.object);
            var contactPoint = hit.pickedPoint;
            if (!contactPoint) {
                return null;
            }
            var absoluteDistanceFromOrigin = hit.distance / this._radius;
            var perpendicularDirection = LIB.Vector3.Cross(originOnPlane, impostorObjectCenter).normalize();
            var directionToOrigin = contactPoint.normalize();
            if (absoluteDistanceFromOrigin > this._centripetalForceThreshold) {
                directionToOrigin = directionToOrigin.negate();
            }
            // TODO: find a more physically based solution
            if (absoluteDistanceFromOrigin > this._centripetalForceThreshold) {
                var forceX = directionToOrigin.x * this._strength / 8;
                var forceY = directionToOrigin.y * this._updraftMultiplier;
                var forceZ = directionToOrigin.z * this._strength / 8;
            }
            else {
                var forceX = (perpendicularDirection.x + directionToOrigin.x) / 2;
                var forceY = this._originTop.y * this._updraftMultiplier;
                var forceZ = (perpendicularDirection.z + directionToOrigin.z) / 2;
            }
            var force = new LIB.Vector3(forceX, forceY, forceZ);
            force = force.multiplyByFloats(this._strength, this._strength, this._strength);
            return { force: force, contactPoint: impostorObjectCenter };
        };
        PhysicsVortexEvent.prototype._tick = function () {
            var _this = this;
            this._physicsEngine.getImpostors().forEach(function (impostor) {
                var impostorForceAndContactPoint = _this.getImpostorForceAndContactPoint(impostor);
                if (!impostorForceAndContactPoint) {
                    return;
                }
                impostor.applyForce(impostorForceAndContactPoint.force, impostorForceAndContactPoint.contactPoint);
            });
        };
        /*** Helpers ***/
        PhysicsVortexEvent.prototype._prepareCylinder = function () {
            if (!this._cylinder) {
                this._cylinder = LIB.MeshBuilder.CreateCylinder("vortexEventCylinder", {
                    height: this._height,
                    diameter: this._radius * 2,
                }, this._scene);
                this._cylinder.isVisible = false;
            }
        };
        PhysicsVortexEvent.prototype._intersectsWithCylinder = function (impostor) {
            var impostorObject = impostor.object;
            this._prepareCylinder();
            this._cylinder.position = this._cylinderPosition;
            return this._cylinder.intersectsMesh(impostorObject, true);
        };
        return PhysicsVortexEvent;
    }());
    LIB.PhysicsVortexEvent = PhysicsVortexEvent;
    /***** Enums *****/
    /**
    * The strenght of the force in correspondence to the distance of the affected object
    */
    var PhysicsRadialImpulseFalloff;
    (function (PhysicsRadialImpulseFalloff) {
        /** Defines that impulse is constant in strength across it's whole radius */
        PhysicsRadialImpulseFalloff[PhysicsRadialImpulseFalloff["Constant"] = 0] = "Constant";
        /** DEfines that impulse gets weaker if it's further from the origin */
        PhysicsRadialImpulseFalloff[PhysicsRadialImpulseFalloff["Linear"] = 1] = "Linear";
    })(PhysicsRadialImpulseFalloff = LIB.PhysicsRadialImpulseFalloff || (LIB.PhysicsRadialImpulseFalloff = {}));
    /**
     * The strenght of the force in correspondence to the distance of the affected object
     */
    var PhysicsUpdraftMode;
    (function (PhysicsUpdraftMode) {
        /** Defines that the upstream forces will pull towards the top center of the cylinder */
        PhysicsUpdraftMode[PhysicsUpdraftMode["Center"] = 0] = "Center";
        /** Defines that once a impostor is inside the cylinder, it will shoot out perpendicular from the ground of the cylinder */
        PhysicsUpdraftMode[PhysicsUpdraftMode["Perpendicular"] = 1] = "Perpendicular";
    })(PhysicsUpdraftMode = LIB.PhysicsUpdraftMode || (LIB.PhysicsUpdraftMode = {}));
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.physicsHelper.js.map
//# sourceMappingURL=LIB.physicsHelper.js.map
