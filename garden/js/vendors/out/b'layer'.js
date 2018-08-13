
var LIB;
(function (LIB) {
    var Layer = /** @class */ (function () {
        function Layer(name, imgUrl, scene, isBackground, color) {
            this.name = name;
            this.scale = new LIB.Vector2(1, 1);
            this.offset = new LIB.Vector2(0, 0);
            this.alphaBlendingMode = LIB.Engine.ALPHA_COMBINE;
            this.layerMask = 0x0FFFFFFF;
            this._vertexBuffers = {};
            // Events
            /**
            * An event triggered when the layer is disposed.
            */
            this.onDisposeObservable = new LIB.Observable();
            /**
            * An event triggered before rendering the scene
            */
            this.onBeforeRenderObservable = new LIB.Observable();
            /**
            * An event triggered after rendering the scene
            */
            this.onAfterRenderObservable = new LIB.Observable();
            this.texture = imgUrl ? new LIB.Texture(imgUrl, scene, true) : null;
            this.isBackground = isBackground === undefined ? true : isBackground;
            this.color = color === undefined ? new LIB.Color4(1, 1, 1, 1) : color;
            this._scene = (scene || LIB.Engine.LastCreatedScene);
            this._scene.layers.push(this);
            var engine = this._scene.getEngine();
            // VBO
            var vertices = [];
            vertices.push(1, 1);
            vertices.push(-1, 1);
            vertices.push(-1, -1);
            vertices.push(1, -1);
            var vertexBuffer = new LIB.VertexBuffer(engine, vertices, LIB.VertexBuffer.PositionKind, false, false, 2);
            this._vertexBuffers[LIB.VertexBuffer.PositionKind] = vertexBuffer;
            this._createIndexBuffer();
            // Effects
            this._effect = engine.createEffect("layer", [LIB.VertexBuffer.PositionKind], ["textureMatrix", "color", "scale", "offset"], ["textureSampler"], "");
            this._alphaTestEffect = engine.createEffect("layer", [LIB.VertexBuffer.PositionKind], ["textureMatrix", "color", "scale", "offset"], ["textureSampler"], "#define ALPHATEST");
        }
        Object.defineProperty(Layer.prototype, "onDispose", {
            set: function (callback) {
                if (this._onDisposeObserver) {
                    this.onDisposeObservable.remove(this._onDisposeObserver);
                }
                this._onDisposeObserver = this.onDisposeObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layer.prototype, "onBeforeRender", {
            set: function (callback) {
                if (this._onBeforeRenderObserver) {
                    this.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
                }
                this._onBeforeRenderObserver = this.onBeforeRenderObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layer.prototype, "onAfterRender", {
            set: function (callback) {
                if (this._onAfterRenderObserver) {
                    this.onAfterRenderObservable.remove(this._onAfterRenderObserver);
                }
                this._onAfterRenderObserver = this.onAfterRenderObservable.add(callback);
            },
            enumerable: true,
            configurable: true
        });
        Layer.prototype._createIndexBuffer = function () {
            var engine = this._scene.getEngine();
            // Indices
            var indices = [];
            indices.push(0);
            indices.push(1);
            indices.push(2);
            indices.push(0);
            indices.push(2);
            indices.push(3);
            this._indexBuffer = engine.createIndexBuffer(indices);
        };
        Layer.prototype._rebuild = function () {
            var vb = this._vertexBuffers[LIB.VertexBuffer.PositionKind];
            if (vb) {
                vb._rebuild();
            }
            this._createIndexBuffer();
        };
        Layer.prototype.render = function () {
            var currentEffect = this.alphaTest ? this._alphaTestEffect : this._effect;
            // Check
            if (!currentEffect.isReady() || !this.texture || !this.texture.isReady())
                return;
            var engine = this._scene.getEngine();
            this.onBeforeRenderObservable.notifyObservers(this);
            // Render
            engine.enableEffect(currentEffect);
            engine.setState(false);
            // Texture
            currentEffect.setTexture("textureSampler", this.texture);
            currentEffect.setMatrix("textureMatrix", this.texture.getTextureMatrix());
            // Color
            currentEffect.setFloat4("color", this.color.r, this.color.g, this.color.b, this.color.a);
            // Scale / offset
            currentEffect.setVector2("offset", this.offset);
            currentEffect.setVector2("scale", this.scale);
            // VBOs
            engine.bindBuffers(this._vertexBuffers, this._indexBuffer, currentEffect);
            // Draw order
            if (!this.alphaTest) {
                engine.setAlphaMode(this.alphaBlendingMode);
                engine.drawElementsType(LIB.Material.TriangleFillMode, 0, 6);
                engine.setAlphaMode(LIB.Engine.ALPHA_DISABLE);
            }
            else {
                engine.drawElementsType(LIB.Material.TriangleFillMode, 0, 6);
            }
            this.onAfterRenderObservable.notifyObservers(this);
        };
        Layer.prototype.dispose = function () {
            var vertexBuffer = this._vertexBuffers[LIB.VertexBuffer.PositionKind];
            if (vertexBuffer) {
                vertexBuffer.dispose();
                this._vertexBuffers[LIB.VertexBuffer.PositionKind] = null;
            }
            if (this._indexBuffer) {
                this._scene.getEngine()._releaseBuffer(this._indexBuffer);
                this._indexBuffer = null;
            }
            if (this.texture) {
                this.texture.dispose();
                this.texture = null;
            }
            // Remove from scene
            var index = this._scene.layers.indexOf(this);
            this._scene.layers.splice(index, 1);
            // Callback
            this.onDisposeObservable.notifyObservers(this);
            this.onDisposeObservable.clear();
            this.onAfterRenderObservable.clear();
            this.onBeforeRenderObservable.clear();
        };
        return Layer;
    }());
    LIB.Layer = Layer;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.layer.js.map
//# sourceMappingURL=LIB.layer.js.map
