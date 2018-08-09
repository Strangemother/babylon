var BABYLON;
(function (BABYLON) {
    var EffectFallbacks = /** @class */ (function () {
        function EffectFallbacks() {
            this._defines = {};
            this._currentRank = 32;
            this._maxRank = -1;
        }
        EffectFallbacks.prototype.unBindMesh = function () {
            this._mesh = null;
        };
        EffectFallbacks.prototype.addFallback = function (rank, define) {
            if (!this._defines[rank]) {
                if (rank < this._currentRank) {
                    this._currentRank = rank;
                }
                if (rank > this._maxRank) {
                    this._maxRank = rank;
                }
                this._defines[rank] = new Array();
            }
            this._defines[rank].push(define);
        };
        EffectFallbacks.prototype.addCPUSkinningFallback = function (rank, mesh) {
            this._mesh = mesh;
            if (rank < this._currentRank) {
                this._currentRank = rank;
            }
            if (rank > this._maxRank) {
                this._maxRank = rank;
            }
        };
        Object.defineProperty(EffectFallbacks.prototype, "isMoreFallbacks", {
            get: function () {
                return this._currentRank <= this._maxRank;
            },
            enumerable: true,
            configurable: true
        });
        EffectFallbacks.prototype.reduce = function (currentDefines) {
            // First we try to switch to CPU skinning
            if (this._mesh && this._mesh.computeBonesUsingShaders && this._mesh.numBoneInfluencers > 0) {
                this._mesh.computeBonesUsingShaders = false;
                currentDefines = currentDefines.replace("#define NUM_BONE_INFLUENCERS " + this._mesh.numBoneInfluencers, "#define NUM_BONE_INFLUENCERS 0");
                BABYLON.Tools.Log("Falling back to CPU skinning for " + this._mesh.name);
                var scene = this._mesh.getScene();
                for (var index = 0; index < scene.meshes.length; index++) {
                    var otherMesh = scene.meshes[index];
                    if (otherMesh.material === this._mesh.material && otherMesh.computeBonesUsingShaders && otherMesh.numBoneInfluencers > 0) {
                        otherMesh.computeBonesUsingShaders = false;
                    }
                }
            }
            else {
                var currentFallbacks = this._defines[this._currentRank];
                if (currentFallbacks) {
                    for (var index = 0; index < currentFallbacks.length; index++) {
                        currentDefines = currentDefines.replace("#define " + currentFallbacks[index], "");
                    }
                }
                this._currentRank++;
            }
            return currentDefines;
        };
        return EffectFallbacks;
    }());
    BABYLON.EffectFallbacks = EffectFallbacks;
    var EffectCreationOptions = /** @class */ (function () {
        function EffectCreationOptions() {
        }
        return EffectCreationOptions;
    }());
    BABYLON.EffectCreationOptions = EffectCreationOptions;
    var Effect = /** @class */ (function () {
        function Effect(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, engine, defines, fallbacks, onCompiled, onError, indexParameters) {
            if (samplers === void 0) { samplers = null; }
            if (defines === void 0) { defines = null; }
            if (fallbacks === void 0) { fallbacks = null; }
            if (onCompiled === void 0) { onCompiled = null; }
            if (onError === void 0) { onError = null; }
            var _this = this;
            this.uniqueId = 0;
            this.onCompileObservable = new BABYLON.Observable();
            this.onErrorObservable = new BABYLON.Observable();
            this.onBindObservable = new BABYLON.Observable();
            this._uniformBuffersNames = {};
            this._isReady = false;
            this._compilationError = "";
            this.name = baseName;
            if (attributesNamesOrOptions.attributes) {
                var options = attributesNamesOrOptions;
                this._engine = uniformsNamesOrEngine;
                this._attributesNames = options.attributes;
                this._uniformsNames = options.uniformsNames.concat(options.samplers);
                this._samplers = options.samplers;
                this.defines = options.defines;
                this.onError = options.onError;
                this.onCompiled = options.onCompiled;
                this._fallbacks = options.fallbacks;
                this._indexParameters = options.indexParameters;
                this._transformFeedbackVaryings = options.transformFeedbackVaryings;
                if (options.uniformBuffersNames) {
                    for (var i = 0; i < options.uniformBuffersNames.length; i++) {
                        this._uniformBuffersNames[options.uniformBuffersNames[i]] = i;
                    }
                }
            }
            else {
                this._engine = engine;
                this.defines = defines;
                this._uniformsNames = uniformsNamesOrEngine.concat(samplers);
                this._samplers = samplers;
                this._attributesNames = attributesNamesOrOptions;
                this.onError = onError;
                this.onCompiled = onCompiled;
                this._indexParameters = indexParameters;
                this._fallbacks = fallbacks;
            }
            this.uniqueId = Effect._uniqueIdSeed++;
            var vertexSource;
            var fragmentSource;
            if (baseName.vertexElement) {
                vertexSource = document.getElementById(baseName.vertexElement);
                if (!vertexSource) {
                    vertexSource = baseName.vertexElement;
                }
            }
            else {
                vertexSource = baseName.vertex || baseName;
            }
            if (baseName.fragmentElement) {
                fragmentSource = document.getElementById(baseName.fragmentElement);
                if (!fragmentSource) {
                    fragmentSource = baseName.fragmentElement;
                }
            }
            else {
                fragmentSource = baseName.fragment || baseName;
            }
            this._loadVertexShader(vertexSource, function (vertexCode) {
                _this._processIncludes(vertexCode, function (vertexCodeWithIncludes) {
                    _this._processShaderConversion(vertexCodeWithIncludes, false, function (migratedVertexCode) {
                        _this._loadFragmentShader(fragmentSource, function (fragmentCode) {
                            _this._processIncludes(fragmentCode, function (fragmentCodeWithIncludes) {
                                _this._processShaderConversion(fragmentCodeWithIncludes, true, function (migratedFragmentCode) {
                                    if (baseName) {
                                        var vertex = baseName.vertexElement || baseName.vertex || baseName;
                                        var fragment = baseName.fragmentElement || baseName.fragment || baseName;
                                        _this._vertexSourceCode = "#define SHADER_NAME vertex:" + vertex + "\n" + migratedVertexCode;
                                        _this._fragmentSourceCode = "#define SHADER_NAME fragment:" + fragment + "\n" + migratedFragmentCode;
                                    }
                                    else {
                                        _this._vertexSourceCode = migratedVertexCode;
                                        _this._fragmentSourceCode = migratedFragmentCode;
                                    }
                                    _this._prepareEffect();
                                });
                            });
                        });
                    });
                });
            });
        }
        Object.defineProperty(Effect.prototype, "key", {
            get: function () {
                return this._key;
            },
            enumerable: true,
            configurable: true
        });
        // Properties
        Effect.prototype.isReady = function () {
            return this._isReady;
        };
        Effect.prototype.getEngine = function () {
            return this._engine;
        };
        Effect.prototype.getProgram = function () {
            return this._program;
        };
        Effect.prototype.getAttributesNames = function () {
            return this._attributesNames;
        };
        Effect.prototype.getAttributeLocation = function (index) {
            return this._attributes[index];
        };
        Effect.prototype.getAttributeLocationByName = function (name) {
            var index = this._attributesNames.indexOf(name);
            return this._attributes[index];
        };
        Effect.prototype.getAttributesCount = function () {
            return this._attributes.length;
        };
        Effect.prototype.getUniformIndex = function (uniformName) {
            return this._uniformsNames.indexOf(uniformName);
        };
        Effect.prototype.getUniform = function (uniformName) {
            return this._uniforms[this._uniformsNames.indexOf(uniformName)];
        };
        Effect.prototype.getSamplers = function () {
            return this._samplers;
        };
        Effect.prototype.getCompilationError = function () {
            return this._compilationError;
        };
        // Methods
        Effect.prototype.executeWhenCompiled = function (func) {
            if (this.isReady()) {
                func(this);
                return;
            }
            this.onCompileObservable.add(function (effect) {
                func(effect);
            });
        };
        Effect.prototype._loadVertexShader = function (vertex, callback) {
            if (BABYLON.Tools.IsWindowObjectExist()) {
                // DOM element ?
                if (vertex instanceof HTMLElement) {
                    var vertexCode = BABYLON.Tools.GetDOMTextContent(vertex);
                    callback(vertexCode);
                    return;
                }
            }
            // Base64 encoded ?
            if (vertex.substr(0, 7) === "base64:") {
                var vertexBinary = window.atob(vertex.substr(7));
                callback(vertexBinary);
                return;
            }
            // Is in local store ?
            if (Effect.ShadersStore[vertex + "VertexShader"]) {
                callback(Effect.ShadersStore[vertex + "VertexShader"]);
                return;
            }
            var vertexShaderUrl;
            if (vertex[0] === "." || vertex[0] === "/" || vertex.indexOf("http") > -1) {
                vertexShaderUrl = vertex;
            }
            else {
                vertexShaderUrl = BABYLON.Engine.ShadersRepository + vertex;
            }
            // Vertex shader
            this._engine._loadFile(vertexShaderUrl + ".vertex.fx", callback);
        };
        Effect.prototype._loadFragmentShader = function (fragment, callback) {
            if (BABYLON.Tools.IsWindowObjectExist()) {
                // DOM element ?
                if (fragment instanceof HTMLElement) {
                    var fragmentCode = BABYLON.Tools.GetDOMTextContent(fragment);
                    callback(fragmentCode);
                    return;
                }
            }
            // Base64 encoded ?
            if (fragment.substr(0, 7) === "base64:") {
                var fragmentBinary = window.atob(fragment.substr(7));
                callback(fragmentBinary);
                return;
            }
            // Is in local store ?
            if (Effect.ShadersStore[fragment + "PixelShader"]) {
                callback(Effect.ShadersStore[fragment + "PixelShader"]);
                return;
            }
            if (Effect.ShadersStore[fragment + "FragmentShader"]) {
                callback(Effect.ShadersStore[fragment + "FragmentShader"]);
                return;
            }
            var fragmentShaderUrl;
            if (fragment[0] === "." || fragment[0] === "/" || fragment.indexOf("http") > -1) {
                fragmentShaderUrl = fragment;
            }
            else {
                fragmentShaderUrl = BABYLON.Engine.ShadersRepository + fragment;
            }
            // Fragment shader
            this._engine._loadFile(fragmentShaderUrl + ".fragment.fx", callback);
        };
        Effect.prototype._dumpShadersSource = function (vertexCode, fragmentCode, defines) {
            // Rebuild shaders source code
            var shaderVersion = (this._engine.webGLVersion > 1) ? "#version 300 es\n" : "";
            var prefix = shaderVersion + (defines ? defines + "\n" : "");
            vertexCode = prefix + vertexCode;
            fragmentCode = prefix + fragmentCode;
            // Number lines of shaders source code
            var i = 2;
            var regex = /\n/gm;
            var formattedVertexCode = "\n1\t" + vertexCode.replace(regex, function () { return "\n" + (i++) + "\t"; });
            i = 2;
            var formattedFragmentCode = "\n1\t" + fragmentCode.replace(regex, function () { return "\n" + (i++) + "\t"; });
            // Dump shaders name and formatted source code
            if (this.name.vertexElement) {
                BABYLON.Tools.Error("Vertex shader: " + this.name.vertexElement + formattedVertexCode);
                BABYLON.Tools.Error("Fragment shader: " + this.name.fragmentElement + formattedFragmentCode);
            }
            else if (this.name.vertex) {
                BABYLON.Tools.Error("Vertex shader: " + this.name.vertex + formattedVertexCode);
                BABYLON.Tools.Error("Fragment shader: " + this.name.fragment + formattedFragmentCode);
            }
            else {
                BABYLON.Tools.Error("Vertex shader: " + this.name + formattedVertexCode);
                BABYLON.Tools.Error("Fragment shader: " + this.name + formattedFragmentCode);
            }
        };
        ;
        Effect.prototype._processShaderConversion = function (sourceCode, isFragment, callback) {
            var preparedSourceCode = this._processPrecision(sourceCode);
            if (this._engine.webGLVersion == 1) {
                callback(preparedSourceCode);
                return;
            }
            // Already converted
            if (preparedSourceCode.indexOf("#version 3") !== -1) {
                callback(preparedSourceCode.replace("#version 300 es", ""));
                return;
            }
            var hasDrawBuffersExtension = preparedSourceCode.search(/#extension.+GL_EXT_draw_buffers.+require/) !== -1;
            // Remove extensions
            // #extension GL_OES_standard_derivatives : enable
            // #extension GL_EXT_shader_texture_lod : enable
            // #extension GL_EXT_frag_depth : enable
            // #extension GL_EXT_draw_buffers : require
            var regex = /#extension.+(GL_OES_standard_derivatives|GL_EXT_shader_texture_lod|GL_EXT_frag_depth|GL_EXT_draw_buffers).+(enable|require)/g;
            var result = preparedSourceCode.replace(regex, "");
            // Migrate to GLSL v300
            result = result.replace(/varying(?![\n\r])\s/g, isFragment ? "in " : "out ");
            result = result.replace(/attribute[ \t]/g, "in ");
            result = result.replace(/[ \t]attribute/g, " in");
            if (isFragment) {
                result = result.replace(/texture2DLodEXT\s*\(/g, "textureLod(");
                result = result.replace(/textureCubeLodEXT\s*\(/g, "textureLod(");
                result = result.replace(/texture2D\s*\(/g, "texture(");
                result = result.replace(/textureCube\s*\(/g, "texture(");
                result = result.replace(/gl_FragDepthEXT/g, "gl_FragDepth");
                result = result.replace(/gl_FragColor/g, "glFragColor");
                result = result.replace(/gl_FragData/g, "glFragData");
                result = result.replace(/void\s+?main\s*\(/g, (hasDrawBuffersExtension ? "" : "out vec4 glFragColor;\n") + "void main(");
            }
            callback(result);
        };
        Effect.prototype._processIncludes = function (sourceCode, callback) {
            var _this = this;
            var regex = /#include<(.+)>(\((.*)\))*(\[(.*)\])*/g;
            var match = regex.exec(sourceCode);
            var returnValue = new String(sourceCode);
            while (match != null) {
                var includeFile = match[1];
                // Uniform declaration
                if (includeFile.indexOf("__decl__") !== -1) {
                    includeFile = includeFile.replace(/__decl__/, "");
                    if (this._engine.supportsUniformBuffers) {
                        includeFile = includeFile.replace(/Vertex/, "Ubo");
                        includeFile = includeFile.replace(/Fragment/, "Ubo");
                    }
                    includeFile = includeFile + "Declaration";
                }
                if (Effect.IncludesShadersStore[includeFile]) {
                    // Substitution
                    var includeContent = Effect.IncludesShadersStore[includeFile];
                    if (match[2]) {
                        var splits = match[3].split(",");
                        for (var index = 0; index < splits.length; index += 2) {
                            var source = new RegExp(splits[index], "g");
                            var dest = splits[index + 1];
                            includeContent = includeContent.replace(source, dest);
                        }
                    }
                    if (match[4]) {
                        var indexString = match[5];
                        if (indexString.indexOf("..") !== -1) {
                            var indexSplits = indexString.split("..");
                            var minIndex = parseInt(indexSplits[0]);
                            var maxIndex = parseInt(indexSplits[1]);
                            var sourceIncludeContent = includeContent.slice(0);
                            includeContent = "";
                            if (isNaN(maxIndex)) {
                                maxIndex = this._indexParameters[indexSplits[1]];
                            }
                            for (var i = minIndex; i < maxIndex; i++) {
                                if (!this._engine.supportsUniformBuffers) {
                                    // Ubo replacement
                                    sourceIncludeContent = sourceIncludeContent.replace(/light\{X\}.(\w*)/g, function (str, p1) {
                                        return p1 + "{X}";
                                    });
                                }
                                includeContent += sourceIncludeContent.replace(/\{X\}/g, i.toString()) + "\n";
                            }
                        }
                        else {
                            if (!this._engine.supportsUniformBuffers) {
                                // Ubo replacement
                                includeContent = includeContent.replace(/light\{X\}.(\w*)/g, function (str, p1) {
                                    return p1 + "{X}";
                                });
                            }
                            includeContent = includeContent.replace(/\{X\}/g, indexString);
                        }
                    }
                    // Replace
                    returnValue = returnValue.replace(match[0], includeContent);
                }
                else {
                    var includeShaderUrl = BABYLON.Engine.ShadersRepository + "ShadersInclude/" + includeFile + ".fx";
                    this._engine._loadFile(includeShaderUrl, function (fileContent) {
                        Effect.IncludesShadersStore[includeFile] = fileContent;
                        _this._processIncludes(returnValue, callback);
                    });
                    return;
                }
                match = regex.exec(sourceCode);
            }
            callback(returnValue);
        };
        Effect.prototype._processPrecision = function (source) {
            if (source.indexOf("precision highp float") === -1) {
                if (!this._engine.getCaps().highPrecisionShaderSupported) {
                    source = "precision mediump float;\n" + source;
                }
                else {
                    source = "precision highp float;\n" + source;
                }
            }
            else {
                if (!this._engine.getCaps().highPrecisionShaderSupported) {
                    source = source.replace("precision highp float", "precision mediump float");
                }
            }
            return source;
        };
        Effect.prototype._rebuildProgram = function (vertexSourceCode, fragmentSourceCode, onCompiled, onError) {
            var _this = this;
            this._isReady = false;
            this._vertexSourceCodeOverride = vertexSourceCode;
            this._fragmentSourceCodeOverride = fragmentSourceCode;
            this.onError = function (effect, error) {
                if (onError) {
                    onError(error);
                }
            };
            this.onCompiled = function () {
                var scenes = _this.getEngine().scenes;
                for (var i = 0; i < scenes.length; i++) {
                    scenes[i].markAllMaterialsAsDirty(BABYLON.Material.TextureDirtyFlag);
                }
                if (onCompiled) {
                    onCompiled(_this._program);
                }
            };
            this._fallbacks = null;
            this._prepareEffect();
        };
        Effect.prototype.getSpecificUniformLocations = function (names) {
            var engine = this._engine;
            return engine.getUniforms(this._program, names);
        };
        Effect.prototype._prepareEffect = function () {
            var attributesNames = this._attributesNames;
            var defines = this.defines;
            var fallbacks = this._fallbacks;
            this._valueCache = {};
            var previousProgram = this._program;
            try {
                var engine = this._engine;
                if (this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride) {
                    this._program = engine.createRawShaderProgram(this._vertexSourceCodeOverride, this._fragmentSourceCodeOverride, undefined, this._transformFeedbackVaryings);
                }
                else {
                    this._program = engine.createShaderProgram(this._vertexSourceCode, this._fragmentSourceCode, defines, undefined, this._transformFeedbackVaryings);
                }
                this._program.__SPECTOR_rebuildProgram = this._rebuildProgram.bind(this);
                if (engine.supportsUniformBuffers) {
                    for (var name in this._uniformBuffersNames) {
                        this.bindUniformBlock(name, this._uniformBuffersNames[name]);
                    }
                }
                this._uniforms = engine.getUniforms(this._program, this._uniformsNames);
                this._attributes = engine.getAttributes(this._program, attributesNames);
                var index;
                for (index = 0; index < this._samplers.length; index++) {
                    var sampler = this.getUniform(this._samplers[index]);
                    if (sampler == null) {
                        this._samplers.splice(index, 1);
                        index--;
                    }
                }
                engine.bindSamplers(this);
                this._compilationError = "";
                this._isReady = true;
                if (this.onCompiled) {
                    this.onCompiled(this);
                }
                this.onCompileObservable.notifyObservers(this);
                this.onCompileObservable.clear();
                // Unbind mesh reference in fallbacks
                if (this._fallbacks) {
                    this._fallbacks.unBindMesh();
                }
                if (previousProgram) {
                    this.getEngine()._deleteProgram(previousProgram);
                }
            }
            catch (e) {
                this._compilationError = e.message;
                // Let's go through fallbacks then
                BABYLON.Tools.Error("Unable to compile effect:");
                BABYLON.Tools.Error("Uniforms: " + this._uniformsNames.map(function (uniform) {
                    return " " + uniform;
                }));
                BABYLON.Tools.Error("Attributes: " + attributesNames.map(function (attribute) {
                    return " " + attribute;
                }));
                this._dumpShadersSource(this._vertexSourceCode, this._fragmentSourceCode, defines);
                BABYLON.Tools.Error("Error: " + this._compilationError);
                if (previousProgram) {
                    this._program = previousProgram;
                    this._isReady = true;
                    if (this.onError) {
                        this.onError(this, this._compilationError);
                    }
                    this.onErrorObservable.notifyObservers(this);
                }
                if (fallbacks && fallbacks.isMoreFallbacks) {
                    BABYLON.Tools.Error("Trying next fallback.");
                    this.defines = fallbacks.reduce(this.defines);
                    this._prepareEffect();
                }
                else {
                    if (this.onError) {
                        this.onError(this, this._compilationError);
                    }
                    this.onErrorObservable.notifyObservers(this);
                    this.onErrorObservable.clear();
                    // Unbind mesh reference in fallbacks
                    if (this._fallbacks) {
                        this._fallbacks.unBindMesh();
                    }
                }
            }
        };
        Object.defineProperty(Effect.prototype, "isSupported", {
            get: function () {
                return this._compilationError === "";
            },
            enumerable: true,
            configurable: true
        });
        Effect.prototype._bindTexture = function (channel, texture) {
            this._engine._bindTexture(this._samplers.indexOf(channel), texture);
        };
        Effect.prototype.setTexture = function (channel, texture) {
            this._engine.setTexture(this._samplers.indexOf(channel), this.getUniform(channel), texture);
        };
        Effect.prototype.setTextureArray = function (channel, textures) {
            if (this._samplers.indexOf(channel + "Ex") === -1) {
                var initialPos = this._samplers.indexOf(channel);
                for (var index = 1; index < textures.length; index++) {
                    this._samplers.splice(initialPos + index, 0, channel + "Ex");
                }
            }
            this._engine.setTextureArray(this._samplers.indexOf(channel), this.getUniform(channel), textures);
        };
        Effect.prototype.setTextureFromPostProcess = function (channel, postProcess) {
            this._engine.setTextureFromPostProcess(this._samplers.indexOf(channel), postProcess);
        };
        Effect.prototype._cacheMatrix = function (uniformName, matrix) {
            var cache = this._valueCache[uniformName];
            var flag = matrix.updateFlag;
            if (cache !== undefined && cache === flag) {
                return false;
            }
            this._valueCache[uniformName] = flag;
            return true;
        };
        Effect.prototype._cacheFloat2 = function (uniformName, x, y) {
            var cache = this._valueCache[uniformName];
            if (!cache) {
                cache = [x, y];
                this._valueCache[uniformName] = cache;
                return true;
            }
            var changed = false;
            if (cache[0] !== x) {
                cache[0] = x;
                changed = true;
            }
            if (cache[1] !== y) {
                cache[1] = y;
                changed = true;
            }
            return changed;
        };
        Effect.prototype._cacheFloat3 = function (uniformName, x, y, z) {
            var cache = this._valueCache[uniformName];
            if (!cache) {
                cache = [x, y, z];
                this._valueCache[uniformName] = cache;
                return true;
            }
            var changed = false;
            if (cache[0] !== x) {
                cache[0] = x;
                changed = true;
            }
            if (cache[1] !== y) {
                cache[1] = y;
                changed = true;
            }
            if (cache[2] !== z) {
                cache[2] = z;
                changed = true;
            }
            return changed;
        };
        Effect.prototype._cacheFloat4 = function (uniformName, x, y, z, w) {
            var cache = this._valueCache[uniformName];
            if (!cache) {
                cache = [x, y, z, w];
                this._valueCache[uniformName] = cache;
                return true;
            }
            var changed = false;
            if (cache[0] !== x) {
                cache[0] = x;
                changed = true;
            }
            if (cache[1] !== y) {
                cache[1] = y;
                changed = true;
            }
            if (cache[2] !== z) {
                cache[2] = z;
                changed = true;
            }
            if (cache[3] !== w) {
                cache[3] = w;
                changed = true;
            }
            return changed;
        };
        Effect.prototype.bindUniformBuffer = function (buffer, name) {
            var bufferName = this._uniformBuffersNames[name];
            if (Effect._baseCache[bufferName] === buffer) {
                return;
            }
            Effect._baseCache[bufferName] = buffer;
            this._engine.bindUniformBufferBase(buffer, bufferName);
        };
        Effect.prototype.bindUniformBlock = function (blockName, index) {
            this._engine.bindUniformBlock(this._program, blockName, index);
        };
        Effect.prototype.setInt = function (uniformName, value) {
            var cache = this._valueCache[uniformName];
            if (cache !== undefined && cache === value)
                return this;
            this._valueCache[uniformName] = value;
            this._engine.setInt(this.getUniform(uniformName), value);
            return this;
        };
        Effect.prototype.setIntArray = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setIntArray(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setIntArray2 = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setIntArray2(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setIntArray3 = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setIntArray3(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setIntArray4 = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setIntArray4(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setFloatArray = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setFloatArray(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setFloatArray2 = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setFloatArray2(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setFloatArray3 = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setFloatArray3(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setFloatArray4 = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setFloatArray4(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setArray = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setArray(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setArray2 = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setArray2(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setArray3 = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setArray3(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setArray4 = function (uniformName, array) {
            this._valueCache[uniformName] = null;
            this._engine.setArray4(this.getUniform(uniformName), array);
            return this;
        };
        Effect.prototype.setMatrices = function (uniformName, matrices) {
            if (!matrices) {
                return this;
            }
            this._valueCache[uniformName] = null;
            this._engine.setMatrices(this.getUniform(uniformName), matrices);
            return this;
        };
        Effect.prototype.setMatrix = function (uniformName, matrix) {
            if (this._cacheMatrix(uniformName, matrix)) {
                this._engine.setMatrix(this.getUniform(uniformName), matrix);
            }
            return this;
        };
        Effect.prototype.setMatrix3x3 = function (uniformName, matrix) {
            this._valueCache[uniformName] = null;
            this._engine.setMatrix3x3(this.getUniform(uniformName), matrix);
            return this;
        };
        Effect.prototype.setMatrix2x2 = function (uniformName, matrix) {
            this._valueCache[uniformName] = null;
            this._engine.setMatrix2x2(this.getUniform(uniformName), matrix);
            return this;
        };
        Effect.prototype.setFloat = function (uniformName, value) {
            var cache = this._valueCache[uniformName];
            if (cache !== undefined && cache === value)
                return this;
            this._valueCache[uniformName] = value;
            this._engine.setFloat(this.getUniform(uniformName), value);
            return this;
        };
        Effect.prototype.setBool = function (uniformName, bool) {
            var cache = this._valueCache[uniformName];
            if (cache !== undefined && cache === bool)
                return this;
            this._valueCache[uniformName] = bool;
            this._engine.setBool(this.getUniform(uniformName), bool ? 1 : 0);
            return this;
        };
        Effect.prototype.setVector2 = function (uniformName, vector2) {
            if (this._cacheFloat2(uniformName, vector2.x, vector2.y)) {
                this._engine.setFloat2(this.getUniform(uniformName), vector2.x, vector2.y);
            }
            return this;
        };
        Effect.prototype.setFloat2 = function (uniformName, x, y) {
            if (this._cacheFloat2(uniformName, x, y)) {
                this._engine.setFloat2(this.getUniform(uniformName), x, y);
            }
            return this;
        };
        Effect.prototype.setVector3 = function (uniformName, vector3) {
            if (this._cacheFloat3(uniformName, vector3.x, vector3.y, vector3.z)) {
                this._engine.setFloat3(this.getUniform(uniformName), vector3.x, vector3.y, vector3.z);
            }
            return this;
        };
        Effect.prototype.setFloat3 = function (uniformName, x, y, z) {
            if (this._cacheFloat3(uniformName, x, y, z)) {
                this._engine.setFloat3(this.getUniform(uniformName), x, y, z);
            }
            return this;
        };
        Effect.prototype.setVector4 = function (uniformName, vector4) {
            if (this._cacheFloat4(uniformName, vector4.x, vector4.y, vector4.z, vector4.w)) {
                this._engine.setFloat4(this.getUniform(uniformName), vector4.x, vector4.y, vector4.z, vector4.w);
            }
            return this;
        };
        Effect.prototype.setFloat4 = function (uniformName, x, y, z, w) {
            if (this._cacheFloat4(uniformName, x, y, z, w)) {
                this._engine.setFloat4(this.getUniform(uniformName), x, y, z, w);
            }
            return this;
        };
        Effect.prototype.setColor3 = function (uniformName, color3) {
            if (this._cacheFloat3(uniformName, color3.r, color3.g, color3.b)) {
                this._engine.setColor3(this.getUniform(uniformName), color3);
            }
            return this;
        };
        Effect.prototype.setColor4 = function (uniformName, color3, alpha) {
            if (this._cacheFloat4(uniformName, color3.r, color3.g, color3.b, alpha)) {
                this._engine.setColor4(this.getUniform(uniformName), color3, alpha);
            }
            return this;
        };
        Effect.ResetCache = function () {
            Effect._baseCache = {};
        };
        Effect._uniqueIdSeed = 0;
        Effect._baseCache = {};
        // Statics
        Effect.ShadersStore = {};
        Effect.IncludesShadersStore = {};
        return Effect;
    }());
    BABYLON.Effect = Effect;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.effect.js.map
