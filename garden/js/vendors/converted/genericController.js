(function (LIB) {
    var GenericController = /** @class */ (function (_super) {
        __extends(GenericController, _super);
        function GenericController(vrGamepad) {
            return _super.call(this, vrGamepad) || this;
        }
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
        GenericController.prototype.handleButtonChange = function (buttonIdx, state, changes) {
            console.log("Button id: " + buttonIdx + "state: ");
            console.dir(state);
        };
        GenericController.MODEL_BASE_URL = 'https://controllers.LIBjs.com/generic/';
        GenericController.MODEL_FILENAME = 'generic.LIB';
        return GenericController;
    }(LIB.WebVRController));
    LIB.GenericController = GenericController;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.genericController.js.map
