var BABYLON;
(function (BABYLON) {
    var ArcRotateCameraMouseWheelInput = /** @class */ (function () {
        function ArcRotateCameraMouseWheelInput() {
            this.wheelPrecision = 3.0;
            /**
             * wheelDeltaPercentage will be used instead of wheelPrecision if different from 0.
             * It defines the percentage of current camera.radius to use as delta when wheel is used.
             */
            this.wheelDeltaPercentage = 0;
        }
        ArcRotateCameraMouseWheelInput.prototype.attachControl = function (element, noPreventDefault) {
            var _this = this;
            this._wheel = function (p, s) {
                //sanity check - this should be a PointerWheel event.
                if (p.type !== BABYLON.PointerEventTypes.POINTERWHEEL)
                    return;
                var event = p.event;
                var delta = 0;
                if (event.wheelDelta) {
                    delta = _this.wheelDeltaPercentage ? (event.wheelDelta * 0.01) * _this.camera.radius * _this.wheelDeltaPercentage : event.wheelDelta / (_this.wheelPrecision * 40);
                }
                else if (event.detail) {
                    delta = -event.detail / _this.wheelPrecision;
                }
                if (delta)
                    _this.camera.inertialRadiusOffset += delta;
                if (event.preventDefault) {
                    if (!noPreventDefault) {
                        event.preventDefault();
                    }
                }
            };
            this._observer = this.camera.getScene().onPointerObservable.add(this._wheel, BABYLON.PointerEventTypes.POINTERWHEEL);
        };
        ArcRotateCameraMouseWheelInput.prototype.detachControl = function (element) {
            if (this._observer && element) {
                this.camera.getScene().onPointerObservable.remove(this._observer);
                this._observer = null;
                this._wheel = null;
            }
        };
        ArcRotateCameraMouseWheelInput.prototype.getClassName = function () {
            return "ArcRotateCameraMouseWheelInput";
        };
        ArcRotateCameraMouseWheelInput.prototype.getSimpleName = function () {
            return "mousewheel";
        };
        __decorate([
            BABYLON.serialize()
        ], ArcRotateCameraMouseWheelInput.prototype, "wheelPrecision", void 0);
        __decorate([
            BABYLON.serialize()
        ], ArcRotateCameraMouseWheelInput.prototype, "wheelDeltaPercentage", void 0);
        return ArcRotateCameraMouseWheelInput;
    }());
    BABYLON.ArcRotateCameraMouseWheelInput = ArcRotateCameraMouseWheelInput;
    BABYLON.CameraInputTypes["ArcRotateCameraMouseWheelInput"] = ArcRotateCameraMouseWheelInput;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.arcRotateCameraMouseWheelInput.js.map
