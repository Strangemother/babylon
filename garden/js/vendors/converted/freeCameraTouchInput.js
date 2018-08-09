(function (LIB) {
    var FreeCameraTouchInput = /** @class */ (function () {
        function FreeCameraTouchInput() {
            this._offsetX = null;
            this._offsetY = null;
            this._pointerPressed = new Array();
            this.touchAngularSensibility = 200000.0;
            this.touchMoveSensibility = 250.0;
        }
        FreeCameraTouchInput.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            var previousPosition = null;
            if (this._pointerInput === undefined) {
                this._onLostFocus = function (evt) {
                    _this._offsetX = null;
                    _this._offsetY = null;
                };
                this._pointerInput = function (p, s) {
                    var evt = p.event;
                    if (evt.pointerType === "mouse") {
                        return;
                    }
                    if (p.type === LIB.PointerEventTypes.POINTERDOWN) {
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                        _this._pointerPressed.push(evt.pointerId);
                        if (_this._pointerPressed.length !== 1) {
                            return;
                        }
                        previousPosition = {
                            x: evt.clientX,
                            y: evt.clientY
                        };
                    }
                    else if (p.type === LIB.PointerEventTypes.POINTERUP) {
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                        var index = _this._pointerPressed.indexOf(evt.pointerId);
                        if (index === -1) {
                            return;
                        }
                        _this._pointerPressed.splice(index, 1);
                        if (index != 0) {
                            return;
                        }
                        previousPosition = null;
                        _this._offsetX = null;
                        _this._offsetY = null;
                    }
                    else if (p.type === LIB.PointerEventTypes.POINTERMOVE) {
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                        if (!previousPosition) {
                            return;
                        }
                        var index = _this._pointerPressed.indexOf(evt.pointerId);
                        if (index != 0) {
                            return;
                        }
                        _this._offsetX = evt.clientX - previousPosition.x;
                        _this._offsetY = -(evt.clientY - previousPosition.y);
                    }
                };
            }
            this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, LIB.PointerEventTypes.POINTERDOWN | LIB.PointerEventTypes.POINTERUP | LIB.PointerEventTypes.POINTERMOVE);
            if (this._onLostFocus) {
                element.addEventListener("blur", this._onLostFocus);
            }
        };
        FreeCameraTouchInput.prototype.detachControl = function (element) {
            if (this._pointerInput && element) {
                if (this._observer) {
                    this.camera.getScene().onPointerObservable.remove(this._observer);
                    this._observer = null;
                }
                if (this._onLostFocus) {
                    element.removeEventListener("blur", this._onLostFocus);
                    this._onLostFocus = null;
                }
                this._pointerPressed = [];
                this._offsetX = null;
                this._offsetY = null;
            }
        };
        FreeCameraTouchInput.prototype.checkInputs = function () {
            if (this._offsetX && this._offsetY) {
                var camera = this.camera;
                camera.cameraRotation.y += this._offsetX / this.touchAngularSensibility;
                if (this._pointerPressed.length > 1) {
                    camera.cameraRotation.x += -this._offsetY / this.touchAngularSensibility;
                }
                else {
                    var speed = camera._computeLocalCameraSpeed();
                    var direction = new LIB.Vector3(0, 0, speed * this._offsetY / this.touchMoveSensibility);
                    LIB.Matrix.RotationYawPitchRollToRef(camera.rotation.y, camera.rotation.x, 0, camera._cameraRotationMatrix);
                    camera.cameraDirection.addInPlace(LIB.Vector3.TransformCoordinates(direction, camera._cameraRotationMatrix));
                }
            }
        };
        FreeCameraTouchInput.prototype.getClassName = function () {
            return "FreeCameraTouchInput";
        };
        FreeCameraTouchInput.prototype.getSimpleName = function () {
            return "touch";
        };
        __decorate([
            LIB.serialize()
        ], FreeCameraTouchInput.prototype, "touchAngularSensibility", void 0);
        __decorate([
            LIB.serialize()
        ], FreeCameraTouchInput.prototype, "touchMoveSensibility", void 0);
        return FreeCameraTouchInput;
    }());
    LIB.FreeCameraTouchInput = FreeCameraTouchInput;
    LIB.CameraInputTypes["FreeCameraTouchInput"] = FreeCameraTouchInput;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.freeCameraTouchInput.js.map
