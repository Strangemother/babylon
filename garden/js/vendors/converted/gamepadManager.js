
var LIB;
(function (LIB) {
    var GamepadManager = /** @class */ (function () {
        function GamepadManager(_scene) {
            var _this = this;
            this._scene = _scene;
            this._LIBGamepads = [];
            this._oneGamepadConnected = false;
            this._isMonitoring = false;
            this.onGamepadDisconnectedObservable = new LIB.Observable();
            if (!LIB.Tools.IsWindowObjectExist()) {
                this._gamepadEventSupported = false;
            }
            else {
                this._gamepadEventSupported = 'GamepadEvent' in window;
                this._gamepadSupport = (navigator.getGamepads ||
                    navigator.webkitGetGamepads || navigator.msGetGamepads || navigator.webkitGamepads);
            }
            this.onGamepadConnectedObservable = new LIB.Observable(function (observer) {
                // This will be used to raise the onGamepadConnected for all gamepads ALREADY connected
                for (var i in _this._LIBGamepads) {
                    var gamepad = _this._LIBGamepads[i];
                    if (gamepad && gamepad._isConnected) {
                        _this.onGamepadConnectedObservable.notifyObserver(observer, gamepad);
                    }
                }
            });
            this._onGamepadConnectedEvent = function (evt) {
                var gamepad = evt.gamepad;
                if (gamepad.index in _this._LIBGamepads) {
                    if (_this._LIBGamepads[gamepad.index].isConnected) {
                        return;
                    }
                }
                var newGamepad;
                if (_this._LIBGamepads[gamepad.index]) {
                    newGamepad = _this._LIBGamepads[gamepad.index];
                    newGamepad.browserGamepad = gamepad;
                    newGamepad._isConnected = true;
                }
                else {
                    newGamepad = _this._addNewGamepad(gamepad);
                }
                _this.onGamepadConnectedObservable.notifyObservers(newGamepad);
                _this._startMonitoringGamepads();
            };
            this._onGamepadDisconnectedEvent = function (evt) {
                var gamepad = evt.gamepad;
                // Remove the gamepad from the list of gamepads to monitor.
                for (var i in _this._LIBGamepads) {
                    if (_this._LIBGamepads[i].index === gamepad.index) {
                        var disconnectedGamepad = _this._LIBGamepads[i];
                        disconnectedGamepad._isConnected = false;
                        _this.onGamepadDisconnectedObservable.notifyObservers(disconnectedGamepad);
                        break;
                    }
                }
            };
            if (this._gamepadSupport) {
                //first add already-connected gamepads
                this._updateGamepadObjects();
                if (this._LIBGamepads.length) {
                    this._startMonitoringGamepads();
                }
                // Checking if the gamepad connected event is supported (like in Firefox)
                if (this._gamepadEventSupported) {
                    window.addEventListener('gamepadconnected', this._onGamepadConnectedEvent, false);
                    window.addEventListener('gamepaddisconnected', this._onGamepadDisconnectedEvent, false);
                }
                else {
                    this._startMonitoringGamepads();
                }
            }
        }
        Object.defineProperty(GamepadManager.prototype, "gamepads", {
            get: function () {
                return this._LIBGamepads;
            },
            enumerable: true,
            configurable: true
        });
        GamepadManager.prototype.getGamepadByType = function (type) {
            if (type === void 0) { type = LIB.Gamepad.XBOX; }
            for (var _i = 0, _a = this._LIBGamepads; _i < _a.length; _i++) {
                var gamepad = _a[_i];
                if (gamepad && gamepad.type === type) {
                    return gamepad;
                }
            }
            return null;
        };
        GamepadManager.prototype.dispose = function () {
            if (this._gamepadEventSupported) {
                if (this._onGamepadConnectedEvent) {
                    window.removeEventListener('gamepadconnected', this._onGamepadConnectedEvent);
                }
                if (this._onGamepadDisconnectedEvent) {
                    window.removeEventListener('gamepaddisconnected', this._onGamepadDisconnectedEvent);
                }
                this._onGamepadConnectedEvent = null;
                this._onGamepadDisconnectedEvent = null;
            }
            this._LIBGamepads.forEach(function (gamepad) {
                gamepad.dispose();
            });
            this.onGamepadConnectedObservable.clear();
            this.onGamepadDisconnectedObservable.clear();
            this._oneGamepadConnected = false;
            this._stopMonitoringGamepads();
            this._LIBGamepads = [];
        };
        GamepadManager.prototype._addNewGamepad = function (gamepad) {
            if (!this._oneGamepadConnected) {
                this._oneGamepadConnected = true;
            }
            var newGamepad;
            var xboxOne = (gamepad.id.search("Xbox One") !== -1);
            if (xboxOne || gamepad.id.search("Xbox 360") !== -1 || gamepad.id.search("xinput") !== -1) {
                newGamepad = new LIB.Xbox360Pad(gamepad.id, gamepad.index, gamepad, xboxOne);
            }
            // if pose is supported, use the (WebVR) pose enabled controller
            else if (gamepad.pose) {
                newGamepad = LIB.PoseEnabledControllerHelper.InitiateController(gamepad);
            }
            else {
                newGamepad = new LIB.GenericPad(gamepad.id, gamepad.index, gamepad);
            }
            this._LIBGamepads[newGamepad.index] = newGamepad;
            return newGamepad;
        };
        GamepadManager.prototype._startMonitoringGamepads = function () {
            if (!this._isMonitoring) {
                this._isMonitoring = true;
                //back-comp
                if (!this._scene) {
                    this._checkGamepadsStatus();
                }
            }
        };
        GamepadManager.prototype._stopMonitoringGamepads = function () {
            this._isMonitoring = false;
        };
        GamepadManager.prototype._checkGamepadsStatus = function () {
            var _this = this;
            // Hack to be compatible Chrome
            this._updateGamepadObjects();
            for (var i in this._LIBGamepads) {
                var gamepad = this._LIBGamepads[i];
                if (!gamepad || !gamepad.isConnected) {
                    continue;
                }
                gamepad.update();
            }
            if (this._isMonitoring && !this._scene) {
                LIB.Tools.QueueNewFrame(function () { _this._checkGamepadsStatus(); });
            }
        };
        // This function is called only on Chrome, which does not properly support
        // connection/disconnection events and forces you to recopy again the gamepad object
        GamepadManager.prototype._updateGamepadObjects = function () {
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
            for (var i = 0; i < gamepads.length; i++) {
                var gamepad = gamepads[i];
                if (gamepad) {
                    if (!this._LIBGamepads[gamepad.index]) {
                        var newGamepad = this._addNewGamepad(gamepad);
                        this.onGamepadConnectedObservable.notifyObservers(newGamepad);
                    }
                    else {
                        // Forced to copy again this object for Chrome for unknown reason
                        this._LIBGamepads[i].browserGamepad = gamepad;
                        if (!this._LIBGamepads[i].isConnected) {
                            this._LIBGamepads[i]._isConnected = true;
                            this.onGamepadConnectedObservable.notifyObservers(this._LIBGamepads[i]);
                        }
                    }
                }
            }
        };
        return GamepadManager;
    }());
    LIB.GamepadManager = GamepadManager;
})(LIB || (LIB = {}));

//# sourceMappingURL=LIB.gamepadManager.js.map
//# sourceMappingURL=LIB.gamepadManager.js.map
