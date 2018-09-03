

var LIB;
(function (LIB) {
    /**
     * This represents a WebVR camera.
     * The WebVR camera is LIB's simple interface to interaction with Windows Mixed Reality, HTC Vive and Oculus Rift.
     * @example http://doc.LIBjs.com/how_to/webvr_camera
     */
    var WebVRFreeCamera = /** @class */ (function (_super) {
        __extends(WebVRFreeCamera, _super);
        /**
         * Instantiates a WebVRFreeCamera.
         * @param name The name of the WebVRFreeCamera
         * @param position The starting anchor position for the camera
         * @param scene The scene the camera belongs to
         * @param webVROptions a set of customizable options for the webVRCamera
         */
        function WebVRFreeCamera(name, position, scene, webVROptions) {
            if (webVROptions === void 0) { webVROptions = {}; }
            var _this = _super.call(this, name, position, scene) || this;
            _this.webVROptions = webVROptions;
            /**
             * The vrDisplay tied to the camera. See https://developer.mozilla.org/en-US/docs/Web/API/VRDisplay
             */
            _this._vrDevice = null;
            /**
             * The rawPose of the vrDevice.
             */
            _this.rawPose = null;
            _this._specsVersion = "1.1";
            _this._attached = false;
            _this._descendants = [];
            // Represents device position and rotation in room space. Should only be used to help calculate LIB space values
            _this._deviceRoomPosition = LIB.Vector3.Zero();
            _this._deviceRoomRotationQuaternion = LIB.Quaternion.Identity();
            _this._standingMatrix = null;
            /**
             * Represents device position in LIB space.
             */
            _this.devicePosition = LIB.Vector3.Zero();
            /**
             * Represents device rotation in LIB space.
             */
            _this.deviceRotationQuaternion = LIB.Quaternion.Identity();
            /**
             * The scale of the device to be used when translating from device space to LIB space.
             */
            _this.deviceScaleFactor = 1;
            _this._deviceToWorld = LIB.Matrix.Identity();
            _this._worldToDevice = LIB.Matrix.Identity();
            /**
             * References to the webVR controllers for the vrDevice.
             */
            _this.controllers = [];
            /**
             * Emits an event when a controller is attached.
             */
            _this.onControllersAttachedObservable = new LIB.Observable();
            /**
             * Emits an event when a controller's mesh has been loaded;
             */
            _this.onControllerMeshLoadedObservable = new LIB.Observable();
            /**
             * If the rig cameras be used as parent instead of this camera.
             */
            _this.rigParenting = true;
            _this._defaultHeight = undefined;
            _this._workingVector = LIB.Vector3.Zero();
            _this._oneVector = LIB.Vector3.One();
            _this._workingMatrix = LIB.Matrix.Identity();
            _this._cache.position = LIB.Vector3.Zero();
            if (webVROptions.defaultHeight) {
                _this._defaultHeight = webVROptions.defaultHeight;
                _this.position.y = _this._defaultHeight;
            }
            _this.minZ = 0.1;
            //legacy support - the compensation boolean was removed.
            if (arguments.length === 5) {
                _this.webVROptions = arguments[4];
            }
            // default webVR options
            if (_this.webVROptions.trackPosition == undefined) {
                _this.webVROptions.trackPosition = true;
            }
            if (_this.webVROptions.controllerMeshes == undefined) {
                _this.webVROptions.controllerMeshes = true;
            }
            if (_this.webVROptions.defaultLightingOnControllers == undefined) {
                _this.webVROptions.defaultLightingOnControllers = true;
            }
            _this.rotationQuaternion = new LIB.Quaternion();
            if (_this.webVROptions && _this.webVROptions.positionScale) {
                _this.deviceScaleFactor = _this.webVROptions.positionScale;
            }
            //enable VR
            var engine = _this.getEngine();
            _this._onVREnabled = function (success) { if (success) {
                _this.initControllers();
            } };
            engine.onVRRequestPresentComplete.add(_this._onVREnabled);
            engine.initWebVR().add(function (event) {
                if (!event.vrDisplay || _this._vrDevice === event.vrDisplay) {
                    return;
                }
                _this._vrDevice = event.vrDisplay;
                //reset the rig parameters.
                _this.setCameraRigMode(LIB.Camera.RIG_MODE_WEBVR, { parentCamera: _this, vrDisplay: _this._vrDevice, frameData: _this._frameData, specs: _this._specsVersion });
                if (_this._attached) {
                    _this.getEngine().enableVR();
                }
            });
            if (typeof (VRFrameData) !== "undefined")
                _this._frameData = new VRFrameData();
            /**
             * The idea behind the following lines:
             * objects that have the camera as parent should actually have the rig cameras as a parent.
             * BUT, each of those cameras has a different view matrix, which means that if we set the parent to the first rig camera,
             * the second will not show it correctly.
             *
             * To solve this - each object that has the camera as parent will be added to a protected array.
             * When the rig camera renders, it will take this array and set all of those to be its children.
             * This way, the right camera will be used as a parent, and the mesh will be rendered correctly.
             * Amazing!
             */
            scene.onBeforeCameraRenderObservable.add(function (camera) {
                if (camera.parent === _this && _this.rigParenting) {
                    _this._descendants = _this.getDescendants(true, function (n) {
                        // don't take the cameras or the controllers!
                        var isController = _this.controllers.some(function (controller) { return controller._mesh === n; });
                        var isRigCamera = _this._rigCameras.indexOf(n) !== -1;
                        return !isController && !isRigCamera;
                    });
                    _this._descendants.forEach(function (node) {
                        node.parent = camera;
                    });
                }
            });
            scene.onAfterCameraRenderObservable.add(function (camera) {
                if (camera.parent === _this && _this.rigParenting) {
                    _this._descendants.forEach(function (node) {
                        node.parent = _this;
                    });
                }
            });
            return _this;
        }
        /**
         * Gets the device distance from the ground in meters.
         * @returns the distance in meters from the vrDevice to ground in device space. If standing matrix is not supported for the vrDevice 0 is returned.
         */
        WebVRFreeCamera.prototype.deviceDistanceToRoomGround = function () {
            if (this._standingMatrix) {
                // Add standing matrix offset to get real offset from ground in room
                this._standingMatrix.getTranslationToRef(this._workingVector);
                return this._deviceRoomPosition.y + this._workingVector.y;
            }
            //If VRDisplay does not inform stage parameters and no default height is set we fallback to zero.
            return this._defaultHeight || 0;
        };
        /**
         * Enables the standing matrix when supported. This can be used to position the user's view the correct height from the ground.
         * @param callback will be called when the standing matrix is set. Callback parameter is if the standing matrix is supported.
         */
        WebVRFreeCamera.prototype.useStandingMatrix = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = function (bool) { }; }
            // Use standing matrix if available
            this.getEngine().initWebVRAsync().then(function (result) {
                if (!result.vrDisplay || !result.vrDisplay.stageParameters || !result.vrDisplay.stageParameters.sittingToStandingTransform) {
                    callback(false);
                }
                else {
                    _this._standingMatrix = new LIB.Matrix();
                    LIB.Matrix.FromFloat32ArrayToRefScaled(result.vrDisplay.stageParameters.sittingToStandingTransform, 0, 1, _this._standingMatrix);
                    if (!_this.getScene().useRightHandedSystem) {
                        [2, 6, 8, 9, 14].forEach(function (num) {
                            if (_this._standingMatrix) {
                                _this._standingMatrix.m[num] *= -1;
                            }
                        });
                    }
                    callback(true);
                }
            });
        };
        /**
         * Enables the standing matrix when supported. This can be used to position the user's view the correct height from the ground.
         * @returns A promise with a boolean set to if the standing matrix is supported.
         */
        WebVRFreeCamera.prototype.useStandingMatrixAsync = function () {
            var _this = this;
            return new Promise(function (res, rej) {
                _this.useStandingMatrix(function (supported) {
                    res(supported);
                });
            });
        };
        /**
         * Disposes the camera
         */
        WebVRFreeCamera.prototype.dispose = function () {
            this.getEngine().onVRRequestPresentComplete.removeCallback(this._onVREnabled);
            _super.prototype.dispose.call(this);
        };
        /**
         * Gets a vrController by name.
         * @param name The name of the controller to retreive
         * @returns the controller matching the name specified or null if not found
         */
        WebVRFreeCamera.prototype.getControllerByName = function (name) {
            for (var _i = 0, _a = this.controllers; _i < _a.length; _i++) {
                var gp = _a[_i];
                if (gp.hand === name) {
                    return gp;
                }
            }
            return null;
        };
        Object.defineProperty(WebVRFreeCamera.prototype, "leftController", {
            /**
             * The controller corrisponding to the users left hand.
             */
            get: function () {
                if (!this._leftController) {
                    this._leftController = this.getControllerByName("left");
                }
                return this._leftController;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(WebVRFreeCamera.prototype, "rightController", {
            /**
             * The controller corrisponding to the users right hand.
             */
            get: function () {
                if (!this._rightController) {
                    this._rightController = this.getControllerByName("right");
                }
                return this._rightController;
            },
            enumerable: true,
            configurable: true
        });
        ;
        /**
         * Casts a ray forward from the vrCamera's gaze.
         * @param length Length of the ray (default: 100)
         * @returns the ray corrisponding to the gaze
         */
        WebVRFreeCamera.prototype.getForwardRay = function (length) {
            if (length === void 0) { length = 100; }
            if (this.leftCamera) {
                // Use left eye to avoid computation to compute center on every call
                return _super.prototype.getForwardRay.call(this, length, this.leftCamera.getWorldMatrix(), this.leftCamera.globalPosition); // Need the actual rendered camera
            }
            else {
                return _super.prototype.getForwardRay.call(this, length);
            }
        };
        /**
         * Updates the camera based on device's frame data
         */
        WebVRFreeCamera.prototype._checkInputs = function () {
            if (this._vrDevice && this._vrDevice.isPresenting) {
                this._vrDevice.getFrameData(this._frameData);
                this.updateFromDevice(this._frameData.pose);
            }
            _super.prototype._checkInputs.call(this);
        };
        /**
         * Updates the poseControlled values based on the input device pose.
         * @param poseData Pose coming from the device
         */
        WebVRFreeCamera.prototype.updateFromDevice = function (poseData) {
            if (poseData && poseData.orientation) {
                this.rawPose = poseData;
                this._deviceRoomRotationQuaternion.copyFromFloats(poseData.orientation[0], poseData.orientation[1], -poseData.orientation[2], -poseData.orientation[3]);
                if (this.getScene().useRightHandedSystem) {
                    this._deviceRoomRotationQuaternion.z *= -1;
                    this._deviceRoomRotationQuaternion.w *= -1;
                }
                if (this.webVROptions.trackPosition && this.rawPose.position) {
                    this._deviceRoomPosition.copyFromFloats(this.rawPose.position[0], this.rawPose.position[1], -this.rawPose.position[2]);
                    if (this.getScene().useRightHandedSystem) {
                        this._deviceRoomPosition.z *= -1;
                    }
                }
            }
        };
        /**
         * WebVR's attach control will start broadcasting frames to the device.
         * Note that in certain browsers (chrome for example) this function must be called
         * within a user-interaction callback. Example:
         * <pre> scene.onPointerDown = function() { camera.attachControl(canvas); }</pre>
         *
         * @param element html element to attach the vrDevice to
         * @param noPreventDefault prevent the default html element operation when attaching the vrDevice
         */
        WebVRFreeCamera.prototype.attachControl = function (element, noPreventDefault) {
            _super.prototype.attachControl.call(this, element, noPreventDefault);
            this._attached = true;
            noPreventDefault = LIB.Camera.ForceAttachControlToAlwaysPreventDefault ? false : noPreventDefault;
            if (this._vrDevice) {
                this.getEngine().enableVR();
            }
        };
        /**
         * Detaches the camera from the html element and disables VR
         *
         * @param element html element to detach from
         */
        WebVRFreeCamera.prototype.detachControl = function (element) {
            this.getScene().gamepadManager.onGamepadConnectedObservable.remove(this._onGamepadConnectedObserver);
            this.getScene().gamepadManager.onGamepadDisconnectedObservable.remove(this._onGamepadDisconnectedObserver);
            _super.prototype.detachControl.call(this, element);
            this._attached = false;
            this.getEngine().disableVR();
        };
        /**
         * @returns the name of this class
         */
        WebVRFreeCamera.prototype.getClassName = function () {
            return "WebVRFreeCamera";
        };
        /**
         * Calls resetPose on the vrDisplay
         * See: https://developer.mozilla.org/en-US/docs/Web/API/VRDisplay/resetPose
         */
        WebVRFreeCamera.prototype.resetToCurrentRotation = function () {
            //uses the vrDisplay's "resetPose()".
            //pitch and roll won't be affected.
            this._vrDevice.resetPose();
        };
        /**
         * Updates the rig cameras (left and right eye)
         */
        WebVRFreeCamera.prototype._updateRigCameras = function () {
            var camLeft = this._rigCameras[0];
            var camRight = this._rigCameras[1];
            camLeft.rotationQuaternion.copyFrom(this._deviceRoomRotationQuaternion);
            camRight.rotationQuaternion.copyFrom(this._deviceRoomRotationQuaternion);
            camLeft.position.copyFrom(this._deviceRoomPosition);
            camRight.position.copyFrom(this._deviceRoomPosition);
        };
        /**
         * Updates the cached values of the camera
         * @param ignoreParentClass ignores updating the parent class's cache (default: false)
         */
        WebVRFreeCamera.prototype._updateCache = function (ignoreParentClass) {
            var _this = this;
            if (!this.rotationQuaternion.equals(this._cache.rotationQuaternion) || !this.position.equals(this._cache.position)) {
                // Update to ensure devicePosition is up to date with most recent _deviceRoomPosition
                if (!this.updateCacheCalled) {
                    // make sure it is only called once per loop. this.update() might cause an infinite loop.
                    this.updateCacheCalled = true;
                    this.update();
                }
                // Set working vector to the device position in room space rotated by the new rotation
                this.rotationQuaternion.toRotationMatrix(this._workingMatrix);
                LIB.Vector3.TransformCoordinatesToRef(this._deviceRoomPosition, this._workingMatrix, this._workingVector);
                // Subtract this vector from the current device position in world to get the translation for the device world matrix
                this.devicePosition.subtractToRef(this._workingVector, this._workingVector);
                LIB.Matrix.ComposeToRef(this._oneVector, this.rotationQuaternion, this._workingVector, this._deviceToWorld);
                // Add translation from anchor position
                this._deviceToWorld.getTranslationToRef(this._workingVector);
                this._workingVector.addInPlace(this.position);
                this._workingVector.subtractInPlace(this._cache.position);
                this._deviceToWorld.setTranslation(this._workingVector);
                // Set an inverted matrix to be used when updating the camera
                this._deviceToWorld.invertToRef(this._worldToDevice);
                // Update the gamepad to ensure the mesh is updated on the same frame as camera
                this.controllers.forEach(function (controller) {
                    controller._deviceToWorld.copyFrom(_this._deviceToWorld);
                    controller.update();
                });
            }
            if (!ignoreParentClass) {
                _super.prototype._updateCache.call(this);
            }
            this.updateCacheCalled = false;
        };
        /**
         * Updates the current device position and rotation in the LIB world
         */
        WebVRFreeCamera.prototype.update = function () {
            // Get current device position in LIB world
            LIB.Vector3.TransformCoordinatesToRef(this._deviceRoomPosition, this._deviceToWorld, this.devicePosition);
            // Get current device rotation in LIB world
            LIB.Matrix.FromQuaternionToRef(this._deviceRoomRotationQuaternion, this._workingMatrix);
            this._workingMatrix.multiplyToRef(this._deviceToWorld, this._workingMatrix);
            LIB.Quaternion.FromRotationMatrixToRef(this._workingMatrix, this.deviceRotationQuaternion);
            _super.prototype.update.call(this);
        };
        /**
         * Gets the view matrix of this camera (Always set to identity as left and right eye cameras contain the actual view matrix)
         * @returns an identity matrix
         */
        WebVRFreeCamera.prototype._getViewMatrix = function () {
            return LIB.Matrix.Identity();
        };
        /**
         * This function is called by the two RIG cameras.
         * 'this' is the left or right camera (and NOT (!!!) the WebVRFreeCamera instance)
         */
        WebVRFreeCamera.prototype._getWebVRViewMatrix = function () {
            var _this = this;
            // Update the parent camera prior to using a child camera to avoid desynchronization
            var parentCamera = this._cameraRigParams["parentCamera"];
            parentCamera._updateCache();
            //WebVR 1.1
            var viewArray = this._cameraRigParams["left"] ? this._cameraRigParams["frameData"].leftViewMatrix : this._cameraRigParams["frameData"].rightViewMatrix;
            LIB.Matrix.FromArrayToRef(viewArray, 0, this._webvrViewMatrix);
            if (!this.getScene().useRightHandedSystem) {
                [2, 6, 8, 9, 14].forEach(function (num) {
                    _this._webvrViewMatrix.m[num] *= -1;
                });
            }
            // update the camera rotation matrix
            this._webvrViewMatrix.getRotationMatrixToRef(this._cameraRotationMatrix);
            LIB.Vector3.TransformCoordinatesToRef(this._referencePoint, this._cameraRotationMatrix, this._transformedReferencePoint);
            // Computing target and final matrix
            this.position.addToRef(this._transformedReferencePoint, this._currentTarget);
            // should the view matrix be updated with scale and position offset?
            if (parentCamera.deviceScaleFactor !== 1) {
                this._webvrViewMatrix.invert();
                // scale the position, if set
                if (parentCamera.deviceScaleFactor) {
                    this._webvrViewMatrix.m[12] *= parentCamera.deviceScaleFactor;
                    this._webvrViewMatrix.m[13] *= parentCamera.deviceScaleFactor;
                    this._webvrViewMatrix.m[14] *= parentCamera.deviceScaleFactor;
                }
                this._webvrViewMatrix.invert();
            }
            parentCamera._worldToDevice.multiplyToRef(this._webvrViewMatrix, this._webvrViewMatrix);
            // Compute global position
            this._workingMatrix = this._workingMatrix || LIB.Matrix.Identity();
            this._webvrViewMatrix.invertToRef(this._workingMatrix);
            this._workingMatrix.multiplyToRef(parentCamera.getWorldMatrix(), this._workingMatrix);
            this._workingMatrix.getTranslationToRef(this._globalPosition);
            this._markSyncedWithParent();
            return this._webvrViewMatrix;
        };
        WebVRFreeCamera.prototype._getWebVRProjectionMatrix = function () {
            var _this = this;
            var parentCamera = this.parent;
            parentCamera._vrDevice.depthNear = parentCamera.minZ;
            parentCamera._vrDevice.depthFar = parentCamera.maxZ;
            var projectionArray = this._cameraRigParams["left"] ? this._cameraRigParams["frameData"].leftProjectionMatrix : this._cameraRigParams["frameData"].rightProjectionMatrix;
            LIB.Matrix.FromArrayToRef(projectionArray, 0, this._projectionMatrix);
            //LIB compatible matrix
            if (!this.getScene().useRightHandedSystem) {
                [8, 9, 10, 11].forEach(function (num) {
                    _this._projectionMatrix.m[num] *= -1;
                });
            }
            return this._projectionMatrix;
        };
        /**
         * Initializes the controllers and their meshes
         */
        WebVRFreeCamera.prototype.initControllers = function () {
            var _this = this;
            this.controllers = [];
            var manager = this.getScene().gamepadManager;
            this._onGamepadDisconnectedObserver = manager.onGamepadDisconnectedObservable.add(function (gamepad) {
                if (gamepad.type === LIB.Gamepad.POSE_ENABLED) {
                    var webVrController = gamepad;
                    if (webVrController.defaultModel) {
                        webVrController.defaultModel.setEnabled(false);
                    }
                    if (webVrController.hand === "right") {
                        _this._rightController = null;
                    }
                    if (webVrController.hand === "left") {
                        _this._leftController = null;
                    }
                    var controllerIndex = _this.controllers.indexOf(webVrController);
                    if (controllerIndex !== -1) {
                        _this.controllers.splice(controllerIndex, 1);
                    }
                }
            });
            this._onGamepadConnectedObserver = manager.onGamepadConnectedObservable.add(function (gamepad) {
                if (gamepad.type === LIB.Gamepad.POSE_ENABLED) {
                    var webVrController_1 = gamepad;
                    webVrController_1.deviceScaleFactor = _this.deviceScaleFactor;
                    webVrController_1._deviceToWorld.copyFrom(_this._deviceToWorld);
                    if (_this.webVROptions.controllerMeshes) {
                        if (webVrController_1.defaultModel) {
                            webVrController_1.defaultModel.setEnabled(true);
                        }
                        else {
                            // Load the meshes
                            webVrController_1.initControllerMesh(_this.getScene(), function (loadedMesh) {
                                loadedMesh.scaling.scaleInPlace(_this.deviceScaleFactor);
                                _this.onControllerMeshLoadedObservable.notifyObservers(webVrController_1);
                                if (_this.webVROptions.defaultLightingOnControllers) {
                                    if (!_this._lightOnControllers) {
                                        _this._lightOnControllers = new LIB.HemisphericLight("vrControllersLight", new LIB.Vector3(0, 1, 0), _this.getScene());
                                    }
                                    var activateLightOnSubMeshes_1 = function (mesh, light) {
                                        var children = mesh.getChildren();
                                        if (children.length !== 0) {
                                            children.forEach(function (mesh) {
                                                light.includedOnlyMeshes.push(mesh);
                                                activateLightOnSubMeshes_1(mesh, light);
                                            });
                                        }
                                    };
                                    _this._lightOnControllers.includedOnlyMeshes.push(loadedMesh);
                                    activateLightOnSubMeshes_1(loadedMesh, _this._lightOnControllers);
                                }
                            });
                        }
                    }
                    webVrController_1.attachToPoseControlledCamera(_this);
                    // since this is async - sanity check. Is the controller already stored?
                    if (_this.controllers.indexOf(webVrController_1) === -1) {
                        //add to the controllers array
                        _this.controllers.push(webVrController_1);
                        // Forced to add some control code for Vive as it doesn't always fill properly the "hand" property
                        // Sometimes, both controllers are set correctly (left and right), sometimes none, sometimes only one of them...
                        // So we're overriding setting left & right manually to be sure
                        var firstViveWandDetected = false;
                        for (var i = 0; i < _this.controllers.length; i++) {
                            if (_this.controllers[i].controllerType === LIB.PoseEnabledControllerType.VIVE) {
                                if (!firstViveWandDetected) {
                                    firstViveWandDetected = true;
                                    _this.controllers[i].hand = "left";
                                }
                                else {
                                    _this.controllers[i].hand = "right";
                                }
                            }
                        }
                        //did we find enough controllers? Great! let the developer know.
                        if (_this.controllers.length >= 2) {
                            _this.onControllersAttachedObservable.notifyObservers(_this.controllers);
                        }
                    }
                }
            });
        };
        return WebVRFreeCamera;
    }(LIB.FreeCamera));
    LIB.WebVRFreeCamera = WebVRFreeCamera;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.webVRCamera.js.map
//# sourceMappingURL=LIB.webVRCamera.js.map