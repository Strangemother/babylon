var BABYLON;
(function (BABYLON) {
    var compileShader = function (gl, source, type, defines, shaderVersion) {
        return compileRawShader(gl, shaderVersion + (defines ? defines + "\n" : "") + source, type);
    };
    var compileRawShader = function (gl, source, type) {
        var shader = gl.createShader(type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var log = gl.getShaderInfoLog(shader);
            if (log) {
                throw new Error(log);
            }
        }
        if (!shader) {
            throw new Error("Something went wrong while compile the shader.");
        }
        return shader;
    };
    var getSamplingParameters = function (samplingMode, generateMipMaps, gl) {
        var magFilter = gl.NEAREST;
        var minFilter = gl.NEAREST;
        switch (samplingMode) {
            case BABYLON.Texture.BILINEAR_SAMPLINGMODE:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_NEAREST;
                }
                else {
                    minFilter = gl.LINEAR;
                }
                break;
            case BABYLON.Texture.TRILINEAR_SAMPLINGMODE:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_LINEAR;
                }
                else {
                    minFilter = gl.LINEAR;
                }
                break;
            case BABYLON.Texture.NEAREST_SAMPLINGMODE:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_LINEAR;
                }
                else {
                    minFilter = gl.NEAREST;
                }
                break;
            case BABYLON.Texture.NEAREST_NEAREST_MIPNEAREST:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_NEAREST;
                }
                else {
                    minFilter = gl.NEAREST;
                }
                break;
            case BABYLON.Texture.NEAREST_LINEAR_MIPNEAREST:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_NEAREST;
                }
                else {
                    minFilter = gl.LINEAR;
                }
                break;
            case BABYLON.Texture.NEAREST_LINEAR_MIPLINEAR:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_LINEAR;
                }
                else {
                    minFilter = gl.LINEAR;
                }
                break;
            case BABYLON.Texture.NEAREST_LINEAR:
                magFilter = gl.NEAREST;
                minFilter = gl.LINEAR;
                break;
            case BABYLON.Texture.NEAREST_NEAREST:
                magFilter = gl.NEAREST;
                minFilter = gl.NEAREST;
                break;
            case BABYLON.Texture.LINEAR_NEAREST_MIPNEAREST:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_NEAREST;
                }
                else {
                    minFilter = gl.NEAREST;
                }
                break;
            case BABYLON.Texture.LINEAR_NEAREST_MIPLINEAR:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_LINEAR;
                }
                else {
                    minFilter = gl.NEAREST;
                }
                break;
            case BABYLON.Texture.LINEAR_LINEAR:
                magFilter = gl.LINEAR;
                minFilter = gl.LINEAR;
                break;
            case BABYLON.Texture.LINEAR_NEAREST:
                magFilter = gl.LINEAR;
                minFilter = gl.NEAREST;
                break;
        }
        return {
            min: minFilter,
            mag: magFilter
        };
    };
    var partialLoadImg = function (url, index, loadedImages, scene, onfinish, onErrorCallBack) {
        if (onErrorCallBack === void 0) { onErrorCallBack = null; }
        var img;
        var onload = function () {
            loadedImages[index] = img;
            loadedImages._internalCount++;
            if (scene) {
                scene._removePendingData(img);
            }
            if (loadedImages._internalCount === 6) {
                onfinish(loadedImages);
            }
        };
        var onerror = function (message, exception) {
            if (scene) {
                scene._removePendingData(img);
            }
            if (onErrorCallBack) {
                onErrorCallBack(message, exception);
            }
        };
        img = BABYLON.Tools.LoadImage(url, onload, onerror, scene ? scene.database : null);
        if (scene) {
            scene._addPendingData(img);
        }
    };
    var cascadeLoadImgs = function (rootUrl, scene, onfinish, files, onError) {
        if (onError === void 0) { onError = null; }
        var loadedImages = [];
        loadedImages._internalCount = 0;
        for (var index = 0; index < 6; index++) {
            partialLoadImg(files[index], index, loadedImages, scene, onfinish, onError);
        }
    };
    var BufferPointer = /** @class */ (function () {
        function BufferPointer() {
        }
        return BufferPointer;
    }());
    var InstancingAttributeInfo = /** @class */ (function () {
        function InstancingAttributeInfo() {
        }
        return InstancingAttributeInfo;
    }());
    BABYLON.InstancingAttributeInfo = InstancingAttributeInfo;
    /**
     * Define options used to create a render target texture
     */
    var RenderTargetCreationOptions = /** @class */ (function () {
        function RenderTargetCreationOptions() {
        }
        return RenderTargetCreationOptions;
    }());
    BABYLON.RenderTargetCreationOptions = RenderTargetCreationOptions;
    /**
     * Regroup several parameters relative to the browser in use
     */
    var EngineCapabilities = /** @class */ (function () {
        function EngineCapabilities() {
        }
        return EngineCapabilities;
    }());
    BABYLON.EngineCapabilities = EngineCapabilities;
    /**
     * The engine class is responsible for interfacing with all lower-level APIs such as WebGL and Audio.
     */
    var Engine = /** @class */ (function () {
        /**
         * @constructor
         * @param {HTMLCanvasElement | WebGLRenderingContext} canvasOrContext - the canvas or the webgl context to be used for rendering
         * @param {boolean} [antialias] - enable antialias
         * @param options - further options to be sent to the getContext function
         */
        function Engine(canvasOrContext, antialias, options, adaptToDeviceRatio) {
            if (adaptToDeviceRatio === void 0) { adaptToDeviceRatio = false; }
            var _this = this;
            // Public members
            this.forcePOTTextures = false;
            this.isFullscreen = false;
            this.isPointerLock = false;
            this.cullBackFaces = true;
            this.renderEvenInBackground = true;
            this.preventCacheWipeBetweenFrames = false;
            // To enable/disable IDB support and avoid XHR on .manifest
            this.enableOfflineSupport = false;
            this.scenes = new Array();
            this.postProcesses = new Array();
            // Observables
            /**
             * Observable event triggered each time the rendering canvas is resized
             */
            this.onResizeObservable = new BABYLON.Observable();
            /**
             * Observable event triggered each time the canvas loses focus
             */
            this.onCanvasBlurObservable = new BABYLON.Observable();
            /**
             * Observable event triggered each time the canvas gains focus
             */
            this.onCanvasFocusObservable = new BABYLON.Observable();
            /**
             * Observable event triggered each time the canvas receives pointerout event
             */
            this.onCanvasPointerOutObservable = new BABYLON.Observable();
            /**
             * Observable event triggered before each texture is initialized
             */
            this.onBeforeTextureInitObservable = new BABYLON.Observable();
            //WebVR
            this._vrDisplay = undefined;
            this._vrSupported = false;
            this._vrExclusivePointerMode = false;
            // Uniform buffers list
            this.disableUniformBuffers = false;
            this._uniformBuffers = new Array();
            // Observables
            /**
             * Observable raised when the engine begins a new frame
             */
            this.onBeginFrameObservable = new BABYLON.Observable();
            /**
             * Observable raised when the engine ends the current frame
             */
            this.onEndFrameObservable = new BABYLON.Observable();
            /**
             * Observable raised when the engine is about to compile a shader
             */
            this.onBeforeShaderCompilationObservable = new BABYLON.Observable();
            /**
             * Observable raised when the engine has jsut compiled a shader
             */
            this.onAfterShaderCompilationObservable = new BABYLON.Observable();
            this._windowIsBackground = false;
            this._webGLVersion = 1.0;
            this._badOS = false;
            this._badDesktopOS = false;
            this.onVRDisplayChangedObservable = new BABYLON.Observable();
            this.onVRRequestPresentComplete = new BABYLON.Observable();
            this.onVRRequestPresentStart = new BABYLON.Observable();
            this._colorWrite = true;
            this._drawCalls = new BABYLON.PerfCounter();
            this._textureCollisions = new BABYLON.PerfCounter();
            this._renderingQueueLaunched = false;
            this._activeRenderLoops = new Array();
            // Deterministic lockstepMaxSteps
            this._deterministicLockstep = false;
            this._lockstepMaxSteps = 4;
            // Lost context
            this.onContextLostObservable = new BABYLON.Observable();
            this.onContextRestoredObservable = new BABYLON.Observable();
            this._contextWasLost = false;
            this._doNotHandleContextLost = false;
            // FPS
            this._performanceMonitor = new BABYLON.PerformanceMonitor();
            this._fps = 60;
            this._deltaTime = 0;
            /**
             * Turn this value on if you want to pause FPS computation when in background
             */
            this.disablePerformanceMonitorInBackground = false;
            // States
            this._depthCullingState = new BABYLON.Internals._DepthCullingState();
            this._stencilState = new BABYLON.Internals._StencilState();
            this._alphaState = new BABYLON.Internals._AlphaState();
            this._alphaMode = Engine.ALPHA_DISABLE;
            // Cache
            this._internalTexturesCache = new Array();
            this._boundTexturesCache = {};
            this._boundTexturesStack = new Array();
            this._compiledEffects = {};
            this._vertexAttribArraysEnabled = [];
            this._uintIndicesCurrentlySet = false;
            this._currentBoundBuffer = new Array();
            this._currentBufferPointers = new Array();
            this._currentInstanceLocations = new Array();
            this._currentInstanceBuffers = new Array();
            this._vaoRecordInProgress = false;
            this._mustWipeVertexAttributes = false;
            this._nextFreeTextureSlots = new Array();
            this._activeRequests = new Array();
            // Hardware supported Compressed Textures
            this._texturesSupported = new Array();
            this._onVRFullScreenTriggered = function () {
                if (_this._vrDisplay && _this._vrDisplay.isPresenting) {
                    //get the old size before we change
                    _this._oldSize = new BABYLON.Size(_this.getRenderWidth(), _this.getRenderHeight());
                    _this._oldHardwareScaleFactor = _this.getHardwareScalingLevel();
                    //get the width and height, change the render size
                    var leftEye = _this._vrDisplay.getEyeParameters('left');
                    _this.setHardwareScalingLevel(1);
                    _this.setSize(leftEye.renderWidth * 2, leftEye.renderHeight);
                }
                else {
                    _this.setHardwareScalingLevel(_this._oldHardwareScaleFactor);
                    _this.setSize(_this._oldSize.width, _this._oldSize.height);
                }
            };
            this._boundUniforms = {};
            var canvas = null;
            Engine.Instances.push(this);
            if (!canvasOrContext) {
                return;
            }
            options = options || {};
            if (canvasOrContext.getContext) {
                canvas = canvasOrContext;
                this._renderingCanvas = canvas;
                if (antialias != null) {
                    options.antialias = antialias;
                }
                if (options.deterministicLockstep === undefined) {
                    options.deterministicLockstep = false;
                }
                if (options.lockstepMaxSteps === undefined) {
                    options.lockstepMaxSteps = 4;
                }
                if (options.preserveDrawingBuffer === undefined) {
                    options.preserveDrawingBuffer = false;
                }
                if (options.audioEngine === undefined) {
                    options.audioEngine = true;
                }
                if (options.stencil === undefined) {
                    options.stencil = true;
                }
                this._deterministicLockstep = options.deterministicLockstep;
                this._lockstepMaxSteps = options.lockstepMaxSteps;
                this._doNotHandleContextLost = options.doNotHandleContextLost ? true : false;
                // Exceptions
                if (!options.disableWebGL2Support) {
                    if (navigator && navigator.userAgent) {
                        var ua = navigator.userAgent;
                        for (var _i = 0, _a = Engine.WebGL2UniformBuffersExceptionList; _i < _a.length; _i++) {
                            var exception = _a[_i];
                            if (ua.indexOf(exception) > -1) {
                                this.disableUniformBuffers = true;
                                break;
                            }
                        }
                    }
                }
                // GL
                if (!options.disableWebGL2Support) {
                    try {
                        this._gl = (canvas.getContext("webgl2", options) || canvas.getContext("experimental-webgl2", options));
                        if (this._gl) {
                            this._webGLVersion = 2.0;
                        }
                    }
                    catch (e) {
                        // Do nothing
                    }
                }
                if (!this._gl) {
                    if (!canvas) {
                        throw new Error("The provided canvas is null or undefined.");
                    }
                    try {
                        this._gl = (canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options));
                    }
                    catch (e) {
                        throw new Error("WebGL not supported");
                    }
                }
                if (!this._gl) {
                    throw new Error("WebGL not supported");
                }
                this._onCanvasFocus = function () {
                    _this.onCanvasFocusObservable.notifyObservers(_this);
                };
                this._onCanvasBlur = function () {
                    _this.onCanvasBlurObservable.notifyObservers(_this);
                };
                canvas.addEventListener("focus", this._onCanvasFocus);
                canvas.addEventListener("blur", this._onCanvasBlur);
                this._onBlur = function () {
                    if (_this.disablePerformanceMonitorInBackground) {
                        _this._performanceMonitor.disable();
                    }
                    _this._windowIsBackground = true;
                };
                this._onFocus = function () {
                    if (_this.disablePerformanceMonitorInBackground) {
                        _this._performanceMonitor.enable();
                    }
                    _this._windowIsBackground = false;
                };
                this._onCanvasPointerOut = function () {
                    _this.onCanvasPointerOutObservable.notifyObservers(_this);
                };
                window.addEventListener("blur", this._onBlur);
                window.addEventListener("focus", this._onFocus);
                canvas.addEventListener("pointerout", this._onCanvasPointerOut);
                // Context lost
                if (!this._doNotHandleContextLost) {
                    this._onContextLost = function (evt) {
                        evt.preventDefault();
                        _this._contextWasLost = true;
                        BABYLON.Tools.Warn("WebGL context lost.");
                        _this.onContextLostObservable.notifyObservers(_this);
                    };
                    this._onContextRestored = function (evt) {
                        // Adding a timeout to avoid race condition at browser level
                        setTimeout(function () {
                            // Rebuild gl context
                            _this._initGLContext();
                            // Rebuild effects
                            _this._rebuildEffects();
                            // Rebuild textures
                            _this._rebuildInternalTextures();
                            // Rebuild buffers
                            _this._rebuildBuffers();
                            // Cache
                            _this.wipeCaches(true);
                            BABYLON.Tools.Warn("WebGL context successfully restored.");
                            _this.onContextRestoredObservable.notifyObservers(_this);
                            _this._contextWasLost = false;
                        }, 0);
                    };
                    canvas.addEventListener("webglcontextlost", this._onContextLost, false);
                    canvas.addEventListener("webglcontextrestored", this._onContextRestored, false);
                }
            }
            else {
                this._gl = canvasOrContext;
                this._renderingCanvas = this._gl.canvas;
                if (this._gl.renderbufferStorageMultisample) {
                    this._webGLVersion = 2.0;
                }
                options.stencil = this._gl.getContextAttributes().stencil;
            }
            // Viewport
            var limitDeviceRatio = options.limitDeviceRatio || window.devicePixelRatio || 1.0;
            this._hardwareScalingLevel = adaptToDeviceRatio ? 1.0 / Math.min(limitDeviceRatio, window.devicePixelRatio || 1.0) : 1.0;
            this.resize();
            this._isStencilEnable = options.stencil ? true : false;
            this._initGLContext();
            if (canvas) {
                // Fullscreen
                this._onFullscreenChange = function () {
                    if (document.fullscreen !== undefined) {
                        _this.isFullscreen = document.fullscreen;
                    }
                    else if (document.mozFullScreen !== undefined) {
                        _this.isFullscreen = document.mozFullScreen;
                    }
                    else if (document.webkitIsFullScreen !== undefined) {
                        _this.isFullscreen = document.webkitIsFullScreen;
                    }
                    else if (document.msIsFullScreen !== undefined) {
                        _this.isFullscreen = document.msIsFullScreen;
                    }
                    // Pointer lock
                    if (_this.isFullscreen && _this._pointerLockRequested && canvas) {
                        canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.msRequestPointerLock ||
                            canvas.mozRequestPointerLock ||
                            canvas.webkitRequestPointerLock;
                        if (canvas.requestPointerLock) {
                            canvas.requestPointerLock();
                        }
                    }
                };
                document.addEventListener("fullscreenchange", this._onFullscreenChange, false);
                document.addEventListener("mozfullscreenchange", this._onFullscreenChange, false);
                document.addEventListener("webkitfullscreenchange", this._onFullscreenChange, false);
                document.addEventListener("msfullscreenchange", this._onFullscreenChange, false);
                // Pointer lock
                this._onPointerLockChange = function () {
                    _this.isPointerLock = (document.mozPointerLockElement === canvas ||
                        document.webkitPointerLockElement === canvas ||
                        document.msPointerLockElement === canvas ||
                        document.pointerLockElement === canvas);
                };
                document.addEventListener("pointerlockchange", this._onPointerLockChange, false);
                document.addEventListener("mspointerlockchange", this._onPointerLockChange, false);
                document.addEventListener("mozpointerlockchange", this._onPointerLockChange, false);
                document.addEventListener("webkitpointerlockchange", this._onPointerLockChange, false);
                this._onVRDisplayPointerRestricted = function () {
                    if (canvas) {
                        canvas.requestPointerLock();
                    }
                };
                this._onVRDisplayPointerUnrestricted = function () {
                    document.exitPointerLock();
                };
                window.addEventListener('vrdisplaypointerrestricted', this._onVRDisplayPointerRestricted, false);
                window.addEventListener('vrdisplaypointerunrestricted', this._onVRDisplayPointerUnrestricted, false);
            }
            if (options.audioEngine && BABYLON.AudioEngine && !Engine.audioEngine) {
                Engine.audioEngine = new BABYLON.AudioEngine();
            }
            // Prepare buffer pointers
            for (var i = 0; i < this._caps.maxVertexAttribs; i++) {
                this._currentBufferPointers[i] = new BufferPointer();
            }
            // Load WebVR Devices
            if (options.autoEnableWebVR) {
                this.initWebVR();
            }
            // Detect if we are running on a faulty buggy OS.
            this._badOS = /iPad/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent);
            // Detect if we are running on a faulty buggy desktop OS.
            this._badDesktopOS = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            BABYLON.Tools.Log("Babylon.js engine (v" + Engine.Version + ") launched");
            this.enableOfflineSupport = (BABYLON.Database !== undefined);
        }
        Object.defineProperty(Engine, "LastCreatedEngine", {
            get: function () {
                if (Engine.Instances.length === 0) {
                    return null;
                }
                return Engine.Instances[Engine.Instances.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "LastCreatedScene", {
            get: function () {
                var lastCreatedEngine = Engine.LastCreatedEngine;
                if (!lastCreatedEngine) {
                    return null;
                }
                if (lastCreatedEngine.scenes.length === 0) {
                    return null;
                }
                return lastCreatedEngine.scenes[lastCreatedEngine.scenes.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Will flag all materials in all scenes in all engines as dirty to trigger new shader compilation
         */
        Engine.MarkAllMaterialsAsDirty = function (flag, predicate) {
            for (var engineIndex = 0; engineIndex < Engine.Instances.length; engineIndex++) {
                var engine = Engine.Instances[engineIndex];
                for (var sceneIndex = 0; sceneIndex < engine.scenes.length; sceneIndex++) {
                    engine.scenes[sceneIndex].markAllMaterialsAsDirty(flag, predicate);
                }
            }
        };
        Object.defineProperty(Engine, "NEVER", {
            get: function () {
                return Engine._NEVER;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALWAYS", {
            get: function () {
                return Engine._ALWAYS;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "LESS", {
            get: function () {
                return Engine._LESS;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "EQUAL", {
            get: function () {
                return Engine._EQUAL;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "LEQUAL", {
            get: function () {
                return Engine._LEQUAL;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "GREATER", {
            get: function () {
                return Engine._GREATER;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "GEQUAL", {
            get: function () {
                return Engine._GEQUAL;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "NOTEQUAL", {
            get: function () {
                return Engine._NOTEQUAL;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "KEEP", {
            get: function () {
                return Engine._KEEP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "REPLACE", {
            get: function () {
                return Engine._REPLACE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "INCR", {
            get: function () {
                return Engine._INCR;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "DECR", {
            get: function () {
                return Engine._DECR;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "INVERT", {
            get: function () {
                return Engine._INVERT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "INCR_WRAP", {
            get: function () {
                return Engine._INCR_WRAP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "DECR_WRAP", {
            get: function () {
                return Engine._DECR_WRAP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_DISABLE", {
            get: function () {
                return Engine._ALPHA_DISABLE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_ONEONE", {
            get: function () {
                return Engine._ALPHA_ONEONE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_ADD", {
            get: function () {
                return Engine._ALPHA_ADD;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_COMBINE", {
            get: function () {
                return Engine._ALPHA_COMBINE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_SUBTRACT", {
            get: function () {
                return Engine._ALPHA_SUBTRACT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_MULTIPLY", {
            get: function () {
                return Engine._ALPHA_MULTIPLY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_MAXIMIZED", {
            get: function () {
                return Engine._ALPHA_MAXIMIZED;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_PREMULTIPLIED", {
            get: function () {
                return Engine._ALPHA_PREMULTIPLIED;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_PREMULTIPLIED_PORTERDUFF", {
            get: function () {
                return Engine._ALPHA_PREMULTIPLIED_PORTERDUFF;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_INTERPOLATE", {
            get: function () {
                return Engine._ALPHA_INTERPOLATE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "ALPHA_SCREENMODE", {
            get: function () {
                return Engine._ALPHA_SCREENMODE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "DELAYLOADSTATE_NONE", {
            get: function () {
                return Engine._DELAYLOADSTATE_NONE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "DELAYLOADSTATE_LOADED", {
            get: function () {
                return Engine._DELAYLOADSTATE_LOADED;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "DELAYLOADSTATE_LOADING", {
            get: function () {
                return Engine._DELAYLOADSTATE_LOADING;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "DELAYLOADSTATE_NOTLOADED", {
            get: function () {
                return Engine._DELAYLOADSTATE_NOTLOADED;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "TEXTUREFORMAT_ALPHA", {
            get: function () {
                return Engine._TEXTUREFORMAT_ALPHA;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "TEXTUREFORMAT_LUMINANCE", {
            get: function () {
                return Engine._TEXTUREFORMAT_LUMINANCE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "TEXTUREFORMAT_LUMINANCE_ALPHA", {
            get: function () {
                return Engine._TEXTUREFORMAT_LUMINANCE_ALPHA;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "TEXTUREFORMAT_RGB", {
            get: function () {
                return Engine._TEXTUREFORMAT_RGB;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "TEXTUREFORMAT_RGBA", {
            get: function () {
                return Engine._TEXTUREFORMAT_RGBA;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "TEXTURETYPE_UNSIGNED_INT", {
            get: function () {
                return Engine._TEXTURETYPE_UNSIGNED_INT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "TEXTURETYPE_FLOAT", {
            get: function () {
                return Engine._TEXTURETYPE_FLOAT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "TEXTURETYPE_HALF_FLOAT", {
            get: function () {
                return Engine._TEXTURETYPE_HALF_FLOAT;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "SCALEMODE_FLOOR", {
            get: function () {
                return Engine._SCALEMODE_FLOOR;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "SCALEMODE_NEAREST", {
            get: function () {
                return Engine._SCALEMODE_NEAREST;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "SCALEMODE_CEILING", {
            get: function () {
                return Engine._SCALEMODE_CEILING;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine, "Version", {
            get: function () {
                return "3.2.0-alpha1";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "isInVRExclusivePointerMode", {
            get: function () {
                return this._vrExclusivePointerMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "supportsUniformBuffers", {
            get: function () {
                return this.webGLVersion > 1 && !this.disableUniformBuffers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "needPOTTextures", {
            get: function () {
                return this._webGLVersion < 2 || this.forcePOTTextures;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "badOS", {
            get: function () {
                return this._badOS;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "badDesktopOS", {
            get: function () {
                return this._badDesktopOS;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "performanceMonitor", {
            get: function () {
                return this._performanceMonitor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "texturesSupported", {
            get: function () {
                return this._texturesSupported;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "textureFormatInUse", {
            get: function () {
                return this._textureFormatInUse;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "currentViewport", {
            get: function () {
                return this._cachedViewport;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "emptyTexture", {
            // Empty texture
            get: function () {
                if (!this._emptyTexture) {
                    this._emptyTexture = this.createRawTexture(new Uint8Array(4), 1, 1, Engine.TEXTUREFORMAT_RGBA, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
                }
                return this._emptyTexture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "emptyTexture3D", {
            get: function () {
                if (!this._emptyTexture3D) {
                    this._emptyTexture3D = this.createRawTexture3D(new Uint8Array(4), 1, 1, 1, Engine.TEXTUREFORMAT_RGBA, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
                }
                return this._emptyTexture3D;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "emptyCubeTexture", {
            get: function () {
                if (!this._emptyCubeTexture) {
                    var faceData = new Uint8Array(4);
                    var cubeData = [faceData, faceData, faceData, faceData, faceData, faceData];
                    this._emptyCubeTexture = this.createRawCubeTexture(cubeData, 1, Engine.TEXTUREFORMAT_RGBA, Engine.TEXTURETYPE_UNSIGNED_INT, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
                }
                return this._emptyCubeTexture;
            },
            enumerable: true,
            configurable: true
        });
        Engine.prototype._rebuildInternalTextures = function () {
            var currentState = this._internalTexturesCache.slice(); // Do a copy because the rebuild will add proxies
            for (var _i = 0, currentState_1 = currentState; _i < currentState_1.length; _i++) {
                var internalTexture = currentState_1[_i];
                internalTexture._rebuild();
            }
        };
        Engine.prototype._rebuildEffects = function () {
            for (var key in this._compiledEffects) {
                var effect = this._compiledEffects[key];
                effect._prepareEffect();
            }
            BABYLON.Effect.ResetCache();
        };
        Engine.prototype._rebuildBuffers = function () {
            // Index / Vertex
            for (var _i = 0, _a = this.scenes; _i < _a.length; _i++) {
                var scene = _a[_i];
                scene.resetCachedMaterial();
                scene._rebuildGeometries();
                scene._rebuildTextures();
            }
            // Uniforms
            for (var _b = 0, _c = this._uniformBuffers; _b < _c.length; _b++) {
                var uniformBuffer = _c[_b];
                uniformBuffer._rebuild();
            }
        };
        Engine.prototype._initGLContext = function () {
            // Caps
            this._caps = new EngineCapabilities();
            this._caps.maxTexturesImageUnits = this._gl.getParameter(this._gl.MAX_TEXTURE_IMAGE_UNITS);
            this._caps.maxCombinedTexturesImageUnits = this._gl.getParameter(this._gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
            this._caps.maxVertexTextureImageUnits = this._gl.getParameter(this._gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
            this._caps.maxTextureSize = this._gl.getParameter(this._gl.MAX_TEXTURE_SIZE);
            this._caps.maxCubemapTextureSize = this._gl.getParameter(this._gl.MAX_CUBE_MAP_TEXTURE_SIZE);
            this._caps.maxRenderTextureSize = this._gl.getParameter(this._gl.MAX_RENDERBUFFER_SIZE);
            this._caps.maxVertexAttribs = this._gl.getParameter(this._gl.MAX_VERTEX_ATTRIBS);
            this._caps.maxVaryingVectors = this._gl.getParameter(this._gl.MAX_VARYING_VECTORS);
            this._caps.maxFragmentUniformVectors = this._gl.getParameter(this._gl.MAX_FRAGMENT_UNIFORM_VECTORS);
            this._caps.maxVertexUniformVectors = this._gl.getParameter(this._gl.MAX_VERTEX_UNIFORM_VECTORS);
            // Infos
            this._glVersion = this._gl.getParameter(this._gl.VERSION);
            var rendererInfo = this._gl.getExtension("WEBGL_debug_renderer_info");
            if (rendererInfo != null) {
                this._glRenderer = this._gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL);
                this._glVendor = this._gl.getParameter(rendererInfo.UNMASKED_VENDOR_WEBGL);
            }
            if (!this._glVendor) {
                this._glVendor = "Unknown vendor";
            }
            if (!this._glRenderer) {
                this._glRenderer = "Unknown renderer";
            }
            // Constants
            this._gl.HALF_FLOAT_OES = 0x8D61; // Half floating-point type (16-bit).
            if (this._gl.RGBA16F !== 0x881A) {
                this._gl.RGBA16F = 0x881A; // RGBA 16-bit floating-point color-renderable internal sized format.
            }
            if (this._gl.RGBA32F !== 0x8814) {
                this._gl.RGBA32F = 0x8814; // RGBA 32-bit floating-point color-renderable internal sized format.
            }
            if (this._gl.DEPTH24_STENCIL8 !== 35056) {
                this._gl.DEPTH24_STENCIL8 = 35056;
            }
            // Extensions
            this._caps.standardDerivatives = this._webGLVersion > 1 || (this._gl.getExtension('OES_standard_derivatives') !== null);
            this._caps.astc = this._gl.getExtension('WEBGL_compressed_texture_astc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_astc');
            this._caps.s3tc = this._gl.getExtension('WEBGL_compressed_texture_s3tc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
            this._caps.pvrtc = this._gl.getExtension('WEBGL_compressed_texture_pvrtc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
            this._caps.etc1 = this._gl.getExtension('WEBGL_compressed_texture_etc1') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1');
            this._caps.etc2 = this._gl.getExtension('WEBGL_compressed_texture_etc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc') ||
                this._gl.getExtension('WEBGL_compressed_texture_es3_0'); // also a requirement of OpenGL ES 3
            this._caps.textureAnisotropicFilterExtension = this._gl.getExtension('EXT_texture_filter_anisotropic') || this._gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || this._gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
            this._caps.maxAnisotropy = this._caps.textureAnisotropicFilterExtension ? this._gl.getParameter(this._caps.textureAnisotropicFilterExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
            this._caps.uintIndices = this._webGLVersion > 1 || this._gl.getExtension('OES_element_index_uint') !== null;
            this._caps.fragmentDepthSupported = this._webGLVersion > 1 || this._gl.getExtension('EXT_frag_depth') !== null;
            this._caps.highPrecisionShaderSupported = true;
            this._caps.timerQuery = this._gl.getExtension('EXT_disjoint_timer_query_webgl2') || this._gl.getExtension("EXT_disjoint_timer_query");
            if (this._caps.timerQuery) {
                if (this._webGLVersion === 1) {
                    this._gl.getQuery = this._caps.timerQuery.getQueryEXT.bind(this._caps.timerQuery);
                }
                this._caps.canUseTimestampForTimerQuery = this._gl.getQuery(this._caps.timerQuery.TIMESTAMP_EXT, this._caps.timerQuery.QUERY_COUNTER_BITS_EXT) > 0;
            }
            // Checks if some of the format renders first to allow the use of webgl inspector.
            this._caps.colorBufferFloat = this._webGLVersion > 1 && this._gl.getExtension('EXT_color_buffer_float');
            this._caps.textureFloat = this._webGLVersion > 1 || this._gl.getExtension('OES_texture_float');
            this._caps.textureFloatLinearFiltering = this._caps.textureFloat && this._gl.getExtension('OES_texture_float_linear');
            this._caps.textureFloatRender = this._caps.textureFloat && this._canRenderToFloatFramebuffer();
            this._caps.textureHalfFloat = this._webGLVersion > 1 || this._gl.getExtension('OES_texture_half_float');
            this._caps.textureHalfFloatLinearFiltering = this._webGLVersion > 1 || (this._caps.textureHalfFloat && this._gl.getExtension('OES_texture_half_float_linear'));
            if (this._webGLVersion > 1) {
                this._gl.HALF_FLOAT_OES = 0x140B;
            }
            this._caps.textureHalfFloatRender = this._caps.textureHalfFloat && this._canRenderToHalfFloatFramebuffer();
            this._caps.textureLOD = this._webGLVersion > 1 || this._gl.getExtension('EXT_shader_texture_lod');
            // Draw buffers
            if (this._webGLVersion > 1) {
                this._caps.drawBuffersExtension = true;
            }
            else {
                var drawBuffersExtension = this._gl.getExtension('WEBGL_draw_buffers');
                if (drawBuffersExtension !== null) {
                    this._caps.drawBuffersExtension = true;
                    this._gl.drawBuffers = drawBuffersExtension.drawBuffersWEBGL.bind(drawBuffersExtension);
                    this._gl.DRAW_FRAMEBUFFER = this._gl.FRAMEBUFFER;
                    for (var i = 0; i < 16; i++) {
                        this._gl["COLOR_ATTACHMENT" + i + "_WEBGL"] = drawBuffersExtension["COLOR_ATTACHMENT" + i + "_WEBGL"];
                    }
                }
                else {
                    this._caps.drawBuffersExtension = false;
                }
            }
            // Depth Texture
            if (this._webGLVersion > 1) {
                this._caps.depthTextureExtension = true;
            }
            else {
                var depthTextureExtension = this._gl.getExtension('WEBGL_depth_texture');
                if (depthTextureExtension != null) {
                    this._caps.depthTextureExtension = true;
                }
            }
            // Vertex array object
            if (this._webGLVersion > 1) {
                this._caps.vertexArrayObject = true;
            }
            else {
                var vertexArrayObjectExtension = this._gl.getExtension('OES_vertex_array_object');
                if (vertexArrayObjectExtension != null) {
                    this._caps.vertexArrayObject = true;
                    this._gl.createVertexArray = vertexArrayObjectExtension.createVertexArrayOES.bind(vertexArrayObjectExtension);
                    this._gl.bindVertexArray = vertexArrayObjectExtension.bindVertexArrayOES.bind(vertexArrayObjectExtension);
                    this._gl.deleteVertexArray = vertexArrayObjectExtension.deleteVertexArrayOES.bind(vertexArrayObjectExtension);
                }
                else {
                    this._caps.vertexArrayObject = false;
                }
            }
            // Instances count
            if (this._webGLVersion > 1) {
                this._caps.instancedArrays = true;
            }
            else {
                var instanceExtension = this._gl.getExtension('ANGLE_instanced_arrays');
                if (instanceExtension != null) {
                    this._caps.instancedArrays = true;
                    this._gl.drawArraysInstanced = instanceExtension.drawArraysInstancedANGLE.bind(instanceExtension);
                    this._gl.drawElementsInstanced = instanceExtension.drawElementsInstancedANGLE.bind(instanceExtension);
                    this._gl.vertexAttribDivisor = instanceExtension.vertexAttribDivisorANGLE.bind(instanceExtension);
                }
                else {
                    this._caps.instancedArrays = false;
                }
            }
            // Intelligently add supported compressed formats in order to check for.
            // Check for ASTC support first as it is most powerful and to be very cross platform.
            // Next PVRTC & DXT, which are probably superior to ETC1/2.
            // Likely no hardware which supports both PVR & DXT, so order matters little.
            // ETC2 is newer and handles ETC1 (no alpha capability), so check for first.
            if (this._caps.astc)
                this.texturesSupported.push('-astc.ktx');
            if (this._caps.s3tc)
                this.texturesSupported.push('-dxt.ktx');
            if (this._caps.pvrtc)
                this.texturesSupported.push('-pvrtc.ktx');
            if (this._caps.etc2)
                this.texturesSupported.push('-etc2.ktx');
            if (this._caps.etc1)
                this.texturesSupported.push('-etc1.ktx');
            if (this._gl.getShaderPrecisionFormat) {
                var highp = this._gl.getShaderPrecisionFormat(this._gl.FRAGMENT_SHADER, this._gl.HIGH_FLOAT);
                if (highp) {
                    this._caps.highPrecisionShaderSupported = highp.precision !== 0;
                }
            }
            // Depth buffer
            this.setDepthBuffer(true);
            this.setDepthFunctionToLessOrEqual();
            this.setDepthWrite(true);
            // Texture maps
            for (var slot = 0; slot < this._caps.maxTexturesImageUnits; slot++) {
                this._nextFreeTextureSlots.push(slot);
            }
        };
        Object.defineProperty(Engine.prototype, "webGLVersion", {
            get: function () {
                return this._webGLVersion;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "isStencilEnable", {
            /**
             * Returns true if the stencil buffer has been enabled through the creation option of the context.
             */
            get: function () {
                return this._isStencilEnable;
            },
            enumerable: true,
            configurable: true
        });
        Engine.prototype._prepareWorkingCanvas = function () {
            if (this._workingCanvas) {
                return;
            }
            this._workingCanvas = document.createElement("canvas");
            var context = this._workingCanvas.getContext("2d");
            if (context) {
                this._workingContext = context;
            }
        };
        Engine.prototype.resetTextureCache = function () {
            for (var key in this._boundTexturesCache) {
                var boundTexture = this._boundTexturesCache[key];
                if (boundTexture) {
                    this._removeDesignatedSlot(boundTexture);
                }
                this._boundTexturesCache[key] = null;
            }
            this._nextFreeTextureSlots = [];
            for (var slot = 0; slot < this._caps.maxTexturesImageUnits; slot++) {
                this._nextFreeTextureSlots.push(slot);
            }
            this._activeChannel = -1;
        };
        Engine.prototype.isDeterministicLockStep = function () {
            return this._deterministicLockstep;
        };
        Engine.prototype.getLockstepMaxSteps = function () {
            return this._lockstepMaxSteps;
        };
        Engine.prototype.getGlInfo = function () {
            return {
                vendor: this._glVendor,
                renderer: this._glRenderer,
                version: this._glVersion
            };
        };
        Engine.prototype.getAspectRatio = function (camera, useScreen) {
            if (useScreen === void 0) { useScreen = false; }
            var viewport = camera.viewport;
            return (this.getRenderWidth(useScreen) * viewport.width) / (this.getRenderHeight(useScreen) * viewport.height);
        };
        Engine.prototype.getRenderWidth = function (useScreen) {
            if (useScreen === void 0) { useScreen = false; }
            if (!useScreen && this._currentRenderTarget) {
                return this._currentRenderTarget.width;
            }
            return this._gl.drawingBufferWidth;
        };
        Engine.prototype.getRenderHeight = function (useScreen) {
            if (useScreen === void 0) { useScreen = false; }
            if (!useScreen && this._currentRenderTarget) {
                return this._currentRenderTarget.height;
            }
            return this._gl.drawingBufferHeight;
        };
        Engine.prototype.getRenderingCanvas = function () {
            return this._renderingCanvas;
        };
        Engine.prototype.getRenderingCanvasClientRect = function () {
            if (!this._renderingCanvas) {
                return null;
            }
            return this._renderingCanvas.getBoundingClientRect();
        };
        Engine.prototype.setHardwareScalingLevel = function (level) {
            this._hardwareScalingLevel = level;
            this.resize();
        };
        Engine.prototype.getHardwareScalingLevel = function () {
            return this._hardwareScalingLevel;
        };
        Engine.prototype.getLoadedTexturesCache = function () {
            return this._internalTexturesCache;
        };
        Engine.prototype.getCaps = function () {
            return this._caps;
        };
        Object.defineProperty(Engine.prototype, "drawCalls", {
            /** The number of draw calls submitted last frame */
            get: function () {
                BABYLON.Tools.Warn("drawCalls is deprecated. Please use SceneInstrumentation class");
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "drawCallsPerfCounter", {
            get: function () {
                BABYLON.Tools.Warn("drawCallsPerfCounter is deprecated. Please use SceneInstrumentation class");
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Engine.prototype.getDepthFunction = function () {
            return this._depthCullingState.depthFunc;
        };
        Engine.prototype.setDepthFunction = function (depthFunc) {
            this._depthCullingState.depthFunc = depthFunc;
        };
        Engine.prototype.setDepthFunctionToGreater = function () {
            this._depthCullingState.depthFunc = this._gl.GREATER;
        };
        Engine.prototype.setDepthFunctionToGreaterOrEqual = function () {
            this._depthCullingState.depthFunc = this._gl.GEQUAL;
        };
        Engine.prototype.setDepthFunctionToLess = function () {
            this._depthCullingState.depthFunc = this._gl.LESS;
        };
        Engine.prototype.setDepthFunctionToLessOrEqual = function () {
            this._depthCullingState.depthFunc = this._gl.LEQUAL;
        };
        Engine.prototype.getStencilBuffer = function () {
            return this._stencilState.stencilTest;
        };
        Engine.prototype.setStencilBuffer = function (enable) {
            this._stencilState.stencilTest = enable;
        };
        Engine.prototype.getStencilMask = function () {
            return this._stencilState.stencilMask;
        };
        Engine.prototype.setStencilMask = function (mask) {
            this._stencilState.stencilMask = mask;
        };
        Engine.prototype.getStencilFunction = function () {
            return this._stencilState.stencilFunc;
        };
        Engine.prototype.getStencilFunctionReference = function () {
            return this._stencilState.stencilFuncRef;
        };
        Engine.prototype.getStencilFunctionMask = function () {
            return this._stencilState.stencilFuncMask;
        };
        Engine.prototype.setStencilFunction = function (stencilFunc) {
            this._stencilState.stencilFunc = stencilFunc;
        };
        Engine.prototype.setStencilFunctionReference = function (reference) {
            this._stencilState.stencilFuncRef = reference;
        };
        Engine.prototype.setStencilFunctionMask = function (mask) {
            this._stencilState.stencilFuncMask = mask;
        };
        Engine.prototype.getStencilOperationFail = function () {
            return this._stencilState.stencilOpStencilFail;
        };
        Engine.prototype.getStencilOperationDepthFail = function () {
            return this._stencilState.stencilOpDepthFail;
        };
        Engine.prototype.getStencilOperationPass = function () {
            return this._stencilState.stencilOpStencilDepthPass;
        };
        Engine.prototype.setStencilOperationFail = function (operation) {
            this._stencilState.stencilOpStencilFail = operation;
        };
        Engine.prototype.setStencilOperationDepthFail = function (operation) {
            this._stencilState.stencilOpDepthFail = operation;
        };
        Engine.prototype.setStencilOperationPass = function (operation) {
            this._stencilState.stencilOpStencilDepthPass = operation;
        };
        Engine.prototype.setDitheringState = function (value) {
            if (value) {
                this._gl.enable(this._gl.DITHER);
            }
            else {
                this._gl.disable(this._gl.DITHER);
            }
        };
        Engine.prototype.setRasterizerState = function (value) {
            if (value) {
                this._gl.disable(this._gl.RASTERIZER_DISCARD);
            }
            else {
                this._gl.enable(this._gl.RASTERIZER_DISCARD);
            }
        };
        /**
         * stop executing a render loop function and remove it from the execution array
         * @param {Function} [renderFunction] the function to be removed. If not provided all functions will be removed.
         */
        Engine.prototype.stopRenderLoop = function (renderFunction) {
            if (!renderFunction) {
                this._activeRenderLoops = [];
                return;
            }
            var index = this._activeRenderLoops.indexOf(renderFunction);
            if (index >= 0) {
                this._activeRenderLoops.splice(index, 1);
            }
        };
        Engine.prototype._renderLoop = function () {
            if (!this._contextWasLost) {
                var shouldRender = true;
                if (!this.renderEvenInBackground && this._windowIsBackground) {
                    shouldRender = false;
                }
                if (shouldRender) {
                    // Start new frame
                    this.beginFrame();
                    for (var index = 0; index < this._activeRenderLoops.length; index++) {
                        var renderFunction = this._activeRenderLoops[index];
                        renderFunction();
                    }
                    // Present
                    this.endFrame();
                }
            }
            if (this._activeRenderLoops.length > 0) {
                // Register new frame
                var requester = null;
                if (this._vrDisplay && this._vrDisplay.isPresenting)
                    requester = this._vrDisplay;
                this._frameHandler = BABYLON.Tools.QueueNewFrame(this._bindedRenderFunction, requester);
            }
            else {
                this._renderingQueueLaunched = false;
            }
        };
        /**
         * Register and execute a render loop. The engine can have more than one render function.
         * @param {Function} renderFunction - the function to continuously execute starting the next render loop.
         * @example
         * engine.runRenderLoop(function () {
         *      scene.render()
         * })
         */
        Engine.prototype.runRenderLoop = function (renderFunction) {
            if (this._activeRenderLoops.indexOf(renderFunction) !== -1) {
                return;
            }
            this._activeRenderLoops.push(renderFunction);
            if (!this._renderingQueueLaunched) {
                this._renderingQueueLaunched = true;
                this._bindedRenderFunction = this._renderLoop.bind(this);
                this._frameHandler = BABYLON.Tools.QueueNewFrame(this._bindedRenderFunction);
            }
        };
        /**
         * Toggle full screen mode.
         * @param {boolean} requestPointerLock - should a pointer lock be requested from the user
         * @param {any} options - an options object to be sent to the requestFullscreen function
         */
        Engine.prototype.switchFullscreen = function (requestPointerLock) {
            if (this.isFullscreen) {
                BABYLON.Tools.ExitFullscreen();
            }
            else {
                this._pointerLockRequested = requestPointerLock;
                if (this._renderingCanvas) {
                    BABYLON.Tools.RequestFullscreen(this._renderingCanvas);
                }
            }
        };
        Engine.prototype.clear = function (color, backBuffer, depth, stencil) {
            if (stencil === void 0) { stencil = false; }
            this.applyStates();
            var mode = 0;
            if (backBuffer && color) {
                this._gl.clearColor(color.r, color.g, color.b, color.a !== undefined ? color.a : 1.0);
                mode |= this._gl.COLOR_BUFFER_BIT;
            }
            if (depth) {
                this._gl.clearDepth(1.0);
                mode |= this._gl.DEPTH_BUFFER_BIT;
            }
            if (stencil) {
                this._gl.clearStencil(0);
                mode |= this._gl.STENCIL_BUFFER_BIT;
            }
            this._gl.clear(mode);
        };
        Engine.prototype.scissorClear = function (x, y, width, height, clearColor) {
            var gl = this._gl;
            // Save state
            var curScissor = gl.getParameter(gl.SCISSOR_TEST);
            var curScissorBox = gl.getParameter(gl.SCISSOR_BOX);
            // Change state
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(x, y, width, height);
            // Clear
            this.clear(clearColor, true, true, true);
            // Restore state
            gl.scissor(curScissorBox[0], curScissorBox[1], curScissorBox[2], curScissorBox[3]);
            if (curScissor === true) {
                gl.enable(gl.SCISSOR_TEST);
            }
            else {
                gl.disable(gl.SCISSOR_TEST);
            }
        };
        /**
         * Set the WebGL's viewport
         * @param {BABYLON.Viewport} viewport - the viewport element to be used.
         * @param {number} [requiredWidth] - the width required for rendering. If not provided the rendering canvas' width is used.
         * @param {number} [requiredHeight] - the height required for rendering. If not provided the rendering canvas' height is used.
         */
        Engine.prototype.setViewport = function (viewport, requiredWidth, requiredHeight) {
            var width = requiredWidth || this.getRenderWidth();
            var height = requiredHeight || this.getRenderHeight();
            var x = viewport.x || 0;
            var y = viewport.y || 0;
            this._cachedViewport = viewport;
            this._gl.viewport(x * width, y * height, width * viewport.width, height * viewport.height);
        };
        /**
         * Directly set the WebGL Viewport
         * The x, y, width & height are directly passed to the WebGL call
         * @return the current viewport Object (if any) that is being replaced by this call. You can restore this viewport later on to go back to the original state.
         */
        Engine.prototype.setDirectViewport = function (x, y, width, height) {
            var currentViewport = this._cachedViewport;
            this._cachedViewport = null;
            this._gl.viewport(x, y, width, height);
            return currentViewport;
        };
        Engine.prototype.beginFrame = function () {
            this.onBeginFrameObservable.notifyObservers(this);
            this._measureFps();
        };
        Engine.prototype.endFrame = function () {
            //force a flush in case we are using a bad OS.
            if (this._badOS) {
                this.flushFramebuffer();
            }
            //submit frame to the vr device, if enabled
            if (this._vrDisplay && this._vrDisplay.isPresenting) {
                // TODO: We should only submit the frame if we read frameData successfully.
                this._vrDisplay.submitFrame();
            }
            this.onEndFrameObservable.notifyObservers(this);
        };
        /**
         * resize the view according to the canvas' size.
         * @example
         *   window.addEventListener("resize", function () {
         *      engine.resize();
         *   });
         */
        Engine.prototype.resize = function () {
            // We're not resizing the size of the canvas while in VR mode & presenting
            if (!(this._vrDisplay && this._vrDisplay.isPresenting)) {
                var width = this._renderingCanvas ? this._renderingCanvas.clientWidth : window.innerWidth;
                var height = this._renderingCanvas ? this._renderingCanvas.clientHeight : window.innerHeight;
                this.setSize(width / this._hardwareScalingLevel, height / this._hardwareScalingLevel);
            }
        };
        /**
         * force a specific size of the canvas
         * @param {number} width - the new canvas' width
         * @param {number} height - the new canvas' height
         */
        Engine.prototype.setSize = function (width, height) {
            if (!this._renderingCanvas) {
                return;
            }
            if (this._renderingCanvas.width === width && this._renderingCanvas.height === height) {
                return;
            }
            this._renderingCanvas.width = width;
            this._renderingCanvas.height = height;
            for (var index = 0; index < this.scenes.length; index++) {
                var scene = this.scenes[index];
                for (var camIndex = 0; camIndex < scene.cameras.length; camIndex++) {
                    var cam = scene.cameras[camIndex];
                    cam._currentRenderId = 0;
                }
            }
            if (this.onResizeObservable.hasObservers) {
                this.onResizeObservable.notifyObservers(this);
            }
        };
        // WebVR functions
        Engine.prototype.isVRDevicePresent = function () {
            return !!this._vrDisplay;
        };
        Engine.prototype.getVRDevice = function () {
            return this._vrDisplay;
        };
        Engine.prototype.initWebVR = function () {
            var _this = this;
            var notifyObservers = function () {
                var eventArgs = {
                    vrDisplay: _this._vrDisplay,
                    vrSupported: _this._vrSupported
                };
                _this.onVRDisplayChangedObservable.notifyObservers(eventArgs);
            };
            if (!this._onVrDisplayConnect) {
                this._onVrDisplayConnect = function (event) {
                    _this._vrDisplay = event.display;
                    notifyObservers();
                };
                this._onVrDisplayDisconnect = function () {
                    _this._vrDisplay.cancelAnimationFrame(_this._frameHandler);
                    _this._vrDisplay = undefined;
                    _this._frameHandler = BABYLON.Tools.QueueNewFrame(_this._bindedRenderFunction);
                    notifyObservers();
                };
                this._onVrDisplayPresentChange = function () {
                    _this._vrExclusivePointerMode = _this._vrDisplay && _this._vrDisplay.isPresenting;
                };
                window.addEventListener('vrdisplayconnect', this._onVrDisplayConnect);
                window.addEventListener('vrdisplaydisconnect', this._onVrDisplayDisconnect);
                window.addEventListener('vrdisplaypresentchange', this._onVrDisplayPresentChange);
            }
            this._getVRDisplays(notifyObservers);
            return this.onVRDisplayChangedObservable;
        };
        Engine.prototype.enableVR = function () {
            var _this = this;
            if (this._vrDisplay && !this._vrDisplay.isPresenting) {
                var onResolved = function () {
                    _this.onVRRequestPresentComplete.notifyObservers(true);
                    _this._onVRFullScreenTriggered();
                };
                var onRejected = function () {
                    _this.onVRRequestPresentComplete.notifyObservers(false);
                };
                this.onVRRequestPresentStart.notifyObservers(this);
                this._vrDisplay.requestPresent([{ source: this.getRenderingCanvas() }]).then(onResolved).catch(onRejected);
            }
        };
        Engine.prototype.disableVR = function () {
            if (this._vrDisplay && this._vrDisplay.isPresenting) {
                this._vrDisplay.exitPresent().then(this._onVRFullScreenTriggered).catch(this._onVRFullScreenTriggered);
            }
        };
        Engine.prototype._getVRDisplays = function (callback) {
            var _this = this;
            var getWebVRDevices = function (devices) {
                _this._vrSupported = true;
                // note that devices may actually be an empty array. This is fine;
                // we expect this._vrDisplay to be undefined in this case.
                return _this._vrDisplay = devices[0];
            };
            if (navigator.getVRDisplays) {
                navigator.getVRDisplays().then(getWebVRDevices).then(callback).catch(function (error) {
                    // TODO: System CANNOT support WebVR, despite API presence.
                    _this._vrSupported = false;
                    callback();
                });
            }
            else {
                // TODO: Browser does not support WebVR
                this._vrDisplay = undefined;
                this._vrSupported = false;
                callback();
            }
        };
        Engine.prototype.bindFramebuffer = function (texture, faceIndex, requiredWidth, requiredHeight, forceFullscreenViewport) {
            if (this._currentRenderTarget) {
                this.unBindFramebuffer(this._currentRenderTarget);
            }
            this._currentRenderTarget = texture;
            this.bindUnboundFramebuffer(texture._MSAAFramebuffer ? texture._MSAAFramebuffer : texture._framebuffer);
            var gl = this._gl;
            if (texture.isCube) {
                if (faceIndex === undefined) {
                    faceIndex = 0;
                }
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, texture._webGLTexture, 0);
            }
            if (this._cachedViewport && !forceFullscreenViewport) {
                this.setViewport(this._cachedViewport, requiredWidth, requiredHeight);
            }
            else {
                gl.viewport(0, 0, requiredWidth || texture.width, requiredHeight || texture.height);
            }
            this.wipeCaches();
        };
        Engine.prototype.bindUnboundFramebuffer = function (framebuffer) {
            if (this._currentFramebuffer !== framebuffer) {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer);
                this._currentFramebuffer = framebuffer;
            }
        };
        Engine.prototype.unBindFramebuffer = function (texture, disableGenerateMipMaps, onBeforeUnbind) {
            if (disableGenerateMipMaps === void 0) { disableGenerateMipMaps = false; }
            this._currentRenderTarget = null;
            // If MSAA, we need to bitblt back to main texture
            var gl = this._gl;
            if (texture._MSAAFramebuffer) {
                gl.bindFramebuffer(gl.READ_FRAMEBUFFER, texture._MSAAFramebuffer);
                gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, texture._framebuffer);
                gl.blitFramebuffer(0, 0, texture.width, texture.height, 0, 0, texture.width, texture.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
            }
            if (texture.generateMipMaps && !disableGenerateMipMaps && !texture.isCube) {
                this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
                gl.generateMipmap(gl.TEXTURE_2D);
                this._bindTextureDirectly(gl.TEXTURE_2D, null);
            }
            if (onBeforeUnbind) {
                if (texture._MSAAFramebuffer) {
                    // Bind the correct framebuffer
                    this.bindUnboundFramebuffer(texture._framebuffer);
                }
                onBeforeUnbind();
            }
            this.bindUnboundFramebuffer(null);
        };
        Engine.prototype.generateMipMapsForCubemap = function (texture) {
            if (texture.generateMipMaps) {
                var gl = this._gl;
                this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
            }
        };
        Engine.prototype.flushFramebuffer = function () {
            this._gl.flush();
        };
        Engine.prototype.restoreDefaultFramebuffer = function () {
            if (this._currentRenderTarget) {
                this.unBindFramebuffer(this._currentRenderTarget);
            }
            else {
                this.bindUnboundFramebuffer(null);
            }
            if (this._cachedViewport) {
                this.setViewport(this._cachedViewport);
            }
            this.wipeCaches();
        };
        // UBOs
        Engine.prototype.createUniformBuffer = function (elements) {
            var ubo = this._gl.createBuffer();
            if (!ubo) {
                throw new Error("Unable to create uniform buffer");
            }
            this.bindUniformBuffer(ubo);
            if (elements instanceof Float32Array) {
                this._gl.bufferData(this._gl.UNIFORM_BUFFER, elements, this._gl.STATIC_DRAW);
            }
            else {
                this._gl.bufferData(this._gl.UNIFORM_BUFFER, new Float32Array(elements), this._gl.STATIC_DRAW);
            }
            this.bindUniformBuffer(null);
            ubo.references = 1;
            return ubo;
        };
        Engine.prototype.createDynamicUniformBuffer = function (elements) {
            var ubo = this._gl.createBuffer();
            if (!ubo) {
                throw new Error("Unable to create dynamic uniform buffer");
            }
            this.bindUniformBuffer(ubo);
            if (elements instanceof Float32Array) {
                this._gl.bufferData(this._gl.UNIFORM_BUFFER, elements, this._gl.DYNAMIC_DRAW);
            }
            else {
                this._gl.bufferData(this._gl.UNIFORM_BUFFER, new Float32Array(elements), this._gl.DYNAMIC_DRAW);
            }
            this.bindUniformBuffer(null);
            ubo.references = 1;
            return ubo;
        };
        Engine.prototype.updateUniformBuffer = function (uniformBuffer, elements, offset, count) {
            this.bindUniformBuffer(uniformBuffer);
            if (offset === undefined) {
                offset = 0;
            }
            if (count === undefined) {
                if (elements instanceof Float32Array) {
                    this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, offset, elements);
                }
                else {
                    this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, offset, new Float32Array(elements));
                }
            }
            else {
                if (elements instanceof Float32Array) {
                    this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, 0, elements.subarray(offset, offset + count));
                }
                else {
                    this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, 0, new Float32Array(elements).subarray(offset, offset + count));
                }
            }
            this.bindUniformBuffer(null);
        };
        // VBOs
        Engine.prototype._resetVertexBufferBinding = function () {
            this.bindArrayBuffer(null);
            this._cachedVertexBuffers = null;
        };
        Engine.prototype.createVertexBuffer = function (vertices) {
            var vbo = this._gl.createBuffer();
            if (!vbo) {
                throw new Error("Unable to create vertex buffer");
            }
            this.bindArrayBuffer(vbo);
            if (vertices instanceof Float32Array) {
                this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW);
            }
            else {
                this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
            }
            this._resetVertexBufferBinding();
            vbo.references = 1;
            return vbo;
        };
        Engine.prototype.createDynamicVertexBuffer = function (vertices) {
            var vbo = this._gl.createBuffer();
            if (!vbo) {
                throw new Error("Unable to create dynamic vertex buffer");
            }
            this.bindArrayBuffer(vbo);
            if (vertices instanceof Float32Array) {
                this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.DYNAMIC_DRAW);
            }
            else {
                this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.DYNAMIC_DRAW);
            }
            this._resetVertexBufferBinding();
            vbo.references = 1;
            return vbo;
        };
        Engine.prototype.updateDynamicIndexBuffer = function (indexBuffer, indices, offset) {
            if (offset === void 0) { offset = 0; }
            // Force cache update
            this._currentBoundBuffer[this._gl.ELEMENT_ARRAY_BUFFER] = null;
            this.bindIndexBuffer(indexBuffer);
            var arrayBuffer;
            if (indices instanceof Uint16Array || indices instanceof Uint32Array) {
                arrayBuffer = indices;
            }
            else {
                arrayBuffer = indexBuffer.is32Bits ? new Uint32Array(indices) : new Uint16Array(indices);
            }
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, arrayBuffer, this._gl.DYNAMIC_DRAW);
            this._resetIndexBufferBinding();
        };
        Engine.prototype.updateDynamicVertexBuffer = function (vertexBuffer, vertices, offset, count) {
            this.bindArrayBuffer(vertexBuffer);
            if (offset === undefined) {
                offset = 0;
            }
            if (count === undefined) {
                if (vertices instanceof Float32Array) {
                    this._gl.bufferSubData(this._gl.ARRAY_BUFFER, offset, vertices);
                }
                else {
                    this._gl.bufferSubData(this._gl.ARRAY_BUFFER, offset, new Float32Array(vertices));
                }
            }
            else {
                if (vertices instanceof Float32Array) {
                    this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, vertices.subarray(offset, offset + count));
                }
                else {
                    this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, new Float32Array(vertices).subarray(offset, offset + count));
                }
            }
            this._resetVertexBufferBinding();
        };
        Engine.prototype._resetIndexBufferBinding = function () {
            this.bindIndexBuffer(null);
            this._cachedIndexBuffer = null;
        };
        Engine.prototype.createIndexBuffer = function (indices, updatable) {
            var vbo = this._gl.createBuffer();
            if (!vbo) {
                throw new Error("Unable to create index buffer");
            }
            this.bindIndexBuffer(vbo);
            // Check for 32 bits indices
            var arrayBuffer;
            var need32Bits = false;
            if (indices instanceof Uint16Array) {
                arrayBuffer = indices;
            }
            else {
                //check 32 bit support
                if (this._caps.uintIndices) {
                    if (indices instanceof Uint32Array) {
                        arrayBuffer = indices;
                        need32Bits = true;
                    }
                    else {
                        //number[] or Int32Array, check if 32 bit is necessary
                        for (var index = 0; index < indices.length; index++) {
                            if (indices[index] > 65535) {
                                need32Bits = true;
                                break;
                            }
                        }
                        arrayBuffer = need32Bits ? new Uint32Array(indices) : new Uint16Array(indices);
                    }
                }
                else {
                    //no 32 bit support, force conversion to 16 bit (values greater 16 bit are lost)
                    arrayBuffer = new Uint16Array(indices);
                }
            }
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, arrayBuffer, updatable ? this._gl.DYNAMIC_DRAW : this._gl.STATIC_DRAW);
            this._resetIndexBufferBinding();
            vbo.references = 1;
            vbo.is32Bits = need32Bits;
            return vbo;
        };
        Engine.prototype.bindArrayBuffer = function (buffer) {
            if (!this._vaoRecordInProgress) {
                this._unbindVertexArrayObject();
            }
            this.bindBuffer(buffer, this._gl.ARRAY_BUFFER);
        };
        Engine.prototype.bindUniformBuffer = function (buffer) {
            this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, buffer);
        };
        Engine.prototype.bindUniformBufferBase = function (buffer, location) {
            this._gl.bindBufferBase(this._gl.UNIFORM_BUFFER, location, buffer);
        };
        Engine.prototype.bindUniformBlock = function (shaderProgram, blockName, index) {
            var uniformLocation = this._gl.getUniformBlockIndex(shaderProgram, blockName);
            this._gl.uniformBlockBinding(shaderProgram, uniformLocation, index);
        };
        ;
        Engine.prototype.bindIndexBuffer = function (buffer) {
            if (!this._vaoRecordInProgress) {
                this._unbindVertexArrayObject();
            }
            this.bindBuffer(buffer, this._gl.ELEMENT_ARRAY_BUFFER);
        };
        Engine.prototype.bindBuffer = function (buffer, target) {
            if (this._vaoRecordInProgress || this._currentBoundBuffer[target] !== buffer) {
                this._gl.bindBuffer(target, buffer);
                this._currentBoundBuffer[target] = buffer;
            }
        };
        Engine.prototype.updateArrayBuffer = function (data) {
            this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, data);
        };
        Engine.prototype.vertexAttribPointer = function (buffer, indx, size, type, normalized, stride, offset) {
            var pointer = this._currentBufferPointers[indx];
            var changed = false;
            if (!pointer.active) {
                changed = true;
                pointer.active = true;
                pointer.index = indx;
                pointer.size = size;
                pointer.type = type;
                pointer.normalized = normalized;
                pointer.stride = stride;
                pointer.offset = offset;
                pointer.buffer = buffer;
            }
            else {
                if (pointer.buffer !== buffer) {
                    pointer.buffer = buffer;
                    changed = true;
                }
                if (pointer.size !== size) {
                    pointer.size = size;
                    changed = true;
                }
                if (pointer.type !== type) {
                    pointer.type = type;
                    changed = true;
                }
                if (pointer.normalized !== normalized) {
                    pointer.normalized = normalized;
                    changed = true;
                }
                if (pointer.stride !== stride) {
                    pointer.stride = stride;
                    changed = true;
                }
                if (pointer.offset !== offset) {
                    pointer.offset = offset;
                    changed = true;
                }
            }
            if (changed || this._vaoRecordInProgress) {
                this.bindArrayBuffer(buffer);
                this._gl.vertexAttribPointer(indx, size, type, normalized, stride, offset);
            }
        };
        Engine.prototype._bindIndexBufferWithCache = function (indexBuffer) {
            if (indexBuffer == null) {
                return;
            }
            if (this._cachedIndexBuffer !== indexBuffer) {
                this._cachedIndexBuffer = indexBuffer;
                this.bindIndexBuffer(indexBuffer);
                this._uintIndicesCurrentlySet = indexBuffer.is32Bits;
            }
        };
        Engine.prototype._bindVertexBuffersAttributes = function (vertexBuffers, effect) {
            var attributes = effect.getAttributesNames();
            if (!this._vaoRecordInProgress) {
                this._unbindVertexArrayObject();
            }
            this.unbindAllAttributes();
            for (var index = 0; index < attributes.length; index++) {
                var order = effect.getAttributeLocation(index);
                if (order >= 0) {
                    var vertexBuffer = vertexBuffers[attributes[index]];
                    if (!vertexBuffer) {
                        continue;
                    }
                    this._gl.enableVertexAttribArray(order);
                    if (!this._vaoRecordInProgress) {
                        this._vertexAttribArraysEnabled[order] = true;
                    }
                    var buffer = vertexBuffer.getBuffer();
                    if (buffer) {
                        this.vertexAttribPointer(buffer, order, vertexBuffer.getSize(), this._gl.FLOAT, false, vertexBuffer.getStrideSize() * 4, vertexBuffer.getOffset() * 4);
                        if (vertexBuffer.getIsInstanced()) {
                            this._gl.vertexAttribDivisor(order, vertexBuffer.getInstanceDivisor());
                            if (!this._vaoRecordInProgress) {
                                this._currentInstanceLocations.push(order);
                                this._currentInstanceBuffers.push(buffer);
                            }
                        }
                    }
                }
            }
        };
        Engine.prototype.recordVertexArrayObject = function (vertexBuffers, indexBuffer, effect) {
            var vao = this._gl.createVertexArray();
            this._vaoRecordInProgress = true;
            this._gl.bindVertexArray(vao);
            this._mustWipeVertexAttributes = true;
            this._bindVertexBuffersAttributes(vertexBuffers, effect);
            this.bindIndexBuffer(indexBuffer);
            this._vaoRecordInProgress = false;
            this._gl.bindVertexArray(null);
            return vao;
        };
        Engine.prototype.bindVertexArrayObject = function (vertexArrayObject, indexBuffer) {
            if (this._cachedVertexArrayObject !== vertexArrayObject) {
                this._cachedVertexArrayObject = vertexArrayObject;
                this._gl.bindVertexArray(vertexArrayObject);
                this._cachedVertexBuffers = null;
                this._cachedIndexBuffer = null;
                this._uintIndicesCurrentlySet = indexBuffer != null && indexBuffer.is32Bits;
                this._mustWipeVertexAttributes = true;
            }
        };
        Engine.prototype.bindBuffersDirectly = function (vertexBuffer, indexBuffer, vertexDeclaration, vertexStrideSize, effect) {
            if (this._cachedVertexBuffers !== vertexBuffer || this._cachedEffectForVertexBuffers !== effect) {
                this._cachedVertexBuffers = vertexBuffer;
                this._cachedEffectForVertexBuffers = effect;
                var attributesCount = effect.getAttributesCount();
                this._unbindVertexArrayObject();
                this.unbindAllAttributes();
                var offset = 0;
                for (var index = 0; index < attributesCount; index++) {
                    if (index < vertexDeclaration.length) {
                        var order = effect.getAttributeLocation(index);
                        if (order >= 0) {
                            this._gl.enableVertexAttribArray(order);
                            this._vertexAttribArraysEnabled[order] = true;
                            this.vertexAttribPointer(vertexBuffer, order, vertexDeclaration[index], this._gl.FLOAT, false, vertexStrideSize, offset);
                        }
                        offset += vertexDeclaration[index] * 4;
                    }
                }
            }
            this._bindIndexBufferWithCache(indexBuffer);
        };
        Engine.prototype._unbindVertexArrayObject = function () {
            if (!this._cachedVertexArrayObject) {
                return;
            }
            this._cachedVertexArrayObject = null;
            this._gl.bindVertexArray(null);
        };
        Engine.prototype.bindBuffers = function (vertexBuffers, indexBuffer, effect) {
            if (this._cachedVertexBuffers !== vertexBuffers || this._cachedEffectForVertexBuffers !== effect) {
                this._cachedVertexBuffers = vertexBuffers;
                this._cachedEffectForVertexBuffers = effect;
                this._bindVertexBuffersAttributes(vertexBuffers, effect);
            }
            this._bindIndexBufferWithCache(indexBuffer);
        };
        Engine.prototype.unbindInstanceAttributes = function () {
            var boundBuffer;
            for (var i = 0, ul = this._currentInstanceLocations.length; i < ul; i++) {
                var instancesBuffer = this._currentInstanceBuffers[i];
                if (boundBuffer != instancesBuffer && instancesBuffer.references) {
                    boundBuffer = instancesBuffer;
                    this.bindArrayBuffer(instancesBuffer);
                }
                var offsetLocation = this._currentInstanceLocations[i];
                this._gl.vertexAttribDivisor(offsetLocation, 0);
            }
            this._currentInstanceBuffers.length = 0;
            this._currentInstanceLocations.length = 0;
        };
        Engine.prototype.releaseVertexArrayObject = function (vao) {
            this._gl.deleteVertexArray(vao);
        };
        Engine.prototype._releaseBuffer = function (buffer) {
            buffer.references--;
            if (buffer.references === 0) {
                this._gl.deleteBuffer(buffer);
                return true;
            }
            return false;
        };
        Engine.prototype.createInstancesBuffer = function (capacity) {
            var buffer = this._gl.createBuffer();
            if (!buffer) {
                throw new Error("Unable to create instance buffer");
            }
            buffer.capacity = capacity;
            this.bindArrayBuffer(buffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, capacity, this._gl.DYNAMIC_DRAW);
            return buffer;
        };
        Engine.prototype.deleteInstancesBuffer = function (buffer) {
            this._gl.deleteBuffer(buffer);
        };
        Engine.prototype.updateAndBindInstancesBuffer = function (instancesBuffer, data, offsetLocations) {
            this.bindArrayBuffer(instancesBuffer);
            if (data) {
                this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, data);
            }
            if (offsetLocations[0].index !== undefined) {
                var stride = 0;
                for (var i = 0; i < offsetLocations.length; i++) {
                    var ai = offsetLocations[i];
                    stride += ai.attributeSize * 4;
                }
                for (var i = 0; i < offsetLocations.length; i++) {
                    var ai = offsetLocations[i];
                    if (!this._vertexAttribArraysEnabled[ai.index]) {
                        this._gl.enableVertexAttribArray(ai.index);
                        this._vertexAttribArraysEnabled[ai.index] = true;
                    }
                    this.vertexAttribPointer(instancesBuffer, ai.index, ai.attributeSize, ai.attribyteType || this._gl.FLOAT, ai.normalized || false, stride, ai.offset);
                    this._gl.vertexAttribDivisor(ai.index, 1);
                    this._currentInstanceLocations.push(ai.index);
                    this._currentInstanceBuffers.push(instancesBuffer);
                }
            }
            else {
                for (var index = 0; index < 4; index++) {
                    var offsetLocation = offsetLocations[index];
                    if (!this._vertexAttribArraysEnabled[offsetLocation]) {
                        this._gl.enableVertexAttribArray(offsetLocation);
                        this._vertexAttribArraysEnabled[offsetLocation] = true;
                    }
                    this.vertexAttribPointer(instancesBuffer, offsetLocation, 4, this._gl.FLOAT, false, 64, index * 16);
                    this._gl.vertexAttribDivisor(offsetLocation, 1);
                    this._currentInstanceLocations.push(offsetLocation);
                    this._currentInstanceBuffers.push(instancesBuffer);
                }
            }
        };
        Engine.prototype.applyStates = function () {
            this._depthCullingState.apply(this._gl);
            this._stencilState.apply(this._gl);
            this._alphaState.apply(this._gl);
        };
        Engine.prototype.draw = function (useTriangles, indexStart, indexCount, instancesCount) {
            this.drawElementsType(useTriangles ? BABYLON.Material.TriangleFillMode : BABYLON.Material.WireFrameFillMode, indexStart, indexCount, instancesCount);
        };
        Engine.prototype.drawPointClouds = function (verticesStart, verticesCount, instancesCount) {
            this.drawArraysType(BABYLON.Material.PointFillMode, verticesStart, verticesCount, instancesCount);
        };
        Engine.prototype.drawUnIndexed = function (useTriangles, verticesStart, verticesCount, instancesCount) {
            this.drawArraysType(useTriangles ? BABYLON.Material.TriangleFillMode : BABYLON.Material.WireFrameFillMode, verticesStart, verticesCount, instancesCount);
        };
        Engine.prototype.drawElementsType = function (fillMode, indexStart, indexCount, instancesCount) {
            // Apply states
            this.applyStates();
            this._drawCalls.addCount(1, false);
            // Render
            var drawMode = this.DrawMode(fillMode);
            var indexFormat = this._uintIndicesCurrentlySet ? this._gl.UNSIGNED_INT : this._gl.UNSIGNED_SHORT;
            var mult = this._uintIndicesCurrentlySet ? 4 : 2;
            if (instancesCount) {
                this._gl.drawElementsInstanced(drawMode, indexCount, indexFormat, indexStart * mult, instancesCount);
            }
            else {
                this._gl.drawElements(drawMode, indexCount, indexFormat, indexStart * mult);
            }
        };
        Engine.prototype.drawArraysType = function (fillMode, verticesStart, verticesCount, instancesCount) {
            // Apply states
            this.applyStates();
            this._drawCalls.addCount(1, false);
            var drawMode = this.DrawMode(fillMode);
            if (instancesCount) {
                this._gl.drawArraysInstanced(drawMode, verticesStart, verticesCount, instancesCount);
            }
            else {
                this._gl.drawArrays(drawMode, verticesStart, verticesCount);
            }
        };
        Engine.prototype.DrawMode = function (fillMode) {
            switch (fillMode) {
                // Triangle views
                case BABYLON.Material.TriangleFillMode:
                    return this._gl.TRIANGLES;
                case BABYLON.Material.PointFillMode:
                    return this._gl.POINTS;
                case BABYLON.Material.WireFrameFillMode:
                    return this._gl.LINES;
                // Draw modes
                case BABYLON.Material.PointListDrawMode:
                    return this._gl.POINTS;
                case BABYLON.Material.LineListDrawMode:
                    return this._gl.LINES;
                case BABYLON.Material.LineLoopDrawMode:
                    return this._gl.LINE_LOOP;
                case BABYLON.Material.LineStripDrawMode:
                    return this._gl.LINE_STRIP;
                case BABYLON.Material.TriangleStripDrawMode:
                    return this._gl.TRIANGLE_STRIP;
                case BABYLON.Material.TriangleFanDrawMode:
                    return this._gl.TRIANGLE_FAN;
                default:
                    return this._gl.TRIANGLES;
            }
        };
        // Shaders
        Engine.prototype._releaseEffect = function (effect) {
            if (this._compiledEffects[effect._key]) {
                delete this._compiledEffects[effect._key];
                this._deleteProgram(effect.getProgram());
            }
        };
        Engine.prototype._deleteProgram = function (program) {
            if (program) {
                program.__SPECTOR_rebuildProgram = null;
                if (program.transformFeedback) {
                    this.deleteTransformFeedback(program.transformFeedback);
                    program.transformFeedback = null;
                }
                this._gl.deleteProgram(program);
            }
        };
        /**
         * @param baseName The base name of the effect (The name of file without .fragment.fx or .vertex.fx)
         * @param samplers An array of string used to represent textures
         */
        Engine.prototype.createEffect = function (baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, defines, fallbacks, onCompiled, onError, indexParameters) {
            var vertex = baseName.vertexElement || baseName.vertex || baseName;
            var fragment = baseName.fragmentElement || baseName.fragment || baseName;
            var name = vertex + "+" + fragment + "@" + (defines ? defines : attributesNamesOrOptions.defines);
            if (this._compiledEffects[name]) {
                var compiledEffect = this._compiledEffects[name];
                if (onCompiled && compiledEffect.isReady()) {
                    onCompiled(compiledEffect);
                }
                return compiledEffect;
            }
            var effect = new BABYLON.Effect(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, this, defines, fallbacks, onCompiled, onError, indexParameters);
            effect._key = name;
            this._compiledEffects[name] = effect;
            return effect;
        };
        Engine.prototype.createEffectForParticles = function (fragmentName, uniformsNames, samplers, defines, fallbacks, onCompiled, onError) {
            if (uniformsNames === void 0) { uniformsNames = []; }
            if (samplers === void 0) { samplers = []; }
            if (defines === void 0) { defines = ""; }
            return this.createEffect({
                vertex: "particles",
                fragmentElement: fragmentName
            }, ["position", "color", "options"], ["view", "projection"].concat(uniformsNames), ["diffuseSampler"].concat(samplers), defines, fallbacks, onCompiled, onError);
        };
        Engine.prototype.createRawShaderProgram = function (vertexCode, fragmentCode, context, transformFeedbackVaryings) {
            if (transformFeedbackVaryings === void 0) { transformFeedbackVaryings = null; }
            context = context || this._gl;
            var vertexShader = compileRawShader(context, vertexCode, "vertex");
            var fragmentShader = compileRawShader(context, fragmentCode, "fragment");
            return this._createShaderProgram(vertexShader, fragmentShader, context, transformFeedbackVaryings);
        };
        Engine.prototype.createShaderProgram = function (vertexCode, fragmentCode, defines, context, transformFeedbackVaryings) {
            if (transformFeedbackVaryings === void 0) { transformFeedbackVaryings = null; }
            context = context || this._gl;
            this.onBeforeShaderCompilationObservable.notifyObservers(this);
            var shaderVersion = (this._webGLVersion > 1) ? "#version 300 es\n" : "";
            var vertexShader = compileShader(context, vertexCode, "vertex", defines, shaderVersion);
            var fragmentShader = compileShader(context, fragmentCode, "fragment", defines, shaderVersion);
            var program = this._createShaderProgram(vertexShader, fragmentShader, context, transformFeedbackVaryings);
            this.onAfterShaderCompilationObservable.notifyObservers(this);
            return program;
        };
        Engine.prototype._createShaderProgram = function (vertexShader, fragmentShader, context, transformFeedbackVaryings) {
            if (transformFeedbackVaryings === void 0) { transformFeedbackVaryings = null; }
            var shaderProgram = context.createProgram();
            if (!shaderProgram) {
                throw new Error("Unable to create program");
            }
            context.attachShader(shaderProgram, vertexShader);
            context.attachShader(shaderProgram, fragmentShader);
            if (this.webGLVersion > 1 && transformFeedbackVaryings) {
                var transformFeedback = this.createTransformFeedback();
                this.bindTransformFeedback(transformFeedback);
                this.setTranformFeedbackVaryings(shaderProgram, transformFeedbackVaryings);
                shaderProgram.transformFeedback = transformFeedback;
            }
            context.linkProgram(shaderProgram);
            if (this.webGLVersion > 1 && transformFeedbackVaryings) {
                this.bindTransformFeedback(null);
            }
            var linked = context.getProgramParameter(shaderProgram, context.LINK_STATUS);
            if (!linked) {
                context.validateProgram(shaderProgram);
                var error = context.getProgramInfoLog(shaderProgram);
                if (error) {
                    throw new Error(error);
                }
            }
            context.deleteShader(vertexShader);
            context.deleteShader(fragmentShader);
            return shaderProgram;
        };
        Engine.prototype.getUniforms = function (shaderProgram, uniformsNames) {
            var results = new Array();
            for (var index = 0; index < uniformsNames.length; index++) {
                results.push(this._gl.getUniformLocation(shaderProgram, uniformsNames[index]));
            }
            return results;
        };
        Engine.prototype.getAttributes = function (shaderProgram, attributesNames) {
            var results = [];
            for (var index = 0; index < attributesNames.length; index++) {
                try {
                    results.push(this._gl.getAttribLocation(shaderProgram, attributesNames[index]));
                }
                catch (e) {
                    results.push(-1);
                }
            }
            return results;
        };
        Engine.prototype.enableEffect = function (effect) {
            if (!effect) {
                return;
            }
            // Use program
            this.bindSamplers(effect);
            this._currentEffect = effect;
            if (effect.onBind) {
                effect.onBind(effect);
            }
            effect.onBindObservable.notifyObservers(effect);
        };
        Engine.prototype.setIntArray = function (uniform, array) {
            if (!uniform)
                return;
            this._gl.uniform1iv(uniform, array);
        };
        Engine.prototype.setIntArray2 = function (uniform, array) {
            if (!uniform || array.length % 2 !== 0)
                return;
            this._gl.uniform2iv(uniform, array);
        };
        Engine.prototype.setIntArray3 = function (uniform, array) {
            if (!uniform || array.length % 3 !== 0)
                return;
            this._gl.uniform3iv(uniform, array);
        };
        Engine.prototype.setIntArray4 = function (uniform, array) {
            if (!uniform || array.length % 4 !== 0)
                return;
            this._gl.uniform4iv(uniform, array);
        };
        Engine.prototype.setFloatArray = function (uniform, array) {
            if (!uniform)
                return;
            this._gl.uniform1fv(uniform, array);
        };
        Engine.prototype.setFloatArray2 = function (uniform, array) {
            if (!uniform || array.length % 2 !== 0)
                return;
            this._gl.uniform2fv(uniform, array);
        };
        Engine.prototype.setFloatArray3 = function (uniform, array) {
            if (!uniform || array.length % 3 !== 0)
                return;
            this._gl.uniform3fv(uniform, array);
        };
        Engine.prototype.setFloatArray4 = function (uniform, array) {
            if (!uniform || array.length % 4 !== 0)
                return;
            this._gl.uniform4fv(uniform, array);
        };
        Engine.prototype.setArray = function (uniform, array) {
            if (!uniform)
                return;
            this._gl.uniform1fv(uniform, array);
        };
        Engine.prototype.setArray2 = function (uniform, array) {
            if (!uniform || array.length % 2 !== 0)
                return;
            this._gl.uniform2fv(uniform, array);
        };
        Engine.prototype.setArray3 = function (uniform, array) {
            if (!uniform || array.length % 3 !== 0)
                return;
            this._gl.uniform3fv(uniform, array);
        };
        Engine.prototype.setArray4 = function (uniform, array) {
            if (!uniform || array.length % 4 !== 0)
                return;
            this._gl.uniform4fv(uniform, array);
        };
        Engine.prototype.setMatrices = function (uniform, matrices) {
            if (!uniform)
                return;
            this._gl.uniformMatrix4fv(uniform, false, matrices);
        };
        Engine.prototype.setMatrix = function (uniform, matrix) {
            if (!uniform)
                return;
            this._gl.uniformMatrix4fv(uniform, false, matrix.toArray());
        };
        Engine.prototype.setMatrix3x3 = function (uniform, matrix) {
            if (!uniform)
                return;
            this._gl.uniformMatrix3fv(uniform, false, matrix);
        };
        Engine.prototype.setMatrix2x2 = function (uniform, matrix) {
            if (!uniform)
                return;
            this._gl.uniformMatrix2fv(uniform, false, matrix);
        };
        Engine.prototype.setInt = function (uniform, value) {
            if (!uniform)
                return;
            this._gl.uniform1i(uniform, value);
        };
        Engine.prototype.setFloat = function (uniform, value) {
            if (!uniform)
                return;
            this._gl.uniform1f(uniform, value);
        };
        Engine.prototype.setFloat2 = function (uniform, x, y) {
            if (!uniform)
                return;
            this._gl.uniform2f(uniform, x, y);
        };
        Engine.prototype.setFloat3 = function (uniform, x, y, z) {
            if (!uniform)
                return;
            this._gl.uniform3f(uniform, x, y, z);
        };
        Engine.prototype.setBool = function (uniform, bool) {
            if (!uniform)
                return;
            this._gl.uniform1i(uniform, bool);
        };
        Engine.prototype.setFloat4 = function (uniform, x, y, z, w) {
            if (!uniform)
                return;
            this._gl.uniform4f(uniform, x, y, z, w);
        };
        Engine.prototype.setColor3 = function (uniform, color3) {
            if (!uniform)
                return;
            this._gl.uniform3f(uniform, color3.r, color3.g, color3.b);
        };
        Engine.prototype.setColor4 = function (uniform, color3, alpha) {
            if (!uniform)
                return;
            this._gl.uniform4f(uniform, color3.r, color3.g, color3.b, alpha);
        };
        // States
        Engine.prototype.setState = function (culling, zOffset, force, reverseSide) {
            if (zOffset === void 0) { zOffset = 0; }
            if (reverseSide === void 0) { reverseSide = false; }
            // Culling
            if (this._depthCullingState.cull !== culling || force) {
                this._depthCullingState.cull = culling;
            }
            // Cull face
            var cullFace = this.cullBackFaces ? this._gl.BACK : this._gl.FRONT;
            if (this._depthCullingState.cullFace !== cullFace || force) {
                this._depthCullingState.cullFace = cullFace;
            }
            // Z offset
            this.setZOffset(zOffset);
            // Front face
            var frontFace = reverseSide ? this._gl.CW : this._gl.CCW;
            if (this._depthCullingState.frontFace !== frontFace || force) {
                this._depthCullingState.frontFace = frontFace;
            }
        };
        Engine.prototype.setZOffset = function (value) {
            this._depthCullingState.zOffset = value;
        };
        Engine.prototype.getZOffset = function () {
            return this._depthCullingState.zOffset;
        };
        Engine.prototype.setDepthBuffer = function (enable) {
            this._depthCullingState.depthTest = enable;
        };
        Engine.prototype.getDepthWrite = function () {
            return this._depthCullingState.depthMask;
        };
        Engine.prototype.setDepthWrite = function (enable) {
            this._depthCullingState.depthMask = enable;
        };
        Engine.prototype.setColorWrite = function (enable) {
            this._gl.colorMask(enable, enable, enable, enable);
            this._colorWrite = enable;
        };
        Engine.prototype.getColorWrite = function () {
            return this._colorWrite;
        };
        Engine.prototype.setAlphaConstants = function (r, g, b, a) {
            this._alphaState.setAlphaBlendConstants(r, g, b, a);
        };
        Engine.prototype.setAlphaMode = function (mode, noDepthWriteChange) {
            if (noDepthWriteChange === void 0) { noDepthWriteChange = false; }
            if (this._alphaMode === mode) {
                return;
            }
            switch (mode) {
                case Engine.ALPHA_DISABLE:
                    this._alphaState.alphaBlend = false;
                    break;
                case Engine.ALPHA_PREMULTIPLIED:
                    this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE);
                    this._alphaState.alphaBlend = true;
                    break;
                case Engine.ALPHA_PREMULTIPLIED_PORTERDUFF:
                    this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA);
                    this._alphaState.alphaBlend = true;
                    break;
                case Engine.ALPHA_COMBINE:
                    this._alphaState.setAlphaBlendFunctionParameters(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE);
                    this._alphaState.alphaBlend = true;
                    break;
                case Engine.ALPHA_ONEONE:
                    this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE, this._gl.ZERO, this._gl.ONE);
                    this._alphaState.alphaBlend = true;
                    break;
                case Engine.ALPHA_ADD:
                    this._alphaState.setAlphaBlendFunctionParameters(this._gl.SRC_ALPHA, this._gl.ONE, this._gl.ZERO, this._gl.ONE);
                    this._alphaState.alphaBlend = true;
                    break;
                case Engine.ALPHA_SUBTRACT:
                    this._alphaState.setAlphaBlendFunctionParameters(this._gl.ZERO, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ONE, this._gl.ONE);
                    this._alphaState.alphaBlend = true;
                    break;
                case Engine.ALPHA_MULTIPLY:
                    this._alphaState.setAlphaBlendFunctionParameters(this._gl.DST_COLOR, this._gl.ZERO, this._gl.ONE, this._gl.ONE);
                    this._alphaState.alphaBlend = true;
                    break;
                case Engine.ALPHA_MAXIMIZED:
                    this._alphaState.setAlphaBlendFunctionParameters(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ONE, this._gl.ONE);
                    this._alphaState.alphaBlend = true;
                    break;
                case Engine.ALPHA_INTERPOLATE:
                    this._alphaState.setAlphaBlendFunctionParameters(this._gl.CONSTANT_COLOR, this._gl.ONE_MINUS_CONSTANT_COLOR, this._gl.CONSTANT_ALPHA, this._gl.ONE_MINUS_CONSTANT_ALPHA);
                    this._alphaState.alphaBlend = true;
                    break;
                case Engine.ALPHA_SCREENMODE:
                    this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA);
                    this._alphaState.alphaBlend = true;
                    break;
            }
            if (!noDepthWriteChange) {
                this.setDepthWrite(mode === Engine.ALPHA_DISABLE);
            }
            this._alphaMode = mode;
        };
        Engine.prototype.getAlphaMode = function () {
            return this._alphaMode;
        };
        Engine.prototype.setAlphaTesting = function (enable) {
            this._alphaTest = enable;
        };
        Engine.prototype.getAlphaTesting = function () {
            return !!this._alphaTest;
        };
        // Textures
        Engine.prototype.wipeCaches = function (bruteForce) {
            if (this.preventCacheWipeBetweenFrames && !bruteForce) {
                return;
            }
            this._currentEffect = null;
            // 6/8/2017: deltakosh: Should not be required anymore.
            // This message is then mostly for the future myself who will scream out loud when seeing that it was actually required :)
            if (bruteForce) {
                this.resetTextureCache();
                this._currentProgram = null;
                this._stencilState.reset();
                this._depthCullingState.reset();
                this.setDepthFunctionToLessOrEqual();
                this._alphaState.reset();
            }
            this._cachedVertexBuffers = null;
            this._cachedIndexBuffer = null;
            this._cachedEffectForVertexBuffers = null;
            this._unbindVertexArrayObject();
            this.bindIndexBuffer(null);
            this.bindArrayBuffer(null);
        };
        /**
         * Set the compressed texture format to use, based on the formats you have, and the formats
         * supported by the hardware / browser.
         *
         * Khronos Texture Container (.ktx) files are used to support this.  This format has the
         * advantage of being specifically designed for OpenGL.  Header elements directly correspond
         * to API arguments needed to compressed textures.  This puts the burden on the container
         * generator to house the arcane code for determining these for current & future formats.
         *
         * for description see https://www.khronos.org/opengles/sdk/tools/KTX/
         * for file layout see https://www.khronos.org/opengles/sdk/tools/KTX/file_format_spec/
         *
         * Note: The result of this call is not taken into account when a texture is base64.
         *
         * @param {Array<string>} formatsAvailable- The list of those format families you have created
         * on your server.  Syntax: '-' + format family + '.ktx'.  (Case and order do not matter.)
         *
         * Current families are astc, dxt, pvrtc, etc2, & etc1.
         * @returns The extension selected.
         */
        Engine.prototype.setTextureFormatToUse = function (formatsAvailable) {
            for (var i = 0, len1 = this.texturesSupported.length; i < len1; i++) {
                for (var j = 0, len2 = formatsAvailable.length; j < len2; j++) {
                    if (this._texturesSupported[i] === formatsAvailable[j].toLowerCase()) {
                        return this._textureFormatInUse = this._texturesSupported[i];
                    }
                }
            }
            // actively set format to nothing, to allow this to be called more than once
            // and possibly fail the 2nd time
            this._textureFormatInUse = null;
            return null;
        };
        Engine.prototype._createTexture = function () {
            var texture = this._gl.createTexture();
            if (!texture) {
                throw new Error("Unable to create texture");
            }
            return texture;
        };
        /**
         * Usually called from BABYLON.Texture.ts.  Passed information to create a WebGLTexture.
         * @param {string} urlArg- This contains one of the following:
         *                         1. A conventional http URL, e.g. 'http://...' or 'file://...'
         *                         2. A base64 string of in-line texture data, e.g. 'data:image/jpg;base64,/...'
         *                         3. An indicator that data being passed using the buffer parameter, e.g. 'data:mytexture.jpg'
         *
         * @param {boolean} noMipmap- When true, no mipmaps shall be generated.  Ignored for compressed textures.  They must be in the file.
         * @param {boolean} invertY- When true, image is flipped when loaded.  You probably want true. Ignored for compressed textures.  Must be flipped in the file.
         * @param {Scene} scene- Needed for loading to the correct scene.
         * @param {number} samplingMode- Mode with should be used sample / access the texture.  Default: TRILINEAR
         * @param {callback} onLoad- Optional callback to be called upon successful completion.
         * @param {callback} onError- Optional callback to be called upon failure.
         * @param {ArrayBuffer | HTMLImageElement} buffer- A source of a file previously fetched as either an ArrayBuffer (compressed or image format) or HTMLImageElement (image format)
         * @param {WebGLTexture} fallback- An internal argument in case the function must be called again, due to etc1 not having alpha capabilities.
         * @param {number} format-  Internal format.  Default: RGB when extension is '.jpg' else RGBA.  Ignored for compressed textures.
         *
         * @returns {WebGLTexture} for assignment back into BABYLON.Texture
         */
        Engine.prototype.createTexture = function (urlArg, noMipmap, invertY, scene, samplingMode, onLoad, onError, buffer, fallBack, format) {
            var _this = this;
            if (samplingMode === void 0) { samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE; }
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            if (buffer === void 0) { buffer = null; }
            if (fallBack === void 0) { fallBack = null; }
            if (format === void 0) { format = null; }
            var url = String(urlArg); // assign a new string, so that the original is still available in case of fallback
            var fromData = url.substr(0, 5) === "data:";
            var fromBlob = url.substr(0, 5) === "blob:";
            var isBase64 = fromData && url.indexOf("base64") !== -1;
            var texture = fallBack ? fallBack : new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_URL);
            // establish the file extension, if possible
            var lastDot = url.lastIndexOf('.');
            var extension = (lastDot > 0) ? url.substring(lastDot).toLowerCase() : "";
            var isDDS = this.getCaps().s3tc && (extension === ".dds");
            var isTGA = (extension === ".tga");
            // determine if a ktx file should be substituted
            var isKTX = false;
            if (this._textureFormatInUse && !isBase64 && !fallBack) {
                url = url.substring(0, lastDot) + this._textureFormatInUse;
                isKTX = true;
            }
            if (scene) {
                scene._addPendingData(texture);
            }
            texture.url = url;
            texture.generateMipMaps = !noMipmap;
            texture.samplingMode = samplingMode;
            texture.invertY = invertY;
            if (!this._doNotHandleContextLost) {
                // Keep a link to the buffer only if we plan to handle context lost
                texture._buffer = buffer;
            }
            var onLoadObserver = null;
            if (onLoad && !fallBack) {
                onLoadObserver = texture.onLoadedObservable.add(onLoad);
            }
            if (!fallBack)
                this._internalTexturesCache.push(texture);
            var onerror = function (message, exception) {
                if (scene) {
                    scene._removePendingData(texture);
                }
                if (onLoadObserver) {
                    texture.onLoadedObservable.remove(onLoadObserver);
                }
                // fallback for when compressed file not found to try again.  For instance, etc1 does not have an alpha capable type
                if (isKTX) {
                    _this.createTexture(urlArg, noMipmap, invertY, scene, samplingMode, null, onError, buffer, texture);
                }
                else if (BABYLON.Tools.UseFallbackTexture) {
                    _this.createTexture(BABYLON.Tools.fallbackTexture, noMipmap, invertY, scene, samplingMode, null, onError, buffer, texture);
                }
                if (onError) {
                    onError(message || "Unknown error", exception);
                }
            };
            var callback = null;
            // processing for non-image formats
            if (isKTX || isTGA || isDDS) {
                if (isKTX) {
                    callback = function (data) {
                        var ktx = new BABYLON.Internals.KhronosTextureContainer(data, 1);
                        _this._prepareWebGLTexture(texture, scene, ktx.pixelWidth, ktx.pixelHeight, invertY, false, true, function () {
                            ktx.uploadLevels(_this._gl, !noMipmap);
                            return false;
                        }, samplingMode);
                    };
                }
                else if (isTGA) {
                    callback = function (arrayBuffer) {
                        var data = new Uint8Array(arrayBuffer);
                        var header = BABYLON.Internals.TGATools.GetTGAHeader(data);
                        _this._prepareWebGLTexture(texture, scene, header.width, header.height, invertY, noMipmap, false, function () {
                            BABYLON.Internals.TGATools.UploadContent(_this._gl, data);
                            return false;
                        }, samplingMode);
                    };
                }
                else if (isDDS) {
                    callback = function (data) {
                        var info = BABYLON.Internals.DDSTools.GetDDSInfo(data);
                        var loadMipmap = (info.isRGB || info.isLuminance || info.mipmapCount > 1) && !noMipmap && ((info.width >> (info.mipmapCount - 1)) === 1);
                        _this._prepareWebGLTexture(texture, scene, info.width, info.height, invertY, !loadMipmap, info.isFourCC, function () {
                            BABYLON.Internals.DDSTools.UploadDDSLevels(_this, _this._gl, data, info, loadMipmap, 1);
                            return false;
                        }, samplingMode);
                    };
                }
                if (!buffer) {
                    this._loadFile(url, function (data) {
                        if (callback) {
                            callback(data);
                        }
                    }, undefined, scene ? scene.database : undefined, true, function (request, exception) {
                        onerror("Unable to load " + (request ? request.responseURL : url, exception));
                    });
                }
                else {
                    if (callback) {
                        callback(buffer);
                    }
                }
                // image format processing
            }
            else {
                var onload = function (img) {
                    if (fromBlob && !_this._doNotHandleContextLost) {
                        // We need to store the image if we need to rebuild the texture
                        // in case of a webgl context lost
                        texture._buffer = img;
                    }
                    _this._prepareWebGLTexture(texture, scene, img.width, img.height, invertY, noMipmap, false, function (potWidth, potHeight, continuationCallback) {
                        var gl = _this._gl;
                        var isPot = (img.width === potWidth && img.height === potHeight);
                        var internalFormat = format ? _this._getInternalFormat(format) : ((extension === ".jpg") ? gl.RGB : gl.RGBA);
                        if (isPot) {
                            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, img);
                            return false;
                        }
                        // Using shaders to rescale because canvas.drawImage is lossy
                        var source = new BABYLON.InternalTexture(_this, BABYLON.InternalTexture.DATASOURCE_TEMP);
                        _this._bindTextureDirectly(gl.TEXTURE_2D, source, true);
                        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, img);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                        _this._rescaleTexture(source, texture, scene, internalFormat, function () {
                            _this._releaseTexture(source);
                            _this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
                            continuationCallback();
                        });
                        return true;
                    }, samplingMode);
                };
                if (!fromData || isBase64)
                    if (buffer instanceof HTMLImageElement) {
                        onload(buffer);
                    }
                    else {
                        BABYLON.Tools.LoadImage(url, onload, onerror, scene ? scene.database : null);
                    }
                else if (buffer instanceof Array || typeof buffer === "string" || buffer instanceof ArrayBuffer)
                    BABYLON.Tools.LoadImage(buffer, onload, onerror, scene ? scene.database : null);
                else
                    onload(buffer);
            }
            return texture;
        };
        Engine.prototype._rescaleTexture = function (source, destination, scene, internalFormat, onComplete) {
            var _this = this;
            var rtt = this.createRenderTargetTexture({
                width: destination.width,
                height: destination.height,
            }, {
                generateMipMaps: false,
                type: Engine.TEXTURETYPE_UNSIGNED_INT,
                samplingMode: BABYLON.Texture.BILINEAR_SAMPLINGMODE,
                generateDepthBuffer: false,
                generateStencilBuffer: false
            });
            if (!this._rescalePostProcess) {
                this._rescalePostProcess = new BABYLON.PassPostProcess("rescale", 1, null, BABYLON.Texture.BILINEAR_SAMPLINGMODE, this, false, Engine.TEXTURETYPE_UNSIGNED_INT);
            }
            this._rescalePostProcess.getEffect().executeWhenCompiled(function () {
                _this._rescalePostProcess.onApply = function (effect) {
                    effect._bindTexture("textureSampler", source);
                };
                var hostingScene = scene;
                if (!hostingScene) {
                    hostingScene = _this.scenes[_this.scenes.length - 1];
                }
                hostingScene.postProcessManager.directRender([_this._rescalePostProcess], rtt, true);
                _this._bindTextureDirectly(_this._gl.TEXTURE_2D, destination, true);
                _this._gl.copyTexImage2D(_this._gl.TEXTURE_2D, 0, internalFormat, 0, 0, destination.width, destination.height, 0);
                _this.unBindFramebuffer(rtt);
                _this._releaseTexture(rtt);
                if (onComplete) {
                    onComplete();
                }
            });
        };
        Engine.prototype._getInternalFormat = function (format) {
            var internalFormat = this._gl.RGBA;
            switch (format) {
                case Engine.TEXTUREFORMAT_ALPHA:
                    internalFormat = this._gl.ALPHA;
                    break;
                case Engine.TEXTUREFORMAT_LUMINANCE:
                    internalFormat = this._gl.LUMINANCE;
                    break;
                case Engine.TEXTUREFORMAT_LUMINANCE_ALPHA:
                    internalFormat = this._gl.LUMINANCE_ALPHA;
                    break;
                case Engine.TEXTUREFORMAT_RGB:
                    internalFormat = this._gl.RGB;
                    break;
                case Engine.TEXTUREFORMAT_RGBA:
                    internalFormat = this._gl.RGBA;
                    break;
            }
            return internalFormat;
        };
        Engine.prototype.updateRawTexture = function (texture, data, format, invertY, compression, type) {
            if (compression === void 0) { compression = null; }
            if (type === void 0) { type = Engine.TEXTURETYPE_UNSIGNED_INT; }
            if (!texture) {
                return;
            }
            var internalFormat = this._getInternalFormat(format);
            var internalSizedFomat = this._getRGBABufferInternalSizedFormat(type);
            var textureType = this._getWebGLTextureType(type);
            this._bindTextureDirectly(this._gl.TEXTURE_2D, texture, true);
            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, invertY === undefined ? 1 : (invertY ? 1 : 0));
            if (!this._doNotHandleContextLost) {
                texture._bufferView = data;
                texture.format = format;
                texture.type = type;
                texture.invertY = invertY;
                texture._compression = compression;
            }
            if (texture.width % 4 !== 0) {
                this._gl.pixelStorei(this._gl.UNPACK_ALIGNMENT, 1);
            }
            if (compression && data) {
                this._gl.compressedTexImage2D(this._gl.TEXTURE_2D, 0, this.getCaps().s3tc[compression], texture.width, texture.height, 0, data);
            }
            else {
                this._gl.texImage2D(this._gl.TEXTURE_2D, 0, internalSizedFomat, texture.width, texture.height, 0, internalFormat, textureType, data);
            }
            if (texture.generateMipMaps) {
                this._gl.generateMipmap(this._gl.TEXTURE_2D);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
            //  this.resetTextureCache();
            texture.isReady = true;
        };
        Engine.prototype.createRawTexture = function (data, width, height, format, generateMipMaps, invertY, samplingMode, compression, type) {
            if (compression === void 0) { compression = null; }
            if (type === void 0) { type = Engine.TEXTURETYPE_UNSIGNED_INT; }
            var texture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_RAW);
            texture.baseWidth = width;
            texture.baseHeight = height;
            texture.width = width;
            texture.height = height;
            texture.format = format;
            texture.generateMipMaps = generateMipMaps;
            texture.samplingMode = samplingMode;
            texture.invertY = invertY;
            texture._compression = compression;
            texture.type = type;
            if (!this._doNotHandleContextLost) {
                texture._bufferView = data;
            }
            this.updateRawTexture(texture, data, format, invertY, compression, type);
            this._bindTextureDirectly(this._gl.TEXTURE_2D, texture, true);
            // Filters
            var filters = getSamplingParameters(samplingMode, generateMipMaps, this._gl);
            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, filters.mag);
            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, filters.min);
            if (generateMipMaps) {
                this._gl.generateMipmap(this._gl.TEXTURE_2D);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
            this._internalTexturesCache.push(texture);
            return texture;
        };
        Engine.prototype.createDynamicTexture = function (width, height, generateMipMaps, samplingMode) {
            var texture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_DYNAMIC);
            texture.baseWidth = width;
            texture.baseHeight = height;
            if (generateMipMaps) {
                width = this.needPOTTextures ? BABYLON.Tools.GetExponentOfTwo(width, this._caps.maxTextureSize) : width;
                height = this.needPOTTextures ? BABYLON.Tools.GetExponentOfTwo(height, this._caps.maxTextureSize) : height;
            }
            //  this.resetTextureCache();
            texture.width = width;
            texture.height = height;
            texture.isReady = false;
            texture.generateMipMaps = generateMipMaps;
            texture.samplingMode = samplingMode;
            this.updateTextureSamplingMode(samplingMode, texture);
            this._internalTexturesCache.push(texture);
            return texture;
        };
        Engine.prototype.updateTextureSamplingMode = function (samplingMode, texture) {
            var filters = getSamplingParameters(samplingMode, texture.generateMipMaps, this._gl);
            if (texture.isCube) {
                this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, texture, true);
                this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_MAG_FILTER, filters.mag);
                this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_MIN_FILTER, filters.min);
                this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
            }
            else if (texture.is3D) {
                this._bindTextureDirectly(this._gl.TEXTURE_3D, texture, true);
                this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_MAG_FILTER, filters.mag);
                this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_MIN_FILTER, filters.min);
                this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
            }
            else {
                this._bindTextureDirectly(this._gl.TEXTURE_2D, texture, true);
                this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, filters.mag);
                this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, filters.min);
                this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
            }
            texture.samplingMode = samplingMode;
        };
        Engine.prototype.updateDynamicTexture = function (texture, canvas, invertY, premulAlpha, format) {
            if (premulAlpha === void 0) { premulAlpha = false; }
            if (!texture) {
                return;
            }
            this._bindTextureDirectly(this._gl.TEXTURE_2D, texture, true);
            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, invertY ? 1 : 0);
            if (premulAlpha) {
                this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            }
            var internalFormat = format ? this._getInternalFormat(format) : this._gl.RGBA;
            this._gl.texImage2D(this._gl.TEXTURE_2D, 0, internalFormat, internalFormat, this._gl.UNSIGNED_BYTE, canvas);
            if (texture.generateMipMaps) {
                this._gl.generateMipmap(this._gl.TEXTURE_2D);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
            if (premulAlpha) {
                this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
            }
            texture.isReady = true;
        };
        Engine.prototype.updateVideoTexture = function (texture, video, invertY) {
            if (!texture || texture._isDisabled) {
                return;
            }
            this._bindTextureDirectly(this._gl.TEXTURE_2D, texture, true);
            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, invertY ? 0 : 1); // Video are upside down by default
            try {
                // Testing video texture support
                if (this._videoTextureSupported === undefined) {
                    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, video);
                    if (this._gl.getError() !== 0) {
                        this._videoTextureSupported = false;
                    }
                    else {
                        this._videoTextureSupported = true;
                    }
                }
                // Copy video through the current working canvas if video texture is not supported
                if (!this._videoTextureSupported) {
                    if (!texture._workingCanvas) {
                        texture._workingCanvas = document.createElement("canvas");
                        var context = texture._workingCanvas.getContext("2d");
                        if (!context) {
                            throw new Error("Unable to get 2d context");
                        }
                        texture._workingContext = context;
                        texture._workingCanvas.width = texture.width;
                        texture._workingCanvas.height = texture.height;
                    }
                    texture._workingContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, texture.width, texture.height);
                    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, texture._workingCanvas);
                }
                else {
                    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, video);
                }
                if (texture.generateMipMaps) {
                    this._gl.generateMipmap(this._gl.TEXTURE_2D);
                }
                this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
                //    this.resetTextureCache();
                texture.isReady = true;
            }
            catch (ex) {
                // Something unexpected
                // Let's disable the texture
                texture._isDisabled = true;
            }
        };
        Engine.prototype.createRenderTargetTexture = function (size, options) {
            var fullOptions = new RenderTargetCreationOptions();
            if (options !== undefined && typeof options === "object") {
                fullOptions.generateMipMaps = options.generateMipMaps;
                fullOptions.generateDepthBuffer = options.generateDepthBuffer === undefined ? true : options.generateDepthBuffer;
                fullOptions.generateStencilBuffer = fullOptions.generateDepthBuffer && options.generateStencilBuffer;
                fullOptions.type = options.type === undefined ? Engine.TEXTURETYPE_UNSIGNED_INT : options.type;
                fullOptions.samplingMode = options.samplingMode === undefined ? BABYLON.Texture.TRILINEAR_SAMPLINGMODE : options.samplingMode;
            }
            else {
                fullOptions.generateMipMaps = options;
                fullOptions.generateDepthBuffer = true;
                fullOptions.generateStencilBuffer = false;
                fullOptions.type = Engine.TEXTURETYPE_UNSIGNED_INT;
                fullOptions.samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE;
            }
            if (fullOptions.type === Engine.TEXTURETYPE_FLOAT && !this._caps.textureFloatLinearFiltering) {
                // if floating point linear (gl.FLOAT) then force to NEAREST_SAMPLINGMODE
                fullOptions.samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE;
            }
            else if (fullOptions.type === Engine.TEXTURETYPE_HALF_FLOAT && !this._caps.textureHalfFloatLinearFiltering) {
                // if floating point linear (HALF_FLOAT) then force to NEAREST_SAMPLINGMODE
                fullOptions.samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE;
            }
            var gl = this._gl;
            var texture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_RENDERTARGET);
            this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
            var width = size.width || size;
            var height = size.height || size;
            var filters = getSamplingParameters(fullOptions.samplingMode, fullOptions.generateMipMaps ? true : false, gl);
            if (fullOptions.type === Engine.TEXTURETYPE_FLOAT && !this._caps.textureFloat) {
                fullOptions.type = Engine.TEXTURETYPE_UNSIGNED_INT;
                BABYLON.Tools.Warn("Float textures are not supported. Render target forced to TEXTURETYPE_UNSIGNED_BYTE type");
            }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filters.mag);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filters.min);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, this._getRGBABufferInternalSizedFormat(fullOptions.type), width, height, 0, gl.RGBA, this._getWebGLTextureType(fullOptions.type), null);
            // Create the framebuffer
            var framebuffer = gl.createFramebuffer();
            this.bindUnboundFramebuffer(framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture._webGLTexture, 0);
            texture._depthStencilBuffer = this._setupFramebufferDepthAttachments(fullOptions.generateStencilBuffer ? true : false, fullOptions.generateDepthBuffer, width, height);
            if (fullOptions.generateMipMaps) {
                this._gl.generateMipmap(this._gl.TEXTURE_2D);
            }
            // Unbind
            this._bindTextureDirectly(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            this.bindUnboundFramebuffer(null);
            texture._framebuffer = framebuffer;
            texture.baseWidth = width;
            texture.baseHeight = height;
            texture.width = width;
            texture.height = height;
            texture.isReady = true;
            texture.samples = 1;
            texture.generateMipMaps = fullOptions.generateMipMaps ? true : false;
            texture.samplingMode = fullOptions.samplingMode;
            texture.type = fullOptions.type;
            texture._generateDepthBuffer = fullOptions.generateDepthBuffer;
            texture._generateStencilBuffer = fullOptions.generateStencilBuffer ? true : false;
            // this.resetTextureCache();
            this._internalTexturesCache.push(texture);
            return texture;
        };
        Engine.prototype.createMultipleRenderTarget = function (size, options) {
            var generateMipMaps = false;
            var generateDepthBuffer = true;
            var generateStencilBuffer = false;
            var generateDepthTexture = false;
            var textureCount = 1;
            var defaultType = Engine.TEXTURETYPE_UNSIGNED_INT;
            var defaultSamplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE;
            var types = [], samplingModes = [];
            if (options !== undefined) {
                generateMipMaps = options.generateMipMaps;
                generateDepthBuffer = options.generateDepthBuffer === undefined ? true : options.generateDepthBuffer;
                generateStencilBuffer = options.generateStencilBuffer;
                generateDepthTexture = options.generateDepthTexture;
                textureCount = options.textureCount || 1;
                if (options.types) {
                    types = options.types;
                }
                if (options.samplingModes) {
                    samplingModes = options.samplingModes;
                }
            }
            var gl = this._gl;
            // Create the framebuffer
            var framebuffer = gl.createFramebuffer();
            this.bindUnboundFramebuffer(framebuffer);
            var width = size.width || size;
            var height = size.height || size;
            var textures = [];
            var attachments = [];
            var depthStencilBuffer = this._setupFramebufferDepthAttachments(generateStencilBuffer, generateDepthBuffer, width, height);
            for (var i = 0; i < textureCount; i++) {
                var samplingMode = samplingModes[i] || defaultSamplingMode;
                var type = types[i] || defaultType;
                if (type === Engine.TEXTURETYPE_FLOAT && !this._caps.textureFloatLinearFiltering) {
                    // if floating point linear (gl.FLOAT) then force to NEAREST_SAMPLINGMODE
                    samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE;
                }
                else if (type === Engine.TEXTURETYPE_HALF_FLOAT && !this._caps.textureHalfFloatLinearFiltering) {
                    // if floating point linear (HALF_FLOAT) then force to NEAREST_SAMPLINGMODE
                    samplingMode = BABYLON.Texture.NEAREST_SAMPLINGMODE;
                }
                var filters = getSamplingParameters(samplingMode, generateMipMaps, gl);
                if (type === Engine.TEXTURETYPE_FLOAT && !this._caps.textureFloat) {
                    type = Engine.TEXTURETYPE_UNSIGNED_INT;
                    BABYLON.Tools.Warn("Float textures are not supported. Render target forced to TEXTURETYPE_UNSIGNED_BYTE type");
                }
                var texture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_MULTIRENDERTARGET);
                var attachment = gl[this.webGLVersion > 1 ? "COLOR_ATTACHMENT" + i : "COLOR_ATTACHMENT" + i + "_WEBGL"];
                textures.push(texture);
                attachments.push(attachment);
                gl.activeTexture(gl["TEXTURE" + i]);
                gl.bindTexture(gl.TEXTURE_2D, texture._webGLTexture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filters.mag);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filters.min);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texImage2D(gl.TEXTURE_2D, 0, this._getRGBABufferInternalSizedFormat(type), width, height, 0, gl.RGBA, this._getWebGLTextureType(type), null);
                gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture._webGLTexture, 0);
                if (generateMipMaps) {
                    this._gl.generateMipmap(this._gl.TEXTURE_2D);
                }
                // Unbind
                this._bindTextureDirectly(gl.TEXTURE_2D, null);
                texture._framebuffer = framebuffer;
                texture._depthStencilBuffer = depthStencilBuffer;
                texture.baseWidth = width;
                texture.baseHeight = height;
                texture.width = width;
                texture.height = height;
                texture.isReady = true;
                texture.samples = 1;
                texture.generateMipMaps = generateMipMaps;
                texture.samplingMode = samplingMode;
                texture.type = type;
                texture._generateDepthBuffer = generateDepthBuffer;
                texture._generateStencilBuffer = generateStencilBuffer;
                this._internalTexturesCache.push(texture);
            }
            if (generateDepthTexture && this._caps.depthTextureExtension) {
                // Depth texture
                var depthTexture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_MULTIRENDERTARGET);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, depthTexture._webGLTexture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texImage2D(gl.TEXTURE_2D, 0, this.webGLVersion < 2 ? gl.DEPTH_COMPONENT : gl.DEPTH_COMPONENT16, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture._webGLTexture, 0);
                depthTexture._framebuffer = framebuffer;
                depthTexture.baseWidth = width;
                depthTexture.baseHeight = height;
                depthTexture.width = width;
                depthTexture.height = height;
                depthTexture.isReady = true;
                depthTexture.samples = 1;
                depthTexture.generateMipMaps = generateMipMaps;
                depthTexture.samplingMode = gl.NEAREST;
                depthTexture._generateDepthBuffer = generateDepthBuffer;
                depthTexture._generateStencilBuffer = generateStencilBuffer;
                textures.push(depthTexture);
                this._internalTexturesCache.push(depthTexture);
            }
            gl.drawBuffers(attachments);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            this.bindUnboundFramebuffer(null);
            this.resetTextureCache();
            return textures;
        };
        Engine.prototype._setupFramebufferDepthAttachments = function (generateStencilBuffer, generateDepthBuffer, width, height, samples) {
            if (samples === void 0) { samples = 1; }
            var depthStencilBuffer = null;
            var gl = this._gl;
            // Create the depth/stencil buffer
            if (generateStencilBuffer) {
                depthStencilBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);
                if (samples > 1) {
                    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.DEPTH24_STENCIL8, width, height);
                }
                else {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
                }
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilBuffer);
            }
            else if (generateDepthBuffer) {
                depthStencilBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);
                if (samples > 1) {
                    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.DEPTH_COMPONENT16, width, height);
                }
                else {
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
                }
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthStencilBuffer);
            }
            return depthStencilBuffer;
        };
        Engine.prototype.updateRenderTargetTextureSampleCount = function (texture, samples) {
            if (this.webGLVersion < 2 || !texture) {
                return 1;
            }
            if (texture.samples === samples) {
                return samples;
            }
            var gl = this._gl;
            samples = Math.min(samples, gl.getParameter(gl.MAX_SAMPLES));
            // Dispose previous render buffers
            if (texture._depthStencilBuffer) {
                gl.deleteRenderbuffer(texture._depthStencilBuffer);
            }
            if (texture._MSAAFramebuffer) {
                gl.deleteFramebuffer(texture._MSAAFramebuffer);
            }
            if (texture._MSAARenderBuffer) {
                gl.deleteRenderbuffer(texture._MSAARenderBuffer);
            }
            if (samples > 1) {
                var framebuffer = gl.createFramebuffer();
                if (!framebuffer) {
                    throw new Error("Unable to create multi sampled framebuffer");
                }
                texture._MSAAFramebuffer = framebuffer;
                this.bindUnboundFramebuffer(texture._MSAAFramebuffer);
                var colorRenderbuffer = gl.createRenderbuffer();
                if (!colorRenderbuffer) {
                    throw new Error("Unable to create multi sampled framebuffer");
                }
                gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderbuffer);
                gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.RGBA8, texture.width, texture.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorRenderbuffer);
                texture._MSAARenderBuffer = colorRenderbuffer;
            }
            else {
                this.bindUnboundFramebuffer(texture._framebuffer);
            }
            texture.samples = samples;
            texture._depthStencilBuffer = this._setupFramebufferDepthAttachments(texture._generateStencilBuffer, texture._generateDepthBuffer, texture.width, texture.height, samples);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            this.bindUnboundFramebuffer(null);
            return samples;
        };
        Engine.prototype._uploadDataToTexture = function (target, lod, internalFormat, width, height, format, type, data) {
            this._gl.texImage2D(target, lod, internalFormat, width, height, 0, format, type, data);
        };
        Engine.prototype._uploadCompressedDataToTexture = function (target, lod, internalFormat, width, height, data) {
            this._gl.compressedTexImage2D(target, lod, internalFormat, width, height, 0, data);
        };
        Engine.prototype.createRenderTargetCubeTexture = function (size, options) {
            var gl = this._gl;
            var texture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_RENDERTARGET);
            var generateMipMaps = true;
            var generateDepthBuffer = true;
            var generateStencilBuffer = false;
            var samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE;
            if (options !== undefined) {
                generateMipMaps = options.generateMipMaps === undefined ? true : options.generateMipMaps;
                generateDepthBuffer = options.generateDepthBuffer === undefined ? true : options.generateDepthBuffer;
                generateStencilBuffer = (generateDepthBuffer && options.generateStencilBuffer) ? true : false;
                if (options.samplingMode !== undefined) {
                    samplingMode = options.samplingMode;
                }
            }
            texture.isCube = true;
            texture.generateMipMaps = generateMipMaps;
            texture.samples = 1;
            texture.samplingMode = samplingMode;
            var filters = getSamplingParameters(samplingMode, generateMipMaps, gl);
            this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
            for (var face = 0; face < 6; face++) {
                gl.texImage2D((gl.TEXTURE_CUBE_MAP_POSITIVE_X + face), 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, filters.mag);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, filters.min);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // Create the framebuffer
            var framebuffer = gl.createFramebuffer();
            this.bindUnboundFramebuffer(framebuffer);
            texture._depthStencilBuffer = this._setupFramebufferDepthAttachments(generateStencilBuffer, generateDepthBuffer, size, size);
            // Mipmaps
            if (texture.generateMipMaps) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }
            // Unbind
            this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            this.bindUnboundFramebuffer(null);
            texture._framebuffer = framebuffer;
            texture.width = size;
            texture.height = size;
            texture.isReady = true;
            //this.resetTextureCache();
            this._internalTexturesCache.push(texture);
            return texture;
        };
        Engine.prototype.createPrefilteredCubeTexture = function (rootUrl, scene, scale, offset, onLoad, onError, format, forcedExtension) {
            var _this = this;
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            if (forcedExtension === void 0) { forcedExtension = null; }
            var callback = function (loadData) {
                if (!loadData) {
                    if (onLoad) {
                        onLoad(null);
                    }
                    return;
                }
                var texture = loadData.texture;
                texture._dataSource = BABYLON.InternalTexture.DATASOURCE_CUBEPREFILTERED;
                texture._lodGenerationScale = scale;
                texture._lodGenerationOffset = offset;
                if (_this._caps.textureLOD) {
                    // Do not add extra process if texture lod is supported.
                    if (onLoad) {
                        onLoad(texture);
                    }
                    return;
                }
                var mipSlices = 3;
                var gl = _this._gl;
                var width = loadData.width;
                if (!width) {
                    return;
                }
                var textures = [];
                for (var i = 0; i < mipSlices; i++) {
                    //compute LOD from even spacing in smoothness (matching shader calculation)
                    var smoothness = i / (mipSlices - 1);
                    var roughness = 1 - smoothness;
                    var minLODIndex = offset; // roughness = 0
                    var maxLODIndex = BABYLON.Scalar.Log2(width) * scale + offset; // roughness = 1
                    var lodIndex = minLODIndex + (maxLODIndex - minLODIndex) * roughness;
                    var mipmapIndex = Math.round(Math.min(Math.max(lodIndex, 0), maxLODIndex));
                    var glTextureFromLod = new BABYLON.InternalTexture(_this, BABYLON.InternalTexture.DATASOURCE_TEMP);
                    glTextureFromLod.isCube = true;
                    _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, glTextureFromLod, true);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    if (loadData.isDDS) {
                        var info = loadData.info;
                        var data = loadData.data;
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, info.isCompressed ? 1 : 0);
                        BABYLON.Internals.DDSTools.UploadDDSLevels(_this, _this._gl, data, info, true, 6, mipmapIndex);
                    }
                    else {
                        BABYLON.Tools.Warn("DDS is the only prefiltered cube map supported so far.");
                    }
                    _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
                    // Wrap in a base texture for easy binding.
                    var lodTexture = new BABYLON.BaseTexture(scene);
                    lodTexture.isCube = true;
                    lodTexture._texture = glTextureFromLod;
                    glTextureFromLod.isReady = true;
                    textures.push(lodTexture);
                }
                texture._lodTextureHigh = textures[2];
                texture._lodTextureMid = textures[1];
                texture._lodTextureLow = textures[0];
                if (onLoad) {
                    onLoad(texture);
                }
            };
            return this.createCubeTexture(rootUrl, scene, null, false, callback, onError, format, forcedExtension);
        };
        Engine.prototype.createCubeTexture = function (rootUrl, scene, files, noMipmap, onLoad, onError, format, forcedExtension) {
            var _this = this;
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            if (forcedExtension === void 0) { forcedExtension = null; }
            var gl = this._gl;
            var texture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_CUBE);
            texture.isCube = true;
            texture.url = rootUrl;
            texture.generateMipMaps = !noMipmap;
            if (!this._doNotHandleContextLost) {
                texture._extension = forcedExtension;
                texture._files = files;
            }
            var isKTX = false;
            var isDDS = false;
            var lastDot = rootUrl.lastIndexOf('.');
            var extension = forcedExtension ? forcedExtension : (lastDot > -1 ? rootUrl.substring(lastDot).toLowerCase() : "");
            if (this._textureFormatInUse) {
                extension = this._textureFormatInUse;
                rootUrl = (lastDot > -1 ? rootUrl.substring(0, lastDot) : rootUrl) + this._textureFormatInUse;
                isKTX = true;
            }
            else {
                isDDS = (extension === ".dds");
            }
            var onerror = function (request, exception) {
                if (onError && request) {
                    onError(request.status + " " + request.statusText, exception);
                }
            };
            if (isKTX) {
                this._loadFile(rootUrl, function (data) {
                    var ktx = new BABYLON.Internals.KhronosTextureContainer(data, 6);
                    var loadMipmap = ktx.numberOfMipmapLevels > 1 && !noMipmap;
                    _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                    ktx.uploadLevels(_this._gl, !noMipmap);
                    _this.setCubeMapTextureParams(gl, loadMipmap);
                    texture.width = ktx.pixelWidth;
                    texture.height = ktx.pixelHeight;
                    texture.isReady = true;
                }, undefined, undefined, true, onerror);
            }
            else if (isDDS) {
                if (files && files.length === 6) {
                    this._cascadeLoadFiles(rootUrl, scene, function (imgs) {
                        var info;
                        var loadMipmap = false;
                        var width = 0;
                        for (var index = 0; index < imgs.length; index++) {
                            var data = imgs[index];
                            info = BABYLON.Internals.DDSTools.GetDDSInfo(data);
                            loadMipmap = (info.isRGB || info.isLuminance || info.mipmapCount > 1) && !noMipmap;
                            _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
                            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, info.isCompressed ? 1 : 0);
                            BABYLON.Internals.DDSTools.UploadDDSLevels(_this, _this._gl, data, info, loadMipmap, 6, -1, index);
                            if (!noMipmap && !info.isFourCC && info.mipmapCount === 1) {
                                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                            }
                            texture.width = info.width;
                            texture.height = info.height;
                            texture.type = info.textureType;
                            width = info.width;
                        }
                        _this.setCubeMapTextureParams(gl, loadMipmap);
                        texture.isReady = true;
                        if (onLoad) {
                            onLoad({ isDDS: true, width: width, info: info, imgs: imgs, texture: texture });
                        }
                    }, files, onError);
                }
                else {
                    this._loadFile(rootUrl, function (data) {
                        var info = BABYLON.Internals.DDSTools.GetDDSInfo(data);
                        var loadMipmap = (info.isRGB || info.isLuminance || info.mipmapCount > 1) && !noMipmap;
                        _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, info.isCompressed ? 1 : 0);
                        BABYLON.Internals.DDSTools.UploadDDSLevels(_this, _this._gl, data, info, loadMipmap, 6);
                        if (!noMipmap && !info.isFourCC && info.mipmapCount === 1) {
                            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                        }
                        _this.setCubeMapTextureParams(gl, loadMipmap);
                        texture.width = info.width;
                        texture.height = info.height;
                        texture.isReady = true;
                        texture.type = info.textureType;
                        if (onLoad) {
                            onLoad({ isDDS: true, width: info.width, info: info, data: data, texture: texture });
                        }
                    }, undefined, undefined, true, onerror);
                }
            }
            else {
                if (!files) {
                    throw new Error("Cannot load cubemap because files were not defined");
                }
                cascadeLoadImgs(rootUrl, scene, function (imgs) {
                    var width = _this.needPOTTextures ? BABYLON.Tools.GetExponentOfTwo(imgs[0].width, _this._caps.maxCubemapTextureSize) : imgs[0].width;
                    var height = width;
                    _this._prepareWorkingCanvas();
                    if (!_this._workingCanvas || !_this._workingContext) {
                        return;
                    }
                    _this._workingCanvas.width = width;
                    _this._workingCanvas.height = height;
                    var faces = [
                        gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                        gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                    ];
                    _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
                    var internalFormat = format ? _this._getInternalFormat(format) : _this._gl.RGBA;
                    for (var index = 0; index < faces.length; index++) {
                        _this._workingContext.drawImage(imgs[index], 0, 0, imgs[index].width, imgs[index].height, 0, 0, width, height);
                        gl.texImage2D(faces[index], 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, _this._workingCanvas);
                    }
                    if (!noMipmap) {
                        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                    }
                    _this.setCubeMapTextureParams(gl, !noMipmap);
                    texture.width = width;
                    texture.height = height;
                    texture.isReady = true;
                    if (format) {
                        texture.format = format;
                    }
                    texture.onLoadedObservable.notifyObservers(texture);
                    texture.onLoadedObservable.clear();
                    if (onLoad) {
                        onLoad();
                    }
                }, files, onError);
            }
            this._internalTexturesCache.push(texture);
            return texture;
        };
        Engine.prototype.setCubeMapTextureParams = function (gl, loadMipmap) {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, loadMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
            //  this.resetTextureCache();
        };
        Engine.prototype.updateRawCubeTexture = function (texture, data, format, type, invertY, compression, level) {
            if (compression === void 0) { compression = null; }
            if (level === void 0) { level = 0; }
            texture._bufferViewArray = data;
            texture.format = format;
            texture.type = type;
            texture.invertY = invertY;
            texture._compression = compression;
            var gl = this._gl;
            var textureType = this._getWebGLTextureType(type);
            var internalFormat = this._getInternalFormat(format);
            var internalSizedFomat = this._getRGBABufferInternalSizedFormat(type);
            var needConversion = false;
            if (internalFormat === gl.RGB) {
                internalFormat = gl.RGBA;
                needConversion = true;
            }
            this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, invertY === undefined ? 1 : (invertY ? 1 : 0));
            if (texture.width % 4 !== 0) {
                gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            }
            // Data are known to be in +X +Y +Z -X -Y -Z
            for (var faceIndex = 0; faceIndex < 6; faceIndex++) {
                var faceData = data[faceIndex];
                if (compression) {
                    gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, level, (this.getCaps().s3tc)[compression], texture.width, texture.height, 0, faceData);
                }
                else {
                    if (needConversion) {
                        faceData = this._convertRGBtoRGBATextureData(faceData, texture.width, texture.height, type);
                    }
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, level, internalSizedFomat, texture.width, texture.height, 0, internalFormat, textureType, faceData);
                }
            }
            var isPot = !this.needPOTTextures || (BABYLON.Tools.IsExponentOfTwo(texture.width) && BABYLON.Tools.IsExponentOfTwo(texture.height));
            if (isPot && texture.generateMipMaps && level === 0) {
                this._gl.generateMipmap(this._gl.TEXTURE_CUBE_MAP);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
            // this.resetTextureCache();
            texture.isReady = true;
        };
        Engine.prototype.createRawCubeTexture = function (data, size, format, type, generateMipMaps, invertY, samplingMode, compression) {
            if (compression === void 0) { compression = null; }
            var gl = this._gl;
            var texture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_CUBERAW);
            texture.isCube = true;
            texture.generateMipMaps = generateMipMaps;
            texture.format = format;
            texture.type = type;
            if (!this._doNotHandleContextLost) {
                texture._bufferViewArray = data;
            }
            var textureType = this._getWebGLTextureType(type);
            var internalFormat = this._getInternalFormat(format);
            if (internalFormat === gl.RGB) {
                internalFormat = gl.RGBA;
            }
            var width = size;
            var height = width;
            texture.width = width;
            texture.height = height;
            // Double check on POT to generate Mips.
            var isPot = !this.needPOTTextures || (BABYLON.Tools.IsExponentOfTwo(texture.width) && BABYLON.Tools.IsExponentOfTwo(texture.height));
            if (!isPot) {
                generateMipMaps = false;
            }
            // Upload data if needed. The texture won't be ready until then.
            if (data) {
                this.updateRawCubeTexture(texture, data, format, type, invertY, compression);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, texture, true);
            // Filters
            if (data && generateMipMaps) {
                this._gl.generateMipmap(this._gl.TEXTURE_CUBE_MAP);
            }
            if (textureType === gl.FLOAT && !this._caps.textureFloatLinearFiltering) {
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            }
            else if (textureType === this._gl.HALF_FLOAT_OES && !this._caps.textureHalfFloatLinearFiltering) {
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            }
            else {
                var filters = getSamplingParameters(samplingMode, generateMipMaps, gl);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, filters.mag);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, filters.min);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
            return texture;
        };
        Engine.prototype.createRawCubeTextureFromUrl = function (url, scene, size, format, type, noMipmap, callback, mipmmapGenerator, onLoad, onError, samplingMode, invertY) {
            var _this = this;
            if (onLoad === void 0) { onLoad = null; }
            if (onError === void 0) { onError = null; }
            if (samplingMode === void 0) { samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE; }
            if (invertY === void 0) { invertY = false; }
            var gl = this._gl;
            var texture = this.createRawCubeTexture(null, size, format, type, !noMipmap, invertY, samplingMode);
            scene._addPendingData(texture);
            texture.url = url;
            this._internalTexturesCache.push(texture);
            var onerror = function (request, exception) {
                scene._removePendingData(texture);
                if (onError && request) {
                    onError(request.status + " " + request.statusText, exception);
                }
            };
            var internalCallback = function (data) {
                var width = texture.width;
                var faceDataArrays = callback(data);
                if (!faceDataArrays) {
                    return;
                }
                if (mipmmapGenerator) {
                    var textureType = _this._getWebGLTextureType(type);
                    var internalFormat = _this._getInternalFormat(format);
                    var internalSizedFomat = _this._getRGBABufferInternalSizedFormat(type);
                    var needConversion = false;
                    if (internalFormat === gl.RGB) {
                        internalFormat = gl.RGBA;
                        needConversion = true;
                    }
                    _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
                    var mipData = mipmmapGenerator(faceDataArrays);
                    for (var level = 0; level < mipData.length; level++) {
                        var mipSize = width >> level;
                        for (var faceIndex = 0; faceIndex < 6; faceIndex++) {
                            var mipFaceData = mipData[level][faceIndex];
                            if (needConversion) {
                                mipFaceData = _this._convertRGBtoRGBATextureData(mipFaceData, mipSize, mipSize, type);
                            }
                            gl.texImage2D(faceIndex, level, internalSizedFomat, mipSize, mipSize, 0, internalFormat, textureType, mipFaceData);
                        }
                    }
                    _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
                }
                else {
                    texture.generateMipMaps = !noMipmap;
                    _this.updateRawCubeTexture(texture, faceDataArrays, format, type, invertY);
                }
                texture.isReady = true;
                // this.resetTextureCache();
                scene._removePendingData(texture);
                if (onLoad) {
                    onLoad();
                }
            };
            this._loadFile(url, function (data) {
                internalCallback(data);
            }, undefined, scene.database, true, onerror);
            return texture;
        };
        ;
        Engine.prototype.updateRawTexture3D = function (texture, data, format, invertY, compression) {
            if (compression === void 0) { compression = null; }
            var internalFormat = this._getInternalFormat(format);
            this._bindTextureDirectly(this._gl.TEXTURE_3D, texture, true);
            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, invertY === undefined ? 1 : (invertY ? 1 : 0));
            if (!this._doNotHandleContextLost) {
                texture._bufferView = data;
                texture.format = format;
                texture.invertY = invertY;
                texture._compression = compression;
            }
            if (texture.width % 4 !== 0) {
                this._gl.pixelStorei(this._gl.UNPACK_ALIGNMENT, 1);
            }
            if (compression && data) {
                this._gl.compressedTexImage3D(this._gl.TEXTURE_3D, 0, this.getCaps().s3tc[compression], texture.width, texture.height, texture.depth, 0, data);
            }
            else {
                this._gl.texImage3D(this._gl.TEXTURE_3D, 0, internalFormat, texture.width, texture.height, texture.depth, 0, internalFormat, this._gl.UNSIGNED_BYTE, data);
            }
            if (texture.generateMipMaps) {
                this._gl.generateMipmap(this._gl.TEXTURE_3D);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
            // this.resetTextureCache();
            texture.isReady = true;
        };
        Engine.prototype.createRawTexture3D = function (data, width, height, depth, format, generateMipMaps, invertY, samplingMode, compression) {
            if (compression === void 0) { compression = null; }
            var texture = new BABYLON.InternalTexture(this, BABYLON.InternalTexture.DATASOURCE_RAW3D);
            texture.baseWidth = width;
            texture.baseHeight = height;
            texture.baseDepth = depth;
            texture.width = width;
            texture.height = height;
            texture.depth = depth;
            texture.format = format;
            texture.generateMipMaps = generateMipMaps;
            texture.samplingMode = samplingMode;
            texture.is3D = true;
            if (!this._doNotHandleContextLost) {
                texture._bufferView = data;
            }
            this.updateRawTexture3D(texture, data, format, invertY, compression);
            this._bindTextureDirectly(this._gl.TEXTURE_3D, texture, true);
            // Filters
            var filters = getSamplingParameters(samplingMode, generateMipMaps, this._gl);
            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_MAG_FILTER, filters.mag);
            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_MIN_FILTER, filters.min);
            if (generateMipMaps) {
                this._gl.generateMipmap(this._gl.TEXTURE_3D);
            }
            this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
            this._internalTexturesCache.push(texture);
            return texture;
        };
        Engine.prototype._prepareWebGLTextureContinuation = function (texture, scene, noMipmap, isCompressed, samplingMode) {
            var gl = this._gl;
            if (!gl) {
                return;
            }
            var filters = getSamplingParameters(samplingMode, !noMipmap, gl);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filters.mag);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filters.min);
            if (!noMipmap && !isCompressed) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            this._bindTextureDirectly(gl.TEXTURE_2D, null);
            // this.resetTextureCache();
            if (scene) {
                scene._removePendingData(texture);
            }
            texture.onLoadedObservable.notifyObservers(texture);
            texture.onLoadedObservable.clear();
        };
        Engine.prototype._prepareWebGLTexture = function (texture, scene, width, height, invertY, noMipmap, isCompressed, processFunction, samplingMode) {
            var _this = this;
            if (samplingMode === void 0) { samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE; }
            var potWidth = this.needPOTTextures ? BABYLON.Tools.GetExponentOfTwo(width, this.getCaps().maxTextureSize) : width;
            var potHeight = this.needPOTTextures ? BABYLON.Tools.GetExponentOfTwo(height, this.getCaps().maxTextureSize) : height;
            var gl = this._gl;
            if (!gl) {
                return;
            }
            if (!texture._webGLTexture) {
                //  this.resetTextureCache();
                if (scene) {
                    scene._removePendingData(texture);
                }
                return;
            }
            this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, invertY === undefined ? 1 : (invertY ? 1 : 0));
            texture.baseWidth = width;
            texture.baseHeight = height;
            texture.width = potWidth;
            texture.height = potHeight;
            texture.isReady = true;
            if (processFunction(potWidth, potHeight, function () {
                _this._prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode);
            })) {
                // Returning as texture needs extra async steps
                return;
            }
            this._prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode);
        };
        Engine.prototype._convertRGBtoRGBATextureData = function (rgbData, width, height, textureType) {
            // Create new RGBA data container.
            var rgbaData;
            if (textureType === Engine.TEXTURETYPE_FLOAT) {
                rgbaData = new Float32Array(width * height * 4);
            }
            else {
                rgbaData = new Uint32Array(width * height * 4);
            }
            // Convert each pixel.
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    var index = (y * width + x) * 3;
                    var newIndex = (y * width + x) * 4;
                    // Map Old Value to new value.
                    rgbaData[newIndex + 0] = rgbData[index + 0];
                    rgbaData[newIndex + 1] = rgbData[index + 1];
                    rgbaData[newIndex + 2] = rgbData[index + 2];
                    // Add fully opaque alpha channel.
                    rgbaData[newIndex + 3] = 1;
                }
            }
            return rgbaData;
        };
        Engine.prototype._releaseFramebufferObjects = function (texture) {
            var gl = this._gl;
            if (texture._framebuffer) {
                gl.deleteFramebuffer(texture._framebuffer);
                texture._framebuffer = null;
            }
            if (texture._depthStencilBuffer) {
                gl.deleteRenderbuffer(texture._depthStencilBuffer);
                texture._depthStencilBuffer = null;
            }
            if (texture._MSAAFramebuffer) {
                gl.deleteFramebuffer(texture._MSAAFramebuffer);
                texture._MSAAFramebuffer = null;
            }
            if (texture._MSAARenderBuffer) {
                gl.deleteRenderbuffer(texture._MSAARenderBuffer);
                texture._MSAARenderBuffer = null;
            }
        };
        Engine.prototype._releaseTexture = function (texture) {
            var gl = this._gl;
            this._releaseFramebufferObjects(texture);
            gl.deleteTexture(texture._webGLTexture);
            // Unbind channels
            this.unbindAllTextures();
            var index = this._internalTexturesCache.indexOf(texture);
            if (index !== -1) {
                this._internalTexturesCache.splice(index, 1);
            }
            // Integrated fixed lod samplers.
            if (texture._lodTextureHigh) {
                texture._lodTextureHigh.dispose();
            }
            if (texture._lodTextureMid) {
                texture._lodTextureMid.dispose();
            }
            if (texture._lodTextureLow) {
                texture._lodTextureLow.dispose();
            }
        };
        Engine.prototype.setProgram = function (program) {
            if (this._currentProgram !== program) {
                this._gl.useProgram(program);
                this._currentProgram = program;
            }
        };
        Engine.prototype.bindSamplers = function (effect) {
            this.setProgram(effect.getProgram());
            var samplers = effect.getSamplers();
            for (var index = 0; index < samplers.length; index++) {
                var uniform = effect.getUniform(samplers[index]);
                if (uniform) {
                    this._boundUniforms[index] = uniform;
                }
            }
            this._currentEffect = null;
        };
        Engine.prototype._activateTextureChannel = function (channel) {
            if (this._activeChannel !== channel && channel > -1) {
                this._gl.activeTexture(this._gl.TEXTURE0 + channel);
                this._activeChannel = channel;
            }
        };
        Engine.prototype._moveBoundTextureOnTop = function (internalTexture) {
            var index = this._boundTexturesStack.indexOf(internalTexture);
            if (index > -1 && index !== this._boundTexturesStack.length - 1) {
                this._boundTexturesStack.splice(index, 1);
                this._boundTexturesStack.push(internalTexture);
            }
        };
        Engine.prototype._removeDesignatedSlot = function (internalTexture) {
            var currentSlot = internalTexture._designatedSlot;
            internalTexture._designatedSlot = -1;
            var index = this._boundTexturesStack.indexOf(internalTexture);
            if (index > -1) {
                this._boundTexturesStack.splice(index, 1);
                if (currentSlot > -1) {
                    this._boundTexturesCache[currentSlot] = null;
                    this._nextFreeTextureSlots.push(currentSlot);
                }
            }
            return currentSlot;
        };
        Engine.prototype._bindTextureDirectly = function (target, texture, doNotBindUniformToTextureChannel) {
            if (doNotBindUniformToTextureChannel === void 0) { doNotBindUniformToTextureChannel = false; }
            var currentTextureBound = this._boundTexturesCache[this._activeChannel];
            var isTextureForRendering = texture && texture._initialSlot > -1;
            if (currentTextureBound !== texture) {
                if (currentTextureBound) {
                    this._removeDesignatedSlot(currentTextureBound);
                }
                this._gl.bindTexture(target, texture ? texture._webGLTexture : null);
                if (this._activeChannel >= 0) {
                    this._boundTexturesCache[this._activeChannel] = texture;
                    if (isTextureForRendering) {
                        var slotIndex = this._nextFreeTextureSlots.indexOf(this._activeChannel);
                        if (slotIndex > -1) {
                            this._nextFreeTextureSlots.splice(slotIndex, 1);
                        }
                        this._boundTexturesStack.push(texture);
                    }
                }
            }
            if (isTextureForRendering && this._activeChannel > -1) {
                texture._designatedSlot = this._activeChannel;
                if (!doNotBindUniformToTextureChannel) {
                    this._bindSamplerUniformToChannel(texture._initialSlot, this._activeChannel);
                }
            }
        };
        Engine.prototype._bindTexture = function (channel, texture) {
            if (channel < 0) {
                return;
            }
            if (texture) {
                channel = this._getCorrectTextureChannel(channel, texture);
            }
            this._activateTextureChannel(channel);
            this._bindTextureDirectly(this._gl.TEXTURE_2D, texture);
        };
        Engine.prototype.setTextureFromPostProcess = function (channel, postProcess) {
            this._bindTexture(channel, postProcess ? postProcess._textures.data[postProcess._currentRenderTextureInd] : null);
        };
        Engine.prototype.unbindAllTextures = function () {
            for (var channel = 0; channel < this._caps.maxTexturesImageUnits; channel++) {
                this._activateTextureChannel(channel);
                this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
                this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
                if (this.webGLVersion > 1) {
                    this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
                }
            }
        };
        Engine.prototype.setTexture = function (channel, uniform, texture) {
            if (channel < 0) {
                return;
            }
            if (uniform) {
                this._boundUniforms[channel] = uniform;
            }
            this._setTexture(channel, texture);
        };
        Engine.prototype._getCorrectTextureChannel = function (channel, internalTexture) {
            if (!internalTexture) {
                return -1;
            }
            internalTexture._initialSlot = channel;
            if (channel !== internalTexture._designatedSlot) {
                if (internalTexture._designatedSlot > -1) {
                    return internalTexture._designatedSlot;
                }
                else {
                    // No slot for this texture, let's pick a new one (if we find a free slot)
                    if (this._nextFreeTextureSlots.length) {
                        return this._nextFreeTextureSlots[0];
                    }
                    // We need to recycle the oldest bound texture, sorry.
                    this._textureCollisions.addCount(1, false);
                    return this._removeDesignatedSlot(this._boundTexturesStack[0]);
                }
            }
            return channel;
        };
        Engine.prototype._bindSamplerUniformToChannel = function (sourceSlot, destination) {
            var uniform = this._boundUniforms[sourceSlot];
            this._gl.uniform1i(uniform, destination);
        };
        Engine.prototype._setTexture = function (channel, texture, isPartOfTextureArray) {
            if (isPartOfTextureArray === void 0) { isPartOfTextureArray = false; }
            // Not ready?
            if (!texture) {
                if (this._boundTexturesCache[channel] != null) {
                    this._activateTextureChannel(channel);
                    this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
                    this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
                    if (this.webGLVersion > 1) {
                        this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
                    }
                }
                return false;
            }
            // Video
            var alreadyActivated = false;
            if (texture.video) {
                this._activateTextureChannel(channel);
                alreadyActivated = true;
                texture.update();
            }
            else if (texture.delayLoadState === Engine.DELAYLOADSTATE_NOTLOADED) {
                texture.delayLoad();
                return false;
            }
            var internalTexture;
            if (texture.isReady()) {
                internalTexture = texture.getInternalTexture();
            }
            else if (texture.isCube) {
                internalTexture = this.emptyCubeTexture;
            }
            else if (texture.is3D) {
                internalTexture = this.emptyTexture3D;
            }
            else {
                internalTexture = this.emptyTexture;
            }
            if (!isPartOfTextureArray) {
                channel = this._getCorrectTextureChannel(channel, internalTexture);
            }
            if (this._boundTexturesCache[channel] === internalTexture) {
                this._moveBoundTextureOnTop(internalTexture);
                if (!isPartOfTextureArray) {
                    this._bindSamplerUniformToChannel(internalTexture._initialSlot, channel);
                }
                return false;
            }
            if (!alreadyActivated) {
                this._activateTextureChannel(channel);
            }
            if (internalTexture && internalTexture.is3D) {
                this._bindTextureDirectly(this._gl.TEXTURE_3D, internalTexture, isPartOfTextureArray);
                if (internalTexture && internalTexture._cachedWrapU !== texture.wrapU) {
                    internalTexture._cachedWrapU = texture.wrapU;
                    switch (texture.wrapU) {
                        case BABYLON.Texture.WRAP_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT);
                            break;
                        case BABYLON.Texture.CLAMP_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
                            break;
                        case BABYLON.Texture.MIRROR_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_WRAP_S, this._gl.MIRRORED_REPEAT);
                            break;
                    }
                }
                if (internalTexture && internalTexture._cachedWrapV !== texture.wrapV) {
                    internalTexture._cachedWrapV = texture.wrapV;
                    switch (texture.wrapV) {
                        case BABYLON.Texture.WRAP_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT);
                            break;
                        case BABYLON.Texture.CLAMP_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
                            break;
                        case BABYLON.Texture.MIRROR_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_WRAP_T, this._gl.MIRRORED_REPEAT);
                            break;
                    }
                }
                if (internalTexture && internalTexture._cachedWrapR !== texture.wrapR) {
                    internalTexture._cachedWrapR = texture.wrapR;
                    switch (texture.wrapV) {
                        case BABYLON.Texture.WRAP_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_WRAP_R, this._gl.REPEAT);
                            break;
                        case BABYLON.Texture.CLAMP_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_WRAP_R, this._gl.CLAMP_TO_EDGE);
                            break;
                        case BABYLON.Texture.MIRROR_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_3D, this._gl.TEXTURE_WRAP_R, this._gl.MIRRORED_REPEAT);
                            break;
                    }
                }
                this._setAnisotropicLevel(this._gl.TEXTURE_3D, texture);
            }
            else if (internalTexture && internalTexture.isCube) {
                this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, internalTexture, isPartOfTextureArray);
                if (internalTexture._cachedCoordinatesMode !== texture.coordinatesMode) {
                    internalTexture._cachedCoordinatesMode = texture.coordinatesMode;
                    // CUBIC_MODE and SKYBOX_MODE both require CLAMP_TO_EDGE.  All other modes use REPEAT.
                    var textureWrapMode = (texture.coordinatesMode !== BABYLON.Texture.CUBIC_MODE && texture.coordinatesMode !== BABYLON.Texture.SKYBOX_MODE) ? this._gl.REPEAT : this._gl.CLAMP_TO_EDGE;
                    this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_WRAP_S, textureWrapMode);
                    this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_WRAP_T, textureWrapMode);
                }
                this._setAnisotropicLevel(this._gl.TEXTURE_CUBE_MAP, texture);
            }
            else {
                this._bindTextureDirectly(this._gl.TEXTURE_2D, internalTexture, isPartOfTextureArray);
                if (internalTexture && internalTexture._cachedWrapU !== texture.wrapU) {
                    internalTexture._cachedWrapU = texture.wrapU;
                    switch (texture.wrapU) {
                        case BABYLON.Texture.WRAP_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT);
                            break;
                        case BABYLON.Texture.CLAMP_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
                            break;
                        case BABYLON.Texture.MIRROR_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.MIRRORED_REPEAT);
                            break;
                    }
                }
                if (internalTexture && internalTexture._cachedWrapV !== texture.wrapV) {
                    internalTexture._cachedWrapV = texture.wrapV;
                    switch (texture.wrapV) {
                        case BABYLON.Texture.WRAP_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT);
                            break;
                        case BABYLON.Texture.CLAMP_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
                            break;
                        case BABYLON.Texture.MIRROR_ADDRESSMODE:
                            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.MIRRORED_REPEAT);
                            break;
                    }
                }
                this._setAnisotropicLevel(this._gl.TEXTURE_2D, texture);
            }
            return true;
        };
        Engine.prototype.setTextureArray = function (channel, uniform, textures) {
            if (channel < 0 || !uniform) {
                return;
            }
            if (!this._textureUnits || this._textureUnits.length !== textures.length) {
                this._textureUnits = new Int32Array(textures.length);
            }
            for (var i = 0; i < textures.length; i++) {
                this._textureUnits[i] = this._getCorrectTextureChannel(channel + i, textures[i].getInternalTexture());
            }
            this._gl.uniform1iv(uniform, this._textureUnits);
            for (var index = 0; index < textures.length; index++) {
                this._setTexture(this._textureUnits[index], textures[index], true);
            }
        };
        Engine.prototype._setAnisotropicLevel = function (key, texture) {
            var internalTexture = texture.getInternalTexture();
            if (!internalTexture) {
                return;
            }
            var anisotropicFilterExtension = this._caps.textureAnisotropicFilterExtension;
            var value = texture.anisotropicFilteringLevel;
            if (internalTexture.samplingMode !== BABYLON.Texture.LINEAR_LINEAR_MIPNEAREST
                && internalTexture.samplingMode !== BABYLON.Texture.LINEAR_LINEAR_MIPLINEAR
                && internalTexture.samplingMode !== BABYLON.Texture.LINEAR_LINEAR) {
                value = 1; // Forcing the anisotropic to 1 because else webgl will force filters to linear
            }
            if (anisotropicFilterExtension && internalTexture._cachedAnisotropicFilteringLevel !== value) {
                this._gl.texParameterf(key, anisotropicFilterExtension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(value, this._caps.maxAnisotropy));
                internalTexture._cachedAnisotropicFilteringLevel = value;
            }
        };
        Engine.prototype.readPixels = function (x, y, width, height) {
            var data = new Uint8Array(height * width * 4);
            this._gl.readPixels(x, y, width, height, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data);
            return data;
        };
        /**
         * Add an externaly attached data from its key.
         * This method call will fail and return false, if such key already exists.
         * If you don't care and just want to get the data no matter what, use the more convenient getOrAddExternalDataWithFactory() method.
         * @param key the unique key that identifies the data
         * @param data the data object to associate to the key for this Engine instance
         * @return true if no such key were already present and the data was added successfully, false otherwise
         */
        Engine.prototype.addExternalData = function (key, data) {
            if (!this._externalData) {
                this._externalData = new BABYLON.StringDictionary();
            }
            return this._externalData.add(key, data);
        };
        /**
         * Get an externaly attached data from its key
         * @param key the unique key that identifies the data
         * @return the associated data, if present (can be null), or undefined if not present
         */
        Engine.prototype.getExternalData = function (key) {
            if (!this._externalData) {
                this._externalData = new BABYLON.StringDictionary();
            }
            return this._externalData.get(key);
        };
        /**
         * Get an externaly attached data from its key, create it using a factory if it's not already present
         * @param key the unique key that identifies the data
         * @param factory the factory that will be called to create the instance if and only if it doesn't exists
         * @return the associated data, can be null if the factory returned null.
         */
        Engine.prototype.getOrAddExternalDataWithFactory = function (key, factory) {
            if (!this._externalData) {
                this._externalData = new BABYLON.StringDictionary();
            }
            return this._externalData.getOrAddWithFactory(key, factory);
        };
        /**
         * Remove an externaly attached data from the Engine instance
         * @param key the unique key that identifies the data
         * @return true if the data was successfully removed, false if it doesn't exist
         */
        Engine.prototype.removeExternalData = function (key) {
            if (!this._externalData) {
                this._externalData = new BABYLON.StringDictionary();
            }
            return this._externalData.remove(key);
        };
        Engine.prototype.unbindAllAttributes = function () {
            if (this._mustWipeVertexAttributes) {
                this._mustWipeVertexAttributes = false;
                for (var i = 0; i < this._caps.maxVertexAttribs; i++) {
                    this._gl.disableVertexAttribArray(i);
                    this._vertexAttribArraysEnabled[i] = false;
                    this._currentBufferPointers[i].active = false;
                }
                return;
            }
            for (var i = 0, ul = this._vertexAttribArraysEnabled.length; i < ul; i++) {
                if (i >= this._caps.maxVertexAttribs || !this._vertexAttribArraysEnabled[i]) {
                    continue;
                }
                this._gl.disableVertexAttribArray(i);
                this._vertexAttribArraysEnabled[i] = false;
                this._currentBufferPointers[i].active = false;
            }
        };
        Engine.prototype.releaseEffects = function () {
            for (var name in this._compiledEffects) {
                this._deleteProgram(this._compiledEffects[name]._program);
            }
            this._compiledEffects = {};
        };
        // Dispose
        Engine.prototype.dispose = function () {
            this.hideLoadingUI();
            this.stopRenderLoop();
            // Release postProcesses
            while (this.postProcesses.length) {
                this.postProcesses[0].dispose();
            }
            // Empty texture
            if (this._emptyTexture) {
                this._releaseTexture(this._emptyTexture);
                this._emptyTexture = null;
            }
            if (this._emptyCubeTexture) {
                this._releaseTexture(this._emptyCubeTexture);
                this._emptyCubeTexture = null;
            }
            // Rescale PP
            if (this._rescalePostProcess) {
                this._rescalePostProcess.dispose();
            }
            // Release scenes
            while (this.scenes.length) {
                this.scenes[0].dispose();
            }
            // Release audio engine
            if (Engine.audioEngine) {
                Engine.audioEngine.dispose();
            }
            // Release effects
            this.releaseEffects();
            // Unbind
            this.unbindAllAttributes();
            if (this._dummyFramebuffer) {
                this._gl.deleteFramebuffer(this._dummyFramebuffer);
            }
            //WebVR
            this.disableVR();
            // Events
            if (BABYLON.Tools.IsWindowObjectExist()) {
                window.removeEventListener("blur", this._onBlur);
                window.removeEventListener("focus", this._onFocus);
                window.removeEventListener('vrdisplaypointerrestricted', this._onVRDisplayPointerRestricted);
                window.removeEventListener('vrdisplaypointerunrestricted', this._onVRDisplayPointerUnrestricted);
                if (this._renderingCanvas) {
                    this._renderingCanvas.removeEventListener("focus", this._onCanvasFocus);
                    this._renderingCanvas.removeEventListener("blur", this._onCanvasBlur);
                    this._renderingCanvas.removeEventListener("pointerout", this._onCanvasBlur);
                    if (!this._doNotHandleContextLost) {
                        this._renderingCanvas.removeEventListener("webglcontextlost", this._onContextLost);
                        this._renderingCanvas.removeEventListener("webglcontextrestored", this._onContextRestored);
                    }
                }
                document.removeEventListener("fullscreenchange", this._onFullscreenChange);
                document.removeEventListener("mozfullscreenchange", this._onFullscreenChange);
                document.removeEventListener("webkitfullscreenchange", this._onFullscreenChange);
                document.removeEventListener("msfullscreenchange", this._onFullscreenChange);
                document.removeEventListener("pointerlockchange", this._onPointerLockChange);
                document.removeEventListener("mspointerlockchange", this._onPointerLockChange);
                document.removeEventListener("mozpointerlockchange", this._onPointerLockChange);
                document.removeEventListener("webkitpointerlockchange", this._onPointerLockChange);
                if (this._onVrDisplayConnect) {
                    window.removeEventListener('vrdisplayconnect', this._onVrDisplayConnect);
                    if (this._onVrDisplayDisconnect) {
                        window.removeEventListener('vrdisplaydisconnect', this._onVrDisplayDisconnect);
                    }
                    if (this._onVrDisplayPresentChange) {
                        window.removeEventListener('vrdisplaypresentchange', this._onVrDisplayPresentChange);
                    }
                    this._onVrDisplayConnect = null;
                    this._onVrDisplayDisconnect = null;
                }
            }
            // Remove from Instances
            var index = Engine.Instances.indexOf(this);
            if (index >= 0) {
                Engine.Instances.splice(index, 1);
            }
            this._workingCanvas = null;
            this._workingContext = null;
            this._currentBufferPointers = [];
            this._renderingCanvas = null;
            this._currentProgram = null;
            this.onResizeObservable.clear();
            this.onCanvasBlurObservable.clear();
            this.onCanvasFocusObservable.clear();
            this.onCanvasPointerOutObservable.clear();
            this.onBeginFrameObservable.clear();
            this.onEndFrameObservable.clear();
            BABYLON.Effect.ResetCache();
            // Abort active requests
            for (var _i = 0, _a = this._activeRequests; _i < _a.length; _i++) {
                var request = _a[_i];
                request.abort();
            }
        };
        // Loading screen
        Engine.prototype.displayLoadingUI = function () {
            if (!BABYLON.Tools.IsWindowObjectExist()) {
                return;
            }
            var loadingScreen = this.loadingScreen;
            if (loadingScreen) {
                loadingScreen.displayLoadingUI();
            }
        };
        Engine.prototype.hideLoadingUI = function () {
            if (!BABYLON.Tools.IsWindowObjectExist()) {
                return;
            }
            var loadingScreen = this.loadingScreen;
            if (loadingScreen) {
                loadingScreen.hideLoadingUI();
            }
        };
        Object.defineProperty(Engine.prototype, "loadingScreen", {
            get: function () {
                if (!this._loadingScreen && BABYLON.DefaultLoadingScreen && this._renderingCanvas)
                    this._loadingScreen = new BABYLON.DefaultLoadingScreen(this._renderingCanvas);
                return this._loadingScreen;
            },
            set: function (loadingScreen) {
                this._loadingScreen = loadingScreen;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "loadingUIText", {
            set: function (text) {
                this.loadingScreen.loadingUIText = text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "loadingUIBackgroundColor", {
            set: function (color) {
                this.loadingScreen.loadingUIBackgroundColor = color;
            },
            enumerable: true,
            configurable: true
        });
        Engine.prototype.attachContextLostEvent = function (callback) {
            if (this._renderingCanvas) {
                this._renderingCanvas.addEventListener("webglcontextlost", callback, false);
            }
        };
        Engine.prototype.attachContextRestoredEvent = function (callback) {
            if (this._renderingCanvas) {
                this._renderingCanvas.addEventListener("webglcontextrestored", callback, false);
            }
        };
        Engine.prototype.getVertexShaderSource = function (program) {
            var shaders = this._gl.getAttachedShaders(program);
            if (!shaders) {
                return null;
            }
            return this._gl.getShaderSource(shaders[0]);
        };
        Engine.prototype.getFragmentShaderSource = function (program) {
            var shaders = this._gl.getAttachedShaders(program);
            if (!shaders) {
                return null;
            }
            return this._gl.getShaderSource(shaders[1]);
        };
        Engine.prototype.getError = function () {
            return this._gl.getError();
        };
        // FPS
        Engine.prototype.getFps = function () {
            return this._fps;
        };
        Engine.prototype.getDeltaTime = function () {
            return this._deltaTime;
        };
        Engine.prototype._measureFps = function () {
            this._performanceMonitor.sampleFrame();
            this._fps = this._performanceMonitor.averageFPS;
            this._deltaTime = this._performanceMonitor.instantaneousFrameTime || 0;
        };
        Engine.prototype._readTexturePixels = function (texture, width, height, faceIndex) {
            if (faceIndex === void 0) { faceIndex = -1; }
            var gl = this._gl;
            if (!this._dummyFramebuffer) {
                var dummy = gl.createFramebuffer();
                if (!dummy) {
                    throw new Error("Unable to create dummy framebuffer");
                }
                this._dummyFramebuffer = dummy;
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._dummyFramebuffer);
            if (faceIndex > -1) {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, texture._webGLTexture, 0);
            }
            else {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture._webGLTexture, 0);
            }
            var readType = (texture.type !== undefined) ? this._getWebGLTextureType(texture.type) : gl.UNSIGNED_BYTE;
            var buffer;
            switch (readType) {
                case gl.UNSIGNED_BYTE:
                    buffer = new Uint8Array(4 * width * height);
                    readType = gl.UNSIGNED_BYTE;
                    break;
                default:
                    buffer = new Float32Array(4 * width * height);
                    readType = gl.FLOAT;
                    break;
            }
            gl.readPixels(0, 0, width, height, gl.RGBA, readType, buffer);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._currentFramebuffer);
            return buffer;
        };
        Engine.prototype._canRenderToFloatFramebuffer = function () {
            if (this._webGLVersion > 1) {
                return this._caps.colorBufferFloat;
            }
            return this._canRenderToFramebuffer(Engine.TEXTURETYPE_FLOAT);
        };
        Engine.prototype._canRenderToHalfFloatFramebuffer = function () {
            if (this._webGLVersion > 1) {
                return this._caps.colorBufferFloat;
            }
            return this._canRenderToFramebuffer(Engine.TEXTURETYPE_HALF_FLOAT);
        };
        // Thank you : http://stackoverflow.com/questions/28827511/webgl-ios-render-to-floating-point-texture
        Engine.prototype._canRenderToFramebuffer = function (type) {
            var gl = this._gl;
            //clear existing errors
            while (gl.getError() !== gl.NO_ERROR) { }
            var successful = true;
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, this._getRGBABufferInternalSizedFormat(type), 1, 1, 0, gl.RGBA, this._getWebGLTextureType(type), null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            var fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            successful = successful && (status === gl.FRAMEBUFFER_COMPLETE);
            successful = successful && (gl.getError() === gl.NO_ERROR);
            //try render by clearing frame buffer's color buffer
            if (successful) {
                gl.clear(gl.COLOR_BUFFER_BIT);
                successful = successful && (gl.getError() === gl.NO_ERROR);
            }
            //try reading from frame to ensure render occurs (just creating the FBO is not sufficient to determine if rendering is supported)
            if (successful) {
                //in practice it's sufficient to just read from the backbuffer rather than handle potentially issues reading from the texture
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                var readFormat = gl.RGBA;
                var readType = gl.UNSIGNED_BYTE;
                var buffer = new Uint8Array(4);
                gl.readPixels(0, 0, 1, 1, readFormat, readType, buffer);
                successful = successful && (gl.getError() === gl.NO_ERROR);
            }
            //clean up
            gl.deleteTexture(texture);
            gl.deleteFramebuffer(fb);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            //clear accumulated errors
            while (!successful && (gl.getError() !== gl.NO_ERROR)) { }
            return successful;
        };
        Engine.prototype._getWebGLTextureType = function (type) {
            if (type === Engine.TEXTURETYPE_FLOAT) {
                return this._gl.FLOAT;
            }
            else if (type === Engine.TEXTURETYPE_HALF_FLOAT) {
                // Add Half Float Constant.
                return this._gl.HALF_FLOAT_OES;
            }
            return this._gl.UNSIGNED_BYTE;
        };
        ;
        Engine.prototype._getRGBABufferInternalSizedFormat = function (type) {
            if (this._webGLVersion === 1) {
                return this._gl.RGBA;
            }
            if (type === Engine.TEXTURETYPE_FLOAT) {
                return this._gl.RGBA32F;
            }
            else if (type === Engine.TEXTURETYPE_HALF_FLOAT) {
                return this._gl.RGBA16F;
            }
            return this._gl.RGBA;
        };
        ;
        Engine.prototype.createQuery = function () {
            return this._gl.createQuery();
        };
        Engine.prototype.deleteQuery = function (query) {
            this._gl.deleteQuery(query);
            return this;
        };
        Engine.prototype.isQueryResultAvailable = function (query) {
            return this._gl.getQueryParameter(query, this._gl.QUERY_RESULT_AVAILABLE);
        };
        Engine.prototype.getQueryResult = function (query) {
            return this._gl.getQueryParameter(query, this._gl.QUERY_RESULT);
        };
        Engine.prototype.beginOcclusionQuery = function (algorithmType, query) {
            var glAlgorithm = this.getGlAlgorithmType(algorithmType);
            this._gl.beginQuery(glAlgorithm, query);
            return this;
        };
        Engine.prototype.endOcclusionQuery = function (algorithmType) {
            var glAlgorithm = this.getGlAlgorithmType(algorithmType);
            this._gl.endQuery(glAlgorithm);
            return this;
        };
        /* Time queries */
        Engine.prototype._createTimeQuery = function () {
            var timerQuery = this._caps.timerQuery;
            if (timerQuery.createQueryEXT) {
                return timerQuery.createQueryEXT();
            }
            return this.createQuery();
        };
        Engine.prototype._deleteTimeQuery = function (query) {
            var timerQuery = this._caps.timerQuery;
            if (timerQuery.deleteQueryEXT) {
                timerQuery.deleteQueryEXT(query);
                return;
            }
            this.deleteQuery(query);
        };
        Engine.prototype._getTimeQueryResult = function (query) {
            var timerQuery = this._caps.timerQuery;
            if (timerQuery.getQueryObjectEXT) {
                return timerQuery.getQueryObjectEXT(query, timerQuery.QUERY_RESULT_EXT);
            }
            return this.getQueryResult(query);
        };
        Engine.prototype._getTimeQueryAvailability = function (query) {
            var timerQuery = this._caps.timerQuery;
            if (timerQuery.getQueryObjectEXT) {
                return timerQuery.getQueryObjectEXT(query, timerQuery.QUERY_RESULT_AVAILABLE_EXT);
            }
            return this.isQueryResultAvailable(query);
        };
        Engine.prototype.startTimeQuery = function () {
            var timerQuery = this._caps.timerQuery;
            if (!timerQuery) {
                return null;
            }
            var token = new BABYLON._TimeToken();
            this._gl.getParameter(timerQuery.GPU_DISJOINT_EXT);
            if (this._caps.canUseTimestampForTimerQuery) {
                token._startTimeQuery = this._createTimeQuery();
                timerQuery.queryCounterEXT(token._startTimeQuery, timerQuery.TIMESTAMP_EXT);
            }
            else {
                if (this._currentNonTimestampToken) {
                    return this._currentNonTimestampToken;
                }
                token._timeElapsedQuery = this._createTimeQuery();
                if (timerQuery.beginQueryEXT) {
                    timerQuery.beginQueryEXT(timerQuery.TIME_ELAPSED_EXT, token._timeElapsedQuery);
                }
                else {
                    this._gl.beginQuery(timerQuery.TIME_ELAPSED_EXT, token._timeElapsedQuery);
                }
                this._currentNonTimestampToken = token;
            }
            return token;
        };
        Engine.prototype.endTimeQuery = function (token) {
            var timerQuery = this._caps.timerQuery;
            if (!timerQuery || !token) {
                return -1;
            }
            if (this._caps.canUseTimestampForTimerQuery) {
                if (!token._startTimeQuery) {
                    return -1;
                }
                if (!token._endTimeQuery) {
                    token._endTimeQuery = this._createTimeQuery();
                    timerQuery.queryCounterEXT(token._endTimeQuery, timerQuery.TIMESTAMP_EXT);
                }
            }
            else if (!token._timeElapsedQueryEnded) {
                if (!token._timeElapsedQuery) {
                    return -1;
                }
                if (timerQuery.endQueryEXT) {
                    timerQuery.endQueryEXT(timerQuery.TIME_ELAPSED_EXT);
                }
                else {
                    this._gl.endQuery(timerQuery.TIME_ELAPSED_EXT);
                }
                token._timeElapsedQueryEnded = true;
            }
            var disjoint = this._gl.getParameter(timerQuery.GPU_DISJOINT_EXT);
            var available = false;
            if (token._endTimeQuery) {
                available = this._getTimeQueryAvailability(token._endTimeQuery);
            }
            else if (token._timeElapsedQuery) {
                available = this._getTimeQueryAvailability(token._timeElapsedQuery);
            }
            if (available && !disjoint) {
                var result = 0;
                if (this._caps.canUseTimestampForTimerQuery) {
                    if (!token._startTimeQuery || !token._endTimeQuery) {
                        return -1;
                    }
                    var timeStart = this._getTimeQueryResult(token._startTimeQuery);
                    var timeEnd = this._getTimeQueryResult(token._endTimeQuery);
                    result = timeEnd - timeStart;
                    this._deleteTimeQuery(token._startTimeQuery);
                    this._deleteTimeQuery(token._endTimeQuery);
                    token._startTimeQuery = null;
                    token._endTimeQuery = null;
                }
                else {
                    if (!token._timeElapsedQuery) {
                        return -1;
                    }
                    result = this._getTimeQueryResult(token._timeElapsedQuery);
                    this._deleteTimeQuery(token._timeElapsedQuery);
                    token._timeElapsedQuery = null;
                    token._timeElapsedQueryEnded = false;
                    this._currentNonTimestampToken = null;
                }
                return result;
            }
            return -1;
        };
        Engine.prototype.getGlAlgorithmType = function (algorithmType) {
            return algorithmType === BABYLON.AbstractMesh.OCCLUSION_ALGORITHM_TYPE_CONSERVATIVE ? this._gl.ANY_SAMPLES_PASSED_CONSERVATIVE : this._gl.ANY_SAMPLES_PASSED;
        };
        // Transform feedback
        Engine.prototype.createTransformFeedback = function () {
            return this._gl.createTransformFeedback();
        };
        Engine.prototype.deleteTransformFeedback = function (value) {
            this._gl.deleteTransformFeedback(value);
        };
        Engine.prototype.bindTransformFeedback = function (value) {
            this._gl.bindTransformFeedback(this._gl.TRANSFORM_FEEDBACK, value);
        };
        Engine.prototype.beginTransformFeedback = function (usePoints) {
            if (usePoints === void 0) { usePoints = true; }
            this._gl.beginTransformFeedback(usePoints ? this._gl.POINTS : this._gl.TRIANGLES);
        };
        Engine.prototype.endTransformFeedback = function () {
            this._gl.endTransformFeedback();
        };
        Engine.prototype.setTranformFeedbackVaryings = function (program, value) {
            this._gl.transformFeedbackVaryings(program, value, this._gl.INTERLEAVED_ATTRIBS);
        };
        Engine.prototype.bindTransformFeedbackBuffer = function (value) {
            this._gl.bindBufferBase(this._gl.TRANSFORM_FEEDBACK_BUFFER, 0, value);
        };
        Engine.prototype._loadFile = function (url, onSuccess, onProgress, database, useArrayBuffer, onError) {
            var _this = this;
            var request = BABYLON.Tools.LoadFile(url, onSuccess, onProgress, database, useArrayBuffer, onError);
            this._activeRequests.push(request);
            request.onCompleteObservable.add(function (request) {
                _this._activeRequests.splice(_this._activeRequests.indexOf(request), 1);
            });
            return request;
        };
        Engine.prototype._partialLoadFile = function (url, index, loadedFiles, scene, onfinish, onErrorCallBack) {
            if (onErrorCallBack === void 0) { onErrorCallBack = null; }
            var onload = function (data) {
                loadedFiles[index] = data;
                loadedFiles._internalCount++;
                if (loadedFiles._internalCount === 6) {
                    onfinish(loadedFiles);
                }
            };
            var onerror = function (request, exception) {
                if (onErrorCallBack && request) {
                    onErrorCallBack(request.status + " " + request.statusText, exception);
                }
            };
            this._loadFile(url, onload, undefined, undefined, true, onerror);
        };
        Engine.prototype._cascadeLoadFiles = function (rootUrl, scene, onfinish, files, onError) {
            if (onError === void 0) { onError = null; }
            var loadedFiles = [];
            loadedFiles._internalCount = 0;
            for (var index = 0; index < 6; index++) {
                this._partialLoadFile(files[index], index, loadedFiles, scene, onfinish, onError);
            }
        };
        // Statics
        Engine.isSupported = function () {
            try {
                var tempcanvas = document.createElement("canvas");
                var gl = tempcanvas.getContext("webgl") || tempcanvas.getContext("experimental-webgl");
                return gl != null && !!window.WebGLRenderingContext;
            }
            catch (e) {
                return false;
            }
        };
        /** Use this array to turn off some WebGL2 features on known buggy browsers version */
        Engine.WebGL2UniformBuffersExceptionList = ["Chrome/63"];
        Engine.Instances = new Array();
        // Const statics
        Engine._ALPHA_DISABLE = 0;
        Engine._ALPHA_ADD = 1;
        Engine._ALPHA_COMBINE = 2;
        Engine._ALPHA_SUBTRACT = 3;
        Engine._ALPHA_MULTIPLY = 4;
        Engine._ALPHA_MAXIMIZED = 5;
        Engine._ALPHA_ONEONE = 6;
        Engine._ALPHA_PREMULTIPLIED = 7;
        Engine._ALPHA_PREMULTIPLIED_PORTERDUFF = 8;
        Engine._ALPHA_INTERPOLATE = 9;
        Engine._ALPHA_SCREENMODE = 10;
        Engine._DELAYLOADSTATE_NONE = 0;
        Engine._DELAYLOADSTATE_LOADED = 1;
        Engine._DELAYLOADSTATE_LOADING = 2;
        Engine._DELAYLOADSTATE_NOTLOADED = 4;
        Engine._TEXTUREFORMAT_ALPHA = 0;
        Engine._TEXTUREFORMAT_LUMINANCE = 1;
        Engine._TEXTUREFORMAT_LUMINANCE_ALPHA = 2;
        Engine._TEXTUREFORMAT_RGB = 4;
        Engine._TEXTUREFORMAT_RGBA = 5;
        Engine._TEXTURETYPE_UNSIGNED_INT = 0;
        Engine._TEXTURETYPE_FLOAT = 1;
        Engine._TEXTURETYPE_HALF_FLOAT = 2;
        // Depht or Stencil test Constants.
        Engine._NEVER = 0x0200; //  Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn.
        Engine._ALWAYS = 0x0207; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn.
        Engine._LESS = 0x0201; //   Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value.
        Engine._EQUAL = 0x0202; //  Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value.
        Engine._LEQUAL = 0x0203; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value.
        Engine._GREATER = 0x0204; //    Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value.
        Engine._GEQUAL = 0x0206; // Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value.
        Engine._NOTEQUAL = 0x0205; //  Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value.
        // Stencil Actions Constants.
        Engine._KEEP = 0x1E00;
        Engine._REPLACE = 0x1E01;
        Engine._INCR = 0x1E02;
        Engine._DECR = 0x1E03;
        Engine._INVERT = 0x150A;
        Engine._INCR_WRAP = 0x8507;
        Engine._DECR_WRAP = 0x8508;
        // Texture rescaling mode
        Engine._SCALEMODE_FLOOR = 1;
        Engine._SCALEMODE_NEAREST = 2;
        Engine._SCALEMODE_CEILING = 3;
        // Updatable statics so stick with vars here
        Engine.CollisionsEpsilon = 0.001;
        Engine.CodeRepository = "src/";
        Engine.ShadersRepository = "src/Shaders/";
        return Engine;
    }());
    BABYLON.Engine = Engine;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.engine.js.map
