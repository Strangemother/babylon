

var LIB;
(function (LIB) {
    var VideoTexture = /** @class */ (function (_super) {
        __extends(VideoTexture, _super);
        /**
         * Creates a video texture.
         * Sample : https://doc.LIBjs.com/how_to/video_texture
         * @param {string | null} name optional name, will detect from video source, if not defined
         * @param {(string | string[] | HTMLVideoElement)} src can be used to provide an url, array of urls or an already setup HTML video element.
         * @param {LIB.Scene} scene is obviously the current scene.
         * @param {boolean} generateMipMaps can be used to turn on mipmaps (Can be expensive for videoTextures because they are often updated).
         * @param {boolean} invertY is false by default but can be used to invert video on Y axis
         * @param {number} samplingMode controls the sampling method and is set to TRILINEAR_SAMPLINGMODE by default
         * @param {VideoTextureSettings} [settings] allows finer control over video usage
         */
        function VideoTexture(name, src, scene, generateMipMaps, invertY, samplingMode, settings) {
            if (generateMipMaps === void 0) { generateMipMaps = false; }
            if (invertY === void 0) { invertY = false; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            if (settings === void 0) { settings = {
                autoPlay: true,
                loop: true,
                autoUpdateTexture: true,
            }; }
            var _this = _super.call(this, null, scene, !generateMipMaps, invertY) || this;
            _this._stillImageCaptured = false;
            _this._createInternalTexture = function () {
                if (_this._texture != null) {
                    return;
                }
                if (!_this._engine.needPOTTextures ||
                    (LIB.Tools.IsExponentOfTwo(_this.video.videoWidth) && LIB.Tools.IsExponentOfTwo(_this.video.videoHeight))) {
                    _this.wrapU = LIB.Texture.WRAP_ADDRESSMODE;
                    _this.wrapV = LIB.Texture.WRAP_ADDRESSMODE;
                }
                else {
                    _this.wrapU = LIB.Texture.CLAMP_ADDRESSMODE;
                    _this.wrapV = LIB.Texture.CLAMP_ADDRESSMODE;
                    _this._generateMipMaps = false;
                }
                _this._texture = _this._engine.createDynamicTexture(_this.video.videoWidth, _this.video.videoHeight, _this._generateMipMaps, _this._samplingMode);
                if (!_this.video.autoplay) {
                    var oldHandler_1 = _this.video.onplaying;
                    _this.video.onplaying = function () {
                        _this.video.onplaying = oldHandler_1;
                        _this._texture.isReady = true;
                        _this._updateInternalTexture();
                        _this.video.pause();
                        if (_this._onLoadObservable && _this._onLoadObservable.hasObservers()) {
                            _this.onLoadObservable.notifyObservers(_this);
                        }
                    };
                    _this.video.play();
                }
                else {
                    _this._texture.isReady = true;
                    _this._updateInternalTexture();
                    if (_this._onLoadObservable && _this._onLoadObservable.hasObservers()) {
                        _this.onLoadObservable.notifyObservers(_this);
                    }
                }
            };
            _this.reset = function () {
                if (_this._texture == null) {
                    return;
                }
                _this._texture.dispose();
                _this._texture = null;
            };
            _this._updateInternalTexture = function (e) {
                if (_this._texture == null || !_this._texture.isReady) {
                    return;
                }
                if (_this.video.readyState < _this.video.HAVE_CURRENT_DATA) {
                    return;
                }
                _this._engine.updateVideoTexture(_this._texture, _this.video, _this._invertY);
            };
            _this._engine = _this.getScene().getEngine();
            _this._generateMipMaps = generateMipMaps;
            _this._samplingMode = samplingMode;
            _this.autoUpdateTexture = settings.autoUpdateTexture;
            _this.name = name || _this._getName(src);
            _this.video = _this._getVideo(src);
            if (settings.autoPlay !== undefined) {
                _this.video.autoplay = settings.autoPlay;
            }
            if (settings.loop !== undefined) {
                _this.video.loop = settings.loop;
            }
            _this.video.addEventListener("canplay", _this._createInternalTexture);
            _this.video.addEventListener("paused", _this._updateInternalTexture);
            _this.video.addEventListener("seeked", _this._updateInternalTexture);
            _this.video.addEventListener("emptied", _this.reset);
            if (_this.video.readyState >= _this.video.HAVE_CURRENT_DATA) {
                _this._createInternalTexture();
            }
            return _this;
        }
        VideoTexture.prototype._getName = function (src) {
            if (src instanceof HTMLVideoElement) {
                return src.currentSrc;
            }
            if (typeof src === "object") {
                return src.toString();
            }
            return src;
        };
        ;
        VideoTexture.prototype._getVideo = function (src) {
            if (src instanceof HTMLVideoElement) {
                LIB.Tools.SetCorsBehavior(src.currentSrc, src);
                return src;
            }
            var video = document.createElement("video");
            if (typeof src === "string") {
                LIB.Tools.SetCorsBehavior(src, video);
                video.src = src;
            }
            else {
                LIB.Tools.SetCorsBehavior(src[0], video);
                src.forEach(function (url) {
                    var source = document.createElement("source");
                    source.src = url;
                    video.appendChild(source);
                });
            }
            return video;
        };
        ;
        /**
         * Internal method to initiate `update`.
         */
        VideoTexture.prototype._rebuild = function () {
            this.update();
        };
        /**
         * Update Texture in the `auto` mode. Does not do anything if `settings.autoUpdateTexture` is false.
         */
        VideoTexture.prototype.update = function () {
            if (!this.autoUpdateTexture) {
                // Expecting user to call `updateTexture` manually
                return;
            }
            this.updateTexture(true);
        };
        /**
         * Update Texture in `manual` mode. Does not do anything if not visible or paused.
         * @param isVisible Visibility state, detected by user using `scene.getActiveMeshes()` or othervise.
         */
        VideoTexture.prototype.updateTexture = function (isVisible) {
            if (!isVisible) {
                return;
            }
            if (this.video.paused && this._stillImageCaptured) {
                return;
            }
            this._stillImageCaptured = true;
            this._updateInternalTexture();
        };
        /**
         * Change video content. Changing video instance or setting multiple urls (as in constructor) is not supported.
         * @param url New url.
         */
        VideoTexture.prototype.updateURL = function (url) {
            this.video.src = url;
        };
        VideoTexture.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.video.removeEventListener("canplay", this._createInternalTexture);
            this.video.removeEventListener("paused", this._updateInternalTexture);
            this.video.removeEventListener("seeked", this._updateInternalTexture);
            this.video.removeEventListener("emptied", this.reset);
            this.video.pause();
        };
        VideoTexture.CreateFromWebCam = function (scene, onReady, constraints) {
            var video = document.createElement("video");
            var constraintsDeviceId;
            if (constraints && constraints.deviceId) {
                constraintsDeviceId = {
                    exact: constraints.deviceId,
                };
            }
            window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
            if (navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia({ video: constraints })
                    .then(function (stream) {
                    if (video.mozSrcObject !== undefined) {
                        // hack for Firefox < 19
                        video.mozSrcObject = stream;
                    }
                    else {
                        video.srcObject = stream;
                    }
                    var onPlaying = function () {
                        if (onReady) {
                            onReady(new VideoTexture("video", video, scene, true, true));
                        }
                        video.removeEventListener("playing", onPlaying);
                    };
                    video.addEventListener("playing", onPlaying);
                    video.play();
                })
                    .catch(function (err) {
                    LIB.Tools.Error(err.name);
                });
            }
            else {
                navigator.getUserMedia =
                    navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({
                        video: {
                            deviceId: constraintsDeviceId,
                            width: {
                                min: (constraints && constraints.minWidth) || 256,
                                max: (constraints && constraints.maxWidth) || 640,
                            },
                            height: {
                                min: (constraints && constraints.minHeight) || 256,
                                max: (constraints && constraints.maxHeight) || 480,
                            },
                        },
                    }, function (stream) {
                        if (video.mozSrcObject !== undefined) {
                            // hack for Firefox < 19
                            video.mozSrcObject = stream;
                        }
                        else {
                            video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                        }
                        video.play();
                        if (onReady) {
                            onReady(new VideoTexture("video", video, scene, true, true));
                        }
                    }, function (e) {
                        LIB.Tools.Error(e.name);
                    });
                }
            }
        };
        return VideoTexture;
    }(LIB.Texture));
    LIB.VideoTexture = VideoTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.videoTexture.js.map
//# sourceMappingURL=LIB.videoTexture.js.map
