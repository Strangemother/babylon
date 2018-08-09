var BABYLON;
(function (BABYLON) {
    var BlurPostProcess = /** @class */ (function (_super) {
        __extends(BlurPostProcess, _super);
        function BlurPostProcess(name, direction, kernel, options, camera, samplingMode, engine, reusable, textureType) {
            if (samplingMode === void 0) { samplingMode = BABYLON.Texture.BILINEAR_SAMPLINGMODE; }
            if (textureType === void 0) { textureType = BABYLON.Engine.TEXTURETYPE_UNSIGNED_INT; }
            var _this = _super.call(this, name, "kernelBlur", ["delta", "direction"], null, options, camera, samplingMode, engine, reusable, null, textureType, "kernelBlur", { varyingCount: 0, depCount: 0 }, true) || this;
            _this.direction = direction;
            _this._packedFloat = false;
            _this.onApplyObservable.add(function (effect) {
                effect.setFloat2('delta', (1 / _this.width) * _this.direction.x, (1 / _this.height) * _this.direction.y);
            });
            _this.kernel = kernel;
            return _this;
        }
        Object.defineProperty(BlurPostProcess.prototype, "kernel", {
            /**
             * Gets the length in pixels of the blur sample region
             */
            get: function () {
                return this._idealKernel;
            },
            /**
             * Sets the length in pixels of the blur sample region
             */
            set: function (v) {
                if (this._idealKernel === v) {
                    return;
                }
                v = Math.max(v, 1);
                this._idealKernel = v;
                this._kernel = this._nearestBestKernel(v);
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlurPostProcess.prototype, "packedFloat", {
            /**
             * Gets wether or not the blur is unpacking/repacking floats
             */
            get: function () {
                return this._packedFloat;
            },
            /**
             * Sets wether or not the blur needs to unpack/repack floats
             */
            set: function (v) {
                if (this._packedFloat === v) {
                    return;
                }
                this._packedFloat = v;
                this._updateParameters();
            },
            enumerable: true,
            configurable: true
        });
        BlurPostProcess.prototype._updateParameters = function () {
            // Generate sampling offsets and weights
            var N = this._kernel;
            var centerIndex = (N - 1) / 2;
            // Generate Gaussian sampling weights over kernel
            var offsets = [];
            var weights = [];
            var totalWeight = 0;
            for (var i = 0; i < N; i++) {
                var u = i / (N - 1);
                var w = this._gaussianWeight(u * 2.0 - 1);
                offsets[i] = (i - centerIndex);
                weights[i] = w;
                totalWeight += w;
            }
            // Normalize weights
            for (var i = 0; i < weights.length; i++) {
                weights[i] /= totalWeight;
            }
            // Optimize: combine samples to take advantage of hardware linear sampling
            // Walk from left to center, combining pairs (symmetrically)
            var linearSamplingWeights = [];
            var linearSamplingOffsets = [];
            var linearSamplingMap = [];
            for (var i = 0; i <= centerIndex; i += 2) {
                var j = Math.min(i + 1, Math.floor(centerIndex));
                var singleCenterSample = i === j;
                if (singleCenterSample) {
                    linearSamplingMap.push({ o: offsets[i], w: weights[i] });
                }
                else {
                    var sharedCell = j === centerIndex;
                    var weightLinear = (weights[i] + weights[j] * (sharedCell ? .5 : 1.));
                    var offsetLinear = offsets[i] + 1 / (1 + weights[i] / weights[j]);
                    if (offsetLinear === 0) {
                        linearSamplingMap.push({ o: offsets[i], w: weights[i] });
                        linearSamplingMap.push({ o: offsets[i + 1], w: weights[i + 1] });
                    }
                    else {
                        linearSamplingMap.push({ o: offsetLinear, w: weightLinear });
                        linearSamplingMap.push({ o: -offsetLinear, w: weightLinear });
                    }
                }
            }
            for (var i = 0; i < linearSamplingMap.length; i++) {
                linearSamplingOffsets[i] = linearSamplingMap[i].o;
                linearSamplingWeights[i] = linearSamplingMap[i].w;
            }
            // Replace with optimized
            offsets = linearSamplingOffsets;
            weights = linearSamplingWeights;
            // Generate shaders
            var maxVaryingRows = this.getEngine().getCaps().maxVaryingVectors;
            var freeVaryingVec2 = Math.max(maxVaryingRows, 0.) - 1; // Because of sampleCenter
            var varyingCount = Math.min(offsets.length, freeVaryingVec2);
            var defines = "";
            for (var i = 0; i < varyingCount; i++) {
                defines += "#define KERNEL_OFFSET" + i + " " + this._glslFloat(offsets[i]) + "\r\n";
                defines += "#define KERNEL_WEIGHT" + i + " " + this._glslFloat(weights[i]) + "\r\n";
            }
            var depCount = 0;
            for (var i = freeVaryingVec2; i < offsets.length; i++) {
                defines += "#define KERNEL_DEP_OFFSET" + depCount + " " + this._glslFloat(offsets[i]) + "\r\n";
                defines += "#define KERNEL_DEP_WEIGHT" + depCount + " " + this._glslFloat(weights[i]) + "\r\n";
                depCount++;
            }
            if (this.packedFloat) {
                defines += "#define PACKEDFLOAT 1";
            }
            this.updateEffect(defines, null, null, {
                varyingCount: varyingCount,
                depCount: depCount
            });
        };
        /**
         * Best kernels are odd numbers that when divided by 2, their integer part is even, so 5, 9 or 13.
         * Other odd kernels optimize correctly but require proportionally more samples, even kernels are
         * possible but will produce minor visual artifacts. Since each new kernel requires a new shader we
         * want to minimize kernel changes, having gaps between physical kernels is helpful in that regard.
         * The gaps between physical kernels are compensated for in the weighting of the samples
         * @param idealKernel Ideal blur kernel.
         * @return Nearest best kernel.
         */
        BlurPostProcess.prototype._nearestBestKernel = function (idealKernel) {
            var v = Math.round(idealKernel);
            for (var _i = 0, _a = [v, v - 1, v + 1, v - 2, v + 2]; _i < _a.length; _i++) {
                var k = _a[_i];
                if (((k % 2) !== 0) && ((Math.floor(k / 2) % 2) === 0) && k > 0) {
                    return Math.max(k, 3);
                }
            }
            return Math.max(v, 3);
        };
        /**
         * Calculates the value of a Gaussian distribution with sigma 3 at a given point.
         * @param x The point on the Gaussian distribution to sample.
         * @return the value of the Gaussian function at x.
         */
        BlurPostProcess.prototype._gaussianWeight = function (x) {
            //reference: Engine/ImageProcessingBlur.cpp #dcc760
            // We are evaluating the Gaussian (normal) distribution over a kernel parameter space of [-1,1],
            // so we truncate at three standard deviations by setting stddev (sigma) to 1/3.
            // The choice of 3-sigma truncation is common but arbitrary, and means that the signal is
            // truncated at around 1.3% of peak strength.
            //the distribution is scaled to account for the difference between the actual kernel size and the requested kernel size
            var sigma = (1 / 3);
            var denominator = Math.sqrt(2.0 * Math.PI) * sigma;
            var exponent = -((x * x) / (2.0 * sigma * sigma));
            var weight = (1.0 / denominator) * Math.exp(exponent);
            return weight;
        };
        /**
          * Generates a string that can be used as a floating point number in GLSL.
          * @param x Value to print.
          * @param decimalFigures Number of decimal places to print the number to (excluding trailing 0s).
          * @return GLSL float string.
          */
        BlurPostProcess.prototype._glslFloat = function (x, decimalFigures) {
            if (decimalFigures === void 0) { decimalFigures = 8; }
            return x.toFixed(decimalFigures).replace(/0+$/, '');
        };
        return BlurPostProcess;
    }(BABYLON.PostProcess));
    BABYLON.BlurPostProcess = BlurPostProcess;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.blurPostProcess.js.map
