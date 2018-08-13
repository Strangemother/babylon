

var LIB;
(function (LIB) {
    var RawTexture = /** @class */ (function (_super) {
        __extends(RawTexture, _super);
        function RawTexture(data, width, height, format, scene, generateMipMaps, invertY, samplingMode, type) {
            if (generateMipMaps === void 0) { generateMipMaps = true; }
            if (invertY === void 0) { invertY = false; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            if (type === void 0) { type = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            var _this = _super.call(this, null, scene, !generateMipMaps, invertY) || this;
            _this.format = format;
            _this._engine = scene.getEngine();
            _this._texture = scene.getEngine().createRawTexture(data, width, height, format, generateMipMaps, invertY, samplingMode, null, type);
            _this.wrapU = LIB.Texture.CLAMP_ADDRESSMODE;
            _this.wrapV = LIB.Texture.CLAMP_ADDRESSMODE;
            return _this;
        }
        RawTexture.prototype.update = function (data) {
            this._engine.updateRawTexture(this._texture, data, this._texture.format, this._texture.invertY, undefined, this._texture.type);
        };
        // Statics
        RawTexture.CreateLuminanceTexture = function (data, width, height, scene, generateMipMaps, invertY, samplingMode) {
            if (generateMipMaps === void 0) { generateMipMaps = true; }
            if (invertY === void 0) { invertY = false; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            return new RawTexture(data, width, height, LIB.Engine.TEXTUREFORMAT_LUMINANCE, scene, generateMipMaps, invertY, samplingMode);
        };
        RawTexture.CreateLuminanceAlphaTexture = function (data, width, height, scene, generateMipMaps, invertY, samplingMode) {
            if (generateMipMaps === void 0) { generateMipMaps = true; }
            if (invertY === void 0) { invertY = false; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            return new RawTexture(data, width, height, LIB.Engine.TEXTUREFORMAT_LUMINANCE_ALPHA, scene, generateMipMaps, invertY, samplingMode);
        };
        RawTexture.CreateAlphaTexture = function (data, width, height, scene, generateMipMaps, invertY, samplingMode) {
            if (generateMipMaps === void 0) { generateMipMaps = true; }
            if (invertY === void 0) { invertY = false; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            return new RawTexture(data, width, height, LIB.Engine.TEXTUREFORMAT_ALPHA, scene, generateMipMaps, invertY, samplingMode);
        };
        RawTexture.CreateRGBTexture = function (data, width, height, scene, generateMipMaps, invertY, samplingMode, type) {
            if (generateMipMaps === void 0) { generateMipMaps = true; }
            if (invertY === void 0) { invertY = false; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            if (type === void 0) { type = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            return new RawTexture(data, width, height, LIB.Engine.TEXTUREFORMAT_RGB, scene, generateMipMaps, invertY, samplingMode, type);
        };
        RawTexture.CreateRGBATexture = function (data, width, height, scene, generateMipMaps, invertY, samplingMode, type) {
            if (generateMipMaps === void 0) { generateMipMaps = true; }
            if (invertY === void 0) { invertY = false; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            if (type === void 0) { type = LIB.Engine.TEXTURETYPE_UNSIGNED_INT; }
            return new RawTexture(data, width, height, LIB.Engine.TEXTUREFORMAT_RGBA, scene, generateMipMaps, invertY, samplingMode, type);
        };
        return RawTexture;
    }(LIB.Texture));
    LIB.RawTexture = RawTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.rawTexture.js.map
//# sourceMappingURL=LIB.rawTexture.js.map
