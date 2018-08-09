(function (LIB) {
    /**
     * ActionEvent is the event beint sent when an action is triggered.
     */
    var ActionEvent = /** @class */ (function () {
        /**
         * @param source The mesh or sprite that triggered the action.
         * @param pointerX The X mouse cursor position at the time of the event
         * @param pointerY The Y mouse cursor position at the time of the event
         * @param meshUnderPointer The mesh that is currently pointed at (can be null)
         * @param sourceEvent the original (browser) event that triggered the ActionEvent
         */
        function ActionEvent(source, pointerX, pointerY, meshUnderPointer, sourceEvent, additionalData) {
            this.source = source;
            this.pointerX = pointerX;
            this.pointerY = pointerY;
            this.meshUnderPointer = meshUnderPointer;
            this.sourceEvent = sourceEvent;
            this.additionalData = additionalData;
        }
        /**
         * Helper function to auto-create an ActionEvent from a source mesh.
         * @param source The source mesh that triggered the event
         * @param evt {Event} The original (browser) event
         */
        ActionEvent.CreateNew = function (source, evt, additionalData) {
            var scene = source.getScene();
            return new ActionEvent(source, scene.pointerX, scene.pointerY, scene.meshUnderPointer, evt, additionalData);
        };
        /**
         * Helper function to auto-create an ActionEvent from a source mesh.
         * @param source The source sprite that triggered the event
         * @param scene Scene associated with the sprite
         * @param evt {Event} The original (browser) event
         */
        ActionEvent.CreateNewFromSprite = function (source, scene, evt, additionalData) {
            return new ActionEvent(source, scene.pointerX, scene.pointerY, scene.meshUnderPointer, evt, additionalData);
        };
        /**
         * Helper function to auto-create an ActionEvent from a scene. If triggered by a mesh use ActionEvent.CreateNew
         * @param scene the scene where the event occurred
         * @param evt {Event} The original (browser) event
         */
        ActionEvent.CreateNewFromScene = function (scene, evt) {
            return new ActionEvent(null, scene.pointerX, scene.pointerY, scene.meshUnderPointer, evt);
        };
        ActionEvent.CreateNewFromPrimitive = function (prim, pointerPos, evt, additionalData) {
            return new ActionEvent(prim, pointerPos.x, pointerPos.y, null, evt, additionalData);
        };
        return ActionEvent;
    }());
    LIB.ActionEvent = ActionEvent;
    /**
     * Action Manager manages all events to be triggered on a given mesh or the global scene.
     * A single scene can have many Action Managers to handle predefined actions on specific meshes.
     */
    var ActionManager = /** @class */ (function () {
        function ActionManager(scene) {
            // Members
            this.actions = new Array();
            this.hoverCursor = '';
            this._scene = scene;
            scene._actionManagers.push(this);
        }
        Object.defineProperty(ActionManager, "NothingTrigger", {
            get: function () {
                return ActionManager._NothingTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnPickTrigger", {
            get: function () {
                return ActionManager._OnPickTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnLeftPickTrigger", {
            get: function () {
                return ActionManager._OnLeftPickTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnRightPickTrigger", {
            get: function () {
                return ActionManager._OnRightPickTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnCenterPickTrigger", {
            get: function () {
                return ActionManager._OnCenterPickTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnPickDownTrigger", {
            get: function () {
                return ActionManager._OnPickDownTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnDoublePickTrigger", {
            get: function () {
                return ActionManager._OnDoublePickTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnPickUpTrigger", {
            get: function () {
                return ActionManager._OnPickUpTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnPickOutTrigger", {
            /// This trigger will only be raised if you also declared a OnPickDown
            get: function () {
                return ActionManager._OnPickOutTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnLongPressTrigger", {
            get: function () {
                return ActionManager._OnLongPressTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnPointerOverTrigger", {
            get: function () {
                return ActionManager._OnPointerOverTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnPointerOutTrigger", {
            get: function () {
                return ActionManager._OnPointerOutTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnEveryFrameTrigger", {
            get: function () {
                return ActionManager._OnEveryFrameTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnIntersectionEnterTrigger", {
            get: function () {
                return ActionManager._OnIntersectionEnterTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnIntersectionExitTrigger", {
            get: function () {
                return ActionManager._OnIntersectionExitTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnKeyDownTrigger", {
            get: function () {
                return ActionManager._OnKeyDownTrigger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "OnKeyUpTrigger", {
            get: function () {
                return ActionManager._OnKeyUpTrigger;
            },
            enumerable: true,
            configurable: true
        });
        // Methods
        ActionManager.prototype.dispose = function () {
            var index = this._scene._actionManagers.indexOf(this);
            for (var i = 0; i < this.actions.length; i++) {
                var action = this.actions[i];
                ActionManager.Triggers[action.trigger]--;
                if (ActionManager.Triggers[action.trigger] === 0) {
                    delete ActionManager.Triggers[action.trigger];
                }
            }
            if (index > -1) {
                this._scene._actionManagers.splice(index, 1);
            }
        };
        ActionManager.prototype.getScene = function () {
            return this._scene;
        };
        /**
         * Does this action manager handles actions of any of the given triggers
         * @param {number[]} triggers - the triggers to be tested
         * @return {boolean} whether one (or more) of the triggers is handeled
         */
        ActionManager.prototype.hasSpecificTriggers = function (triggers) {
            for (var index = 0; index < this.actions.length; index++) {
                var action = this.actions[index];
                if (triggers.indexOf(action.trigger) > -1) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Does this action manager handles actions of a given trigger
         * @param {number} trigger - the trigger to be tested
         * @return {boolean} whether the trigger is handeled
         */
        ActionManager.prototype.hasSpecificTrigger = function (trigger) {
            for (var index = 0; index < this.actions.length; index++) {
                var action = this.actions[index];
                if (action.trigger === trigger) {
                    return true;
                }
            }
            return false;
        };
        Object.defineProperty(ActionManager.prototype, "hasPointerTriggers", {
            /**
             * Does this action manager has pointer triggers
             * @return {boolean} whether or not it has pointer triggers
             */
            get: function () {
                for (var index = 0; index < this.actions.length; index++) {
                    var action = this.actions[index];
                    if (action.trigger >= ActionManager._OnPickTrigger && action.trigger <= ActionManager._OnPointerOutTrigger) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager.prototype, "hasPickTriggers", {
            /**
             * Does this action manager has pick triggers
             * @return {boolean} whether or not it has pick triggers
             */
            get: function () {
                for (var index = 0; index < this.actions.length; index++) {
                    var action = this.actions[index];
                    if (action.trigger >= ActionManager._OnPickTrigger && action.trigger <= ActionManager._OnPickUpTrigger) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "HasTriggers", {
            /**
             * Does exist one action manager with at least one trigger
             * @return {boolean} whether or not it exists one action manager with one trigger
            **/
            get: function () {
                for (var t in ActionManager.Triggers) {
                    if (ActionManager.Triggers.hasOwnProperty(t)) {
                        return true;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionManager, "HasPickTriggers", {
            /**
             * Does exist one action manager with at least one pick trigger
             * @return {boolean} whether or not it exists one action manager with one pick trigger
            **/
            get: function () {
                for (var t in ActionManager.Triggers) {
                    if (ActionManager.Triggers.hasOwnProperty(t)) {
                        var t_int = parseInt(t);
                        if (t_int >= ActionManager._OnPickTrigger && t_int <= ActionManager._OnPickUpTrigger) {
                            return true;
                        }
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Does exist one action manager that handles actions of a given trigger
         * @param {number} trigger - the trigger to be tested
         * @return {boolean} whether the trigger is handeled by at least one action manager
        **/
        ActionManager.HasSpecificTrigger = function (trigger) {
            for (var t in ActionManager.Triggers) {
                if (ActionManager.Triggers.hasOwnProperty(t)) {
                    var t_int = parseInt(t);
                    if (t_int === trigger) {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * Registers an action to this action manager
         * @param {LIB.Action} action - the action to be registered
         * @return {LIB.Action} the action amended (prepared) after registration
         */
        ActionManager.prototype.registerAction = function (action) {
            if (action.trigger === ActionManager.OnEveryFrameTrigger) {
                if (this.getScene().actionManager !== this) {
                    LIB.Tools.Warn("OnEveryFrameTrigger can only be used with scene.actionManager");
                    return null;
                }
            }
            this.actions.push(action);
            if (ActionManager.Triggers[action.trigger]) {
                ActionManager.Triggers[action.trigger]++;
            }
            else {
                ActionManager.Triggers[action.trigger] = 1;
            }
            action._actionManager = this;
            action._prepare();
            return action;
        };
        /**
         * Process a specific trigger
         * @param {number} trigger - the trigger to process
         * @param evt {LIB.ActionEvent} the event details to be processed
         */
        ActionManager.prototype.processTrigger = function (trigger, evt) {
            for (var index = 0; index < this.actions.length; index++) {
                var action = this.actions[index];
                if (action.trigger === trigger) {
                    if (evt) {
                        if (trigger === ActionManager.OnKeyUpTrigger
                            || trigger === ActionManager.OnKeyDownTrigger) {
                            var parameter = action.getTriggerParameter();
                            if (parameter && parameter !== evt.sourceEvent.keyCode) {
                                if (!parameter.toLowerCase) {
                                    continue;
                                }
                                var lowerCase = parameter.toLowerCase();
                                if (lowerCase !== evt.sourceEvent.key) {
                                    var unicode = evt.sourceEvent.charCode ? evt.sourceEvent.charCode : evt.sourceEvent.keyCode;
                                    var actualkey = String.fromCharCode(unicode).toLowerCase();
                                    if (actualkey !== lowerCase) {
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                    action._executeCurrent(evt);
                }
            }
        };
        ActionManager.prototype._getEffectiveTarget = function (target, propertyPath) {
            var properties = propertyPath.split(".");
            for (var index = 0; index < properties.length - 1; index++) {
                target = target[properties[index]];
            }
            return target;
        };
        ActionManager.prototype._getProperty = function (propertyPath) {
            var properties = propertyPath.split(".");
            return properties[properties.length - 1];
        };
        ActionManager.prototype.serialize = function (name) {
            var root = {
                children: new Array(),
                name: name,
                type: 3,
                properties: new Array() // Empty for root but required
            };
            for (var i = 0; i < this.actions.length; i++) {
                var triggerObject = {
                    type: 0,
                    children: new Array(),
                    name: ActionManager.GetTriggerName(this.actions[i].trigger),
                    properties: new Array()
                };
                var triggerOptions = this.actions[i].triggerOptions;
                if (triggerOptions && typeof triggerOptions !== "number") {
                    if (triggerOptions.parameter instanceof LIB.Node) {
                        triggerObject.properties.push(LIB.Action._GetTargetProperty(triggerOptions.parameter));
                    }
                    else {
                        var parameter = {};
                        LIB.Tools.DeepCopy(triggerOptions.parameter, parameter, ["mesh"]);
                        if (triggerOptions.parameter.mesh) {
                            parameter._meshId = triggerOptions.parameter.mesh.id;
                        }
                        triggerObject.properties.push({ name: "parameter", targetType: null, value: parameter });
                    }
                }
                // Serialize child action, recursively
                this.actions[i].serialize(triggerObject);
                // Add serialized trigger
                root.children.push(triggerObject);
            }
            return root;
        };
        ActionManager.Parse = function (parsedActions, object, scene) {
            var actionManager = new ActionManager(scene);
            if (object === null)
                scene.actionManager = actionManager;
            else
                object.actionManager = actionManager;
            // instanciate a new object
            var instanciate = function (name, params) {
                // TODO: We will need to find a solution for the next line when using commonjs / es6 .
                var newInstance = Object.create(LIB.Tools.Instantiate("LIB." + name).prototype);
                newInstance.constructor.apply(newInstance, params);
                return newInstance;
            };
            var parseParameter = function (name, value, target, propertyPath) {
                if (propertyPath === null) {
                    // String, boolean or float
                    var floatValue = parseFloat(value);
                    if (value === "true" || value === "false")
                        return value === "true";
                    else
                        return isNaN(floatValue) ? value : floatValue;
                }
                var effectiveTarget = propertyPath.split(".");
                var values = value.split(",");
                // Get effective Target
                for (var i = 0; i < effectiveTarget.length; i++) {
                    target = target[effectiveTarget[i]];
                }
                // Return appropriate value with its type
                if (typeof (target) === "boolean")
                    return values[0] === "true";
                if (typeof (target) === "string")
                    return values[0];
                // Parameters with multiple values such as Vector3 etc.
                var split = new Array();
                for (var i = 0; i < values.length; i++)
                    split.push(parseFloat(values[i]));
                if (target instanceof LIB.Vector3)
                    return LIB.Vector3.FromArray(split);
                if (target instanceof LIB.Vector4)
                    return LIB.Vector4.FromArray(split);
                if (target instanceof LIB.Color3)
                    return LIB.Color3.FromArray(split);
                if (target instanceof LIB.Color4)
                    return LIB.Color4.FromArray(split);
                return parseFloat(values[0]);
            };
            // traverse graph per trigger
            var traverse = function (parsedAction, trigger, condition, action, combineArray) {
                if (combineArray === void 0) { combineArray = null; }
                if (parsedAction.detached)
                    return;
                var parameters = new Array();
                var target = null;
                var propertyPath = null;
                var combine = parsedAction.combine && parsedAction.combine.length > 0;
                // Parameters
                if (parsedAction.type === 2)
                    parameters.push(actionManager);
                else
                    parameters.push(trigger);
                if (combine) {
                    var actions = new Array();
                    for (var j = 0; j < parsedAction.combine.length; j++) {
                        traverse(parsedAction.combine[j], ActionManager.NothingTrigger, condition, action, actions);
                    }
                    parameters.push(actions);
                }
                else {
                    for (var i = 0; i < parsedAction.properties.length; i++) {
                        var value = parsedAction.properties[i].value;
                        var name = parsedAction.properties[i].name;
                        var targetType = parsedAction.properties[i].targetType;
                        if (name === "target")
                            if (targetType !== null && targetType === "SceneProperties")
                                value = target = scene;
                            else
                                value = target = scene.getNodeByName(value);
                        else if (name === "parent")
                            value = scene.getNodeByName(value);
                        else if (name === "sound")
                            value = scene.getSoundByName(value);
                        else if (name !== "propertyPath") {
                            if (parsedAction.type === 2 && name === "operator")
                                value = LIB.ValueCondition[value];
                            else
                                value = parseParameter(name, value, target, name === "value" ? propertyPath : null);
                        }
                        else {
                            propertyPath = value;
                        }
                        parameters.push(value);
                    }
                }
                if (combineArray === null) {
                    parameters.push(condition);
                }
                else {
                    parameters.push(null);
                }
                // If interpolate value action
                if (parsedAction.name === "InterpolateValueAction") {
                    var param = parameters[parameters.length - 2];
                    parameters[parameters.length - 1] = param;
                    parameters[parameters.length - 2] = condition;
                }
                // Action or condition(s) and not CombineAction
                var newAction = instanciate(parsedAction.name, parameters);
                if (newAction instanceof LIB.Condition && condition !== null) {
                    var nothing = new LIB.DoNothingAction(trigger, condition);
                    if (action)
                        action.then(nothing);
                    else
                        actionManager.registerAction(nothing);
                    action = nothing;
                }
                if (combineArray === null) {
                    if (newAction instanceof LIB.Condition) {
                        condition = newAction;
                        newAction = action;
                    }
                    else {
                        condition = null;
                        if (action)
                            action.then(newAction);
                        else
                            actionManager.registerAction(newAction);
                    }
                }
                else {
                    combineArray.push(newAction);
                }
                for (var i = 0; i < parsedAction.children.length; i++)
                    traverse(parsedAction.children[i], trigger, condition, newAction, null);
            };
            // triggers
            for (var i = 0; i < parsedActions.children.length; i++) {
                var triggerParams;
                var trigger = parsedActions.children[i];
                if (trigger.properties.length > 0) {
                    var param = trigger.properties[0].value;
                    var value = trigger.properties[0].targetType === null ? param : scene.getMeshByName(param);
                    if (value._meshId) {
                        value.mesh = scene.getMeshByID(value._meshId);
                    }
                    triggerParams = { trigger: ActionManager[trigger.name], parameter: value };
                }
                else
                    triggerParams = ActionManager[trigger.name];
                for (var j = 0; j < trigger.children.length; j++) {
                    if (!trigger.detached)
                        traverse(trigger.children[j], triggerParams, null, null);
                }
            }
        };
        ActionManager.GetTriggerName = function (trigger) {
            switch (trigger) {
                case 0: return "NothingTrigger";
                case 1: return "OnPickTrigger";
                case 2: return "OnLeftPickTrigger";
                case 3: return "OnRightPickTrigger";
                case 4: return "OnCenterPickTrigger";
                case 5: return "OnPickDownTrigger";
                case 6: return "OnPickUpTrigger";
                case 7: return "OnLongPressTrigger";
                case 8: return "OnPointerOverTrigger";
                case 9: return "OnPointerOutTrigger";
                case 10: return "OnEveryFrameTrigger";
                case 11: return "OnIntersectionEnterTrigger";
                case 12: return "OnIntersectionExitTrigger";
                case 13: return "OnKeyDownTrigger";
                case 14: return "OnKeyUpTrigger";
                case 15: return "OnPickOutTrigger";
                default: return "";
            }
        };
        // Statics
        ActionManager._NothingTrigger = 0;
        ActionManager._OnPickTrigger = 1;
        ActionManager._OnLeftPickTrigger = 2;
        ActionManager._OnRightPickTrigger = 3;
        ActionManager._OnCenterPickTrigger = 4;
        ActionManager._OnPickDownTrigger = 5;
        ActionManager._OnDoublePickTrigger = 6;
        ActionManager._OnPickUpTrigger = 7;
        ActionManager._OnLongPressTrigger = 8;
        ActionManager._OnPointerOverTrigger = 9;
        ActionManager._OnPointerOutTrigger = 10;
        ActionManager._OnEveryFrameTrigger = 11;
        ActionManager._OnIntersectionEnterTrigger = 12;
        ActionManager._OnIntersectionExitTrigger = 13;
        ActionManager._OnKeyDownTrigger = 14;
        ActionManager._OnKeyUpTrigger = 15;
        ActionManager._OnPickOutTrigger = 16;
        ActionManager.Triggers = {};
        return ActionManager;
    }());
    LIB.ActionManager = ActionManager;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.actionManager.js.map
