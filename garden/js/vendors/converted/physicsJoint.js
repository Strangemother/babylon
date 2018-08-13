

var LIB;
(function (LIB) {
    /**
     * This is a holder class for the physics joint created by the physics plugin.
     * It holds a set of functions to control the underlying joint.
     */
    var PhysicsJoint = /** @class */ (function () {
        function PhysicsJoint(type, jointData) {
            this.type = type;
            this.jointData = jointData;
            jointData.nativeParams = jointData.nativeParams || {};
        }
        Object.defineProperty(PhysicsJoint.prototype, "physicsJoint", {
            get: function () {
                return this._physicsJoint;
            },
            set: function (newJoint) {
                if (this._physicsJoint) {
                    //remove from the wolrd
                }
                this._physicsJoint = newJoint;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhysicsJoint.prototype, "physicsPlugin", {
            set: function (physicsPlugin) {
                this._physicsPlugin = physicsPlugin;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Execute a function that is physics-plugin specific.
         * @param {Function} func the function that will be executed.
         *                        It accepts two parameters: the physics world and the physics joint.
         */
        PhysicsJoint.prototype.executeNativeFunction = function (func) {
            func(this._physicsPlugin.world, this._physicsJoint);
        };
        //TODO check if the native joints are the same
        //Joint Types
        PhysicsJoint.DistanceJoint = 0;
        PhysicsJoint.HingeJoint = 1;
        PhysicsJoint.BallAndSocketJoint = 2;
        PhysicsJoint.WheelJoint = 3;
        PhysicsJoint.SliderJoint = 4;
        //OIMO
        PhysicsJoint.PrismaticJoint = 5;
        //ENERGY FTW! (compare with this - http://ode-wiki.org/wiki/index.php?title=Manual:_Joint_Types_and_Functions)
        PhysicsJoint.UniversalJoint = 6;
        PhysicsJoint.Hinge2Joint = PhysicsJoint.WheelJoint;
        //Cannon
        //Similar to a Ball-Joint. Different in params
        PhysicsJoint.PointToPointJoint = 8;
        //Cannon only at the moment
        PhysicsJoint.SpringJoint = 9;
        PhysicsJoint.LockJoint = 10;
        return PhysicsJoint;
    }());
    LIB.PhysicsJoint = PhysicsJoint;
    /**
     * A class representing a physics distance joint.
     */
    var DistanceJoint = /** @class */ (function (_super) {
        __extends(DistanceJoint, _super);
        function DistanceJoint(jointData) {
            return _super.call(this, PhysicsJoint.DistanceJoint, jointData) || this;
        }
        /**
         * Update the predefined distance.
         */
        DistanceJoint.prototype.updateDistance = function (maxDistance, minDistance) {
            this._physicsPlugin.updateDistanceJoint(this, maxDistance, minDistance);
        };
        return DistanceJoint;
    }(PhysicsJoint));
    LIB.DistanceJoint = DistanceJoint;
    var MotorEnabledJoint = /** @class */ (function (_super) {
        __extends(MotorEnabledJoint, _super);
        function MotorEnabledJoint(type, jointData) {
            return _super.call(this, type, jointData) || this;
        }
        /**
         * Set the motor values.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         * @param {number} force the force to apply
         * @param {number} maxForce max force for this motor.
         */
        MotorEnabledJoint.prototype.setMotor = function (force, maxForce) {
            this._physicsPlugin.setMotor(this, force || 0, maxForce);
        };
        /**
         * Set the motor's limits.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         */
        MotorEnabledJoint.prototype.setLimit = function (upperLimit, lowerLimit) {
            this._physicsPlugin.setLimit(this, upperLimit, lowerLimit);
        };
        return MotorEnabledJoint;
    }(PhysicsJoint));
    LIB.MotorEnabledJoint = MotorEnabledJoint;
    /**
     * This class represents a single hinge physics joint
     */
    var HingeJoint = /** @class */ (function (_super) {
        __extends(HingeJoint, _super);
        function HingeJoint(jointData) {
            return _super.call(this, PhysicsJoint.HingeJoint, jointData) || this;
        }
        /**
         * Set the motor values.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         * @param {number} force the force to apply
         * @param {number} maxForce max force for this motor.
         */
        HingeJoint.prototype.setMotor = function (force, maxForce) {
            this._physicsPlugin.setMotor(this, force || 0, maxForce);
        };
        /**
         * Set the motor's limits.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         */
        HingeJoint.prototype.setLimit = function (upperLimit, lowerLimit) {
            this._physicsPlugin.setLimit(this, upperLimit, lowerLimit);
        };
        return HingeJoint;
    }(MotorEnabledJoint));
    LIB.HingeJoint = HingeJoint;
    /**
     * This class represents a dual hinge physics joint (same as wheel joint)
     */
    var Hinge2Joint = /** @class */ (function (_super) {
        __extends(Hinge2Joint, _super);
        function Hinge2Joint(jointData) {
            return _super.call(this, PhysicsJoint.Hinge2Joint, jointData) || this;
        }
        /**
         * Set the motor values.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         * @param {number} force the force to apply
         * @param {number} maxForce max force for this motor.
         * @param {motorIndex} the motor's index, 0 or 1.
         */
        Hinge2Joint.prototype.setMotor = function (force, maxForce, motorIndex) {
            if (motorIndex === void 0) { motorIndex = 0; }
            this._physicsPlugin.setMotor(this, force || 0, maxForce, motorIndex);
        };
        /**
         * Set the motor limits.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         * @param {number} upperLimit the upper limit
         * @param {number} lowerLimit lower limit
         * @param {motorIndex} the motor's index, 0 or 1.
         */
        Hinge2Joint.prototype.setLimit = function (upperLimit, lowerLimit, motorIndex) {
            if (motorIndex === void 0) { motorIndex = 0; }
            this._physicsPlugin.setLimit(this, upperLimit, lowerLimit, motorIndex);
        };
        return Hinge2Joint;
    }(MotorEnabledJoint));
    LIB.Hinge2Joint = Hinge2Joint;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.physicsJoint.js.map
//# sourceMappingURL=LIB.physicsJoint.js.map
