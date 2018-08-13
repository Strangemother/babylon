
var LIB;
(function (LIB) {
    var OimoJSPlugin = /** @class */ (function () {
        function OimoJSPlugin(iterations) {
            this.name = "OimoJSPlugin";
            this._tmpImpostorsArray = [];
            this._tmpPositionVector = LIB.Vector3.Zero();
            this.BJSOIMO = OIMO;
            this.world = new this.BJSOIMO.World({
                iterations: iterations
            });
            this.world.clear();
        }
        OimoJSPlugin.prototype.setGravity = function (gravity) {
            this.world.gravity.copy(gravity);
        };
        OimoJSPlugin.prototype.setTimeStep = function (timeStep) {
            this.world.timeStep = timeStep;
        };
        OimoJSPlugin.prototype.getTimeStep = function () {
            return this.world.timeStep;
        };
        OimoJSPlugin.prototype.executeStep = function (delta, impostors) {
            var _this = this;
            impostors.forEach(function (impostor) {
                impostor.beforeStep();
            });
            this.world.step();
            impostors.forEach(function (impostor) {
                impostor.afterStep();
                //update the ordered impostors array
                _this._tmpImpostorsArray[impostor.uniqueId] = impostor;
            });
            //check for collisions
            var contact = this.world.contacts;
            while (contact !== null) {
                if (contact.touching && !contact.body1.sleeping && !contact.body2.sleeping) {
                    contact = contact.next;
                    continue;
                }
                //is this body colliding with any other? get the impostor
                var mainImpostor = this._tmpImpostorsArray[+contact.body1.name];
                var collidingImpostor = this._tmpImpostorsArray[+contact.body2.name];
                if (!mainImpostor || !collidingImpostor) {
                    contact = contact.next;
                    continue;
                }
                mainImpostor.onCollide({ body: collidingImpostor.physicsBody });
                collidingImpostor.onCollide({ body: mainImpostor.physicsBody });
                contact = contact.next;
            }
        };
        OimoJSPlugin.prototype.applyImpulse = function (impostor, force, contactPoint) {
            var mass = impostor.physicsBody.mass;
            impostor.physicsBody.applyImpulse(contactPoint.scale(this.world.invScale), force.scale(this.world.invScale * mass));
        };
        OimoJSPlugin.prototype.applyForce = function (impostor, force, contactPoint) {
            LIB.Tools.Warn("Oimo doesn't support applying force. Using impule instead.");
            this.applyImpulse(impostor, force, contactPoint);
        };
        OimoJSPlugin.prototype.generatePhysicsBody = function (impostor) {
            var _this = this;
            //parent-child relationship. Does this impostor has a parent impostor?
            if (impostor.parent) {
                if (impostor.physicsBody) {
                    this.removePhysicsBody(impostor);
                    //TODO is that needed?
                    impostor.forceUpdate();
                }
                return;
            }
            if (impostor.isBodyInitRequired()) {
                var bodyConfig = {
                    name: impostor.uniqueId,
                    //Oimo must have mass, also for static objects.
                    config: [impostor.getParam("mass") || 1, impostor.getParam("friction"), impostor.getParam("restitution")],
                    size: [],
                    type: [],
                    pos: [],
                    posShape: [],
                    rot: [],
                    rotShape: [],
                    move: impostor.getParam("mass") !== 0,
                    density: impostor.getParam("mass"),
                    friction: impostor.getParam("friction"),
                    restitution: impostor.getParam("restitution"),
                    //Supporting older versions of Oimo
                    world: this.world
                };
                var impostors = [impostor];
                var addToArray = function (parent) {
                    if (!parent.getChildMeshes)
                        return;
                    parent.getChildMeshes().forEach(function (m) {
                        if (m.physicsImpostor) {
                            impostors.push(m.physicsImpostor);
                            //m.physicsImpostor._init();
                        }
                    });
                };
                addToArray(impostor.object);
                var checkWithEpsilon_1 = function (value) {
                    return Math.max(value, LIB.PhysicsEngine.Epsilon);
                };
                impostors.forEach(function (i) {
                    if (!i.object.rotationQuaternion) {
                        return;
                    }
                    //get the correct bounding box
                    var oldQuaternion = i.object.rotationQuaternion;
                    var rot = oldQuaternion.toEulerAngles();
                    var extendSize = i.getObjectExtendSize();
                    var radToDeg = 57.295779513082320876;
                    if (i === impostor) {
                        var center = impostor.getObjectCenter();
                        impostor.object.getAbsolutePivotPoint().subtractToRef(center, _this._tmpPositionVector);
                        _this._tmpPositionVector.divideInPlace(impostor.object.scaling);
                        //Can also use Array.prototype.push.apply
                        bodyConfig.pos.push(center.x);
                        bodyConfig.pos.push(center.y);
                        bodyConfig.pos.push(center.z);
                        bodyConfig.posShape.push(0, 0, 0);
                        //tmp solution
                        bodyConfig.rot.push(rot.x * radToDeg);
                        bodyConfig.rot.push(rot.y * radToDeg);
                        bodyConfig.rot.push(rot.z * radToDeg);
                        bodyConfig.rotShape.push(0, 0, 0);
                    }
                    else {
                        var localPosition = i.object.getAbsolutePosition().subtract(impostor.object.getAbsolutePosition());
                        bodyConfig.posShape.push(localPosition.x);
                        bodyConfig.posShape.push(localPosition.y);
                        bodyConfig.posShape.push(localPosition.z);
                        bodyConfig.pos.push(0, 0, 0);
                        //tmp solution until https://github.com/lo-th/OIMO.js/pull/37 is merged
                        bodyConfig.rot.push(0);
                        bodyConfig.rot.push(0);
                        bodyConfig.rot.push(0);
                        bodyConfig.rotShape.push(rot.x * radToDeg);
                        bodyConfig.rotShape.push(rot.y * radToDeg);
                        bodyConfig.rotShape.push(rot.z * radToDeg);
                    }
                    // register mesh
                    switch (i.type) {
                        case LIB.PhysicsImpostor.ParticleImpostor:
                            LIB.Tools.Warn("No Particle support in OIMO.js. using SphereImpostor instead");
                        case LIB.PhysicsImpostor.SphereImpostor:
                            var radiusX = extendSize.x;
                            var radiusY = extendSize.y;
                            var radiusZ = extendSize.z;
                            var size = Math.max(checkWithEpsilon_1(radiusX), checkWithEpsilon_1(radiusY), checkWithEpsilon_1(radiusZ)) / 2;
                            bodyConfig.type.push('sphere');
                            //due to the way oimo works with compounds, add 3 times
                            bodyConfig.size.push(size);
                            bodyConfig.size.push(size);
                            bodyConfig.size.push(size);
                            break;
                        case LIB.PhysicsImpostor.CylinderImpostor:
                            var sizeX = checkWithEpsilon_1(extendSize.x) / 2;
                            var sizeY = checkWithEpsilon_1(extendSize.y);
                            bodyConfig.type.push('cylinder');
                            bodyConfig.size.push(sizeX);
                            bodyConfig.size.push(sizeY);
                            //due to the way oimo works with compounds, add one more value.
                            bodyConfig.size.push(sizeY);
                            break;
                        case LIB.PhysicsImpostor.PlaneImpostor:
                        case LIB.PhysicsImpostor.BoxImpostor:
                        default:
                            var sizeX = checkWithEpsilon_1(extendSize.x);
                            var sizeY = checkWithEpsilon_1(extendSize.y);
                            var sizeZ = checkWithEpsilon_1(extendSize.z);
                            bodyConfig.type.push('box');
                            //if (i === impostor) {
                            bodyConfig.size.push(sizeX);
                            bodyConfig.size.push(sizeY);
                            bodyConfig.size.push(sizeZ);
                            //} else {
                            //    bodyConfig.size.push(0,0,0);
                            //}
                            break;
                    }
                    //actually not needed, but hey...
                    i.object.rotationQuaternion = oldQuaternion;
                });
                impostor.physicsBody = this.world.add(bodyConfig);
            }
            else {
                this._tmpPositionVector.copyFromFloats(0, 0, 0);
            }
            impostor.setDeltaPosition(this._tmpPositionVector);
            //this._tmpPositionVector.addInPlace(impostor.mesh.getBoundingInfo().boundingBox.center);
            //this.setPhysicsBodyTransformation(impostor, this._tmpPositionVector, impostor.mesh.rotationQuaternion);
        };
        OimoJSPlugin.prototype.removePhysicsBody = function (impostor) {
            //impostor.physicsBody.dispose();
            //Same as : (older oimo versions)
            this.world.removeRigidBody(impostor.physicsBody);
        };
        OimoJSPlugin.prototype.generateJoint = function (impostorJoint) {
            var mainBody = impostorJoint.mainImpostor.physicsBody;
            var connectedBody = impostorJoint.connectedImpostor.physicsBody;
            if (!mainBody || !connectedBody) {
                return;
            }
            var jointData = impostorJoint.joint.jointData;
            var options = jointData.nativeParams || {};
            var type;
            var nativeJointData = {
                body1: mainBody,
                body2: connectedBody,
                axe1: options.axe1 || (jointData.mainAxis ? jointData.mainAxis.asArray() : null),
                axe2: options.axe2 || (jointData.connectedAxis ? jointData.connectedAxis.asArray() : null),
                pos1: options.pos1 || (jointData.mainPivot ? jointData.mainPivot.asArray() : null),
                pos2: options.pos2 || (jointData.connectedPivot ? jointData.connectedPivot.asArray() : null),
                min: options.min,
                max: options.max,
                collision: options.collision || jointData.collision,
                spring: options.spring,
                //supporting older version of Oimo
                world: this.world
            };
            switch (impostorJoint.joint.type) {
                case LIB.PhysicsJoint.BallAndSocketJoint:
                    type = "jointBall";
                    break;
                case LIB.PhysicsJoint.SpringJoint:
                    LIB.Tools.Warn("OIMO.js doesn't support Spring Constraint. Simulating using DistanceJoint instead");
                    var springData = jointData;
                    nativeJointData.min = springData.length || nativeJointData.min;
                    //Max should also be set, just make sure it is at least min
                    nativeJointData.max = Math.max(nativeJointData.min, nativeJointData.max);
                case LIB.PhysicsJoint.DistanceJoint:
                    type = "jointDistance";
                    nativeJointData.max = jointData.maxDistance;
                    break;
                case LIB.PhysicsJoint.PrismaticJoint:
                    type = "jointPrisme";
                    break;
                case LIB.PhysicsJoint.SliderJoint:
                    type = "jointSlide";
                    break;
                case LIB.PhysicsJoint.WheelJoint:
                    type = "jointWheel";
                    break;
                case LIB.PhysicsJoint.HingeJoint:
                default:
                    type = "jointHinge";
                    break;
            }
            nativeJointData.type = type;
            impostorJoint.joint.physicsJoint = this.world.add(nativeJointData);
        };
        OimoJSPlugin.prototype.removeJoint = function (impostorJoint) {
            //Bug in Oimo prevents us from disposing a joint in the playground
            //joint.joint.physicsJoint.dispose();
            //So we will bruteforce it!
            try {
                this.world.removeJoint(impostorJoint.joint.physicsJoint);
            }
            catch (e) {
                LIB.Tools.Warn(e);
            }
        };
        OimoJSPlugin.prototype.isSupported = function () {
            return this.BJSOIMO !== undefined;
        };
        OimoJSPlugin.prototype.setTransformationFromPhysicsBody = function (impostor) {
            if (!impostor.physicsBody.sleeping) {
                //TODO check that
                /*if (impostor.physicsBody.shapes.next) {
                    var parentShape = this._getLastShape(impostor.physicsBody);
                    impostor.object.position.copyFrom(parentShape.position);
                    console.log(parentShape.position);
                } else {*/
                impostor.object.position.copyFrom(impostor.physicsBody.getPosition());
                //}
                if (impostor.object.rotationQuaternion) {
                    impostor.object.rotationQuaternion.copyFrom(impostor.physicsBody.getQuaternion());
                }
            }
        };
        OimoJSPlugin.prototype.setPhysicsBodyTransformation = function (impostor, newPosition, newRotation) {
            var body = impostor.physicsBody;
            body.position.copy(newPosition);
            body.orientation.copy(newRotation);
            body.syncShapes();
            body.awake();
        };
        /*private _getLastShape(body: any): any {
            var lastShape = body.shapes;
            while (lastShape.next) {
                lastShape = lastShape.next;
            }
            return lastShape;
        }*/
        OimoJSPlugin.prototype.setLinearVelocity = function (impostor, velocity) {
            impostor.physicsBody.linearVelocity.init(velocity.x, velocity.y, velocity.z);
        };
        OimoJSPlugin.prototype.setAngularVelocity = function (impostor, velocity) {
            impostor.physicsBody.angularVelocity.init(velocity.x, velocity.y, velocity.z);
        };
        OimoJSPlugin.prototype.getLinearVelocity = function (impostor) {
            var v = impostor.physicsBody.linearVelocity;
            if (!v) {
                return null;
            }
            return new LIB.Vector3(v.x, v.y, v.z);
        };
        OimoJSPlugin.prototype.getAngularVelocity = function (impostor) {
            var v = impostor.physicsBody.angularVelocity;
            if (!v) {
                return null;
            }
            return new LIB.Vector3(v.x, v.y, v.z);
        };
        OimoJSPlugin.prototype.setBodyMass = function (impostor, mass) {
            var staticBody = mass === 0;
            //this will actually set the body's density and not its mass.
            //But this is how oimo treats the mass variable.
            impostor.physicsBody.shapes.density = staticBody ? 1 : mass;
            impostor.physicsBody.setupMass(staticBody ? 0x2 : 0x1);
        };
        OimoJSPlugin.prototype.getBodyMass = function (impostor) {
            return impostor.physicsBody.shapes.density;
        };
        OimoJSPlugin.prototype.getBodyFriction = function (impostor) {
            return impostor.physicsBody.shapes.friction;
        };
        OimoJSPlugin.prototype.setBodyFriction = function (impostor, friction) {
            impostor.physicsBody.shapes.friction = friction;
        };
        OimoJSPlugin.prototype.getBodyRestitution = function (impostor) {
            return impostor.physicsBody.shapes.restitution;
        };
        OimoJSPlugin.prototype.setBodyRestitution = function (impostor, restitution) {
            impostor.physicsBody.shapes.restitution = restitution;
        };
        OimoJSPlugin.prototype.sleepBody = function (impostor) {
            impostor.physicsBody.sleep();
        };
        OimoJSPlugin.prototype.wakeUpBody = function (impostor) {
            impostor.physicsBody.awake();
        };
        OimoJSPlugin.prototype.updateDistanceJoint = function (joint, maxDistance, minDistance) {
            joint.physicsJoint.limitMotor.upperLimit = maxDistance;
            if (minDistance !== void 0) {
                joint.physicsJoint.limitMotor.lowerLimit = minDistance;
            }
        };
        OimoJSPlugin.prototype.setMotor = function (joint, speed, maxForce, motorIndex) {
            //TODO separate rotational and transational motors.
            var motor = motorIndex ? joint.physicsJoint.rotationalLimitMotor2 : joint.physicsJoint.rotationalLimitMotor1 || joint.physicsJoint.rotationalLimitMotor || joint.physicsJoint.limitMotor;
            if (motor) {
                motor.setMotor(speed, maxForce);
            }
        };
        OimoJSPlugin.prototype.setLimit = function (joint, upperLimit, lowerLimit, motorIndex) {
            //TODO separate rotational and transational motors.
            var motor = motorIndex ? joint.physicsJoint.rotationalLimitMotor2 : joint.physicsJoint.rotationalLimitMotor1 || joint.physicsJoint.rotationalLimitMotor || joint.physicsJoint.limitMotor;
            if (motor) {
                motor.setLimit(upperLimit, lowerLimit === void 0 ? -upperLimit : lowerLimit);
            }
        };
        OimoJSPlugin.prototype.syncMeshWithImpostor = function (mesh, impostor) {
            var body = impostor.physicsBody;
            mesh.position.x = body.position.x;
            mesh.position.y = body.position.y;
            mesh.position.z = body.position.z;
            if (mesh.rotationQuaternion) {
                mesh.rotationQuaternion.x = body.orientation.x;
                mesh.rotationQuaternion.y = body.orientation.y;
                mesh.rotationQuaternion.z = body.orientation.z;
                mesh.rotationQuaternion.w = body.orientation.s;
            }
        };
        OimoJSPlugin.prototype.getRadius = function (impostor) {
            return impostor.physicsBody.shapes.radius;
        };
        OimoJSPlugin.prototype.getBoxSizeToRef = function (impostor, result) {
            var shape = impostor.physicsBody.shapes;
            result.x = shape.halfWidth * 2;
            result.y = shape.halfHeight * 2;
            result.z = shape.halfDepth * 2;
        };
        OimoJSPlugin.prototype.dispose = function () {
            this.world.clear();
        };
        return OimoJSPlugin;
    }());
    LIB.OimoJSPlugin = OimoJSPlugin;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.oimoJSPlugin.js.map
//# sourceMappingURL=LIB.oimoJSPlugin.js.map
