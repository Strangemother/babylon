(function (LIB) {
    var ClickInfo = /** @class */ (function () {
        function ClickInfo() {
            this._singleClick = false;
            this._doubleClick = false;
            this._hasSwiped = false;
            this._ignore = false;
        }
        Object.defineProperty(ClickInfo.prototype, "singleClick", {
            get: function () {
                return this._singleClick;
            },
            set: function (b) {
                this._singleClick = b;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClickInfo.prototype, "doubleClick", {
            get: function () {
                return this._doubleClick;
            },
            set: function (b) {
                this._doubleClick = b;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClickInfo.prototype, "hasSwiped", {
            get: function () {
                return this._hasSwiped;
            },
            set: function (b) {
                this._hasSwiped = b;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClickInfo.prototype, "ignore", {
            get: function () {
                return this._ignore;
            },
            set: function (b) {
                this._ignore = b;
            },
            enumerable: true,
            configurable: true
        });
        return ClickInfo;
    }());
    /**
     * This class is used by the onRenderingGroupObservable
     */
    var RenderingGroupInfo = /** @class */ (function () {
        function RenderingGroupInfo() {
        }
        /**
         * Stage corresponding to the very first hook in the renderingGroup phase: before the render buffer may be cleared
         * This stage will be fired no matter what
         */
        RenderingGroupInfo.STAGE_PRECLEAR = 1;
        /**
         * Called before opaque object are rendered.
         * This stage will be fired only if there's 3D Opaque content to render
         */
        RenderingGroupInfo.STAGE_PREOPAQUE = 2;
        /**
         * Called after the opaque objects are rendered and before the transparent ones
         * This stage will be fired only if there's 3D transparent content to render
         */
        RenderingGroupInfo.STAGE_PRETRANSPARENT = 3;
        /**
         * Called after the transparent object are rendered, last hook of the renderingGroup phase
         * This stage will be fired no matter what
         */
        RenderingGroupInfo.STAGE_POSTTRANSPARENT = 4;
        return RenderingGroupInfo;
    }());
    LIB.RenderingGroupInfo = RenderingGroupInfo;
    /**
     * Represents a scene to be rendered by the engine.
     * @see http://doc.LIBjs.com/page.php?p=21911
     */
    var Scene = /** @class */ (function () {
        /**
         * @constructor
         * @param {LIB.Engine} engine - the engine to be used to render this scene.
         */
        function Scene(engine) {
            // Members
            this.autoClear = true;
            this.autoClearDepthAndStencil = true;
            this.clearColor = new LIB.Color4(0.2, 0.2, 0.3, 1.0);
            this.ambientColor = new LIB.Color3(0, 0, 0);
            this.forceWireframe = false;
            this._forcePointsCloud = false;
            this.forceShowBoundingBoxes = false;
            this.animationsEnabled = true;
            this.useConstantAnimationDeltaTime = false;
            this.constantlyUpdateMeshUnderPointer = false;
            this.hoverCursor = "pointer";
            this.defaultCursor = "";
            /**
             * This is used to call preventDefault() on pointer down
             * in order to block unwanted artifacts like system double clicks
             */
            this.preventDefaultOnPointerDown = true;
            // Metadata
            this.metadata = null;
            /**
            * An event triggered when the scene is disposed.
            * @type {LIB.Observable}
            */
            this.onDisposeObservable = new LIB.Observable();
            /**
            * An event triggered before rendering the scene (right after animations and physics)
            * @type {LIB.Observable}
            */
            this.onBeforeRenderObservable = new LIB.Observable();
            /**
            * An event triggered after rendering the scene
            * @type {LIB.Observable}
            */
            this.onAfterRenderObservable = new LIB.Observable();
            /**
            * An event triggered before animating the scene
            * @type {LIB.Observable}
            */
            this.onBeforeAnimationsObservable = new LIB.Observable();
            /**
            * An event triggered after animations processing
            * @type {LIB.Observable}
            */
            this.onAfterAnimationsObservable = new LIB.Observable();
            /**
            * An event triggered before draw calls are ready to be sent
            * @type {LIB.Observable}
            */
            this.onBeforeDrawPhaseObservable = new LIB.Observable();
            /**
            * An event triggered after draw calls have been sent
            * @type {LIB.Observable}
            */
            this.onAfterDrawPhaseObservable = new LIB.Observable();
            /**
            * An event triggered when physic simulation is about to be run
            * @type {LIB.Observable}
            */
            this.onBeforePhysicsObservable = new LIB.Observable();
            /**
            * An event triggered when physic simulation has been done
            * @type {LIB.Observable}
            */
            this.onAfterPhysicsObservable = new LIB.Observable();
            /**
            * An event triggered when the scene is ready
            * @type {LIB.Observable}
            */
            this.onReadyObservable = new LIB.Observable();
            /**
            * An event triggered before rendering a camera
            * @type {LIB.Observable}
            */
            this.onBeforeCameraRenderObservable = new LIB.Observable();
            /**
            * An event triggered after rendering a camera
            * @type {LIB.Observable}
            */
            this.onAfterCameraRenderObservable = new LIB.Observable();
            /**
            * An event triggered when active meshes evaluation is about to start
            * @type {LIB.Observable}
            */
            this.onBeforeActiveMeshesEvaluationObservable = new LIB.Observable();
            /**
            * An event triggered when active meshes evaluation is done
            * @type {LIB.Observable}
            */
            this.onAfterActiveMeshesEvaluationObservable = new LIB.Observable();
            /**
            * An event triggered when particles rendering is about to start
            * Note: This event can be trigger more than once per frame (because particles can be rendered by render target textures as well)
            * @type {LIB.Observable}
            */
            this.onBeforeParticlesRenderingObservable = new LIB.Observable();
            /**
            * An event triggered when particles rendering is done
            * Note: This event can be trigger more than once per frame (because particles can be rendered by render target textures as well)
            * @type {LIB.Observable}
            */
            this.onAfterParticlesRenderingObservable = new LIB.Observable();
            /**
            * An event triggered when sprites rendering is about to start
            * Note: This event can be trigger more than once per frame (because sprites can be rendered by render target textures as well)
            * @type {LIB.Observable}
            */
            this.onBeforeSpritesRenderingObservable = new LIB.Observable();
            /**
            * An event triggered when sprites rendering is done
            * Note: This event can be trigger more than once per frame (because sprites can be rendered by render target textures as well)
            * @type {LIB.Observable}
            */
            this.onAfterSpritesRenderingObservable = new LIB.Observable();
            /**
            * An event triggered when SceneLoader.Append or SceneLoader.Load or SceneLoader.ImportMesh were successfully executed
            * @type {LIB.Observable}
            */
            this.onDataLoadedObservable = new LIB.Observable();
            /**
            * An event triggered when a camera is created
            * @type {LIB.Observable}
            */
            this.onNewCameraAddedObservable = new LIB.Observable();
            /**
            * An event triggered when a camera is removed
            * @type {LIB.Observable}
            */
            this.onCameraRemovedObservable = new LIB.Observable();
            /**
            * An event triggered when a light is created
            * @type {LIB.Observable}
            */
            this.onNewLightAddedObservable = new LIB.Observable();
            /**
            * An event triggered when a light is removed
            * @type {LIB.Observable}
            */
            this.onLightRemovedObservable = new LIB.Observable();
            /**
            * An event triggered when a geometry is created
            * @type {LIB.Observable}
            */
            this.onNewGeometryAddedObservable = new LIB.Observable();
            /**
            * An event triggered when a geometry is removed
            * @type {LIB.Observable}
            */
            this.onGeometryRemovedObservable = new LIB.Observable();
            /**
            * An event triggered when a transform node is created
            * @type {LIB.Observable}
            */
            this.onNewTransformNodeAddedObservable = new LIB.Observable();
            /**
            * An event triggered when a transform node is removed
            * @type {LIB.Observable}
            */
            this.onTransformNodeRemovedObservable = new LIB.Observable();
            /**
            * An event triggered when a mesh is created
            * @type {LIB.Observable}
            */
            this.onNewMeshAddedObservable = new LIB.Observable();
            /**
            * An event triggered when a mesh is removed
            * @type {LIB.Observable}
            */
            this.onMeshRemovedObservable = new LIB.Observable();
            /**
            * An event triggered when render targets are about to be rendered
            * Can happen multiple times per frame.
            * @type {LIB.Observable}
            */
            this.OnBeforeRenderTargetsRenderObservable = new LIB.Observable();
            /**
            * An event triggered when render targets were rendered.
            * Can happen multiple times per frame.
            * @type {LIB.Observable}
            */
            this.OnAfterRenderTargetsRenderObservable = new LIB.Observable();
            /**
            * An event triggered before calculating deterministic simulation step
            * @type {LIB.Observable}
            */
            this.onBeforeStepObservable = new LIB.Observable();
            /**
            * An event triggered after calculating deterministic simulation step
            * @type {LIB.Observable}
            */
            this.onAfterStepObservable = new LIB.Observable();
            /**
             * This Observable will be triggered for each stage of each renderingGroup of each rendered camera.
             * The RenderinGroupInfo class contains all the information about the context in which the observable is called
             * If you wish to register an Observer only for a given set of renderingGroup, use the mask with a combination of the renderingGroup index elevated to the power of two (1 for renderingGroup 0, 2 for renderingrOup1, 4 for 2 and 8 for 3)
             */
            this.onRenderingGroupObservable = new LIB.Observable();
            // Animations
            this.animations = [];
            /**
             * This observable event is triggered when any ponter event is triggered. It is registered during Scene.attachControl() and it is called BEFORE the 3D engine process anything (mesh/sprite picking for instance).
             * You have the possibility to skip the process and the call to onPointerObservable by setting PointerInfoPre.skipOnPointerObservable to true
             */
            this.onPrePointerObservable = new LIB.Observable();
            /**
             * Observable event triggered each time an input event is received from the rendering canvas
             */
            this.onPointerObservable = new LIB.Observable();
            this._meshPickProceed = false;
            this._currentPickResult = null;
            this._previousPickResult = null;
            this._totalPointersPressed = 0;
            this._doubleClickOccured = false;
            /** Define this parameter if you are using multiple cameras and you want to specify which one should be used for pointer position */
            this.cameraToUseForPointers = null;
            this._startingPointerPosition = new LIB.Vector2(0, 0);
            this._previousStartingPointerPosition = new LIB.Vector2(0, 0);
            this._startingPointerTime = 0;
            this._previousStartingPointerTime = 0;
            // Deterministic lockstep
            this._timeAccumulator = 0;
            this._currentStepId = 0;
            this._currentInternalStep = 0;
            // Keyboard
            /**
             * This observable event is triggered when any keyboard event si raised and registered during Scene.attachControl()
             * You have the possibility to skip the process and the call to onKeyboardObservable by setting KeyboardInfoPre.skipOnPointerObservable to true
             */
            this.onPreKeyboardObservable = new LIB.Observable();
            /**
             * Observable event triggered each time an keyboard event is received from the hosting window
             */
            this.onKeyboardObservable = new LIB.Observable();
            // Coordinate system
            /**
            * use right-handed coordinate system on this scene.
            * @type {boolean}
            */
            this._useRightHandedSystem = false;
            // Fog
            this._fogEnabled = true;
            this._fogMode = Scene.FOGMODE_NONE;
            this.fogColor = new LIB.Color3(0.2, 0.2, 0.3);
            this.fogDensity = 0.1;
            this.fogStart = 0;
            this.fogEnd = 1000.0;
            // Lights
            /**
            * is shadow enabled on this scene.
            * @type {boolean}
            */
            this._shadowsEnabled = true;
            /**
            * is light enabled on this scene.
            * @type {boolean}
            */
            this._lightsEnabled = true;
            /**
            * All of the lights added to this scene.
            * @see LIB.Light
            * @type {LIB.Light[]}
            */
            this.lights = new Array();
            // Cameras
            /** All of the cameras added to this scene. */
            this.cameras = new Array();
            /** All of the active cameras added to this scene. */
            this.activeCameras = new Array();
            // Meshes
            /**
            * All of the tranform nodes added to this scene.
            * @see LIB.TransformNode
            * @type {LIB.TransformNode[]}
            */
            this.transformNodes = new Array();
            /**
            * All of the (abstract) meshes added to this scene.
            * @see LIB.AbstractMesh
            * @type {LIB.AbstractMesh[]}
            */
            this.meshes = new Array();
            /**
            * All of the animation groups added to this scene.
            * @see LIB.AnimationGroup
            * @type {LIB.AnimationGroup[]}
            */
            this.animationGroups = new Array();
            // Geometries
            this._geometries = new Array();
            this.materials = new Array();
            this.multiMaterials = new Array();
            // Textures
            this._texturesEnabled = true;
            this.textures = new Array();
            // Particles
            this.particlesEnabled = true;
            this.particleSystems = new Array();
            // Sprites
            this.spritesEnabled = true;
            this.spriteManagers = new Array();
            // Layers
            this.layers = new Array();
            this.highlightLayers = new Array();
            // Skeletons
            this._skeletonsEnabled = true;
            this.skeletons = new Array();
            // Morph targets
            this.morphTargetManagers = new Array();
            // Lens flares
            this.lensFlaresEnabled = true;
            this.lensFlareSystems = new Array();
            // Collisions
            this.collisionsEnabled = true;
            /** Defines the gravity applied to this scene */
            this.gravity = new LIB.Vector3(0, -9.807, 0);
            // Postprocesses
            this.postProcesses = new Array();
            this.postProcessesEnabled = true;
            // Customs render targets
            this.renderTargetsEnabled = true;
            this.dumpNextRenderTargets = false;
            this.customRenderTargets = new Array();
            // Imported meshes
            this.importedMeshesFiles = new Array();
            // Probes
            this.probesEnabled = true;
            this.reflectionProbes = new Array();
            this._actionManagers = new Array();
            this._meshesForIntersections = new LIB.SmartArrayNoDuplicate(256);
            // Procedural textures
            this.proceduralTexturesEnabled = true;
            this._proceduralTextures = new Array();
            this.soundTracks = new Array();
            this._audioEnabled = true;
            this._headphone = false;
            // Performance counters
            this._totalVertices = new LIB.PerfCounter();
            this._activeIndices = new LIB.PerfCounter();
            this._activeParticles = new LIB.PerfCounter();
            this._activeBones = new LIB.PerfCounter();
            this._animationTime = 0;
            this.animationTimeScale = 1;
            this._renderId = 0;
            this._executeWhenReadyTimeoutId = -1;
            this._intermediateRendering = false;
            this._viewUpdateFlag = -1;
            this._projectionUpdateFlag = -1;
            this._alternateViewUpdateFlag = -1;
            this._alternateProjectionUpdateFlag = -1;
            this._toBeDisposed = new LIB.SmartArray(256);
            this._activeRequests = new Array();
            this._pendingData = new Array();
            this._isDisposed = false;
            this._activeMeshes = new LIB.SmartArray(256);
            this._processedMaterials = new LIB.SmartArray(256);
            this._renderTargets = new LIB.SmartArrayNoDuplicate(256);
            this._activeParticleSystems = new LIB.SmartArray(256);
            this._activeSkeletons = new LIB.SmartArrayNoDuplicate(32);
            this._softwareSkinnedMeshes = new LIB.SmartArrayNoDuplicate(32);
            this._activeAnimatables = new Array();
            this._transformMatrix = LIB.Matrix.Zero();
            this._useAlternateCameraConfiguration = false;
            this._alternateRendering = false;
            this.requireLightSorting = false;
            this._activeMeshesFrozen = false;
            this._tempPickingRay = LIB.Ray ? LIB.Ray.Zero() : null;
            this._engine = engine || LIB.Engine.LastCreatedEngine;
            this._engine.scenes.push(this);
            this._uid = null;
            this._renderingManager = new LIB.RenderingManager(this);
            this.postProcessManager = new LIB.PostProcessManager(this);
            if (LIB.OutlineRenderer) {
                this._outlineRenderer = new LIB.OutlineRenderer(this);
            }
            if (LIB.Tools.IsWindowObjectExist()) {
                this.attachControl();
            }
            //simplification queue
            if (LIB.SimplificationQueue) {
                this.simplificationQueue = new LIB.SimplificationQueue();
            }
            //collision coordinator initialization. For now legacy per default.
            this.workerCollisions = false; //(!!Worker && (!!LIB.CollisionWorker || LIB.WorkerIncluded));
            // Uniform Buffer
            this._createUbo();
            // Default Image processing definition.
            this._imageProcessingConfiguration = new LIB.ImageProcessingConfiguration();
        }
        Object.defineProperty(Scene, "FOGMODE_NONE", {
            /** The fog is deactivated */
            get: function () {
                return Scene._FOGMODE_NONE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene, "FOGMODE_EXP", {
            /** The fog density is following an exponential function */
            get: function () {
                return Scene._FOGMODE_EXP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene, "FOGMODE_EXP2", {
            /** The fog density is following an exponential function faster than FOGMODE_EXP */
            get: function () {
                return Scene._FOGMODE_EXP2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene, "FOGMODE_LINEAR", {
            /** The fog density is following a linear function. */
            get: function () {
                return Scene._FOGMODE_LINEAR;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "environmentTexture", {
            /**
             * Texture used in all pbr material as the reflection texture.
             * As in the majority of the scene they are the same (exception for multi room and so on),
             * this is easier to reference from here than from all the materials.
             */
            get: function () {
                return this._environmentTexture;
            },
            /**
             * Texture used in all pbr material as the reflection texture.
             * As in the majority of the scene they are the same (exception for multi room and so on),
             * this is easier to set here than in all the materials.
             */
            set: function (value) {
                if (this._environmentTexture === value) {
                    return;
                }
                this._environmentTexture = value;
                this.markAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "imageProcessingConfiguration", {
            /**
             * Default image processing configuration used either in the rendering
             * Forward main pass or through the imageProcessingPostProcess if present.
             * As in the majority of the scene they are the same (exception for multi camera),
             * this is easier to reference from here than from all the materials and post process.
             *
             * No setter as we it is a shared configuration, you can set the values instead.
             */
            get: function () {
                return this._imageProcessingConfiguration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "forcePointsCloud", {
            get: function () {
                return this._forcePointsCloud;
            },
            set: function (value) {
                if (this._forcePointsCloud === value) {
                    return;
                }
                this._forcePointsCloud = value;
                this.markAllMaterialsAsDirty(LIB.Material.MiscDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "onDispose", {
            /** A function to be executed when this scene is disposed. */
            set: function (callback) {
                if (this._onDisposeObserver) {
                    this.onDisposeObservable.remove(this._onDisposeObserver);
                }
                this._onDisposeObserver = this.onDisposeObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "beforeRender", {
            /** A function to be executed before rendering this scene */
            set: function (callback) {
                if (this._onBeforeRenderObserver) {
                    this.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
                }
                if (callback) {
                    this._onBeforeRenderObserver = this.onBeforeRenderObservable.add(callback);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "afterRender", {
            /** A function to be executed after rendering this scene */
            set: function (callback) {
                if (this._onAfterRenderObserver) {
                    this.onAfterRenderObservable.remove(this._onAfterRenderObserver);
                }
                if (callback) {
                    this._onAfterRenderObserver = this.onAfterRenderObservable.add(callback);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "beforeCameraRender", {
            set: function (callback) {
                if (this._onBeforeCameraRenderObserver) {
                    this.onBeforeCameraRenderObservable.remove(this._onBeforeCameraRenderObserver);
                }
                this._onBeforeCameraRenderObserver = this.onBeforeCameraRenderObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "afterCameraRender", {
            set: function (callback) {
                if (this._onAfterCameraRenderObserver) {
                    this.onAfterCameraRenderObservable.remove(this._onAfterCameraRenderObserver);
                }
                this._onAfterCameraRenderObserver = this.onAfterCameraRenderObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "gamepadManager", {
            get: function () {
                if (!this._gamepadManager) {
                    this._gamepadManager = new LIB.GamepadManager(this);
                }
                return this._gamepadManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "unTranslatedPointer", {
            get: function () {
                return new LIB.Vector2(this._unTranslatedPointerX, this._unTranslatedPointerY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "useRightHandedSystem", {
            get: function () {
                return this._useRightHandedSystem;
            },
            set: function (value) {
                if (this._useRightHandedSystem === value) {
                    return;
                }
                this._useRightHandedSystem = value;
                this.markAllMaterialsAsDirty(LIB.Material.MiscDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.setStepId = function (newStepId) {
            this._currentStepId = newStepId;
        };
        ;
        Scene.prototype.getStepId = function () {
            return this._currentStepId;
        };
        ;
        Scene.prototype.getInternalStep = function () {
            return this._currentInternalStep;
        };
        ;
        Object.defineProperty(Scene.prototype, "fogEnabled", {
            get: function () {
                return this._fogEnabled;
            },
            /**
            * is fog enabled on this scene.
            */
            set: function (value) {
                if (this._fogEnabled === value) {
                    return;
                }
                this._fogEnabled = value;
                this.markAllMaterialsAsDirty(LIB.Material.MiscDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "fogMode", {
            get: function () {
                return this._fogMode;
            },
            set: function (value) {
                if (this._fogMode === value) {
                    return;
                }
                this._fogMode = value;
                this.markAllMaterialsAsDirty(LIB.Material.MiscDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "shadowsEnabled", {
            get: function () {
                return this._shadowsEnabled;
            },
            set: function (value) {
                if (this._shadowsEnabled === value) {
                    return;
                }
                this._shadowsEnabled = value;
                this.markAllMaterialsAsDirty(LIB.Material.LightDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "lightsEnabled", {
            get: function () {
                return this._lightsEnabled;
            },
            set: function (value) {
                if (this._lightsEnabled === value) {
                    return;
                }
                this._lightsEnabled = value;
                this.markAllMaterialsAsDirty(LIB.Material.LightDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "defaultMaterial", {
            /** The default material used on meshes when no material is affected */
            get: function () {
                if (!this._defaultMaterial) {
                    this._defaultMaterial = new LIB.StandardMaterial("default material", this);
                }
                return this._defaultMaterial;
            },
            /** The default material used on meshes when no material is affected */
            set: function (value) {
                this._defaultMaterial = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "texturesEnabled", {
            get: function () {
                return this._texturesEnabled;
            },
            set: function (value) {
                if (this._texturesEnabled === value) {
                    return;
                }
                this._texturesEnabled = value;
                this.markAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "skeletonsEnabled", {
            get: function () {
                return this._skeletonsEnabled;
            },
            set: function (value) {
                if (this._skeletonsEnabled === value) {
                    return;
                }
                this._skeletonsEnabled = value;
                this.markAllMaterialsAsDirty(LIB.Material.AttributesDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "postProcessRenderPipelineManager", {
            get: function () {
                if (!this._postProcessRenderPipelineManager) {
                    this._postProcessRenderPipelineManager = new LIB.PostProcessRenderPipelineManager();
                }
                return this._postProcessRenderPipelineManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "mainSoundTrack", {
            get: function () {
                if (!this._mainSoundTrack) {
                    this._mainSoundTrack = new LIB.SoundTrack(this, { mainTrack: true });
                }
                return this._mainSoundTrack;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "_isAlternateRenderingEnabled", {
            get: function () {
                return this._alternateRendering;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "frustumPlanes", {
            get: function () {
                return this._frustumPlanes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "debugLayer", {
            // Properties
            get: function () {
                if (!this._debugLayer) {
                    this._debugLayer = new LIB.DebugLayer(this);
                }
                return this._debugLayer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "workerCollisions", {
            get: function () {
                return this._workerCollisions;
            },
            set: function (enabled) {
                if (!LIB.CollisionCoordinatorLegacy) {
                    return;
                }
                enabled = (enabled && !!Worker);
                this._workerCollisions = enabled;
                if (this.collisionCoordinator) {
                    this.collisionCoordinator.destroy();
                }
                this.collisionCoordinator = enabled ? new LIB.CollisionCoordinatorWorker() : new LIB.CollisionCoordinatorLegacy();
                this.collisionCoordinator.init(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "selectionOctree", {
            get: function () {
                return this._selectionOctree;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "meshUnderPointer", {
            /**
             * The mesh that is currently under the pointer.
             * @return {LIB.AbstractMesh} mesh under the pointer/mouse cursor or null if none.
             */
            get: function () {
                return this._pointerOverMesh;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "pointerX", {
            /**
             * Current on-screen X position of the pointer
             * @return {number} X position of the pointer
             */
            get: function () {
                return this._pointerX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "pointerY", {
            /**
             * Current on-screen Y position of the pointer
             * @return {number} Y position of the pointer
             */
            get: function () {
                return this._pointerY;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.getCachedMaterial = function () {
            return this._cachedMaterial;
        };
        Scene.prototype.getCachedEffect = function () {
            return this._cachedEffect;
        };
        Scene.prototype.getCachedVisibility = function () {
            return this._cachedVisibility;
        };
        Scene.prototype.isCachedMaterialInvalid = function (material, effect, visibility) {
            if (visibility === void 0) { visibility = 1; }
            return this._cachedEffect !== effect || this._cachedMaterial !== material || this._cachedVisibility !== visibility;
        };
        Scene.prototype.getBoundingBoxRenderer = function () {
            if (!this._boundingBoxRenderer) {
                this._boundingBoxRenderer = new LIB.BoundingBoxRenderer(this);
            }
            return this._boundingBoxRenderer;
        };
        Scene.prototype.getOutlineRenderer = function () {
            return this._outlineRenderer;
        };
        Scene.prototype.getEngine = function () {
            return this._engine;
        };
        Scene.prototype.getTotalVertices = function () {
            return this._totalVertices.current;
        };
        Object.defineProperty(Scene.prototype, "totalVerticesPerfCounter", {
            get: function () {
                return this._totalVertices;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.getActiveIndices = function () {
            return this._activeIndices.current;
        };
        Object.defineProperty(Scene.prototype, "totalActiveIndicesPerfCounter", {
            get: function () {
                return this._activeIndices;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.getActiveParticles = function () {
            return this._activeParticles.current;
        };
        Object.defineProperty(Scene.prototype, "activeParticlesPerfCounter", {
            get: function () {
                return this._activeParticles;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.getActiveBones = function () {
            return this._activeBones.current;
        };
        Object.defineProperty(Scene.prototype, "activeBonesPerfCounter", {
            get: function () {
                return this._activeBones;
            },
            enumerable: true,
            configurable: true
        });
        // Stats
        Scene.prototype.getInterFramePerfCounter = function () {
            LIB.Tools.Warn("getInterFramePerfCounter is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "interFramePerfCounter", {
            get: function () {
                LIB.Tools.Warn("interFramePerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.getLastFrameDuration = function () {
            LIB.Tools.Warn("getLastFrameDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "lastFramePerfCounter", {
            get: function () {
                LIB.Tools.Warn("lastFramePerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.getEvaluateActiveMeshesDuration = function () {
            LIB.Tools.Warn("getEvaluateActiveMeshesDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "evaluateActiveMeshesDurationPerfCounter", {
            get: function () {
                LIB.Tools.Warn("evaluateActiveMeshesDurationPerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.getActiveMeshes = function () {
            return this._activeMeshes;
        };
        Scene.prototype.getRenderTargetsDuration = function () {
            LIB.Tools.Warn("getRenderTargetsDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Scene.prototype.getRenderDuration = function () {
            LIB.Tools.Warn("getRenderDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "renderDurationPerfCounter", {
            get: function () {
                LIB.Tools.Warn("renderDurationPerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.getParticlesDuration = function () {
            LIB.Tools.Warn("getParticlesDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "particlesDurationPerfCounter", {
            get: function () {
                LIB.Tools.Warn("particlesDurationPerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.getSpritesDuration = function () {
            LIB.Tools.Warn("getSpritesDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "spriteDuractionPerfCounter", {
            get: function () {
                LIB.Tools.Warn("spriteDuractionPerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.getAnimationRatio = function () {
            return this._animationRatio;
        };
        Scene.prototype.getRenderId = function () {
            return this._renderId;
        };
        Scene.prototype.incrementRenderId = function () {
            this._renderId++;
        };
        Scene.prototype._updatePointerPosition = function (evt) {
            var canvasRect = this._engine.getRenderingCanvasClientRect();
            if (!canvasRect) {
                return;
            }
            this._pointerX = evt.clientX - canvasRect.left;
            this._pointerY = evt.clientY - canvasRect.top;
            this._unTranslatedPointerX = this._pointerX;
            this._unTranslatedPointerY = this._pointerY;
        };
        Scene.prototype._createUbo = function () {
            this._sceneUbo = new LIB.UniformBuffer(this._engine, undefined, true);
            this._sceneUbo.addUniform("viewProjection", 16);
            this._sceneUbo.addUniform("view", 16);
        };
        Scene.prototype._createAlternateUbo = function () {
            this._alternateSceneUbo = new LIB.UniformBuffer(this._engine, undefined, true);
            this._alternateSceneUbo.addUniform("viewProjection", 16);
            this._alternateSceneUbo.addUniform("view", 16);
        };
        // Pointers handling
        /**
         * Use this method to simulate a pointer move on a mesh
         * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
         */
        Scene.prototype.simulatePointerMove = function (pickResult) {
            var evt = new PointerEvent("pointermove");
            return this._processPointerMove(pickResult, evt);
        };
        Scene.prototype._processPointerMove = function (pickResult, evt) {
            var canvas = this._engine.getRenderingCanvas();
            if (!canvas) {
                return this;
            }
            if (pickResult && pickResult.hit && pickResult.pickedMesh) {
                this.setPointerOverSprite(null);
                this.setPointerOverMesh(pickResult.pickedMesh);
                if (this._pointerOverMesh && this._pointerOverMesh.actionManager && this._pointerOverMesh.actionManager.hasPointerTriggers) {
                    if (this._pointerOverMesh.actionManager.hoverCursor) {
                        canvas.style.cursor = this._pointerOverMesh.actionManager.hoverCursor;
                    }
                    else {
                        canvas.style.cursor = this.hoverCursor;
                    }
                }
                else {
                    canvas.style.cursor = this.defaultCursor;
                }
            }
            else {
                this.setPointerOverMesh(null);
                // Sprites
                pickResult = this.pickSprite(this._unTranslatedPointerX, this._unTranslatedPointerY, this._spritePredicate, false, this.cameraToUseForPointers || undefined);
                if (pickResult && pickResult.hit && pickResult.pickedSprite) {
                    this.setPointerOverSprite(pickResult.pickedSprite);
                    if (this._pointerOverSprite && this._pointerOverSprite.actionManager && this._pointerOverSprite.actionManager.hoverCursor) {
                        canvas.style.cursor = this._pointerOverSprite.actionManager.hoverCursor;
                    }
                    else {
                        canvas.style.cursor = this.hoverCursor;
                    }
                }
                else {
                    this.setPointerOverSprite(null);
                    // Restore pointer
                    canvas.style.cursor = this.defaultCursor;
                }
            }
            if (pickResult) {
                if (this.onPointerMove) {
                    this.onPointerMove(evt, pickResult);
                }
                if (this.onPointerObservable.hasObservers()) {
                    var type = evt.type === "mousewheel" || evt.type === "DOMMouseScroll" ? LIB.PointerEventTypes.POINTERWHEEL : LIB.PointerEventTypes.POINTERMOVE;
                    var pi = new LIB.PointerInfo(type, evt, pickResult);
                    this.onPointerObservable.notifyObservers(pi, type);
                }
            }
            return this;
        };
        /**
         * Use this method to simulate a pointer down on a mesh
         * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
         */
        Scene.prototype.simulatePointerDown = function (pickResult) {
            var evt = new PointerEvent("pointerdown");
            return this._processPointerDown(pickResult, evt);
        };
        Scene.prototype._processPointerDown = function (pickResult, evt) {
            var _this = this;
            if (pickResult && pickResult.hit && pickResult.pickedMesh) {
                this._pickedDownMesh = pickResult.pickedMesh;
                var actionManager = pickResult.pickedMesh.actionManager;
                if (actionManager) {
                    if (actionManager.hasPickTriggers) {
                        actionManager.processTrigger(LIB.ActionManager.OnPickDownTrigger, LIB.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                        switch (evt.button) {
                            case 0:
                                actionManager.processTrigger(LIB.ActionManager.OnLeftPickTrigger, LIB.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                                break;
                            case 1:
                                actionManager.processTrigger(LIB.ActionManager.OnCenterPickTrigger, LIB.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                                break;
                            case 2:
                                actionManager.processTrigger(LIB.ActionManager.OnRightPickTrigger, LIB.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                                break;
                        }
                    }
                    if (actionManager.hasSpecificTrigger(LIB.ActionManager.OnLongPressTrigger)) {
                        window.setTimeout(function () {
                            var pickResult = _this.pick(_this._unTranslatedPointerX, _this._unTranslatedPointerY, function (mesh) { return (mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.actionManager && mesh.actionManager.hasSpecificTrigger(LIB.ActionManager.OnLongPressTrigger) && mesh == _this._pickedDownMesh); }, false, _this.cameraToUseForPointers);
                            if (pickResult && pickResult.hit && pickResult.pickedMesh && actionManager) {
                                if (_this._totalPointersPressed !== 0 &&
                                    ((new Date().getTime() - _this._startingPointerTime) > Scene.LongPressDelay) &&
                                    (Math.abs(_this._startingPointerPosition.x - _this._pointerX) < Scene.DragMovementThreshold &&
                                        Math.abs(_this._startingPointerPosition.y - _this._pointerY) < Scene.DragMovementThreshold)) {
                                    _this._startingPointerTime = 0;
                                    actionManager.processTrigger(LIB.ActionManager.OnLongPressTrigger, LIB.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                                }
                            }
                        }, Scene.LongPressDelay);
                    }
                }
            }
            if (pickResult) {
                if (this.onPointerDown) {
                    this.onPointerDown(evt, pickResult);
                }
                if (this.onPointerObservable.hasObservers()) {
                    var type = LIB.PointerEventTypes.POINTERDOWN;
                    var pi = new LIB.PointerInfo(type, evt, pickResult);
                    this.onPointerObservable.notifyObservers(pi, type);
                }
            }
            return this;
        };
        /**
         * Use this method to simulate a pointer up on a mesh
         * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
         */
        Scene.prototype.simulatePointerUp = function (pickResult) {
            var evt = new PointerEvent("pointerup");
            var clickInfo = new ClickInfo();
            clickInfo.singleClick = true;
            clickInfo.ignore = true;
            return this._processPointerUp(pickResult, evt, clickInfo);
        };
        Scene.prototype._processPointerUp = function (pickResult, evt, clickInfo) {
            if (pickResult && pickResult && pickResult.pickedMesh) {
                this._pickedUpMesh = pickResult.pickedMesh;
                if (this._pickedDownMesh === this._pickedUpMesh) {
                    if (this.onPointerPick) {
                        this.onPointerPick(evt, pickResult);
                    }
                    if (clickInfo.singleClick && !clickInfo.ignore && this.onPointerObservable.hasObservers()) {
                        var type = LIB.PointerEventTypes.POINTERPICK;
                        var pi = new LIB.PointerInfo(type, evt, pickResult);
                        this.onPointerObservable.notifyObservers(pi, type);
                    }
                }
                if (pickResult.pickedMesh.actionManager) {
                    if (clickInfo.ignore) {
                        pickResult.pickedMesh.actionManager.processTrigger(LIB.ActionManager.OnPickUpTrigger, LIB.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                    }
                    if (!clickInfo.hasSwiped && !clickInfo.ignore && clickInfo.singleClick) {
                        pickResult.pickedMesh.actionManager.processTrigger(LIB.ActionManager.OnPickTrigger, LIB.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                    }
                    if (clickInfo.doubleClick && !clickInfo.ignore && pickResult.pickedMesh.actionManager.hasSpecificTrigger(LIB.ActionManager.OnDoublePickTrigger)) {
                        pickResult.pickedMesh.actionManager.processTrigger(LIB.ActionManager.OnDoublePickTrigger, LIB.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                    }
                }
            }
            if (this._pickedDownMesh &&
                this._pickedDownMesh.actionManager &&
                this._pickedDownMesh.actionManager.hasSpecificTrigger(LIB.ActionManager.OnPickOutTrigger) &&
                this._pickedDownMesh !== this._pickedUpMesh) {
                this._pickedDownMesh.actionManager.processTrigger(LIB.ActionManager.OnPickOutTrigger, LIB.ActionEvent.CreateNew(this._pickedDownMesh, evt));
            }
            if (this.onPointerUp) {
                this.onPointerUp(evt, pickResult);
            }
            if (this.onPointerObservable.hasObservers()) {
                if (!clickInfo.ignore) {
                    if (!clickInfo.hasSwiped) {
                        if (clickInfo.singleClick && this.onPointerObservable.hasSpecificMask(LIB.PointerEventTypes.POINTERTAP)) {
                            var type = LIB.PointerEventTypes.POINTERTAP;
                            var pi = new LIB.PointerInfo(type, evt, pickResult);
                            this.onPointerObservable.notifyObservers(pi, type);
                        }
                        if (clickInfo.doubleClick && this.onPointerObservable.hasSpecificMask(LIB.PointerEventTypes.POINTERDOUBLETAP)) {
                            var type = LIB.PointerEventTypes.POINTERDOUBLETAP;
                            var pi = new LIB.PointerInfo(type, evt, pickResult);
                            this.onPointerObservable.notifyObservers(pi, type);
                        }
                    }
                }
                else {
                    var type = LIB.PointerEventTypes.POINTERUP;
                    var pi = new LIB.PointerInfo(type, evt, pickResult);
                    this.onPointerObservable.notifyObservers(pi, type);
                }
            }
            return this;
        };
        /**
        * Attach events to the canvas (To handle actionManagers triggers and raise onPointerMove, onPointerDown and onPointerUp
        * @param attachUp defines if you want to attach events to pointerup
        * @param attachDown defines if you want to attach events to pointerdown
        * @param attachMove defines if you want to attach events to pointermove
        */
        Scene.prototype.attachControl = function (attachUp, attachDown, attachMove) {
            var _this = this;
            if (attachUp === void 0) { attachUp = true; }
            if (attachDown === void 0) { attachDown = true; }
            if (attachMove === void 0) { attachMove = true; }
            this._initActionManager = function (act, clickInfo) {
                if (!_this._meshPickProceed) {
                    var pickResult = _this.pick(_this._unTranslatedPointerX, _this._unTranslatedPointerY, _this.pointerDownPredicate, false, _this.cameraToUseForPointers);
                    _this._currentPickResult = pickResult;
                    if (pickResult) {
                        act = (pickResult.hit && pickResult.pickedMesh) ? pickResult.pickedMesh.actionManager : null;
                    }
                    _this._meshPickProceed = true;
                }
                return act;
            };
            this._delayedSimpleClick = function (btn, clickInfo, cb) {
                // double click delay is over and that no double click has been raised since, or the 2 consecutive keys pressed are different
                if ((new Date().getTime() - _this._previousStartingPointerTime > Scene.DoubleClickDelay && !_this._doubleClickOccured) ||
                    btn !== _this._previousButtonPressed) {
                    _this._doubleClickOccured = false;
                    clickInfo.singleClick = true;
                    clickInfo.ignore = false;
                    cb(clickInfo, _this._currentPickResult);
                }
            };
            this._initClickEvent = function (obs1, obs2, evt, cb) {
                var clickInfo = new ClickInfo();
                _this._currentPickResult = null;
                var act = null;
                var checkPicking = obs1.hasSpecificMask(LIB.PointerEventTypes.POINTERPICK) || obs2.hasSpecificMask(LIB.PointerEventTypes.POINTERPICK)
                    || obs1.hasSpecificMask(LIB.PointerEventTypes.POINTERTAP) || obs2.hasSpecificMask(LIB.PointerEventTypes.POINTERTAP)
                    || obs1.hasSpecificMask(LIB.PointerEventTypes.POINTERDOUBLETAP) || obs2.hasSpecificMask(LIB.PointerEventTypes.POINTERDOUBLETAP);
                if (!checkPicking && LIB.ActionManager && LIB.ActionManager.HasPickTriggers) {
                    act = _this._initActionManager(act, clickInfo);
                    if (act)
                        checkPicking = act.hasPickTriggers;
                }
                if (checkPicking) {
                    var btn = evt.button;
                    clickInfo.hasSwiped = Math.abs(_this._startingPointerPosition.x - _this._pointerX) > Scene.DragMovementThreshold ||
                        Math.abs(_this._startingPointerPosition.y - _this._pointerY) > Scene.DragMovementThreshold;
                    if (!clickInfo.hasSwiped) {
                        var checkSingleClickImmediately = !Scene.ExclusiveDoubleClickMode;
                        if (!checkSingleClickImmediately) {
                            checkSingleClickImmediately = !obs1.hasSpecificMask(LIB.PointerEventTypes.POINTERDOUBLETAP) &&
                                !obs2.hasSpecificMask(LIB.PointerEventTypes.POINTERDOUBLETAP);
                            if (checkSingleClickImmediately && !LIB.ActionManager.HasSpecificTrigger(LIB.ActionManager.OnDoublePickTrigger)) {
                                act = _this._initActionManager(act, clickInfo);
                                if (act)
                                    checkSingleClickImmediately = !act.hasSpecificTrigger(LIB.ActionManager.OnDoublePickTrigger);
                            }
                        }
                        if (checkSingleClickImmediately) {
                            // single click detected if double click delay is over or two different successive keys pressed without exclusive double click or no double click required
                            if (new Date().getTime() - _this._previousStartingPointerTime > Scene.DoubleClickDelay ||
                                btn !== _this._previousButtonPressed) {
                                clickInfo.singleClick = true;
                                cb(clickInfo, _this._currentPickResult);
                            }
                        }
                        else {
                            // wait that no double click has been raised during the double click delay
                            _this._previousDelayedSimpleClickTimeout = _this._delayedSimpleClickTimeout;
                            _this._delayedSimpleClickTimeout = window.setTimeout(_this._delayedSimpleClick.bind(_this, btn, clickInfo, cb), Scene.DoubleClickDelay);
                        }
                        var checkDoubleClick = obs1.hasSpecificMask(LIB.PointerEventTypes.POINTERDOUBLETAP) ||
                            obs2.hasSpecificMask(LIB.PointerEventTypes.POINTERDOUBLETAP);
                        if (!checkDoubleClick && LIB.ActionManager.HasSpecificTrigger(LIB.ActionManager.OnDoublePickTrigger)) {
                            act = _this._initActionManager(act, clickInfo);
                            if (act)
                                checkDoubleClick = act.hasSpecificTrigger(LIB.ActionManager.OnDoublePickTrigger);
                        }
                        if (checkDoubleClick) {
                            // two successive keys pressed are equal, double click delay is not over and double click has not just occurred
                            if (btn === _this._previousButtonPressed &&
                                new Date().getTime() - _this._previousStartingPointerTime < Scene.DoubleClickDelay &&
                                !_this._doubleClickOccured) {
                                // pointer has not moved for 2 clicks, it's a double click
                                if (!clickInfo.hasSwiped &&
                                    Math.abs(_this._previousStartingPointerPosition.x - _this._startingPointerPosition.x) < Scene.DragMovementThreshold &&
                                    Math.abs(_this._previousStartingPointerPosition.y - _this._startingPointerPosition.y) < Scene.DragMovementThreshold) {
                                    _this._previousStartingPointerTime = 0;
                                    _this._doubleClickOccured = true;
                                    clickInfo.doubleClick = true;
                                    clickInfo.ignore = false;
                                    if (Scene.ExclusiveDoubleClickMode && _this._previousDelayedSimpleClickTimeout) {
                                        clearTimeout(_this._previousDelayedSimpleClickTimeout);
                                    }
                                    _this._previousDelayedSimpleClickTimeout = _this._delayedSimpleClickTimeout;
                                    cb(clickInfo, _this._currentPickResult);
                                }
                                else {
                                    _this._doubleClickOccured = false;
                                    _this._previousStartingPointerTime = _this._startingPointerTime;
                                    _this._previousStartingPointerPosition.x = _this._startingPointerPosition.x;
                                    _this._previousStartingPointerPosition.y = _this._startingPointerPosition.y;
                                    _this._previousButtonPressed = btn;
                                    if (Scene.ExclusiveDoubleClickMode) {
                                        if (_this._previousDelayedSimpleClickTimeout) {
                                            clearTimeout(_this._previousDelayedSimpleClickTimeout);
                                        }
                                        _this._previousDelayedSimpleClickTimeout = _this._delayedSimpleClickTimeout;
                                        cb(clickInfo, _this._previousPickResult);
                                    }
                                    else {
                                        cb(clickInfo, _this._currentPickResult);
                                    }
                                }
                            }
                            else {
                                _this._doubleClickOccured = false;
                                _this._previousStartingPointerTime = _this._startingPointerTime;
                                _this._previousStartingPointerPosition.x = _this._startingPointerPosition.x;
                                _this._previousStartingPointerPosition.y = _this._startingPointerPosition.y;
                                _this._previousButtonPressed = btn;
                            }
                        }
                    }
                }
                clickInfo.ignore = true;
                cb(clickInfo, _this._currentPickResult);
            };
            this._spritePredicate = function (sprite) {
                return sprite.isPickable && sprite.actionManager && sprite.actionManager.hasPointerTriggers;
            };
            this._onPointerMove = function (evt) {
                _this._updatePointerPosition(evt);
                // PreObservable support
                if (_this.onPrePointerObservable.hasObservers()) {
                    var type = evt.type === "mousewheel" || evt.type === "DOMMouseScroll" ? LIB.PointerEventTypes.POINTERWHEEL : LIB.PointerEventTypes.POINTERMOVE;
                    var pi = new LIB.PointerInfoPre(type, evt, _this._unTranslatedPointerX, _this._unTranslatedPointerY);
                    _this.onPrePointerObservable.notifyObservers(pi, type);
                    if (pi.skipOnPointerObservable) {
                        return;
                    }
                }
                if (!_this.cameraToUseForPointers && !_this.activeCamera) {
                    return;
                }
                if (!_this.pointerMovePredicate) {
                    _this.pointerMovePredicate = function (mesh) { return mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.isEnabled() && (mesh.enablePointerMoveEvents || _this.constantlyUpdateMeshUnderPointer || (mesh.actionManager !== null && mesh.actionManager !== undefined)); };
                }
                // Meshes
                var pickResult = _this.pick(_this._unTranslatedPointerX, _this._unTranslatedPointerY, _this.pointerMovePredicate, false, _this.cameraToUseForPointers);
                _this._processPointerMove(pickResult, evt);
            };
            this._onPointerDown = function (evt) {
                _this._totalPointersPressed++;
                _this._pickedDownMesh = null;
                _this._meshPickProceed = false;
                _this._updatePointerPosition(evt);
                if (_this.preventDefaultOnPointerDown && canvas) {
                    evt.preventDefault();
                    canvas.focus();
                }
                // PreObservable support
                if (_this.onPrePointerObservable.hasObservers()) {
                    var type = LIB.PointerEventTypes.POINTERDOWN;
                    var pi = new LIB.PointerInfoPre(type, evt, _this._unTranslatedPointerX, _this._unTranslatedPointerY);
                    _this.onPrePointerObservable.notifyObservers(pi, type);
                    if (pi.skipOnPointerObservable) {
                        return;
                    }
                }
                if (!_this.cameraToUseForPointers && !_this.activeCamera) {
                    return;
                }
                _this._startingPointerPosition.x = _this._pointerX;
                _this._startingPointerPosition.y = _this._pointerY;
                _this._startingPointerTime = new Date().getTime();
                if (!_this.pointerDownPredicate) {
                    _this.pointerDownPredicate = function (mesh) {
                        return mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.isEnabled();
                    };
                }
                // Meshes
                _this._pickedDownMesh = null;
                var pickResult = _this.pick(_this._unTranslatedPointerX, _this._unTranslatedPointerY, _this.pointerDownPredicate, false, _this.cameraToUseForPointers);
                _this._processPointerDown(pickResult, evt);
                // Sprites
                _this._pickedDownSprite = null;
                if (_this.spriteManagers.length > 0) {
                    pickResult = _this.pickSprite(_this._unTranslatedPointerX, _this._unTranslatedPointerY, _this._spritePredicate, false, _this.cameraToUseForPointers || undefined);
                    if (pickResult && pickResult.hit && pickResult.pickedSprite) {
                        if (pickResult.pickedSprite.actionManager) {
                            _this._pickedDownSprite = pickResult.pickedSprite;
                            switch (evt.button) {
                                case 0:
                                    pickResult.pickedSprite.actionManager.processTrigger(LIB.ActionManager.OnLeftPickTrigger, LIB.ActionEvent.CreateNewFromSprite(pickResult.pickedSprite, _this, evt));
                                    break;
                                case 1:
                                    pickResult.pickedSprite.actionManager.processTrigger(LIB.ActionManager.OnCenterPickTrigger, LIB.ActionEvent.CreateNewFromSprite(pickResult.pickedSprite, _this, evt));
                                    break;
                                case 2:
                                    pickResult.pickedSprite.actionManager.processTrigger(LIB.ActionManager.OnRightPickTrigger, LIB.ActionEvent.CreateNewFromSprite(pickResult.pickedSprite, _this, evt));
                                    break;
                            }
                            if (pickResult.pickedSprite.actionManager) {
                                pickResult.pickedSprite.actionManager.processTrigger(LIB.ActionManager.OnPickDownTrigger, LIB.ActionEvent.CreateNewFromSprite(pickResult.pickedSprite, _this, evt));
                            }
                        }
                    }
                }
            };
            this._onPointerUp = function (evt) {
                if (_this._totalPointersPressed === 0) {
                    return; // So we need to test it the pointer down was pressed before.
                }
                _this._totalPointersPressed--;
                _this._pickedUpMesh = null;
                _this._meshPickProceed = false;
                _this._updatePointerPosition(evt);
                _this._initClickEvent(_this.onPrePointerObservable, _this.onPointerObservable, evt, function (clickInfo, pickResult) {
                    // PreObservable support
                    if (_this.onPrePointerObservable.hasObservers()) {
                        if (!clickInfo.ignore) {
                            if (!clickInfo.hasSwiped) {
                                if (clickInfo.singleClick && _this.onPrePointerObservable.hasSpecificMask(LIB.PointerEventTypes.POINTERTAP)) {
                                    var type = LIB.PointerEventTypes.POINTERTAP;
                                    var pi = new LIB.PointerInfoPre(type, evt, _this._unTranslatedPointerX, _this._unTranslatedPointerY);
                                    _this.onPrePointerObservable.notifyObservers(pi, type);
                                    if (pi.skipOnPointerObservable) {
                                        return;
                                    }
                                }
                                if (clickInfo.doubleClick && _this.onPrePointerObservable.hasSpecificMask(LIB.PointerEventTypes.POINTERDOUBLETAP)) {
                                    var type = LIB.PointerEventTypes.POINTERDOUBLETAP;
                                    var pi = new LIB.PointerInfoPre(type, evt, _this._unTranslatedPointerX, _this._unTranslatedPointerY);
                                    _this.onPrePointerObservable.notifyObservers(pi, type);
                                    if (pi.skipOnPointerObservable) {
                                        return;
                                    }
                                }
                            }
                        }
                        else {
                            var type = LIB.PointerEventTypes.POINTERUP;
                            var pi = new LIB.PointerInfoPre(type, evt, _this._unTranslatedPointerX, _this._unTranslatedPointerY);
                            _this.onPrePointerObservable.notifyObservers(pi, type);
                            if (pi.skipOnPointerObservable) {
                                return;
                            }
                        }
                    }
                    if (!_this.cameraToUseForPointers && !_this.activeCamera) {
                        return;
                    }
                    if (!_this.pointerUpPredicate) {
                        _this.pointerUpPredicate = function (mesh) {
                            return mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.isEnabled();
                        };
                    }
                    // Meshes
                    if (!_this._meshPickProceed && (LIB.ActionManager && LIB.ActionManager.HasTriggers || _this.onPointerObservable.hasObservers())) {
                        _this._initActionManager(null, clickInfo);
                    }
                    if (!pickResult) {
                        pickResult = _this._currentPickResult;
                    }
                    _this._processPointerUp(pickResult, evt, clickInfo);
                    // Sprites
                    if (_this.spriteManagers.length > 0) {
                        var spritePickResult = _this.pickSprite(_this._unTranslatedPointerX, _this._unTranslatedPointerY, _this._spritePredicate, false, _this.cameraToUseForPointers || undefined);
                        if (spritePickResult) {
                            if (spritePickResult.hit && spritePickResult.pickedSprite) {
                                if (spritePickResult.pickedSprite.actionManager) {
                                    spritePickResult.pickedSprite.actionManager.processTrigger(LIB.ActionManager.OnPickUpTrigger, LIB.ActionEvent.CreateNewFromSprite(spritePickResult.pickedSprite, _this, evt));
                                    if (spritePickResult.pickedSprite.actionManager) {
                                        if (Math.abs(_this._startingPointerPosition.x - _this._pointerX) < Scene.DragMovementThreshold && Math.abs(_this._startingPointerPosition.y - _this._pointerY) < Scene.DragMovementThreshold) {
                                            spritePickResult.pickedSprite.actionManager.processTrigger(LIB.ActionManager.OnPickTrigger, LIB.ActionEvent.CreateNewFromSprite(spritePickResult.pickedSprite, _this, evt));
                                        }
                                    }
                                }
                            }
                            if (_this._pickedDownSprite && _this._pickedDownSprite.actionManager && _this._pickedDownSprite !== spritePickResult.pickedSprite) {
                                _this._pickedDownSprite.actionManager.processTrigger(LIB.ActionManager.OnPickOutTrigger, LIB.ActionEvent.CreateNewFromSprite(_this._pickedDownSprite, _this, evt));
                            }
                        }
                    }
                    _this._previousPickResult = _this._currentPickResult;
                });
            };
            this._onKeyDown = function (evt) {
                var type = LIB.KeyboardEventTypes.KEYDOWN;
                if (_this.onPreKeyboardObservable.hasObservers()) {
                    var pi = new LIB.KeyboardInfoPre(type, evt);
                    _this.onPreKeyboardObservable.notifyObservers(pi, type);
                    if (pi.skipOnPointerObservable) {
                        return;
                    }
                }
                if (_this.onKeyboardObservable.hasObservers()) {
                    var pi = new LIB.KeyboardInfo(type, evt);
                    _this.onKeyboardObservable.notifyObservers(pi, type);
                }
                if (_this.actionManager) {
                    _this.actionManager.processTrigger(LIB.ActionManager.OnKeyDownTrigger, LIB.ActionEvent.CreateNewFromScene(_this, evt));
                }
            };
            this._onKeyUp = function (evt) {
                var type = LIB.KeyboardEventTypes.KEYUP;
                if (_this.onPreKeyboardObservable.hasObservers()) {
                    var pi = new LIB.KeyboardInfoPre(type, evt);
                    _this.onPreKeyboardObservable.notifyObservers(pi, type);
                    if (pi.skipOnPointerObservable) {
                        return;
                    }
                }
                if (_this.onKeyboardObservable.hasObservers()) {
                    var pi = new LIB.KeyboardInfo(type, evt);
                    _this.onKeyboardObservable.notifyObservers(pi, type);
                }
                if (_this.actionManager) {
                    _this.actionManager.processTrigger(LIB.ActionManager.OnKeyUpTrigger, LIB.ActionEvent.CreateNewFromScene(_this, evt));
                }
            };
            var engine = this.getEngine();
            this._onCanvasFocusObserver = engine.onCanvasFocusObservable.add(function () {
                if (!canvas) {
                    return;
                }
                canvas.addEventListener("keydown", _this._onKeyDown, false);
                canvas.addEventListener("keyup", _this._onKeyUp, false);
            });
            this._onCanvasBlurObserver = engine.onCanvasBlurObservable.add(function () {
                if (!canvas) {
                    return;
                }
                canvas.removeEventListener("keydown", _this._onKeyDown);
                canvas.removeEventListener("keyup", _this._onKeyUp);
            });
            var eventPrefix = LIB.Tools.GetPointerPrefix();
            var canvas = this._engine.getRenderingCanvas();
            if (!canvas) {
                return;
            }
            if (attachMove) {
                canvas.addEventListener(eventPrefix + "move", this._onPointerMove, false);
                // Wheel
                canvas.addEventListener('mousewheel', this._onPointerMove, false);
                canvas.addEventListener('DOMMouseScroll', this._onPointerMove, false);
            }
            if (attachDown) {
                canvas.addEventListener(eventPrefix + "down", this._onPointerDown, false);
            }
            if (attachUp) {
                window.addEventListener(eventPrefix + "up", this._onPointerUp, false);
            }
            canvas.tabIndex = 1;
        };
        Scene.prototype.detachControl = function () {
            var engine = this.getEngine();
            var eventPrefix = LIB.Tools.GetPointerPrefix();
            var canvas = engine.getRenderingCanvas();
            if (!canvas) {
                return;
            }
            canvas.removeEventListener(eventPrefix + "move", this._onPointerMove);
            canvas.removeEventListener(eventPrefix + "down", this._onPointerDown);
            window.removeEventListener(eventPrefix + "up", this._onPointerUp);
            if (this._onCanvasBlurObserver) {
                engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
            }
            if (this._onCanvasFocusObserver) {
                engine.onCanvasFocusObservable.remove(this._onCanvasFocusObserver);
            }
            // Wheel
            canvas.removeEventListener('mousewheel', this._onPointerMove);
            canvas.removeEventListener('DOMMouseScroll', this._onPointerMove);
            // Keyboard
            canvas.removeEventListener("keydown", this._onKeyDown);
            canvas.removeEventListener("keyup", this._onKeyUp);
            // Observables
            this.onKeyboardObservable.clear();
            this.onPreKeyboardObservable.clear();
            this.onPointerObservable.clear();
            this.onPrePointerObservable.clear();
        };
        // Ready
        Scene.prototype.isReady = function () {
            if (this._isDisposed) {
                return false;
            }
            if (this._pendingData.length > 0) {
                return false;
            }
            var index;
            // Geometries
            for (index = 0; index < this._geometries.length; index++) {
                var geometry = this._geometries[index];
                if (geometry.delayLoadState === LIB.Engine.DELAYLOADSTATE_LOADING) {
                    return false;
                }
            }
            // Meshes
            for (index = 0; index < this.meshes.length; index++) {
                var mesh = this.meshes[index];
                if (!mesh.isEnabled()) {
                    continue;
                }
                if (!mesh.subMeshes || mesh.subMeshes.length === 0) {
                    continue;
                }
                if (!mesh.isReady()) {
                    return false;
                }
                var mat = mesh.material;
                if (mat) {
                    if (!mat.isReady(mesh)) {
                        return false;
                    }
                }
            }
            return true;
        };
        Scene.prototype.resetCachedMaterial = function () {
            this._cachedMaterial = null;
            this._cachedEffect = null;
            this._cachedVisibility = null;
        };
        Scene.prototype.registerBeforeRender = function (func) {
            this.onBeforeRenderObservable.add(func);
        };
        Scene.prototype.unregisterBeforeRender = function (func) {
            this.onBeforeRenderObservable.removeCallback(func);
        };
        Scene.prototype.registerAfterRender = function (func) {
            this.onAfterRenderObservable.add(func);
        };
        Scene.prototype.unregisterAfterRender = function (func) {
            this.onAfterRenderObservable.removeCallback(func);
        };
        Scene.prototype._addPendingData = function (data) {
            this._pendingData.push(data);
        };
        Scene.prototype._removePendingData = function (data) {
            var wasLoading = this.isLoading;
            var index = this._pendingData.indexOf(data);
            if (index !== -1) {
                this._pendingData.splice(index, 1);
            }
            if (wasLoading && !this.isLoading) {
                this.onDataLoadedObservable.notifyObservers(this);
            }
        };
        Scene.prototype.getWaitingItemsCount = function () {
            return this._pendingData.length;
        };
        Object.defineProperty(Scene.prototype, "isLoading", {
            get: function () {
                return this._pendingData.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Registers a function to be executed when the scene is ready.
         * @param {Function} func - the function to be executed.
         */
        Scene.prototype.executeWhenReady = function (func) {
            var _this = this;
            this.onReadyObservable.add(func);
            if (this._executeWhenReadyTimeoutId !== -1) {
                return;
            }
            this._executeWhenReadyTimeoutId = setTimeout(function () {
                _this._checkIsReady();
            }, 150);
        };
        Scene.prototype._checkIsReady = function () {
            var _this = this;
            if (this.isReady()) {
                this.onReadyObservable.notifyObservers(this);
                this.onReadyObservable.clear();
                this._executeWhenReadyTimeoutId = -1;
                return;
            }
            this._executeWhenReadyTimeoutId = setTimeout(function () {
                _this._checkIsReady();
            }, 150);
        };
        // Animations
        /**
         * Will start the animation sequence of a given target
         * @param target - the target
         * @param {number} from - from which frame should animation start
         * @param {number} to - till which frame should animation run.
         * @param {boolean} [loop] - should the animation loop
         * @param {number} [speedRatio] - the speed in which to run the animation
         * @param {Function} [onAnimationEnd] function to be executed when the animation ended.
         * @param {LIB.Animatable} [animatable] an animatable object. If not provided a new one will be created from the given params.
         * Returns {LIB.Animatable} the animatable object created for this animation
         * See LIB.Animatable
         */
        Scene.prototype.beginAnimation = function (target, from, to, loop, speedRatio, onAnimationEnd, animatable) {
            if (speedRatio === void 0) { speedRatio = 1.0; }
            if (from > to && speedRatio > 0) {
                speedRatio *= -1;
            }
            this.stopAnimation(target);
            if (!animatable) {
                animatable = new LIB.Animatable(this, target, from, to, loop, speedRatio, onAnimationEnd);
            }
            // Local animations
            if (target.animations) {
                animatable.appendAnimations(target, target.animations);
            }
            // Children animations
            if (target.getAnimatables) {
                var animatables = target.getAnimatables();
                for (var index = 0; index < animatables.length; index++) {
                    this.beginAnimation(animatables[index], from, to, loop, speedRatio, onAnimationEnd, animatable);
                }
            }
            animatable.reset();
            return animatable;
        };
        Scene.prototype.beginDirectAnimation = function (target, animations, from, to, loop, speedRatio, onAnimationEnd) {
            if (speedRatio === undefined) {
                speedRatio = 1.0;
            }
            var animatable = new LIB.Animatable(this, target, from, to, loop, speedRatio, onAnimationEnd, animations);
            return animatable;
        };
        Scene.prototype.getAnimatableByTarget = function (target) {
            for (var index = 0; index < this._activeAnimatables.length; index++) {
                if (this._activeAnimatables[index].target === target) {
                    return this._activeAnimatables[index];
                }
            }
            return null;
        };
        Object.defineProperty(Scene.prototype, "animatables", {
            get: function () {
                return this._activeAnimatables;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Will stop the animation of the given target
         * @param target - the target
         * @param animationName - the name of the animation to stop (all animations will be stopped is empty)
         * @see beginAnimation
         */
        Scene.prototype.stopAnimation = function (target, animationName) {
            var animatable = this.getAnimatableByTarget(target);
            if (animatable) {
                animatable.stop(animationName);
            }
        };
        /**
         * Stops and removes all animations that have been applied to the scene
         */
        Scene.prototype.stopAllAnimations = function () {
            if (this._activeAnimatables) {
                for (var i = 0; i < this._activeAnimatables.length; i++) {
                    this._activeAnimatables[i].stop();
                }
                this._activeAnimatables = [];
            }
        };
        Scene.prototype._animate = function () {
            if (!this.animationsEnabled || this._activeAnimatables.length === 0) {
                return;
            }
            // Getting time
            var now = LIB.Tools.Now;
            if (!this._animationTimeLast) {
                if (this._pendingData.length > 0) {
                    return;
                }
                this._animationTimeLast = now;
            }
            var deltaTime = this.useConstantAnimationDeltaTime ? 16.0 : (now - this._animationTimeLast) * this.animationTimeScale;
            this._animationTime += deltaTime;
            this._animationTimeLast = now;
            for (var index = 0; index < this._activeAnimatables.length; index++) {
                this._activeAnimatables[index]._animate(this._animationTime);
            }
        };
        // Matrix
        Scene.prototype._switchToAlternateCameraConfiguration = function (active) {
            this._useAlternateCameraConfiguration = active;
        };
        Scene.prototype.getViewMatrix = function () {
            return this._useAlternateCameraConfiguration ? this._alternateViewMatrix : this._viewMatrix;
        };
        Scene.prototype.getProjectionMatrix = function () {
            return this._useAlternateCameraConfiguration ? this._alternateProjectionMatrix : this._projectionMatrix;
        };
        Scene.prototype.getTransformMatrix = function () {
            return this._useAlternateCameraConfiguration ? this._alternateTransformMatrix : this._transformMatrix;
        };
        Scene.prototype.setTransformMatrix = function (view, projection) {
            if (this._viewUpdateFlag === view.updateFlag && this._projectionUpdateFlag === projection.updateFlag) {
                return;
            }
            this._viewUpdateFlag = view.updateFlag;
            this._projectionUpdateFlag = projection.updateFlag;
            this._viewMatrix = view;
            this._projectionMatrix = projection;
            this._viewMatrix.multiplyToRef(this._projectionMatrix, this._transformMatrix);
            // Update frustum
            if (!this._frustumPlanes) {
                this._frustumPlanes = LIB.Frustum.GetPlanes(this._transformMatrix);
            }
            else {
                LIB.Frustum.GetPlanesToRef(this._transformMatrix, this._frustumPlanes);
            }
            if (this.activeCamera && this.activeCamera._alternateCamera) {
                var otherCamera = this.activeCamera._alternateCamera;
                otherCamera.getViewMatrix().multiplyToRef(otherCamera.getProjectionMatrix(), LIB.Tmp.Matrix[0]);
                LIB.Frustum.GetRightPlaneToRef(LIB.Tmp.Matrix[0], this._frustumPlanes[3]); // Replace right plane by second camera right plane
            }
            if (this._sceneUbo.useUbo) {
                this._sceneUbo.updateMatrix("viewProjection", this._transformMatrix);
                this._sceneUbo.updateMatrix("view", this._viewMatrix);
                this._sceneUbo.update();
            }
        };
        Scene.prototype._setAlternateTransformMatrix = function (view, projection) {
            if (this._alternateViewUpdateFlag === view.updateFlag && this._alternateProjectionUpdateFlag === projection.updateFlag) {
                return;
            }
            this._alternateViewUpdateFlag = view.updateFlag;
            this._alternateProjectionUpdateFlag = projection.updateFlag;
            this._alternateViewMatrix = view;
            this._alternateProjectionMatrix = projection;
            if (!this._alternateTransformMatrix) {
                this._alternateTransformMatrix = LIB.Matrix.Zero();
            }
            this._alternateViewMatrix.multiplyToRef(this._alternateProjectionMatrix, this._alternateTransformMatrix);
            if (!this._alternateSceneUbo) {
                this._createAlternateUbo();
            }
            if (this._alternateSceneUbo.useUbo) {
                this._alternateSceneUbo.updateMatrix("viewProjection", this._alternateTransformMatrix);
                this._alternateSceneUbo.updateMatrix("view", this._alternateViewMatrix);
                this._alternateSceneUbo.update();
            }
        };
        Scene.prototype.getSceneUniformBuffer = function () {
            return this._useAlternateCameraConfiguration ? this._alternateSceneUbo : this._sceneUbo;
        };
        // Methods
        Scene.prototype.getUniqueId = function () {
            var result = Scene._uniqueIdCounter;
            Scene._uniqueIdCounter++;
            return result;
        };
        Scene.prototype.addMesh = function (newMesh) {
            this.meshes.push(newMesh);
            //notify the collision coordinator
            if (this.collisionCoordinator) {
                this.collisionCoordinator.onMeshAdded(newMesh);
            }
            this.onNewMeshAddedObservable.notifyObservers(newMesh);
        };
        Scene.prototype.removeMesh = function (toRemove) {
            var index = this.meshes.indexOf(toRemove);
            if (index !== -1) {
                // Remove from the scene if mesh found
                this.meshes.splice(index, 1);
            }
            this.onMeshRemovedObservable.notifyObservers(toRemove);
            return index;
        };
        Scene.prototype.addTransformNode = function (newTransformNode) {
            this.transformNodes.push(newTransformNode);
            this.onNewTransformNodeAddedObservable.notifyObservers(newTransformNode);
        };
        Scene.prototype.removeTransformNode = function (toRemove) {
            var index = this.transformNodes.indexOf(toRemove);
            if (index !== -1) {
                // Remove from the scene if found
                this.transformNodes.splice(index, 1);
            }
            this.onTransformNodeRemovedObservable.notifyObservers(toRemove);
            return index;
        };
        Scene.prototype.removeSkeleton = function (toRemove) {
            var index = this.skeletons.indexOf(toRemove);
            if (index !== -1) {
                // Remove from the scene if found
                this.skeletons.splice(index, 1);
            }
            return index;
        };
        Scene.prototype.removeMorphTargetManager = function (toRemove) {
            var index = this.morphTargetManagers.indexOf(toRemove);
            if (index !== -1) {
                // Remove from the scene if found
                this.morphTargetManagers.splice(index, 1);
            }
            return index;
        };
        Scene.prototype.removeLight = function (toRemove) {
            var index = this.lights.indexOf(toRemove);
            if (index !== -1) {
                // Remove from the scene if mesh found
                this.lights.splice(index, 1);
                this.sortLightsByPriority();
            }
            this.onLightRemovedObservable.notifyObservers(toRemove);
            return index;
        };
        Scene.prototype.removeCamera = function (toRemove) {
            var index = this.cameras.indexOf(toRemove);
            if (index !== -1) {
                // Remove from the scene if mesh found
                this.cameras.splice(index, 1);
            }
            // Remove from activeCameras
            var index2 = this.activeCameras.indexOf(toRemove);
            if (index2 !== -1) {
                // Remove from the scene if mesh found
                this.activeCameras.splice(index2, 1);
            }
            // Reset the activeCamera
            if (this.activeCamera === toRemove) {
                if (this.cameras.length > 0) {
                    this.activeCamera = this.cameras[0];
                }
                else {
                    this.activeCamera = null;
                }
            }
            this.onCameraRemovedObservable.notifyObservers(toRemove);
            return index;
        };
        Scene.prototype.addLight = function (newLight) {
            this.lights.push(newLight);
            this.sortLightsByPriority();
            this.onNewLightAddedObservable.notifyObservers(newLight);
        };
        Scene.prototype.sortLightsByPriority = function () {
            if (this.requireLightSorting) {
                this.lights.sort(LIB.Light.compareLightsPriority);
            }
        };
        Scene.prototype.addCamera = function (newCamera) {
            this.cameras.push(newCamera);
            this.onNewCameraAddedObservable.notifyObservers(newCamera);
        };
        /**
         * Switch active camera
         * @param {Camera} newCamera - new active camera
         * @param {boolean} attachControl - call attachControl for the new active camera (default: true)
         */
        Scene.prototype.switchActiveCamera = function (newCamera, attachControl) {
            if (attachControl === void 0) { attachControl = true; }
            var canvas = this._engine.getRenderingCanvas();
            if (!canvas) {
                return;
            }
            if (this.activeCamera) {
                this.activeCamera.detachControl(canvas);
            }
            this.activeCamera = newCamera;
            if (attachControl) {
                newCamera.attachControl(canvas);
            }
        };
        /**
         * sets the active camera of the scene using its ID
         * @param {string} id - the camera's ID
         * @return {LIB.Camera|null} the new active camera or null if none found.
         * @see activeCamera
         */
        Scene.prototype.setActiveCameraByID = function (id) {
            var camera = this.getCameraByID(id);
            if (camera) {
                this.activeCamera = camera;
                return camera;
            }
            return null;
        };
        /**
         * sets the active camera of the scene using its name
         * @param {string} name - the camera's name
         * @return {LIB.Camera|null} the new active camera or null if none found.
         * @see activeCamera
         */
        Scene.prototype.setActiveCameraByName = function (name) {
            var camera = this.getCameraByName(name);
            if (camera) {
                this.activeCamera = camera;
                return camera;
            }
            return null;
        };
        /**
         * get an animation group using its name
         * @param {string} the material's name
         * @return {LIB.AnimationGroup|null} the animation group or null if none found.
         */
        Scene.prototype.getAnimationGroupByName = function (name) {
            for (var index = 0; index < this.animationGroups.length; index++) {
                if (this.animationGroups[index].name === name) {
                    return this.animationGroups[index];
                }
            }
            return null;
        };
        /**
         * get a material using its id
         * @param {string} the material's ID
         * @return {LIB.Material|null} the material or null if none found.
         */
        Scene.prototype.getMaterialByID = function (id) {
            for (var index = 0; index < this.materials.length; index++) {
                if (this.materials[index].id === id) {
                    return this.materials[index];
                }
            }
            return null;
        };
        /**
         * get a material using its name
         * @param {string} the material's name
         * @return {LIB.Material|null} the material or null if none found.
         */
        Scene.prototype.getMaterialByName = function (name) {
            for (var index = 0; index < this.materials.length; index++) {
                if (this.materials[index].name === name) {
                    return this.materials[index];
                }
            }
            return null;
        };
        Scene.prototype.getLensFlareSystemByName = function (name) {
            for (var index = 0; index < this.lensFlareSystems.length; index++) {
                if (this.lensFlareSystems[index].name === name) {
                    return this.lensFlareSystems[index];
                }
            }
            return null;
        };
        Scene.prototype.getLensFlareSystemByID = function (id) {
            for (var index = 0; index < this.lensFlareSystems.length; index++) {
                if (this.lensFlareSystems[index].id === id) {
                    return this.lensFlareSystems[index];
                }
            }
            return null;
        };
        Scene.prototype.getCameraByID = function (id) {
            for (var index = 0; index < this.cameras.length; index++) {
                if (this.cameras[index].id === id) {
                    return this.cameras[index];
                }
            }
            return null;
        };
        Scene.prototype.getCameraByUniqueID = function (uniqueId) {
            for (var index = 0; index < this.cameras.length; index++) {
                if (this.cameras[index].uniqueId === uniqueId) {
                    return this.cameras[index];
                }
            }
            return null;
        };
        /**
         * get a camera using its name
         * @param {string} the camera's name
         * @return {LIB.Camera|null} the camera or null if none found.
         */
        Scene.prototype.getCameraByName = function (name) {
            for (var index = 0; index < this.cameras.length; index++) {
                if (this.cameras[index].name === name) {
                    return this.cameras[index];
                }
            }
            return null;
        };
        /**
         * get a bone using its id
         * @param {string} the bone's id
         * @return {LIB.Bone|null} the bone or null if not found
         */
        Scene.prototype.getBoneByID = function (id) {
            for (var skeletonIndex = 0; skeletonIndex < this.skeletons.length; skeletonIndex++) {
                var skeleton = this.skeletons[skeletonIndex];
                for (var boneIndex = 0; boneIndex < skeleton.bones.length; boneIndex++) {
                    if (skeleton.bones[boneIndex].id === id) {
                        return skeleton.bones[boneIndex];
                    }
                }
            }
            return null;
        };
        /**
        * get a bone using its id
        * @param {string} the bone's name
        * @return {LIB.Bone|null} the bone or null if not found
        */
        Scene.prototype.getBoneByName = function (name) {
            for (var skeletonIndex = 0; skeletonIndex < this.skeletons.length; skeletonIndex++) {
                var skeleton = this.skeletons[skeletonIndex];
                for (var boneIndex = 0; boneIndex < skeleton.bones.length; boneIndex++) {
                    if (skeleton.bones[boneIndex].name === name) {
                        return skeleton.bones[boneIndex];
                    }
                }
            }
            return null;
        };
        /**
         * get a light node using its name
         * @param {string} the light's name
         * @return {LIB.Light|null} the light or null if none found.
         */
        Scene.prototype.getLightByName = function (name) {
            for (var index = 0; index < this.lights.length; index++) {
                if (this.lights[index].name === name) {
                    return this.lights[index];
                }
            }
            return null;
        };
        /**
         * get a light node using its ID
         * @param {string} the light's id
         * @return {LIB.Light|null} the light or null if none found.
         */
        Scene.prototype.getLightByID = function (id) {
            for (var index = 0; index < this.lights.length; index++) {
                if (this.lights[index].id === id) {
                    return this.lights[index];
                }
            }
            return null;
        };
        /**
         * get a light node using its scene-generated unique ID
         * @param {number} the light's unique id
         * @return {LIB.Light|null} the light or null if none found.
         */
        Scene.prototype.getLightByUniqueID = function (uniqueId) {
            for (var index = 0; index < this.lights.length; index++) {
                if (this.lights[index].uniqueId === uniqueId) {
                    return this.lights[index];
                }
            }
            return null;
        };
        /**
         * get a particle system by id
         * @param id {number} the particle system id
         * @return {LIB.IParticleSystem|null} the corresponding system or null if none found.
         */
        Scene.prototype.getParticleSystemByID = function (id) {
            for (var index = 0; index < this.particleSystems.length; index++) {
                if (this.particleSystems[index].id === id) {
                    return this.particleSystems[index];
                }
            }
            return null;
        };
        /**
         * get a geometry using its ID
         * @param {string} the geometry's id
         * @return {LIB.Geometry|null} the geometry or null if none found.
         */
        Scene.prototype.getGeometryByID = function (id) {
            for (var index = 0; index < this._geometries.length; index++) {
                if (this._geometries[index].id === id) {
                    return this._geometries[index];
                }
            }
            return null;
        };
        /**
         * add a new geometry to this scene.
         * @param {LIB.Geometry} geometry - the geometry to be added to the scene.
         * @param {boolean} [force] - force addition, even if a geometry with this ID already exists
         * @return {boolean} was the geometry added or not
         */
        Scene.prototype.pushGeometry = function (geometry, force) {
            if (!force && this.getGeometryByID(geometry.id)) {
                return false;
            }
            this._geometries.push(geometry);
            //notify the collision coordinator
            if (this.collisionCoordinator) {
                this.collisionCoordinator.onGeometryAdded(geometry);
            }
            this.onNewGeometryAddedObservable.notifyObservers(geometry);
            return true;
        };
        /**
         * Removes an existing geometry
         * @param {LIB.Geometry} geometry - the geometry to be removed from the scene.
         * @return {boolean} was the geometry removed or not
         */
        Scene.prototype.removeGeometry = function (geometry) {
            var index = this._geometries.indexOf(geometry);
            if (index > -1) {
                this._geometries.splice(index, 1);
                //notify the collision coordinator
                if (this.collisionCoordinator) {
                    this.collisionCoordinator.onGeometryDeleted(geometry);
                }
                this.onGeometryRemovedObservable.notifyObservers(geometry);
                return true;
            }
            return false;
        };
        Scene.prototype.getGeometries = function () {
            return this._geometries;
        };
        /**
         * Get the first added mesh found of a given ID
         * @param {string} id - the id to search for
         * @return {LIB.AbstractMesh|null} the mesh found or null if not found at all.
         */
        Scene.prototype.getMeshByID = function (id) {
            for (var index = 0; index < this.meshes.length; index++) {
                if (this.meshes[index].id === id) {
                    return this.meshes[index];
                }
            }
            return null;
        };
        Scene.prototype.getMeshesByID = function (id) {
            return this.meshes.filter(function (m) {
                return m.id === id;
            });
        };
        /**
         * Get the first added transform node found of a given ID
         * @param {string} id - the id to search for
         * @return {LIB.TransformNode|null} the transform node found or null if not found at all.
         */
        Scene.prototype.getTransformNodeByID = function (id) {
            for (var index = 0; index < this.transformNodes.length; index++) {
                if (this.transformNodes[index].id === id) {
                    return this.transformNodes[index];
                }
            }
            return null;
        };
        Scene.prototype.getTransformNodesByID = function (id) {
            return this.transformNodes.filter(function (m) {
                return m.id === id;
            });
        };
        /**
         * Get a mesh with its auto-generated unique id
         * @param {number} uniqueId - the unique id to search for
         * @return {LIB.AbstractMesh|null} the mesh found or null if not found at all.
         */
        Scene.prototype.getMeshByUniqueID = function (uniqueId) {
            for (var index = 0; index < this.meshes.length; index++) {
                if (this.meshes[index].uniqueId === uniqueId) {
                    return this.meshes[index];
                }
            }
            return null;
        };
        /**
         * Get a the last added mesh found of a given ID
         * @param {string} id - the id to search for
         * @return {LIB.AbstractMesh|null} the mesh found or null if not found at all.
         */
        Scene.prototype.getLastMeshByID = function (id) {
            for (var index = this.meshes.length - 1; index >= 0; index--) {
                if (this.meshes[index].id === id) {
                    return this.meshes[index];
                }
            }
            return null;
        };
        /**
         * Get a the last added node (Mesh, Camera, Light) found of a given ID
         * @param {string} id - the id to search for
         * @return {LIB.Node|null} the node found or null if not found at all.
         */
        Scene.prototype.getLastEntryByID = function (id) {
            var index;
            for (index = this.meshes.length - 1; index >= 0; index--) {
                if (this.meshes[index].id === id) {
                    return this.meshes[index];
                }
            }
            for (index = this.transformNodes.length - 1; index >= 0; index--) {
                if (this.transformNodes[index].id === id) {
                    return this.transformNodes[index];
                }
            }
            for (index = this.cameras.length - 1; index >= 0; index--) {
                if (this.cameras[index].id === id) {
                    return this.cameras[index];
                }
            }
            for (index = this.lights.length - 1; index >= 0; index--) {
                if (this.lights[index].id === id) {
                    return this.lights[index];
                }
            }
            return null;
        };
        Scene.prototype.getNodeByID = function (id) {
            var mesh = this.getMeshByID(id);
            if (mesh) {
                return mesh;
            }
            var light = this.getLightByID(id);
            if (light) {
                return light;
            }
            var camera = this.getCameraByID(id);
            if (camera) {
                return camera;
            }
            var bone = this.getBoneByID(id);
            return bone;
        };
        Scene.prototype.getNodeByName = function (name) {
            var mesh = this.getMeshByName(name);
            if (mesh) {
                return mesh;
            }
            var light = this.getLightByName(name);
            if (light) {
                return light;
            }
            var camera = this.getCameraByName(name);
            if (camera) {
                return camera;
            }
            var bone = this.getBoneByName(name);
            return bone;
        };
        Scene.prototype.getMeshByName = function (name) {
            for (var index = 0; index < this.meshes.length; index++) {
                if (this.meshes[index].name === name) {
                    return this.meshes[index];
                }
            }
            return null;
        };
        Scene.prototype.getTransformNodeByName = function (name) {
            for (var index = 0; index < this.transformNodes.length; index++) {
                if (this.transformNodes[index].name === name) {
                    return this.transformNodes[index];
                }
            }
            return null;
        };
        Scene.prototype.getSoundByName = function (name) {
            var index;
            if (LIB.AudioEngine) {
                for (index = 0; index < this.mainSoundTrack.soundCollection.length; index++) {
                    if (this.mainSoundTrack.soundCollection[index].name === name) {
                        return this.mainSoundTrack.soundCollection[index];
                    }
                }
                for (var sdIndex = 0; sdIndex < this.soundTracks.length; sdIndex++) {
                    for (index = 0; index < this.soundTracks[sdIndex].soundCollection.length; index++) {
                        if (this.soundTracks[sdIndex].soundCollection[index].name === name) {
                            return this.soundTracks[sdIndex].soundCollection[index];
                        }
                    }
                }
            }
            return null;
        };
        Scene.prototype.getLastSkeletonByID = function (id) {
            for (var index = this.skeletons.length - 1; index >= 0; index--) {
                if (this.skeletons[index].id === id) {
                    return this.skeletons[index];
                }
            }
            return null;
        };
        Scene.prototype.getSkeletonById = function (id) {
            for (var index = 0; index < this.skeletons.length; index++) {
                if (this.skeletons[index].id === id) {
                    return this.skeletons[index];
                }
            }
            return null;
        };
        Scene.prototype.getSkeletonByName = function (name) {
            for (var index = 0; index < this.skeletons.length; index++) {
                if (this.skeletons[index].name === name) {
                    return this.skeletons[index];
                }
            }
            return null;
        };
        Scene.prototype.getMorphTargetManagerById = function (id) {
            for (var index = 0; index < this.morphTargetManagers.length; index++) {
                if (this.morphTargetManagers[index].uniqueId === id) {
                    return this.morphTargetManagers[index];
                }
            }
            return null;
        };
        Scene.prototype.isActiveMesh = function (mesh) {
            return (this._activeMeshes.indexOf(mesh) !== -1);
        };
        /**
         * Return a the first highlight layer of the scene with a given name.
         * @param name The name of the highlight layer to look for.
         * @return The highlight layer if found otherwise null.
         */
        Scene.prototype.getHighlightLayerByName = function (name) {
            for (var index = 0; index < this.highlightLayers.length; index++) {
                if (this.highlightLayers[index].name === name) {
                    return this.highlightLayers[index];
                }
            }
            return null;
        };
        Object.defineProperty(Scene.prototype, "uid", {
            /**
             * Return a unique id as a string which can serve as an identifier for the scene
             */
            get: function () {
                if (!this._uid) {
                    this._uid = LIB.Tools.RandomId();
                }
                return this._uid;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Add an externaly attached data from its key.
         * This method call will fail and return false, if such key already exists.
         * If you don't care and just want to get the data no matter what, use the more convenient getOrAddExternalDataWithFactory() method.
         * @param key the unique key that identifies the data
         * @param data the data object to associate to the key for this Engine instance
         * @return true if no such key were already present and the data was added successfully, false otherwise
         */
        Scene.prototype.addExternalData = function (key, data) {
            if (!this._externalData) {
                this._externalData = new LIB.StringDictionary();
            }
            return this._externalData.add(key, data);
        };
        /**
         * Get an externaly attached data from its key
         * @param key the unique key that identifies the data
         * @return the associated data, if present (can be null), or undefined if not present
         */
        Scene.prototype.getExternalData = function (key) {
            if (!this._externalData) {
                return null;
            }
            return this._externalData.get(key);
        };
        /**
         * Get an externaly attached data from its key, create it using a factory if it's not already present
         * @param key the unique key that identifies the data
         * @param factory the factory that will be called to create the instance if and only if it doesn't exists
         * @return the associated data, can be null if the factory returned null.
         */
        Scene.prototype.getOrAddExternalDataWithFactory = function (key, factory) {
            if (!this._externalData) {
                this._externalData = new LIB.StringDictionary();
            }
            return this._externalData.getOrAddWithFactory(key, factory);
        };
        /**
         * Remove an externaly attached data from the Engine instance
         * @param key the unique key that identifies the data
         * @return true if the data was successfully removed, false if it doesn't exist
         */
        Scene.prototype.removeExternalData = function (key) {
            return this._externalData.remove(key);
        };
        Scene.prototype._evaluateSubMesh = function (subMesh, mesh) {
            if (mesh.alwaysSelectAsActiveMesh || mesh.subMeshes.length === 1 || subMesh.isInFrustum(this._frustumPlanes)) {
                var material = subMesh.getMaterial();
                if (mesh.showSubMeshesBoundingBox) {
                    var boundingInfo = subMesh.getBoundingInfo();
                    this.getBoundingBoxRenderer().renderList.push(boundingInfo.boundingBox);
                }
                if (material) {
                    // Render targets
                    if (material.getRenderTargetTextures) {
                        if (this._processedMaterials.indexOf(material) === -1) {
                            this._processedMaterials.push(material);
                            this._renderTargets.concatWithNoDuplicate(material.getRenderTargetTextures());
                        }
                    }
                    // Dispatch
                    this._activeIndices.addCount(subMesh.indexCount, false);
                    this._renderingManager.dispatch(subMesh);
                }
            }
        };
        Scene.prototype._isInIntermediateRendering = function () {
            return this._intermediateRendering;
        };
        /**
         * Use this function to stop evaluating active meshes. The current list will be keep alive between frames
         */
        Scene.prototype.freezeActiveMeshes = function () {
            this._evaluateActiveMeshes();
            this._activeMeshesFrozen = true;
            return this;
        };
        /**
         * Use this function to restart evaluating active meshes on every frame
         */
        Scene.prototype.unfreezeActiveMeshes = function () {
            this._activeMeshesFrozen = false;
            return this;
        };
        Scene.prototype._evaluateActiveMeshes = function () {
            if (this._activeMeshesFrozen && this._activeMeshes.length) {
                return;
            }
            if (!this.activeCamera) {
                return;
            }
            this.onBeforeActiveMeshesEvaluationObservable.notifyObservers(this);
            this.activeCamera._activeMeshes.reset();
            this._activeMeshes.reset();
            this._renderingManager.reset();
            this._processedMaterials.reset();
            this._activeParticleSystems.reset();
            this._activeSkeletons.reset();
            this._softwareSkinnedMeshes.reset();
            if (this._boundingBoxRenderer) {
                this._boundingBoxRenderer.reset();
            }
            // Meshes
            var meshes;
            var len;
            if (this._selectionOctree) {
                var selection = this._selectionOctree.select(this._frustumPlanes);
                meshes = selection.data;
                len = selection.length;
            }
            else {
                len = this.meshes.length;
                meshes = this.meshes;
            }
            for (var meshIndex = 0; meshIndex < len; meshIndex++) {
                var mesh = meshes[meshIndex];
                if (mesh.isBlocked) {
                    continue;
                }
                this._totalVertices.addCount(mesh.getTotalVertices(), false);
                if (!mesh.isReady() || !mesh.isEnabled()) {
                    continue;
                }
                mesh.computeWorldMatrix();
                // Intersections
                if (mesh.actionManager && mesh.actionManager.hasSpecificTriggers([LIB.ActionManager.OnIntersectionEnterTrigger, LIB.ActionManager.OnIntersectionExitTrigger])) {
                    this._meshesForIntersections.pushNoDuplicate(mesh);
                }
                // Switch to current LOD
                var meshLOD = mesh.getLOD(this.activeCamera);
                if (!meshLOD) {
                    continue;
                }
                mesh._preActivate();
                if (mesh.alwaysSelectAsActiveMesh || mesh.isVisible && mesh.visibility > 0 && ((mesh.layerMask & this.activeCamera.layerMask) !== 0) && mesh.isInFrustum(this._frustumPlanes)) {
                    this._activeMeshes.push(mesh);
                    this.activeCamera._activeMeshes.push(mesh);
                    mesh._activate(this._renderId);
                    if (meshLOD !== mesh) {
                        meshLOD._activate(this._renderId);
                    }
                    this._activeMesh(mesh, meshLOD);
                }
            }
            this.onAfterActiveMeshesEvaluationObservable.notifyObservers(this);
            // Particle systems
            if (this.particlesEnabled) {
                this.onBeforeParticlesRenderingObservable.notifyObservers(this);
                for (var particleIndex = 0; particleIndex < this.particleSystems.length; particleIndex++) {
                    var particleSystem = this.particleSystems[particleIndex];
                    if (!particleSystem.isStarted() || !particleSystem.emitter) {
                        continue;
                    }
                    var emitter = particleSystem.emitter;
                    if (!emitter.position || emitter.isEnabled()) {
                        this._activeParticleSystems.push(particleSystem);
                        particleSystem.animate();
                        this._renderingManager.dispatchParticles(particleSystem);
                    }
                }
                this.onAfterParticlesRenderingObservable.notifyObservers(this);
            }
        };
        Scene.prototype._activeMesh = function (sourceMesh, mesh) {
            if (mesh.skeleton && this.skeletonsEnabled) {
                if (this._activeSkeletons.pushNoDuplicate(mesh.skeleton)) {
                    mesh.skeleton.prepare();
                }
                if (!mesh.computeBonesUsingShaders) {
                    this._softwareSkinnedMeshes.pushNoDuplicate(mesh);
                }
            }
            if (sourceMesh.showBoundingBox || this.forceShowBoundingBoxes) {
                var boundingInfo = sourceMesh.getBoundingInfo();
                this.getBoundingBoxRenderer().renderList.push(boundingInfo.boundingBox);
            }
            if (mesh && mesh.subMeshes) {
                // Submeshes Octrees
                var len;
                var subMeshes;
                if (mesh._submeshesOctree && mesh.useOctreeForRenderingSelection) {
                    var intersections = mesh._submeshesOctree.select(this._frustumPlanes);
                    len = intersections.length;
                    subMeshes = intersections.data;
                }
                else {
                    subMeshes = mesh.subMeshes;
                    len = subMeshes.length;
                }
                for (var subIndex = 0; subIndex < len; subIndex++) {
                    var subMesh = subMeshes[subIndex];
                    this._evaluateSubMesh(subMesh, mesh);
                }
            }
        };
        Scene.prototype.updateTransformMatrix = function (force) {
            if (!this.activeCamera) {
                return;
            }
            this.setTransformMatrix(this.activeCamera.getViewMatrix(), this.activeCamera.getProjectionMatrix(force));
        };
        Scene.prototype.updateAlternateTransformMatrix = function (alternateCamera) {
            this._setAlternateTransformMatrix(alternateCamera.getViewMatrix(), alternateCamera.getProjectionMatrix());
        };
        Scene.prototype._renderForCamera = function (camera) {
            if (camera && camera._skipRendering) {
                return;
            }
            var engine = this._engine;
            this.activeCamera = camera;
            if (!this.activeCamera)
                throw new Error("Active camera not set");
            LIB.Tools.StartPerformanceCounter("Rendering camera " + this.activeCamera.name);
            // Viewport
            engine.setViewport(this.activeCamera.viewport);
            // Camera
            this.resetCachedMaterial();
            this._renderId++;
            this.activeCamera.update();
            this.updateTransformMatrix();
            if (camera._alternateCamera) {
                this.updateAlternateTransformMatrix(camera._alternateCamera);
                this._alternateRendering = true;
            }
            this.onBeforeCameraRenderObservable.notifyObservers(this.activeCamera);
            // Meshes
            this._evaluateActiveMeshes();
            // Software skinning
            for (var softwareSkinnedMeshIndex = 0; softwareSkinnedMeshIndex < this._softwareSkinnedMeshes.length; softwareSkinnedMeshIndex++) {
                var mesh = this._softwareSkinnedMeshes.data[softwareSkinnedMeshIndex];
                mesh.applySkeleton(mesh.skeleton);
            }
            // Render targets
            this.OnBeforeRenderTargetsRenderObservable.notifyObservers(this);
            var needsRestoreFrameBuffer = false;
            if (camera.customRenderTargets && camera.customRenderTargets.length > 0) {
                this._renderTargets.concatWithNoDuplicate(camera.customRenderTargets);
            }
            if (this.renderTargetsEnabled && this._renderTargets.length > 0) {
                this._intermediateRendering = true;
                LIB.Tools.StartPerformanceCounter("Render targets", this._renderTargets.length > 0);
                for (var renderIndex = 0; renderIndex < this._renderTargets.length; renderIndex++) {
                    var renderTarget = this._renderTargets.data[renderIndex];
                    if (renderTarget._shouldRender()) {
                        this._renderId++;
                        var hasSpecialRenderTargetCamera = renderTarget.activeCamera && renderTarget.activeCamera !== this.activeCamera;
                        renderTarget.render(hasSpecialRenderTargetCamera, this.dumpNextRenderTargets);
                    }
                }
                LIB.Tools.EndPerformanceCounter("Render targets", this._renderTargets.length > 0);
                this._intermediateRendering = false;
                this._renderId++;
                needsRestoreFrameBuffer = true; // Restore back buffer
            }
            // Render HighlightLayer Texture
            var stencilState = this._engine.getStencilBuffer();
            var renderhighlights = false;
            if (this.renderTargetsEnabled && this.highlightLayers && this.highlightLayers.length > 0) {
                this._intermediateRendering = true;
                for (var i = 0; i < this.highlightLayers.length; i++) {
                    var highlightLayer = this.highlightLayers[i];
                    if (highlightLayer.shouldRender() &&
                        (!highlightLayer.camera ||
                            (highlightLayer.camera.cameraRigMode === LIB.Camera.RIG_MODE_NONE && camera === highlightLayer.camera) ||
                            (highlightLayer.camera.cameraRigMode !== LIB.Camera.RIG_MODE_NONE && highlightLayer.camera._rigCameras.indexOf(camera) > -1))) {
                        renderhighlights = true;
                        var renderTarget = highlightLayer._mainTexture;
                        if (renderTarget._shouldRender()) {
                            this._renderId++;
                            renderTarget.render(false, false);
                            needsRestoreFrameBuffer = true;
                        }
                    }
                }
                this._intermediateRendering = false;
                this._renderId++;
            }
            if (needsRestoreFrameBuffer) {
                engine.restoreDefaultFramebuffer(); // Restore back buffer
            }
            this.OnAfterRenderTargetsRenderObservable.notifyObservers(this);
            // Prepare Frame
            this.postProcessManager._prepareFrame();
            // Backgrounds
            var layerIndex;
            var layer;
            if (this.layers.length) {
                engine.setDepthBuffer(false);
                for (layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
                    layer = this.layers[layerIndex];
                    if (layer.isBackground && ((layer.layerMask & this.activeCamera.layerMask) !== 0)) {
                        layer.render();
                    }
                }
                engine.setDepthBuffer(true);
            }
            // Activate HighlightLayer stencil
            if (renderhighlights) {
                this._engine.setStencilBuffer(true);
            }
            // Render
            this.onBeforeDrawPhaseObservable.notifyObservers(this);
            this._renderingManager.render(null, null, true, true);
            this.onAfterDrawPhaseObservable.notifyObservers(this);
            // Restore HighlightLayer stencil
            if (renderhighlights) {
                this._engine.setStencilBuffer(stencilState);
            }
            // Bounding boxes
            if (this._boundingBoxRenderer) {
                this._boundingBoxRenderer.render();
            }
            // Lens flares
            if (this.lensFlaresEnabled) {
                LIB.Tools.StartPerformanceCounter("Lens flares", this.lensFlareSystems.length > 0);
                for (var lensFlareSystemIndex = 0; lensFlareSystemIndex < this.lensFlareSystems.length; lensFlareSystemIndex++) {
                    var lensFlareSystem = this.lensFlareSystems[lensFlareSystemIndex];
                    if ((camera.layerMask & lensFlareSystem.layerMask) !== 0) {
                        lensFlareSystem.render();
                    }
                }
                LIB.Tools.EndPerformanceCounter("Lens flares", this.lensFlareSystems.length > 0);
            }
            // Foregrounds
            if (this.layers.length) {
                engine.setDepthBuffer(false);
                for (layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
                    layer = this.layers[layerIndex];
                    if (!layer.isBackground && ((layer.layerMask & this.activeCamera.layerMask) !== 0)) {
                        layer.render();
                    }
                }
                engine.setDepthBuffer(true);
            }
            // Highlight Layer
            if (renderhighlights) {
                engine.setDepthBuffer(false);
                for (var i = 0; i < this.highlightLayers.length; i++) {
                    if (this.highlightLayers[i].shouldRender()) {
                        this.highlightLayers[i].render();
                    }
                }
                engine.setDepthBuffer(true);
            }
            // Finalize frame
            this.postProcessManager._finalizeFrame(camera.isIntermediate);
            // Reset some special arrays
            this._renderTargets.reset();
            this._alternateRendering = false;
            this.onAfterCameraRenderObservable.notifyObservers(this.activeCamera);
            LIB.Tools.EndPerformanceCounter("Rendering camera " + this.activeCamera.name);
        };
        Scene.prototype._processSubCameras = function (camera) {
            if (camera.cameraRigMode === LIB.Camera.RIG_MODE_NONE) {
                this._renderForCamera(camera);
                return;
            }
            // Update camera
            if (this.activeCamera) {
                this.activeCamera.update();
            }
            // rig cameras
            for (var index = 0; index < camera._rigCameras.length; index++) {
                this._renderForCamera(camera._rigCameras[index]);
            }
            this.activeCamera = camera;
            this.setTransformMatrix(this.activeCamera.getViewMatrix(), this.activeCamera.getProjectionMatrix());
        };
        Scene.prototype._checkIntersections = function () {
            for (var index = 0; index < this._meshesForIntersections.length; index++) {
                var sourceMesh = this._meshesForIntersections.data[index];
                if (!sourceMesh.actionManager) {
                    continue;
                }
                for (var actionIndex = 0; actionIndex < sourceMesh.actionManager.actions.length; actionIndex++) {
                    var action = sourceMesh.actionManager.actions[actionIndex];
                    if (action.trigger === LIB.ActionManager.OnIntersectionEnterTrigger || action.trigger === LIB.ActionManager.OnIntersectionExitTrigger) {
                        var parameters = action.getTriggerParameter();
                        var otherMesh = parameters instanceof LIB.AbstractMesh ? parameters : parameters.mesh;
                        var areIntersecting = otherMesh.intersectsMesh(sourceMesh, parameters.usePreciseIntersection);
                        var currentIntersectionInProgress = sourceMesh._intersectionsInProgress.indexOf(otherMesh);
                        if (areIntersecting && currentIntersectionInProgress === -1) {
                            if (action.trigger === LIB.ActionManager.OnIntersectionEnterTrigger) {
                                action._executeCurrent(LIB.ActionEvent.CreateNew(sourceMesh, undefined, otherMesh));
                                sourceMesh._intersectionsInProgress.push(otherMesh);
                            }
                            else if (action.trigger === LIB.ActionManager.OnIntersectionExitTrigger) {
                                sourceMesh._intersectionsInProgress.push(otherMesh);
                            }
                        }
                        else if (!areIntersecting && currentIntersectionInProgress > -1) {
                            //They intersected, and now they don't.
                            //is this trigger an exit trigger? execute an event.
                            if (action.trigger === LIB.ActionManager.OnIntersectionExitTrigger) {
                                action._executeCurrent(LIB.ActionEvent.CreateNew(sourceMesh, undefined, otherMesh));
                            }
                            //if this is an exit trigger, or no exit trigger exists, remove the id from the intersection in progress array.
                            if (!sourceMesh.actionManager.hasSpecificTrigger(LIB.ActionManager.OnIntersectionExitTrigger) || action.trigger === LIB.ActionManager.OnIntersectionExitTrigger) {
                                sourceMesh._intersectionsInProgress.splice(currentIntersectionInProgress, 1);
                            }
                        }
                    }
                }
            }
        };
        Scene.prototype.render = function () {
            if (this.isDisposed) {
                return;
            }
            this._activeParticles.fetchNewFrame();
            this._totalVertices.fetchNewFrame();
            this._activeIndices.fetchNewFrame();
            this._activeBones.fetchNewFrame();
            this._meshesForIntersections.reset();
            this.resetCachedMaterial();
            this.onBeforeAnimationsObservable.notifyObservers(this);
            // Actions
            if (this.actionManager) {
                this.actionManager.processTrigger(LIB.ActionManager.OnEveryFrameTrigger);
            }
            //Simplification Queue
            if (this.simplificationQueue && !this.simplificationQueue.running) {
                this.simplificationQueue.executeNext();
            }
            if (this._engine.isDeterministicLockStep()) {
                var deltaTime = Math.max(Scene.MinDeltaTime, Math.min(this._engine.getDeltaTime(), Scene.MaxDeltaTime)) + this._timeAccumulator;
                var defaultFPS = (60.0 / 1000.0);
                var defaultFrameTime = 1000 / 60; // frame time in MS
                if (this._physicsEngine) {
                    defaultFrameTime = this._physicsEngine.getTimeStep() * 1000;
                }
                var stepsTaken = 0;
                var maxSubSteps = this._engine.getLockstepMaxSteps();
                var internalSteps = Math.floor(deltaTime / (1000 * defaultFPS));
                internalSteps = Math.min(internalSteps, maxSubSteps);
                do {
                    this.onBeforeStepObservable.notifyObservers(this);
                    // Animations
                    this._animationRatio = defaultFrameTime * defaultFPS;
                    this._animate();
                    this.onAfterAnimationsObservable.notifyObservers(this);
                    // Physics
                    if (this._physicsEngine) {
                        this.onBeforePhysicsObservable.notifyObservers(this);
                        this._physicsEngine._step(defaultFrameTime / 1000);
                        this.onAfterPhysicsObservable.notifyObservers(this);
                    }
                    this.onAfterStepObservable.notifyObservers(this);
                    this._currentStepId++;
                    stepsTaken++;
                    deltaTime -= defaultFrameTime;
                } while (deltaTime > 0 && stepsTaken < internalSteps);
                this._timeAccumulator = deltaTime < 0 ? 0 : deltaTime;
            }
            else {
                // Animations
                var deltaTime = this.useConstantAnimationDeltaTime ? 16 : Math.max(Scene.MinDeltaTime, Math.min(this._engine.getDeltaTime(), Scene.MaxDeltaTime));
                this._animationRatio = deltaTime * (60.0 / 1000.0);
                this._animate();
                this.onAfterAnimationsObservable.notifyObservers(this);
                // Physics
                if (this._physicsEngine) {
                    this.onBeforePhysicsObservable.notifyObservers(this);
                    this._physicsEngine._step(deltaTime / 1000.0);
                    this.onAfterPhysicsObservable.notifyObservers(this);
                }
            }
            // update gamepad manager
            if (this._gamepadManager && this._gamepadManager._isMonitoring) {
                this._gamepadManager._checkGamepadsStatus();
            }
            // Before render
            this.onBeforeRenderObservable.notifyObservers(this);
            // Customs render targets
            this.OnBeforeRenderTargetsRenderObservable.notifyObservers(this);
            var engine = this.getEngine();
            var currentActiveCamera = this.activeCamera;
            if (this.renderTargetsEnabled) {
                LIB.Tools.StartPerformanceCounter("Custom render targets", this.customRenderTargets.length > 0);
                this._intermediateRendering = true;
                for (var customIndex = 0; customIndex < this.customRenderTargets.length; customIndex++) {
                    var renderTarget = this.customRenderTargets[customIndex];
                    if (renderTarget._shouldRender()) {
                        this._renderId++;
                        this.activeCamera = renderTarget.activeCamera || this.activeCamera;
                        if (!this.activeCamera)
                            throw new Error("Active camera not set");
                        // Viewport
                        engine.setViewport(this.activeCamera.viewport);
                        // Camera
                        this.updateTransformMatrix();
                        renderTarget.render(currentActiveCamera !== this.activeCamera, this.dumpNextRenderTargets);
                    }
                }
                LIB.Tools.EndPerformanceCounter("Custom render targets", this.customRenderTargets.length > 0);
                this._intermediateRendering = false;
                this._renderId++;
            }
            // Restore back buffer
            if (this.customRenderTargets.length > 0) {
                engine.restoreDefaultFramebuffer();
            }
            this.OnAfterRenderTargetsRenderObservable.notifyObservers(this);
            this.activeCamera = currentActiveCamera;
            // Procedural textures
            if (this.proceduralTexturesEnabled) {
                LIB.Tools.StartPerformanceCounter("Procedural textures", this._proceduralTextures.length > 0);
                for (var proceduralIndex = 0; proceduralIndex < this._proceduralTextures.length; proceduralIndex++) {
                    var proceduralTexture = this._proceduralTextures[proceduralIndex];
                    if (proceduralTexture._shouldRender()) {
                        proceduralTexture.render();
                    }
                }
                LIB.Tools.EndPerformanceCounter("Procedural textures", this._proceduralTextures.length > 0);
            }
            // Clear
            if (this.autoClearDepthAndStencil || this.autoClear) {
                this._engine.clear(this.clearColor, this.autoClear || this.forceWireframe || this.forcePointsCloud, this.autoClearDepthAndStencil, this.autoClearDepthAndStencil);
            }
            // Shadows
            if (this.shadowsEnabled) {
                for (var lightIndex = 0; lightIndex < this.lights.length; lightIndex++) {
                    var light = this.lights[lightIndex];
                    var shadowGenerator = light.getShadowGenerator();
                    if (light.isEnabled() && light.shadowEnabled && shadowGenerator) {
                        var shadowMap = (shadowGenerator.getShadowMap());
                        if (this.textures.indexOf(shadowMap) !== -1) {
                            this._renderTargets.push(shadowMap);
                        }
                    }
                }
            }
            // Depth renderer
            if (this._depthRenderer) {
                this._renderTargets.push(this._depthRenderer.getDepthMap());
            }
            // Geometry renderer
            if (this._geometryBufferRenderer) {
                this._renderTargets.push(this._geometryBufferRenderer.getGBuffer());
            }
            // RenderPipeline
            if (this._postProcessRenderPipelineManager) {
                this._postProcessRenderPipelineManager.update();
            }
            // Multi-cameras?
            if (this.activeCameras.length > 0) {
                for (var cameraIndex = 0; cameraIndex < this.activeCameras.length; cameraIndex++) {
                    if (cameraIndex > 0) {
                        this._engine.clear(null, false, true, true);
                    }
                    this._processSubCameras(this.activeCameras[cameraIndex]);
                }
            }
            else {
                if (!this.activeCamera) {
                    throw new Error("No camera defined");
                }
                this._processSubCameras(this.activeCamera);
            }
            // Intersection checks
            this._checkIntersections();
            // Update the audio listener attached to the camera
            if (LIB.AudioEngine) {
                this._updateAudioParameters();
            }
            // After render
            if (this.afterRender) {
                this.afterRender();
            }
            this.onAfterRenderObservable.notifyObservers(this);
            // Cleaning
            for (var index = 0; index < this._toBeDisposed.length; index++) {
                var data = this._toBeDisposed.data[index];
                if (data) {
                    data.dispose();
                }
                this._toBeDisposed[index] = null;
            }
            this._toBeDisposed.reset();
            if (this.dumpNextRenderTargets) {
                this.dumpNextRenderTargets = false;
            }
            this._activeBones.addCount(0, true);
            this._activeIndices.addCount(0, true);
            this._activeParticles.addCount(0, true);
        };
        Scene.prototype._updateAudioParameters = function () {
            if (!this.audioEnabled || !this._mainSoundTrack || (this._mainSoundTrack.soundCollection.length === 0 && this.soundTracks.length === 1)) {
                return;
            }
            var listeningCamera;
            var audioEngine = LIB.Engine.audioEngine;
            if (this.activeCameras.length > 0) {
                listeningCamera = this.activeCameras[0];
            }
            else {
                listeningCamera = this.activeCamera;
            }
            if (listeningCamera && audioEngine.canUseWebAudio && audioEngine.audioContext) {
                audioEngine.audioContext.listener.setPosition(listeningCamera.position.x, listeningCamera.position.y, listeningCamera.position.z);
                // for VR cameras
                if (listeningCamera.rigCameras && listeningCamera.rigCameras.length > 0) {
                    listeningCamera = listeningCamera.rigCameras[0];
                }
                var mat = LIB.Matrix.Invert(listeningCamera.getViewMatrix());
                var cameraDirection = LIB.Vector3.TransformNormal(new LIB.Vector3(0, 0, -1), mat);
                cameraDirection.normalize();
                // To avoid some errors on GearVR
                if (!isNaN(cameraDirection.x) && !isNaN(cameraDirection.y) && !isNaN(cameraDirection.z)) {
                    audioEngine.audioContext.listener.setOrientation(cameraDirection.x, cameraDirection.y, cameraDirection.z, 0, 1, 0);
                }
                var i;
                for (i = 0; i < this.mainSoundTrack.soundCollection.length; i++) {
                    var sound = this.mainSoundTrack.soundCollection[i];
                    if (sound.useCustomAttenuation) {
                        sound.updateDistanceFromListener();
                    }
                }
                for (i = 0; i < this.soundTracks.length; i++) {
                    for (var j = 0; j < this.soundTracks[i].soundCollection.length; j++) {
                        sound = this.soundTracks[i].soundCollection[j];
                        if (sound.useCustomAttenuation) {
                            sound.updateDistanceFromListener();
                        }
                    }
                }
            }
        };
        Object.defineProperty(Scene.prototype, "audioEnabled", {
            // Audio
            get: function () {
                return this._audioEnabled;
            },
            set: function (value) {
                this._audioEnabled = value;
                if (LIB.AudioEngine) {
                    if (this._audioEnabled) {
                        this._enableAudio();
                    }
                    else {
                        this._disableAudio();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype._disableAudio = function () {
            var i;
            for (i = 0; i < this.mainSoundTrack.soundCollection.length; i++) {
                this.mainSoundTrack.soundCollection[i].pause();
            }
            for (i = 0; i < this.soundTracks.length; i++) {
                for (var j = 0; j < this.soundTracks[i].soundCollection.length; j++) {
                    this.soundTracks[i].soundCollection[j].pause();
                }
            }
        };
        Scene.prototype._enableAudio = function () {
            var i;
            for (i = 0; i < this.mainSoundTrack.soundCollection.length; i++) {
                if (this.mainSoundTrack.soundCollection[i].isPaused) {
                    this.mainSoundTrack.soundCollection[i].play();
                }
            }
            for (i = 0; i < this.soundTracks.length; i++) {
                for (var j = 0; j < this.soundTracks[i].soundCollection.length; j++) {
                    if (this.soundTracks[i].soundCollection[j].isPaused) {
                        this.soundTracks[i].soundCollection[j].play();
                    }
                }
            }
        };
        Object.defineProperty(Scene.prototype, "headphone", {
            get: function () {
                return this._headphone;
            },
            set: function (value) {
                this._headphone = value;
                if (LIB.AudioEngine) {
                    if (this._headphone) {
                        this._switchAudioModeForHeadphones();
                    }
                    else {
                        this._switchAudioModeForNormalSpeakers();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype._switchAudioModeForHeadphones = function () {
            this.mainSoundTrack.switchPanningModelToHRTF();
            for (var i = 0; i < this.soundTracks.length; i++) {
                this.soundTracks[i].switchPanningModelToHRTF();
            }
        };
        Scene.prototype._switchAudioModeForNormalSpeakers = function () {
            this.mainSoundTrack.switchPanningModelToEqualPower();
            for (var i = 0; i < this.soundTracks.length; i++) {
                this.soundTracks[i].switchPanningModelToEqualPower();
            }
        };
        Scene.prototype.enableDepthRenderer = function () {
            if (this._depthRenderer) {
                return this._depthRenderer;
            }
            this._depthRenderer = new LIB.DepthRenderer(this);
            return this._depthRenderer;
        };
        Scene.prototype.disableDepthRenderer = function () {
            if (!this._depthRenderer) {
                return;
            }
            this._depthRenderer.dispose();
            this._depthRenderer = null;
        };
        Scene.prototype.enableGeometryBufferRenderer = function (ratio) {
            if (ratio === void 0) { ratio = 1; }
            if (this._geometryBufferRenderer) {
                return this._geometryBufferRenderer;
            }
            this._geometryBufferRenderer = new LIB.GeometryBufferRenderer(this, ratio);
            if (!this._geometryBufferRenderer.isSupported) {
                this._geometryBufferRenderer = null;
            }
            return this._geometryBufferRenderer;
        };
        Scene.prototype.disableGeometryBufferRenderer = function () {
            if (!this._geometryBufferRenderer) {
                return;
            }
            this._geometryBufferRenderer.dispose();
            this._geometryBufferRenderer = null;
        };
        Scene.prototype.freezeMaterials = function () {
            for (var i = 0; i < this.materials.length; i++) {
                this.materials[i].freeze();
            }
        };
        Scene.prototype.unfreezeMaterials = function () {
            for (var i = 0; i < this.materials.length; i++) {
                this.materials[i].unfreeze();
            }
        };
        Scene.prototype.dispose = function () {
            this.beforeRender = null;
            this.afterRender = null;
            this.skeletons = [];
            this.morphTargetManagers = [];
            this.importedMeshesFiles = new Array();
            this.stopAllAnimations();
            this.resetCachedMaterial();
            if (this._depthRenderer) {
                this._depthRenderer.dispose();
            }
            if (this._gamepadManager) {
                this._gamepadManager.dispose();
                this._gamepadManager = null;
            }
            // Smart arrays
            if (this.activeCamera) {
                this.activeCamera._activeMeshes.dispose();
                this.activeCamera = null;
            }
            this._activeMeshes.dispose();
            this._renderingManager.dispose();
            this._processedMaterials.dispose();
            this._activeParticleSystems.dispose();
            this._activeSkeletons.dispose();
            this._softwareSkinnedMeshes.dispose();
            this._renderTargets.dispose();
            if (this._boundingBoxRenderer) {
                this._boundingBoxRenderer.dispose();
            }
            this._meshesForIntersections.dispose();
            this._toBeDisposed.dispose();
            // Abort active requests
            for (var _i = 0, _a = this._activeRequests; _i < _a.length; _i++) {
                var request = _a[_i];
                request.abort();
            }
            // Debug layer
            if (this._debugLayer) {
                this._debugLayer.hide();
            }
            // Events
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
            this.onBeforeRenderObservable.clear();
            this.onAfterRenderObservable.clear();
            this.OnBeforeRenderTargetsRenderObservable.clear();
            this.OnAfterRenderTargetsRenderObservable.clear();
            this.onAfterStepObservable.clear();
            this.onBeforeStepObservable.clear();
            this.onBeforeActiveMeshesEvaluationObservable.clear();
            this.onAfterActiveMeshesEvaluationObservable.clear();
            this.onBeforeParticlesRenderingObservable.clear();
            this.onAfterParticlesRenderingObservable.clear();
            this.onBeforeSpritesRenderingObservable.clear();
            this.onAfterSpritesRenderingObservable.clear();
            this.onBeforeDrawPhaseObservable.clear();
            this.onAfterDrawPhaseObservable.clear();
            this.onBeforePhysicsObservable.clear();
            this.onAfterPhysicsObservable.clear();
            this.onBeforeAnimationsObservable.clear();
            this.onAfterAnimationsObservable.clear();
            this.onDataLoadedObservable.clear();
            this.detachControl();
            // Release sounds & sounds tracks
            if (LIB.AudioEngine) {
                this.disposeSounds();
            }
            // VR Helper
            if (this.VRHelper) {
                this.VRHelper.dispose();
            }
            // Detach cameras
            var canvas = this._engine.getRenderingCanvas();
            if (canvas) {
                var index;
                for (index = 0; index < this.cameras.length; index++) {
                    this.cameras[index].detachControl(canvas);
                }
            }
            // Release animation groups
            while (this.animationGroups.length) {
                this.animationGroups[0].dispose();
            }
            // Release lights
            while (this.lights.length) {
                this.lights[0].dispose();
            }
            // Release meshes
            while (this.meshes.length) {
                this.meshes[0].dispose(true);
            }
            while (this.transformNodes.length) {
                this.removeTransformNode(this.transformNodes[0]);
            }
            // Release cameras
            while (this.cameras.length) {
                this.cameras[0].dispose();
            }
            // Release materials
            if (this.defaultMaterial) {
                this.defaultMaterial.dispose();
            }
            while (this.multiMaterials.length) {
                this.multiMaterials[0].dispose();
            }
            while (this.materials.length) {
                this.materials[0].dispose();
            }
            // Release particles
            while (this.particleSystems.length) {
                this.particleSystems[0].dispose();
            }
            // Release sprites
            while (this.spriteManagers.length) {
                this.spriteManagers[0].dispose();
            }
            // Release postProcesses
            while (this.postProcesses.length) {
                this.postProcesses[0].dispose();
            }
            // Release layers
            while (this.layers.length) {
                this.layers[0].dispose();
            }
            while (this.highlightLayers.length) {
                this.highlightLayers[0].dispose();
            }
            // Release textures
            while (this.textures.length) {
                this.textures[0].dispose();
            }
            // Release UBO
            this._sceneUbo.dispose();
            if (this._alternateSceneUbo) {
                this._alternateSceneUbo.dispose();
            }
            // Post-processes
            this.postProcessManager.dispose();
            if (this._postProcessRenderPipelineManager) {
                this._postProcessRenderPipelineManager.dispose();
            }
            // Physics
            if (this._physicsEngine) {
                this.disablePhysicsEngine();
            }
            // Remove from engine
            index = this._engine.scenes.indexOf(this);
            if (index > -1) {
                this._engine.scenes.splice(index, 1);
            }
            this._engine.wipeCaches(true);
            this._isDisposed = true;
        };
        Object.defineProperty(Scene.prototype, "isDisposed", {
            get: function () {
                return this._isDisposed;
            },
            enumerable: true,
            configurable: true
        });
        // Release sounds & sounds tracks
        Scene.prototype.disposeSounds = function () {
            if (!this._mainSoundTrack) {
                return;
            }
            this.mainSoundTrack.dispose();
            for (var scIndex = 0; scIndex < this.soundTracks.length; scIndex++) {
                this.soundTracks[scIndex].dispose();
            }
        };
        // Octrees
        Scene.prototype.getWorldExtends = function () {
            var min = new LIB.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            var max = new LIB.Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            for (var index = 0; index < this.meshes.length; index++) {
                var mesh = this.meshes[index];
                if (!mesh.subMeshes || mesh.subMeshes.length === 0 || mesh.infiniteDistance) {
                    continue;
                }
                mesh.computeWorldMatrix(true);
                var boundingInfo = mesh.getBoundingInfo();
                var minBox = boundingInfo.boundingBox.minimumWorld;
                var maxBox = boundingInfo.boundingBox.maximumWorld;
                LIB.Tools.CheckExtends(minBox, min, max);
                LIB.Tools.CheckExtends(maxBox, min, max);
            }
            return {
                min: min,
                max: max
            };
        };
        Scene.prototype.createOrUpdateSelectionOctree = function (maxCapacity, maxDepth) {
            if (maxCapacity === void 0) { maxCapacity = 64; }
            if (maxDepth === void 0) { maxDepth = 2; }
            if (!this._selectionOctree) {
                this._selectionOctree = new LIB.Octree(LIB.Octree.CreationFuncForMeshes, maxCapacity, maxDepth);
            }
            var worldExtends = this.getWorldExtends();
            // Update octree
            this._selectionOctree.update(worldExtends.min, worldExtends.max, this.meshes);
            return this._selectionOctree;
        };
        // Picking
        Scene.prototype.createPickingRay = function (x, y, world, camera, cameraViewSpace) {
            if (cameraViewSpace === void 0) { cameraViewSpace = false; }
            var result = LIB.Ray.Zero();
            this.createPickingRayToRef(x, y, world, result, camera, cameraViewSpace);
            return result;
        };
        Scene.prototype.createPickingRayToRef = function (x, y, world, result, camera, cameraViewSpace) {
            if (cameraViewSpace === void 0) { cameraViewSpace = false; }
            var engine = this._engine;
            if (!camera) {
                if (!this.activeCamera)
                    throw new Error("Active camera not set");
                camera = this.activeCamera;
            }
            var cameraViewport = camera.viewport;
            var viewport = cameraViewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
            // Moving coordinates to local viewport world
            x = x / this._engine.getHardwareScalingLevel() - viewport.x;
            y = y / this._engine.getHardwareScalingLevel() - (this._engine.getRenderHeight() - viewport.y - viewport.height);
            result.update(x, y, viewport.width, viewport.height, world ? world : LIB.Matrix.Identity(), cameraViewSpace ? LIB.Matrix.Identity() : camera.getViewMatrix(), camera.getProjectionMatrix());
            return this;
        };
        Scene.prototype.createPickingRayInCameraSpace = function (x, y, camera) {
            var result = LIB.Ray.Zero();
            this.createPickingRayInCameraSpaceToRef(x, y, result, camera);
            return result;
        };
        Scene.prototype.createPickingRayInCameraSpaceToRef = function (x, y, result, camera) {
            if (!LIB.PickingInfo) {
                return this;
            }
            var engine = this._engine;
            if (!camera) {
                if (!this.activeCamera)
                    throw new Error("Active camera not set");
                camera = this.activeCamera;
            }
            var cameraViewport = camera.viewport;
            var viewport = cameraViewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
            var identity = LIB.Matrix.Identity();
            // Moving coordinates to local viewport world
            x = x / this._engine.getHardwareScalingLevel() - viewport.x;
            y = y / this._engine.getHardwareScalingLevel() - (this._engine.getRenderHeight() - viewport.y - viewport.height);
            result.update(x, y, viewport.width, viewport.height, identity, identity, camera.getProjectionMatrix());
            return this;
        };
        Scene.prototype._internalPick = function (rayFunction, predicate, fastCheck) {
            if (!LIB.PickingInfo) {
                return null;
            }
            var pickingInfo = null;
            for (var meshIndex = 0; meshIndex < this.meshes.length; meshIndex++) {
                var mesh = this.meshes[meshIndex];
                if (predicate) {
                    if (!predicate(mesh)) {
                        continue;
                    }
                }
                else if (!mesh.isEnabled() || !mesh.isVisible || !mesh.isPickable) {
                    continue;
                }
                var world = mesh.getWorldMatrix();
                var ray = rayFunction(world);
                var result = mesh.intersects(ray, fastCheck);
                if (!result || !result.hit)
                    continue;
                if (!fastCheck && pickingInfo != null && result.distance >= pickingInfo.distance)
                    continue;
                pickingInfo = result;
                if (fastCheck) {
                    break;
                }
            }
            return pickingInfo || new LIB.PickingInfo();
        };
        Scene.prototype._internalMultiPick = function (rayFunction, predicate) {
            if (!LIB.PickingInfo) {
                return null;
            }
            var pickingInfos = new Array();
            for (var meshIndex = 0; meshIndex < this.meshes.length; meshIndex++) {
                var mesh = this.meshes[meshIndex];
                if (predicate) {
                    if (!predicate(mesh)) {
                        continue;
                    }
                }
                else if (!mesh.isEnabled() || !mesh.isVisible || !mesh.isPickable) {
                    continue;
                }
                var world = mesh.getWorldMatrix();
                var ray = rayFunction(world);
                var result = mesh.intersects(ray, false);
                if (!result || !result.hit)
                    continue;
                pickingInfos.push(result);
            }
            return pickingInfos;
        };
        Scene.prototype._internalPickSprites = function (ray, predicate, fastCheck, camera) {
            if (!LIB.PickingInfo) {
                return null;
            }
            var pickingInfo = null;
            if (!camera) {
                if (!this.activeCamera) {
                    return null;
                }
                camera = this.activeCamera;
            }
            if (this.spriteManagers.length > 0) {
                for (var spriteIndex = 0; spriteIndex < this.spriteManagers.length; spriteIndex++) {
                    var spriteManager = this.spriteManagers[spriteIndex];
                    if (!spriteManager.isPickable) {
                        continue;
                    }
                    var result = spriteManager.intersects(ray, camera, predicate, fastCheck);
                    if (!result || !result.hit)
                        continue;
                    if (!fastCheck && pickingInfo != null && result.distance >= pickingInfo.distance)
                        continue;
                    pickingInfo = result;
                    if (fastCheck) {
                        break;
                    }
                }
            }
            return pickingInfo || new LIB.PickingInfo();
        };
        /** Launch a ray to try to pick a mesh in the scene
         * @param x position on screen
         * @param y position on screen
         * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
         * @param fastCheck Launch a fast check only using the bounding boxes. Can be set to null.
         * @param camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
         */
        Scene.prototype.pick = function (x, y, predicate, fastCheck, camera) {
            var _this = this;
            if (!LIB.PickingInfo) {
                return null;
            }
            return this._internalPick(function (world) {
                _this.createPickingRayToRef(x, y, world, _this._tempPickingRay, camera || null);
                return _this._tempPickingRay;
            }, predicate, fastCheck);
        };
        /** Launch a ray to try to pick a sprite in the scene
         * @param x position on screen
         * @param y position on screen
         * @param predicate Predicate function used to determine eligible sprites. Can be set to null. In this case, a sprite must have isPickable set to true
         * @param fastCheck Launch a fast check only using the bounding boxes. Can be set to null.
         * @param camera camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
         */
        Scene.prototype.pickSprite = function (x, y, predicate, fastCheck, camera) {
            this.createPickingRayInCameraSpaceToRef(x, y, this._tempPickingRay, camera);
            return this._internalPickSprites(this._tempPickingRay, predicate, fastCheck, camera);
        };
        /** Use the given ray to pick a mesh in the scene
         * @param ray The ray to use to pick meshes
         * @param predicate Predicate function used to determine eligible sprites. Can be set to null. In this case, a sprite must have isPickable set to true
         * @param fastCheck Launch a fast check only using the bounding boxes. Can be set to null.
         */
        Scene.prototype.pickWithRay = function (ray, predicate, fastCheck) {
            var _this = this;
            return this._internalPick(function (world) {
                if (!_this._pickWithRayInverseMatrix) {
                    _this._pickWithRayInverseMatrix = LIB.Matrix.Identity();
                }
                world.invertToRef(_this._pickWithRayInverseMatrix);
                if (!_this._cachedRayForTransform) {
                    _this._cachedRayForTransform = LIB.Ray.Zero();
                }
                LIB.Ray.TransformToRef(ray, _this._pickWithRayInverseMatrix, _this._cachedRayForTransform);
                return _this._cachedRayForTransform;
            }, predicate, fastCheck);
        };
        /**
         * Launch a ray to try to pick a mesh in the scene
         * @param x X position on screen
         * @param y Y position on screen
         * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
         * @param camera camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
         */
        Scene.prototype.multiPick = function (x, y, predicate, camera) {
            var _this = this;
            return this._internalMultiPick(function (world) { return _this.createPickingRay(x, y, world, camera || null); }, predicate);
        };
        /**
         * Launch a ray to try to pick a mesh in the scene
         * @param ray Ray to use
         * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
         */
        Scene.prototype.multiPickWithRay = function (ray, predicate) {
            var _this = this;
            return this._internalMultiPick(function (world) {
                if (!_this._pickWithRayInverseMatrix) {
                    _this._pickWithRayInverseMatrix = LIB.Matrix.Identity();
                }
                world.invertToRef(_this._pickWithRayInverseMatrix);
                if (!_this._cachedRayForTransform) {
                    _this._cachedRayForTransform = LIB.Ray.Zero();
                }
                LIB.Ray.TransformToRef(ray, _this._pickWithRayInverseMatrix, _this._cachedRayForTransform);
                return _this._cachedRayForTransform;
            }, predicate);
        };
        Scene.prototype.setPointerOverMesh = function (mesh) {
            if (this._pointerOverMesh === mesh) {
                return;
            }
            if (this._pointerOverMesh && this._pointerOverMesh.actionManager) {
                this._pointerOverMesh.actionManager.processTrigger(LIB.ActionManager.OnPointerOutTrigger, LIB.ActionEvent.CreateNew(this._pointerOverMesh));
            }
            this._pointerOverMesh = mesh;
            if (this._pointerOverMesh && this._pointerOverMesh.actionManager) {
                this._pointerOverMesh.actionManager.processTrigger(LIB.ActionManager.OnPointerOverTrigger, LIB.ActionEvent.CreateNew(this._pointerOverMesh));
            }
        };
        Scene.prototype.getPointerOverMesh = function () {
            return this._pointerOverMesh;
        };
        Scene.prototype.setPointerOverSprite = function (sprite) {
            if (this._pointerOverSprite === sprite) {
                return;
            }
            if (this._pointerOverSprite && this._pointerOverSprite.actionManager) {
                this._pointerOverSprite.actionManager.processTrigger(LIB.ActionManager.OnPointerOutTrigger, LIB.ActionEvent.CreateNewFromSprite(this._pointerOverSprite, this));
            }
            this._pointerOverSprite = sprite;
            if (this._pointerOverSprite && this._pointerOverSprite.actionManager) {
                this._pointerOverSprite.actionManager.processTrigger(LIB.ActionManager.OnPointerOverTrigger, LIB.ActionEvent.CreateNewFromSprite(this._pointerOverSprite, this));
            }
        };
        Scene.prototype.getPointerOverSprite = function () {
            return this._pointerOverSprite;
        };
        // Physics
        Scene.prototype.getPhysicsEngine = function () {
            return this._physicsEngine;
        };
        /**
         * Enables physics to the current scene
         * @param {LIB.Vector3} [gravity] - the scene's gravity for the physics engine
         * @param {LIB.IPhysicsEnginePlugin} [plugin] - The physics engine to be used. defaults to OimoJS.
         * @return {boolean} was the physics engine initialized
         */
        Scene.prototype.enablePhysics = function (gravity, plugin) {
            if (gravity === void 0) { gravity = null; }
            if (this._physicsEngine) {
                return true;
            }
            try {
                this._physicsEngine = new LIB.PhysicsEngine(gravity, plugin);
                return true;
            }
            catch (e) {
                LIB.Tools.Error(e.message);
                return false;
            }
        };
        Scene.prototype.disablePhysicsEngine = function () {
            if (!this._physicsEngine) {
                return;
            }
            this._physicsEngine.dispose();
            this._physicsEngine = null;
        };
        Scene.prototype.isPhysicsEnabled = function () {
            return this._physicsEngine !== undefined;
        };
        Scene.prototype.deleteCompoundImpostor = function (compound) {
            var mesh = compound.parts[0].mesh;
            if (mesh.physicsImpostor) {
                mesh.physicsImpostor.dispose();
                mesh.physicsImpostor = null;
            }
        };
        // Misc.
        Scene.prototype._rebuildGeometries = function () {
            for (var _i = 0, _a = this._geometries; _i < _a.length; _i++) {
                var geometry = _a[_i];
                geometry._rebuild();
            }
            for (var _b = 0, _c = this.meshes; _b < _c.length; _b++) {
                var mesh = _c[_b];
                mesh._rebuild();
            }
            if (this.postProcessManager) {
                this.postProcessManager._rebuild();
            }
            for (var _d = 0, _e = this.layers; _d < _e.length; _d++) {
                var layer = _e[_d];
                layer._rebuild();
            }
            for (var _f = 0, _g = this.highlightLayers; _f < _g.length; _f++) {
                var highlightLayer = _g[_f];
                highlightLayer._rebuild();
            }
            if (this._boundingBoxRenderer) {
                this._boundingBoxRenderer._rebuild();
            }
            for (var _h = 0, _j = this.particleSystems; _h < _j.length; _h++) {
                var system = _j[_h];
                system.rebuild();
            }
            if (this._postProcessRenderPipelineManager) {
                this._postProcessRenderPipelineManager._rebuild();
            }
        };
        Scene.prototype._rebuildTextures = function () {
            for (var _i = 0, _a = this.textures; _i < _a.length; _i++) {
                var texture = _a[_i];
                texture._rebuild();
            }
            this.markAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
        };
        Scene.prototype.createDefaultCameraOrLight = function (createArcRotateCamera, replace, attachCameraControls) {
            if (createArcRotateCamera === void 0) { createArcRotateCamera = false; }
            if (replace === void 0) { replace = false; }
            if (attachCameraControls === void 0) { attachCameraControls = false; }
            // Dispose existing camera or light in replace mode.
            if (replace) {
                if (this.activeCamera) {
                    this.activeCamera.dispose();
                    this.activeCamera = null;
                }
                if (this.lights) {
                    for (var i = 0; i < this.lights.length; i++) {
                        this.lights[i].dispose();
                    }
                }
            }
            // Light
            if (this.lights.length === 0) {
                new LIB.HemisphericLight("default light", LIB.Vector3.Up(), this);
            }
            // Camera
            if (!this.activeCamera) {
                var worldExtends = this.getWorldExtends();
                var worldSize = worldExtends.max.subtract(worldExtends.min);
                var worldCenter = worldExtends.min.add(worldSize.scale(0.5));
                var camera;
                var radius = worldSize.length() * 1.5;
                if (createArcRotateCamera) {
                    var arcRotateCamera = new LIB.ArcRotateCamera("default camera", -(Math.PI / 2), Math.PI / 2, radius, worldCenter, this);
                    arcRotateCamera.lowerRadiusLimit = radius * 0.01;
                    arcRotateCamera.wheelPrecision = 100 / radius;
                    camera = arcRotateCamera;
                }
                else {
                    var freeCamera = new LIB.FreeCamera("default camera", new LIB.Vector3(worldCenter.x, worldCenter.y, -radius), this);
                    freeCamera.setTarget(worldCenter);
                    camera = freeCamera;
                }
                camera.minZ = radius * 0.01;
                camera.maxZ = radius * 1000;
                camera.speed = radius * 0.2;
                this.activeCamera = camera;
                var canvas = this.getEngine().getRenderingCanvas();
                if (attachCameraControls && canvas) {
                    camera.attachControl(canvas);
                }
            }
        };
        Scene.prototype.createDefaultSkybox = function (environmentTexture, pbr, scale, blur) {
            if (pbr === void 0) { pbr = false; }
            if (scale === void 0) { scale = 1000; }
            if (blur === void 0) { blur = 0; }
            if (environmentTexture) {
                this.environmentTexture = environmentTexture;
            }
            if (!this.environmentTexture) {
                LIB.Tools.Warn("Can not create default skybox without environment texture.");
                return null;
            }
            // Skybox
            var hdrSkybox = LIB.Mesh.CreateBox("hdrSkyBox", scale, this);
            if (pbr) {
                var hdrSkyboxMaterial = new LIB.PBRMaterial("skyBox", this);
                hdrSkyboxMaterial.backFaceCulling = false;
                hdrSkyboxMaterial.reflectionTexture = this.environmentTexture.clone();
                if (hdrSkyboxMaterial.reflectionTexture) {
                    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = LIB.Texture.SKYBOX_MODE;
                }
                hdrSkyboxMaterial.microSurface = 1.0 - blur;
                hdrSkyboxMaterial.disableLighting = true;
                hdrSkyboxMaterial.twoSidedLighting = true;
                hdrSkybox.infiniteDistance = true;
                hdrSkybox.material = hdrSkyboxMaterial;
            }
            else {
                var skyboxMaterial = new LIB.StandardMaterial("skyBox", this);
                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.reflectionTexture = this.environmentTexture.clone();
                if (skyboxMaterial.reflectionTexture) {
                    skyboxMaterial.reflectionTexture.coordinatesMode = LIB.Texture.SKYBOX_MODE;
                }
                skyboxMaterial.disableLighting = true;
                hdrSkybox.infiniteDistance = true;
                hdrSkybox.material = skyboxMaterial;
            }
            return hdrSkybox;
        };
        Scene.prototype.createDefaultEnvironment = function (options) {
            if (LIB.EnvironmentHelper) {
                return new LIB.EnvironmentHelper(options, this);
            }
            return null;
        };
        Scene.prototype.createDefaultVRExperience = function (webVROptions) {
            if (webVROptions === void 0) { webVROptions = {}; }
            return new LIB.VRExperienceHelper(this, webVROptions);
        };
        // Tags
        Scene.prototype._getByTags = function (list, tagsQuery, forEach) {
            if (tagsQuery === undefined) {
                // returns the complete list (could be done with LIB.Tags.MatchesQuery but no need to have a for-loop here)
                return list;
            }
            var listByTags = [];
            forEach = forEach || (function (item) { return; });
            for (var i in list) {
                var item = list[i];
                if (LIB.Tags && LIB.Tags.MatchesQuery(item, tagsQuery)) {
                    listByTags.push(item);
                    forEach(item);
                }
            }
            return listByTags;
        };
        Scene.prototype.getMeshesByTags = function (tagsQuery, forEach) {
            return this._getByTags(this.meshes, tagsQuery, forEach);
        };
        Scene.prototype.getCamerasByTags = function (tagsQuery, forEach) {
            return this._getByTags(this.cameras, tagsQuery, forEach);
        };
        Scene.prototype.getLightsByTags = function (tagsQuery, forEach) {
            return this._getByTags(this.lights, tagsQuery, forEach);
        };
        Scene.prototype.getMaterialByTags = function (tagsQuery, forEach) {
            return this._getByTags(this.materials, tagsQuery, forEach).concat(this._getByTags(this.multiMaterials, tagsQuery, forEach));
        };
        /**
         * Overrides the default sort function applied in the renderging group to prepare the meshes.
         * This allowed control for front to back rendering or reversly depending of the special needs.
         *
         * @param renderingGroupId The rendering group id corresponding to its index
         * @param opaqueSortCompareFn The opaque queue comparison function use to sort.
         * @param alphaTestSortCompareFn The alpha test queue comparison function use to sort.
         * @param transparentSortCompareFn The transparent queue comparison function use to sort.
         */
        Scene.prototype.setRenderingOrder = function (renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn) {
            if (opaqueSortCompareFn === void 0) { opaqueSortCompareFn = null; }
            if (alphaTestSortCompareFn === void 0) { alphaTestSortCompareFn = null; }
            if (transparentSortCompareFn === void 0) { transparentSortCompareFn = null; }
            this._renderingManager.setRenderingOrder(renderingGroupId, opaqueSortCompareFn, alphaTestSortCompareFn, transparentSortCompareFn);
        };
        /**
         * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups.
         *
         * @param renderingGroupId The rendering group id corresponding to its index
         * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
         * @param depth Automatically clears depth between groups if true and autoClear is true.
         * @param stencil Automatically clears stencil between groups if true and autoClear is true.
         */
        Scene.prototype.setRenderingAutoClearDepthStencil = function (renderingGroupId, autoClearDepthStencil, depth, stencil) {
            if (depth === void 0) { depth = true; }
            if (stencil === void 0) { stencil = true; }
            this._renderingManager.setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil, depth, stencil);
        };
        /**
         * Will flag all materials as dirty to trigger new shader compilation
         * @param predicate If not null, it will be used to specifiy if a material has to be marked as dirty
         */
        Scene.prototype.markAllMaterialsAsDirty = function (flag, predicate) {
            for (var _i = 0, _a = this.materials; _i < _a.length; _i++) {
                var material = _a[_i];
                if (predicate && !predicate(material)) {
                    continue;
                }
                material.markAsDirty(flag);
            }
        };
        Scene.prototype._loadFile = function (url, onSuccess, onProgress, useDatabase, useArrayBuffer, onError) {
            var _this = this;
            var request = LIB.Tools.LoadFile(url, onSuccess, onProgress, useDatabase ? this.database : undefined, useArrayBuffer, onError);
            this._activeRequests.push(request);
            request.onCompleteObservable.add(function (request) {
                _this._activeRequests.splice(_this._activeRequests.indexOf(request), 1);
            });
            return request;
        };
        // Statics
        Scene._FOGMODE_NONE = 0;
        Scene._FOGMODE_EXP = 1;
        Scene._FOGMODE_EXP2 = 2;
        Scene._FOGMODE_LINEAR = 3;
        Scene._uniqueIdCounter = 0;
        Scene.MinDeltaTime = 1.0;
        Scene.MaxDeltaTime = 1000.0;
        /** The distance in pixel that you have to move to prevent some events */
        Scene.DragMovementThreshold = 10; // in pixels
        /** Time in milliseconds to wait to raise long press events if button is still pressed */
        Scene.LongPressDelay = 500; // in milliseconds
        /** Time in milliseconds with two consecutive clicks will be considered as a double click */
        Scene.DoubleClickDelay = 300; // in milliseconds
        /** If you need to check double click without raising a single click at first click, enable this flag */
        Scene.ExclusiveDoubleClickMode = false;
        return Scene;
    }());
    LIB.Scene = Scene;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.scene.js.map
