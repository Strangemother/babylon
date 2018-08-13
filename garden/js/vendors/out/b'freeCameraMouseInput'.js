

var LIB;
(function (LIB) {
    var FreeCameraMouseInput = /** @class */ (function () {
        function FreeCameraMouseInput(touchEnabled) {
            if (touchEnabled === void 0) { touchEnabled = true; }
            this.touchEnabled = touchEnabled;
            this.buttons = [0, 1, 2];
            this.angularSensibility = 2000.0;
            this.previousPosition = null;
        }
        FreeCameraMouseInput.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            var engine = this.camera.getEngine();
            if (!this._pointerInput) {
                this._pointerInput = function (p, s) {
                    var evt = p.event;
                    if (engine.isInVRExclusivePointerMode) {
                        return;
                    }
                    if (!_this.touchEnabled && evt.pointerType === "touch") {
                        return;
                    }
                    if (p.type !== LIB.PointerEventTypes.POINTERMOVE && _this.buttons.indexOf(evt.button) === -1) {
                        return;
                    }
                    var srcElement = (evt.srcElement || evt.target);
                    if (p.type === LIB.PointerEventTypes.POINTERDOWN && srcElement) {
                        try {
                            srcElement.setPointerCapture(evt.pointerId);
                        }
                        catch (e) {
                            //Nothing to do with the error. Execution will continue.
                        }
                        _this.previousPosition = {
                            x: evt.clientX,
                            y: evt.clientY
                        };
                        if (!noPreventDefault) {
                            evt.preventDefault();
                            element.focus();
                        }
                    }
                    else if (p.type === LIB.PointerEventTypes.POINTERUP && srcElement) {
                        try {
                            srcElement.releasePointerCapture(evt.pointerId);
                        }
                        catch (e) {
                            //Nothing to do with the error.
                        }
                        _this.previousPosition = null;
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                    else if (p.type === LIB.PointerEventTypes.POINTERMOVE) {
                        if (!_this.previousPosition || engine.isPointerLock) {
                            return;
                        }
                        var offsetX = evt.clientX - _this.previousPosition.x;
                        if (_this.camera.getScene().useRightHandedSystem)
                            offsetX *= -1;
                        if (_this.camera.parent && _this.camera.parent._getWorldMatrixDeterminant() < 0)
                            offsetX *= -1;
                        _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
                        var offsetY = evt.clientY - _this.previousPosition.y;
                        _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
                        _this.previousPosition = {
                            x: evt.clientX,
                            y: evt.clientY
                        };
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                };
            }
            this._onMouseMove = function (evt) {
                if (!engine.isPointerLock) {
                    return;
                }
                if (engine.isInVRExclusivePointerMode) {
                    return;
                }
                var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
                if (_this.camera.getScene().useRightHandedSystem)
                    offsetX *= -1;
                if (_this.camera.parent && _this.camera.parent._getWorldMatrixDeterminant() < 0)
                    offsetX *= -1;
                _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
                var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
                _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
                _this.previousPosition = null;
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };
            this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, LIB.PointerEventTypes.POINTERDOWN | LIB.PointerEventTypes.POINTERUP | LIB.PointerEventTypes.POINTERMOVE);
            element.addEventListener("mousemove", this._onMouseMove, false);
        };
        FreeCameraMouseInput.prototype.detachControl = function (element) {
            if (this._observer && element) {
                this.camera.getScene().onPointerObservable.remove(this._observer);
                if (this._onMouseMove) {
                    element.removeEventListener("mousemove", this._onMouseMove);
                }
                this._observer = null;
                this._onMouseMove = null;
                this.previousPosition = null;
            }
        };
        FreeCameraMouseInput.prototype.getClassName = function () {
            return "FreeCameraMouseInput";
        };
        FreeCameraMouseInput.prototype.getSimpleName = function () {
            return "mouse";
        };
        __decorate([
            LIB.serialize()
        ], FreeCameraMouseInput.prototype, "buttons", void 0);
        __decorate([
            LIB.serialize()
        ], FreeCameraMouseInput.prototype, "angularSensibility", void 0);
        return FreeCameraMouseInput;
    }());
    LIB.FreeCameraMouseInput = FreeCameraMouseInput;
    LIB.CameraInputTypes["FreeCameraMouseInput"] = FreeCameraMouseInput;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.freeCameraMouseInput.js.map
//# sourceMappingURL=LIB.freeCameraMouseInput.js.map
