(function (LIB) {
    var DynamicTexture = /** @class */ (function (_super) {
        __extends(DynamicTexture, _super);
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
                if (options.width) {
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
        DynamicTexture.prototype.scale = function (ratio) {
            var textureSize = this.getSize();
            textureSize.width *= ratio;
            textureSize.height *= ratio;
            this._recreate(textureSize);
        };
        DynamicTexture.prototype.scaleTo = function (width, height) {
            var textureSize = this.getSize();
            textureSize.width = width;
            textureSize.height = height;
            this._recreate(textureSize);
        };
        DynamicTexture.prototype.getContext = function () {
            return this._context;
        };
        DynamicTexture.prototype.clear = function () {
            var size = this.getSize();
            this._context.fillRect(0, 0, size.width, size.height);
        };
        DynamicTexture.prototype.update = function (invertY) {
            this._engine.updateDynamicTexture(this._texture, this._canvas, invertY === undefined ? true : invertY, undefined, this._format || undefined);
        };
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
                ;
                y = (size.height / 2) + (fontSize / 3.65);
            }
            this._context.fillStyle = color;
            this._context.fillText(text, x, y);
            if (update) {
                this.update(invertY);
            }
        };
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
        DynamicTexture.prototype._rebuild = function () {
            this.update();
        };
        return DynamicTexture;
    }(LIB.Texture));
    LIB.DynamicTexture = DynamicTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.dynamicTexture.js.map
