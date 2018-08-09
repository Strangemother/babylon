var BABYLON;
(function (BABYLON) {
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
    }(BABYLON.FreeCamera));
    BABYLON.VirtualJoysticksCamera = VirtualJoysticksCamera;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.virtualJoysticksCamera.js.map
