var BABYLON;
(function (BABYLON) {
    var LensFlare = /** @class */ (function () {
        function LensFlare(size, position, color, imgUrl, system) {
            this.size = size;
            this.position = position;
            this.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
            this.color = color || new BABYLON.Color3(1, 1, 1);
            this.texture = imgUrl ? new BABYLON.Texture(imgUrl, system.getScene(), true) : null;
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
    BABYLON.LensFlare = LensFlare;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.lensFlare.js.map
