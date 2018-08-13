

var LIB;
(function (LIB) {
    /**
     * Google Daydream controller
     */
    var DaydreamController = /** @class */ (function (_super) {
        __extends(DaydreamController, _super);
        /**
         * Creates a new DaydreamController from a gamepad
         * @param vrGamepad the gamepad that the controller should be created from
         */
        function DaydreamController(vrGamepad) {
            var _this = _super.call(this, vrGamepad) || this;
            _this.controllerType = LIB.PoseEnabledControllerType.DAYDREAM;
            return _this;
        }
        /**
         * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
         * @param scene scene in which to add meshes
         * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
         */
        DaydreamController.prototype.initControllerMesh = function (scene, meshLoaded) {
            var _this = this;
            LIB.SceneLoader.ImportMesh("", DaydreamController.MODEL_BASE_URL, DaydreamController.MODEL_FILENAME, scene, function (newMeshes) {
                _this._defaultModel = newMeshes[1];
                _this.attachToMesh(_this._defaultModel);
                if (meshLoaded) {
                    meshLoaded(_this._defaultModel);
                }
            });
        };
        /**
         * Called once for each button that changed state since the last frame
         * @param buttonIdx Which button index changed
         * @param state New state of the button
         * @param changes Which properties on the state changed since last frame
         */
        DaydreamController.prototype._handleButtonChange = function (buttonIdx, state, changes) {
            // Daydream controller only has 1 GamepadButton (on the trackpad).
            if (buttonIdx === 0) {
                var observable = this.onTriggerStateChangedObservable;
                if (observable) {
                    observable.notifyObservers(state);
                }
            }
            else {
                // If the app or home buttons are ever made available
                LIB.Tools.Warn("Unrecognized Daydream button index: " + buttonIdx);
            }
        };
        /**
         * Base Url for the controller model.
         */
        DaydreamController.MODEL_BASE_URL = 'https://controllers.LIBjs.com/generic/';
        /**
         * File name for the controller model.
         */
        DaydreamController.MODEL_FILENAME = 'generic.LIB';
        /**
         * Gamepad Id prefix used to identify Daydream Controller.
         */
        DaydreamController.GAMEPAD_ID_PREFIX = 'Daydream'; // id is 'Daydream Controller'
        return DaydreamController;
    }(LIB.WebVRController));
    LIB.DaydreamController = DaydreamController;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.daydreamController.js.map
//# sourceMappingURL=LIB.daydreamController.js.map
