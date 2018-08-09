var BABYLON;
(function (BABYLON) {
    var LoadedMeshInfo = /** @class */ (function () {
        function LoadedMeshInfo() {
            this.buttonMeshes = {};
            this.axisMeshes = {};
        }
        return LoadedMeshInfo;
    }());
    var WindowsMotionController = /** @class */ (function (_super) {
        __extends(WindowsMotionController, _super);
        function WindowsMotionController(vrGamepad) {
            var _this = _super.call(this, vrGamepad) || this;
            _this._mapping = {
                // Semantic button names
                buttons: ['thumbstick', 'trigger', 'grip', 'menu', 'trackpad'],
                // A mapping of the button name to glTF model node name
                // that should be transformed by button value.
                buttonMeshNames: {
                    'trigger': 'SELECT',
                    'menu': 'MENU',
                    'grip': 'GRASP',
                    'thumbstick': 'THUMBSTICK_PRESS',
                    'trackpad': 'TOUCHPAD_PRESS'
                },
                // This mapping is used to translate from the Motion Controller to Babylon semantics
                buttonObservableNames: {
                    'trigger': 'onTriggerStateChangedObservable',
                    'menu': 'onSecondaryButtonStateChangedObservable',
                    'grip': 'onMainButtonStateChangedObservable',
                    'thumbstick': 'onPadStateChangedObservable',
                    'trackpad': 'onTrackpadChangedObservable'
                },
                // A mapping of the axis name to glTF model node name
                // that should be transformed by axis value.
                // This array mirrors the browserGamepad.axes array, such that
                // the mesh corresponding to axis 0 is in this array index 0.
                axisMeshNames: [
                    'THUMBSTICK_X',
                    'THUMBSTICK_Y',
                    'TOUCHPAD_TOUCH_X',
                    'TOUCHPAD_TOUCH_Y'
                ],
                pointingPoseMeshName: 'POINTING_POSE'
            };
            _this.onTrackpadChangedObservable = new BABYLON.Observable();
            _this.onTrackpadValuesChangedObservable = new BABYLON.Observable();
            _this.trackpad = { x: 0, y: 0 };
            _this.controllerType = BABYLON.PoseEnabledControllerType.WINDOWS;
            _this._loadedMeshInfo = null;
            return _this;
        }
        Object.defineProperty(WindowsMotionController.prototype, "onTriggerButtonStateChangedObservable", {
            get: function () {
                return this.onTriggerStateChangedObservable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsMotionController.prototype, "onMenuButtonStateChangedObservable", {
            get: function () {
                return this.onSecondaryButtonStateChangedObservable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsMotionController.prototype, "onGripButtonStateChangedObservable", {
            get: function () {
                return this.onMainButtonStateChangedObservable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsMotionController.prototype, "onThumbstickButtonStateChangedObservable", {
            get: function () {
                return this.onPadStateChangedObservable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsMotionController.prototype, "onTouchpadButtonStateChangedObservable", {
            get: function () {
                return this.onTrackpadChangedObservable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsMotionController.prototype, "onTouchpadValuesChangedObservable", {
            get: function () {
                return this.onTrackpadValuesChangedObservable;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Called once per frame by the engine.
         */
        WindowsMotionController.prototype.update = function () {
            _super.prototype.update.call(this);
            // Only need to animate axes if there is a loaded mesh
            if (this._loadedMeshInfo) {
                if (this.browserGamepad.axes) {
                    if (this.browserGamepad.axes[2] != this.trackpad.x || this.browserGamepad.axes[3] != this.trackpad.y) {
                        this.trackpad.x = this.browserGamepad["axes"][2];
                        this.trackpad.y = this.browserGamepad["axes"][3];
                        this.onTrackpadValuesChangedObservable.notifyObservers(this.trackpad);
                    }
                    for (var axis = 0; axis < this._mapping.axisMeshNames.length; axis++) {
                        this.lerpAxisTransform(axis, this.browserGamepad.axes[axis]);
                    }
                }
            }
        };
        /**
         * Called once for each button that changed state since the last frame
         * @param buttonIdx Which button index changed
         * @param state New state of the button
         * @param changes Which properties on the state changed since last frame
         */
        WindowsMotionController.prototype.handleButtonChange = function (buttonIdx, state, changes) {
            var buttonName = this._mapping.buttons[buttonIdx];
            if (!buttonName) {
                return;
            }
            // Only emit events for buttons that we know how to map from index to name
            var observable = this[(this._mapping.buttonObservableNames)[buttonName]];
            if (observable) {
                observable.notifyObservers(state);
            }
            this.lerpButtonTransform(buttonName, state.value);
        };
        WindowsMotionController.prototype.lerpButtonTransform = function (buttonName, buttonValue) {
            // If there is no loaded mesh, there is nothing to transform.
            if (!this._loadedMeshInfo) {
                return;
            }
            var meshInfo = this._loadedMeshInfo.buttonMeshes[buttonName];
            if (!meshInfo.unpressed.rotationQuaternion || !meshInfo.pressed.rotationQuaternion || !meshInfo.value.rotationQuaternion) {
                return;
            }
            BABYLON.Quaternion.SlerpToRef(meshInfo.unpressed.rotationQuaternion, meshInfo.pressed.rotationQuaternion, buttonValue, meshInfo.value.rotationQuaternion);
            BABYLON.Vector3.LerpToRef(meshInfo.unpressed.position, meshInfo.pressed.position, buttonValue, meshInfo.value.position);
        };
        WindowsMotionController.prototype.lerpAxisTransform = function (axis, axisValue) {
            if (!this._loadedMeshInfo) {
                return;
            }
            var meshInfo = this._loadedMeshInfo.axisMeshes[axis];
            if (!meshInfo) {
                return;
            }
            if (!meshInfo.min.rotationQuaternion || !meshInfo.max.rotationQuaternion || !meshInfo.value.rotationQuaternion) {
                return;
            }
            // Convert from gamepad value range (-1 to +1) to lerp range (0 to 1)
            var lerpValue = axisValue * 0.5 + 0.5;
            BABYLON.Quaternion.SlerpToRef(meshInfo.min.rotationQuaternion, meshInfo.max.rotationQuaternion, lerpValue, meshInfo.value.rotationQuaternion);
            BABYLON.Vector3.LerpToRef(meshInfo.min.position, meshInfo.max.position, lerpValue, meshInfo.value.position);
        };
        /**
         * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
         * @param scene scene in which to add meshes
         * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
         */
        WindowsMotionController.prototype.initControllerMesh = function (scene, meshLoaded, forceDefault) {
            var _this = this;
            if (forceDefault === void 0) { forceDefault = false; }
            var path;
            var filename;
            // Checking if GLB loader is present
            if (BABYLON.SceneLoader.IsPluginForExtensionAvailable(".glb")) {
                // Determine the device specific folder based on the ID suffix
                var device = 'default';
                if (this.id && !forceDefault) {
                    var match = this.id.match(WindowsMotionController.GAMEPAD_ID_PATTERN);
                    device = ((match && match[0]) || device);
                }
                // Hand
                if (this.hand === 'left') {
                    filename = WindowsMotionController.MODEL_LEFT_FILENAME;
                }
                else {
                    filename = WindowsMotionController.MODEL_RIGHT_FILENAME;
                }
                path = WindowsMotionController.MODEL_BASE_URL + device + '/';
            }
            else {
                BABYLON.Tools.Warn("You need to reference GLTF loader to load Windows Motion Controllers model. Falling back to generic models");
                path = BABYLON.GenericController.MODEL_BASE_URL;
                filename = BABYLON.GenericController.MODEL_FILENAME;
            }
            BABYLON.SceneLoader.ImportMesh("", path, filename, scene, function (meshes) {
                // glTF files successfully loaded from the remote server, now process them to ensure they are in the right format.
                _this._loadedMeshInfo = _this.processModel(scene, meshes);
                if (!_this._loadedMeshInfo) {
                    return;
                }
                _this._defaultModel = _this._loadedMeshInfo.rootNode;
                _this.attachToMesh(_this._defaultModel);
                if (meshLoaded) {
                    meshLoaded(_this._defaultModel);
                }
            }, null, function (scene, message) {
                BABYLON.Tools.Log(message);
                BABYLON.Tools.Warn('Failed to retrieve controller model from the remote server: ' + path + filename);
                if (!forceDefault) {
                    _this.initControllerMesh(scene, meshLoaded, true);
                }
            });
        };
        /**
         * Takes a list of meshes (as loaded from the glTF file) and finds the root node, as well as nodes that
         * can be transformed by button presses and axes values, based on this._mapping.
         *
         * @param scene scene in which the meshes exist
         * @param meshes list of meshes that make up the controller model to process
         * @return structured view of the given meshes, with mapping of buttons and axes to meshes that can be transformed.
         */
        WindowsMotionController.prototype.processModel = function (scene, meshes) {
            var loadedMeshInfo = null;
            // Create a new mesh to contain the glTF hierarchy
            var parentMesh = new BABYLON.Mesh(this.id + " " + this.hand, scene);
            // Find the root node in the loaded glTF scene, and attach it as a child of 'parentMesh'
            var childMesh = null;
            for (var i = 0; i < meshes.length; i++) {
                var mesh = meshes[i];
                if (!mesh.parent) {
                    // Exclude controller meshes from picking results
                    mesh.isPickable = false;
                    // Handle root node, attach to the new parentMesh
                    childMesh = mesh;
                    break;
                }
            }
            if (childMesh) {
                childMesh.setParent(parentMesh);
                // Create our mesh info. Note that this method will always return non-null.
                loadedMeshInfo = this.createMeshInfo(parentMesh);
            }
            else {
                BABYLON.Tools.Warn('Could not find root node in model file.');
            }
            return loadedMeshInfo;
        };
        WindowsMotionController.prototype.createMeshInfo = function (rootNode) {
            var loadedMeshInfo = new LoadedMeshInfo();
            var i;
            loadedMeshInfo.rootNode = rootNode;
            // Reset the caches
            loadedMeshInfo.buttonMeshes = {};
            loadedMeshInfo.axisMeshes = {};
            // Button Meshes
            for (i = 0; i < this._mapping.buttons.length; i++) {
                var buttonMeshName = this._mapping.buttonMeshNames[this._mapping.buttons[i]];
                if (!buttonMeshName) {
                    BABYLON.Tools.Log('Skipping unknown button at index: ' + i + ' with mapped name: ' + this._mapping.buttons[i]);
                    continue;
                }
                var buttonMesh = getChildByName(rootNode, buttonMeshName);
                if (!buttonMesh) {
                    BABYLON.Tools.Warn('Missing button mesh with name: ' + buttonMeshName);
                    continue;
                }
                var buttonMeshInfo = {
                    index: i,
                    value: getImmediateChildByName(buttonMesh, 'VALUE'),
                    pressed: getImmediateChildByName(buttonMesh, 'PRESSED'),
                    unpressed: getImmediateChildByName(buttonMesh, 'UNPRESSED')
                };
                if (buttonMeshInfo.value && buttonMeshInfo.pressed && buttonMeshInfo.unpressed) {
                    loadedMeshInfo.buttonMeshes[this._mapping.buttons[i]] = buttonMeshInfo;
                }
                else {
                    // If we didn't find the mesh, it simply means this button won't have transforms applied as mapped button value changes.
                    BABYLON.Tools.Warn('Missing button submesh under mesh with name: ' + buttonMeshName +
                        '(VALUE: ' + !!buttonMeshInfo.value +
                        ', PRESSED: ' + !!buttonMeshInfo.pressed +
                        ', UNPRESSED:' + !!buttonMeshInfo.unpressed +
                        ')');
                }
            }
            // Axis Meshes
            for (i = 0; i < this._mapping.axisMeshNames.length; i++) {
                var axisMeshName = this._mapping.axisMeshNames[i];
                if (!axisMeshName) {
                    BABYLON.Tools.Log('Skipping unknown axis at index: ' + i);
                    continue;
                }
                var axisMesh = getChildByName(rootNode, axisMeshName);
                if (!axisMesh) {
                    BABYLON.Tools.Warn('Missing axis mesh with name: ' + axisMeshName);
                    continue;
                }
                var axisMeshInfo = {
                    index: i,
                    value: getImmediateChildByName(axisMesh, 'VALUE'),
                    min: getImmediateChildByName(axisMesh, 'MIN'),
                    max: getImmediateChildByName(axisMesh, 'MAX')
                };
                if (axisMeshInfo.value && axisMeshInfo.min && axisMeshInfo.max) {
                    loadedMeshInfo.axisMeshes[i] = axisMeshInfo;
                }
                else {
                    // If we didn't find the mesh, it simply means thit axis won't have transforms applied as mapped axis values change.
                    BABYLON.Tools.Warn('Missing axis submesh under mesh with name: ' + axisMeshName +
                        '(VALUE: ' + !!axisMeshInfo.value +
                        ', MIN: ' + !!axisMeshInfo.min +
                        ', MAX:' + !!axisMeshInfo.max +
                        ')');
                }
            }
            // Pointing Ray
            loadedMeshInfo.pointingPoseNode = getChildByName(rootNode, this._mapping.pointingPoseMeshName);
            if (!loadedMeshInfo.pointingPoseNode) {
                BABYLON.Tools.Warn('Missing pointing pose mesh with name: ' + this._mapping.pointingPoseMeshName);
            }
            return loadedMeshInfo;
            // Look through all children recursively. This will return null if no mesh exists with the given name.
            function getChildByName(node, name) {
                return node.getChildMeshes(false, function (n) { return n.name === name; })[0];
            }
            // Look through only immediate children. This will return null if no mesh exists with the given name.
            function getImmediateChildByName(node, name) {
                return node.getChildMeshes(true, function (n) { return n.name == name; })[0];
            }
        };
        WindowsMotionController.prototype.getForwardRay = function (length) {
            if (length === void 0) { length = 100; }
            if (!(this._loadedMeshInfo && this._loadedMeshInfo.pointingPoseNode)) {
                return _super.prototype.getForwardRay.call(this, length);
            }
            var m = this._loadedMeshInfo.pointingPoseNode.getWorldMatrix();
            var origin = m.getTranslation();
            var forward = new BABYLON.Vector3(0, 0, -1);
            var forwardWorld = BABYLON.Vector3.TransformNormal(forward, m);
            var direction = BABYLON.Vector3.Normalize(forwardWorld);
            return new BABYLON.Ray(origin, direction, length);
        };
        WindowsMotionController.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.onTrackpadChangedObservable.clear();
        };
        WindowsMotionController.MODEL_BASE_URL = 'https://controllers.babylonjs.com/microsoft/';
        WindowsMotionController.MODEL_LEFT_FILENAME = 'left.glb';
        WindowsMotionController.MODEL_RIGHT_FILENAME = 'right.glb';
        WindowsMotionController.GAMEPAD_ID_PREFIX = 'Spatial Controller (Spatial Interaction Source) ';
        WindowsMotionController.GAMEPAD_ID_PATTERN = /([0-9a-zA-Z]+-[0-9a-zA-Z]+)$/;
        return WindowsMotionController;
    }(BABYLON.WebVRController));
    BABYLON.WindowsMotionController = WindowsMotionController;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.windowsMotionController.js.map
