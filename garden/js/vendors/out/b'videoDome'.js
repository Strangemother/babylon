

var LIB;
(function (LIB) {
    /**
     * Display a 360 degree video on an approximately spherical surface, useful for VR applications or skyboxes.
     * As a subclass of Node, this allow parenting to the camera or multiple videos with different locations in the scene.
     * This class achieves its effect with a VideoTexture and a correctly configured BackgroundMaterial on an inverted sphere.
     * Potential additions to this helper include zoom and and non-infinite distance rendering effects.
     */
    var VideoDome = /** @class */ (function (_super) {
        __extends(VideoDome, _super);
        /**
         * Create an instance of this class and pass through the parameters to the relevant classes, VideoTexture, StandardMaterial, and Mesh.
         * @param name Element's name, child elements will append suffixes for their own names.
         * @param urlsOrVideo
         * @param options An object containing optional or exposed sub element properties:
         * @param options **resolution=12** Integer, lower resolutions have more artifacts at extreme fovs
         * @param options **clickToPlay=false** Add a click to play listener to the video, does not prevent autoplay.
         * @param options **autoPlay=true** Automatically attempt to being playing the video.
         * @param options **loop=true** Automatically loop video on end.
         * @param options **size=1000** Physical radius to create the dome at, defaults to approximately half the far clip plane.
         */
        function VideoDome(name, urlsOrVideo, options, scene) {
            var _this = _super.call(this, name, scene) || this;
            // set defaults and manage values
            name = name || "videoDome";
            options.resolution = (Math.abs(options.resolution) | 0) || 12;
            options.clickToPlay = Boolean(options.clickToPlay);
            options.autoPlay = options.autoPlay === undefined ? true : Boolean(options.autoPlay);
            options.loop = options.loop === undefined ? true : Boolean(options.loop);
            options.size = Math.abs(options.size) || (scene.activeCamera ? scene.activeCamera.maxZ * 0.48 : 1000);
            // create
            var tempOptions = { loop: options.loop, autoPlay: options.autoPlay, autoUpdateTexture: true };
            var material = _this._material = new LIB.BackgroundMaterial(name + "_material", scene);
            var texture = _this._videoTexture = new LIB.VideoTexture(name + "_texture", urlsOrVideo, scene, false, false, LIB.Texture.TRILINEAR_SAMPLINGMODE, tempOptions);
            _this._mesh = LIB.MeshBuilder.CreateIcoSphere(name + "_mesh", {
                flat: false,
                radius: options.size,
                subdivisions: options.resolution,
                sideOrientation: LIB.Mesh.BACKSIDE // needs to be inside out
            }, scene);
            // configure material
            texture.coordinatesMode = LIB.Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE; // matches orientation
            texture.wrapV = LIB.Texture.CLAMP_ADDRESSMODE; // always clamp the up/down
            material.reflectionTexture = _this._videoTexture;
            material.useEquirectangularFOV = true;
            material.fovMultiplier = 1.0;
            // configure mesh
            _this._mesh.material = material;
            _this._mesh.parent = _this;
            // optional configuration
            if (options.clickToPlay) {
                scene.onPointerUp = function () {
                    _this._videoTexture.video.play();
                };
            }
            return _this;
        }
        Object.defineProperty(VideoDome.prototype, "fovMultiplier", {
            /**
             * The current fov(field of view) multiplier, 0.0 - 2.0. Defaults to 1.0. Lower values "zoom in" and higher values "zoom out".
             * Also see the options.resolution property.
             */
            get: function () {
                return this._material.fovMultiplier;
            },
            set: function (value) {
                this._material.fovMultiplier = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Releases resources associated with this node.
         * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
         * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
         */
        VideoDome.prototype.dispose = function (doNotRecurse, disposeMaterialAndTextures) {
            if (disposeMaterialAndTextures === void 0) { disposeMaterialAndTextures = false; }
            this._videoTexture.dispose();
            this._mesh.dispose();
            this._material.dispose();
            _super.prototype.dispose.call(this, doNotRecurse, disposeMaterialAndTextures);
        };
        return VideoDome;
    }(LIB.Node));
    LIB.VideoDome = VideoDome;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.videoDome.js.map
//# sourceMappingURL=LIB.videoDome.js.map
