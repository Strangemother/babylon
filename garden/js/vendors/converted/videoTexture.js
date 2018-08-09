(function (LIB) {
    var VideoTexture = /** @class */ (function (_super) {
        __extends(VideoTexture, _super);
        /**
         * Creates a video texture.
         * Sample : https://doc.LIBjs.com/tutorials/01._Advanced_Texturing
         * @param {Array} urlsOrVideo can be used to provide an array of urls or an already setup HTML video element.
         * @param {LIB.Scene} scene is obviously the current scene.
         * @param {boolean} generateMipMaps can be used to turn on mipmaps (Can be expensive for videoTextures because they are often updated).
         * @param {boolean} invertY is false by default but can be used to invert video on Y axis
         * @param {number} samplingMode controls the sampling method and is set to TRILINEAR_SAMPLINGMODE by default
         */
        function VideoTexture(name, urlsOrVideo, scene, generateMipMaps, invertY, samplingMode) {
            if (generateMipMaps === void 0) { generateMipMaps = false; }
            if (invertY === void 0) { invertY = false; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            var _this = _super.call(this, null, scene, !generateMipMaps, invertY) || this;
            _this._autoLaunch = true;
            var urls = null;
            _this.name = name;
            if (urlsOrVideo instanceof HTMLVideoElement) {
                _this.video = urlsOrVideo;
            }
            else {
                urls = urlsOrVideo;
                _this.video = document.createElement("video");
                _this.video.autoplay = false;
                _this.video.loop = true;
                LIB.Tools.SetCorsBehavior(urls, _this.video);
            }
            _this._engine = _this.getScene().getEngine();
            _this._generateMipMaps = generateMipMaps;
            _this._samplingMode = samplingMode;
            if (!_this._engine.needPOTTextures || (LIB.Tools.IsExponentOfTwo(_this.video.videoWidth) && LIB.Tools.IsExponentOfTwo(_this.video.videoHeight))) {
                _this.wrapU = LIB.Texture.WRAP_ADDRESSMODE;
                _this.wrapV = LIB.Texture.WRAP_ADDRESSMODE;
            }
            else {
                _this.wrapU = LIB.Texture.CLAMP_ADDRESSMODE;
                _this.wrapV = LIB.Texture.CLAMP_ADDRESSMODE;
                _this._generateMipMaps = false;
            }
            if (urls) {
                _this.video.addEventListener("canplay", function () {
                    if (_this._texture === undefined) {
                        _this._createTexture();
                    }
                });
                urls.forEach(function (url) {
                    var source = document.createElement("source");
                    source.src = url;
                    _this.video.appendChild(source);
                });
            }
            else {
                _this._createTexture();
            }
            _this._lastUpdate = LIB.Tools.Now;
            return _this;
        }
        VideoTexture.prototype.__setTextureReady = function () {
            if (this._texture) {
                this._texture.isReady = true;
            }
        };
        VideoTexture.prototype._createTexture = function () {
            this._texture = this._engine.createDynamicTexture(this.video.videoWidth, this.video.videoHeight, this._generateMipMaps, this._samplingMode);
            if (this._autoLaunch) {
                this._autoLaunch = false;
                this.video.play();
            }
            this._setTextureReady = this.__setTextureReady.bind(this);
            this.video.addEventListener("playing", this._setTextureReady);
        };
        VideoTexture.prototype._rebuild = function () {
            this.update();
        };
        VideoTexture.prototype.update = function () {
            var now = LIB.Tools.Now;
            if (now - this._lastUpdate < 15 || this.video.readyState !== this.video.HAVE_ENOUGH_DATA) {
                return false;
            }
            this._lastUpdate = now;
            this._engine.updateVideoTexture(this._texture, this.video, this._invertY);
            return true;
        };
        VideoTexture.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.video.removeEventListener("playing", this._setTextureReady);
        };
        VideoTexture.CreateFromWebCam = function (scene, onReady, constraints) {
            var video = document.createElement("video");
            var constraintsDeviceId;
            if (constraints && constraints.deviceId) {
                constraintsDeviceId = {
                    exact: constraints.deviceId
                };
            }
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    video: {
                        deviceId: constraintsDeviceId,
                        width: {
                            min: (constraints && constraints.minWidth) || 256,
                            max: (constraints && constraints.maxWidth) || 640
                        },
                        height: {
                            min: (constraints && constraints.minHeight) || 256,
                            max: (constraints && constraints.maxHeight) || 480
                        }
                    }
                }, function (stream) {
                    if (video.mozSrcObject !== undefined) {
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
        };
        return VideoTexture;
    }(LIB.Texture));
    LIB.VideoTexture = VideoTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.videoTexture.js.map
