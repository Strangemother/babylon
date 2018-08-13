

var LIB;
(function (LIB) {
    var PointerEventTypes = /** @class */ (function () {
        function PointerEventTypes() {
        }
        Object.defineProperty(PointerEventTypes, "POINTERDOWN", {
            get: function () {
                return PointerEventTypes._POINTERDOWN;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointerEventTypes, "POINTERUP", {
            get: function () {
                return PointerEventTypes._POINTERUP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointerEventTypes, "POINTERMOVE", {
            get: function () {
                return PointerEventTypes._POINTERMOVE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointerEventTypes, "POINTERWHEEL", {
            get: function () {
                return PointerEventTypes._POINTERWHEEL;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointerEventTypes, "POINTERPICK", {
            get: function () {
                return PointerEventTypes._POINTERPICK;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointerEventTypes, "POINTERTAP", {
            get: function () {
                return PointerEventTypes._POINTERTAP;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PointerEventTypes, "POINTERDOUBLETAP", {
            get: function () {
                return PointerEventTypes._POINTERDOUBLETAP;
            },
            enumerable: true,
            configurable: true
        });
        PointerEventTypes._POINTERDOWN = 0x01;
        PointerEventTypes._POINTERUP = 0x02;
        PointerEventTypes._POINTERMOVE = 0x04;
        PointerEventTypes._POINTERWHEEL = 0x08;
        PointerEventTypes._POINTERPICK = 0x10;
        PointerEventTypes._POINTERTAP = 0x20;
        PointerEventTypes._POINTERDOUBLETAP = 0x40;
        return PointerEventTypes;
    }());
    LIB.PointerEventTypes = PointerEventTypes;
    var PointerInfoBase = /** @class */ (function () {
        function PointerInfoBase(type, event) {
            this.type = type;
            this.event = event;
        }
        return PointerInfoBase;
    }());
    LIB.PointerInfoBase = PointerInfoBase;
    /**
     * This class is used to store pointer related info for the onPrePointerObservable event.
     * Set the skipOnPointerObservable property to true if you want the engine to stop any process after this event is triggered, even not calling onPointerObservable
     */
    var PointerInfoPre = /** @class */ (function (_super) {
        __extends(PointerInfoPre, _super);
        function PointerInfoPre(type, event, localX, localY) {
            var _this = _super.call(this, type, event) || this;
            _this.skipOnPointerObservable = false;
            _this.localPosition = new LIB.Vector2(localX, localY);
            return _this;
        }
        return PointerInfoPre;
    }(PointerInfoBase));
    LIB.PointerInfoPre = PointerInfoPre;
    /**
     * This type contains all the data related to a pointer event in LIB.js.
     * The event member is an instance of PointerEvent for all types except PointerWheel and is of type MouseWheelEvent when type equals PointerWheel. The different event types can be found in the PointerEventTypes class.
     */
    var PointerInfo = /** @class */ (function (_super) {
        __extends(PointerInfo, _super);
        function PointerInfo(type, event, pickInfo) {
            var _this = _super.call(this, type, event) || this;
            _this.pickInfo = pickInfo;
            return _this;
        }
        return PointerInfo;
    }(PointerInfoBase));
    LIB.PointerInfo = PointerInfo;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.pointerEvents.js.map
//# sourceMappingURL=LIB.pointerEvents.js.map
