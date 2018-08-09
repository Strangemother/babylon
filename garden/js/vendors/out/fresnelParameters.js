var BABYLON;
(function (BABYLON) {
    var FresnelParameters = /** @class */ (function () {
        function FresnelParameters() {
            this._isEnabled = true;
            this.leftColor = BABYLON.Color3.White();
            this.rightColor = BABYLON.Color3.Black();
            this.bias = 0;
            this.power = 1;
        }
        Object.defineProperty(FresnelParameters.prototype, "isEnabled", {
            get: function () {
                return this._isEnabled;
            },
            set: function (value) {
                if (this._isEnabled === value) {
                    return;
                }
                this._isEnabled = value;
                BABYLON.Engine.MarkAllMaterialsAsDirty(BABYLON.Material.FresnelDirtyFlag);
            },
            enumerable: true,
            configurable: true
        });
        FresnelParameters.prototype.clone = function () {
            var newFresnelParameters = new FresnelParameters();
            BABYLON.Tools.DeepCopy(this, newFresnelParameters);
            return newFresnelParameters;
        };
        FresnelParameters.prototype.serialize = function () {
            var serializationObject = {};
            serializationObject.isEnabled = this.isEnabled;
            serializationObject.leftColor = this.leftColor;
            serializationObject.rightColor = this.rightColor;
            serializationObject.bias = this.bias;
            serializationObject.power = this.power;
            return serializationObject;
        };
        FresnelParameters.Parse = function (parsedFresnelParameters) {
            var fresnelParameters = new FresnelParameters();
            fresnelParameters.isEnabled = parsedFresnelParameters.isEnabled;
            fresnelParameters.leftColor = BABYLON.Color3.FromArray(parsedFresnelParameters.leftColor);
            fresnelParameters.rightColor = BABYLON.Color3.FromArray(parsedFresnelParameters.rightColor);
            fresnelParameters.bias = parsedFresnelParameters.bias;
            fresnelParameters.power = parsedFresnelParameters.power || 1.0;
            return fresnelParameters;
        };
        return FresnelParameters;
    }());
    BABYLON.FresnelParameters = FresnelParameters;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.fresnelParameters.js.map
