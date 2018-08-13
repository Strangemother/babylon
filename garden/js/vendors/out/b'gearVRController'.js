

var LIB;
(function (LIB) {
    /**
     * Gear VR Controller
     */
    var GearVRController = /** @class */ (function (_super) {
        __extends(GearVRController, _super);
        /**
         * Creates a new GearVRController from a gamepad
         * @param vrGamepad the gamepad that the controller should be created from
         */
        function GearVRController(vrGamepad) {
            var _this = _super.call(this, vrGamepad) || this;
            _this._buttonIndexToObservableNameMap = [
                'onTrackpadChangedObservable',
                'onTriggerStateChangedObservable' // Trigger
            ];
            _this.controllerType = LIB.PoseEnabledControllerType.GEAR_VR;
            return _this;
        }
        /**
         * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
         * @param scene scene in which to add meshes
         * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
         */
        GearVRController.prototype.initControllerMesh = function (scene, meshLoaded) {
            var _this = this;
            LIB.SceneLoader.ImportMesh("", GearVRController.MODEL_BASE_URL, GearVRController.MODEL_FILENAME, scene, function (newMeshes) {
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
        GearVRController.prototype._handleButtonChange = function (buttonIdx, state, changes) {
            if (buttonIdx < this._buttonIndexToObservableNameMap.length) {
                var observableName = this._buttonIndexToObservableNameMap[buttonIdx];
                // Only emit events for buttons that we know how to map from index to observable
                var observable = this[observableName];
                if (observable) {
                    observable.notifyObservers(state);
                }
            }
        };
        /**
         * Base Url for the controller model.
         */
        GearVRController.MODEL_BASE_URL = 'https://controllers.LIBjs.com/generic/';
        /**
         * File name for the controller model.
         */
        GearVRController.MODEL_FILENAME = 'generic.LIB';
        /**
         * Gamepad Id prefix used to identify this controller.
         */
        GearVRController.GAMEPAD_ID_PREFIX = 'Gear VR'; // id is 'Gear VR Controller'
        return GearVRController;
    }(LIB.WebVRController));
    LIB.GearVRController = GearVRController;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.gearVRController.js.map
//# sourceMappingURL=LIB.gearVRController.js.map
