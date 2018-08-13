

var LIB;
(function (LIB) {
    // We're mainly based on the logic defined into the FreeCamera code
    var VirtualJoysticksCamera = /** @class */ (function (_super) {
        __extends(VirtualJoysticksCamera, _super);
        function VirtualJoysticksCamera(name, position, scene) {
            var _this = _super.call(this, name, position, scene) || this;
            _this.inputs.addVirtualJoystick();
            return _this;
        }
        VirtualJoysticksCamera.prototype.getClassName = function () {
            return "VirtualJoysticksCamera";
        };
        return VirtualJoysticksCamera;
    }(LIB.FreeCamera));
    LIB.VirtualJoysticksCamera = VirtualJoysticksCamera;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.virtualJoysticksCamera.js.map
//# sourceMappingURL=LIB.virtualJoysticksCamera.js.map
