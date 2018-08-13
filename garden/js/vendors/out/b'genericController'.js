

var LIB;
(function (LIB) {
    /**
     * Generic Controller
     */
    var GenericController = /** @class */ (function (_super) {
        __extends(GenericController, _super);
        /**
         * Creates a new GenericController from a gamepad
         * @param vrGamepad the gamepad that the controller should be created from
         */
        function GenericController(vrGamepad) {
            return _super.call(this, vrGamepad) || this;
        }
        /**
         * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
         * @param scene scene in which to add meshes
         * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
         */
        GenericController.prototype.initControllerMesh = function (scene, meshLoaded) {
            var _this = this;
            LIB.SceneLoader.ImportMesh("", GenericController.MODEL_BASE_URL, GenericController.MODEL_FILENAME, scene, function (newMeshes) {
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
        GenericController.prototype._handleButtonChange = function (buttonIdx, state, changes) {
            console.log("Button id: " + buttonIdx + "state: ");
            console.dir(state);
        };
        /**
         * Base Url for the controller model.
         */
        GenericController.MODEL_BASE_URL = 'https://controllers.LIBjs.com/generic/';
        /**
         * File name for the controller model.
         */
        GenericController.MODEL_FILENAME = 'generic.LIB';
        return GenericController;
    }(LIB.WebVRController));
    LIB.GenericController = GenericController;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.genericController.js.map
//# sourceMappingURL=LIB.genericController.js.map
