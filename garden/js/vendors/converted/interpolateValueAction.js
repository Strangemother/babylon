(function (LIB) {
    var InterpolateValueAction = /** @class */ (function (_super) {
        __extends(InterpolateValueAction, _super);
        function InterpolateValueAction(triggerOptions, target, propertyPath, value, duration, condition, stopOtherAnimations, onInterpolationDone) {
            if (duration === void 0) { duration = 1000; }
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this.propertyPath = propertyPath;
            _this.value = value;
            _this.duration = duration;
            _this.stopOtherAnimations = stopOtherAnimations;
            _this.onInterpolationDone = onInterpolationDone;
            _this.onInterpolationDoneObservable = new LIB.Observable();
            _this._target = _this._effectiveTarget = target;
            return _this;
        }
        InterpolateValueAction.prototype._prepare = function () {
            this._effectiveTarget = this._getEffectiveTarget(this._effectiveTarget, this.propertyPath);
            this._property = this._getProperty(this.propertyPath);
        };
        InterpolateValueAction.prototype.execute = function () {
            var _this = this;
            var scene = this._actionManager.getScene();
            var keys = [
                {
                    frame: 0,
                    value: this._effectiveTarget[this._property]
                }, {
                    frame: 100,
                    value: this.value
                }
            ];
            var dataType;
            if (typeof this.value === "number") {
                dataType = LIB.Animation.ANIMATIONTYPE_FLOAT;
            }
            else if (this.value instanceof LIB.Color3) {
                dataType = LIB.Animation.ANIMATIONTYPE_COLOR3;
            }
            else if (this.value instanceof LIB.Vector3) {
                dataType = LIB.Animation.ANIMATIONTYPE_VECTOR3;
            }
            else if (this.value instanceof LIB.Matrix) {
                dataType = LIB.Animation.ANIMATIONTYPE_MATRIX;
            }
            else if (this.value instanceof LIB.Quaternion) {
                dataType = LIB.Animation.ANIMATIONTYPE_QUATERNION;
            }
            else {
                LIB.Tools.Warn("InterpolateValueAction: Unsupported type (" + typeof this.value + ")");
                return;
            }
            var animation = new LIB.Animation("InterpolateValueAction", this._property, 100 * (1000.0 / this.duration), dataType, LIB.Animation.ANIMATIONLOOPMODE_CONSTANT);
            animation.setKeys(keys);
            if (this.stopOtherAnimations) {
                scene.stopAnimation(this._effectiveTarget);
            }
            var wrapper = function () {
                _this.onInterpolationDoneObservable.notifyObservers(_this);
                if (_this.onInterpolationDone) {
                    _this.onInterpolationDone();
                }
            };
            scene.beginDirectAnimation(this._effectiveTarget, [animation], 0, 100, false, 1, wrapper);
        };
        InterpolateValueAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "InterpolateValueAction",
                properties: [
                    LIB.Action._GetTargetProperty(this._target),
                    { name: "propertyPath", value: this.propertyPath },
                    { name: "value", value: LIB.Action._SerializeValueAsString(this.value) },
                    { name: "duration", value: LIB.Action._SerializeValueAsString(this.duration) },
                    { name: "stopOtherAnimations", value: LIB.Action._SerializeValueAsString(this.stopOtherAnimations) || false }
                ]
            }, parent);
        };
        return InterpolateValueAction;
    }(LIB.Action));
    LIB.InterpolateValueAction = InterpolateValueAction;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.interpolateValueAction.js.map
