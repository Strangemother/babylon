
var LIB;
(function (LIB) {
    /**
     * Internal class used by the engine to get list of {LIB.InternalTexture} already bound to the GL context
     */
    var DummyInternalTextureTracker = /** @class */ (function () {
        function DummyInternalTextureTracker() {
            /**
             * Gets or set the previous tracker in the list
             */
            this.previous = null;
            /**
             * Gets or set the next tracker in the list
             */
            this.next = null;
        }
        return DummyInternalTextureTracker;
    }());
    LIB.DummyInternalTextureTracker = DummyInternalTextureTracker;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.internalTextureTracker.js.map
//# sourceMappingURL=LIB.internalTextureTracker.js.map
