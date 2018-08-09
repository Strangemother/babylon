var BABYLON;
(function (BABYLON) {
    var KeyboardEventTypes = /** @class */ (function () {
        function KeyboardEventTypes() {
        }
        Object.defineProperty(KeyboardEventTypes, "KEYDOWN", {
            get: function () {
                return KeyboardEventTypes._KEYDOWN;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KeyboardEventTypes, "KEYUP", {
            get: function () {
                return KeyboardEventTypes._KEYUP;
            },
            enumerable: true,
            configurable: true
        });
        KeyboardEventTypes._KEYDOWN = 0x01;
        KeyboardEventTypes._KEYUP = 0x02;
        return KeyboardEventTypes;
    }());
    BABYLON.KeyboardEventTypes = KeyboardEventTypes;
    var KeyboardInfo = /** @class */ (function () {
        function KeyboardInfo(type, event) {
            this.type = type;
            this.event = event;
        }
        return KeyboardInfo;
    }());
    BABYLON.KeyboardInfo = KeyboardInfo;
    /**
     * This class is used to store keyboard related info for the onPreKeyboardObservable event.
     * Set the skipOnKeyboardObservable property to true if you want the engine to stop any process after this event is triggered, even not calling onKeyboardObservable
     */
    var KeyboardInfoPre = /** @class */ (function (_super) {
        __extends(KeyboardInfoPre, _super);
        function KeyboardInfoPre(type, event) {
            var _this = _super.call(this, type, event) || this;
            _this.skipOnPointerObservable = false;
            return _this;
        }
        return KeyboardInfoPre;
    }(KeyboardInfo));
    BABYLON.KeyboardInfoPre = KeyboardInfoPre;
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.keyboardEvents.js.map
