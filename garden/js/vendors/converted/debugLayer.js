(function (LIB) {
    // load the inspector using require, if not present in the global namespace.
    var DebugLayer = /** @class */ (function () {
        function DebugLayer(scene) {
            this.BJSINSPECTOR = typeof INSPECTOR !== 'undefined' ? INSPECTOR : undefined;
            this._scene = scene;
            // load inspector using require, if it doesn't exist on the global namespace.
        }
        /** Creates the inspector window. */
        DebugLayer.prototype._createInspector = function (config) {
            if (config === void 0) { config = {}; }
            var popup = config.popup || false;
            var initialTab = config.initialTab || 0;
            var parentElement = config.parentElement || null;
            if (!this._inspector) {
                this.BJSINSPECTOR = this.BJSINSPECTOR || typeof INSPECTOR !== 'undefined' ? INSPECTOR : undefined;
                this._inspector = new this.BJSINSPECTOR.Inspector(this._scene, popup, initialTab, parentElement, config.newColors);
            } // else nothing to do,; instance is already existing
        };
        DebugLayer.prototype.isVisible = function () {
            if (!this._inspector) {
                return false;
            }
            return true;
        };
        DebugLayer.prototype.hide = function () {
            if (this._inspector) {
                try {
                    this._inspector.dispose();
                }
                catch (e) {
                    // If the inspector has been removed directly from the inspector tool
                }
                this._inspector = null;
            }
        };
        DebugLayer.prototype.show = function (config) {
            if (config === void 0) { config = {}; }
            if (typeof this.BJSINSPECTOR == 'undefined') {
                // Load inspector and add it to the DOM
                LIB.Tools.LoadScript(DebugLayer.InspectorURL, this._createInspector.bind(this, config));
            }
            else {
                // Otherwise creates the inspector
                this._createInspector(config);
            }
        };
        DebugLayer.InspectorURL = 'https://preview.LIBjs.com/inspector/LIB.inspector.bundle.js';
        return DebugLayer;
    }());
    LIB.DebugLayer = DebugLayer;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.debugLayer.js.map
