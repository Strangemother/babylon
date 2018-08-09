var BABYLON;
(function (BABYLON) {
    BABYLON.ToGammaSpace = 1 / 2.2;
    BABYLON.ToLinearSpace = 2.2;
    BABYLON.Epsilon = 0.001;
    var Color3 = /** @class */ (function () {
        /**
         * Creates a new Color3 object from red, green, blue values, all between 0 and 1.
         */
        function Color3(r, g, b) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            this.r = r;
            this.g = g;
            this.b = b;
        }
        /**
         * Returns a string with the Color3 current values.
         */
        Color3.prototype.toString = function () {
            return "{R: " + this.r + " G:" + this.g + " B:" + this.b + "}";
        };
        /**
         * Returns the string "Color3".
         */
        Color3.prototype.getClassName = function () {
            return "Color3";
        };
        /**
         * Returns the Color3 hash code.
         */
        Color3.prototype.getHashCode = function () {
            var hash = this.r || 0;
            hash = (hash * 397) ^ (this.g || 0);
            hash = (hash * 397) ^ (this.b || 0);
            return hash;
        };
        // Operators
        /**
         * Stores in the passed array from the passed starting index the red, green, blue values as successive elements.
         * Returns the Color3.
         */
        Color3.prototype.toArray = function (array, index) {
            if (index === undefined) {
                index = 0;
            }
            array[index] = this.r;
            array[index + 1] = this.g;
            array[index + 2] = this.b;
            return this;
        };
        /**
         * Returns a new Color4 object from the current Color3 and the passed alpha.
         */
        Color3.prototype.toColor4 = function (alpha) {
            if (alpha === void 0) { alpha = 1; }
            return new Color4(this.r, this.g, this.b, alpha);
        };
        /**
         * Returns a new array populated with 3 numeric elements : red, green and blue values.
         */
        Color3.prototype.asArray = function () {
            var result = new Array();
            this.toArray(result, 0);
            return result;
        };
        /**
         * Returns the luminance value (float).
         */
        Color3.prototype.toLuminance = function () {
            return this.r * 0.3 + this.g * 0.59 + this.b * 0.11;
        };
        /**
         * Multiply each Color3 rgb values by the passed Color3 rgb values in a new Color3 object.
         * Returns this new object.
         */
        Color3.prototype.multiply = function (otherColor) {
            return new Color3(this.r * otherColor.r, this.g * otherColor.g, this.b * otherColor.b);
        };
        /**
         * Multiply the rgb values of the Color3 and the passed Color3 and stores the result in the object "result".
         * Returns the current Color3.
         */
        Color3.prototype.multiplyToRef = function (otherColor, result) {
            result.r = this.r * otherColor.r;
            result.g = this.g * otherColor.g;
            result.b = this.b * otherColor.b;
            return this;
        };
        /**
         * Boolean : True if the rgb values are equal to the passed ones.
         */
        Color3.prototype.equals = function (otherColor) {
            return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b;
        };
        /**
         * Boolean : True if the rgb values are equal to the passed ones.
         */
        Color3.prototype.equalsFloats = function (r, g, b) {
            return this.r === r && this.g === g && this.b === b;
        };
        /**
         * Multiplies in place each rgb value by scale.
         * Returns the updated Color3.
         */
        Color3.prototype.scale = function (scale) {
            return new Color3(this.r * scale, this.g * scale, this.b * scale);
        };
        /**
         * Multiplies the rgb values by scale and stores the result into "result".
         * Returns the unmodified current Color3.
         */
        Color3.prototype.scaleToRef = function (scale, result) {
            result.r = this.r * scale;
            result.g = this.g * scale;
            result.b = this.b * scale;
            return this;
        };
        /**
         * Returns a new Color3 set with the added values of the current Color3 and of the passed one.
         */
        Color3.prototype.add = function (otherColor) {
            return new Color3(this.r + otherColor.r, this.g + otherColor.g, this.b + otherColor.b);
        };
        /**
         * Stores the result of the addition of the current Color3 and passed one rgb values into "result".
         * Returns the unmodified current Color3.
         */
        Color3.prototype.addToRef = function (otherColor, result) {
            result.r = this.r + otherColor.r;
            result.g = this.g + otherColor.g;
            result.b = this.b + otherColor.b;
            return this;
        };
        /**
         * Returns a new Color3 set with the subtracted values of the passed one from the current Color3 .
         */
        Color3.prototype.subtract = function (otherColor) {
            return new Color3(this.r - otherColor.r, this.g - otherColor.g, this.b - otherColor.b);
        };
        /**
         * Stores the result of the subtraction of passed one from the current Color3 rgb values into "result".
         * Returns the unmodified current Color3.
         */
        Color3.prototype.subtractToRef = function (otherColor, result) {
            result.r = this.r - otherColor.r;
            result.g = this.g - otherColor.g;
            result.b = this.b - otherColor.b;
            return this;
        };
        /**
         * Returns a new Color3 copied the current one.
         */
        Color3.prototype.clone = function () {
            return new Color3(this.r, this.g, this.b);
        };
        /**
         * Copies the rgb values from the source in the current Color3.
         * Returns the updated Color3.
         */
        Color3.prototype.copyFrom = function (source) {
            this.r = source.r;
            this.g = source.g;
            this.b = source.b;
            return this;
        };
        /**
         * Updates the Color3 rgb values from the passed floats.
         * Returns the Color3.
         */
        Color3.prototype.copyFromFloats = function (r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
            return this;
        };
        /**
         * Updates the Color3 rgb values from the passed floats.
         * Returns the Color3.
         */
        Color3.prototype.set = function (r, g, b) {
            return this.copyFromFloats(r, g, b);
        };
        /**
         * Returns the Color3 hexadecimal code as a string.
         */
        Color3.prototype.toHexString = function () {
            var intR = (this.r * 255) | 0;
            var intG = (this.g * 255) | 0;
            var intB = (this.b * 255) | 0;
            return "#" + BABYLON.Scalar.ToHex(intR) + BABYLON.Scalar.ToHex(intG) + BABYLON.Scalar.ToHex(intB);
        };
        /**
         * Returns a new Color3 converted to linear space.
         */
        Color3.prototype.toLinearSpace = function () {
            var convertedColor = new Color3();
            this.toLinearSpaceToRef(convertedColor);
            return convertedColor;
        };
        /**
         * Converts the Color3 values to linear space and stores the result in "convertedColor".
         * Returns the unmodified Color3.
         */
        Color3.prototype.toLinearSpaceToRef = function (convertedColor) {
            convertedColor.r = Math.pow(this.r, BABYLON.ToLinearSpace);
            convertedColor.g = Math.pow(this.g, BABYLON.ToLinearSpace);
            convertedColor.b = Math.pow(this.b, BABYLON.ToLinearSpace);
            return this;
        };
        /**
         * Returns a new Color3 converted to gamma space.
         */
        Color3.prototype.toGammaSpace = function () {
            var convertedColor = new Color3();
            this.toGammaSpaceToRef(convertedColor);
            return convertedColor;
        };
        /**
         * Converts the Color3 values to gamma space and stores the result in "convertedColor".
         * Returns the unmodified Color3.
         */
        Color3.prototype.toGammaSpaceToRef = function (convertedColor) {
            convertedColor.r = Math.pow(this.r, BABYLON.ToGammaSpace);
            convertedColor.g = Math.pow(this.g, BABYLON.ToGammaSpace);
            convertedColor.b = Math.pow(this.b, BABYLON.ToGammaSpace);
            return this;
        };
        // Statics
        /**
         * Creates a new Color3 from the string containing valid hexadecimal values.
         */
        Color3.FromHexString = function (hex) {
            if (hex.substring(0, 1) !== "#" || hex.length !== 7) {
                //Tools.Warn("Color3.FromHexString must be called with a string like #FFFFFF");
                return new Color3(0, 0, 0);
            }
            var r = parseInt(hex.substring(1, 3), 16);
            var g = parseInt(hex.substring(3, 5), 16);
            var b = parseInt(hex.substring(5, 7), 16);
            return Color3.FromInts(r, g, b);
        };
        /**
         * Creates a new Vector3 from the startind index of the passed array.
         */
        Color3.FromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            return new Color3(array[offset], array[offset + 1], array[offset + 2]);
        };
        /**
         * Creates a new Color3 from integer values ( < 256).
         */
        Color3.FromInts = function (r, g, b) {
            return new Color3(r / 255.0, g / 255.0, b / 255.0);
        };
        /**
         * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3.
         */
        Color3.Lerp = function (start, end, amount) {
            var r = start.r + ((end.r - start.r) * amount);
            var g = start.g + ((end.g - start.g) * amount);
            var b = start.b + ((end.b - start.b) * amount);
            return new Color3(r, g, b);
        };
        Color3.Red = function () { return new Color3(1, 0, 0); };
        Color3.Green = function () { return new Color3(0, 1, 0); };
        Color3.Blue = function () { return new Color3(0, 0, 1); };
        Color3.Black = function () { return new Color3(0, 0, 0); };
        Color3.White = function () { return new Color3(1, 1, 1); };
        Color3.Purple = function () { return new Color3(0.5, 0, 0.5); };
        Color3.Magenta = function () { return new Color3(1, 0, 1); };
        Color3.Yellow = function () { return new Color3(1, 1, 0); };
        Color3.Gray = function () { return new Color3(0.5, 0.5, 0.5); };
        Color3.Teal = function () { return new Color3(0, 1.0, 1.0); };
        Color3.Random = function () { return new Color3(Math.random(), Math.random(), Math.random()); };
        return Color3;
    }());
    BABYLON.Color3 = Color3;
    var Color4 = /** @class */ (function () {
        /**
         * Creates a new Color4 object from the passed float values ( < 1) : red, green, blue, alpha.
         */
        function Color4(r, g, b, a) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            if (a === void 0) { a = 1; }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        // Operators
        /**
         * Adds in place the passed Color4 values to the current Color4.
         * Returns the updated Color4.
         */
        Color4.prototype.addInPlace = function (right) {
            this.r += right.r;
            this.g += right.g;
            this.b += right.b;
            this.a += right.a;
            return this;
        };
        /**
         * Returns a new array populated with 4 numeric elements : red, green, blue, alpha values.
         */
        Color4.prototype.asArray = function () {
            var result = new Array();
            this.toArray(result, 0);
            return result;
        };
        /**
         * Stores from the starting index in the passed array the Color4 successive values.
         * Returns the Color4.
         */
        Color4.prototype.toArray = function (array, index) {
            if (index === undefined) {
                index = 0;
            }
            array[index] = this.r;
            array[index + 1] = this.g;
            array[index + 2] = this.b;
            array[index + 3] = this.a;
            return this;
        };
        /**
         * Returns a new Color4 set with the added values of the current Color4 and of the passed one.
         */
        Color4.prototype.add = function (right) {
            return new Color4(this.r + right.r, this.g + right.g, this.b + right.b, this.a + right.a);
        };
        /**
         * Returns a new Color4 set with the subtracted values of the passed one from the current Color4.
         */
        Color4.prototype.subtract = function (right) {
            return new Color4(this.r - right.r, this.g - right.g, this.b - right.b, this.a - right.a);
        };
        /**
         * Subtracts the passed ones from the current Color4 values and stores the results in "result".
         * Returns the Color4.
         */
        Color4.prototype.subtractToRef = function (right, result) {
            result.r = this.r - right.r;
            result.g = this.g - right.g;
            result.b = this.b - right.b;
            result.a = this.a - right.a;
            return this;
        };
        /**
         * Creates a new Color4 with the current Color4 values multiplied by scale.
         */
        Color4.prototype.scale = function (scale) {
            return new Color4(this.r * scale, this.g * scale, this.b * scale, this.a * scale);
        };
        /**
         * Multiplies the current Color4 values by scale and stores the result in "result".
         * Returns the Color4.
         */
        Color4.prototype.scaleToRef = function (scale, result) {
            result.r = this.r * scale;
            result.g = this.g * scale;
            result.b = this.b * scale;
            result.a = this.a * scale;
            return this;
        };
        /**
          * Multipy an RGBA Color4 value by another and return a new Color4 object
          * @param color The Color4 (RGBA) value to multiply by
          * @returns A new Color4.
          */
        Color4.prototype.multiply = function (color) {
            return new Color4(this.r * color.r, this.g * color.g, this.b * color.b, this.a * color.a);
        };
        /**
         * Multipy an RGBA Color4 value by another and push the result in a reference value
         * @param color The Color4 (RGBA) value to multiply by
         * @param result The Color4 (RGBA) to fill the result in
         * @returns the result Color4.
         */
        Color4.prototype.multiplyToRef = function (color, result) {
            result.r = this.r * color.r;
            result.g = this.g * color.g;
            result.b = this.b * color.b;
            result.a = this.a * color.a;
            return result;
        };
        /**
         * Returns a string with the Color4 values.
         */
        Color4.prototype.toString = function () {
            return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
        };
        /**
         * Returns the string "Color4"
         */
        Color4.prototype.getClassName = function () {
            return "Color4";
        };
        /**
         * Return the Color4 hash code as a number.
         */
        Color4.prototype.getHashCode = function () {
            var hash = this.r || 0;
            hash = (hash * 397) ^ (this.g || 0);
            hash = (hash * 397) ^ (this.b || 0);
            hash = (hash * 397) ^ (this.a || 0);
            return hash;
        };
        /**
         * Creates a new Color4 copied from the current one.
         */
        Color4.prototype.clone = function () {
            return new Color4(this.r, this.g, this.b, this.a);
        };
        /**
         * Copies the passed Color4 values into the current one.
         * Returns the updated Color4.
         */
        Color4.prototype.copyFrom = function (source) {
            this.r = source.r;
            this.g = source.g;
            this.b = source.b;
            this.a = source.a;
            return this;
        };
        /**
         * Copies the passed float values into the current one.
         * Returns the updated Color4.
         */
        Color4.prototype.copyFromFloats = function (r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
            return this;
        };
        /**
         * Copies the passed float values into the current one.
         * Returns the updated Color4.
         */
        Color4.prototype.set = function (r, g, b, a) {
            return this.copyFromFloats(r, g, b, a);
        };
        /**
         * Returns a string containing the hexadecimal Color4 code.
         */
        Color4.prototype.toHexString = function () {
            var intR = (this.r * 255) | 0;
            var intG = (this.g * 255) | 0;
            var intB = (this.b * 255) | 0;
            var intA = (this.a * 255) | 0;
            return "#" + BABYLON.Scalar.ToHex(intR) + BABYLON.Scalar.ToHex(intG) + BABYLON.Scalar.ToHex(intB) + BABYLON.Scalar.ToHex(intA);
        };
        /**
         * Returns a new Color4 converted to linear space.
         */
        Color4.prototype.toLinearSpace = function () {
            var convertedColor = new Color4();
            this.toLinearSpaceToRef(convertedColor);
            return convertedColor;
        };
        /**
         * Converts the Color4 values to linear space and stores the result in "convertedColor".
         * Returns the unmodified Color4.
         */
        Color4.prototype.toLinearSpaceToRef = function (convertedColor) {
            convertedColor.r = Math.pow(this.r, BABYLON.ToLinearSpace);
            convertedColor.g = Math.pow(this.g, BABYLON.ToLinearSpace);
            convertedColor.b = Math.pow(this.b, BABYLON.ToLinearSpace);
            convertedColor.a = this.a;
            return this;
        };
        /**
         * Returns a new Color4 converted to gamma space.
         */
        Color4.prototype.toGammaSpace = function () {
            var convertedColor = new Color4();
            this.toGammaSpaceToRef(convertedColor);
            return convertedColor;
        };
        /**
         * Converts the Color4 values to gamma space and stores the result in "convertedColor".
         * Returns the unmodified Color4.
         */
        Color4.prototype.toGammaSpaceToRef = function (convertedColor) {
            convertedColor.r = Math.pow(this.r, BABYLON.ToGammaSpace);
            convertedColor.g = Math.pow(this.g, BABYLON.ToGammaSpace);
            convertedColor.b = Math.pow(this.b, BABYLON.ToGammaSpace);
            convertedColor.a = this.a;
            return this;
        };
        // Statics
        /**
         * Creates a new Color4 from the valid hexadecimal value contained in the passed string.
         */
        Color4.FromHexString = function (hex) {
            if (hex.substring(0, 1) !== "#" || hex.length !== 9) {
                //Tools.Warn("Color4.FromHexString must be called with a string like #FFFFFFFF");
                return new Color4(0.0, 0.0, 0.0, 0.0);
            }
            var r = parseInt(hex.substring(1, 3), 16);
            var g = parseInt(hex.substring(3, 5), 16);
            var b = parseInt(hex.substring(5, 7), 16);
            var a = parseInt(hex.substring(7, 9), 16);
            return Color4.FromInts(r, g, b, a);
        };
        /**
         * Creates a new Color4 object set with the linearly interpolated values of "amount" between the left Color4 and the right Color4.
         */
        Color4.Lerp = function (left, right, amount) {
            var result = new Color4(0.0, 0.0, 0.0, 0.0);
            Color4.LerpToRef(left, right, amount, result);
            return result;
        };
        /**
         * Set the passed "result" with the linearly interpolated values of "amount" between the left Color4 and the right Color4.
         */
        Color4.LerpToRef = function (left, right, amount, result) {
            result.r = left.r + (right.r - left.r) * amount;
            result.g = left.g + (right.g - left.g) * amount;
            result.b = left.b + (right.b - left.b) * amount;
            result.a = left.a + (right.a - left.a) * amount;
        };
        /**
         * Creates a new Color4 from the starting index element of the passed array.
         */
        Color4.FromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            return new Color4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
        };
        /**
         * Creates a new Color4 from the passed integers ( < 256 ).
         */
        Color4.FromInts = function (r, g, b, a) {
            return new Color4(r / 255.0, g / 255.0, b / 255.0, a / 255.0);
        };
        Color4.CheckColors4 = function (colors, count) {
            // Check if color3 was used
            if (colors.length === count * 3) {
                var colors4 = [];
                for (var index = 0; index < colors.length; index += 3) {
                    var newIndex = (index / 3) * 4;
                    colors4[newIndex] = colors[index];
                    colors4[newIndex + 1] = colors[index + 1];
                    colors4[newIndex + 2] = colors[index + 2];
                    colors4[newIndex + 3] = 1.0;
                }
                return colors4;
            }
            return colors;
        };
        return Color4;
    }());
    BABYLON.Color4 = Color4;
    var Vector2 = /** @class */ (function () {
        /**
         * Creates a new Vector2 from the passed x and y coordinates.
         */
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        /**
         * Returns a string with the Vector2 coordinates.
         */
        Vector2.prototype.toString = function () {
            return "{X: " + this.x + " Y:" + this.y + "}";
        };
        /**
         * Returns the string "Vector2"
         */
        Vector2.prototype.getClassName = function () {
            return "Vector2";
        };
        /**
         * Returns the Vector2 hash code as a number.
         */
        Vector2.prototype.getHashCode = function () {
            var hash = this.x || 0;
            hash = (hash * 397) ^ (this.y || 0);
            return hash;
        };
        // Operators
        /**
         * Sets the Vector2 coordinates in the passed array or Float32Array from the passed index.
         * Returns the Vector2.
         */
        Vector2.prototype.toArray = function (array, index) {
            if (index === void 0) { index = 0; }
            array[index] = this.x;
            array[index + 1] = this.y;
            return this;
        };
        /**
         * Returns a new array with 2 elements : the Vector2 coordinates.
         */
        Vector2.prototype.asArray = function () {
            var result = new Array();
            this.toArray(result, 0);
            return result;
        };
        /**
         *  Sets the Vector2 coordinates with the passed Vector2 coordinates.
         * Returns the updated Vector2.
         */
        Vector2.prototype.copyFrom = function (source) {
            this.x = source.x;
            this.y = source.y;
            return this;
        };
        /**
         * Sets the Vector2 coordinates with the passed floats.
         * Returns the updated Vector2.
         */
        Vector2.prototype.copyFromFloats = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        /**
         * Sets the Vector2 coordinates with the passed floats.
         * Returns the updated Vector2.
         */
        Vector2.prototype.set = function (x, y) {
            return this.copyFromFloats(x, y);
        };
        /**
         * Returns a new Vector2 set with the addition of the current Vector2 and the passed one coordinates.
         */
        Vector2.prototype.add = function (otherVector) {
            return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
        };
        /**
         * Sets the "result" coordinates with the addition of the current Vector2 and the passed one coordinates.
         * Returns the Vector2.
         */
        Vector2.prototype.addToRef = function (otherVector, result) {
            result.x = this.x + otherVector.x;
            result.y = this.y + otherVector.y;
            return this;
        };
        /**
         * Set the Vector2 coordinates by adding the passed Vector2 coordinates.
         * Returns the updated Vector2.
         */
        Vector2.prototype.addInPlace = function (otherVector) {
            this.x += otherVector.x;
            this.y += otherVector.y;
            return this;
        };
        /**
         * Returns a new Vector2 by adding the current Vector2 coordinates to the passed Vector3 x, y coordinates.
         */
        Vector2.prototype.addVector3 = function (otherVector) {
            return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
        };
        /**
         * Returns a new Vector2 set with the subtracted coordinates of the passed one from the current Vector2.
         */
        Vector2.prototype.subtract = function (otherVector) {
            return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
        };
        /**
         * Sets the "result" coordinates with the subtraction of the passed one from the current Vector2 coordinates.
         * Returns the Vector2.
         */
        Vector2.prototype.subtractToRef = function (otherVector, result) {
            result.x = this.x - otherVector.x;
            result.y = this.y - otherVector.y;
            return this;
        };
        /**
         * Sets the current Vector2 coordinates by subtracting from it the passed one coordinates.
         * Returns the updated Vector2.
         */
        Vector2.prototype.subtractInPlace = function (otherVector) {
            this.x -= otherVector.x;
            this.y -= otherVector.y;
            return this;
        };
        /**
         * Multiplies in place the current Vector2 coordinates by the passed ones.
         * Returns the updated Vector2.
         */
        Vector2.prototype.multiplyInPlace = function (otherVector) {
            this.x *= otherVector.x;
            this.y *= otherVector.y;
            return this;
        };
        /**
         * Returns a new Vector2 set with the multiplication of the current Vector2 and the passed one coordinates.
         */
        Vector2.prototype.multiply = function (otherVector) {
            return new Vector2(this.x * otherVector.x, this.y * otherVector.y);
        };
        /**
         * Sets "result" coordinates with the multiplication of the current Vector2 and the passed one coordinates.
         * Returns the Vector2.
         */
        Vector2.prototype.multiplyToRef = function (otherVector, result) {
            result.x = this.x * otherVector.x;
            result.y = this.y * otherVector.y;
            return this;
        };
        /**
         * Returns a new Vector2 set with the Vector2 coordinates multiplied by the passed floats.
         */
        Vector2.prototype.multiplyByFloats = function (x, y) {
            return new Vector2(this.x * x, this.y * y);
        };
        /**
         * Returns a new Vector2 set with the Vector2 coordinates divided by the passed one coordinates.
         */
        Vector2.prototype.divide = function (otherVector) {
            return new Vector2(this.x / otherVector.x, this.y / otherVector.y);
        };
        /**
         * Sets the "result" coordinates with the Vector2 divided by the passed one coordinates.
         * Returns the Vector2.
         */
        Vector2.prototype.divideToRef = function (otherVector, result) {
            result.x = this.x / otherVector.x;
            result.y = this.y / otherVector.y;
            return this;
        };
        /**
         * Returns a new Vector2 with current Vector2 negated coordinates.
         */
        Vector2.prototype.negate = function () {
            return new Vector2(-this.x, -this.y);
        };
        /**
         * Multiply the Vector2 coordinates by scale.
         * Returns the updated Vector2.
         */
        Vector2.prototype.scaleInPlace = function (scale) {
            this.x *= scale;
            this.y *= scale;
            return this;
        };
        /**
         * Returns a new Vector2 scaled by "scale" from the current Vector2.
         */
        Vector2.prototype.scale = function (scale) {
            return new Vector2(this.x * scale, this.y * scale);
        };
        /**
         * Boolean : True if the passed vector coordinates strictly equal the current Vector2 ones.
         */
        Vector2.prototype.equals = function (otherVector) {
            return otherVector && this.x === otherVector.x && this.y === otherVector.y;
        };
        /**
         * Boolean : True if the passed vector coordinates are close to the current ones by a distance of epsilon.
         */
        Vector2.prototype.equalsWithEpsilon = function (otherVector, epsilon) {
            if (epsilon === void 0) { epsilon = BABYLON.Epsilon; }
            return otherVector && BABYLON.Scalar.WithinEpsilon(this.x, otherVector.x, epsilon) && BABYLON.Scalar.WithinEpsilon(this.y, otherVector.y, epsilon);
        };
        // Properties
        /**
         * Returns the vector length (float).
         */
        Vector2.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        /**
         * Returns the vector squared length (float);
         */
        Vector2.prototype.lengthSquared = function () {
            return (this.x * this.x + this.y * this.y);
        };
        // Methods
        /**
         * Normalize the vector.
         * Returns the updated Vector2.
         */
        Vector2.prototype.normalize = function () {
            var len = this.length();
            if (len === 0)
                return this;
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
            return this;
        };
        /**
         * Returns a new Vector2 copied from the Vector2.
         */
        Vector2.prototype.clone = function () {
            return new Vector2(this.x, this.y);
        };
        // Statics
        /**
         * Returns a new Vector2(0, 0)
         */
        Vector2.Zero = function () {
            return new Vector2(0, 0);
        };
        /**
         * Returns a new Vector2(1, 1)
         */
        Vector2.One = function () {
            return new Vector2(1, 1);
        };
        /**
         * Returns a new Vector2 set from the passed index element of the passed array.
         */
        Vector2.FromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            return new Vector2(array[offset], array[offset + 1]);
        };
        /**
         * Sets "result" from the passed index element of the passed array.
         */
        Vector2.FromArrayToRef = function (array, offset, result) {
            result.x = array[offset];
            result.y = array[offset + 1];
        };
        /**
         * Retuns a new Vector2 located for "amount" (float) on the CatmullRom  spline defined by the passed four Vector2.
         */
        Vector2.CatmullRom = function (value1, value2, value3, value4, amount) {
            var squared = amount * amount;
            var cubed = amount * squared;
            var x = 0.5 * ((((2.0 * value2.x) + ((-value1.x + value3.x) * amount)) +
                (((((2.0 * value1.x) - (5.0 * value2.x)) + (4.0 * value3.x)) - value4.x) * squared)) +
                ((((-value1.x + (3.0 * value2.x)) - (3.0 * value3.x)) + value4.x) * cubed));
            var y = 0.5 * ((((2.0 * value2.y) + ((-value1.y + value3.y) * amount)) +
                (((((2.0 * value1.y) - (5.0 * value2.y)) + (4.0 * value3.y)) - value4.y) * squared)) +
                ((((-value1.y + (3.0 * value2.y)) - (3.0 * value3.y)) + value4.y) * cubed));
            return new Vector2(x, y);
        };
        /**
         * Returns a new Vector2 set with same the coordinates than "value" ones if the vector "value" is in the square defined by "min" and "max".
         * If a coordinate of "value" is lower than "min" coordinates, the returned Vector2 is given this "min" coordinate.
         * If a coordinate of "value" is greater than "max" coordinates, the returned Vector2 is given this "max" coordinate.
         */
        Vector2.Clamp = function (value, min, max) {
            var x = value.x;
            x = (x > max.x) ? max.x : x;
            x = (x < min.x) ? min.x : x;
            var y = value.y;
            y = (y > max.y) ? max.y : y;
            y = (y < min.y) ? min.y : y;
            return new Vector2(x, y);
        };
        /**
         * Returns a new Vector2 located for "amount" (float) on the Hermite spline defined by the vectors "value1", "value3", "tangent1", "tangent2".
         */
        Vector2.Hermite = function (value1, tangent1, value2, tangent2, amount) {
            var squared = amount * amount;
            var cubed = amount * squared;
            var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
            var part2 = (-2.0 * cubed) + (3.0 * squared);
            var part3 = (cubed - (2.0 * squared)) + amount;
            var part4 = cubed - squared;
            var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
            var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
            return new Vector2(x, y);
        };
        /**
         * Returns a new Vector2 located for "amount" (float) on the linear interpolation between the vector "start" adn the vector "end".
         */
        Vector2.Lerp = function (start, end, amount) {
            var x = start.x + ((end.x - start.x) * amount);
            var y = start.y + ((end.y - start.y) * amount);
            return new Vector2(x, y);
        };
        /**
         * Returns the dot product (float) of the vector "left" and the vector "right".
         */
        Vector2.Dot = function (left, right) {
            return left.x * right.x + left.y * right.y;
        };
        /**
         * Returns a new Vector2 equal to the normalized passed vector.
         */
        Vector2.Normalize = function (vector) {
            var newVector = vector.clone();
            newVector.normalize();
            return newVector;
        };
        /**
         * Returns a new Vecto2 set with the minimal coordinate values from the "left" and "right" vectors.
         */
        Vector2.Minimize = function (left, right) {
            var x = (left.x < right.x) ? left.x : right.x;
            var y = (left.y < right.y) ? left.y : right.y;
            return new Vector2(x, y);
        };
        /**
         * Returns a new Vecto2 set with the maximal coordinate values from the "left" and "right" vectors.
         */
        Vector2.Maximize = function (left, right) {
            var x = (left.x > right.x) ? left.x : right.x;
            var y = (left.y > right.y) ? left.y : right.y;
            return new Vector2(x, y);
        };
        /**
         * Returns a new Vecto2 set with the transformed coordinates of the passed vector by the passed transformation matrix.
         */
        Vector2.Transform = function (vector, transformation) {
            var r = Vector2.Zero();
            Vector2.TransformToRef(vector, transformation, r);
            return r;
        };
        /**
         * Transforms the passed vector coordinates by the passed transformation matrix and stores the result in the vector "result" coordinates.
         */
        Vector2.TransformToRef = function (vector, transformation, result) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + transformation.m[13];
            result.x = x;
            result.y = y;
        };
        /**
         * Boolean : True if the point "p" is in the triangle defined by the vertors "p0", "p1", "p2"
         */
        Vector2.PointInTriangle = function (p, p0, p1, p2) {
            var a = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
            var sign = a < 0 ? -1 : 1;
            var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
            var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
            return s > 0 && t > 0 && (s + t) < 2 * a * sign;
        };
        /**
         * Returns the distance (float) between the vectors "value1" and "value2".
         */
        Vector2.Distance = function (value1, value2) {
            return Math.sqrt(Vector2.DistanceSquared(value1, value2));
        };
        /**
         * Returns the squared distance (float) between the vectors "value1" and "value2".
         */
        Vector2.DistanceSquared = function (value1, value2) {
            var x = value1.x - value2.x;
            var y = value1.y - value2.y;
            return (x * x) + (y * y);
        };
        /**
         * Returns a new Vecto2 located at the center of the vectors "value1" and "value2".
         */
        Vector2.Center = function (value1, value2) {
            var center = value1.add(value2);
            center.scaleInPlace(0.5);
            return center;
        };
        /**
         * Returns the shortest distance (float) between the point "p" and the segment defined by the two points "segA" and "segB".
         */
        Vector2.DistanceOfPointFromSegment = function (p, segA, segB) {
            var l2 = Vector2.DistanceSquared(segA, segB);
            if (l2 === 0.0) {
                return Vector2.Distance(p, segA);
            }
            var v = segB.subtract(segA);
            var t = Math.max(0, Math.min(1, Vector2.Dot(p.subtract(segA), v) / l2));
            var proj = segA.add(v.multiplyByFloats(t, t));
            return Vector2.Distance(p, proj);
        };
        return Vector2;
    }());
    BABYLON.Vector2 = Vector2;
    var Vector3 = /** @class */ (function () {
        /**
         * Creates a new Vector3 object from the passed x, y, z (floats) coordinates.
         * A Vector3 is the main object used in 3D geometry.
         * It can represent etiher the coordinates of a point the space, either a direction.
         */
        function Vector3(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        /**
         * Returns a string with the Vector3 coordinates.
         */
        Vector3.prototype.toString = function () {
            return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
        };
        /**
         * Returns the string "Vector3"
         */
        Vector3.prototype.getClassName = function () {
            return "Vector3";
        };
        /**
         * Returns the Vector hash code.
         */
        Vector3.prototype.getHashCode = function () {
            var hash = this.x || 0;
            hash = (hash * 397) ^ (this.y || 0);
            hash = (hash * 397) ^ (this.z || 0);
            return hash;
        };
        // Operators
        /**
         * Returns a new array with three elements : the coordinates the Vector3.
         */
        Vector3.prototype.asArray = function () {
            var result = [];
            this.toArray(result, 0);
            return result;
        };
        /**
         * Populates the passed array or Float32Array from the passed index with the successive coordinates of the Vector3.
         * Returns the Vector3.
         */
        Vector3.prototype.toArray = function (array, index) {
            if (index === void 0) { index = 0; }
            array[index] = this.x;
            array[index + 1] = this.y;
            array[index + 2] = this.z;
            return this;
        };
        /**
         * Returns a new Quaternion object, computed from the Vector3 coordinates.
         */
        Vector3.prototype.toQuaternion = function () {
            var result = new Quaternion(0.0, 0.0, 0.0, 1.0);
            var cosxPlusz = Math.cos((this.x + this.z) * 0.5);
            var sinxPlusz = Math.sin((this.x + this.z) * 0.5);
            var coszMinusx = Math.cos((this.z - this.x) * 0.5);
            var sinzMinusx = Math.sin((this.z - this.x) * 0.5);
            var cosy = Math.cos(this.y * 0.5);
            var siny = Math.sin(this.y * 0.5);
            result.x = coszMinusx * siny;
            result.y = -sinzMinusx * siny;
            result.z = sinxPlusz * cosy;
            result.w = cosxPlusz * cosy;
            return result;
        };
        /**
         * Adds the passed vector to the current Vector3.
         * Returns the updated Vector3.
         */
        Vector3.prototype.addInPlace = function (otherVector) {
            this.x += otherVector.x;
            this.y += otherVector.y;
            this.z += otherVector.z;
            return this;
        };
        /**
         * Returns a new Vector3, result of the addition the current Vector3 and the passed vector.
         */
        Vector3.prototype.add = function (otherVector) {
            return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
        };
        /**
         * Adds the current Vector3 to the passed one and stores the result in the vector "result".
         * Returns the current Vector3.
         */
        Vector3.prototype.addToRef = function (otherVector, result) {
            result.x = this.x + otherVector.x;
            result.y = this.y + otherVector.y;
            result.z = this.z + otherVector.z;
            return this;
        };
        /**
         * Subtract the passed vector from the current Vector3.
         * Returns the updated Vector3.
         */
        Vector3.prototype.subtractInPlace = function (otherVector) {
            this.x -= otherVector.x;
            this.y -= otherVector.y;
            this.z -= otherVector.z;
            return this;
        };
        /**
         * Returns a new Vector3, result of the subtraction of the passed vector from the current Vector3.
         */
        Vector3.prototype.subtract = function (otherVector) {
            return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
        };
        /**
         * Subtracts the passed vector from the current Vector3 and stores the result in the vector "result".
         * Returns the current Vector3.
         */
        Vector3.prototype.subtractToRef = function (otherVector, result) {
            result.x = this.x - otherVector.x;
            result.y = this.y - otherVector.y;
            result.z = this.z - otherVector.z;
            return this;
        };
        /**
         * Returns a new Vector3 set with the subtraction of the passed floats from the current Vector3 coordinates.
         */
        Vector3.prototype.subtractFromFloats = function (x, y, z) {
            return new Vector3(this.x - x, this.y - y, this.z - z);
        };
        /**
         * Subtracts the passed floats from the current Vector3 coordinates and set the passed vector "result" with this result.
         * Returns the current Vector3.
         */
        Vector3.prototype.subtractFromFloatsToRef = function (x, y, z, result) {
            result.x = this.x - x;
            result.y = this.y - y;
            result.z = this.z - z;
            return this;
        };
        /**
         * Returns a new Vector3 set with the current Vector3 negated coordinates.
         */
        Vector3.prototype.negate = function () {
            return new Vector3(-this.x, -this.y, -this.z);
        };
        /**
         * Multiplies the Vector3 coordinates by the float "scale".
         * Returns the updated Vector3.
         */
        Vector3.prototype.scaleInPlace = function (scale) {
            this.x *= scale;
            this.y *= scale;
            this.z *= scale;
            return this;
        };
        /**
         * Returns a new Vector3 set with the current Vector3 coordinates multiplied by the float "scale".
         */
        Vector3.prototype.scale = function (scale) {
            return new Vector3(this.x * scale, this.y * scale, this.z * scale);
        };
        /**
         * Multiplies the current Vector3 coordinates by the float "scale" and stores the result in the passed vector "result" coordinates.
         * Returns the current Vector3.
         */
        Vector3.prototype.scaleToRef = function (scale, result) {
            result.x = this.x * scale;
            result.y = this.y * scale;
            result.z = this.z * scale;
            return this;
        };
        /**
         * Boolean : True if the current Vector3 and the passed vector coordinates are strictly equal.
         */
        Vector3.prototype.equals = function (otherVector) {
            return otherVector && this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
        };
        /**
         * Boolean : True if the current Vector3 and the passed vector coordinates are distant less than epsilon.
         */
        Vector3.prototype.equalsWithEpsilon = function (otherVector, epsilon) {
            if (epsilon === void 0) { epsilon = BABYLON.Epsilon; }
            return otherVector && BABYLON.Scalar.WithinEpsilon(this.x, otherVector.x, epsilon) && BABYLON.Scalar.WithinEpsilon(this.y, otherVector.y, epsilon) && BABYLON.Scalar.WithinEpsilon(this.z, otherVector.z, epsilon);
        };
        /**
         * Boolean : True if the current Vector3 coordinate equal the passed floats.
         */
        Vector3.prototype.equalsToFloats = function (x, y, z) {
            return this.x === x && this.y === y && this.z === z;
        };
        /**
         * Muliplies the current Vector3 coordinates by the passed ones.
         * Returns the updated Vector3.
         */
        Vector3.prototype.multiplyInPlace = function (otherVector) {
            this.x *= otherVector.x;
            this.y *= otherVector.y;
            this.z *= otherVector.z;
            return this;
        };
        /**
         * Returns a new Vector3, result of the multiplication of the current Vector3 by the passed vector.
         */
        Vector3.prototype.multiply = function (otherVector) {
            return new Vector3(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z);
        };
        /**
         * Multiplies the current Vector3 by the passed one and stores the result in the passed vector "result".
         * Returns the current Vector3.
         */
        Vector3.prototype.multiplyToRef = function (otherVector, result) {
            result.x = this.x * otherVector.x;
            result.y = this.y * otherVector.y;
            result.z = this.z * otherVector.z;
            return this;
        };
        /**
         * Returns a new Vector3 set witth the result of the mulliplication of the current Vector3 coordinates by the passed floats.
         */
        Vector3.prototype.multiplyByFloats = function (x, y, z) {
            return new Vector3(this.x * x, this.y * y, this.z * z);
        };
        /**
         * Returns a new Vector3 set witth the result of the division of the current Vector3 coordinates by the passed ones.
         */
        Vector3.prototype.divide = function (otherVector) {
            return new Vector3(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
        };
        /**
         * Divides the current Vector3 coordinates by the passed ones and stores the result in the passed vector "result".
         * Returns the current Vector3.
         */
        Vector3.prototype.divideToRef = function (otherVector, result) {
            result.x = this.x / otherVector.x;
            result.y = this.y / otherVector.y;
            result.z = this.z / otherVector.z;
            return this;
        };
        /**
         * Updates the current Vector3 with the minimal coordinate values between its and the passed vector ones.
         * Returns the updated Vector3.
         */
        Vector3.prototype.MinimizeInPlace = function (other) {
            if (other.x < this.x)
                this.x = other.x;
            if (other.y < this.y)
                this.y = other.y;
            if (other.z < this.z)
                this.z = other.z;
            return this;
        };
        /**
         * Updates the current Vector3 with the maximal coordinate values between its and the passed vector ones.
         * Returns the updated Vector3.
         */
        Vector3.prototype.MaximizeInPlace = function (other) {
            if (other.x > this.x)
                this.x = other.x;
            if (other.y > this.y)
                this.y = other.y;
            if (other.z > this.z)
                this.z = other.z;
            return this;
        };
        Object.defineProperty(Vector3.prototype, "isNonUniform", {
            /**
             * Return true is the vector is non uniform meaning x, y or z are not all the same.
             */
            get: function () {
                var absX = Math.abs(this.x);
                var absY = Math.abs(this.y);
                if (absX !== absY) {
                    return true;
                }
                var absZ = Math.abs(this.z);
                if (absX !== absZ) {
                    return true;
                }
                if (absY !== absZ) {
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        // Properties
        /**
         * Returns the length of the Vector3 (float).
         */
        Vector3.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        /**
         * Returns the squared length of the Vector3 (float).
         */
        Vector3.prototype.lengthSquared = function () {
            return (this.x * this.x + this.y * this.y + this.z * this.z);
        };
        /**
         * Normalize the current Vector3.
         * Returns the updated Vector3.
         * /!\ In place operation.
         */
        Vector3.prototype.normalize = function () {
            var len = this.length();
            if (len === 0 || len === 1.0)
                return this;
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
            this.z *= num;
            return this;
        };
        /**
         * Normalize the current Vector3 to a new vector.
         * @returns the new Vector3.
         */
        Vector3.prototype.normalizeToNew = function () {
            var normalized = new Vector3(0, 0, 0);
            this.normalizeToRef(normalized);
            return normalized;
        };
        /**
         * Normalize the current Vector3 to the reference.
         * @param the reference to update.
         * @returns the updated Vector3.
         */
        Vector3.prototype.normalizeToRef = function (reference) {
            var len = this.length();
            if (len === 0 || len === 1.0) {
                reference.set(this.x, this.y, this.z);
                return reference;
            }
            var scale = 1.0 / len;
            this.scaleToRef(scale, reference);
            return reference;
        };
        /**
         * Returns a new Vector3 copied from the current Vector3.
         */
        Vector3.prototype.clone = function () {
            return new Vector3(this.x, this.y, this.z);
        };
        /**
         * Copies the passed vector coordinates to the current Vector3 ones.
         * Returns the updated Vector3.
         */
        Vector3.prototype.copyFrom = function (source) {
            this.x = source.x;
            this.y = source.y;
            this.z = source.z;
            return this;
        };
        /**
         * Copies the passed floats to the current Vector3 coordinates.
         * Returns the updated Vector3.
         */
        Vector3.prototype.copyFromFloats = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        /**
         * Copies the passed floats to the current Vector3 coordinates.
         * Returns the updated Vector3.
         */
        Vector3.prototype.set = function (x, y, z) {
            return this.copyFromFloats(x, y, z);
        };
        // Statics
        /**
         *
         */
        Vector3.GetClipFactor = function (vector0, vector1, axis, size) {
            var d0 = Vector3.Dot(vector0, axis) - size;
            var d1 = Vector3.Dot(vector1, axis) - size;
            var s = d0 / (d0 - d1);
            return s;
        };
        /**
         * Returns a new Vector3 set from the index "offset" of the passed array.
         */
        Vector3.FromArray = function (array, offset) {
            if (!offset) {
                offset = 0;
            }
            return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
        };
        /**
         * Returns a new Vector3 set from the index "offset" of the passed Float32Array.
         * This function is deprecated.  Use FromArray instead.
         */
        Vector3.FromFloatArray = function (array, offset) {
            return Vector3.FromArray(array, offset);
        };
        /**
         * Sets the passed vector "result" with the element values from the index "offset" of the passed array.
         */
        Vector3.FromArrayToRef = function (array, offset, result) {
            result.x = array[offset];
            result.y = array[offset + 1];
            result.z = array[offset + 2];
        };
        /**
         * Sets the passed vector "result" with the element values from the index "offset" of the passed Float32Array.
         * This function is deprecated.  Use FromArrayToRef instead.
         */
        Vector3.FromFloatArrayToRef = function (array, offset, result) {
            return Vector3.FromArrayToRef(array, offset, result);
        };
        /**
         * Sets the passed vector "result" with the passed floats.
         */
        Vector3.FromFloatsToRef = function (x, y, z, result) {
            result.x = x;
            result.y = y;
            result.z = z;
        };
        /**
         * Returns a new Vector3 set to (0.0, 0.0, 0.0).
         */
        Vector3.Zero = function () {
            return new Vector3(0.0, 0.0, 0.0);
        };
        /**
         * Returns a new Vector3 set to (1.0, 1.0, 1.0).
         */
        Vector3.One = function () {
            return new Vector3(1.0, 1.0, 1.0);
        };
        /**
         * Returns a new Vector3 set to (0.0, 1.0, 0.0)
         */
        Vector3.Up = function () {
            return new Vector3(0.0, 1.0, 0.0);
        };
        /**
         * Returns a new Vector3 set to (0.0, 0.0, 1.0)
         */
        Vector3.Forward = function () {
            return new Vector3(0.0, 0.0, 1.0);
        };
        /**
         * Returns a new Vector3 set to (1.0, 0.0, 0.0)
         */
        Vector3.Right = function () {
            return new Vector3(1.0, 0.0, 0.0);
        };
        /**
         * Returns a new Vector3 set to (-1.0, 0.0, 0.0)
         */
        Vector3.Left = function () {
            return new Vector3(-1.0, 0.0, 0.0);
        };
        /**
         * Returns a new Vector3 set with the result of the transformation by the passed matrix of the passed vector.
         * This method computes tranformed coordinates only, not transformed direction vectors.
         */
        Vector3.TransformCoordinates = function (vector, transformation) {
            var result = Vector3.Zero();
            Vector3.TransformCoordinatesToRef(vector, transformation, result);
            return result;
        };
        /**
         * Sets the passed vector "result" coordinates with the result of the transformation by the passed matrix of the passed vector.
         * This method computes tranformed coordinates only, not transformed direction vectors.
         */
        Vector3.TransformCoordinatesToRef = function (vector, transformation, result) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
            var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
            result.x = x / w;
            result.y = y / w;
            result.z = z / w;
        };
        /**
         * Sets the passed vector "result" coordinates with the result of the transformation by the passed matrix of the passed floats (x, y, z).
         * This method computes tranformed coordinates only, not transformed direction vectors.
         */
        Vector3.TransformCoordinatesFromFloatsToRef = function (x, y, z, transformation, result) {
            var rx = (x * transformation.m[0]) + (y * transformation.m[4]) + (z * transformation.m[8]) + transformation.m[12];
            var ry = (x * transformation.m[1]) + (y * transformation.m[5]) + (z * transformation.m[9]) + transformation.m[13];
            var rz = (x * transformation.m[2]) + (y * transformation.m[6]) + (z * transformation.m[10]) + transformation.m[14];
            var rw = (x * transformation.m[3]) + (y * transformation.m[7]) + (z * transformation.m[11]) + transformation.m[15];
            result.x = rx / rw;
            result.y = ry / rw;
            result.z = rz / rw;
        };
        /**
         * Returns a new Vector3 set with the result of the normal transformation by the passed matrix of the passed vector.
         * This methods computes transformed normalized direction vectors only.
         */
        Vector3.TransformNormal = function (vector, transformation) {
            var result = Vector3.Zero();
            Vector3.TransformNormalToRef(vector, transformation, result);
            return result;
        };
        /**
         * Sets the passed vector "result" with the result of the normal transformation by the passed matrix of the passed vector.
         * This methods computes transformed normalized direction vectors only.
         */
        Vector3.TransformNormalToRef = function (vector, transformation, result) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
            result.x = x;
            result.y = y;
            result.z = z;
        };
        /**
         * Sets the passed vector "result" with the result of the normal transformation by the passed matrix of the passed floats (x, y, z).
         * This methods computes transformed normalized direction vectors only.
         */
        Vector3.TransformNormalFromFloatsToRef = function (x, y, z, transformation, result) {
            result.x = (x * transformation.m[0]) + (y * transformation.m[4]) + (z * transformation.m[8]);
            result.y = (x * transformation.m[1]) + (y * transformation.m[5]) + (z * transformation.m[9]);
            result.z = (x * transformation.m[2]) + (y * transformation.m[6]) + (z * transformation.m[10]);
        };
        /**
         * Returns a new Vector3 located for "amount" on the CatmullRom interpolation spline defined by the vectors "value1", "value2", "value3", "value4".
         */
        Vector3.CatmullRom = function (value1, value2, value3, value4, amount) {
            var squared = amount * amount;
            var cubed = amount * squared;
            var x = 0.5 * ((((2.0 * value2.x) + ((-value1.x + value3.x) * amount)) +
                (((((2.0 * value1.x) - (5.0 * value2.x)) + (4.0 * value3.x)) - value4.x) * squared)) +
                ((((-value1.x + (3.0 * value2.x)) - (3.0 * value3.x)) + value4.x) * cubed));
            var y = 0.5 * ((((2.0 * value2.y) + ((-value1.y + value3.y) * amount)) +
                (((((2.0 * value1.y) - (5.0 * value2.y)) + (4.0 * value3.y)) - value4.y) * squared)) +
                ((((-value1.y + (3.0 * value2.y)) - (3.0 * value3.y)) + value4.y) * cubed));
            var z = 0.5 * ((((2.0 * value2.z) + ((-value1.z + value3.z) * amount)) +
                (((((2.0 * value1.z) - (5.0 * value2.z)) + (4.0 * value3.z)) - value4.z) * squared)) +
                ((((-value1.z + (3.0 * value2.z)) - (3.0 * value3.z)) + value4.z) * cubed));
            return new Vector3(x, y, z);
        };
        /**
         * Returns a new Vector3 set with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max".
         * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one.
         * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one.
         */
        Vector3.Clamp = function (value, min, max) {
            var x = value.x;
            x = (x > max.x) ? max.x : x;
            x = (x < min.x) ? min.x : x;
            var y = value.y;
            y = (y > max.y) ? max.y : y;
            y = (y < min.y) ? min.y : y;
            var z = value.z;
            z = (z > max.z) ? max.z : z;
            z = (z < min.z) ? min.z : z;
            return new Vector3(x, y, z);
        };
        /**
         * Returns a new Vector3 located for "amount" (float) on the Hermite interpolation spline defined by the vectors "value1", "tangent1", "value2", "tangent2".
         */
        Vector3.Hermite = function (value1, tangent1, value2, tangent2, amount) {
            var squared = amount * amount;
            var cubed = amount * squared;
            var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
            var part2 = (-2.0 * cubed) + (3.0 * squared);
            var part3 = (cubed - (2.0 * squared)) + amount;
            var part4 = cubed - squared;
            var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
            var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
            var z = (((value1.z * part1) + (value2.z * part2)) + (tangent1.z * part3)) + (tangent2.z * part4);
            return new Vector3(x, y, z);
        };
        /**
         * Returns a new Vector3 located for "amount" (float) on the linear interpolation between the vectors "start" and "end".
         */
        Vector3.Lerp = function (start, end, amount) {
            var result = new Vector3(0, 0, 0);
            Vector3.LerpToRef(start, end, amount, result);
            return result;
        };
        /**
         * Sets the passed vector "result" with the result of the linear interpolation from the vector "start" for "amount" to the vector "end".
         */
        Vector3.LerpToRef = function (start, end, amount, result) {
            result.x = start.x + ((end.x - start.x) * amount);
            result.y = start.y + ((end.y - start.y) * amount);
            result.z = start.z + ((end.z - start.z) * amount);
        };
        /**
         * Returns the dot product (float) between the vectors "left" and "right".
         */
        Vector3.Dot = function (left, right) {
            return (left.x * right.x + left.y * right.y + left.z * right.z);
        };
        /**
         * Returns a new Vector3 as the cross product of the vectors "left" and "right".
         * The cross product is then orthogonal to both "left" and "right".
         */
        Vector3.Cross = function (left, right) {
            var result = Vector3.Zero();
            Vector3.CrossToRef(left, right, result);
            return result;
        };
        /**
         * Sets the passed vector "result" with the cross product of "left" and "right".
         * The cross product is then orthogonal to both "left" and "right".
         */
        Vector3.CrossToRef = function (left, right, result) {
            MathTmp.Vector3[0].x = left.y * right.z - left.z * right.y;
            MathTmp.Vector3[0].y = left.z * right.x - left.x * right.z;
            MathTmp.Vector3[0].z = left.x * right.y - left.y * right.x;
            result.copyFrom(MathTmp.Vector3[0]);
        };
        /**
         * Returns a new Vector3 as the normalization of the passed vector.
         */
        Vector3.Normalize = function (vector) {
            var result = Vector3.Zero();
            Vector3.NormalizeToRef(vector, result);
            return result;
        };
        /**
         * Sets the passed vector "result" with the normalization of the passed first vector.
         */
        Vector3.NormalizeToRef = function (vector, result) {
            result.copyFrom(vector);
            result.normalize();
        };
        Vector3.Project = function (vector, world, transform, viewport) {
            var cw = viewport.width;
            var ch = viewport.height;
            var cx = viewport.x;
            var cy = viewport.y;
            var viewportMatrix = Vector3._viewportMatrixCache ? Vector3._viewportMatrixCache : (Vector3._viewportMatrixCache = new Matrix());
            Matrix.FromValuesToRef(cw / 2.0, 0, 0, 0, 0, -ch / 2.0, 0, 0, 0, 0, 0.5, 0, cx + cw / 2.0, ch / 2.0 + cy, 0.5, 1, viewportMatrix);
            var matrix = MathTmp.Matrix[0];
            world.multiplyToRef(transform, matrix);
            matrix.multiplyToRef(viewportMatrix, matrix);
            return Vector3.TransformCoordinates(vector, matrix);
        };
        Vector3.UnprojectFromTransform = function (source, viewportWidth, viewportHeight, world, transform) {
            var matrix = MathTmp.Matrix[0];
            world.multiplyToRef(transform, matrix);
            matrix.invert();
            source.x = source.x / viewportWidth * 2 - 1;
            source.y = -(source.y / viewportHeight * 2 - 1);
            var vector = Vector3.TransformCoordinates(source, matrix);
            var num = source.x * matrix.m[3] + source.y * matrix.m[7] + source.z * matrix.m[11] + matrix.m[15];
            if (BABYLON.Scalar.WithinEpsilon(num, 1.0)) {
                vector = vector.scale(1.0 / num);
            }
            return vector;
        };
        Vector3.Unproject = function (source, viewportWidth, viewportHeight, world, view, projection) {
            var result = Vector3.Zero();
            Vector3.UnprojectToRef(source, viewportWidth, viewportHeight, world, view, projection, result);
            return result;
        };
        Vector3.UnprojectToRef = function (source, viewportWidth, viewportHeight, world, view, projection, result) {
            Vector3.UnprojectFloatsToRef(source.x, source.y, source.z, viewportWidth, viewportHeight, world, view, projection, result);
        };
        Vector3.UnprojectFloatsToRef = function (sourceX, sourceY, sourceZ, viewportWidth, viewportHeight, world, view, projection, result) {
            var matrix = MathTmp.Matrix[0];
            world.multiplyToRef(view, matrix);
            matrix.multiplyToRef(projection, matrix);
            matrix.invert();
            var screenSource = MathTmp.Vector3[0];
            screenSource.x = sourceX / viewportWidth * 2 - 1;
            screenSource.y = -(sourceY / viewportHeight * 2 - 1);
            screenSource.z = 2 * sourceZ - 1.0;
            Vector3.TransformCoordinatesToRef(screenSource, matrix, result);
            var num = screenSource.x * matrix.m[3] + screenSource.y * matrix.m[7] + screenSource.z * matrix.m[11] + matrix.m[15];
            if (BABYLON.Scalar.WithinEpsilon(num, 1.0)) {
                result.scaleInPlace(1.0 / num);
            }
        };
        Vector3.Minimize = function (left, right) {
            var min = left.clone();
            min.MinimizeInPlace(right);
            return min;
        };
        Vector3.Maximize = function (left, right) {
            var max = left.clone();
            max.MaximizeInPlace(right);
            return max;
        };
        /**
         * Returns the distance (float) between the vectors "value1" and "value2".
         */
        Vector3.Distance = function (value1, value2) {
            return Math.sqrt(Vector3.DistanceSquared(value1, value2));
        };
        /**
         * Returns the squared distance (float) between the vectors "value1" and "value2".
         */
        Vector3.DistanceSquared = function (value1, value2) {
            var x = value1.x - value2.x;
            var y = value1.y - value2.y;
            var z = value1.z - value2.z;
            return (x * x) + (y * y) + (z * z);
        };
        /**
         * Returns a new Vector3 located at the center between "value1" and "value2".
         */
        Vector3.Center = function (value1, value2) {
            var center = value1.add(value2);
            center.scaleInPlace(0.5);
            return center;
        };
        /**
         * Given three orthogonal normalized left-handed oriented Vector3 axis in space (target system),
         * RotationFromAxis() returns the rotation Euler angles (ex : rotation.x, rotation.y, rotation.z) to apply
         * to something in order to rotate it from its local system to the given target system.
         * Note : axis1, axis2 and axis3 are normalized during this operation.
         * Returns a new Vector3.
         */
        Vector3.RotationFromAxis = function (axis1, axis2, axis3) {
            var rotation = Vector3.Zero();
            Vector3.RotationFromAxisToRef(axis1, axis2, axis3, rotation);
            return rotation;
        };
        /**
         * The same than RotationFromAxis but updates the passed ref Vector3 parameter instead of returning a new Vector3.
         */
        Vector3.RotationFromAxisToRef = function (axis1, axis2, axis3, ref) {
            var quat = MathTmp.Quaternion[0];
            Quaternion.RotationQuaternionFromAxisToRef(axis1, axis2, axis3, quat);
            quat.toEulerAnglesToRef(ref);
        };
        return Vector3;
    }());
    BABYLON.Vector3 = Vector3;
    //Vector4 class created for EulerAngle class conversion to Quaternion
    var Vector4 = /** @class */ (function () {
        /**
         * Creates a Vector4 object from the passed floats.
         */
        function Vector4(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        /**
         * Returns the string with the Vector4 coordinates.
         */
        Vector4.prototype.toString = function () {
            return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + " W:" + this.w + "}";
        };
        /**
         * Returns the string "Vector4".
         */
        Vector4.prototype.getClassName = function () {
            return "Vector4";
        };
        /**
         * Returns the Vector4 hash code.
         */
        Vector4.prototype.getHashCode = function () {
            var hash = this.x || 0;
            hash = (hash * 397) ^ (this.y || 0);
            hash = (hash * 397) ^ (this.z || 0);
            hash = (hash * 397) ^ (this.w || 0);
            return hash;
        };
        // Operators
        /**
         * Returns a new array populated with 4 elements : the Vector4 coordinates.
         */
        Vector4.prototype.asArray = function () {
            var result = new Array();
            this.toArray(result, 0);
            return result;
        };
        /**
         * Populates the passed array from the passed index with the Vector4 coordinates.
         * Returns the Vector4.
         */
        Vector4.prototype.toArray = function (array, index) {
            if (index === undefined) {
                index = 0;
            }
            array[index] = this.x;
            array[index + 1] = this.y;
            array[index + 2] = this.z;
            array[index + 3] = this.w;
            return this;
        };
        /**
         * Adds the passed vector to the current Vector4.
         * Returns the updated Vector4.
         */
        Vector4.prototype.addInPlace = function (otherVector) {
            this.x += otherVector.x;
            this.y += otherVector.y;
            this.z += otherVector.z;
            this.w += otherVector.w;
            return this;
        };
        /**
         * Returns a new Vector4 as the result of the addition of the current Vector4 and the passed one.
         */
        Vector4.prototype.add = function (otherVector) {
            return new Vector4(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z, this.w + otherVector.w);
        };
        /**
         * Updates the passed vector "result" with the result of the addition of the current Vector4 and the passed one.
         * Returns the current Vector4.
         */
        Vector4.prototype.addToRef = function (otherVector, result) {
            result.x = this.x + otherVector.x;
            result.y = this.y + otherVector.y;
            result.z = this.z + otherVector.z;
            result.w = this.w + otherVector.w;
            return this;
        };
        /**
         * Subtract in place the passed vector from the current Vector4.
         * Returns the updated Vector4.
         */
        Vector4.prototype.subtractInPlace = function (otherVector) {
            this.x -= otherVector.x;
            this.y -= otherVector.y;
            this.z -= otherVector.z;
            this.w -= otherVector.w;
            return this;
        };
        /**
         * Returns a new Vector4 with the result of the subtraction of the passed vector from the current Vector4.
         */
        Vector4.prototype.subtract = function (otherVector) {
            return new Vector4(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z, this.w - otherVector.w);
        };
        /**
         * Sets the passed vector "result" with the result of the subtraction of the passed vector from the current Vector4.
         * Returns the current Vector4.
         */
        Vector4.prototype.subtractToRef = function (otherVector, result) {
            result.x = this.x - otherVector.x;
            result.y = this.y - otherVector.y;
            result.z = this.z - otherVector.z;
            result.w = this.w - otherVector.w;
            return this;
        };
        /**
         * Returns a new Vector4 set with the result of the subtraction of the passed floats from the current Vector4 coordinates.
         */
        Vector4.prototype.subtractFromFloats = function (x, y, z, w) {
            return new Vector4(this.x - x, this.y - y, this.z - z, this.w - w);
        };
        /**
         * Sets the passed vector "result" set with the result of the subtraction of the passed floats from the current Vector4 coordinates.
         * Returns the current Vector4.
         */
        Vector4.prototype.subtractFromFloatsToRef = function (x, y, z, w, result) {
            result.x = this.x - x;
            result.y = this.y - y;
            result.z = this.z - z;
            result.w = this.w - w;
            return this;
        };
        /**
         * Returns a new Vector4 set with the current Vector4 negated coordinates.
         */
        Vector4.prototype.negate = function () {
            return new Vector4(-this.x, -this.y, -this.z, -this.w);
        };
        /**
         * Multiplies the current Vector4 coordinates by scale (float).
         * Returns the updated Vector4.
         */
        Vector4.prototype.scaleInPlace = function (scale) {
            this.x *= scale;
            this.y *= scale;
            this.z *= scale;
            this.w *= scale;
            return this;
        };
        /**
         * Returns a new Vector4 set with the current Vector4 coordinates multiplied by scale (float).
         */
        Vector4.prototype.scale = function (scale) {
            return new Vector4(this.x * scale, this.y * scale, this.z * scale, this.w * scale);
        };
        /**
         * Sets the passed vector "result" with the current Vector4 coordinates multiplied by scale (float).
         * Returns the current Vector4.
         */
        Vector4.prototype.scaleToRef = function (scale, result) {
            result.x = this.x * scale;
            result.y = this.y * scale;
            result.z = this.z * scale;
            result.w = this.w * scale;
            return this;
        };
        /**
         * Boolean : True if the current Vector4 coordinates are stricly equal to the passed ones.
         */
        Vector4.prototype.equals = function (otherVector) {
            return otherVector && this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z && this.w === otherVector.w;
        };
        /**
         * Boolean : True if the current Vector4 coordinates are each beneath the distance "epsilon" from the passed vector ones.
         */
        Vector4.prototype.equalsWithEpsilon = function (otherVector, epsilon) {
            if (epsilon === void 0) { epsilon = BABYLON.Epsilon; }
            return otherVector
                && BABYLON.Scalar.WithinEpsilon(this.x, otherVector.x, epsilon)
                && BABYLON.Scalar.WithinEpsilon(this.y, otherVector.y, epsilon)
                && BABYLON.Scalar.WithinEpsilon(this.z, otherVector.z, epsilon)
                && BABYLON.Scalar.WithinEpsilon(this.w, otherVector.w, epsilon);
        };
        /**
         * Boolean : True if the passed floats are strictly equal to the current Vector4 coordinates.
         */
        Vector4.prototype.equalsToFloats = function (x, y, z, w) {
            return this.x === x && this.y === y && this.z === z && this.w === w;
        };
        /**
         * Multiplies in place the current Vector4 by the passed one.
         * Returns the updated Vector4.
         */
        Vector4.prototype.multiplyInPlace = function (otherVector) {
            this.x *= otherVector.x;
            this.y *= otherVector.y;
            this.z *= otherVector.z;
            this.w *= otherVector.w;
            return this;
        };
        /**
         * Returns a new Vector4 set with the multiplication result of the current Vector4 and the passed one.
         */
        Vector4.prototype.multiply = function (otherVector) {
            return new Vector4(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z, this.w * otherVector.w);
        };
        /**
         * Updates the passed vector "result" with the multiplication result of the current Vector4 and the passed one.
         * Returns the current Vector4.
         */
        Vector4.prototype.multiplyToRef = function (otherVector, result) {
            result.x = this.x * otherVector.x;
            result.y = this.y * otherVector.y;
            result.z = this.z * otherVector.z;
            result.w = this.w * otherVector.w;
            return this;
        };
        /**
         * Returns a new Vector4 set with the multiplication result of the passed floats and the current Vector4 coordinates.
         */
        Vector4.prototype.multiplyByFloats = function (x, y, z, w) {
            return new Vector4(this.x * x, this.y * y, this.z * z, this.w * w);
        };
        /**
         * Returns a new Vector4 set with the division result of the current Vector4 by the passed one.
         */
        Vector4.prototype.divide = function (otherVector) {
            return new Vector4(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z, this.w / otherVector.w);
        };
        /**
         * Updates the passed vector "result" with the division result of the current Vector4 by the passed one.
         * Returns the current Vector4.
         */
        Vector4.prototype.divideToRef = function (otherVector, result) {
            result.x = this.x / otherVector.x;
            result.y = this.y / otherVector.y;
            result.z = this.z / otherVector.z;
            result.w = this.w / otherVector.w;
            return this;
        };
        /**
         * Updates the Vector4 coordinates with the minimum values between its own and the passed vector ones.
         */
        Vector4.prototype.MinimizeInPlace = function (other) {
            if (other.x < this.x)
                this.x = other.x;
            if (other.y < this.y)
                this.y = other.y;
            if (other.z < this.z)
                this.z = other.z;
            if (other.w < this.w)
                this.w = other.w;
            return this;
        };
        /**
         * Updates the Vector4 coordinates with the maximum values between its own and the passed vector ones.
         */
        Vector4.prototype.MaximizeInPlace = function (other) {
            if (other.x > this.x)
                this.x = other.x;
            if (other.y > this.y)
                this.y = other.y;
            if (other.z > this.z)
                this.z = other.z;
            if (other.w > this.w)
                this.w = other.w;
            return this;
        };
        // Properties
        /**
         * Returns the Vector4 length (float).
         */
        Vector4.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        };
        /**
         * Returns the Vector4 squared length (float).
         */
        Vector4.prototype.lengthSquared = function () {
            return (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        };
        // Methods
        /**
         * Normalizes in place the Vector4.
         * Returns the updated Vector4.
         */
        Vector4.prototype.normalize = function () {
            var len = this.length();
            if (len === 0)
                return this;
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
            this.z *= num;
            this.w *= num;
            return this;
        };
        /**
         * Returns a new Vector3 from the Vector4 (x, y, z) coordinates.
         */
        Vector4.prototype.toVector3 = function () {
            return new Vector3(this.x, this.y, this.z);
        };
        /**
         * Returns a new Vector4 copied from the current one.
         */
        Vector4.prototype.clone = function () {
            return new Vector4(this.x, this.y, this.z, this.w);
        };
        /**
         * Updates the current Vector4 with the passed one coordinates.
         * Returns the updated Vector4.
         */
        Vector4.prototype.copyFrom = function (source) {
            this.x = source.x;
            this.y = source.y;
            this.z = source.z;
            this.w = source.w;
            return this;
        };
        /**
         * Updates the current Vector4 coordinates with the passed floats.
         * Returns the updated Vector4.
         */
        Vector4.prototype.copyFromFloats = function (x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        };
        /**
         * Updates the current Vector4 coordinates with the passed floats.
         * Returns the updated Vector4.
         */
        Vector4.prototype.set = function (x, y, z, w) {
            return this.copyFromFloats(x, y, z, w);
        };
        // Statics
        /**
         * Returns a new Vector4 set from the starting index of the passed array.
         */
        Vector4.FromArray = function (array, offset) {
            if (!offset) {
                offset = 0;
            }
            return new Vector4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
        };
        /**
         * Updates the passed vector "result" from the starting index of the passed array.
         */
        Vector4.FromArrayToRef = function (array, offset, result) {
            result.x = array[offset];
            result.y = array[offset + 1];
            result.z = array[offset + 2];
            result.w = array[offset + 3];
        };
        /**
         * Updates the passed vector "result" from the starting index of the passed Float32Array.
         */
        Vector4.FromFloatArrayToRef = function (array, offset, result) {
            Vector4.FromArrayToRef(array, offset, result);
        };
        /**
         * Updates the passed vector "result" coordinates from the passed floats.
         */
        Vector4.FromFloatsToRef = function (x, y, z, w, result) {
            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
        };
        /**
         * Returns a new Vector4 set to (0.0, 0.0, 0.0, 0.0)
         */
        Vector4.Zero = function () {
            return new Vector4(0.0, 0.0, 0.0, 0.0);
        };
        /**
         * Returns a new Vector4 set to (1.0, 1.0, 1.0, 1.0)
         */
        Vector4.One = function () {
            return new Vector4(1.0, 1.0, 1.0, 1.0);
        };
        /**
         * Returns a new normalized Vector4 from the passed one.
         */
        Vector4.Normalize = function (vector) {
            var result = Vector4.Zero();
            Vector4.NormalizeToRef(vector, result);
            return result;
        };
        /**
         * Updates the passed vector "result" from the normalization of the passed one.
         */
        Vector4.NormalizeToRef = function (vector, result) {
            result.copyFrom(vector);
            result.normalize();
        };
        Vector4.Minimize = function (left, right) {
            var min = left.clone();
            min.MinimizeInPlace(right);
            return min;
        };
        Vector4.Maximize = function (left, right) {
            var max = left.clone();
            max.MaximizeInPlace(right);
            return max;
        };
        /**
         * Returns the distance (float) between the vectors "value1" and "value2".
         */
        Vector4.Distance = function (value1, value2) {
            return Math.sqrt(Vector4.DistanceSquared(value1, value2));
        };
        /**
         * Returns the squared distance (float) between the vectors "value1" and "value2".
         */
        Vector4.DistanceSquared = function (value1, value2) {
            var x = value1.x - value2.x;
            var y = value1.y - value2.y;
            var z = value1.z - value2.z;
            var w = value1.w - value2.w;
            return (x * x) + (y * y) + (z * z) + (w * w);
        };
        /**
         * Returns a new Vector4 located at the center between the vectors "value1" and "value2".
         */
        Vector4.Center = function (value1, value2) {
            var center = value1.add(value2);
            center.scaleInPlace(0.5);
            return center;
        };
        /**
         * Returns a new Vector4 set with the result of the normal transformation by the passed matrix of the passed vector.
         * This methods computes transformed normalized direction vectors only.
         */
        Vector4.TransformNormal = function (vector, transformation) {
            var result = Vector4.Zero();
            Vector4.TransformNormalToRef(vector, transformation, result);
            return result;
        };
        /**
         * Sets the passed vector "result" with the result of the normal transformation by the passed matrix of the passed vector.
         * This methods computes transformed normalized direction vectors only.
         */
        Vector4.TransformNormalToRef = function (vector, transformation, result) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
            result.x = x;
            result.y = y;
            result.z = z;
            result.w = vector.w;
        };
        /**
         * Sets the passed vector "result" with the result of the normal transformation by the passed matrix of the passed floats (x, y, z, w).
         * This methods computes transformed normalized direction vectors only.
         */
        Vector4.TransformNormalFromFloatsToRef = function (x, y, z, w, transformation, result) {
            result.x = (x * transformation.m[0]) + (y * transformation.m[4]) + (z * transformation.m[8]);
            result.y = (x * transformation.m[1]) + (y * transformation.m[5]) + (z * transformation.m[9]);
            result.z = (x * transformation.m[2]) + (y * transformation.m[6]) + (z * transformation.m[10]);
            result.w = w;
        };
        return Vector4;
    }());
    BABYLON.Vector4 = Vector4;
    var Size = /** @class */ (function () {
        /**
         * Creates a Size object from the passed width and height (floats).
         */
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        // Returns a string with the Size width and height.
        Size.prototype.toString = function () {
            return "{W: " + this.width + ", H: " + this.height + "}";
        };
        /**
         * Returns the string "Size"
         */
        Size.prototype.getClassName = function () {
            return "Size";
        };
        /**
         * Returns the Size hash code.
         */
        Size.prototype.getHashCode = function () {
            var hash = this.width || 0;
            hash = (hash * 397) ^ (this.height || 0);
            return hash;
        };
        /**
         * Updates the current size from the passed one.
         * Returns the updated Size.
         */
        Size.prototype.copyFrom = function (src) {
            this.width = src.width;
            this.height = src.height;
        };
        /**
         * Updates in place the current Size from the passed floats.
         * Returns the updated Size.
         */
        Size.prototype.copyFromFloats = function (width, height) {
            this.width = width;
            this.height = height;
            return this;
        };
        /**
         * Updates in place the current Size from the passed floats.
         * Returns the updated Size.
         */
        Size.prototype.set = function (width, height) {
            return this.copyFromFloats(width, height);
        };
        /**
         * Returns a new Size set with the multiplication result of the current Size and the passed floats.
         */
        Size.prototype.multiplyByFloats = function (w, h) {
            return new Size(this.width * w, this.height * h);
        };
        /**
         * Returns a new Size copied from the passed one.
         */
        Size.prototype.clone = function () {
            return new Size(this.width, this.height);
        };
        /**
         * Boolean : True if the current Size and the passed one width and height are strictly equal.
         */
        Size.prototype.equals = function (other) {
            if (!other) {
                return false;
            }
            return (this.width === other.width) && (this.height === other.height);
        };
        Object.defineProperty(Size.prototype, "surface", {
            /**
             * Returns the surface of the Size : width * height (float).
             */
            get: function () {
                return this.width * this.height;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns a new Size set to (0.0, 0.0)
         */
        Size.Zero = function () {
            return new Size(0.0, 0.0);
        };
        /**
         * Returns a new Size set as the addition result of the current Size and the passed one.
         */
        Size.prototype.add = function (otherSize) {
            var r = new Size(this.width + otherSize.width, this.height + otherSize.height);
            return r;
        };
        /**
         * Returns a new Size set as the subtraction result of  the passed one from the current Size.
         */
        Size.prototype.subtract = function (otherSize) {
            var r = new Size(this.width - otherSize.width, this.height - otherSize.height);
            return r;
        };
        /**
         * Returns a new Size set at the linear interpolation "amount" between "start" and "end".
         */
        Size.Lerp = function (start, end, amount) {
            var w = start.width + ((end.width - start.width) * amount);
            var h = start.height + ((end.height - start.height) * amount);
            return new Size(w, h);
        };
        return Size;
    }());
    BABYLON.Size = Size;
    var Quaternion = /** @class */ (function () {
        /**
         * Creates a new Quaternion from the passed floats.
         */
        function Quaternion(x, y, z, w) {
            if (x === void 0) { x = 0.0; }
            if (y === void 0) { y = 0.0; }
            if (z === void 0) { z = 0.0; }
            if (w === void 0) { w = 1.0; }
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        /**
         * Returns a string with the Quaternion coordinates.
         */
        Quaternion.prototype.toString = function () {
            return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + " W:" + this.w + "}";
        };
        /**
         * Returns the string "Quaternion".
         */
        Quaternion.prototype.getClassName = function () {
            return "Quaternion";
        };
        /**
         * Returns the Quaternion hash code.
         */
        Quaternion.prototype.getHashCode = function () {
            var hash = this.x || 0;
            hash = (hash * 397) ^ (this.y || 0);
            hash = (hash * 397) ^ (this.z || 0);
            hash = (hash * 397) ^ (this.w || 0);
            return hash;
        };
        /**
         * Returns a new array populated with 4 elements : the Quaternion coordinates.
         */
        Quaternion.prototype.asArray = function () {
            return [this.x, this.y, this.z, this.w];
        };
        /**
         * Boolean : True if the current Quaterion and the passed one coordinates are strictly equal.
         */
        Quaternion.prototype.equals = function (otherQuaternion) {
            return otherQuaternion && this.x === otherQuaternion.x && this.y === otherQuaternion.y && this.z === otherQuaternion.z && this.w === otherQuaternion.w;
        };
        /**
         * Returns a new Quaternion copied from the current one.
         */
        Quaternion.prototype.clone = function () {
            return new Quaternion(this.x, this.y, this.z, this.w);
        };
        /**
         * Updates the current Quaternion from the passed one coordinates.
         * Returns the updated Quaterion.
         */
        Quaternion.prototype.copyFrom = function (other) {
            this.x = other.x;
            this.y = other.y;
            this.z = other.z;
            this.w = other.w;
            return this;
        };
        /**
         * Updates the current Quaternion from the passed float coordinates.
         * Returns the updated Quaterion.
         */
        Quaternion.prototype.copyFromFloats = function (x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        };
        /**
         * Updates the current Quaternion from the passed float coordinates.
         * Returns the updated Quaterion.
         */
        Quaternion.prototype.set = function (x, y, z, w) {
            return this.copyFromFloats(x, y, z, w);
        };
        /**
         * Returns a new Quaternion as the addition result of the passed one and the current Quaternion.
         */
        Quaternion.prototype.add = function (other) {
            return new Quaternion(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
        };
        /**
         * Returns a new Quaternion as the subtraction result of the passed one from the current Quaternion.
         */
        Quaternion.prototype.subtract = function (other) {
            return new Quaternion(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
        };
        /**
         * Returns a new Quaternion set by multiplying the current Quaterion coordinates by the float "scale".
         */
        Quaternion.prototype.scale = function (value) {
            return new Quaternion(this.x * value, this.y * value, this.z * value, this.w * value);
        };
        /**
         * Returns a new Quaternion set as the quaternion mulplication result of the current one with the passed one "q1".
         */
        Quaternion.prototype.multiply = function (q1) {
            var result = new Quaternion(0, 0, 0, 1.0);
            this.multiplyToRef(q1, result);
            return result;
        };
        /**
         * Sets the passed "result" as the quaternion mulplication result of the current one with the passed one "q1".
         * Returns the current Quaternion.
         */
        Quaternion.prototype.multiplyToRef = function (q1, result) {
            var x = this.x * q1.w + this.y * q1.z - this.z * q1.y + this.w * q1.x;
            var y = -this.x * q1.z + this.y * q1.w + this.z * q1.x + this.w * q1.y;
            var z = this.x * q1.y - this.y * q1.x + this.z * q1.w + this.w * q1.z;
            var w = -this.x * q1.x - this.y * q1.y - this.z * q1.z + this.w * q1.w;
            result.copyFromFloats(x, y, z, w);
            return this;
        };
        /**
         * Updates the current Quaternion with the quaternion mulplication result of itself with the passed one "q1".
         * Returns the updated Quaternion.
         */
        Quaternion.prototype.multiplyInPlace = function (q1) {
            this.multiplyToRef(q1, this);
            return this;
        };
        /**
         * Sets the passed "ref" with the conjugation of the current Quaternion.
         * Returns the current Quaternion.
         */
        Quaternion.prototype.conjugateToRef = function (ref) {
            ref.copyFromFloats(-this.x, -this.y, -this.z, this.w);
            return this;
        };
        /**
         * Conjugates in place the current Quaternion.
         * Returns the updated Quaternion.
         */
        Quaternion.prototype.conjugateInPlace = function () {
            this.x *= -1;
            this.y *= -1;
            this.z *= -1;
            return this;
        };
        /**
         * Returns a new Quaternion as the conjugate of the current Quaternion.
         */
        Quaternion.prototype.conjugate = function () {
            var result = new Quaternion(-this.x, -this.y, -this.z, this.w);
            return result;
        };
        /**
         * Returns the Quaternion length (float).
         */
        Quaternion.prototype.length = function () {
            return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
        };
        /**
         * Normalize in place the current Quaternion.
         * Returns the updated Quaternion.
         */
        Quaternion.prototype.normalize = function () {
            var length = 1.0 / this.length();
            this.x *= length;
            this.y *= length;
            this.z *= length;
            this.w *= length;
            return this;
        };
        /**
         * Returns a new Vector3 set with the Euler angles translated from the current Quaternion.
         */
        Quaternion.prototype.toEulerAngles = function (order) {
            if (order === void 0) { order = "YZX"; }
            var result = Vector3.Zero();
            this.toEulerAnglesToRef(result, order);
            return result;
        };
        /**
         * Sets the passed vector3 "result" with the Euler angles translated from the current Quaternion.
         * Returns the current Quaternion.
         */
        Quaternion.prototype.toEulerAnglesToRef = function (result, order) {
            if (order === void 0) { order = "YZX"; }
            var qz = this.z;
            var qx = this.x;
            var qy = this.y;
            var qw = this.w;
            var sqw = qw * qw;
            var sqz = qz * qz;
            var sqx = qx * qx;
            var sqy = qy * qy;
            var zAxisY = qy * qz - qx * qw;
            var limit = .4999999;
            if (zAxisY < -limit) {
                result.y = 2 * Math.atan2(qy, qw);
                result.x = Math.PI / 2;
                result.z = 0;
            }
            else if (zAxisY > limit) {
                result.y = 2 * Math.atan2(qy, qw);
                result.x = -Math.PI / 2;
                result.z = 0;
            }
            else {
                result.z = Math.atan2(2.0 * (qx * qy + qz * qw), (-sqz - sqx + sqy + sqw));
                result.x = Math.asin(-2.0 * (qz * qy - qx * qw));
                result.y = Math.atan2(2.0 * (qz * qx + qy * qw), (sqz - sqx - sqy + sqw));
            }
            return this;
        };
        /**
         * Updates the passed rotation matrix with the current Quaternion values.
         * Returns the current Quaternion.
         */
        Quaternion.prototype.toRotationMatrix = function (result) {
            var xx = this.x * this.x;
            var yy = this.y * this.y;
            var zz = this.z * this.z;
            var xy = this.x * this.y;
            var zw = this.z * this.w;
            var zx = this.z * this.x;
            var yw = this.y * this.w;
            var yz = this.y * this.z;
            var xw = this.x * this.w;
            result.m[0] = 1.0 - (2.0 * (yy + zz));
            result.m[1] = 2.0 * (xy + zw);
            result.m[2] = 2.0 * (zx - yw);
            result.m[3] = 0;
            result.m[4] = 2.0 * (xy - zw);
            result.m[5] = 1.0 - (2.0 * (zz + xx));
            result.m[6] = 2.0 * (yz + xw);
            result.m[7] = 0;
            result.m[8] = 2.0 * (zx + yw);
            result.m[9] = 2.0 * (yz - xw);
            result.m[10] = 1.0 - (2.0 * (yy + xx));
            result.m[11] = 0;
            result.m[12] = 0;
            result.m[13] = 0;
            result.m[14] = 0;
            result.m[15] = 1.0;
            result._markAsUpdated();
            return this;
        };
        /**
         * Updates the current Quaternion from the passed rotation matrix values.
         * Returns the updated Quaternion.
         */
        Quaternion.prototype.fromRotationMatrix = function (matrix) {
            Quaternion.FromRotationMatrixToRef(matrix, this);
            return this;
        };
        // Statics
        /**
         * Returns a new Quaternion set from the passed rotation matrix values.
         */
        Quaternion.FromRotationMatrix = function (matrix) {
            var result = new Quaternion();
            Quaternion.FromRotationMatrixToRef(matrix, result);
            return result;
        };
        /**
         * Updates the passed quaternion "result" with the passed rotation matrix values.
         */
        Quaternion.FromRotationMatrixToRef = function (matrix, result) {
            var data = matrix.m;
            var m11 = data[0], m12 = data[4], m13 = data[8];
            var m21 = data[1], m22 = data[5], m23 = data[9];
            var m31 = data[2], m32 = data[6], m33 = data[10];
            var trace = m11 + m22 + m33;
            var s;
            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1.0);
                result.w = 0.25 / s;
                result.x = (m32 - m23) * s;
                result.y = (m13 - m31) * s;
                result.z = (m21 - m12) * s;
            }
            else if (m11 > m22 && m11 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
                result.w = (m32 - m23) / s;
                result.x = 0.25 * s;
                result.y = (m12 + m21) / s;
                result.z = (m13 + m31) / s;
            }
            else if (m22 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
                result.w = (m13 - m31) / s;
                result.x = (m12 + m21) / s;
                result.y = 0.25 * s;
                result.z = (m23 + m32) / s;
            }
            else {
                s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
                result.w = (m21 - m12) / s;
                result.x = (m13 + m31) / s;
                result.y = (m23 + m32) / s;
                result.z = 0.25 * s;
            }
        };
        /**
         * Returns a new Quaternion set to (0.0, 0.0, 0.0).
         */
        Quaternion.Zero = function () {
            return new Quaternion(0.0, 0.0, 0.0, 0.0);
        };
        /**
         * Returns a new Quaternion as the inverted current Quaternion.
         */
        Quaternion.Inverse = function (q) {
            return new Quaternion(-q.x, -q.y, -q.z, q.w);
        };
        /**
         * Returns the identity Quaternion.
         */
        Quaternion.Identity = function () {
            return new Quaternion(0.0, 0.0, 0.0, 1.0);
        };
        Quaternion.IsIdentity = function (quaternion) {
            return quaternion && quaternion.x === 0 && quaternion.y === 0 && quaternion.z === 0 && quaternion.w === 1;
        };
        /**
         * Returns a new Quaternion set from the passed axis (Vector3) and angle in radians (float).
         */
        Quaternion.RotationAxis = function (axis, angle) {
            return Quaternion.RotationAxisToRef(axis, angle, new Quaternion());
        };
        /**
         * Sets the passed quaternion "result" from the passed axis (Vector3) and angle in radians (float).
         */
        Quaternion.RotationAxisToRef = function (axis, angle, result) {
            var sin = Math.sin(angle / 2);
            axis.normalize();
            result.w = Math.cos(angle / 2);
            result.x = axis.x * sin;
            result.y = axis.y * sin;
            result.z = axis.z * sin;
            return result;
        };
        /**
         * Retuns a new Quaternion set from the starting index of the passed array.
         */
        Quaternion.FromArray = function (array, offset) {
            if (!offset) {
                offset = 0;
            }
            return new Quaternion(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
        };
        /**
         * Returns a new Quaternion set from the passed Euler float angles (y, x, z).
         */
        Quaternion.RotationYawPitchRoll = function (yaw, pitch, roll) {
            var q = new Quaternion();
            Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, q);
            return q;
        };
        /**
         * Sets the passed quaternion "result" from the passed float Euler angles (y, x, z).
         */
        Quaternion.RotationYawPitchRollToRef = function (yaw, pitch, roll, result) {
            // Produces a quaternion from Euler angles in the z-y-x orientation (Tait-Bryan angles)
            var halfRoll = roll * 0.5;
            var halfPitch = pitch * 0.5;
            var halfYaw = yaw * 0.5;
            var sinRoll = Math.sin(halfRoll);
            var cosRoll = Math.cos(halfRoll);
            var sinPitch = Math.sin(halfPitch);
            var cosPitch = Math.cos(halfPitch);
            var sinYaw = Math.sin(halfYaw);
            var cosYaw = Math.cos(halfYaw);
            result.x = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
            result.y = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
            result.z = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
            result.w = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);
        };
        /**
         * Returns a new Quaternion from the passed float Euler angles expressed in z-x-z orientation
         */
        Quaternion.RotationAlphaBetaGamma = function (alpha, beta, gamma) {
            var result = new Quaternion();
            Quaternion.RotationAlphaBetaGammaToRef(alpha, beta, gamma, result);
            return result;
        };
        /**
         * Sets the passed quaternion "result" from the passed float Euler angles expressed in z-x-z orientation
         */
        Quaternion.RotationAlphaBetaGammaToRef = function (alpha, beta, gamma, result) {
            // Produces a quaternion from Euler angles in the z-x-z orientation
            var halfGammaPlusAlpha = (gamma + alpha) * 0.5;
            var halfGammaMinusAlpha = (gamma - alpha) * 0.5;
            var halfBeta = beta * 0.5;
            result.x = Math.cos(halfGammaMinusAlpha) * Math.sin(halfBeta);
            result.y = Math.sin(halfGammaMinusAlpha) * Math.sin(halfBeta);
            result.z = Math.sin(halfGammaPlusAlpha) * Math.cos(halfBeta);
            result.w = Math.cos(halfGammaPlusAlpha) * Math.cos(halfBeta);
        };
        /**
         * Returns a new Quaternion as the quaternion rotation value to reach the target (axis1, axis2, axis3) orientation as a rotated XYZ system.
         * cf to Vector3.RotationFromAxis() documentation.
         * Note : axis1, axis2 and axis3 are normalized during this operation.
         */
        Quaternion.RotationQuaternionFromAxis = function (axis1, axis2, axis3, ref) {
            var quat = new Quaternion(0.0, 0.0, 0.0, 0.0);
            Quaternion.RotationQuaternionFromAxisToRef(axis1, axis2, axis3, quat);
            return quat;
        };
        /**
         * Sets the passed quaternion "ref" with the quaternion rotation value to reach the target (axis1, axis2, axis3) orientation as a rotated XYZ system.
         * cf to Vector3.RotationFromAxis() documentation.
         * Note : axis1, axis2 and axis3 are normalized during this operation.
         */
        Quaternion.RotationQuaternionFromAxisToRef = function (axis1, axis2, axis3, ref) {
            var rotMat = MathTmp.Matrix[0];
            Matrix.FromXYZAxesToRef(axis1.normalize(), axis2.normalize(), axis3.normalize(), rotMat);
            Quaternion.FromRotationMatrixToRef(rotMat, ref);
        };
        Quaternion.Slerp = function (left, right, amount) {
            var result = Quaternion.Identity();
            Quaternion.SlerpToRef(left, right, amount, result);
            return result;
        };
        Quaternion.SlerpToRef = function (left, right, amount, result) {
            var num2;
            var num3;
            var num = amount;
            var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
            var flag = false;
            if (num4 < 0) {
                flag = true;
                num4 = -num4;
            }
            if (num4 > 0.999999) {
                num3 = 1 - num;
                num2 = flag ? -num : num;
            }
            else {
                var num5 = Math.acos(num4);
                var num6 = (1.0 / Math.sin(num5));
                num3 = (Math.sin((1.0 - num) * num5)) * num6;
                num2 = flag ? ((-Math.sin(num * num5)) * num6) : ((Math.sin(num * num5)) * num6);
            }
            result.x = (num3 * left.x) + (num2 * right.x);
            result.y = (num3 * left.y) + (num2 * right.y);
            result.z = (num3 * left.z) + (num2 * right.z);
            result.w = (num3 * left.w) + (num2 * right.w);
        };
        /**
         * Returns a new Quaternion located for "amount" (float) on the Hermite interpolation spline defined by the vectors "value1", "tangent1", "value2", "tangent2".
         */
        Quaternion.Hermite = function (value1, tangent1, value2, tangent2, amount) {
            var squared = amount * amount;
            var cubed = amount * squared;
            var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
            var part2 = (-2.0 * cubed) + (3.0 * squared);
            var part3 = (cubed - (2.0 * squared)) + amount;
            var part4 = cubed - squared;
            var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
            var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
            var z = (((value1.z * part1) + (value2.z * part2)) + (tangent1.z * part3)) + (tangent2.z * part4);
            var w = (((value1.w * part1) + (value2.w * part2)) + (tangent1.w * part3)) + (tangent2.w * part4);
            return new Quaternion(x, y, z, w);
        };
        return Quaternion;
    }());
    BABYLON.Quaternion = Quaternion;
    var Matrix = /** @class */ (function () {
        function Matrix() {
            this._isIdentity = false;
            this._isIdentityDirty = true;
            this.m = new Float32Array(16);
            this._markAsUpdated();
        }
        Matrix.prototype._markAsUpdated = function () {
            this.updateFlag = Matrix._updateFlagSeed++;
            this._isIdentityDirty = true;
        };
        // Properties
        /**
         * Boolean : True is the matrix is the identity matrix
         */
        Matrix.prototype.isIdentity = function (considerAsTextureMatrix) {
            if (considerAsTextureMatrix === void 0) { considerAsTextureMatrix = false; }
            if (this._isIdentityDirty) {
                this._isIdentityDirty = false;
                if (this.m[0] !== 1.0 || this.m[5] !== 1.0 || this.m[15] !== 1.0) {
                    this._isIdentity = false;
                }
                else if (this.m[1] !== 0.0 || this.m[2] !== 0.0 || this.m[3] !== 0.0 ||
                    this.m[4] !== 0.0 || this.m[6] !== 0.0 || this.m[7] !== 0.0 ||
                    this.m[8] !== 0.0 || this.m[9] !== 0.0 || this.m[11] !== 0.0 ||
                    this.m[12] !== 0.0 || this.m[13] !== 0.0 || this.m[14] !== 0.0) {
                    this._isIdentity = false;
                }
                else {
                    this._isIdentity = true;
                }
                if (!considerAsTextureMatrix && this.m[10] !== 1.0) {
                    this._isIdentity = false;
                }
            }
            return this._isIdentity;
        };
        /**
         * Returns the matrix determinant (float).
         */
        Matrix.prototype.determinant = function () {
            var temp1 = (this.m[10] * this.m[15]) - (this.m[11] * this.m[14]);
            var temp2 = (this.m[9] * this.m[15]) - (this.m[11] * this.m[13]);
            var temp3 = (this.m[9] * this.m[14]) - (this.m[10] * this.m[13]);
            var temp4 = (this.m[8] * this.m[15]) - (this.m[11] * this.m[12]);
            var temp5 = (this.m[8] * this.m[14]) - (this.m[10] * this.m[12]);
            var temp6 = (this.m[8] * this.m[13]) - (this.m[9] * this.m[12]);
            return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) -
                (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) -
                (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
        };
        // Methods
        /**
         * Returns the matrix underlying array.
         */
        Matrix.prototype.toArray = function () {
            return this.m;
        };
        /**
        * Returns the matrix underlying array.
        */
        Matrix.prototype.asArray = function () {
            return this.toArray();
        };
        /**
         * Inverts in place the Matrix.
         * Returns the Matrix inverted.
         */
        Matrix.prototype.invert = function () {
            this.invertToRef(this);
            return this;
        };
        /**
         * Sets all the matrix elements to zero.
         * Returns the Matrix.
         */
        Matrix.prototype.reset = function () {
            for (var index = 0; index < 16; index++) {
                this.m[index] = 0.0;
            }
            this._markAsUpdated();
            return this;
        };
        /**
         * Returns a new Matrix as the addition result of the current Matrix and the passed one.
         */
        Matrix.prototype.add = function (other) {
            var result = new Matrix();
            this.addToRef(other, result);
            return result;
        };
        /**
         * Sets the passed matrix "result" with the ddition result of the current Matrix and the passed one.
         * Returns the Matrix.
         */
        Matrix.prototype.addToRef = function (other, result) {
            for (var index = 0; index < 16; index++) {
                result.m[index] = this.m[index] + other.m[index];
            }
            result._markAsUpdated();
            return this;
        };
        /**
         * Adds in place the passed matrix to the current Matrix.
         * Returns the updated Matrix.
         */
        Matrix.prototype.addToSelf = function (other) {
            for (var index = 0; index < 16; index++) {
                this.m[index] += other.m[index];
            }
            this._markAsUpdated();
            return this;
        };
        /**
         * Sets the passed matrix with the current inverted Matrix.
         * Returns the unmodified current Matrix.
         */
        Matrix.prototype.invertToRef = function (other) {
            var l1 = this.m[0];
            var l2 = this.m[1];
            var l3 = this.m[2];
            var l4 = this.m[3];
            var l5 = this.m[4];
            var l6 = this.m[5];
            var l7 = this.m[6];
            var l8 = this.m[7];
            var l9 = this.m[8];
            var l10 = this.m[9];
            var l11 = this.m[10];
            var l12 = this.m[11];
            var l13 = this.m[12];
            var l14 = this.m[13];
            var l15 = this.m[14];
            var l16 = this.m[15];
            var l17 = (l11 * l16) - (l12 * l15);
            var l18 = (l10 * l16) - (l12 * l14);
            var l19 = (l10 * l15) - (l11 * l14);
            var l20 = (l9 * l16) - (l12 * l13);
            var l21 = (l9 * l15) - (l11 * l13);
            var l22 = (l9 * l14) - (l10 * l13);
            var l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
            var l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
            var l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
            var l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
            var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            var l28 = (l7 * l16) - (l8 * l15);
            var l29 = (l6 * l16) - (l8 * l14);
            var l30 = (l6 * l15) - (l7 * l14);
            var l31 = (l5 * l16) - (l8 * l13);
            var l32 = (l5 * l15) - (l7 * l13);
            var l33 = (l5 * l14) - (l6 * l13);
            var l34 = (l7 * l12) - (l8 * l11);
            var l35 = (l6 * l12) - (l8 * l10);
            var l36 = (l6 * l11) - (l7 * l10);
            var l37 = (l5 * l12) - (l8 * l9);
            var l38 = (l5 * l11) - (l7 * l9);
            var l39 = (l5 * l10) - (l6 * l9);
            other.m[0] = l23 * l27;
            other.m[4] = l24 * l27;
            other.m[8] = l25 * l27;
            other.m[12] = l26 * l27;
            other.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
            other.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
            other.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
            other.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
            other.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
            other.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
            other.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
            other.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
            other.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
            other.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
            other.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
            other.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
            other._markAsUpdated();
            return this;
        };
        /**
         * Inserts the translation vector (using 3 x floats) in the current Matrix.
         * Returns the updated Matrix.
         */
        Matrix.prototype.setTranslationFromFloats = function (x, y, z) {
            this.m[12] = x;
            this.m[13] = y;
            this.m[14] = z;
            this._markAsUpdated();
            return this;
        };
        /**
 * Inserts the translation vector in the current Matrix.
 * Returns the updated Matrix.
 */
        Matrix.prototype.setTranslation = function (vector3) {
            this.m[12] = vector3.x;
            this.m[13] = vector3.y;
            this.m[14] = vector3.z;
            this._markAsUpdated();
            return this;
        };
        /**
         * Returns a new Vector3 as the extracted translation from the Matrix.
         */
        Matrix.prototype.getTranslation = function () {
            return new Vector3(this.m[12], this.m[13], this.m[14]);
        };
        /**
         * Fill a Vector3 with the extracted translation from the Matrix.
         */
        Matrix.prototype.getTranslationToRef = function (result) {
            result.x = this.m[12];
            result.y = this.m[13];
            result.z = this.m[14];
            return this;
        };
        /**
         * Remove rotation and scaling part from the Matrix.
         * Returns the updated Matrix.
         */
        Matrix.prototype.removeRotationAndScaling = function () {
            this.setRowFromFloats(0, 1, 0, 0, 0);
            this.setRowFromFloats(1, 0, 1, 0, 0);
            this.setRowFromFloats(2, 0, 0, 1, 0);
            return this;
        };
        /**
         * Returns a new Matrix set with the multiplication result of the current Matrix and the passed one.
         */
        Matrix.prototype.multiply = function (other) {
            var result = new Matrix();
            this.multiplyToRef(other, result);
            return result;
        };
        /**
         * Updates the current Matrix from the passed one values.
         * Returns the updated Matrix.
         */
        Matrix.prototype.copyFrom = function (other) {
            for (var index = 0; index < 16; index++) {
                this.m[index] = other.m[index];
            }
            this._markAsUpdated();
            return this;
        };
        /**
         * Populates the passed array from the starting index with the Matrix values.
         * Returns the Matrix.
         */
        Matrix.prototype.copyToArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            for (var index = 0; index < 16; index++) {
                array[offset + index] = this.m[index];
            }
            return this;
        };
        /**
         * Sets the passed matrix "result" with the multiplication result of the current Matrix and the passed one.
         */
        Matrix.prototype.multiplyToRef = function (other, result) {
            this.multiplyToArray(other, result.m, 0);
            result._markAsUpdated();
            return this;
        };
        /**
         * Sets the Float32Array "result" from the passed index "offset" with the multiplication result of the current Matrix and the passed one.
         */
        Matrix.prototype.multiplyToArray = function (other, result, offset) {
            var tm0 = this.m[0];
            var tm1 = this.m[1];
            var tm2 = this.m[2];
            var tm3 = this.m[3];
            var tm4 = this.m[4];
            var tm5 = this.m[5];
            var tm6 = this.m[6];
            var tm7 = this.m[7];
            var tm8 = this.m[8];
            var tm9 = this.m[9];
            var tm10 = this.m[10];
            var tm11 = this.m[11];
            var tm12 = this.m[12];
            var tm13 = this.m[13];
            var tm14 = this.m[14];
            var tm15 = this.m[15];
            var om0 = other.m[0];
            var om1 = other.m[1];
            var om2 = other.m[2];
            var om3 = other.m[3];
            var om4 = other.m[4];
            var om5 = other.m[5];
            var om6 = other.m[6];
            var om7 = other.m[7];
            var om8 = other.m[8];
            var om9 = other.m[9];
            var om10 = other.m[10];
            var om11 = other.m[11];
            var om12 = other.m[12];
            var om13 = other.m[13];
            var om14 = other.m[14];
            var om15 = other.m[15];
            result[offset] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
            result[offset + 1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
            result[offset + 2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
            result[offset + 3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;
            result[offset + 4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
            result[offset + 5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
            result[offset + 6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
            result[offset + 7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;
            result[offset + 8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
            result[offset + 9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
            result[offset + 10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
            result[offset + 11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;
            result[offset + 12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
            result[offset + 13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
            result[offset + 14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
            result[offset + 15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;
            return this;
        };
        /**
         * Boolean : True is the current Matrix and the passed one values are strictly equal.
         */
        Matrix.prototype.equals = function (value) {
            return value &&
                (this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] &&
                    this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] &&
                    this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] &&
                    this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15]);
        };
        /**
         * Returns a new Matrix from the current Matrix.
         */
        Matrix.prototype.clone = function () {
            return Matrix.FromValues(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5], this.m[6], this.m[7], this.m[8], this.m[9], this.m[10], this.m[11], this.m[12], this.m[13], this.m[14], this.m[15]);
        };
        /**
         * Returns the string "Matrix"
         */
        Matrix.prototype.getClassName = function () {
            return "Matrix";
        };
        /**
         * Returns the Matrix hash code.
         */
        Matrix.prototype.getHashCode = function () {
            var hash = this.m[0] || 0;
            for (var i = 1; i < 16; i++) {
                hash = (hash * 397) ^ (this.m[i] || 0);
            }
            return hash;
        };
        /**
         * Decomposes the current Matrix into :
         * - a scale vector3 passed as a reference to update,
         * - a rotation quaternion passed as a reference to update,
         * - a translation vector3 passed as a reference to update.
         * Returns the boolean `true`.
         */
        Matrix.prototype.decompose = function (scale, rotation, translation) {
            translation.x = this.m[12];
            translation.y = this.m[13];
            translation.z = this.m[14];
            scale.x = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1] + this.m[2] * this.m[2]);
            scale.y = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5] + this.m[6] * this.m[6]);
            scale.z = Math.sqrt(this.m[8] * this.m[8] + this.m[9] * this.m[9] + this.m[10] * this.m[10]);
            if (this.determinant() <= 0) {
                scale.y *= -1;
            }
            if (scale.x === 0 || scale.y === 0 || scale.z === 0) {
                rotation.x = 0;
                rotation.y = 0;
                rotation.z = 0;
                rotation.w = 1;
                return false;
            }
            Matrix.FromValuesToRef(this.m[0] / scale.x, this.m[1] / scale.x, this.m[2] / scale.x, 0, this.m[4] / scale.y, this.m[5] / scale.y, this.m[6] / scale.y, 0, this.m[8] / scale.z, this.m[9] / scale.z, this.m[10] / scale.z, 0, 0, 0, 0, 1, MathTmp.Matrix[0]);
            Quaternion.FromRotationMatrixToRef(MathTmp.Matrix[0], rotation);
            return true;
        };
        /**
         * Returns a new Matrix as the extracted rotation matrix from the current one.
         */
        Matrix.prototype.getRotationMatrix = function () {
            var result = Matrix.Identity();
            this.getRotationMatrixToRef(result);
            return result;
        };
        /**
         * Extracts the rotation matrix from the current one and sets it as the passed "result".
         * Returns the current Matrix.
         */
        Matrix.prototype.getRotationMatrixToRef = function (result) {
            var m = this.m;
            var xs = m[0] * m[1] * m[2] * m[3] < 0 ? -1 : 1;
            var ys = m[4] * m[5] * m[6] * m[7] < 0 ? -1 : 1;
            var zs = m[8] * m[9] * m[10] * m[11] < 0 ? -1 : 1;
            var sx = xs * Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
            var sy = ys * Math.sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]);
            var sz = zs * Math.sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);
            Matrix.FromValuesToRef(m[0] / sx, m[1] / sx, m[2] / sx, 0, m[4] / sy, m[5] / sy, m[6] / sy, 0, m[8] / sz, m[9] / sz, m[10] / sz, 0, 0, 0, 0, 1, result);
            return this;
        };
        // Statics
        /**
         * Returns a new Matrix set from the starting index of the passed array.
         */
        Matrix.FromArray = function (array, offset) {
            var result = new Matrix();
            if (!offset) {
                offset = 0;
            }
            Matrix.FromArrayToRef(array, offset, result);
            return result;
        };
        /**
         * Sets the passed "result" matrix from the starting index of the passed array.
         */
        Matrix.FromArrayToRef = function (array, offset, result) {
            for (var index = 0; index < 16; index++) {
                result.m[index] = array[index + offset];
            }
            result._markAsUpdated();
        };
        /**
         * Sets the passed "result" matrix from the starting index of the passed Float32Array by multiplying each element by the float "scale".
         */
        Matrix.FromFloat32ArrayToRefScaled = function (array, offset, scale, result) {
            for (var index = 0; index < 16; index++) {
                result.m[index] = array[index + offset] * scale;
            }
            result._markAsUpdated();
        };
        /**
         * Sets the passed matrix "result" with the 16 passed floats.
         */
        Matrix.FromValuesToRef = function (initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44, result) {
            result.m[0] = initialM11;
            result.m[1] = initialM12;
            result.m[2] = initialM13;
            result.m[3] = initialM14;
            result.m[4] = initialM21;
            result.m[5] = initialM22;
            result.m[6] = initialM23;
            result.m[7] = initialM24;
            result.m[8] = initialM31;
            result.m[9] = initialM32;
            result.m[10] = initialM33;
            result.m[11] = initialM34;
            result.m[12] = initialM41;
            result.m[13] = initialM42;
            result.m[14] = initialM43;
            result.m[15] = initialM44;
            result._markAsUpdated();
        };
        /**
         * Returns the index-th row of the current matrix as a new Vector4.
         */
        Matrix.prototype.getRow = function (index) {
            if (index < 0 || index > 3) {
                return null;
            }
            var i = index * 4;
            return new Vector4(this.m[i + 0], this.m[i + 1], this.m[i + 2], this.m[i + 3]);
        };
        /**
         * Sets the index-th row of the current matrix with the passed Vector4 values.
         * Returns the updated Matrix.
         */
        Matrix.prototype.setRow = function (index, row) {
            if (index < 0 || index > 3) {
                return this;
            }
            var i = index * 4;
            this.m[i + 0] = row.x;
            this.m[i + 1] = row.y;
            this.m[i + 2] = row.z;
            this.m[i + 3] = row.w;
            this._markAsUpdated();
            return this;
        };
        /**
         * Compute the transpose of the matrix.
         * Returns a new Matrix.
         */
        Matrix.prototype.transpose = function () {
            return Matrix.Transpose(this);
        };
        /**
         * Compute the transpose of the matrix.
         * Returns the current matrix.
         */
        Matrix.prototype.transposeToRef = function (result) {
            Matrix.TransposeToRef(this, result);
            return this;
        };
        /**
         * Sets the index-th row of the current matrix with the passed 4 x float values.
         * Returns the updated Matrix.
         */
        Matrix.prototype.setRowFromFloats = function (index, x, y, z, w) {
            if (index < 0 || index > 3) {
                return this;
            }
            var i = index * 4;
            this.m[i + 0] = x;
            this.m[i + 1] = y;
            this.m[i + 2] = z;
            this.m[i + 3] = w;
            this._markAsUpdated();
            return this;
        };
        Object.defineProperty(Matrix, "IdentityReadOnly", {
            /**
             * Static identity matrix to be used as readonly matrix
             * Must not be updated.
             */
            get: function () {
                return Matrix._identityReadOnly;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns a new Matrix set from the 16 passed floats.
         */
        Matrix.FromValues = function (initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
            var result = new Matrix();
            result.m[0] = initialM11;
            result.m[1] = initialM12;
            result.m[2] = initialM13;
            result.m[3] = initialM14;
            result.m[4] = initialM21;
            result.m[5] = initialM22;
            result.m[6] = initialM23;
            result.m[7] = initialM24;
            result.m[8] = initialM31;
            result.m[9] = initialM32;
            result.m[10] = initialM33;
            result.m[11] = initialM34;
            result.m[12] = initialM41;
            result.m[13] = initialM42;
            result.m[14] = initialM43;
            result.m[15] = initialM44;
            return result;
        };
        /**
         * Returns a new Matrix composed by the passed scale (vector3), rotation (quaternion) and translation (vector3).
         */
        Matrix.Compose = function (scale, rotation, translation) {
            var result = Matrix.Identity();
            Matrix.ComposeToRef(scale, rotation, translation, result);
            return result;
        };
        /**
       * Update a Matrix with values composed by the passed scale (vector3), rotation (quaternion) and translation (vector3).
       */
        Matrix.ComposeToRef = function (scale, rotation, translation, result) {
            Matrix.FromValuesToRef(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1, MathTmp.Matrix[1]);
            rotation.toRotationMatrix(MathTmp.Matrix[0]);
            MathTmp.Matrix[1].multiplyToRef(MathTmp.Matrix[0], result);
            result.setTranslation(translation);
        };
        /**
         * Returns a new indentity Matrix.
         */
        Matrix.Identity = function () {
            return Matrix.FromValues(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
        };
        /**
         * Sets the passed "result" as an identity matrix.
         */
        Matrix.IdentityToRef = function (result) {
            Matrix.FromValuesToRef(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, result);
        };
        /**
         * Returns a new zero Matrix.
         */
        Matrix.Zero = function () {
            return Matrix.FromValues(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        };
        /**
         * Returns a new rotation matrix for "angle" radians around the X axis.
         */
        Matrix.RotationX = function (angle) {
            var result = new Matrix();
            Matrix.RotationXToRef(angle, result);
            return result;
        };
        /**
         * Returns a new Matrix as the passed inverted one.
         */
        Matrix.Invert = function (source) {
            var result = new Matrix();
            source.invertToRef(result);
            return result;
        };
        /**
         * Sets the passed matrix "result" as a rotation matrix for "angle" radians around the X axis.
         */
        Matrix.RotationXToRef = function (angle, result) {
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[0] = 1.0;
            result.m[15] = 1.0;
            result.m[5] = c;
            result.m[10] = c;
            result.m[9] = -s;
            result.m[6] = s;
            result.m[1] = 0.0;
            result.m[2] = 0.0;
            result.m[3] = 0.0;
            result.m[4] = 0.0;
            result.m[7] = 0.0;
            result.m[8] = 0.0;
            result.m[11] = 0.0;
            result.m[12] = 0.0;
            result.m[13] = 0.0;
            result.m[14] = 0.0;
            result._markAsUpdated();
        };
        /**
         * Returns a new rotation matrix for "angle" radians around the Y axis.
         */
        Matrix.RotationY = function (angle) {
            var result = new Matrix();
            Matrix.RotationYToRef(angle, result);
            return result;
        };
        /**
         * Sets the passed matrix "result" as a rotation matrix for "angle" radians around the Y axis.
         */
        Matrix.RotationYToRef = function (angle, result) {
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[5] = 1.0;
            result.m[15] = 1.0;
            result.m[0] = c;
            result.m[2] = -s;
            result.m[8] = s;
            result.m[10] = c;
            result.m[1] = 0.0;
            result.m[3] = 0.0;
            result.m[4] = 0.0;
            result.m[6] = 0.0;
            result.m[7] = 0.0;
            result.m[9] = 0.0;
            result.m[11] = 0.0;
            result.m[12] = 0.0;
            result.m[13] = 0.0;
            result.m[14] = 0.0;
            result._markAsUpdated();
        };
        /**
         * Returns a new rotation matrix for "angle" radians around the Z axis.
         */
        Matrix.RotationZ = function (angle) {
            var result = new Matrix();
            Matrix.RotationZToRef(angle, result);
            return result;
        };
        /**
         * Sets the passed matrix "result" as a rotation matrix for "angle" radians around the Z axis.
         */
        Matrix.RotationZToRef = function (angle, result) {
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            result.m[10] = 1.0;
            result.m[15] = 1.0;
            result.m[0] = c;
            result.m[1] = s;
            result.m[4] = -s;
            result.m[5] = c;
            result.m[2] = 0.0;
            result.m[3] = 0.0;
            result.m[6] = 0.0;
            result.m[7] = 0.0;
            result.m[8] = 0.0;
            result.m[9] = 0.0;
            result.m[11] = 0.0;
            result.m[12] = 0.0;
            result.m[13] = 0.0;
            result.m[14] = 0.0;
            result._markAsUpdated();
        };
        /**
         * Returns a new rotation matrix for "angle" radians around the passed axis.
         */
        Matrix.RotationAxis = function (axis, angle) {
            var result = Matrix.Zero();
            Matrix.RotationAxisToRef(axis, angle, result);
            return result;
        };
        /**
         * Sets the passed matrix "result" as a rotation matrix for "angle" radians around the passed axis.
         */
        Matrix.RotationAxisToRef = function (axis, angle, result) {
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;
            axis.normalize();
            result.m[0] = (axis.x * axis.x) * c1 + c;
            result.m[1] = (axis.x * axis.y) * c1 - (axis.z * s);
            result.m[2] = (axis.x * axis.z) * c1 + (axis.y * s);
            result.m[3] = 0.0;
            result.m[4] = (axis.y * axis.x) * c1 + (axis.z * s);
            result.m[5] = (axis.y * axis.y) * c1 + c;
            result.m[6] = (axis.y * axis.z) * c1 - (axis.x * s);
            result.m[7] = 0.0;
            result.m[8] = (axis.z * axis.x) * c1 - (axis.y * s);
            result.m[9] = (axis.z * axis.y) * c1 + (axis.x * s);
            result.m[10] = (axis.z * axis.z) * c1 + c;
            result.m[11] = 0.0;
            result.m[15] = 1.0;
            result._markAsUpdated();
        };
        /**
         * Returns a new Matrix as a rotation matrix from the Euler angles (y, x, z).
         */
        Matrix.RotationYawPitchRoll = function (yaw, pitch, roll) {
            var result = new Matrix();
            Matrix.RotationYawPitchRollToRef(yaw, pitch, roll, result);
            return result;
        };
        /**
         * Sets the passed matrix "result" as a rotation matrix from the Euler angles (y, x, z).
         */
        Matrix.RotationYawPitchRollToRef = function (yaw, pitch, roll, result) {
            Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, this._tempQuaternion);
            this._tempQuaternion.toRotationMatrix(result);
        };
        /**
         * Returns a new Matrix as a scaling matrix from the passed floats (x, y, z).
         */
        Matrix.Scaling = function (x, y, z) {
            var result = Matrix.Zero();
            Matrix.ScalingToRef(x, y, z, result);
            return result;
        };
        /**
         * Sets the passed matrix "result" as a scaling matrix from the passed floats (x, y, z).
         */
        Matrix.ScalingToRef = function (x, y, z, result) {
            result.m[0] = x;
            result.m[1] = 0.0;
            result.m[2] = 0.0;
            result.m[3] = 0.0;
            result.m[4] = 0.0;
            result.m[5] = y;
            result.m[6] = 0.0;
            result.m[7] = 0.0;
            result.m[8] = 0.0;
            result.m[9] = 0.0;
            result.m[10] = z;
            result.m[11] = 0.0;
            result.m[12] = 0.0;
            result.m[13] = 0.0;
            result.m[14] = 0.0;
            result.m[15] = 1.0;
            result._markAsUpdated();
        };
        /**
         * Returns a new Matrix as a translation matrix from the passed floats (x, y, z).
         */
        Matrix.Translation = function (x, y, z) {
            var result = Matrix.Identity();
            Matrix.TranslationToRef(x, y, z, result);
            return result;
        };
        /**
         * Sets the passed matrix "result" as a translation matrix from the passed floats (x, y, z).
         */
        Matrix.TranslationToRef = function (x, y, z, result) {
            Matrix.FromValuesToRef(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, x, y, z, 1.0, result);
        };
        /**
         * Returns a new Matrix whose values are the interpolated values for "gradien" (float) between the ones of the matrices "startValue" and "endValue".
         */
        Matrix.Lerp = function (startValue, endValue, gradient) {
            var result = Matrix.Zero();
            for (var index = 0; index < 16; index++) {
                result.m[index] = startValue.m[index] * (1.0 - gradient) + endValue.m[index] * gradient;
            }
            result._markAsUpdated();
            return result;
        };
        /**
         * Returns a new Matrix whose values are computed by :
         * - decomposing the the "startValue" and "endValue" matrices into their respective scale, rotation and translation matrices,
         * - interpolating for "gradient" (float) the values between each of these decomposed matrices between the start and the end,
         * - recomposing a new matrix from these 3 interpolated scale, rotation and translation matrices.
         */
        Matrix.DecomposeLerp = function (startValue, endValue, gradient) {
            var startScale = new Vector3(0, 0, 0);
            var startRotation = new Quaternion();
            var startTranslation = new Vector3(0, 0, 0);
            startValue.decompose(startScale, startRotation, startTranslation);
            var endScale = new Vector3(0, 0, 0);
            var endRotation = new Quaternion();
            var endTranslation = new Vector3(0, 0, 0);
            endValue.decompose(endScale, endRotation, endTranslation);
            var resultScale = Vector3.Lerp(startScale, endScale, gradient);
            var resultRotation = Quaternion.Slerp(startRotation, endRotation, gradient);
            var resultTranslation = Vector3.Lerp(startTranslation, endTranslation, gradient);
            return Matrix.Compose(resultScale, resultRotation, resultTranslation);
        };
        /**
         * Returns a new rotation Matrix used to rotate a mesh so as it looks at the target Vector3, from the eye Vector3, the UP vector3 being orientated like "up".
         * This methods works for a Left-Handed system.
         */
        Matrix.LookAtLH = function (eye, target, up) {
            var result = Matrix.Zero();
            Matrix.LookAtLHToRef(eye, target, up, result);
            return result;
        };
        /**
         * Sets the passed "result" Matrix as a rotation matrix used to rotate a mesh so as it looks at the target Vector3, from the eye Vector3, the UP vector3 being orientated like "up".
         * This methods works for a Left-Handed system.
         */
        Matrix.LookAtLHToRef = function (eye, target, up, result) {
            // Z axis
            target.subtractToRef(eye, this._zAxis);
            this._zAxis.normalize();
            // X axis
            Vector3.CrossToRef(up, this._zAxis, this._xAxis);
            if (this._xAxis.lengthSquared() === 0) {
                this._xAxis.x = 1.0;
            }
            else {
                this._xAxis.normalize();
            }
            // Y axis
            Vector3.CrossToRef(this._zAxis, this._xAxis, this._yAxis);
            this._yAxis.normalize();
            // Eye angles
            var ex = -Vector3.Dot(this._xAxis, eye);
            var ey = -Vector3.Dot(this._yAxis, eye);
            var ez = -Vector3.Dot(this._zAxis, eye);
            return Matrix.FromValuesToRef(this._xAxis.x, this._yAxis.x, this._zAxis.x, 0, this._xAxis.y, this._yAxis.y, this._zAxis.y, 0, this._xAxis.z, this._yAxis.z, this._zAxis.z, 0, ex, ey, ez, 1, result);
        };
        /**
         * Returns a new rotation Matrix used to rotate a mesh so as it looks at the target Vector3, from the eye Vector3, the UP vector3 being orientated like "up".
         * This methods works for a Right-Handed system.
         */
        Matrix.LookAtRH = function (eye, target, up) {
            var result = Matrix.Zero();
            Matrix.LookAtRHToRef(eye, target, up, result);
            return result;
        };
        /**
         * Sets the passed "result" Matrix as a rotation matrix used to rotate a mesh so as it looks at the target Vector3, from the eye Vector3, the UP vector3 being orientated like "up".
         * This methods works for a Left-Handed system.
         */
        Matrix.LookAtRHToRef = function (eye, target, up, result) {
            // Z axis
            eye.subtractToRef(target, this._zAxis);
            this._zAxis.normalize();
            // X axis
            Vector3.CrossToRef(up, this._zAxis, this._xAxis);
            if (this._xAxis.lengthSquared() === 0) {
                this._xAxis.x = 1.0;
            }
            else {
                this._xAxis.normalize();
            }
            // Y axis
            Vector3.CrossToRef(this._zAxis, this._xAxis, this._yAxis);
            this._yAxis.normalize();
            // Eye angles
            var ex = -Vector3.Dot(this._xAxis, eye);
            var ey = -Vector3.Dot(this._yAxis, eye);
            var ez = -Vector3.Dot(this._zAxis, eye);
            return Matrix.FromValuesToRef(this._xAxis.x, this._yAxis.x, this._zAxis.x, 0, this._xAxis.y, this._yAxis.y, this._zAxis.y, 0, this._xAxis.z, this._yAxis.z, this._zAxis.z, 0, ex, ey, ez, 1, result);
        };
        /**
         * Returns a new Matrix as a left-handed orthographic projection matrix computed from the passed floats : width and height of the projection plane, z near and far limits.
         */
        Matrix.OrthoLH = function (width, height, znear, zfar) {
            var matrix = Matrix.Zero();
            Matrix.OrthoLHToRef(width, height, znear, zfar, matrix);
            return matrix;
        };
        /**
         * Sets the passed matrix "result" as a left-handed orthographic projection matrix computed from the passed floats : width and height of the projection plane, z near and far limits.
         */
        Matrix.OrthoLHToRef = function (width, height, znear, zfar, result) {
            var n = znear;
            var f = zfar;
            var a = 2.0 / width;
            var b = 2.0 / height;
            var c = 2.0 / (f - n);
            var d = -(f + n) / (f - n);
            Matrix.FromValuesToRef(a, 0.0, 0.0, 0.0, 0.0, b, 0.0, 0.0, 0.0, 0.0, c, 0.0, 0.0, 0.0, d, 1.0, result);
        };
        /**
         * Returns a new Matrix as a left-handed orthographic projection matrix computed from the passed floats : left, right, top and bottom being the coordinates of the projection plane, z near and far limits.
         */
        Matrix.OrthoOffCenterLH = function (left, right, bottom, top, znear, zfar) {
            var matrix = Matrix.Zero();
            Matrix.OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, matrix);
            return matrix;
        };
        /**
         * Sets the passed matrix "result" as a left-handed orthographic projection matrix computed from the passed floats : left, right, top and bottom being the coordinates of the projection plane, z near and far limits.
         */
        Matrix.OrthoOffCenterLHToRef = function (left, right, bottom, top, znear, zfar, result) {
            var n = znear;
            var f = zfar;
            var a = 2.0 / (right - left);
            var b = 2.0 / (top - bottom);
            var c = 2.0 / (f - n);
            var d = -(f + n) / (f - n);
            var i0 = (left + right) / (left - right);
            var i1 = (top + bottom) / (bottom - top);
            Matrix.FromValuesToRef(a, 0.0, 0.0, 0.0, 0.0, b, 0.0, 0.0, 0.0, 0.0, c, 0.0, i0, i1, d, 1.0, result);
        };
        /**
         * Returns a new Matrix as a right-handed orthographic projection matrix computed from the passed floats : left, right, top and bottom being the coordinates of the projection plane, z near and far limits.
         */
        Matrix.OrthoOffCenterRH = function (left, right, bottom, top, znear, zfar) {
            var matrix = Matrix.Zero();
            Matrix.OrthoOffCenterRHToRef(left, right, bottom, top, znear, zfar, matrix);
            return matrix;
        };
        /**
         * Sets the passed matrix "result" as a right-handed orthographic projection matrix computed from the passed floats : left, right, top and bottom being the coordinates of the projection plane, z near and far limits.
         */
        Matrix.OrthoOffCenterRHToRef = function (left, right, bottom, top, znear, zfar, result) {
            Matrix.OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, result);
            result.m[10] *= -1.0;
        };
        /**
         * Returns a new Matrix as a left-handed perspective projection matrix computed from the passed floats : width and height of the projection plane, z near and far limits.
         */
        Matrix.PerspectiveLH = function (width, height, znear, zfar) {
            var matrix = Matrix.Zero();
            var n = znear;
            var f = zfar;
            var a = 2.0 * n / width;
            var b = 2.0 * n / height;
            var c = (f + n) / (f - n);
            var d = -2.0 * f * n / (f - n);
            Matrix.FromValuesToRef(a, 0.0, 0.0, 0.0, 0.0, b, 0.0, 0.0, 0.0, 0.0, c, 1.0, 0.0, 0.0, d, 0.0, matrix);
            return matrix;
        };
        /**
         * Returns a new Matrix as a left-handed perspective projection matrix computed from the passed floats : vertical angle of view (fov), width/height ratio (aspect), z near and far limits.
         */
        Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
            var matrix = Matrix.Zero();
            Matrix.PerspectiveFovLHToRef(fov, aspect, znear, zfar, matrix);
            return matrix;
        };
        /**
         * Sets the passed matrix "result" as a left-handed perspective projection matrix computed from the passed floats : vertical angle of view (fov), width/height ratio (aspect), z near and far limits.
         */
        Matrix.PerspectiveFovLHToRef = function (fov, aspect, znear, zfar, result, isVerticalFovFixed) {
            if (isVerticalFovFixed === void 0) { isVerticalFovFixed = true; }
            var n = znear;
            var f = zfar;
            var t = 1.0 / (Math.tan(fov * 0.5));
            var a = isVerticalFovFixed ? (t / aspect) : t;
            var b = isVerticalFovFixed ? t : (t * aspect);
            var c = (f + n) / (f - n);
            var d = -2.0 * f * n / (f - n);
            Matrix.FromValuesToRef(a, 0.0, 0.0, 0.0, 0.0, b, 0.0, 0.0, 0.0, 0.0, c, 1.0, 0.0, 0.0, d, 0.0, result);
        };
        /**
         * Returns a new Matrix as a right-handed perspective projection matrix computed from the passed floats : vertical angle of view (fov), width/height ratio (aspect), z near and far limits.
         */
        Matrix.PerspectiveFovRH = function (fov, aspect, znear, zfar) {
            var matrix = Matrix.Zero();
            Matrix.PerspectiveFovRHToRef(fov, aspect, znear, zfar, matrix);
            return matrix;
        };
        /**
         * Sets the passed matrix "result" as a right-handed perspective projection matrix computed from the passed floats : vertical angle of view (fov), width/height ratio (aspect), z near and far limits.
         */
        Matrix.PerspectiveFovRHToRef = function (fov, aspect, znear, zfar, result, isVerticalFovFixed) {
            //alternatively this could be expressed as:
            //    m = PerspectiveFovLHToRef
            //    m[10] *= -1.0;
            //    m[11] *= -1.0;
            if (isVerticalFovFixed === void 0) { isVerticalFovFixed = true; }
            var n = znear;
            var f = zfar;
            var t = 1.0 / (Math.tan(fov * 0.5));
            var a = isVerticalFovFixed ? (t / aspect) : t;
            var b = isVerticalFovFixed ? t : (t * aspect);
            var c = -(f + n) / (f - n);
            var d = -2 * f * n / (f - n);
            Matrix.FromValuesToRef(a, 0.0, 0.0, 0.0, 0.0, b, 0.0, 0.0, 0.0, 0.0, c, -1.0, 0.0, 0.0, d, 0.0, result);
        };
        /**
         * Sets the passed matrix "result" as a left-handed perspective projection matrix  for WebVR computed from the passed floats : vertical angle of view (fov), width/height ratio (aspect), z near and far limits.
         */
        Matrix.PerspectiveFovWebVRToRef = function (fov, znear, zfar, result, rightHanded) {
            if (rightHanded === void 0) { rightHanded = false; }
            var rightHandedFactor = rightHanded ? -1 : 1;
            var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
            var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
            var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
            var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
            var xScale = 2.0 / (leftTan + rightTan);
            var yScale = 2.0 / (upTan + downTan);
            result.m[0] = xScale;
            result.m[1] = result.m[2] = result.m[3] = result.m[4] = 0.0;
            result.m[5] = yScale;
            result.m[6] = result.m[7] = 0.0;
            result.m[8] = ((leftTan - rightTan) * xScale * 0.5); // * rightHandedFactor;
            result.m[9] = -((upTan - downTan) * yScale * 0.5); // * rightHandedFactor;
            //result.m[10] = -(znear + zfar) / (zfar - znear) * rightHandedFactor;
            result.m[10] = -zfar / (znear - zfar);
            result.m[11] = 1.0 * rightHandedFactor;
            result.m[12] = result.m[13] = result.m[15] = 0.0;
            result.m[14] = -(2.0 * zfar * znear) / (zfar - znear);
            // result.m[14] = (znear * zfar) / (znear - zfar);
            result._markAsUpdated();
        };
        /**
         * Returns the final transformation matrix : world * view * projection * viewport
         */
        Matrix.GetFinalMatrix = function (viewport, world, view, projection, zmin, zmax) {
            var cw = viewport.width;
            var ch = viewport.height;
            var cx = viewport.x;
            var cy = viewport.y;
            var viewportMatrix = Matrix.FromValues(cw / 2.0, 0.0, 0.0, 0.0, 0.0, -ch / 2.0, 0.0, 0.0, 0.0, 0.0, zmax - zmin, 0.0, cx + cw / 2.0, ch / 2.0 + cy, zmin, 1);
            return world.multiply(view).multiply(projection).multiply(viewportMatrix);
        };
        /**
         * Returns a new Float32Array array with 4 elements : the 2x2 matrix extracted from the passed Matrix.
         */
        Matrix.GetAsMatrix2x2 = function (matrix) {
            return new Float32Array([
                matrix.m[0], matrix.m[1],
                matrix.m[4], matrix.m[5]
            ]);
        };
        /**
         * Returns a new Float32Array array with 9 elements : the 3x3 matrix extracted from the passed Matrix.
         */
        Matrix.GetAsMatrix3x3 = function (matrix) {
            return new Float32Array([
                matrix.m[0], matrix.m[1], matrix.m[2],
                matrix.m[4], matrix.m[5], matrix.m[6],
                matrix.m[8], matrix.m[9], matrix.m[10]
            ]);
        };
        /**
         * Compute the transpose of the passed Matrix.
         * Returns a new Matrix.
         */
        Matrix.Transpose = function (matrix) {
            var result = new Matrix();
            Matrix.TransposeToRef(matrix, result);
            return result;
        };
        /**
         * Compute the transpose of the passed Matrix and store it in the result matrix.
         */
        Matrix.TransposeToRef = function (matrix, result) {
            result.m[0] = matrix.m[0];
            result.m[1] = matrix.m[4];
            result.m[2] = matrix.m[8];
            result.m[3] = matrix.m[12];
            result.m[4] = matrix.m[1];
            result.m[5] = matrix.m[5];
            result.m[6] = matrix.m[9];
            result.m[7] = matrix.m[13];
            result.m[8] = matrix.m[2];
            result.m[9] = matrix.m[6];
            result.m[10] = matrix.m[10];
            result.m[11] = matrix.m[14];
            result.m[12] = matrix.m[3];
            result.m[13] = matrix.m[7];
            result.m[14] = matrix.m[11];
            result.m[15] = matrix.m[15];
        };
        /**
         * Returns a new Matrix as the reflection  matrix across the passed plane.
         */
        Matrix.Reflection = function (plane) {
            var matrix = new Matrix();
            Matrix.ReflectionToRef(plane, matrix);
            return matrix;
        };
        /**
         * Sets the passed matrix "result" as the reflection matrix across the passed plane.
         */
        Matrix.ReflectionToRef = function (plane, result) {
            plane.normalize();
            var x = plane.normal.x;
            var y = plane.normal.y;
            var z = plane.normal.z;
            var temp = -2 * x;
            var temp2 = -2 * y;
            var temp3 = -2 * z;
            result.m[0] = (temp * x) + 1;
            result.m[1] = temp2 * x;
            result.m[2] = temp3 * x;
            result.m[3] = 0.0;
            result.m[4] = temp * y;
            result.m[5] = (temp2 * y) + 1;
            result.m[6] = temp3 * y;
            result.m[7] = 0.0;
            result.m[8] = temp * z;
            result.m[9] = temp2 * z;
            result.m[10] = (temp3 * z) + 1;
            result.m[11] = 0.0;
            result.m[12] = temp * plane.d;
            result.m[13] = temp2 * plane.d;
            result.m[14] = temp3 * plane.d;
            result.m[15] = 1.0;
            result._markAsUpdated();
        };
        /**
         * Sets the passed matrix "mat" as a rotation matrix composed from the 3 passed  left handed axis.
         */
        Matrix.FromXYZAxesToRef = function (xaxis, yaxis, zaxis, result) {
            result.m[0] = xaxis.x;
            result.m[1] = xaxis.y;
            result.m[2] = xaxis.z;
            result.m[3] = 0.0;
            result.m[4] = yaxis.x;
            result.m[5] = yaxis.y;
            result.m[6] = yaxis.z;
            result.m[7] = 0.0;
            result.m[8] = zaxis.x;
            result.m[9] = zaxis.y;
            result.m[10] = zaxis.z;
            result.m[11] = 0.0;
            result.m[12] = 0.0;
            result.m[13] = 0.0;
            result.m[14] = 0.0;
            result.m[15] = 1.0;
            result._markAsUpdated();
        };
        /**
         * Sets the passed matrix "result" as a rotation matrix according to the passed quaternion.
         */
        Matrix.FromQuaternionToRef = function (quat, result) {
            var xx = quat.x * quat.x;
            var yy = quat.y * quat.y;
            var zz = quat.z * quat.z;
            var xy = quat.x * quat.y;
            var zw = quat.z * quat.w;
            var zx = quat.z * quat.x;
            var yw = quat.y * quat.w;
            var yz = quat.y * quat.z;
            var xw = quat.x * quat.w;
            result.m[0] = 1.0 - (2.0 * (yy + zz));
            result.m[1] = 2.0 * (xy + zw);
            result.m[2] = 2.0 * (zx - yw);
            result.m[3] = 0.0;
            result.m[4] = 2.0 * (xy - zw);
            result.m[5] = 1.0 - (2.0 * (zz + xx));
            result.m[6] = 2.0 * (yz + xw);
            result.m[7] = 0.0;
            result.m[8] = 2.0 * (zx + yw);
            result.m[9] = 2.0 * (yz - xw);
            result.m[10] = 1.0 - (2.0 * (yy + xx));
            result.m[11] = 0.0;
            result.m[12] = 0.0;
            result.m[13] = 0.0;
            result.m[14] = 0.0;
            result.m[15] = 1.0;
            result._markAsUpdated();
        };
        Matrix._tempQuaternion = new Quaternion();
        Matrix._xAxis = Vector3.Zero();
        Matrix._yAxis = Vector3.Zero();
        Matrix._zAxis = Vector3.Zero();
        Matrix._updateFlagSeed = 0;
        Matrix._identityReadOnly = Matrix.Identity();
        return Matrix;
    }());
    BABYLON.Matrix = Matrix;
    var Plane = /** @class */ (function () {
        /**
         * Creates a Plane object according to the passed floats a, b, c, d and the plane equation : ax + by + cz + d = 0
         */
        function Plane(a, b, c, d) {
            this.normal = new Vector3(a, b, c);
            this.d = d;
        }
        /**
         * Returns the plane coordinates as a new array of 4 elements [a, b, c, d].
         */
        Plane.prototype.asArray = function () {
            return [this.normal.x, this.normal.y, this.normal.z, this.d];
        };
        // Methods
        /**
         * Returns a new plane copied from the current Plane.
         */
        Plane.prototype.clone = function () {
            return new Plane(this.normal.x, this.normal.y, this.normal.z, this.d);
        };
        /**
         * Returns the string "Plane".
         */
        Plane.prototype.getClassName = function () {
            return "Plane";
        };
        /**
         * Returns the Plane hash code.
         */
        Plane.prototype.getHashCode = function () {
            var hash = this.normal.getHashCode();
            hash = (hash * 397) ^ (this.d || 0);
            return hash;
        };
        /**
         * Normalize the current Plane in place.
         * Returns the updated Plane.
         */
        Plane.prototype.normalize = function () {
            var norm = (Math.sqrt((this.normal.x * this.normal.x) + (this.normal.y * this.normal.y) + (this.normal.z * this.normal.z)));
            var magnitude = 0.0;
            if (norm !== 0) {
                magnitude = 1.0 / norm;
            }
            this.normal.x *= magnitude;
            this.normal.y *= magnitude;
            this.normal.z *= magnitude;
            this.d *= magnitude;
            return this;
        };
        /**
         * Returns a new Plane as the result of the transformation of the current Plane by the passed matrix.
         */
        Plane.prototype.transform = function (transformation) {
            var transposedMatrix = Matrix.Transpose(transformation);
            var x = this.normal.x;
            var y = this.normal.y;
            var z = this.normal.z;
            var d = this.d;
            var normalX = (((x * transposedMatrix.m[0]) + (y * transposedMatrix.m[1])) + (z * transposedMatrix.m[2])) + (d * transposedMatrix.m[3]);
            var normalY = (((x * transposedMatrix.m[4]) + (y * transposedMatrix.m[5])) + (z * transposedMatrix.m[6])) + (d * transposedMatrix.m[7]);
            var normalZ = (((x * transposedMatrix.m[8]) + (y * transposedMatrix.m[9])) + (z * transposedMatrix.m[10])) + (d * transposedMatrix.m[11]);
            var finalD = (((x * transposedMatrix.m[12]) + (y * transposedMatrix.m[13])) + (z * transposedMatrix.m[14])) + (d * transposedMatrix.m[15]);
            return new Plane(normalX, normalY, normalZ, finalD);
        };
        /**
         * Returns the dot product (float) of the point coordinates and the plane normal.
         */
        Plane.prototype.dotCoordinate = function (point) {
            return ((((this.normal.x * point.x) + (this.normal.y * point.y)) + (this.normal.z * point.z)) + this.d);
        };
        /**
         * Updates the current Plane from the plane defined by the three passed points.
         * Returns the updated Plane.
         */
        Plane.prototype.copyFromPoints = function (point1, point2, point3) {
            var x1 = point2.x - point1.x;
            var y1 = point2.y - point1.y;
            var z1 = point2.z - point1.z;
            var x2 = point3.x - point1.x;
            var y2 = point3.y - point1.y;
            var z2 = point3.z - point1.z;
            var yz = (y1 * z2) - (z1 * y2);
            var xz = (z1 * x2) - (x1 * z2);
            var xy = (x1 * y2) - (y1 * x2);
            var pyth = (Math.sqrt((yz * yz) + (xz * xz) + (xy * xy)));
            var invPyth;
            if (pyth !== 0) {
                invPyth = 1.0 / pyth;
            }
            else {
                invPyth = 0.0;
            }
            this.normal.x = yz * invPyth;
            this.normal.y = xz * invPyth;
            this.normal.z = xy * invPyth;
            this.d = -((this.normal.x * point1.x) + (this.normal.y * point1.y) + (this.normal.z * point1.z));
            return this;
        };
        /**
         * Boolean : True is the vector "direction"  is the same side than the plane normal.
         */
        Plane.prototype.isFrontFacingTo = function (direction, epsilon) {
            var dot = Vector3.Dot(this.normal, direction);
            return (dot <= epsilon);
        };
        /**
         * Returns the signed distance (float) from the passed point to the Plane.
         */
        Plane.prototype.signedDistanceTo = function (point) {
            return Vector3.Dot(point, this.normal) + this.d;
        };
        // Statics
        /**
         * Returns a new Plane from the passed array.
         */
        Plane.FromArray = function (array) {
            return new Plane(array[0], array[1], array[2], array[3]);
        };
        /**
         * Returns a new Plane defined by the three passed points.
         */
        Plane.FromPoints = function (point1, point2, point3) {
            var result = new Plane(0.0, 0.0, 0.0, 0.0);
            result.copyFromPoints(point1, point2, point3);
            return result;
        };
        /**
         * Returns a new Plane the normal vector to this plane at the passed origin point.
         * Note : the vector "normal" is updated because normalized.
         */
        Plane.FromPositionAndNormal = function (origin, normal) {
            var result = new Plane(0.0, 0.0, 0.0, 0.0);
            normal.normalize();
            result.normal = normal;
            result.d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
            return result;
        };
        /**
         * Returns the signed distance between the plane defined by the normal vector at the "origin"" point and the passed other point.
         */
        Plane.SignedDistanceToPlaneFromPositionAndNormal = function (origin, normal, point) {
            var d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
            return Vector3.Dot(point, normal) + d;
        };
        return Plane;
    }());
    BABYLON.Plane = Plane;
    var Viewport = /** @class */ (function () {
        /**
         * Creates a Viewport object located at (x, y) and sized (width, height).
         */
        function Viewport(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Viewport.prototype.toGlobal = function (renderWidthOrEngine, renderHeight) {
            if (renderWidthOrEngine.getRenderWidth) {
                var engine = renderWidthOrEngine;
                return this.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
            }
            var renderWidth = renderWidthOrEngine;
            return new Viewport(this.x * renderWidth, this.y * renderHeight, this.width * renderWidth, this.height * renderHeight);
        };
        /**
         * Returns a new Viewport copied from the current one.
         */
        Viewport.prototype.clone = function () {
            return new Viewport(this.x, this.y, this.width, this.height);
        };
        return Viewport;
    }());
    BABYLON.Viewport = Viewport;
    var Frustum = /** @class */ (function () {
        function Frustum() {
        }
        /**
         * Returns a new array of 6 Frustum planes computed by the passed transformation matrix.
         */
        Frustum.GetPlanes = function (transform) {
            var frustumPlanes = [];
            for (var index = 0; index < 6; index++) {
                frustumPlanes.push(new Plane(0.0, 0.0, 0.0, 0.0));
            }
            Frustum.GetPlanesToRef(transform, frustumPlanes);
            return frustumPlanes;
        };
        Frustum.GetNearPlaneToRef = function (transform, frustumPlane) {
            frustumPlane.normal.x = transform.m[3] + transform.m[2];
            frustumPlane.normal.y = transform.m[7] + transform.m[6];
            frustumPlane.normal.z = transform.m[11] + transform.m[10];
            frustumPlane.d = transform.m[15] + transform.m[14];
            frustumPlane.normalize();
        };
        Frustum.GetFarPlaneToRef = function (transform, frustumPlane) {
            frustumPlane.normal.x = transform.m[3] - transform.m[2];
            frustumPlane.normal.y = transform.m[7] - transform.m[6];
            frustumPlane.normal.z = transform.m[11] - transform.m[10];
            frustumPlane.d = transform.m[15] - transform.m[14];
            frustumPlane.normalize();
        };
        Frustum.GetLeftPlaneToRef = function (transform, frustumPlane) {
            frustumPlane.normal.x = transform.m[3] + transform.m[0];
            frustumPlane.normal.y = transform.m[7] + transform.m[4];
            frustumPlane.normal.z = transform.m[11] + transform.m[8];
            frustumPlane.d = transform.m[15] + transform.m[12];
            frustumPlane.normalize();
        };
        Frustum.GetRightPlaneToRef = function (transform, frustumPlane) {
            frustumPlane.normal.x = transform.m[3] - transform.m[0];
            frustumPlane.normal.y = transform.m[7] - transform.m[4];
            frustumPlane.normal.z = transform.m[11] - transform.m[8];
            frustumPlane.d = transform.m[15] - transform.m[12];
            frustumPlane.normalize();
        };
        Frustum.GetTopPlaneToRef = function (transform, frustumPlane) {
            frustumPlane.normal.x = transform.m[3] - transform.m[1];
            frustumPlane.normal.y = transform.m[7] - transform.m[5];
            frustumPlane.normal.z = transform.m[11] - transform.m[9];
            frustumPlane.d = transform.m[15] - transform.m[13];
            frustumPlane.normalize();
        };
        Frustum.GetBottomPlaneToRef = function (transform, frustumPlane) {
            frustumPlane.normal.x = transform.m[3] + transform.m[1];
            frustumPlane.normal.y = transform.m[7] + transform.m[5];
            frustumPlane.normal.z = transform.m[11] + transform.m[9];
            frustumPlane.d = transform.m[15] + transform.m[13];
            frustumPlane.normalize();
        };
        /**
         * Sets the passed array "frustumPlanes" with the 6 Frustum planes computed by the passed transformation matrix.
         */
        Frustum.GetPlanesToRef = function (transform, frustumPlanes) {
            // Near
            Frustum.GetNearPlaneToRef(transform, frustumPlanes[0]);
            // Far
            Frustum.GetFarPlaneToRef(transform, frustumPlanes[1]);
            // Left
            Frustum.GetLeftPlaneToRef(transform, frustumPlanes[2]);
            // Right
            Frustum.GetRightPlaneToRef(transform, frustumPlanes[3]);
            // Top
            Frustum.GetTopPlaneToRef(transform, frustumPlanes[4]);
            // Bottom
            Frustum.GetBottomPlaneToRef(transform, frustumPlanes[5]);
        };
        return Frustum;
    }());
    BABYLON.Frustum = Frustum;
    var Space;
    (function (Space) {
        Space[Space["LOCAL"] = 0] = "LOCAL";
        Space[Space["WORLD"] = 1] = "WORLD";
        Space[Space["BONE"] = 2] = "BONE";
    })(Space = BABYLON.Space || (BABYLON.Space = {}));
    var Axis = /** @class */ (function () {
        function Axis() {
        }
        Axis.X = new Vector3(1.0, 0.0, 0.0);
        Axis.Y = new Vector3(0.0, 1.0, 0.0);
        Axis.Z = new Vector3(0.0, 0.0, 1.0);
        return Axis;
    }());
    BABYLON.Axis = Axis;
    ;
    var BezierCurve = /** @class */ (function () {
        function BezierCurve() {
        }
        /**
         * Returns the cubic Bezier interpolated value (float) at "t" (float) from the passed x1, y1, x2, y2 floats.
         */
        BezierCurve.interpolate = function (t, x1, y1, x2, y2) {
            // Extract X (which is equal to time here)
            var f0 = 1 - 3 * x2 + 3 * x1;
            var f1 = 3 * x2 - 6 * x1;
            var f2 = 3 * x1;
            var refinedT = t;
            for (var i = 0; i < 5; i++) {
                var refinedT2 = refinedT * refinedT;
                var refinedT3 = refinedT2 * refinedT;
                var x = f0 * refinedT3 + f1 * refinedT2 + f2 * refinedT;
                var slope = 1.0 / (3.0 * f0 * refinedT2 + 2.0 * f1 * refinedT + f2);
                refinedT -= (x - t) * slope;
                refinedT = Math.min(1, Math.max(0, refinedT));
            }
            // Resolve cubic bezier for the given x
            return 3 * Math.pow(1 - refinedT, 2) * refinedT * y1 +
                3 * (1 - refinedT) * Math.pow(refinedT, 2) * y2 +
                Math.pow(refinedT, 3);
        };
        return BezierCurve;
    }());
    BABYLON.BezierCurve = BezierCurve;
    var Orientation;
    (function (Orientation) {
        Orientation[Orientation["CW"] = 0] = "CW";
        Orientation[Orientation["CCW"] = 1] = "CCW";
    })(Orientation = BABYLON.Orientation || (BABYLON.Orientation = {}));
    var Angle = /** @class */ (function () {
        /**
         * Creates an Angle object of "radians" radians (float).
         */
        function Angle(radians) {
            var _this = this;
            /**
             * Returns the Angle value in degrees (float).
             */
            this.degrees = function () { return _this._radians * 180.0 / Math.PI; };
            /**
             * Returns the Angle value in radians (float).
             */
            this.radians = function () { return _this._radians; };
            this._radians = radians;
            if (this._radians < 0.0)
                this._radians += (2.0 * Math.PI);
        }
        /**
         * Returns a new Angle object valued with the angle value in radians between the two passed vectors.
         */
        Angle.BetweenTwoPoints = function (a, b) {
            var delta = b.subtract(a);
            var theta = Math.atan2(delta.y, delta.x);
            return new Angle(theta);
        };
        /**
         * Returns a new Angle object from the passed float in radians.
         */
        Angle.FromRadians = function (radians) {
            return new Angle(radians);
        };
        /**
         * Returns a new Angle object from the passed float in degrees.
         */
        Angle.FromDegrees = function (degrees) {
            return new Angle(degrees * Math.PI / 180.0);
        };
        return Angle;
    }());
    BABYLON.Angle = Angle;
    var Arc2 = /** @class */ (function () {
        /**
         * Creates an Arc object from the three passed points : start, middle and end.
         */
        function Arc2(startPoint, midPoint, endPoint) {
            this.startPoint = startPoint;
            this.midPoint = midPoint;
            this.endPoint = endPoint;
            var temp = Math.pow(midPoint.x, 2) + Math.pow(midPoint.y, 2);
            var startToMid = (Math.pow(startPoint.x, 2) + Math.pow(startPoint.y, 2) - temp) / 2.;
            var midToEnd = (temp - Math.pow(endPoint.x, 2) - Math.pow(endPoint.y, 2)) / 2.;
            var det = (startPoint.x - midPoint.x) * (midPoint.y - endPoint.y) - (midPoint.x - endPoint.x) * (startPoint.y - midPoint.y);
            this.centerPoint = new Vector2((startToMid * (midPoint.y - endPoint.y) - midToEnd * (startPoint.y - midPoint.y)) / det, ((startPoint.x - midPoint.x) * midToEnd - (midPoint.x - endPoint.x) * startToMid) / det);
            this.radius = this.centerPoint.subtract(this.startPoint).length();
            this.startAngle = Angle.BetweenTwoPoints(this.centerPoint, this.startPoint);
            var a1 = this.startAngle.degrees();
            var a2 = Angle.BetweenTwoPoints(this.centerPoint, this.midPoint).degrees();
            var a3 = Angle.BetweenTwoPoints(this.centerPoint, this.endPoint).degrees();
            // angles correction
            if (a2 - a1 > +180.0)
                a2 -= 360.0;
            if (a2 - a1 < -180.0)
                a2 += 360.0;
            if (a3 - a2 > +180.0)
                a3 -= 360.0;
            if (a3 - a2 < -180.0)
                a3 += 360.0;
            this.orientation = (a2 - a1) < 0 ? Orientation.CW : Orientation.CCW;
            this.angle = Angle.FromDegrees(this.orientation === Orientation.CW ? a1 - a3 : a3 - a1);
        }
        return Arc2;
    }());
    BABYLON.Arc2 = Arc2;
    var Path2 = /** @class */ (function () {
        /**
         * Creates a Path2 object from the starting 2D coordinates x and y.
         */
        function Path2(x, y) {
            this._points = new Array();
            this._length = 0.0;
            this.closed = false;
            this._points.push(new Vector2(x, y));
        }
        /**
         * Adds a new segment until the passed coordinates (x, y) to the current Path2.
         * Returns the updated Path2.
         */
        Path2.prototype.addLineTo = function (x, y) {
            if (this.closed) {
                //Tools.Error("cannot add lines to closed paths");
                return this;
            }
            var newPoint = new Vector2(x, y);
            var previousPoint = this._points[this._points.length - 1];
            this._points.push(newPoint);
            this._length += newPoint.subtract(previousPoint).length();
            return this;
        };
        /**
         * Adds _numberOfSegments_ segments according to the arc definition (middle point coordinates, end point coordinates, the arc start point being the current Path2 last point) to the current Path2.
         * Returns the updated Path2.
         */
        Path2.prototype.addArcTo = function (midX, midY, endX, endY, numberOfSegments) {
            if (numberOfSegments === void 0) { numberOfSegments = 36; }
            if (this.closed) {
                //Tools.Error("cannot add arcs to closed paths");
                return this;
            }
            var startPoint = this._points[this._points.length - 1];
            var midPoint = new Vector2(midX, midY);
            var endPoint = new Vector2(endX, endY);
            var arc = new Arc2(startPoint, midPoint, endPoint);
            var increment = arc.angle.radians() / numberOfSegments;
            if (arc.orientation === Orientation.CW)
                increment *= -1;
            var currentAngle = arc.startAngle.radians() + increment;
            for (var i = 0; i < numberOfSegments; i++) {
                var x = Math.cos(currentAngle) * arc.radius + arc.centerPoint.x;
                var y = Math.sin(currentAngle) * arc.radius + arc.centerPoint.y;
                this.addLineTo(x, y);
                currentAngle += increment;
            }
            return this;
        };
        /**
         * Closes the Path2.
         * Returns the Path2.
         */
        Path2.prototype.close = function () {
            this.closed = true;
            return this;
        };
        /**
         * Returns the Path2 total length (float).
         */
        Path2.prototype.length = function () {
            var result = this._length;
            if (!this.closed) {
                var lastPoint = this._points[this._points.length - 1];
                var firstPoint = this._points[0];
                result += (firstPoint.subtract(lastPoint).length());
            }
            return result;
        };
        /**
         * Returns the Path2 internal array of points.
         */
        Path2.prototype.getPoints = function () {
            return this._points;
        };
        /**
         * Returns a new Vector2 located at a percentage of the Path2 total length on this path.
         */
        Path2.prototype.getPointAtLengthPosition = function (normalizedLengthPosition) {
            if (normalizedLengthPosition < 0 || normalizedLengthPosition > 1) {
                //Tools.Error("normalized length position should be between 0 and 1.");
                return Vector2.Zero();
            }
            var lengthPosition = normalizedLengthPosition * this.length();
            var previousOffset = 0;
            for (var i = 0; i < this._points.length; i++) {
                var j = (i + 1) % this._points.length;
                var a = this._points[i];
                var b = this._points[j];
                var bToA = b.subtract(a);
                var nextOffset = (bToA.length() + previousOffset);
                if (lengthPosition >= previousOffset && lengthPosition <= nextOffset) {
                    var dir = bToA.normalize();
                    var localOffset = lengthPosition - previousOffset;
                    return new Vector2(a.x + (dir.x * localOffset), a.y + (dir.y * localOffset));
                }
                previousOffset = nextOffset;
            }
            //Tools.Error("internal error");
            return Vector2.Zero();
        };
        /**
         * Returns a new Path2 starting at the coordinates (x, y).
         */
        Path2.StartingAt = function (x, y) {
            return new Path2(x, y);
        };
        return Path2;
    }());
    BABYLON.Path2 = Path2;
    var Path3D = /** @class */ (function () {
        /**
        * new Path3D(path, normal, raw)
        * Creates a Path3D. A Path3D is a logical math object, so not a mesh.
        * please read the description in the tutorial :  http://doc.babylonjs.com/tutorials/How_to_use_Path3D
        * path : an array of Vector3, the curve axis of the Path3D
        * normal (optional) : Vector3, the first wanted normal to the curve. Ex (0, 1, 0) for a vertical normal.
        * raw (optional, default false) : boolean, if true the returned Path3D isn't normalized. Useful to depict path acceleration or speed.
        */
        function Path3D(path, firstNormal, raw) {
            if (firstNormal === void 0) { firstNormal = null; }
            this.path = path;
            this._curve = new Array();
            this._distances = new Array();
            this._tangents = new Array();
            this._normals = new Array();
            this._binormals = new Array();
            for (var p = 0; p < path.length; p++) {
                this._curve[p] = path[p].clone(); // hard copy
            }
            this._raw = raw || false;
            this._compute(firstNormal);
        }
        /**
         * Returns the Path3D array of successive Vector3 designing its curve.
         */
        Path3D.prototype.getCurve = function () {
            return this._curve;
        };
        /**
         * Returns an array populated with tangent vectors on each Path3D curve point.
         */
        Path3D.prototype.getTangents = function () {
            return this._tangents;
        };
        /**
         * Returns an array populated with normal vectors on each Path3D curve point.
         */
        Path3D.prototype.getNormals = function () {
            return this._normals;
        };
        /**
         * Returns an array populated with binormal vectors on each Path3D curve point.
         */
        Path3D.prototype.getBinormals = function () {
            return this._binormals;
        };
        /**
         * Returns an array populated with distances (float) of the i-th point from the first curve point.
         */
        Path3D.prototype.getDistances = function () {
            return this._distances;
        };
        /**
         * Forces the Path3D tangent, normal, binormal and distance recomputation.
         * Returns the same object updated.
         */
        Path3D.prototype.update = function (path, firstNormal) {
            if (firstNormal === void 0) { firstNormal = null; }
            for (var p = 0; p < path.length; p++) {
                this._curve[p].x = path[p].x;
                this._curve[p].y = path[p].y;
                this._curve[p].z = path[p].z;
            }
            this._compute(firstNormal);
            return this;
        };
        // private function compute() : computes tangents, normals and binormals
        Path3D.prototype._compute = function (firstNormal) {
            var l = this._curve.length;
            // first and last tangents
            this._tangents[0] = this._getFirstNonNullVector(0);
            if (!this._raw) {
                this._tangents[0].normalize();
            }
            this._tangents[l - 1] = this._curve[l - 1].subtract(this._curve[l - 2]);
            if (!this._raw) {
                this._tangents[l - 1].normalize();
            }
            // normals and binormals at first point : arbitrary vector with _normalVector()
            var tg0 = this._tangents[0];
            var pp0 = this._normalVector(this._curve[0], tg0, firstNormal);
            this._normals[0] = pp0;
            if (!this._raw) {
                this._normals[0].normalize();
            }
            this._binormals[0] = Vector3.Cross(tg0, this._normals[0]);
            if (!this._raw) {
                this._binormals[0].normalize();
            }
            this._distances[0] = 0.0;
            // normals and binormals : next points
            var prev; // previous vector (segment)
            var cur; // current vector (segment)
            var curTang; // current tangent
            // previous normal
            var prevBinor; // previous binormal
            for (var i = 1; i < l; i++) {
                // tangents
                prev = this._getLastNonNullVector(i);
                if (i < l - 1) {
                    cur = this._getFirstNonNullVector(i);
                    this._tangents[i] = prev.add(cur);
                    this._tangents[i].normalize();
                }
                this._distances[i] = this._distances[i - 1] + prev.length();
                // normals and binormals
                // http://www.cs.cmu.edu/afs/andrew/scs/cs/15-462/web/old/asst2camera.html
                curTang = this._tangents[i];
                prevBinor = this._binormals[i - 1];
                this._normals[i] = Vector3.Cross(prevBinor, curTang);
                if (!this._raw) {
                    this._normals[i].normalize();
                }
                this._binormals[i] = Vector3.Cross(curTang, this._normals[i]);
                if (!this._raw) {
                    this._binormals[i].normalize();
                }
            }
        };
        // private function getFirstNonNullVector(index)
        // returns the first non null vector from index : curve[index + N].subtract(curve[index])
        Path3D.prototype._getFirstNonNullVector = function (index) {
            var i = 1;
            var nNVector = this._curve[index + i].subtract(this._curve[index]);
            while (nNVector.length() === 0 && index + i + 1 < this._curve.length) {
                i++;
                nNVector = this._curve[index + i].subtract(this._curve[index]);
            }
            return nNVector;
        };
        // private function getLastNonNullVector(index)
        // returns the last non null vector from index : curve[index].subtract(curve[index - N])
        Path3D.prototype._getLastNonNullVector = function (index) {
            var i = 1;
            var nLVector = this._curve[index].subtract(this._curve[index - i]);
            while (nLVector.length() === 0 && index > i + 1) {
                i++;
                nLVector = this._curve[index].subtract(this._curve[index - i]);
            }
            return nLVector;
        };
        // private function normalVector(v0, vt, va) :
        // returns an arbitrary point in the plane defined by the point v0 and the vector vt orthogonal to this plane
        // if va is passed, it returns the va projection on the plane orthogonal to vt at the point v0
        Path3D.prototype._normalVector = function (v0, vt, va) {
            var normal0;
            var tgl = vt.length();
            if (tgl === 0.0) {
                tgl = 1.0;
            }
            if (va === undefined || va === null) {
                var point;
                if (!BABYLON.Scalar.WithinEpsilon(Math.abs(vt.y) / tgl, 1.0, BABYLON.Epsilon)) {
                    point = new Vector3(0.0, -1.0, 0.0);
                }
                else if (!BABYLON.Scalar.WithinEpsilon(Math.abs(vt.x) / tgl, 1.0, BABYLON.Epsilon)) {
                    point = new Vector3(1.0, 0.0, 0.0);
                }
                else if (!BABYLON.Scalar.WithinEpsilon(Math.abs(vt.z) / tgl, 1.0, BABYLON.Epsilon)) {
                    point = new Vector3(0.0, 0.0, 1.0);
                }
                else {
                    point = Vector3.Zero();
                }
                normal0 = Vector3.Cross(vt, point);
            }
            else {
                normal0 = Vector3.Cross(vt, va);
                Vector3.CrossToRef(normal0, vt, normal0);
            }
            normal0.normalize();
            return normal0;
        };
        return Path3D;
    }());
    BABYLON.Path3D = Path3D;
    var Curve3 = /** @class */ (function () {
        /**
         * A Curve3 object is a logical object, so not a mesh, to handle curves in the 3D geometric space.
         * A Curve3 is designed from a series of successive Vector3.
         * Tuto : http://doc.babylonjs.com/tutorials/How_to_use_Curve3#curve3-object
         */
        function Curve3(points) {
            this._length = 0.0;
            this._points = points;
            this._length = this._computeLength(points);
        }
        /**
         * Returns a Curve3 object along a Quadratic Bezier curve : http://doc.babylonjs.com/tutorials/How_to_use_Curve3#quadratic-bezier-curve
         * @param v0 (Vector3) the origin point of the Quadratic Bezier
         * @param v1 (Vector3) the control point
         * @param v2 (Vector3) the end point of the Quadratic Bezier
         * @param nbPoints (integer) the wanted number of points in the curve
         */
        Curve3.CreateQuadraticBezier = function (v0, v1, v2, nbPoints) {
            nbPoints = nbPoints > 2 ? nbPoints : 3;
            var bez = new Array();
            var equation = function (t, val0, val1, val2) {
                var res = (1.0 - t) * (1.0 - t) * val0 + 2.0 * t * (1.0 - t) * val1 + t * t * val2;
                return res;
            };
            for (var i = 0; i <= nbPoints; i++) {
                bez.push(new Vector3(equation(i / nbPoints, v0.x, v1.x, v2.x), equation(i / nbPoints, v0.y, v1.y, v2.y), equation(i / nbPoints, v0.z, v1.z, v2.z)));
            }
            return new Curve3(bez);
        };
        /**
         * Returns a Curve3 object along a Cubic Bezier curve : http://doc.babylonjs.com/tutorials/How_to_use_Curve3#cubic-bezier-curve
         * @param v0 (Vector3) the origin point of the Cubic Bezier
         * @param v1 (Vector3) the first control point
         * @param v2 (Vector3) the second control point
         * @param v3 (Vector3) the end point of the Cubic Bezier
         * @param nbPoints (integer) the wanted number of points in the curve
         */
        Curve3.CreateCubicBezier = function (v0, v1, v2, v3, nbPoints) {
            nbPoints = nbPoints > 3 ? nbPoints : 4;
            var bez = new Array();
            var equation = function (t, val0, val1, val2, val3) {
                var res = (1.0 - t) * (1.0 - t) * (1.0 - t) * val0 + 3.0 * t * (1.0 - t) * (1.0 - t) * val1 + 3.0 * t * t * (1.0 - t) * val2 + t * t * t * val3;
                return res;
            };
            for (var i = 0; i <= nbPoints; i++) {
                bez.push(new Vector3(equation(i / nbPoints, v0.x, v1.x, v2.x, v3.x), equation(i / nbPoints, v0.y, v1.y, v2.y, v3.y), equation(i / nbPoints, v0.z, v1.z, v2.z, v3.z)));
            }
            return new Curve3(bez);
        };
        /**
         * Returns a Curve3 object along a Hermite Spline curve : http://doc.babylonjs.com/tutorials/How_to_use_Curve3#hermite-spline
         * @param p1 (Vector3) the origin point of the Hermite Spline
         * @param t1 (Vector3) the tangent vector at the origin point
         * @param p2 (Vector3) the end point of the Hermite Spline
         * @param t2 (Vector3) the tangent vector at the end point
         * @param nbPoints (integer) the wanted number of points in the curve
         */
        Curve3.CreateHermiteSpline = function (p1, t1, p2, t2, nbPoints) {
            var hermite = new Array();
            var step = 1.0 / nbPoints;
            for (var i = 0; i <= nbPoints; i++) {
                hermite.push(Vector3.Hermite(p1, t1, p2, t2, i * step));
            }
            return new Curve3(hermite);
        };
        /**
         * Returns a Curve3 object along a CatmullRom Spline curve :
         * @param points (array of Vector3) the points the spline must pass through. At least, four points required.
         * @param nbPoints (integer) the wanted number of points between each curve control points.
         */
        Curve3.CreateCatmullRomSpline = function (points, nbPoints) {
            var totalPoints = new Array();
            totalPoints.push(points[0].clone());
            Array.prototype.push.apply(totalPoints, points);
            totalPoints.push(points[points.length - 1].clone());
            var catmullRom = new Array();
            var step = 1.0 / nbPoints;
            var amount = 0.0;
            for (var i = 0; i < totalPoints.length - 3; i++) {
                amount = 0;
                for (var c = 0; c < nbPoints; c++) {
                    catmullRom.push(Vector3.CatmullRom(totalPoints[i], totalPoints[i + 1], totalPoints[i + 2], totalPoints[i + 3], amount));
                    amount += step;
                }
            }
            i--;
            catmullRom.push(Vector3.CatmullRom(totalPoints[i], totalPoints[i + 1], totalPoints[i + 2], totalPoints[i + 3], amount));
            return new Curve3(catmullRom);
        };
        /**
         * Returns the Curve3 stored array of successive Vector3
         */
        Curve3.prototype.getPoints = function () {
            return this._points;
        };
        /**
         * Returns the computed length (float) of the curve.
         */
        Curve3.prototype.length = function () {
            return this._length;
        };
        /**
         * Returns a new instance of Curve3 object : var curve = curveA.continue(curveB);
         * This new Curve3 is built by translating and sticking the curveB at the end of the curveA.
         * curveA and curveB keep unchanged.
         */
        Curve3.prototype.continue = function (curve) {
            var lastPoint = this._points[this._points.length - 1];
            var continuedPoints = this._points.slice();
            var curvePoints = curve.getPoints();
            for (var i = 1; i < curvePoints.length; i++) {
                continuedPoints.push(curvePoints[i].subtract(curvePoints[0]).add(lastPoint));
            }
            var continuedCurve = new Curve3(continuedPoints);
            return continuedCurve;
        };
        Curve3.prototype._computeLength = function (path) {
            var l = 0;
            for (var i = 1; i < path.length; i++) {
                l += (path[i].subtract(path[i - 1])).length();
            }
            return l;
        };
        return Curve3;
    }());
    BABYLON.Curve3 = Curve3;
    // Vertex formats
    var PositionNormalVertex = /** @class */ (function () {
        function PositionNormalVertex(position, normal) {
            if (position === void 0) { position = Vector3.Zero(); }
            if (normal === void 0) { normal = Vector3.Up(); }
            this.position = position;
            this.normal = normal;
        }
        PositionNormalVertex.prototype.clone = function () {
            return new PositionNormalVertex(this.position.clone(), this.normal.clone());
        };
        return PositionNormalVertex;
    }());
    BABYLON.PositionNormalVertex = PositionNormalVertex;
    var PositionNormalTextureVertex = /** @class */ (function () {
        function PositionNormalTextureVertex(position, normal, uv) {
            if (position === void 0) { position = Vector3.Zero(); }
            if (normal === void 0) { normal = Vector3.Up(); }
            if (uv === void 0) { uv = Vector2.Zero(); }
            this.position = position;
            this.normal = normal;
            this.uv = uv;
        }
        PositionNormalTextureVertex.prototype.clone = function () {
            return new PositionNormalTextureVertex(this.position.clone(), this.normal.clone(), this.uv.clone());
        };
        return PositionNormalTextureVertex;
    }());
    BABYLON.PositionNormalTextureVertex = PositionNormalTextureVertex;
    // Temporary pre-allocated objects for engine internal use
    // usage in any internal function :
    // var tmp = Tmp.Vector3[0];   <= gets access to the first pre-created Vector3
    // There's a Tmp array per object type : int, float, Vector2, Vector3, Vector4, Quaternion, Matrix
    var Tmp = /** @class */ (function () {
        function Tmp() {
        }
        Tmp.Color3 = [Color3.Black(), Color3.Black(), Color3.Black()];
        Tmp.Vector2 = [Vector2.Zero(), Vector2.Zero(), Vector2.Zero()]; // 3 temp Vector2 at once should be enough
        Tmp.Vector3 = [Vector3.Zero(), Vector3.Zero(), Vector3.Zero(),
            Vector3.Zero(), Vector3.Zero(), Vector3.Zero(), Vector3.Zero(), Vector3.Zero(), Vector3.Zero()]; // 9 temp Vector3 at once should be enough
        Tmp.Vector4 = [Vector4.Zero(), Vector4.Zero(), Vector4.Zero()]; // 3 temp Vector4 at once should be enough
        Tmp.Quaternion = [Quaternion.Zero(), Quaternion.Zero()]; // 2 temp Quaternion at once should be enough
        Tmp.Matrix = [Matrix.Zero(), Matrix.Zero(),
            Matrix.Zero(), Matrix.Zero(),
            Matrix.Zero(), Matrix.Zero(),
            Matrix.Zero(), Matrix.Zero()]; // 6 temp Matrices at once should be enough
        return Tmp;
    }());
    BABYLON.Tmp = Tmp;
    // Same as Tmp but not exported to keep it onyl for math functions to avoid conflicts
    var MathTmp = /** @class */ (function () {
        function MathTmp() {
        }
        MathTmp.Vector3 = [Vector3.Zero()];
        MathTmp.Matrix = [Matrix.Zero(), Matrix.Zero()];
        MathTmp.Quaternion = [Quaternion.Zero()];
        return MathTmp;
    }());
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.math.js.map
