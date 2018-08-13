
var LIB;
(function (LIB) {
    var BoundingBoxRenderer = /** @class */ (function () {
        function BoundingBoxRenderer(scene) {
            this.frontColor = new LIB.Color3(1, 1, 1);
            this.backColor = new LIB.Color3(0.1, 0.1, 0.1);
            this.showBackLines = true;
            this.renderList = new LIB.SmartArray(32);
            this._vertexBuffers = {};
            this._scene = scene;
        }
        BoundingBoxRenderer.prototype._prepareRessources = function () {
            if (this._colorShader) {
                return;
            }
            this._colorShader = new LIB.ShaderMaterial("colorShader", this._scene, "color", {
                attributes: [LIB.VertexBuffer.PositionKind],
                uniforms: ["world", "viewProjection", "color"]
            });
            var engine = this._scene.getEngine();
            var boxdata = LIB.VertexData.CreateCube({ size: 1.0 });
            this._vertexBuffers[LIB.VertexBuffer.PositionKind] = new LIB.VertexBuffer(engine, boxdata.positions, LIB.VertexBuffer.PositionKind, false);
            this._createIndexBuffer();
        };
        BoundingBoxRenderer.prototype._createIndexBuffer = function () {
            var engine = this._scene.getEngine();
            this._indexBuffer = engine.createIndexBuffer([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 7, 1, 6, 2, 5, 3, 4]);
        };
        BoundingBoxRenderer.prototype._rebuild = function () {
            var vb = this._vertexBuffers[LIB.VertexBuffer.PositionKind];
            if (vb) {
                vb._rebuild();
            }
            this._createIndexBuffer();
        };
        BoundingBoxRenderer.prototype.reset = function () {
            this.renderList.reset();
        };
        BoundingBoxRenderer.prototype.render = function () {
            if (this.renderList.length === 0) {
                return;
            }
            this._prepareRessources();
            if (!this._colorShader.isReady()) {
                return;
            }
            var engine = this._scene.getEngine();
            engine.setDepthWrite(false);
            this._colorShader._preBind();
            for (var boundingBoxIndex = 0; boundingBoxIndex < this.renderList.length; boundingBoxIndex++) {
                var boundingBox = this.renderList.data[boundingBoxIndex];
                var min = boundingBox.minimum;
                var max = boundingBox.maximum;
                var diff = max.subtract(min);
                var median = min.add(diff.scale(0.5));
                var worldMatrix = LIB.Matrix.Scaling(diff.x, diff.y, diff.z)
                    .multiply(LIB.Matrix.Translation(median.x, median.y, median.z))
                    .multiply(boundingBox.getWorldMatrix());
                // VBOs
                engine.bindBuffers(this._vertexBuffers, this._indexBuffer, this._colorShader.getEffect());
                if (this.showBackLines) {
                    // Back
                    engine.setDepthFunctionToGreaterOrEqual();
                    this._scene.resetCachedMaterial();
                    this._colorShader.setColor4("color", this.backColor.toColor4());
                    this._colorShader.bind(worldMatrix);
                    // Draw order
                    engine.drawElementsType(LIB.Material.LineListDrawMode, 0, 24);
                }
                // Front
                engine.setDepthFunctionToLess();
                this._scene.resetCachedMaterial();
                this._colorShader.setColor4("color", this.frontColor.toColor4());
                this._colorShader.bind(worldMatrix);
                // Draw order
                engine.drawElementsType(LIB.Material.LineListDrawMode, 0, 24);
            }
            this._colorShader.unbind();
            engine.setDepthFunctionToLessOrEqual();
            engine.setDepthWrite(true);
        };
        BoundingBoxRenderer.prototype.renderOcclusionBoundingBox = function (mesh) {
            this._prepareRessources();
            if (!this._colorShader.isReady() || !mesh._boundingInfo) {
                return;
            }
            var engine = this._scene.getEngine();
            engine.setDepthWrite(false);
            engine.setColorWrite(false);
            this._colorShader._preBind();
            var boundingBox = mesh._boundingInfo.boundingBox;
            var min = boundingBox.minimum;
            var max = boundingBox.maximum;
            var diff = max.subtract(min);
            var median = min.add(diff.scale(0.5));
            var worldMatrix = LIB.Matrix.Scaling(diff.x, diff.y, diff.z)
                .multiply(LIB.Matrix.Translation(median.x, median.y, median.z))
                .multiply(boundingBox.getWorldMatrix());
            engine.bindBuffers(this._vertexBuffers, this._indexBuffer, this._colorShader.getEffect());
            engine.setDepthFunctionToLess();
            this._scene.resetCachedMaterial();
            this._colorShader.bind(worldMatrix);
            engine.drawElementsType(LIB.Material.LineListDrawMode, 0, 24);
            this._colorShader.unbind();
            engine.setDepthFunctionToLessOrEqual();
            engine.setDepthWrite(true);
            engine.setColorWrite(true);
        };
        BoundingBoxRenderer.prototype.dispose = function () {
            if (!this._colorShader) {
                return;
            }
            this.renderList.dispose();
            this._colorShader.dispose();
            var buffer = this._vertexBuffers[LIB.VertexBuffer.PositionKind];
            if (buffer) {
                buffer.dispose();
                this._vertexBuffers[LIB.VertexBuffer.PositionKind] = null;
            }
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
        };
        return BoundingBoxRenderer;
    }());
    LIB.BoundingBoxRenderer = BoundingBoxRenderer;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.boundingBoxRenderer.js.map
//# sourceMappingURL=LIB.boundingBoxRenderer.js.map
