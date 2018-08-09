(function (LIB) {
    var ArcRotateCameraKeyboardMoveInput = /** @class */ (function () {
        function ArcRotateCameraKeyboardMoveInput() {
            this._keys = new Array();
            this.keysUp = [38];
            this.keysDown = [40];
            this.keysLeft = [37];
            this.keysRight = [39];
            this.keysReset = [220];
            this.panningSensibility = 50.0;
            this.zoomingSensibility = 25.0;
            this.useAltToZoom = true;
        }
        ArcRotateCameraKeyboardMoveInput.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            if (this._onCanvasBlurObserver) {
                return;
            }
            this._scene = this.camera.getScene();
            this._engine = this._scene.getEngine();
            this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(function () {
                _this._keys = [];
            });
            this._onKeyboardObserver = this._scene.onKeyboardObservable.add(function (info) {
                var evt = info.event;
                if (info.type === LIB.KeyboardEventTypes.KEYDOWN) {
                    _this._ctrlPressed = evt.ctrlKey;
                    _this._altPressed = evt.altKey;
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        _this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1 ||
                        _this.keysReset.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index === -1) {
                            _this._keys.push(evt.keyCode);
                        }
                        if (evt.preventDefault) {
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                        }
                    }
                }
                else {
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        _this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1 ||
                        _this.keysReset.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index >= 0) {
                            _this._keys.splice(index, 1);
                        }
                        if (evt.preventDefault) {
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                        }
                    }
                }
            });
        };
        ArcRotateCameraKeyboardMoveInput.prototype.detachControl = function (element) {
            if (this._scene) {
                if (this._onKeyboardObserver) {
                    this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
                }
                if (this._onCanvasBlurObserver) {
                    this._engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
                }
                this._onKeyboardObserver = null;
                this._onCanvasBlurObserver = null;
            }
            this._keys = [];
        };
        ArcRotateCameraKeyboardMoveInput.prototype.checkInputs = function () {
            if (this._onKeyboardObserver) {
                var camera = this.camera;
                for (var index = 0; index < this._keys.length; index++) {
                    var keyCode = this._keys[index];
                    if (this.keysLeft.indexOf(keyCode) !== -1) {
                        if (this._ctrlPressed && this.camera._useCtrlForPanning) {
                            camera.inertialPanningX -= 1 / this.panningSensibility;
                        }
                        else {
                            camera.inertialAlphaOffset -= 0.01;
                        }
                    }
                    else if (this.keysUp.indexOf(keyCode) !== -1) {
                        if (this._ctrlPressed && this.camera._useCtrlForPanning) {
                            camera.inertialPanningY += 1 / this.panningSensibility;
                        }
                        else if (this._altPressed && this.useAltToZoom) {
                            camera.inertialRadiusOffset += 1 / this.zoomingSensibility;
                        }
                        else {
                            camera.inertialBetaOffset -= 0.01;
                        }
                    }
                    else if (this.keysRight.indexOf(keyCode) !== -1) {
                        if (this._ctrlPressed && this.camera._useCtrlForPanning) {
                            camera.inertialPanningX += 1 / this.panningSensibility;
                        }
                        else {
                            camera.inertialAlphaOffset += 0.01;
                        }
                    }
                    else if (this.keysDown.indexOf(keyCode) !== -1) {
                        if (this._ctrlPressed && this.camera._useCtrlForPanning) {
                            camera.inertialPanningY -= 1 / this.panningSensibility;
                        }
                        else if (this._altPressed && this.useAltToZoom) {
                            camera.inertialRadiusOffset -= 1 / this.zoomingSensibility;
                        }
                        else {
                            camera.inertialBetaOffset += 0.01;
                        }
                    }
                    else if (this.keysReset.indexOf(keyCode) !== -1) {
                        camera.restoreState();
                    }
                }
            }
        };
        ArcRotateCameraKeyboardMoveInput.prototype.getClassName = function () {
            return "ArcRotateCameraKeyboardMoveInput";
        };
        ArcRotateCameraKeyboardMoveInput.prototype.getSimpleName = function () {
            return "keyboard";
        };
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraKeyboardMoveInput.prototype, "keysUp", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraKeyboardMoveInput.prototype, "keysDown", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraKeyboardMoveInput.prototype, "keysLeft", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraKeyboardMoveInput.prototype, "keysRight", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraKeyboardMoveInput.prototype, "keysReset", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraKeyboardMoveInput.prototype, "panningSensibility", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraKeyboardMoveInput.prototype, "zoomingSensibility", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraKeyboardMoveInput.prototype, "useAltToZoom", void 0);
        return ArcRotateCameraKeyboardMoveInput;
    }());
    LIB.ArcRotateCameraKeyboardMoveInput = ArcRotateCameraKeyboardMoveInput;
    LIB.CameraInputTypes["ArcRotateCameraKeyboardMoveInput"] = ArcRotateCameraKeyboardMoveInput;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.arcRotateCameraKeyboardMoveInput.js.map
