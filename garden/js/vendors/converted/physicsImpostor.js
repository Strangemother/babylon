(function (LIB) {
    var PhysicsImpostor = /** @class */ (function () {
        function PhysicsImpostor(object, type, _options, _scene) {
            if (_options === void 0) { _options = { mass: 0 }; }
            var _this = this;
            this.object = object;
            this.type = type;
            this._options = _options;
            this._scene = _scene;
            this._bodyUpdateRequired = false;
            this._onBeforePhysicsStepCallbacks = new Array();
            this._onAfterPhysicsStepCallbacks = new Array();
            this._onPhysicsCollideCallbacks = [];
            this._deltaPosition = LIB.Vector3.Zero();
            this._isDisposed = false;
            //temp variables for parent rotation calculations
            //private _mats: Array<Matrix> = [new Matrix(), new Matrix()];
            this._tmpQuat = new LIB.Quaternion();
            this._tmpQuat2 = new LIB.Quaternion();
            /**
             * this function is executed by the physics engine.
             */
            this.beforeStep = function () {
                if (!_this._physicsEngine) {
                    return;
                }
                _this.object.translate(_this._deltaPosition, -1);
                _this._deltaRotationConjugated && _this.object.rotationQuaternion && _this.object.rotationQuaternion.multiplyToRef(_this._deltaRotationConjugated, _this.object.rotationQuaternion);
                _this.object.computeWorldMatrix(false);
                if (_this.object.parent && _this.object.rotationQuaternion) {
                    _this.getParentsRotation();
                    _this._tmpQuat.multiplyToRef(_this.object.rotationQuaternion, _this._tmpQuat);
                }
                else {
                    _this._tmpQuat.copyFrom(_this.object.rotationQuaternion || new LIB.Quaternion());
                }
                if (!_this._options.disableBidirectionalTransformation) {
                    _this.object.rotationQuaternion && _this._physicsEngine.getPhysicsPlugin().setPhysicsBodyTransformation(_this, /*bInfo.boundingBox.centerWorld*/ _this.object.getAbsolutePivotPoint(), _this._tmpQuat);
                }
                _this._onBeforePhysicsStepCallbacks.forEach(function (func) {
                    func(_this);
                });
            };
            /**
             * this function is executed by the physics engine.
             */
            this.afterStep = function () {
                if (!_this._physicsEngine) {
                    return;
                }
                _this._onAfterPhysicsStepCallbacks.forEach(function (func) {
                    func(_this);
                });
                _this._physicsEngine.getPhysicsPlugin().setTransformationFromPhysicsBody(_this);
                // object has now its world rotation. needs to be converted to local.
                if (_this.object.parent && _this.object.rotationQuaternion) {
                    _this.getParentsRotation();
                    _this._tmpQuat.conjugateInPlace();
                    _this._tmpQuat.multiplyToRef(_this.object.rotationQuaternion, _this.object.rotationQuaternion);
                }
                // take the position set and make it the absolute position of this object.
                _this.object.setAbsolutePosition(_this.object.position);
                _this._deltaRotation && _this.object.rotationQuaternion && _this.object.rotationQuaternion.multiplyToRef(_this._deltaRotation, _this.object.rotationQuaternion);
                _this.object.translate(_this._deltaPosition, 1);
            };
            /**
             * Legacy collision detection event support
             */
            this.onCollideEvent = null;
            //event and body object due to cannon's event-based architecture.
            this.onCollide = function (e) {
                if (!_this._onPhysicsCollideCallbacks.length && !_this.onCollideEvent) {
                    return;
                }
                if (!_this._physicsEngine) {
                    return;
                }
                var otherImpostor = _this._physicsEngine.getImpostorWithPhysicsBody(e.body);
                if (otherImpostor) {
                    // Legacy collision detection event support
                    if (_this.onCollideEvent) {
                        _this.onCollideEvent(_this, otherImpostor);
                    }
                    _this._onPhysicsCollideCallbacks.filter(function (obj) {
                        return obj.otherImpostors.indexOf(otherImpostor) !== -1;
                    }).forEach(function (obj) {
                        obj.callback(_this, otherImpostor);
                    });
                }
            };
            //sanity check!
            if (!this.object) {
                LIB.Tools.Error("No object was provided. A physics object is obligatory");
                return;
            }
            //legacy support for old syntax.
            if (!this._scene && object.getScene) {
                this._scene = object.getScene();
            }
            if (!this._scene) {
                return;
            }
            this._physicsEngine = this._scene.getPhysicsEngine();
            if (!this._physicsEngine) {
                LIB.Tools.Error("Physics not enabled. Please use scene.enablePhysics(...) before creating impostors.");
            }
            else {
                //set the object's quaternion, if not set
                if (!this.object.rotationQuaternion) {
                    if (this.object.rotation) {
                        this.object.rotationQuaternion = LIB.Quaternion.RotationYawPitchRoll(this.object.rotation.y, this.object.rotation.x, this.object.rotation.z);
                    }
                    else {
                        this.object.rotationQuaternion = new LIB.Quaternion();
                    }
                }
                //default options params
                this._options.mass = (_options.mass === void 0) ? 0 : _options.mass;
                this._options.friction = (_options.friction === void 0) ? 0.2 : _options.friction;
                this._options.restitution = (_options.restitution === void 0) ? 0.2 : _options.restitution;
                this._joints = [];
                //If the mesh has a parent, don't initialize the physicsBody. Instead wait for the parent to do that.
                if (!this.object.parent || this._options.ignoreParent) {
                    this._init();
                }
                else if (this.object.parent.physicsImpostor) {
                    LIB.Tools.Warn("You must affect impostors to children before affecting impostor to parent.");
                }
            }
        }
        Object.defineProperty(PhysicsImpostor.prototype, "isDisposed", {
            get: function () {
                return this._isDisposed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhysicsImpostor.prototype, "mass", {
            get: function () {
                return this._physicsEngine ? this._physicsEngine.getPhysicsPlugin().getBodyMass(this) : 0;
            },
            set: function (value) {
                this.setMass(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhysicsImpostor.prototype, "friction", {
            get: function () {
                return this._physicsEngine ? this._physicsEngine.getPhysicsPlugin().getBodyFriction(this) : 0;
            },
            set: function (value) {
                if (!this._physicsEngine) {
                    return;
                }
                this._physicsEngine.getPhysicsPlugin().setBodyFriction(this, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhysicsImpostor.prototype, "restitution", {
            get: function () {
                return this._physicsEngine ? this._physicsEngine.getPhysicsPlugin().getBodyRestitution(this) : 0;
            },
            set: function (value) {
                if (!this._physicsEngine) {
                    return;
                }
                this._physicsEngine.getPhysicsPlugin().setBodyRestitution(this, value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * This function will completly initialize this impostor.
         * It will create a new body - but only if this mesh has no parent.
         * If it has, this impostor will not be used other than to define the impostor
         * of the child mesh.
         */
        PhysicsImpostor.prototype._init = function () {
            if (!this._physicsEngine) {
                return;
            }
            this._physicsEngine.removeImpostor(this);
            this.physicsBody = null;
            this._parent = this._parent || this._getPhysicsParent();
            if (!this._isDisposed && (!this.parent || this._options.ignoreParent)) {
                this._physicsEngine.addImpostor(this);
            }
        };
        PhysicsImpostor.prototype._getPhysicsParent = function () {
            if (this.object.parent instanceof LIB.AbstractMesh) {
                var parentMesh = this.object.parent;
                return parentMesh.physicsImpostor;
            }
            return null;
        };
        /**
         * Should a new body be generated.
         */
        PhysicsImpostor.prototype.isBodyInitRequired = function () {
            return this._bodyUpdateRequired || (!this._physicsBody && !this._parent);
        };
        PhysicsImpostor.prototype.setScalingUpdated = function (updated) {
            this.forceUpdate();
        };
        /**
         * Force a regeneration of this or the parent's impostor's body.
         * Use under cautious - This will remove all joints already implemented.
         */
        PhysicsImpostor.prototype.forceUpdate = function () {
            this._init();
            if (this.parent && !this._options.ignoreParent) {
                this.parent.forceUpdate();
            }
        };
        Object.defineProperty(PhysicsImpostor.prototype, "physicsBody", {
            /*public get mesh(): AbstractMesh {
                return this._mesh;
            }*/
            /**
             * Gets the body that holds this impostor. Either its own, or its parent.
             */
            get: function () {
                return (this._parent && !this._options.ignoreParent) ? this._parent.physicsBody : this._physicsBody;
            },
            /**
             * Set the physics body. Used mainly by the physics engine/plugin
             */
            set: function (physicsBody) {
                if (this._physicsBody && this._physicsEngine) {
                    this._physicsEngine.getPhysicsPlugin().removePhysicsBody(this);
                }
                this._physicsBody = physicsBody;
                this.resetUpdateFlags();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhysicsImpostor.prototype, "parent", {
            get: function () {
                return !this._options.ignoreParent && this._parent ? this._parent : null;
            },
            set: function (value) {
                this._parent = value;
            },
            enumerable: true,
            configurable: true
        });
        PhysicsImpostor.prototype.resetUpdateFlags = function () {
            this._bodyUpdateRequired = false;
        };
        PhysicsImpostor.prototype.getObjectExtendSize = function () {
            if (this.object.getBoundingInfo) {
                var q = this.object.rotationQuaternion;
                //reset rotation
                this.object.rotationQuaternion = PhysicsImpostor.IDENTITY_QUATERNION;
                //calculate the world matrix with no rotation
                this.object.computeWorldMatrix && this.object.computeWorldMatrix(true);
                var boundingInfo = this.object.getBoundingInfo();
                var size = boundingInfo.boundingBox.extendSizeWorld.scale(2);
                //bring back the rotation
                this.object.rotationQuaternion = q;
                //calculate the world matrix with the new rotation
                this.object.computeWorldMatrix && this.object.computeWorldMatrix(true);
                return size;
            }
            else {
                return PhysicsImpostor.DEFAULT_OBJECT_SIZE;
            }
        };
        PhysicsImpostor.prototype.getObjectCenter = function () {
            if (this.object.getBoundingInfo) {
                var boundingInfo = this.object.getBoundingInfo();
                return boundingInfo.boundingBox.centerWorld;
            }
            else {
                return this.object.position;
            }
        };
        /**
         * Get a specific parametes from the options parameter.
         */
        PhysicsImpostor.prototype.getParam = function (paramName) {
            return this._options[paramName];
        };
        /**
         * Sets a specific parameter in the options given to the physics plugin
         */
        PhysicsImpostor.prototype.setParam = function (paramName, value) {
            this._options[paramName] = value;
            this._bodyUpdateRequired = true;
        };
        /**
         * Specifically change the body's mass option. Won't recreate the physics body object
         */
        PhysicsImpostor.prototype.setMass = function (mass) {
            if (this.getParam("mass") !== mass) {
                this.setParam("mass", mass);
            }
            if (this._physicsEngine) {
                this._physicsEngine.getPhysicsPlugin().setBodyMass(this, mass);
            }
        };
        PhysicsImpostor.prototype.getLinearVelocity = function () {
            return this._physicsEngine ? this._physicsEngine.getPhysicsPlugin().getLinearVelocity(this) : LIB.Vector3.Zero();
        };
        PhysicsImpostor.prototype.setLinearVelocity = function (velocity) {
            if (this._physicsEngine) {
                this._physicsEngine.getPhysicsPlugin().setLinearVelocity(this, velocity);
            }
        };
        PhysicsImpostor.prototype.getAngularVelocity = function () {
            return this._physicsEngine ? this._physicsEngine.getPhysicsPlugin().getAngularVelocity(this) : LIB.Vector3.Zero();
        };
        PhysicsImpostor.prototype.setAngularVelocity = function (velocity) {
            if (this._physicsEngine) {
                this._physicsEngine.getPhysicsPlugin().setAngularVelocity(this, velocity);
            }
        };
        /**
         * Execute a function with the physics plugin native code.
         * Provide a function the will have two variables - the world object and the physics body object.
         */
        PhysicsImpostor.prototype.executeNativeFunction = function (func) {
            if (this._physicsEngine) {
                func(this._physicsEngine.getPhysicsPlugin().world, this.physicsBody);
            }
        };
        /**
         * Register a function that will be executed before the physics world is stepping forward.
         */
        PhysicsImpostor.prototype.registerBeforePhysicsStep = function (func) {
            this._onBeforePhysicsStepCallbacks.push(func);
        };
        PhysicsImpostor.prototype.unregisterBeforePhysicsStep = function (func) {
            var index = this._onBeforePhysicsStepCallbacks.indexOf(func);
            if (index > -1) {
                this._onBeforePhysicsStepCallbacks.splice(index, 1);
            }
            else {
                LIB.Tools.Warn("Function to remove was not found");
            }
        };
        /**
         * Register a function that will be executed after the physics step
         */
        PhysicsImpostor.prototype.registerAfterPhysicsStep = function (func) {
            this._onAfterPhysicsStepCallbacks.push(func);
        };
        PhysicsImpostor.prototype.unregisterAfterPhysicsStep = function (func) {
            var index = this._onAfterPhysicsStepCallbacks.indexOf(func);
            if (index > -1) {
                this._onAfterPhysicsStepCallbacks.splice(index, 1);
            }
            else {
                LIB.Tools.Warn("Function to remove was not found");
            }
        };
        /**
         * register a function that will be executed when this impostor collides against a different body.
         */
        PhysicsImpostor.prototype.registerOnPhysicsCollide = function (collideAgainst, func) {
            var collidedAgainstList = collideAgainst instanceof Array ? collideAgainst : [collideAgainst];
            this._onPhysicsCollideCallbacks.push({ callback: func, otherImpostors: collidedAgainstList });
        };
        PhysicsImpostor.prototype.unregisterOnPhysicsCollide = function (collideAgainst, func) {
            var collidedAgainstList = collideAgainst instanceof Array ? collideAgainst : [collideAgainst];
            var index = this._onPhysicsCollideCallbacks.indexOf({ callback: func, otherImpostors: collidedAgainstList });
            if (index > -1) {
                this._onPhysicsCollideCallbacks.splice(index, 1);
            }
            else {
                LIB.Tools.Warn("Function to remove was not found");
            }
        };
        PhysicsImpostor.prototype.getParentsRotation = function () {
            var parent = this.object.parent;
            this._tmpQuat.copyFromFloats(0, 0, 0, 1);
            while (parent) {
                if (parent.rotationQuaternion) {
                    this._tmpQuat2.copyFrom(parent.rotationQuaternion);
                }
                else {
                    LIB.Quaternion.RotationYawPitchRollToRef(parent.rotation.y, parent.rotation.x, parent.rotation.z, this._tmpQuat2);
                }
                this._tmpQuat.multiplyToRef(this._tmpQuat2, this._tmpQuat);
                parent = parent.parent;
            }
            return this._tmpQuat;
        };
        /**
         * Apply a force
         */
        PhysicsImpostor.prototype.applyForce = function (force, contactPoint) {
            if (this._physicsEngine) {
                this._physicsEngine.getPhysicsPlugin().applyForce(this, force, contactPoint);
            }
            return this;
        };
        /**
         * Apply an impulse
         */
        PhysicsImpostor.prototype.applyImpulse = function (force, contactPoint) {
            if (this._physicsEngine) {
                this._physicsEngine.getPhysicsPlugin().applyImpulse(this, force, contactPoint);
            }
            return this;
        };
        /**
         * A help function to create a joint.
         */
        PhysicsImpostor.prototype.createJoint = function (otherImpostor, jointType, jointData) {
            var joint = new LIB.PhysicsJoint(jointType, jointData);
            this.addJoint(otherImpostor, joint);
            return this;
        };
        /**
         * Add a joint to this impostor with a different impostor.
         */
        PhysicsImpostor.prototype.addJoint = function (otherImpostor, joint) {
            this._joints.push({
                otherImpostor: otherImpostor,
                joint: joint
            });
            if (this._physicsEngine) {
                this._physicsEngine.addJoint(this, otherImpostor, joint);
            }
            return this;
        };
        /**
         * Will keep this body still, in a sleep mode.
         */
        PhysicsImpostor.prototype.sleep = function () {
            if (this._physicsEngine) {
                this._physicsEngine.getPhysicsPlugin().sleepBody(this);
            }
            return this;
        };
        /**
         * Wake the body up.
         */
        PhysicsImpostor.prototype.wakeUp = function () {
            if (this._physicsEngine) {
                this._physicsEngine.getPhysicsPlugin().wakeUpBody(this);
            }
            return this;
        };
        PhysicsImpostor.prototype.clone = function (newObject) {
            if (!newObject)
                return null;
            return new PhysicsImpostor(newObject, this.type, this._options, this._scene);
        };
        PhysicsImpostor.prototype.dispose = function () {
            var _this = this;
            //no dispose if no physics engine is available.
            if (!this._physicsEngine) {
                return;
            }
            this._joints.forEach(function (j) {
                if (_this._physicsEngine) {
                    _this._physicsEngine.removeJoint(_this, j.otherImpostor, j.joint);
                }
            });
            //dispose the physics body
            this._physicsEngine.removeImpostor(this);
            if (this.parent) {
                this.parent.forceUpdate();
            }
            else {
                /*this._object.getChildMeshes().forEach(function(mesh) {
                    if (mesh.physicsImpostor) {
                        if (disposeChildren) {
                            mesh.physicsImpostor.dispose();
                            mesh.physicsImpostor = null;
                        }
                    }
                })*/
            }
            this._isDisposed = true;
        };
        PhysicsImpostor.prototype.setDeltaPosition = function (position) {
            this._deltaPosition.copyFrom(position);
        };
        PhysicsImpostor.prototype.setDeltaRotation = function (rotation) {
            if (!this._deltaRotation) {
                this._deltaRotation = new LIB.Quaternion();
            }
            this._deltaRotation.copyFrom(rotation);
            this._deltaRotationConjugated = this._deltaRotation.conjugate();
        };
        PhysicsImpostor.prototype.getBoxSizeToRef = function (result) {
            if (this._physicsEngine) {
                this._physicsEngine.getPhysicsPlugin().getBoxSizeToRef(this, result);
            }
            return this;
        };
        PhysicsImpostor.prototype.getRadius = function () {
            return this._physicsEngine ? this._physicsEngine.getPhysicsPlugin().getRadius(this) : 0;
        };
        /**
         * Sync a bone with this impostor
         * @param bone The bone to sync to the impostor.
         * @param boneMesh The mesh that the bone is influencing.
         * @param jointPivot The pivot of the joint / bone in local space.
         * @param distToJoint Optional distance from the impostor to the joint.
         * @param adjustRotation Optional quaternion for adjusting the local rotation of the bone.
         */
        PhysicsImpostor.prototype.syncBoneWithImpostor = function (bone, boneMesh, jointPivot, distToJoint, adjustRotation) {
            var tempVec = PhysicsImpostor._tmpVecs[0];
            var mesh = this.object;
            if (mesh.rotationQuaternion) {
                if (adjustRotation) {
                    var tempQuat = PhysicsImpostor._tmpQuat;
                    mesh.rotationQuaternion.multiplyToRef(adjustRotation, tempQuat);
                    bone.setRotationQuaternion(tempQuat, LIB.Space.WORLD, boneMesh);
                }
                else {
                    bone.setRotationQuaternion(mesh.rotationQuaternion, LIB.Space.WORLD, boneMesh);
                }
            }
            tempVec.x = 0;
            tempVec.y = 0;
            tempVec.z = 0;
            if (jointPivot) {
                tempVec.x = jointPivot.x;
                tempVec.y = jointPivot.y;
                tempVec.z = jointPivot.z;
                bone.getDirectionToRef(tempVec, boneMesh, tempVec);
                if (distToJoint === undefined || distToJoint === null) {
                    distToJoint = jointPivot.length();
                }
                tempVec.x *= distToJoint;
                tempVec.y *= distToJoint;
                tempVec.z *= distToJoint;
            }
            if (bone.getParent()) {
                tempVec.addInPlace(mesh.getAbsolutePosition());
                bone.setAbsolutePosition(tempVec, boneMesh);
            }
            else {
                boneMesh.setAbsolutePosition(mesh.getAbsolutePosition());
                boneMesh.position.x -= tempVec.x;
                boneMesh.position.y -= tempVec.y;
                boneMesh.position.z -= tempVec.z;
            }
        };
        /**
         * Sync impostor to a bone
         * @param bone The bone that the impostor will be synced to.
         * @param boneMesh The mesh that the bone is influencing.
         * @param jointPivot The pivot of the joint / bone in local space.
         * @param distToJoint Optional distance from the impostor to the joint.
         * @param adjustRotation Optional quaternion for adjusting the local rotation of the bone.
         * @param boneAxis Optional vector3 axis the bone is aligned with
         */
        PhysicsImpostor.prototype.syncImpostorWithBone = function (bone, boneMesh, jointPivot, distToJoint, adjustRotation, boneAxis) {
            var mesh = this.object;
            if (mesh.rotationQuaternion) {
                if (adjustRotation) {
                    var tempQuat = PhysicsImpostor._tmpQuat;
                    bone.getRotationQuaternionToRef(LIB.Space.WORLD, boneMesh, tempQuat);
                    tempQuat.multiplyToRef(adjustRotation, mesh.rotationQuaternion);
                }
                else {
                    bone.getRotationQuaternionToRef(LIB.Space.WORLD, boneMesh, mesh.rotationQuaternion);
                }
            }
            var pos = PhysicsImpostor._tmpVecs[0];
            var boneDir = PhysicsImpostor._tmpVecs[1];
            if (!boneAxis) {
                boneAxis = PhysicsImpostor._tmpVecs[2];
                boneAxis.x = 0;
                boneAxis.y = 1;
                boneAxis.z = 0;
            }
            bone.getDirectionToRef(boneAxis, boneMesh, boneDir);
            bone.getAbsolutePositionToRef(boneMesh, pos);
            if ((distToJoint === undefined || distToJoint === null) && jointPivot) {
                distToJoint = jointPivot.length();
            }
            if (distToJoint !== undefined && distToJoint !== null) {
                pos.x += boneDir.x * distToJoint;
                pos.y += boneDir.y * distToJoint;
                pos.z += boneDir.z * distToJoint;
            }
            mesh.setAbsolutePosition(pos);
        };
        PhysicsImpostor.DEFAULT_OBJECT_SIZE = new LIB.Vector3(1, 1, 1);
        PhysicsImpostor.IDENTITY_QUATERNION = LIB.Quaternion.Identity();
        PhysicsImpostor._tmpVecs = [LIB.Vector3.Zero(), LIB.Vector3.Zero(), LIB.Vector3.Zero()];
        PhysicsImpostor._tmpQuat = LIB.Quaternion.Identity();
        //Impostor types
        PhysicsImpostor.NoImpostor = 0;
        PhysicsImpostor.SphereImpostor = 1;
        PhysicsImpostor.BoxImpostor = 2;
        PhysicsImpostor.PlaneImpostor = 3;
        PhysicsImpostor.MeshImpostor = 4;
        PhysicsImpostor.CylinderImpostor = 7;
        PhysicsImpostor.ParticleImpostor = 8;
        PhysicsImpostor.HeightmapImpostor = 9;
        return PhysicsImpostor;
    }());
    LIB.PhysicsImpostor = PhysicsImpostor;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.physicsImpostor.js.map
