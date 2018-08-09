(function (LIB) {
    var FreeCameraKeyboardMoveInput = /** @class */ (function () {
        function FreeCameraKeyboardMoveInput() {
            this._keys = new Array();
            this.keysUp = [38];
            this.keysDown = [40];
            this.keysLeft = [37];
            this.keysRight = [39];
        }
        FreeCameraKeyboardMoveInput.prototype.attachControl = function (element, noPreventDefault) {
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
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        _this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index === -1) {
                            _this._keys.push(evt.keyCode);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                }
                else {
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        _this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        _this.keysRight.indexOf(evt.keyCode) !== -1) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index >= 0) {
                            _this._keys.splice(index, 1);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                }
            });
        };
        FreeCameraKeyboardMoveInput.prototype.detachControl = function (element) {
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
        FreeCameraKeyboardMoveInput.prototype.checkInputs = function () {
            if (this._onKeyboardObserver) {
                var camera = this.camera;
                // Keyboard
                for (var index = 0; index < this._keys.length; index++) {
                    var keyCode = this._keys[index];
                    var speed = camera._computeLocalCameraSpeed();
                    if (this.keysLeft.indexOf(keyCode) !== -1) {
                        camera._localDirection.copyFromFloats(-speed, 0, 0);
                    }
                    else if (this.keysUp.indexOf(keyCode) !== -1) {
                        camera._localDirection.copyFromFloats(0, 0, speed);
                    }
                    else if (this.keysRight.indexOf(keyCode) !== -1) {
                        camera._localDirection.copyFromFloats(speed, 0, 0);
                    }
                    else if (this.keysDown.indexOf(keyCode) !== -1) {
                        camera._localDirection.copyFromFloats(0, 0, -speed);
                    }
                    if (camera.getScene().useRightHandedSystem) {
                        camera._localDirection.z *= -1;
                    }
                    camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
                    LIB.Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
                    camera.cameraDirection.addInPlace(camera._transformedDirection);
                }
            }
        };
        FreeCameraKeyboardMoveInput.prototype.getClassName = function () {
            return "FreeCameraKeyboardMoveInput";
        };
        FreeCameraKeyboardMoveInput.prototype._onLostFocus = function (e) {
            this._keys = [];
        };
        FreeCameraKeyboardMoveInput.prototype.getSimpleName = function () {
            return "keyboard";
        };
        __decorate([
            LIB.serialize()
        ], FreeCameraKeyboardMoveInput.prototype, "keysUp", void 0);
        __decorate([
            LIB.serialize()
        ], FreeCameraKeyboardMoveInput.prototype, "keysDown", void 0);
        __decorate([
            LIB.serialize()
        ], FreeCameraKeyboardMoveInput.prototype, "keysLeft", void 0);
        __decorate([
            LIB.serialize()
        ], FreeCameraKeyboardMoveInput.prototype, "keysRight", void 0);
        return FreeCameraKeyboardMoveInput;
    }());
    LIB.FreeCameraKeyboardMoveInput = FreeCameraKeyboardMoveInput;
    LIB.CameraInputTypes["FreeCameraKeyboardMoveInput"] = FreeCameraKeyboardMoveInput;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.freeCameraKeyboardMoveInput.js.map
