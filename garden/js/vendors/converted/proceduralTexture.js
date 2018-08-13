

var LIB;
(function (LIB) {
    var ProceduralTexture = /** @class */ (function (_super) {
        __extends(ProceduralTexture, _super);
        function ProceduralTexture(name, size, fragment, scene, fallbackTexture, generateMipMaps, isCube) {
            if (fallbackTexture === void 0) { fallbackTexture = null; }
            if (generateMipMaps === void 0) { generateMipMaps = true; }
            if (isCube === void 0) { isCube = false; }
            var _this = _super.call(this, null, scene, !generateMipMaps) || this;
            _this.isCube = isCube;
            _this.isEnabled = true;
            _this._currentRefreshId = -1;
            _this._refreshRate = 1;
            _this._vertexBuffers = {};
            _this._uniforms = new Array();
            _this._samplers = new Array();
            _this._textures = {};
            _this._floats = {};
            _this._floatsArrays = {};
            _this._colors3 = {};
            _this._colors4 = {};
            _this._vectors2 = {};
            _this._vectors3 = {};
            _this._matrices = {};
            _this._fallbackTextureUsed = false;
            scene.proceduralTextures.push(_this);
            _this._engine = scene.getEngine();
            _this.name = name;
            _this.isRenderTarget = true;
            _this._size = size;
            _this._generateMipMaps = generateMipMaps;
            _this.setFragment(fragment);
            _this._fallbackTexture = fallbackTexture;
            if (isCube) {
                _this._texture = _this._engine.createRenderTargetCubeTexture(size, { generateMipMaps: generateMipMaps });
                _this.setFloat("face", 0);
            }
            else {
                _this._texture = _this._engine.createRenderTargetTexture(size, generateMipMaps);
            }
            // VBO
            var vertices = [];
            vertices.push(1, 1);
            vertices.push(-1, 1);
            vertices.push(-1, -1);
            vertices.push(1, -1);
            _this._vertexBuffers[LIB.VertexBuffer.PositionKind] = new LIB.VertexBuffer(_this._engine, vertices, LIB.VertexBuffer.PositionKind, false, false, 2);
            _this._createIndexBuffer();
            return _this;
        }
        ProceduralTexture.prototype._createIndexBuffer = function () {
            var engine = this._engine;
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
        ProceduralTexture.prototype._rebuild = function () {
            var vb = this._vertexBuffers[LIB.VertexBuffer.PositionKind];
            if (vb) {
                vb._rebuild();
            }
            this._createIndexBuffer();
            if (this.refreshRate === LIB.RenderTargetTexture.REFRESHRATE_RENDER_ONCE) {
                this.refreshRate = LIB.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
            }
        };
        ProceduralTexture.prototype.reset = function () {
            if (this._effect === undefined) {
                return;
            }
            var engine = this._engine;
            engine._releaseEffect(this._effect);
        };
        ProceduralTexture.prototype.isReady = function () {
            var _this = this;
            var engine = this._engine;
            var shaders;
            if (!this._fragment) {
                return false;
            }
            if (this._fallbackTextureUsed) {
                return true;
            }
            if (this._fragment.fragmentElement !== undefined) {
                shaders = { vertex: "procedural", fragmentElement: this._fragment.fragmentElement };
            }
            else {
                shaders = { vertex: "procedural", fragment: this._fragment };
            }
            this._effect = engine.createEffect(shaders, [LIB.VertexBuffer.PositionKind], this._uniforms, this._samplers, "", undefined, undefined, function () {
                _this.releaseInternalTexture();
                if (_this._fallbackTexture) {
                    _this._texture = _this._fallbackTexture._texture;
                    if (_this._texture) {
                        _this._texture.incrementReferences();
                    }
                }
                _this._fallbackTextureUsed = true;
            });
            return this._effect.isReady();
        };
        ProceduralTexture.prototype.resetRefreshCounter = function () {
            this._currentRefreshId = -1;
        };
        ProceduralTexture.prototype.setFragment = function (fragment) {
            this._fragment = fragment;
        };
        Object.defineProperty(ProceduralTexture.prototype, "refreshRate", {
            get: function () {
                return this._refreshRate;
            },
            // Use 0 to render just once, 1 to render on every frame, 2 to render every two frames and so on...
            set: function (value) {
                this._refreshRate = value;
                this.resetRefreshCounter();
            },
            enumerable: true,
            configurable: true
        });
        ProceduralTexture.prototype._shouldRender = function () {
            if (!this.isEnabled || !this.isReady() || !this._texture) {
                return false;
            }
            if (this._fallbackTextureUsed) {
                return false;
            }
            if (this._currentRefreshId === -1) { // At least render once
                this._currentRefreshId = 1;
                return true;
            }
            if (this.refreshRate === this._currentRefreshId) {
                this._currentRefreshId = 1;
                return true;
            }
            this._currentRefreshId++;
            return false;
        };
        ProceduralTexture.prototype.getRenderSize = function () {
            return this._size;
        };
        ProceduralTexture.prototype.resize = function (size, generateMipMaps) {
            if (this._fallbackTextureUsed) {
                return;
            }
            this.releaseInternalTexture();
            this._texture = this._engine.createRenderTargetTexture(size, generateMipMaps);
        };
        ProceduralTexture.prototype._checkUniform = function (uniformName) {
            if (this._uniforms.indexOf(uniformName) === -1) {
                this._uniforms.push(uniformName);
            }
        };
        ProceduralTexture.prototype.setTexture = function (name, texture) {
            if (this._samplers.indexOf(name) === -1) {
                this._samplers.push(name);
            }
            this._textures[name] = texture;
            return this;
        };
        ProceduralTexture.prototype.setFloat = function (name, value) {
            this._checkUniform(name);
            this._floats[name] = value;
            return this;
        };
        ProceduralTexture.prototype.setFloats = function (name, value) {
            this._checkUniform(name);
            this._floatsArrays[name] = value;
            return this;
        };
        ProceduralTexture.prototype.setColor3 = function (name, value) {
            this._checkUniform(name);
            this._colors3[name] = value;
            return this;
        };
        ProceduralTexture.prototype.setColor4 = function (name, value) {
            this._checkUniform(name);
            this._colors4[name] = value;
            return this;
        };
        ProceduralTexture.prototype.setVector2 = function (name, value) {
            this._checkUniform(name);
            this._vectors2[name] = value;
            return this;
        };
        ProceduralTexture.prototype.setVector3 = function (name, value) {
            this._checkUniform(name);
            this._vectors3[name] = value;
            return this;
        };
        ProceduralTexture.prototype.setMatrix = function (name, value) {
            this._checkUniform(name);
            this._matrices[name] = value;
            return this;
        };
        ProceduralTexture.prototype.render = function (useCameraPostProcess) {
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            var engine = this._engine;
            // Render
            engine.enableEffect(this._effect);
            engine.setState(false);
            // Texture
            for (var name in this._textures) {
                this._effect.setTexture(name, this._textures[name]);
            }
            // Float    
            for (name in this._floats) {
                this._effect.setFloat(name, this._floats[name]);
            }
            // Floats   
            for (name in this._floatsArrays) {
                this._effect.setArray(name, this._floatsArrays[name]);
            }
            // Color3        
            for (name in this._colors3) {
                this._effect.setColor3(name, this._colors3[name]);
            }
            // Color4      
            for (name in this._colors4) {
                var color = this._colors4[name];
                this._effect.setFloat4(name, color.r, color.g, color.b, color.a);
            }
            // Vector2        
            for (name in this._vectors2) {
                this._effect.setVector2(name, this._vectors2[name]);
            }
            // Vector3        
            for (name in this._vectors3) {
                this._effect.setVector3(name, this._vectors3[name]);
            }
            // Matrix      
            for (name in this._matrices) {
                this._effect.setMatrix(name, this._matrices[name]);
            }
            if (!this._texture) {
                return;
            }
            if (this.isCube) {
                for (var face = 0; face < 6; face++) {
                    engine.bindFramebuffer(this._texture, face, undefined, undefined, true);
                    // VBOs
                    engine.bindBuffers(this._vertexBuffers, this._indexBuffer, this._effect);
                    this._effect.setFloat("face", face);
                    // Clear
                    engine.clear(scene.clearColor, true, true, true);
                    // Draw order
                    engine.drawElementsType(LIB.Material.TriangleFillMode, 0, 6);
                    // Mipmaps
                    if (face === 5) {
                        engine.generateMipMapsForCubemap(this._texture);
                    }
                }
            }
            else {
                engine.bindFramebuffer(this._texture, 0, undefined, undefined, true);
                // VBOs
                engine.bindBuffers(this._vertexBuffers, this._indexBuffer, this._effect);
                // Clear
                engine.clear(scene.clearColor, true, true, true);
                // Draw order
                engine.drawElementsType(LIB.Material.TriangleFillMode, 0, 6);
            }
            // Unbind
            engine.unBindFramebuffer(this._texture, this.isCube);
            if (this.onGenerated) {
                this.onGenerated();
            }
        };
        ProceduralTexture.prototype.clone = function () {
            var textureSize = this.getSize();
            var newTexture = new ProceduralTexture(this.name, textureSize.width, this._fragment, this.getScene(), this._fallbackTexture, this._generateMipMaps);
            // Base texture
            newTexture.hasAlpha = this.hasAlpha;
            newTexture.level = this.level;
            // RenderTarget Texture
            newTexture.coordinatesMode = this.coordinatesMode;
            return newTexture;
        };
        ProceduralTexture.prototype.dispose = function () {
            var scene = this.getScene();
            if (!scene) {
                return;
            }
            var index = scene.proceduralTextures.indexOf(this);
            if (index >= 0) {
                scene.proceduralTextures.splice(index, 1);
            }
            var vertexBuffer = this._vertexBuffers[LIB.VertexBuffer.PositionKind];
            if (vertexBuffer) {
                vertexBuffer.dispose();
                this._vertexBuffers[LIB.VertexBuffer.PositionKind] = null;
            }
            if (this._indexBuffer && this._engine._releaseBuffer(this._indexBuffer)) {
                this._indexBuffer = null;
            }
            _super.prototype.dispose.call(this);
        };
        return ProceduralTexture;
    }(LIB.Texture));
    LIB.ProceduralTexture = ProceduralTexture;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.proceduralTexture.js.map
//# sourceMappingURL=LIB.proceduralTexture.js.map
