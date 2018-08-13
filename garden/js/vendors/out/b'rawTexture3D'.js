

var LIB;
(function (LIB) {
    /**
     * Class used to store 3D textures containing user data
     */
    var RawTexture3D = /** @class */ (function (_super) {
        __extends(RawTexture3D, _super);
        /**
         * Create a new RawTexture3D
         * @param data defines the data of the texture
         * @param width defines the width of the texture
         * @param height defines the height of the texture
         * @param depth defines the depth of the texture
         * @param format defines the texture format to use
         * @param scene defines the hosting scene
         * @param generateMipMaps defines a boolean indicating if mip levels should be generated (true by default)
         * @param invertY defines if texture must be stored with Y axis inverted
         * @param samplingMode defines the sampling mode to use (LIB.Texture.TRILINEAR_SAMPLINGMODE by default)
         */
        function RawTexture3D(data, width, height, depth, 
        /** Gets or sets the texture format to use*/
        format, scene, generateMipMaps, invertY, samplingMode) {
            if (generateMipMaps === void 0) { generateMipMaps = true; }
            if (invertY === void 0) { invertY = false; }
            if (samplingMode === void 0) { samplingMode = LIB.Texture.TRILINEAR_SAMPLINGMODE; }
            var _this = _super.call(this, null, scene, !generateMipMaps, invertY) || this;
            _this.format = format;
            _this._engine = scene.getEngine();
            _this._texture = scene.getEngine().createRawTexture3D(data, width, height, depth, format, generateMipMaps, invertY, samplingMode);
            _this.is3D = true;
            return _this;
        }
        /**
         * Update the texture with new data
         * @param data defines the data to store in the texture
         */
        RawTexture3D.prototype.update = function (data) {
            if (!this._texture) {
                return;
            }
            this._engine.updateRawTexture3D(this._texture, data, this._texture.format, this._texture.invertY);
        };
        return RawTexture3D;
    }(LIB.Texture));
    LIB.RawTexture3D = RawTexture3D;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.rawTexture3D.js.map
//# sourceMappingURL=LIB.rawTexture3D.js.map
