

var LIB;
(function (LIB) {
    var ArcRotateCameraPointersInput = /** @class */ (function () {
        function ArcRotateCameraPointersInput() {
            this.buttons = [0, 1, 2];
            this.angularSensibilityX = 1000.0;
            this.angularSensibilityY = 1000.0;
            this.pinchPrecision = 12.0;
            /**
             * pinchDeltaPercentage will be used instead of pinchPrecision if different from 0.
             * It defines the percentage of current camera.radius to use as delta when pinch zoom is used.
             */
            this.pinchDeltaPercentage = 0;
            this.panningSensibility = 1000.0;
            this.multiTouchPanning = true;
            this.multiTouchPanAndZoom = true;
            this._isPanClick = false;
            this.pinchInwards = true;
        }
        ArcRotateCameraPointersInput.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            var engine = this.camera.getEngine();
            var cacheSoloPointer; // cache pointer object for better perf on camera rotation
            var pointA = null;
            var pointB = null;
            var previousPinchSquaredDistance = 0;
            var initialDistance = 0;
            var twoFingerActivityCount = 0;
            var previousMultiTouchPanPosition = { x: 0, y: 0, isPaning: false, isPinching: false };
            this._pointerInput = function (p, s) {
                var evt = p.event;
                var isTouch = p.event.pointerType === "touch";
                if (engine.isInVRExclusivePointerMode) {
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
                    // Manage panning with pan button click
                    _this._isPanClick = evt.button === _this.camera._panningMouseButton;
                    // manage pointers
                    cacheSoloPointer = { x: evt.clientX, y: evt.clientY, pointerId: evt.pointerId, type: evt.pointerType };
                    if (pointA === null) {
                        pointA = cacheSoloPointer;
                    }
                    else if (pointB === null) {
                        pointB = cacheSoloPointer;
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                        element.focus();
                    }
                }
                else if (p.type === LIB.PointerEventTypes.POINTERDOUBLETAP) {
                    _this.camera.restoreState();
                }
                else if (p.type === LIB.PointerEventTypes.POINTERUP && srcElement) {
                    try {
                        srcElement.releasePointerCapture(evt.pointerId);
                    }
                    catch (e) {
                        //Nothing to do with the error.
                    }
                    cacheSoloPointer = null;
                    previousPinchSquaredDistance = 0;
                    previousMultiTouchPanPosition.isPaning = false;
                    previousMultiTouchPanPosition.isPinching = false;
                    twoFingerActivityCount = 0;
                    initialDistance = 0;
                    if (!isTouch) {
                        pointB = null; // Mouse and pen are mono pointer
                    }
                    //would be better to use pointers.remove(evt.pointerId) for multitouch gestures, 
                    //but emptying completly pointers collection is required to fix a bug on iPhone : 
                    //when changing orientation while pinching camera, one pointer stay pressed forever if we don't release all pointers  
                    //will be ok to put back pointers.remove(evt.pointerId); when iPhone bug corrected
                    if (engine._badOS) {
                        pointA = pointB = null;
                    }
                    else {
                        //only remove the impacted pointer in case of multitouch allowing on most 
                        //platforms switching from rotate to zoom and pan seamlessly.
                        if (pointB && pointA && pointA.pointerId == evt.pointerId) {
                            pointA = pointB;
                            pointB = null;
                            cacheSoloPointer = { x: pointA.x, y: pointA.y, pointerId: pointA.pointerId, type: evt.pointerType };
                        }
                        else if (pointA && pointB && pointB.pointerId == evt.pointerId) {
                            pointB = null;
                            cacheSoloPointer = { x: pointA.x, y: pointA.y, pointerId: pointA.pointerId, type: evt.pointerType };
                        }
                        else {
                            pointA = pointB = null;
                        }
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
                else if (p.type === LIB.PointerEventTypes.POINTERMOVE) {
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                    // One button down
                    if (pointA && pointB === null && cacheSoloPointer) {
                        if (_this.panningSensibility !== 0 &&
                            ((evt.ctrlKey && _this.camera._useCtrlForPanning) || _this._isPanClick)) {
                            _this.camera.inertialPanningX += -(evt.clientX - cacheSoloPointer.x) / _this.panningSensibility;
                            _this.camera.inertialPanningY += (evt.clientY - cacheSoloPointer.y) / _this.panningSensibility;
                        }
                        else {
                            var offsetX = evt.clientX - cacheSoloPointer.x;
                            var offsetY = evt.clientY - cacheSoloPointer.y;
                            _this.camera.inertialAlphaOffset -= offsetX / _this.angularSensibilityX;
                            _this.camera.inertialBetaOffset -= offsetY / _this.angularSensibilityY;
                        }
                        cacheSoloPointer.x = evt.clientX;
                        cacheSoloPointer.y = evt.clientY;
                    }
                    // Two buttons down: pinch/pan
                    else if (pointA && pointB) {
                        //if (noPreventDefault) { evt.preventDefault(); } //if pinch gesture, could be useful to force preventDefault to avoid html page scroll/zoom in some mobile browsers
                        var ed = (pointA.pointerId === evt.pointerId) ? pointA : pointB;
                        ed.x = evt.clientX;
                        ed.y = evt.clientY;
                        var direction = _this.pinchInwards ? 1 : -1;
                        var distX = pointA.x - pointB.x;
                        var distY = pointA.y - pointB.y;
                        var pinchSquaredDistance = (distX * distX) + (distY * distY);
                        var pinchDistance = Math.sqrt(pinchSquaredDistance);
                        if (previousPinchSquaredDistance === 0) {
                            initialDistance = pinchDistance;
                            previousPinchSquaredDistance = pinchSquaredDistance;
                            previousMultiTouchPanPosition.x = (pointA.x + pointB.x) / 2;
                            previousMultiTouchPanPosition.y = (pointA.y + pointB.y) / 2;
                            return;
                        }
                        if (_this.multiTouchPanAndZoom) {
                            if (_this.pinchDeltaPercentage) {
                                _this.camera.inertialRadiusOffset += ((pinchSquaredDistance - previousPinchSquaredDistance) * 0.001) * _this.camera.radius * _this.pinchDeltaPercentage;
                            }
                            else {
                                _this.camera.inertialRadiusOffset += (pinchSquaredDistance - previousPinchSquaredDistance) /
                                    (_this.pinchPrecision *
                                        ((_this.angularSensibilityX + _this.angularSensibilityY) / 2) *
                                        direction);
                            }
                            if (_this.panningSensibility !== 0) {
                                var pointersCenterX = (pointA.x + pointB.x) / 2;
                                var pointersCenterY = (pointA.y + pointB.y) / 2;
                                var pointersCenterDistX = pointersCenterX - previousMultiTouchPanPosition.x;
                                var pointersCenterDistY = pointersCenterY - previousMultiTouchPanPosition.y;
                                previousMultiTouchPanPosition.x = pointersCenterX;
                                previousMultiTouchPanPosition.y = pointersCenterY;
                                _this.camera.inertialPanningX += -(pointersCenterDistX) / (_this.panningSensibility);
                                _this.camera.inertialPanningY += (pointersCenterDistY) / (_this.panningSensibility);
                            }
                        }
                        else {
                            twoFingerActivityCount++;
                            if (previousMultiTouchPanPosition.isPinching || (twoFingerActivityCount < 20 && Math.abs(pinchDistance - initialDistance) > _this.camera.pinchToPanMaxDistance)) {
                                if (_this.pinchDeltaPercentage) {
                                    _this.camera.inertialRadiusOffset += ((pinchSquaredDistance - previousPinchSquaredDistance) * 0.001) * _this.camera.radius * _this.pinchDeltaPercentage;
                                }
                                else {
                                    _this.camera.inertialRadiusOffset += (pinchSquaredDistance - previousPinchSquaredDistance) /
                                        (_this.pinchPrecision *
                                            ((_this.angularSensibilityX + _this.angularSensibilityY) / 2) *
                                            direction);
                                }
                                previousMultiTouchPanPosition.isPaning = false;
                                previousMultiTouchPanPosition.isPinching = true;
                            }
                            else {
                                if (cacheSoloPointer && cacheSoloPointer.pointerId === ed.pointerId && _this.panningSensibility !== 0 && _this.multiTouchPanning) {
                                    if (!previousMultiTouchPanPosition.isPaning) {
                                        previousMultiTouchPanPosition.isPaning = true;
                                        previousMultiTouchPanPosition.isPinching = false;
                                        previousMultiTouchPanPosition.x = ed.x;
                                        previousMultiTouchPanPosition.y = ed.y;
                                        return;
                                    }
                                    _this.camera.inertialPanningX += -(ed.x - previousMultiTouchPanPosition.x) / (_this.panningSensibility);
                                    _this.camera.inertialPanningY += (ed.y - previousMultiTouchPanPosition.y) / (_this.panningSensibility);
                                }
                            }
                            if (cacheSoloPointer && cacheSoloPointer.pointerId === evt.pointerId) {
                                previousMultiTouchPanPosition.x = ed.x;
                                previousMultiTouchPanPosition.y = ed.y;
                            }
                        }
                        previousPinchSquaredDistance = pinchSquaredDistance;
                    }
                }
            };
            this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, LIB.PointerEventTypes.POINTERDOWN | LIB.PointerEventTypes.POINTERUP | LIB.PointerEventTypes.POINTERMOVE | LIB.PointerEventTypes._POINTERDOUBLETAP);
            this._onContextMenu = function (evt) {
                evt.preventDefault();
            };
            if (!this.camera._useCtrlForPanning) {
                element.addEventListener("contextmenu", this._onContextMenu, false);
            }
            this._onLostFocus = function () {
                //this._keys = [];
                pointA = pointB = null;
                previousPinchSquaredDistance = 0;
                previousMultiTouchPanPosition.isPaning = false;
                previousMultiTouchPanPosition.isPinching = false;
                twoFingerActivityCount = 0;
                cacheSoloPointer = null;
                initialDistance = 0;
            };
            this._onMouseMove = function (evt) {
                if (!engine.isPointerLock) {
                    return;
                }
                var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
                var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
                _this.camera.inertialAlphaOffset -= offsetX / _this.angularSensibilityX;
                _this.camera.inertialBetaOffset -= offsetY / _this.angularSensibilityY;
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };
            this._onGestureStart = function (e) {
                if (window.MSGesture === undefined) {
                    return;
                }
                if (!_this._MSGestureHandler) {
                    _this._MSGestureHandler = new MSGesture();
                    _this._MSGestureHandler.target = element;
                }
                _this._MSGestureHandler.addPointer(e.pointerId);
            };
            this._onGesture = function (e) {
                _this.camera.radius *= e.scale;
                if (e.preventDefault) {
                    if (!noPreventDefault) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            };
            element.addEventListener("mousemove", this._onMouseMove, false);
            element.addEventListener("MSPointerDown", this._onGestureStart, false);
            element.addEventListener("MSGestureChange", this._onGesture, false);
            LIB.Tools.RegisterTopRootEvents([
                { name: "blur", handler: this._onLostFocus }
            ]);
        };
        ArcRotateCameraPointersInput.prototype.detachControl = function (element) {
            if (this._onLostFocus) {
                LIB.Tools.UnregisterTopRootEvents([
                    { name: "blur", handler: this._onLostFocus }
                ]);
            }
            if (element && this._observer) {
                this.camera.getScene().onPointerObservable.remove(this._observer);
                this._observer = null;
                if (this._onContextMenu) {
                    element.removeEventListener("contextmenu", this._onContextMenu);
                }
                if (this._onMouseMove) {
                    element.removeEventListener("mousemove", this._onMouseMove);
                }
                if (this._onGestureStart) {
                    element.removeEventListener("MSPointerDown", this._onGestureStart);
                }
                if (this._onGesture) {
                    element.removeEventListener("MSGestureChange", this._onGesture);
                }
                this._isPanClick = false;
                this.pinchInwards = true;
                this._onMouseMove = null;
                this._onGestureStart = null;
                this._onGesture = null;
                this._MSGestureHandler = null;
                this._onLostFocus = null;
                this._onContextMenu = null;
            }
        };
        ArcRotateCameraPointersInput.prototype.getClassName = function () {
            return "ArcRotateCameraPointersInput";
        };
        ArcRotateCameraPointersInput.prototype.getSimpleName = function () {
            return "pointers";
        };
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraPointersInput.prototype, "buttons", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraPointersInput.prototype, "angularSensibilityX", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraPointersInput.prototype, "angularSensibilityY", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraPointersInput.prototype, "pinchPrecision", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraPointersInput.prototype, "pinchDeltaPercentage", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraPointersInput.prototype, "panningSensibility", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraPointersInput.prototype, "multiTouchPanning", void 0);
        __decorate([
            LIB.serialize()
        ], ArcRotateCameraPointersInput.prototype, "multiTouchPanAndZoom", void 0);
        return ArcRotateCameraPointersInput;
    }());
    LIB.ArcRotateCameraPointersInput = ArcRotateCameraPointersInput;
    LIB.CameraInputTypes["ArcRotateCameraPointersInput"] = ArcRotateCameraPointersInput;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.arcRotateCameraPointersInput.js.map
//# sourceMappingURL=LIB.arcRotateCameraPointersInput.js.map
