

var LIB;
(function (LIB) {
    /**
     * This groups together the common properties used for image processing either in direct forward pass
     * or through post processing effect depending on the use of the image processing pipeline in your scene
     * or not.
     */
    var ImageProcessingConfiguration = /** @class */ (function () {
        function ImageProcessingConfiguration() {
            /**
             * Color curves setup used in the effect if colorCurvesEnabled is set to true
             */
            this.colorCurves = new LIB.ColorCurves();
            this._colorCurvesEnabled = false;
            this._colorGradingEnabled = false;
            this._colorGradingWithGreenDepth = true;
            this._colorGradingBGR = true;
            this._exposure = 1.0;
            this._toneMappingEnabled = false;
            this._contrast = 1.0;
            /**
             * Vignette stretch size.
             */
            this.vignetteStretch = 0;
            /**
             * Vignette centre X Offset.
             */
            this.vignetteCentreX = 0;
            /**
             * Vignette centre Y Offset.
             */
            this.vignetteCentreY = 0;
            /**
             * Vignette weight or intensity of the vignette effect.
             */
            this.vignetteWeight = 1.5;
            /**
             * Color of the vignette applied on the screen through the chosen blend mode (vignetteBlendMode)
             * if vignetteEnabled is set to true.
             */
            this.vignetteColor = new LIB.Color4(0, 0, 0, 0);
            /**
             * Camera field of view used by the Vignette effect.
             */
            this.vignetteCameraFov = 0.5;
            this._vignetteBlendMode = ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;
            this._vignetteEnabled = false;
            this._applyByPostProcess = false;
            this._isEnabled = true;
            /**
            * An event triggered when the configuration changes and requires Shader to Update some parameters.
            */
            this.onUpdateParameters = new LIB.Observable();
        }
        Object.defineProperty(ImageProcessingConfiguration.prototype, "colorCurvesEnabled", {
            /**
             * Gets wether the color curves effect is enabled.
             */
            get: function () {
                return this._colorCurvesEnabled;
            },
            /**
             * Sets wether the color curves effect is enabled.
             */
            set: function (value) {
                if (this._colorCurvesEnabled === value) {
                    return;
                }
                this._colorCurvesEnabled = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration.prototype, "colorGradingEnabled", {
            /**
             * Gets wether the color grading effect is enabled.
             */
            get: function () {
                return this._colorGradingEnabled;
            },
            /**
             * Sets wether the color grading effect is enabled.
             */
            set: function (value) {
                if (this._colorGradingEnabled === value) {
                    return;
                }
                this._colorGradingEnabled = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration.prototype, "colorGradingWithGreenDepth", {
            /**
             * Gets wether the color grading effect is using a green depth for the 3d Texture.
             */
            get: function () {
                return this._colorGradingWithGreenDepth;
            },
            /**
             * Sets wether the color grading effect is using a green depth for the 3d Texture.
             */
            set: function (value) {
                if (this._colorGradingWithGreenDepth === value) {
                    return;
                }
                this._colorGradingWithGreenDepth = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration.prototype, "colorGradingBGR", {
            /**
             * Gets wether the color grading texture contains BGR values.
             */
            get: function () {
                return this._colorGradingBGR;
            },
            /**
             * Sets wether the color grading texture contains BGR values.
             */
            set: function (value) {
                if (this._colorGradingBGR === value) {
                    return;
                }
                this._colorGradingBGR = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration.prototype, "exposure", {
            /**
             * Gets the Exposure used in the effect.
             */
            get: function () {
                return this._exposure;
            },
            /**
             * Sets the Exposure used in the effect.
             */
            set: function (value) {
                if (this._exposure === value) {
                    return;
                }
                this._exposure = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration.prototype, "toneMappingEnabled", {
            /**
             * Gets wether the tone mapping effect is enabled.
             */
            get: function () {
                return this._toneMappingEnabled;
            },
            /**
             * Sets wether the tone mapping effect is enabled.
             */
            set: function (value) {
                if (this._toneMappingEnabled === value) {
                    return;
                }
                this._toneMappingEnabled = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration.prototype, "contrast", {
            /**
             * Gets the contrast used in the effect.
             */
            get: function () {
                return this._contrast;
            },
            /**
             * Sets the contrast used in the effect.
             */
            set: function (value) {
                if (this._contrast === value) {
                    return;
                }
                this._contrast = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration.prototype, "vignetteBlendMode", {
            /**
             * Gets the vignette blend mode allowing different kind of effect.
             */
            get: function () {
                return this._vignetteBlendMode;
            },
            /**
             * Sets the vignette blend mode allowing different kind of effect.
             */
            set: function (value) {
                if (this._vignetteBlendMode === value) {
                    return;
                }
                this._vignetteBlendMode = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration.prototype, "vignetteEnabled", {
            /**
             * Gets wether the vignette effect is enabled.
             */
            get: function () {
                return this._vignetteEnabled;
            },
            /**
             * Sets wether the vignette effect is enabled.
             */
            set: function (value) {
                if (this._vignetteEnabled === value) {
                    return;
                }
                this._vignetteEnabled = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration.prototype, "applyByPostProcess", {
            /**
             * Gets wether the image processing is applied through a post process or not.
             */
            get: function () {
                return this._applyByPostProcess;
            },
            /**
             * Sets wether the image processing is applied through a post process or not.
             */
            set: function (value) {
                if (this._applyByPostProcess === value) {
                    return;
                }
                this._applyByPostProcess = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration.prototype, "isEnabled", {
            /**
             * Gets wether the image processing is enabled or not.
             */
            get: function () {
                return this._isEnabled;
            },
            /**
             * Sets wether the image processing is enabled or not.
             */
            set: function (value) {
                if (this._isEnabled === value) {
                    return;
                }
                this._isEnabled = value;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Method called each time the image processing information changes requires to recompile the effect.
         */
        ImageProcessingConfiguration.prototype._updateParameters = function () {
            this.onUpdateParameters.notifyObservers(this);
        };
        ImageProcessingConfiguration.prototype.getClassName = function () {
            return "ImageProcessingConfiguration";
        };
        /**
         * Prepare the list of uniforms associated with the Image Processing effects.
         * @param uniformsList The list of uniforms used in the effect
         * @param defines the list of defines currently in use
         */
        ImageProcessingConfiguration.PrepareUniforms = function (uniforms, defines) {
            if (defines.EXPOSURE) {
                uniforms.push("exposureLinear");
            }
            if (defines.CONTRAST) {
                uniforms.push("contrast");
            }
            if (defines.COLORGRADING) {
                uniforms.push("colorTransformSettings");
            }
            if (defines.VIGNETTE) {
                uniforms.push("vInverseScreenSize");
                uniforms.push("vignetteSettings1");
                uniforms.push("vignetteSettings2");
            }
            if (defines.COLORCURVES) {
                LIB.ColorCurves.PrepareUniforms(uniforms);
            }
        };
        /**
         * Prepare the list of samplers associated with the Image Processing effects.
         * @param uniformsList The list of uniforms used in the effect
         * @param defines the list of defines currently in use
         */
        ImageProcessingConfiguration.PrepareSamplers = function (samplersList, defines) {
            if (defines.COLORGRADING) {
                samplersList.push("txColorTransform");
            }
        };
        /**
         * Prepare the list of defines associated to the shader.
         * @param defines the list of defines to complete
         */
        ImageProcessingConfiguration.prototype.prepareDefines = function (defines, forPostProcess) {
            if (forPostProcess === void 0) { forPostProcess = false; }
            if (forPostProcess !== this.applyByPostProcess || !this._isEnabled) {
                defines.VIGNETTE = false;
                defines.TONEMAPPING = false;
                defines.CONTRAST = false;
                defines.EXPOSURE = false;
                defines.COLORCURVES = false;
                defines.COLORGRADING = false;
                defines.COLORGRADING3D = false;
                defines.IMAGEPROCESSING = false;
                defines.IMAGEPROCESSINGPOSTPROCESS = this.applyByPostProcess && this._isEnabled;
                return;
            }
            defines.VIGNETTE = this.vignetteEnabled;
            defines.VIGNETTEBLENDMODEMULTIPLY = (this.vignetteBlendMode === ImageProcessingConfiguration._VIGNETTEMODE_MULTIPLY);
            defines.VIGNETTEBLENDMODEOPAQUE = !defines.VIGNETTEBLENDMODEMULTIPLY;
            defines.TONEMAPPING = this.toneMappingEnabled;
            defines.CONTRAST = (this.contrast !== 1.0);
            defines.EXPOSURE = (this.exposure !== 1.0);
            defines.COLORCURVES = (this.colorCurvesEnabled && !!this.colorCurves);
            defines.COLORGRADING = (this.colorGradingEnabled && !!this.colorGradingTexture);
            if (defines.COLORGRADING) {
                defines.COLORGRADING3D = this.colorGradingTexture.is3D;
            }
            else {
                defines.COLORGRADING3D = false;
            }
            defines.SAMPLER3DGREENDEPTH = this.colorGradingWithGreenDepth;
            defines.SAMPLER3DBGRMAP = this.colorGradingBGR;
            defines.IMAGEPROCESSINGPOSTPROCESS = this.applyByPostProcess;
            defines.IMAGEPROCESSING = defines.VIGNETTE || defines.TONEMAPPING || defines.CONTRAST || defines.EXPOSURE || defines.COLORCURVES || defines.COLORGRADING;
        };
        /**
         * Returns true if all the image processing information are ready.
         */
        ImageProcessingConfiguration.prototype.isReady = function () {
            // Color Grading texure can not be none blocking.
            return !this.colorGradingEnabled || !this.colorGradingTexture || this.colorGradingTexture.isReady();
        };
        /**
         * Binds the image processing to the shader.
         * @param effect The effect to bind to
         */
        ImageProcessingConfiguration.prototype.bind = function (effect, aspectRatio) {
            if (aspectRatio === void 0) { aspectRatio = 1; }
            // Color Curves
            if (this._colorCurvesEnabled && this.colorCurves) {
                LIB.ColorCurves.Bind(this.colorCurves, effect);
            }
            // Vignette
            if (this._vignetteEnabled) {
                var inverseWidth = 1 / effect.getEngine().getRenderWidth();
                var inverseHeight = 1 / effect.getEngine().getRenderHeight();
                effect.setFloat2("vInverseScreenSize", inverseWidth, inverseHeight);
                var vignetteScaleY = Math.tan(this.vignetteCameraFov * 0.5);
                var vignetteScaleX = vignetteScaleY * aspectRatio;
                var vignetteScaleGeometricMean = Math.sqrt(vignetteScaleX * vignetteScaleY);
                vignetteScaleX = LIB.Tools.Mix(vignetteScaleX, vignetteScaleGeometricMean, this.vignetteStretch);
                vignetteScaleY = LIB.Tools.Mix(vignetteScaleY, vignetteScaleGeometricMean, this.vignetteStretch);
                effect.setFloat4("vignetteSettings1", vignetteScaleX, vignetteScaleY, -vignetteScaleX * this.vignetteCentreX, -vignetteScaleY * this.vignetteCentreY);
                var vignettePower = -2.0 * this.vignetteWeight;
                effect.setFloat4("vignetteSettings2", this.vignetteColor.r, this.vignetteColor.g, this.vignetteColor.b, vignettePower);
            }
            // Exposure
            effect.setFloat("exposureLinear", this.exposure);
            // Contrast
            effect.setFloat("contrast", this.contrast);
            // Color transform settings
            if (this.colorGradingTexture) {
                effect.setTexture("txColorTransform", this.colorGradingTexture);
                var textureSize = this.colorGradingTexture.getSize().height;
                effect.setFloat4("colorTransformSettings", (textureSize - 1) / textureSize, // textureScale
                0.5 / textureSize, // textureOffset
                textureSize, // textureSize
                this.colorGradingTexture.level // weight
                );
            }
        };
        /**
         * Clones the current image processing instance.
         * @return The cloned image processing
         */
        ImageProcessingConfiguration.prototype.clone = function () {
            return LIB.SerializationHelper.Clone(function () { return new ImageProcessingConfiguration(); }, this);
        };
        /**
         * Serializes the current image processing instance to a json representation.
         * @return a JSON representation
         */
        ImageProcessingConfiguration.prototype.serialize = function () {
            return LIB.SerializationHelper.Serialize(this);
        };
        /**
         * Parses the image processing from a json representation.
         * @param source the JSON source to parse
         * @return The parsed image processing
         */
        ImageProcessingConfiguration.Parse = function (source) {
            return LIB.SerializationHelper.Parse(function () { return new ImageProcessingConfiguration(); }, source, null, null);
        };
        Object.defineProperty(ImageProcessingConfiguration, "VIGNETTEMODE_MULTIPLY", {
            /**
             * Used to apply the vignette as a mix with the pixel color.
             */
            get: function () {
                return this._VIGNETTEMODE_MULTIPLY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageProcessingConfiguration, "VIGNETTEMODE_OPAQUE", {
            /**
             * Used to apply the vignette as a replacement of the pixel color.
             */
            get: function () {
                return this._VIGNETTEMODE_OPAQUE;
            },
            enumerable: true,
            configurable: true
        });
        // Static constants associated to the image processing.
        ImageProcessingConfiguration._VIGNETTEMODE_MULTIPLY = 0;
        ImageProcessingConfiguration._VIGNETTEMODE_OPAQUE = 1;
        __decorate([
            LIB.serializeAsColorCurves()
        ], ImageProcessingConfiguration.prototype, "colorCurves", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_colorCurvesEnabled", void 0);
        __decorate([
            LIB.serializeAsTexture()
        ], ImageProcessingConfiguration.prototype, "colorGradingTexture", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_colorGradingEnabled", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_colorGradingWithGreenDepth", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_colorGradingBGR", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_exposure", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_toneMappingEnabled", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_contrast", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "vignetteStretch", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "vignetteCentreX", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "vignetteCentreY", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "vignetteWeight", void 0);
        __decorate([
            LIB.serializeAsColor4()
        ], ImageProcessingConfiguration.prototype, "vignetteColor", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "vignetteCameraFov", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_vignetteBlendMode", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_vignetteEnabled", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_applyByPostProcess", void 0);
        __decorate([
            LIB.serialize()
        ], ImageProcessingConfiguration.prototype, "_isEnabled", void 0);
        return ImageProcessingConfiguration;
    }());
    LIB.ImageProcessingConfiguration = ImageProcessingConfiguration;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.imageProcessingConfiguration.js.map
//# sourceMappingURL=LIB.imageProcessingConfiguration.js.map