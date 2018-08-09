var BABYLON;
(function (BABYLON) {
    var CannonJSPlugin = /** @class */ (function () {
        function CannonJSPlugin(_useDeltaForWorldStep, iterations) {
            if (_useDeltaForWorldStep === void 0) { _useDeltaForWorldStep = true; }
            if (iterations === void 0) { iterations = 10; }
            this._useDeltaForWorldStep = _useDeltaForWorldStep;
            this.name = "CannonJSPlugin";
            this._physicsMaterials = new Array();
            this._fixedTimeStep = 1 / 60;
            //See https://github.com/schteppe/CANNON.js/blob/gh-pages/demos/collisionFilter.html
            this.BJSCANNON = typeof CANNON !== 'undefined' ? CANNON : (typeof require !== 'undefined' ? require('cannon') : undefined);
            this._minus90X = new BABYLON.Quaternion(-0.7071067811865475, 0, 0, 0.7071067811865475);
            this._plus90X = new BABYLON.Quaternion(0.7071067811865475, 0, 0, 0.7071067811865475);
            this._tmpPosition = BABYLON.Vector3.Zero();
            this._tmpDeltaPosition = BABYLON.Vector3.Zero();
            this._tmpUnityRotation = new BABYLON.Quaternion();
            if (!this.isSupported()) {
                BABYLON.Tools.Error("CannonJS is not available. Please make sure you included the js file.");
                return;
            }
            this._extendNamespace();
            this.world = new this.BJSCANNON.World();
            this.world.broadphase = new this.BJSCANNON.NaiveBroadphase();
            this.world.solver.iterations = iterations;
        }
        CannonJSPlugin.prototype.setGravity = function (gravity) {
            this.world.gravity.copy(gravity);
        };
        CannonJSPlugin.prototype.setTimeStep = function (timeStep) {
            this._fixedTimeStep = timeStep;
        };
        CannonJSPlugin.prototype.getTimeStep = function () {
            return this._fixedTimeStep;
        };
        CannonJSPlugin.prototype.executeStep = function (delta, impostors) {
            this.world.step(this._fixedTimeStep, this._useDeltaForWorldStep ? delta : 0, 3);
        };
        CannonJSPlugin.prototype.applyImpulse = function (impostor, force, contactPoint) {
            var worldPoint = new this.BJSCANNON.Vec3(contactPoint.x, contactPoint.y, contactPoint.z);
            var impulse = new this.BJSCANNON.Vec3(force.x, force.y, force.z);
            impostor.physicsBody.applyImpulse(impulse, worldPoint);
        };
        CannonJSPlugin.prototype.applyForce = function (impostor, force, contactPoint) {
            var worldPoint = new this.BJSCANNON.Vec3(contactPoint.x, contactPoint.y, contactPoint.z);
            var impulse = new this.BJSCANNON.Vec3(force.x, force.y, force.z);
            impostor.physicsBody.applyForce(impulse, worldPoint);
        };
        CannonJSPlugin.prototype.generatePhysicsBody = function (impostor) {
            //parent-child relationship. Does this impostor has a parent impostor?
            if (impostor.parent) {
                if (impostor.physicsBody) {
                    this.removePhysicsBody(impostor);
                    //TODO is that needed?
                    impostor.forceUpdate();
                }
                return;
            }
            //should a new body be created for this impostor?
            if (impostor.isBodyInitRequired()) {
                var shape = this._createShape(impostor);
                //unregister events, if body is being changed
                var oldBody = impostor.physicsBody;
                if (oldBody) {
                    this.removePhysicsBody(impostor);
                }
                //create the body and material
                var material = this._addMaterial("mat-" + impostor.uniqueId, impostor.getParam("friction"), impostor.getParam("restitution"));
                var bodyCreationObject = {
                    mass: impostor.getParam("mass"),
                    material: material
                };
                // A simple extend, in case native options were used.
                var nativeOptions = impostor.getParam("nativeOptions");
                for (var key in nativeOptions) {
                    if (nativeOptions.hasOwnProperty(key)) {
                        bodyCreationObject[key] = nativeOptions[key];
                    }
                }
                impostor.physicsBody = new this.BJSCANNON.Body(bodyCreationObject);
                impostor.physicsBody.addEventListener("collide", impostor.onCollide);
                this.world.addEventListener("preStep", impostor.beforeStep);
                this.world.addEventListener("postStep", impostor.afterStep);
                impostor.physicsBody.addShape(shape);
                this.world.add(impostor.physicsBody);
                //try to keep the body moving in the right direction by taking old properties.
                //Should be tested!
                if (oldBody) {
                    ['force', 'torque', 'velocity', 'angularVelocity'].forEach(function (param) {
                        impostor.physicsBody[param].copy(oldBody[param]);
                    });
                }
                this._processChildMeshes(impostor);
            }
            //now update the body's transformation
            this._updatePhysicsBodyTransformation(impostor);
        };
        CannonJSPlugin.prototype._processChildMeshes = function (mainImpostor) {
            var _this = this;
            var meshChildren = mainImpostor.object.getChildMeshes ? mainImpostor.object.getChildMeshes(true) : [];
            var currentRotation = mainImpostor.object.rotationQuaternion;
            if (meshChildren.length) {
                var processMesh = function (localPosition, mesh) {
                    if (!currentRotation || !mesh.rotationQuaternion) {
                        return;
                    }
                    var childImpostor = mesh.getPhysicsImpostor();
                    if (childImpostor) {
                        var parent = childImpostor.parent;
                        if (parent !== mainImpostor) {
                            var pPosition = mesh.getAbsolutePosition().subtract(mainImpostor.object.getAbsolutePosition());
                            var localRotation = mesh.rotationQuaternion.multiply(BABYLON.Quaternion.Inverse(currentRotation));
                            if (childImpostor.physicsBody) {
                                _this.removePhysicsBody(childImpostor);
                                childImpostor.physicsBody = null;
                            }
                            childImpostor.parent = mainImpostor;
                            childImpostor.resetUpdateFlags();
                            mainImpostor.physicsBody.addShape(_this._createShape(childImpostor), new _this.BJSCANNON.Vec3(pPosition.x, pPosition.y, pPosition.z), new _this.BJSCANNON.Quaternion(localRotation.x, localRotation.y, localRotation.z, localRotation.w));
                            //Add the mass of the children.
                            mainImpostor.physicsBody.mass += childImpostor.getParam("mass");
                        }
                    }
                    currentRotation.multiplyInPlace(mesh.rotationQuaternion);
                    mesh.getChildMeshes(true).filter(function (m) { return !!m.physicsImpostor; }).forEach(processMesh.bind(_this, mesh.getAbsolutePosition()));
                };
                meshChildren.filter(function (m) { return !!m.physicsImpostor; }).forEach(processMesh.bind(this, mainImpostor.object.getAbsolutePosition()));
            }
        };
        CannonJSPlugin.prototype.removePhysicsBody = function (impostor) {
            impostor.physicsBody.removeEventListener("collide", impostor.onCollide);
            this.world.removeEventListener("preStep", impostor.beforeStep);
            this.world.removeEventListener("postStep", impostor.afterStep);
            this.world.remove(impostor.physicsBody);
        };
        CannonJSPlugin.prototype.generateJoint = function (impostorJoint) {
            var mainBody = impostorJoint.mainImpostor.physicsBody;
            var connectedBody = impostorJoint.connectedImpostor.physicsBody;
            if (!mainBody || !connectedBody) {
                return;
            }
            var constraint;
            var jointData = impostorJoint.joint.jointData;
            //TODO - https://github.com/schteppe/this.BJSCANNON.js/blob/gh-pages/demos/collisionFilter.html
            var constraintData = {
                pivotA: jointData.mainPivot ? new this.BJSCANNON.Vec3().copy(jointData.mainPivot) : null,
                pivotB: jointData.connectedPivot ? new this.BJSCANNON.Vec3().copy(jointData.connectedPivot) : null,
                axisA: jointData.mainAxis ? new this.BJSCANNON.Vec3().copy(jointData.mainAxis) : null,
                axisB: jointData.connectedAxis ? new this.BJSCANNON.Vec3().copy(jointData.connectedAxis) : null,
                maxForce: jointData.nativeParams.maxForce,
                collideConnected: !!jointData.collision
            };
            switch (impostorJoint.joint.type) {
                case BABYLON.PhysicsJoint.HingeJoint:
                case BABYLON.PhysicsJoint.Hinge2Joint:
                    constraint = new this.BJSCANNON.HingeConstraint(mainBody, connectedBody, constraintData);
                    break;
                case BABYLON.PhysicsJoint.DistanceJoint:
                    constraint = new this.BJSCANNON.DistanceConstraint(mainBody, connectedBody, jointData.maxDistance || 2);
                    break;
                case BABYLON.PhysicsJoint.SpringJoint:
                    var springData = jointData;
                    constraint = new this.BJSCANNON.Spring(mainBody, connectedBody, {
                        restLength: springData.length,
                        stiffness: springData.stiffness,
                        damping: springData.damping,
                        localAnchorA: constraintData.pivotA,
                        localAnchorB: constraintData.pivotB
                    });
                    break;
                case BABYLON.PhysicsJoint.LockJoint:
                    constraint = new this.BJSCANNON.LockConstraint(mainBody, connectedBody, constraintData);
                    break;
                case BABYLON.PhysicsJoint.PointToPointJoint:
                case BABYLON.PhysicsJoint.BallAndSocketJoint:
                default:
                    constraint = new this.BJSCANNON.PointToPointConstraint(mainBody, constraintData.pivotA, connectedBody, constraintData.pivotA, constraintData.maxForce);
                    break;
            }
            //set the collideConnected flag after the creation, since DistanceJoint ignores it.
            constraint.collideConnected = !!jointData.collision;
            impostorJoint.joint.physicsJoint = constraint;
            //don't add spring as constraint, as it is not one.
            if (impostorJoint.joint.type !== BABYLON.PhysicsJoint.SpringJoint) {
                this.world.addConstraint(constraint);
            }
            else {
                impostorJoint.mainImpostor.registerAfterPhysicsStep(function () {
                    constraint.applyForce();
                });
            }
        };
        CannonJSPlugin.prototype.removeJoint = function (impostorJoint) {
            this.world.removeConstraint(impostorJoint.joint.physicsJoint);
        };
        CannonJSPlugin.prototype._addMaterial = function (name, friction, restitution) {
            var index;
            var mat;
            for (index = 0; index < this._physicsMaterials.length; index++) {
                mat = this._physicsMaterials[index];
                if (mat.friction === friction && mat.restitution === restitution) {
                    return mat;
                }
            }
            var currentMat = new this.BJSCANNON.Material(name);
            currentMat.friction = friction;
            currentMat.restitution = restitution;
            this._physicsMaterials.push(currentMat);
            return currentMat;
        };
        CannonJSPlugin.prototype._checkWithEpsilon = function (value) {
            return value < BABYLON.PhysicsEngine.Epsilon ? BABYLON.PhysicsEngine.Epsilon : value;
        };
        CannonJSPlugin.prototype._createShape = function (impostor) {
            var object = impostor.object;
            var returnValue;
            var extendSize = impostor.getObjectExtendSize();
            switch (impostor.type) {
                case BABYLON.PhysicsImpostor.SphereImpostor:
                    var radiusX = extendSize.x;
                    var radiusY = extendSize.y;
                    var radiusZ = extendSize.z;
                    returnValue = new this.BJSCANNON.Sphere(Math.max(this._checkWithEpsilon(radiusX), this._checkWithEpsilon(radiusY), this._checkWithEpsilon(radiusZ)) / 2);
                    break;
                //TMP also for cylinder - TODO Cannon supports cylinder natively.
                case BABYLON.PhysicsImpostor.CylinderImpostor:
                    returnValue = new this.BJSCANNON.Cylinder(this._checkWithEpsilon(extendSize.x) / 2, this._checkWithEpsilon(extendSize.x) / 2, this._checkWithEpsilon(extendSize.y), 16);
                    break;
                case BABYLON.PhysicsImpostor.BoxImpostor:
                    var box = extendSize.scale(0.5);
                    returnValue = new this.BJSCANNON.Box(new this.BJSCANNON.Vec3(this._checkWithEpsilon(box.x), this._checkWithEpsilon(box.y), this._checkWithEpsilon(box.z)));
                    break;
                case BABYLON.PhysicsImpostor.PlaneImpostor:
                    BABYLON.Tools.Warn("Attention, PlaneImposter might not behave as you expect. Consider using BoxImposter instead");
                    returnValue = new this.BJSCANNON.Plane();
                    break;
                case BABYLON.PhysicsImpostor.MeshImpostor:
                    // should transform the vertex data to world coordinates!!
                    var rawVerts = object.getVerticesData ? object.getVerticesData(BABYLON.VertexBuffer.PositionKind) : [];
                    var rawFaces = object.getIndices ? object.getIndices() : [];
                    if (!rawVerts)
                        return;
                    // get only scale! so the object could transform correctly.
                    var oldPosition = object.position.clone();
                    var oldRotation = object.rotation && object.rotation.clone();
                    var oldQuaternion = object.rotationQuaternion && object.rotationQuaternion.clone();
                    object.position.copyFromFloats(0, 0, 0);
                    object.rotation && object.rotation.copyFromFloats(0, 0, 0);
                    object.rotationQuaternion && object.rotationQuaternion.copyFrom(impostor.getParentsRotation());
                    object.rotationQuaternion && object.parent && object.rotationQuaternion.conjugateInPlace();
                    var transform = object.computeWorldMatrix(true);
                    // convert rawVerts to object space
                    var temp = new Array();
                    var index;
                    for (index = 0; index < rawVerts.length; index += 3) {
                        BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(rawVerts, index), transform).toArray(temp, index);
                    }
                    BABYLON.Tools.Warn("MeshImpostor only collides against spheres.");
                    returnValue = new this.BJSCANNON.Trimesh(temp, rawFaces);
                    //now set back the transformation!
                    object.position.copyFrom(oldPosition);
                    oldRotation && object.rotation && object.rotation.copyFrom(oldRotation);
                    oldQuaternion && object.rotationQuaternion && object.rotationQuaternion.copyFrom(oldQuaternion);
                    break;
                case BABYLON.PhysicsImpostor.HeightmapImpostor:
                    var oldPosition2 = object.position.clone();
                    var oldRotation2 = object.rotation && object.rotation.clone();
                    var oldQuaternion2 = object.rotationQuaternion && object.rotationQuaternion.clone();
                    object.position.copyFromFloats(0, 0, 0);
                    object.rotation && object.rotation.copyFromFloats(0, 0, 0);
                    object.rotationQuaternion && object.rotationQuaternion.copyFrom(impostor.getParentsRotation());
                    object.rotationQuaternion && object.parent && object.rotationQuaternion.conjugateInPlace();
                    object.rotationQuaternion && object.rotationQuaternion.multiplyInPlace(this._minus90X);
                    returnValue = this._createHeightmap(object);
                    object.position.copyFrom(oldPosition2);
                    oldRotation2 && object.rotation && object.rotation.copyFrom(oldRotation2);
                    oldQuaternion2 && object.rotationQuaternion && object.rotationQuaternion.copyFrom(oldQuaternion2);
                    object.computeWorldMatrix(true);
                    break;
                case BABYLON.PhysicsImpostor.ParticleImpostor:
                    returnValue = new this.BJSCANNON.Particle();
                    break;
            }
            return returnValue;
        };
        CannonJSPlugin.prototype._createHeightmap = function (object, pointDepth) {
            var pos = (object.getVerticesData(BABYLON.VertexBuffer.PositionKind));
            var transform = object.computeWorldMatrix(true);
            // convert rawVerts to object space
            var temp = new Array();
            var index;
            for (index = 0; index < pos.length; index += 3) {
                BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(pos, index), transform).toArray(temp, index);
            }
            pos = temp;
            var matrix = new Array();
            //For now pointDepth will not be used and will be automatically calculated.
            //Future reference - try and find the best place to add a reference to the pointDepth variable.
            var arraySize = pointDepth || ~~(Math.sqrt(pos.length / 3) - 1);
            var boundingInfo = object.getBoundingInfo();
            var dim = Math.min(boundingInfo.boundingBox.extendSizeWorld.x, boundingInfo.boundingBox.extendSizeWorld.y);
            var minY = boundingInfo.boundingBox.extendSizeWorld.z;
            var elementSize = dim * 2 / arraySize;
            for (var i = 0; i < pos.length; i = i + 3) {
                var x = Math.round((pos[i + 0]) / elementSize + arraySize / 2);
                var z = Math.round(((pos[i + 1]) / elementSize - arraySize / 2) * -1);
                var y = -pos[i + 2] + minY;
                if (!matrix[x]) {
                    matrix[x] = [];
                }
                if (!matrix[x][z]) {
                    matrix[x][z] = y;
                }
                matrix[x][z] = Math.max(y, matrix[x][z]);
            }
            for (var x = 0; x <= arraySize; ++x) {
                if (!matrix[x]) {
                    var loc = 1;
                    while (!matrix[(x + loc) % arraySize]) {
                        loc++;
                    }
                    matrix[x] = matrix[(x + loc) % arraySize].slice();
                    //console.log("missing x", x);
                }
                for (var z = 0; z <= arraySize; ++z) {
                    if (!matrix[x][z]) {
                        var loc = 1;
                        var newValue;
                        while (newValue === undefined) {
                            newValue = matrix[x][(z + loc++) % arraySize];
                        }
                        matrix[x][z] = newValue;
                    }
                }
            }
            var shape = new this.BJSCANNON.Heightfield(matrix, {
                elementSize: elementSize
            });
            //For future reference, needed for body transformation
            shape.minY = minY;
            return shape;
        };
        CannonJSPlugin.prototype._updatePhysicsBodyTransformation = function (impostor) {
            var object = impostor.object;
            //make sure it is updated...
            object.computeWorldMatrix && object.computeWorldMatrix(true);
            // The delta between the mesh position and the mesh bounding box center
            var bInfo = object.getBoundingInfo();
            if (!bInfo)
                return;
            var center = impostor.getObjectCenter();
            //m.getAbsolutePosition().subtract(m.getBoundingInfo().boundingBox.centerWorld)
            this._tmpDeltaPosition.copyFrom(object.getAbsolutePivotPoint().subtract(center));
            this._tmpPosition.copyFrom(center);
            var quaternion = object.rotationQuaternion;
            if (!quaternion) {
                return;
            }
            //is shape is a plane or a heightmap, it must be rotated 90 degs in the X axis.
            if (impostor.type === BABYLON.PhysicsImpostor.PlaneImpostor || impostor.type === BABYLON.PhysicsImpostor.HeightmapImpostor || impostor.type === BABYLON.PhysicsImpostor.CylinderImpostor) {
                //-90 DEG in X, precalculated
                quaternion = quaternion.multiply(this._minus90X);
                //Invert! (Precalculated, 90 deg in X)
                //No need to clone. this will never change.
                impostor.setDeltaRotation(this._plus90X);
            }
            //If it is a heightfield, if should be centered.
            if (impostor.type === BABYLON.PhysicsImpostor.HeightmapImpostor) {
                var mesh = object;
                var boundingInfo = mesh.getBoundingInfo();
                //calculate the correct body position:
                var rotationQuaternion = mesh.rotationQuaternion;
                mesh.rotationQuaternion = this._tmpUnityRotation;
                mesh.computeWorldMatrix(true);
                //get original center with no rotation
                var c = center.clone();
                var oldPivot = mesh.getPivotMatrix() || BABYLON.Matrix.Translation(0, 0, 0);
                //calculate the new center using a pivot (since this.BJSCANNON.js doesn't center height maps)
                var p = BABYLON.Matrix.Translation(boundingInfo.boundingBox.extendSizeWorld.x, 0, -boundingInfo.boundingBox.extendSizeWorld.z);
                mesh.setPivotMatrix(p);
                mesh.computeWorldMatrix(true);
                //calculate the translation
                var translation = boundingInfo.boundingBox.centerWorld.subtract(center).subtract(mesh.position).negate();
                this._tmpPosition.copyFromFloats(translation.x, translation.y - boundingInfo.boundingBox.extendSizeWorld.y, translation.z);
                //add it inverted to the delta
                this._tmpDeltaPosition.copyFrom(boundingInfo.boundingBox.centerWorld.subtract(c));
                this._tmpDeltaPosition.y += boundingInfo.boundingBox.extendSizeWorld.y;
                //rotation is back
                mesh.rotationQuaternion = rotationQuaternion;
                mesh.setPivotMatrix(oldPivot);
                mesh.computeWorldMatrix(true);
            }
            else if (impostor.type === BABYLON.PhysicsImpostor.MeshImpostor) {
                this._tmpDeltaPosition.copyFromFloats(0, 0, 0);
                //this._tmpPosition.copyFrom(object.position);
            }
            impostor.setDeltaPosition(this._tmpDeltaPosition);
            //Now update the impostor object
            impostor.physicsBody.position.copy(this._tmpPosition);
            impostor.physicsBody.quaternion.copy(quaternion);
        };
        CannonJSPlugin.prototype.setTransformationFromPhysicsBody = function (impostor) {
            impostor.object.position.copyFrom(impostor.physicsBody.position);
            if (impostor.object.rotationQuaternion) {
                impostor.object.rotationQuaternion.copyFrom(impostor.physicsBody.quaternion);
            }
        };
        CannonJSPlugin.prototype.setPhysicsBodyTransformation = function (impostor, newPosition, newRotation) {
            impostor.physicsBody.position.copy(newPosition);
            impostor.physicsBody.quaternion.copy(newRotation);
        };
        CannonJSPlugin.prototype.isSupported = function () {
            return this.BJSCANNON !== undefined;
        };
        CannonJSPlugin.prototype.setLinearVelocity = function (impostor, velocity) {
            impostor.physicsBody.velocity.copy(velocity);
        };
        CannonJSPlugin.prototype.setAngularVelocity = function (impostor, velocity) {
            impostor.physicsBody.angularVelocity.copy(velocity);
        };
        CannonJSPlugin.prototype.getLinearVelocity = function (impostor) {
            var v = impostor.physicsBody.velocity;
            if (!v) {
                return null;
            }
            return new BABYLON.Vector3(v.x, v.y, v.z);
        };
        CannonJSPlugin.prototype.getAngularVelocity = function (impostor) {
            var v = impostor.physicsBody.angularVelocity;
            if (!v) {
                return null;
            }
            return new BABYLON.Vector3(v.x, v.y, v.z);
        };
        CannonJSPlugin.prototype.setBodyMass = function (impostor, mass) {
            impostor.physicsBody.mass = mass;
            impostor.physicsBody.updateMassProperties();
        };
        CannonJSPlugin.prototype.getBodyMass = function (impostor) {
            return impostor.physicsBody.mass;
        };
        CannonJSPlugin.prototype.getBodyFriction = function (impostor) {
            return impostor.physicsBody.material.friction;
        };
        CannonJSPlugin.prototype.setBodyFriction = function (impostor, friction) {
            impostor.physicsBody.material.friction = friction;
        };
        CannonJSPlugin.prototype.getBodyRestitution = function (impostor) {
            return impostor.physicsBody.material.restitution;
        };
        CannonJSPlugin.prototype.setBodyRestitution = function (impostor, restitution) {
            impostor.physicsBody.material.restitution = restitution;
        };
        CannonJSPlugin.prototype.sleepBody = function (impostor) {
            impostor.physicsBody.sleep();
        };
        CannonJSPlugin.prototype.wakeUpBody = function (impostor) {
            impostor.physicsBody.wakeUp();
        };
        CannonJSPlugin.prototype.updateDistanceJoint = function (joint, maxDistance, minDistance) {
            joint.physicsJoint.distance = maxDistance;
        };
        // private enableMotor(joint: IMotorEnabledJoint, motorIndex?: number) {
        //     if (!motorIndex) {
        //         joint.physicsJoint.enableMotor();
        //     }
        // }
        // private disableMotor(joint: IMotorEnabledJoint, motorIndex?: number) {
        //     if (!motorIndex) {
        //         joint.physicsJoint.disableMotor();
        //     }
        // }
        CannonJSPlugin.prototype.setMotor = function (joint, speed, maxForce, motorIndex) {
            if (!motorIndex) {
                joint.physicsJoint.enableMotor();
                joint.physicsJoint.setMotorSpeed(speed);
                if (maxForce) {
                    this.setLimit(joint, maxForce);
                }
            }
        };
        CannonJSPlugin.prototype.setLimit = function (joint, upperLimit, lowerLimit) {
            joint.physicsJoint.motorEquation.maxForce = upperLimit;
            joint.physicsJoint.motorEquation.minForce = lowerLimit === void 0 ? -upperLimit : lowerLimit;
        };
        CannonJSPlugin.prototype.syncMeshWithImpostor = function (mesh, impostor) {
            var body = impostor.physicsBody;
            mesh.position.x = body.position.x;
            mesh.position.y = body.position.y;
            mesh.position.z = body.position.z;
            if (mesh.rotationQuaternion) {
                mesh.rotationQuaternion.x = body.quaternion.x;
                mesh.rotationQuaternion.y = body.quaternion.y;
                mesh.rotationQuaternion.z = body.quaternion.z;
                mesh.rotationQuaternion.w = body.quaternion.w;
            }
        };
        CannonJSPlugin.prototype.getRadius = function (impostor) {
            var shape = impostor.physicsBody.shapes[0];
            return shape.boundingSphereRadius;
        };
        CannonJSPlugin.prototype.getBoxSizeToRef = function (impostor, result) {
            var shape = impostor.physicsBody.shapes[0];
            result.x = shape.halfExtents.x * 2;
            result.y = shape.halfExtents.y * 2;
            result.z = shape.halfExtents.z * 2;
        };
        CannonJSPlugin.prototype.dispose = function () {
        };
        CannonJSPlugin.prototype._extendNamespace = function () {
            //this will force cannon to execute at least one step when using interpolation
            var step_tmp1 = new this.BJSCANNON.Vec3();
            var Engine = this.BJSCANNON;
            this.BJSCANNON.World.prototype.step = function (dt, timeSinceLastCalled, maxSubSteps) {
                maxSubSteps = maxSubSteps || 10;
                timeSinceLastCalled = timeSinceLastCalled || 0;
                if (timeSinceLastCalled === 0) {
                    this.internalStep(dt);
                    this.time += dt;
                }
                else {
                    var internalSteps = Math.floor((this.time + timeSinceLastCalled) / dt) - Math.floor(this.time / dt);
                    internalSteps = Math.min(internalSteps, maxSubSteps) || 1;
                    var t0 = performance.now();
                    for (var i = 0; i !== internalSteps; i++) {
                        this.internalStep(dt);
                        if (performance.now() - t0 > dt * 1000) {
                            break;
                        }
                    }
                    this.time += timeSinceLastCalled;
                    var h = this.time % dt;
                    var h_div_dt = h / dt;
                    var interpvelo = step_tmp1;
                    var bodies = this.bodies;
                    for (var j = 0; j !== bodies.length; j++) {
                        var b = bodies[j];
                        if (b.type !== Engine.Body.STATIC && b.sleepState !== Engine.Body.SLEEPING) {
                            b.position.vsub(b.previousPosition, interpvelo);
                            interpvelo.scale(h_div_dt, interpvelo);
                            b.position.vadd(interpvelo, b.interpolatedPosition);
                        }
                        else {
                            b.interpolatedPosition.copy(b.position);
                            b.interpolatedQuaternion.copy(b.quaternion);
                        }
                    }
                }
            };
        };
        return CannonJSPlugin;
    }());
    BABYLON.CannonJSPlugin = CannonJSPlugin;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.cannonJSPlugin.js.map
