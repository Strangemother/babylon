var BABYLON;
(function (BABYLON) {
    var Condition = /** @class */ (function () {
        function Condition(actionManager) {
            this._actionManager = actionManager;
        }
        Condition.prototype.isValid = function () {
            return true;
        };
        Condition.prototype._getProperty = function (propertyPath) {
            return this._actionManager._getProperty(propertyPath);
        };
        Condition.prototype._getEffectiveTarget = function (target, propertyPath) {
            return this._actionManager._getEffectiveTarget(target, propertyPath);
        };
        Condition.prototype.serialize = function () {
        };
        Condition.prototype._serialize = function (serializedCondition) {
            return {
                type: 2,
                children: [],
                name: serializedCondition.name,
                properties: serializedCondition.properties
            };
        };
        return Condition;
    }());
    BABYLON.Condition = Condition;
    var ValueCondition = /** @class */ (function (_super) {
        __extends(ValueCondition, _super);
        function ValueCondition(actionManager, target, propertyPath, value, operator) {
            if (operator === void 0) { operator = ValueCondition.IsEqual; }
            var _this = _super.call(this, actionManager) || this;
            _this.propertyPath = propertyPath;
            _this.value = value;
            _this.operator = operator;
            _this._target = target;
            _this._effectiveTarget = _this._getEffectiveTarget(target, _this.propertyPath);
            _this._property = _this._getProperty(_this.propertyPath);
            return _this;
        }
        Object.defineProperty(ValueCondition, "IsEqual", {
            get: function () {
                return ValueCondition._IsEqual;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueCondition, "IsDifferent", {
            get: function () {
                return ValueCondition._IsDifferent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueCondition, "IsGreater", {
            get: function () {
                return ValueCondition._IsGreater;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueCondition, "IsLesser", {
            get: function () {
                return ValueCondition._IsLesser;
            },
            enumerable: true,
            configurable: true
        });
        // Methods
        ValueCondition.prototype.isValid = function () {
            switch (this.operator) {
                case ValueCondition.IsGreater:
                    return this._effectiveTarget[this._property] > this.value;
                case ValueCondition.IsLesser:
                    return this._effectiveTarget[this._property] < this.value;
                case ValueCondition.IsEqual:
                case ValueCondition.IsDifferent:
                    var check;
                    if (this.value.equals) {
                        check = this.value.equals(this._effectiveTarget[this._property]);
                    }
                    else {
                        check = this.value === this._effectiveTarget[this._property];
                    }
                    return this.operator === ValueCondition.IsEqual ? check : !check;
            }
            return false;
        };
        ValueCondition.prototype.serialize = function () {
            return this._serialize({
                name: "ValueCondition",
                properties: [
                    BABYLON.Action._GetTargetProperty(this._target),
                    { name: "propertyPath", value: this.propertyPath },
                    { name: "value", value: BABYLON.Action._SerializeValueAsString(this.value) },
                    { name: "operator", value: ValueCondition.GetOperatorName(this.operator) }
                ]
            });
        };
        ValueCondition.GetOperatorName = function (operator) {
            switch (operator) {
                case ValueCondition._IsEqual: return "IsEqual";
                case ValueCondition._IsDifferent: return "IsDifferent";
                case ValueCondition._IsGreater: return "IsGreater";
                case ValueCondition._IsLesser: return "IsLesser";
                default: return "";
            }
        };
        // Statics
        ValueCondition._IsEqual = 0;
        ValueCondition._IsDifferent = 1;
        ValueCondition._IsGreater = 2;
        ValueCondition._IsLesser = 3;
        return ValueCondition;
    }(Condition));
    BABYLON.ValueCondition = ValueCondition;
    var PredicateCondition = /** @class */ (function (_super) {
        __extends(PredicateCondition, _super);
        function PredicateCondition(actionManager, predicate) {
            var _this = _super.call(this, actionManager) || this;
            _this.predicate = predicate;
            return _this;
        }
        PredicateCondition.prototype.isValid = function () {
            return this.predicate();
        };
        return PredicateCondition;
    }(Condition));
    BABYLON.PredicateCondition = PredicateCondition;
    var StateCondition = /** @class */ (function (_super) {
        __extends(StateCondition, _super);
        function StateCondition(actionManager, target, value) {
            var _this = _super.call(this, actionManager) || this;
            _this.value = value;
            _this._target = target;
            return _this;
        }
        // Methods
        StateCondition.prototype.isValid = function () {
            return this._target.state === this.value;
        };
        StateCondition.prototype.serialize = function () {
            return this._serialize({
                name: "StateCondition",
                properties: [
                    BABYLON.Action._GetTargetProperty(this._target),
                    { name: "value", value: this.value }
                ]
            });
        };
        return StateCondition;
    }(Condition));
    BABYLON.StateCondition = StateCondition;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.condition.js.map
