var BABYLON;
(function (BABYLON) {
    var GenericController = /** @class */ (function (_super) {
        __extends(GenericController, _super);
        function GenericController(vrGamepad) {
            return _super.call(this, vrGamepad) || this;
        }
        GenericController.prototype.initControllerMesh = function (scene, meshLoaded) {
            var _this = this;
            BABYLON.SceneLoader.ImportMesh("", GenericController.MODEL_BASE_URL, GenericController.MODEL_FILENAME, scene, function (newMeshes) {
                _this._defaultModel = newMeshes[1];
                _this.attachToMesh(_this._defaultModel);
                if (meshLoaded) {
                    meshLoaded(_this._defaultModel);
                }
            });
        };
        GenericController.prototype.handleButtonChange = function (buttonIdx, state, changes) {
            console.log("Button id: " + buttonIdx + "state: ");
            console.dir(state);
        };
        GenericController.MODEL_BASE_URL = 'https://controllers.babylonjs.com/generic/';
        GenericController.MODEL_FILENAME = 'generic.babylon';
        return GenericController;
    }(BABYLON.WebVRController));
    BABYLON.GenericController = GenericController;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.genericController.js.map
