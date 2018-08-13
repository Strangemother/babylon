
var LIB;
(function (LIB) {
    var Sound = /** @class */ (function () {
        /**
        * Create a sound and attach it to a scene
        * @param name Name of your sound
        * @param urlOrArrayBuffer Url to the sound to load async or ArrayBuffer
        * @param readyToPlayCallback Provide a callback function if you'd like to load your code once the sound is ready to be played
        * @param options Objects to provide with the current available options: autoplay, loop, volume, spatialSound, maxDistance, rolloffFactor, refDistance, distanceModel, panningModel, streaming
        */
        function Sound(name, urlOrArrayBuffer, scene, readyToPlayCallback, options) {
            if (readyToPlayCallback === void 0) { readyToPlayCallback = null; }
            var _this = this;
            this.autoplay = false;
            this.loop = false;
            this.useCustomAttenuation = false;
            this.spatialSound = false;
            this.refDistance = 1;
            this.rolloffFactor = 1;
            this.maxDistance = 100;
            this.distanceModel = "linear";
            this._panningModel = "equalpower";
            this._playbackRate = 1;
            this._streaming = false;
            this._startTime = 0;
            this._startOffset = 0;
            this._position = LIB.Vector3.Zero();
            this._localDirection = new LIB.Vector3(1, 0, 0);
            this._volume = 1;
            this._isReadyToPlay = false;
            this.isPlaying = false;
            this.isPaused = false;
            this._isDirectional = false;
            // Used if you'd like to create a directional sound.
            // If not set, the sound will be omnidirectional
            this._coneInnerAngle = 360;
            this._coneOuterAngle = 360;
            this._coneOuterGain = 0;
            this._isOutputConnected = false;
            this._urlType = "Unknown";
            this.name = name;
            this._scene = scene;
            this._readyToPlayCallback = readyToPlayCallback;
            // Default custom attenuation function is a linear attenuation
            this._customAttenuationFunction = function (currentVolume, currentDistance, maxDistance, refDistance, rolloffFactor) {
                if (currentDistance < maxDistance) {
                    return currentVolume * (1 - currentDistance / maxDistance);
                }
                else {
                    return 0;
                }
            };
            if (options) {
                this.autoplay = options.autoplay || false;
                this.loop = options.loop || false;
                // if volume === 0, we need another way to check this option
                if (options.volume !== undefined) {
                    this._volume = options.volume;
                }
                this.spatialSound = options.spatialSound || false;
                this.maxDistance = options.maxDistance || 100;
                this.useCustomAttenuation = options.useCustomAttenuation || false;
                this.rolloffFactor = options.rolloffFactor || 1;
                this.refDistance = options.refDistance || 1;
                this.distanceModel = options.distanceModel || "linear";
                this._playbackRate = options.playbackRate || 1;
                this._streaming = options.streaming || false;
            }
            if (LIB.Engine.audioEngine.canUseWebAudio && LIB.Engine.audioEngine.audioContext) {
                this._soundGain = LIB.Engine.audioEngine.audioContext.createGain();
                this._soundGain.gain.value = this._volume;
                this._inputAudioNode = this._soundGain;
                this._ouputAudioNode = this._soundGain;
                if (this.spatialSound) {
                    this._createSpatialParameters();
                }
                this._scene.mainSoundTrack.AddSound(this);
                var validParameter = true;
                // if no parameter is passed, you need to call setAudioBuffer yourself to prepare the sound
                if (urlOrArrayBuffer) {
                    try {
                        if (typeof (urlOrArrayBuffer) === "string")
                            this._urlType = "String";
                        if (Array.isArray(urlOrArrayBuffer))
                            this._urlType = "Array";
                        if (urlOrArrayBuffer instanceof ArrayBuffer)
                            this._urlType = "ArrayBuffer";
                        var urls = [];
                        var codecSupportedFound = false;
                        switch (this._urlType) {
                            case "ArrayBuffer":
                                if (urlOrArrayBuffer.byteLength > 0) {
                                    codecSupportedFound = true;
                                    this._soundLoaded(urlOrArrayBuffer);
                                }
                                break;
                            case "String":
                                urls.push(urlOrArrayBuffer);
                            case "Array":
                                if (urls.length === 0)
                                    urls = urlOrArrayBuffer;
                                // If we found a supported format, we load it immediately and stop the loop
                                for (var i = 0; i < urls.length; i++) {
                                    var url = urls[i];
                                    if (url.indexOf(".mp3", url.length - 4) !== -1 && LIB.Engine.audioEngine.isMP3supported) {
                                        codecSupportedFound = true;
                                    }
                                    if (url.indexOf(".ogg", url.length - 4) !== -1 && LIB.Engine.audioEngine.isOGGsupported) {
                                        codecSupportedFound = true;
                                    }
                                    if (url.indexOf(".wav", url.length - 4) !== -1) {
                                        codecSupportedFound = true;
                                    }
                                    if (url.indexOf("blob:") !== -1) {
                                        codecSupportedFound = true;
                                    }
                                    if (codecSupportedFound) {
                                        // Loading sound using XHR2
                                        if (!this._streaming) {
                                            this._scene._loadFile(url, function (data) {
                                                _this._soundLoaded(data);
                                            }, undefined, true, true, function (exception) {
                                                if (exception) {
                                                    LIB.Tools.Error("XHR " + exception.status + " error on: " + url + ".");
                                                }
                                                LIB.Tools.Error("Sound creation aborted.");
                                                _this._scene.mainSoundTrack.RemoveSound(_this);
                                            });
                                        }
                                        // Streaming sound using HTML5 Audio tag
                                        else {
                                            this._htmlAudioElement = new Audio(url);
                                            this._htmlAudioElement.controls = false;
                                            this._htmlAudioElement.loop = this.loop;
                                            LIB.Tools.SetCorsBehavior(url, this._htmlAudioElement);
                                            this._htmlAudioElement.preload = "auto";
                                            this._htmlAudioElement.addEventListener("canplaythrough", function () {
                                                _this._isReadyToPlay = true;
                                                if (_this.autoplay) {
                                                    _this.play();
                                                }
                                                if (_this._readyToPlayCallback) {
                                                    _this._readyToPlayCallback();
                                                }
                                            });
                                            document.body.appendChild(this._htmlAudioElement);
                                        }
                                        break;
                                    }
                                }
                                break;
                            default:
                                validParameter = false;
                                break;
                        }
                        if (!validParameter) {
                            LIB.Tools.Error("Parameter must be a URL to the sound, an Array of URLs (.mp3 & .ogg) or an ArrayBuffer of the sound.");
                        }
                        else {
                            if (!codecSupportedFound) {
                                this._isReadyToPlay = true;
                                // Simulating a ready to play event to avoid breaking code path
                                if (this._readyToPlayCallback) {
                                    window.setTimeout(function () {
                                        if (_this._readyToPlayCallback) {
                                            _this._readyToPlayCallback();
                                        }
                                    }, 1000);
                                }
                            }
                        }
                    }
                    catch (ex) {
                        LIB.Tools.Error("Unexpected error. Sound creation aborted.");
                        this._scene.mainSoundTrack.RemoveSound(this);
                    }
                }
            }
            else {
                // Adding an empty sound to avoid breaking audio calls for non Web Audio browsers
                this._scene.mainSoundTrack.AddSound(this);
                if (!LIB.Engine.audioEngine.WarnedWebAudioUnsupported) {
                    LIB.Tools.Error("Web Audio is not supported by your browser.");
                    LIB.Engine.audioEngine.WarnedWebAudioUnsupported = true;
                }
                // Simulating a ready to play event to avoid breaking code for non web audio browsers
                if (this._readyToPlayCallback) {
                    window.setTimeout(function () {
                        if (_this._readyToPlayCallback) {
                            _this._readyToPlayCallback();
                        }
                    }, 1000);
                }
            }
        }
        Sound.prototype.dispose = function () {
            if (LIB.Engine.audioEngine.canUseWebAudio) {
                if (this.isPlaying) {
                    this.stop();
                }
                this._isReadyToPlay = false;
                if (this.soundTrackId === -1) {
                    this._scene.mainSoundTrack.RemoveSound(this);
                }
                else {
                    this._scene.soundTracks[this.soundTrackId].RemoveSound(this);
                }
                if (this._soundGain) {
                    this._soundGain.disconnect();
                    this._soundGain = null;
                }
                if (this._soundPanner) {
                    this._soundPanner.disconnect();
                    this._soundPanner = null;
                }
                if (this._soundSource) {
                    this._soundSource.disconnect();
                    this._soundSource = null;
                }
                this._audioBuffer = null;
                if (this._htmlAudioElement) {
                    this._htmlAudioElement.pause();
                    this._htmlAudioElement.src = "";
                    document.body.removeChild(this._htmlAudioElement);
                }
                if (this._connectedMesh && this._registerFunc) {
                    this._connectedMesh.unregisterAfterWorldMatrixUpdate(this._registerFunc);
                    this._connectedMesh = null;
                }
            }
        };
        Sound.prototype.isReady = function () {
            return this._isReadyToPlay;
        };
        Sound.prototype._soundLoaded = function (audioData) {
            var _this = this;
            if (!LIB.Engine.audioEngine.audioContext) {
                return;
            }
            LIB.Engine.audioEngine.audioContext.decodeAudioData(audioData, function (buffer) {
                _this._audioBuffer = buffer;
                _this._isReadyToPlay = true;
                if (_this.autoplay) {
                    _this.play();
                }
                if (_this._readyToPlayCallback) {
                    _this._readyToPlayCallback();
                }
            }, function (err) { LIB.Tools.Error("Error while decoding audio data for: " + _this.name + " / Error: " + err); });
        };
        Sound.prototype.setAudioBuffer = function (audioBuffer) {
            if (LIB.Engine.audioEngine.canUseWebAudio) {
                this._audioBuffer = audioBuffer;
                this._isReadyToPlay = true;
            }
        };
        Sound.prototype.updateOptions = function (options) {
            if (options) {
                this.loop = options.loop || this.loop;
                this.maxDistance = options.maxDistance || this.maxDistance;
                this.useCustomAttenuation = options.useCustomAttenuation || this.useCustomAttenuation;
                this.rolloffFactor = options.rolloffFactor || this.rolloffFactor;
                this.refDistance = options.refDistance || this.refDistance;
                this.distanceModel = options.distanceModel || this.distanceModel;
                this._playbackRate = options.playbackRate || this._playbackRate;
                this._updateSpatialParameters();
                if (this.isPlaying) {
                    if (this._streaming) {
                        this._htmlAudioElement.playbackRate = this._playbackRate;
                    }
                    else {
                        if (this._soundSource) {
                            this._soundSource.playbackRate.value = this._playbackRate;
                        }
                    }
                }
            }
        };
        Sound.prototype._createSpatialParameters = function () {
            if (LIB.Engine.audioEngine.canUseWebAudio && LIB.Engine.audioEngine.audioContext) {
                if (this._scene.headphone) {
                    this._panningModel = "HRTF";
                }
                this._soundPanner = LIB.Engine.audioEngine.audioContext.createPanner();
                this._updateSpatialParameters();
                this._soundPanner.connect(this._ouputAudioNode);
                this._inputAudioNode = this._soundPanner;
            }
        };
        Sound.prototype._updateSpatialParameters = function () {
            if (this.spatialSound && this._soundPanner) {
                if (this.useCustomAttenuation) {
                    // Tricks to disable in a way embedded Web Audio attenuation 
                    this._soundPanner.distanceModel = "linear";
                    this._soundPanner.maxDistance = Number.MAX_VALUE;
                    this._soundPanner.refDistance = 1;
                    this._soundPanner.rolloffFactor = 1;
                    this._soundPanner.panningModel = this._panningModel;
                }
                else {
                    this._soundPanner.distanceModel = this.distanceModel;
                    this._soundPanner.maxDistance = this.maxDistance;
                    this._soundPanner.refDistance = this.refDistance;
                    this._soundPanner.rolloffFactor = this.rolloffFactor;
                    this._soundPanner.panningModel = this._panningModel;
                }
            }
        };
        Sound.prototype.switchPanningModelToHRTF = function () {
            this._panningModel = "HRTF";
            this._switchPanningModel();
        };
        Sound.prototype.switchPanningModelToEqualPower = function () {
            this._panningModel = "equalpower";
            this._switchPanningModel();
        };
        Sound.prototype._switchPanningModel = function () {
            if (LIB.Engine.audioEngine.canUseWebAudio && this.spatialSound && this._soundPanner) {
                this._soundPanner.panningModel = this._panningModel;
            }
        };
        Sound.prototype.connectToSoundTrackAudioNode = function (soundTrackAudioNode) {
            if (LIB.Engine.audioEngine.canUseWebAudio) {
                if (this._isOutputConnected) {
                    this._ouputAudioNode.disconnect();
                }
                this._ouputAudioNode.connect(soundTrackAudioNode);
                this._isOutputConnected = true;
            }
        };
        /**
        * Transform this sound into a directional source
        * @param coneInnerAngle Size of the inner cone in degree
        * @param coneOuterAngle Size of the outer cone in degree
        * @param coneOuterGain Volume of the sound outside the outer cone (between 0.0 and 1.0)
        */
        Sound.prototype.setDirectionalCone = function (coneInnerAngle, coneOuterAngle, coneOuterGain) {
            if (coneOuterAngle < coneInnerAngle) {
                LIB.Tools.Error("setDirectionalCone(): outer angle of the cone must be superior or equal to the inner angle.");
                return;
            }
            this._coneInnerAngle = coneInnerAngle;
            this._coneOuterAngle = coneOuterAngle;
            this._coneOuterGain = coneOuterGain;
            this._isDirectional = true;
            if (this.isPlaying && this.loop) {
                this.stop();
                this.play();
            }
        };
        Sound.prototype.setPosition = function (newPosition) {
            this._position = newPosition;
            if (LIB.Engine.audioEngine.canUseWebAudio && this.spatialSound && this._soundPanner) {
                this._soundPanner.setPosition(this._position.x, this._position.y, this._position.z);
            }
        };
        Sound.prototype.setLocalDirectionToMesh = function (newLocalDirection) {
            this._localDirection = newLocalDirection;
            if (LIB.Engine.audioEngine.canUseWebAudio && this._connectedMesh && this.isPlaying) {
                this._updateDirection();
            }
        };
        Sound.prototype._updateDirection = function () {
            if (!this._connectedMesh || !this._soundPanner) {
                return;
            }
            var mat = this._connectedMesh.getWorldMatrix();
            var direction = LIB.Vector3.TransformNormal(this._localDirection, mat);
            direction.normalize();
            this._soundPanner.setOrientation(direction.x, direction.y, direction.z);
        };
        Sound.prototype.updateDistanceFromListener = function () {
            if (LIB.Engine.audioEngine.canUseWebAudio && this._connectedMesh && this.useCustomAttenuation && this._soundGain && this._scene.activeCamera) {
                var distance = this._connectedMesh.getDistanceToCamera(this._scene.activeCamera);
                this._soundGain.gain.value = this._customAttenuationFunction(this._volume, distance, this.maxDistance, this.refDistance, this.rolloffFactor);
            }
        };
        Sound.prototype.setAttenuationFunction = function (callback) {
            this._customAttenuationFunction = callback;
        };
        /**
        * Play the sound
        * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
        * @param offset (optional) Start the sound setting it at a specific time
        */
        Sound.prototype.play = function (time, offset) {
            var _this = this;
            if (this._isReadyToPlay && this._scene.audioEnabled && LIB.Engine.audioEngine.audioContext) {
                try {
                    if (this._startOffset < 0) {
                        time = -this._startOffset;
                        this._startOffset = 0;
                    }
                    var startTime = time ? LIB.Engine.audioEngine.audioContext.currentTime + time : LIB.Engine.audioEngine.audioContext.currentTime;
                    if (!this._soundSource || !this._streamingSource) {
                        if (this.spatialSound && this._soundPanner) {
                            this._soundPanner.setPosition(this._position.x, this._position.y, this._position.z);
                            if (this._isDirectional) {
                                this._soundPanner.coneInnerAngle = this._coneInnerAngle;
                                this._soundPanner.coneOuterAngle = this._coneOuterAngle;
                                this._soundPanner.coneOuterGain = this._coneOuterGain;
                                if (this._connectedMesh) {
                                    this._updateDirection();
                                }
                                else {
                                    this._soundPanner.setOrientation(this._localDirection.x, this._localDirection.y, this._localDirection.z);
                                }
                            }
                        }
                    }
                    if (this._streaming) {
                        if (!this._streamingSource) {
                            this._streamingSource = LIB.Engine.audioEngine.audioContext.createMediaElementSource(this._htmlAudioElement);
                            this._htmlAudioElement.onended = function () { _this._onended(); };
                            this._htmlAudioElement.playbackRate = this._playbackRate;
                        }
                        this._streamingSource.disconnect();
                        this._streamingSource.connect(this._inputAudioNode);
                        this._htmlAudioElement.play();
                    }
                    else {
                        this._soundSource = LIB.Engine.audioEngine.audioContext.createBufferSource();
                        this._soundSource.buffer = this._audioBuffer;
                        this._soundSource.connect(this._inputAudioNode);
                        this._soundSource.loop = this.loop;
                        this._soundSource.playbackRate.value = this._playbackRate;
                        this._soundSource.onended = function () { _this._onended(); };
                        if (this._soundSource.buffer) {
                            this._soundSource.start(startTime, this.isPaused ? this._startOffset % this._soundSource.buffer.duration : offset ? offset : 0);
                        }
                    }
                    this._startTime = startTime;
                    this.isPlaying = true;
                    this.isPaused = false;
                }
                catch (ex) {
                    LIB.Tools.Error("Error while trying to play audio: " + this.name + ", " + ex.message);
                }
            }
        };
        Sound.prototype._onended = function () {
            this.isPlaying = false;
            if (this.onended) {
                this.onended();
            }
        };
        /**
        * Stop the sound
        * @param time (optional) Stop the sound after X seconds. Stop immediately (0) by default.
        */
        Sound.prototype.stop = function (time) {
            if (this.isPlaying) {
                if (this._streaming) {
                    this._htmlAudioElement.pause();
                    // Test needed for Firefox or it will generate an Invalid State Error
                    if (this._htmlAudioElement.currentTime > 0) {
                        this._htmlAudioElement.currentTime = 0;
                    }
                }
                else if (LIB.Engine.audioEngine.audioContext && this._soundSource) {
                    var stopTime = time ? LIB.Engine.audioEngine.audioContext.currentTime + time : LIB.Engine.audioEngine.audioContext.currentTime;
                    this._soundSource.stop(stopTime);
                    this._soundSource.onended = function () { };
                    if (!this.isPaused) {
                        this._startOffset = 0;
                    }
                }
                this.isPlaying = false;
            }
        };
        Sound.prototype.pause = function () {
            if (this.isPlaying) {
                this.isPaused = true;
                if (this._streaming) {
                    this._htmlAudioElement.pause();
                }
                else if (LIB.Engine.audioEngine.audioContext) {
                    this.stop(0);
                    this._startOffset += LIB.Engine.audioEngine.audioContext.currentTime - this._startTime;
                }
            }
        };
        Sound.prototype.setVolume = function (newVolume, time) {
            if (LIB.Engine.audioEngine.canUseWebAudio && this._soundGain) {
                if (time && LIB.Engine.audioEngine.audioContext) {
                    this._soundGain.gain.cancelScheduledValues(LIB.Engine.audioEngine.audioContext.currentTime);
                    this._soundGain.gain.setValueAtTime(this._soundGain.gain.value, LIB.Engine.audioEngine.audioContext.currentTime);
                    this._soundGain.gain.linearRampToValueAtTime(newVolume, LIB.Engine.audioEngine.audioContext.currentTime + time);
                }
                else {
                    this._soundGain.gain.value = newVolume;
                }
            }
            this._volume = newVolume;
        };
        Sound.prototype.setPlaybackRate = function (newPlaybackRate) {
            this._playbackRate = newPlaybackRate;
            if (this.isPlaying) {
                if (this._streaming) {
                    this._htmlAudioElement.playbackRate = this._playbackRate;
                }
                else if (this._soundSource) {
                    this._soundSource.playbackRate.value = this._playbackRate;
                }
            }
        };
        Sound.prototype.getVolume = function () {
            return this._volume;
        };
        Sound.prototype.attachToMesh = function (meshToConnectTo) {
            var _this = this;
            if (this._connectedMesh && this._registerFunc) {
                this._connectedMesh.unregisterAfterWorldMatrixUpdate(this._registerFunc);
                this._registerFunc = null;
            }
            this._connectedMesh = meshToConnectTo;
            if (!this.spatialSound) {
                this.spatialSound = true;
                this._createSpatialParameters();
                if (this.isPlaying && this.loop) {
                    this.stop();
                    this.play();
                }
            }
            this._onRegisterAfterWorldMatrixUpdate(this._connectedMesh);
            this._registerFunc = function (connectedMesh) { return _this._onRegisterAfterWorldMatrixUpdate(connectedMesh); };
            meshToConnectTo.registerAfterWorldMatrixUpdate(this._registerFunc);
        };
        Sound.prototype.detachFromMesh = function () {
            if (this._connectedMesh && this._registerFunc) {
                this._connectedMesh.unregisterAfterWorldMatrixUpdate(this._registerFunc);
                this._registerFunc = null;
                this._connectedMesh = null;
            }
        };
        Sound.prototype._onRegisterAfterWorldMatrixUpdate = function (node) {
            if (!node.getBoundingInfo) {
                return;
            }
            var mesh = node;
            var boundingInfo = mesh.getBoundingInfo();
            this.setPosition(boundingInfo.boundingSphere.centerWorld);
            if (LIB.Engine.audioEngine.canUseWebAudio && this._isDirectional && this.isPlaying) {
                this._updateDirection();
            }
        };
        Sound.prototype.clone = function () {
            var _this = this;
            if (!this._streaming) {
                var setBufferAndRun = function () {
                    if (_this._isReadyToPlay) {
                        clonedSound._audioBuffer = _this.getAudioBuffer();
                        clonedSound._isReadyToPlay = true;
                        if (clonedSound.autoplay) {
                            clonedSound.play();
                        }
                    }
                    else {
                        window.setTimeout(setBufferAndRun, 300);
                    }
                };
                var currentOptions = {
                    autoplay: this.autoplay, loop: this.loop,
                    volume: this._volume, spatialSound: this.spatialSound, maxDistance: this.maxDistance,
                    useCustomAttenuation: this.useCustomAttenuation, rolloffFactor: this.rolloffFactor,
                    refDistance: this.refDistance, distanceModel: this.distanceModel
                };
                var clonedSound = new Sound(this.name + "_cloned", new ArrayBuffer(0), this._scene, null, currentOptions);
                if (this.useCustomAttenuation) {
                    clonedSound.setAttenuationFunction(this._customAttenuationFunction);
                }
                clonedSound.setPosition(this._position);
                clonedSound.setPlaybackRate(this._playbackRate);
                setBufferAndRun();
                return clonedSound;
            }
            // Can't clone a streaming sound
            else {
                return null;
            }
        };
        Sound.prototype.getAudioBuffer = function () {
            return this._audioBuffer;
        };
        Sound.prototype.serialize = function () {
            var serializationObject = {
                name: this.name,
                url: this.name,
                autoplay: this.autoplay,
                loop: this.loop,
                volume: this._volume,
                spatialSound: this.spatialSound,
                maxDistance: this.maxDistance,
                rolloffFactor: this.rolloffFactor,
                refDistance: this.refDistance,
                distanceModel: this.distanceModel,
                playbackRate: this._playbackRate,
                panningModel: this._panningModel,
                soundTrackId: this.soundTrackId
            };
            if (this.spatialSound) {
                if (this._connectedMesh)
                    serializationObject.connectedMeshId = this._connectedMesh.id;
                serializationObject.position = this._position.asArray();
                serializationObject.refDistance = this.refDistance;
                serializationObject.distanceModel = this.distanceModel;
                serializationObject.isDirectional = this._isDirectional;
                serializationObject.localDirectionToMesh = this._localDirection.asArray();
                serializationObject.coneInnerAngle = this._coneInnerAngle;
                serializationObject.coneOuterAngle = this._coneOuterAngle;
                serializationObject.coneOuterGain = this._coneOuterGain;
            }
            return serializationObject;
        };
        Sound.Parse = function (parsedSound, scene, rootUrl, sourceSound) {
            var soundName = parsedSound.name;
            var soundUrl;
            if (parsedSound.url) {
                soundUrl = rootUrl + parsedSound.url;
            }
            else {
                soundUrl = rootUrl + soundName;
            }
            var options = {
                autoplay: parsedSound.autoplay, loop: parsedSound.loop, volume: parsedSound.volume,
                spatialSound: parsedSound.spatialSound, maxDistance: parsedSound.maxDistance,
                rolloffFactor: parsedSound.rolloffFactor,
                refDistance: parsedSound.refDistance,
                distanceModel: parsedSound.distanceModel,
                playbackRate: parsedSound.playbackRate
            };
            var newSound;
            if (!sourceSound) {
                newSound = new Sound(soundName, soundUrl, scene, function () { scene._removePendingData(newSound); }, options);
                scene._addPendingData(newSound);
            }
            else {
                var setBufferAndRun = function () {
                    if (sourceSound._isReadyToPlay) {
                        newSound._audioBuffer = sourceSound.getAudioBuffer();
                        newSound._isReadyToPlay = true;
                        if (newSound.autoplay) {
                            newSound.play();
                        }
                    }
                    else {
                        window.setTimeout(setBufferAndRun, 300);
                    }
                };
                newSound = new Sound(soundName, new ArrayBuffer(0), scene, null, options);
                setBufferAndRun();
            }
            if (parsedSound.position) {
                var soundPosition = LIB.Vector3.FromArray(parsedSound.position);
                newSound.setPosition(soundPosition);
            }
            if (parsedSound.isDirectional) {
                newSound.setDirectionalCone(parsedSound.coneInnerAngle || 360, parsedSound.coneOuterAngle || 360, parsedSound.coneOuterGain || 0);
                if (parsedSound.localDirectionToMesh) {
                    var localDirectionToMesh = LIB.Vector3.FromArray(parsedSound.localDirectionToMesh);
                    newSound.setLocalDirectionToMesh(localDirectionToMesh);
                }
            }
            if (parsedSound.connectedMeshId) {
                var connectedMesh = scene.getMeshByID(parsedSound.connectedMeshId);
                if (connectedMesh) {
                    newSound.attachToMesh(connectedMesh);
                }
            }
            return newSound;
        };
        return Sound;
    }());
    LIB.Sound = Sound;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.sound.js.map
//# sourceMappingURL=LIB.sound.js.map
