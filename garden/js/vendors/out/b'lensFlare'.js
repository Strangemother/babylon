
var LIB;
(function (LIB) {
    var LensFlare = /** @class */ (function () {
        function LensFlare(size, position, color, imgUrl, system) {
            this.size = size;
            this.position = position;
            this.alphaMode = LIB.Engine.ALPHA_ONEONE;
            this.color = color || new LIB.Color3(1, 1, 1);
            this.texture = imgUrl ? new LIB.Texture(imgUrl, system.getScene(), true) : null;
            this._system = system;
            system.lensFlares.push(this);
        }
        LensFlare.AddFlare = function (size, position, color, imgUrl, system) {
            return new LensFlare(size, position, color, imgUrl, system);
        };
        LensFlare.prototype.dispose = function () {
            if (this.texture) {
                this.texture.dispose();
            }
            // Remove from scene
            var index = this._system.lensFlares.indexOf(this);
            this._system.lensFlares.splice(index, 1);
        };
        ;
        return LensFlare;
    }());
    LIB.LensFlare = LensFlare;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.lensFlare.js.map
//# sourceMappingURL=LIB.lensFlare.js.map