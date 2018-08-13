

var LIB;
(function (LIB) {
    var SmartArray = /** @class */ (function () {
        function SmartArray(capacity) {
            this.length = 0;
            this.data = new Array(capacity);
            this._id = SmartArray._GlobalId++;
        }
        SmartArray.prototype.push = function (value) {
            this.data[this.length++] = value;
            if (this.length > this.data.length) {
                this.data.length *= 2;
            }
        };
        SmartArray.prototype.forEach = function (func) {
            for (var index = 0; index < this.length; index++) {
                func(this.data[index]);
            }
        };
        SmartArray.prototype.sort = function (compareFn) {
            this.data.sort(compareFn);
        };
        SmartArray.prototype.reset = function () {
            this.length = 0;
        };
        SmartArray.prototype.dispose = function () {
            this.reset();
            if (this.data) {
                this.data.length = 0;
                this.data = [];
            }
        };
        SmartArray.prototype.concat = function (array) {
            if (array.length === 0) {
                return;
            }
            if (this.length + array.length > this.data.length) {
                this.data.length = (this.length + array.length) * 2;
            }
            for (var index = 0; index < array.length; index++) {
                this.data[this.length++] = (array.data || array)[index];
            }
        };
        SmartArray.prototype.indexOf = function (value) {
            var position = this.data.indexOf(value);
            if (position >= this.length) {
                return -1;
            }
            return position;
        };
        SmartArray.prototype.contains = function (value) {
            return this.data.indexOf(value) !== -1;
        };
        // Statics
        SmartArray._GlobalId = 0;
        return SmartArray;
    }());
    LIB.SmartArray = SmartArray;
    var SmartArrayNoDuplicate = /** @class */ (function (_super) {
        __extends(SmartArrayNoDuplicate, _super);
        function SmartArrayNoDuplicate() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._duplicateId = 0;
            return _this;
        }
        SmartArrayNoDuplicate.prototype.push = function (value) {
            _super.prototype.push.call(this, value);
            if (!value.__smartArrayFlags) {
                value.__smartArrayFlags = {};
            }
            value.__smartArrayFlags[this._id] = this._duplicateId;
        };
        SmartArrayNoDuplicate.prototype.pushNoDuplicate = function (value) {
            if (value.__smartArrayFlags && value.__smartArrayFlags[this._id] === this._duplicateId) {
                return false;
            }
            this.push(value);
            return true;
        };
        SmartArrayNoDuplicate.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this._duplicateId++;
        };
        SmartArrayNoDuplicate.prototype.concatWithNoDuplicate = function (array) {
            if (array.length === 0) {
                return;
            }
            if (this.length + array.length > this.data.length) {
                this.data.length = (this.length + array.length) * 2;
            }
            for (var index = 0; index < array.length; index++) {
                var item = (array.data || array)[index];
                this.pushNoDuplicate(item);
            }
        };
        return SmartArrayNoDuplicate;
    }(SmartArray));
    LIB.SmartArrayNoDuplicate = SmartArrayNoDuplicate;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.smartArray.js.map
//# sourceMappingURL=LIB.smartArray.js.map
