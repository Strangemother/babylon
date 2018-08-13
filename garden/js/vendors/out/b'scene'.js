
var LIB;
(function (LIB) {
    /** @hidden */
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
     * @see http://doc.LIBjs.com/features/scene
     */
    var Scene = /** @class */ (function () {
        /**
         * Creates a new Scene
         * @param engine defines the engine to use to render this scene
         */
        function Scene(engine) {
            // Members
            /**
             * Gets or sets a boolean that indicates if the scene must clear the render buffer before rendering a frame
             */
            this.autoClear = true;
            /**
             * Gets or sets a boolean that indicates if the scene must clear the depth and stencil buffers before rendering a frame
             */
            this.autoClearDepthAndStencil = true;
            /**
             * Defines the color used to clear the render buffer (Default is (0.2, 0.2, 0.3, 1.0))
             */
            this.clearColor = new LIB.Color4(0.2, 0.2, 0.3, 1.0);
            /**
             * Defines the color used to simulate the ambient color (Default is (0, 0, 0))
             */
            this.ambientColor = new LIB.Color3(0, 0, 0);
            this._forceWireframe = false;
            this._forcePointsCloud = false;
            /**
             * Gets or sets a boolean indicating if all bounding boxes must be rendered
             */
            this.forceShowBoundingBoxes = false;
            /**
             * Gets or sets a boolean indicating if animations are enabled
             */
            this.animationsEnabled = true;
            this._animationPropertiesOverride = null;
            /**
             * Gets or sets a boolean indicating if a constant deltatime has to be used
             * This is mostly useful for testing purposes when you do not want the animations to scale with the framerate
             */
            this.useConstantAnimationDeltaTime = false;
            /**
             * Gets or sets a boolean indicating if the scene must keep the meshUnderPointer property updated
             * Please note that it requires to run a ray cast through the scene on every frame
             */
            this.constantlyUpdateMeshUnderPointer = false;
            /**
             * Defines the HTML cursor to use when hovering over interactive elements
             */
            this.hoverCursor = "pointer";
            /**
             * Defines the HTML default cursor to use (empty by default)
             */
            this.defaultCursor = "";
            /**
             * This is used to call preventDefault() on pointer down
             * in order to block unwanted artifacts like system double clicks
             */
            this.preventDefaultOnPointerDown = true;
            // Metadata
            /**
             * Gets or sets user defined metadata
             */
            this.metadata = null;
            /**
             * Use this array to add regular expressions used to disable offline support for specific urls
             */
            this.disableOfflineSupportExceptionRules = new Array();
            /**
            * An event triggered when the scene is disposed.
            */
            this.onDisposeObservable = new LIB.Observable();
            this._onDisposeObserver = null;
            /**
            * An event triggered before rendering the scene (right after animations and physics)
            */
            this.onBeforeRenderObservable = new LIB.Observable();
            this._onBeforeRenderObserver = null;
            /**
            * An event triggered after rendering the scene
            */
            this.onAfterRenderObservable = new LIB.Observable();
            this._onAfterRenderObserver = null;
            /**
            * An event triggered before animating the scene
            */
            this.onBeforeAnimationsObservable = new LIB.Observable();
            /**
            * An event triggered after animations processing
            */
            this.onAfterAnimationsObservable = new LIB.Observable();
            /**
            * An event triggered before draw calls are ready to be sent
            */
            this.onBeforeDrawPhaseObservable = new LIB.Observable();
            /**
            * An event triggered after draw calls have been sent
            */
            this.onAfterDrawPhaseObservable = new LIB.Observable();
            /**
            * An event triggered when physic simulation is about to be run
            */
            this.onBeforePhysicsObservable = new LIB.Observable();
            /**
            * An event triggered when physic simulation has been done
            */
            this.onAfterPhysicsObservable = new LIB.Observable();
            /**
            * An event triggered when the scene is ready
            */
            this.onReadyObservable = new LIB.Observable();
            /**
            * An event triggered before rendering a camera
            */
            this.onBeforeCameraRenderObservable = new LIB.Observable();
            this._onBeforeCameraRenderObserver = null;
            /**
            * An event triggered after rendering a camera
            */
            this.onAfterCameraRenderObservable = new LIB.Observable();
            this._onAfterCameraRenderObserver = null;
            /**
            * An event triggered when active meshes evaluation is about to start
            */
            this.onBeforeActiveMeshesEvaluationObservable = new LIB.Observable();
            /**
            * An event triggered when active meshes evaluation is done
            */
            this.onAfterActiveMeshesEvaluationObservable = new LIB.Observable();
            /**
            * An event triggered when particles rendering is about to start
            * Note: This event can be trigger more than once per frame (because particles can be rendered by render target textures as well)
            */
            this.onBeforeParticlesRenderingObservable = new LIB.Observable();
            /**
            * An event triggered when particles rendering is done
            * Note: This event can be trigger more than once per frame (because particles can be rendered by render target textures as well)
            */
            this.onAfterParticlesRenderingObservable = new LIB.Observable();
            /**
            * An event triggered when sprites rendering is about to start
            * Note: This event can be trigger more than once per frame (because sprites can be rendered by render target textures as well)
            */
            this.onBeforeSpritesRenderingObservable = new LIB.Observable();
            /**
            * An event triggered when sprites rendering is done
            * Note: This event can be trigger more than once per frame (because sprites can be rendered by render target textures as well)
            */
            this.onAfterSpritesRenderingObservable = new LIB.Observable();
            /**
            * An event triggered when SceneLoader.Append or SceneLoader.Load or SceneLoader.ImportMesh were successfully executed
            */
            this.onDataLoadedObservable = new LIB.Observable();
            /**
            * An event triggered when a camera is created
            */
            this.onNewCameraAddedObservable = new LIB.Observable();
            /**
            * An event triggered when a camera is removed
            */
            this.onCameraRemovedObservable = new LIB.Observable();
            /**
            * An event triggered when a light is created
            */
            this.onNewLightAddedObservable = new LIB.Observable();
            /**
            * An event triggered when a light is removed
            */
            this.onLightRemovedObservable = new LIB.Observable();
            /**
            * An event triggered when a geometry is created
            */
            this.onNewGeometryAddedObservable = new LIB.Observable();
            /**
            * An event triggered when a geometry is removed
            */
            this.onGeometryRemovedObservable = new LIB.Observable();
            /**
            * An event triggered when a transform node is created
            */
            this.onNewTransformNodeAddedObservable = new LIB.Observable();
            /**
            * An event triggered when a transform node is removed
            */
            this.onTransformNodeRemovedObservable = new LIB.Observable();
            /**
            * An event triggered when a mesh is created
            */
            this.onNewMeshAddedObservable = new LIB.Observable();
            /**
            * An event triggered when a mesh is removed
            */
            this.onMeshRemovedObservable = new LIB.Observable();
            /**
            * An event triggered when render targets are about to be rendered
            * Can happen multiple times per frame.
            */
            this.onBeforeRenderTargetsRenderObservable = new LIB.Observable();
            /**
            * An event triggered when render targets were rendered.
            * Can happen multiple times per frame.
            */
            this.onAfterRenderTargetsRenderObservable = new LIB.Observable();
            /**
            * An event triggered before calculating deterministic simulation step
            */
            this.onBeforeStepObservable = new LIB.Observable();
            /**
            * An event triggered after calculating deterministic simulation step
            */
            this.onAfterStepObservable = new LIB.Observable();
            /**
             * This Observable will be triggered for each stage of each renderingGroup of each rendered camera.
             * The RenderinGroupInfo class contains all the information about the context in which the observable is called
             * If you wish to register an Observer only for a given set of renderingGroup, use the mask with a combination of the renderingGroup index elevated to the power of two (1 for renderingGroup 0, 2 for renderingrOup1, 4 for 2 and 8 for 3)
             */
            this.onRenderingGroupObservable = new LIB.Observable();
            // Animations
            /**
             * Gets a list of Animations associated with the scene
             */
            this.animations = [];
            this._registeredForLateAnimationBindings = new LIB.SmartArrayNoDuplicate(256);
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
            this._pointerCaptures = {};
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
            // Coordinates system
            this._useRightHandedSystem = false;
            // Fog
            this._fogEnabled = true;
            this._fogMode = Scene.FOGMODE_NONE;
            /**
            * Gets or sets the fog color to use
            * @see http://doc.LIBjs.com/LIB101/environment#fog
            */
            this.fogColor = new LIB.Color3(0.2, 0.2, 0.3);
            /**
            * Gets or sets the fog density to use
            * @see http://doc.LIBjs.com/LIB101/environment#fog
            */
            this.fogDensity = 0.1;
            /**
            * Gets or sets the fog start distance to use
            * @see http://doc.LIBjs.com/LIB101/environment#fog
            */
            this.fogStart = 0;
            /**
            * Gets or sets the fog end distance to use
            * @see http://doc.LIBjs.com/LIB101/environment#fog
            */
            this.fogEnd = 1000.0;
            // Lights
            this._shadowsEnabled = true;
            this._lightsEnabled = true;
            /**
            * All of the lights added to this scene
            * @see http://doc.LIBjs.com/LIB101/lights
            */
            this.lights = new Array();
            // Cameras
            /** All of the cameras added to this scene.
             * @see http://doc.LIBjs.com/LIB101/cameras
             */
            this.cameras = new Array();
            /** All of the active cameras added to this scene. */
            this.activeCameras = new Array();
            // Meshes
            /**
            * All of the tranform nodes added to this scene
            * @see http://doc.LIBjs.com/how_to/transformnode
            */
            this.transformNodes = new Array();
            /**
            * All of the (abstract) meshes added to this scene
            */
            this.meshes = new Array();
            /**
            * All of the animation groups added to this scene
            * @see http://doc.LIBjs.com/how_to/group
            */
            this.animationGroups = new Array();
            // Geometries
            this._geometries = new Array();
            /**
            * All of the materials added to this scene
            * @see http://doc.LIBjs.com/LIB101/materials
            */
            this.materials = new Array();
            /**
            * All of the multi-materials added to this scene
            * @see http://doc.LIBjs.com/how_to/multi_materials
            */
            this.multiMaterials = new Array();
            // Textures
            this._texturesEnabled = true;
            /**
            * All of the textures added to this scene
            */
            this.textures = new Array();
            // Particles
            /**
            * Gets or sets a boolean indicating if particles are enabled on this scene
            */
            this.particlesEnabled = true;
            /**
            * All of the particle systems added to this scene
            * @see http://doc.LIBjs.com/LIB101/particles
            */
            this.particleSystems = new Array();
            // Sprites
            /**
            * Gets or sets a boolean indicating if sprites are enabled on this scene
            */
            this.spritesEnabled = true;
            /**
            * All of the sprite managers added to this scene
            * @see http://doc.LIBjs.com/LIB101/sprites
            */
            this.spriteManagers = new Array();
            /**
             * The list of layers (background and foreground) of the scene
             */
            this.layers = new Array();
            /**
             * The list of effect layers (highlights/glow) added to the scene
             * @see http://doc.LIBjs.com/how_to/highlight_layer
             * @see http://doc.LIBjs.com/how_to/glow_layer
             */
            this.effectLayers = new Array();
            // Skeletons
            this._skeletonsEnabled = true;
            /**
             * The list of skeletons added to the scene
             * @see http://doc.LIBjs.com/how_to/how_to_use_bones_and_skeletons
             */
            this.skeletons = new Array();
            // Morph targets
            /**
             * The list of morph target managers added to the scene
             * @see http://doc.LIBjs.com/how_to/how_to_dynamically_morph_a_mesh
             */
            this.morphTargetManagers = new Array();
            // Lens flares
            /**
            * Gets or sets a boolean indicating if lens flares are enabled on this scene
            */
            this.lensFlaresEnabled = true;
            /**
             * The list of lens flare system added to the scene
             * @see http://doc.LIBjs.com/how_to/how_to_use_lens_flares
             */
            this.lensFlareSystems = new Array();
            // Collisions
            /**
            * Gets or sets a boolean indicating if collisions are enabled on this scene
            * @see http://doc.LIBjs.com/LIB101/cameras,_mesh_collisions_and_gravity
            */
            this.collisionsEnabled = true;
            /**
             * Defines the gravity applied to this scene (used only for collisions)
             * @see http://doc.LIBjs.com/LIB101/cameras,_mesh_collisions_and_gravity
             */
            this.gravity = new LIB.Vector3(0, -9.807, 0);
            // Postprocesses
            /**
            * Gets or sets a boolean indicating if postprocesses are enabled on this scene
            */
            this.postProcessesEnabled = true;
            /**
             * The list of postprocesses added to the scene
             */
            this.postProcesses = new Array();
            // Customs render targets
            /**
            * Gets or sets a boolean indicating if render targets are enabled on this scene
            */
            this.renderTargetsEnabled = true;
            /**
            * Gets or sets a boolean indicating if next render targets must be dumped as image for debugging purposes
            * We recommend not using it and instead rely on Spector.js: http://spector.LIBjs.com
            */
            this.dumpNextRenderTargets = false;
            /**
             * The list of user defined render targets added to the scene
             */
            this.customRenderTargets = new Array();
            /**
             * Gets the list of meshes imported to the scene through SceneLoader
             */
            this.importedMeshesFiles = new Array();
            // Probes
            /**
            * Gets or sets a boolean indicating if probes are enabled on this scene
            */
            this.probesEnabled = true;
            /**
             * The list of reflection probes added to the scene
             * @see http://doc.LIBjs.com/how_to/how_to_use_reflection_probes
             */
            this.reflectionProbes = new Array();
            /** @hidden */
            this._actionManagers = new Array();
            this._meshesForIntersections = new LIB.SmartArrayNoDuplicate(256);
            // Procedural textures
            /**
            * Gets or sets a boolean indicating if procedural textures are enabled on this scene
            */
            this.proceduralTexturesEnabled = true;
            /**
             * The list of procedural textures added to the scene
             * @see http://doc.LIBjs.com/how_to/how_to_use_procedural_textures
             */
            this.proceduralTextures = new Array();
            /**
             * The list of sound tracks added to the scene
             * @see http://doc.LIBjs.com/how_to/playing_sounds_and_music
             */
            this.soundTracks = new Array();
            this._audioEnabled = true;
            this._headphone = false;
            // Performance counters
            this._totalVertices = new LIB.PerfCounter();
            /** @hidden */
            this._activeIndices = new LIB.PerfCounter();
            /** @hidden */
            this._activeParticles = new LIB.PerfCounter();
            /** @hidden */
            this._activeBones = new LIB.PerfCounter();
            this._animationTime = 0;
            /**
             * Gets or sets a general scale for animation speed
             * @see https://www.LIBjs-playground.com/#IBU2W7#3
             */
            this.animationTimeScale = 1;
            this._renderId = 0;
            this._executeWhenReadyTimeoutId = -1;
            this._intermediateRendering = false;
            this._viewUpdateFlag = -1;
            this._projectionUpdateFlag = -1;
            this._alternateViewUpdateFlag = -1;
            this._alternateProjectionUpdateFlag = -1;
            /** @hidden */
            this._toBeDisposed = new LIB.SmartArray(256);
            this._activeRequests = new Array();
            this._pendingData = new Array();
            this._isDisposed = false;
            /**
             * Gets or sets a boolean indicating that all submeshes of active meshes must be rendered
             * Use this boolean to avoid computing frustum clipping on submeshes (This could help when you are CPU bound)
             */
            this.dispatchAllSubMeshesOfActiveMeshes = false;
            this._activeMeshes = new LIB.SmartArray(256);
            this._processedMaterials = new LIB.SmartArray(256);
            this._renderTargets = new LIB.SmartArrayNoDuplicate(256);
            /** @hidden */
            this._activeParticleSystems = new LIB.SmartArray(256);
            this._activeSkeletons = new LIB.SmartArrayNoDuplicate(32);
            this._softwareSkinnedMeshes = new LIB.SmartArrayNoDuplicate(32);
            /** @hidden */
            this._activeAnimatables = new Array();
            this._transformMatrix = LIB.Matrix.Zero();
            this._useAlternateCameraConfiguration = false;
            this._alternateRendering = false;
            /**
             * Gets or sets a boolean indicating if lights must be sorted by priority (off by default)
             * This is useful if there are more lights that the maximum simulteanous authorized
             */
            this.requireLightSorting = false;
            this._depthRenderer = {};
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
        Object.defineProperty(Scene.prototype, "forceWireframe", {
            get: function () {
                return this._forceWireframe;
            },
            /**
             * Gets or sets a boolean indicating if all rendering must be done in wireframe
             */
            set: function (value) {
                if (this._forceWireframe === value) {
                    return;
                }
                this._forceWireframe = value;
                this.markAllMaterialsAsDirty(LIB.Material.MiscDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "forcePointsCloud", {
            get: function () {
                return this._forcePointsCloud;
            },
            /**
             * Gets or sets a boolean indicating if all rendering must be done in point cloud
             */
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
        Object.defineProperty(Scene.prototype, "animationPropertiesOverride", {
            /**
             * Gets or sets the animation properties override
             */
            get: function () {
                return this._animationPropertiesOverride;
            },
            set: function (value) {
                this._animationPropertiesOverride = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "onDispose", {
            /** Sets a function to be executed when this scene is disposed. */
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
            /** Sets a function to be executed before rendering this scene */
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
            /** Sets a function to be executed after rendering this scene */
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
            /** Sets a function to be executed before rendering a camera*/
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
            /** Sets a function to be executed after rendering a camera*/
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
            /**
             * Gets the gamepad manager associated with the scene
             * @see http://doc.LIBjs.com/how_to/how_to_use_gamepads
             */
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
            /**
             * Gets the pointer coordinates without any translation (ie. straight out of the pointer event)
             */
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
            /**
            * Gets or sets a boolean indicating if the scene must use right-handed coordinates system
            */
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
        /**
         * Sets the step Id used by deterministic lock step
         * @see http://doc.LIBjs.com/LIB101/animations#deterministic-lockstep
         * @param newStepId defines the step Id
         */
        Scene.prototype.setStepId = function (newStepId) {
            this._currentStepId = newStepId;
        };
        ;
        /**
         * Gets the step Id used by deterministic lock step
         * @see http://doc.LIBjs.com/LIB101/animations#deterministic-lockstep
         * @returns the step Id
         */
        Scene.prototype.getStepId = function () {
            return this._currentStepId;
        };
        ;
        /**
         * Gets the internal step used by deterministic lock step
         * @see http://doc.LIBjs.com/LIB101/animations#deterministic-lockstep
         * @returns the internal step
         */
        Scene.prototype.getInternalStep = function () {
            return this._currentInternalStep;
        };
        ;
        Object.defineProperty(Scene.prototype, "fogEnabled", {
            get: function () {
                return this._fogEnabled;
            },
            /**
            * Gets or sets a boolean indicating if fog is enabled on this scene
            * @see http://doc.LIBjs.com/LIB101/environment#fog
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
            /**
            * Gets or sets the fog mode to use
            * @see http://doc.LIBjs.com/LIB101/environment#fog
            */
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
            /**
            * Gets or sets a boolean indicating if shadows are enabled on this scene
            */
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
            /**
            * Gets or sets a boolean indicating if lights are enabled on this scene
            */
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
            /**
            * Gets or sets a boolean indicating if textures are enabled on this scene
            */
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
            /**
            * Gets or sets a boolean indicating if skeletons are enabled on this scene
            */
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
            /**
             * Gets the postprocess render pipeline manager
             * @see http://doc.LIBjs.com/how_to/how_to_use_postprocessrenderpipeline
             * @see http://doc.LIBjs.com/how_to/using_default_rendering_pipeline
             */
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
            /**
             * Gets the main soundtrack associated with the scene
             */
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
            /** @hidden */
            get: function () {
                return this._alternateRendering;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "frustumPlanes", {
            /**
             * Gets the list of frustum planes (built from the active camera)
             */
            get: function () {
                return this._frustumPlanes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "geometryBufferRenderer", {
            /**
             * Gets the current geometry buffer associated to the scene.
             */
            get: function () {
                return this._geometryBufferRenderer;
            },
            /**
             * Sets the current geometry buffer for the scene.
             */
            set: function (geometryBufferRenderer) {
                if (geometryBufferRenderer && geometryBufferRenderer.isSupported) {
                    this._geometryBufferRenderer = geometryBufferRenderer;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "debugLayer", {
            /**
             * Gets the debug layer associated with the scene
             * @see http://doc.LIBjs.com/features/playground_debuglayer
             */
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
            /**
             * Gets a boolean indicating if collisions are processed on a web worker
             * @see http://doc.LIBjs.com/LIB101/cameras,_mesh_collisions_and_gravity#web-worker-based-collision-system-since-21
             */
            get: function () {
                return this._workerCollisions;
            },
            set: function (enabled) {
                if (!LIB.CollisionCoordinatorLegacy) {
                    return;
                }
                enabled = (enabled && !!Worker && !!LIB.CollisionWorker);
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
            /**
             * Gets the octree used to boost mesh selection (picking)
             * @see http://doc.LIBjs.com/how_to/optimizing_your_scene_with_octrees
             */
            get: function () {
                return this._selectionOctree;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "meshUnderPointer", {
            /**
             * Gets the mesh that is currently under the pointer
             */
            get: function () {
                return this._pointerOverMesh;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "pointerX", {
            /**
             * Gets the current on-screen X position of the pointer
             */
            get: function () {
                return this._pointerX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "pointerY", {
            /**
             * Gets the current on-screen Y position of the pointer
             */
            get: function () {
                return this._pointerY;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the cached material (ie. the latest rendered one)
         * @returns the cached material
         */
        Scene.prototype.getCachedMaterial = function () {
            return this._cachedMaterial;
        };
        /**
         * Gets the cached effect (ie. the latest rendered one)
         * @returns the cached effect
         */
        Scene.prototype.getCachedEffect = function () {
            return this._cachedEffect;
        };
        /**
         * Gets the cached visibility state (ie. the latest rendered one)
         * @returns the cached visibility state
         */
        Scene.prototype.getCachedVisibility = function () {
            return this._cachedVisibility;
        };
        /**
         * Gets a boolean indicating if the current material / effect / visibility must be bind again
         * @param material defines the current material
         * @param effect defines the current effect
         * @param visibility defines the current visibility state
         * @returns true if one parameter is not cached
         */
        Scene.prototype.isCachedMaterialInvalid = function (material, effect, visibility) {
            if (visibility === void 0) { visibility = 1; }
            return this._cachedEffect !== effect || this._cachedMaterial !== material || this._cachedVisibility !== visibility;
        };
        /**
         * Gets the bounding box renderer associated with the scene
         * @returns a BoundingBoxRenderer
         */
        Scene.prototype.getBoundingBoxRenderer = function () {
            if (!this._boundingBoxRenderer) {
                this._boundingBoxRenderer = new LIB.BoundingBoxRenderer(this);
            }
            return this._boundingBoxRenderer;
        };
        /**
         * Gets the outline renderer associated with the scene
         * @returns a OutlineRenderer
         */
        Scene.prototype.getOutlineRenderer = function () {
            return this._outlineRenderer;
        };
        /**
         * Gets the engine associated with the scene
         * @returns an Engine
         */
        Scene.prototype.getEngine = function () {
            return this._engine;
        };
        /**
         * Gets the total number of vertices rendered per frame
         * @returns the total number of vertices rendered per frame
         */
        Scene.prototype.getTotalVertices = function () {
            return this._totalVertices.current;
        };
        Object.defineProperty(Scene.prototype, "totalVerticesPerfCounter", {
            /**
             * Gets the performance counter for total vertices
             * @see http://doc.LIBjs.com/how_to/optimizing_your_scene#instrumentation
             */
            get: function () {
                return this._totalVertices;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the total number of active indices rendered per frame (You can deduce the number of rendered triangles by dividing this number by 3)
         * @returns the total number of active indices rendered per frame
         */
        Scene.prototype.getActiveIndices = function () {
            return this._activeIndices.current;
        };
        Object.defineProperty(Scene.prototype, "totalActiveIndicesPerfCounter", {
            /**
             * Gets the performance counter for active indices
             * @see http://doc.LIBjs.com/how_to/optimizing_your_scene#instrumentation
             */
            get: function () {
                return this._activeIndices;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the total number of active particles rendered per frame
         * @returns the total number of active particles rendered per frame
         */
        Scene.prototype.getActiveParticles = function () {
            return this._activeParticles.current;
        };
        Object.defineProperty(Scene.prototype, "activeParticlesPerfCounter", {
            /**
             * Gets the performance counter for active particles
             * @see http://doc.LIBjs.com/how_to/optimizing_your_scene#instrumentation
             */
            get: function () {
                return this._activeParticles;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the total number of active bones rendered per frame
         * @returns the total number of active bones rendered per frame
         */
        Scene.prototype.getActiveBones = function () {
            return this._activeBones.current;
        };
        Object.defineProperty(Scene.prototype, "activeBonesPerfCounter", {
            /**
             * Gets the performance counter for active bones
             * @see http://doc.LIBjs.com/how_to/optimizing_your_scene#instrumentation
             */
            get: function () {
                return this._activeBones;
            },
            enumerable: true,
            configurable: true
        });
        /** @hidden */
        Scene.prototype.getInterFramePerfCounter = function () {
            LIB.Tools.Warn("getInterFramePerfCounter is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "interFramePerfCounter", {
            /** @hidden */
            get: function () {
                LIB.Tools.Warn("interFramePerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        /** @hidden */
        Scene.prototype.getLastFrameDuration = function () {
            LIB.Tools.Warn("getLastFrameDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "lastFramePerfCounter", {
            /** @hidden */
            get: function () {
                LIB.Tools.Warn("lastFramePerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        /** @hidden */
        Scene.prototype.getEvaluateActiveMeshesDuration = function () {
            LIB.Tools.Warn("getEvaluateActiveMeshesDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "evaluateActiveMeshesDurationPerfCounter", {
            /** @hidden */
            get: function () {
                LIB.Tools.Warn("evaluateActiveMeshesDurationPerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the array of active meshes
         * @returns an array of AbstractMesh
         */
        Scene.prototype.getActiveMeshes = function () {
            return this._activeMeshes;
        };
        /** @hidden */
        Scene.prototype.getRenderTargetsDuration = function () {
            LIB.Tools.Warn("getRenderTargetsDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        /** @hidden */
        Scene.prototype.getRenderDuration = function () {
            LIB.Tools.Warn("getRenderDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "renderDurationPerfCounter", {
            /** @hidden */
            get: function () {
                LIB.Tools.Warn("renderDurationPerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        /** @hidden */
        Scene.prototype.getParticlesDuration = function () {
            LIB.Tools.Warn("getParticlesDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "particlesDurationPerfCounter", {
            /** @hidden */
            get: function () {
                LIB.Tools.Warn("particlesDurationPerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        /** @hidden */
        Scene.prototype.getSpritesDuration = function () {
            LIB.Tools.Warn("getSpritesDuration is deprecated. Please use SceneInstrumentation class");
            return 0;
        };
        Object.defineProperty(Scene.prototype, "spriteDuractionPerfCounter", {
            /** @hidden */
            get: function () {
                LIB.Tools.Warn("spriteDuractionPerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the animation ratio (which is 1.0 is the scene renders at 60fps and 2 if the scene renders at 30fps, etc.)
         * @returns a number
         */
        Scene.prototype.getAnimationRatio = function () {
            return this._animationRatio;
        };
        /**
         * Gets an unique Id for the current frame
         * @returns a number
         */
        Scene.prototype.getRenderId = function () {
            return this._renderId;
        };
        /** Call this function if you want to manually increment the render Id*/
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
         * @param pickResult pickingInfo of the object wished to simulate pointer event on
         * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
         * @returns the current scene
         */
        Scene.prototype.simulatePointerMove = function (pickResult, pointerEventInit) {
            var evt = new PointerEvent("pointermove", pointerEventInit);
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
                var type = evt.type === "mousewheel" || evt.type === "DOMMouseScroll" ? LIB.PointerEventTypes.POINTERWHEEL : LIB.PointerEventTypes.POINTERMOVE;
                if (this.onPointerMove) {
                    this.onPointerMove(evt, pickResult, type);
                }
                if (this.onPointerObservable.hasObservers()) {
                    var pi = new LIB.PointerInfo(type, evt, pickResult);
                    this.onPointerObservable.notifyObservers(pi, type);
                }
            }
            return this;
        };
        /**
         * Use this method to simulate a pointer down on a mesh
         * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
         * @param pickResult pickingInfo of the object wished to simulate pointer event on
         * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
         * @returns the current scene
         */
        Scene.prototype.simulatePointerDown = function (pickResult, pointerEventInit) {
            var evt = new PointerEvent("pointerdown", pointerEventInit);
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
                                    ((Date.now() - _this._startingPointerTime) > Scene.LongPressDelay) &&
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
                var type = LIB.PointerEventTypes.POINTERDOWN;
                if (this.onPointerDown) {
                    this.onPointerDown(evt, pickResult, type);
                }
                if (this.onPointerObservable.hasObservers()) {
                    var pi = new LIB.PointerInfo(type, evt, pickResult);
                    this.onPointerObservable.notifyObservers(pi, type);
                }
            }
            return this;
        };
        /**
         * Use this method to simulate a pointer up on a mesh
         * The pickResult parameter can be obtained from a scene.pick or scene.pickWithRay
         * @param pickResult pickingInfo of the object wished to simulate pointer event on
         * @param pointerEventInit pointer event state to be used when simulating the pointer event (eg. pointer id for multitouch)
         * @returns the current scene
         */
        Scene.prototype.simulatePointerUp = function (pickResult, pointerEventInit) {
            var evt = new PointerEvent("pointerup", pointerEventInit);
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
                        var type_1 = LIB.PointerEventTypes.POINTERPICK;
                        var pi = new LIB.PointerInfo(type_1, evt, pickResult);
                        this.onPointerObservable.notifyObservers(pi, type_1);
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
            var type = LIB.PointerEventTypes.POINTERUP;
            if (this.onPointerObservable.hasObservers()) {
                if (!clickInfo.ignore) {
                    if (!clickInfo.hasSwiped) {
                        if (clickInfo.singleClick && this.onPointerObservable.hasSpecificMask(LIB.PointerEventTypes.POINTERTAP)) {
                            var type_2 = LIB.PointerEventTypes.POINTERTAP;
                            var pi = new LIB.PointerInfo(type_2, evt, pickResult);
                            this.onPointerObservable.notifyObservers(pi, type_2);
                        }
                        if (clickInfo.doubleClick && this.onPointerObservable.hasSpecificMask(LIB.PointerEventTypes.POINTERDOUBLETAP)) {
                            var type_3 = LIB.PointerEventTypes.POINTERDOUBLETAP;
                            var pi = new LIB.PointerInfo(type_3, evt, pickResult);
                            this.onPointerObservable.notifyObservers(pi, type_3);
                        }
                    }
                }
                else {
                    var pi = new LIB.PointerInfo(type, evt, pickResult);
                    this.onPointerObservable.notifyObservers(pi, type);
                }
            }
            if (this.onPointerUp) {
                this.onPointerUp(evt, pickResult, type);
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
                if ((Date.now() - _this._previousStartingPointerTime > Scene.DoubleClickDelay && !_this._doubleClickOccured) ||
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
                            if (Date.now() - _this._previousStartingPointerTime > Scene.DoubleClickDelay ||
                                btn !== _this._previousButtonPressed) {
                                clickInfo.singleClick = true;
                                cb(clickInfo, _this._currentPickResult);
                            }
                        }
                        // at least one double click is required to be check and exclusive double click is enabled
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
                                Date.now() - _this._previousStartingPointerTime < Scene.DoubleClickDelay &&
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
                                // if the two successive clicks are too far, it's just two simple clicks
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
                            // just the first click of the double has been raised
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
                if (_this.onPrePointerObservable.hasObservers() && !_this._pointerCaptures[evt.pointerId]) {
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
                _this._pointerCaptures[evt.pointerId] = true;
                _this._startingPointerPosition.x = _this._pointerX;
                _this._startingPointerPosition.y = _this._pointerY;
                _this._startingPointerTime = Date.now();
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
                if (_this._totalPointersPressed === 0) { // We are attaching the pointer up to windows because of a bug in FF
                    return; // So we need to test it the pointer down was pressed before.
                }
                _this._totalPointersPressed--;
                _this._pickedUpMesh = null;
                _this._meshPickProceed = false;
                _this._updatePointerPosition(evt);
                _this._initClickEvent(_this.onPrePointerObservable, _this.onPointerObservable, evt, function (clickInfo, pickResult) {
                    // PreObservable support
                    if (_this.onPrePointerObservable.hasObservers() && !_this._pointerCaptures[evt.pointerId]) {
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
                    _this._pointerCaptures[evt.pointerId] = false;
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
                    if (!clickInfo.ignore) {
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
        /** Detaches all event handlers*/
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
        /**
         * This function will check if the scene can be rendered (textures are loaded, shaders are compiled)
         * Delay loaded resources are not taking in account
         * @return true if all required resources are ready
         */
        Scene.prototype.isReady = function () {
            if (this._isDisposed) {
                return false;
            }
            if (this._pendingData.length > 0) {
                return false;
            }
            var index;
            var engine = this.getEngine();
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
                if (!mesh.isReady(true)) {
                    return false;
                }
                // Effect layers
                var hardwareInstancedRendering = mesh.getClassName() === "InstancedMesh" || engine.getCaps().instancedArrays && mesh.instances.length > 0;
                for (var _i = 0, _a = this.effectLayers; _i < _a.length; _i++) {
                    var layer = _a[_i];
                    if (!layer.hasMesh(mesh)) {
                        continue;
                    }
                    for (var _b = 0, _c = mesh.subMeshes; _b < _c.length; _b++) {
                        var subMesh = _c[_b];
                        if (!layer.isReady(subMesh, hardwareInstancedRendering)) {
                            return false;
                        }
                    }
                }
            }
            // Post-processes
            if (this.activeCameras && this.activeCameras.length > 0) {
                for (var _d = 0, _e = this.activeCameras; _d < _e.length; _d++) {
                    var camera = _e[_d];
                    if (!camera.isReady(true)) {
                        return false;
                    }
                }
            }
            else if (this.activeCamera) {
                if (!this.activeCamera.isReady(true)) {
                    return false;
                }
            }
            // Particles
            for (var _f = 0, _g = this.particleSystems; _f < _g.length; _f++) {
                var particleSystem = _g[_f];
                if (!particleSystem.isReady()) {
                    return false;
                }
            }
            return true;
        };
        /** Resets all cached information relative to material (including effect and visibility) */
        Scene.prototype.resetCachedMaterial = function () {
            this._cachedMaterial = null;
            this._cachedEffect = null;
            this._cachedVisibility = null;
        };
        /**
         * Registers a function to be called before every frame render
         * @param func defines the function to register
         */
        Scene.prototype.registerBeforeRender = function (func) {
            this.onBeforeRenderObservable.add(func);
        };
        /**
         * Unregisters a function called before every frame render
         * @param func defines the function to unregister
         */
        Scene.prototype.unregisterBeforeRender = function (func) {
            this.onBeforeRenderObservable.removeCallback(func);
        };
        /**
         * Registers a function to be called after every frame render
         * @param func defines the function to register
         */
        Scene.prototype.registerAfterRender = function (func) {
            this.onAfterRenderObservable.add(func);
        };
        /**
         * Unregisters a function called after every frame render
         * @param func defines the function to unregister
         */
        Scene.prototype.unregisterAfterRender = function (func) {
            this.onAfterRenderObservable.removeCallback(func);
        };
        Scene.prototype._executeOnceBeforeRender = function (func) {
            var _this = this;
            var execFunc = function () {
                func();
                setTimeout(function () {
                    _this.unregisterBeforeRender(execFunc);
                });
            };
            this.registerBeforeRender(execFunc);
        };
        /**
         * The provided function will run before render once and will be disposed afterwards.
         * A timeout delay can be provided so that the function will be executed in N ms.
         * The timeout is using the browser's native setTimeout so time percision cannot be guaranteed.
         * @param func The function to be executed.
         * @param timeout optional delay in ms
         */
        Scene.prototype.executeOnceBeforeRender = function (func, timeout) {
            var _this = this;
            if (timeout !== undefined) {
                setTimeout(function () {
                    _this._executeOnceBeforeRender(func);
                }, timeout);
            }
            else {
                this._executeOnceBeforeRender(func);
            }
        };
        /** @hidden */
        Scene.prototype._addPendingData = function (data) {
            this._pendingData.push(data);
        };
        /** @hidden */
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
        /**
         * Returns the number of items waiting to be loaded
         * @returns the number of items waiting to be loaded
         */
        Scene.prototype.getWaitingItemsCount = function () {
            return this._pendingData.length;
        };
        Object.defineProperty(Scene.prototype, "isLoading", {
            /**
             * Returns a boolean indicating if the scene is still loading data
             */
            get: function () {
                return this._pendingData.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Registers a function to be executed when the scene is ready
         * @param {Function} func - the function to be executed
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
        /**
         * Returns a promise that resolves when the scene is ready
         * @returns A promise that resolves when the scene is ready
         */
        Scene.prototype.whenReadyAsync = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.executeWhenReady(function () {
                    resolve();
                });
            });
        };
        /** @hidden */
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
         * @param target defines the target
         * @param from defines from which frame should animation start
         * @param to defines until which frame should animation run.
         * @param weight defines the weight to apply to the animation (1.0 by default)
         * @param loop defines if the animation loops
         * @param speedRatio defines the speed in which to run the animation (1.0 by default)
         * @param onAnimationEnd defines the function to be executed when the animation ends
         * @param animatable defines an animatable object. If not provided a new one will be created from the given params
         * @returns the animatable object created for this animation
         */
        Scene.prototype.beginWeightedAnimation = function (target, from, to, weight, loop, speedRatio, onAnimationEnd, animatable) {
            if (weight === void 0) { weight = 1.0; }
            if (speedRatio === void 0) { speedRatio = 1.0; }
            var returnedAnimatable = this.beginAnimation(target, from, to, loop, speedRatio, onAnimationEnd, animatable, false);
            returnedAnimatable.weight = weight;
            return returnedAnimatable;
        };
        /**
         * Will start the animation sequence of a given target
         * @param target defines the target
         * @param from defines from which frame should animation start
         * @param to defines until which frame should animation run.
         * @param loop defines if the animation loops
         * @param speedRatio defines the speed in which to run the animation (1.0 by default)
         * @param onAnimationEnd defines the function to be executed when the animation ends
         * @param animatable defines an animatable object. If not provided a new one will be created from the given params
         * @param stopCurrent defines if the current animations must be stopped first (true by default)
         * @returns the animatable object created for this animation
         */
        Scene.prototype.beginAnimation = function (target, from, to, loop, speedRatio, onAnimationEnd, animatable, stopCurrent) {
            if (speedRatio === void 0) { speedRatio = 1.0; }
            if (stopCurrent === void 0) { stopCurrent = true; }
            if (from > to && speedRatio > 0) {
                speedRatio *= -1;
            }
            if (stopCurrent) {
                this.stopAnimation(target);
            }
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
                    this.beginAnimation(animatables[index], from, to, loop, speedRatio, onAnimationEnd, animatable, stopCurrent);
                }
            }
            animatable.reset();
            return animatable;
        };
        /**
         * Begin a new animation on a given node
         * @param target defines the target where the animation will take place
         * @param animations defines the list of animations to start
         * @param from defines the initial value
         * @param to defines the final value
         * @param loop defines if you want animation to loop (off by default)
         * @param speedRatio defines the speed ratio to apply to all animations
         * @param onAnimationEnd defines the callback to call when an animation ends (will be called once per node)
         * @returns the list of created animatables
         */
        Scene.prototype.beginDirectAnimation = function (target, animations, from, to, loop, speedRatio, onAnimationEnd) {
            if (speedRatio === undefined) {
                speedRatio = 1.0;
            }
            var animatable = new LIB.Animatable(this, target, from, to, loop, speedRatio, onAnimationEnd, animations);
            return animatable;
        };
        /**
         * Begin a new animation on a given node and its hierarchy
         * @param target defines the root node where the animation will take place
         * @param directDescendantsOnly if true only direct descendants will be used, if false direct and also indirect (children of children, an so on in a recursive manner) descendants will be used.
         * @param animations defines the list of animations to start
         * @param from defines the initial value
         * @param to defines the final value
         * @param loop defines if you want animation to loop (off by default)
         * @param speedRatio defines the speed ratio to apply to all animations
         * @param onAnimationEnd defines the callback to call when an animation ends (will be called once per node)
         * @returns the list of animatables created for all nodes
         */
        Scene.prototype.beginDirectHierarchyAnimation = function (target, directDescendantsOnly, animations, from, to, loop, speedRatio, onAnimationEnd) {
            var children = target.getDescendants(directDescendantsOnly);
            var result = [];
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child = children_1[_i];
                result.push(this.beginDirectAnimation(child, animations, from, to, loop, speedRatio, onAnimationEnd));
            }
            return result;
        };
        /**
         * Gets the animatable associated with a specific target
         * @param target defines the target of the animatable
         * @returns the required animatable if found
         */
        Scene.prototype.getAnimatableByTarget = function (target) {
            for (var index = 0; index < this._activeAnimatables.length; index++) {
                if (this._activeAnimatables[index].target === target) {
                    return this._activeAnimatables[index];
                }
            }
            return null;
        };
        /**
         * Gets all animatables associated with a given target
         * @param target defines the target to look animatables for
         * @returns an array of Animatables
         */
        Scene.prototype.getAllAnimatablesByTarget = function (target) {
            var result = [];
            for (var index = 0; index < this._activeAnimatables.length; index++) {
                if (this._activeAnimatables[index].target === target) {
                    result.push(this._activeAnimatables[index]);
                }
            }
            return result;
        };
        Object.defineProperty(Scene.prototype, "animatables", {
            /**
             * Gets all animatable attached to the scene
             */
            get: function () {
                return this._activeAnimatables;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Will stop the animation of the given target
         * @param target - the target
         * @param animationName - the name of the animation to stop (all animations will be stopped if empty)
         */
        Scene.prototype.stopAnimation = function (target, animationName) {
            var animatables = this.getAllAnimatablesByTarget(target);
            for (var _i = 0, animatables_1 = animatables; _i < animatables_1.length; _i++) {
                var animatable = animatables_1[_i];
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
            for (var _i = 0, _a = this.animationGroups; _i < _a.length; _i++) {
                var group = _a[_i];
                group.stop();
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
            // Late animation bindings
            this._processLateAnimationBindings();
        };
        /** @hidden */
        Scene.prototype._registerTargetForLateAnimationBinding = function (runtimeAnimation, originalValue) {
            var target = runtimeAnimation.target;
            this._registeredForLateAnimationBindings.pushNoDuplicate(target);
            if (!target._lateAnimationHolders) {
                target._lateAnimationHolders = {};
            }
            if (!target._lateAnimationHolders[runtimeAnimation.targetPath]) {
                target._lateAnimationHolders[runtimeAnimation.targetPath] = {
                    totalWeight: 0,
                    animations: [],
                    originalValue: originalValue
                };
            }
            target._lateAnimationHolders[runtimeAnimation.targetPath].animations.push(runtimeAnimation);
            target._lateAnimationHolders[runtimeAnimation.targetPath].totalWeight += runtimeAnimation.weight;
        };
        Scene.prototype._processLateAnimationBindingsForMatrices = function (holder) {
            var normalizer = 1.0;
            var finalPosition = LIB.Tmp.Vector3[0];
            var finalScaling = LIB.Tmp.Vector3[1];
            var finalQuaternion = LIB.Tmp.Quaternion[0];
            var startIndex = 0;
            var originalAnimation = holder.animations[0];
            var originalValue = holder.originalValue;
            var scale = 1;
            if (holder.totalWeight < 1.0) {
                // We need to mix the original value in
                originalValue.decompose(finalScaling, finalQuaternion, finalPosition);
                scale = 1.0 - holder.totalWeight;
            }
            else {
                startIndex = 1;
                // We need to normalize the weights
                normalizer = holder.totalWeight;
                originalAnimation.currentValue.decompose(finalScaling, finalQuaternion, finalPosition);
                scale = originalAnimation.weight / normalizer;
                if (scale == 1) {
                    return originalAnimation.currentValue;
                }
            }
            finalScaling.scaleInPlace(scale);
            finalPosition.scaleInPlace(scale);
            finalQuaternion.scaleInPlace(scale);
            for (var animIndex = startIndex; animIndex < holder.animations.length; animIndex++) {
                var runtimeAnimation = holder.animations[animIndex];
                var scale = runtimeAnimation.weight / normalizer;
                var currentPosition = LIB.Tmp.Vector3[2];
                var currentScaling = LIB.Tmp.Vector3[3];
                var currentQuaternion = LIB.Tmp.Quaternion[1];
                runtimeAnimation.currentValue.decompose(currentScaling, currentQuaternion, currentPosition);
                currentScaling.scaleAndAddToRef(scale, finalScaling);
                currentQuaternion.scaleAndAddToRef(scale, finalQuaternion);
                currentPosition.scaleAndAddToRef(scale, finalPosition);
            }
            LIB.Matrix.ComposeToRef(finalScaling, finalQuaternion, finalPosition, originalAnimation._workValue);
            return originalAnimation._workValue;
        };
        Scene.prototype._processLateAnimationBindingsForQuaternions = function (holder) {
            var originalAnimation = holder.animations[0];
            var originalValue = holder.originalValue;
            if (holder.animations.length === 1) {
                return LIB.Quaternion.Slerp(originalValue, originalAnimation.currentValue, Math.min(1.0, holder.totalWeight));
            }
            var normalizer = 1.0;
            var quaternions;
            var weights;
            if (holder.totalWeight < 1.0) {
                var scale = 1.0 - holder.totalWeight;
                quaternions = [];
                weights = [];
                quaternions.push(originalValue);
                weights.push(scale);
            }
            else {
                if (holder.animations.length === 2) { // Slerp as soon as we can
                    return LIB.Quaternion.Slerp(holder.animations[0].currentValue, holder.animations[1].currentValue, holder.animations[1].weight / holder.totalWeight);
                }
                quaternions = [];
                weights = [];
                normalizer = holder.totalWeight;
            }
            for (var animIndex = 0; animIndex < holder.animations.length; animIndex++) {
                var runtimeAnimation = holder.animations[animIndex];
                quaternions.push(runtimeAnimation.currentValue);
                weights.push(runtimeAnimation.weight / normalizer);
            }
            // https://gamedev.stackexchange.com/questions/62354/method-for-interpolation-between-3-quaternions
            var cumulativeAmount = 0;
            var cumulativeQuaternion = null;
            for (var index = 0; index < quaternions.length;) {
                if (!cumulativeQuaternion) {
                    cumulativeQuaternion = LIB.Quaternion.Slerp(quaternions[index], quaternions[index + 1], weights[index + 1] / (weights[index] + weights[index + 1]));
                    cumulativeAmount = weights[index] + weights[index + 1];
                    index += 2;
                    continue;
                }
                cumulativeAmount += weights[index];
                LIB.Quaternion.SlerpToRef(cumulativeQuaternion, quaternions[index], weights[index] / cumulativeAmount, cumulativeQuaternion);
                index++;
            }
            return cumulativeQuaternion;
        };
        Scene.prototype._processLateAnimationBindings = function () {
            if (!this._registeredForLateAnimationBindings.length) {
                return;
            }
            for (var index = 0; index < this._registeredForLateAnimationBindings.length; index++) {
                var target = this._registeredForLateAnimationBindings.data[index];
                for (var path in target._lateAnimationHolders) {
                    var holder = target._lateAnimationHolders[path];
                    var originalAnimation = holder.animations[0];
                    var originalValue = holder.originalValue;
                    var matrixDecomposeMode = LIB.Animation.AllowMatrixDecomposeForInterpolation && originalValue.m; // ie. data is matrix
                    var finalValue = void 0;
                    if (matrixDecomposeMode) {
                        finalValue = this._processLateAnimationBindingsForMatrices(holder);
                    }
                    else {
                        var quaternionMode = originalValue.w !== undefined;
                        if (quaternionMode) {
                            finalValue = this._processLateAnimationBindingsForQuaternions(holder);
                        }
                        else {
                            var startIndex = 0;
                            var normalizer = 1.0;
                            if (holder.totalWeight < 1.0) {
                                // We need to mix the original value in
                                if (originalValue.scale) {
                                    finalValue = originalValue.scale(1.0 - holder.totalWeight);
                                }
                                else {
                                    finalValue = originalValue * (1.0 - holder.totalWeight);
                                }
                            }
                            else {
                                // We need to normalize the weights
                                normalizer = holder.totalWeight;
                                var scale_1 = originalAnimation.weight / normalizer;
                                if (scale_1 !== 1) {
                                    if (originalAnimation.currentValue.scale) {
                                        finalValue = originalAnimation.currentValue.scale(scale_1);
                                    }
                                    else {
                                        finalValue = originalAnimation.currentValue * scale_1;
                                    }
                                }
                                else {
                                    finalValue = originalAnimation.currentValue;
                                }
                                startIndex = 1;
                            }
                            for (var animIndex = startIndex; animIndex < holder.animations.length; animIndex++) {
                                var runtimeAnimation = holder.animations[animIndex];
                                var scale = runtimeAnimation.weight / normalizer;
                                if (runtimeAnimation.currentValue.scaleAndAddToRef) {
                                    runtimeAnimation.currentValue.scaleAndAddToRef(scale, finalValue);
                                }
                                else {
                                    finalValue += runtimeAnimation.currentValue * scale;
                                }
                            }
                        }
                    }
                    target[path] = finalValue;
                }
                target._lateAnimationHolders = {};
            }
            this._registeredForLateAnimationBindings.reset();
        };
        // Matrix
        /** @hidden */
        Scene.prototype._switchToAlternateCameraConfiguration = function (active) {
            this._useAlternateCameraConfiguration = active;
        };
        /**
         * Gets the current view matrix
         * @returns a Matrix
         */
        Scene.prototype.getViewMatrix = function () {
            return this._useAlternateCameraConfiguration ? this._alternateViewMatrix : this._viewMatrix;
        };
        /**
         * Gets the current projection matrix
         * @returns a Matrix
         */
        Scene.prototype.getProjectionMatrix = function () {
            return this._useAlternateCameraConfiguration ? this._alternateProjectionMatrix : this._projectionMatrix;
        };
        /**
         * Gets the current transform matrix
         * @returns a Matrix made of View * Projection
         */
        Scene.prototype.getTransformMatrix = function () {
            return this._useAlternateCameraConfiguration ? this._alternateTransformMatrix : this._transformMatrix;
        };
        /**
         * Sets the current transform matrix
         * @param view defines the View matrix to use
         * @param projection defines the Projection matrix to use
         */
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
        /** @hidden */
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
        /**
         * Gets the uniform buffer used to store scene data
         * @returns a UniformBuffer
         */
        Scene.prototype.getSceneUniformBuffer = function () {
            return this._useAlternateCameraConfiguration ? this._alternateSceneUbo : this._sceneUbo;
        };
        /**
         * Gets an unique (relatively to the current scene) Id
         * @returns an unique number for the scene
         */
        Scene.prototype.getUniqueId = function () {
            var result = Scene._uniqueIdCounter;
            Scene._uniqueIdCounter++;
            return result;
        };
        /**
         * Add a mesh to the list of scene's meshes
         * @param newMesh defines the mesh to add
         */
        Scene.prototype.addMesh = function (newMesh) {
            this.meshes.push(newMesh);
            //notify the collision coordinator
            if (this.collisionCoordinator) {
                this.collisionCoordinator.onMeshAdded(newMesh);
            }
            newMesh._resyncLightSources();
            this.onNewMeshAddedObservable.notifyObservers(newMesh);
        };
        /**
           * Remove a mesh for the list of scene's meshes
           * @param toRemove defines the mesh to remove
           * @param recursive if all child meshes should also be removed from the scene
           * @returns the index where the mesh was in the mesh list
           */
        Scene.prototype.removeMesh = function (toRemove, recursive) {
            var _this = this;
            if (recursive === void 0) { recursive = false; }
            var index = this.meshes.indexOf(toRemove);
            if (index !== -1) {
                // Remove from the scene if mesh found
                this.meshes.splice(index, 1);
            }
            this.onMeshRemovedObservable.notifyObservers(toRemove);
            if (recursive) {
                toRemove.getChildMeshes().forEach(function (m) {
                    _this.removeMesh(m);
                });
            }
            return index;
        };
        /**
         * Add a transform node to the list of scene's transform nodes
         * @param newTransformNode defines the transform node to add
         */
        Scene.prototype.addTransformNode = function (newTransformNode) {
            this.transformNodes.push(newTransformNode);
            this.onNewTransformNodeAddedObservable.notifyObservers(newTransformNode);
        };
        /**
         * Remove a transform node for the list of scene's transform nodes
         * @param toRemove defines the transform node to remove
         * @returns the index where the transform node was in the transform node list
         */
        Scene.prototype.removeTransformNode = function (toRemove) {
            var index = this.transformNodes.indexOf(toRemove);
            if (index !== -1) {
                // Remove from the scene if found
                this.transformNodes.splice(index, 1);
            }
            this.onTransformNodeRemovedObservable.notifyObservers(toRemove);
            return index;
        };
        /**
         * Remove a skeleton for the list of scene's skeletons
         * @param toRemove defines the skeleton to remove
         * @returns the index where the skeleton was in the skeleton list
         */
        Scene.prototype.removeSkeleton = function (toRemove) {
            var index = this.skeletons.indexOf(toRemove);
            if (index !== -1) {
                // Remove from the scene if found
                this.skeletons.splice(index, 1);
            }
            return index;
        };
        /**
         * Remove a morph target for the list of scene's morph targets
         * @param toRemove defines the morph target to remove
         * @returns the index where the morph target was in the morph target list
         */
        Scene.prototype.removeMorphTargetManager = function (toRemove) {
            var index = this.morphTargetManagers.indexOf(toRemove);
            if (index !== -1) {
                // Remove from the scene if found
                this.morphTargetManagers.splice(index, 1);
            }
            return index;
        };
        /**
         * Remove a light for the list of scene's lights
         * @param toRemove defines the light to remove
         * @returns the index where the light was in the light list
         */
        Scene.prototype.removeLight = function (toRemove) {
            var index = this.lights.indexOf(toRemove);
            if (index !== -1) {
                // Remove from meshes
                for (var _i = 0, _a = this.meshes; _i < _a.length; _i++) {
                    var mesh = _a[_i];
                    mesh._removeLightSource(toRemove);
                }
                // Remove from the scene if mesh found
                this.lights.splice(index, 1);
                this.sortLightsByPriority();
            }
            this.onLightRemovedObservable.notifyObservers(toRemove);
            return index;
        };
        /**
         * Remove a camera for the list of scene's cameras
         * @param toRemove defines the camera to remove
         * @returns the index where the camera was in the camera list
         */
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
        /**
         * Remove a particle system for the list of scene's particle systems
         * @param toRemove defines the particle system to remove
         * @returns the index where the particle system was in the particle system list
         */
        Scene.prototype.removeParticleSystem = function (toRemove) {
            var index = this.particleSystems.indexOf(toRemove);
            if (index !== -1) {
                this.particleSystems.splice(index, 1);
            }
            return index;
        };
        /**
         * Remove a animation for the list of scene's animations
         * @param toRemove defines the animation to remove
         * @returns the index where the animation was in the animation list
         */
        Scene.prototype.removeAnimation = function (toRemove) {
            var index = this.animations.indexOf(toRemove);
            if (index !== -1) {
                this.animations.splice(index, 1);
            }
            return index;
        };
        /**
         * Removes the given animation group from this scene.
         * @param toRemove The animation group to remove
         * @returns The index of the removed animation group
         */
        Scene.prototype.removeAnimationGroup = function (toRemove) {
            var index = this.animationGroups.indexOf(toRemove);
            if (index !== -1) {
                this.animationGroups.splice(index, 1);
            }
            return index;
        };
        /**
         * Removes the given multi-material from this scene.
         * @param toRemove The multi-material to remove
         * @returns The index of the removed multi-material
         */
        Scene.prototype.removeMultiMaterial = function (toRemove) {
            var index = this.multiMaterials.indexOf(toRemove);
            if (index !== -1) {
                this.multiMaterials.splice(index, 1);
            }
            return index;
        };
        /**
         * Removes the given material from this scene.
         * @param toRemove The material to remove
         * @returns The index of the removed material
         */
        Scene.prototype.removeMaterial = function (toRemove) {
            var index = this.materials.indexOf(toRemove);
            if (index !== -1) {
                this.materials.splice(index, 1);
            }
            return index;
        };
        /**
         * Removes the given lens flare system from this scene.
         * @param toRemove The lens flare system to remove
         * @returns The index of the removed lens flare system
         */
        Scene.prototype.removeLensFlareSystem = function (toRemove) {
            var index = this.lensFlareSystems.indexOf(toRemove);
            if (index !== -1) {
                this.lensFlareSystems.splice(index, 1);
            }
            return index;
        };
        /**
         * Removes the given action manager from this scene.
         * @param toRemove The action manager to remove
         * @returns The index of the removed action manager
         */
        Scene.prototype.removeActionManager = function (toRemove) {
            var index = this._actionManagers.indexOf(toRemove);
            if (index !== -1) {
                this._actionManagers.splice(index, 1);
            }
            return index;
        };
        /**
         * Removes the given effect layer from this scene.
         * @param toRemove defines the effect layer to remove
         * @returns the index of the removed effect layer
         */
        Scene.prototype.removeEffectLayer = function (toRemove) {
            var index = this.effectLayers.indexOf(toRemove);
            if (index !== -1) {
                this.effectLayers.splice(index, 1);
            }
            return index;
        };
        /**
         * Removes the given texture from this scene.
         * @param toRemove The texture to remove
         * @returns The index of the removed texture
         */
        Scene.prototype.removeTexture = function (toRemove) {
            var index = this.textures.indexOf(toRemove);
            if (index !== -1) {
                this.textures.splice(index, 1);
            }
            return index;
        };
        /**
         * Adds the given light to this scene
         * @param newLight The light to add
         */
        Scene.prototype.addLight = function (newLight) {
            this.lights.push(newLight);
            this.sortLightsByPriority();
            // Add light to all meshes (To support if the light is removed and then readded)
            for (var _i = 0, _a = this.meshes; _i < _a.length; _i++) {
                var mesh = _a[_i];
                if (mesh._lightSources.indexOf(newLight) === -1) {
                    mesh._lightSources.push(newLight);
                    mesh._resyncLightSources();
                }
            }
            this.onNewLightAddedObservable.notifyObservers(newLight);
        };
        /**
         * Sorts the list list based on light priorities
         */
        Scene.prototype.sortLightsByPriority = function () {
            if (this.requireLightSorting) {
                this.lights.sort(LIB.Light.CompareLightsPriority);
            }
        };
        /**
         * Adds the given camera to this scene
         * @param newCamera The camera to add
         */
        Scene.prototype.addCamera = function (newCamera) {
            this.cameras.push(newCamera);
            this.onNewCameraAddedObservable.notifyObservers(newCamera);
        };
        /**
         * Adds the given skeleton to this scene
         * @param newSkeleton The skeleton to add
         */
        Scene.prototype.addSkeleton = function (newSkeleton) {
            this.skeletons.push(newSkeleton);
        };
        /**
         * Adds the given particle system to this scene
         * @param newParticleSystem The particle system to add
         */
        Scene.prototype.addParticleSystem = function (newParticleSystem) {
            this.particleSystems.push(newParticleSystem);
        };
        /**
         * Adds the given animation to this scene
         * @param newAnimation The animation to add
         */
        Scene.prototype.addAnimation = function (newAnimation) {
            this.animations.push(newAnimation);
        };
        /**
         * Adds the given animation group to this scene.
         * @param newAnimationGroup The animation group to add
         */
        Scene.prototype.addAnimationGroup = function (newAnimationGroup) {
            this.animationGroups.push(newAnimationGroup);
        };
        /**
         * Adds the given multi-material to this scene
         * @param newMultiMaterial The multi-material to add
         */
        Scene.prototype.addMultiMaterial = function (newMultiMaterial) {
            this.multiMaterials.push(newMultiMaterial);
        };
        /**
         * Adds the given material to this scene
         * @param newMaterial The material to add
         */
        Scene.prototype.addMaterial = function (newMaterial) {
            this.materials.push(newMaterial);
        };
        /**
         * Adds the given morph target to this scene
         * @param newMorphTargetManager The morph target to add
         */
        Scene.prototype.addMorphTargetManager = function (newMorphTargetManager) {
            this.morphTargetManagers.push(newMorphTargetManager);
        };
        /**
         * Adds the given geometry to this scene
         * @param newGeometry The geometry to add
         */
        Scene.prototype.addGeometry = function (newGeometry) {
            this._geometries.push(newGeometry);
        };
        /**
         * Adds the given lens flare system to this scene
         * @param newLensFlareSystem The lens flare system to add
         */
        Scene.prototype.addLensFlareSystem = function (newLensFlareSystem) {
            this.lensFlareSystems.push(newLensFlareSystem);
        };
        /**
         * Adds the given effect layer to this scene
         * @param newEffectLayer defines the effect layer to add
         */
        Scene.prototype.addEffectLayer = function (newEffectLayer) {
            this.effectLayers.push(newEffectLayer);
        };
        /**
         * Adds the given action manager to this scene
         * @param newActionManager The action manager to add
         */
        Scene.prototype.addActionManager = function (newActionManager) {
            this._actionManagers.push(newActionManager);
        };
        /**
         * Adds the given texture to this scene.
         * @param newTexture The texture to add
         */
        Scene.prototype.addTexture = function (newTexture) {
            this.textures.push(newTexture);
        };
        /**
         * Switch active camera
         * @param newCamera defines the new active camera
         * @param attachControl defines if attachControl must be called for the new active camera (default: true)
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
         * @param id defines the camera's ID
         * @return the new active camera or null if none found.
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
         * @param name defines the camera's name
         * @returns the new active camera or null if none found.
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
         * @param name defines the material's name
         * @return the animation group or null if none found.
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
         * @param id defines the material's ID
         * @return the material or null if none found.
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
         * Gets a material using its name
         * @param name defines the material's name
         * @return the material or null if none found.
         */
        Scene.prototype.getMaterialByName = function (name) {
            for (var index = 0; index < this.materials.length; index++) {
                if (this.materials[index].name === name) {
                    return this.materials[index];
                }
            }
            return null;
        };
        /**
         * Gets a lens flare system using its name
         * @param name defines the name to look for
         * @returns the lens flare system or null if not found
         */
        Scene.prototype.getLensFlareSystemByName = function (name) {
            for (var index = 0; index < this.lensFlareSystems.length; index++) {
                if (this.lensFlareSystems[index].name === name) {
                    return this.lensFlareSystems[index];
                }
            }
            return null;
        };
        /**
         * Gets a lens flare system using its id
         * @param id defines the id to look for
         * @returns the lens flare system or null if not found
         */
        Scene.prototype.getLensFlareSystemByID = function (id) {
            for (var index = 0; index < this.lensFlareSystems.length; index++) {
                if (this.lensFlareSystems[index].id === id) {
                    return this.lensFlareSystems[index];
                }
            }
            return null;
        };
        /**
         * Gets a camera using its id
         * @param id defines the id to look for
         * @returns the camera or null if not found
         */
        Scene.prototype.getCameraByID = function (id) {
            for (var index = 0; index < this.cameras.length; index++) {
                if (this.cameras[index].id === id) {
                    return this.cameras[index];
                }
            }
            return null;
        };
        /**
         * Gets a camera using its unique id
         * @param uniqueId defines the unique id to look for
         * @returns the camera or null if not found
         */
        Scene.prototype.getCameraByUniqueID = function (uniqueId) {
            for (var index = 0; index < this.cameras.length; index++) {
                if (this.cameras[index].uniqueId === uniqueId) {
                    return this.cameras[index];
                }
            }
            return null;
        };
        /**
         * Gets a camera using its name
         * @param name defines the camera's name
         * @return the camera or null if none found.
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
         * Gets a bone using its id
         * @param id defines the bone's id
         * @return the bone or null if not found
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
        * Gets a bone using its id
        * @param name defines the bone's name
        * @return the bone or null if not found
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
         * Gets a light node using its name
         * @param name defines the the light's name
         * @return the light or null if none found.
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
         * Gets a light node using its id
         * @param id defines the light's id
         * @return the light or null if none found.
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
         * Gets a light node using its scene-generated unique ID
         * @param uniqueId defines the light's unique id
         * @return the light or null if none found.
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
         * Gets a particle system by id
         * @param id defines the particle system id
         * @return the corresponding system or null if none found
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
         * Gets a geometry using its ID
         * @param id defines the geometry's id
         * @return the geometry or null if none found.
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
         * Add a new geometry to this scene
         * @param geometry defines the geometry to be added to the scene.
         * @param force defines if the geometry must be pushed even if a geometry with this id already exists
         * @return a boolean defining if the geometry was added or not
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
         * @param geometry defines the geometry to be removed from the scene
         * @return a boolean defining if the geometry was removed or not
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
        /**
         * Gets the list of geometries attached to the scene
         * @returns an array of Geometry
         */
        Scene.prototype.getGeometries = function () {
            return this._geometries;
        };
        /**
         * Gets the first added mesh found of a given ID
         * @param id defines the id to search for
         * @return the mesh found or null if not found at all
         */
        Scene.prototype.getMeshByID = function (id) {
            for (var index = 0; index < this.meshes.length; index++) {
                if (this.meshes[index].id === id) {
                    return this.meshes[index];
                }
            }
            return null;
        };
        /**
         * Gets a list of meshes using their id
         * @param id defines the id to search for
         * @returns a list of meshes
         */
        Scene.prototype.getMeshesByID = function (id) {
            return this.meshes.filter(function (m) {
                return m.id === id;
            });
        };
        /**
         * Gets the first added transform node found of a given ID
         * @param id defines the id to search for
         * @return the found transform node or null if not found at all.
         */
        Scene.prototype.getTransformNodeByID = function (id) {
            for (var index = 0; index < this.transformNodes.length; index++) {
                if (this.transformNodes[index].id === id) {
                    return this.transformNodes[index];
                }
            }
            return null;
        };
        /**
         * Gets a list of transform nodes using their id
         * @param id defines the id to search for
         * @returns a list of transform nodes
         */
        Scene.prototype.getTransformNodesByID = function (id) {
            return this.transformNodes.filter(function (m) {
                return m.id === id;
            });
        };
        /**
         * Gets a mesh with its auto-generated unique id
         * @param uniqueId defines the unique id to search for
         * @return the found mesh or null if not found at all.
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
         * Gets a the last added mesh using a given id
         * @param id defines the id to search for
         * @return the found mesh or null if not found at all.
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
         * Gets a the last added node (Mesh, Camera, Light) using a given id
         * @param id defines the id to search for
         * @return the found node or null if not found at all
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
        /**
         * Gets a node (Mesh, Camera, Light) using a given id
         * @param id defines the id to search for
         * @return the found node or null if not found at all
         */
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
        /**
         * Gets a node (Mesh, Camera, Light) using a given name
         * @param name defines the name to search for
         * @return the found node or null if not found at all.
         */
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
        /**
         * Gets a mesh using a given name
         * @param name defines the name to search for
         * @return the found mesh or null if not found at all.
         */
        Scene.prototype.getMeshByName = function (name) {
            for (var index = 0; index < this.meshes.length; index++) {
                if (this.meshes[index].name === name) {
                    return this.meshes[index];
                }
            }
            return null;
        };
        /**
         * Gets a transform node using a given name
         * @param name defines the name to search for
         * @return the found transform node or null if not found at all.
         */
        Scene.prototype.getTransformNodeByName = function (name) {
            for (var index = 0; index < this.transformNodes.length; index++) {
                if (this.transformNodes[index].name === name) {
                    return this.transformNodes[index];
                }
            }
            return null;
        };
        /**
         * Gets a sound using a given name
         * @param name defines the name to search for
         * @return the found sound or null if not found at all.
         */
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
        /**
         * Gets a skeleton using a given id (if many are found, this function will pick the last one)
         * @param id defines the id to search for
         * @return the found skeleton or null if not found at all.
         */
        Scene.prototype.getLastSkeletonByID = function (id) {
            for (var index = this.skeletons.length - 1; index >= 0; index--) {
                if (this.skeletons[index].id === id) {
                    return this.skeletons[index];
                }
            }
            return null;
        };
        /**
         * Gets a skeleton using a given id (if many are found, this function will pick the first one)
         * @param id defines the id to search for
         * @return the found skeleton or null if not found at all.
         */
        Scene.prototype.getSkeletonById = function (id) {
            for (var index = 0; index < this.skeletons.length; index++) {
                if (this.skeletons[index].id === id) {
                    return this.skeletons[index];
                }
            }
            return null;
        };
        /**
         * Gets a skeleton using a given name
         * @param name defines the name to search for
         * @return the found skeleton or null if not found at all.
         */
        Scene.prototype.getSkeletonByName = function (name) {
            for (var index = 0; index < this.skeletons.length; index++) {
                if (this.skeletons[index].name === name) {
                    return this.skeletons[index];
                }
            }
            return null;
        };
        /**
         * Gets a morph target manager  using a given id (if many are found, this function will pick the last one)
         * @param id defines the id to search for
         * @return the found morph target manager or null if not found at all.
         */
        Scene.prototype.getMorphTargetManagerById = function (id) {
            for (var index = 0; index < this.morphTargetManagers.length; index++) {
                if (this.morphTargetManagers[index].uniqueId === id) {
                    return this.morphTargetManagers[index];
                }
            }
            return null;
        };
        /**
         * Gets a boolean indicating if the given mesh is active
         * @param mesh defines the mesh to look for
         * @returns true if the mesh is in the active list
         */
        Scene.prototype.isActiveMesh = function (mesh) {
            return (this._activeMeshes.indexOf(mesh) !== -1);
        };
        /**
         * Return a the first highlight layer of the scene with a given name.
         * @param name The name of the highlight layer to look for.
         * @return The highlight layer if found otherwise null.
         */
        Scene.prototype.getHighlightLayerByName = function (name) {
            for (var index = 0; index < this.effectLayers.length; index++) {
                if (this.effectLayers[index].name === name && this.effectLayers[index].getEffectName() === LIB.HighlightLayer.EffectName) {
                    return this.effectLayers[index];
                }
            }
            return null;
        };
        /**
         * Return a the first highlight layer of the scene with a given name.
         * @param name The name of the highlight layer to look for.
         * @return The highlight layer if found otherwise null.
         */
        Scene.prototype.getGlowLayerByName = function (name) {
            for (var index = 0; index < this.effectLayers.length; index++) {
                if (this.effectLayers[index].name === name && this.effectLayers[index].getEffectName() === LIB.GlowLayer.EffectName) {
                    return this.effectLayers[index];
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
            if (this.dispatchAllSubMeshesOfActiveMeshes || mesh.alwaysSelectAsActiveMesh || mesh.subMeshes.length === 1 || subMesh.isInFrustum(this._frustumPlanes)) {
                if (mesh.showSubMeshesBoundingBox) {
                    var boundingInfo = subMesh.getBoundingInfo();
                    if (boundingInfo !== null && boundingInfo !== undefined) {
                        this.getBoundingBoxRenderer().renderList.push(boundingInfo.boundingBox);
                    }
                }
                var material = subMesh.getMaterial();
                if (material !== null && material !== undefined) {
                    // Render targets
                    if (material.getRenderTargetTextures !== undefined) {
                        if (this._processedMaterials.indexOf(material) === -1) {
                            this._processedMaterials.push(material);
                            this._renderTargets.concatWithNoDuplicate(material.getRenderTargetTextures());
                        }
                    }
                    // Dispatch
                    this._activeIndices.addCount(subMesh.indexCount, false);
                    this._renderingManager.dispatch(subMesh, mesh, material);
                }
            }
        };
        /**
         * Clear the processed materials smart array preventing retention point in material dispose.
         */
        Scene.prototype.freeProcessedMaterials = function () {
            this._processedMaterials.dispose();
        };
        /**
         * Clear the active meshes smart array preventing retention point in mesh dispose.
         */
        Scene.prototype.freeActiveMeshes = function () {
            this._activeMeshes.dispose();
            if (this.activeCamera && this.activeCamera._activeMeshes) {
                this.activeCamera._activeMeshes.dispose();
            }
            if (this.activeCameras) {
                for (var i = 0; i < this.activeCameras.length; i++) {
                    var activeCamera = this.activeCameras[i];
                    if (activeCamera && activeCamera._activeMeshes) {
                        activeCamera._activeMeshes.dispose();
                    }
                }
            }
        };
        /**
         * Clear the info related to rendering groups preventing retention points during dispose.
         */
        Scene.prototype.freeRenderingGroups = function () {
            if (this._renderingManager) {
                this._renderingManager.freeRenderingGroups();
            }
            if (this.textures) {
                for (var i = 0; i < this.textures.length; i++) {
                    var texture = this.textures[i];
                    if (texture && texture.renderList) {
                        texture.freeRenderingGroups();
                    }
                }
            }
        };
        /** @hidden */
        Scene.prototype._isInIntermediateRendering = function () {
            return this._intermediateRendering;
        };
        /**
         * Defines the current active mesh candidate provider
         * @param provider defines the provider to use
         */
        Scene.prototype.setActiveMeshCandidateProvider = function (provider) {
            this._activeMeshCandidateProvider = provider;
        };
        /**
         * Gets the current active mesh candidate provider
         * @returns the current active mesh candidate provider
         */
        Scene.prototype.getActiveMeshCandidateProvider = function () {
            return this._activeMeshCandidateProvider;
        };
        /**
         * Use this function to stop evaluating active meshes. The current list will be keep alive between frames
         * @returns the current scene
         */
        Scene.prototype.freezeActiveMeshes = function () {
            if (!this.activeCamera) {
                return this;
            }
            if (!this._frustumPlanes) {
                this.setTransformMatrix(this.activeCamera.getViewMatrix(), this.activeCamera.getProjectionMatrix());
            }
            this._evaluateActiveMeshes();
            this._activeMeshesFrozen = true;
            return this;
        };
        /**
         * Use this function to restart evaluating active meshes on every frame
         * @returns the current scene
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
            var checkIsEnabled = true;
            // Determine mesh candidates
            if (this._activeMeshCandidateProvider !== undefined) {
                // Use _activeMeshCandidateProvider
                meshes = this._activeMeshCandidateProvider.getMeshes(this);
                checkIsEnabled = this._activeMeshCandidateProvider.checksIsEnabled === false;
                if (meshes !== undefined) {
                    len = meshes.length;
                }
                else {
                    len = 0;
                }
            }
            else if (this._selectionOctree !== undefined) {
                // Octree
                var selection = this._selectionOctree.select(this._frustumPlanes);
                meshes = selection.data;
                len = selection.length;
            }
            else {
                // Full scene traversal
                len = this.meshes.length;
                meshes = this.meshes;
            }
            // Check each mesh
            for (var meshIndex = 0, mesh, meshLOD; meshIndex < len; meshIndex++) {
                mesh = meshes[meshIndex];
                if (mesh.isBlocked) {
                    continue;
                }
                this._totalVertices.addCount(mesh.getTotalVertices(), false);
                if (!mesh.isReady() || (checkIsEnabled && !mesh.isEnabled())) {
                    continue;
                }
                mesh.computeWorldMatrix();
                // Intersections
                if (mesh.actionManager && mesh.actionManager.hasSpecificTriggers([LIB.ActionManager.OnIntersectionEnterTrigger, LIB.ActionManager.OnIntersectionExitTrigger])) {
                    this._meshesForIntersections.pushNoDuplicate(mesh);
                }
                // Switch to current LOD
                meshLOD = mesh.getLOD(this.activeCamera);
                if (meshLOD === undefined || meshLOD === null) {
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
            if (this.skeletonsEnabled && mesh.skeleton !== null && mesh.skeleton !== undefined) {
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
            if (mesh !== undefined && mesh !== null
                && mesh.subMeshes !== undefined && mesh.subMeshes !== null && mesh.subMeshes.length > 0) {
                // Submeshes Octrees
                var len;
                var subMeshes;
                if (mesh.useOctreeForRenderingSelection && mesh._submeshesOctree !== undefined && mesh._submeshesOctree !== null) {
                    var intersections = mesh._submeshesOctree.select(this._frustumPlanes);
                    len = intersections.length;
                    subMeshes = intersections.data;
                }
                else {
                    subMeshes = mesh.subMeshes;
                    len = subMeshes.length;
                }
                for (var subIndex = 0, subMesh; subIndex < len; subIndex++) {
                    subMesh = subMeshes[subIndex];
                    this._evaluateSubMesh(subMesh, mesh);
                }
            }
        };
        /**
         * Update the transform matrix to update from the current active camera
         * @param force defines a boolean used to force the update even if cache is up to date
         */
        Scene.prototype.updateTransformMatrix = function (force) {
            if (!this.activeCamera) {
                return;
            }
            this.setTransformMatrix(this.activeCamera.getViewMatrix(), this.activeCamera.getProjectionMatrix(force));
        };
        /**
         * Defines an alternate camera (used mostly in VR-like scenario where two cameras can render the same scene from a slightly different point of view)
         * @param alternateCamera defines the camera to use
         */
        Scene.prototype.updateAlternateTransformMatrix = function (alternateCamera) {
            this._setAlternateTransformMatrix(alternateCamera.getViewMatrix(), alternateCamera.getProjectionMatrix());
        };
        Scene.prototype._renderForCamera = function (camera, rigParent) {
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
            this.onBeforeRenderTargetsRenderObservable.notifyObservers(this);
            var needsRestoreFrameBuffer = false;
            if (camera.customRenderTargets && camera.customRenderTargets.length > 0) {
                this._renderTargets.concatWithNoDuplicate(camera.customRenderTargets);
            }
            if (rigParent && rigParent.customRenderTargets && rigParent.customRenderTargets.length > 0) {
                this._renderTargets.concatWithNoDuplicate(rigParent.customRenderTargets);
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
            // Render EffecttLayer Texture
            var stencilState = this._engine.getStencilBuffer();
            var renderEffects = false;
            var needStencil = false;
            if (this.renderTargetsEnabled && this.effectLayers && this.effectLayers.length > 0) {
                this._intermediateRendering = true;
                for (var i = 0; i < this.effectLayers.length; i++) {
                    var effectLayer = this.effectLayers[i];
                    if (effectLayer.shouldRender() &&
                        (!effectLayer.camera ||
                            (effectLayer.camera.cameraRigMode === LIB.Camera.RIG_MODE_NONE && camera === effectLayer.camera) ||
                            (effectLayer.camera.cameraRigMode !== LIB.Camera.RIG_MODE_NONE && effectLayer.camera._rigCameras.indexOf(camera) > -1))) {
                        renderEffects = true;
                        needStencil = needStencil || effectLayer.needStencil();
                        var renderTarget = effectLayer._mainTexture;
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
            this.onAfterRenderTargetsRenderObservable.notifyObservers(this);
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
            // Activate effect Layer stencil
            if (needStencil) {
                this._engine.setStencilBuffer(true);
            }
            // Render
            this.onBeforeDrawPhaseObservable.notifyObservers(this);
            this._renderingManager.render(null, null, true, true);
            this.onAfterDrawPhaseObservable.notifyObservers(this);
            // Restore effect Layer stencil
            if (needStencil) {
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
            // Effect Layer
            if (renderEffects) {
                engine.setDepthBuffer(false);
                for (var i = 0; i < this.effectLayers.length; i++) {
                    if (this.effectLayers[i].shouldRender()) {
                        this.effectLayers[i].render();
                    }
                }
                engine.setDepthBuffer(true);
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
            // rig cameras
            for (var index = 0; index < camera._rigCameras.length; index++) {
                this._renderForCamera(camera._rigCameras[index], camera);
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
                            if (!sourceMesh.actionManager.hasSpecificTrigger(LIB.ActionManager.OnIntersectionExitTrigger, function (parameter) {
                                var parameterMesh = parameter instanceof LIB.AbstractMesh ? parameter : parameter.mesh;
                                return otherMesh === parameterMesh;
                            }) || action.trigger === LIB.ActionManager.OnIntersectionExitTrigger) {
                                sourceMesh._intersectionsInProgress.splice(currentIntersectionInProgress, 1);
                            }
                        }
                    }
                }
            }
        };
        /**
         * Render the scene
         */
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
            // Update Cameras
            if (this.activeCameras.length > 0) {
                for (var cameraIndex = 0; cameraIndex < this.activeCameras.length; cameraIndex++) {
                    var camera = this.activeCameras[cameraIndex];
                    camera.update();
                    if (camera.cameraRigMode !== LIB.Camera.RIG_MODE_NONE) {
                        // rig cameras
                        for (var index = 0; index < camera._rigCameras.length; index++) {
                            camera._rigCameras[index].update();
                        }
                    }
                }
            }
            else if (this.activeCamera) {
                this.activeCamera.update();
                if (this.activeCamera.cameraRigMode !== LIB.Camera.RIG_MODE_NONE) {
                    // rig cameras
                    for (var index = 0; index < this.activeCamera._rigCameras.length; index++) {
                        this.activeCamera._rigCameras[index].update();
                    }
                }
            }
            // Before render
            this.onBeforeRenderObservable.notifyObservers(this);
            // Customs render targets
            this.onBeforeRenderTargetsRenderObservable.notifyObservers(this);
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
            this.onAfterRenderTargetsRenderObservable.notifyObservers(this);
            this.activeCamera = currentActiveCamera;
            // Procedural textures
            if (this.proceduralTexturesEnabled) {
                LIB.Tools.StartPerformanceCounter("Procedural textures", this.proceduralTextures.length > 0);
                for (var proceduralIndex = 0; proceduralIndex < this.proceduralTextures.length; proceduralIndex++) {
                    var proceduralTexture = this.proceduralTextures[proceduralIndex];
                    if (proceduralTexture._shouldRender()) {
                        proceduralTexture.render();
                    }
                }
                LIB.Tools.EndPerformanceCounter("Procedural textures", this.proceduralTextures.length > 0);
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
            for (var key in this._depthRenderer) {
                this._renderTargets.push(this._depthRenderer[key].getDepthMap());
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
            /**
             * Gets or sets if audio support is enabled
             * @see http://doc.LIBjs.com/how_to/playing_sounds_and_music
             */
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
            /**
             * Gets or sets if audio will be output to headphones
             * @see http://doc.LIBjs.com/how_to/playing_sounds_and_music
             */
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
        /**
         * Creates a depth renderer a given camera which contains a depth map which can be used for post processing.
         * @param camera The camera to create the depth renderer on (default: scene's active camera)
         * @returns the created depth renderer
         */
        Scene.prototype.enableDepthRenderer = function (camera) {
            camera = camera || this.activeCamera;
            if (!camera) {
                throw "No camera available to enable depth renderer";
            }
            if (!this._depthRenderer[camera.id]) {
                var textureType = 0;
                if (this._engine.getCaps().textureHalfFloatRender) {
                    textureType = LIB.Engine.TEXTURETYPE_HALF_FLOAT;
                }
                else if (this._engine.getCaps().textureFloatRender) {
                    textureType = LIB.Engine.TEXTURETYPE_FLOAT;
                }
                else {
                    throw "Depth renderer does not support int texture type";
                }
                this._depthRenderer[camera.id] = new LIB.DepthRenderer(this, textureType, camera);
            }
            return this._depthRenderer[camera.id];
        };
        /**
         * Disables a depth renderer for a given camera
         * @param camera The camera to disable the depth renderer on (default: scene's active camera)
         */
        Scene.prototype.disableDepthRenderer = function (camera) {
            camera = camera || this.activeCamera;
            if (!camera || !this._depthRenderer[camera.id]) {
                return;
            }
            this._depthRenderer[camera.id].dispose();
            delete this._depthRenderer[camera.id];
        };
        /**
         * Enables a GeometryBufferRender and associates it with the scene
         * @param ratio defines the scaling ratio to apply to the renderer (1 by default which means same resolution)
         * @returns the GeometryBufferRenderer
         */
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
        /**
         * Disables the GeometryBufferRender associated with the scene
         */
        Scene.prototype.disableGeometryBufferRenderer = function () {
            if (!this._geometryBufferRenderer) {
                return;
            }
            this._geometryBufferRenderer.dispose();
            this._geometryBufferRenderer = null;
        };
        /**
         * Freeze all materials
         * A frozen material will not be updatable but should be faster to render
         */
        Scene.prototype.freezeMaterials = function () {
            for (var i = 0; i < this.materials.length; i++) {
                this.materials[i].freeze();
            }
        };
        /**
         * Unfreeze all materials
         * A frozen material will not be updatable but should be faster to render
         */
        Scene.prototype.unfreezeMaterials = function () {
            for (var i = 0; i < this.materials.length; i++) {
                this.materials[i].unfreeze();
            }
        };
        /**
         * Releases all held ressources
         */
        Scene.prototype.dispose = function () {
            this.beforeRender = null;
            this.afterRender = null;
            this.skeletons = [];
            this.morphTargetManagers = [];
            this.importedMeshesFiles = new Array();
            this.stopAllAnimations();
            this.resetCachedMaterial();
            for (var key in this._depthRenderer) {
                this._depthRenderer[key].dispose();
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
            this._registeredForLateAnimationBindings.dispose();
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
            this.onBeforeRenderTargetsRenderObservable.clear();
            this.onAfterRenderTargetsRenderObservable.clear();
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
            while (this.effectLayers.length) {
                this.effectLayers[0].dispose();
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
            /**
             * Gets if the scene is already disposed
             */
            get: function () {
                return this._isDisposed;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *  Releases sounds & soundtracks
         */
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
        /**
         * Get the world extend vectors with an optional filter
         *
         * @param filterPredicate the predicate - which meshes should be included when calculating the world size
         * @returns {{ min: Vector3; max: Vector3 }} min and max vectors
         */
        Scene.prototype.getWorldExtends = function (filterPredicate) {
            var min = new LIB.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            var max = new LIB.Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            filterPredicate = filterPredicate || (function () { return true; });
            this.meshes.filter(filterPredicate).forEach(function (mesh) {
                mesh.computeWorldMatrix(true);
                if (!mesh.subMeshes || mesh.subMeshes.length === 0 || mesh.infiniteDistance) {
                    return;
                }
                var boundingInfo = mesh.getBoundingInfo();
                var minBox = boundingInfo.boundingBox.minimumWorld;
                var maxBox = boundingInfo.boundingBox.maximumWorld;
                LIB.Tools.CheckExtends(minBox, min, max);
                LIB.Tools.CheckExtends(maxBox, min, max);
            });
            return {
                min: min,
                max: max
            };
        };
        /**
         * Creates or updates the octree used to boost selection (picking)
         * @see http://doc.LIBjs.com/how_to/optimizing_your_scene_with_octrees
         * @param maxCapacity defines the maximum capacity per leaf
         * @param maxDepth defines the maximum depth of the octree
         * @returns an octree of AbstractMesh
         */
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
        /**
         * Creates a ray that can be used to pick in the scene
         * @param x defines the x coordinate of the origin (on-screen)
         * @param y defines the y coordinate of the origin (on-screen)
         * @param world defines the world matrix to use if you want to pick in object space (instead of world space)
         * @param camera defines the camera to use for the picking
         * @param cameraViewSpace defines if picking will be done in view space (false by default)
         * @returns a Ray
         */
        Scene.prototype.createPickingRay = function (x, y, world, camera, cameraViewSpace) {
            if (cameraViewSpace === void 0) { cameraViewSpace = false; }
            var result = LIB.Ray.Zero();
            this.createPickingRayToRef(x, y, world, result, camera, cameraViewSpace);
            return result;
        };
        /**
         * Creates a ray that can be used to pick in the scene
         * @param x defines the x coordinate of the origin (on-screen)
         * @param y defines the y coordinate of the origin (on-screen)
         * @param world defines the world matrix to use if you want to pick in object space (instead of world space)
         * @param result defines the ray where to store the picking ray
         * @param camera defines the camera to use for the picking
         * @param cameraViewSpace defines if picking will be done in view space (false by default)
         * @returns the current scene
         */
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
        /**
         * Creates a ray that can be used to pick in the scene
         * @param x defines the x coordinate of the origin (on-screen)
         * @param y defines the y coordinate of the origin (on-screen)
         * @param camera defines the camera to use for the picking
         * @returns a Ray
         */
        Scene.prototype.createPickingRayInCameraSpace = function (x, y, camera) {
            var result = LIB.Ray.Zero();
            this.createPickingRayInCameraSpaceToRef(x, y, result, camera);
            return result;
        };
        /**
         * Creates a ray that can be used to pick in the scene
         * @param x defines the x coordinate of the origin (on-screen)
         * @param y defines the y coordinate of the origin (on-screen)
         * @param result defines the ray where to store the picking ray
         * @param camera defines the camera to use for the picking
         * @returns the current scene
         */
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
         * @returns a PickingInfo
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
         * @returns a PickingInfo
         */
        Scene.prototype.pickSprite = function (x, y, predicate, fastCheck, camera) {
            this.createPickingRayInCameraSpaceToRef(x, y, this._tempPickingRay, camera);
            return this._internalPickSprites(this._tempPickingRay, predicate, fastCheck, camera);
        };
        /** Use the given ray to pick a mesh in the scene
         * @param ray The ray to use to pick meshes
         * @param predicate Predicate function used to determine eligible sprites. Can be set to null. In this case, a sprite must have isPickable set to true
         * @param fastCheck Launch a fast check only using the bounding boxes. Can be set to null
         * @returns a PickingInfo
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
         * @returns an array of PickingInfo
         */
        Scene.prototype.multiPick = function (x, y, predicate, camera) {
            var _this = this;
            return this._internalMultiPick(function (world) { return _this.createPickingRay(x, y, world, camera || null); }, predicate);
        };
        /**
         * Launch a ray to try to pick a mesh in the scene
         * @param ray Ray to use
         * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
         * @returns an array of PickingInfo
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
        /**
         * Force the value of meshUnderPointer
         * @param mesh defines the mesh to use
         */
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
        /**
         * Gets the mesh under the pointer
         * @returns a Mesh or null if no mesh is under the pointer
         */
        Scene.prototype.getPointerOverMesh = function () {
            return this._pointerOverMesh;
        };
        /**
         * Force the sprite under the pointer
         * @param sprite defines the sprite to use
         */
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
        /**
         * Gets the sprite under the pointer
         * @returns a Sprite or null if no sprite is under the pointer
         */
        Scene.prototype.getPointerOverSprite = function () {
            return this._pointerOverSprite;
        };
        // Physics
        /**
         * Gets the current physics engine
         * @returns a PhysicsEngine or null if none attached
         */
        Scene.prototype.getPhysicsEngine = function () {
            return this._physicsEngine;
        };
        /**
         * Enables physics to the current scene
         * @param gravity defines the scene's gravity for the physics engine
         * @param plugin defines the physics engine to be used. defaults to OimoJS.
         * @return a boolean indicating if the physics engine was initialized
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
        /**
         * Disables and disposes the physics engine associated with the scene
         */
        Scene.prototype.disablePhysicsEngine = function () {
            if (!this._physicsEngine) {
                return;
            }
            this._physicsEngine.dispose();
            this._physicsEngine = null;
        };
        /**
         * Gets a boolean indicating if there is an active physics engine
         * @returns a boolean indicating if there is an active physics engine
         */
        Scene.prototype.isPhysicsEnabled = function () {
            return this._physicsEngine !== undefined;
        };
        /**
         * Deletes a physics compound impostor
         * @param compound defines the compound to delete
         */
        Scene.prototype.deleteCompoundImpostor = function (compound) {
            var mesh = compound.parts[0].mesh;
            if (mesh.physicsImpostor) {
                mesh.physicsImpostor.dispose( /*true*/);
                mesh.physicsImpostor = null;
            }
        };
        // Misc.
        /** @hidden */
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
            for (var _f = 0, _g = this.effectLayers; _f < _g.length; _f++) {
                var effectLayer = _g[_f];
                effectLayer._rebuild();
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
        /** @hidden */
        Scene.prototype._rebuildTextures = function () {
            for (var _i = 0, _a = this.textures; _i < _a.length; _i++) {
                var texture = _a[_i];
                texture._rebuild();
            }
            this.markAllMaterialsAsDirty(LIB.Material.TextureDirtyFlag);
        };
        /**
         * Creates a default light for the scene.
         * @param replace Whether to replace the existing lights in the scene.
         */
        Scene.prototype.createDefaultLight = function (replace) {
            if (replace === void 0) { replace = false; }
            // Dispose existing light in replace mode.
            if (replace) {
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
        };
        /**
         * Creates a default camera for the scene.
         * @param createArcRotateCamera Whether to create an arc rotate or a free camera.
         * @param replace Whether to replace the existing active camera in the scene.
         * @param attachCameraControls Whether to attach camera controls to the canvas.
         */
        Scene.prototype.createDefaultCamera = function (createArcRotateCamera, replace, attachCameraControls) {
            if (createArcRotateCamera === void 0) { createArcRotateCamera = false; }
            if (replace === void 0) { replace = false; }
            if (attachCameraControls === void 0) { attachCameraControls = false; }
            // Dispose existing camera in replace mode.
            if (replace) {
                if (this.activeCamera) {
                    this.activeCamera.dispose();
                    this.activeCamera = null;
                }
            }
            // Camera
            if (!this.activeCamera) {
                var worldExtends = this.getWorldExtends();
                var worldSize = worldExtends.max.subtract(worldExtends.min);
                var worldCenter = worldExtends.min.add(worldSize.scale(0.5));
                var camera;
                var radius = worldSize.length() * 1.5;
                // empty scene scenario!
                if (!isFinite(radius)) {
                    radius = 1;
                    worldCenter.copyFromFloats(0, 0, 0);
                }
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
        /**
         * Creates a default camera and a default light
         * @param createArcRotateCamera defines that the camera will be an ArcRotateCamera
         * @param replace defines if the camera and/or light will replace the existing ones
         * @param attachCameraControls defines if attachControl will be called on the new camera
         */
        Scene.prototype.createDefaultCameraOrLight = function (createArcRotateCamera, replace, attachCameraControls) {
            if (createArcRotateCamera === void 0) { createArcRotateCamera = false; }
            if (replace === void 0) { replace = false; }
            if (attachCameraControls === void 0) { attachCameraControls = false; }
            this.createDefaultLight(replace);
            this.createDefaultCamera(createArcRotateCamera, replace, attachCameraControls);
        };
        /**
         * Creates a new sky box
         * @see http://doc.LIBjs.com/LIB101/environment#skybox
         * @param environmentTexture defines the texture to use as environment texture
         * @param pbr defines if PBRMaterial must be used instead of StandardMaterial
         * @param scale defines the overall scale of the skybox
         * @param blur defines if blurring must be applied to the environment texture (works only with pbr === true)
         * @param setGlobalEnvTexture defines a boolean indicating that scene.environmentTexture must match the current skybox texture (true by default)
         * @returns a new mesh holding the sky box
         */
        Scene.prototype.createDefaultSkybox = function (environmentTexture, pbr, scale, blur, setGlobalEnvTexture) {
            if (pbr === void 0) { pbr = false; }
            if (scale === void 0) { scale = 1000; }
            if (blur === void 0) { blur = 0; }
            if (setGlobalEnvTexture === void 0) { setGlobalEnvTexture = true; }
            if (!environmentTexture) {
                LIB.Tools.Warn("Can not create default skybox without environment texture.");
                return null;
            }
            if (setGlobalEnvTexture) {
                if (environmentTexture) {
                    this.environmentTexture = environmentTexture;
                }
            }
            // Skybox
            var hdrSkybox = LIB.Mesh.CreateCube("hdrSkyBox", scale, this);
            if (pbr) {
                var hdrSkyboxMaterial = new LIB.PBRMaterial("skyBox", this);
                hdrSkyboxMaterial.backFaceCulling = false;
                hdrSkyboxMaterial.reflectionTexture = environmentTexture.clone();
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
                skyboxMaterial.reflectionTexture = environmentTexture.clone();
                if (skyboxMaterial.reflectionTexture) {
                    skyboxMaterial.reflectionTexture.coordinatesMode = LIB.Texture.SKYBOX_MODE;
                }
                skyboxMaterial.disableLighting = true;
                hdrSkybox.infiniteDistance = true;
                hdrSkybox.material = skyboxMaterial;
            }
            return hdrSkybox;
        };
        /**
         * Creates a new environment
         * @see http://doc.LIBjs.com/LIB101/environment#skybox
         * @param options defines the options you can use to configure the environment
         * @returns the new EnvironmentHelper
         */
        Scene.prototype.createDefaultEnvironment = function (options) {
            if (LIB.EnvironmentHelper) {
                return new LIB.EnvironmentHelper(options, this);
            }
            return null;
        };
        /**
         * Creates a new VREXperienceHelper
         * @see http://doc.LIBjs.com/how_to/webvr_helper
         * @param webVROptions defines the options used to create the new VREXperienceHelper
         * @returns a new VREXperienceHelper
         */
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
        /**
         * Get a list of meshes by tags
         * @param tagsQuery defines the tags query to use
         * @param forEach defines a predicate used to filter results
         * @returns an array of Mesh
         */
        Scene.prototype.getMeshesByTags = function (tagsQuery, forEach) {
            return this._getByTags(this.meshes, tagsQuery, forEach);
        };
        /**
         * Get a list of cameras by tags
         * @param tagsQuery defines the tags query to use
         * @param forEach defines a predicate used to filter results
         * @returns an array of Camera
         */
        Scene.prototype.getCamerasByTags = function (tagsQuery, forEach) {
            return this._getByTags(this.cameras, tagsQuery, forEach);
        };
        /**
         * Get a list of lights by tags
         * @param tagsQuery defines the tags query to use
         * @param forEach defines a predicate used to filter results
         * @returns an array of Light
         */
        Scene.prototype.getLightsByTags = function (tagsQuery, forEach) {
            return this._getByTags(this.lights, tagsQuery, forEach);
        };
        /**
         * Get a list of materials by tags
         * @param tagsQuery defines the tags query to use
         * @param forEach defines a predicate used to filter results
         * @returns an array of Material
         */
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
         * @param flag defines the flag used to specify which material part must be marked as dirty
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
        /** @hidden */
        Scene.prototype._loadFile = function (url, onSuccess, onProgress, useDatabase, useArrayBuffer, onError) {
            var _this = this;
            var request = LIB.Tools.LoadFile(url, onSuccess, onProgress, useDatabase ? this.database : undefined, useArrayBuffer, onError);
            this._activeRequests.push(request);
            request.onCompleteObservable.add(function (request) {
                _this._activeRequests.splice(_this._activeRequests.indexOf(request), 1);
            });
            return request;
        };
        /** @hidden */
        Scene.prototype._loadFileAsync = function (url, useDatabase, useArrayBuffer) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._loadFile(url, function (data) {
                    resolve(data);
                }, undefined, useDatabase, useArrayBuffer, function (request, exception) {
                    reject(exception);
                });
            });
        };
        // Statics
        Scene._FOGMODE_NONE = 0;
        Scene._FOGMODE_EXP = 1;
        Scene._FOGMODE_EXP2 = 2;
        Scene._FOGMODE_LINEAR = 3;
        Scene._uniqueIdCounter = 0;
        /**
         * Gets or sets the minimum deltatime when deterministic lock step is enabled
         * @see http://doc.LIBjs.com/LIB101/animations#deterministic-lockstep
         */
        Scene.MinDeltaTime = 1.0;
        /**
         * Gets or sets the maximum deltatime when deterministic lock step is enabled
         * @see http://doc.LIBjs.com/LIB101/animations#deterministic-lockstep
         */
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
//# sourceMappingURL=LIB.scene.js.map
