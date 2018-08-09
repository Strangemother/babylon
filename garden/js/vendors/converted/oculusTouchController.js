(function (LIB) {
    var OculusTouchController = /** @class */ (function (_super) {
        __extends(OculusTouchController, _super);
        function OculusTouchController(vrGamepad) {
            var _this = _super.call(this, vrGamepad) || this;
            _this.onSecondaryTriggerStateChangedObservable = new LIB.Observable();
            _this.onThumbRestChangedObservable = new LIB.Observable();
            _this.controllerType = LIB.PoseEnabledControllerType.OCULUS;
            return _this;
        }
        OculusTouchController.prototype.initControllerMesh = function (scene, meshLoaded) {
            var _this = this;
            var meshName;
            // Hand
            if (this.hand === 'left') {
                meshName = OculusTouchController.MODEL_LEFT_FILENAME;
            }
            else {
                meshName = OculusTouchController.MODEL_RIGHT_FILENAME;
            }
            LIB.SceneLoader.ImportMesh("", OculusTouchController.MODEL_BASE_URL, meshName, scene, function (newMeshes) {
                /*
                Parent Mesh name: oculus_touch_left
                - body
                - trigger
                - thumbstick
                - grip
                - button_y
                - button_x
                - button_enter
                */
                _this._defaultModel = newMeshes[1];
                _this.attachToMesh(_this._defaultModel);
                if (meshLoaded) {
                    meshLoaded(_this._defaultModel);
                }
            });
        };
        Object.defineProperty(OculusTouchController.prototype, "onAButtonStateChangedObservable", {
            // helper getters for left and right hand.
            get: function () {
                if (this.hand === 'right') {
                    return this.onMainButtonStateChangedObservable;
                }
                else {
                    throw new Error('No A button on left hand');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OculusTouchController.prototype, "onBButtonStateChangedObservable", {
            get: function () {
                if (this.hand === 'right') {
                    return this.onSecondaryButtonStateChangedObservable;
                }
                else {
                    throw new Error('No B button on left hand');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OculusTouchController.prototype, "onXButtonStateChangedObservable", {
            get: function () {
                if (this.hand === 'left') {
                    return this.onMainButtonStateChangedObservable;
                }
                else {
                    throw new Error('No X button on right hand');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OculusTouchController.prototype, "onYButtonStateChangedObservable", {
            get: function () {
                if (this.hand === 'left') {
                    return this.onSecondaryButtonStateChangedObservable;
                }
                else {
                    throw new Error('No Y button on right hand');
                }
            },
            enumerable: true,
            configurable: true
        });
        /*
         0) thumb stick (touch, press, value = pressed (0,1)). value is in this.leftStick
         1) index trigger (touch (?), press (only when value > 0.1), value 0 to 1)
         2) secondary trigger (same)
         3) A (right) X (left), touch, pressed = value
         4) B / Y
         5) thumb rest
        */
        OculusTouchController.prototype.handleButtonChange = function (buttonIdx, state, changes) {
            var notifyObject = state; //{ state: state, changes: changes };
            var triggerDirection = this.hand === 'right' ? -1 : 1;
            switch (buttonIdx) {
                case 0:
                    this.onPadStateChangedObservable.notifyObservers(notifyObject);
                    return;
                case 1:// index trigger
                    if (this._defaultModel) {
                        (this._defaultModel.getChildren()[3]).rotation.x = -notifyObject.value * 0.20;
                        (this._defaultModel.getChildren()[3]).position.y = -notifyObject.value * 0.005;
                        (this._defaultModel.getChildren()[3]).position.z = -notifyObject.value * 0.005;
                    }
                    this.onTriggerStateChangedObservable.notifyObservers(notifyObject);
                    return;
                case 2:// secondary trigger
                    if (this._defaultModel) {
                        (this._defaultModel.getChildren()[4]).position.x = triggerDirection * notifyObject.value * 0.0035;
                    }
                    this.onSecondaryTriggerStateChangedObservable.notifyObservers(notifyObject);
                    return;
                case 3:
                    if (this._defaultModel) {
                        if (notifyObject.pressed) {
                            (this._defaultModel.getChildren()[1]).position.y = -0.001;
                        }
                        else {
                            (this._defaultModel.getChildren()[1]).position.y = 0;
                        }
                    }
                    this.onMainButtonStateChangedObservable.notifyObservers(notifyObject);
                    return;
                case 4:
                    if (this._defaultModel) {
                        if (notifyObject.pressed) {
                            (this._defaultModel.getChildren()[2]).position.y = -0.001;
                        }
                        else {
                            (this._defaultModel.getChildren()[2]).position.y = 0;
                        }
                    }
                    this.onSecondaryButtonStateChangedObservable.notifyObservers(notifyObject);
                    return;
                case 5:
                    this.onThumbRestChangedObservable.notifyObservers(notifyObject);
                    return;
            }
        };
        OculusTouchController.MODEL_BASE_URL = 'https://controllers.LIBjs.com/oculus/';
        OculusTouchController.MODEL_LEFT_FILENAME = 'left.LIB';
        OculusTouchController.MODEL_RIGHT_FILENAME = 'right.LIB';
        return OculusTouchController;
    }(LIB.WebVRController));
    LIB.OculusTouchController = OculusTouchController;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.oculusTouchController.js.map
