

var LIB;
(function (LIB) {
    /**
     * A class extending {LIB.Texture} allowing drawing on a texture
     * @see http://doc.LIBjs.com/how_to/dynamictexture
     */
    var DynamicTexture = /** @class */ (function (_super) {
        __extends(DynamicTexture, _super);
        /**
         * Creates a {LIB.DynamicTexture}
         * @param name defines the name of the texture
         * @param options provides 3 alternatives for width and height of texture, a canvas, object with width and height properties, number for both width and height
         * @param scene defines the scene where you want the texture
         * @param generateMipMaps defines the use of MinMaps or not (default is false)
         * @param samplingMode defines the sampling mode to use (default is LIB.Texture.TRILINEAR_SAMPLINGMODE)
         * @param format defines the texture format to use (default is LIB.Engine.TEXTUREFORMAT_RGBA)
         */
        function DynamicTexture(name, options, scene, generateMipMaps, samplingMode, format) {
            if (scene === void 0) { scene = null; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            if (format === void 0) { format = LIB.Engine.TEXTUREFORMAT_RGBA; }
            var _this = _super.call(this, null, scene, !generateMipMaps, undefined, samplingMode, undefined, undefined, undefined, undefined, format) || this;
            _this.name = name;
            _this._engine = _this.getScene().getEngine();
            _this.wrapU = LIB.Texture.CLAMP_ADDRESSMODE;
            _this.wrapV = LIB.Texture.CLAMP_ADDRESSMODE;
            _this._generateMipMaps = generateMipMaps;
            if (options.getContext) {
                _this._canvas = options;
                _this._texture = _this._engine.createDynamicTexture(options.width, options.height, generateMipMaps, samplingMode);
            }
            else {
                _this._canvas = document.createElement("canvas");
                if (options.width || options.width === 0) {
                    _this._texture = _this._engine.createDynamicTexture(options.width, options.height, generateMipMaps, samplingMode);
                }
                else {
                    _this._texture = _this._engine.createDynamicTexture(options, options, generateMipMaps, samplingMode);
                }
            }
            var textureSize = _this.getSize();
            _this._canvas.width = textureSize.width;
            _this._canvas.height = textureSize.height;
            _this._context = _this._canvas.getContext("2d");
            return _this;
        }
        Object.defineProperty(DynamicTexture.prototype, "canRescale", {
            /**
             * Gets the current state of canRescale
             */
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        DynamicTexture.prototype._recreate = function (textureSize) {
            this._canvas.width = textureSize.width;
            this._canvas.height = textureSize.height;
            this.releaseInternalTexture();
            this._texture = this._engine.createDynamicTexture(textureSize.width, textureSize.height, this._generateMipMaps, this._samplingMode);
        };
        /**
         * Scales the texture
         * @param ratio the scale factor to apply to both width and height
         */
        DynamicTexture.prototype.scale = function (ratio) {
            var textureSize = this.getSize();
            textureSize.width *= ratio;
            textureSize.height *= ratio;
            this._recreate(textureSize);
        };
        /**
         * Resizes the texture
         * @param width the new width
         * @param height the new height
         */
        DynamicTexture.prototype.scaleTo = function (width, height) {
            var textureSize = this.getSize();
            textureSize.width = width;
            textureSize.height = height;
            this._recreate(textureSize);
        };
        /**
         * Gets the context of the canvas used by the texture
         * @returns the canvas context of the dynamic texture
         */
        DynamicTexture.prototype.getContext = function () {
            return this._context;
        };
        /**
         * Clears the texture
         */
        DynamicTexture.prototype.clear = function () {
            var size = this.getSize();
            this._context.fillRect(0, 0, size.width, size.height);
        };
        /**
         * Updates the texture
         * @param invertY defines the direction for the Y axis (default is true - y increases downwards)
         */
        DynamicTexture.prototype.update = function (invertY) {
            this._engine.updateDynamicTexture(this._texture, this._canvas, invertY === undefined ? true : invertY, undefined, this._format || undefined);
        };
        /**
         * Draws text onto the texture
         * @param text defines the text to be drawn
         * @param x defines the placement of the text from the left
         * @param y defines the placement of the text from the top when invertY is true and from the bottom when false
         * @param font defines the font to be used with font-style, font-size, font-name
         * @param color defines the color used for the text
         * @param clearColor defines the color for the canvas, use null to not overwrite canvas
         * @param invertY defines the direction for the Y axis (default is true - y increases downwards)
         * @param update defines whether texture is immediately update (default is true)
         */
        DynamicTexture.prototype.drawText = function (text, x, y, font, color, clearColor, invertY, update) {
            if (update === void 0) { update = true; }
            var size = this.getSize();
            if (clearColor) {
                this._context.fillStyle = clearColor;
                this._context.fillRect(0, 0, size.width, size.height);
            }
            this._context.font = font;
            if (x === null || x === undefined) {
                var textSize = this._context.measureText(text);
                x = (size.width - textSize.width) / 2;
            }
            if (y === null || y === undefined) {
                var fontSize = parseInt((font.replace(/\D/g, '')));
                y = (size.height / 2) + (fontSize / 3.65);
            }
            this._context.fillStyle = color;
            this._context.fillText(text, x, y);
            if (update) {
                this.update(invertY);
            }
        };
        /**
         * Clones the texture
         * @returns the clone of the texture.
         */
        DynamicTexture.prototype.clone = function () {
            var scene = this.getScene();
            if (!scene) {
                return this;
            }
            var textureSize = this.getSize();
            var newTexture = new DynamicTexture(this.name, textureSize, scene, this._generateMipMaps);
            // Base texture
            newTexture.hasAlpha = this.hasAlpha;
            newTexture.level = this.level;
            // Dynamic Texture
            newTexture.wrapU = this.wrapU;
            newTexture.wrapV = this.wrapV;
            return newTexture;
        };
        /** @hidden */
        DynamicTexture.prototype._rebuild = function () {
            this.update();
        };
        return DynamicTexture;
    }(LIB.Texture));
    LIB.DynamicTexture = DynamicTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.dynamicTexture.js.map
//# sourceMappingURL=LIB.dynamicTexture.js.map