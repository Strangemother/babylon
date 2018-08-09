var BABYLON;
(function (BABYLON) {
    var SwitchBooleanAction = /** @class */ (function (_super) {
        __extends(SwitchBooleanAction, _super);
        function SwitchBooleanAction(triggerOptions, target, propertyPath, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this.propertyPath = propertyPath;
            _this._target = _this._effectiveTarget = target;
            return _this;
        }
        SwitchBooleanAction.prototype._prepare = function () {
            this._effectiveTarget = this._getEffectiveTarget(this._effectiveTarget, this.propertyPath);
            this._property = this._getProperty(this.propertyPath);
        };
        SwitchBooleanAction.prototype.execute = function () {
            this._effectiveTarget[this._property] = !this._effectiveTarget[this._property];
        };
        SwitchBooleanAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "SwitchBooleanAction",
                properties: [
                    BABYLON.Action._GetTargetProperty(this._target),
                    { name: "propertyPath", value: this.propertyPath }
                ]
            }, parent);
        };
        return SwitchBooleanAction;
    }(BABYLON.Action));
    BABYLON.SwitchBooleanAction = SwitchBooleanAction;
    var SetStateAction = /** @class */ (function (_super) {
        __extends(SetStateAction, _super);
        function SetStateAction(triggerOptions, target, value, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this.value = value;
            _this._target = target;
            return _this;
        }
        SetStateAction.prototype.execute = function () {
            this._target.state = this.value;
        };
        SetStateAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "SetStateAction",
                properties: [
                    BABYLON.Action._GetTargetProperty(this._target),
                    { name: "value", value: this.value }
                ]
            }, parent);
        };
        return SetStateAction;
    }(BABYLON.Action));
    BABYLON.SetStateAction = SetStateAction;
    var SetValueAction = /** @class */ (function (_super) {
        __extends(SetValueAction, _super);
        function SetValueAction(triggerOptions, target, propertyPath, value, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this.propertyPath = propertyPath;
            _this.value = value;
            _this._target = _this._effectiveTarget = target;
            return _this;
        }
        SetValueAction.prototype._prepare = function () {
            this._effectiveTarget = this._getEffectiveTarget(this._effectiveTarget, this.propertyPath);
            this._property = this._getProperty(this.propertyPath);
        };
        SetValueAction.prototype.execute = function () {
            this._effectiveTarget[this._property] = this.value;
            if (this._target.markAsDirty) {
                this._target.markAsDirty(this._property);
            }
        };
        SetValueAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "SetValueAction",
                properties: [
                    BABYLON.Action._GetTargetProperty(this._target),
                    { name: "propertyPath", value: this.propertyPath },
                    { name: "value", value: BABYLON.Action._SerializeValueAsString(this.value) }
                ]
            }, parent);
        };
        return SetValueAction;
    }(BABYLON.Action));
    BABYLON.SetValueAction = SetValueAction;
    var IncrementValueAction = /** @class */ (function (_super) {
        __extends(IncrementValueAction, _super);
        function IncrementValueAction(triggerOptions, target, propertyPath, value, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this.propertyPath = propertyPath;
            _this.value = value;
            _this._target = _this._effectiveTarget = target;
            return _this;
        }
        IncrementValueAction.prototype._prepare = function () {
            this._effectiveTarget = this._getEffectiveTarget(this._effectiveTarget, this.propertyPath);
            this._property = this._getProperty(this.propertyPath);
            if (typeof this._effectiveTarget[this._property] !== "number") {
                BABYLON.Tools.Warn("Warning: IncrementValueAction can only be used with number values");
            }
        };
        IncrementValueAction.prototype.execute = function () {
            this._effectiveTarget[this._property] += this.value;
            if (this._target.markAsDirty) {
                this._target.markAsDirty(this._property);
            }
        };
        IncrementValueAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "IncrementValueAction",
                properties: [
                    BABYLON.Action._GetTargetProperty(this._target),
                    { name: "propertyPath", value: this.propertyPath },
                    { name: "value", value: BABYLON.Action._SerializeValueAsString(this.value) }
                ]
            }, parent);
        };
        return IncrementValueAction;
    }(BABYLON.Action));
    BABYLON.IncrementValueAction = IncrementValueAction;
    var PlayAnimationAction = /** @class */ (function (_super) {
        __extends(PlayAnimationAction, _super);
        function PlayAnimationAction(triggerOptions, target, from, to, loop, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this.from = from;
            _this.to = to;
            _this.loop = loop;
            _this._target = target;
            return _this;
        }
        PlayAnimationAction.prototype._prepare = function () {
        };
        PlayAnimationAction.prototype.execute = function () {
            var scene = this._actionManager.getScene();
            scene.beginAnimation(this._target, this.from, this.to, this.loop);
        };
        PlayAnimationAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "PlayAnimationAction",
                properties: [
                    BABYLON.Action._GetTargetProperty(this._target),
                    { name: "from", value: String(this.from) },
                    { name: "to", value: String(this.to) },
                    { name: "loop", value: BABYLON.Action._SerializeValueAsString(this.loop) || false }
                ]
            }, parent);
        };
        return PlayAnimationAction;
    }(BABYLON.Action));
    BABYLON.PlayAnimationAction = PlayAnimationAction;
    var StopAnimationAction = /** @class */ (function (_super) {
        __extends(StopAnimationAction, _super);
        function StopAnimationAction(triggerOptions, target, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this._target = target;
            return _this;
        }
        StopAnimationAction.prototype._prepare = function () {
        };
        StopAnimationAction.prototype.execute = function () {
            var scene = this._actionManager.getScene();
            scene.stopAnimation(this._target);
        };
        StopAnimationAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "StopAnimationAction",
                properties: [BABYLON.Action._GetTargetProperty(this._target)]
            }, parent);
        };
        return StopAnimationAction;
    }(BABYLON.Action));
    BABYLON.StopAnimationAction = StopAnimationAction;
    var DoNothingAction = /** @class */ (function (_super) {
        __extends(DoNothingAction, _super);
        function DoNothingAction(triggerOptions, condition) {
            if (triggerOptions === void 0) { triggerOptions = BABYLON.ActionManager.NothingTrigger; }
            return _super.call(this, triggerOptions, condition) || this;
        }
        DoNothingAction.prototype.execute = function () {
        };
        DoNothingAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "DoNothingAction",
                properties: []
            }, parent);
        };
        return DoNothingAction;
    }(BABYLON.Action));
    BABYLON.DoNothingAction = DoNothingAction;
    var CombineAction = /** @class */ (function (_super) {
        __extends(CombineAction, _super);
        function CombineAction(triggerOptions, children, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this.children = children;
            return _this;
        }
        CombineAction.prototype._prepare = function () {
            for (var index = 0; index < this.children.length; index++) {
                this.children[index]._actionManager = this._actionManager;
                this.children[index]._prepare();
            }
        };
        CombineAction.prototype.execute = function (evt) {
            for (var index = 0; index < this.children.length; index++) {
                this.children[index].execute(evt);
            }
        };
        CombineAction.prototype.serialize = function (parent) {
            var serializationObject = _super.prototype._serialize.call(this, {
                name: "CombineAction",
                properties: [],
                combine: []
            }, parent);
            for (var i = 0; i < this.children.length; i++) {
                serializationObject.combine.push(this.children[i].serialize(null));
            }
            return serializationObject;
        };
        return CombineAction;
    }(BABYLON.Action));
    BABYLON.CombineAction = CombineAction;
    var ExecuteCodeAction = /** @class */ (function (_super) {
        __extends(ExecuteCodeAction, _super);
        function ExecuteCodeAction(triggerOptions, func, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this.func = func;
            return _this;
        }
        ExecuteCodeAction.prototype.execute = function (evt) {
            this.func(evt);
        };
        return ExecuteCodeAction;
    }(BABYLON.Action));
    BABYLON.ExecuteCodeAction = ExecuteCodeAction;
    var SetParentAction = /** @class */ (function (_super) {
        __extends(SetParentAction, _super);
        function SetParentAction(triggerOptions, target, parent, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this._target = target;
            _this._parent = parent;
            return _this;
        }
        SetParentAction.prototype._prepare = function () {
        };
        SetParentAction.prototype.execute = function () {
            if (this._target.parent === this._parent) {
                return;
            }
            var invertParentWorldMatrix = this._parent.getWorldMatrix().clone();
            invertParentWorldMatrix.invert();
            this._target.position = BABYLON.Vector3.TransformCoordinates(this._target.position, invertParentWorldMatrix);
            this._target.parent = this._parent;
        };
        SetParentAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "SetParentAction",
                properties: [
                    BABYLON.Action._GetTargetProperty(this._target),
                    BABYLON.Action._GetTargetProperty(this._parent),
                ]
            }, parent);
        };
        return SetParentAction;
    }(BABYLON.Action));
    BABYLON.SetParentAction = SetParentAction;
    var PlaySoundAction = /** @class */ (function (_super) {
        __extends(PlaySoundAction, _super);
        function PlaySoundAction(triggerOptions, sound, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this._sound = sound;
            return _this;
        }
        PlaySoundAction.prototype._prepare = function () {
        };
        PlaySoundAction.prototype.execute = function () {
            if (this._sound !== undefined)
                this._sound.play();
        };
        PlaySoundAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "PlaySoundAction",
                properties: [{ name: "sound", value: this._sound.name }]
            }, parent);
        };
        return PlaySoundAction;
    }(BABYLON.Action));
    BABYLON.PlaySoundAction = PlaySoundAction;
    var StopSoundAction = /** @class */ (function (_super) {
        __extends(StopSoundAction, _super);
        function StopSoundAction(triggerOptions, sound, condition) {
            var _this = _super.call(this, triggerOptions, condition) || this;
            _this._sound = sound;
            return _this;
        }
        StopSoundAction.prototype._prepare = function () {
        };
        StopSoundAction.prototype.execute = function () {
            if (this._sound !== undefined)
                this._sound.stop();
        };
        StopSoundAction.prototype.serialize = function (parent) {
            return _super.prototype._serialize.call(this, {
                name: "StopSoundAction",
                properties: [{ name: "sound", value: this._sound.name }]
            }, parent);
        };
        return StopSoundAction;
    }(BABYLON.Action));
    BABYLON.StopSoundAction = StopSoundAction;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.directActions.js.map
